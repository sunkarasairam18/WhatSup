import React,{useState,useEffect} from 'react';
import { IconButton } from '@material-ui/core';
import {Link} from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import {onSnapshot,query,collection} from 'firebase/firestore';


import '../../css/AllFriends/AllFSidebar.css';
import chit from '../chit.jpeg';
import { useStateValue } from '../../services/StateProvider';
import AllFSidebarCard from './AllFSidebarCard';
import { firestore } from '../../services/firebase';


const AllFSidebar = () => {
    const [{user},dispatch] = useStateValue();
    const [friendsList,setFriendsList] = useState([]);
    

    useEffect(()=>{
        const friendQuery = query(collection(firestore,`Accounts/${user.uid}/Friends`));
        onSnapshot(friendQuery,(querySnapshot)=>{
            setFriendsList(querySnapshot.docs.map(e => (
                e.data().friendId
            )));
        });        
    },[]);

    return ( 
        <div className="AllFsidebar">
            <div className="AllFsidebarcontent">
                <div className="AllFsidebar_header">
                    <div className="img">
                        <Link to="/">
                            <img src={chit} alt="" className="app_icon"/>
                        </Link>
                    </div>
                    <div className="AllFsidebar_headerRight">
                        <Link to="/friends">
                            <IconButton>
                                <PeopleIcon style={{width:"28px",height:"28px"}}/>
                                {/* <img src="https://cdn-icons-png.flaticon.com/512/880/880594.png" style={{width:"28px",height:"28px",color:"grey"}}/> */}
                            </IconButton>                        
                        </Link>
                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                    </div>

                </div>
                <div className="AllFScontent">
                    <div className="AFsearch">
                        <div className="AFStitle">
                            <div className="AFSback">
                                <IconButton style={{width:"40px",height:"40px"}}>
                                <ArrowBackIcon  style={{width:"25px",height:"25px"}}/>
                                </IconButton>
                                
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
                            <input type="text" placeholder="Search Friends"/>
                        </div>
                        
                    </div>
                    <div className="friendCount">
                        {`${friendsList.length<=0?"No":friendsList.length} friends`}
                    </div>
                   
                </div>
                <div className="ALFSCfriends">
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                        <AllFSidebarCard/>
                       
                    </div>          
            </div>
        </div>
     );
}
 
export default AllFSidebar;