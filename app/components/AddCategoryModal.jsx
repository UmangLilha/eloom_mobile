// AddCategoryModal.js
import React from 'react';
import { View, Modal, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const AddCategoryModal = ({ modalVisible, setModalVisible, newCategory, setNewCategory, addCategory }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            placeholder="Category Name"
            style={styles.modalText}
            onChangeText={setNewCategory}
            value={newCategory}
          />
          <Button title="Add Category" onPress={addCategory} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  closeIconContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
});

export default AddCategoryModal;
