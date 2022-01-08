import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../../services/firebase';
import { onSnapshot,doc,addDoc,setDoc,collection } from 'firebase/firestore';
import { Avatar } from '@material-ui/core';
import { useStateValue } from '../../services/StateProvider';

import { delRequest,confirmRequest } from '../../services/firebase';

const FRSidebarCard = ({id,to,selected,setSelectedId}) => {
    const [{user},dispatch] = useStateValue();
    const [requester,setRequester] = useState({name:"",photoUrl:""});
    const [cardClass,setCardClass] = useState("FRSCcontent");
    const [appearDelete,setAppearDelete] = useState(false);
    const [appearConfirm,setAppearConfirm] = useState(false);

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

    useEffect(()=>{
        if(appearDelete){
            setTimeout(()=>{delRequest(user.uid,id)},4000);
        }
    },[appearDelete]);


    useEffect(()=>{
        if(appearConfirm){
            setTimeout(()=>{confirmRequest(user.uid,id)},4000);
        }
    },[appearConfirm]);

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
                            {requester.name.length>29?requester.name.substring(0,30)+"...":requester.name}
                        </div>
                        <div className="FRSCC_buttons">
                            {!appearDelete && !appearConfirm && 
                            <Link to={'/requests/list'}  className="FRSCCB_confirm">                            
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
                                    onClick={()=>{                                        
                                        setAppearConfirm(true)
                                    }}
                                    >
                                    Confirm
                                </div>
                            </Link>
                            }
                            
                            {!appearDelete && !appearConfirm && 
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
                                    onClick={()=>setAppearDelete(true)}                                                                                                 
                                    >
                                    Delete
                                </div>
                            </Link>}
                        </div>
                        {appearDelete && 
                        <div className="r_del_acc">
                            Request deleted
                        </div>}
                        {appearConfirm &&
                            <div className="r_del_acc">
                                Accepted Request
                            </div>
                        }
                    </div>
                </div>
            </div>
            
            
        </Link>
    );
}
 
export default FRSidebarCard;