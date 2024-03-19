import { StyleSheet, Text, View,SafeAreaView,StatusBar,Platform } from 'react-native';
import ListView from './app/components/ListView';
import EditDesc from './app/components/EditDesc';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {
  const Stack = createStackNavigator();
  return (

      <SafeAreaView style={styles.container} >
        <ListView></ListView>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff'
  },
});
