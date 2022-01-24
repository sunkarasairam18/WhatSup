import React ,{useState,useEffect,useRef} from 'react';
import '../../css/Home/Unread.css';
import { useStateValue } from '../../services/StateProvider';

const Unread = ({count}) => {
    const [appear,setAppear] = useState(true);
    const [{user},dispatch] = useStateValue();
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