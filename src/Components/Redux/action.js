import { SET_EDIT_AGENCY_DATA } from "./actionTypes"

export const setEditAgencyData = (payload) => {
    console.log("payload", payload);
    return {
        type: SET_EDIT_AGENCY_DATA,
        payload: payload
    }
}

