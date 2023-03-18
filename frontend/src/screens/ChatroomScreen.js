import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Switch } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Button, Input, Icon, colors } from "react-native-elements";
import axios from "axios";
import config from "../config";
import * as SecureStore from "expo-secure-store";
import CppCodeFormatter from "../components/CppCodeFormatter";
import PythonCodeFormatter from "../components/PythonCodeFormatter";
import JavaScriptCodeFormatter from "../components/JavaScriptCodeFormatter";
import { decryptMessageWithAES, decryptMessageWithRsa, encryptMessageWithAES } from "../EncryptionUtils";

const ChatroomScreen = ({ navigation, route }) => {
  const chatroom = route.params.chatroom;
  const userId = route.params.id;
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(config.WebSocketUrl + userId);
    setWebSocket(ws);
    return () => {
      ws.close();
    };
  }, [userId]);

  useEffect(() => {
    if (webSocket) {
      const intervalId = setInterval(() => {
        if (webSocket.readyState === WebSocket.CLOSED) {
          const ws = new WebSocket(config.WebSocketUrl + userId);
          setWebSocket(ws);
        }
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [webSocket, userId]);
  const scrollViewRef = useRef();
  const inputRef = useRef();

  const [isCppEnabled, setIsCppEnabled] = useState(false);
  const toggleSwitchCpp = () => setIsCppEnabled(previousState => !previousState);

  const [isPythonEnabled, setIsPythonEnabled] = useState(false);
  const toggleSwitchPython = () => setIsPythonEnabled(previousState => !previousState);

  const [isJsEnabled, setIsJsEnabled] = useState(false);
  const toggleSwitchJs = () => setIsJsEnabled(previousState => !previousState);


  const [encryptedMessages, setEncryptedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUserEncryptedKey, setCurrentUserEncryptedKey] = useState("")
  const [encryptionKey, setEncryptionKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [privateKeyLoaded, setPrivateKeyLoaded] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false)

  useEffect(() => {
    axios
      .get(config.url + "/chatroom/accessibility/" + userId + "/" + chatroom.id)
      .then((response) => {
        setCurrentUserEncryptedKey(response.data.encryptedKey)
        getPrivateKey()
      })
  }, [])
  
  useEffect(() => {
    let getHistory = async () =>{
      axios
      .get(config.url + "/chatroom/getMessageHistory/" + chatroom.id)
      .then(async (response) => {
        setEncryptedMessages(response.data);
      });
      console.log(messages)
    }
    getHistory()
  },[chatroom.id]);

  useEffect(() => {
    decryptMessages();
  }, [encryptedMessages]);

  
  useEffect(() => {
    if (privateKeyLoaded && currentUserEncryptedKey !== "" && encryptionKey !== "") {
      decryptAESKey()
    }
  }, [privateKeyLoaded, currentUserEncryptedKey, encryptionKey])
  
  const getPrivateKey = async () => {
    let key = await SecureStore.getItemAsync("privateKey")
    setPrivateKey(key)
    setPrivateKeyLoaded(true)
  }
  
  const decryptAESKey = async () => {
    let key = await decryptMessageWithRsa(currentUserEncryptedKey, privateKey)
    setEncryptionKey(key)
  }
  
  const decryptMessages = async () => {
    if (encryptedMessages.length > 0) {
      const decryptedMessages = await Promise.all(
        encryptedMessages.map(async (message) => {
          const decryptedMessage = await decryptMessageWithAES(message.text, encryptionKey);
          console.log("DECRYPTED TEXT " + decryptedMessage);
          message.text = decryptedMessage;
          return message;
        })
      );
      setMessagesLoaded(true)
      setMessages(decryptedMessages);
    }
  };
  

  const sendMessage = async () => {
    console.log("SEND");
    if (message !== "") {
      const encryptedMessage = await encryptMessageWithAES(message, encryptionKey);
      if (isCppEnabled) {
        webSocket.send(
          JSON.stringify({
            message: encryptedMessage,
            chatroomId: parseInt(chatroom.id),
            codeType: "cpp",
            isCode: true,
          })
        );
      } else if (isJsEnabled) {
        webSocket.send(
          JSON.stringify({
            message: encryptedMessage,
            chatroomId: parseInt(chatroom.id),
            codeType: "javascript",
            isCode: true,
          })
        );
      } else if (isPythonEnabled) {
        webSocket.send(
          JSON.stringify({
            message: encryptedMessage,
            chatroomId: parseInt(chatroom.id),
            codeString: "python",
            isCode: true,
          })
        );
      } else {
        console.log(encryptedMessage);
        webSocket.send(
          JSON.stringify({
            message: encryptedMessage,
            chatroomId: parseInt(chatroom.id),
            isCode: false,
          })
        );
      }
      setMessage("");
      inputRef.current.clear();
    }
  };

  const encryptedMessagesRef = useRef(encryptedMessages);

  useEffect(() => {
    encryptedMessagesRef.current = encryptedMessages;
  }, [encryptedMessages]);
  
  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = async (e) => {
        const response = await axios.get(config.url + "/chatroom/getMessageHistory/" + chatroom.id);
        encryptedMessagesRef.current = response.data;
        setMessagesLoaded(false);
        setEncryptedMessages(response.data);
      };
  
      webSocket.onerror = (e) => {
        console.log("ERROR");
        console.log(e.message);
      };
  
      webSocket.onclose = (e) => {
        console.log("CLOSING");
      };
    }
  }, [webSocket, chatroom.id]);

  const handleSendButton = () => {
    setMessage("");
    sendMessage();
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>

      </View>
      <ScrollView
        style={styles.scrollView}
        snapToEnd={true}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messagesLoaded?messages.map((message, key) => (
          
          <View
            style={
              message.user.id == userId
                ? styles.userMessageWrapper
                : styles.incomingMessageWrapper
            }
          >
            <View
              style={
                message.user.id == userId
                  ? styles.userMessage
                  : styles.incomingMessage
              }
            >
              {message.code?
                  message.codeType == "cpp"?
                    <CppCodeFormatter text={message.text}/>:
                    message.codeType == "python"?
                      <PythonCodeFormatter text={message.text}/>:
                      <JavaScriptCodeFormatter text={message.text}/>:
              <Text>{message.text}</Text>
            }
            </View>
          </View>
          )):<></>}
      </ScrollView><View style={{  flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",}}>
      <Text>C++</Text>
      <Switch 
        trackColor={{false: '#767577', true: config.secondaryColorDark}}
        thumbColor={isCppEnabled ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitchCpp}
        value={isCppEnabled}
      />   
      <Text>Python</Text>
             <Switch
        trackColor={{false: '#767577', true: config.secondaryColorDark}}
        thumbColor={isPythonEnabled ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitchPython}
        value={isPythonEnabled}
      />
      <Text>JS</Text>
             <Switch
        trackColor={{false: '#767577', true: config.secondaryColorDark}}
        thumbColor={isJsEnabled ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitchJs}
        value={isJsEnabled}
      />
      </View>
      <View style={styles.input}>
   
        <Input
          style={{
            borderWidth: 1,
            padding: 12,
            borderColor: "grey",
            flex: 1,
            borderRadius: 25,
          }}
          placeholder="Write something..."
          onChangeText={(text) => setMessage(text)}
          ref={inputRef}
        />

        <View
          style={{
            width: "30%",
            backgroundColor: config.primaryColor,
            borderRadius: 3,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            marginBottom: 30,
            padding: 5,
          }}
        >
          <Button
            buttonStyle={{ backgroundColor: config.primaryColor}}
            title={"Send"}
            onPress={() => handleSendButton()}
          />
        </View>
      </View>
    </View>
  );
}; 

export default ChatroomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "70%",
    paddingHorizontal: 10,
    marginLeft: "10%",
    marginTop: "auto",
  },
  userMessage: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: config.secondaryColorLight,
    width: "50%",
  },
  incomingMessage: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: config.secondaryColorDark,
    width: "50%",
  },
  userMessageWrapper: {
    alignItems: "flex-end",
    width: "100%",
    margin: 2,
  },
  incomingMessageWrapper: {
    alignItems: "flex-start",
    width: "100%",
    margin: 2,
  },
  title: {
    padding: 20,
    backgroundColor: config.primaryColor,
    paddingTop: "5%",
  },
});
