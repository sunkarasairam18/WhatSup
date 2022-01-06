import React,{useState,useEffect} from 'react';
import { Link,useHistory } from 'react-router-dom';
import { firestore } from '../../services/firebase';
import { onSnapshot,doc } from 'firebase/firestore';
import { Avatar } from '@material-ui/core';
import { deleteDoc } from 'firebase/firestore';
import { useStateValue } from '../../services/StateProvider';

const FRSidebarCard = ({id,to,selected,setSelectedId}) => {
    const [{user},dispatch] = useStateValue();
    const [requester,setRequester] = useState({name:"",photoUrl:""});
    const [cardClass,setCardClass] = useState("FRSCcontent");
    const history = useHistory();
    useEffect(()=>{
        if(selected) setCardClass("FRSCcontent FRSCselect");
        else setCardClass("FRSCcontent");
        console.log(requester);
    },[selected]);

    useEffect(()=>{
        if(id){
            const requesterDoc = doc(firestore,`Accounts/${id}`);
            onSnapshot(requesterDoc,requesterUpdate =>{
                if(requesterUpdate.exists()){
                    const {displayName,photoUrl} = requesterUpdate.data();
                    setRequester({name: displayName,photoUrl: photoUrl});
                }
            });
        }
    },[id]);

    const delRequest = async (id) =>{
        // const obj = requests.find(o => o.data.SentBy === id);
        const requesterDoc = doc(firestore,`Accounts/${user.uid}/Requests/${id}`);
        await deleteDoc(requesterDoc);    
        const userDoc = doc(firestore,`Accounts/${id}/Sent Requests/${user.uid}`);
        await deleteDoc(userDoc);        
    };

    return (
        <Link to={to}>
            <div className="FRSCard">
                <div className={cardClass} 
                    onClick={()=>setSelectedId(id)} 
                    onMouseEnter={()=>{
                        if(!selected){
                            setCardClass("FRSCcontent FRSCselect");
                        }
                    }}
                    onMouseLeave={()=>{
                        if(!selected){
                            setCardClass("FRSCcontent");
                        }
                    }}
                    >
                    {/* <img src={requester.photoUrl} style={{height:"50px",width:"50px",borderRadius:"25px"}} /> */}
                    <Avatar src={requester.photoUrl} style={{width:"50px",height:"50px"}}/>
                    <div className="FRSC_operations">                    
                        <div className="FRSCCPname">
                            {requester.name}
                        </div>
                        <div className="FRSCC_buttons">
                            <div className="FRSCCB_confirm"
                                onMouseOver={()=>{
                                    if(!selected){
                                        setCardClass("FRSCcontent");
                                    }
                                }}
                                onMouseLeave={()=>{
                                    if(!selected){
                                        setCardClass("FRSCcontent FRSCselect");
                                    }
                                }}
                                >
                                Confirm
                            </div>
                            <Link to={'/requests/list'} className="FRSCCB_delete">
                            <div 
                                onMouseOver={()=>{
                                    if(!selected){
                                        setCardClass("FRSCcontent");
                                    }
                                }}
                                onMouseLeave={()=>{
                                    if(!selected){
                                        setCardClass("FRSCcontent FRSCselect");
                                    }
                                }}
                                onClick={()=>delRequest(id)}                                                                    
                                >
                                Delete
                            </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            
        </Link>
    );
}
 
export default FRSidebarCard;