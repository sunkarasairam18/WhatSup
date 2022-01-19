import React ,{useState,useEffect} from 'react';
import '../../css/Home/Unread.css';
import { useStateValue } from '../../services/StateProvider';

const Unread = ({count}) => {
    const [appear,setAppear] = useState(true);
    const [{user},dispatch] = useStateValue();
    // useEffect(()=>{
    //     if(user?.onlineStatus){
    //         setTimeout(()=>setAppear(false),6000);
    //     }
    // },[]);
    return ( 
        <div>
            {appear && 
            <div className="unread">
                <div className="unmsg">
                    {`${count} UNREAD MESSAGE${count>1?"S":""}`}
                </div>
            </div>
            }
        </div>
    );
}
 
export default Unread;