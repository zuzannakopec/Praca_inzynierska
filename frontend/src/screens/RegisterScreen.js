import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import axios from 'axios'
import config from '../config'

const RegisterScreen = ({navigation}) => {
    
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [secondPassword, setSecondPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorVisibility, setErrorVisibility] = useState(false)

  const validate = () => {
    console.log(email, password, secondPassword)
    console.log("validate")
    register(email, password, secondPassword);
}

  const register = (email, password, secondPassword) =>{
    console.log("AAA")
      const request = {
        "email":email,
        "password":password,
        "secondPassword":secondPassword
      }
      axios.post(config.url + "/user/register", request).then((response)=>{
        console.log("AAA")
        console.log(response.data);
      }) 
  }

  return (
    <View style={styles.container}>
      <Text>Awesome registration</Text>

      <Input placeholder='Email' onChangeText={(text)=>setEmail(text)}/>
      <Input placeholder='Password' onChangeText={(text)=>setPassword(text)}/>
      <Input placeholder='Repeat password' onChangeText={(text)=>setSecondPassword(text)}/>
      <Input placeholder='Company code'/>
     
         <Button title={"Register"}  
              buttonStyle={{
                backgroundColor: 'black',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 30,
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              titleStyle={{ fontWeight: 'bold' }}
              onPress={()=>validate()}/>
              
      <StatusBar style="auto" />
    </View>
  );
  
}
 
export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



 /*  
 var ws = new WebSocket('ws://192.168.1.20:8080/ws');
 ws.onopen = () => {
      // connection opened
      ws.send('something'); // send a message
    };

    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
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
    };*/