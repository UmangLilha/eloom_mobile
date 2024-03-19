import React, { useState } from 'react';
import { FlatList,Linking, Alert } from 'react-native';
import ListItem from './ListItem';
import { DATA } from '../../data/data';
import { router, useRouter } from 'expo-router';


// const firestore = getFirestore(app)

const ListView = () => {
//#const router = useRouter();


  const [desc, setDesc] = useState("");

//   const onStart = async()=>{
//     const docRef = doc(firestore,'stores/nitya_creation');
//     const snap = await getDoc(docRef);
//     setDescription(x => x = snap.data().description);
// };

// useEffect ( () =>{
//   onStart();
// });

  const handleViewPage = () =>{
    const url = 'https://www.eloom.in/nitya_creation';
      Linking.openURL(url).catch((err) => {
        console.error('Failed opening page because: ', err);
        Alert.alert('Failed to open page');
      });
};

  const handlePress = (id) => {
    if (id === '5'){ 
    handleViewPage()
    } 
    else if (id == 2){
      router.push('./components/EditDesc');
    }
    else if (id == 4){
      router.push('./components/EditContact');
    }
     else if (id == 1){
      router.push('./components/EditImage');
    }
         else if (id == 3){
      router.push('./components/EditCategories');
    }

    else {
      console.log(`Pressed item with id: ${id}`);
    }
  };
  
  
  
  const renderItem = ({ item }) => (
    <ListItem
      title={item.title}
      onPress={() => handlePress(item.id)}
    />
  );

  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

export default ListView;
