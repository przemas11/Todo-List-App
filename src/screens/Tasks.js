import React, {useRef, useEffect, useState} from 'react';
import {Text, StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

import MyButton from '../interface/MyButton';
import MySmallButton from '../interface/MySmallButton';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

export default function Tasks({route, navigation}) {
  const [TaskName, setTaskName] = useState('');
  const [ShowInputBar, setShowInputBar] = useState(false);
  const [ShowDetailsBar, setShowDetailsBar] = useState(false);
  const [TasksDB, setTasksDB] = useState([]);
  const [CurrentTask, setCurrentTask] = useState(undefined); //?
  const [InputMode, setInputMode] = useState(0);

  let temp = {id: undefined, title: 'Lista zadań'};
  if (route.params.currentList) {
    temp = route.params.currentList;
  }
  const currentList = useRef(temp);
  navigation.setOptions({title: currentList.current.title});

  function _showInputBar() {
    setShowInputBar(true);
  }

  function _hideInputBar() {
    setShowInputBar(false);
    setTaskName('');
  }

  function _inputBarConfirm() {
    //ADD NEW TASK
    if (InputMode === 0) {
      if (TaskName) {
        console.log('dopisuje nowe zadanie');
        //insert new task to the DB
        db.transaction(function(tx) {
          tx.executeSql(
            `INSERT INTO list${
              currentList.current.id
            }(title, done) VALUES (?,?);`,
            [TaskName, false],
            function(tx1, res) {
              console.log('dodalem');
            },
          );
        });
        _hideInputBar();
      }
    }
    //EDIT EXISTING LIST'S NAME
    else if (InputMode === 1) {
      if (TaskName) {
        if (CurrentTask) {
          console.log('edit');
          db.transaction(function(tx) {
            tx.executeSql(
              `UPDATE list${currentList.current.id} SET title = ? WHERE id = ${
                CurrentTask.id
              };`,
              [TaskName],
              function(tx1, res) {},
            );
          });
        }
        _hideInputBar();
      }
    }
    _getTasks();
  }

  function _inputBarCancel() {
    _hideInputBar();
  }

  //Get all lists from the DB
  function _getTasks() {
    db.transaction(function(tx) {
      tx.executeSql(
        `SELECT * FROM list${currentList.current.id};`,
        [],
        function(_tx, res) {
          if (res.rows.length > 0) {
            let buffer = [];
            for (let i = 0; i < res.rows.length; i++) {
              buffer.push(res.rows.item(i));
            }
            setTasksDB(buffer);
            // console.log('zadanka:'); //rerender loop ??? TODO
            // console.log(buffer);
          } else {
            setTasksDB([]);
          }
        },
      );
    });
  }

  //Reload lists when refreshing the DOM
  // useEffect(() => {
  //   _getTasks();
  // });

  function _onPress(item) {
    setCurrentTask(item);
    db.transaction(function(tx) {
      tx.executeSql(
        `UPDATE list${currentList.current.id} SET done = ? WHERE id = ${
          CurrentTask.id
        };`,
        [!item.done],
        function(tx1, res) {
          //console.log('zmienilem stan z ', item.done, ' na ', !item.done);
        },
      );
    });
    _getTasks();
  }

  function _onLongPress(item) {
    setShowDetailsBar(true);
    _hideInputBar();
    setCurrentTask(item);
    //_deleteTask(id);
  }

  function _addNewTask() {
    _getTasks(); //TEMP too many rerenders with useEffect :/
    setInputMode(0);
    _showInputBar();
  }

  function _editTaskName() {
    setInputMode(1);
    _showInputBar();
    setShowDetailsBar(false);
  }

  //Delete selected lists from the DB
  function _deleteTask() {
    //delete selected task from list
    console.log('ID:', currentList.current.id);
    console.log('task ID:', CurrentTask.id);
    if (currentList.current.id) {
      db.transaction(function(tx) {
        tx.executeSql(
          `DELETE FROM list${currentList.current.id} WHERE id=?;`,
          [CurrentTask.id],
          function(tx2, res) {
            console.log('usuniete');
          },
        );
      });
      setCurrentTask(undefined);
      setShowDetailsBar(false);
      _getTasks();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <MyButton title={'Dodaj nowe zadanie'} onPress={() => _addNewTask()} />
      </View>

      {ShowInputBar && (
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder={'Wpisz nazwę zadania'}
            onChangeText={text => {
              setTaskName(text);
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
              value={TaskName}
            />
          </View>
        </View>
      )}

      {ShowDetailsBar && (
        <View style={styles.inputBar}>
          <View style={styles.bar}>
            <MySmallButton title={'Edytuj'} onPress={() => _editTaskName()} />
            <MySmallButton
              title={'Usuń'}
              onPress={() => _deleteTask()}
              value={TaskName}
            />
          </View>
        </View>
      )}

      <FlatList
        data={TasksDB}
        renderItem={({item}) => (
          <View style={styles.view}>
            <TouchableOpacity
              onPress={_onPress.bind(this, item)}
              onLongPress={_onLongPress.bind(this, item)}>
              <Text style={item.done ? styles.itemDone : styles.item}>
                {item.title}
              </Text>
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
    backgroundColor: '#ffffdd',
    marginVertical: 5,
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffff77',
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
  itemDone: {
    padding: 10,
    fontSize: 30,
    height: 60,
    textDecorationLine: 'line-through',
  },
});
