import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";
import firebaseConfig from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Handle form submission
export async function handleSubmission(text, imageFile, currentPrompt) {
  let imageUrl = null;

  try {
    if (imageFile) {
      const timestamp = Date.now();
      const filename = `${timestamp}_${imageFile.name}`;
      const storageRef = ref(storage, `images/${filename}`);
      
      const snapshot = await uploadBytes(storageRef, imageFile);
      console.log('Image uploaded successfully');
      
      imageUrl = await getDownloadURL(snapshot.ref);
      console.log('Image URL:', imageUrl);
    }

    const docRef = await addDoc(collection(db, "entries"), {
      text: text || null,
      imageUrl: imageUrl,
      prompt: currentPrompt,
      timestamp: serverTimestamp()
    });

    console.log("Document written with ID:", docRef.id);
    return { success: true, docId: docRef.id };

  } catch (error) {
    console.error("Error in submission:", error);
    throw error;
  }
} 