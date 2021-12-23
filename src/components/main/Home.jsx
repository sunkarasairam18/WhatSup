import React, { useState,useEffect } from 'react';
import {Route,Switch} from 'react-router-dom';
import Axios from 'axios';
import {doc,updateDoc} from 'firebase/firestore';

import { useStateValue } from '../../services/StateProvider';
import {firestore} from '../../services/firebase';

import '../../css/maincss/Home.css';

import Sidebar from '../Home/Sidebar';
import Upload from '../Home/Upload';
import JustLogin from '../Home/JustLogin';
import Chat from '../Home/Chat';
import FullPhoto from '../AllFriends/FullPhoto';


const  Home = () => {
  const [{user},dispatch] = useStateValue();
  const [showUpload,setShowUpload] = useState(false);
  const [showProfile,setShowProfile] = useState(false);
  const [profileUrl,setProfileUrl] = useState("");
  const [search,setSearch] = useState();
  const [searchIcon,setSearchIcon] = useState(false);
  const [selectId,setSelectId] = useState("");
  const [uploadFile,setUploadFile] = useState({file:"",url:""});
  var url = "";



  const uploadImage = async (result) =>{
    const formData = new FormData();
    formData.append("file",result);
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
  };

  return (
    <div className="home">   
        <Upload //Pop Up after selecting pic
        showUpload={showUpload} 
        setShowUpload={setShowUpload} 
        uploadFile={uploadFile} 
        setUploadFile={setUploadFile} 
        uploadImage={uploadImage} 
        /> 
        {showProfile && 
        <div className="fullPhoto">  
          <FullPhoto //Displays use full photo
          previewUrl={profileUrl} 
          crossClick={setShowProfile}/>
        </div>
        }
        <div className="home_body" style={disablebg()}>   
          <Sidebar 
            selectId = {selectId}
            setSelectId = {setSelectId}
            profileUrl={profileUrl}
            setProfileUrl={setProfileUrl}
            setShowProfile={setShowProfile}
            showUpload={showUpload} 
            setShowUpload={setShowUpload}                 
            setUploadFile={setUploadFile}    
            search={search}
            setSearch={setSearch}
            searchIcon={searchIcon}
            setSearchIcon={setSearchIcon}
          />  
          <Switch>                  
            <Route path="/:friendId/:containerId/:friendInfoDocId" >
              <Chat
                setSearch={setSearch}
                setSearchIcon={setSearchIcon}
                selectId={selectId}
                setSelectId={setSelectId}
              />                        
            </Route>                                 
            <Route path="/">
              <JustLogin/>
            </Route>                                                      
          </Switch>
        </div>
    </div>
  );
}

export default Home;
