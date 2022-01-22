import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreateIcon from "@mui/icons-material/Create";
import DoneIcon from '@mui/icons-material/Done';


import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Skeleton from "@mui/material/Skeleton";
import { firestore } from "../../services/firebase";
import { doc,updateDoc } from "firebase/firestore";
import "../../css/Home/Profile.css";
import PicChangePopDown from "./PicChangePopDown";
import { useStateValue } from '../../services/StateProvider';

const Profile = ({
  photo,
  name,
  about,
  setUploadFile,
  onBack,
  setShowUpload,
  setShowProfile,
  showSkeleton,
}) => {
  const [{user},dispatch] = useStateValue();
  const [changeShow, setChangeShow] = useState(false);
  const [writtenName,setWrittenName] = useState();
  const [writeName,setWriteName] = useState(false);
  const [writtenAbout,setWrittenAbout] = useState();
  const [writeAbout,setWriteAbout] = useState(false);
  const changePicRef = React.createRef();
  const myRef = React.createRef();
  const writeNameRef = React.useRef(null);
  const writeAboutRef = React.useRef(null);

  const ClickToWriteName = () =>{
    setWriteName(true);
    writeNameRef.current.focus();
  };

  const ClickToConfirmName = () =>{
    setWriteName(false);
    writeNameRef.current.blur();
    const db = doc(firestore,`Accounts/${user.uid}`);
    const Name = {
        displayName: writtenName,
    };
    updateDoc(db,Name);

  };

  const ClickToWriteAbout = () =>{
    setWriteAbout(true);
    writeAboutRef.current.focus();
  };

  const ClickToConfirmAbout = () =>{
    setWriteAbout(false);
    writeAboutRef.current.blur();
    const db = doc(firestore,`Accounts/${user.uid}`);
    const About = {
        About: writtenAbout,
    };
    updateDoc(db,About);

  };

  useEffect(()=>{
    setWrittenName(name);
    setWrittenAbout(about);
  },[name,about]);

  const fileChange = (e) => {
    if (e.target.files[0]) {
      setShowUpload(true);
      setUploadFile({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleDown = (e) => {
    if (changePicRef.current && !changePicRef.current.contains(e.target)) {
      setChangeShow(false);
      return;
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDown);
    
  }, [changePicRef]);

  const click = () => {
    myRef.current.value = null;
    myRef.current.click();
  };

  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage,setSnackMessage] = useState("");
  
  return (
    <div className="profile">
      <Snackbar
        open={openSnack}
        onClose={()=>setOpenSnack(false)}
        autoHideDuration={2500}
        message={snackMessage}
        key={snackMessage}
        disableWindowBlurListener={true}
        sx={{ width: "350px" }}        
      >
        <Alert onClose={()=>setOpenSnack(false)} variant="filled" severity="success" sx={{ width: '100%' }} >
          {snackMessage}
        </Alert>
      </Snackbar>
      <div className="profile_header">
        <div className="profile_header_content">
          <div className="profile_header_back_btn">
            <ArrowBackIcon onClick={() => onBack(false)} />
          </div>
          <div className="profile_header_title">Profile</div>
        </div>
      </div>
      <div className="profile_pic">
        <div
          className="profile_pic_box"
          ref={changePicRef}
          onClick={() => setChangeShow(!changeShow)}
          
        >
          {showSkeleton ? (
            <Skeleton
              variant="circular"
              width={200}
              height={200}
              animation="wave"
            />
          ) : (
            <Avatar src={photo} style={{ height: "200px", width: "200px" }} />
          )}

          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            ref={myRef}
            style={{ display: "none" }}
            onChange={fileChange}
          />
          
          <div className="picOptions">
            <PicChangePopDown
              show={changeShow}
              photo={photo}
              setShowProfile={setShowProfile}
              upload={click}
            />
          </div>
        </div>      
      </div>
      <div className="profile_box">
        <div className="profile_box_content">
          <div className="profile_box_title">Your Name</div>
          <div className="profile_user">
            {/* <div className="profile_user_name">{name}</div> */}
            <div className="pu_name_input_box">
              {!writeName && <div className="puni_cover"/>}
              <input 
              value={writtenName} 
              className="pu_name_input" 
              onChange={e=>setWrittenName(e.target.value)} 
              ref={writeNameRef}          
              />
              <hr className={!writeName?"puibHr":"puibHrfocus"}/>
            </div>
            {!writeName && <CreateIcon
              className="profile_user_name_edit"
              style={{ height: "23px", width: "23px" }}
              onClick={ClickToWriteName}
            />}
            {writeName && <DoneIcon
              className="profile_user_name_edit"
              style={{ height: "25px", width: "25px" }}
              onClick={()=>{
                ClickToConfirmName();
                setSnackMessage("Your name changed");
                setOpenSnack(true);
              }}
            />}
          </div>
        </div>
      </div>
      <div className="pnabout">
        <div className="pnacontent">
          This name will be visible to your WhatsUp friends. 
        </div>
      </div>
      <div className="profile_box">
        <div className="profile_box_content">
          <div className="profile_box_title">About</div>
          <div className="profile_user">            
            <div className="pu_name_input_box">
              {!writeAbout && <div className="puni_cover"/>}
              <input 
              value={writtenAbout} 
              className="pu_name_input" 
              onChange={e=>setWrittenAbout(e.target.value)} 
              ref={writeAboutRef}
              />
              <hr className={!writeAbout?"puibHr":"puibHrfocus"}/>
            </div>
            {!writeAbout && <CreateIcon
              className="profile_user_name_edit"
              style={{ height: "23px", width: "23px" }}
              onClick={ClickToWriteAbout}
            />}
            {writeAbout && <DoneIcon
              className="profile_user_name_edit"
              style={{ height: "25px", width: "25px" }}
              onClick={()=>{
                ClickToConfirmAbout();
                setSnackMessage("Your about changed");
                setOpenSnack(true);
              }}
            />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
