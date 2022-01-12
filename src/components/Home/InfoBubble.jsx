import React,{useEffect,useState,useRef} from 'react';
import { firestore } from '../../services/firebase';
import { doc,updateDoc } from 'firebase/firestore';
import '../../css/Home/InfoBubble.css';

const InfoBubble = ({message,displayName,senderMe,readBy,reader,containerId,msgDocId}) => {
    const [bubbleVisible,setBubbleVisible] = useState(false);

    useEffect(()=>{
        if(!senderMe){
        if(reader && !readBy[reader] && bubbleVisible){
            const db = doc(firestore, `ChatContainers/${containerId}/messages/${msgDocId}`);
            const tempRead = {
            readBy: {...readBy,[reader]: true}
            }
            updateDoc(db, tempRead);
        }
        }
    },[bubbleVisible]);

    const bubbleRef = useRef(null);
    const observer = new IntersectionObserver(([entry]) =>{          
        setBubbleVisible(entry.isIntersecting);
        console.log(entry.isIntersecting,message);
    }
    );

    useEffect(()=>{
        if(!senderMe){
        if(reader && !readBy[reader]){
            observer.observe(bubbleRef.current);
            return () => {
            observer.disconnect();
            };
        }
        }
    },[]);

    return ( 
        <div 
            className="starter_chat"
            ref={bubbleRef}
            >
            <div className="sc_in">
                {`You and ${displayName},${message}`}
            </div>
        </div>
    );
}
 
export default InfoBubble;