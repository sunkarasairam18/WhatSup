import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import Snackbar from '@mui/material/Snackbar';

import Backdrop from "@mui/material/Backdrop";
import Alert from '@mui/material/Alert';

import { useStateValue } from "../../services/StateProvider";
import { firestore } from "../../services/firebase";

import "../../css/maincss/Home.css";
import SentRequestDialog from "../Home/SentRequestDialog";
import Sidebar from "../Home/Sidebar";
import Upload from "../Home/Upload";
import JustLogin from "../Home/JustLogin";
import Chat from "../Home/Chat";
import FullPhoto from "../AllFriends/FullPhoto";
import CloseIcon from '@mui/icons-material/Close';

const Home = () => {
  const [{ user }, dispatch] = useStateValue();
  const [showUpload, setShowUpload] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [search, setSearch] = useState();
  const [searchIcon, setSearchIcon] = useState(false);
  const [selectId, setSelectId] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const [uploadFile, setUploadFile] = useState({ file: "", url: "" });
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showNewRequestDialog,setShowNewRequestDialog] = useState(false);
  const [openSnack,setOpenSnack] = useState(false);
  const [snackMessage,setSnackMessage] = useState();
  const [severity,setSeverity] = useState();
  var url = "";

  useEffect(() => {
    console.log("chat typing", chatTyping);
  }, [chatTyping]);
  const uploadImage = async (result) => {
    setShowSkeleton(true);
    const formData = new FormData();
    formData.append("file", result);
    formData.append("upload_preset", "kjxylxjb");
    console.log("Form data", formData);
    Axios.post(
      "https://api.cloudinary.com/v1_1/ddpxfhqv6/image/upload",
      formData
    )
      .then((response) => {
        console.log("Response : ", response);
        photoUrlDatabase(response.data.secure_url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const photoUrlDatabase = async (url) => {
    if (user) {
      console.log("Photo User", user);
      const db = doc(firestore, `Accounts/${user.uid}`);
      const photoUpdate = {
        photoUrl: url,
      };
      updateDoc(db, photoUpdate);
      setShowSkeleton(false);
    }
  };

  return (
    <div className="home">
      <Backdrop
        sx={{ color: "#FFFFFF", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showUpload}
      >
        <Upload //Pop Up after selecting pic
          showUpload={showUpload}
          setShowUpload={setShowUpload}
          uploadFile={uploadFile}
          setUploadFile={setUploadFile}
          uploadImage={uploadImage}
        />
      </Backdrop>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showNewRequestDialog}
      >
       <SentRequestDialog 
        showNewRequestDialog={showNewRequestDialog} 
        setShowNewRequestDialog={setShowNewRequestDialog}
        setOpenSnack={setOpenSnack}
        setSnackMessage={setSnackMessage}
        setSeverity={setSeverity}
        />
      </Backdrop>
      {showProfile && (
        <div className="fullPhoto">
          <FullPhoto //Displays user full photo
            previewUrl={profileUrl}
            crossClick={setShowProfile}
          />
        </div>
      )}
      <Snackbar
        open={openSnack}
        autoHideDuration={2500}
        onClose={()=>setOpenSnack(false)}
        key={snackMessage}
        disableWindowBlurListener={true}        
        sx={{ width: "350px" }}
      >
        
        <Alert onClose={()=>setOpenSnack(false)} variant="filled" color="success" severity={severity} sx={{ width: '100%' }} >
          {snackMessage}
        </Alert>
        
      </Snackbar>
      <div className="home_body">
        <Sidebar
          selectId={selectId}
          setSelectId={setSelectId}
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
          showSkeleton={showSkeleton}
          setChatTyping={setChatTyping}
          setShowNewRequestDialog={setShowNewRequestDialog}
        />

        <Switch>
          <Route path="/:friendId/:containerId/:friendInfoDocId">
            <Chat
              setSearch={setSearch}
              setSearchIcon={setSearchIcon}
              selectId={selectId}
              setSelectId={setSelectId}
              chatTyping={chatTyping}
              setChatTyping={setChatTyping}
            />
          </Route>
          <Route path="/">
            <JustLogin />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Home;
