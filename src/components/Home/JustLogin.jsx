import React from 'react';

import '../../css/Home/JustLogin.css';

import icon from "../icon.png";

const JustLogin = () => {
    return ( 
        <div className="justlogin">
            <div className="justlogincontent">
                {/* <ForumIcon style={{height: "150px",width: "150px",color:"#32CD32"}}/>     */}
                <img src={icon} style={{height: "150px",width: "150px"}} alt="pic"/>
                <div className="justloginwish">
                    WhatsUp
                </div>
                <div className="justloginintro">
                    Just Chit-Chat
                </div>
            </div>
        </div>
     );
}
 
export default JustLogin;