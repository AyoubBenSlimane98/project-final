import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useEmailStore } from "../../store";
import { useMutation } from "@tanstack/react-query";

const verfiyOTP = async ({ email, otp }: { email: string, otp: string }) => {

    const response = await fetch('http://localhost:4000/api/authentication/verify-otp', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp })
    });

    if (!response.ok) {
        throw new Error("can't fetch data");
    }

    return response.json();
};
const ResetEmail: React.FC = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
    const [errorCode, setErrorCode] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(10 * 60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const emailStore = useEmailStore((state) => state.email);
    const handleChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && code[index] === "") {
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };
    const { mutate } = useMutation({
        mutationFn: verfiyOTP,
        onSuccess: (data) => {

            if (data.valid) {
                navigate('/password/change')
            } else {
                setErrorCode(data.message)
                setTimeout(() => {
                    setCode(["", "", "", "", "", ""]);
                    setErrorCode('')
                }, 4000);
            }

        },
        onError: (error) => {
            setErrorCode(error.message)
            setTimeout(() => {
                setCode(["", "", "", "", "", ""]);
                setErrorCode('')
            }, 4000);

        }

    })
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    return (
        <main className="md:p-4 bg-[#f2f4f8] w-full h-svh  flex justify-center items-center overflow-hidden">
            <div className="lg:w-[540px]  bg-white  rounded-md shadow px-4 py-7  flex flex-col  gap-2 ">
                <div className="mb-2 w-full px-8">
                    <p className="font-semibold text-2xl ">
                        Check Your Email
                    </p>
                    <div className="mt-4">
                        <p className="text text-gray-700">
                            We sent a reset link to{" "}
                            <span className="font-bold">{emailStore}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                            Enter the  6-digit code mentioned in the email <span className={`${timeRemaining == 0 ? "text-red-500" : " text-green-600"} text-lg font-medium px-2`}>{formatTime(timeRemaining)}</span>
                        </p>
                    </div>
                </div>

                <div className="w-full flex justify-evenly items-center py-2  mb-2">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            className={`border-2 rounded-md w-[40px] h-[40px] md:w-[45px] md:h-[45px] lg:w-[50px] lg:h-[50px] text-2xl text-center focus:outline-none transition duration-200 ${errorCode ? "border-red-500" : digit ? "border-green-500" : "border-gray-500"
                                }`}
                            value={digit}
                            onChange={(e) => handleChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                        />
                    ))}
                </div>

                <div className="w-full flex justify-center px-7 pb-2">
                    <button
                        className="bg-[#0096FF] w-full hover:bg-[#4169E1] transition duration-200 text-white font-semibold py-2 rounded "
                        disabled={code.includes("")}
                        onClick={() => mutate({ email: emailStore, otp: code.join('') })}
                    >
                        Verify Code
                    </button>
                </div>

                <div className=" text-center ">
                    <span className="">Haven't received the email? </span>
                    <NavLink
                        onClick={() => { sessionStorage.clear() }}
                        to="/password"
                        className="text-[#0437F2] font-medium cursor-pointer"
                    >
                        Resend email
                    </NavLink>
                </div>
            </div>
        </main >
    );
};

export default ResetEmail;