import { dataFromApi } from "./reducer";
import { combineReducers } from "redux";

export default combineReducers({
    dataFromApi : dataFromApi
})