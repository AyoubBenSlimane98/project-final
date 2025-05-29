import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../../store";

type formPros = {
  email: string;
  password: string;
  isAcepet: boolean;
};

const loginFn = async (form: { email: string; password: string }) => {
  const response = await fetch(
    "http://localhost:4000/api/authentication/sign-in",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(form),
    }
  );
  if (!response.ok) {
    throw new Error("Email or Password not courrect");
  }
  return response.json();
};
const SignIN = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [form, setForm] = useState<formPros>({
    email: "",
    password: "",
    isAcepet: false,
  });
  const { mutate } = useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      setIsLoading(true);
      const { accessToken, refreshtoken } = data.token;

      setAccessToken(accessToken);
      Cookies.set("refreshToken", refreshtoken, {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });
      setTimeout(() => {
        setIsLoading(false);
        if (data.role === "admin") {
          navigate("/admin");
        }
        if (data.role === "etudiant") {
          navigate("/etudiant");
        }
        if (data.role === "enseignant_responsable") {
          navigate("/ens-responsable");
        }
        if (data.role === "enseignant_principal") {
          navigate("/ens-principale");
        }
      }, 3000);
    },
    onError: () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setError(true);
      }, 2000);
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, type, value, checked } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handelPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    mutate({ email: form.email, password: form.password });
  };
  useEffect(() => {
    if (form.email === "" && form.password === "") {
      setError(false);
    }
  }, [form.email, form.password]);
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#f2f4f8] ">
      <div className="bg-white flex flex-col gap-6 px-8 py-10 rounded-2xl shadow w-[31rem]">
        <div className="flex flex-col justify-center items-center ">
          <div className="text-center">
            <h3 className="text-[1.8rem] font-medium pb-1">Welcome back</h3>
            <p className="text-[1rem] font-light pb-2">
              Please enter your details to sign in.
            </p>
          </div>
        </div>
        <form className="flex flex-col gap-2" onSubmit={handleSumbit}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`  ${
              error ? "border-red-500" : "border-gray-400"
            } outline-none border   px-4 py-2.5 rounded-lg w-full mb-4`}
          />
          <div className="relative">
            <input
              type={`${showPassword ? "text" : "password"}`}
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`  ${
                error ? "border-red-500" : "border-gray-400"
              } outline-none border   px-4 py-2.5 rounded-lg w-full `}
            />
            {form.password.length > 0 ? (
              showPassword ? (
                <FaEye
                  className=" absolute right-2.5 top-4  duration-300 ease-in-out"
                  onClick={handelPassword}
                />
              ) : (
                <FaEyeSlash
                  className=" absolute right-2.5 top-4 duration-300 ease-in-out"
                  onClick={handelPassword}
                />
              )
            ) : (
              ""
            )}
          </div>
          <div className="flex justify-end items-center">
            <div>
              <NavLink
                to="/password"
                className="select-none underline  hover:text-blue-500"
              >
                Forgot password?
              </NavLink>
            </div>
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white py-2.5 mt-3 rounded-lg hover:bg-gray-800 transform duration-300 focus:scale-[0.99] shadow"
          >
            {isLoading ? " Sign in ..." : " Sign in"}
          </button>
          {error ? (
           <div className=" text-center">
              <p className="text-sm text-red-600">
                Email or Password is incorrect or your account is bloqued
              </p>
           </div>
          ) : (
            ""
          )}
        </form>
        <div className="flex items-center justify-center gap-x-0.5 ">
          <p className="font-light">
            Are you teacher and don't have an account yet?
          </p>
          <NavLink to="/sign-up" className="font-bold ">
            Sing Up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SignIN;
