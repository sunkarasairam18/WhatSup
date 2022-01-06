import React, { useState,useEffect } from 'react';
import { Switch,Route } from 'react-router-dom';
import PageVisibility from 'react-page-visibility';


import {updateLastSeen,updateOnlineStatus} from './services/firebase';
import { useStateValue } from "./services/StateProvider";
import FullPhoto from './components/AllFriends/FullPhoto';

import './App.css';
import Home from './components/main/Home';
import Login from './components/main/Login';
import Friends from './components/main/Friends';
import AllFriends from './components/main/AllFriends';
import FRequests from './components/main/FRequests';
import SentRequestDialog from './components/Home/SentRequestDialog';

function App(props) {
  const [{user},dispatch] = useStateValue();
  const [previewUrl,setPreviewUrl] = useState("");


  useEffect(()=>{
    if(user) updateOnlineStatus(user.uid,true);
  },[]);

  const handleVisibilityChange = isVisible => {
    // updateOnlineStatus(user.uid,isVisible);
    // if(!isVisible){
    //   updateLastSeen(user.uid);
    // }
  };

  return (
    <PageVisibility onChange={handleVisibilityChange}>
      <div className="app">    
        <Switch>
          <Route path="/:selectedId/display">
            <FullPhoto previewUrl={previewUrl}/>
          </Route>
          <Route path="/requests/list">
            <FRequests setPreviewUrl={setPreviewUrl}/>
          </Route>

          <Route path="/friends/list">
            <AllFriends setPreviewUrl={setPreviewUrl}/>
          </Route>
          
          <Route path="/friends">
            <Friends/>
          </Route>   

          
            
          <Route path="/">
            {/* <SentRequestDialog/> */}
            {!user?(<Login/>):(<Home/>)}          
            {/* <PopUpFriends/> */}
            {/* <Test/> */}
          </Route>
        </Switch>      
      </div>
    </PageVisibility>

  );
}

export default App;
