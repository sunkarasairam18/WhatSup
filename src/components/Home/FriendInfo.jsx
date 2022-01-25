import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar } from '@mui/material';

import '../../css/Home/FriendInfo.css';

const FriendInfo = ({friendId,name,about,email,photo,onCross,setProfileUrl,setShowProfile}) => {
    return (
    <div className="infobar">
        <div className="infoheader">
            <div className="infocross" onClick={()=>onCross(false)}>
                <CloseIcon/>
            </div>
            <div className="infointro">
                Friend info
            </div>
        </div>
        <div className="infodisplay">
            <div className="infoimg">                
                {photo && 
                    <img src={photo} className='infoimgin' onClick={()=>{
                        setProfileUrl(photo);
                        setShowProfile(true);
                    }} alt=""/>
                }
                {!photo && <Avatar style={{height:"210px",width:"210px"}}/>}

            </div>
            <div className="infoname">
                <div>
                    {name}
                </div>
            </div>
        </div>
        <div className="about">
            <div className="abouttitle">
                About and email
            </div>
            <div className="aboutinfo">
                {about}
            </div>
            <div className="aboutemail">
                {email}
            </div>
        </div>
        
    </div> 
    );
}
 
export default FriendInfo;