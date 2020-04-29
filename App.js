// import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Lists from './src/screens/Lists'
import Tasks from './src/screens/Tasks'

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Lists" component={Lists} options={{ title: 'Wszystkie kategorie' }} />
        <Stack.Screen name="Tasks" component={Tasks} options={{ title: 'Lista zadań' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   }
// });

export default App;
