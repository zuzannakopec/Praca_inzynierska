import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Button, Input } from "react-native-elements";
import axios from "axios";
import config from "../config";
import * as SecureStore from "expo-secure-store";
import { generateRsaKeyPair } from "../EncryptionUtils";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorVisibility, setErrorVisibility] = useState(false);

  const validate = () => {
    console.log(email, password, secondPassword);
    console.log("validate");
    register(email, password, secondPassword);
  };

  const register = async (email, password, secondPassword) => {
    const { publicKey, privateKey } = await generateRsaKeyPair()
    const request = {
      email: email,
      password: password,
      secondPassword: secondPassword,
      publicKey: publicKey
    };
    axios.post(config.url + "/user/register", request).then((response) => {
      if (response.status == 200) {
        SecureStore.setItemAsync("privateKey", privateKey)
        navigation.navigate("RegisterDetails", { email: email });
      }
    });
  };


  return (
    <View style={styles.container}>
      <View
        style={{
          height: "30%",
          width: "100%",
          position: "absolute",
          top: 0,
          backgroundColor: config.primaryColor,
        }}
      ></View>
      <View style={styles.headerContainer}></View>
      <Text style={{color:config.greyBackground, fontSize:24, marginBottom:10}}>Register</Text>
      <View style={styles.textBlock}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Repeat password"
          onChangeText={(text) => setSecondPassword(text)}
        />
        <TextInput style={styles.input} placeholder="Company code" />
      </View>
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
        onPress={() => validate()}
      />

      <StatusBar style="auto" />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    height: 400,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    width: 300,
    height: 300,
    backgroundColor: config.primaryColor,
    transform: [{ rotate: "45deg" }],
    alignItems: "center",
    position: "absolute",
    top: "12%",
  },
  input: {
    height: 50,
    width: "95%",
    margin: 15,
    borderWidth: 2,
    borderColor: config.secondaryColorDark,
    padding: 10,
    borderRadius: 20,
  },
});
