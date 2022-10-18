import * as actionTypes from '../actions/actionTypes';


const initialState = {
    selectedAllJobsID:""
  }
  
  const reducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case actionTypes.ALL_JOBS_ID_SELECTED:
        console.log(payload , " payload from the reducer");
        console.log(state , " state from the reducer");
        return {...state, 
            selectedAllJobsID:payload,
          };
      default:
        return state;
    }
    
  };  
  
  export default reducer;