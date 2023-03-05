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
import { encryptMessageWithRsa } from "../EncryptionUtils";

const SearchScreen = ({ route, navigation }) => {
  const [users, setUsers] = useState([]);
  const [chatroomData, setChatroomData] = useState([]);
  const [query, setQuery] = useState("");
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

  const getUserPublicKey = (userId) => {
    axios.get(config.url + "user/getPublicKey/" + userId).then((response) => {
      if (response.status == 200) {
        return response.data;
      } else {
        console.log(response.status);
      }
    });
  };

  const createChatroom = async (body, user) => {
    const key = await generateAESKey();
    const otherUserPublicKey = getUserPublicKey(user.id);
    const currentUserPublicKey = getUserPublicKey(id);
    const otherUserEncryptedKey = encryptMessageWithRsa(
      key,
      otherUserPublicKey
    );
    const currentUserEncryptedKey = encryptMessageWithRsa(
      key,
      currentUserPublicKey
    );

    console.log("creating chatroom");
    axios
      .post(config.url + "/chatroom/createChatroom", body)
      .then((response) => {
        if (response.status == 200) {
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
          axios
            .post(config.url + "/chatroom/accessibility", accessibilityBody)
            .then(() => {
              navigation.navigate("Chatroom", {
                chatroom: chatroomData,
                email: email,
                id: id,
              });
            });
        }
      });
  };

  const generateAESKey = async () => {
    const keyBytes = await getRandomBytesAsync(32); // Generate a 32-byte (256-bit) key
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      keyBytes.toString()
    );
    return key;
  };

 
  const searchClient = algoliasearch(
    "YourApplicationID",
    "YourSearchOnlyAPIKey"
  );

  const search = () => {
    console.log(query);
    console.log("searc");
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
          <Image
            source={require("../../assets/person.png")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 200,
            }}
          />
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
          <InstantSearch searchClient={searchClient} indexName="instant_search">
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
                      <Image
                        source={require("../../assets/person.png")}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 200,
                        }}
                      />
                    </View>
                    <Text style={{ alignSelf: "center", width: "70%" }}>
                      {user.email}
                    </Text>
                  </View>
                </Pressable>
              ) : (
                <></>
              )
            )}
          </InstantSearch>
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
