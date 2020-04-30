import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const MySmallButton = props => {
  return (
    <View style={{width: '45%'}}>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={styles.MySmallButtonText}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MySmallButton;

const styles = StyleSheet.create({
  MySmallButtonText: {
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
    paddingVertical: '1%',
    paddingHorizontal: '5%',
    backgroundColor: '#2196f3',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#2196f3',
  },
});
