import React, {useState,useEffect } from 'react';
import { Avatar,IconButton } from '@material-ui/core';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {doc,onSnapshot,query,collection,orderBy} from 'firebase/firestore';
import { SearchOutlined } from '@mui/icons-material';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';


import Profile from './Profile';
import '../../css/Home/Sidebar.css';
import SidebarChat from './SidebarChat';
import { firestore } from '../../services/firebase';
import { useStateValue } from '../../services/StateProvider';
import { actionTypes } from '../../services/reducer';


const Sidebar = ({
                    selectId,
                    setSelectId,
                    profileUrl,
                    setShowProfile,
                    setProfileUrl,
                    showUpload,
                    search,
                    searchIcon,
                    setSearchIcon,
                    setSearch,
                    setShowUpload,
                    setUploadFile}) => {
    const [{user},dispatch] = useStateValue();
    const [show,setShow] = useState(false);
    const [friendsList,setFriendsList] = useState([]);
    const [about,SetAbout] = useState("");

    const searchRef = React.createRef();

    useEffect(()=>{
        const userDoc = doc(firestore,`Accounts/${user.uid}`);
        console.log("User id",user.uid);
        onSnapshot(userDoc,userUpdate=>{
            if(userUpdate.exists()){
                const userData = userUpdate.data();   
                setProfileUrl(userData.photoUrl);
                SetAbout(userData.About);
                dispatch({
                    type: actionTypes.SET_USER,
                    user: userData,
                });
            }
        });
    },[]);

    useEffect(()=>{
        const friendQuery = query(collection(firestore,`Accounts/${user.uid}/Friends`),orderBy('lastsent','desc'));
        onSnapshot(friendQuery,(querySnapshot)=>{
            setFriendsList(querySnapshot.docs.map(e => ({
                id: e.id,
                ...e.data(),
            })));
        });        
    },[]);

   

    function getIcon(){
        if(searchIcon){
            return (
                <div onClick={()=>{
                    setSearch("");
                    setSearchIcon(false);
                }}>
                    <ArrowBackIcon/>
                </div>
            );                                   
        }else{
            return (
                <div onClick={()=>{
                    searchRef.current?.focus();                    
                }}>
                    <SearchOutlined/>
                </div>
            );
        }
    }

    function getSearchList(){
        if(search){            
            var list = friendsList.filter(friend => friend.friendName.trim().toLowerCase().includes(search.trim().toLowerCase()));
            return list;
        }else{
            return friendsList;
        }
    }

    return ( 
        <div className="sidebar">
            <div className="sidebarcontent">
                <div className="sidebar_header">
                    <Avatar src={profileUrl} className="profilepic" onClick={()=>setShow(true)}/>
                    <div className="sidebar_headerRight">
                        <Link to="/friends">
                            <IconButton>
                                <PeopleIcon />
                            </IconButton>
                        </Link>                        
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </div>
                </div>
                <div className={`sidebar_search ${searchIcon?`sidebar_Search_focus`:`sidebar_Search_blur`}`}>
                    <div className="sidebar_searchContainer">
                        <div className="icons">                                             
                            <CSSTransition in={searchIcon} timeout={500} classNames="arrow">
                                {getIcon()}
                            </CSSTransition> 
                        </div>    
                        <input 
                            placeholder="Search friend" 
                            type="text"
                            ref={searchRef}
                            value={search}
                            onFocus={()=>setSearchIcon(true)}
                            onBlur={()=>{
                                setSearchIcon(search || false);
                            }}
                            onChange={e=>setSearch(e.target.value)}/>
                    </div>                    
                </div>
              
                 <div className="sidebar_chats">
                    {getSearchList()?.map(friend => (
                        <SidebarChat 
                        key={friend.friendId} 
                        friendId={friend.friendId} 
                        friendInfoDocId={friend.id} 
                        name={friend.friendName} 
                        containerId={friend.container} 
                        selected={selectId === friend.friendId} 
                        onSelect={setSelectId}/>
                    ))}
                   
                </div>
            </div>
            <CSSTransition //Sidebar slider for user photo,name,bio
                in={show} 
                timeout={450} 
                unmountOnExit 
                classNames="profileSlidercontent"> 
                    <Profile 
                    setShowProfile={setShowProfile}
                    photo={profileUrl} 
                    name={user.displayName} 
                    about={about} 
                    showUpload={showUpload} 
                    setShowUpload={setShowUpload} 
                    setUploadFile={setUploadFile}
                    onBack={setShow}/>
            </CSSTransition>

        </div>
       
     );
}
 
export default Sidebar;