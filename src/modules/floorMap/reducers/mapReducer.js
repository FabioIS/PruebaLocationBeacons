const INITIAL_STATE = {
    prevState: NaN,
    plan: [],
    beaconsList: [],
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'DOWNLOAD_MAP':
            return {
                ...state,
                plan: action.payload,
            };
        case 'DOWNLOAD_BEACONLIST':
            return {
                ...state,
                beaconsList: action.payload
            };
        case 'UPDATE_MAP':
            return{
                ...state,
                plan: action.payload,
                prevState: action.prevPosition
            };
        default:
            return state
    }

};

