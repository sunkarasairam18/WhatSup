import React, { useState, useRef, useEffect } from "react";
import { Avatar, IconButton } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import {
  query,
  onSnapshot,
  doc,
  collection,
  addDoc,
  updateDoc,
  orderBy
} from "@firebase/firestore";
import Picker from "emoji-picker-react";
import { CSSTransition } from "react-transition-group";
import { KeyboardArrowDown } from "@mui/icons-material";

import { useStateValue } from "../../services/StateProvider";
import { firestore } from "../../services/firebase";
import InfoBubble from "./InfoBubble";
import FriendInfo from "./FriendInfo";
import ChatBubble from "./ChatBubble";
import "../../css/Home/Chat.css";

const Chat = ({
  setSearch,
  setSearchIcon,
  selectId,
  setSelectId,
  chatTyping,
  setChatTyping
}) => {
  const [input, setInput] = useState("");
  const { friendId, containerId } = useParams();
  const [friend, setFriend] = useState({});
  // const [typing,setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [lastSeen, setLastSeen] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  var pastmsg = "";

  const [showBottomArrow, setShowBottomArrow] = useState(true);

  const observer = new IntersectionObserver(([entry]) =>
    setShowBottomArrow(entry.isIntersecting)
  );

  useEffect(() => {
    observer.observe(bottomRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const bottomRef = useRef(null);
  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: "auto" });
  };

  useEffect(()=>{
    if(showBottomArrow) scrollToBottom();          
  }, [messages]);


  useEffect(() => {
    setLastSeen(getLastSeen(friend?.lastSeen));
  }, [friend]);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  useEffect(() => {
    if (!selectId) setSelectId(friendId);
    setShowInfo(false);
  }, [friendId]);

  useEffect(() => {
    if (friendId && containerId) {
      const document = doc(firestore, `Accounts/${friendId}`);
      onSnapshot(document, (docUpdate) => {
        if (docUpdate.exists()) {
          const docData = docUpdate.data();
          // console.log(`Data : ${JSON.stringify(docData)}`);
          setFriend(docData);
        }
      });
      const chatQuery = query(
        collection(firestore, `ChatContainers/${containerId}/messages`),
        orderBy("timestamp")
      );
      onSnapshot(chatQuery, (chatSnapshot) => {
        setMessages(
          chatSnapshot.docs.map((chat) => ({
            id: chat.id,
            data: chat.data(),
          }))
        );
      });
    }
  }, [friendId, containerId]);

  const handleChange = (value) =>{
    setInput(value);
    updateUserTyping(true);
  };

  const updateUserTyping = (typingBool) =>{
    const db = doc(firestore,`ChatContainers/${containerId}`);
    const typingDoc = {
        [user.uid]: {
            typing: typingBool
        },        
    };
    updateDoc(db,typingDoc);
  };

  useEffect(()=>{handleTyping()},[input]);

  const handleTyping = async () =>{
    setTimeout(()=>{
        updateUserTyping(false);
    },2500);
  };

  

  // useEffect(()=>{
  //     if(friendId && containerId){
  //         const document = doc(firestore,`ChatContainers/${containerId}`);
  //         onSnapshot(document,docUpdate=>{
  //             if(docUpdate.exists()){
  //                 const useDoc = docUpdate.data();
  //                 console.log(useDoc);
  //                 setTyping(useDoc.typingBy[friendId]);
  //             }
  //         });
  //     }
  // },[friendId,containerId]);

  async function sendMessage(msg) {
    msg.preventDefault();
    setSearch("");
    setSearchIcon(false);
    const chatCollection = collection(
      firestore,
      `ChatContainers/${containerId}/messages`
    );
    const temporarymessage = input;
    setInput("");
    var readBy = {};
    readBy[user.uid] = true;
    readBy[friendId] = false;
    const msgObj = {
      message: temporarymessage,
      readBy: { ...readBy },
      sender: user.uid,
      timestamp: new Date(),
    };
    const newMessage = await addDoc(chatCollection, msgObj);
    const sameUpdate = {
      lastsent: msgObj.timestamp,
    };
    const userDoc = doc(
      firestore,
      `Accounts/${user.uid}/Friends/${friendId}`
    );
    const friendDoc = doc(
      firestore,
      `Accounts/${friendId}/Friends/${user.uid}`
    );
    const newLastMsg = doc(firestore, `ChatContainers/${containerId}`);
    const newDoc = {
      lastMessageId: newMessage["_key"]["path"]["segments"][3],
    };
    updateDoc(newLastMsg, newDoc);
    updateDoc(userDoc, sameUpdate, { merge: true });
    updateDoc(friendDoc, sameUpdate, { merge: true })
      .then((e) => {
        console.log("Time updated ",e);
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  }

  function correctCss(sender, myId, pastSenderId) {
    var s = "nchat_message ";
    if (sender === myId) {
      s += "nchat_receiver ";
    }
    if (!pastSenderId) {
      s += sender === myId ? "chat_right_corner " : "chat_left_corner ";
    } else if (pastSenderId === myId) {
      s += sender === myId ? "" : "chat_left_corner ";
    } else {
      s += sender === myId ? "chat_right_corner " : "";
    }
    pastmsg = sender;
    return s;
  }

  function getLastSeen(lastSeenStamp) {
    var day = "";
    const todaystamp = Math.round(new Date().getTime() / 1000);
    const date = getObjectfromDate(new Date(lastSeenStamp?.toDate()));
    if (todaystamp - lastSeenStamp?.seconds < 86400) {
      day = `today `;
    } else if (todaystamp - lastSeenStamp?.seconds < 172800) {
      day = `yesterday `;
    } else if (todaystamp - lastSeenStamp?.seconds < 604800) {
      day = `${date.day} `;
    } else {
      day = `${date.date < 10 ? `0${date.date}` : date.date}/${
        date.month < 10 ? `0${date.month}` : date.month
      }/${date.year} `;
    }
    day += `at ${date.hours}:${
      date.minutes < 10 ? `0${date.minutes}` : date.minutes
    } ${date.median}`;
    return day;
  }


  return (
    <div className="chat_container">
      <div className="chat">
        <CSSTransition in={showInfo} timeout={450} classNames="chatTransition">
          <div className="chat_in">
            <div className="chat_header">
              <div
                className="chat_header_content"
                onClick={() => setShowInfo(true)}
              >
                <Avatar src={friend.photoUrl} />
                <div className="chat_headerInfo">
                  <h3>{friend.displayName}</h3>
                  <p>
                    {!chatTyping
                      ? friend?.onlineStatus
                        ? `online`
                        : `last seen ${lastSeen}`
                      : "typing..."}
                  </p>
                </div>
              </div>
              <div className="chat_headerRight">
                <IconButton>
                  <SearchOutlined />
                </IconButton>                
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </div>
            </div>
            <div className="chat_body">
              {/* {messages.map(({ id, data }) => (
                <ChatBubble
                  key={id}
                  fullClass={correctCss(data.sender, user.uid, pastmsg)}
                  message={data.message}
                  timestamp={getObjectfromDate(
                    new Date(data.timestamp?.toDate())
                  )}
                />
              ))} */}
              {messages.map(({id,data})=>(
                data.sender!="start"?(
                <ChatBubble
                  key={id}
                  fullClass={correctCss(data.sender, user.uid, pastmsg)}
                  message={data.message}
                  timestamp={getObjectfromDate(new Date(data.timestamp?.toDate()))}
                  senderMe={data.sender == user.uid}
                />):(
                  <InfoBubble
                  key={id}
                  displayName={friend.displayName}
                  message={data.message}/>
                )
              ))}
              <div ref={bottomRef}></div>
              {/* <div className="arrow_container">

                    <div className="arrow_down">
                        <KeyboardArrowDown style={{height:"30px",width:"30px",color:"grey"}}/>
                    </div>
                    </div> */}
            </div>
            <div className="chat_footer">
              <IconButton>
                <InsertEmoticonIcon />
              </IconButton>

              <form>
                <input
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Type a message"
                  type="text"

                />
                <button onClick={sendMessage}>Send a message</button>
              </form>
              <SendIcon style={{ height: "24px", width: "24px" }} />
              <CSSTransition
                in={!showBottomArrow}
                timeout={600}
                unmountOnExit
                classNames="bottom_arrow"
              >
                <div className="arrow_down" onClick={scrollToBottom}>
                  <KeyboardArrowDown
                    style={{ height: "30px", width: "30px", color: "grey" }}
                  />
                </div>
              </CSSTransition>
            </div>
          </div>
        </CSSTransition>

        {/* <div className="chat_emoji_footer" >
            <Picker onEmojiClick={onEmojiClick}/>
            </div> */}
        <CSSTransition
          in={showInfo}
          timeout={400}
          unmountOnExit
          classNames="friendinfobar"
        >
          <FriendInfo
            onCross={setShowInfo}
            name={friend.displayName}
            about={friend.About}
            photo={friend.photoUrl}
            email={friend.email}
          />
        </CSSTransition>
      </div>
    </div>
  );
};

export function getObjectfromDate(c) {
  var date = {};
  var days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thrusday",
    5: "Friday",
    6: "Saturday",
  };
  date["day"] = days[c.getDay().toString()];
  date["month"] = c.getMonth() + 1;
  date["date"] = c.getDate();
  date["year"] = c.getFullYear();
  const hours = c.getHours();
  date["hours"] =
    hours >= 12 ? (hours === 12 ? 12 : hours - 12) : hours === 0 ? 12 : hours;
  date["minutes"] = c.getMinutes();
  date["median"] = hours > 11 ? "pm" : "am";
  return date;
}

export default Chat;
