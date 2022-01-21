import { Avatar } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { doc,onSnapshot,getDoc,updateDoc,query,collection,orderBy,where,limit } from '@firebase/firestore';
import {firestore} from '../../services/firebase';
import { useStateValue } from '../../services/StateProvider';
import '../../css/Home/SidebarChat.css';
import {getObjectfromDate} from './Chat';
import '../../css/common/StandardTransition.css';

const SidebarChat = ({userId,friendName,friendId,containerId,selectId,onSelect,setChatTyping,notificationsAvail}) => {
    const [lastmessage,setLastmessage] = useState("");
    const [{user,clearNotification},dispatch] = useStateValue();
    const [typing,setTyping] = useState(false);
    const [timeTag,setTimetag] = useState("");
    const [notify,setNotify] = useState();
    const [url,setUrl] = useState("");
    const [first,setFirst] = useState(true);
    const linkRef = useRef(null);
    const [notification,setNotification] = useState();
    
    var pastmsgId = "";

    useEffect(()=>{
        if(notification){
            notification.close();            
        }
    },[clearNotification]);   

    function showNotification(msg,photo,name){
        var options = {
          body: msg,
          icon: photo?photo:"https://scontent.fvga4-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-5&_nc_sid=7206a8&_nc_ohc=2skap-CRIy4AX-O19Y1&_nc_ht=scontent.fvga4-1.fna&oh=00_AT8idiBEEBZyWG1aoOkE6Z0EGCci7ADnoSLQzAKOOxoKCQ&oe=61FCCDF8",
          dir: "ltr",
          renotify: true,
          tag: friendId
        };
        setNotification(new Notification(name, options));        
    };

    useEffect(()=>{
        if(notification){
            notification.onclick = function(event){
                event.preventDefault();
                window.focus();
                linkRef.current.click();
                notification.close();
            }
        }
    },[notification]);

    useEffect(()=>{
        if(lastmessage){
            const tag = properTag(lastmessage?.timestamp);
            setTimetag(tag);
            // console.log("Trying to show notification : ",friendName);
            const {receiver,readBy} = lastmessage;

            if(notificationsAvail && !first && receiver === userId ){
                console.log("Trying to show notification : ",friendName);
                if(readBy && !readBy[userId] ){
                    if(user.onlineStatus){
                        if(selectId !== friendId){
                            console.log(notificationsAvail,!first,receiver,userId,readBy[userId],selectId,friendId,new Date());
                            // showNotification(lastmessage.message+" - "+tag,url,friendName);
                        }
                    }else{
                        showNotification(lastmessage.message+" - "+tag,url,friendName);
                        
                    }
                }
                //&& !first && lastmessage.receiver === userId &&
                // if(first){
                //     console.log("Trying to show notification : ",friendName);
                //     showNotification(lastmessage.message,url,friendName);
                // }
            }
            if(first) setFirst(false);
        }
    },[lastmessage]);

    useEffect(()=>{
        if(friendId){
            const db = doc(firestore,`Accounts/${friendId}`);
            onSnapshot(db,docQuery =>{
                if(docQuery.exists()){
                    const {displayName,photoUrl} = docQuery.data();
                    setUrl(photoUrl);
                    if(friendName !== displayName) updateFriendName(displayName);                    
                    
                }
            });
        }
    },[friendId]);


    useEffect(()=>{
        if(selectId == friendId){
            setChatTyping(typing);
        }
    },[selectId,typing]);

    useEffect(()=>{
        if(containerId){
            const container = doc(firestore,`ChatContainers/${containerId}`);
            onSnapshot(container,(containerSnapshot)=>{
                if(containerSnapshot.exists()){
                    const containerData = containerSnapshot.data();
                    setTyping(containerData[friendId].typing);     
                    const {lastMessageId} = containerData;      
                    if(pastmsgId !== lastMessageId){
                        
                        console.log("Past msg id: ",pastmsgId,lastMessageId);
                        getLastMessage(containerId,containerData.lastMessageId);
                        pastmsgId = lastMessageId;
                        
                    }
                }
            });   
            
        }
    },[containerId])

    useEffect(()=>{
        if(containerId){
            const notifyQuery = query(
                collection(firestore, `ChatContainers/${containerId}/messages`),
                where(`readBy.${userId}`,"==",false),
                limit(1)
            );
            onSnapshot(notifyQuery,(notifySnapshot)=>{
                setNotify(notifySnapshot.docs?.length>0?true:false);
            });            
        }
    },[containerId]);

    async function getLastMessage(containerId,Id){
        const msgContainer = doc(firestore,`ChatContainers/${containerId}/messages/${Id}`);
        const snapShot = await getDoc(msgContainer);
        if(Id == "start"){
            if(snapShot.exists()){
                setLastmessage({
                    ...snapShot.data(),
                    message: `You and ${friendName},Both are friends now.`
                });
            }
        }else{
            if(snapShot.exists()){
                setLastmessage(snapShot.data());
            }
        }        
    }
   
    async function updateFriendName(name){
        const db = doc(firestore,`Accounts/${userId}/Friends/${friendId}}`);
        const displayName = {
            friendName: name,
        };
        await updateDoc(db,displayName);
    };        

    const shortString = (msg,l) =>{
        if(msg){
            if(msg.length>l) return msg.substring(0,l)+"...";
            return msg;
        }        
    }

    return (
        <Link to={`/${friendId}/${containerId}`} ref={linkRef} onClick={()=>onSelect(friendId)}>
            <div className={selectId === friendId?"sidebarChatSelected":"sidebarChat"}>
                <Avatar src={`${url}`} style={{width:"50px",height:"50px"}}/>
                <div className="sidebarChat_info">
                    <div className="sci_main">
                        <div className="sci_name">{shortString(friendName,29)}</div>
                        <span>{timeTag}</span>                         
                    </div>                 
                    <div className="sci_last_content">
                        {!typing && <p className={`lastmsgcontext ${selectId === friendId?"":(notify?"notifytext":"")}`}>{shortString(lastmessage.message,35)}</p>}                        
                        {typing && <p className="typing">typing...</p>}
                    </div>
                    {selectId !== friendId && notify &&
                    <div className="sci_badge"/>}
                        
                </div>      
               
         
            </div>
            
        </Link>
       
    );
}


export function properTag(msgDate){
    var tag = "";
    const todaystamp = Math.round(new Date().getTime() / 1000);
    const exactTwelve = 86400*Math.trunc(todaystamp/86400);
    const date = getObjectfromDate(new Date(msgDate?.toDate()));
    if(exactTwelve <= msgDate?.seconds){
        tag = `${date.hours}:${date.minutes<10?`0${date.minutes}`:date.minutes} ${date.median}`;
    }
    else if(exactTwelve - msgDate?.seconds < 86400){
        tag = "yesterday";
    }    
    else if(exactTwelve - msgDate?.seconds < 604800){
        tag = date.day;
    }else{
        tag = `${date.date<10?`0${date.date}`:date.date}/${date.month<10?`0${date.month}`:date.month}/${date.year}`;
    }             
    return tag;
}

export default SidebarChat;