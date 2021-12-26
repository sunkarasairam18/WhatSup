import React,{useState,useEffect} from 'react';
import { doc,onSnapshot,updateDoc } from 'firebase/firestore';


import "../../css/Friends/FRequestsCards.css"
import Grid from '@mui/material/Grid';
import NoPreview from '../common/NoPreview';

import FRequestCard from './FRequestCard';
import { useStateValue } from '../../services/StateProvider';

import { firestore } from '../../services/firebase';


const FRequestsCards = () => {
    const [{user},dispatch] = useStateValue();
    const [requests,setRequests] = useState([]);

    useEffect(()=>{
        const userDoc = doc(firestore,`Accounts/${user.uid}`);
        onSnapshot(userDoc,userUpdate=>{
            setRequests(userUpdate.data().Requests);
        });
    },[]);

    

    const delRequest = (id) =>{
        const userDoc = doc(firestore,`Accounts/${user.uid}`);
        var list = requests.filter(request => request != id);
        const newRequests = {
            Requests : list,
        }
        updateDoc(userDoc,newRequests).then(e=>{
            console.log(e);
        }).catch(error=>{
            console.log("Error : ",error);
        });;
        
    }

    const populateRequests = () =>{      
        return (
            requests.map(request =>(
                // <Grid lg={3}  md={4} sm={6} key={request}>
                //     <FRequestCard id={request} delRequest={delRequest}/>
                // </Grid>
                <FRequestCard id={request} key={request} delRequest={delRequest}/>
            ))
        );
    } 

    return (
        <div className="FRCShow">
            {(requests.length > 0) &&
            <div className="FRCSContent">
                <div className="FRCSCTitle">
                    Friend requests
                </div>
                <div className="FRCSDisplay">                   
                    <Grid container >
                        {populateRequests()}
                    </Grid>                                       
                </div>
            </div>}
            {(requests.length === 0) && <NoPreview text={"When you have friend requests, you'll see them here."} flex={1}/>}
        </div>
    );
}
 
export default FRequestsCards;