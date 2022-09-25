import * as actionTypes from './actionTypes';

export const SelectPaperItemId = (paperItemId) => {
    console.log(paperItemId , " selected from the action");
    return {
      type:actionTypes.PAPER_ITEM_ID_SELECTED,
      payload: paperItemId
    }
  };
  