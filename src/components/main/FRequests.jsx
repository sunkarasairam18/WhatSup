import React,{useState} from 'react';
import { Switch, Route } from "react-router-dom";

import FRSidebar from '../FRequests/FRSidebar';
import Preview from '../common/Preview';
import NoPreview from '../common/NoPreview';
import "../../css/common/Container.css";


const FRequests = ({ setPreviewUrl }) => {
    const [selectedId, setSelectedId] = useState();

    return ( 
        <div className="container">
            <div className="container_app">
                <FRSidebar selectedId={selectedId} setSelectedId={setSelectedId}/>
                <Switch>
                <Route path="/requests/list/:previewId">
                    <Preview
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    setPreviewUrl={setPreviewUrl}
                    />
                </Route>
                <Route path="/requests/list">
                    <NoPreview
                    text={"Select request to preview,When you have friend requests."}
                    flex={0.7}
                    />
                </Route>
                </Switch>
            </div>            
        </div>
    );
}
 
export default FRequests;