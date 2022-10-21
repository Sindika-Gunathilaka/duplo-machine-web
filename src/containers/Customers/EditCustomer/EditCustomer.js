import React, { Component } from 'react';
import classes from './EditCustomer.module.css';
import PopupMessage from '../../PopupMessages/PopupMessages';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BASE_URL } from '../../../API/ApiCore';
// import * as CustomerService from '../../../../api/methods/Customers';
import DatePicker from "react-datepicker";
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
class EditCustomer extends Component {

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
        activeStatus: '',
        customer_registration_id: ''
      },
      validateCustomers: [],
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNum: ''
      },
      popUpTrue: false,
      popupMessage: "",
      messageType: "",
      saveButton: false,
      customer_type: ""
    }
  }

  componentDidMount = async () => {

    let selectedCustID = this.props.selectedCustIDFromRedux.selectedCustID;
    console.log(selectedCustID, "selectedCustID");
    try {
      const customer = await axios.get(BASE_URL + "/v1/customers/" + selectedCustID);
      console.log(customer, "customer");
      await this.setState({
        details:
        {
          id: customer.data.id,
          firstName: customer.data.first_name,
          lastName: customer.data.last_name,
          address: customer.data.address,
          phoneNum: customer.data.mobile_number,
          email: customer.data.email,
          activeStatus: customer.data.active_status,
          customer_registration_id: customer.data.customer_registration_id
        },
        customer_type: customer.data.customer_type

      });
      console.log(customer)
      console.log(this.state.details.customerType, "cus")
    } catch (error) {
      console.log(error);
    }

  };

  onInputChange = async (e) => {
    let errors = this.state.errors;
    const { details } = this.state;
    const reIntMax10 = /^[0-9]{1,10}(,[0-9]{3})*(\.[0-9]+)?$/; // maximum 10 numbers
    const reEmailMax30 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;// email validate
    const gmails = this.state.validateCustomers.filter(c => c.email === e.target.value).map(c => c.email)

    // switch (e.target.name) {
    //   case 'email':
    //     errors.email =
    //       validEmailRegex.test(e.target.value) && e.target.value !== gmails[0]
    //         ? ''
    //         : "Customer's email address might be invalid or You seem to already a customer";
    //     break;
    //   case 'phoneNum':
    //     errors.phoneNum =
    //       e.target.value.length !== 10 
    //         ? 'Mobile Number is not valid!'
    //         : '';
    //     break;
    //   default:
    //     break;
    // }

    if (e.target.name === 'phoneNum') {
      if (e.target.value === '' || reIntMax10.test(e.target.value)) {
        console.log(e.target.name)
        await this.setState({
          ...this.state, details: { ...details, [e.target.name]: e.target.value }
        });
      }
      else if (e.target.value.length > 10) {
        console.log("AAA")
        this.state.errors.phoneNum = "Mobile Number field exceeds maximum number of characters..!"
        await this.setState({
          errors: this.state.errors
        });
        setTimeout(() => {
          this.state.errors.phoneNum = ""
          this.setState({
            errors: this.state.errors
          });
        }, 2500);
      } else {
        this.state.errors.phoneNum = "You might entered an invalid character!"
        await this.setState({
          errors: this.state.errors
        });
        setTimeout(() => {
          this.state.errors.phoneNum = ""
          this.setState({
            errors: this.state.errors
          });
        }, 2500);
      }
    }
    else if (e.target.name === 'email') {
      await this.setState({
        ...this.state, details: { ...details, [e.target.name]: e.target.value }
      });
      if (e.target.value.length > 100) {
        this.state.errors.email = "Email should be below 100 characters..!"
        await this.setState({
          errors: this.state.errors
        });
      } else if (e.target.value.length == 0) {
        this.state.errors.email = "Email seems to be empty..!"
        await this.setState({
          errors: this.state.errors
        });
      } else if (!e.target.value === '' || !reEmailMax30.test(e.target.value)) {
        this.state.errors.email = "Email address might be invalid, ( i.e : firstname.secondname@domain.com) "
        await this.setState({
          errors: this.state.errors
        });
      } else if (e.target.value === gmails[0]) {
        this.state.errors.email = "You seem to already a customer"
        await this.setState({
          errors: this.state.errors
        });
      }
      else {
        this.state.errors.email = ""
        await this.setState({
          errors: this.state.errors
        });
      }
    }
    else {
      console.log(e.target.name)
      await this.setState({
        errors, [e.target.name]: e.target.value,
        ...this.state, details: { ...details, [e.target.name]: e.target.value }
      });
    }
  };

  saveButtonHandler = async (event) => {
    await this.setState({
      saveButton: true
    });
    event.preventDefault();

    if (validateForm(this.state.errors)) {
      const { details } = this.state;

      let postData = {
        id: this.state.details.id,
        first_name: this.state.details.firstName,
        last_name: this.state.details.lastName,
        address: this.state.details.address,
        mobile_number: this.state.details.phoneNum,
        email: this.state.details.email,
        customer_type: this.state.customer_type,
        customer_registration_id: this.state.details.customer_registration_id
      }

      console.log(postData, "postData")
      const customer = await axios.put(BASE_URL + "/v1/customers/" + details.id, postData);
      if (customer?.status == 201 || customer?.status == 200) {
        await this.popUpTypeSuccess();
        await this.showPopupSuccess();

        await this.props.handleGetResponse();
      } else {
        await this.popUpTypeError();
        await this.showPopupError();

      }
      console.log("customer", customer)

    } else {
      console.error('Invalid Form')
    }

  }

  viewButtonHandler = async (event) => {
    await this.props.handleClose();
  }

  popUpTypeSuccess = async () => {
    await this.setState({
      popupMessage: "Customer updated successfully",
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

  render() {
    var today = new Date()
    console.log(this.props, "props")
    const { errors, details } = this.state;
    // const isEnabled = details.firstName.length > 0 && details.lastName.length > 0 && details.phoneNum.length > 0 && details.creditLimit.length > 0 && details.email.length > 0 && details.address.length > 0 && details.group.length > 0 && details.companyName.length > 0 && errors.firstName.length === 0 && errors.lastName.length === 0 && errors.phoneNum.length === 0 && errors.creditLimit.length === 0 && errors.email.length === 0;

    return (
      <div className={classes.MainPanel}>
        {/* <div className={classes.ContentWrapperHeader}>
          <h2>DARIMAC DIGITAL</h2>
        </div>
        <br />
        <br /> */}
        <div className={classes.ContentWrapper}>
          {/* <div className="row"> */}

          <h4>Customer Details</h4>
          <hr />
          <div className={classes.ContentWrapper}>
            <Row>
              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Customer Registration ID</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="customer_registration_id"
                  value={this.state.details.customer_registration_id}
                  onChange={this.onInputChange} noValidate />
                <br />
              </Col>

              <Col>
              </Col>
            </Row>
            <Row>
              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>First Name</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="firstName"
                  value={this.state.details.firstName}
                  onChange={this.onInputChange} noValidate />
                {errors.firstName.length > 0 &&
                  <span className={classes.Error}>{errors.firstName}</span>}
                <br />
              </Col>

              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Last Name</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="lastName"
                  value={this.state.details.lastName}
                  onChange={this.onInputChange} noValidate />
                {errors.lastName.length > 0 &&
                  <span className={classes.Error}>{errors.lastName}</span>}<br />
              </Col>
            </Row>

            <Row>
              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Address</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="address"
                  value={this.state.details.address}
                  onChange={this.onInputChange} /> <br />
              </Col>
            </Row>

            <Row>
              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Phone Number</h6></label>
                <input
                  className={classes.searchIconText}
                  type="text"
                  name="phoneNum"
                  value={this.state.details.phoneNum}
                  onChange={this.onInputChange} noValidate /> {errors.phoneNum.length > 0 &&
                    <span className={classes.Error}>{errors.phoneNum}</span>}
                <br />
              </Col>

              <Col>
                <label><h6><a style={{ color: 'red' }}>* </a>Email Address</h6></label>
                <input
                  className={classes.searchIconText}
                  type="email"
                  name="email"
                  value={this.state.details.email}
                  onChange={this.onInputChange} noValidate />
                {errors.email.length > 0 &&
                  <span className={classes.Error}>{errors.email}</span>} <br />
              </Col>


            </Row>
            <Row>
              <Col>
                <label><h6>Customer Type</h6></label>
                <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"customer_type"} value={this.state.customer_type} onChange={(e) => this.onCustomerTypeSelectHandler(e)}>
                  {/* <option selected>Customer Type</option> */}
                  <option value={"PRIVATE"}>Private</option>
                  <option value={"GOVERNMENT"}>Government</option>
                </select>

              </Col>
              <Col></Col>
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
  return { selectedCustIDFromRedux: state.editCustomer }
};

export default connect(mapSateToProps)(EditCustomer);
