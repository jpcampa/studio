
import CryptoJS from "crypto-js";

// SECRET_KEY is still defined but will only be used if ENCRYPTION_ENABLED is true
// or by functions that force encryption like forceEncryptStringAES.
const SECRET_KEY = "0123456789abcdef0123456789abcdef"; // 32 bytes

// --- FLAG TO CONTROL GLOBAL AES ENCRYPTION ---
const ENCRYPTION_ENABLED = true; // SET TO true TO ENABLE GLOBAL AES ENCRYPTION
// ---

export function encryptDataAES(data: object): string {
  if (!ENCRYPTION_ENABLED) {
    // When encryption is disabled, just return the JSON string representation of the object.
    return JSON.stringify(data);
  }

  // Original AES encryption logic (active if ENCRYPTION_ENABLED is true)
  const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes IV
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data), // Data to be encrypted is still the stringified object
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  // Return a stringified JSON object containing both IV and encrypted data (Base64 encoded)
  return JSON.stringify({
    iv: CryptoJS.enc.Base64.stringify(iv),
    data: encrypted.toString(),
  });
}

export function decryptDataAES(payloadString: string): object | string | null {
  if (!ENCRYPTION_ENABLED) {
    // When encryption is disabled, try to parse the string as JSON.
    // If it's not valid JSON (e.g., it's a plain string like "Juan Perez"),
    // return the original string.
    try {
      return JSON.parse(payloadString);
    } catch (e) {
      // payloadString was not a valid JSON string, return it as is.
      return payloadString;
    }
  }

  // Original AES decryption logic (active if ENCRYPTION_ENABLED is true)
  let parsedPayload: any;

  try {
    parsedPayload = JSON.parse(payloadString);
  } catch (e) {
    console.warn("AES Decryption (Global Encryption ON): Input string is not valid JSON. Cannot decrypt.", payloadString, e);
    return null;
  }

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
        console.error("AES Decryption (Global Encryption ON): Decrypted string is empty. Possible key mismatch or data corruption. Original encrypted data:", parsedPayload.data);
        return null;
      }
      try {
        return JSON.parse(decryptedString);
      } catch (jsonParseError) {
        console.error("AES Decryption (Global Encryption ON): Failed to parse decrypted string as JSON.", decryptedString, jsonParseError);
        // If it's not JSON, it might be a simple string, return as is.
        // Or, if expecting JSON and it's not, return null or throw error based on stricter needs.
        return decryptedString; 
      }
    } catch (decryptionProcessError) {
      console.error("AES Decryption (Global Encryption ON): Error during the decryption process.", decryptionProcessError);
      return null;
    }
  } else {
     if (parsedPayload && typeof parsedPayload === 'object' && parsedPayload !== null) {
      if ('id' in parsedPayload || 'email' in parsedPayload || 'name' in parsedPayload) {
        console.warn("AES Decryption (Global Encryption ON): Payload does not match encrypted structure but looks like user data. Returning as is.", parsedPayload);
        return parsedPayload;
      }
    }
    console.warn("AES Decryption (Global Encryption ON): Payload is JSON but not recognized as encrypted structure or valid user data.", parsedPayload);
    return null;
  }
}

/**
 * Forces AES encryption for a given string value, regardless of ENCRYPTION_ENABLED.
 * Returns a JSON string: '{"iv":"<base64_iv>", "data":"<base64_ciphertext>"}'.
 */
export function forceEncryptStringAES(value: string): string {
  const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes IV
  const encrypted = CryptoJS.AES.encrypt(
    value, // Encrypt the raw string directly
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  return JSON.stringify({
    iv: CryptoJS.enc.Base64.stringify(iv),
    data: encrypted.toString(), // This is already Base64
  });
}

/**
 * Forces AES decryption for a string previously encrypted with forceEncryptStringAES.
 * Expects a JSON string: '{"iv":"<base64_iv>", "data":"<base64_ciphertext>"}'.
 * Returns the original decrypted string, or null on error.
 */
export function forceDecryptStringAES(encryptedStringJson: string): string | null {
  let parsedPayload: any;
  try {
    parsedPayload = JSON.parse(encryptedStringJson);
  } catch (e) {
    console.error("Force Decryption: Input string is not valid JSON.", encryptedStringJson, e);
    return null;
  }

  if (parsedPayload && typeof parsedPayload.iv === 'string' && typeof parsedPayload.data === 'string') {
    try {
      const iv = CryptoJS.enc.Base64.parse(parsedPayload.iv);
      const decrypted = CryptoJS.AES.decrypt(
        parsedPayload.data,
        CryptoJS.enc.Utf8.parse(SECRET_KEY),
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedString) {
        // This can happen if the key is wrong or data corrupted
        console.error("Force Decryption: Decrypted string is empty.");
        return null;
      }
      return decryptedString;
    } catch (decryptionError) {
      console.error("Force Decryption: Error during decryption process.", decryptionError);
      return null;
    }
  } else {
    console.error("Force Decryption: Payload does not match expected encrypted structure {iv, data}.");
    return null;
  }
}

