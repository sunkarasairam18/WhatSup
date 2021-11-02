import React from 'react';
import {Link} from 'react-router-dom';
import { Avatar,IconButton } from '@material-ui/core';
import PeopleIcon from '@mui/icons-material/People';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupSharpIcon from '@mui/icons-material/GroupSharp';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import '../../css/Friends/FSidebar.css';
import chit from '../chit.jpeg';
import FSidebarBox from './FSidebarBox';

const FSidebar = () => {
    return (
        <div className="fsidebar">
            <div className="fsidebarcontent">
                <div className="fsidebar_header">
                    <div className="img">
                        <Link to="/">
                            <img src={chit} alt="" className="app_icon"/>
                        </Link>
                    </div>
                    <div className="fsidebar_headerRight">
                        <IconButton>
                            <PeopleIcon style={{width:"28px",height:"28px"}}/>
                            {/* <img src="https://cdn-icons-png.flaticon.com/512/880/880594.png" style={{width:"28px",height:"28px",color:"grey"}}/> */}
                        </IconButton>                        
                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                    </div>
                </div>
                <div className="fsidebar_title">
                    Friends
                </div>
                <div className="fsidebar_requests">
                    <FSidebarBox path="/friends" icon={<GroupSharpIcon/>} text="Home" hover={false}/>
                    <FSidebarBox icon={<PersonAddAlt1Icon/>} text="Friend requests" hover={true} arrow={true}/>
                    <FSidebarBox icon={<AccessTimeIcon/>} text="Sent requests" hover={true} arrow={true}/>
                    <FSidebarBox icon={<SearchIcon/>} text="Find friends" hover={true} arrow={true}/>
                    <FSidebarBox icon={<GroupsIcon/>} text="All Friends" hover={true} arrow={true}/>
                    

                </div>
            </div>
            
        </div>
    );
}
 
export default FSidebar;