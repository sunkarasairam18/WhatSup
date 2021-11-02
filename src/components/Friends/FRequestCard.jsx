import React,{useState,useEffect} from 'react';
import { doc,onSnapshot } from 'firebase/firestore';


import "../../css/Friends/FRequestCard.css";
import ben from "../s3.jpeg";
import { firestore } from '../../services/firebase';

const FRequestCard = ({id}) => {
    const [sender,setSender] = useState({name:"",photoUrl:""});

    useEffect(()=>{
        const senderDoc = doc(firestore,`Accounts/${id}`) ;
        onSnapshot(senderDoc,senderUpdate=>{
            if(senderUpdate.exists()){
                const {displayName,photoUrl} = senderUpdate.data();
                setSender({name:displayName,photoUrl:photoUrl});
            }            
        });
    },[]);


    return ( 
        <div className="FRCard">
            <div className="FRCImg">
                <img src={ben}/>
            </div>
            <div className="FRCContent">
                <div className="FRCTitle">
                    {sender.name}
                </div>
                <div className="FRCConfirm">
                    Confirm
                </div>
                <div className="FRCDelete">
                    Delete
                </div>
            </div>
        </div>
     );
}
 
export default FRequestCard;