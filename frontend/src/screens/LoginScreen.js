import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "react-native-elements";
import axios from "axios";
import config from "../config";
import PinScreen from "./PinScreen";
import * as SecureStore from "expo-secure-store";
import { RSA } from 'react-native-rsa-native';
import { generateRsaKeyPair } from "../EncryptionUtils";


const LoginScreen = ({ navigation }) => {
  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}$/;
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [emailFromStorage, setEmailFromStorage] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  const validate = () => {
    login(email, password);
  };

  const CheckIfTokenValid = async () => {
    let userIdFromStorage = await SecureStore.getItemAsync("userId");
    setUserId(userIdFromStorage);
    let tempEmail = await SecureStore.getItemAsync("email");
    setEmailFromStorage(tempEmail);
    let token = await SecureStore.getItemAsync("token");
    if (token) {
      setIsTokenValid(true);
    }
  };

  const login = (email, password) => {
    const request = {
      email: email,
      password: password,
    };
    axios.post(config.url + "/user/login", request, {headers:{'Content-Type':'application/json'}}).then(async (response) => {
      if (response.status == 200) {
        await SecureStore.setItemAsync("token", response.data.jwt);
        await SecureStore.setItemAsync(
          "userId",
          JSON.stringify(response.data.id)
        );
        await SecureStore.setItemAsync("email", response.data.email);
        navigation.navigate("Home", { email: email, id: response.data.id });
      }
      setErrorMessage("User with provided credentials does not exist.");
      setErrorVisibility(true);
    });
  };

  CheckIfTokenValid();

  return (
   // <>
  //    {isTokenValid ? (
   //     <PinScreen navigation={navigation} />
  //    ) : (
        <View style={styles.container}>
          <View
            style={{
              height: "50%",
              width: "100%",
              position: "absolute",
              top: 0,
              backgroundColor: config.primaryColor,
            }}
          ></View>
          <View style={styles.headerContainer}></View>
          <View style={styles.textBlock}>
            <TextInput
              placeholder="Email"
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <Button
            title={"Login"}
            buttonStyle={{
              backgroundColor: config.secondaryColorDark,
              borderWidth: 2,
              borderColor: "white",
              borderRadius: 30,
            }}
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 20,
            }}
            titleStyle={{ fontWeight: "bold" }}
            onPress={() => validate()}
          />

          <Button
            title={"Register"}
            buttonStyle={{
              backgroundColor: config.secondaryColorDark,
              borderWidth: 2,
              borderColor: "white",
              borderRadius: 30,
            }}
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
            titleStyle={{ fontWeight: "bold" }}
            onPress={() => navigation.navigate("Register")}
          />

          <StatusBar style="auto" />
        </View>
  //    )}
 //   </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
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
    width: "90%",
    height: "30%",
    padding: 20,
    alignItems: "center",
  },
  headerContainer: {
    width: 300,
    height: 300,
    backgroundColor: config.primaryColor,
    transform: [{ rotate: "45deg" }],
    alignItems: "center",
  },
  headerContainerPin: {
    top: "-10%",
    width: 300,
    height: 300,
    backgroundColor: config.primaryColor,
    transform: [{ rotate: "45deg" }],
    alignItems: "center",
  },
  input: {
    height: "30%",
    width: "95%",
    margin: 15,
    borderWidth: 2,
    borderColor: config.secondaryColorDark,
    padding: 10,
    borderRadius: 20,
  },
});
