"use client";
import React, { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUserContext } from "@/context/userContext";
import ApiError from "../components/api-error";

type SignUpState = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
};

export default function SignUp() {
  const router = useRouter();
  const { setUser } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<SignUpState>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    firstNameError: "",
    lastNameError: "",
    phoneNumberError: "",
    emailError: "",
    passwordError: "",
    apiError: "",
  });

  const { firstName, lastName, email, phoneNumber, password } = state;

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

  function checkPhoneNumber() {
    if (!phoneNumber) {
      setError((error) => ({
        ...error,
        phoneNumberError: "Phone Number is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      phoneNumberError: "",
    }));
    return true;
  }

  function checkFirstName() {
    if (!firstName) {
      setError((error) => ({
        ...error,
        firstNameError: "First Name is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      firstNameError: "",
    }));
    return true;
  }

  function checkLastName() {
    if (!lastName) {
      setError((error) => ({
        ...error,
        lastNameError: "Last Name is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      lastNameError: "",
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

  async function handleSignUp() {
    const ALL_CHECKS_PASS = [
      checkPassword(),
      checkEmail(),
      checkFirstName(),
      checkPhoneNumber(),
      checkLastName(),
    ].every(Boolean);

    if (!ALL_CHECKS_PASS) return;

    setIsLoading(true);
    try {
      const response = await axios.post("/api/sign-up", {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
      });
      const { data } = response.data;
      if (data) {
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
      }
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
            Create Account
          </h1>
          {error.apiError && <ApiError errorMessage={error.apiError} />}
          <div className="mt-8">
            <div className="flex items-center gap-4">
              <Input
                type="text"
                hasLabel
                label="First Name"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(event) =>
                  setState((state) => ({
                    ...state,
                    firstName: event.target.value,
                  }))
                }
              />
              <Input
                type="text"
                hasLabel
                label="Last Name"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(event) =>
                  setState((state) => ({
                    ...state,
                    lastName: event.target.value,
                  }))
                }
              />
            </div>
            <Input
              type="email"
              hasLabel
              label="Email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) =>
                setState((state) => ({
                  ...state,
                  email: event.target.value,
                }))
              }
            />
            <div className="flex items-center gap-4">
              <Input
                type="password"
                hasLabel
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setState((state) => ({
                    ...state,
                    password: event.target.value,
                  }))
                }
              />
              <Input
                type="tel"
                hasLabel
                label="Phone Number"
                placeholder="Enter your phone number"
                onChange={(event) =>
                  setState((state) => ({
                    ...state,
                    phoneNumber: event.target.value,
                  }))
                }
                hasError={error.phoneNumberError !== ""}
                error={error.phoneNumberError}
                disabled={isLoading}
              />
            </div>
            <Button
              buttonClassName="bg-accent text-heading mt-4 w-full"
              buttonText="Create Account"
              isDisabled={
                isLoading ||
                !firstName ||
                !lastName ||
                !email ||
                !password ||
                !phoneNumber
              }
              isLoading={isLoading}
              onClick={() => handleSignUp()}
            />
            <p className="text-sm leading sm text-heading mt-4 text-center">
              Already have an account?{" "}
              <span className="font-semibold">
                <Link href={"/login"}>Login</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
