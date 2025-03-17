import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Platform, AppState } from "react-native";
import axios from "axios";
import dayjs from "dayjs";
import BackgroundTimer from "react-native-background-timer";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "@/Constants";

const TimeDisplay = ({ totalSeconds, onFinish, data }) => {
  const [seconds, setSeconds] = useState(0);
  const [delay, setDelay] = useState(false);
  const fetchNTPTime = async () => {
    try {
      // Use an NTP time API endpoint to get the current time
      const response = await axios.get('https://timeapi.io/api/Time/current/zone?timeZone=Universal');
      console.log(response);
      
      
      const { datetime } = response.data;
      const { year, month, day, hour, minute, seconds, milliSeconds, timeZone } =
      response.data;

    // Create a new Date object with the provided components
    const ntpTime = new Date(
      Date.UTC(year, month-1 , day, hour, minute, seconds, milliSeconds)
    ).getTime();
    console.log(ntpTime);
    

    
      return [ntpTime, 0];
    } catch (error) {
      console.error("Failed to fetch NTP time:", error);
      return [null, null];
    }
  };
  useEffect(() => {
    
    (async () => {
      setTimeout(async () => {
        
    
      
      const dely  = new Date().getTime()
    
      // Fetch the NTP time and calculate the offset
      const [ntpTime, offset] = await fetchNTPTime();
      if (ntpTime) {
      
        const adjustedEventTime =data?.chantStartTime - offset;
        
        
        const timeLeft = adjustedEventTime - ntpTime;
        console.log("adjustedEvesntTime"+timeLeft);
        
       
        if (timeLeft > 0) {
     
     
         setTimeout(() => {
          console.log("FINISHHHHHHHHHHHHHHHHHHHHHHH");
          finish(dely,timeLeft)
           
         }, timeLeft);
         const round = Math.round((timeLeft/1000)-5)
         setSeconds(round)
         setTimeout(() => {
          setDelay(true);
          const interval = setInterval(() => {
            
            setSeconds((prevSeconds) => {
              
    
              if (prevSeconds <= 0) {
                clearInterval(interval);
                return 0;
              }
              return prevSeconds - 1;
            });
          }, 1000);
         }, 5000);
        }
      }
    }, 4000);
    })();
  }, []);
  const finish= async (dely,target)=>{
  
    const fi=  new Date().getTime()
    const timesss =fi-dely 
    const estimatedLatency =timesss ;
    const time =data?.chantStartTime -(dely-estimatedLatency)
    if (dely) {
     
      console.log("========>"+time);
      const check = Math.round(10000-(time/10)); 
      console.log("======check==>"+check);
      setTimeout(() => {
        onFinish()
      }, (check));
    }

 
}
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      const [ntpTime, offset] = await fetchNTPTime();
      if (ntpTime) {
      
        const adjustedEventTime =data?.chantStartTime - offset;
        
        
        const timeLeft = adjustedEventTime - ntpTime;
        console.log("adjustedEvesntTime"+timeLeft);
        
       
    
     
         const round = Math.round((timeLeft/1000)-1)
         setSeconds(round)
    
  }
      // Handle the app state change
      console.log('App State Changed:', nextAppState);
    };

    // Add event listener
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup the listener on component unmount
    return () => {
      appStateSubscription.remove();
    };
  }, []);

  
  return (
    <View style={styles.container}>
      {delay ? (
        <Text style={styles.time}>
          {minutes.toString().padStart(2, "0")}:
          {remainingSeconds.toString().padStart(2, "0")}
        </Text>
      ) : (
        <Text style={styles.time}>{"Please wait"}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 70,
    color:Colors.platform.android.primary,
  
  
  },
});

export default TimeDisplay;
