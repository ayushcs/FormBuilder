const initialState = {
    currentUser: null,
    questions: [],
    url: '',
}

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_QUESTION' : return {
            ...state,
            questions: [...state.questions, action.payload]
        }
        case 'SAVE_URL' : return {
            ...state,
            url: action.payload
        }
        case 'CURRENT_USER' : return {
            ...state,
            currentUser: action.payload
        }
        
        default: return state;
    }
}

export default formReducer;