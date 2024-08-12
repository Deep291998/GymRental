"use client";
import Header from "./components/header";
import Button from "./components/button";
import { useRouter } from "next/navigation";
import Footer from "./components/footer";

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <Header />
      <div className="h-screen flex items-center justify-center">
        <div className="w-[600px] flex flex-col gap-6 items-center">
          <h1 className="text-5xl leading-5xl text-heading text-center">
            Welcome to Gym Rentals!
          </h1>
          <p className="text-lg leading-lg text-heading text-center">
            Are you ready to take your fitness routine to the next level without
            the commitment of buying expensive equipment? Look no further! At
            Gym Rentals, we make it easy for you to access top-of-the-line gym
            equipment right from the comfort of your home.
          </p>
          <p className="text-md leading-md text-headeing mt-8 text-center">
            Check out our latest products here
          </p>
          <Button
            buttonClassName="bg-accent text-heading mt-4 w-[250px]"
            buttonText="Check Products"
            onClick={() => router.push("/products")}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
