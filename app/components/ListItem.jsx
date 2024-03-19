import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const ListItem = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.item}>
    <View style={styles.textContainer}>
      <Text style={styles.title}  >{title}</Text>
    </View>
    <AntDesign name="right" size={24} color="black" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  textContainer: {
    flex: 1, 
    marginRight: 10, 
  },
  title: {
    fontSize: 18,
  },
});

export default ListItem;