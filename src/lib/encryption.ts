
import CryptoJS from "crypto-js";

const SECRET_KEY = "0123456789abcdef0123456789abcdef"; // 32 bytes

export function encryptDataAES(data: object): string {
  const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes IV
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  // Return a stringified JSON object containing both IV and encrypted data
  return JSON.stringify({
    iv: CryptoJS.enc.Base64.stringify(iv),
    data: encrypted.toString(), // This is Base64 encoded by default by CryptoJS.AES.encrypt
  });
}

export function decryptDataAES(payloadString: string): object | null {
  let parsedPayload: any;

  try {
    parsedPayload = JSON.parse(payloadString);
  } catch (e) {
    // The string itself is not valid JSON, so it cannot be an encrypted payload or our user object.
    console.warn("AES Decryption: Input string is not valid JSON. Cannot decrypt or parse.", payloadString, e);
    return null;
  }

  // Check if it has the structure of our encrypted payload
  if (parsedPayload && typeof parsedPayload === 'object' &&
      typeof parsedPayload.iv === 'string' && typeof parsedPayload.data === 'string') {
    try {
      const iv = CryptoJS.enc.Base64.parse(parsedPayload.iv);
      const decrypted = CryptoJS.AES.decrypt(
        parsedPayload.data,
        CryptoJS.enc.Utf8.parse(SECRET_KEY),
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        console.error("AES Decryption: Decrypted string is empty. Possible key mismatch or data corruption. Original encrypted data:", parsedPayload.data);
        return null;
      }
      // The decrypted string must also be valid JSON
      try {
        return JSON.parse(decryptedString);
      } catch (jsonParseError) {
        console.error("AES Decryption: Failed to parse decrypted string as JSON.", decryptedString, jsonParseError);
        return null;
      }
    } catch (decryptionProcessError) {
      console.error("AES Decryption: Error during the decryption process.", decryptionProcessError);
      return null;
    }
  } else {
    // If it's not our encrypted structure, check if `parsedPayload` itself is a valid unencrypted user object.
    // This handles cases where data might not have been encrypted yet (e.g. old data, or "{}" from empty storage).
    if (parsedPayload && typeof parsedPayload === 'object' && parsedPayload !== null) {
      if ('id' in parsedPayload || 'email' in parsedPayload) {
        // It looks like a user object.
        console.warn("AES Decryption: Payload does not match encrypted structure. Treated as unencrypted user data.", parsedPayload);
        return parsedPayload;
      } else {
        // It's a JSON object, but not our encrypted structure and not a recognizable user object (e.g., could be "{}").
        console.warn("AES Decryption: Payload is a JSON object but not recognized as encrypted or user data.", parsedPayload);
        return null;
      }
    } else {
      // The parsed payloadString was not an object (e.g. "null", "true", or a number string from localStorage).
      console.warn("AES Decryption: Parsed payload string is not an object. Cannot be user data.", parsedPayload);
      return null;
    }
  }
}

// Removed the separate attemptUnencryptedParse as its logic is now integrated.
