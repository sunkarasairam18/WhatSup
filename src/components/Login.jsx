import React from 'react';
import {Button} from "@material-ui/core";
import '../css/Login.css';
import {auth,provider} from '../services/firebase';
import {signInWithPopup} from 'firebase/auth';
import { useStateValue } from '../services/StateProvider';
import { actionTypes } from '../services/reducer';
import { addAccount } from '../services/firebase';

import Icon from './aa3.jpeg';

const Login = () => {
    const [{},dispatch] = useStateValue();

    const signIn = () =>{
        console.log("Sign IN ");
        signInWithPopup(auth,provider).then(result => {
            const {displayName,email,uid} = result.user;
            localStorage.setItem("whatSupToken",JSON.stringify({
                "displayName": displayName,
                "email": email,
                "uid": uid,                
            }));
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
                <img src={Icon} alt="" />
                <div className="login_text">
                    <h1>Sign in</h1>
                </div>
                <Button onClick={signIn}>
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}
 
export default Login;