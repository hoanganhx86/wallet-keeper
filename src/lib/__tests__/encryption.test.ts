import { describe, it, expect } from 'vitest';
import {
  encryptPrivateKey,
  decryptPrivateKey,
  verifyWalletPassword,
  privateKeyLength,
} from '../encryption';

const testData = {
  privateKey: '0xdd2dbc34d6cb1c2edf64f05ff53dcaa1a2fc27c8b745625b0eba97c3362cb9b2',
  invalidPrivateKey: 'invalid-key',
  password: 'test123',
  wrongPassword: 'wrong123',
  corruptedData: 'invalid-encrypted-data',
};

describe('encryption utilities', () => {
  describe('encryptPrivateKey', () => {
    it('should encrypt a private key', () => {
      const encrypted = encryptPrivateKey(testData.privateKey, testData.password);

      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(testData.privateKey);
      expect(typeof encrypted).toBe('string');
    });

    it('should produce different encrypted values for different passwords', () => {
      const encrypted1 = encryptPrivateKey(testData.privateKey, testData.password);
      const encrypted2 = encryptPrivateKey(testData.privateKey, testData.wrongPassword);

      expect(encrypted1).not.toBe(encrypted2);
    });
  });

  describe('decryptPrivateKey', () => {
    it('should decrypt an encrypted private key', () => {
      const encrypted = encryptPrivateKey(testData.privateKey, testData.password);
      const decrypted = decryptPrivateKey(encrypted, testData.password);

      expect(decrypted).toBe(testData.privateKey);
    });

    it('should throw error when decrypting with wrong password', () => {
      const encrypted = encryptPrivateKey(testData.privateKey, testData.password);

      expect(() => decryptPrivateKey(encrypted, testData.wrongPassword)).toThrow();
    });

    it('should throw error when decrypting corrupted data', () => {
      expect(() => decryptPrivateKey(testData.corruptedData, testData.password)).toThrow();
    });
  });

  describe('verifyWalletPassword', () => {
    it('should verify correct password', () => {
      const encrypted = encryptPrivateKey(testData.privateKey, testData.password);

      expect(verifyWalletPassword(encrypted, testData.password)).toBe(true);
    });

    it('should reject incorrect password', () => {
      const encrypted = encryptPrivateKey(testData.privateKey, testData.password);

      expect(verifyWalletPassword(encrypted, testData.wrongPassword)).toBe(false);
    });

    it('should reject invalid private key format', () => {
      const encrypted = encryptPrivateKey(testData.invalidPrivateKey, testData.password);

      expect(verifyWalletPassword(encrypted, testData.password)).toBe(false);
    });

    it('should verify private key length', () => {
      expect(testData.privateKey.length).toBe(privateKeyLength);
    });
  });
});
