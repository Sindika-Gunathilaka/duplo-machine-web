import * as actionTypes from '../actions/actionTypes';


const initialState = {
    SelectPaperItemId:""
  }
  
  const reducer = (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case actionTypes.PAPER_ITEM_ID_SELECTED:
        console.log(payload , " payload from the reducer");
        console.log(state , " state from the reducer");
        return {...state, 
            SelectPaperItemId:payload,
          };
      default:
        return state;
    }
    
  };  
  
  export default reducer;