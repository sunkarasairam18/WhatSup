import React from 'react';

import '../../css/Home/NoChats.css';
import icon from '../sad.png';


const NoChats = () => {
    return ( 
        <div className="no_chats">
            <div className="nc_content">
                <div className="ncc_icon">
                    <img src={icon} style={{height: "60px",width: "60px"}} alt="pic"/>
                </div>
                <div className="ncc_title">
                    No chats to show
                </div>
            </div>
        </div>
    );
}
 
export default NoChats;