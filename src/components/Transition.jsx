import React,{useState} from 'react';
import { SearchOutlined } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CSSTransition } from 'react-transition-group';


const Transition = () => {
    const [truth,setTruth] = useState(false);
    const [search,setSearch] = useState();

    function getIcon(){
        if(truth){
            return <ArrowBackIcon/>;                                   
        }else{
            return <SearchOutlined/>;
        }
    }
    

    return (
        <div className="content">
            <div className={`sidebar_Search ${truth?`sidebar_Search_focus`:`sidebar_Search_blur`}`}>
                <div className="sidebar_SearchContainer">
                    <div className="icons">                                             
                        <CSSTransition in={truth} timeout={500} classNames="arrow">
                            <div>
                                {getIcon()}
                            </div>
                        </CSSTransition> 
                    </div>                    
                    <input 
                        placeholder="Search or start new chat" 
                        onFocus={()=>setTruth(!truth)} type="text"
                        onBlur={()=>setTruth(!truth)}
                        onChange={e=>setSearch(e.target.value)}
                        />
                </div>                    
            </div>
            
        </div>
        );
}
 
export default Transition;