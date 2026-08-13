import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

import { checkout } from "../services/orderService";
import { applyVoucher } from "../services/voucherService";

import noBook from "../assets/nobook.png";

function CartPage() {

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const [voucherCode, setVoucherCode] =
    useState("");

  const [voucherResult, setVoucherResult] =
    useState(null);

  const [discountAmount, setDiscountAmount] =
    useState(0);

  const [voucherError, setVoucherError] =
    useState("");
  const [receiverName,
    setReceiverName] =
    useState("");

  const [receiverPhone,
    setReceiverPhone] =
    useState("");

  const [shippingAddress,
    setShippingAddress] =
    useState("");
  const totalQuantity =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const totalAmount =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );

  const shippingFee =
    totalAmount > 300000
      ? 0
      : 30000;

  const finalAmount =
    totalAmount +
    shippingFee -
    discountAmount;

  const handleApplyVoucher =
    async () => {
      try {

        const result =
          await applyVoucher(
            voucherCode,
            totalAmount
          );

        setVoucherError("");

        setVoucherResult(result);

        setDiscountAmount(
          result.discountAmount
        );

      } catch (error) {

        setVoucherResult(null);

        setDiscountAmount(0);

        setVoucherError(
          error.response?.data?.message ||
          error.message ||
          "Voucher không hợp lệ"
        );
      }
    };

 const handleCheckout =
  async () => {

    try {

      if (
        !receiverName ||
        !receiverPhone ||
        !shippingAddress
      ) {

        alert(
          "Vui lòng nhập đầy đủ thông tin giao hàng"
        );

        return;
      }

      const result =
        await checkout({

          receiverName,

          receiverPhone,

          shippingAddress,

          items: cartItems,

          voucherCode:
            voucherResult?.voucherCode

        });

      alert(
        `Đặt hàng thành công!
Order ID: ${result.id}`
      );

      clearCart();

    } catch (error) {

      console.log(error);

      if (
        error.response
      ) {

        alert(
          error.response.data.message
        );

      } else {

        alert(
          "Checkout thất bại"
        );

      }
    }
  };

  if (
    cartItems.length === 0
  ) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <div className="bg-white rounded-3xl p-16 shadow">

          <div className="text-7xl mb-5">
            🛒
          </div>

          <h2 className="text-3xl font-bold mb-3">
            Your cart is empty
          </h2>

          <p className="text-gray-500">
            Add some books to start shopping
          </p>

        </div>
      </div>
    );
  }

  return (

    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-5">

          {cartItems.map(
            (item) => (

              <div
                key={item.id}
                className="
                bg-white
                rounded-3xl
                shadow-md
                hover:shadow-xl
                transition
                p-5
                flex
                gap-5
                "
              >

                <img
                  src={
                    item.image ||
                    item.imageUrl ||
                    noBook
                  }
                  alt={item.title}
                  onError={(e) => {
                    e.target.src =
                      noBook;
                  }}
                  className="
                  w-32
                  h-44
                  object-cover
                  rounded-2xl
                  "
                />

                <div className="flex-1">

                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>

                  <div className="mt-3">
                    <span className="text-red-500 text-2xl font-bold">
                      {item.price.toLocaleString()}
                      ₫
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                      className="
                      w-10
                      h-10
                      rounded-xl
                      bg-gray-200
                      hover:bg-gray-300
                      "
                    >
                      -
                    </button>

                    <span className="font-bold text-lg w-8 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                      className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-600
                      text-white
                      hover:bg-blue-700
                      "
                    >
                      +
                    </button>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item.id
                        )
                      }
                      className="
                      ml-auto
                      bg-red-500
                      text-white
                      px-4
                      py-2
                      rounded-xl
                      hover:bg-red-600
                      "
                    >
                      Remove
                    </button>

                  </div>

                  <div className="mt-5 text-right">

                    <span className="text-gray-500">
                      Subtotal:
                    </span>

                    <span className="ml-2 text-red-500 font-bold text-xl">
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                      ₫
                    </span>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

        {/* RIGHT */}

        <div>

          <div
            className="
            bg-white
            rounded-3xl
            shadow-lg
            p-6
            sticky
            top-24
            "
          >

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>
<div className="mb-6">

  <h3
    className="
    text-lg
    font-bold
    mb-4
    "
  >
    Thông tin giao hàng
  </h3>

  <div className="space-y-3">

    <input
      type="text"
      placeholder="Họ tên người nhận"
      value={receiverName}
      onChange={(e)=>
        setReceiverName(
          e.target.value
        )
      }
      className="
      w-full
      border
      rounded-xl
      p-3
      "
    />

    <input
      type="text"
      placeholder="Số điện thoại"
      value={receiverPhone}
      onChange={(e)=>
        setReceiverPhone(
          e.target.value
        )
      }
      className="
      w-full
      border
      rounded-xl
      p-3
      "
    />

    <textarea
      rows="3"
      placeholder="Địa chỉ giao hàng"
      value={shippingAddress}
      onChange={(e)=>
        setShippingAddress(
          e.target.value
        )
      }
      className="
      w-full
      border
      rounded-xl
      p-3
      "
    />

  </div>

</div>
            {/* VOUCHER */}

            <div className="mb-6">

              <label className="block font-medium mb-2">
                Voucher
              </label>

              <div className="flex gap-2">

                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(
                      e.target.value
                    );

                    setVoucherError("");
                  }}

                  placeholder="WELCOME10"
                  className="
                  flex-1
                  border
                  rounded-xl
                  px-4
                  py-3
                  "
                />

                <button
                  onClick={
                    handleApplyVoucher
                  }
                  className="
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-5
                  rounded-xl
                  "
                >
                  Apply
                </button>

              </div>

              {voucherResult && (

                <div
                  className="
                  mt-3
                  bg-green-50
                  border
                  border-green-200
                  rounded-xl
                  p-3
                  "
                >

                  <div className="font-semibold text-green-700">
                    Voucher:
                    {" "}
                    {voucherResult.voucherCode}
                  </div>

                  <div className="text-green-600">
                    Giảm:
                    {" "}
                    {voucherResult.discountAmount.toLocaleString()}
                    ₫
                  </div>

                </div>

              )}

            </div>
            {
              voucherError && (
                <div
                  className="
                  mt-2
                  text-red-500
                  text-sm
                  font-medium
                  "
                >
                  {voucherError}
                </div>
              )
            }

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Total Books</span>
                <span>{totalQuantity}</span>
              </div>

              <div className="flex justify-between">
                <span>Products</span>
                <span>
                  {totalAmount.toLocaleString()}₫
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0
                    ? "FREE"
                    : shippingFee.toLocaleString() + "₫"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">
                  -
                  {discountAmount.toLocaleString()}
                  ₫
                </span>
              </div>

              <hr />

              <div className="flex justify-between items-center">

                <span className="font-bold">
                  Total
                </span>

                <span className="text-red-500 text-3xl font-bold">
                  {finalAmount.toLocaleString()}
                  ₫
                </span>

              </div>

            </div>

            <button
              onClick={
                handleCheckout
              }
              className="
              mt-8
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-4
              rounded-2xl
              font-bold
              text-lg
              transition
              "
            >
              Checkout
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}

export default CartPage;