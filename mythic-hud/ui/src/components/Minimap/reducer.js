export const initialState = {
    showing: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_MINIMAP':
            return {
                ...state,
                showing: action.payload.state,
            };
        default:
            return state;
    }
};
