import { SET_EDIT_AGENCY_DATA } from "./actionTypes";

const initialState = {
    editAgencyData: {}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EDIT_AGENCY_DATA:
            return { ...state, editAgencyData: action.payload };
        default:
            return state;
    }
}

export default reducer;

