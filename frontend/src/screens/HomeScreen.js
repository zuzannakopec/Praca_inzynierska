import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import config from '../config';
import Icon from 'react-native-ionicons'

const HomeScreen = ({route, navigation}) => {
  const [chatrooms, setChatrooms] = useState([])
  const [users, setUsers] = useState([])
  const[chatroomData, setChatroomData] = useState([])
  let temp_chatroomData = []
  const email = route.params.email;

  useEffect(()=>{
    axios.get(config.url + "/chatroom/getChatrooms").then((response)=>{
      setChatrooms(response.data)
    })
    chatrooms.forEach(chatroom => {
      axios.get(config.url + "/chatroom/getLastMessage/" + chatroom.id).then((response) => {
        console.log("AA", response.data.text)
        temp_chatroomData.push({"chatroom": chatroom, 
        "lastMessage":response.data.text})
      })
      setChatroomData(temp_chatroomData)
      console.log(temp_chatroomData)
    })
  }, [])

  useEffect(()=>{
    axios.get(config.url + "/user/getAll").then((response)=>{
      setUsers(response.data)
    })
  }, [])
  

  const tryCreateChatroom = (user) => {
    const currentUser ={
      "email":email
    }
    const body = {
        "users":[currentUser, user],
        "chatroomName":user.email + " chat"
    }
    axios.post(config.url + "/chatroom/findChatroom", body).then((response)=>{

      navigation.navigate("Chatroom", {"chatroom":response.data})
    }).catch((error) =>{
        createChatroom(body)
      
    })
  }

  const createChatroom = (body) => {
    axios.post(config.url + "/chatroom/createChatroom", body).then((response) =>{
      if(response.status == 200){
        navigation.navigate("Chatroom", {"chatroom":response.data, "email":email})
      }
    }) 
  }

  const openChatroom = (chatroom) => {
    axios.get(config.url + "/chatroom/openChatroom/" + chatroom.id).then((response) =>{
        if(response.status == 200){
          navigation.navigate("Chatroom", {"chatroom":response.data, "email":email})
        }

    })
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={{alignSelf:'flex-end', paddingRight:'5%'}}>{config.appName}</Text>
      <View style={styles.container}>
        <Text>Your chatrooms:</Text>
        <ScrollView>
        {
        chatrooms.length!=0? 
          chatroomData.map((chatroomData, key)=>
            chatroomData.chatroom.users[0].email == email ||  chatroomData.chatroom.users[1].email == email?
            <Pressable onPress = {() => openChatroom(chatroomData.chatroom)} style={(pressed) =>
              pressed?
              styles.chatroom :
              styles.pressedChatroom
            }>
                <Icon name="add" />
                <Text>{chatroomData.chatroom.users[0].email}</Text> 
                <Text style={{color:'grey'}}>{JSON.stringify(chatroomData.lastMessage)}</Text> 
            </Pressable>
                :
                <></> 
                ) 
          : 
          <Text>You don't have any chatrooms yet!</Text>
        }
        </ScrollView>
        <Text>Avaiable users:</Text>
        <ScrollView>
      {
        users.map((user, key)=>
          user.email != email?
          <Pressable  onPress = {() => tryCreateChatroom(user)} style={styles.users} >
            <Text>{user.email}</Text>
          </Pressable>
              :<></>)
      }
      </ScrollView>

      </View>
    </View>
  );
  
}
 
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop:'15%',

    borderWidth:4,
    borderColor:'#a5e6e1',
    borderRadius:30,
  },
  mainContainer:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#a5e6e1',
    paddingTop:'15%'
  },
  chatroom:{
    padding:20,
    backgroundColor:'lightblue',
    paddingHorizontal:'30%',
    borderRadius:20,
    margin:2,
    justifyContent:'space-between'
  },
  users:{
    padding:20,
    backgroundColor:'lightgreen',
    paddingHorizontal:'30%',
    borderRadius:20,
    margin:2,
    justifyContent:'space-between'
  },
  pressedChatroom:{
    padding:20,
    backgroundColor:'darkblue',
    paddingHorizontal:'30%',
    borderRadius:20,
    margin:2,
  }
});



