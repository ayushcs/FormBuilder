export const addQuestion = (ques) => {
    return {
        type: 'ADD_QUESTION',
        payload: ques
    }
}

export const modifyQuestion = (ques) => {
    return {
        type: 'MODIFY_QUESTION',
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

export const saveListingResponse = (list) => {
    return {
        type: 'SAVE_LISTING',
        payload: list
    }
}

export const reset = () => {
    return {
        type: 'RESET',
    }
}