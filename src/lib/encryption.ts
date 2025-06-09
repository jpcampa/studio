
import CryptoJS from "crypto-js";

// SECRET_KEY is still defined but will only be used if ENCRYPTION_ENABLED is true.
const SECRET_KEY = "0123456789abcdef0123456789abcdef"; // 32 bytes

// --- FLAG TO CONTROL AES ENCRYPTION ---
const ENCRYPTION_ENABLED = false; // SET TO false TO DISABLE AES ENCRYPTION
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
      // This handles cases where a plain string (not JSON encoded) is passed.
      return payloadString;
    }
  }

  // Original AES decryption logic (active if ENCRYPTION_ENABLED is true)
  let parsedPayload: any;

  try {
    // The payloadString is expected to be a JSON string containing 'iv' and 'data'
    parsedPayload = JSON.parse(payloadString);
  } catch (e) {
    // If payloadString is not valid JSON, it cannot be our encrypted structure.
    console.warn("AES Decryption (Encryption ON): Input string is not valid JSON. Cannot decrypt.", payloadString, e);
    return null; // Or, depending on desired behavior, you could return payloadString itself if you expect mixed content.
  }

  // Check if it has the structure of our encrypted payload
  if (parsedPayload && typeof parsedPayload === 'object' &&
      typeof parsedPayload.iv === 'string' && typeof parsedPayload.data === 'string') {
    try {
      const iv = CryptoJS.enc.Base64.parse(parsedPayload.iv);
      const decrypted = CryptoJS.AES.decrypt(
        parsedPayload.data, // This is the Base64 encoded ciphertext
        CryptoJS.enc.Utf8.parse(SECRET_KEY),
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        console.error("AES Decryption (Encryption ON): Decrypted string is empty. Possible key mismatch or data corruption. Original encrypted data:", parsedPayload.data);
        return null;
      }
      // The decrypted string must also be valid JSON (representing the original object)
      try {
        return JSON.parse(decryptedString);
      } catch (jsonParseError) {
        console.error("AES Decryption (Encryption ON): Failed to parse decrypted string as JSON.", decryptedString, jsonParseError);
        return null;
      }
    } catch (decryptionProcessError) {
      console.error("AES Decryption (Encryption ON): Error during the decryption process.", decryptionProcessError);
      return null;
    }
  } else {
    // If encryption is ON, but the payload doesn't match the expected encrypted structure.
    // This path handles the scenario from the original code where it might be an unencrypted user object already.
     if (parsedPayload && typeof parsedPayload === 'object' && parsedPayload !== null) {
      if ('id' in parsedPayload || 'email' in parsedPayload || 'name' in parsedPayload) { // Added 'name' for more robustness
        console.warn("AES Decryption (Encryption ON): Payload does not match encrypted structure but looks like user data. Returning as is.", parsedPayload);
        return parsedPayload;
      }
    }
    console.warn("AES Decryption (Encryption ON): Payload is JSON but not recognized as encrypted structure or valid user data.", parsedPayload);
    return null;
  }
}
