import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
import { app, auth } from "../../firebase/firestore";
import { Icon } from "react-native-elements";
import { router } from "expo-router";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { ActivityIndicator } from "react-native";

const firestore = getFirestore(app);

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const recaptchaVerifier = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendVerification = async () => {
    console.log(app.options);
    actualPhoneNumber = "+91" + phoneNumber;

    signInWithPhoneNumber(auth, actualPhoneNumber, recaptchaVerifier.current)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        console.log(`verificationid:${confirmationResult.verificationId}`);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error sending verification code", error.message);
      });
  };

  const confirmCode = async () => {
    try {
      setIsLoading(true);
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const result = await signInWithCredential(auth, credential);

      console.log("User signed in with phone number");
      console.log(`User UID: ${result.user.uid}`);

      const storeDoc = doc(firestore, "stores", result.user.uid);
      const storeDocSnapshot = await getDoc(storeDoc);

      if (!storeDocSnapshot.exists()) {
        await setDoc(storeDoc, { uid: result.user.uid });
        console.log("user added");
        router.push("/components/StoreId");
      } else {
        router.push("/components/ListView");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error verifying code", error.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        attemptInvisibleVerification={true}
      />
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter Phone no</Text>
        <TextInput
          style={styles.input}
          placeholder="1234567890"
          keyboardType="numeric"
          maxLength={10}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          editable={!isLoading}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Send Verification"
            onPress={sendVerification}
            disabled={isLoading}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter OTP</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          editable={!isLoading}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={confirmCode}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Icon
              name="sign-in-alt"
              type="font-awesome-5"
              size={20}
              color="white"
            />
            <Text style={styles.buttonText}>Log In</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginHorizontal: 50,
    width: 250,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 2 },
  },
});

export default Login;
