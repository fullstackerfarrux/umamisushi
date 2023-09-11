import React, { useCallback, useEffect, useState } from "react";
import OrderHeader from "../Components/OrderHeader";
import { useDispatch, useSelector } from "react-redux";

const Payment = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((cart) => cart);
  const [comment, setComment] = useState("");
  const [typePut, setTypePut] = useState("Доставка");
  const [typePayment, setTypePayment] = useState("Наличные");
  const [findPromo, setFindPromo] = useState(0);
  const [sale, setSale] = useState(0);
  const tg = window.Telegram.WebApp;

  const handleComment = (e) => {
    let text = e.target.value;
    setComment(text);
  };

  const onSendData = useCallback(async () => {
    let result = cart.items?.map((p, index) => ({
      product_id: p.product.product_id,
      product_name: p.product.title,
      price: `${p.product.price.toLocaleString()}`,
      count: p.count,
    }));

    let total =
      typePut == "Доставка"
        ? (cart.total + sale + 19000).toLocaleString()
        : (cart.total + sale).toLocaleString();

    let res = {
      order_products: result,
      total,
      delivery: typePut,
      payment: typePayment,
      comment: comment,
    };

    tg.sendData(JSON.stringify(res));

    let remove = {
      items: [],
      total: 0,
      undiscount: 0,
    };
    localStorage.setItem("cart", JSON.stringify(remove));
  }, [typePut, typePayment, comment]);

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [onSendData]);

  useEffect(() => {
    tg.ready();
    tg.expand();
    tg.MainButton.setParams({
      color: "#E30016",
      text_color: "#fff",
      text: `Заказать`,
      cursor: "pointer",
    });
    tg.MainButton.show();
  }, []);

  const checkPromocode = (promo) => {
    setTimeout(async () => {
      await fetch("https://api.umamisushibot.uz/promo/get", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          data.data.find((p, index) => p.title == promo) !== undefined
            ? (setFindPromo(data.data.find((p, index) => p.title == promo)),
              setSale(
                cart.total *
                  `0.${data.data.find((p, index) => p.title == promo).sale}`
              ))
            : (setFindPromo(1), setSale(0));
        });
    }, 400);
  };

  return (
    <>
      <OrderHeader />
      <div className="payment container">
        <div className="delivery">
          <button
            className={typePut == "Доставка" ? "courier" : "courier-notactive"}
            onClick={() => {
              setTypePut("Доставка");
            }}
          >
            Доставка курьером по Ташкенту
          </button>
          <button
            className={typePut == "Самовызов" ? "pickup" : "pickup-notactive"}
            onClick={() => {
              setTypePut("Самовызов");
            }}
          >
            Самовызов
          </button>
        </div>

        <div className="pay">
          <button
            className={typePayment == "Наличные" ? "cash" : "cash-notactive"}
            onClick={() => {
              setTypePayment("Наличные");
            }}
          >
            Наличные деньги
          </button>
          <button
            className={typePayment == "РауМе" ? "payme" : "payme-notactive"}
            onClick={() => {
              setTypePayment("РауМе");
            }}
          >
            PayMe
          </button>
        </div>

        <div className="promocode">
          <input
            type="text"
            className="promo"
            placeholder="Введите промокод"
            onChange={(e) => checkPromocode(e.target.value)}
          />
          {findPromo == 0 ? (
            ""
          ) : findPromo == 1 ? (
            <p style={{ marginLeft: 10, color: "red", marginTop: 10 }}>
              Промокод не найден
            </p>
          ) : cart.total > findPromo?.initial_amount ? (
            <p style={{ marginLeft: 10, color: "green", marginTop: 10 }}>
              Промокод действует
            </p>
          ) : (
            <p style={{ marginLeft: 10, color: "red", marginTop: 10 }}>
              Промокод действует от {findPromo.initial_amount.toLocaleString()}
            </p>
          )}
        </div>

        <textarea
          name="comment"
          id="comment"
          placeholder="Оставить комментарии"
          className="comment"
          onChange={(e) => handleComment(e)}
        ></textarea>

        <div className="prices">
          <div className="subtotal price">
            <p className="price-title">Подытог</p>
            <span>{cart.undiscount.toLocaleString()} сум</span>
          </div>

          <div className="selivery-price price">
            <p className="price-title">Доставка</p>
            {typePut == "Доставка" ? (
              <span>19 000 сум</span>
            ) : (
              <span>0 сум</span>
            )}
          </div>
          {cart.total > findPromo?.initial_amount ? (
            <div className="discount price">
              <p className="price-title">Скидка {findPromo.sale}%</p>
              <span style={{ color: "red" }}>
                {(cart.total * `0.${findPromo.sale}`).toLocaleString()} сум
              </span>
            </div>
          ) : (
            ""
          )}

          <div className="total price">
            <p className="total-title">Итого</p>
            {typePut == "Доставка" ? (
              <span className="total-price">
                {sale > 0
                  ? (cart.total - sale + 19000).toLocaleString()
                  : (cart.total + 19000).toLocaleString()}
                сум
              </span>
            ) : (
              <span className="total-price">
                {sale > 0
                  ? (cart.total - sale).toLocaleString()
                  : cart.total.toLocaleString()}
                сум
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
