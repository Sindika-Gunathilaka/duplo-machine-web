import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import classes from './ViewCustomer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepBackward, faFastBackward, faStepForward, faFastForward, faSort, faSortAlphaDown, faSortAlphaUp, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'
// import "react-datetime/css/react-datetime.css";
import { Col, Container, InputGroup, FormControl, Modal, Row, Table } from 'react-bootstrap';
import { faEdit, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Popup } from 'semantic-ui-react';
import PopupMessage from '../../PopupMessages/PopupMessages';
import CreateCustomer from '../CreateCustomer/CreateCustomer';
import EditCustomer from '../EditCustomer/EditCustomer';
import SpinnerAnimation from '../../../components/UI/Spinner/SpinnerAnimation/SpinnerAnimation';
// import * as CustomerService from '../../../../api/methods/Customers';
// import * as TokenDecode from '../../../../helpers/TokenDecode';
import noContent from '../../../assets/images/no-contents.svg';
import axios from 'axios';
import { BASE_URL } from '../../../API/ApiCore';
import ActiveDeactiveConfirmPopup from '../../PopupMessages/ActiveDeactiveConfirmPopUp/ActiveDeactiveConfirmPopup'


let rolePermission = [];
let params = {};
class ViewCustomer extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      customers: [],
      currentPage: 1,
      customersPerPage: 8,
      faProductIconHandler: false,
      searchFilter: "",
      customersLength: 0,
      createCustomerShowHide: false,
      editCustomerShowHide: false,
      resultFetched: false,
      isDescending: true,
      sortBy: "id",

      activeDeactiveMessage: "",
      popupMessage: "",
      popUpActiveDeActive: false,
      customerObj: {}
    }
  }

  componentDidMount = async () => {
    // rolePermission = TokenDecode.getUserRolePermission();
    await this.getResponse();
  }

  getResponse = async () => {
    try {
      const customer = await axios.get(BASE_URL+"/v1/customers");
      await this.setState({
        customers: customer.data
      })
      console.log(this.state.customers, "ttttt")
    } catch (error) {
      console.log(error);
    }
  }
  setParams = () => {
    if (this.state.searchFilter !== "") {
      params = {
        name: this.state.searchFilter,
        page: this.state.currentPage - 1,
        size: this.state.customersPerPage,
        sortBy: this.state.sortBy,
        isDescending: this.state.isDescending
      }
    } else {
      params = {
        page: this.state.currentPage - 1,
        size: this.state.customersPerPage,
        sortBy: this.state.sortBy,
        isDescending: this.state.isDescending
      }
    }
  }

  onActiveHandler = async (customer) => {
    const data = {
      "id": customer.id,
      "first_name": customer.first_name,
      "last_name": customer.last_name,
      "address": customer.address,
      "mobile_number": customer.mobile_number,
      "email": customer.email,
      "customer_type": customer.customer_type,
      "active_status": customer.active_status === 0 ? 1 : 0,
    };
    await this.setState({
      customerObj: data,
      messageType: customer.active_status === 1 ? "deactivate" : "activate",
      activeDeactiveMessage: customer.active_status === 1 ? "Do you want to deactivate this Customer?" : "Do you want to activate this Customer?",
      popUpActiveDeActive: !this.state.popUpActiveDeActive
    });

  }

  closeActiveDeActivePopup = async () => {
    await this.setState({
      popUpActiveDeActive: false
    });
  }

  onActiveDeActiveHandler = async () => {
    const { customerObj } = this.state
    await this.closeActiveDeActivePopup();
    const customerRes = await axios.put(BASE_URL + "/v1/customers/" + customerObj.id, customerObj);
    console.log(customerRes, "customerRes")
    if (customerRes.status === 200 || customerRes.status === 201) {
      await this.setState({
        popupMessage: customerObj.active_status === 0 ? "Customer Deactivated successfully" : "Customer activated successfully",
        messageType: "success"
      })
      await this.showPopup();
      await this.getResponse();
    } else {
      await this.setState({
        popupMessage: "Error occurred",
        messageType: "error"
      })
      await this.showPopup();
    }

  }

  showPopup = async () => {
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

  //   exporToExecelHandler = async () => {
  //     const downloadData = await CustomerService.downloadCustomers();
  //     const url = window.URL.createObjectURL(new Blob([downloadData]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'customers.xlsx');
  //     document.body.appendChild(link);
  //     link.click();

  //   }

  compareByAsc(key) {
    return function (a, b) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    };
  }

  compareByDesc(key) {
    return function (a, b) {
      if (a[key] < b[key]) return 1;
      if (a[key] > b[key]) return -1;
      return 0;
    };
  }

  sortBy = async (key) => {
    await this.setState({
      sortBy: key,
      isDescending: !this.state.isDescending,
      currentPage: 1
    });
    await this.getResponse();
  }



  firstPage = async () => {

    if (this.state.currentPage > 1) {
      await this.setState({
        currentPage: 1
      })
    }
    await this.getResponse();
  }

  prevPage = async () => {

    if (this.state.currentPage > 1) {
      await this.setState({
        currentPage: this.state.currentPage - 1
      })
    }
    await this.getResponse();
  }

  lastPage = async () => {
    if (this.state.currentPage < Math.ceil(this.state.customersLength / this.state.customersPerPage)) {
      await this.setState({
        currentPage: Math.ceil(this.state.customersLength / this.state.customersPerPage)
      })
    }
    await this.getResponse();
  }

  nextPage = async () => {
    if (this.state.currentPage < Math.ceil(this.state.customersLength / this.state.customersPerPage)) {
      await this.setState({
        currentPage: this.state.currentPage + 1
      })
    }
    await this.getResponse();
  }

  pagesPerPageHandler = async (e) => {
    await this.setState({
      customersPerPage: e.target.value,
      currentPage: 1
    });
    await this.getResponse();
  }

  searchEventsHandler = async (title, name) => {
    await this.setState({
      [name]: title.toLowerCase(),
      resultFetched: false,
      currentPage: 1,
      sortBy: "id",
      isDescending: true,
    });
    await this.getResponse();
  }

  action = (id) => {
    return (
      <div>
        <Popup trigger={<FontAwesomeIcon icon={faEllipsisV} size="x" />} flowing hoverable position='bottom right'>
          <div className={classes.popUpAction} onClick={() => {
            this.props.SelectCustomerId(id);
            this.handleEditCustomerModalShowHide();
          }} >
            &nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faEdit} size="x" />|&nbsp;&nbsp;&nbsp;&nbsp;
            <label>Edit</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </Popup>
      </div>
    );
  }

  handleCreateCustomerModalShowHide = () => {
    this.setState({
      createCustomerShowHide: !this.state.createCustomerShowHide
    });
  }

  handleEditCustomerModalShowHide = () => {
    this.setState({
      editCustomerShowHide: !this.state.editCustomerShowHide
    });
  }

  render() {
    const { customers, currentPage, customersPerPage, faProductIconHandler, customersLength, resultFetched } = this.state;
    let currentCustomers = customers;
    console.log(this.state, "state in render");

    return (
      <div className={classes.MainPanel}>
      <div className={classes.ContentWrapper}>

        <Container fluid>
          <Row>
            <div style={{ marginTop: '1%' }}></div>
          </Row>
          <Row style={{ height: "4rem" }}>
            <Col style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", fontSize: "2rem" }}>
              <label className={classes.pageTitleContainer}>View Customer</label>
            </Col>
            <Col style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <input name="searchFilter" placeholder="Search by Customer Name" className={classes.searchIconText} onChange={(e) => this.searchEventsHandler(e.target.value, e.target.name)} />
            </Col>
            <Col md="auto" xl="auto" lg="auto" xs="auto" sm="auto" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <button className={classes.customButtonForView} onClick={() => this.handleCreateCustomerModalShowHide()}>Add Customer</button>
            </Col>
          </Row>
          <Row className={classes.responsiveHide} style={{ marginTop: '1%' }}>
            <Col style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", fontSize: "1.1rem", fontWeight: "bold" }}>
            </Col>
            <Col style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {/* {rolePermission?.includes("CUSTOMERS_EXPORT") ? <img src="/images/xlsx-file-format-extension.svg" className={classes.buttonPagination} onClick={this.exporToExecelHandler} style={{ width: '1.5rem', cursor: 'pointer' }} /> : ""} */}
            </Col>
          </Row>
          <Row>
            <Col>
              {this.state.customers?.length === 0 && !resultFetched ?
                <div>
                  <p><SpinnerAnimation /></p>
                </div> :
                <Table hover responsive>
                  <thead >
                    <tr>
                      <th style={{ minWidth: "150px", verticalAlign: "initial" }} className={classes.thBtnStart} onClick={() => this.sortBy("customerCode")} >ID <FontAwesomeIcon icon={faSort} /></th>
                      <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("firstName")}>Name <FontAwesomeIcon icon={faProductIconHandler === true ? faSortAlphaUp : faSortAlphaDown} /></th>
                      {/* <th className={classes.thBtn} onClick={() => this.sortBy("last_name")}>Last Name <FontAwesomeIcon icon={faProductIconHandler === true ? faSortAlphaUp : faSortAlphaDown} /></th> */}
                      <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("address")}>Address<FontAwesomeIcon icon={faProductIconHandler === true ? faSortAlphaUp : faSortAlphaDown} /></th>
                      <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("email")}>E-mail <FontAwesomeIcon icon={faProductIconHandler === true ? faSortAlphaUp : faSortAlphaDown} /></th>
                      <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("mobileNumber")}>Mobile Number<FontAwesomeIcon icon={faSort} /></th>
                      <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("creditLimit")}>Customer Type<FontAwesomeIcon icon={faSort} /></th>
                      <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("activeStatus")}> Status <FontAwesomeIcon icon={faSort} /></th>
                      <th className={classes.thBtnEnd}></th>
                    </tr>
                  </thead>
                  <tbody className={classes.tbody}>
                    {currentCustomers?.length === 0 ?
                      <tr align="center">
                        <td colSpan="12">
                          <img width="50px" height="50px" src={noContent} />
                          <br />
                          <b>No Customers Found</b>
                        </td>
                      </tr>
                      : currentCustomers.map((s, i) => (
                        <tr key={s.id} >
                          <td style={{ cursor: "default" }} className={(currentCustomers.length === i + 1) ? classes.tdLastStart : classes.tdCenter}>{s.id ? s.id : "-"}</td>
                          <td className={classes.tdProductName} onClick={() => {
                            this.props.SelectCustomerId(s.id);
                            this.handleEditCustomerModalShowHide();
                          }}>{s.last_name ? s.first_name + " " + s.last_name : s.first_name}</td>
                          <td style={{ cursor: "default" }} className={classes.tdStart}>{s.address ? (s.address.length > 15 ? s.address.substring(0, 15).concat("...") : s.address) : "-"}</td>
                          <td style={{ cursor: "default" }} className={classes.tdStart}>{s.email ? (s.email.length > 12 ? s.email.substring(0, 12).concat("...") : s.email) : "-"}</td>
                          <td style={{ cursor: "default" }} className={classes.tdStart}>{s.mobile_number ? s.mobile_number : "-"}</td>
                          <td style={{ cursor: "default" }} className={classes.tdStart}>{s.customer_type ? s.customer_type : "-"}</td>
                          <td style={{ cursor: "pointer" }} className={classes.tdCenter}>
                            <FontAwesomeIcon onClick={() => this.onActiveHandler(s)} className={classes.toggle} icon={s.active_status === 0 ? faToggleOff : faToggleOn} size="2x" />
                          </td>
                          <td className={(currentCustomers.length === i + 1) ? classes.tdLastEnd : classes.tdCenter}>
                            {/* {this.action(s.id)} */}
                            <FontAwesomeIcon className={classes.toggle} style={{ cursor: "pointer" }} icon={faEdit} size="x"
                              onClick={() => {
                                this.props.SelectCustomerId(s.id);
                                this.handleEditCustomerModalShowHide();
                              }}
                            />
                          </td>
                        </tr>

                      ))}
                  </tbody>
                </Table>
              }
            </Col>
          </Row>

          <Modal show={this.state.createCustomerShowHide} centered size="lg" onHide={() => this.handleCreateCustomerModalShowHide()} backdrop="static" keyboard={false}>
            <Modal.Header closeButton >
              <Modal.Title>Create Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body><CreateCustomer
              handleClose={() => this.handleCreateCustomerModalShowHide()}
              handleGetResponse={() => this.getResponse()}
            />
            </Modal.Body>
          </Modal>

          <Modal show={this.state.editCustomerShowHide} centered size="lg" onHide={() => this.handleEditCustomerModalShowHide()} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body><EditCustomer
              handleClose={() => this.handleEditCustomerModalShowHide()}
              handleGetResponse={() => this.getResponse()} /></Modal.Body>
          </Modal>

          <div>
            <Modal show={this.state.popUpTrue} centered size="sm">
              <Modal.Body><PopupMessage
                handleClose={() => this.showPopup()}
                message={this.state.popupMessage}
                messageType={this.state.messageType}
              /></Modal.Body>
            </Modal>

            <Modal show={this.state.popUpActiveDeActive} centered size="sm">
              <Modal.Body><ActiveDeactiveConfirmPopup
                message={this.state.activeDeactiveMessage}
                messageType={this.state.messageType}
                handleClose={() => this.closeActiveDeActivePopup()}
                confirmDeactivationHandler={() => this.onActiveDeActiveHandler()}
                confirmActivationHandler={() => this.onActiveDeActiveHandler()}
              /></Modal.Body>
            </Modal>
          </div>

        </Container>
      </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SelectCustomerId: (customerId) => dispatch(actions.SelectCustomerId(customerId))
  };
};

export default connect(null, mapDispatchToProps)(ViewCustomer);
// export default ViewCustomer;