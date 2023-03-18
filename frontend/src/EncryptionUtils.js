import { KEYUTIL, KJUR } from "jsrsasign";
import { enc, AES } from 'crypto-js';


export const generateRsaKeyPair = async () => {
  const key = KEYUTIL.generateKeypair("RSA", 1024);
  const publicKey = KEYUTIL.getPEM(key.pubKeyObj);
  const privateKey = KEYUTIL.getPEM(key.prvKeyObj, "PKCS8PRV");
  return { privateKey, publicKey };
};

export const encryptMessageWithRsa = async (message, publicKey) => {
  const publicKeyObj = KEYUTIL.getKey(publicKey);
  const encrypted = KJUR.crypto.Cipher.encrypt(message, publicKeyObj);
  return encrypted;
};

export const decryptMessageWithRsa = async (encryptedMessage, privateKey) => {
  const decryptedMessage = KJUR.crypto.Cipher.decrypt(encryptedMessage, KEYUTIL.getKey(privateKey)
  );
  return decryptedMessage;
};

export const encryptMessageWithAES = async (message, key) => {
  const encryptedMessage = AES.encrypt(message, key).toString();
  return encryptedMessage
};


export const decryptMessageWithAES = async (encryptedMessage, key) => {
  const decryptedMessage = AES.decrypt(encryptedMessage, key).toString();
  return hexToString(decryptedMessage);
};

export const generateAESKey = () => {
  const key = enc.Hex.parse(
    Array(64)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('')
  );
  return key;
};

function hexToString(hex) {
  var string = '';
  for (var i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return string;
}
