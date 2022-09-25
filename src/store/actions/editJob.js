import * as actionTypes from './actionTypes';

export const SelectjobId = (jobId) => {
    console.log(jobId , " selected from the action");
    return {
      type:actionTypes.JOB_ID_SELECTED,
      payload: jobId
    }
  };