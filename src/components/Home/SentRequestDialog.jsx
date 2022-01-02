import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import "../../css/Home/SentRequestDialog.css";
import { CSSTransition } from "react-transition-group";
import { IconButton } from "@mui/material";
import "../../css/common/StandardTransition.css";
import CloseIcon from "@mui/icons-material/Close";
import { useStateValue } from "../../services/StateProvider";
import Joi from "joi-browser";
import { firestore } from "../../services/firebase";
import {
  query,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
  collection,
  where,
} from "firebase/firestore";

const SentRequestDialog = ({
  showNewRequestDialog,
  setShowNewRequestDialog,
  setOpenSnack,
  setSnackMessage,
  setSeverity,
}) => {
  const [value, setValue] = useState({
    email: "",
  });
  const [{ user }, dispatch] = useStateValue();
  const [receiver, setReceiver] = useState();
  const [inFriends,setInFriends] = useState();
  const [inRequests,setInRequests] = useState();
  const [inSentRequests,setInSentRequests] = useState();



  useEffect(() => {
    if (!receiver) return;
    console.log("Receiver", receiver);
    console.log("Id", receiver[0]?.id);
    findInFriends(receiver[0]?.id);
    findInRequests(receiver[0]?.id);
    findInSentRequests(receiver[0]?.id);
  
    if (receiver.length === 0) {
        
      const { email } = value;
      setSeverity("warning");
      setSnackMessage(
        `${
          email.length > 12 ? email.slice(0, 12) + "..." : email
        } is not on WhatsUp`
      );
      setOpenSnack(true);
      setValue({ email: "" });
      setShowNewRequestDialog(false);
    }   
    
  }, [receiver]);

 

  useEffect(()=>{
    if(inFriends == undefined || inRequests == undefined || inSentRequests == undefined) {      
      return;
    };
    console.log("Friends",inFriends);
    console.log("Requests",inRequests);
    console.log("Sent Requests",inSentRequests);
    if (!inFriends && !inRequests && !inSentRequests) {
      
      sendRequest(receiver[0].id,receiver[0].displayName);
      setSeverity("success");
      setSnackMessage(`Request Sent`);
      setValue({ email: "" });
      setShowNewRequestDialog(false);
      setOpenSnack(true);
    } else {            
      setSnackMessage("Failed to send request");
      setSeverity("warning");
      setValue({ email: "" });
      setShowNewRequestDialog(false);
      setOpenSnack(true);
    }
  },[inRequests,inSentRequests,inSentRequests]);

  const handleSendRequest = () => {
    setInFriends(undefined);
    setInRequests(undefined);
    setInSentRequests(undefined);
    console.log("Start Friends",inFriends);
    console.log("Start Requests",inRequests);
    console.log("Start Sent Requests",inSentRequests);
    const schema = {
      email: Joi.string().email().required(),
    };
    const { error } = Joi.validate(value, schema);
    if (value.email.trim() === "") {
      console.log(error);
      setSnackMessage("Enter Email Id");
      setSeverity("info");
      setOpenSnack(true);
    } else if (error) {
      setSnackMessage("Invalid Email");
      setSeverity("info");
      setOpenSnack(true);
    } else if (user.email === value.email.trim()) {
      setSnackMessage("Couldn't send request");
      setSeverity("warning");
      setOpenSnack(true);
    } else {
      const friendQuery = query(
        collection(firestore, `Accounts`),
        where("email", "==", value.email.trim())
      );
      onSnapshot(friendQuery, (querySnapshot) => {
        setReceiver(
          querySnapshot.docs.map((e) => ({
            id: e.id,
            displayName: e.data().displayName,
          }))
        );
      });
      
    }
  };

  const findInFriends = async (id) => {
    const friendRef = doc(firestore, `Accounts/${user.uid}/Friends/${id}`);
    const docSnap = await getDoc(friendRef);
    if (docSnap.exists()) {
      setInFriends(true);
      return;
    }
    setInFriends(false);
  };

  const findInRequests = async (id) => {
    const requestRef = doc(firestore, `Accounts/${user.uid}/Requests/${id}`);    

    const docSnap = await getDoc(requestRef);
    if (docSnap.exists()) {
      setInRequests(true);
      return;
    }
    setInRequests(false);
  };

  const findInSentRequests = async (id) => {
    const pendingRef = doc(
      firestore,
      `Accounts/${user.uid}/Sent Requests/${id}`
    );
  
    const docSnap = await getDoc(pendingRef);
    if (docSnap.exists()) {
      console.log("Sent Requests",docSnap);
      setInSentRequests(true);
      return;
    }
    setInSentRequests(false);
    
  };

  const sendRequest = async (id,ReceiverName) => {
    
    const userRef = doc(firestore, `Accounts/${user.uid}`);
    const userDoc = await getDoc(userRef);
    if(userDoc.exists()){
      await setDoc(doc(firestore, `Accounts/${id}/Requests`,user.uid), {
        SentBy: user.uid,
        displayName: userDoc.data().displayName
      });
      await setDoc(doc(firestore,`Accounts/${user.uid}/Sent Requests`,id),{
        SentTo: id,
        displayName: ReceiverName
      });
    }
    
  };

  return (
    <CSSTransition
      in={showNewRequestDialog}
      timeout={400}
      unmountOnExit
      classNames="standard_transition"
    >
      <div className="sent_request_dialog">
        <div className="srd_content">
          <div className="srdc_header">
            <div className="srdch_title">Send Request</div>
            <div
              className="srdch_close"
              onClick={() => {
                setValue({ email: "" });
                setShowNewRequestDialog(false);
              }}
            >
              <IconButton>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className="srdc_subject">Send Request to chat</div>
          <div className="srdc_input">
            <TextField
              label="Enter Email Id"
              color="secondary"
              size="medium"
              value={value.email}
              onChange={(e) => setValue({ email: e.target.value })}
              fullWidth
            />
          </div>
          <div className="srdc_bottom">
            <div className="send_request_btn" onClick={handleSendRequest}>
              Send Request
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default SentRequestDialog;
