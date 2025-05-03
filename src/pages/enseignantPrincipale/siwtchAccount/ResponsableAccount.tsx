import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../store";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";


const loginFn = async ({
    form,
    accessToken,
}: {
    form: { email: string; password: string };
    accessToken: string;
}) => {
    const response = await fetch('http://localhost:4000/api/principal/switch-account', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
    });

    if (!response.ok) {
        throw new Error('Email or Password not correct');
    }
    return response.json();
};

function getEmailFromToken(token: string): string | null {
    try {
        const payload = token.split('.')[1]; 
        const decodedPayload = JSON.parse(atob(payload)); 
        return decodedPayload.email || null; 
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

const ResponsableAccount = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    const [form, setForm] = useState({ password: "", email: "" });
    const [showPassword, setShowPassword] = useState(false);
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
        mutationFn: loginFn,
        onSuccess: (data) => {
            setIsLoading(true);
            const { accessToken, refreshtoken } = data.token;

            setAccessToken(accessToken);
            Cookies.set('refreshToken', refreshtoken, { expires: 30, secure: true, sameSite: 'Strict' });
            setTimeout(() => {
                setIsLoading(false);
                if (data.role === "enseignant_responsable") {
                    navigate('/ens-responsable');
                }
            }, 3000);
        },
        onError: (error) => {
            console.error("Login failed:", error);
            setError(error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (accessToken) {
            mutate({ form: { email: form.email, password: form.password }, accessToken });
        }
    };

    useEffect(() => {
        if (accessToken) {
            setForm((prev) => ({ ...prev, email: getEmailFromToken(accessToken) || "" }))
        }
    }, [accessToken])
    return (
        <section className="w-full h-svh px-6 pb-10 flex flex-col justify-center items-center gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-hidden bg-[#F4F7FD]">
            <section className='bg-white w-2xl flex flex-col gap-4 px-8 py-12 rounded-md shadow drop-shadow-xl '>

                <h3 className=' font-medium text-lg'>
                    Entrez votre mot de passe de compte responsable :
                </h3>
                <form className='w-full flex flex-col' onSubmit={handleSubmit}  >
                    <div className='relative mb-4'>
                        <input
                            autoComplete="username"
                            type={showPassword ? "text" : "password"}
                            name='password'
                            value={form.password}
                            onChange={handleChange}
                            placeholder='Mot de passe'
                            className={`outline-none border px-4 py-3 rounded-lg w-full mb-1 ${error ? "border-red-500" : "border-gray-300"}`}
                        />
                        {form.password.length > 0 && (
                            showPassword ? (
                                <FaEye className='absolute text-green-400 right-4 top-4 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                            ) : (
                                <FaEyeSlash className='absolute right-4 top-4 text-gray-400 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                            )
                        )}
                    </div>

                    {error && <p className='text-red-500 '>password incorrect try agin </p>}
                    <div className='w-full flex items-center gap-4 '>

                        <button
                            className='bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transform duration-300 focus:scale-[0.99] shadow w-full'
                            type="submit"

                        >
                            {isLoading ? "Se connecter..." : "Se connecter"}
                        </button>
                        <button
                            className='bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transform duration-300 focus:scale-[0.99] shadow w-full'
                            type="submit"
                            onClick={() => navigate('/sign-in')}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </section>
        </section>
    )
}

export default ResponsableAccount