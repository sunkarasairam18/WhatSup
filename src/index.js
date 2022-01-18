import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { reducer,initalState } from './services/reducer';
import {StateProvider} from './services/StateProvider';

ReactDOM.render(
  <Router>
    <StateProvider initialState={initalState} reducer={reducer}>
      <App/>
    </StateProvider>
  </Router>,
  document.getElementById('root')
);


reportWebVitals();
