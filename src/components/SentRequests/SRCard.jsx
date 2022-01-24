import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../../services/firebase';
import { onSnapshot,doc,updateDoc } from 'firebase/firestore';
import { Avatar } from '@material-ui/core';
import { useStateValue } from '../../services/StateProvider';
import '../../css/SentRequests/SRCard.css';
import { cancelRequest } from '../../services/firebase';

const SRCard = ({id,name,to,selected,setSelectedId}) => {
    const [{user},dispatch] = useStateValue();
    const [requester,setRequester] = useState({name:"",photoUrl:""}); 
    const [rClass,setRclass] = useState();   
    const [rDel,setRdel] = useState(false);

    useEffect(()=>{
        setRclass("");
    },[selected]);

    useEffect(()=>{
        if(rDel){
            setTimeout(()=>cancelRequest(user.uid,id),3000);
        }
    },[rDel]);

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
        <Link to={to} className='alink'>
            <div className="SRCard">
                <div className={`SRCcontent ${selected?"SRCselect":rClass}`} 
                    onMouseEnter={()=>{
                        if(!selected){
                            setRclass("SRCselect");
                        }
                    }}
                    onMouseLeave={()=>{
                        if(!selected){
                            setRclass("");
                        }
                    }}
                    onClick={()=>setSelectedId(id)}>
                    <Avatar src={requester.photoUrl} style={{width:"50px",height:"50px"}}/>
                    <div className="SRCC_in">
                        <div className="SRCCname">
                            {name.length>25?name.substring(0,22)+"...":name}
                        </div>
                        {rDel && 
                        <div className="r_del">
                            Request cancelled
                        </div>
                        }
                    </div>
                    {!rDel &&
                    <Link to={'/sentrequests/list'} className="SRCCcancel alink" onClick={()=>setRdel(true)}>
                    <div 
                        onMouseEnter={()=>{
                            if(!selected){
                                setRclass("");
                            }
                        }}                        
                        onMouseLeave={()=>{
                            if(!selected){
                                setRclass("SRCselect");
                            }
                        }}
                    >
                        Cancel Request
                    </div>
                    </Link>}
                    
                </div>
            </div>                        
        </Link>
    );
}
 
export default SRCard;