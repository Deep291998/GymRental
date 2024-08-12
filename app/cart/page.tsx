"use client";
import React, { useState } from "react";
import Header from "../components/header";
import { useCartContext } from "@/context/cartContext";
import ApiError from "../components/api-error";
import { useUserContext } from "@/context/userContext";
import Button from "../components/button";
import axios from "axios";
import Dropdown from "../components/dropdown";
import PAYMENT_TYPES from "@/constants/paymentTypes";
import { useRouter } from "next/navigation";
import Footer from "../components/footer";

export default function Cart() {
  const router = useRouter();
  const { user } = useUserContext();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const {
    cartItems,
    setCartItems,
    removeFromCart,
    clearCart,
    updateCartItem,
    updatePaymentType,
  } = useCartContext();

  console.log(cartItems);

  const [error, setError] = useState({
    apiError: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  let subTotal = 0;
  let hst = 0;

  async function handleCheckout() {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/subscription", {
        userId: user._id,
        products: cartItems?.map((item) => ({
          productId: item?._id,
          quantity: item?.quantity,
          type: item?.paymentType,
        })),
      });
      router.push("/my-products");
      clearCart();
    } catch (err: any) {
      setError((err: any) => ({
        apiError: err.response.data.message,
      }));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <div className="px-8 py-6">
        {error.apiError && <ApiError errorMessage={error.apiError} />}
        <h1 className="text-3xl leading-3xl text-heading">Your Cart</h1>
        <div className="mt-8 flex items-start">
          <div className="w-[60%] pr-6">
            {cartItems?.length <= 0 ? (
              <p className="text-md leading-md text-heading">
                No Items Added in cart
              </p>
            ) : (
              cartItems?.map((item) => {
                const price = item?.price || 0;
                const quantity = item?.quantity || 0;
                const totalItemCost = price * quantity;
                subTotal += totalItemCost;
                hst = subTotal * 0.13;
                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 py-4 border border-heading my-4 relative"
                  >
                    <div className="absolute top-3 right-3">
                      <button
                        className="w-8 h-8 rounded-full bg-accent flex items-center justify-center border-0"
                        onClick={() => removeFromCart(item?._id)}
                      >
                        <img
                          src="/delete.svg"
                          alt="delete icon"
                          className="w-[20px]"
                        />
                      </button>
                    </div>
                    <div className="w-[25%]">
                      <img
                        src={`/${item.type}.svg`}
                        alt={`${item?.type} image`}
                        className="w-[120px] h-[120px] mx-auto"
                      />
                    </div>
                    <div className="w-[75%]">
                      <div>
                        <h2 className="text-xl leading-xl text-heading">
                          {item.name}
                        </h2>
                        <p className="text-md leading-md text-gray-500 mt-2">
                          {item.description}
                        </p>
                        <div className="mt-8 flex items-start gap-8">
                          <div className="flex flex-col gap-2">
                            <p className="text-sm leading-sm text-heading font-semibold">
                              Price
                            </p>
                            {item.paymentType.toLowerCase() ===
                            PAYMENT_TYPES.BIWEEKLY.toLowerCase() ? (
                              <p className="text-lg leading-lg text-heading font-semibold">
                                ${Math.round(price / 2)} / Bi-weekly
                              </p>
                            ) : (
                              <p className="text-lg leading-lg text-heading font-semibold">
                                ${item.price} / Month
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="text-sm leading-sm text-heading font-semibold">
                              Quantity
                            </p>
                            <div className="flex items-center bg-accent">
                              <div className="w-[40px] h-[40px] flex items-center justify-center">
                                <button
                                  onClick={() =>
                                    updateCartItem({
                                      id: item._id || "",
                                      quantity: item?.quantity - 1 || 0,
                                    })
                                  }
                                >
                                  <img
                                    src="/Remove.svg"
                                    alt="Remove item icon"
                                    className="w-[24px]"
                                  />
                                </button>
                              </div>
                              <div className="w-[40px] h-[40px] flex items-center justify-center">
                                <p className="text-md leading-md text-heading">
                                  {item?.quantity}
                                </p>
                              </div>
                              <div className="w-[40px] h-[40px] flex items-center justify-center">
                                <button
                                  onClick={() =>
                                    updateCartItem({
                                      id: item._id || "",
                                      quantity: item?.quantity + 1 || 0,
                                    })
                                  }
                                >
                                  <img
                                    src="/Add.svg"
                                    alt="Add item icon"
                                    className="w-[24px]"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-sm leading-sm text-heading font-semibold">
                              Payment Type
                            </p>
                            <Dropdown
                              id="selectPaymentType"
                              onClick={(value) => {
                                setCartItems(
                                  cartItems.map((cartItem) =>
                                    cartItem._id === item._id
                                      ? { ...item, paymentType: value.name }
                                      : item
                                  )
                                );
                                updatePaymentType({
                                  id: item._id,
                                  paymentType: value.name,
                                });
                              }}
                              selectedOption={{
                                id: item.paymentType,
                                name: item.paymentType,
                              }}
                              options={[
                                { id: "", name: "Select a Type" },
                                ...Object.keys(PAYMENT_TYPES).map((item) => ({
                                  id: item,
                                  name: item,
                                })),
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {!token && (
            <div>
              <p className="text-md leading-md text-heading">
                Please sign in to proceed with checkout
              </p>
              <div className="mt-4">
                <Button
                  buttonClassName="bg-accent text-heading w-[150px]"
                  buttonText="Sign In"
                  onClick={() => {
                    router.push("/login");
                  }}
                />
              </div>
            </div>
          )}
          {cartItems.length > 0 && token && (
            <div className="w-[30%] px-6 flex flex-col gap-4">
              <h2 className="text-xl leading-xl text-heading">Summary</h2>
              <div className="flex items-center my-2">
                <p className="text-md leading-md text-gray-500">Subtotal</p>
                <p className="text-lg leading-lg text-heading font-semibold ml-auto">
                  $ {subTotal.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center my-2">
                <p className="text-md leading-md text-gray-500">HST (13%)</p>
                <p className="text-lg leading-lg text-heading font-semibold ml-auto">
                  $ {hst.toFixed(2)}
                </p>
              </div>
              <hr />
              <div className="flex items-center my-2">
                <p className="text-md leading-md text-gray-500">Total Amount</p>
                <p className="text-lg leading-lg text-heading font-semibold ml-auto">
                  $ {(subTotal + hst).toFixed(2)}
                </p>
              </div>

              <Button
                buttonClassName="bg-accent text-heading mt-4 w-[150px]"
                buttonText="Checkout"
                isLoading={isLoading}
                isDisabled={isLoading}
                onClick={() => handleCheckout()}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
