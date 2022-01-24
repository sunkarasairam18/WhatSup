import React from 'react';
import {Link} from 'react-router-dom';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import "../../css/Friends/FSidebarBox.css";

const FSidebarBox = ({path,arrow,text,icon,hover}) => {
    return ( 
        <Link to={path} className='alink'>
            <div className={`FSidebarBox ${hover?"FSidebarBoxHover":"FSidebarBoxHoverfix"}`}>
                <div className="FSidebarIcon">
                    {icon}
                </div>
                <div className="FSidebarTitle">
                    {text}
                </div>
                { arrow && 
                    <div className="FSidebarArrow">
                        <ArrowForwardIosIcon style={{width:"20px",height:"20px"}}/>
                    </div>
                }
                
            </div>
        </Link>
    );
}
 
export default FSidebarBox;