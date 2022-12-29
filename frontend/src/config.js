import {Dimensions} from "react-native"

const window = Dimensions.get('window');

export default {
    screenHeight: window.height,
    screenWidth: window.width,

    url: "http://192.168.1.4:8080",
    WebSocketUrl:"ws://192.168.1.4:8080/notification/",
    appName:"Temprorary name"
}