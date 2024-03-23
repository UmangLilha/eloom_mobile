import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import ListView from './components/ListView';
import Login from './components/Login'



export default function App() {
  return (
      <SafeAreaView style={styles.container} >
            <Login/>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
});