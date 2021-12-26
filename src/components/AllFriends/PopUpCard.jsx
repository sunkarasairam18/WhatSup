import React,{useState,useEffect} from 'react';
import { firestore } from '../../services/firebase';
import { doc,onSnapshot } from 'firebase/firestore';
import '../../css/AllFriends/PopUpCard.css';

const PopUpCard = ({id}) => {
    const [friend,setFriend] = useState({name:"",photoUrl:""});

    useEffect(()=>{
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
        <div className="PUCard">
            <div className="PUCcontent">
                <img src={friend.photoUrl} style={{height:"50px",width:"50px",borderRadius:"25px"}} />
                <div className="PUCCname">
                    {friend.name}
                </div>
            </div>
        </div>
    );
}
 
export default PopUpCard;