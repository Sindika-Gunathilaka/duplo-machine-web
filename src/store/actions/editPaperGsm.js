import * as actionTypes from './actionTypes';

export const SelectPaperGsmId = (paperGsmId) => {
    console.log(paperGsmId , " selected from the action");
    return {
      type:actionTypes.PAPER_GSM_ID_SELECTED,
      payload: paperGsmId
    }
  };