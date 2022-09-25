import './App.css';
import React, { Component } from 'react';
import ViewCustomer from './containers/Customers/ViewCustomer/ViewCustomer';
import ViewPaperSize from './containers/PaperSize/ViewPaperSize/ViewPaperSize';
import ViewPaperGsm from './containers/PaperGsm/ViewPaperGsm/ViewPaperGsm';
import ViewPaperItem from './containers/PaperItem/ViewPaperItem/ViewPaperItem';
import ViewJob from './containers/Job/ViewJob/ViewJob'
import CreateJob from './containers/Job/CreateJob/CreateJob';
import { Button, Container, Row, Col, Image } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import navShowIcon from './assets/images/icons/hamburger.png';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

class App extends Component {


  render() {


    return (
      <BrowserRouter>
        <div className="App">
          <head>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous" />
          </head>
          {/* <Route path="/create-customer" component={CreateCustomer} /> */}
          <Route path="/view-customer" component={ViewCustomer} />
          <Route path="/view-paper-size" component={ViewPaperSize} />
          <Route path="/view-paper-gsm" component={ViewPaperGsm} />
          <Route path="/view-paper-item" component={ViewPaperItem} />
          <Route path="/view-job" component={ViewJob} />
        </div>
      </BrowserRouter>


    );
  }
}

export default App;
