// App.js

import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Platform } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = useState();
  const event = 1721402010 * 1000
  const cunt = 1721395979 * 1000
  const fetchNTPTime = async () => {
    try {
      // Use an NTP time API endpoint to get the current time
      const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
      const data = await response.json();
      const ntpTime = new Date(data.unixtime * 1000).getTime(); // Convert Unix time to milliseconds
      const serverTime = new Date(data.datetime).getTime(); // Current server time
      const offset = serverTime - ntpTime; // Calculate offset
      return [ntpTime, offset];
    } catch (error) {
      console.error("Failed to fetch NTP time:", error);
      return [null, null];
    }
  };
  async function playSound() {
 
    const time  = new Date().getTime()
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'https://onlinetestcase.com/wp-content/uploads/2023/06/1-MB-MP3.mp3' }
    );

    setSound(sound);


    const timeE  = new Date().getTime()
    const dede = timeE - time
      
      
    if(Platform.OS == 'ios'){
      await sound.playAsync();
    }else{
      setTimeout(async () => {
        await sound.playAsync();
      }, 500 );
    }

    
  }
  useEffect(() => {
    (async () => {
      
      const dely  = new Date().getTime()
    
      // Fetch the NTP time and calculate the offset
      const [ntpTime, offset] = await fetchNTPTime();
      if (ntpTime) {
      
        const adjustedEventTime =event - offset;
        
        
        const timeLeft = adjustedEventTime - ntpTime;
          

        if (timeLeft > 0) {
          
         setTimeout(() => {
            
          finish(dely,timeLeft)
           
         }, timeLeft);
        }
      }
    })();
  }, []);
  const finish= async (dely,target)=>{
  
      const fi=  new Date().getTime()
      const timesss =fi-dely 
      const estimatedLatency =timesss ;
      const time =event -(dely-estimatedLatency)
      if (dely) {
       
          
        const check = Math.round(10000-(time/10)); 
          
        setTimeout(() => {
          playSound()
        }, (check));
      }

   
  }
  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
                                                                                                                                                                                        