import React from 'react';
import { doc,updateDoc } from 'firebase/firestore';

import '../../css/Home/PicChangePopDown.css';
import { CSSTransition } from 'react-transition-group';
import { useStateValue } from '../../services/StateProvider';
import { firestore } from '../../services/firebase';

const PicChangePopDown = ({show,setShowProfile,upload}) => {
    const [{user},dispatch] = useStateValue();

    const removePhoto = () =>{
        const userDoc = doc(firestore,`Accounts/${user.uid}`);

        const newDoc = {
            photoUrl:""
        };
        updateDoc(userDoc,newDoc).then(e=>{
            console.log("photo delted");
        }).catch(error =>{
            console.log(error);
        });
    };

    return ( 
        <CSSTransition in={show} timeout={300} unmountOnExit classNames="popdown">
            <div className="changeContainer">

                <div className="changeOptions" onClick={()=>setShowProfile(true)}>
                    View photo
                </div>
                
                <div className="changeOptions" onClick={upload}>
                    Upload photo
                </div>
                <div className="changeOptions" onClick={removePhoto}>
                    Remove photo
                </div>
            </div>
        </CSSTransition>
     );
}
 
export default PicChangePopDown;