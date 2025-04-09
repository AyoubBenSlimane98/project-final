import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { useAuthStore, useEmailStore } from '../../store';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';


const changePass = async ({ email, password }: { email: string, password: string }) => {
    const response = await fetch('http://localhost:4000/api/authentication/change-password', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        throw new Error('Cannot update password');
    }

    return response.json();
};

const ChangePassword = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const email = useEmailStore((state) => state.email)
    const [form, setForm] = useState({ password: "", confrimPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
        if (error) {
            setError('can not update password');
        }
    };
    const { mutate } = useMutation({
        mutationFn: changePass,
        onSuccess: (data) => {
            setIsLoading(true)
            const { accessToken, refreshtoken } = data.token;
            sessionStorage.removeItem('userEmail')
            setAccessToken(accessToken);
            Cookies.set('refreshToken', refreshtoken, { expires: 30, secure: true, sameSite: 'Strict' });
            setTimeout(() => {
                setIsLoading(false)
                if (data.role === "admin") { navigate('/admin') }
                if (data.role === "etudiant") { navigate('/etudiant') }
                if (data.role === "enseignant_responsable") { navigate('/ens-responsable') }
                if (data.role === "enseignant_principal") { navigate('/ens-principale') }

            }, 3000)
        },
        onError: (error) => {
            console.error("Login failed:", error);
            setError(error.message);
        },
    })
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (form.password !== form.confrimPassword) {
            setError('Passwords do not match');
            return;
        }

        mutate({ email, password: form.password });
    };
    return (
        <main className="md:p-4 bg-[#f2f4f8] w-full h-svh  flex justify-center items-center overflow-hidden">
            <section className='bg-white flex flex-col gap-6 px-8 py-10 rounded-2xl shadow '>
                <div className=''>
                    <h3 className='text-[1.8rem] font-medium pb-1'>
                        Create new password
                    </h3>
                    <p>Your new password must be different from previous passwords.</p>
                </div>
                <form className='w-full flex flex-col' onSubmit={handleSubmit} >
                    <input type="text" name="username" autoComplete="username" hidden />
                    <div className='relative mb-4'>
                        <input
                            type={showPassword ? "text" : "password"}
                            name='password'
                            autoComplete="new-password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder='Password'
                            className={`outline-none border px-4 py-2.5 rounded-lg w-full mb-1 ${error ? "border-red-500" : "border-gray-400"}`}
                        />
                        {form.password.length > 0 && (
                            showPassword ? (
                                <FaEye className='absolute right-2.5 top-4 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                            ) : (
                                <FaEyeSlash className='absolute right-2.5 top-4 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                            )
                        )}
                    </div>
                    <div className='relative mb-4'>
                        <input
                            type={showConfirm ? "text" : "password"}
                            name='confrimPassword'
                            autoComplete="current-password"
                            value={form.confrimPassword}
                            onChange={handleChange}
                            placeholder='Confirm password'
                            className={`outline-none border px-4 py-2.5 rounded-lg w-full mb-1 ${error ? "border-red-500" : "border-gray-400"}`}
                        />
                        {form.confrimPassword.length > 0 && (
                            showConfirm ? (
                                <FaEye className='absolute right-2.5 top-4 cursor-pointer' onClick={() => setShowConfirm(!showConfirm)} />
                            ) : (
                                <FaEyeSlash className='absolute right-2.5 top-4 cursor-pointer' onClick={() => setShowConfirm(!showConfirm)} />
                            )
                        )}
                    </div>
                    {error && <p className='text-red-500 '>password incorrect try agin </p>}
                    <div className='w-full flex items-center gap-4 '>

                        <button
                            className='bg-green-600 text-white py-2.5 rounded-lg hover:bg-gray-800 transform duration-300 focus:scale-[0.99] shadow w-full'
                            type="submit"

                        >
                            {isLoading ? "Change..." : "Change"}
                        </button>
                        <button
                            className='bg-red-600 text-white py-2.5 rounded-lg hover:bg-gray-800 transform duration-300 focus:scale-[0.99] shadow w-full'
                            type="submit"
                            onClick={() => navigate('/sign-in')}
                        >
                            cancel
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}

export default ChangePassword