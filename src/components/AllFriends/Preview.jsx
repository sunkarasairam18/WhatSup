import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router';

import { firestore } from '../../services/firebase';
import { doc,onSnapshot } from 'firebase/firestore';
import {Link} from 'react-router-dom'

import '../../css/AllFriends/Preview.css';


const Preview = ({selectedId,setSelectedId,setPreviewUrl}) => {
    const [friend,setFriend] = useState({
        name:"",about:"",photoUrl:""
    });
    const {previewId} = useParams();

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
                const {displayName,About,photoUrl} = friendUpdate.data();
                setFriend({
                    name: displayName,
                    about: About,
                    photoUrl: photoUrl
                });
            };
        });
    });

    return ( 
        <div className="Preview">
            <div className="Pcontent">
                <div className="PSubcontent">
                    <Link to={`/friends/list/${previewId}/display`}>
                        <img src={friend.photoUrl} className="Ppic" onClick={()=>setPreviewUrl(friend.photoUrl)}/>
                    </Link>
                    <div className="Pname">
                        {friend.name}
                    </div>
                    <div className="Pbio">
                        {friend.about}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Preview;