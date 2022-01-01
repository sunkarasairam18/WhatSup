import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc,onSnapshot,getDoc,updateDoc } from '@firebase/firestore';

import {firestore} from '../../services/firebase';
import '../../css/Home/SidebarChat.css';
import {getObjectfromDate} from './Chat';

const SidebarChat = ({uid,friendName,friendId,friendInfoDocId,containerId,selectId,onSelect,setChatTyping}) => {
    const [lastmessage,setLastmessage] = useState("");
    const [typing,setTyping] = useState(false);
    const [timeTag,setTimetag] = useState("");
    const [url,setUrl] = useState("");

    useEffect(()=>{
        setTimetag(properTag(lastmessage?.timestamp));
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
                    getLastMessage(containerId,containerData.lastMessageId);
                }
            });   
            
        }
    },[containerId])

    async function getLastMessage(containerId,Id){
        const msgContainer = doc(firestore,`ChatContainers/${containerId}/messages/${Id}`);
        const snapShot = await getDoc(msgContainer);
        if(snapShot.exists()){
            setLastmessage(snapShot.data());
        }
    }
   
    async function updateFriendName(name){
        const db = doc(firestore,`Accounts/${uid}/Friends/${friendInfoDocId}`);
        const timestamp = {
            friendName: name,
        };
        await updateDoc(db,timestamp);
    };        

    const shortString = (msg,l) =>{
        if(msg){
            if(msg.length>l) return msg.substring(0,l)+"...";
            return msg;
        }        
    }

    return (
        <Link to={`/${friendId}/${containerId}/${friendInfoDocId}`} onClick={()=>onSelect(friendId)}>
            <div className={selectId === friendId?"sidebarChatSelected":"sidebarChat"}>
                <Avatar src={`${url}`} style={{width:"50px",height:"50px"}}/>
                <div className="sidebarChat_info">
                    <div className="sidebarChat_info_main">
                        <div className="sidebarChat_info_name">{shortString(friendName,29)}</div>
                        <span>{timeTag}</span>                         
                    </div>                   
                    <div className="sidebarChat_info_last_content">
                        {!typing && <p className="lastmsgcontext">{shortString(lastmessage.message,38)}</p>}                        
                        {typing && <p className="typing">typing...</p>}
                    </div>
                </div>               
            </div>
            
        </Link>
       
    );
}


export function properTag(msgDate){
    var tag = "";
    const todaystamp = Math.round(new Date().getTime()/ 1000); 
    const date = getObjectfromDate(new Date(msgDate?.toDate()));
    if(todaystamp - msgDate?.seconds < 86400){
        tag = `${date.hours}:${date.minutes<10?`0${date.minutes}`:date.minutes} ${date.median}`;
    }
    else if(todaystamp - msgDate?.seconds < 172800){
        tag = "yesterday";
    }
    else if(todaystamp - msgDate?.seconds < 604800){
        tag = date.day;
    }else{
        tag = `${date.date<10?`0${date.date}`:date.date}/${date.month<10?`0${date.month}`:date.month}/${date.year}`;
    }             
    return tag;
}

export default SidebarChat;