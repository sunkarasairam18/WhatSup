import React, {useState,useEffect } from 'react';
import { Avatar,IconButton } from '@material-ui/core';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {doc,getDoc,onSnapshot,query,collection,orderBy} from 'firebase/firestore';
import { SearchOutlined } from '@mui/icons-material';
import { CSSTransition } from 'react-transition-group';


import Profile from './Profile';
import '../css/Sidebar.css';
import SidebarChat from './SidebarChat';
import { firestore } from '../services/firebase';
import { useStateValue } from '../services/StateProvider';
import { actionTypes } from '../services/reducer';


const Sidebar = ({showUpload,setShowUpload,setUploadFile}) => {
    const [{user},dispatch] = useStateValue();
    const [select,setSelect] = useState("");
    const [show,setShow] = useState(false);
    const [friendsList,setFriendsList] = useState([]);
    const [about,SetAbout] = useState("");
    const [photoUrl,SetPhotoUrl] = useState("");
    const [truth,setTruth] = useState(false);
    const [search,setSearch] = useState();


    useEffect(()=>{
        const userDoc = doc(firestore,`Accounts/${user.uid}`);
        console.log('Again');
        onSnapshot(userDoc,userUpdate=>{
            if(userUpdate.exists()){
                const userData = userUpdate.data();   
                SetPhotoUrl(userData.photoUrl);
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
                ...e.data()
            })));
        });        
    },[]);

    function getIcon(){
        if(truth){
            return <ArrowBackIcon/>;                                   
        }else{
            return <SearchOutlined/>;
        }
    }


    return ( 

        <div className="sidebar">
            <div className="sidebarcontent">
                <div className="sidebar_header">
                    <Avatar src={photoUrl} className="profilepic" onClick={setShow}/>
                    <div className="sidebar_headerRight">
                        <IconButton>
                        <DonutLargeIcon/>
                        </IconButton>
                        <IconButton>
                        <ChatIcon/>
                        </IconButton>
                        <IconButton>
                        <MoreVertIcon/>
                        </IconButton>
                    </div>
                </div>
                <div className={`sidebar_search ${truth?`sidebar_Search_focus`:`sidebar_Search_blur`}`}>
                    <div className="sidebar_searchContainer">
                        <div className="icons">                                             
                            <CSSTransition in={truth} timeout={500} classNames="arrow">
                                <div>
                                    {getIcon()}
                                </div>
                            </CSSTransition> 
                        </div>    
                        <input 
                            placeholder="Search friend" 
                            type="text"
                            onFocus={()=>setTruth(!truth)}
                            onBlur={()=>setTruth(!truth)}
                            onChange={e=>setSearch(e.target.value)}/>
                    </div>                    
                </div>
              
                 <div className="sidebar_chats">
                    <SidebarChat addNewChat/>
                    {friendsList.map(friend => (
                        <SidebarChat 
                        key={friend.friendId} 
                        friendId={friend.friendId} 
                        friendInfoDocId={friend.id} 
                        name={friend.friendName} 
                        containerId={friend.container} 
                        selected={select === friend.friendId} 
                        onSelect={setSelect}/>
                    ))}
                </div>
            </div>
            <CSSTransition in={show} timeout={450} unmountOnExit classNames="profileSlidercontent">
                <Profile 
                photo={photoUrl} 
                name={user.displayName} 
                about={about} 
                className="profileSlider" 
                show={show} 
                showUpload={showUpload} 
                setShowUpload={setShowUpload} 
                setUploadFile={setUploadFile}
                onBack={setShow}/>
            </CSSTransition>

        </div>
       
     );
}
 
export default Sidebar;