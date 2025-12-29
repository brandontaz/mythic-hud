export const initialState = {
    showing: false,
    firstName: 'Michael',
    lastName: 'Davis',
    tag: 'LSPD',
    description: 'Is this the job you were looking for?',
    buttons: [
        {
            label: 'Yes'
        },
        {
            label: 'No'
        }
    ]
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'DialogState':
            return {
                ...state,
                ...action.payload,
            };
        case 'DialogClose':
            return {
                ...state,
                showing: false
            }
        default:
            return state;
    }
};
