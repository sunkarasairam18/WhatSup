import React,{useState,useEffect} from 'react';
import { doc,onSnapshot } from 'firebase/firestore';


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

    const populateRequests = (names) =>{

        // const l = names.length;
        // var start = 0;
        // var end = l>4?3:l;
        // var i = 0;
        // while(i < l){
        //     subNames.push([i,i+3<l?i+3:l-1]);
        //     i += 4;
        // }
       
        // return ( 
        //     subNames.map(sub =>(
        //         <div className="FRSCSDRow">
        //             {populateFour(names,sub[0],sub[1])}
        //         </div>
        //     ))
        // );
        return (
            requests.map(request =>(
                <Grid lg={3}  md={4} sm={6}>
                    <FRequestCard id={request} />
                </Grid>
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
                    {/* <div className="FRSCSDRow">
                        <FRequestCard name="Sai Ram"/>
                        <FRequestCard name="Sai Ram"/>
                        <FRequestCard name="Sai Ram"/>

                    </div> */}
                    
                    <Grid container >
                        {populateRequests(names)}
                    </Grid>
                                       

                </div>
            </div>
        </div>
    );
}
 
export default FRequestsCards;