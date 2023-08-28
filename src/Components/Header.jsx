import React, { useEffect, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { BiSearchAlt, BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const [searchProduct, setSearchProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const { cart } = useSelector((cart) => cart);

  useEffect(() => {
    async function get() {
      await fetch("http://localhost:4001/products", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setProducts(data.products));
    }

    get();
  }, []);

  const handleSearch = (e) => {
    const searchText = e.target.value;
    if (searchText.length !== 0) {
      let resSearch = products?.filter((p, index) =>
        p.title.includes(searchText)
      );
      setSearchProduct(resSearch);
    }
  };

  return (
    <>
      <div className="header container">
        <img
          src={"/whitelogo.png"}
          width={50}
          height={50}
          style={{ borderRadius: "50%", border: "0.5px solid silver" }}
        />
        <div className="flex">
          <Link to="/order" style={{ position: "relative" }}>
            <HiOutlineShoppingBag
              size={25}
              color="#004225"
              style={{ margin: "0px 15px" }}
            />
            {cart.items.length !== null ? (
              cart.items.length != 0 ? (
                <span className="bag-count">{cart.items.length}</span>
              ) : (
                ""
              )
            ) : (
              <span></span>
            )}
          </Link>
          <BiSearchAlt
            size={25}
            color="#004225"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
      <div
        className="search"
        style={
          open
            ? {
                transform: "translateY(550px)",
                transition: "transform 0.5s",
              }
            : {
                transform: "translateY(-500px)",
                transition: "transform 0.5s",
              }
        }
      >
        <div className="box">
          <div className="input">
            <input
              type="text"
              placeholder="Найти быстро"
              name="search"
              onChange={(e) => handleSearch(e)}
            />
            <div className="serach-icon">
              <BiSearch size={22} color="#fff" />
            </div>
          </div>
          <div className="forback">
            <h1>РЕЗУЛЬТАТЫ ПОИСКА</h1>
            <button className="back" onClick={() => setOpen(false)}>
              Закрыть
            </button>
          </div>
          <div
            style={
              searchProduct.length <= 0
                ? { display: "flex" }
                : { display: "none" }
            }
            className="no-result"
          >
            Продукты не найдены
          </div>
          <div
            style={
              searchProduct.length > 0
                ? { display: "block" }
                : { display: "none" }
            }
            className="result"
          >
            {searchProduct?.map((p, index) => (
              <Link
                to={`/single-product/${p.product_id}`}
                className="product"
                key={index}
              >
                <img src={p.images[0]} alt="collagen" />
                <p>{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
