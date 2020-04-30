import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const MyButton = props => {
  return (
    <View style>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={styles.MyButtonText}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

MyButton.defaultProps = {width: undefined};

export default MyButton;

const styles = StyleSheet.create({
  MyButtonText: {
    fontSize: 30,
    color: 'white',
    paddingVertical: '1%',
    paddingHorizontal: '5%',
    backgroundColor: '#2196f3',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#2196f3',
  },
});
