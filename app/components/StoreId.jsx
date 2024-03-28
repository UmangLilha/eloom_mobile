import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Button, Text, Alert } from "react-native";
import { app, auth } from "../../firebase/firestore";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";

const firestore = getFirestore(app);

const StoreId = () => {
  const [storeId, setStoreId] = useState("");
  const [storeidArray, setStoreidArray] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uid, setUid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = (input) => {
    const regex = /^[a-z][a-z0-9_]{3,15}$/;
    return regex.test(input);
  };

  const handleInputChange = (input) => {
    setStoreId(input);
    if (input.length === 0) {
      setErrorMessage("");
    } else if (!validateInput(input)) {
      setErrorMessage(
        "Error: Input must start with a letter, contain only lowercase letters, numbers, or '_', and have no spaces.store id length should be between 4 to 16 characters."
      );
    } else if (storeidArray.includes(input)) {
      setErrorMessage(
        "Error: store id is already in use. Please use another id"
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = async () => {
    const docRef = doc(firestore, `stores/${uid}`);
    try {
      setIsLoading(true);
      await setDoc(docRef, { storeid: storeId }, { merge: true });
      router.push("/components/ListView");
    } catch (error) {
      Alert.alert("Check internet connection");
    }
    setIsLoading(false);
    setStoreId("");
  };

  useEffect(() => {
    const fetchAllDocuments = async () => {
      const querySnapshot = await getDocs(collection(firestore, "stores"));
      const storeids = querySnapshot.docs
        .map((doc) => doc.data().storeid)
        .filter(Boolean);
      console.log(storeids);
      setStoreidArray((x) => (x = storeids));
    };
    fetchAllDocuments();
    const user = auth.currentUser;
    console.log(user.uid);
    setUid(user.uid);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Digital Store ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Store ID"
        value={storeId}
        onChangeText={handleInputChange}
        editable={!isLoading}
      />
      {errorMessage.length > 0 && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
      {isLoading ? (
        <ActivityIndicator size="medium" color="black" />
      ) : (
        <Button
          title="Submit"
          disabled={errorMessage.length > 0 || storeId.length == 0}
          onPress={handleSubmit}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default StoreId;
