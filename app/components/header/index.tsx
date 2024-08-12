"use client";
import { useUserContext } from "@/context/userContext";
import Link from "next/link";
import React, { useState } from "react";
import Button from "../button";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import ApiError from "../api-error";
import { useCartContext } from "@/context/cartContext";

export default function Header() {
  const NAV_ITEMS = [
    {
      pathName: "home",
      name: "Home",
    },
    {
      pathName: "about-us",
      name: "About Us",
    },
    {
      pathName: "products",
      name: "Products",
    },
    {
      pathName: "my-products",
      name: "My Products",
    },
    {
      pathName: "cart",
      name: "Cart",
    },
  ];

  const router = useRouter();
  const urlPathName = usePathname().split("/");
  const { user } = useUserContext();
  const { cartItems } = useCartContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    apiError: "",
  });

  async function handleLogout() {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/logout");
      const { message } = response.data;
      return router.replace("/login");
    } catch (err: any) {
      setError((error) => ({
        ...error,
        apiError: err.response.data.message,
      }));
    } finally {
      setIsLoading(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
      }
    }
  }

  return (
    <div className="py-6 px-8 flex items-center gap-4">
      <Link href={"/"}>
        <img src="/logo.png" alt="Gym Rentals Logo" className="w-32" />
      </Link>
      <div className="flex items-center gap-8 ml-auto">
        {NAV_ITEMS.map(({ pathName, name }) => {
          const isActive = urlPathName.includes(pathName.toLowerCase());
          return (
            <div key={name} className="flex flex-col gap-2 relative">
              <div className="flex items-center gap-2">
                <Link href={`/${pathName.toLowerCase()}`}>
                  <p
                    className={`text-md text-heading hover:font-semibold ${
                      isActive ? "font-semibold" : "font-regular"
                    }`}
                  >
                    {name}
                  </p>
                </Link>
                {name.toLowerCase() === "cart" &&
                  cartItems &&
                  cartItems.length > 0 && (
                    <span className="w-6 h-6 flex items-center justify-center text-sm leading-sm text-heading rounded-full bg-accent">
                      {cartItems?.length}
                    </span>
                  )}
              </div>
              {isActive && (
                <div className="w-8 h-1 rounded-full bg-accent absolute bottom-[-5px]" />
              )}
            </div>
          );
        })}
        {error.apiError && <ApiError errorMessage={error.apiError} />}
        {user._id ? (
          <div className="flex items-center gap-6 pl-8">
            <p className="text-md leading-md text-hedaing">
              Welcome, {user?.firstName} {user?.lastName}
            </p>
            <Button
              buttonClassName="bg-accent text-heading w-[150px]"
              buttonText="Logout"
              isLoading={isLoading}
              isDisabled={isLoading}
              onClick={() => handleLogout()}
            />
          </div>
        ) : (
          <div className="flex items-center gap-6 pl-8">
            <Link
              href="/login"
              className="text-md text-heading hover:font-semibold"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="text-md text-heading hover:font-semibold"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
