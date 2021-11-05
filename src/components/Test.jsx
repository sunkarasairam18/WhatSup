import React,{useState,useRef} from 'react';
import '../css/Test.css';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";



const Test = ({imageUrl}) => {
    
    const [result,setResult] = useState(null);

    const cropperRef = React.createRef(null);

    const [srcImg,selectSrcImg] = useState("");    


    const onCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        setResult(cropper.getCroppedCanvas().toDataURL());
    };


    return ( 
        <div className="t">

            
             {srcImg && <Cropper
                        src={srcImg} 
                        style={{ height: 400, width: 400 }}
                        initialAspectRatio={1 / 1}
                        center={false}
                        // cropBoxMovable={false}
                        cropBoxResizable={false}
                        // toggleDragModeOnDblclick={false}
                        minContainerWidth={500}
                        minContainerHeight={500}
                        // cropBoxData={{ width: 100, height: 50 }}
                        guides={false}
                        // minCropBoxWidth={200}
                        // minCropBoxHeight={200}

                        crop={onCrop}
                        ref={cropperRef}
                        />}           
        </div>
     );
}
 
export default Test;