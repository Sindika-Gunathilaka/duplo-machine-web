import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import classes from './ViewPaperGsm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepBackward, faFastBackward, faStepForward, faFastForward, faSort, faSortAlphaDown, faSortAlphaUp, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'
// import "react-datetime/css/react-datetime.css";
import { Col, Container, InputGroup, FormControl, Modal, Row, Table } from 'react-bootstrap';
import { faEdit, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Popup } from 'semantic-ui-react';
import PopupMessage from '../../PopupMessages/PopupMessages';
import CreatePaperGsm from '../CreatePaperGsm/CreatePaperGsm';
import EditPaperGsm from '../EditPaperGsm/EditPaperGsm';
import { BASE_URL } from '../../../API/ApiCore';
import SpinnerAnimation from '../../../components/UI/Spinner/SpinnerAnimation/SpinnerAnimation';
// import * as CustomerService from '../../../../api/methods/Customers';
// import * as TokenDecode from '../../../../helpers/TokenDecode';
import noContent from '../../../assets/images/no-contents.svg';
import axios from 'axios';
import ActiveDeactiveConfirmPopup from '../../PopupMessages/ActiveDeactiveConfirmPopUp/ActiveDeactiveConfirmPopup'


class ViewPaperGsm extends Component {
  constructor() {
    super();
    this.state = {
      paperGsms: [],
      currentPage: 1,
      paperGsmsPerPage: 8,
      faProductIconHandler: false,
      searchFilter: "",
      paperGsmsLength: 0,
      createpaperGsmshowHide: false,
      editPaperSizeShowHide: false,
      resultFetched: false,
      isDescending: true,
      sortBy: "id",

      activeDeactiveMessage: "",
      popupMessage: "",
      popUpActiveDeActive: false,
      pageGsmObj: {}
    }
  }

  componentDidMount = async () => {
    // rolePermission = TokenDecode.getUserRolePermission();
    await this.getResponse();
  }

  getResponse = async () => {
    try {
      const paperGsms = await axios.get(BASE_URL+"/v1/paper-gsm");
      await this.setState({
        paperGsms: paperGsms.data
      })
      console.log(this.state.paperGsms, "ttttt")
    } catch (error) {
      console.log(error);
    }
  }
//   setParams = () => {
//     if (this.state.searchFilter !== "") {
//       params = {
//         name: this.state.searchFilter,
//         page: this.state.currentPage - 1,
//         size: this.state.paperGsmsPerPage,
//         sortBy: this.state.sortBy,
//         isDescending: this.state.isDescending
//       }
//     } else {
//       params = {
//         page: this.state.currentPage - 1,
//         size: this.state.paperGsmsPerPage,
//         sortBy: this.state.sortBy,
//         isDescending: this.state.isDescending
//       }
//     }
//   }

  onActiveHandler = async (pageGsm) => {
    const data = {
      "id": pageGsm.id,
      "page_gsm": pageGsm.page_gsm,
      "active_status": pageGsm.active_status === false ? true : false,
    };
    await this.setState({
      pageGsmObj: data,
      messageType: pageGsm.active_status === true ? "deactivate" : "activate",
      activeDeactiveMessage: pageGsm.active_status === true ? "Do you want to deactivate this paper GSM?" : "Do you want to activate this paper GSM?",
      popUpActiveDeActive: !this.state.popUpActiveDeActive
    });

  }

  closeActiveDeActivePopup = async () => {
    await this.setState({
      popUpActiveDeActive: false
    });
  }

