import { SET_EDIT_AGENCY_DATA, SET_RETAILER_ID, SET_SALES_CHANNEL_ID, SET_USER_LEAVES_ID } from "./actionTypes";

const initialState = {
    editAgencyData: {},
    retailerID: null,
    salesChannelID: null,
    userLeavesID: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EDIT_AGENCY_DATA:
            return { ...state, editAgencyData: action.payload };
        case SET_RETAILER_ID:
            return { ...state, retailerID: action.payload };
        case SET_SALES_CHANNEL_ID:
            return { ...state, salesChannelID: action.payload };
        case SET_USER_LEAVES_ID:
            return { ...state, userLeavesID: action.payload };
        default:
            return state;
    }
}

export default reducer;

