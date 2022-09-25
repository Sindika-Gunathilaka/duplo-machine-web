import React, { Component } from 'react';
import classes from './CreatePaperSize.module.css';
import PopupMessage from '../../PopupMessages/PopupMessages';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import { BASE_URL } from '../../../API/ApiCore';

const validEmailRegex = RegExp(
  /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
);
const rePhoneNumber = /^[0-9]{1,10}(,[0-9]{3})*(\.[0-9]+)?$/; // maximum 10 numbers
const validPrice = /^[0-9]{1,8}(,[0-9]{3})*(\.[0-9]+)?$/;;
const validName = RegExp(/[0-9]/);
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};
class CreatePaperSize extends Component {

  constructor() {
    super();

    this.state = {
      page_name:'',
      popUpTrue: false,
      popupMessage: "",
      messageType: "",
      saveButton: false
    }
  }

  componentDidMount = async () => {
    
  };

  onInputChange = async (e) => {
      await this.setState({[e.target.name]:e.target.value});
      console.log(this.state.page_name,"page_name")
    
  };

  saveButtonHandler = async (event) => {
    await this.setState({
      saveButton: true
    });
    event.preventDefault();

    if (this.state.page_name.length>0) {

      let postData = {
        "page_name": this.state.page_name,
        "active_status": 1
        
      }

      console.log(postData, "postData")
      const paperSizes = await axios.post(BASE_URL + "/v1/paper-sizes", postData);
      if (paperSizes?.status == 201 || paperSizes?.status == 200) {
        await this.popUpTypeSuccess();
        await this.showPopupSuccess();
        await this.props.handleGetResponse();
        
      } else {
        await this.popUpTypeError();
        await this.showPopupError();   

      }
      console.log("paperSizes", paperSizes)


    } else {
      console.error('Invalid Form')
    }

  }

  viewButtonHandler = async (event) => {
    await this.props.handleClose();
  }

  popUpTypeSuccess = async () => {
    await this.setState({
      popupMessage: "Paper size created successfully",
      messageType: "success"
    })
  }

  popUpTypeError = async () => {
    await this.setState({
      popupMessage: "Error occurred",
      messageType: "error",
      saveButton: false
    })
  }

  showPopupSuccess = async () => {
    await this.setState({
      popUpTrue: !this.state.popUpTrue
    });
    if (this.state.popUpTrue === true) {
      setTimeout(() => {
        this.setState({
          popUpTrue: false,
          popupMessage: ''
        });
      }, 2000);
    }
    await setTimeout(() => { this.props.handleClose() }, 2500);
  }

  showPopupError = async () => {
    await this.setState({
      popUpTrue: !this.state.popUpTrue
    });
    if (this.state.popUpTrue === true) {
      setTimeout(() => {
        this.setState({
          popUpTrue: false,
          popupMessage: ''
        });
      }, 2000);
    }
  }

 

  render() {

    return (
      <div className={classes.MainPanel}>
        <div className={classes.ContentWrapper}>
         
          <h5>Paper Size Details</h5>
          <hr />
          <div className={classes.ContentWrapper}>
            <Row>

              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Name</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="page_name"
                  value={this.state.page_name}
                  onChange={(e) => this.onInputChange(e)} noValidate />
                <br />
              </Col>
            </Row>
           </div>
          <br></br>

          <div className={classes.ContentWrapper}>
            <div className="row justify-content-end">
              <Button variant="outline-dark" size="sm" onClick={this.viewButtonHandler}>Cancel</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button variant="dark" size="sm" onClick={this.saveButtonHandler} >Save</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>

          </div>

          <div>
            <Modal show={this.state.popUpTrue} centered size="sm">
              <Modal.Body><PopupMessage
                message={this.state.popupMessage}
                messageType={this.state.messageType}
              /></Modal.Body>
            </Modal>
          </div>

          {/* </div> */}
        </div>
      </div>


    );
  }
}

export default CreatePaperSize;
