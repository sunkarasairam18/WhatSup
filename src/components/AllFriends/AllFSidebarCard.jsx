import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import '../../css/AllFriends/AllFSidebarCard.css';
import { firestore } from '../../services/firebase';
import { doc,onSnapshot } from 'firebase/firestore';
import '../../css/FRequests/FRSidebarCard.css';

const AllFSidebarCard = ({id,to,selected,setSelectedId}) => {
    const [friend,setFriend] = useState({name:"",photoUrl:""});

    useEffect(()=>{
        console.log("Id",id);
        if(id){
            const friendDoc = doc(firestore,`Accounts/${id}`);
            onSnapshot(friendDoc,friendUpdate =>{
                if(friendUpdate.exists()){
                    const {displayName,photoUrl} = friendUpdate.data();
                    setFriend({name: displayName,photoUrl: photoUrl});
                }
            });
        }
    },[id])


    return ( 
        <Link to={to}>
            <div className="AFSCard">
                <div className={`ASFCcontent ${selected?"AFSCselect":""}`} onClick={()=>setSelectedId(id)}>
                    {/* <img src={friend.photoUrl} style={{height:"50px",width:"50px",borderRadius:"25px"}} /> */}
                    <Avatar src={friend.photoUrl} style={{width:"50px",height:"50px"}}/>
                    <div className="ASFCCPname">
                        {friend.name}
                    </div>
                </div>
            </div>                        
        </Link>
     );
}
 
export default AllFSidebarCard;