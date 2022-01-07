import React from 'react';
import '../../css/Home/InfoBubble.css';

const InfoBubble = ({message,displayName}) => {
    return ( 
        <div className="starter_chat">
            <div className="sc_in">
                {`You and ${displayName},${message}`}
            </div>
        </div>
    );
}
 
export default InfoBubble;