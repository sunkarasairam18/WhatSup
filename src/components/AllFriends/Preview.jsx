import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router';

import { firestore } from '../../services/firebase';
import { doc,onSnapshot } from 'firebase/firestore';
import {Link} from 'react-router-dom'

import '../../css/AllFriends/Preview.css';


const Preview = ({selectedId,setSelectedId,setPreviewUrl}) => {
    const [friend,setFriend] = useState({
        name:"",about:"",photoUrl:"",email:""
    });
    const {previewId} = useParams();
    const [showLine,setShowLine] = useState(false);

    useEffect(()=>{
        if(!selectedId){
            console.log("Hope fully");
            setSelectedId(previewId);
        };
    },[previewId]);

    useEffect(()=>{
        const friendDoc = doc(firestore,`Accounts/${previewId}`);
        onSnapshot(friendDoc,friendUpdate =>{
            if(friendUpdate.exists()){
                const {displayName,About,photoUrl,email} = friendUpdate.data();
                setFriend({
                    name: displayName,
                    about: About,
                    photoUrl: photoUrl,
                    email: email
                });
            };
        });
    });

    return ( 
        <div className="Preview">
            <div className="Pcontent">
                
            {/* <div className="PSubcontent">
                    
            </div> */}
                <Link to={`/friends/list/${previewId}/display`}>
                    <img src={friend.photoUrl} className="Ppic" onClick={()=>setPreviewUrl(friend.photoUrl)}/>
                </Link>
                    
            </div>
            <div className="Pinfo">
                    <div className="Pname">
                        {friend.name}
                    </div>
                    <div className="Pfriendscount" onMouseEnter={()=>setShowLine(true)} onMouseLeave={()=>setShowLine(false)}>
                        61 Friends
                        {showLine && <hr className="Pfchr"/>}
                    </div>
                    <div className="Pemail">
                        {friend.email}
                    </div>
                    <div className="Pbio">
                        {friend.about}
                    </div>
            </div>
        </div>
    );
}
 
export default Preview;