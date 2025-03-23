import { useState, useRef } from "react";
import { NavLink } from "react-router";
import { useEmailStore } from "../../store";

const ResetEmail: React.FC = () => {
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
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

    return (
        <main className="md:p-4 bg-[#f2f4f8] w-full h-svh  flex justify-center items-center overflow-hidden">
            <div className="lg:w-[540px]  bg-white  rounded-md shadow px-4 py-7  flex flex-col  gap-2 ">
                <div className="mb-2 w-full md:text-center">
                    <p className="font-semibold text-2xl text-center ">
                        Check Your Email
                    </p>
                    <div className="mt-4">
                        <p className="text-sm text-gray-700">
                            We sent a reset link to{" "}
                            <span className="font-bold">{emailStore}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                            Enter the 6-digit code mentioned in the email.
                        </p>
                    </div>
                </div>

                <div className="w-full flex justify-evenly items-center py-2  mb-2">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            className={`border-2 rounded-md w-[40px] h-[40px] md:w-[45px] md:h-[45px] lg:w-[50px] lg:h-[50px] text-2xl text-center focus:outline-none transition duration-200 ${digit ? "border-green-500" : "border-gray-500"
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
                    >
                        Verify Code
                    </button>
               </div>

                <div className=" text-center ">
                    <span className="">Haven't received the email? </span>
                    <NavLink
                        to="/password"
                        className="text-[#0437F2] font-medium cursor-pointer"
                    >
                        Resend email
                    </NavLink>
                </div>
            </div>
        </main>
    );
};

export default ResetEmail;