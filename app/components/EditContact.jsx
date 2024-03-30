import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { app, auth } from "../../firebase/firestore";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firestore = getFirestore(app);

const EditContact = () => {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userId, setuserId] = useState("");

  useEffect(() => {
    const onStart = async () => {
      const user = auth.currentUser;
      const docRef = doc(firestore, `stores/${user.uid}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setPhone(snap.data().phone);
        setAddress(snap.data().address);
        setuserId(user.uid);
      } else {
        console.log("No such document!");
      }
    };
    onStart();
  }, []);

  const saveContactInfo = async () => {
    const docRef = doc(firestore, `stores/${userId}`);
    try {
      await setDoc(docRef, { phone: phone, address: address }, { merge: true });
      alert("Contact updated successfully!");
    } catch (error) {
      alert("Failed to update Contact.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Phone:</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Enter your phone number"
      />

      <Text style={styles.label}>Address:</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        multiline={true}
        placeholder="Enter your address"
      />

      <View style={styles.buttonContainer}>
        <Button title="Save  changes" onPress={saveContactInfo} />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 3,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f5f5dc", // cream background
  },
  buttonContainer: {
    marginTop: 50,
    alignSelf: "center",
    width: 250,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 2 },
  },
});

export default EditContact;
