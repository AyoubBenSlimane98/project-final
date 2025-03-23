import { FormEvent, useReducer, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router";

interface State {
  email: string;
  password: string;
  error: {
    err_email: string | null;
    err_password: string | null;
  };
}

interface Action {
  type: "SET_EMAIL" | "SET_PASSWORD" | "SET_ERROR_EMAIL" | "SET_ERROR_PASSWORD";
  payload: string | null;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload as string };
    case "SET_PASSWORD":
      return { ...state, password: action.payload as string };
    case "SET_ERROR_EMAIL":
      return { ...state, error: { ...state.error, err_email: action.payload } };
    case "SET_ERROR_PASSWORD":
      return {
        ...state,
        error: { ...state.error, err_password: action.payload },
      };
    default:
      return state;
  }
}

export const AuthForm = () => {
  const initialState: State = {
    email: "",
    password: "",
    error: { err_email: null, err_password: null },
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const handleVisiblePassword = () => {
    setIsVisiblePassword((prev: boolean) => !prev);
  };
  const validateForm = (): boolean => {
    let isValid = true;
    const emailRegex =
      /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!state.email) {
      dispatch({ type: "SET_ERROR_EMAIL", payload: "Email is required." });
      isValid = false;
    } else if (!emailRegex.test(state.email)) {
      dispatch({ type: "SET_ERROR_EMAIL", payload: "Invalid email format." });
      isValid = false;
    } else {
      dispatch({ type: "SET_ERROR_EMAIL", payload: null });
    }

    if (state.password === "") {
      dispatch({
        type: "SET_ERROR_PASSWORD",
        payload: "Password is requard.",
      });
      isValid = false;
    } else {
      dispatch({ type: "SET_ERROR_PASSWORD", payload: null });
    }

    return isValid;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      console.log("Submitted Data: ", state);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" px-3 py-4  flex flex-col items-center  justify-center w-[22,5rem] md:w-[30rem] md:h-[24rem] md:px-8 lg:w-[25rem] lg:h-[35rem]  lg:p-6 lg:bg-[#fbfcfc] lg:rounded-r-xl lg:shadow-[#fbfcfc] "
      >
        <div className="flex justify-center items-center flex-col gap-2 lg:justify-baseline mb-4">
          <h2 className="text-3xl font-medium md:text-4xl md:font-bold  text-black">
            Login{" "}
          </h2>
          <span className="text-[#818589] text-sm font-light pb-4 md:text-sm lg:text-[1rem]">
            We suggest using the email you use at work.
          </span>
        </div>
        <div className="w-full shrink-0  relative group">
          <label
            className={`absolute left-3 px-1 text-sm font-medium transform  duration-300 ease-in-out bg-white z-[10] ${
              state.email
                ? "-top-3.5 text-blue-600"
                : "top-3 group-hover:-top-3.5 group-hover:lg:bg-[#fbfcfc] "
            }`}
          >
            Email
          </label>
          <input
            type="text"
            name="email"
            className={` bg-white w-full px-4 py-2.5 duration-500 ease-linear transform border  rounded-md outline-none placeholder:invisible group-hover:placeholder:visible ${
              state.email ? " border-blue-600" : "border-gray-400"
            }`}
            placeholder="user@mail.com"
            onChange={(e) =>
              dispatch({ type: "SET_EMAIL", payload: e.target.value })
            }
            value={state.email}
          />
          {state.error.err_email && (
            <p className="text-sm text-red-500">{state.error.err_email}</p>
          )}
        </div>

        <div className="w-full shrink-0 mt-6 relative group">
          <label
            htmlFor="password"
            className={`absolute left-3 px-1 py-0 text-sm font-medium transform  duration-300 ease-in-out  bg-white  z-[10] ${
              state.password
                ? "-top-3.5 text-blue-600"
                : "top-3 group-hover:-top-3.5 group-hover:lg:bg-[#fbfcfc] "
            }`}
          >
            Password
          </label>
          <input
            type={isVisiblePassword ? "text" : "password"}
            id="password"
            name="password"
            value={state.password}
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", payload: e.target.value })
            }
            placeholder="********"
            className={`w-full bg-white px-4 py-2.5 duration-500 ease-linear transform border  rounded-md outline-none placeholder:invisible group-hover:placeholder:visible ${
              state.password ? " border-blue-600" : "border-gray-400"
            }`}
            aria-label="Enter your password"
          />
          {state.password !== "" && (
            <div className="absolute top-4 right-3.5   transform ease-in-out duration-150  cursor-pointer">
              {isVisiblePassword ? (
                <FaEye onClick={handleVisiblePassword} />
              ) : (
                <FaEyeSlash onClick={handleVisiblePassword} />
              )}
            </div>
          )}
          {state.error.err_password && (
            <p className="text-sm text-red-500">{state.error.err_password}</p>
          )}
        </div>

        <div className="w-full flex justify-end py-1">
          <NavLink
            to="password"
            className="text-blue-500 underline text-sm cursor-pointer"
          >
            Forgot password?
          </NavLink>
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-4 text-white transition-all duration-300 bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Log in ..." : "Log in"}
        </button>
      </form>
    </>
  );
};
