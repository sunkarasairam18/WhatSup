import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import "../../css/Home/SentRequestDialog.css";
import { CSSTransition } from "react-transition-group";
import { IconButton } from "@mui/material";
import "../../css/common/StandardTransition.css";
import CloseIcon from "@mui/icons-material/Close";

const SentRequestDialog = ({
  showNewRequestDialog,
  setShowNewRequestDialog,
}) => {
  return (
    <CSSTransition
      in={showNewRequestDialog}
      timeout={400}
      unmountOnExit
      classNames="standard_transition"
    >
      <div className="sent_request_dialog">
        <div className="srd_content">
          <div className="srdc_header">
            <div className="srdch_title">Send Request</div>
            <div
              className="srdch_close"
              onClick={() => setShowNewRequestDialog(false)}
            >
              <IconButton>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className="srdc_subject">Send Request to chat</div>
          <div className="srdc_input">
            <TextField
              label="Enter Email Id"
              color="secondary"
              size="medium"
              fullWidth
            />
          </div>
          <div className="srdc_bottom">
            <div
              className="send_request_btn"
              onClick={() => setShowNewRequestDialog(false)}
            >
              Send Request
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default SentRequestDialog;
