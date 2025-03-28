import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  useWindowDimensions,
  Modal,
  AppState,
  BackHandler,
  Platform,
} from "react-native";
import Lyrics from "../../../Components/chantc/Lyrics";
import PlayButton from "../../../Components/chantc/PlayButton";
import ProgressBar from "../../../Components/chantc/ProgressBar";
import TimeStamps from "../../../Components/chantc/TimeStamps";
import LyricsData from "../../../Components/chantc/lyricsData.json";
import {
  SendDelay,
  SendPlayMusic,
  addStartPlaybackListener,
  phoneConnected,
  readyConnect,
  startConnection,
  startConnectionCheck,
  stopConnection,
} from "../../../core/SignalRClient";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../../../Constants";
import { EventContext } from "../../../Servise/Events/eventContaxt";
import {
  KeepAwake,
  activateKeepAwake,
  activateKeepAwakeAsync,
  deactivateKeepAwake,
  useKeepAwake,
} from "expo-keep-awake";

import { SONG_BG_COLOR, THRESHOLD } from "../../../Components/chantc/constants";
import { ImageBackground } from "react-native";
import TimerComponent from "../../../Components/timer/TimerComponent";
import { Audio, InterruptionModeIOS } from "expo-av";
import ProgressBarTwo from "../../../Components/chantc/ProgressBarTwo";
import ProgressBarTree from "../../../Components/chantc/ProgressBarTree";
import SignalRContext from "../../../Servise/Sinal/SignalRContext";
import TimeDisplay from "../../../Components/timer/TimeDisplay";
import Torch from "react-native-torch";
import { getAlldely } from "@/core/save";

