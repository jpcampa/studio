
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

export function decryptDataAES(encryptedPayloadString: string): object | null {
  try {
    const encryptedPayload = JSON.parse(encryptedPayloadString);
    // Validate structure
    if (typeof encryptedPayload.iv !== 'string' || typeof encryptedPayload.data !== 'string') {
        console.error("AES Decryption: Invalid payload structure. Missing 'iv' or 'data'.", encryptedPayload);
        // Attempt fallback for unencrypted data immediately if structure is wrong for encrypted
        return attemptUnencryptedParse(encryptedPayloadString);
    }

    const iv = CryptoJS.enc.Base64.parse(encryptedPayload.iv);
    const decrypted = CryptoJS.AES.decrypt(
      encryptedPayload.data,
      CryptoJS.enc.Utf8.parse(SECRET_KEY),
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
        // This can happen if the key is wrong or data is corrupted and results in an empty string after decryption
        console.error("AES Decryption: Decrypted string is empty. Possible key mismatch or data corruption.");
        return attemptUnencryptedParse(encryptedPayloadString); // Try fallback
    }
    return JSON.parse(decryptedString);
  } catch (error) {
    // This catch block primarily handles errors from JSON.parse(encryptedPayloadString) 
    // if the string itself is not valid JSON, or JSON.parse(decryptedString) if the decrypted content is not valid JSON.
    // It could also catch errors from CryptoJS if iv/key are malformed, though type checks should prevent some.
    console.warn("AES Decryption failed, attempting unencrypted parse. Error:", error);
    return attemptUnencryptedParse(encryptedPayloadString);
  }
}

function attemptUnencryptedParse(payloadString: string): object | null {
  try {
    // console.log("Attempting direct JSON parse for fallback:", payloadString);
    const unencryptedData = JSON.parse(payloadString);
    // Basic check to see if it might be a user object
    if (unencryptedData && typeof unencryptedData === 'object' && unencryptedData !== null && ('id' in unencryptedData || 'email' in unencryptedData)) {
      console.warn("AES Decryption: Fallback to unencrypted data successful. Data was likely not encrypted.");
      return unencryptedData;
    }
    console.warn("AES Decryption: Fallback to unencrypted data - parsed but doesn't look like user data.");
    return null;
  } catch (fallbackError) {
    console.error("AES Decryption: Fallback to unencrypted JSON also failed. Data is likely corrupted or not valid JSON.", fallbackError);
    return null;
  }
}
