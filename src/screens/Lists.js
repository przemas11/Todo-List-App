import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Button
} from 'react-native'
import { useNavigation } from '@react-navigation/native';

const tmp = [
  {key: '1', title:'Test1'},
  {key: '2', title:'Test2'},
  {key: '3', title:'Test3'},
  {key: '4', title:'Test4'},
  {key: '5', title:'Test5'},
  {key: '6', title:'Test6'},
  {key: '7', title:'Test7'},
  {key: '8', title:'Test8'},
  {key: '9', title:'Test9'},
  {key: '10', title:'Test10'},
  {key: '11', title:'Test11'},
  {key: '12', title:'Test12'},
  {key: '13', title:'Test13'},
]

export default class Lists extends Component {
  _onPress = item => {
    console.log("Pressed");
    console.log(item);
  }
  
  _onLongPres = item => {
    console.log("Long pressed");
    console.log(item);
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.bar}>
          <TouchableOpacity onPress={() => console.log("Add")}>
            <Text style={styles.button}>ADD</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Delet")}>
            <Text style={styles.button}>DELET</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tmp}
          renderItem={({item}) => (
            <View style={styles.view}>
            <TouchableOpacity
              onPress={this._onPress.bind(this, item)}
              onLongPress={this._onLongPres.bind(this, item)}
            >
              <Text style={styles.item}>
                {item.title}
              </Text>
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
    )
  }
}

const styles = StyleSheet.create({
  bar: {
    //height: 60,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //borderBottomWidth: 1,
  },
  button: {
    fontSize: 40,
    backgroundColor: '#65c7f5',
    borderWidth: 1,
    borderColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view: {
    borderBottomWidth: 1,
    borderColor: '#444'
  },
  item: {
    padding: 10,
    fontSize: 30,
    height: 60,
    
  },
})
