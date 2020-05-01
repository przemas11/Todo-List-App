import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

export default class Tasks extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text> Tasks </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff77',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
