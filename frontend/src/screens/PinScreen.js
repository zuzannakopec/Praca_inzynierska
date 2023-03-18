import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'react-native-elements'
import axios from 'axios'
import config from '../config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import PinView from 'react-native-pin-view'
import * as SecureStore from "expo-secure-store";
import { decryptMessageWithRsa, encryptMessageWithRsa } from '../EncryptionUtils'


const PinScreen = ({navigation}) => {
    const pinView = useRef(null)
    const [showRemoveButton, setShowRemoveButton] = useState(false)
    const [enteredPin, setEnteredPin] = useState("")
    const [showCompletedButton, setShowCompletedButton] = useState(false)
    const [userIdFromStorage, setUserIdFromStorage] = useState("");
    const [emailFromStorage, setEmailFromStorage] = useState("")
    const [currentUserPublicKey, setCurrentUserPublicKey] = useState("")
    const [currentUserPrivateKey, setCurrentUserPrivateKey] = useState("")
    const [token, setToken] = useState("")
    const [privateKeyLoaded, setPrivateKeyLoaded] = useState(false)

    const getInfoFromStorage = async () => {
      let userId = await SecureStore.getItemAsync("userId");
      setUserIdFromStorage(userId)
      let tempEmail = await SecureStore.getItemAsync("email");
      setEmailFromStorage(tempEmail)
      let temp = await SecureStore.getItemAsync("token");
      setToken(temp)
      let key = await SecureStore.getItemAsync("privateKey");
      if(key!= null){
        setPrivateKeyLoaded(true)
        setCurrentUserPrivateKey(key)
      }

      console.log(currentUserPrivateKey)
    }

    useEffect(() => {
      if (enteredPin.length > 0) {
        setShowRemoveButton(true)
      } else {
        setShowRemoveButton(false)
      }
      if (enteredPin.length === 6) {
        setShowCompletedButton(true)
      } else {
        setShowCompletedButton(false)
      }
    }, [enteredPin])
    
    const getUserPublicKey = async (userId) => {
      console.log(token)
      const response = await axios.get(config.url + "/user/getPublicKey/" + parseInt(userId), {headers:{Authorization: `Bearer ${token}`}});
      if (response.status == 200) {
        return response.data;
      } else {
        console.log(response.status);
      }
  };
  
  const goToLogin = async() =>{
    await SecureStore.deleteItemAsync("token")
    navigation.navigate("Login")
  }
  const prepareKey = async (id) =>{
    const temp_currentUserPublicKey = await getUserPublicKey(id);
    setCurrentUserPublicKey(temp_currentUserPublicKey)
  }
  const validatePin = async () =>{
    await getInfoFromStorage()
    await prepareKey(parseInt(userIdFromStorage))
    const request = {
      "id": parseInt(userIdFromStorage),
    }
    console.log(request)
    await axios.post(config.url + "/user/pin", request, {headers:{Authorization: `Bearer ${token}`}})
    .then(async (response)=>{
      if(response.status == 200){ 
        let decryptedPin = await decryptMessageWithRsa(response.data, currentUserPrivateKey)
        if(enteredPin == decryptedPin){
          console.log(emailFromStorage, userIdFromStorage)
          navigation.navigate("Home", {email: emailFromStorage, id: userIdFromStorage})
        }
      }
    })
    .catch((error)=>{
      console.log("aa")
      if(error.response.status == 401){
        console.log("aa")
        Alert.alert("Your session has expired, please log in again.")
      }
    })}
  
    return ( <View style={styles.container}>
      <View style={styles.headerContainerPin}></View>
      <Text>Enter pin</Text>
      <PinView  inputSize={32}
              ref={pinView}
              pinLength={6}
              buttonSize={60}
              onValueChange={value => setEnteredPin(value)}
              buttonAreaStyle={{
                marginTop: 0
              }}
              inputAreaStyle={{
                marginBottom: 12,
              }}
              inputViewEmptyStyle={{
              }}
              inputViewFilledStyle={{
                backgroundColor: config.secondaryColorDark,
              }}
              buttonViewStyle={{
                borderWidth: 1,
                borderColor: "#9ea1a3",
                backgroundColor:"#9ea1a3"
              }}
              buttonTextStyle={{
                color: "#FFF",
              }}
              onButtonPress={key => {
                if (key === "custom_left") {
                  pinView.current.clear()
                }
                if (key === "custom_right") {
                  alert("Entered Pin: " + enteredPin)
                }
              }}
  
      />
      <View style={{    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",}}>
      {showRemoveButton ? <Button title={"Remove"}    buttonStyle={{
                backgroundColor: config.secondaryColorDark,
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 30,
                alignItems:"flex-start"
              }}
              onPress={()=>{
                pinView.current.clear()
              }}
              />  : undefined}
              {showCompletedButton ? <Button title={"Login"} onPress={async ()=>await validatePin()} buttonStyle={{
                backgroundColor: config.secondaryColorDark,
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 30,
                alignItems:"flex-end"
              }}/> : undefined}
              </View>

              <Button title={"Return to login page"} onPress={()=>goToLogin()} buttonStyle={{
                backgroundColor: config.secondaryColorDark,
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 30,
                alignItems:"flex-end" 
              }}/>
      </View>  
  
  
              
     
   )
  
  
  }


  

  export default PinScreen;

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    }, 
    textBlock:{
      backgroundColor: config.whiteBackground,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      
      elevation: 5,
      borderRadius: 20,
      width:'90%',
      height:'30%',
      padding:20,
      alignItems:"center",
  
    },
    headerContainer:{
      width:300,
      height:300,
      backgroundColor:config.primaryColor,
      transform: [{ rotate: "45deg" }],
      alignItems:"center"
    },
    headerContainerPin:{
      top:"-20%",
      width:300,
      height:300,
      backgroundColor:config.primaryColor,
      transform: [{ rotate: "45deg" }],
      alignItems:"center",
      marginBottom:'-10%'
    },
    input: {
      height: "30%",
      width:'95%',
      margin: 15,
      borderWidth: 2,
      borderColor:config.secondaryColorDark,
      padding: 10,
      borderRadius: 20,
      
    },
  })
  
  
  