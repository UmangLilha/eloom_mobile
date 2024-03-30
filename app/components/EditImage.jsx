import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Button,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { app, auth } from "../../firebase/firestore";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as MediaLibrary from "expo-media-library";

const firestore = getFirestore(app);

const EditImage = () => {
  const [imageUri, setImageUri] = useState(null);
  const [userId, setuserId] = useState("");

  useEffect(() => {
    const onStart = async () => {
      const user = auth.currentUser;
      const docRef = doc(firestore, `stores/${user.uid}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setImageUri(snap.data().logo);
        setuserId(user.uid);
      } else {
        console.log("No such document!");
      }
    };

    onStart();
  }, []);

  const pickImage = async () => {
    const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
    const albums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        setImageUri(result.assets[0].uri);
      } catch (error) {
        alert("Could not fetch the current image");
      }
    }
  };

  const saveImageFirebase = async (downloadURL) => {
    const docRef = doc(firestore, `stores/${userId}`);
    try {
      await setDoc(docRef, { logo: downloadURL }, { merge: true });
      alert("Image updated successfully!");
    } catch (error) {
      alert("Failed to update Image.");
    }
  };

  const saveImage = async () => {
    const storage = getStorage();
    const imagePath = `${userId}/logo/logo.jpg`;
    const storageRef = ref(storage, imagePath);
    const img = await fetch(imageUri);
    const bytes = await img.blob();

    uploadBytes(storageRef, bytes)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          saveImageFirebase(downloadURL);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Store image</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Upload  new  image" onPress={pickImage} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Save  Changes" onPress={saveImage} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainer: {
    borderRadius: 75,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 16,
  },
  image: {
    width: 300,
    height: 300,
  },
  buttonContainer: {
    marginTop: 50,
    marginHorizontal: 50,
    width: 250,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 2 },
  },
});

export default EditImage;
