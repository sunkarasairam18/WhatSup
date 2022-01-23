import React from "react";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import LogoutIcon from "@mui/icons-material/Logout";
import "../../css/common/More.css";
import { CSSTransition } from "react-transition-group";
import { useStateValue } from "../../services/StateProvider";
import { actionTypes } from "../../services/reducer";
import { updateOnlineStatus, updateLastSeen } from "../../services/firebase";

const More = ({ show, notificationsAvail, toggleNotification,showNoti }) => {
  const [{ user }, dispatch] = useStateValue();



  function logout() {
    localStorage.clear();
    const id = user.uid;
    dispatch({
      type: actionTypes.CLEAR_USER,
    });
    updateOnlineStatus(id, false);
    updateLastSeen(id);
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  }

  return (
    <CSSTransition
      in={show}
      timeout={300}
      unmountOnExit
      classNames="morepopdown"
    >
      <div className="more">
        <div className="mcontent">
        {showNoti && <div className="mc_row" onClick={toggleNotification}>
            <div className="mcr_ic">
              {notificationsAvail ? (
                <NotificationsOffIcon
                  style={{ height: "23px", width: "23px", color: "gray" }}
                />
              ) : (
                <NotificationsActiveIcon
                  style={{ height: "23px", width: "23px", color: "gray" }}
                />
              )}
            </div>
            <div className="mcr_desc">
              {`${!notificationsAvail ? "On" : "Off"} Notifications`}
            </div>
        </div>}
          <div className="mc_row" onClick={logout}>
            <div className="mcr_ic">
              <LogoutIcon
                style={{ height: "23px", width: "23px", color: "gray" }}
              />
            </div>
            <div className="mcr_desc">Log out</div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default More;
