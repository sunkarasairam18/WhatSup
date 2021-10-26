import React,{useState,useEffect} from 'react';
import { Avatar } from '@material-ui/core';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateIcon from '@mui/icons-material/Create';


import CameraHover from './CameraHover';
import '../css/Profile.css';
import Upload from './Upload';

const Profile = ({photo,name,about,show,setUploadFile,onBack,setShowUpload}) => {
    const [hovershow,SetHoverShow] = useState(false);
    const [file,setFile] = useState();
    const [selected,setSelected] = useState(false);

    const fileChange = (e) =>{
        console.log(e);
        if(e.target.files[0]){
            setUploadFile({file:e.target.files[0],url:URL.createObjectURL(e.target.files[0])});
        }        
    };

    const myRef = React.createRef();

    const click = ()=>{
        myRef.current.click();
    }

   
    return (
        <div className="profile">
            <div className="profile_header">
                <div className="profile_header_content">
                    <div className="profile_header_back_btn" >
                        <ArrowBackIcon onClick={()=>onBack(!show)}/>
                    </div>
                    <div className="profile_header_title">
                        Profile
                    </div>
                </div>
                
            </div>
            <div className="profile_pic">
                <div className="profile_pic_box" onClick={click}>
                    <img src={photo} className="profile_pic_org"/>
                    <input type="file" accept=".png, .jpg, .jpeg" ref={myRef} style={{opacity: "0"}} onChange={fileChange}/>

                    {/* {hovershow && <div className="profile_pic_hover" onClick={check}>
                        <CameraHover />
                    </div>} */}
                </div>
                {/* <button onClick={uploadImage}>upload</button> */}
                {/* <div onClick={click}>CLick</div> */}
               

            </div>
            <div className="profile_name">
                <div className="profile_name_content">
                    <div className="profile_name_title">
                        Your Name
                    </div>
                    <div className="profile_user">
                        <div className="profile_user_name">
                            {name}
                        </div>
                        <CreateIcon className="profile_user_name_edit" style={{height: "23px",width: "23px"}}/>
                    </div>
                </div>
            </div>
            <div className="about_name">
                <div className="about_name_content">
                    <div className="about_name_title">
                        About
                    </div>
                    <div className="about_user">
                        <div className="about_user_text">
                            {about}
                        </div>
                        <CreateIcon className="about_user_text_edit" style={{height: "23px",width: "23px"}}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Profile;