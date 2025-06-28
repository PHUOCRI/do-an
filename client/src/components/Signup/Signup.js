import React, { useState, useEffect } from 'react';
import './Signup.css'
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { SignupUser } from '../../actions/UserAction'

function Signup(props) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const { register, handleSubmit, formState: { errors } } = useForm()
    
    const userSignup = useSelector(state => state.userSignup)
    const { loading, error, userInfo } = userSignup

    useEffect(() => {
        if (userInfo) {
            history.push('/')
        }
    }, [history, userInfo])

    const onSubmit = data => {
        if(password !== confirmPassword) {
            setMessage('Mật khẩu không khớp')
        } else {
            setMessage(null)
            dispatch(SignupUser(data))            
        }
    }
  
    return (
      <div className="signup-page">
        <h2>ĐĂNG KÍ</h2>
        {message && <div className="error-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div>Đang xử lý...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="form-signup">
            <input {...register("name")} placeholder="Tên" required></input>
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              required
            ></input>
            <input
              {...register("password")}
              placeholder="Mật khẩu"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
            <input
              {...register("repeat password")}
              placeholder="Nhập lại mật khẩu"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            ></input>

            <input type="submit" value="Đăng Ký"></input>
          </form>
        )}
      </div>
    );
}

export default Signup;