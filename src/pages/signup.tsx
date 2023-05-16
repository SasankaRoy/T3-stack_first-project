import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import * as EmailValidator from "email-validator";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

const signup = () => {
  const [userDels, setUserDels] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const reqToResgister = api.registerUser.registerUser.useMutation({
    onSuccess(data, variables, context) {
      if (data?.error) {
        window.alert(data.error);
      } else {
        //  signIn()
        router.push("/signin");
      }
    },
  });

  const handleOnChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setUserDels({ ...userDels, [name]: value });
  };
  const handleOnSubmit = async () => {
    try {
      const { userName, email, password, confirmPassword } = userDels;
      if (!userName || !email || !password || !confirmPassword) {
        console.error("Please enter credentials!");
        return;
      }
      if (!EmailValidator.validate(email)) {
        console.error("email is invalid");
        return;
      }
      if (password !== confirmPassword) {
        console.error("passwords do not match");
        return;
      }

      await reqToResgister.mutate({
        name: userName,
        email,
        password,
      });
    } catch (err) {
      console.log(err);
    }
  };
  // success("registration successful!");

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="flex h-[50%] w-[50%] items-center justify-center space-x-2 rounded-md bg-gray-100 shadow-md">
          <div className="h-full w-[50%]">
            <h1 className="p-5 text-3xl font-semibold tracking-wide">
              Create Account
            </h1>
            <div className="flex flex-col items-center justify-center space-y-3 ">
              <input
                type="text"
                placeholder="username..."
                onChange={handleOnChange}
                name="userName"
                className="w-[80%] rounded-md border border-b-2 border-l-0 border-r-0 border-t-0 bg-transparent px-2 py-1 font-sans text-lg font-normal tracking-wide shadow outline-none"
              />
              <input
                type="text"
                placeholder="email..."
                onChange={handleOnChange}
                name="email"
                className="w-[80%] rounded-md border border-b-2 border-l-0 border-r-0 border-t-0 bg-transparent px-2 py-1 font-sans text-lg font-normal tracking-wide shadow outline-none"
              />
              <input
                type="password"
                placeholder="password..."
                onChange={handleOnChange}
                name="password"
                className="w-[80%] rounded-md border border-b-2 border-l-0 border-r-0 border-t-0 bg-transparent px-2 py-1 font-sans text-lg font-normal tracking-wide shadow outline-none"
              />
              <input
                type="password"
                placeholder="confirm password..."
                onChange={handleOnChange}
                name="confirmPassword"
                className="w-[80%] rounded-md border border-b-2 border-l-0 border-r-0 border-t-0 bg-transparent px-2 py-1 font-sans text-lg font-normal tracking-wide shadow outline-none"
              />
              <div className="flex w-full items-center justify-around ">
                <button
                  onClick={handleOnSubmit}
                  className="rounded-md bg-blue-500 px-2 py-1 font-sans text-lg font-normal lowercase tracking-wider text-white shadow"
                >
                  Create Account
                </button>
                <Link
                  href="/signin"
                  className="rounded-md border-2 px-2 py-1 font-sans text-lg font-normal lowercase tracking-wider shadow"
                >
                  Have an account?
                </Link>
              </div>
            </div>
          </div>
          <div className="relative h-[80%] w-[40%] rounded-md">
            <Image
              src="/Sign_Up.png"
              fill
              className="rounded-md object-cover object-left shadow-md"
              alt="illastration"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default signup;
