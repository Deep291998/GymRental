"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { useUserContext } from "@/context/userContext";
import { Product } from "../products/page";
import axios from "axios";
import PAYMENT_TYPES from "@/constants/paymentTypes";
import ApiError from "../components/api-error";
import Footer from "../components/footer";

export default function MyProducts() {
  const { user } = useUserContext();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState({
    apiError: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getAllProducts() {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/subscription?userId=${user?._id}`
        );
        const { data } = response.data;
        setData(data);
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
  }, [user]);

  return (
    <div>
      <Header />
      <div className="px-8 py-6">
        {error.apiError && <ApiError errorMessage={error.apiError} />}
        <div className="flex items-center gap-8 my-6">
          <h1 className="text-3xl leading-3xl text-heading">My Products</h1>
        </div>
        <div>
          {isLoading ? (
            <p className="text-md leading-md text-heading">
              Fetching products...
            </p>
          ) : data?.length <= 0 ? (
            <p className="text-md leading-md text-heading">
              No Products Found!
            </p>
          ) : (
            <div className="w-[60%]">
              {data?.map(
                ({
                  _id,
                  product,
                  type,
                  quantity,
                  amount,
                }: {
                  _id: string;
                  product: Product;
                  type: string;
                  quantity: number;
                  amount: number;
                }) => {
                  const price = Number(product?.price) || 0;
                  return (
                    <div
                      key={_id}
                      className="flex items-center gap-4 py-4 border border-heading my-4"
                    >
                      <div className="w-[25%]">
                        <img
                          src={`/${product.type}.svg`}
                          alt={`${product?.type} image`}
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
                          <div className="flex items-center gap-8 mt-4">
                            <div className="flex flex-col gap-2">
                              <p className="text-sm leading-sm text-heading font-semibold">
                                Price
                              </p>
                              {type.toLowerCase() ===
                              PAYMENT_TYPES.BIWEEKLY.toLowerCase() ? (
                                <p className="text-lg leading-lg text-heading font-semibold">
                                  $ {Math.round(price / 2)} / Bi-weekly
                                </p>
                              ) : (
                                <p className="text-lg leading-lg text-heading font-semibold">
                                  $ {price} / Month
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm leading-sm text-heading font-semibold">
                                Quantity
                              </p>
                              <p className="text-lg leading-lg text-heading font-semibold">
                                {quantity}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm leading-sm text-heading font-semibold">
                                Total Amount
                              </p>
                              <p className="text-lg leading-lg text-heading font-semibold">
                                $ {amount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
