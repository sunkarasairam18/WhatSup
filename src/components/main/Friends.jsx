import React from 'react';

import FRequestsCards from '../Friends/FRequestsCards';
import "../../css/common/Container.css";

import FSidebar from '../Friends/FSidebar';

const Friends = () => {
    return (
        <div className="container">
            <div className="container_app">
                <FSidebar/>
                <FRequestsCards/>
            </div>
        </div>
    );
}
 
export default Friends;