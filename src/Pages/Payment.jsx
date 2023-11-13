import React, { useCallback, useEffect, useState } from "react";
import OrderHeader from "../Components/OrderHeader";
import { useDispatch, useSelector } from "react-redux";

const Payment = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((cart) => cart);
  const [comment, setComment] = useState("");
  const [typePut, setTypePut] = useState("Доставка");
  const [typePayment, setTypePayment] = useState("Наличные");
  const [firstOrder, setFirstOrder] = useState(0);
  const [findPromo, setFindPromo] = useState(0);
  const [delivery, setDelivery] = useState();
  const [deliveryPrice, setDeliveryPrice] = useState(0);
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
      filling: cart.items[index]?.filling,
    }));

    let total =
      typePut == "Доставка"
        ? cart.total - sale + deliveryPrice
        : cart.total - sale;

    let res = {
      order_products: result,
      total: total,
      delivery: typePut,
      payment: typePayment,
      comment: comment,
      promocode: findPromo.title !== undefined ? findPromo.title : "",
    };

    tg.sendData(JSON.stringify(res));

    let remove = {
      items: [],
      total: 0,
      undiscount: 0,
    };
    localStorage.setItem("cart", JSON.stringify(remove));
  }, [typePut, typePayment, comment, findPromo, delivery]);

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

    async function get() {
      await fetch("https://api.umamisushibot.uz/get/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: cart?.user_id,
        }),
      })
        .then((res) => res.json())
        .then((data) =>
          data.orders.length <= 0
            ? (setFirstOrder(10), setSale(cart.total * 0.1))
            : setFirstOrder(0)
        );

      await fetch("https://api.umamisushibot.uz/delivery", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setDelivery(data.msg));
    }

    get();
  }, []);

  const checkPromocode = async (promo) => {
    await fetch("https://api.umamisushibot.uz/promo/getforuse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: cart.user_id,
        text: promo,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        data.msg !== "Not Found"
          ? (setFindPromo(data.msg),
            setSale(cart.total * `0.${data.msg?.sale}`))
          : firstOrder > 0
          ? (setSale(cart.total * 0.1), setFindPromo(1))
          : (setFindPromo(1), setSale(0));
      });

    if (promo.length == 0) {
      setFindPromo(0);
    }
  };

  async function getDeliveryPrice() {
    let startSum = 10000;
    let kmSum = 2000;

    let location = await fetch(
      `https://api.umamisushibot.uz/user_location/${cart.user_id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        return data.location;
      });

    // Convert from degrees to radians
    function degreesToRadians(degrees) {
      var radians = (degrees * Math.PI) / 180;
      return radians;
    }

    // Function takes two objects, that contain coordinates to a starting and destination location.
    function calcDistance(startingCoords, destinationCoords) {
      let startingLat = degreesToRadians(startingCoords.latitude);
      let startingLong = degreesToRadians(startingCoords.longitude);
      let destinationLat = degreesToRadians(destinationCoords.latitude);
      let destinationLong = degreesToRadians(destinationCoords.longitude);

      // Radius of the Earth in kilometers
      let radius = 6571;

      // Haversine equation
      let distanceInKilometers =
        Math.acos(
          Math.sin(startingLat) * Math.sin(destinationLat) +
            Math.cos(startingLat) *
              Math.cos(destinationLat) *
              Math.cos(startingLong - destinationLong)
        ) * radius;

      return distanceInKilometers;
    }

    let sCoords = {
      latitude: 41.302626,
      longitude: 69.279813,
    };

    let dCoords = {
      latitude: location[0],
      longitude: location[1],
    };

    let dist = Math.round(calcDistance(sCoords, dCoords));
    let res = dist * kmSum + startSum;
    setDeliveryPrice(res);
  }

  getDeliveryPrice();

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
            className={typePayment == "Click" ? "payme" : "payme-notactive"}
            onClick={() => {
              setTypePayment("Click");
            }}
          >
            Click
          </button>
          <button 
            className={typePayment == "Payme" ? "payme" : "payme-notactive"}
            onClick={() => {
              setTypePayment("Payme");
            }}
          >
            Payme
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
              Промокод действует от {findPromo?.initial_amount.toLocaleString()}
            </p>
          )}

          {cart.total > findPromo?.initial_amount ? (
            ""
          ) : firstOrder > 0 ? (
            <p style={{ marginLeft: 10, color: "green", marginTop: 10 }}>
              Для вас существует скидка на первый заказ
            </p>
          ) : (
            ""
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
            <p className="price-title">Подитог</p>
            <span>{cart.undiscount.toLocaleString()} сум</span>
          </div>

          <div className="selivery-price price">
            <p className="price-title">Доставка</p>
            {typePut == "Доставка" ? (
              <span>{deliveryPrice?.toLocaleString()} сум</span>
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
          ) : firstOrder > 0 ? (
            <div className="discount price">
              <p className="price-title">Скидка {firstOrder}%</p>
              <span style={{ color: "red" }}>
                {(cart.total * `0.${firstOrder}`).toLocaleString()} сум
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
                  ? (cart.total - sale + deliveryPrice).toLocaleString()
                  : (cart.total + deliveryPrice).toLocaleString()}{" "}
                сум
              </span>
            ) : (
              <span className="total-price">
                {sale > 0
                  ? (cart.total - sale).toLocaleString()
                  : cart.total.toLocaleString()}{" "}
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
