"use client";
import React, { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import ApiError from "../components/api-error";

type LoginState = {
  email?: string;
  password?: string;
};

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<LoginState>({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
    apiError: "",
  });

  const { setUser } = useUserContext();

  const { email, password } = state;

  function checkEmail() {
    if (!email) {
      setError((error) => ({
        ...error,
        emailError: "Email is required",
      }));
      return false;
    }
    if (!email.includes("@")) {
      setError((error) => ({
        ...error,
        emailError: "Please enter a valid email",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      emailError: "",
    }));
    return true;
  }

  function checkPassword() {
    if (!password) {
      setError((error) => ({
        ...error,
        passwordError: "Password is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      passwordError: "",
    }));
    return true;
  }

  async function handleLogin() {
    const ALL_CHECKS_PASS = [checkPassword(), checkEmail()].every(Boolean);

    if (!ALL_CHECKS_PASS) return;

    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      const { data: loginResponse } = response;
      const { data } = loginResponse;
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("userId", data._id);
          localStorage.setItem("token", data.token);
        }
      } catch (error) {
        console.error("Error while setting token in localStorage:", error);
      }
      setUser(data);
      return router.push(`/products`);
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
    <div className="w-full h-full relative flex items-start">
      <img
        src="/logo.png"
        alt="Gym Rentals Logo"
        className="w-32 absolute left-20 top-10"
      />
      <div className="bg-accent h-[100vh] w-[5%]"></div>
      <div className="bg-white h-[100vh] w-[95%] flex items-center justify-center">
        <div className="w-[400px]">
          <p className="text-sm leading sm text-heading mb-4 font-semibold">
            <Link href={"/"}>Back to Website</Link>
          </p>
          <h1 className="text-4xl leading-4xl font-semibold text-heading mb-4">
            Sign In
          </h1>
          {error.apiError && <ApiError errorMessage={error.apiError} />}
          <div className="mt-8">
            <Input
              type="email"
              hasLabel
              label="Email"
              hasError={error.emailError !== ""}
              error={error.emailError}
              placeholder="Enter your email address"
              value={email}
              onChange={(event) =>
                setState((state) => ({
                  ...state,
                  email: event.target.value,
                }))
              }
            />
            <Input
              type="password"
              hasLabel
              label="Password"
              hasError={error.passwordError !== ""}
              error={error.passwordError}
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setState((state) => ({
                  ...state,
                  password: event.target.value,
                }))
              }
            />
            <Button
              buttonClassName="bg-accent text-heading mt-4 w-full"
              buttonText="Login"
              isLoading={isLoading}
              isDisabled={isLoading || !email || !password}
              onClick={() => handleLogin()}
            />
            <p className="text-sm leading sm text-heading mt-4 text-center">
              Don’t have an account?{" "}
              <span className="font-semibold">
                <Link href={"/sign-up"}>Signup Here</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
