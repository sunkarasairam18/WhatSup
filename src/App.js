import React, { useState,useEffect } from 'react';
import { Switch,Route } from 'react-router-dom';
import PageVisibility from 'react-page-visibility';


import {updateLastSeenOnlineStatus,updateOnlineStatus} from './services/firebase';
import { useStateValue } from "./services/StateProvider";
import FullPhoto from './components/AllFriends/FullPhoto';

import './App.css';
import Home from './components/main/Home';
import Login from './components/main/Login';
import Friends from './components/main/Friends';
import AllFriends from './components/main/AllFriends';
import Test from './components/Test';

function App(props) {
  const [{user},dispatch] = useStateValue();
  const [isWindowInFocus,setIsWindowInFocus] = useState(true);
  const [previewUrl,setPreviewUrl] = useState("");
  const [profileUrl,setProfileUrl] = useState("");


  useEffect(()=>{
    if (isWindowInFocus) {
      if(user) updateLastSeenOnlineStatus(user.uid,false);
      console.log("user : ",user);
      //Screen OFF 
    }else{
      if(user) updateOnlineStatus(user.uid,true);
      //Screen On
    }
  },[isWindowInFocus]);


  return (
    <div className="app">    
      <Switch>
        <Route path="/friends/list/:selectedId/display">
          <FullPhoto previewUrl={previewUrl}/>
        </Route>
        <Route path="/friends/list">
          <AllFriends setPreviewUrl={setPreviewUrl}/>
        </Route>
        
        <Route path="/friends">
          <Friends/>
        </Route>   
           
        <Route path="/">
          {!user?(<Login/>):(
          <Home
            profileUrl={profileUrl}
            setProfileUrl={setProfileUrl}
          />)}     
          {/* <Test/> */}
        </Route>
      </Switch>
      
    </div>
  );
}

export default App;
