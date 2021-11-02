import React from 'react';

import FRequestsCards from '../Friends/FRequestsCards';
import "../../css/maincss/Friends.css";

import FSidebar from '../Friends/FSidebar';

const Friends = () => {
    return (
        <div className="f">
            <div className="f_app">
                <FSidebar/>
                <FRequestsCards/>
            </div>


        </div>
    );
}
 
export default Friends;