import React,{useState} from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import { CSSTransition } from 'react-transition-group';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import '../../css/Home/Upload.css';
import Test from "../Test";
import { UploadFile } from '@mui/icons-material';


const Upload = ({showUpload,uploadFile,setUploadFile,setShowUpload,imageUrl,uploadImage}) => {
    const imgRef = React.createRef();
    
    const [result,setResult] = useState(null);

    const cropperRef = React.createRef(null);

    const [srcImg,selectSrcImg] = useState("");    


    const onCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        
        setResult(cropper.getCroppedCanvas().toDataURL());
    };

    
    const submit = () =>{
        uploadImage(result);
        setShowUpload(false);
    };

    return (  
        <CSSTransition in={uploadFile.url} timeout={800} unmountOnExit classNames="upload_transition">
            <div className="upload">
                <div className="upload_header">
                    <ClearIcon style={{color:"white",height:"50px",cursor:"pointer"}} onClick={()=>setUploadFile({url:"",file:""})}/>
                </div>
                <div className="upload_pic">
                    {/* <img ref={imgRef} src={imageUrl} style={{height:"300px",width:"300px",borderRadius:"150px"}} alt=""/> */}
                    <div>

                    {imageUrl && <Cropper
                        src={imageUrl} 
                        style={{ height: 350, width: "100%" }}
                        initialAspectRatio={1 / 1}
                        center={false}
                        movable={false}
                        // cropBoxMovable={false}
                        // cropBoxResizable={false}
                        toggleDragModeOnDblclick={false}
                        minContainerWidth={100}
                        minContainerHeight={80}
                        // cropBoxData={{ width: 100, height: 50 }}
                        guides={false}
                        // minCropBoxWidth={200}
                        // minCropBoxHeight={200}

                        crop={onCrop}
                        ref={cropperRef}
                        />}    
                    </div>
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