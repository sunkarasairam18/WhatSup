import React,{useState,useEffect} from 'react';
import { firestore } from '../../services/firebase';
import { doc,onSnapshot } from 'firebase/firestore';
import { useStateValue } from '../../services/StateProvider';
import { Avatar } from "@mui/material";
import '../../css/AllFriends/PopUpCard.css';

const PopUpCard = ({id}) => {
    const [friend,setFriend] = useState({name:"",photoUrl:"",email:""});
    const [{user},dispatch] = useStateValue();

    useEffect(()=>{
        if(id){
            const friendDoc = doc(firestore,`Accounts/${id}`);
            onSnapshot(friendDoc,friendUpdate =>{
                if(friendUpdate.exists()){
                    const {displayName,photoUrl,email} = friendUpdate.data();
                    setFriend({name: displayName,photoUrl: photoUrl,email: email});
                }
            });
        }
    },[id])


    return ( 
        <div className="PUCard">
            <div className="PUCcontent">
                {/* <img src={friend.photoUrl} style={{height:"50px",width:"50px",borderRadius:"25px"}} /> */}
                <Avatar src={friend.photoUrl} style={{height:"50px",width:"50px"}}/>
                <div className="PUCC_info">

                <div className="PUCCname">
                    {user.uid === id?"You":friend.name}
                </div>
                <div className="PUCCI_email">
                    {friend.email}
                </div>
                </div>
            </div>
        </div>
    );
}
 
export default PopUpCard;