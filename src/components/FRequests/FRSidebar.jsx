import React, { useState, useEffect } from "react";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { onSnapshot, query, collection } from "firebase/firestore";

import FRSidebarCard from "./FRSidebarCard";
import "../../css/common/CommonSidebar.css";
import icon from "../icon.png";
import { useStateValue } from "../../services/StateProvider";
import { firestore } from "../../services/firebase";

const FRSidebar = ({selectedId,setSelectedId}) => {
  const [requestsList, setRequestsList] = useState([]);
  const [search, setSearch] = useState("");
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const requestsQuery = query(
      collection(firestore, `Accounts/${user.uid}/Requests`)
    );
    onSnapshot(requestsQuery, (querySnapshot) => {
      setRequestsList(
        querySnapshot.docs.map((e) => ({
          ...e.data()
        }))
      );
    });
  }, []);

  function getList() {
    if (search !== "") {
        console.log("Requests : ",requestsList);
      var list = requestsList.filter((request) =>
        request.displayName.trim().toLowerCase().includes(search.trim().toLowerCase())
      );
      return list;
    } else {
      return requestsList;
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
                <div className="CSCSTbig">Friend requests</div>
              </div>
            </div>
            <div className="CSCSinput">
              <div className="CSCSIIcon">
                <SearchIcon />
              </div>
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Requests"
              />
            </div>
          </div>
          <div className="friendCount">
            {requestsList.length <= 0 ? "No new requests" : (requestsList.length == 1?"1 request":`${requestsList.length} requests`)}
          </div>
        </div>
        <div className="CSCfriends">
          {getList().map((request) => (
            <FRSidebarCard
              key={request.SentBy}
              id={request.SentBy}
              name={request.displayName}
              to={`/requests/list/${request.SentBy}`}
              selected={request.SentBy === selectedId}
              setSelectedId={setSelectedId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FRSidebar;
