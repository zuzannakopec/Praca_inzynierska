import { KEYUTIL, KJUR, b64utoutf8, utf8tob64u } from "jsrsasign";
import { Crypto } from 'expo';
import * as ExpoCrypto from 'expo-crypto';
import { Util } from 'jsrsasign';
import { enc, AES } from 'crypto-js';


export const generateRsaKeyPair = async () => {
  console.log("generating");
  // Generate a new RSA key pair`
  const key = KEYUTIL.generateKeypair("RSA", 1024);

  // Get the public and private keys in PEM format
  const publicKey = KEYUTIL.getPEM(key.pubKeyObj);
  const privateKey = KEYUTIL.getPEM(key.prvKeyObj, "PKCS8PRV");
  console.log(publicKey, privateKey);
  return { privateKey, publicKey };
};

export const encryptMessageWithRsa = async (message, publicKey) => {
  console.log(message, publicKey)
  const publicKeyObj = KEYUTIL.getKey(publicKey);
  const encrypted = await KJUR.crypto.Cipher.encrypt(message, publicKeyObj);
  return encrypted;
};

export const decryptMessageWithRsa = async (encryptedMessage, privateKey) => {
  console.log("DECRYPTING WITH RSA");
  console.log(encryptedMessage);
  console.log(privateKey);
  const decryptedMessage = KJUR.crypto.Cipher.decrypt(
    encryptedMessage,
    KEYUTIL.getKey(privateKey)
  );
  console.log(decryptedMessage);
  return decryptedMessage;
};

export const encryptMessageWithAES = async (message, key) => {
  console.log(message, key);
  const encryptedMessage = AES.encrypt(message, key).toString();
  console.log(encryptedMessage)
  return encryptedMessage
};

// Decrypt a message with AES using the provided key and IV
export const decryptMessageWithAES = async (encryptedMessage, key) => {
  const decryptedMessage = await AES.decrypt(encryptedMessage, key).toString();
  console.log("DECRYPTED MESSAGE")
  console.log(decryptedMessage)
  return hexToString(decryptedMessage);
};

export const generateAESKey = () => {
  const key = enc.Hex.parse(
    Array(64)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('')
  );
  console.log("GENERATED AES KEY")
  console.log(key)
  return key;
};

function hexToString(hex) {
  var string = '';
  for (var i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return string;
}
/*
const generateAESKey = async () => {
    const keyBytes = await Crypto.getRandomBytesAsync(32)
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      keyBytes.toString()
    );
    return key;
  };
*/