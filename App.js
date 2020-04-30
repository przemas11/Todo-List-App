// import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Lists from './src/screens/Lists';
import Tasks from './src/screens/Tasks';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Lists"
          component={Lists}
          options={{title: 'All categories'}}
        />
        <Stack.Screen
          name="Tasks"
          component={Tasks}
          options={{title: 'Task list'}}
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
