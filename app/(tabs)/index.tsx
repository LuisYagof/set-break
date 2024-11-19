import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface Timer {
  id: string;
  seconds: number;
  name: string;
}

export default function TimerList() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [seconds, setSeconds] = useState("");
  const [name, setName] = useState("");

  async function addTimer(seconds: number, name: string) {
    const newTimer = {
      id: Date.now().toString(),
      seconds,
      name,
    };
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
  }

  async function removeTimer(item: Timer) {
    const updatedTimers = timers.filter((timer) => timer.id !== item.id);
    setTimers(updatedTimers);
    await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
  }

  function handleAddTimer() {
    const secondsNum = parseInt(seconds);
    if (isNaN(secondsNum) || secondsNum <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number of seconds");
      return;
    }
    if (!name.trim()) {
      Alert.alert("Invalid Input", "Please enter a timer name");
      return;
    }
    addTimer(secondsNum, name);
    setSeconds("");
    setName("");
  }

  return (
    <ThemedView style={styles.viewWrapper}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={[
              { color: Colors[useColorScheme().colorScheme].text },
              styles.input,
            ]}
            placeholder="Timer Name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[
              { color: Colors[useColorScheme().colorScheme].text },
              styles.input,
            ]}
            placeholder="Seconds"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={seconds}
            onChangeText={setSeconds}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTimer}>
            <ThemedText style={styles.buttonText}>Add Timer</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <FlatList
          data={timers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.timerItem}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/countdown",
                  params: { timer: JSON.stringify(item) }, // TODO: Fix this params
                })
              }
            >
              <ThemedText style={styles.timerName}>{item.name}</ThemedText>
              <ThemedText style={styles.timerSeconds}>
                {item.seconds} seconds
              </ThemedText>
              <Pressable
                style={styles.iconBin}
                onPress={() => removeTimer(item)}
              >
                <IconSymbol size={28} name="bin" color={"#c40707"} />
              </Pressable>
            </TouchableOpacity>
          )}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    paddingTop: "15%",
    paddingLeft: "1%",
    paddingRight: "1%",
    height: "100%",
  },
  container: {
    padding: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  timerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  timerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timerSeconds: {},
  iconBin: {
    position: "absolute",
    left: "100%",
    top: "50%",
    zIndex: 0,
  },
});
