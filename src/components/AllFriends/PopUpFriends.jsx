import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@material-ui/core";
import '../../css/AllFriends/PopUpFriends.css';
import PopUpCard from "./PopUpCard";
import {onSnapshot,query,collection} from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import SearchIcon from '@mui/icons-material/Search';
import { CSSTransition } from 'react-transition-group';
import '../../css/common/StandardTransition.css';

const PopUpFriends = ({id,friendsCount,showDialog,setShowDialog}) => {
  const [search,setSearch] = useState("");
  const [friendsList,setFriendsList] = useState([]);
  const [queryList,setQueryList] = useState([]);

  useEffect(()=>{
    const friendQuery = query(collection(firestore,`Accounts/${id}/Friends`));
    onSnapshot(friendQuery,(querySnapshot)=>{
        setFriendsList(querySnapshot.docs.map(e => ({
            name: e.data().friendName,
            id: e.data().friendId
        })));
    });        
  },[id]);

  useEffect(()=>{
    setQueryList(getList());
  },[search]);

  function getList(){
    if(search !== ""){            
        var list = friendsList.filter(friend => friend.name?.trim().toLowerCase().includes(search.trim().toLowerCase()));
        return list;
    }else{
        return friendsList;
    }
  }  

  return (
    <CSSTransition in={showDialog} timeout={800} unmountOnExit classNames="standard_transition">
    <div className="FPopUp">
      
        <div className="FPopUpMain">
            <div className="FPHeader">
                <div className="FPHTitle">
                    Friends
                </div>
                
                <div className="FPHClose" onClick={()=>setShowDialog(false)}>
                    <IconButton>
                        <CloseIcon/>
                    </IconButton>
                </div>
            </div>
            <div className="FPl" />
            <div className="FPcount">
                <div className="FPCchild">
                  {(friendsCount > 1) && `${friendsCount} friends`}
                  {!friendsCount && `No friends`}
                  {(friendsCount === 1) && `${friendsCount} friend`}
                </div>
            </div>      
            <div className="FPsearch">
              <div className="FPSinput">
                <div className="FPSIIcon">
                  <SearchIcon/>
                </div>
                <input type="text" onChange={e => setSearch(e.target.value.trim())} placeholder="Search"/>
              </div>
            </div>     
            <div className="FPcontent">

              {(search?queryList:friendsList).map(friend => (
                <PopUpCard 
                key={friend.id}
                id={friend.id}
                name={friend.name}
                />       
              ))}
              
              {(queryList.length === 0 && search) && <div className="FPCn">No results to show</div>}
            </div>
        </div> 
        
    </div>
    </CSSTransition>
  );
};

export default PopUpFriends;
