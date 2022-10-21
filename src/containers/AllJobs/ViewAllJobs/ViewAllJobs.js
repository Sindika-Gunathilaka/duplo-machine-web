import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import classes from './ViewAllJobs.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepBackward, faFastBackward, faStepForward, faFastForward, faSort, faSortAlphaDown, faSortAlphaUp, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'
// import "react-datetime/css/react-datetime.css";
import { Col, Container, InputGroup, FormControl, Modal, Row, Table } from 'react-bootstrap';
import { faEdit, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Popup } from 'semantic-ui-react';
import PopupMessage from '../../PopupMessages/PopupMessages';
import CreateAllJobs from '../CreateAllJobs/CreateAllJobs';
import EditAllJobs from '../EditAllJobs/EditAllJobs';
import SpinnerAnimation from '../../../components/UI/Spinner/SpinnerAnimation/SpinnerAnimation';
// import * as CustomerService from '../../../../api/methods/Customers';
// import * as TokenDecode from '../../../../helpers/TokenDecode';
import noContent from '../../../assets/images/no-contents.svg';
import axios from 'axios';
import { BASE_URL } from '../../../API/ApiCore';
import ActiveDeactiveConfirmPopup from '../../PopupMessages/ActiveDeactiveConfirmPopUp/ActiveDeactiveConfirmPopup'


