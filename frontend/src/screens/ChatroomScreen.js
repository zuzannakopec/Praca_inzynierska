import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Switch } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Button, Input, Icon, colors } from "react-native-elements";
import axios from "axios";
import config from "../config";

import CppCodeFormatter from "../components/CppCodeFormatter";
import PythonCodeFormatter from "../components/PythonCodeFormatter";
import JavaScriptCodeFormatter from "../components/JavaScriptCodeFormatter";
import { decryptMessageWithAES, decryptMessageWithRsa, encryptMessageWithAES } from "../EncryptionUtils";

const ChatroomScreen = ({ navigation, route }) => {
  const chatroom = route.params.chatroom;
  const userId = route.params.id;
  const scrollViewRef = useRef();
  const inputRef = useRef();

  const [isCppEnabled, setIsCppEnabled] = useState(false);
  const toggleSwitchCpp = () => setIsCppEnabled(previousState => !previousState);

  const [isPythonEnabled, setIsPythonEnabled] = useState(false);
  const toggleSwitchPython = () => setIsPythonEnabled(previousState => !previousState);

  const [isJsEnabled, setIsJsEnabled] = useState(false);
  const toggleSwitchJs = () => setIsJsEnabled(previousState => !previousState);


  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUserEncryptedKey, setCurrentUserEncryptedKey] = useState("")
  const [encryptionKey, setEncryptionKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")

  var ws = new WebSocket(config.WebSocketUrl + userId);

  useEffect(() => {
    axios
      .get(config.url + "/chatroom/accessibility/" + userId + "/" + chatroom.id)
      .then((response) => {
        setCurrentUserEncryptedKey(response.data.encryptedKey)
        getPrivateKey()
        decryptAESKey()
      })
  }, [])

  useEffect(() => {
    axios
      .get(config.url + "/chatroom/getMessageHistory/" + chatroom.id)
      .then((response) => {
        setMessages(response.data)
        decryptMessages()
      })
  }, [])

  const getPrivateKey = async () =>{
    let key = await SecureStore.getItemAsync("encryptionKey")
    setPrivateKey(key)
  }

  const decryptAESKey = () =>{
    let key = decryptMessageWithRsa(currentUserEncryptedKey, privateKey)
    setEncryptionKey(key)
  }

  const decryptMessages = () =>{
    let decryptedMessages = []
    messages.map((message)=>{
      let decryptedMessage = decryptMessageWithAES(message.text, encryptionKey, message.iv)
      decryptedMessages.push(decryptedMessage)
    })
    setMessages(decryptedMessages)
  }

  const sendMessage = () => {
    if (message != "") {
      const {iv, encryptedMessage} = encryptMessageWithAES(message, encryptionKey);

      if(isCppEnabled){
        ws.send(
          JSON.stringify({
            message: encryptedMessage,
            chatroomId: parseInt(chatroom.id),
            codeType:'cpp',
            isCode:true,
            iv:iv
          })
        );
      }
      else if(isJsEnabled){
        ws.send(
          JSON.stringify({
            message: encryptedMessage,
            chatroomId: parseInt(chatroom.id),
            codeType:'javascript',
            isCode:true
          })
        );
      }
      else if(isPythonEnabled){
        ws.send(
          JSON.stringify({
            message: encryptedMessage,
            chatroomId: parseInt(chatroom.id),
            codeString:'python',
            isCode:true
          })
        );
      }
      else {
        ws.send(
          JSON.stringify({
            message: encryptedMessage,
            chatroomId: parseInt(chatroom.id),
            isCode:false
          })
        );
      }
    }
  };


  ws.onmessage = (e) => {
    axios
      .get(config.url + "/chatroom/getMessageHistory/" + chatroom.id)
      .then((response) => {
        setMessages(response.data);
      });
  };

  ws.onerror = (e) => {
    console.log("ERROR");
    console.log(e.message);
  };

  ws.onclose = (e) => {
    console.log("CLOSING");
  };

  const handleSendButton = () => {
    setMessage("");
    inputRef.current.clear();
    sendMessage();
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>Awesome Chatroom with {userId}</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        snapToEnd={true}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message, key) => (
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
        ))}
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
      <Text>Javascript</Text>
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
            width: "25%",
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
            buttonStyle={{ backgroundColor: config.primaryColor }}
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
