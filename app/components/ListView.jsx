import React, { useState } from "react";
import { FlatList, Linking, Alert } from "react-native";
import ListItem from "./ListItem";
import { DATA } from "../../data/data";
import { router, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firestore";

const ListView = () => {
  const handleViewPage = () => {
    const url = "https://www.eloom.in/nitya_creation";
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
