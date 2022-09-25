import React, { Component } from 'react';
import classes from './ActiveDeactiveConfirmPopup.module.css';

class ActiveDeactiveConfirmPopup extends Component {
    state = {
        message: '',
        messageType: ""
    }

    componentDidMount = async () => {
        console.log(this.props, " component mounted");
        await this.setState({
            message: this.props.message,
            messageType: this.props.messageType
        });
        console.log("popupMessage ", this.state.message)
        console.log("messageType ", this.state.messageType)
    }


    messageBody = () => {
        if (this.state.messageType == "deactivate") {
            return (
                <div>
                    <div className={classes.messageBackgroundLeft}>
                        <p className={classes.messageText}>
                            {this.state.message}</p>
                    </div>
                    <div className={classes.messageBackgroundRight}>
                        <button className="btn btn-secondary btn-sm" onClick={this.props.handleClose}>Cancel</button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <button className="btn btn-danger btn-sm" onClick={this.props.confirmDeactivationHandler}>Deactivate</button>
                    </div>
                </div>
            )
        }
        else if(this.state.messageType == "activate"){
            return (
                <div>
                    <div className={classes.messageBackgroundLeft}>
                        <p className={classes.messageText}>
                        {this.state.message}</p>
                    </div>
                    <div className={classes.messageBackgroundRight}>
                        <button className="btn btn-secondary btn-sm" onClick={this.props.handleClose}>Cancel</button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <button className="btn btn-success btn-sm" onClick={this.props.confirmActivationHandler}>Activate</button>
                    </div>
                </div>
            )
        }
    }


    render() {
        return (
            <div className={classes.box} >
                {this.messageBody()}
            </div>
        )
    }
}

export default ActiveDeactiveConfirmPopup;