import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import MyButton from '../interface/MyButton';
import MySmallButton from '../interface/MySmallButton';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

export default function Lists(props, {listTitleCallback}) {
  const [ListName, setListName] = useState('');
  const [ShowInputBar, setShowInputBar] = useState(false);
  const [ListsDB, setListsDB] = useState([]);
  const [InputMode, setInputMode] = useState(0);

  function _showInputBar() {
    setShowInputBar(true);
  }

  function _hideInputBar() {
    setShowInputBar(false);
    setListName('');
  }

  function _inputBarConfirm(item) {
    //ADD NEW LIST
    if (InputMode === 0) {
      if (ListName) {
        //insert new list to the DB
        db.transaction(function(tx) {
          tx.executeSql(
            'INSERT INTO lists(title) VALUES (?); OUTPUT Inserted.id',
            [ListName],
            function(tx1, res) {
              //create new table with tasks
              db.transaction(function(tx2) {
                console.log('tworzenie nowej bazy zadan, id: ' + res.insertId);
                tx2.executeSql(
                  `CREATE TABLE IF NOT EXISTS list${
                    res.insertId
                  }(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, done INTEGER NOT NULL);`,
                  [],
                  function(tx3, res2) {},
                );
              });
            },
          );
        });
        _hideInputBar();
      }
    }
    //EDIT EXISTING LIST'S NAME
    else if (InputMode === 1) {
      if (ListName) {
        console.log('edit');
      }
    }
  }

  function _inputBarCancel() {
    _hideInputBar();
  }

  //Get all lists from the DB
  function _getLists() {
    db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM lists;', [], function(_tx, res) {
        if (res.rows.length > 0) {
          let buffer = [];
          for (let i = 0; i < res.rows.length; i++) {
            buffer.push(res.rows.item(i));
          }
          setListsDB(buffer);
          //console.log(buffer);
        } else {
          setListsDB([]);
        }
      });
    });
  }

  //Delete selected lists from the DB
  function _deleteList(id) {
    //delete the task list table for selected category
    db.transaction(function(tx) {
      tx.executeSql(`DROP TABLE IF EXISTS list${id};`, [], function(
        tx2,
        res,
      ) {});
    });
    //delete the category
    db.transaction(function(tx) {
      tx.executeSql('DELETE FROM lists WHERE id=?;', [id], function(
        tx2,
        res,
      ) {});
    });
  }

  function _debugLogAllTables() {
    db.transaction(function(tx) {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
        [],
        function(_tx, res) {
          if (res.rows.length > 0) {
            console.log('All tables in the DB:');
            for (let i = 0; i < res.rows.length; i++) {
              console.log(res.rows.item(i));
            }
          } else {
            console.log('No tables in the DB');
          }
        },
      );
    });
  }

  function _debugDeleteAllTables() {
    console.log('usuwam all');
  }

  //Reload lists when refreshing the DOM
  useEffect(() => {
    _getLists();
  });

  function _onPress(item) {
    //open task list for selected category
    props.navigation.navigate('Tasks');
  }

  function _onLongPress(id) {
    _deleteList(id);
  }

  function _addNewList() {
    setInputMode(0);
    _showInputBar();
  }

  function _editListName() {
    setInputMode(1);
    _showInputBar();
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <MyButton title={'NEW'} onPress={() => _addNewList()} />
        <MyButton title={'EDIT'} onPress={() => _editListName()} />
        <MyButton title={'DELETE'} onPress={() => console.log('delet')} />
      </View>

      <View style={styles.bar}>
        <MyButton title={'LOG ALL'} onPress={() => _debugLogAllTables()} />
        {/* <MyButton
          title={'DELETE ALL'}
          onPress={() => _debugDeleteAllTables()}
        /> */}
      </View>

      {ShowInputBar && (
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder={'New list name'}
            onChangeText={text => {
              setListName(text);
            }}
          />
          <View style={styles.bar}>
            <MySmallButton
              title={'Confirm'}
              onPress={() => _inputBarConfirm()}
            />
            <MySmallButton
              title={'Cancel'}
              onPress={() => _inputBarCancel()}
              value={ListName}
            />
          </View>
        </View>
      )}

      <FlatList
        data={ListsDB}
        renderItem={({item}) => (
          <View style={styles.view}>
            <TouchableOpacity
              onPress={_onPress.bind(this, item)}
              onLongPress={_onLongPress.bind(this, item.id)}>
              <Text style={styles.item}>{item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