export default function LyricsPageTest({ navigation, route }) {
  const {
    fetchSetUserChantLog,
    timer,
    currentTime,
    fetchTime,
    chantContentLive,
    fetchgetChantContent,
    fetchChantEventsData,
    setFlagEnterScreen,
    chantContent,
    setShowTabrik
  } = useContext(EventContext);
  const { runTimeer, rnPlay, repPlay, showPlay,uriMp3 } = useContext(SignalRContext);

  const receivedData = route.params?.data || null;
  const [isTime, setTime] = useState(true);
  const { data } = route.params || {};
  
  const [durationMillis, setDurationMillis] = useState(0);
  const [position, setPosition] = useState(true);
  const [playLight, setPlayLight] = useState(false);
  const [timeToPlayMusic, setTimeToPlayMusic] = useState(false);

  const { height } = useWindowDimensions();
  const seekTime = useSharedValue(0);
  const halfScrollComponentHeight = 0.3 * height;

  const [heights, setHeights] = useState<number[]>(new Array(chantContent?.chant_Lyric_List.length).fill(30));
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inActive, setIsInActive] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [delayPlayMusic, setDelayPlayMusic] = useState(0);

  let isPlayNew = false;
  useEffect(() => {
    if (timeToPlayMusic) {
      setTime(false);
      getAlldely().then(res =>{
     
        const Plt =res
        setTimeout(() => {
          playAudio();
        },3900- Plt);
      })
     
      
      
    }
  }, [timeToPlayMusic]);
  useEffect(() => {
    const backAction = () => {
    
      // Your custom function or logic here
      // For example, you can navigate to another screen, show a confirmation dialog, etc.
      // Return true to prevent default behavior (exiting the app)
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []); 
  useEffect(() => {
    if (showPlay) {
      setTime(false);

      // Handle the reconnection message received from the server
    }
    async function loadAudio() {
      try {
        console.log("sound", "sound");
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          shouldDuckAndroid: false,
          staysActiveInBackground: false,
          playThroughEarpieceAndroid: true,
        });
        const audioUrl = chantContent?.chant_Audio_List[0]?.fileUrl.replace(/^https:/, 'http:');
        console.log(audioUrl);


        const { sound, status } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false },
          updatePlaybackStatus
        );

        setSound(sound);
        setDurationMillis(status.durationMillis || 0);
        setTimeout(() => {
          toggleMute();
        }, 5000);

        // Access duration from status            setIsLoading(false);
      } catch (error) {
        console.error("Error loading audio:", error);

        // Retry loading audio after a delay (e.g., 3 seconds)
        setTimeout(() => {
          setRetryAttempts(retryAttempts + 1);
          loadAudio();
        }, 3000);
      }
    }

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [showPlay]);
  const toggleMute = async () => {
    if (sound) {
      const dateStartIsMutedAsync = new Date().getTime();
      await sound.setIsMutedAsync(true);
      await sound.playAsync();
      const dateEndIsMutedAsync = new Date().getTime();
      setDelayPlayMusic(dateEndIsMutedAsync - dateStartIsMutedAsync);
      setTimeout(async () => {
        await sound.stopAsync();
      }, 10000);
    }
  };
  useEffect(() => {
    async function loadAudio() {
      try {
        console.log("sound", "sound");
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          shouldDuckAndroid: false,
          
          staysActiveInBackground: false,
          playThroughEarpieceAndroid: true,
        });
        const audioUrl = chantContent?.chant_Audio_List[0]?.fileUrl
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false },
          updatePlaybackStatus
        );

        setSound(sound);
        setDurationMillis(status.durationMillis || 0);
        setTimeout(() => {
          toggleMute();
        }, 5000);
        // Access duration from status            setIsLoading(false);
      } catch (error) {
        console.error("Error loading audio:", error);
        if (retryAttempts < 50) {
          // Retry loading audio after a delay (e.g., 3 seconds)
          setTimeout(() => {
            setRetryAttempts(retryAttempts + 1);
            loadAudio();
          }, 3000);
        } else {
          // Display an error message or handle the failure as needed
          setIsLoading(false);
        }
      }
    }

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [retryAttempts]);

  const updatePlaybackStatus = (status) => {
    if (status) {
      setDurationMillis(status?.durationMillis);
      setPosition(status?.positionMillis);
      if (status.didJustFinish) {
        // Audio has finished playi 0--0] y 0ng, navigate back
        if (Platform.OS!= "ios") {
          Torch.switchState(false);
        }
        fetchSetUserChantLog(
          chantContentLive?.chantId,
          chantContentLive?.eventChantId,
          true
        );
        fetchChantEventsData();
        setShowTabrik(true)
        navigation.replace("Tabs");
        setFlagEnterScreen(true);
        setPlayLight(false);

        setSound(null);
       
        
      }
    }
  };
  const lyricsScrollValue = useDerivedValue(() => {
    const sumOfHeights = (index: number) => {
      let sum = 0;
      for (let i = 0; i < index; ++i) {
        sum += heights[i];
      }
      return sum;
    };

    if (
      !chantContent?.chant_Lyric_List ||
      chantContent.chant_Lyric_List.length === 0
    ) {
      return 0;
    }

    const firstLyricStartTime = chantContent.chant_Lyric_List[0].startTime_ms;
    if (seekTime.value < firstLyricStartTime - THRESHOLD) {
      return 0;
    }

    // Don't go till last or the screen would be left empty
    for (
      let index = 1;
      index < chantContent.chant_Lyric_List.length - 1;
      index++
    ) {
      const currTime = chantContent.chant_Lyric_List[index].startTime_ms;
      const lastTime = chantContent.chant_Lyric_List[index - 1].startTime_ms;

      if (seekTime.value > lastTime && seekTime.value < currTime - THRESHOLD) {
        return sumOfHeights(index - 1);
      } else if (seekTime.value < currTime) {
        return withTiming(sumOfHeights(index), {
          duration: THRESHOLD,
          easing: Easing.quad,
        });
      }
    }

    return sumOfHeights(chantContent.chant_Lyric_List.length - 1);
  }, [heights]);

  const scrollViewStyle = useAnimatedStyle(() => {
    // In spotify the scroll happens only after half of the screen
    return {
      transform: [
        {
          translateY:
            lyricsScrollValue.value > halfScrollComponentHeight
              ? -lyricsScrollValue.value + halfScrollComponentHeight
              : 0,
        },
      ],
    };
  });

  const topGradientStyle = useAnimatedStyle(() => {
    if (lyricsScrollValue.value > halfScrollComponentHeight) {
      return {
        opacity: withTiming(1, {
          duration: 300,
        }),
      };
    }
    return {
      opacity: 0,
    };
  });

  // Function to stop song from playing

  useEffect(() => {
    // Check if all the heights are greater than zero or else quit early;
    for (let i = 0; i < heights.length; ++i) {
      if (heights[i] === 0) {
        return;
      }
    }
    console.log("Ready");
  }, [heights]);
  const repPlayAudio = async () => {
    if (sound) {
      await sound.playAsync();
      await sound.pauseAsync();
      seekTime.value = withTiming(durationMillis, {
        duration: durationMillis,
        easing: Easing.linear,
      });
    }
  };
  const playAudio = async () => {
    if (sound) {
    
        try {
          console.log("START", "MUSIC");
          setPlayLight(true);
          setIsPlaying(true);
          await sound.setIsMutedAsync(false);
          await sound.playAsync();
          seekTime.value = withTiming(durationMillis, {
            duration: durationMillis,
            easing: Easing.linear,
          });
        } catch (e) {
          console.log("ERROR", e);
        }
    
    } else {
      console.log("ERROR", "sound");
    }
  };

  let statusAppState = "";
  useEffect(() => {
    const handleAppStateChangetest = async (newState) => {
      console.log("newState",newState+"isPlaying "+isTime+" "+inActive);
      
        
         if (inActive === 'background'&&newState === 'active'&&!isTime) {
          await sound.stopAsync();
          setPlayLight(false);

          setFlagEnterScreen(true);
  
          setSound(null);
          setTimeout(() => {
            setShowTabrik(true)
            navigation.replace("Tabs");

          }, 1000);
          setTimeout(() => {
            setShowTabrik(true)
            navigation.replace("Tabs");

          }, 1500);
           // App is in the foreground
         } 
        
        setIsInActive(newState)
       };

    const subscription = AppState.addEventListener('change', handleAppStateChangetest);

    return () => {
      subscription.remove();
    };
  }, [navigation, isTime,inActive]);
  
  const handleReconnect = () => {
    let timeout = null;
  };
  // useEffect(() => {
  //   if(rnPlay){
  //    setTime(false)
  //   }

  // }, [rnPlay])
  const setTimerFinish = () => {
    setTimeToPlayMusic(true);
  };
  const CheckTime = ({ data }) => {
    return <></>;
  };
  return (
    <ImageBackground
      style={styles.container}
      source={require("../../../../assets/backchant.png")}
    >
      <StatusBar style="auto" />
      <View style={styles.songDetailsContainer}>
        <View style={styles.songNameContainer}>
          <Text style={styles.songName}>Club Football</Text>
          <Text style={styles.songAuthor}>{chantContent?.title}</Text>
        </View>
      </View>
      {/* <AnimatedLinearGradient
        colors={[SONG_BG_COLOR, "transparent"]}
        style={[styles.topGradientStyle, topGradientStyle]}
      /> */}
      <Animated.ScrollView
        style={styles.scrollvView}
        overScrollMode={"never"}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <Animated.View style={scrollViewStyle}>
          {chantContent?.chant_Lyric_List.map((line, index) => {
            return (
              <View
                key={`${line.startTime_ms}`}
                onLayout={(event) => {
                  const { height: layoutHeight } = event.nativeEvent.layout;
                  setHeights((prevHeights) => {
                    if (
                      !prevHeights[index] ||
                      prevHeights[index] !== layoutHeight
                    ) {
                      prevHeights[index] = layoutHeight;
                      return [...prevHeights];
                    } else {
                      return prevHeights;
                    }
                  });
                }}
              >
                <Lyrics data={line} seekTime={seekTime} />
              </View>
            );
          })}
          <View style={{ height: 0.3 * height }} />
        </Animated.View>
      </Animated.ScrollView>

      <View style={styles.bottomContainer}>
        <ProgressBarTree
          seekTime={seekTime}
          isPlaying={playLight}
          songLength={durationMillis}
          data={chantContent}
        />
        <ProgressBarTwo
          seekTime={seekTime}
          isPlaying={playLight}
          songLength={durationMillis}
          data={chantContent}
        />

        <TimeStamps seekTime={seekTime} dir={durationMillis} />
      </View>
      <Modal
        visible={isTime}
        style={{ width: `100%`, height: `100%` }}
        transparent
      >
        <>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: `100%`,
              height: `100%`,
              backgroundColor: isTime ? "#fff" : "transparent",
            }}
       
          >
            <ImageBackground
              source={require("../../../../assets/Footballfans.png")}
              style={{
                width: `100%`,
                height: 300,
                position:"absolute",
                bottom:0,
              
                paddingTop: 40,
              }}
            >
            </ImageBackground>
            
              <TimeDisplay
                totalSeconds={receivedData?.timeStart}
                dely={receivedData?.dateEnter}
                onFinish={() => setTimerFinish()}
                data={chantContent}
              />
              
          </View>
        </>
      </Modal>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
    padding: "5%",
  },
  scrollvView: {
    width: "100%",
    paddingHorizontal: "5%",
  },
  songDetailsContainer: {
    height: "20%",
    padding: "5%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  bottomContainer: {
    height: "20%",
    padding: "5%",
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flex: 1,
  },
  songNameContainer: {
    marginLeft: "5%",
    display: "flex",
  },
  songAuthor: {
    color: "white",
    paddingTop: 10,
    fontFamily: "Gotham-Book",
  },
  songName: {
    color: "white",
    fontFamily: "Gotham-Medium",
    fontSize: 18,
  },
  bottomGradientStyle: {
    height: "7%",
    position: "absolute",
    left: "5%",
    right: "5%",
    top: "76%",
  },
  topGradientStyle: {
    height: "7%",
    position: "absolute",
    left: "5%",
    right: "5%",
    top: "22%",
    zIndex: 2,
  },
});
