import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import { Button, Input } from "react-native-elements";
import axios from "axios";
import config from "../config";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

const SettingsScreen = ({ route, navigation }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [position, setPosition] = useState("");
  const errorMessages = ["Name field is not filled", "Surname field is not filled", "Position field is not filled"]
  const [error1Visibility, setError1Visibility] = useState(false);
  const [error2Visibility, setError2Visibility] = useState(false);
  const [error3Visibility, setError3Visibility] = useState(false);
  const [image, setImage] = useState("");

  const validate = () => {
    setError1Visibility(false)
    setError2Visibility(false)
    setError3Visibility(false)
    
    if(name.length == 0){
        setError1Visibility(true)
        return
    }
    if(surname.length == 0){
        setError2Visibility(true)
        return
    }
    if(position.length == 0){
        setError3Visibility(true)
        return
    }

    register(name, surname, position);
  };

  const register = (name, surname, position) => {
    console.log("AAA");
    const request = {
      name: name,
      surname: surname,
      position: position,
    };
    axios.post(config.url + "/user/update", request).then((response) => {
      if (response.status == 200) {
        navigation.navigate("RegisterDetails", {
          email: email,
          id: response.data.id,
        });
      }
    });
  };
  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const logout = async () => {
    await clearStorage()
    navigation.navigate("Login")
  }

 const  clearStorage = async() => {
    await SecureStore.deleteItemAsync("token")
    await SecureStore.deleteItemAsync("userId")
    await SecureStore.deleteItemAsync("email")
}

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
      <Text>Set user details</Text>
      <View style={styles.textBlock}>
        <View style={{ justifyContent: "space-between",width:'100%' }}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100, borderRadius: 200 }}
            />
          )}
          <Button
            buttonStyle={{
              backgroundColor: config.secondaryColorDark,
              borderWidth: 2,
              borderColor: "white",
              borderRadius: 30,
            }}
            containerStyle={{
                width: 150,
                alignSelf:'flex-end'
              }}
            title="Choose Photo"
            onPress={handleChoosePhoto}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(text) => setName(text)}
        />
        {error1Visibility && (
            <Text style={{color:'red'}}>{errorMessages[0]}</Text>
          )}
        <TextInput
          style={styles.input}
          placeholder="Surname"
          onChangeText={(text) => setSurname(text)}
        />
        {error2Visibility && (
            <Text style={{color:'red'}}>{errorMessages[1]}</Text>
          )}
        <TextInput
          style={styles.input}
          placeholder="Position"
          onChangeText={(text) => setPosition(text)}
        />
        {error3Visibility && (
            <Text style={{color:'red'}} >{errorMessages[2]}</Text>
          )}
      </View>
      <Button
        title={"Save"}
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

    <Button
        title={"Logout"}
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
        onPress={() => logout()}
      />

      <StatusBar style="auto" />
    </View>
  );
};

export default SettingsScreen;

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
    height: "60%",
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
    height: "13%",
    width: "95%",
    margin: 15,
    borderWidth: 2,
    borderColor: config.secondaryColorDark,
    padding: 10,
    borderRadius: 20,
  },
});
