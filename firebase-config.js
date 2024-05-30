import { initializeApp } from "firebase/app";
import { ref, getDownloadURL, uploadBytesResumable, getStorage, deleteObject } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBOM4uvDyIyiSVQA6LzLBRQEsO0hIVhKcE",
    authDomain: "spotdraft-b5068.firebaseapp.com",
    projectId: "spotdraft-b5068",
    storageBucket: "spotdraft-b5068.appspot.com",
    messagingSenderId: "998359336350",
    appId: "1:998359336350:web:cd22c33bcc1ad53921828f"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
    storage,
};