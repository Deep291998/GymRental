"use client";
import { useUserContext } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { useRouter } from "next/navigation";
import Button from "../components/button";
import ApiError from "../components/api-error";
import axios from "axios";
import { isAdmin } from "@/utils/checkProtectedRoutes";
import { useCartContext } from "@/context/cartContext";
import PAYMENT_TYPES from "@/constants/paymentTypes";
import Footer from "../components/footer";

export type Product = {
  _id?: string;
  name?: string;
  type?: string;
  description?: string;
  price?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function Products() {
  const { user } = useUserContext();
  const { cartItems, addToCart, updateCartItem } = useCartContext();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState({
    apiError: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getAllProducts() {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/product");
        const { data } = response.data;
        setProducts(data);
      } catch (err: any) {
        setError((error) => ({
          ...error,
          apiError: err.response.data.message,
        }));
      } finally {
        setIsLoading(false);
      }
    }

    getAllProducts();
  }, []);

  return (
    <div>
      <Header />
      <div className="px-8 py-6">
        {error.apiError && <ApiError errorMessage={error.apiError} />}
        <div className="flex items-center gap-8 my-6">
          <h1 className="text-3xl leading-3xl text-heading">Products</h1>
          {isAdmin(user) && (
            <Button
              buttonClassName="bg-accent text-heading w-[150px]"
              buttonText="Add Product"
              onClick={() => router.push("/products/add-product")}
            />
          )}
        </div>
        <div>
          {isLoading ? (
            <p className="text-md leading-md text-heading">
              Fetching products...
            </p>
          ) : products?.length <= 0 ? (
            <p className="text-md leading-md text-heading">
              No Products Found!
            </p>
          ) : (
            <div className="w-[60%]">
              {products?.map((product: Product) => {
                const item: any = cartItems?.find(
                  (item) => item._id === product._id
                );
                return (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 py-4 border border-heading my-4"
                  >
                    <div className="w-[25%]">
                      <img
                        src={`/${product.type}.svg`}
                        alt={`${product.type} image`}
                        className="w-[120px] h-[120px] mx-auto"
                      />
                    </div>
                    <div className="w-[75%]">
                      <div>
                        <h2 className="text-xl leading-xl text-heading">
                          {product.name}
                        </h2>
                        <p className="text-md leading-md text-gray-500 mt-2">
                          {product.description}
                        </p>
                        <div className="mt-8 flex items-start gap-8">
                          <div className="flex flex-col gap-2">
                            <p className="text-sm leading-sm text-heading font-semibold">
                              Price
                            </p>
                            <p className="text-lg leading-lg text-heading font-semibold">
                              ${product.price} / Month
                            </p>
                          </div>
                          {cartItems?.filter((item) => item._id === product._id)
                            .length > 0 ? (
                            <div className="flex flex-col gap-2">
                              <p className="text-sm leading-sm text-heading font-semibold">
                                Quantity
                              </p>
                              <div className="flex items-center bg-accent">
                                <div className="w-[40px] h-[40px] flex items-center justify-center">
                                  <button
                                    onClick={() =>
                                      updateCartItem({
                                        id: product._id || "",
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
                                        id: product._id || "",
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
                          ) : (
                            <button
                              className="font-medium px-4 py-2 mt-4 transition-all bg-accent text-heading"
                              onClick={() => {
                                addToCart({
                                  _id: product._id || "",
                                  description: product.description || "",
                                  name: product.name || "",
                                  type: product.type || "",
                                  price: Number(product?.price) || 0,
                                  quantity: 1,
                                  paymentType: PAYMENT_TYPES.MONTHLY,
                                });
                              }}
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
