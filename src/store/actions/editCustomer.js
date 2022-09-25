import * as actionTypes from './actionTypes';

export const SelectCustomerId = (customerId) => {
    console.log(customerId , " selected from the action");
    return {
      type:actionTypes.CUSTOMER_ID_SELECTED,
      payload: customerId
    }
  };