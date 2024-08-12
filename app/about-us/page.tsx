import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function AboutUs() {
  const VALUES = [
    {
      title: "Commitment to Quality",
      description:
        "We provide only the best, rigorously tested equipment to ensure your safety and satisfaction.",
    },
    {
      title: "Customer Focus",
      description:
        "Your needs are our priority. We strive to deliver exceptional service and support.",
    },
    {
      title: "Innovation",
      description:
        "We continuously seek to improve our offerings and stay ahead of industry trends.",
    },
    {
      title: "Sustainability",
      description:
        "We promote sustainable practices by offering rental options that reduce waste and promote the reuse of equipment.",
    },
  ];
  return (
    <div>
      <Header />
      <div className="h-[90vh] bg-heading flex items-center">
        <div className="w-[80%] mx-auto flex flex-col gap-8">
          <h1 className="text-6xl leading-[120%] font-bold text-white">
            Our Story
          </h1>
          <p className="text-lg leading-[200%] text-white">
            Gym Rentals was founded in 2023 with a vision to make top-tier
            fitness equipment accessible to everyone. Our founders, Deep Patel
            and Rahil Patel, are fitness enthusiasts who recognized the
            challenge many face in maintaining a consistent workout routine due
            to the high cost and space constraints of owning gym equipment. What
            started as a small initiative to rent out a few pieces of equipment
            has grown into a comprehensive service helping thousands of
            customers stay fit and healthy from the comfort of their homes.
          </p>
        </div>
      </div>
      <div className="py-12 bg-white w-[80%] mx-auto">
        <h2 className="text-4xl leading-[120%] text-heading">Our Values</h2>
        <div className="my-12 flex items-start gap-8">
          {VALUES.map(({ title, description }) => {
            return (
              <div className="p-4 w-[350px] border border-heading rounded-[16px] bg-whtie">
                <h3 className="text-xl leading-lg text-heading">{title}</h3>
                <p className="text-sm leading-md text-gray-500 mt-2">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
