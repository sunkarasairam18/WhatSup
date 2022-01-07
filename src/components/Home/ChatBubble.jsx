import React, { useState, useEffect } from "react";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import "../../css/Home/ChatBubble.css";

const ChatBubble = ({ fullClass, message, timestamp, senderMe }) => {
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    if (message.length > 400 && !overflow) setOverflow(true);
  }, []);

  return (
    <div
      className={`nchat_message ${fullClass}`}
      style={{ backgroundColor: senderMe ? "" : "white" }}
    >
      <span style={{ marginRight: senderMe ? "80px" : "58px"}}>
        {overflow ? message.substring(0, 400)+"..." : message}
      </span>
      {overflow && <p className="readmore" onClick={()=>setOverflow(false)}>Read More</p>}

      <div className="nchat_timestamp">
        {senderMe && (
          <div className="nseenicon">
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
