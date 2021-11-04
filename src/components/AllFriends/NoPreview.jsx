import React from 'react';

import '../../css/AllFriends/NoPreview.css';


import team from '../team.png';
const NoPreview = () => {
    return ( 
        <div className="NoPreview">
            <div className="NPcontent">
                <img src={team} className="NPCimg"/>
                <div className="NPCtitle">
                    Select people's names to preview their profile.
                </div>
            </div>
        </div>
    );
}
 
export default NoPreview;