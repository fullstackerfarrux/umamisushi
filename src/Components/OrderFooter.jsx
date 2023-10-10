import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const OrderFooter = ({ total, price }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((cart) => cart);
  const [delivery, setDelivery] = useState();
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  useEffect(() => {
    async function get() {
      await fetch("https://api.umamisushibot.uz/delivery", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setDelivery(data.msg));
    }

    get();
  }, []);

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
              <p>{deliveryPrice?.toLocaleString()} сум</p>
            </div>
            <div className="footer_text_answer">
              <h3>Итого</h3>
              <p>{(cart.total + deliveryPrice).toLocaleString()} сум</p>
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
              <Link to={`/${cart.user_id}`}>
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
