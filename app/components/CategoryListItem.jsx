// CategoryListItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { getDoc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { app } from '../../firebase/firestore';
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";

const storage = getStorage(app);

const CategoryListItem = ({ item, docRef, setCategories }) => {


const deleteStorageFolder = async(item)=>{
  folderPath = `nitya_creations/categories/${item}`;
  const folderRef = ref(storage, folderPath);
  const listResults = await listAll(folderRef);
    const deletePromises = listResults.items.map(itemRef => {
      return deleteObject(itemRef);
    });
    await Promise.all(deletePromises);
}

const deleteCategoryFirebase = async(item)=>{
   
    try{
        const snap = await getDoc(docRef);
        catObj = snap.data().categories;
        if (catObj.hasOwnProperty(item)) {
            delete catObj[item];
            await updateDoc(docRef, { categories:catObj });
            await deleteStorageFolder(item);
            alert('Category deleted successfully!');
        }
    }   
    catch (error){
        alert('Failed to delete Category.');
    }
};

 const handleDeletePress=(item) => {

    Alert.alert(
        "Delete Category", 
        "Are you sure you want to delete this category?This will delete all the products in this category also.", 
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "Yes", onPress: async () => {
            setCategories((prevState) => prevState.filter((category) => category !== item));
            deleteCategoryFirebase(item);
          }
        }
      ]
      )
  };

 const handleUploadPress = (item) => {
    router.push(`components/${item}`);
  }

  return (
    <View style={styles.listItem}>
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{item}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handleUploadPress(item)}>
            <Icon name="cloud-upload" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePress(item)}>
          <Icon name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
  },
});

export default CategoryListItem;
