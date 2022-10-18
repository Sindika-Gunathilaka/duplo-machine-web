import React, { Component } from 'react';
import classes from './EditAllJobs.module.css';
import PopupMessage from '../../PopupMessages/PopupMessages';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { BASE_URL } from '../../../API/ApiCore';
import { connect } from 'react-redux';

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
class EditAllJobs extends Component {

  constructor() {
    super();

    this.state = {
      details: {
        id: '',
        firstName: '',
        lastName: '',
        address: '',
        phoneNum: '',
        email: '',
        group: '',
        creditLimit: '',
        companyName: '',
        activeStatus: '',
        gender: '',
        dateOfBirth: "",
        customerCode: ''
      },
      validateCustomers: [],
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNum: '',
        creditLimit: ''
      },
      popUpTrue: false,
      popupMessage: "",
      messageType: "",
      saveButton: false,
      customer_type: "PRIVATE",
      job_type: "DIGITAL",
      job_description: "",
      job_date: "",
      job_payment: '',
      payed_amount: '',
      due_payment: '',
      payment_status: '',
      job_status: '',
      customers: [],
      selectedCustId: '',
      selectedJobId:''
    }
  }

  componentDidMount = async () => {
    let selectedAllJobsID = this.props.selectedAllJobsIdFromRedux.selectedAllJobsID;
    console.log("selectedAllJobsID",selectedAllJobsID);
    try {
      const selectedJob = await axios.get(BASE_URL + "/v1/all_jobs/"+selectedAllJobsID);
      await this.setState({

        selectedJobId: selectedAllJobsID,
      job_type: selectedJob.data.job_type,
      job_description: selectedJob.data.job_description,
      job_date: selectedJob.data.job_date,
      job_payment: selectedJob.data.job_payment,
      payed_amount: selectedJob.data.payed_amount,
      due_payment: selectedJob.data.due_payment,
      payment_status: selectedJob.data.payment_status,
      job_status: selectedJob.data.job_status,
      selectedCustId:selectedJob.data.customer.id
      })
      console.log(this.state.customers, "ttttt")
    } catch (error) {
      console.log(error);
    }

    try {
        const customer = await axios.get(BASE_URL + "/v1/customers");
        await this.setState({
          customers: customer.data
        })
        console.log(this.state.customers, "ttttt")
      } catch (error) {
        console.log(error);
      }
  };

  saveButtonHandler = async (event) => {
    await this.setState({
      saveButton: true
    });
    event.preventDefault();

    let postData = {
        id:this.state.selectedJobId,
      job_type: this.state.job_type,
      job_description: this.state.job_type,
      job_date: this.state.job_date,
      job_payment: this.state.job_payment,
      payed_amount: this.state.payed_amount,
      due_payment: this.state.due_payment,
      payment_status: this.state.payment_status,
      job_status: this.state.job_status,
      customer: {
        id: this.state.selectedCustId
      }
    }

    console.log(postData, "postData")
    const customer = await axios.put(BASE_URL + "/v1/all_jobs/"+this.state.selectedJobId, postData);
    if (customer?.status == 201 || customer?.status == 200) {
      await this.popUpTypeSuccess();
      await this.showPopupSuccess();
      await this.props.handleGetResponse();

    } else {
      await this.popUpTypeError();
      await this.showPopupError();

    }
  }

  viewButtonHandler = async (event) => {
    await this.props.handleClose();
  }

  popUpTypeSuccess = async () => {
    await this.setState({
      popupMessage: "Customer created successfully",
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

  onCustomerTypeSelectHandler = async (e) => {
    console.log('e.target.name', e.target.name);
    console.log('e.target.value', e.target.value);
    await this.setState({
      [e.target.name]: e.target.value
    })
  }

  onJobTypeSelectHandler = async (e) => {
    console.log('e.target.name', e.target.name);
    console.log('e.target.value', e.target.value);
    await this.setState({
      [e.target.name]: e.target.value
    })
    console.log('job_type', this.state.job_type);
    console.log('payment_status', this.state.payment_status);
    console.log('job_status', this.state.job_status);
  }

  onInputChangeHandler = async (e) => {
    console.log('e.target.name', e.target.name);
    console.log('e.target.value', e.target.value);
    await this.setState({
      [e.target.name]: e.target.value
    })
  }

  onCustomerSelectHandler = async (e) => {
    await this.setState({
      selectedCustId: e.target.value
    })
    console.log('selectedCustId', this.state.selectedCustId);
  }

  render() {
    var today = new Date()
    console.log(this.props, "props")
    const { errors, details } = this.state;
    const isEnabled = details.firstName.length > 0 && details.lastName.length > 0 && details.phoneNum.length > 0 && details.creditLimit.length > 0 && details.email.length > 0 && details.address.length > 0 && details.group.length > 0 && details.companyName.length > 0 && errors.firstName.length === 0 && errors.lastName.length === 0 && errors.phoneNum.length === 0 && errors.creditLimit.length === 0 && errors.email.length === 0;

    return (
      <div className={classes.MainPanel}>
        {/* <div className={classes.ContentWrapperHeader}>
          <h2>DARIMAC DIGITAL</h2>
        </div>
        <br />
        <br /> */}
        <div className={classes.ContentWrapper}>
          {/* <div className="row"> */}

          <h5>General Job Details</h5>
          <hr />
          <div className={classes.ContentWrapper}>
            <Row>

              <Col>
                <label><h6>Job Type</h6></label>
                <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"job_type"} onChange={(e) => this.onJobTypeSelectHandler(e)}>
                  {/* <option selected>Customer Type</option> */}
                  <option value={"DIGITAL"}>DIGITAL</option>
                  <option value={"OFFSET"}>OFFSET</option>
                  <option value={"DUPLO"}>DUPLO</option>
                  <option value={"PHOTO_COPY"}>PHOTO_COPY</option>
                  <option value={"TYPE_SETTING"}>TYPE_SETTING</option>
                </select>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Job Description</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="job_description"
                  value={this.state.job_description}
                  onChange={this.onInputChangeHandler} noValidate />
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Job Date</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="job_date"
                  value={this.state.job_date}
                  onChange={this.onInputChangeHandler} noValidate />
                <br />
              </Col>
              <br />
              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Job Payment</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="job_payment"
                  value={this.state.job_payment}
                  onChange={this.onInputChangeHandler} noValidate />
                <br />
              </Col>
            </Row>
            <Row>
              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Payed Amount</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="payed_amount"
                  value={this.state.payed_amount}
                  onChange={this.onInputChangeHandler} noValidate />
                <br />
              </Col>
              <br />
              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Due Amount</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="due_payment"
                  value={this.state.due_payment}
                  onChange={this.onInputChangeHandler} noValidate />
                <br />
              </Col>
              <br />
            </Row>
            <Row>
              <Col>
                <label><h6>Payment Status</h6></label>
                <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"payment_status"} onChange={(e) => this.onJobTypeSelectHandler(e)}>
                  <option value={"UNSETTLED"}>UNSETTLED</option>
                  <option value={"FULLY PAID"}>FULLY_PAID</option>
                </select>
              </Col>
              <br />
              <Col>
                <label><h6>Job Status</h6></label>
                <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"job_status"} onChange={(e) => this.onJobTypeSelectHandler(e)}>
                  <option value={"TODO"}>TODO</option>
                  <option value={"IN_PROGRESS"}>IN_PROGRESS</option>
                  <option value={"COMPLETED"}>COMPLETED</option>
                </select>
              </Col>
              <br />
            </Row>
            <br />
            <Row>

              <Col>
                <label><h6>Customer</h6></label>
                <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"selectedCustId"} onClick={(e) => this.onCustomerSelectHandler(e)}>
                  {this.state.customers.map((fbb) => (
                    <option key={fbb.first_name} value={fbb.id}>
                      {fbb.first_name + " " + fbb.last_name}
                    </option>
                  ))};
                </select>
              </Col>
            </Row>
            <br />
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

const mapStateToProps = (state) => {
    return { selectedAllJobsIdFromRedux: state.editAllJobs };
  };

export default connect(mapStateToProps)(EditAllJobs);
