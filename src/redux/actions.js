export const addQuestion = (ques) => {
    return {
        type: 'ADD_QUESTION',
        payload: ques
    }
}

export const saveUrl = (url) => {
    return {
        type: 'SAVE_URL',
        payload: url
    }
}

export const saveCurrUser = (user) => {
    return {
        type: 'CURRENT_USER',
        payload: user
    }
}

export const resetQues = () => {
    return {
        type: 'RESET_QUES',
    }
}