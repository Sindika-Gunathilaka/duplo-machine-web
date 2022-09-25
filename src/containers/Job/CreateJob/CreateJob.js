import React, { Component } from 'react';
import classes from './CreateJob.module.css';
import PopupMessage from '../../PopupMessages/PopupMessages';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { BASE_URL } from '../../../API/ApiCore';
import DatePicker from "react-datepicker";
import axios from 'axios';

var total_charge;
var paper_profit;
var total_profit;
class CreateJob extends Component {

    constructor() {
        super();

        this.state = {
            page_name: '',
            popUpTrue: false,
            popupMessage: "",
            messageType: "",
            saveButton: false,
            customers: [],
            paperItems: [],
            selected_paper_item_name: '',
            selected_paper_cost: '',
            selectedCustomer: '',
            ink_cost: 0.25,
            master_cost: 25.00,
            selected_paper_side: "SINGLE",
            number_of_pages: 100,
            total_cost: '',
            paper_charge: '',
            selected_job_status: '',
            paper_side_multiplier:1
        }
    }

    componentDidMount = async () => {
        //   get customers
        try {
            const customer = await axios.get(BASE_URL + "/v1/customers");
            await this.setState({
                customers: customer.data
            })
            console.log(this.state.customers, "ttttt")
        } catch (error) {
            console.log(error);
        }

        //   get paperItems
        try {
            const paperItems = await axios.get(BASE_URL + "/v1/paper-items");
            await this.setState({
                paperItems: paperItems.data
            })
            console.log(this.state.paperItems, "ttttt")
        } catch (error) {
            console.log(error);
        }
    };

    onInputChange = async (e) => {
        await this.setState({ [e.target.name]: e.target.value });
        console.log(e.target.value, "value")
        console.log(e.target.name, "name")

    };

    onCustomerSelectHandler = async (e) => {
        console.log(e.target.value);
        await this.setState({
            selectedCustomer: e.target.value
        });
        console.log(this.state.selectedCustomer)
    };

    onPaperItemSelectHandler = async (e) => {
        await this.setState({
            selected_paper_item_name: e.target.value.split(",")[0],
            selected_paper_cost: parseInt(e.target.value.split(",")[1])
        });
        console.log(this.state.selected_paper_item_name, "selected_paper_item_name")
        console.log(this.state.selected_paper_cost, "selected_paper_cost")
    }

    onPaperSideSelectHandler = async (e) => {
        await this.setState({
            selected_paper_side: e.target.value
        });
        if(e.target.value=="SINGLE"){
            await this.setState({
                paper_side_multiplier: 1
            });  
        }else{
            await this.setState({
                paper_side_multiplier: 2
            });
        }
        console.log(this.state.paper_side_multiplier, "paper_side_multiplier")
        console.log(this.state.selected_paper_side, "selected_paper_side")
    }

    onJobStatusSelectHandler = async (e) => {
        await this.setState({
            selected_job_status: e.target.value
        });
        console.log(this.state.selected_job_status, "selected_job_status")
    }

    saveButtonHandler = async (event) => {

        const {paper_charge, number_of_pages, ink_cost, master_cost, paper_side_multiplier, selected_paper_cost} = this.state;
        let totalCostPerPage = selected_paper_cost?((ink_cost+master_cost)*paper_side_multiplier)+selected_paper_cost:"-";

        event.preventDefault();

        let postData = {
            "ink_cost": this.state.ink_cost,
            "master_cost": this.state.master_cost,
            "paper_item_name": this.state.selected_paper_item_name,
            "paper_cost": this.state.selected_paper_cost,
            "paper_sides": this.state.selected_paper_side,
            "number_of_pages": number_of_pages,
            "total_cost_per_page": totalCostPerPage,
            "total_cost": selected_paper_cost?(((ink_cost+master_cost)*paper_side_multiplier)+selected_paper_cost)*number_of_pages:"-",
            "paper_charge": paper_charge,
            "total_charge": paper_charge? this.state.paper_charge*number_of_pages:"-",
            "paper_profit": paper_charge? paper_charge - totalCostPerPage:"-",
            "total_profit": paper_charge? (paper_charge - totalCostPerPage)*number_of_pages:"-",
            "job_status": this.state.selected_job_status,
            "customer": {
                "id": this.state.selectedCustomer
            }
        }

        console.log(postData, "postData")
        const paperItems = await axios.post(BASE_URL + "/v1/jobs", postData);
        if (paperItems?.status == 201 || paperItems?.status == 200) {
            await this.popUpTypeSuccess();
            await this.showPopupSuccess();
            await this.props.handleGetResponse();
            await this.props.handleClose();
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
            popupMessage: "Job created successfully",
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
        // await setTimeout(() => { this.props.handleClose() }, 2500);
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

        const { paper_charge, ink_cost, master_cost, paper_side_multiplier, selected_paper_cost, number_of_pages } = this.state;
        console.log(ink_cost, master_cost, paper_side_multiplier, selected_paper_cost, number_of_pages)
        let totalCostPerPage = selected_paper_cost?((ink_cost+master_cost)*paper_side_multiplier)+selected_paper_cost:"-";
        let totalCost = selected_paper_cost?(((ink_cost+master_cost)*paper_side_multiplier)+selected_paper_cost)*number_of_pages:"-";
        let totalCharge = paper_charge? paper_charge*number_of_pages:"-";
        let paperProfit = paper_charge? paper_charge - totalCostPerPage:"-";
        let totalProfit = paper_charge? (paper_charge - totalCostPerPage)*number_of_pages:"-";
        // paperCost = (this.state.price_of_rim != null && this.state.papers_per_rim != null) ? parseFloat(this.state.price_of_rim / this.state.papers_per_rim).toFixed(2) : "-";
        
        return (
            <div className={classes.MainPanel}>
                <div className={classes.ContentWrapper}>

                    <h5>Job Details</h5>
                    <hr />


                    <div className={classes.ContentWrapper}>
                        <Row>

                            <Col>
                                <label><h6>Customer</h6></label>
                                <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"customer_id"} onChange={(e) => this.onCustomerSelectHandler(e)}>
                                    <option selected>Select Customer...</option>
                                    {this.state.customers.map((customer) => {
                                        return <option value={customer.id} label={customer.first_name + " " + customer.last_name} />
                                    })}
                                </select>
                                <br />
                            </Col>

                            <Col>

                            </Col>
                        </Row>
                        <div className={classes.header}>
                            <Row>
                                <Col>
                                    <label><h6>Paper Item</h6></label>
                                    <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"paper_item_name"} onChange={(e) => this.onPaperItemSelectHandler(e)}>
                                        <option selected>Select Paper Item...</option>
                                        {this.state.paperItems.map((paperItem) => {
                                            return <option value={paperItem.paper_item_name + "," + paperItem.paper_cost} label={paperItem.paper_item_name} />
                                        })}
                                    </select>
                                    <br />
                                </Col>

                                <Col>
                                    <label><h6><a style={{ color: 'red' }}>* </a>Paper Cost</h6></label>
                                    <input
                                        className={classes.searchIconText}
                                        type="text"
                                        value={"Rs. " + this.state.selected_paper_cost}
                                        disabled />
                                    <br />
                                </Col>


                            </Row>
                            <Row>
                                <Col>
                                    <label><h6>Ink cost per side</h6></label>
                                    <input
                                        className={classes.searchIconText}
                                        type="text"
                                        name="ink_cost"
                                        value={this.state.ink_cost}
                                        onChange={this.onInputChange} />
                                    <br />
                                </Col>
                                <Col>
                                    <label><h6>Master cost per side</h6></label>
                                    <input
                                        className={classes.searchIconText}
                                        type="text"
                                        name="master_cost"
                                        value={this.state.master_cost}
                                        onChange={this.onInputChange} />
                                    <br />
                                </Col>
                            </Row>


                        </div>
                        <br />

                        {/* Total Cost */}

                        <div className={classes.header}>
                            <Row>
                                <Col>
                                    <label><h6>Paper Sides</h6></label>
                                    <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"paper_side_id"} onChange={(e) => this.onPaperSideSelectHandler(e)}>
                                        {/* <option selected>Single Side</option> */}
                                        <option selected={this.state.selected_paper_side} value={"SINGLE"}>Single Side</option>
                                        <option value={"DOUBLE"}>Double Side</option>
                                    </select>
                                    <br />
                                </Col>

