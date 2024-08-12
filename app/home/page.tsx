"use client";
import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Button from "../components/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const PRODUCTS = [
    {
      name: "Dumbell",
      description: "Adjustable dumbbells for versatile strength training",
      price: 50,
    },
    {
      name: "Treadmill",
      description: "High-performance treadmill with advanced features",
      price: 100,
    },
    {
      name: "Kettlebell",
      description: "Durable kettlebells for dynamic full-body workouts",
      price: 40,
    },
    {
      name: "Rowing Machine",
      description: "Compact rowing machine for effective cardio training",
      price: 120,
    },
  ];
  const STEPPER = [
    {
      title: "Choose Your Equipment",
      description: "Select from our wide range of high-quality gym equipment.",
      step: 1,
    },
    {
      title: "Schedule Delivery",
      description: "Pick a convenient delivery time that fits your schedule.",
      step: 2,
    },
    {
      title: "Enjoy Your Workout",
      description: "Get fit with top-notch equipment at home.",
      step: 3,
    },
    {
      title: "Return or Extend",
      description: "Easily return the equipment or extend your rental period.",
      step: 4,
    },
  ];
  return (
    <div>
      <Header />
      <div className="h-[90vh] bg-heading">
        <div className="flex items-center gap-12 w-[80%] mx-auto">
          <div className="py-8 pl-16 flex flex-col gap-8">
            <h1 className="text-6xl leading-[120%] font-bold text-white">
              Get Fit Without Breaking the Bank
            </h1>
            <p className="text-lg leading-lg text-white">
              Rent top-quality gym equipment for your home workouts.
            </p>
            <Button
              buttonClassName="bg-accent text-heading w-[200px]"
              buttonText="Check Products"
              onClick={() => router.push("/products")}
            />
          </div>
          <div className="w-full h-full flex justify-end">
            <img
              src="/hero-illustration.png"
              alt="hero illustration"
              className="w-[500px]"
            />
          </div>
        </div>
      </div>
      <div className="p-12 bg-white w-[80%] mx-auto">
        <h2 className="text-4xl leading-[120%] text-heading">
          Featured Products
        </h2>
        <div className="my-12 flex items-center gap-8">
          {PRODUCTS.map(({ name, description, price }) => {
            return (
              <div className="p-4 w-[350px] border border-heading rounded-[16px] bg-whtie">
                <h3 className="text-xl leading-lg text-heading">{name}</h3>
                <p className="text-sm leading-md text-gray-500 mt-2">
                  {description}
                </p>
                <p className="text-lg leading-lg text-heading font-semibold mt-4">
                  $ {price}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center my-12">
          <Button
            buttonClassName="bg-accent text-heading w-[200px]"
            buttonText="Check Products"
            onClick={() => router.push("/products")}
          />
        </div>
      </div>
      <div className="bg-heading">
        <div className="w-[80%] p-12 mx-auto">
          <h2 className="text-4xl leading-[120%] text-white">How it works</h2>
          <div className="my-12 flex items-center gap-8">
            {STEPPER.map(({ title, description, step }) => {
              return (
                <div className="flex flex-col gap-4 w-[350px]">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent">
                    <p className="text-xl leading-10 text-heading font-semibold">
                      {step}
                    </p>
                  </div>
                  <h3 className="text-lg leading-lg text-white font-semibold">
                    {title}
                  </h3>
                  <p className="text-sm leading-md text-gray-400">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
