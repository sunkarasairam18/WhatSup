import React from 'react';
import '../../css/maincss/Login.css';
import {auth,provider} from '../../services/firebase';
import {signInWithPopup} from 'firebase/auth';
import { useStateValue } from '../../services/StateProvider';
import { actionTypes } from '../../services/reducer';
import { addAccount } from '../../services/firebase';

import icon from '../chat-1.png';
import google from '../google.png';

const Login = () => {
    const [{},dispatch] = useStateValue();

    const signIn = () =>{
        signInWithPopup(auth,provider).then(result => {
            const {displayName,email,uid} = result.user;
            localStorage.setItem("WhatsUpToken",JSON.stringify({
                "displayName": displayName,
                "email": email,
                "uid": uid,                
            }));
            // console.log("Sign IN ",result.user);
            addAccount(displayName,email,uid);
            dispatch({
                type: actionTypes.SET_USER,
                user: result.user,
            });
        }).catch(error => alert(error.message));
    };
    return (
        <div className="login">
            <div className="login_container">
                <img src={icon} alt="" />
                <div className="login_text">
                    WhatsUp
                </div>
                <div className="login_btn" onClick={signIn}>
                    {/* <div className="google_box">
                        
                    </div> */}
                    <img src={google} className="google" alt="" />
                    Continue with Google
                </div>
            </div>
        </div>
    );
}
 
export default Login;