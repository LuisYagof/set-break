import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { type Timer } from "@/types/common.types";

export default function Countdown() {
  const params = useLocalSearchParams();
  const timer: Timer = params.timer
    ? JSON.parse(params.timer as string)
    : { name: "Anonymous timer", seconds: 55 };
  const [volume, setVolume] = useState(0.5);
  const [timeLeft, setTimeLeft] = useState(timer.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            playAlarm();
            setIsRunning(false);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft]);

  async function playAlarm() {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/alarm.mp3"),
        { volume }
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }

  function toggleTimer() {
    setIsRunning(!isRunning);
  }

  function resetTimer() {
    setIsRunning(false);
    setTimeLeft(timer.seconds);
    if (sound) {
      sound.stopAsync();
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <ThemedView style={styles.viewWrapper}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.timerName}>{timer.name}</ThemedText>
        <ThemedText type="huge" style={styles.timeLeft}>
          {formatTime(timeLeft)}
        </ThemedText>

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              isRunning ? styles.stopButton : styles.startButton,
            ]}
            onPress={toggleTimer}
          >
            <ThemedText style={styles.buttonText}>
              {isRunning ? "Stop" : "Start"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetTimer}
          >
            <ThemedText style={styles.buttonText}>Reset</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.volumeContainer}>
          <ThemedText style={styles.volumeText}>
            Volume: {Math.round(volume * 100)}%
          </ThemedText>
          <Slider
            style={styles.slider}
            value={volume}
            // onValueChange={setVolume} // TODO: This breaks
            onSlidingComplete={setVolume}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    paddingLeft: "1%",
    paddingRight: "1%",
    justifyContent: "center",
    height: "100%",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "SpaceMono",
  },
  timeLeft: {
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 10,
    minWidth: 100,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#f44336",
  },
  resetButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  volumeContainer: {
    width: "80%",
    alignItems: "center",
  },
  volumeText: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
