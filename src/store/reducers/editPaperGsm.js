import * as actionTypes from '../actions/actionTypes';


const initialState = {
    selectedPaperGsmID:""
  }
  
  const reducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case actionTypes.PAPER_GSM_ID_SELECTED:
        console.log(payload , " payload from the reducer");
        console.log(state , " state from the reducer");
        return {...state, 
            selectedPaperGsmID:payload,
          };
      default:
        return state;
    }
    
  };  
  
  export default reducer;