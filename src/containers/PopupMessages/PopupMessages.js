import React, { Component } from "react";
import classes from './PopupMessages.module.css';

class Popup extends Component {

  state = {
    message:'',
    messageType:""
  }

  componentDidMount = async () => {
    await this.setState({
     message: this.props.message,
     messageType: this.props.messageType
    });
  }

  messageBody = () => {
    if(this.state.messageType === "success"){
      return(
        <div className={classes.boxSuccess} >
            <div className={classes.iconText}>
            </div>
            <div className={classes.messageBackground}>
                <p className={classes.messageTextSucces}>{this.state.message}</p>
            </div>
         </div>
      )
      }
      if(this.state.messageType === "error"){
        return(
            <div className={classes.box} >
                <div className={classes.errorIconText}>
                </div>
                <div className={classes.messageBackground}>
                    <p className={classes.messageTextError}>{this.state.message}</p>
                </div>
             </div>
          )
      }
     
  }

  render() {
    return(     
        <div className={classes.popupBox}>
          <div>{this.messageBody()}</div>
        </div>
    )
  }
}



export default Popup;
