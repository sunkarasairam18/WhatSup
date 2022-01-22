import React,{useRef} from 'react';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import LogoutIcon from '@mui/icons-material/Logout';
import '../../css/common/More.css';
import { CSSTransition } from 'react-transition-group';
import { useStateValue } from '../../services/StateProvider';
import { actionTypes } from '../../services/reducer';
import { updateOnlineStatus,updateLastSeen } from '../../services/firebase';

const More = ({show}) => {
    const [{user},dispatch] = useStateValue();

    function logout(){
        localStorage.clear();
        const id = user.uid;        
        dispatch({
            type: actionTypes.CLEAR_USER            
        });     
        updateOnlineStatus(id,false);
        updateLastSeen(id);
        setTimeout(()=>{
            window.location.href = '/';
        },1000);         
    }

    return ( 
        <CSSTransition in={show} timeout={300} unmountOnExit classNames="morepopdown">
        <div className="more">
            <div className="mcontent">
                <div className="mc_row">
                    <div className="mcr_ic">
                        <NotificationsActiveIcon style={{height:"23px",width:"23px",color:'gray'}}/>
                    </div>
                    <div className="mcr_desc">
                        On Notifications
                    </div>
                </div>
                    <div className="mc_row" onClick={logout}>
                        <div className="mcr_ic">
                            <LogoutIcon style={{height:"23px",width:"23px",color:'gray'}}/>
                        </div>
                        <div className="mcr_desc" >
                            Log out
                        </div>
                    </div>
                
            </div>
        </div>
        </CSSTransition>
    );
}
 
export default More;