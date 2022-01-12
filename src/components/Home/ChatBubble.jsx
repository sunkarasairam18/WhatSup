import React, { useState, useEffect,useRef } from "react";
import { firestore } from "../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useStateValue } from "../../services/StateProvider";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Unread from './Unread';

import "../../css/Home/ChatBubble.css";

const ChatBubble = ({ fullClass, message, timestamp, senderMe, reader, readBy,unreadId,containerId,msgId,unreadCount }) => {
  const [overflow, setOverflow] = useState(false);
  const [bubbleVisible,setBubbleVisible] = useState(false);
  const [{user},dispatch] = useStateValue();

  useEffect(()=>{
    if(!senderMe){
      console.log("Status : ",user);
      if(reader && !readBy[reader] && bubbleVisible && user.onlineStatus){
        const db = doc(firestore, `ChatContainers/${containerId}/messages/${msgId}`);
        const tempRead = {
          readBy: {...readBy,[reader]: true}
        }
        updateDoc(db, tempRead);
      }
    }
  },[bubbleVisible,user]);



  

  const bubbleRef = useRef(null);
  const observer = new IntersectionObserver(([entry]) =>{          
    setBubbleVisible(entry.isIntersecting);
  }
  );

  useEffect(()=>{
    if(!senderMe){
      if(reader && !readBy[reader]){
        observer.observe(bubbleRef.current);
        return () => {
          observer.disconnect();
        };
      }
    }
  },[]);

 

  useEffect(() => {
    if ( message.length > 400 && !overflow) setOverflow(true);
  }, []);

  return (
    <div>
      {unreadId === msgId && <Unread count={unreadCount}/>}
    <div
      className={`nchat_message ${fullClass}`}
      style={{ backgroundColor: senderMe ? "" : "white" }}
      ref={bubbleRef}
    >
      <span style={{ marginRight: senderMe ? "80px" : "58px"}}>
        {overflow ? message.substring(0, 400)+"..." : message}
      </span>
      {overflow && <p className="readmore" onClick={()=>setOverflow(false)}>Read More</p>}

      <div className="nchat_timestamp">
        {senderMe && (
          <div className={"nseenicon"+(readBy[reader]?" nseeniconseen":"")}>
            <DoneAllIcon style={{ height: "17px", width: "17px" }} />
          </div>
        )}
        <div
          className={
            senderMe ? "nchat_timestamp_receiver" : "nchat_timestamp_sender"
          }
        >
          {`${timestamp.hours}:${
            timestamp.minutes < 10 ? `0${timestamp.minutes}` : timestamp.minutes
          } ${timestamp.median}`}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChatBubble;
