import React,{useState} from 'react';
import { Switch,Route } from 'react-router-dom';


import "../../css/common/Container.css";
import SRSidebar from '../SentRequests/SRSidebar';
import NoPreview from '../common/NoPreview';
import Preview from '../common/Preview';

const SentRequests = ({ setPreviewUrl }) => {
    const [selectedId, setSelectedId] = useState();

    return (
        <div className="container">
            <div className="container_app">
                <SRSidebar selectedId={selectedId} setSelectedId={setSelectedId}/>
                <Switch>
                <Route path="/sentrequests/list/:previewId">
                    <Preview
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    setPreviewUrl={setPreviewUrl}
                    />
                </Route>
                <Route path="/sentrequests/list">
                    <NoPreview
                    text={"When you send someone a friend request, it will appear here."}
                    flex={0.7}
                    />
                </Route>
                </Switch>
            </div>
        </div>
    );
}
 
export default SentRequests;