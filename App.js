// import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

import Lists from './src/screens/Lists';
import Tasks from './src/screens/Tasks';

const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    db.transaction(function(tx) {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS lists(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL);',
        [],
        function(_tx, res) {},
      );
    });
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Lists"
          component={Lists}
          options={{title: 'Wszystkie listy'}}
        />
        <Stack.Screen
          name="Tasks"
          component={Tasks}
          options={{title: 'Lista zadań'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   }
// });

export default App;
