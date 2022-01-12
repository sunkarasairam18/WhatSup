import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


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

async function addAccount(name, email, uid) {
  const db = doc(firestore, `Accounts/${uid}`);
  const accountSnapshot = await getDoc(db);
  if (!accountSnapshot.exists()) {
    await setDoc(
      doc(firestore, "Accounts", uid),
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
      },
      { merge: true }
    );
  }
}

async function updateLastSeen(uid) {
  const db = doc(firestore, `Accounts/${uid}`);
  const timestamp = {
    lastSeen: new Date(),
  };
  updateDoc(db, timestamp);
}

async function updateOnlineStatus(uid, status) {
  const db = doc(firestore, `Accounts/${uid}`);
  const timestamp = {
    onlineStatus: status,
  };
  updateDoc(db, timestamp);
}
async function updateFriendsCount(id,n){
    const db = doc(firestore,`Accounts/${id}`);
    const accountSnapshot = await getDoc(db);
    if (accountSnapshot.exists()) {
        const friendsCount = {
            friendsCount: accountSnapshot.data().friendsCount+n,
        };
        updateDoc(db,friendsCount);
    }
}

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

const delRequest = async (userId,id) => {

  // const obj = requests.find(o => o.data.SentBy === id);
  const requesterDoc = doc(firestore, `Accounts/${userId}/Requests/${id}`);
  await deleteDoc(requesterDoc);
  const userDoc = doc(firestore, `Accounts/${id}/Sent Requests/${userId}`);
  await deleteDoc(userDoc);
};

const cancelRequest = async (userId,id) =>{
  const sentrequesterDoc = doc(firestore, `Accounts/${userId}/Sent Requests/${id}`);
  await deleteDoc(sentrequesterDoc);
  const userRequest= doc(firestore, `Accounts/${id}/Requests/${userId}`);
  await deleteDoc(userRequest);
};

const confirmRequest = async (userId,id) => {

  const chatContainers = collection(firestore, `ChatContainers`);
  const docContainer = {
    [id]: {
      typing: false,
    },
    [userId]: {
      typing: false,
    },
    lastMessageId: "start",
    receiver: userId,
    sender: id,
    readBy: {
      [id] :false,
      [userId] : true
    }
  };
  const newDocContainer = await addDoc(chatContainers, docContainer); //Creating chat container
  const newContainerId = await newDocContainer["_key"]["path"]["segments"][1];
  const firstMessage = {
    message: "Both are friends now.",
    sender: "start",
    timestamp: new Date(),
  };
  if(newContainerId){
    await setDoc(
        doc(firestore, `ChatContainers/${newContainerId}/messages`, "start"),
        firstMessage,
        { merge: true }
      ); //creating messages collection in the chat container
  }else console.log("Container Id",newContainerId);
  
  const frienddb = doc(firestore, `Accounts/${id}`);
  const friendSnapshot = await getDoc(frienddb);
  if (friendSnapshot.exists()) {
    //Adding his account to my friends list
    const HisInMy = {
      container: newContainerId,
      friendId: id,
      friendName: friendSnapshot.data().displayName,
      lastsent: firstMessage.timestamp,
    };
    await setDoc(doc(firestore, `Accounts/${userId}/Friends`, id), HisInMy, {
      merge: true,
    });
  }
  const mydb = doc(firestore, `Accounts/${userId}`);
  const mySnapshot = await getDoc(mydb);
  if (mySnapshot.exists()) {
    //Adding my account to his friends list
    const MineInHis = {
      container: newContainerId,
      friendId: userId,
      friendName: mySnapshot.data().displayName,
      lastsent: firstMessage.timestamp,
    };
    await setDoc(
      doc(firestore, `Accounts/${id}/Friends`, userId),
      MineInHis,
      { merge: true }
    );
  }
  updateFriendsCount(userId,1); //Incrementing my friends count
  updateFriendsCount(id,1); //Incrementing his/her friends count
  await delRequest(userId,id); //Deleting requests from both side
};

export {
  addAccount,
  updateLastSeen,
  updateOnlineStatus,
  delRequest,
  confirmRequest,
  cancelRequest,
  firebaseApp,
  firestore,
  auth,
  provider,
};
