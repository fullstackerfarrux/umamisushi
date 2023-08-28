import { createSlice } from "@reduxjs/toolkit";
const cartLocale = localStorage.getItem("cart");
const cartStorage = JSON.parse(cartLocale);

const initialState = {
  items: cartStorage !== null ? cartStorage.items : [],
  total: cartStorage !== null ? cartStorage.total : 0,
  undiscount: cartStorage !== null ? cartStorage.undiscount : 0,
};

const cartSlice = createSlice({
  name: "bag",
  initialState,
  reducers: {
    addToCart(state, action) {
      state.items.push({ count: 1, product: action.payload });
      state.total += +action.payload.discount
        ? +action.payload.discount_price
        : +action.payload.price;

      state.undiscount += +action.payload.price;
    },

    incItemCount(state, action) {
      state.items.find((i) => i.product.product_id == action.payload.product_id)
        .count++;

      state.total += +action.payload.discount
        ? +action.payload.discount_price
        : +action.payload.price;

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
  },
});

export const { addToCart, incItemCount, decItemCount, removeFromProduct } =
  cartSlice.actions;
export default cartSlice.reducer;
