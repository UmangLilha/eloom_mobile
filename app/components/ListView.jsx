import React, { useState, useEffect } from "react";
import { FlatList, Linking, Alert } from "react-native";
import ListItem from "./ListItem";
import { DATA } from "../../data/data";
import { router, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth, app } from "../../firebase/firestore";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

const firestore = getFirestore(app);

const ListView = () => {
  const [storeid, setStoreId] = useState("");

  useEffect(() => {
    const onStart = async () => {
      const user = auth.currentUser;
      const docRef = doc(firestore, `stores/${user.uid}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setStoreId(snap.data().storeid);
      } else {
        Alert.alert("Error occured");
      }
    };
    const requestPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    };
    onStart();
    requestPermission();
  }, []);
  const handleViewPage = () => {
    const url = `https://www.eloom.in/store/${storeid}`;
    Linking.openURL(url).catch((err) => {
      console.error("Failed opening page because: ", err);
      Alert.alert("Failed to open page");
    });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.replace("/");
      })
      .catch((error) => {
        Alert.alert("Sign our error", error.message);
      });
  };

  const handlePress = (id) => {
    if (id === "5") {
      handleViewPage();
    } else if (id == 2) {
      router.push("/components/EditDesc");
    } else if (id == 4) {
      router.push("/components/EditContact");
    } else if (id == 1) {
      router.push("/components/EditImage");
    } else if (id == 3) {
      router.push("/components/EditCategories");
    } else if (id == 6) {
      handleSignOut();
    } else {
      console.log(`Pressed item with id: ${id}`);
    }
  };

  const renderItem = ({ item }) => (
    <ListItem title={item.title} onPress={() => handlePress(item.id)} />
  );

  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default ListView;
