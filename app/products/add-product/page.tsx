"use client";
import ApiError from "@/app/components/api-error";
import Button from "@/app/components/button";
import Dropdown from "@/app/components/dropdown";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import Input from "@/app/components/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type AddProductState = {
  name?: string;
  description?: string;
  price?: string;
  type?: {
    id?: string;
    name?: string;
  };
};

export default function AddProduct() {
  const PRODUCT_TYPES = [
    {
      id: "DUMBELL",
      name: "DUMBELL",
    },
    {
      id: "TREADMILL",
      name: "TREADMILL",
    },
    {
      id: "BARBELL",
      name: "BARBELL",
    },
    {
      id: "WEIGHTSCALE",
      name: "WEIGHTSCALE",
    },
    {
      id: "WEIGHTPLATE",
      name: "WEIGHTPLATE",
    },
  ];

  const router = useRouter();

  const [state, setState] = useState<AddProductState>({
    description: "",
    price: "",
    type: {
      id: "",
      name: "",
    },
    name: "",
  });
  const [error, setError] = useState({
    nameError: "",
    descriptionError: "",
    priceError: "",
    typeError: "",
    apiError: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { name, description, price, type } = state;

  function checkName() {
    if (!name) {
      setError((error) => ({
        ...error,
        nameError: "Please enter a product name",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      nameError: "",
    }));
    return true;
  }
  function checkDescription() {
    if (!type) {
      setError((error) => ({
        ...error,
        descriptionError: "Please enter product description",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      descriptionError: "",
    }));
    return true;
  }
  function checkprice() {
    if (!price) {
      setError((error) => ({
        ...error,
        typeError: "Please enter product price",
      }));
      return false;
    }
    if (Number(price) <= 0) {
      setError((error) => ({
        ...error,
        typeError: "price cannot be negative",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      typeError: "",
    }));
    return true;
  }
  function checkType() {
    if (!type?.id || !type?.name) {
      setError((error) => ({
        ...error,
        typeError: "Please Select a product type",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      typeError: "",
    }));
    return true;
  }

  async function handleAddProduct() {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    const ALL_CHECKS_PASS = [
      checkName(),
      checkDescription(),
      checkprice(),
      checkType(),
    ].every(Boolean);
    if (!ALL_CHECKS_PASS) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/product",
        {
          name,
          description,
          price: Number(price),
          type: type?.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const { message } = response.data;
      router.push("/products");
    } catch (err: any) {
      setError((error) => ({
        ...error,
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
        <h1 className="text-3xl leading-3xl text-heading">Add Product</h1>
        <div className="mt-8 w-[500px]">
          <Input
            type="text"
            hasLabel
            label="Product Name"
            placeholder="Enter name of the product"
            value={name}
            onChange={(event) =>
              setState((state) => ({
                ...state,
                name: event.target.value,
              }))
            }
          />
          <Input
            type="text"
            hasLabel
            label="Description"
            placeholder="Enter product description"
            value={description}
            onChange={(event) =>
              setState((state) => ({
                ...state,
                description: event.target.value,
              }))
            }
          />
          <div className="flex items-start gap-4">
            <Input
              type="number"
              hasLabel
              label="Price"
              placeholder="Enter product price"
              hasHelperText
              helperText="This will be the monthly price for the product"
              value={price}
              onChange={(event) =>
                setState((state) => ({
                  ...state,
                  price: event.target.value,
                }))
              }
            />
            <Dropdown
              id="selectProductType"
              label="Product Type"
              onClick={(value) => {
                const types: any = PRODUCT_TYPES.find(
                  (type) => type.id === value.id
                );
                setState((state) => ({
                  ...state,
                  type: types,
                }));
              }}
              selectedOption={type}
              options={[{ id: "", name: "Select a Type" }, ...PRODUCT_TYPES]}
              hasError={error.typeError !== ""}
              error={error.typeError}
            />
          </div>
          <div className="flex items-center gap-4 mt-8">
            <Button
              buttonClassName="bg-white border border-heading text-heading w-[150px]"
              buttonText="Cancel"
              isDisabled={isLoading}
              isLoading={isLoading}
              onClick={() => router.push("/products")}
            />
            <Button
              buttonClassName="bg-accent text-heading w-full"
              buttonText="Add Product"
              isDisabled={isLoading || !name || !description || !price || !type}
              isLoading={isLoading}
              onClick={() => handleAddProduct()}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
