import * as actionTypes from '../actions/actionTypes';


const initialState = {
    selectedCustID:""
  }
  
  const reducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case actionTypes.CUSTOMER_ID_SELECTED:
        console.log(payload , " payload from the reducer");
        console.log(state , " state from the reducer");
        return {...state, 
          selectedCustID:payload,
          };
      default:
        return state;
    }
    
  };  
  
  export default reducer;