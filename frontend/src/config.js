import {Dimensions} from "react-native"

const window = Dimensions.get('window');

export default {
    screenHeight: window.height,
    screenWidth: window.width,

    url: "http://192.168.8.142:8080",
    WebSocketUrl:"ws://192.168.8.142:8080/notification/",
    appName:"Temprorary name",
    primaryColor:"#009E8B",
    secondaryColorLight:"#01CDB5",
    secondaryColorDark:"#318076",
    greyBackground:"#EDEDED",
    whiteBackground:"#FFFFFF",

}