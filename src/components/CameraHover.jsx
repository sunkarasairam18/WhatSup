import React from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import '../css/CameraHover.css';

const CameraHover = ({handleClick}) => {
   
    return (
        <div className="hoverContent" onClick={()=>console.log("pic box")}>
            <div className="hoversubContent">
                <CameraAltIcon style={{height:"25px",width:"25px"}} className="hoverCamera"/>
                <div className="hoverText">
                    CHANGE<br/>
                    PROFILE<br/>
                    PHOTO
                </div>
            </div>

        </div>
    );
}
 
export default CameraHover;