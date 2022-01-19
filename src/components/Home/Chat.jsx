import React, { useState, useRef, useEffect } from "react";
import produce from "immer";
import { Avatar, IconButton } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import {
  query,
  onSnapshot,
  doc,
  collection,
  addDoc,
  updateDoc,
  orderBy,
  startAt,
  limit
} from "@firebase/firestore";
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
  const [messages, setMessages] = useState([]);
  const [renderMsgs,setRenderMsgs] = useState([]);
  const [laststamp,setLastStamp] = useState();
  const [{ user }, dispatch] = useStateValue();
  const [lastSeen, setLastSeen] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [unread,setUnread] = useState(false);
  const [unreadCount,setUnreadCount] = useState(0);
  const [unreadId,setUnreadId] = useState("");
  const [canRender,setCanRender] = useState(true);
  const [appMsgLoader,setAppMsgLoader] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(true);

  var pastmsg = "";
  var statelessMsgs = [];

  //to display arrow to scroll down quickly

  const bottomRef = useRef(null);

  const observer = new IntersectionObserver(([entry]) =>
    setShowBottomArrow(entry.isIntersecting)
  );

  useEffect(() => {
    observer.observe(bottomRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: "auto" });
  };

  useEffect(()=>{
    scrollToBottom();
  },[]);

  useEffect(()=>{
             
    for(var i = 0;i<messages.length;i++){
      const {id,data:{sender,readBy}} = messages[i];
      
      if(id!="start" && sender != user.uid  && !readBy[user.uid] && !unreadId){
        console.log("Id : ",id);
        setUnreadId(id);
        break;
      }      
    }
    // var i = messages.filter(msg => msg.id != "start" && !msg.data.readBy[user.uid]).length;
    // console.log("length : ",i);
    if(unreadCount<=0) setUnreadCount(messages.filter(msg => msg.id != "start" && !msg.data.readBy[user.uid]).length);
  }, [messages]);


  const fetchMore = ()=>{
    if(laststamp){
      const readQuery = query(
          collection(firestore, `ChatContainers/${containerId}/messages`),
          orderBy("timestamp","desc"),
          startAt(laststamp),
          limit(18)
      );
        
      onSnapshot(readQuery, (chatSnapshot) => {
          var newMsgs = chatSnapshot.docs.map((chat) => ({
              id: chat.id,
              data: chat.data(),
          }));
          console.log("New msgs : ",newMsgs);
          newMsgs = messages.concat(newMsgs.slice(1));
          setMessages(newMsgs);
      });
    }
  };


  const msgLoader = useRef();

  const loaderObserver = new IntersectionObserver(([entry]) =>{
    setAppMsgLoader(entry.isIntersecting);
    console.log("Appearance : ",entry.isIntersecting);
    }
  );

  useEffect(() => {        
    loaderObserver.observe(msgLoader.current);
      return () => {
        loaderObserver.disconnect();
      };
  }, []);

  useEffect(()=>{
      if(appMsgLoader && canRender){
          setTimeout(()=>fetchMore(),1500);
      }
  },[appMsgLoader]);    

  useEffect(() => {
    setLastSeen(getLastSeen(friend?.lastSeen));
  }, [friend]);

  useEffect(() => {
    if (!selectId) setSelectId(friendId);
    setShowInfo(false);
  }, [friendId]);

  useEffect(() => {
    if (friendId) {
      const document = doc(firestore, `Accounts/${friendId}`);
      onSnapshot(document, (docUpdate) => {
        if (docUpdate.exists()) {
          const docData = docUpdate.data();
          // console.log(`Data : ${JSON.stringify(docData)}`);
          setFriend(docData);
        }
      });      
      
    }
  }, [friendId]);

  useEffect(()=>{
    if(containerId){
      const readQuery = query(
        collection(firestore, `ChatContainers/${containerId}/messages`),
        orderBy("timestamp","desc"),
        limit(18)
      );
      
      onSnapshot(readQuery, (chatSnapshot) => {
          console.log(chatSnapshot.docs);
            setMessages(
            chatSnapshot.docs.map((chat) => ({
                id: chat.id,
                data: chat.data(),
            }))
            );
        });
      setCanRender(true);  
    }      
  },[containerId]);

  useEffect(()=>{     //Storing reference of timestamp last rendered to paginate somemore chat 
    if(messages && canRender){
        setLastStamp(messages[messages.length-1]?.data?.timestamp);
        if(messages[messages.length-1]?.id == "start"){
            setCanRender(false);
        }
        console.log("Last documents : ",messages[messages.length-1],messages[messages.length-1]?.data?.timestamp);
       
    }
    if(messages){
      const reverseMsgs = produce(messages, draft =>{
        return draft.reverse();
      });
      statelessMsgs = reverseMsgs;
      setRenderMsgs(reverseMsgs);
    }
},[messages]);



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


  async function sendMessage(msg) {
    msg.preventDefault();
    if(input.trim() === "") return;
    // scrollToBottom();
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
      receiver: friendId,
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

  function correctCss(sender, myId) {
    var s = "nchat_message ";
    if (sender === myId) {
      s += "nchat_receiver ";
    }
    if (!pastmsg) {
      s += sender === myId ? "chat_right_corner " : "chat_left_corner ";
    } else if (pastmsg === myId) {
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
    const exactTwelve = 86400*Math.trunc(todaystamp/86400);
    const date = getObjectfromDate(new Date(lastSeenStamp?.toDate()));
    if(exactTwelve <= lastSeenStamp?.seconds){
      day = `today `;
    }
    // if (exactTwelve - lastSeenStamp?.seconds < 86400) {
    //   day = `today `;
    // } 
    else if (exactTwelve - lastSeenStamp?.seconds < 86400) {
      day = `yesterday `;
    } else if (exactTwelve - lastSeenStamp?.seconds < 604800) {
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
                  {/* <h3>{reachedTop?"Reached top":"Not reached top"}</h3> */}
                  <p>
                    {!chatTyping
                      ? friend?.onlineStatus
                        ? `online`
                        : `last seen ${lastSeen}`
                      : "typing..."}
                  </p>
                </div>
              </div>
              
            </div>
            <div className="chat_body">                            
            

              <div className="chatbody_in">
                <div ref={bottomRef}></div>
                
                <div className="cb_ii">
                  
                  {renderMsgs.map(({id,data})=>(
                    data.sender!="start"?(                  
                      <ChatBubble
                        key={id}
                        msgId = {id}
                        fullClass={correctCss(data.sender, user.uid)}
                        message={data.message}
                        timestamp={getObjectfromDate(new Date(data.timestamp?.toDate()))}
                        senderMe={data.sender == user.uid}
                        reader={data.receiver}
                        readBy={data.readBy}
                        containerId={containerId}
                        unreadId={unreadId}
                        unread={unread}
                        setUnreadId={setUnreadId}
                        unreadCount={unreadCount}
                      />                        
                    ):(
                      <InfoBubble
                      key={id}
                      displayName={friend.displayName}
                      message={data.message}
                      senderMe={data.sender == user.uid}
                      reader={data.receiver}
                      readBy={data.readBy}
                      containerId={containerId}
                      msgDocId={id}
                      />
                    )
                  ))}
                  
                </div>
                <div ref={msgLoader} ></div>


              </div>
              
              {appMsgLoader && canRender &&
                  <div className="circular">
                    <div className="incir">
                      <CircularProgress color="success" />
                    </div>
                  </div>
                }
            
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
              <SendIcon style={{ height: "24px", width: "24px" }} style={{cursor:"pointer"}} onClick={sendMessage}/>
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
    4: "Thursday",
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
