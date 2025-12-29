export const initialState = {
    hudMenu: process.env.NODE_ENV != 'production',
    horizStatusPos: 50,
    vertStatusPos: 1,
    horizVehiclePos: 50,
    vertVehiclePos: 5,
    horizMinimapPos: 0,
    vertMinimapPos: 0,
    horizLocationPos: 16,
    vertLocationPos: 3,
    
    statusPos: 'BottomLeft',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_MENU':
            return {
                ...state,
                hudMenu: action.payload.state,
            };
        case 'UPDATE_HUD_POSITION':
            const { element, axis, value } = action.payload;

            const positionKey = `${axis}`;

            if (Object.keys(initialState).includes(positionKey)) {
                return {
                    ...state,
                    [positionKey]: value,
                };
            } else {
                return state;
            }
            case 'RESET_HUD_POSITIONS':
                return {
                    ...state,
                    horizStatusPos: action.payload.horizStatusPos,
                    vertStatusPos: action.payload.vertStatusPos,
                    horizVehiclePos: action.payload.horizVehiclePos,
                    vertVehiclePos: action.payload.vertVehiclePos,
                    horizMinimapPos: action.payload.horizMinimapPos,
                    vertMinimapPos: action.payload.vertMinimapPos,
                    horizLocationPos: action.payload.horizLocationPos,
                    vertLocationPos: action.payload.vertLocationPos,
                    statusPos: action.payload.statusPos,
                };
        default:
            return state;
    }
};
