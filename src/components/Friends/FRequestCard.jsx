import React,{useState,useEffect} from 'react';
import { doc,onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

import "../../css/Friends/FRequestCard.css";
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

    const url = "https://scontent.fvga4-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-5&_nc_sid=7206a8&_nc_ohc=2skap-CRIy4AX-O19Y1&_nc_ht=scontent.fvga4-1.fna&oh=00_AT8idiBEEBZyWG1aoOkE6Z0EGCci7ADnoSLQzAKOOxoKCQ&oe=61FCCDF8";

    return ( 
        <CSSTransition in={appear} timeout={2000} classNames="CardApperance">
            <Grid lg={3}  md={4} sm={6}>
                <div className="FRCard">
                    <Link to={`requests/list/${id}`}>
                        <div className="FRCImg">
                            <img src={sender.photoUrl?sender.photoUrl:url} style={{height:"210px",width:"210px"}}/>
                            
                        </div>                                    
                    </Link>
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