let rolePermission = [];
let params = {};
class ViewAllJobs extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      allJobs: [],
      currentPage: 1,
      allJobsPerPage: 8,
      faProductIconHandler: false,
      searchFilter: "",
      allJobsLength: 0,
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
      await this.setParams();
      const customer = await axios.get(BASE_URL + "/v1/all_jobs", {
        params: {
          customer_name: this.state.searchFilter,
          page: this.state.currentPage - 1,
          size: this.state.allJobsPerPage
        }
      });
      await this.setState({
        allJobs: customer.data.allJobsList,
        allJobsLength: customer.data.count,
      })
      console.log(this.state.allJobs, "ttttt")
    } catch (error) {
      console.log(error);
    }
  }

  setParams = () => {
    if (this.state.searchFilter !== "") {
      params = {
        customer_name: this.state.searchFilter,
        page: this.state.currentPage - 1,
        size: this.state.allJobsPerPage
      }
    } else {
      params = {
        page: this.state.currentPage - 1,
        size: this.state.allJobsPerPage
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
    if (this.state.currentPage < Math.ceil(this.state.allJobsLength / this.state.allJobsPerPage)) {
      await this.setState({
        currentPage: Math.ceil(this.state.allJobsLength / this.state.allJobsPerPage)
      })
    }
    await this.getResponse();
  }

  nextPage = async () => {
    if (this.state.currentPage < Math.ceil(this.state.allJobsLength / this.state.allJobsPerPage)) {
      await this.setState({
        currentPage: this.state.currentPage + 1
      })
    }
    await this.getResponse();
  }

  pagesPerPageHandler = async (e) => {
    await this.setState({
      allJobsPerPage: e.target.value,
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
            this.props.SelectAllJobsId(id);
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
    const { allJobs, currentPage, allJobsPerPage, faProductIconHandler, allJobsLength, resultFetched } = this.state;
    let currentCustomers = allJobs;
    const totalPages = Math.ceil(allJobsLength / allJobsPerPage);
    console.log("totalPages", totalPages);
    console.log(this.state, "state in render");

    return (
      <div className={classes.MainPanel}>
        <div style={{ fontSize: "18px", paddingTop: "10px", paddingBottom: "25px" }}>
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand mb-0 h1" href="#">DARIMAC DIGITAL</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div class="navbar-nav">
                <a class="nav-item nav-link active" href="/view-customer">Customers</a>
                <a class="nav-item nav-link active" href="/view-all-jobs">All Jobs</a>
                <a class="nav-item nav-link active" href="/view-paper-size">Paper Size</a>
                <a class="nav-item nav-link active" href="/view-paper-gsm">Paper GSM</a>
                <a class="nav-item nav-link active" href="/view-paper-item">Paper Item</a>
                <a class="nav-item nav-link active" href="/view-job">Duplo</a>
              </div>
            </div>
          </nav>
        </div>
        <div className={classes.ContentWrapper}>

          <Container fluid>

            <Row>
              <div style={{ marginTop: '1%' }}></div>
            </Row>
            <Row style={{ height: "4rem" }}>
              <Col style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", fontSize: "2rem" }}>
                <label className={classes.pageTitleContainer}>View All Jobs</label>
              </Col>
              <Col style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <input name="searchFilter" placeholder="Search by Customer Name" className={classes.searchIconText} onChange={(e) => this.searchEventsHandler(e.target.value, e.target.name)} />
              </Col>
              <Col md="auto" xl="auto" lg="auto" xs="auto" sm="auto" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <button className={classes.customButtonForView} onClick={() => this.handleCreateCustomerModalShowHide()}>Add General Job</button>
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
                {this.state.allJobs?.length === 0 && !resultFetched ?
                  <div>
                    <p><SpinnerAnimation /></p>
                  </div> :
                  <Table hover responsive>
                    <thead >
                      <tr>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtnStart} onClick={() => this.sortBy("firstName")}>Job Type </th>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("address")}>Customer</th>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("customerCode")} >Quantity</th>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("address")}>Job Status</th>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("email")}>Job Date </th>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("mobileNumber")}>Job Description</th>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("creditLimit")}>Job payment</th>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("customerCode")} >Payment Mode</th>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("activeStatus")}> Payed amount </th>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("activeStatus")}> Due Amount</th>
                        <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("activeStatus")}> Payment status</th>
                        <th className={classes.thBtnEnd}></th>
                      </tr>
                    </thead>
                    <tbody className={classes.tbody}>
                      {currentCustomers?.length === 0 ?
                        <tr align="center">
                          <td colSpan="12">
                            <img width="50px" height="50px" src={noContent} />
                            <br />
                            <b>No Jobs Found</b>
                          </td>
                        </tr>
                        : currentCustomers.map((s, i) => (
                          <tr key={s.id} >
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.job_type ? s.job_type : ""}</td>
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.customer.first_name ? s.customer.first_name : ""}</td>
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.quantity ? s.quantity : "-"}</td>
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.job_status ? s.job_status : "-"}</td>
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.job_date ? s.job_date : "-"}</td>
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.job_description ? (s.job_description.length > 12 ? s.job_description.substring(0, 12).concat("...") : s.job_description) : "-"}</td>
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.job_payment ? s.job_payment : "-"}</td>
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.payment_mode ? s.payment_mode : "-"}</td>
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.payed_amount ? s.payed_amount : "-"}</td>
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.due_payment ? s.due_payment : "-"}</td>
                            <td style={{ cursor: "default" }} className={classes.tdStart}>{s.payment_status ? s.payment_status : "-"}</td>
                            <td className={(currentCustomers.length === i + 1) ? classes.tdLastEnd : classes.tdCenter}>
                              {/* {this.action(s.id)} */}
                              <FontAwesomeIcon className={classes.toggle} style={{ cursor: "pointer" }} icon={faEdit} size="x"
                                onClick={() => {
                                  this.props.SelectAllJobsId(s.id);
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
            <Row style={{ height: "4rem" }} >
              <Col md={2} xl={4} lg={4} xs={2} sm={2} style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", fontSize: "0.8rem" }} >
                <div className={classes.perPageContainer}>
                  <label style={{ margin: "0px", color: "white" }}> Per Page  </label>
                  <select style={{ cursor: "pointer" }} className={classes.perPage} name="size" id="size" onChange={this.pagesPerPageHandler.bind(this)} >
                    <option label="8" value="8" />
                    <option disabled={allJobsLength >= 20 ? false : true} label="20" value="20" />
                    <option disabled={allJobsLength >= 50 ? false : true} label="50" value="50" />
                    <option disabled={allJobsLength >= 100 ? false : true} label="100" value="100" />
                  </select>
                </div>
              </Col>
              <Col md={2} xl={4} lg={4} xs={2} sm={2} style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.8rem", color: "white" }} >
                <label className={classes.showingPageContainer}>
                  {(allJobsLength !== 0) ?
                    <>Showing Page {currentPage} of {Math.ceil(totalPages) ? Math.ceil(totalPages) : "Calculating..."}</>
                    : <></>
                  }
                </label>
              </Col>
              <Col md={8} xl={4} lg={4} xs={8} sm={8} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", fontSize: "0.8rem" }} >
                <div className={classes.paginationContainer}>
                  <InputGroup size="sm">
                    <div class="input-group-prepend">
                      <button className={classes.buttonPagination} disabled={currentPage === 1 ? true : false} onClick={this.firstPage}>
                        <FontAwesomeIcon icon={faFastBackward} />&nbsp;First
                      </button>
                      <button className={classes.buttonPagination} disabled={currentPage === 1 ? true : false} onClick={this.prevPage} >
                        <FontAwesomeIcon icon={faStepBackward} />&nbsp;Prev
                      </button>
                    </div>
                    <FormControl style={{ borderRadius: '8px' }} className={classes.buttonPaginationNumber} name="currentPage" value={currentPage} disabled />
                    <div class="input-group-append">
                      <button className={classes.buttonPagination}
                        disabled={(currentPage === totalPages || (resultFetched && allJobsLength === 0)) ? true : false}
                        onClick={this.nextPage} >
                        <FontAwesomeIcon icon={faStepForward} />&nbsp;Next
                      </button>
                      <button className={classes.buttonPagination}
                        disabled={(currentPage === totalPages || (resultFetched && allJobsLength === 0)) ? true : false}
                        onClick={this.lastPage} >
                        <FontAwesomeIcon icon={faFastForward} />&nbsp;Last
                      </button>
                    </div>
                  </InputGroup>
                </div>
              </Col>
            </Row>
            <Modal show={this.state.createCustomerShowHide} centered size="lg" onHide={() => this.handleCreateCustomerModalShowHide()} backdrop="static" keyboard={false}>
              <Modal.Header closeButton >
                <Modal.Title>Create All Jobs</Modal.Title>
              </Modal.Header>
              <Modal.Body><CreateAllJobs
                handleClose={() => this.handleCreateCustomerModalShowHide()}
                handleGetResponse={() => this.getResponse()}
              />
              </Modal.Body>
            </Modal>

            <Modal show={this.state.editCustomerShowHide} centered size="lg" onHide={() => this.handleEditCustomerModalShowHide()} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Edit All Jobs</Modal.Title>
              </Modal.Header>
              <Modal.Body><EditAllJobs
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
    SelectAllJobsId: (allJobsId) => dispatch(actions.SelectAllJobsId(allJobsId))
  };
};

export default connect(null, mapDispatchToProps)(ViewAllJobs);