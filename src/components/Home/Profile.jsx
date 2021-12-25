import React, { useState, useEffect } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreateIcon from "@mui/icons-material/Create";

import Skeleton from "@mui/material/Skeleton";

import "../../css/Home/Profile.css";
import PicChangePopDown from "./PicChangePopDown";

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
  const [changeShow, setChangeShow] = useState(false);
  const changePicRef = React.createRef();
  const myRef = React.createRef();

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
    document.addEventListener("click", handleDown);
  }, [changePicRef]);

  const click = () => {
    myRef.current.value = null;
    myRef.current.click();
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div className="profile">
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

        {/* <button onClick={uploadImage}>upload</button> */}
        {/* <div onClick={click}>CLick</div> */}
      </div>
      <div className="profile_name">
        <div className="profile_name_content">
          <div className="profile_name_title">Your Name</div>
          <div className="profile_user">
            <div className="profile_user_name">{name}</div>
            <CreateIcon
              className="profile_user_name_edit"
              style={{ height: "23px", width: "23px" }}
            />
          </div>
        </div>
      </div>
      <div className="about_name">
        <div className="about_name_content">
          <div className="about_name_title">About</div>
          <div className="about_user">
            <div className="about_user_text">{about}</div>
            <CreateIcon
              className="about_user_text_edit"
              style={{ height: "23px", width: "23px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
