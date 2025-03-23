import { useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { NavLink } from "react-router";

type formPros = {
    email: string;
    password: string;
    isAcepet: boolean;
};

const SignIN = () => {
    const [form, setForm] = useState<formPros>({
        email: "",
        password: "",
        isAcepet: false,
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [, setError] = useState<boolean>(false);
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
    const handleSumbit = () => {
        setError(false);
        const user = { email: "ayyoub@gmail.com", password: "123456" };
        if (form.email === user.email && form.password === user.password) {
            window.localStorage.setItem("accessToken", "yes");
            console.log("is login");
            setError(true);
        }
    };
    return (
        <div className='w-full min-h-screen flex justify-center items-center bg-[#f2f4f8] '>
            <div className='bg-white flex flex-col gap-6 px-8 py-10 rounded-2xl shadow w-[31rem]'>
                <div className='flex flex-col justify-center items-center '>

                    <div className='text-center'>
                        <h3 className='text-[1.8rem] font-medium pb-1'>Welcome back</h3>
                        <p className='text-[1rem] font-light pb-2'>
                            Please enter your details to sign in.
                        </p>
                    </div>

                </div>
                <form className='flex flex-col gap-5' onSubmit={handleSumbit}>
                    <input
                        type='email'
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                        placeholder='Enter your email'
                        className=' outline-none border  border-gray-400 px-4 py-2.5 rounded-lg w-full mb-4'
                    />
                    <div className='relative'>
                        <input
                            type={`${showPassword ? "text" : "password"}`}
                            name='password'
                            value={form.password}
                            onChange={handleChange}
                            placeholder='Enter your password'
                            className=' outline-none border  border-gray-400 px-4 py-2.5 rounded-lg w-full duration-300 ease-in-out '
                        />
                        {form.password.length > 0 ? (
                            showPassword ? (
                                <FaEye
                                    className=' absolute right-2.5 top-4  duration-300 ease-in-out'
                                    onClick={handelPassword}
                                />
                            ) : (
                                <FaEyeSlash
                                    className=' absolute right-2.5 top-4 duration-300 ease-in-out'
                                    onClick={handelPassword}
                                />
                            )
                        ) : (
                            ""
                        )}
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='checkbox'
                                name='isAcepet'
                                id='acepet'
                                className=' cursor-pointer'
                                checked={form.isAcepet}
                                onChange={handleChange}
                            />
                            <label htmlFor='acepet' className=' select-none'>
                                Remember me
                            </label>
                        </div>
                        <div>
                            <NavLink
                                to='/password'
                                className='select-none underline text-lg hover:text-blue-500'
                            >
                                Forgot password?
                            </NavLink>
                        </div>
                    </div>
                    <button className='bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transform duration-300 focus:scale-[0.99] shadow' type="submit">
                        Sign in
                    </button>
                </form>
                <div className='flex items-center justify-center gap-x-0.5 p'>
                    <p className='font-light'>
                        Are you teacher and don't have an account yet?
                    </p>
                    <NavLink to='/sign-up' className='font-bold '>
                        Sing Up
                    </NavLink>
                </div>
            </div>
        </div>
    );
};



export default SignIN;

<div className=' relative border-b mb-4'>
    <span className='w-10 text-center absolute -top-3 bg-white left-1/2 -translate-x-1/2  uppercase text-[0.9rem] font-normal '>
        or
    </span>
</div>