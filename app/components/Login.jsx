import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { app, auth } from "../../firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { router } from "expo-router";
import { async } from "@firebase/util";

const firestore = getFirestore(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email first.");
        await signOut(auth);
      } else {
        const storeDoc = doc(firestore, "stores", userCredential.user.uid);
        const storeDocSnapshot = await getDoc(storeDoc);
        if (!storeDocSnapshot.exists()) {
          await setDoc(storeDoc, { uid: userCredential.user.uid });
          console.log("user added");
          router.replace("/components/StoreId");
        }
        // else {
        //   router.replace("/components/ListView");
        // }
        setEmail("");
        setPassword("");
        setError("");
      }
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  };

  const handleSignUp = () => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(userCredential.user)
          .then(() => {
            Alert.alert(`Verification email set to ${email}.`);
          })
          .catch((e) => {
            setError(`Error sending verification email: ${e.message}`);
            signOut(auth);
          });
      })
      .catch((e) => {
        setError(e.message);
      });
    setEmail("");
    setPassword("");
    setError("");
    setIsLoading(false);
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Password reset email sent");
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WELCOME TO ELOOM</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
        editable={!isLoading}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
        secureTextEntry={passwordVisibility}
        right={
          <TextInput.Icon
            icon={!passwordVisibility ? "eye" : "eye-off"}
            onPress={togglePasswordVisibility}
          />
        }
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {isLoading ? (
        <ActivityIndicator size="medium" color="black" />
      ) : (
        <>
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>

          <Button mode="contained" onPress={handleSignUp} style={styles.button}>
            Sign Up
          </Button>

          <TouchableOpacity
            onPress={handlePasswordReset}
            style={styles.resetPassword}
          >
            <Text>Reset password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 5,
  },
  resetPassword: {
    marginVertical: 5,
    alignSelf: "flex-end",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});

export default Login;
