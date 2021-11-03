import React,{useState,useEffect} from 'react';
import { doc,onSnapshot } from 'firebase/firestore';


import "../../css/Friends/FRequestCard.css";
import ben from "../s3.jpeg";
import { firestore } from '../../services/firebase';
import { CSSTransition } from 'react-transition-group';
import Grid from '@mui/material/Grid';



const FRequestCard = ({id,delRequest}) => {
    const [sender,setSender] = useState({name:"",photoUrl:""});
    const [appear,setAppear] = useState(true);

    useEffect(()=>{
        const senderDoc = doc(firestore,`Accounts/${id}`) ;
        onSnapshot(senderDoc,senderUpdate=>{
            if(senderUpdate.exists()){
                const {displayName,photoUrl} = senderUpdate.data();
                setSender({name:displayName,photoUrl:photoUrl});
            }            
        });
    },[]);

    useEffect(()=>{
        if(!appear){
            setTimeout(()=>{delRequest(id)},1000);            
        }
    },[appear])


    return ( 
        <CSSTransition in={appear} timeout={2000} classNames="CardApperance">
            <Grid lg={3}  md={4} sm={6}>
                <div className="FRCard">
                    <div className="FRCImg">
                        <img src={ben}/>
                    </div>
                    <div className="FRCContent">
                        <div className="FRCTitle">
                            {sender.name}
                        </div>
                       {appear && <div className="FRCConfirm">
                            Confirm
                        </div>}
                        <div className={`${appear?"FRCDelete":"FRCRequestDel"}`} onClick={()=>setAppear(false)}>
                            {appear?"Delete":"Request deleted"}
                        </div>
                    </div>
                </div>
            </Grid>
        </CSSTransition>
     );
}
 
export default FRequestCard;