import React, { useState,useEffect } from 'react';
import {Route,Switch} from 'react-router-dom';
import './App.css';
import Axios from 'axios';
import {doc,updateDoc} from 'firebase/firestore';
import PageVisibility from 'react-page-visibility';

import { useStateValue } from './services/StateProvider';
import {updateLastSeenOnlineStatus,updateOnlineStatus} from './services/firebase';
import {firestore} from './services/firebase';


import Sidebar from './components/Sidebar';
import Upload from './components/Upload';
import JustLogin from './components/JustLogin';
import Chat from './components/Chat';
import Login from './components/Login';

function App(props) {
  const [{user},dispatch] = useStateValue();
  const [isWindowInFocus,setIsWindowInFocus] = useState(true);
  const [showUpload,setShowUpload] = useState(false);
  const [imageUrl,setImageUrl] = useState();
  const [uploadFile,setUploadFile] = useState({file:"",url:""});
  var url = "";

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

  useEffect(()=>{
    if(uploadFile.file){
      console.log("Upload File",uploadFile);
      setShowUpload(true);
    }
  },[uploadFile])

  const uploadImage = async () =>{
    const formData = new FormData();
    formData.append("file",uploadFile.file);
    formData.append("upload_preset","kjxylxjb");
    console.log("Form data",formData);
    Axios.post("https://api.cloudinary.com/v1_1/ddpxfhqv6/image/upload",formData).then((response)=>{
        console.log("Response : ",response);
        photoUrlDatabase(response.data.secure_url);        
    }).catch((error)=>{
        console.log(error);
    });

  };

  const photoUrlDatabase = async (url) =>{
    if(user){
      console.log("Photo User",user);
      const db = doc(firestore,`Accounts/${user.uid}`);
      const photoUpdate = {
        photoUrl: url,
      };
      updateDoc(db,photoUpdate);
    }
    
  };

  const disablebg = () =>{
    var sty = {};
    if(!showUpload) return;
    sty["filter"]="blur(1px)";
    return sty;

  }

  return (

    <div className="app">   
        <Upload showUpload={showUpload} setShowUpload={setShowUpload} imageUrl={uploadFile.url} uploadImage={uploadImage} /> 
        {!user?(
          <Login/>
        ):(
          <PageVisibility onChange={()=>setIsWindowInFocus(!isWindowInFocus)}>
            <div className="app_body" style={disablebg()}>   
              <Sidebar 
              showUpload={showUpload} 
              setShowUpload={setShowUpload} 
              setUploadFile={setUploadFile}
              />
              <Switch>            
                <Route path="/:friendId/:containerId/:friendInfoDocId" component={Chat}/>                        
                <Route path="/">
                  <JustLogin/>
                </Route>
              </Switch>
            </div>
          </PageVisibility>
        )}
    </div>
  );
}

export default App;
