import * as actionTypes from './actionTypes';

export const SelectAllJobsId = (allJobsId) => {
    console.log(allJobsId , " selected from the action");
    return {
      type:actionTypes.ALL_JOBS_ID_SELECTED,
      payload: allJobsId
    }
  };