import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import '../../css/AllFriends/AllFSidebarCard.css';
import { firestore } from '../../services/firebase';
import { useStateValue } from '../../services/StateProvider';
import { doc,onSnapshot,updateDoc } from 'firebase/firestore';
import '../../css/FRequests/FRSidebarCard.css';

const AllFSidebarCard = ({id,name,to,selected,setSelectedId}) => {
    const [friend,setFriend] = useState({name:"",photoUrl:""});
    const [{user},dispatch] = useStateValue();

    useEffect(()=>{
        if(id){
            const friendDoc = doc(firestore,`Accounts/${id}`);
            onSnapshot(friendDoc,friendUpdate =>{
                if(friendUpdate.exists()){
                    const {displayName,photoUrl} = friendUpdate.data();
                    setFriend({name: displayName,photoUrl: photoUrl});
                    if(name!=displayName) updateFriendName(displayName,id);
                }
            });
        }
    },[id])

    async function updateFriendName(name,friendId){
        const db = doc(firestore,`Accounts/${user.uid}/Friends/${friendId}}`);
        const displayName = {
            friendName: name,
        };
        await updateDoc(db,displayName);
    }; 

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