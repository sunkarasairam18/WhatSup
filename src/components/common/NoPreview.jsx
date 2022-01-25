import React from 'react';

import '../../css/common/NoPreview.css';


import team from '../team.png';
const NoPreview = ({text,flex}) => {
    return ( 
        <div className="NoPreview" style={{flex:`${flex}`}}>
            <div className="NPcontent">
                <img src={team} className="NPCimg" alt="preview"/>
                <div className="NPCtitle">
                    {text}
                </div>
            </div>
        </div>
    );
}
 
export default NoPreview;