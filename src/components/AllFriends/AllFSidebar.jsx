import React,{useState,useEffect} from 'react';
import { IconButton } from '@material-ui/core';
import {Link,Switch,Route} from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import {onSnapshot,query,collection} from 'firebase/firestore';


import '../../css/AllFriends/AllFSidebar.css';
import icon from '../chat-1.png';
import { useStateValue } from '../../services/StateProvider';
import AllFSidebarCard from './AllFSidebarCard';
import { firestore } from '../../services/firebase';
import FullPhoto from './FullPhoto';

const AllFSidebar = ({selectedId,setSelectedId}) => {
    const [{user},dispatch] = useStateValue();
    const [friendsList,setFriendsList] = useState([]);
    const [search,setSearch] = useState("");
    

    useEffect(()=>{
        const friendQuery = query(collection(firestore,`Accounts/${user.uid}/Friends`));
        onSnapshot(friendQuery,(querySnapshot)=>{
            setFriendsList(querySnapshot.docs.map(e => ({
                name: e.data().friendName,
                id: e.data().friendId
            })));
        });        
    },[]);

    function getList(){
        if(search !== ""){            
            var list = friendsList.filter(friend => friend.name.trim().toLowerCase().includes(search.trim().toLowerCase()));
            return list;
        }else{
            return friendsList;
        }
    }

    return ( 
        <div className="AllFsidebar">            
            <div className="AllFsidebarcontent">
                <div className="AllFsidebar_header">
                    <div className="img">
                        <Link to="/">
                            <img src={icon} alt="" className="app_icon"/>
                        </Link>
                    </div>
                    <div className="AllFsidebar_headerRight">
                        <Link to="/friends">
                            <IconButton>
                                <PeopleIcon style={{height:"30px",width:"30px"}}/>
                            </IconButton>                        
                        </Link>
                        <IconButton>
                            <MoreVertIcon style={{height:"26px",width:"26px"}}/>
                        </IconButton>
                    </div>

                </div>
                <div className="AllFScontent">
                    <div className="AFsearch">
                        <div className="AFStitle">
                            <div className="AFSback">
                                <Link to="/friends">
                                    <IconButton>
                                        <ArrowBackIcon  style={{width:"25px",height:"25px"}}/>
                                    </IconButton>
                                </Link>                                
                            </div>
                            <div className="AFStitles">
                                <div className="AFSTsmall">
                                    Friends
                                </div>
                                <div className="SFSTbig">
                                    All Friends
                                </div>
                            </div>
                        </div>
                        <div className="AFSinput">
                            <div className="AFSIIcon">
                                <SearchIcon/>
                            </div>
                            <input type="text" onChange={e => setSearch(e.target.value)} placeholder="Search Friends"/>
                        </div>
                        
                    </div>
                    <div className="friendCount">
                        {`${friendsList.length<=0?"No":friendsList.length} friends`}
                    </div>
                   
                </div>
                <div className="ALFSCfriends">
                    {getList().map(friend => <AllFSidebarCard 
                                            key={friend.id}
                                            id={friend.id}
                                            to={`/friends/list/${friend.id}`} 
                                            selected={friend.id===selectedId} 
                                            setSelectedId={setSelectedId}/>)}
                    
                </div>          
            </div>

        </div>
     );
}
 
export default AllFSidebar;