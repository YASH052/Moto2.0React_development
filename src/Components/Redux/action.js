import { SET_EDIT_AGENCY_DATA, SET_RETAILER_ID, SET_SALES_CHANNEL_ID, SET_USER_LEAVES_ID } from "./actionTypes"

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

export const setSalesChannelID = (payload) => {
    console.log("payload", payload);
    return {
        type: SET_SALES_CHANNEL_ID,
        payload: payload
    }
}

export const setUserLeavesID = (payload) => {
    console.log("payload", payload);
    return {
        type: SET_USER_LEAVES_ID,
        payload: payload
    }
}
