import React, { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import PeopleIcon from "@mui/icons-material/People";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useStateValue } from "../../services/StateProvider";
import { onSnapshot, query, collection } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import icon from "../icon.png";
import More from "../common/More";
import SRCard from "./SRCard";
import '../../css/common/CommonSidebar.css';

const SRSidebar = ({selectedId,setSelectedId,notificationsAvail}) => {
    const [requestsList, setRequestsList] = useState([]);
    const [search, setSearch] = useState("");
    const [{ user }, dispatch] = useStateValue();

    const [showMore,setShowMore] = useState(false);

    const moreRef = useRef(null);    
      
    const handleDown = (e) => {
        if (moreRef.current && !moreRef.current.contains(e.target)) {
            setShowMore(false);
            return;
        }
    };
  
  useEffect(() => {
      document.addEventListener("click", handleDown);
  }, [moreRef]);

    useEffect(() => {
        const friendQuery = query(
            collection(firestore, `Accounts/${user.uid}/Sent Requests`)
        );
        onSnapshot(friendQuery, (querySnapshot) => {
            setRequestsList(
            querySnapshot.docs.map((e) => ({
                name: e.data().displayName,
                id: e.data().SentTo,
            }))
            );
        });
    }, []);
    
    function getList() {
    if (search !== "") {
        var list = requestsList.filter((friend) =>
        friend.name.trim().toLowerCase().includes(search.trim().toLowerCase())
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
                <IconButton onClick={()=>setShowMore(!showMore)} ref={moreRef}>
                  <MoreVertIcon style={{ height: "26px", width: "26px" }} />
                </IconButton>
              </div>
              <More 
                show={showMore}
                notificationsAvail={notificationsAvail}
                showNoti={false}
              />
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
                    <div className="CSCSTbig">Sent requests</div>
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
                {`${requestsList.length <= 0 ? "No" : requestsList.length} sent requests`}
              </div>
            </div>
            <div className="CSCfriends">
              {getList().map((friend) => (
                <SRCard
                  key={friend.id}
                  id={friend.id}
                  name={friend.name}
                  to={`/sentrequests/list/${friend.id}`}
                  selected={friend.id === selectedId}
                  setSelectedId={setSelectedId}
                />
              ))}
            </div>
          </div>
        </div>
      );
}
 
export default SRSidebar;