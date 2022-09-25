import React, { Component } from 'react';
import classes from './CreatePaperItem.module.css';
import PopupMessage from '../../PopupMessages/PopupMessages';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import { BASE_URL } from '../../../API/ApiCore';

var paperCost;
class CreatePaperItem extends Component {

  constructor() {
    super();

    this.state = {
      page_name: '',
      popUpTrue: false,
      popupMessage: "",
      messageType: "",
      saveButton: false,
      paperSizes: [],
      paperGsms: [],
      paper_size_id: '',
      paper_size_name: '',
      paper_gsm_id: '',
      paper_gsm_name:'',
      papers_per_rim: null,
      price_of_rim: null
    }
  }

  componentDidMount = async () => {
    // get paper sizes
    try {
      const paperSizes = await axios.get(BASE_URL + "/v1/paper-sizes");
      await this.setState({
        paperSizes: paperSizes.data
      })
      console.log(this.state.paperSizes, "ttttt")
    } catch (error) {
      console.log(error);
    }
    // get paper gsm
    try {
      const paperGsms = await axios.get(BASE_URL + "v1/paper-gsm");
      await this.setState({
        paperGsms: paperGsms.data
      })
      console.log(this.state.paperGsms, "ttttt")
    } catch (error) {
      console.log(error);
    }
  };

  onInputChange = async (e) => {
    await this.setState({[e.target.name]:e.target.value});
    console.log(this.state.page_gsm,"page_gsm")
  
};

  onPaperSizeSelectHandler = async (e) => {
    console.log(e.target.value);
    await this.setState({ 
      paper_size_id: e.target.value.split(",")[0], 
      paper_size_name: e.target.value.split(",")[1]
    
    });
    console.log(this.state.paper_size_id)
    console.log(this.state.paper_size_name)
  };

  onPaperGsmSelectHandler = async (e) => {
    console.log(e.target.value);
    await this.setState({ 
      paper_gsm_id: e.target.value.split(",")[0], 
      paper_gsm_name: e.target.value.split(",")[1]
    
    });
    console.log(this.state.paper_gsm_id)
    console.log(this.state.paper_gsm_name)
  };

  saveButtonHandler = async (event) => {

    event.preventDefault();

      let postData = {
        "paper_item_id": {
          "paper_gsm_id": {
            "id": this.state.paper_gsm_id
          },
          "paper_size_id": {
            "id": this.state.paper_size_id
          }
        },
        "paper_item_name": this.state.paper_size_name+" "+this.state.paper_gsm_name,
        "price_of_rim": this.state.price_of_rim,
        "papers_per_rim": this.state.papers_per_rim,
        "paper_cost":paperCost
      }

      console.log(postData, "postData")
      const paperItems = await axios.post(BASE_URL + "/v1/paper-items", postData);
      if (paperItems?.status == 201 || paperItems?.status == 200) {
        await this.popUpTypeSuccess();
        await this.showPopupSuccess();
        await this.props.handleGetResponse();

      } else {
        await this.popUpTypeError();
        await this.showPopupError();

      }
      console.log("paperItems", paperItems)


  }

  viewButtonHandler = async (event) => {
    await this.props.handleClose();
  }

  popUpTypeSuccess = async () => {
    await this.setState({
      popupMessage: "Paper Item created successfully",
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

    paperCost = (this.state.price_of_rim != null && this.state.papers_per_rim != null) ? parseFloat(this.state.price_of_rim / this.state.papers_per_rim).toFixed(2) : "-";

    return (
      <div className={classes.MainPanel}>
        <div className={classes.ContentWrapper}>

          <h5>Paper Item Details</h5>
          <hr />


          <div className={classes.ContentWrapper}>
            <Row>

              <Col>
                <label><h6>Paper Size</h6></label>
                <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"paper_size_id"} onChange={(e) => this.onPaperSizeSelectHandler(e)}>
                  <option selected>Select the Paper Size...</option>
                  {this.state.paperSizes.map((paperSize) => {
                    return <option value={paperSize.id+","+paperSize.page_name} label={paperSize.page_name} />
                  })}
                </select>
                <br />
              </Col>

              <Col>
                <label><h6>Paper GSM</h6></label>
                <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"paper_gsm_id"} onChange={(e) => this.onPaperGsmSelectHandler(e)}>
                  <option selected>Select the Paper GSM...</option>
                  {this.state.paperGsms.map((paperGsm) => {
                    return <option value={paperGsm.id+","+paperGsm.page_gsm} label={paperGsm.page_gsm} />
                  })}
                </select>
              </Col>
            </Row>
            <div className={classes.header}>
              <Row>
                <Col>
                  <label><h6><a style={{ color: 'red' }}>* </a>Price of Rim</h6></label>
                  <input
                    className={classes.searchIconText}
                    type="text"
                    name="price_of_rim"
                    value={this.state.price_of_rim}
                    onChange={this.onInputChange} />
                  <br />
                </Col>

                <Col>
                  <label><h6><a style={{ color: 'red' }}>* </a>Papers per Rim</h6></label>
                  <input
                    className={classes.searchIconText}
                    type="text"
                    name="papers_per_rim"
                    value={this.state.papers_per_rim}
                    onChange={this.onInputChange} />
                  <br />
                </Col>


              </Row>
              <Row>
                <Col>
                  <label><h6>Paper cost</h6></label>
                  <input
                    className={classes.searchIconText}
                    type="text"
                    name="paper_cost"
                    value={paperCost} />
                  <br />
                </Col>
                <Col></Col>
              </Row>


            </div>
          </div>

          <br></br>

          <div className={classes.ContentWrapper}>
            <div className="row justify-content-end">
              <Button variant="outline-dark" size="sm" onClick={this.viewButtonHandler}>Cancel</Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button variant="dark" size="sm" onClick={this.saveButtonHandler} disabled={this.state.paper_size_id == '' || this.state.paper_gsm_id == ''}>Save</Button>&nbsp;&nbsp;&nbsp;&nbsp;
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

export default CreatePaperItem;
