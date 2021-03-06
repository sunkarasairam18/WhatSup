import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

import { useHistory } from "react-router-dom";


import '../../css/AllFriends/FullPhoto.css';

const FullPhoto = ({previewUrl,crossClick}) => {
    let history = useHistory();
    const goToPreviousPath = () => {
        history.goBack()
    };

    return ( 
        <div className="FullPhoto">
            <div className="FPcross">             
                <CloseIcon style={{cursor:"pointer",height:"30px",width:"30px"}} onClick={crossClick?()=>crossClick(false):goToPreviousPath}/>
            </div>
            <div className="FPpiccontainer">
                <img src={previewUrl} className="FullPic" alt='pic'/>
            </div>
        </div>
    );
}
 
export default FullPhoto;