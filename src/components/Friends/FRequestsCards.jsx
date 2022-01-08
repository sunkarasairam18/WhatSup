import React,{useState,useEffect} from 'react';
import { onSnapshot,query,collection } from 'firebase/firestore';


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
        const requestsQuery = query(
            collection(firestore, `Accounts/${user.uid}/Requests`)
          );
          onSnapshot(requestsQuery, (requestSnapshot) => {
            setRequests(
              requestSnapshot.docs.map((request) => ({
                id: request.id,
                data: request.data(),
              }))
            );
          });
          console.log("R-:",requests);
    },[]);    
   

    const populateRequests = () =>{      
        return (
            requests.map(request =>(
                // <Grid lg={3}  md={4} sm={6} key={request}>
                //     <FRequestCard id={request} delRequest={delRequest}/>
                // </Grid>
                <FRequestCard id={request.data.SentBy} key={request.data.SentBy}/>
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