  onActiveDeActiveHandler = async () => {
    const { pageGsmObj } = this.state
    await this.closeActiveDeActivePopup();
    const pageGsmRes = await axios.put(BASE_URL + "/v1/paper-gsm/" + pageGsmObj.id, pageGsmObj);
    console.log(pageGsmRes, "pageGsmRes")
    if (pageGsmRes.status === 200 || pageGsmRes.status === 201) {
      await this.setState({
        popupMessage: pageGsmObj.active_status === false ? "Paper GSM Deactivated successfully" : "Paper GSM activated successfully",
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
    if (this.state.currentPage < Math.ceil(this.state.paperGsmsLength / this.state.paperGsmsPerPage)) {
      await this.setState({
        currentPage: Math.ceil(this.state.paperGsmsLength / this.state.paperGsmsPerPage)
      })
    }
    await this.getResponse();
  }

  nextPage = async () => {
    if (this.state.currentPage < Math.ceil(this.state.paperGsmsLength / this.state.paperGsmsPerPage)) {
      await this.setState({
        currentPage: this.state.currentPage + 1
      })
    }
    await this.getResponse();
  }

  pagesPerPageHandler = async (e) => {
    await this.setState({
      paperGsmsPerPage: e.target.value,
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
            this.handleEditPageGsmModalShowHide();
          }} >
            &nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faEdit} size="x" />|&nbsp;&nbsp;&nbsp;&nbsp;
            <label>Edit</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </Popup>
      </div>
    );
  }

  handleCreatePageGSMModalShowHide = () => {
    this.setState({
      createPaperGSMShowHide: !this.state.createPaperGSMShowHide
    });
  }

  handleEditPageGsmModalShowHide = () => {
    this.setState({
      editPaperSizeShowHide: !this.state.editPaperSizeShowHide
    });
  }

  render() {
    const { paperGsms, currentPage, paperGsmsPerPage, faProductIconHandler, paperGsmsLength, resultFetched } = this.state;
    let currentpaperGsms = paperGsms;
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
              <label className={classes.pageTitleContainer}>View Paper GSM</label>
            </Col>
            <Col style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <input name="searchFilter" placeholder="Search by Page Size Name" className={classes.searchIconText} onChange={(e) => this.searchEventsHandler(e.target.value, e.target.name)} />
            </Col>
            <Col md="auto" xl="auto" lg="auto" xs="auto" sm="auto" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <button className={classes.customButtonForView} onClick={() => this.handleCreatePageGSMModalShowHide()}>Add Page GSM</button>
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
              {this.state.paperGsms?.length === 0 && !resultFetched ?
                <div>
                  <p><SpinnerAnimation /></p>
                </div> :
                <Table hover responsive>
                  <thead >
                    <tr>
                      <th style={{ minWidth: "150px", verticalAlign: "initial" }} className={classes.thBtnStart} onClick={() => this.sortBy("customerCode")} >ID <FontAwesomeIcon icon={faSort} /></th>
                      <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("firstName")}>Name <FontAwesomeIcon icon={faProductIconHandler === true ? faSortAlphaUp : faSortAlphaDown} /></th>
                      <th style={{ verticalAlign: "initial" }} className={classes.thBtn} onClick={() => this.sortBy("activeStatus")}> Status <FontAwesomeIcon icon={faSort} /></th>
                      <th className={classes.thBtnEnd}></th>
                    </tr>
                  </thead>
                  <tbody className={classes.tbody}>
                    {currentpaperGsms?.length === 0 ?
                      <tr align="center">
                        <td colSpan="12">
                          <img width="50px" height="50px" src={noContent} />
                          <br />
                          <b>No paper GSM Found</b>
                        </td>
                      </tr>
                      : currentpaperGsms.map((s, i) => (
                        <tr key={s.id} >
                          <td style={{ cursor: "default" }} className={(currentpaperGsms.length === i + 1) ? classes.tdLastStart : classes.tdCenter}>{s.id ? s.id : "-"}</td>
                          <td className={classes.tdProductName} onClick={() => {
                            this.props.SelectPaperGsmId(s.id);
                            this.handleEditPageGsmModalShowHide();
                          }}>{s.page_gsm ? s.page_gsm : "-"}</td>
                          <td style={{ cursor: "pointer" }} className={classes.tdStart}>
                            <FontAwesomeIcon onClick={() => this.onActiveHandler(s)} className={classes.toggle} icon={s.active_status === false ? faToggleOff : faToggleOn} size="2x" />
                          </td>
                          <td className={(currentpaperGsms.length === i + 1) ? classes.tdLastEnd : classes.tdCenter}>
                            {/* {this.action(s.id)} */}
                            <FontAwesomeIcon className={classes.toggle} style={{ cursor: "pointer" }} icon={faEdit} size="x"
                              onClick={() => {
                                this.props.SelectPaperGsmId(s.id);
                                this.handleEditPageGsmModalShowHide();
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

          <Modal show={this.state.createPaperGSMShowHide} centered size="lg" onHide={() => this.handleCreatePageGSMModalShowHide()} backdrop="static" keyboard={false}>
            <Modal.Header closeButton >
              <Modal.Title>Create Page GSM</Modal.Title>
            </Modal.Header>
            <Modal.Body><CreatePaperGsm
              handleClose={() => this.handleCreatePageGSMModalShowHide()}
              handleGetResponse={() => this.getResponse()}
            />
            </Modal.Body>
          </Modal>

          <Modal show={this.state.editPaperSizeShowHide} centered size="lg" onHide={() => this.handleEditPageGsmModalShowHide()} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Page Size</Modal.Title>
            </Modal.Header>
            <Modal.Body><EditPaperGsm
              handleClose={() => this.handleEditPageGsmModalShowHide()}
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
    SelectPaperGsmId: (customerId) => dispatch(actions.SelectPaperGsmId(customerId))
  };
};

export default connect(null, mapDispatchToProps)(ViewPaperGsm);