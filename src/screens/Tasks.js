import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

import MyButton from '../interface/MyButton';
import MySmallButton from '../interface/MySmallButton';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

var sortOptions = [
  {
    id: 0,
    text: 'alfabetycznie A-Z',
  },
  {
    id: 1,
    text: 'alfabetycznie Z-A',
  },
  {
    id: 2,
    text: 'wg statusu\n(najpierw zrobione)',
  },
  {
    id: 3,
    text: 'wg statusu\n(najpierw niezrobione)',
  },
];

export default function Tasks({route, navigation}) {
  const [TaskName, setTaskName] = useState('');
  const [ShowInputBar, setShowInputBar] = useState(false);
  const [ShowDetailsBar, setShowDetailsBar] = useState(false);
  const [TasksDB, setTasksDB] = useState([]);
  const [CurrentTask, setCurrentTask] = useState(undefined); //?
  const [InputMode, setInputMode] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [OrderBy, setOrderBy] = useState('');

  const forceUpdate = React.useReducer(() => ({}))[1];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MyButton
          style={styles.headerButton}
          title={'Sortuj'}
          onPress={() => setModalVisible(true)}
        />
      ),
    });
  }, [modalVisible, navigation]);

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
  function _showModifyBar() {
    setShowDetailsBar(true);
  }
  function _hideModifyBar() {
    setShowDetailsBar(false);
  }

  function _inputBarConfirm() {
    //ADD NEW TASK
    if (InputMode === 0) {
      if (TaskName) {
        //insert new task to the DB
        db.transaction(function(tx) {
          tx.executeSql(
            `INSERT INTO list${
              currentList.current.id
            }(title, done) VALUES (?,?);`,
            [TaskName, false],
            function(tx1, res) {},
          );
        });
        setTaskName('');
        //_hideInputBar();
      }
    }
    //EDIT EXISTING LIST'S NAME
    else if (InputMode === 1) {
      if (TaskName) {
        if (CurrentTask) {
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
        `SELECT * FROM list${currentList.current.id}${OrderBy};`,
        [],
        function(_tx, res) {
          if (res.rows.length > 0) {
            let buffer = [];
            for (let i = 0; i < res.rows.length; i++) {
              buffer.push(res.rows.item(i));
            }
            setTasksDB(buffer);
          } else {
            setTasksDB([]);
          }
        },
      );
    });
  }

  //Reload lists when refreshing the DOM
  useEffect(() => {
    _getTasks();
  }, []);

  function _onPress(item) {
    setCurrentTask(item);
    db.transaction(function(tx) {
      tx.executeSql(
        `UPDATE list${currentList.current.id} SET done = ? WHERE id = ${
          item.id
        };`,
        [!item.done],
        function(tx1, res) {
          item.done = !item.done;

          // let index = TasksDB.findIndex(x => x.id === item.id);
          // let temp = TasksDB;
          // temp[index].done = !temp[index].done;
          // setTasksDB(temp);

          forceUpdate();
        },
      );
    });
  }

  function _onLongPress(item) {
    _showModifyBar();
    _hideInputBar();
    setCurrentTask(item);
  }

  function _addNewTask() {
    setInputMode(0);
    _showInputBar();
    _hideModifyBar();
  }

  function _editTaskName() {
    setInputMode(1);
    _showInputBar();
    _hideModifyBar();
  }

  //Delete selected lists from the DB
  function _deleteTask() {
    //delete selected task from list
    if (currentList.current.id) {
      db.transaction(function(tx) {
        tx.executeSql(
          `DELETE FROM list${currentList.current.id} WHERE id=?;`,
          [CurrentTask.id],
          function(tx2, res) {},
        );
      });
      setCurrentTask(undefined);
      _hideModifyBar();
      _getTasks();
    }
  }

  function _sortList(id) {
    //sort alphabetically A-Z
    if (id === 0) {
      setOrderBy(' ORDER BY title ASC');
    }
    //sort alphabetically Z-A
    else if (id === 1) {
      setOrderBy(' ORDER BY title DESC');
    }
    //sort by status - done first
    else if (id === 2) {
      setOrderBy(' ORDER BY done ASC');
    }
    //sort by status - undone first
    else if (id === 3) {
      setOrderBy(' ORDER BY done DESC');
    }
    //unspecified id
    else {
      console.log('sort error');
      setOrderBy('');
    }
    setModalVisible(false);

    _getTasks();
    //forceUpdate();
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
            value={TaskName}
          />
          <View style={styles.bar}>
            <MySmallButton
              title={'Potwierdź'}
              onPress={() => _inputBarConfirm()}
            />
            <MySmallButton title={'Anluj'} onPress={() => _inputBarCancel()} />
          </View>
        </View>
      )}

      {ShowDetailsBar && (
        <View style={styles.inputBar}>
          <View style={styles.bar}>
            <MySmallButton title={'Edytuj'} onPress={() => _editTaskName()} />
            <MySmallButton title={'Usuń'} onPress={() => _deleteTask()} />
          </View>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Sortowanie zadań</Text>
            <FlatList
              data={sortOptions}
              renderItem={({item}) => (
                <View>
                  <TouchableOpacity onPress={() => _sortList(item.id)}>
                    <Text style={styles.modalOption}>{item.text}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <MySmallButton
              title={'Anuluj'}
              onPress={() => setModalVisible(!modalVisible)}
              style={{marginTop: 20}}
            />
          </View>
        </View>
      </Modal>

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
  headerButton: {
    fontSize: 25,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 12,
  },
  modalView: {
    margin: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  modalText: {
    fontSize: 33,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '700',
  },
  modalOption: {
    fontSize: 23,
    marginBottom: 20,
    textAlign: 'center',
  },
});
