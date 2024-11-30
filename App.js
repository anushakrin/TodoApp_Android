/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import database from '@react-native-firebase/database';





function App() {

  const [inputTextValue, setInputTextValue] = useState(null);
  const [list, setList] = useState(null);

  const [isUpdateData, setIsUpdateData] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  useEffect(() => {
    getdb();
  }, []);

  const getdb = async () => {
    try {
      //const data = await database().ref("todo").once("value");
      // const data = await database().ref("todo").on("value",(tempData)=>{
      //   console.log(data);
      //   setList(tempData.val());
      // });
      const data = await database().ref('todo').on('value', (tempData) => {
        console.log(data);
        //setList(tempData.val());
        setList(tempData.val() || []); 
      });

      //setMyData(data.val());
    } catch (err) {
      console.log(err);

    }
  }

  const handleAddData = async () => {
    try {
      const index = list.length;
      const response = await database().ref(`todo/${index}`).set({
        value: inputTextValue
      });
      console.log(response);
      setInputTextValue('');
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateData = async () => {
    try {
      if (inputTextValue.length > 0) {
        const response = await database()
          .ref(`todo/${selectedCardIndex}`)
          .update({
            value: inputTextValue,
          });

        console.log(response);
        setInputTextValue('');
        setIsUpdateData(false);
      } else {
        alert('Please Enter Value & Then Try Again');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCardPress = (cardIndex, cardValue) => {
    try {
      setIsUpdateData(true);
      setSelectedCardIndex(cardIndex);
      setInputTextValue(cardValue);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCardLongPress = (cardIndex, cardValue) => {
    try {
      Alert.alert('Alert', `Are You Sure To Delete ${cardValue} ?`, [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel Is Press');
          },
        },
        {
          text: 'Ok',
          onPress: async () => {
            try {
              const response = await database()
                .ref(`todo/${cardIndex}`)
                .remove();

              setInputTextValue('');
              setIsUpdateData(false);
              console.log(response);
            } catch (err) {
              console.log(err);
            }
          },
        },
      ]);

      // setIsUpdateData(true);
      // setSelectedCardIndex(cardIndex);
      // setInputTextValue(cardValue);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar hidden={true}></StatusBar>
      <View>
        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 'bold', padding: 20 }}>TodoApp</Text>
        <TextInput
          style={styles.inputBox}
          placeholder='Enter any value'
          value={inputTextValue}
          onChangeText={(value) => setInputTextValue(value)}>
        </TextInput>

        {
          !isUpdateData ? (
            <TouchableOpacity style={styles.addButton} onPress={() => handleAddData()}>
              <Text style={{ color: "#fff" }}>ADD</Text>
            </TouchableOpacity>

          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => handleUpdateData()}>
              <Text style={{ color: "#fff" }}>UPDATE</Text>
            </TouchableOpacity>
          )
        }



      </View>

      <Text style={{ marginVertical: 20, fontSize: 20, fontWeight: 'bold' }}>Todo List</Text>

      <View style={styles.cardContainer}>


        <FlatList data={list} renderItem={(item) => {
          const cardIndex=item.index
          if (item.item !== null) {
            return (<TouchableOpacity style={styles.card} 
            onPress={()=>handleCardPress(cardIndex,item.item.value)}
            onLongPress={() =>
              handleCardLongPress(cardIndex, item.item.value)
            }>
              <Text>{item.item.value}</Text>
            </TouchableOpacity>)
          }
        }}></FlatList>

      </View>

    </View>
  );
}

const { height, width } = Dimensions.get("screen")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputBox: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
  },
  addButton: {
    backgroundColor: "blue",
    alignItems: "center",
    padding: 10,
    borderRadius: 50

  },
  cardContainer: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    width: width - 40,
    padding: 20,
    borderRadius: 30,
    marginVertical: 10,

  }

});


export default App;


