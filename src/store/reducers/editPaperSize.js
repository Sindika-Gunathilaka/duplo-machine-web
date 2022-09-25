import * as actionTypes from '../actions/actionTypes';


const initialState = {
    selectedPaperSizeID:""
  }
  
  const reducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case actionTypes.PAPER_SIZE_ID_SELECTED:
        console.log(payload , " payload from the reducer");
        console.log(state , " state from the reducer");
        return {...state, 
            selectedPaperSizeID:payload,
          };
      default:
        return state;
    }
    
  };  
  
  export default reducer;