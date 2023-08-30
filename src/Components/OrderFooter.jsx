import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const OrderFooter = ({ total, price }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((cart) => cart);

  return (
    <>
      <div className="order_footer">
        <footer>
          <div className="footer_main">
            <h2>К оплате:</h2>
            <div className="footer_text">
              <h3>Подитог</h3>
              <p>{cart.undiscount.toLocaleString()} сум</p>
            </div>
            <div className="footer_text">
              <h3>Доставка</h3>
              <p>19 000 сум</p>
            </div>
            <div className="footer_text_answer">
              <h3>Итого</h3>
              <p>{(cart.total + 19000).toLocaleString()} сум</p>
            </div>
            <div>
              {cart.items?.length > 0 ? (
                <Link to={"/payment"}>
                  <button className="btn">Оформить заказ</button>
                </Link>
              ) : (
                <button style={{ backgroundColor: "grey" }} className="btn">
                  Оформить заказ
                </button>
              )}
              <Link to={"/"}>
                <button className="btn2">
                  <i className="fa-solid fa-left-long"></i>Продолжить покупки
                </button>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default OrderFooter;