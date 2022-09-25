import * as actionTypes from '../actions/actionTypes';


const initialState = {
    selectedJobID:""
  }
  
  const reducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case actionTypes.JOB_ID_SELECTED:
        console.log(payload , " payload from the reducer");
        console.log(state , " state from the reducer");
        return {...state, 
            selectedJobID:payload,
          };
      default:
        return state;
    }
    
  };  
  
  export default reducer;