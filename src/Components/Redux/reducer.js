import { SET_EDIT_AGENCY_DATA, SET_RETAILER_ID } from "./actionTypes";

const initialState = {
    editAgencyData: {},
    retailerID: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EDIT_AGENCY_DATA:
            return { ...state, editAgencyData: action.payload };
        case SET_RETAILER_ID:
            return { ...state, retailerID: action.payload };
        default:
            return state;
    }
}

export default reducer;

