/**
 * NFC service wrapper.  Uses Web NFC in browsers that support it
 * and falls back gracefully otherwise.  For React Native a
 * different implementation would be required using a library such
 * as `react-native-nfc-manager`.
 */

export async function readTag() {
  if ('NDEFReader' in window) {
    try {
      const reader = new NDEFReader();
      await reader.scan();
      return new Promise((resolve) => {
        reader.onreading = (event) => {
          const decoder = new TextDecoder();
          for (const record of event.message.records) {
            if (record.recordType === 'text') {
              resolve(decoder.decode(record.data));
            }
          }
        };
      });
    } catch (err) {
      console.warn('NFC scan failed', err);
      return null;
    }
  }
  // NFC not supported.
  return null;
}

export async function writeTag(data) {
  if ('NDEFWriter' in window) {
    try {
      const writer = new NDEFWriter();
      await writer.write({ records: [{ recordType: 'text', data }] });
      return true;
    } catch (err) {
      console.warn('NFC write failed', err);
      return false;
    }
  }
  return false;
}