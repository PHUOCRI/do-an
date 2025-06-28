import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from '../../constants/UserConstant'

export default function VnPay() {
  const { order } = useSelector((state) => state.orderInfo);

  const handleVNPay = async () => {
    const OrderPaid = {
      ...order,
      status: "pendding",
      paymentMethod: "payOnline",
    };

    const { data } = await axios.post(
      `${BASE_URL}/payment/create`,
      OrderPaid
    );

    if (data.code === "00") {
      document.location = data.data;
    }

    localStorage.removeItem("cartItems");
  };

  return (
    // <div className="payment-vnpay" onClick={handleVNPay}>
    //   <button onClick={handleVNPay}>
    //     <i>VN Pay</i>
    //   </button>
    // </div>

    <div className="vnpay" onClick={handleVNPay}>
      <img src="https://cdn.tgdd.vn/Files/2019/07/16/1180407/vnpay_636988542288431852.jpg" alt="VNPay" />
    </div>
  );
}
