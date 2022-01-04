import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Backdrop from "@mui/material/Backdrop";
import { firestore } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import PopUpFriends from "./PopUpFriends";

import "../../css/AllFriends/Preview.css";

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
      <Backdrop open={showDialog}>
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
        <Link to={`/${previewId}/display`}>
          <img
            src={friend.photoUrl}
            className="Ppic"
            onClick={() => setPreviewUrl(friend.photoUrl)}
          />
        </Link>
      </div>
      <div className="Pinfo">
        <div className="Pname">{friend.name}</div>
        <div
          className="Pfriendscount"
          onMouseEnter={() => setShowLine(true)}
          onMouseLeave={() => setShowLine(false)}
          onClick={() => setShowDialog(true)}
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
