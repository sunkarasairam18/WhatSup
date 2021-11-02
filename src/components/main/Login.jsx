import React from 'react';
import {Button} from "@material-ui/core";
import '../../css/maincss/Login.css';
import {auth,provider} from '../../services/firebase';
import {signInWithPopup} from 'firebase/auth';
import { useStateValue } from '../../services/StateProvider';
import { actionTypes } from '../../services/reducer';
import { addAccount } from '../../services/firebase';

import chit from '../chit.jpeg';

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
                <img src={chit} alt="" />
                <div className="login_text">
                    WhatSup
                </div>
                <Button onClick={signIn}>
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}
 
export default Login;