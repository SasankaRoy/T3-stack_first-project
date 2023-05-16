import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import React, { useState } from "react";

const signin = () => {
  const [userDels, setUserDels] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const session = useSession();
  const handleOnChange = (e: any) => {
    const { name, value } = e.target;
    setUserDels({ ...userDels, [name]: value });
  };
  const handleSubmit = async () => {
    const { email, password } = userDels;
    const loginReq = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (loginReq?.error == "user not exists!") {
      window.alert(loginReq.error);
    } else if (loginReq?.error == "password not matched! try again") {
      window.alert(loginReq.error);
    } else {
      router.push("/");
    }
  };
  if (session) {
    console.log("first", session);
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex h-[50%] w-[50%] items-center justify-center space-x-2 rounded-md bg-gray-100 shadow-md">
        <div className="h-full w-[50%]">
          <h1 className="p-5 text-3xl font-semibold tracking-wide">
            welcome,back!
          </h1>
          <div className="flex flex-col items-center justify-center space-y-3 ">
            <input
              type="text"
              placeholder="email..."
              name="email"
              onChange={handleOnChange}
              className="w-[80%] rounded-md border border-b-2 border-l-0 border-r-0 border-t-0 bg-transparent px-2 py-1 font-sans text-lg font-normal tracking-wide shadow outline-none"
            />
            <input
              type="password"
              placeholder="password..."
              name="password"
              onChange={handleOnChange}
              className="w-[80%] rounded-md border border-b-2 border-l-0 border-r-0 border-t-0 bg-transparent px-2 py-1 font-sans text-lg font-normal tracking-wide shadow outline-none"
            />

            <div className="flex w-full items-center justify-around ">
              <button
                onClick={handleSubmit}
                className="rounded-md bg-blue-500 px-2 py-1 font-sans text-lg font-normal lowercase tracking-wider text-white shadow"
              >
                log in
              </button>
              <Link
                href="/signup"
                className="rounded-md border-2 px-2 py-1 font-sans text-lg font-normal lowercase tracking-wider shadow"
              >
                create an account?
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
  );
};

export default signin;
