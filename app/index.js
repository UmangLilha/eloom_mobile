import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, StatusBar, Platform } from "react-native";
import ListView from "./components/ListView";
import Login from "./components/Login";
import { auth } from "../firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    //
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {userLoggedIn ? <ListView /> : <Login />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#fff",
  },
});
