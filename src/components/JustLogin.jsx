import React, { Component } from 'react';
import ForumIcon from '@mui/icons-material/Forum';

import '../css/JustLogin.css';


const JustLogin = () => {
    return ( 
        <div className="justlogin">
            <div className="justlogincontent">
                <ForumIcon style={{height: "150px",width: "150px",color:"#32CD32"}}/>    
                <div className="justloginwish">
                    What'Sup?
                </div>
                <div className="justloginintro">
                    Just Chit-Chat
                </div>
            </div>
        </div>
     );
}
 
export default JustLogin;