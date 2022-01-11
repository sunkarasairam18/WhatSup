import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Backdrop from "@mui/material/Backdrop";
import { firestore } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import PopUpFriends from "../AllFriends/PopUpFriends";
import { Avatar } from '@material-ui/core';

import "../../css/common/Preview.css";

const Preview = ({ selectedId, setSelectedId, setPreviewUrl }) => {
  const [friend, setFriend] = useState({
    name: "",
    about: "",
    photoUrl: "",
    email: "",
    friendsCount: 0,
  });
  const { previewId } = useParams();
  const [showLine, setShowLine] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!selectedId) {
      console.log("Hope fully");
      setSelectedId(previewId);
    }
  }, [previewId]);

  useEffect(() => {
    const friendDoc = doc(firestore, `Accounts/${previewId}`);
    onSnapshot(friendDoc, (friendUpdate) => {
      if (friendUpdate.exists()) {
        const { displayName, About, photoUrl, email, friendsCount } =
          friendUpdate.data();
        setFriend({
          name: displayName,
          about: About,
          photoUrl: photoUrl,
          email: email,
          friendsCount: friendsCount,
        });
      }
    });
  });

  return (
    <div className="Preview">
      <Backdrop 
        sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showDialog}>
        <PopUpFriends
          id={previewId}
          friendsCount={friend.friendsCount}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      </Backdrop>
      <div className="Pcontent">
        {/* <div className="PSubcontent">
                    
            </div> */}
        {friend.photoUrl && <Link to={`/${previewId}/display`}>
            
          <img
            src={friend.photoUrl}
            className="Ppic"
            onClick={() => setPreviewUrl(friend.photoUrl)}
          />
        </Link>}
        {!friend.photoUrl && 
        <div className="Ppic_no_cursor">
          <Avatar style={{height:"250px",width:"250px"}}/>
        </div>}

      </div>
      <div className="Pinfo">
        <div className="Pname">{friend.name}</div>
        <div
          className={friend.friendsCount?"Pfriendscount":"Pfriendscount_no_cursor"}
          onMouseEnter={() => {
            if(friend.friendsCount != 0){
              setShowLine(true);
            }
          }}
          onMouseLeave={() =>{
            if(friend.friendsCount != 0){
              setShowLine(false);
            }
          }}
          onClick={() => {
            if(friend.friendsCount != 0){
              setShowDialog(true);
            }
          }}
        >
          {friend.friendsCount > 1 && `${friend.friendsCount} friends`}
          {!friend.friendsCount && `No friends`}
          {friend.friendsCount === 1 && `${friend.friendsCount} friend`}
          {showLine && <hr className="Pfchr" />}
        </div>
        <div className="Pemail">{friend.email}</div>
        <div className="Pbio">{friend.about}</div>
      </div>
    </div>
  );
};

export default Preview;
