import * as Crypto from 'expo-crypto';
import { getRandomBytesAsync } from 'expo-random';
import { RSAEncryptionPadding } from 'expo-crypto';


export const generateRsaKeyPair = async () => {
  const { publicKey, privateKey } = await Crypto.generateKeyPairAsync('rsa', {
    modulusSize: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  });
  return { publicKey, privateKey };
};

export const encryptMessageWithRsa = async (message, publicKey) => {
  const encryptedMessage = await Crypto.encryptRsaAsync(
    message,
    publicKey,
    Crypto.RSAEncryptionPadding.OAEP
  );
  return encryptedMessage;
};

export const decryptMessageWithRsa = async (encryptedMessage, privateKey) => {
  const decryptedMessage = await Crypto.decryptRsaAsync(
    encryptedMessage,
    privateKey,
    RSAEncryptionPadding.OAEP
  );
  return decryptedMessage;
};

export const encryptMessageWithAES = async (message, key) => {
  const iv = await getRandomBytesAsync(16); // Generate a 16-byte initialization vector (IV)
  const encryptedMessage = await Crypto.encryptAsync(
    'aes-256-cbc', // Encryption algorithm
    key, // Encryption key
    iv, // Initialization vector (IV)
    message // Message to encrypt
  );
  return { iv, encryptedMessage };
};

// Decrypt a message with AES using the provided key and IV
export const decryptMessageWithAES = async (encryptedMessage, key, iv) => {
  const decryptedMessage = await Crypto.decryptAsync(
    'aes-256-cbc', // Encryption algorithm
    key, // Encryption key
    iv, // Initialization vector (IV)
    encryptedMessage // Encrypted message to decrypt
  );
  return decryptedMessage;
};