                                <Col>
                                    <label><h6><a style={{ color: 'red' }}>* </a>Number of Pages</h6></label>
                                    <input
                                        className={classes.searchIconText}
                                        type="text"
                                        name="number_of_pages"
                                        value={this.state.number_of_pages}
                                        onChange={this.onInputChange} />
                                    <br />
                                </Col>


                            </Row>
                            <Row>
                                <Col>
                                <label><h6><a style={{ color: 'red' }}>* </a>Total Cost Per Page</h6></label>
                                    <input
                                        className={classes.searchIconText}
                                        type="text"
                                        name="total_cost"
                                        value={totalCostPerPage}
                                        disabled />
                                    <br />
                                </Col>
                                <Col>
                                <label><h6><a style={{ color: 'red' }}>* </a>Total Cost</h6></label>
                                    <input
                                        className={classes.searchIconText}
                                        type="text"
                                        name="total_cost"
                                        value={totalCost}
                                        disabled />
                                    <br />
                                </Col>
                            </Row>


                        </div>

                        <br />

                        {/* Profit */}
                        <div className={classes.header}>
                            <Row>
                                <Col>
                                    <label><h6><a style={{ color: 'red' }}>* </a>Paper Charge</h6></label>
                                    <input
                                        className={classes.searchIconText}
                                        type="text"
                                        name="paper_charge"
                                        value={paper_charge}
                                        onChange={this.onInputChange} />
                                    <br />
                                </Col>

                                <Col>
                                    <label><h6>Total Charge</h6></label>
                                    <input
                                        className={classes.searchIconText}
                                        type="text"
                                        name="total_charge"
                                        value={totalCharge}
                                        disabled />
                                    <br />
                                </Col>


                            </Row>
                            <Row>
                                <Col>
                                    <label><h6><a style={{ color: 'red' }}>* </a>Paper Profit</h6></label>
                                    <input
                                        className={classes.searchIconText}
                                        type="text"
                                        name="paper_profit"
                                        value={paperProfit}
                                        disabled />
                                    <br />
                                </Col>
                                <Col>
                                <label><h6><a style={{ color: 'red' }}>* </a>Total Profit</h6></label>
                                    <input
                                        className={classes.searchIconText}
                                        type="text"
                                        name="total_profit"
                                        value={totalProfit}
                                        disabled />
                                    <br />
                                </Col>
                            </Row>


                        </div>

                        <br />
                        <Row>

                            <Col>
                                <label><h6>Job Status</h6></label>
                                <select className="form-control" style={{ backgroundColor: "#F7F7F7", borderRadius: " .55rem", cursor: "pointer" }} name={"Job_status"} onChange={(e) => this.onJobStatusSelectHandler(e)}>
                                    <option selected>Select Job Status...</option>
                                    <option value={"TODO"}>TODO</option>
                                        <option value={"IN_PROGRESS"}>IN_PROGRESS</option>
                                        <option value={"COMPLETED"}>COMPLETED</option>
                                </select>
                                <br />
                            </Col>

                            <Col>

                            </Col>
                        </Row>
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

export default CreateJob;
