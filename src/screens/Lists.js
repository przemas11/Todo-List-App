import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

import MyButton from '../interface/MyButton';
import MySmallButton from '../interface/MySmallButton';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

export default function Lists(props) {
  const [ListName, setListName] = useState('');
  const [ShowInputBar, setShowInputBar] = useState(false);
  const [ShowDetailsBar, setShowDetailsBar] = useState(false);
  const [ListsDB, setListsDB] = useState([]);
  const [CurrentList, setCurrentList] = useState(undefined);
  const [InputMode, setInputMode] = useState(0);

  function _showInputBar() {
    setShowInputBar(true);
  }

  function _hideInputBar() {
    setShowInputBar(false);
    setListName('');
  }

  function _inputBarConfirm() {
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
                console.log(
                  'Tworzenie nowej tabeli zadan, id: ' + res.insertId,
                );
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
        if (CurrentList) {
          console.log('edit');
          db.transaction(function(tx) {
            tx.executeSql(
              `UPDATE lists SET title = ? WHERE id = ${CurrentList.id};`,
              [ListName],
              function(tx1, res) {},
            );
          });
        }
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

  //Reload lists when refreshing the DOM
  useEffect(() => {
    _getLists();
  });

  function _onPress(item) {
    setCurrentList(item);
    //open task list for selected category
    props.navigation.navigate('Tasks', {currentList: item});
  }

  function _onLongPress(item) {
    setShowDetailsBar(true);
    _hideInputBar();
    setCurrentList(item);
    //_deleteList(id);
  }

  function _addNewList() {
    setInputMode(0);
    _showInputBar();
  }

  function _editListName() {
    setInputMode(1);
    _showInputBar();
    setShowDetailsBar(false);
  }

  //Delete selected lists from the DB
  function _deleteList() {
    //delete the task list table for selected category
    if (CurrentList) {
      db.transaction(function(tx) {
        tx.executeSql(
          `DROP TABLE IF EXISTS list${CurrentList.id};`,
          [],
          function(tx2, res) {},
        );
      });
      //delete the category
      db.transaction(function(tx) {
        tx.executeSql(
          'DELETE FROM lists WHERE id=?;',
          [CurrentList.id],
          function(tx2, res) {},
        );
      });
    }
    setCurrentList(undefined);
    setShowDetailsBar(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <MyButton
          title={'Dodaj nową kategorię'}
          onPress={() => _addNewList()}
        />
      </View>

      {/* <View style={styles.bar}>
        <MyButton title={'LOG ALL'} onPress={() => _debugLogAllTables()} />
      </View> */}

      {ShowInputBar && (
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder={'Wpisz nazwę listy'}
            onChangeText={text => {
              setListName(text);
            }}
          />
          <View style={styles.bar}>
            <MySmallButton
              title={'Potwierdź'}
              onPress={() => _inputBarConfirm()}
            />
            <MySmallButton
              title={'Anluj'}
              onPress={() => _inputBarCancel()}
              value={ListName}
            />
          </View>
        </View>
      )}

      {ShowDetailsBar && (
        <View style={styles.inputBar}>
          <View style={styles.bar}>
            <MySmallButton title={'Edytuj'} onPress={() => _editListName()} />
            <MySmallButton
              title={'Usuń'}
              onPress={() => _deleteList()}
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
              onLongPress={_onLongPress.bind(this, item)}>
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
