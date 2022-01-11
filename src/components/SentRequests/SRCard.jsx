import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../../services/firebase';
import { onSnapshot,doc,updateDoc } from 'firebase/firestore';
import { Avatar } from '@material-ui/core';
import { useStateValue } from '../../services/StateProvider';
import '../../css/SentRequests/SRCard.css';

const SRCard = ({id,name,to,selected,setSelectedId}) => {
    const [{user},dispatch] = useStateValue();
    const [requester,setRequester] = useState({name:"",photoUrl:""});    

    useEffect(()=>{
        if(id){
            const friendDoc = doc(firestore,`Accounts/${id}`);
            onSnapshot(friendDoc,friendUpdate =>{
                if(friendUpdate.exists()){
                    const {displayName,photoUrl} = friendUpdate.data();
                    setRequester({name: displayName,photoUrl: photoUrl});
                }
            });
        }
    },[id]);

    // useEffect(()=>{
    //     if(requester.name){
    //         const {name:rname} = requester;
    //         console.log("name ",name,",Display : ",rname);
    //         if(rname!==name){
    //             updateFriendName(rname,id);

    //         }
    //     }
    // },[requester]);

    async function updateFriendName(newname,friendId){
        const db = doc(firestore,`Accounts/${user.uid}/Sent Requests/${friendId}}`);
        const displayName = {
            displayName: newname,
        };
        console.log("Updating ",displayName);
        await updateDoc(db,displayName);
    }; 
    

    return (
        <Link to={to}>
            <div className="SRCard">
                <div className={`SRCcontent ${selected?"SRCselect":""}`} onClick={()=>setSelectedId(id)}>
                    <Avatar src={requester.photoUrl} style={{width:"50px",height:"50px"}}/>
                    <div className="SRCCname">
                        {name.length>25?name.substring(0,22)+"...":name}
                    </div>
                    <div className="SRCCcancel" >
                        Cancel Request
                    </div>
                </div>
            </div>                        
        </Link>
    );
}
 
export default SRCard;