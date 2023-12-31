import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decItemCount, incItemCount } from "../rt/slices/cart";

const SinglePage = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((cart) => cart);
  localStorage.setItem("cart", JSON.stringify(cart));

  const [product, setProduct] = useState([]);
  const [slider, setSlider] = useState(0);
  const [count, setCount] = useState(0);
  const [filling, setFilling] = useState(0);
  const { id } = useParams();
  const maxLengthImg = +product[0]?.images.length - 1;

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.MainButton.hide();

    async function get() {
      const find = cart.items.find((f) => f.product.product_id == id);
      if (find !== undefined && find !== 0) {
        setCount(find?.count);
      }

      await fetch("https://api.umamisushibot.uz/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setProduct(data.product);
        });
    }

    get();
  }, []);

  const handleView = (e) => {
    let text = e.target.value;
    let res = product;

    if (res.length > 1) {
      res.splice(1, 1);
      res.push({ filling: text });
    } else {
      res.push({ filling: text });
    }

    dispatch(addToCart(res));
    localStorage.setItem("cart", JSON.stringify(cart));
    setCount(1);
    setFilling(text);
  };

  if (maxLengthImg < slider) {
    setSlider(0);
  }

  let decrement = (product) => {
    dispatch(decItemCount(product));
    localStorage.setItem("cart", JSON.stringify(cart));
    setCount(count - 1);
  };

  let increment = (product) => {
    dispatch(incItemCount(product));
    localStorage.setItem("cart", JSON.stringify(cart));
    setCount(count + 1);
  };

  let addToBag = (product) => {
    dispatch(addToCart([product]));
    localStorage.setItem("cart", JSON.stringify(cart));
    setCount(1);
  };

  console.log(cart.items.find((i) => i.product.product_id == id));

  return (
    <>
      <div className="single-product">
        <Header />
        <div className="container">
          <div className="product-info">
            <h1>{product[0]?.title}</h1>
            <div className="imgSlider">
              <AiOutlineLeft
                onClick={() => console.log(123)}
                size={30}
                color="green"
                className="leftButton"
                style={
                  maxLengthImg == 0 ? { display: "none" } : { display: "block" }
                }
              />
              {product[0]?.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="collagen"
                  width={300}
                  height={300}
                  style={
                    maxLengthImg !== 0
                      ? {
                          transform: `translateX(-${265 * slider}px)`,
                          transition: "transform 1s",
                        }
                      : {
                          margin: "0 auto",
                          width: "90vw",
                          marginTop: 20,
                        }
                  }
                />
              ))}
              <AiOutlineRight
                size={30}
                color="green"
                className="rightButton"
                style={
                  maxLengthImg == 0 ? { display: "none" } : { display: "block" }
                }
                onClick={() => {
                  setSlider(slider + 1);
                }}
              />
            </div>
            <div
              className="dots"
              style={
                maxLengthImg == 0 ? { display: "none" } : { display: "block" }
              }
            >
              {product[0]?.images.map((image, index) => (
                <span
                  className="dots"
                  key={index}
                  style={
                    index == count
                      ? { backgroundColor: "blue" }
                      : { backgroundColor: "silver" }
                  }
                ></span>
              ))}
            </div>
            <div className="product-data">
              <div className="description">
                {product[0]?.description.split("\n").map((line, index) => (
                  <p key={index}>
                    {line}
                    <br />
                  </p>
                ))}
              </div>

              <form>
                <label htmlFor="view">
                  <b>Вид</b>
                </label>
                <input
                  type="text"
                  placeholder="Введите вид"
                  defaultValue={
                    cart.items.find((i) => i.product.product_id == id)?.filling
                  }
                  onChange={(e) => handleView(e)}
                />
              </form>

              {product[0]?.discount ? (
                <div className="cost">
                  <h3>{product[0]?.discount_price.toLocaleString()} сум</h3>
                  <h4>{product[0]?.price.toLocaleString()} сум</h4>
                </div>
              ) : (
                <div className="cost">
                  <h3>{product[0]?.price.toLocaleString()} сум</h3>
                </div>
              )}
            </div>
          </div>

          <div
            className="footer-buttons"
            style={count == 0 ? { display: "flex" } : { display: "none" }}
          >
            <Link to={`/${cart.user_id}`} className="back">
              <FiArrowLeft className="back-text" />
            </Link>

            <div className="add-to-cart" onClick={() => addToBag(product[0])}>
              <p>Добавить в корзину</p>
            </div>
          </div>
          <div
            className="footer-buttons-changed"
            style={count !== 0 ? { display: "flex" } : { display: "none" }}
          >
            <Link to={`/${cart.user_id}`} className="back">
              <FiArrowLeft className="back-text" />
            </Link>

            <Link className="add-to-cart">
              <p onClick={() => decrement(product[0])}>-</p>
              <span>{count}</span>
              <p onClick={() => increment(product[0])}>+</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePage;
