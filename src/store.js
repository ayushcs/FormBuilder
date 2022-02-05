import {createStore} from 'redux';
import formReducer from './redux/reducer'

const store = createStore(formReducer);

export default store;
