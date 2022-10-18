import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';

import editCustomerReducer from './store/reducers/editCustomer';
import editPaperSizeReducer from './store/reducers/editPaperSize';
import editPaperGsmReducer from './store/reducers/editPaperGsm';
import editPaperItemReducer from './store/reducers/editPaperItem';
import editJobReducer from './store/reducers/editJob';
import editAllJobsReducer from './store/reducers/editAllJobs';

const rootReducer = combineReducers({
  editCustomer: editCustomerReducer,
  editPaperSize: editPaperSizeReducer,
  editPaperGsm: editPaperGsmReducer,
  editPaperItem: editPaperItemReducer,
  editJob: editJobReducer,
  editAllJobs: editAllJobsReducer
})

export const store = createStore(rootReducer, {});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
