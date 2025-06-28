import axios from 'axios'

export const login = (user) => async (dispatch) => {
    try {
      console.log('Attempting login with:', user);
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      console.log('Making API call to login endpoint');
      const {data} = await axios.post(`/api/users/login`, user, config);
      console.log('Login response:', data);
      
      dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      dispatch({ 
        type: 'USER_LOGIN_FAIL', 
        payload: error.response && error.response.data.message 
          ? error.response.data.message 
          : error.message 
      });
    }
};

export const SignupUser = (user) => async (dispatch) => {
    try {
      dispatch({ type: 'USER_REGISTER_REQUEST' });
      
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const {data} = await axios.post(`/api/users/register`, user, config);
      
      dispatch({ type: 'USER_REGISTER_SUCCESS', payload: data });
      dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data }); // Auto login after register
      localStorage.setItem('userInfo', JSON.stringify(data));
      document.location.href = '/';
    } catch (error) {
      dispatch({ 
        type: 'USER_REGISTER_FAIL',
        payload: error.response && error.response.data.message
          ? error.response.data.message 
          : error.message 
      });
    }
};

export const SignoutUser = (user) => async (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({type: 'USER_SIGNOUT_SUCCESS', payload: {} })
  document.location.href = '/';
};

export const getAllUser = () => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await axios.get(`/api/users/`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: 'GET_ALL_USER', payload: data });
  } catch (error) {
    console.log(error.response?.data?.message || error.message);
  }
};

export const deleteUser = (userId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await axios.delete(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: 'DELETE_USER', payload: data });
  } catch (error) {
    console.log(error.response?.data?.message || error.message);
  }
};