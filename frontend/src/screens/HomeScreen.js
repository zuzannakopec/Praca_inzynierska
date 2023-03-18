import axios from "axios";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image
} from "react-native";
import config from "../config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const HomeScreen = ({ route, navigation }) => {
  const [users, setUsers] = useState([]);
  const [chatroomsData, setChatroomsData] = useState([]);
  const [chatroomResponse, setAllChatroomResponse] = useState([])
  const [chatroomDataLoaded, setChatroomDataLoaded] = useState(false)
  const email = route.params.email;
  const id = route.params.id;
  let ws = new WebSocket(config.WebSocketUrl + id);



  useEffect(() => {
    let asyncEffect = async () => {
      axios.get(
        config.url + "/chatroom/getChatrooms"
      ).then((response) => {
        setChatroomsData(response.data)
        setChatroomDataLoaded(true)
      })
    };
    asyncEffect();

  }, []);

  useEffect(() => {
    let getUsers = async () => {
      axios.get(config.url + "/user/getAll").then((response) => {
        setUsers(response.data);
      });  
    }
    getUsers()
  }, []);


  const openChatroom = (chatroom) => {
    axios
      .get(config.url + "/chatroom/openChatroom/" + chatroom.id)
      .then((response) => {
        if (response.status == 200) {
          navigation.navigate("Chatroom", {
            chatroom: response.data,
            email: email,
            id: id
          });
        }
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
          <Pressable
            onPress={() =>
              navigation.navigate("Settings", { email: email, id: id, Websocket:ws })
            }
          >
           <Icon name="account-circle" size={50} color={config.whiteBackground}/>
          </Pressable>
        </View>
        <Pressable
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
          onPress={() => navigation.navigate("Search", { email: route.params.email, id: route.params.id})}
        >
          <Icon name={"magnify"} size={30} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <ScrollView>

          {
             chatroomsData.map((chatroomData, key) => {
                if (chatroomData && chatroomData.users) {
              const chatroomUsers = chatroomData.users;
              if (
                chatroomUsers[0].email === email ||
                chatroomUsers[1].email === email
              )
              {
                return (
                  <Pressable
                    key={key}
                    onPress={() => openChatroom(chatroomData)}
                    style={(pressed) =>
                      pressed ? styles.chatroom : styles.pressedChatroom
                    }
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
                    <Icon name="account-circle" size={70} color={config.whiteBackground}/>
                    </View>
                    <View style={{ alignSelf: "center", width: "70%" }}>
                      <Text>{chatroomData.users[0].email == email? chatroomData.users[1].name +" "+ chatroomData.users[1].surname : chatroomData.users[0].name +" "+ chatroomData.users[0].surname }</Text>
                      <Text style={{ color: "grey" }}>
                      
                      </Text>
                      
                    </View>
                  </View>
                  </Pressable>
                );
              }}}
             )}
          
        {/*
        
         JSON.stringify(chatroomData.lastMessage)
        
        chatroomDataLoaded ? (
        chatroomsData.map((chatroomData, key) => {
          if (chatroomData && chatroomData.users) {
            const chatroomUsers = chatroomData.chatroom.users;
            if (
              chatroomUsers[0].email === email ||
              chatroomUsers[1].email === email
            ) {
              return (
                <Pressable
                  key={key}
                  onPress={() => openChatroom(chatroomData.chatroom)}
                  style={(pressed) =>
                    pressed ? styles.chatroom : styles.pressedChatroom
                  }
                >
                 
                </Pressable>
              );
            }
          }
          return null;
        })
      ) : (
        <Text>You don't have any chatrooms yet!</Text>
      )*/}</ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;

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
    padding: 20,
    backgroundColor: "lightgreen",
    paddingHorizontal: "30%",
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
