import React from 'react';

import '../../css/AllFriends/AllFSidebarCard.css';
import ben from '../s3.jpeg';

const AllFSidebarCard = ({id}) => {

    

    return ( 
        <div className="AFSCard">
            <div className="ASFCcontent">
                <img src={ben} style={{height:"70px",width:"70px",borderRadius:"35px"}} />
                <div className="ASFCCPname">
                    sai ram
                </div>
            </div>
        </div>
     );
}
 
export default AllFSidebarCard;