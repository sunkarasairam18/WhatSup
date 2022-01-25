import React ,{useState,useEffect,useRef} from 'react';
import '../../css/Home/Unread.css';

const Unread = ({count}) => {
    const [appear,setAppear] = useState(true);
    const unread = useRef(null);    

    const handleDown = (e) => {
        if (unread.current && !unread.current.contains(e.target)) {
            setAppear(false);
            return;
        }
    };
    
    useEffect(() => {
        document.addEventListener("click", handleDown);
    }, [unread]);

    useEffect(()=>{
        unread.current.scrollIntoView({ behavior: "auto" });
    },[]);

    return ( 
        <div>
            {appear && 
            <div className="unread" ref={unread}>
                <div className="unmsg">
                    {`${count} UNREAD MESSAGE${count>1?"S":""}`}
                </div>
            </div>
            }
        </div>
    );
}
 
export default Unread;