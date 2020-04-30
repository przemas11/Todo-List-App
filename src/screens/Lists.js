import React, {useState} from 'react';
import {Text, StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
import {TextInput} from 'react-native-gesture-handler';
import MyButton from '../interface/MyButton';
import MySmallButton from '../interface/MySmallButton';
var db = openDatabase({name: 'UserDatabase.db'});

const tmp = [
  {key: '1', title: 'Test1'},
  {key: '2', title: 'Test2'},
  {key: '3', title: 'Test3'},
  {key: '4', title: 'Test4'},
  {key: '5', title: 'Test5'},
  {key: '6', title: 'Test6'},
  {key: '7', title: 'Test7'},
  {key: '8', title: 'Test8'},
  {key: '9', title: 'Test9'},
  {key: '10', title: 'Test10'},
  {key: '11', title: 'Test11'},
  {key: '12', title: 'Test12'},
  {key: '13', title: 'Test13'},
];

export default function Lists() {
  const [ListName, setListName] = useState('');
  const [ShowInputBar, setShowInputBar] = useState(false);

  function _onPress(item) {
    console.log('Pressed');
    console.log(item);
  }

  function _onLongPres(item) {
    console.log('Long pressed');
    console.log(item);
  }

  function _showInputBar() {
    setShowInputBar(true);
  }

  function _hideInputBar() {
    setShowInputBar(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <MyButton title={'NEW'} onPress={() => _showInputBar()} />
        <MyButton title={'EDIT'} onPress={() => console.log('Edit')} />
        <MyButton title={'DELETE'} onPress={() => console.log('Delete')} />
      </View>

      {ShowInputBar && (
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder={'New list name'}
            onChangeText={text => {
              setListName(text);
              console.log(text);
            }}
          />
          <View style={styles.bar}>
            <MySmallButton title={'Add'} onPress={() => console.log('Add')} />
            <MySmallButton
              title={'Cancel'}
              onPress={() => _hideInputBar()}
              value={ListName}
            />
          </View>
        </View>
      )}

      <FlatList
        data={tmp}
        renderItem={({item}) => (
          <View style={styles.view}>
            <TouchableOpacity
              onPress={_onPress.bind(this, item)}
              onLongPress={_onLongPres.bind(this, item)}>
              <Text style={styles.item}>{item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {/* <ScrollView style={styles.container}>
        <Button
          title="Go to tasks"

          onPress={() => this.props.navigation.navigate('Tasks')}
        />
      </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    //height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    //borderBottomWidth: 1,
  },
  textInput: {
    backgroundColor: '#eee',
    marginVertical: 5,
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view: {
    borderBottomWidth: 1,
    borderColor: '#444',
  },
  item: {
    padding: 10,
    fontSize: 30,
    height: 60,
  },
});
