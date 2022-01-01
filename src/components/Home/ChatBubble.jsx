import React,{useState,useEffect} from 'react';

import DoneAllIcon from '@mui/icons-material/DoneAll';
import '../../css/Home/ChatBubble.css';

const ChatBubble = ({fullClass,message,timestamp}) => {   
    const [overflow,setOverflow] = useState(false);

    useEffect(()=>{
        if(message.length>400 && !overflow) setOverflow(true);
    },[]);
    
    return (
        <div className={`${fullClass} `}>
            {overflow && <p className={`chat_message_content`}>
                {message.substring(0,400)}
            </p>}
            {
                !overflow && 
                <p className={`chat_message_content`}>
                    {message}
                </p>
            }                
            {overflow && <p className="readmore" onClick={()=>setOverflow(false)}>...Read More</p>}

            <div className="chat_timestamp">    
                <div className="seenicon">
                    <DoneAllIcon style={{height:"17px",width:"17px"}}/>
                </div>
                <div className="chat_timestamp_text">
                    {`${timestamp.hours}:${timestamp.minutes<10 ? `0${timestamp.minutes}`:timestamp.minutes} ${timestamp.median}`}
                </div>            
                
            </div>
        </div>
    );
}
 
export default ChatBubble;