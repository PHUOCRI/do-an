import axios from "axios";
import { BASE_URL } from '../constants/UserConstant'

export const updateOrder = (orderId, order) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/order/update/${orderId}`,
      order
    );
    dispatch({ type: "UPDATE_ORDER", payload: data });
  } catch (error) {
  }
};

export const PrintOrderGhn = (orderId) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/order/print/${orderId}`
    );
    dispatch({ type: "PRINT_ORDER", payload: data });
  } catch (error) {
  }
};

export const createOrderGhn = (orderId) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/order/create/${orderId}`
    );
    dispatch({ type: "CREATE_ORDER_GHN", payload: data });
  } catch (error) {
    console.error('Error creating GHN order:', error);
    dispatch({ type: "CREATE_ORDER_GHN_FAIL", payload: error.message });
  }
};
