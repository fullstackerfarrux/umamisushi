import { createSlice } from "@reduxjs/toolkit";
const cartLocale = localStorage.getItem("cart");
const cartStorage = JSON.parse(cartLocale);

const initialState = {
  items: cartStorage !== null ? cartStorage.items : [],
  total: cartStorage !== null ? cartStorage.total : 0,
  undiscount: cartStorage !== null ? cartStorage.undiscount : 0,
  user_id: cartStorage !== null ? cartStorage.user_id : "",
};

const cartSlice = createSlice({
  name: "bag",
  initialState,
  reducers: {
    addToCart(state, action) {
      let check = state.items.find(
        (i) => i.product.product_id == action.payload[0].product_id
      );
      if (!check) {
        state.items.push({
          count: 1,
          product: action.payload[0],
          filling:
            action.payload[1]?.filling == undefined
              ? ""
              : action.payload[1]?.filling,
        });
        state.total += +action.payload[0].price;
        state.undiscount += +action.payload[0].price;
      } else {
        state.items = state.items.filter(
          (i) => i.product.product_id !== action.payload[0].product_id
        );
        state.items.push({
          count: 1,
          product: action.payload[0],
          filling: action.payload[1]?.filling,
        });
      }
    },

    incItemCount(state, action) {
      state.items.find((i) => i.product.product_id == action.payload.product_id)
        .count++;

      state.total += +action.payload.price;

      state.undiscount += +action.payload.price;
    },

    decItemCount(state, action) {
      let check = state.items.find(
        (i) => i.product.product_id == action.payload.product_id
      ).count--;

      if (check == 1) {
        state.items = state.items.filter(
          (i) => i.product.product_id !== action.payload.product_id
        );
      }
      state.total -= +action.payload.discount
        ? action.payload.discount_price
        : action.payload.price;

      state.undiscount -= +action.payload.price;
    },

    removeFromProduct(state, action) {
      state.items = state.items.filter(
        (i) => i.product.product_id !== action.payload.product.product_id
      );

      state.total -= +action.payload.product.discount
        ? +action.payload.product.discount_price * +action.payload.count
        : +action.payload.product.price * +action.payload.count;

      state.undiscount -= +action.payload.product.price * +action.payload.count;
    },

    addUserId(state, action) {
      state.user_id = action.payload;
    },
  },
});

export const {
  addToCart,
  incItemCount,
  decItemCount,
  removeFromProduct,
  addUserId,
} = cartSlice.actions;
export default cartSlice.reducer;
