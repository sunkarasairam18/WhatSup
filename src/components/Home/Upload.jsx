import React,{useEffect} from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import { CSSTransition } from 'react-transition-group';


import '../../css/Home/Upload.css';

const Upload = ({showUpload,setShowUpload,imageUrl,uploadImage}) => {
    const imgRef = React.createRef();
    
    const submit = () =>{
        uploadImage();
        setShowUpload(false);
    };

    return (  
        <CSSTransition in={showUpload} timeout={800} unmountOnExit classNames="upload_transition">
            <div className="upload">
                <div className="upload_header">
                    <ClearIcon style={{color:"white",height:"50px",cursor:"pointer"}} onClick={()=>setShowUpload(false)}/>
                </div>
                <div className="upload_pic">
                    <img ref={imgRef} src={imageUrl} style={{height:"300px",width:"300px",borderRadius:"150px"}} alt=""/>
                </div>
                <div className="upload_done">

                    <div className="upload_done_icon" onClick={submit}>
                        <DoneIcon style={{color:"white",height:"66px",widht:"66px"}}/>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}
 
export default Upload;