import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input, Icon } from 'react-native-elements'
import axios from 'axios'
import config from '../config'

const ChatroomScreen = ({navigation, route}) => {
  const chatroom = route.params.chatroom;
  const email = route.params.email;

  var ws = new WebSocket('ws://192.168.1.4:8080/chat/' + chatroom.id);

     ws.onmessage = (e) => {
       // a message was received
       console.log(e.data);
       axios.get(config.url + "/chatroom/getMessageHistory/" + chatroom.id).then((response)=>{
        console.log("onMesaż")
        setMessages(response.data)
        console.log(messages)
      })
     }; 
 
     ws.onerror = (e) => {
       // an error occurred
       console.log("ERROR");
       console.log(e.message);
     };
 
     ws.onclose = (e) => {
       // connection closed
       console.log("CLOSING");
       console.log(e);
       console.log(e.code, e.reason);
     };


  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [userId, setUserId] = useState(-1)

  useEffect(()=>{
    axios.get(config.url + "/chatroom/getMessageHistory/" + chatroom.id).then((response)=>{
      setMessages(response.data)
    })
    
    axios.get(config.url + "/user/getId/" + email).then((response_id)=>{
      setUserId(response_id.data)
    })
    
    console.log("update")
  }, []) 

  const sendMessage = () =>{
    if(message == ""){
      console.log("pusta wiadomosc nie wysylam")
    }else{
      console.log("wysylam")
      ws.send(JSON.stringify({"message":message, "chatroomId":parseInt(chatroom.id), "sender": email}));
    }
  }

       return (
        <View style={styles.container}>
          <View style={styles.title}>
          <Text>Awesome Chatroom with {userId}</Text>
          </View>
          <ScrollView style={styles.scrollView}>
            {
              messages.map((message, key)=>
              <View style = {message.user.id == userId ? styles.userMessageWrapper : styles.incomingMessageWrapper}>
                <View style = {message.user.id == userId ? styles.userMessage : styles.incomingMessage}>
                  <Text>{message.text}</Text> 
                </View>
              </View>
              )
          }
          </ScrollView>
          <View style={styles.input}>
            <Input style = {{  borderWidth: 1,
                              padding: 12,
                              borderColor:"grey",
                              flex: 1,
                              borderRadius: 25}} placeholder='Write something...' onChangeText={(text)=>setMessage(text)}/>
           <View style={{ width: "30%",
              backgroundColor: "green",
              borderRadius: 3,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50, marginBottom:30, padding:5}}><Button buttonStyle = {{backgroundColor:"green"}} title = {"Send"}onPress={()=>sendMessage()}/></View>
          </View>
        </View>
      )
      
    }
     
    export default ChatroomScreen;  

    const styles = StyleSheet.create({
      container: {
        flex:1
      },
      input:{
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:'center',
        width:'80%',
        paddingHorizontal: 15,
        marginLeft:'10%',
        marginTop:'auto'
      },
      userMessage:{

        padding:15,
        borderRadius: 10,
        backgroundColor: "#f5ccc2",
        width:'50%',
      },
      incomingMessage:{
        padding:15,
        borderRadius: 10,
        backgroundColor: "#86b38b",
        width:'50%'
      },
      userMessageWrapper:{
        alignItems:'flex-end',
        width:"100%",
        margin:2
      },
      incomingMessageWrapper:{
        alignItems:'flex-start',
        width:"100%",
        margin:2
      },
      title:{
        padding:20,
        backgroundColor:"green"
      },

    });
    
    