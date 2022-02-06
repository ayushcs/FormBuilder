const initialState = {
    currentUser: null,
    questions: [],
    url: '',
    list: []
}

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_QUESTION' : return {
            ...state,
            questions: [...state.questions, action.payload]
        }
        case 'MODIFY_QUESTION' : return {
            ...state,
            questions: [...action.payload]
        }
        case 'SAVE_URL' : return {
            ...state,
            url: action.payload
        }
        case 'CURRENT_USER' : return {
            ...state,
            currentUser: action.payload
        }
        case 'RESET_QUES' : return {
            ...state,
            questions: []
        }
        case 'SAVE_LISTING': return {
            ...state,
            questions: [],
            list: [...state.list, ...action.payload]
        }
        case 'RESET': return {
            currentUser: null,
            questions: [],
            url: '',
            list: []
        }
        
        default: return state;
    }
}

export default formReducer;