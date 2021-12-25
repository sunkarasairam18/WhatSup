import React,{useState} from 'react';
import { Switch,Route } from 'react-router-dom';

import '../../css/maincss/AllFriends.css';
import AllFSidebar from '../AllFriends/AllFSidebar';
import NoPreview from '../AllFriends/NoPreview';
import Preview from '../AllFriends/Preview';



const AllFriends = ({setPreviewUrl}) => {
    const [selectedId,setSelectedId] = useState();

    return ( 
        <div className="AllF">
            <div className="AllF_app">
                <AllFSidebar selectedId={selectedId} setSelectedId={setSelectedId}/>
                <Switch>
                    <Route path="/friends/list/:previewId">
                        <Preview selectedId={selectedId} setSelectedId={setSelectedId} setPreviewUrl={setPreviewUrl}/>                        
                    </Route>
                    <Route path="/friends/list">
                        <NoPreview/>
                    </Route>
                </Switch>
            </div>
        </div>
     );
}
 
export default AllFriends;