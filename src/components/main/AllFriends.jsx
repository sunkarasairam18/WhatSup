import React, { useState,useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import { query,collection,onSnapshot } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import { useStateValue } from "../../services/StateProvider";
import "../../css/common/Container.css";
import AllFSidebar from "../AllFriends/AllFSidebar";
import NoPreview from "../common/NoPreview";
import Preview from "../AllFriends/Preview";


const AllFriends = ({ setPreviewUrl }) => {
  const [selectedId, setSelectedId] = useState();
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
    <div className="container">
      <div className="container_app">
        <AllFSidebar 
          selectedId={selectedId} 
          setSelectedId={setSelectedId} 
          friendsList={friendsList}
          setFriendsList={setFriendsList}
          search={search}
          setSearch={setSearch}
          getList={getList}
          />
        <Switch>
          <Route path="/friends/list/:previewId">
            <Preview
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              setPreviewUrl={setPreviewUrl}
            />
          </Route>
          <Route path="/friends/list">
            <NoPreview
              text={"Select people's names to preview their profile."}
              flex={0.7}
            />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default AllFriends;
