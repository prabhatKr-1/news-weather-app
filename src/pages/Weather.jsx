import React from "react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../main";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Weather() {
  const { setWeatherData, id } = useContext(AuthContext);
  const [userLocation, setUserLocation] = useState("in");
  useEffect(() => {
    const getUserLocation = async (uid) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const location = userData.location;
          setUserLocation(location);
        } else {
          console.log("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    if (id) {
      getUserLocation(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://weather-by-api-ninjas.p.rapidapi.com/v1/weather",
          params: { city: userLocation },
          headers: {
            "X-RapidAPI-Key":
              "2ba368e20cmshf4101ca963fff5fp1cb2a3jsn00cd1690c968",
            "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  return <div>Weather</div>;
}

export default Weather;
