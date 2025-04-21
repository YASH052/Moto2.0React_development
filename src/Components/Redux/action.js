import { SET_EDIT_AGENCY_DATA, SET_RETAILER_ID } from "./actionTypes"

export const setEditAgencyData = (payload) => {
    console.log("payload", payload);
    return {
        type: SET_EDIT_AGENCY_DATA,
        payload: payload
    }
}

export const setRetailerID = (payload) => {
    console.log("payload", payload);
    return {
        type: SET_RETAILER_ID,
        payload: payload
    }
}
