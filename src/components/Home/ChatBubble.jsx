import React, { useState, useEffect,useRef } from "react";
import { firestore } from "../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import "../../css/Home/ChatBubble.css";

const ChatBubble = ({ fullClass, message, timestamp, senderMe, reader, readBy, containerId, msgDocId }) => {
  const [overflow, setOverflow] = useState(false);
  const [bubbleVisible,setBubbleVisible] = useState(false);

  useEffect(()=>{
    if(!senderMe){
      if(reader && !readBy[reader] && bubbleVisible){
        const db = doc(firestore, `ChatContainers/${containerId}/messages/${msgDocId}`);
        const tempRead = {
          readBy: {...readBy,[reader]: true}
        }
        updateDoc(db, tempRead);
      }
    }
  },[bubbleVisible]);

  const bubbleRef = useRef(null);
  const observer = new IntersectionObserver(([entry]) =>{          
    setBubbleVisible(entry.isIntersecting);
    console.log(entry.isIntersecting,message);
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
    if (message.length > 400 && !overflow) setOverflow(true);
  }, []);

  return (
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
  );
};

export default ChatBubble;
