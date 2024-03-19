import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import {app} from '../../firebase/firestore'
import {getFirestore,collection, doc, getDoc,setDoc} from 'firebase/firestore'

const firestore = getFirestore(app)

const EditDesc = () => {
  const [description, setDescription] = useState('');

  const handleChange = (text)=>{
      setDescription(x => x = text);
  }

  useEffect ( () =>{
    const onStart = async () => {
    const docRef = doc(firestore, 'stores/nitya_creation');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      setDescription(snap.data().description);
    } else {
      console.log("No such document!");
    }
  };
    onStart();
  },[]);


  // const saveDescription = () => {
  //   // Here you would save the description to your data store or state management
  //   console.log('Description saved:', description);
  //   // Add logic to navigate to ListView or another screen if needed
  //   // navigation.navigate('ListView');
  // };

  const saveDescription = async () => {
  const docRef = doc(firestore, 'stores/nitya_creation');
  try {
    await setDoc(docRef, { description: description }, { merge: true });
    alert('Description updated successfully!');
  } catch (error) {
    alert('Failed to update description.');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit description</Text>
      </View>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Enter your store description here"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.buttonContainer}>
        <Button title="Save  changes" onPress={saveDescription} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 30,
    marginTop: 25
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:22
  },
  textInput: {
    margin: 15,
    padding: 10,
    borderWidth: 3,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f5f5dc', // cream background
  },
  buttonContainer: {
    marginTop: 50, 
    marginHorizontal: 50,
    width: 250,
    elevation: 3, 
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 2 },
  },
});

export default EditDesc;
