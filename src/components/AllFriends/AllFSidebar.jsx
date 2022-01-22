import React, { useState, useEffect } from "react";
import { IconButton } from "@material-ui/core";
import { Link, Switch, Route } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { onSnapshot, query, collection } from "firebase/firestore";

import "../../css/common/CommonSidebar.css";
import icon from "../icon.png";
import { useStateValue } from "../../services/StateProvider";
import AllFSidebarCard from "./AllFSidebarCard";
import { firestore } from "../../services/firebase";

const AllFSidebar = ({selectedId,setSelectedId}) => {
  const [friendsList, setFriendsList] = useState([]);
  const [search, setSearch] = useState("");
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const friendQuery = query(
      collection(firestore, `Accounts/${user.uid}/Friends`)
    );
    onSnapshot(friendQuery, (querySnapshot) => {
      setFriendsList(
        querySnapshot.docs.map((e) => ({
          name: e.data().friendName,
          id: e.data().friendId,
        }))
      );
    });
  }, []);

  function getList() {
    if (search !== "") {
      var list = friendsList.filter((friend) =>
        friend.name.trim().toLowerCase().includes(search.trim().toLowerCase())
      );
      return list;
    } else {
      return friendsList;
    }
  }


  return (
    <div className="CommonSidebar">
      <div className="CSContent">
        <div className="CS_header">
          <div className="img">
            <Link to="/">
              <img src={icon} alt="" className="app_icon" />
            </Link>
          </div>
          <div className="CS_headerRight">
            <Link to="/friends">
              <IconButton>
                <PeopleIcon style={{ height: "30px", width: "30px" }} />
              </IconButton>
            </Link>
            <IconButton>
              <MoreVertIcon style={{ height: "26px", width: "26px" }} />
            </IconButton>
          </div>
        </div>
        <div className="CS_content">
          <div className="CSC_search">
            <div className="CSCS_title">
              <div className="CSCST_back">
                <Link to="/friends">
                  <IconButton>
                    <ArrowBackIcon style={{ width: "25px", height: "25px" }} />
                  </IconButton>
                </Link>
              </div>
              <div className="CSCStitles">
                <div className="CSCSTsmall">Friends</div>
                <div className="CSCSTbig">All Friends</div>
              </div>
            </div>
            <div className="CSCSinput">
              <div className="CSCSIIcon">
                <SearchIcon />
              </div>
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Friends"
              />
            </div>
          </div>
          <div className="friendCount">
            {`${friendsList.length <= 0 ? "No" : friendsList.length} friends`}
          </div>
        </div>
        <div className="CSCfriends">
          {getList().map((friend) => (
            <AllFSidebarCard
              key={friend.id}
              id={friend.id}
              name={friend.name}
              to={`/friends/list/${friend.id}`}
              selected={friend.id === selectedId}
              setSelectedId={setSelectedId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFSidebar;
