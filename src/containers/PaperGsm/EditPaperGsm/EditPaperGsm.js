import React, { Component } from 'react';
import classes from './EditPaperGsm.module.css';
import PopupMessage from '../../PopupMessages/PopupMessages';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BASE_URL } from '../../../API/ApiCore';
import axios from 'axios';

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
class EditPaperGsm extends Component {

  constructor() {
    super();

    this.state = {
      id:'',
      paper_gsm_name: '',
      active_status: '',
      popUpTrue: false,
      popupMessage: "",
      messageType: "",
      saveButton: false
    }
  }

  componentDidMount = async () => {
    let selectedPaperGsmID = this.props.selectedPaperGsmIDFromRedux.selectedPaperGsmID;
    console.log(selectedPaperGsmID, "selectedPaperGsmID");

    try {
      const paperGsm = await axios.get(BASE_URL + "/v1/paper-gsm/" + selectedPaperGsmID);
      console.log(paperGsm, "paperGsm");
      await this.setState({
        id: paperGsm.data.id,
        paper_gsm_name: paperGsm.data.page_gsm,
        active_status:paperGsm.data.active_status
      });
      console.log(this.state.paper_gsm_name, "paper_gsm_name")
    } catch (error) {
      console.log(error);
    }
  };

  onInputChange = async (e) => {
    await this.setState({ [e.target.name]: e.target.value });
    console.log(this.state.paper_gsm_name, "paper_gsm_name")

  };

  saveButtonHandler = async (event) => {
    await this.setState({
      saveButton: true
    });
    event.preventDefault();

    if (this.state.paper_gsm_name.length > 0) {

      let putData = {
        "id": this.state.id,
        "page_gsm": this.state.paper_gsm_name,
        "active_status": this.state.active_status

      }

      console.log(putData, "putData")
      const paperGsms = await axios.put(BASE_URL + "/v1/paper-gsm/"+this.state.id, putData);
      if (paperGsms?.status == 201 || paperGsms?.status == 200) {
        await this.popUpTypeSuccess();
        await this.showPopupSuccess();
        await this.props.handleGetResponse();

      } else {
        await this.popUpTypeError();
        await this.showPopupError();

      }
      console.log("paperGsms", paperGsms)


    } else {
      console.error('Invalid Form')
    }

  }

  viewButtonHandler = async (event) => {
    await this.props.handleClose();
  }

  popUpTypeSuccess = async () => {
    await this.setState({
      popupMessage: "Paper GSM updated successfully",
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
                  name="paper_gsm_name"
                  value={this.state.paper_gsm_name}
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

const mapSateToProps = (state) => {
  return { selectedPaperGsmIDFromRedux: state.editPaperGsm }
};

export default connect(mapSateToProps)(EditPaperGsm);
