import axios from "axios";
import { BASE_URL } from '../constants/UserConstant'

export const getAllSelectList = () => async (dispatch) => {
    try {
        const {data} = await axios.get(`${BASE_URL}/selectList`)
        dispatch({type: 'GET_ALL_SELECT_LIST', payload: data})
    } catch (error) {
    }
}

export const createSelectList = (item) => async (dispatch) => {
  try {
    const {data} = await axios.post(`${BASE_URL}/api/selectList/create`, item)
    dispatch({ type: "CREATE_SELECTLIST", payload: data });
  } catch (error) {
    dispatch({ type: "CREATE_SELECTLIST_FAIL", payload: error.message });
  }
};

export const updateSelectList = (item) => async (dispatch) => {
  try {
    const {data} = await axios.put(`${BASE_URL}/api/selectList/update/${item._id}`, item)
    dispatch({ type: "UPDATE_SELECTLIST", payload: data });
  } catch (error) {
    dispatch({ type: "UPDATE_SELECTLIST_FAIL", payload: error.message });
  }
};

export const getSelectListById = (id) => async (dispatch) => {
  try {
    const {data} = await axios.get(`${BASE_URL}/api/selectList/detail/${id}`)
    dispatch({ type: "GET_SELECTLIST_BY_ID", payload: data });
  } catch (error) {
    dispatch({ type: "GET_SELECTLIST_BY_ID_FAIL", payload: error.message });
  }
};

export const deleteSelectListItemById = (id) => async (dispatch) => {
    try {
        const {data} = await axios.delete(`${BASE_URL}/selectList/delete/${id}`)
        dispatch({type: 'DELETE_SELECT_LIST_ITEM_BY_ID', payload: data})
    } catch (error) {
    }
}