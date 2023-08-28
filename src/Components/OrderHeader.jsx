import React from "react";
import { Link } from "react-router-dom";

const OrderHeader = () => {
  return (
    <>
      <div className="order_header">
        <header>
          <h2>Оформление заказа</h2>
          <Link to="/">
            <i className="fa-solid fa-xmark x_mark"></i>
          </Link>
        </header>
      </div>
    </>
  );
};

export default OrderHeader;
