import React,{useState,useEffect,useRef} from 'react';
import { firestore } from '../services/firebase';
import { doc,query ,limit , collection,orderBy, onSnapshot, startAt} from 'firebase/firestore';
import produce from 'immer';

import '../css/Test.css';
import ChatBubble from './Home/ChatBubble';
import InfoBubble from './Home/InfoBubble';
import { useStateValue } from '../services/StateProvider';
import { getObjectfromDate } from './Home/Chat';
import { CircularProgress } from '@material-ui/core';

const Test = ({imageUrl}) => {
    const [friendId,setFriendId] = useState("Y3tSLXIbqJWhjXsqpegtl9XPzqi1");
    const [containerId,setContainerId] = useState("483WRxnSehfvtKhCv5tq");    
    const [messages,setMessages] = useState([]);
    const [renderMsgs,setRenderMsgs] = useState([]);
    const [laststamp,setLastStamp] = useState();
    const [canRender,setCanRender] = useState(true);
    const [appMsgLoader,setAppMsgLoader] = useState(false);
    const [{user},dispatch] = useStateValue();
    const [friend,setFriend] = useState();
    var pastmsg="";


    const fetchMore = ()=>{
        if(laststamp){
        const readQuery = query(
            collection(firestore, `ChatContainers/${containerId}/messages`),
            orderBy("timestamp","desc"),
            startAt(laststamp),
            limit(10)
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
    const observer = new IntersectionObserver(([entry]) =>{
        setAppMsgLoader(entry.isIntersecting);
        console.log("Appearance : ",entry.isIntersecting);
    }
    );

    useEffect(() => {        
        observer.observe(msgLoader.current);
        return () => {
        observer.disconnect();
        };
    }, []);

    useEffect(()=>{
        if(appMsgLoader && canRender){
            setTimeout(()=>fetchMore(),1000);
        }
    },[appMsgLoader]);

    useEffect(()=>{
        if(containerId){
          const readQuery = query(
            collection(firestore, `ChatContainers/${containerId}/messages`),
            orderBy("timestamp","desc"),
            limit(20)
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
        }
      },[containerId]);

    //   useEffect(()=>{
    //     if(reachedTop && containerId){
    //         if(lastDoc){
    //             const readQuery = query(
    //                 collection(firestore, `ChatContainers/${containerId}/messages`),
    //                 orderBy("timestamp","desc"),
    //                 startAfter(lastDoc),
    //                 limit(10));
    //             onSnapshot(readQuery, (chatSnapshot) => {
    //                 setMessages(
    //                     chatSnapshot.docs.reverse().map((chat) => ({
    //                     id: chat.id,
    //                     data: chat.data(),
    //                     }))
    //                 );
    //             });
    //         }
    //     }
    //   },[reachedTop]);


    useEffect(()=>{
        if(messages && canRender){
            setLastStamp(messages[messages.length-1]?.data?.timestamp);
            if(messages[messages.length-1]?.id == "start"){
                setCanRender(false);
            }
            console.log("Last documents : ",messages[messages.length-1],messages[messages.length-1]?.data?.timestamp);
            const reverseMsgs = produce(messages, draft =>{
                return draft.reverse();
            });
            setRenderMsgs(reverseMsgs);
        }
    },[messages]);

    useEffect(() => {
    if (friendId) {
        const document = doc(firestore, `Accounts/${friendId}`);
        onSnapshot(document, (docUpdate) => {
        if (docUpdate.exists()) {
            const docData = docUpdate.data();
            setFriend(docData);
        }
        });      
        
    }
    }, [friendId]);

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

    return ( 
        <div className="t">            
                <div className="out_t">
                    {appMsgLoader && canRender &&
                            <div className="tcircular">
                                <div className="tincir">
                                    <CircularProgress color="success" />
                                </div>
                            </div>
                        }
                <div className="t_box">
                    <div>

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

                   <div ref={msgLoader}></div>

                </div>
                </div>

                
                     
        </div>
     );
}
 
export default Test;