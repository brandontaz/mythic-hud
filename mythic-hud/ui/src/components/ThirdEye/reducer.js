export const initialState = {
    showing: false,//process.env.NODE_ENV != 'production',
    icon: process.env.NODE_ENV != 'production' ? 'home' : null,
    menuOpen: process.env.NODE_ENV != 'production',
    menu:  process.env.NODE_ENV == 'production' ? [] : [
        { icon: 'home', text: 'Home', event: 'homeEvent', data: {} },
        { icon: 'search', text: 'Search', event: 'searchEvent', data: {} },
        { icon: 'settings', text: 'Settings', event: 'settingsEvent', data: {} },
        { icon: 'user', text: 'Profile', event: 'profileEvent', data: {} },
        { icon: 'logout', text: 'Logout', event: 'logoutEvent', data: {} },
        { icon: 'address-card', text: 'Purchase VIP Card (10k, 1 Week)', event: 'Casino:Client:PurchaseVIP', data: {} },
    ],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_EYE':
            return {
                ...state,
                ...action.payload,
                showing: true,
            };
        case 'HIDE_EYE':
            return {
                ...state,
                showing: false,
            };
        case 'OPEN_MENU':
            return {
                ...state,
                ...action.payload,
                menuOpen: true,
            };
        case 'CLOSE_MENU':
            return {
                ...state.icon,
                menuOpen: false,
                menu: [],
            };
        default:
            return state;
    }
};
