import { initializeApp } from "firebase/app";
import {getFirestore,doc,setDoc,getDoc,addDoc,updateDoc,query,collection,onSnapshot} from 'firebase/firestore';
import { getAuth,GoogleAuthProvider,RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
import {getStorage,ref} from 'firebase/storage';

const firebaseConfig = initializeApp({
    apiKey: "AIzaSyDkGt4NguOBGsSVAlXFZHSmGZ50-GWU_pY",
    authDomain: "whatsup-a809f.firebaseapp.com",
    databaseURL: "https://whatsup-a809f-default-rtdb.firebaseio.com",
    projectId: "whatsup-a809f",
    storageBucket: "gs://whatsup-a809f.appspot.com/",
    messagingSenderId: "183210761433",
    appId: "1:183210761433:web:52ddaa8f2837bf4cecb2c8",
    measurementId: "G-CC66BC8W9N",
  });

const storage = getStorage();  
const folderRef = ref(storage, 'images');

const firestore = getFirestore();

const db = doc(firestore,'rooms/63G1Ppx9gBKDONtz95QF');
const auth = getAuth();




const provider = new GoogleAuthProvider();

const accountsCollection = collection(firestore,'Accounts');

async function addAccount(name,email,uid){
    const db = doc(firestore,`Accounts/${uid}`);
    const accountSnapshot = await getDoc(db);
    if(!accountSnapshot.exists()){
        await setDoc(doc(firestore,"Accounts",uid),
        {
            About: "Hey there! I am using What'Sup.",
            email: email,
            Friends: [{}],
            displayName: name,
            lastSeen: new Date(),
            onlineStatus: true,
            photoUrl: "",
            uid: uid,
        },{merge: true});
        
    }
};

async function updateLastSeenOnlineStatus(uid,status){
    const db = doc(firestore,`Accounts/${uid}`);
    const timestamp = {
        lastSeen: new Date(),
        onlineStatus: status,
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

async function writeName(doc){
    try{
        await setDoc(db,doc,{merge:true});
        console.log("Doc has been written ");
    }catch(error){
        console.log(`I got an error! ${error}`);
    };
};

async function readName(){
    const mySnapshot = await getDoc(db);
    if(mySnapshot.exists()){
        const docData = mySnapshot.data();
        console.log(`My data is ${JSON.stringify(docData)}`);
    }
}

const ordersCollection = collection(firestore,'rooms');

async function newName(setName){
    const newDoc = await addDoc(ordersCollection,{
        name: setName,
    });
    console.log(`New Doc ${JSON.stringify(newDoc)}`);
};


async function readNames(){
    const nameQuery = query(
        collection(firestore,'rooms'),
    );
    
    onSnapshot(nameQuery, (querySnapshot)=>{
       console.log(JSON.stringify(querySnapshot.docs.map((e) => ({
           id: e.id,
           name: e.data().name,
       }))));
    });
   
}

export {writeName,readName,newName,readNames,addAccount,updateLastSeenOnlineStatus,updateOnlineStatus,folderRef,firestore,auth,provider};

