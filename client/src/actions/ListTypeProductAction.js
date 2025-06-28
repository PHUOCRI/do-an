import axios from 'axios'
import { BASE_URL } from '../constants/UserConstant'

export const getAllTypeProduct = () => async (dispatch) => {
    try {
        const {data} = await axios.get(`${BASE_URL}/typeList`)
        dispatch({type: 'GET_ALL_TYPE_PRODUCT', payload: data})
    } catch (error) {
    }
}

export const createType = (type) => async (dispatch) => {
    try {
        const {data} = await axios.post(`${BASE_URL}/api/typeList/create`, type)
        dispatch({ type: "CREATE_TYPE_LIST", payload: data });
    } catch (error) {
        dispatch({ type: "CREATE_TYPE_LIST_FAIL", payload: error.message });
    }
}

export const deleteTypeProduct = (typeId) => async (dispatch) => {
    try {
        const {data} = await axios.delete(`${BASE_URL}/api/typeList/delete/${typeId}`)
        dispatch({ type: "DELETE_TYPE_LIST", payload: data });
    } catch (error) {
        dispatch({ type: "DELETE_TYPE_LIST_FAIL", payload: error.message });
    }
}