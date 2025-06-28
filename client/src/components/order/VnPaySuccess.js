import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { CheckOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../constants/UserConstant'

export default function VnPaySuccess() {
  const location = useLocation();

  useEffect(() => {
    const getResultVNPay = async () => {
      const query = location.search;
      const { data } = await axios.get(
        `${BASE_URL}/payment/vnpay_return${query}`
      );
    };

    getResultVNPay();
  }, []);

  return (
    <section id="order-success">
      <div className="order-success">
        <span><CheckOutlined></CheckOutlined></span>
        <p>Đặt hàng thành công</p>
        {/* <Link to="">OK</Link> */}
        <div className="links">
          <Link to="/myOrder">Xem lại đơn hàng</Link>
          <Link to="/">Trang chủ</Link>
        </div>

      </div>
    </section>
  );
}
