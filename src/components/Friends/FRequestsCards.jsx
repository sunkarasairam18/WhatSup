import React,{useState,useEffect} from 'react';
import { doc,onSnapshot,updateDoc } from 'firebase/firestore';


import "../../css/Friends/FRequestsCards.css"
import Grid from '@mui/material/Grid';

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

    const names = ["Ben stokes","Warner","Butter Tomato","Virat","Ab Devilliers"];
    const col = 4;

    const populateFour = (names,start,end) =>{
        return names.slice(start,end+1).map(name => (
            <FRequestCard name={name}/>
        ));
    }

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

    const populateRequests = (names) =>{
      
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
            <div className="FRCSContent">
                <div className="FRCSCTitle">
                    Friend requests
                </div>
                <div className="FRCSDisplay">
                   
                    <Grid container >
                        {populateRequests(names)}
                    </Grid>
                                       

                </div>
            </div>
        </div>
    );
}
 
export default FRequestsCards;