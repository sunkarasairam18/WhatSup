import { initializeApp } from "firebase/app";
import {getFirestore,doc,setDoc,getDoc,addDoc,updateDoc,query,collection,onSnapshot} from 'firebase/firestore';
import { getAuth,GoogleAuthProvider } from "firebase/auth";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyDkGt4NguOBGsSVAlXFZHSmGZ50-GWU_pY",
    authDomain: "whatsup-a809f.firebaseapp.com",
    databaseURL: "https://whatsup-a809f-default-rtdb.firebaseio.com",
    projectId: "whatsup-a809f",
    storageBucket: "gs://whatsup-a809f.appspot.com/",
    messagingSenderId: "183210761433",
    appId: "1:183210761433:web:52ddaa8f2837bf4cecb2c8",
    measurementId: "G-CC66BC8W9N",
});

const auth = getAuth();
const firestore = getFirestore();
const provider = new GoogleAuthProvider();

async function addAccount(name,email,uid){
    const db = doc(firestore,`Accounts/${uid}`);
    const accountSnapshot = await getDoc(db);
    if(!accountSnapshot.exists()){
        await setDoc(doc(firestore,"Accounts",uid),
        {
            About: "Hey there! I am using WhatsUp.",
            displayName: name,
            email: email,
            friendsCount: 0,
            lastSeen: new Date(),
            onlineStatus: true,
            photoUrl: "",
            Requests: [],
            uid: uid,
        },{merge: true});        
    }
};

async function updateLastSeen(uid){
    const db = doc(firestore,`Accounts/${uid}`);
    const timestamp = {
        lastSeen: new Date()
    };
    updateDoc(db,timestamp);
};

async function updateOnlineStatus(uid,status){
    const db = doc(firestore,`Accounts/${uid}`);
    const timestamp = {
        onlineStatus: status,
    };
    updateDoc(db,timestamp);
  };

// async function readNames(){
//     const nameQuery = query(
//         collection(firestore,'rooms'),
//     );
    
//     onSnapshot(nameQuery, (querySnapshot)=>{
//        console.log(JSON.stringify(querySnapshot.docs.map((e) => ({
//            id: e.id,
//            name: e.data().name,
//        }))));
//     });
   
// }

export {addAccount,updateLastSeen,updateOnlineStatus,firebaseApp,firestore,auth,provider};

