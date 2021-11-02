import React, { Component } from 'react';
import ForumIcon from '@mui/icons-material/Forum';

import '../../css/Home/JustLogin.css';

import chit from '../chit.jpeg';

const JustLogin = () => {
    return ( 
        <div className="justlogin">
            <div className="justlogincontent">
                {/* <ForumIcon style={{height: "150px",width: "150px",color:"#32CD32"}}/>     */}
                <img src={chit} style={{height: "150px",width: "150px"}}/>
                <div className="justloginwish">
                    What'Sup
                </div>
                <div className="justloginintro">
                    Just Chit-Chat
                </div>
            </div>
        </div>
     );
}
 
export default JustLogin;