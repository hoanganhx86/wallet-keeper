import CryptoJS from 'crypto-js';

export const privateKeyLength = 66; // 0x + 64 hexadecimal characters

export const encryptPrivateKey = (privateKey: string, password: string): string => {
  return CryptoJS.AES.encrypt(privateKey, password).toString();
};

export const decryptPrivateKey = (encryptedPrivateKey: string, password: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, password);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  // If decryption fails or produces invalid data, throw an error
  if (!decrypted || !decrypted.startsWith('0x') || decrypted.length !== privateKeyLength) {
    throw new Error('Invalid password or corrupted data');
  }

  return decrypted;
};

export const verifyWalletPassword = (encryptedPrivateKey: string, password: string): boolean => {
  try {
    const decrypted = decryptPrivateKey(encryptedPrivateKey, password);
    return decrypted.startsWith('0x') && decrypted.length === privateKeyLength;
  } catch (_) {
    return false;
  }
};
