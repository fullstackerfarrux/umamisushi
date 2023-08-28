import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, decItemCount, incItemCount } from "../rt/slices/cart";
import { useSelector } from "react-redux";

const Products = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((cart) => cart);
  localStorage.setItem("cart", JSON.stringify(cart));

  const [line, setLine] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.MainButton.hide();

    async function get() {
      await fetch("http://localhost:4001/products", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setProducts(data.products));

      await fetch("http://localhost:4001/categories", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setCategories(data.categories);
          setLine(data.categories[0].category_name);
        });
    }

    get();
  }, []);

  let decrement = (product) => {
    dispatch(decItemCount(product));
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  let increment = (product) => {
    dispatch(incItemCount(product));
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  let addToBag = (product) => {
    dispatch(addToCart(product));
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="container">
      <div className="table">
        {categories.map((c, index) => (
          <div
            className="table_text"
            onClick={() => setLine(c.category_name)}
            style={
              line !== c.category_name
                ? { border: "none", cursor: "pointer" }
                : {
                    borderBottom: "2px solid rgb(199, 22, 18)",
                    cursor: "pointer",
                  }
            }
            key={index}
          >
            <h3>{c.category_name}</h3>
            <div></div>
          </div>
        ))}
      </div>
      {products.length > 0 ? (
        <div className="products">
          {products.map((p, index) =>
            line == p.category_name ? (
              <div className="product" key={index}>
                <Link to={`/single-product/${p.product_id}`}>
                  <img
                    src={p.images[0]}
                    alt="collagen"
                    style={{
                      cursor: "pointer",
                      minWidth: 171,
                      height: 146,
                      overflow: "clip",
                    }}
                  />
                </Link>
                <Link
                  to={`/single-product/${p.product_id}`}
                  className="info"
                  style={{ cursor: "pointer" }}
                >
                  <h2>{p.title}</h2>
                  <div className="price">
                    <p>{p.price.toLocaleString()} сум</p>
                  </div>
                </Link>
                <div
                  className="buttons"
                  style={
                    cart.items.find(
                      (f) => f.product.product_id == p.product_id
                    ) !== undefined
                      ? { display: "flex" }
                      : { display: "none" }
                  }
                >
                  <p onClick={() => decrement(p)}>-</p>
                  <span>
                    {cart.items.find(
                      (f) => f.product.product_id == p.product_id
                    ) !== undefined
                      ? cart.items.find(
                          (f) => f.product.product_id == p.product_id
                        ).count
                      : ""}
                  </span>
                  <p onClick={() => increment(p)}>+</p>
                </div>
                <button
                  onClick={() => addToBag(p)}
                  style={
                    cart.items.find(
                      (f) => f.product.product_id == p.product_id
                    ) !== undefined
                      ? { display: "none" }
                      : { display: "flex" }
                  }
                >
                  Добавить в корзину
                </button>
              </div>
            ) : (
              ""
            )
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Products;
