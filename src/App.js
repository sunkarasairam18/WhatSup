import React, { useState,useEffect } from 'react';
import { Switch,Route } from 'react-router-dom';
import PageVisibility from 'react-page-visibility';

import { actionTypes } from './services/reducer';

import {updateLastSeen,updateOnlineStatus} from './services/firebase';
import { useStateValue } from "./services/StateProvider";
import FullPhoto from './components/AllFriends/FullPhoto';
import { firestore } from './services/firebase';
import { doc,onSnapshot } from 'firebase/firestore';

import './App.css';
import Home from './components/main/Home';
import Login from './components/main/Login';
import Friends from './components/main/Friends';
import AllFriends from './components/main/AllFriends';
import FRequests from './components/main/FRequests';
import SentRequests from './components/main/SentRequests';

function App(props) {
  const [{user},dispatch] = useStateValue();
  const [previewUrl,setPreviewUrl] = useState("");
  const [notificationsAvail,setNotificationsAvail] = useState();      

  useEffect(()=>{
    if(user){
      const userDoc = doc(firestore,`Accounts/${user.uid}`);
      onSnapshot(userDoc,userUpdate=>{
          if(userUpdate.exists()){
              const userData = userUpdate.data();   
              if("Notification" in window){
                  setNotificationsAvail(userData.Notifications);                       
              }
          }
      });
    }
  },[]);



  useEffect(()=>{
    if(user){
      dispatch({
        type: actionTypes.UPDATE_ONLINE,
        user: {
          ...user,
          onlineStatus: true
        },
      });
      updateOnlineStatus(user.uid,true);


    }
  },[]);

  const handleVisibilityChange = isVisible => {
    if(user){

      updateOnlineStatus(user.uid,isVisible);
      dispatch({
        type: actionTypes.UPDATE_ONLINE,
        user: {
          ...user,
          onlineStatus: isVisible
        },
      });
      if(!isVisible){
        updateLastSeen(user.uid);
      }
    }
  };

  return (
    <PageVisibility onChange={handleVisibilityChange}>
      <div className="app">    
        <Switch>
          <Route path="/:selectedId/display">
            <FullPhoto previewUrl={previewUrl}/>
          </Route>
          <Route path="/requests/list">
            <FRequests setPreviewUrl={setPreviewUrl} notificationsAvail={notificationsAvail}/>
          </Route>
          <Route path="/sentrequests/list">
            <SentRequests setPreviewUrl={setPreviewUrl} notificationsAvail={notificationsAvail}/>
          </Route>

          <Route path="/friends/list">
            <AllFriends setPreviewUrl={setPreviewUrl} notificationsAvail={notificationsAvail}/>
          </Route>
          
          <Route path="/friends">
            <Friends notificationsAvail={notificationsAvail}/>
          </Route>   

          
            
          <Route path="/">
            {!user?(<Login/>):(<Home setPreviewUrl={setPreviewUrl} notificationsAvail={notificationsAvail} />)}          
          </Route>
        </Switch>      
      </div>
    </PageVisibility>

  );
}

export default App;
