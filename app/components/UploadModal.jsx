import React,{useState} from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, SafeAreaView, Image, Button, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { app } from '../../firebase/firestore';
import { getFirestore,collection, doc, getDoc,setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, getDownloadURL,ref, uploadBytes } from 'firebase/storage';
import { Icon } from 'react-native-elements';

const firestore = getFirestore(app); 
const storage = getStorage(app); 
const docRef = doc(firestore, 'stores/nitya_creation');

const UploadModal = ({ visible, setModalVisible , id}) => {

    const [imageUri, setImageUri] = useState(null);
    const [productName, setProductName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
      
      await ImagePicker.getMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,


    });

    if (!result.canceled) {
      try{
      setImageUri(result.assets[0].uri);
      }
       catch(error){
        alert("Could not fetch the current image");
       }
    }
    };

    const saveImageFirebase = async(downloadURL) => {
        
        prodObj = {[downloadURL]:productName};
       
        try{
            const snap = await getDoc(docRef);
            catObj = snap.data().categories;
            idObj = catObj[id];
            newObj = {...idObj, ...prodObj};
            catObj[id] = newObj
            await updateDoc(docRef, { categories:catObj });
            setImageUri(x => x = null);
            setProductName( x => x = null);
            alert("Upload successful");
            setIsLoading(false);  
        }
        catch (error){
             alert("Failed to upload");
             setIsLoading(false);  
        }


   };
    
    const saveImage = async () => {
        
      setIsLoading(true);  
        const currentDateTime = new Date();
        let fileName = `${new Date().toISOString()}_${id}`;
        fileName = fileName.replace(/[^a-zA-Z0-9]/g, '');
        const imagePath = `nitya_creations/categories/${id}/${fileName}.jpeg`;
        const storageRef = ref(storage,imagePath);
        const img = await fetch(imageUri);
        const bytes = await img.blob();

        uploadBytes(storageRef, bytes).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
            
            saveImageFirebase(downloadURL);
    
        });
        }).catch((error) => {
        alert("Failed to save the image");
        setImageUri(x => x = null);
        setProductName( x => x = null);
        setIsLoading(false);  
        });
        
        
    };

    const onClose = () =>{
      setModalVisible(x => x=false);
      setImageUri (x => x = null);
      setProductName('');
      setIsLoading(false); 
  }



  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
           
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={onClose}
          >
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
            <View style = {styles.headerContainer} >
              < Text style = {styles.headerText} >Upload your product here!</Text>
            </View>

          {isLoading ? (<ActivityIndicator size="large" color="#0000ff" />):(

        

            

          <SafeAreaView style={styles.container}>
              <TextInput
                placeholder="Product Name"
                style={styles.modalText}
                onChangeText={setProductName}
                value={productName}
              />
                <View style={styles.imageContainer}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style = {styles.headerText}>No Image</Text>
                    </View>
                  )}
                </View>
            

            <View style={styles.buttonContainer}>
                <Button title="Upload  new  image" onPress={pickImage} />
            </View>

            <View style={styles.buttonContainer}>
              <Button title="save changes" onPress={saveImage} />
            </View>
          </SafeAreaView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'center',
    width: '100%',
    height : '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContainer: {
      width: '100%',
      padding: 16,
      alignSelf: 'center',
      borderBottomWidth: 2,
      borderBottomColor: '#ddd',

  },
  headerText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },


  imageContainer: {
 
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ccc',
    marginVertical: 20, 
  
  },
  image: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor:'black',
    resizeMode: 'contain'
},
imagePlaceholder:{
  width: '100%',
  height:'100%',
   
  justifyContent:'center',
  backgroundColor: '#f0f0f0', 
},


modalText: {
  marginTop:25,
  marginBottom: 15,
  textAlign: 'center',
  width: '100%',
  fontSize: 15,
  borderBottomWidth: 2,
  borderBottomColor: '#ccc',
  padding: 10,
  backgroundColor:'#f5f5dc'
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
closeIconContainer: {
  alignSelf: 'flex-end',
  marginBottom: 10,
},
});

export default UploadModal;
