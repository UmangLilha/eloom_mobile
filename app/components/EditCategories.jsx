import React, { useState, useEffect } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app, auth } from "../../firebase/firestore";
import CategoryListItem from "./CategoryListItem";
import AddCategoryModal from "./AddCategoryModal";

const firestore = getFirestore(app);
let docRef = null;

const EditCategories = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [userId, setuserId] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const user = auth.currentUser;
      docRef = doc(firestore, `stores/${user.uid}`);
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data().categories) {
        const catList = Object.keys(snap.data().categories).sort();
        setCategories(catList);
      }
      setuserId(user.uid);
    };
    fetchCategories();
  }, []);

  const updateCategoryFirebase = async () => {
    newCatObj = { [newCategory]: {} };
    try {
      const docRef = doc(firestore, `stores/${userId}`);
      const snap = await getDoc(docRef);
      catObj = snap.data().categories;
      catObj = { ...catObj, ...newCatObj };
      await updateDoc(docRef, { categories: catObj });
      alert("Category updated successfully!");
    } catch (error) {
      alert("Failed to update Category.");
    }
  };

  const addCategory = () => {
    setCategories((prevState) => [...prevState, newCategory]);
    setModalVisible(false);
    setNewCategory(null);
    updateCategoryFirebase();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryListItem
            item={item}
            docRef={docRef}
            setCategories={setCategories}
            userId={userId}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={() => (
          <View style={styles.buttonContainer}>
            <Button
              title="Add new category"
              onPress={() => setModalVisible(true)}
            />
          </View>
        )}
      />
      <AddCategoryModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        addCategory={addCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    alignSelf: "center",
    width: 250,
    marginTop: 50,
  },
});

export default EditCategories;
