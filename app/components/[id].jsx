import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { app, auth } from "../../firebase/firestore";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Icon } from "react-native-elements";
import UploadModal from "./UploadModal";
import { Alert } from "react-native";

const firestore = getFirestore(app);
const storage = getStorage(app);

const EditProduct = () => {
  const { id } = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState({});
  const [userId, setuserId] = useState("");

  useEffect(() => {
    const onStart = async () => {
      const user = auth.currentUser;
      const docRef = doc(firestore, `stores/${user.uid}`);
      const snap = await getDoc(docRef);
      catObj = snap.data().categories[id];
      setCategories((x) => (x = catObj));
      setuserId(user.uid);
    };
    onStart();
  }, [modalVisible]);

  const handleUploadImage = () => {
    setModalVisible(true);
  };

  const deleteStorageFile = async (url) => {
    const encodedFilePath = url.split("/o/")[1].split("?alt=")[0];
    const filePath = decodeURIComponent(encodedFilePath);
    const fileRef = ref(storage, filePath);
    deleteObject(fileRef);
  };

  const handleDelete = async (url) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const docRef = doc(firestore, `stores/${userId}`);
            const snap = await getDoc(docRef);
            catObj = snap.data().categories;
            idObj = catObj[id];
            if (idObj.hasOwnProperty(url)) {
              delete idObj[url];
              catObj[id] = idObj;
              try {
                await updateDoc(docRef, { categories: catObj });
                await deleteStorageFile(url);
                setCategories((x) => (x = idObj));
                alert("Deleted successfully");
              } catch (error) {
                alert("Could not delete");
              }
            } else {
              alert("An error occured");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      <UploadModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        id={id}
        userId={userId}
      />
      <ScrollView contentContainerStyle={styles.img_container}>
        {Object.entries(categories).map(([url, name], index) => (
          <View style={styles.card} key={index}>
            <Image source={{ uri: url }} style={styles.image} />
            <Text style={styles.title}>{name}</Text>
            <TouchableOpacity
              onPress={() => handleDelete(url)}
              style={styles.deleteButton}
            >
              <Icon name="delete" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  uploadButton: {
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  img_container: {
    padding: 10,
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 175,
    height: 175,
    resizeMode: "contain",
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    // Style for your delete button
    padding: 10,
  },
});

export default EditProduct;
