import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router';
import { Input } from './SignUP';
import { useEmailStore } from '../../store';
import { useMutation } from '@tanstack/react-query';

const sendOtpToEmail = async (email: string) => {
    console.log("fetecheing : ", email)
    const response = await fetch('http://localhost:4000/api/authentication/send-otp', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({email})
    })
    if (!response.ok) {
        throw new Error('Email not valid!')
    }
    return response.json();
}
const ForgotPassword = () => {
    const setEmailStore = useEmailStore((state) => state.setEmail);
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('')
    const [error, setError] = useState<boolean>(false)
    const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setEmail(event.target.value)
        setError(false)
    }
    const validateEmail = () => {
        const emailRegex =
            /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    const handleSubmitSearch = () => {
        if (validateEmail()) {
            mutate(email)

        } else {
            setError(true);
        }
    }
    const { mutate } = useMutation({
        mutationFn: sendOtpToEmail,
        onSuccess: () => {
            setEmailStore(email);
            navigate("/password/reset-email");
        },
        onError: (error) => {
            setError(true)
            console.warn("Warnnig : ", error)
        }
    })
    return (
        <main className='w-full h-svh flex justify-center items-center bg-[#f2f4f8]'>
            <div className='bg-white rounded-lg px-8 py-6 shadow w-xl'>
                <div>
                    <h5 className=' font-semibold text-[1.6rem] mb-3'>Find Your Account </h5>
                    <hr className='text-gray-400 mb-4' />
                    {error && <div className='border border-red-600 rounded py-2 px-3'>
                        <h6 className='text-[1.1rem] font-medium text-red-600'>No Search Results</h6>
                        <p className='font-extralight'>your search did not return any results. Please try again <br /> with other information .</p>
                    </div>}
                </div>
                <div className='w-full flex flex-col gap-4 mt-4'>
                    <p className='text-[1.1rem] '>Please enter your email address to search for your acount </p>
                    <Input placeholder='Email address ... ' value={email} onChange={handleChangeSearch} className='w-full placeholder:text-gray-800 focus:placeholder:text-gray-400 duration-300 mb-3' />

                    <hr className='text-gray-400 mb-4' />
                </div>
                <div className='flex justify-end items-center  gap-3 pt-4'>
                    <button className=' bg-slate-200 px-4 py-1.5 rounded-md text-[1.1rem] font-medium hover:bg-slate-300 duration-300' onClick={() => navigate('/')}><NavLink to='/'>Cancel</NavLink></button>
                    <button className=' bg-blue-500   text-white px-4 py-1.5 rounded-md text-[1.1rem] font-medium hover:bg-blue-600 duration-300' type='submit' onClick={handleSubmitSearch}> Search</button>
                </div>
            </div>
        </main>
    )
}

export default ForgotPassword;