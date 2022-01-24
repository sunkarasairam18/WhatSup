import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useStateValue } from "../../services/StateProvider";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Unread from "./Unread";

import "../../css/Home/ChatBubble.css";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Linkify from 'linkify-react';


const ChatBubble = ({
  msgId,
  fullClass,
  message,
  timestamp,
  senderMe,
  reader,
  readBy,
  containerId,
  unreadId,
  unreadCount,
  urlRegex,
}) => {
  const [overflow, setOverflow] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [links, setLinks] = useState([]);

  const [{ user }, dispatch] = useStateValue();

  function detectURLs(message) {
    return message.match(urlRegex);
  }
  

  useEffect(() => {
    const urls = detectURLs(message);

    console.log(urls);
    setLinks(urls?urls:[]);
  }, []);

  

  useEffect(() => {
    if (!senderMe) {
      if (reader && !readBy[reader] && bubbleVisible && user.onlineStatus) {
        const db = doc(
          firestore,
          `ChatContainers/${containerId}/messages/${msgId}`
        );
        const tempRead = {
          readBy: { ...readBy, [reader]: true },
        };
        updateDoc(db, tempRead);
      }
    }
  }, [bubbleVisible, user]);

  const bubbleRef = useRef(null);
  const observer = new IntersectionObserver(([entry]) => {
    setBubbleVisible(entry.isIntersecting);
  });

  useEffect(() => {
    if (!senderMe) {
      if (reader && !readBy[reader]) {
        observer.observe(bubbleRef.current);
        return () => {
          observer.disconnect();
        };
      }
    }
  }, []);

  useEffect(() => {
    if (message.length > 400 && !overflow) setOverflow(true);
  }, []);

  return (
    <div>
      {unreadId === msgId && <Unread count={unreadCount}/>}
      <div
        className={`nchat_message ${fullClass}`}
        style={{ backgroundColor: senderMe ? "" : "white" }}
        ref={bubbleRef}
      >
        {links.length>0 && <div style={{marginBottom:"10px"}}>                  
            <LinkPreview
              url={links[0]}              
              textAlign="left"
              descriptionLength={40}
              width="100%"
              height="300px"
              imageHeight={"100%"}
              secondaryTextColor="black"
              openInNewTab={true}               
              
              fallbackImageSrc={"https://as1.ftcdn.net/v2/jpg/01/66/23/90/1000_F_166239056_zSf7gw5cOGWwQuXl6w1C3SuZU16dAKQ0.jpg"}
            />   
                  
        </div>}
        <span style={{ marginRight: senderMe ? "80px" : "58px" }}>
          
          <Linkify 
          tagName="span" 
          options={{target: '_blank'}}
          >
            {overflow ? message.substring(0, 400) + "..." : message}
          </Linkify>
          
        </span>
        {overflow && (
          <p className="readmore" onClick={() => setOverflow(false)}>
            Read More
          </p>
        )}

        <div className="nchat_timestamp">
          {senderMe && (
            <div
              className={"nseenicon" + (readBy[reader] ? " nseeniconseen" : "")}
            >
              <DoneAllIcon style={{ height: "17px", width: "17px" }} />
            </div>
          )}
          <div
            className={
              senderMe ? "nchat_timestamp_receiver" : "nchat_timestamp_sender"
            }
          >
            {`${timestamp.hours}:${
              timestamp.minutes < 10
                ? `0${timestamp.minutes}`
                : timestamp.minutes
            } ${timestamp.median}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
