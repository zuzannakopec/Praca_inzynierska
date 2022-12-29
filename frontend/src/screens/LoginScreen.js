import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input } from 'react-native-elements'
import axios from 'axios'
import config from '../config'


const LoginScreen = ({navigation}) => {

    const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}$/

    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [errorVisibility, setErrorVisibility] = useState(false)

    const validate = () => {
        console.log("validate")
        login(email, password);
    }

    const login = (email, password) =>{
        /*const request = {
            "email": email,
            "password": password,
        }
        axios.post(config.url + "/user/login", request).then((response)=>{
            console.log(response)
            if(response.status == 200){
                navigation.navigate("Home")
            }
            setErrorMessage("User with provided credentials does not exist.")
            setErrorVisibility(true)
        })*/
        navigation.navigate("Home", {email: email})
    }
  return (
    <View style={styles.container}>
      <Text>Awesome Login</Text>
      <Input placeholder='Email' onChangeText={(text)=>setEmail(text)}/>
      <Input placeholder='Password' onChangeText={(text)=>setPassword(text)}/>

      <Button title={"Login"}  
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
              onPress={()=>validate()}
              />

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
              onPress={()=>navigation.navigate("Register")}/>
              
      <StatusBar style="auto" />
    </View>
  )
  
}
 
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})


