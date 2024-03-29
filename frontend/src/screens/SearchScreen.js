import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import config from "../config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { InstantSearch } from "react-instantsearch-native";
import algoliasearch from "algoliasearch/lite";
import { getRandomBytesAsync } from "expo-random";
import * as Crypto from "expo-crypto";
import { aesKey, encryptMessageWithRsa, generateAESKey } from "../EncryptionUtils";
import { enc, AES } from 'crypto-js';

const SearchScreen = ({ route, navigation }) => {
  const [users, setUsers] = useState([]);
  const [chatroomData, setChatroomData] = useState([]);
  const [query, setQuery] = useState("");
  const [otherUserPublicKey, setOtherUserPublicKey] = useState("")
  const [currentUserPublicKey, setCurrentUserPublicKey] = useState("")

  const email = route.params.email;
  const id = route.params.id;

  var ws = new WebSocket(config.WebSocketUrl + id);

  useEffect(() => {
    axios.get(config.url + "/user/getAll").then((response) => {
      setUsers(response.data);
    });
  }, []);

  const tryCreateChatroom = (user) => {

    const currentUser = {
      email: email,
    };
    const body = {
      users: [currentUser, user],
      chatroomName: user.email + " chat",
    };
    axios
      .post(config.url + "/chatroom/findChatroom", body)
      .then((response) => {
        navigation.navigate("Chatroom", { chatroom: response.data, id: id });
      })
      .catch((error) => {
          createChatroom(body, user);
      });
  };

  const getUserPublicKey = async (userId) => {
      const response = await axios.get(config.url + "/user/getPublicKey/" + parseInt(userId));
      if (response.status == 200) {
        return response.data;
      } else {
        console.log(response.status);
      }
  };
  
  const prepareKeys = async (user) =>{
    const key = generateAESKey()
    const temp_otherUserPublicKey = await getUserPublicKey(user.id);
    setOtherUserPublicKey(temp_otherUserPublicKey)
    const temp_currentUserPublicKey = await getUserPublicKey(id);
    setCurrentUserPublicKey(temp_currentUserPublicKey)
    return key
  }
  
  const createChatroom = async (body, user) => {
      const key = await prepareKeys(user);
      const aesKeyString = enc.Hex.stringify(key); 
      const otherUserEncryptedKey = await encryptMessageWithRsa(aesKeyString, otherUserPublicKey);
      const currentUserEncryptedKey = await encryptMessageWithRsa(aesKeyString, currentUserPublicKey);
      const response = await axios.post(config.url + "/chatroom/createChatroom", body);
      if (response.status === 200) {
        const chatroomData = response.data;
        const accessibilityBody = [
          {
            userId: user.id,
            chatroomId: chatroomData.id,
            encryptedKey: otherUserEncryptedKey,
          },
          {
            userId: id,
            chatroomId: chatroomData.id,
            encryptedKey: currentUserEncryptedKey,
          },
        ];
        const accessibilityResponse = await axios.post(config.url + "/chatroom/accessibility", accessibilityBody);
        if (accessibilityResponse.status === 200) {
          navigation.navigate("Chatroom", {
            chatroom: chatroomData,
            email: email,
            id: id,
          });
        }
      }

  };
  


  const search = () => {
    console.log(query);
    axios.post(config.url + "/user/search", query).then((response)=>{
      setUsers(response.data)
    });
    
  };


  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          justifyContent: "space-between",
          width: "100%",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            alignSelf: "flex-start",
            justifyContent: "center",
            width: "30%",
            marginVertical: "2%",
            left: "10%",
          }}
        >
       <Icon name="account-circle" size={40} color={config.whiteBackground}/>
        </View>
        <View
          style={{
            width: "60%",
            height: 40,
            alignSelf: "flex-end",
            alignItems: "flex-end",
            backgroundColor: config.whiteBackground,
            borderWidth: 2,
            borderColor: "white",
            borderRadius: 30,
            right: "15%",
            bottom: "2.5%",
          }}
        >
          <TextInput
            placeholder="Search"
            style={{
              alignSelf: "flex-start",
              top: "10%",
              width: "80%",
              left: "2%",
            }}
            autoFocus={true}
            onChangeText={(text) => setQuery(text)}
          />
          <Pressable
            style={{ top: "-70%", right: "3%" }}
            onPress={() => search()}
          >
            <Icon name={"magnify"} size={30} />
          </Pressable>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={{ left: "3%" }}>Avaiable users:</Text>
        <ScrollView>

            {users.map((user, key) =>
              user.email != email ? (
                <Pressable
                  onPress={() => tryCreateChatroom(user)}
                  style={styles.users}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      width: "100%",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        alignSelf: "flex-start",
                        justifyContent: "center",
                        width: "30%",
                      }}
                    >
                    <Icon name="account-circle" size={70} color={config.secondaryColorDark}/>
                    </View>
                    <Text style={{ alignSelf: "center", width: "70%" }}>
                      {user.name+ " " + user.surname}
                    </Text>
                  </View>
                </Pressable>
              ) : (
                <></>
              )
            )}

        </ScrollView>
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: config.whiteBackground,
    paddingTop: "5%",

    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    width: "100%",
    height: "100%",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: config.primaryColor,
    paddingTop: "10%",
  },
  chatroom: {
    padding: 7,
    backgroundColor: config.greyBackground,

    borderRadius: 30,
    margin: 5,
  },
  users: {
    padding: 5,
    backgroundColor: config.greyBackground,
    borderRadius: 20,
    margin: 2,
    justifyContent: "space-between",
  },
  pressedChatroom: {
    padding: 20,
    backgroundColor: "darkblue",
    paddingHorizontal: "30%",
    borderRadius: 20,
    margin: 2,
  },
});

/*

   <Text>Avaiable users:</Text>
        <ScrollView>
          {users.map((user, key) =>
            user.email != email ? (
              <Pressable
                onPress={() => tryCreateChatroom(user)}
                style={styles.users}
              >
                <Text>{user.email}</Text>
              </Pressable>
            ) : (
              <></>
            )
          )}
        </ScrollView>
     

*/
