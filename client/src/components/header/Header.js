import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Header.css";
import { SignoutUser } from "../../actions/UserAction";
import { useHistory } from "react-router";
import { searchProduct } from "../../actions/ProductAction";
import { Link } from "react-router-dom";
import logo from '../../img/logo.avif';

import {
  DownOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function Header(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [showAccount, setShowAccount] = useState(false);
  const [showAccount2, setShowAccount2] = useState(false);
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState(true);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const cartItems = useSelector((state) => state.cart.cartItems);
  const amount = cartItems.reduce((a, b) => a + b.qty, 0);

  // Cleanup effect
  useEffect(() => {
    let mounted = true;

    return () => {
      mounted = false;
      // Cleanup any pending state updates
      setSearch("");
      setShowAccount(false);
      setShowAccount2(false);
    };
  }, []);

  const handleSignout = () => {
    dispatch(SignoutUser());
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (search.trim()) {
      localStorage.setItem('searchKeyword', search);
      await history.push("/search");
      dispatch(searchProduct(search));
      setSearch("");
    }
  };

  return (
    <div className="header">
      <section id="menu">
        <div className="logo">
          <span>
            <Link to="/">
              <img
                src={logo}
                width={150}
                height={50}
                alt="Logo Cellphones"
              />
            </Link>
          </span>
        </div>
        <div className="search">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              name="search"
              placeholder="Tìm kiếm ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="search-button">
              <SearchOutlined />
            </button>
          </form>
        </div>
        <ul className="menu-list" id={menu ? "hidden" : ""}>
          <li className="active">
            <Link to="/"> Trang Chủ </Link>
          </li>
          <li>
            <Link to="/product"> Sản Phẩm </Link>
          </li>
          {userInfo ? (
            <li>
              <Link to="#" onClick={() => setShowAccount2(!showAccount2)}>
                {userInfo.name}
                <DownOutlined style={{ fontSize: "14px" }} />
              </Link>
              {showAccount2 && (
                <div className="menu-drop">
                  {userInfo.isAdmin && <Link to="/admin">Admin</Link>}
                  <Link to="/myOrder">Đơn hàng</Link>
                  <Link to="/" onClick={handleSignout}>Đăng xuất</Link>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link to="#" onClick={() => setShowAccount(!showAccount)}>
                Tài khoản
                <DownOutlined style={{ fontSize: "14px" }} />
              </Link>
              {showAccount && (
                <div className="menu-drop">
                  <Link to="register">Đăng kí</Link>
                  <Link to="login">Đăng nhập</Link>
                </div>
              )}
            </li>
          )}
          <li className="shop-cart">
            <Link to="/cart" className="shop-cart">
              <ShoppingCartOutlined style={{ fontSize: "30px" }} />
              <span className="count">{amount}</span>
            </Link>
          </li>
        </ul>
        <div className="bar" onClick={() => setMenu(!menu)}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </section>
    </div>
  );
}

export default Header;
