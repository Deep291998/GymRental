"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
}

const INITIAL_STATE: IUser = {
  _id: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  role: {
    id: "",
    name: "",
  },
};

const Context = createContext<{
  user: IUser;
  setUser: (user: IUser) => void;
  toggleFetchUserDetails: boolean;
  setToggleFetchUserDetails: (value: boolean) => void;
}>({
  user: INITIAL_STATE,
  setUser: () => {},
  toggleFetchUserDetails: false,
  setToggleFetchUserDetails: () => {},
});

export function UserContext({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userId =
    (typeof window !== "undefined" && localStorage.getItem("userId")) ?? "";
  const [user, setUser] = useState<IUser>(INITIAL_STATE);
  const [toggleFetchUserDetails, setToggleFetchUserDetails] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>();

  useEffect(() => {
    async function getUserDetails(userId: string) {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        const { data } = response.data;
        setUser(data);
      } catch (err: any) {
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      setIsLoading(true);
      getUserDetails(userId);
    }

    return () => {
      setIsLoading(false);
    };
  }, [userId, toggleFetchUserDetails]);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        toggleFetchUserDetails,
        setToggleFetchUserDetails,
      }}
    >
      {isLoading ? (
        <div className="h-[100vh] w-screen flex items-center justify-center bg-white">
          <p className="text-sm leading-5 font-medium text-heading text-center">
            Fetching user details!
          </p>
        </div>
      ) : (
        children
      )}
    </Context.Provider>
  );
}

export function useUserContext() {
  return useContext(Context);
}
