import * as actionTypes from './actionTypes';

export const SelectPaperSizeId = (paperSizeId) => {
    console.log(paperSizeId , " selected from the action");
    return {
      type:actionTypes.PAPER_SIZE_ID_SELECTED,
      payload: paperSizeId
    }
  };