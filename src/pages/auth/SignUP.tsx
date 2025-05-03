import { useMemo, useState, useReducer, InputHTMLAttributes, useId } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { PiSealQuestionFill } from "react-icons/pi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaCaretDown, FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store";

type Role = 'Principale' | 'Responsable';
interface TypeData {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    dateNaissance: string;
    sexe: string;
    role: Role;
}
const registerFn = async ({ ...data }: TypeData) => {
    const response = await fetch('http://localhost:4000/api/authentication/sign-up', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...data })
    });
    if (!response.ok) {
        throw new Error("Conflict Data ,this Email already exists")
    }
    return response.json();
}

interface State {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    dateNaissance: {
        day: string;
        month: string;
        year: string;
    };
    sexe: string;
    role: Role;
}
type Action =
    | { type: "input"; field: keyof State; value: string }
    | { type: "input"; field: "dateNaissance"; value: State["dateNaissance"] };

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    type?: string;
    className?: string;
    label?: string;
};

type SelectProps = InputHTMLAttributes<HTMLSelectElement> & InputHTMLAttributes<HTMLSelectElement> & {
    options?: (string | number)[];

}
const SelectComponent = ({ options, ...props }: SelectProps) => {
    const id = useId();

    return (
        <div className='w-full relative '>
            <select
                {...props}
                id={id}
                className='w-full border border-gray-400 outline-none flex-1 py-1.5 rounded-lg hover:bg-slate-50 duration-300 appearance-none  px-3 font-normal text-gray-800 text-[0.9rem]'

            >
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <div className='bg-slate-200 w-8 h-full border border-gray-400 outline-none   absolute top-0 right-0  flex justify-center items-center rounded-r-lg'>
                <FaCaretDown className=' text-gray-800  ' />
            </div>
        </div>
    );
};
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
const currentYear = new Date().getFullYear();
const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
] as string[];


const convertToISOString = (dob: { day: string; month: string; year: string }): string => {
    const date = new Date(`${dob.day} ${dob.month} ${dob.year}`);
    return date.toISOString();
};
export const Input = ({ type = "text", className, label, ...props }: InputProps) => {
    const id = useId();

    return (
        <>
            {label && (
                <label
                    htmlFor={id}
                    className={`border border-gray-400 outline-none  py-2.5 px-2 rounded-lg flex items-center justify-between flex-1  has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-900 has-[:checked]:ring-indigo-200 ${className}`}
                >
                    {label}
                    <input type={type} id={id} {...props} />
                </label>
            )}
            {!label && (
                <input
                    type={type}
                    className={`border border-gray-400 outline-none  py-2.5 px-4 rounded-lg ${className}`}
                    {...props}
                />
            )}
        </>
    );
};
const initialState: State = {
    nom: "",
    prenom: "",
    email: "",
    password: "",
    dateNaissance: {
        day: currentDay.toString(),
        month: months[currentMonth],
        year: currentYear.toString(),
    },
    sexe: "Male",
    role: "Responsable"
};

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case "input":
            return {
                ...state,
                [action.field]: action.value,
            };
        default:
            return state;
    }
};

const role: string[] = ["------------------- what is your role ? -------------------", "Responsable", "Principale", 'Both'];

const SignUP = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showQue, setShowQue] = useState<boolean>(false);
    const [closeFrom, setCloseFrom] = useState<boolean>(false);
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const days = useMemo<number[]>(
        () => Array.from({ length: 31 }, (_, i) => i + 1),
        []
    );

    const years = useMemo<number[]>(() => {
        const currentYear = new Date().getFullYear();
        return Array.from(
            { length: currentYear - 1940 + 1 },
            (_, i) => currentYear - i
        );
    }, []);

    const handelQuestion = () => {
        setShowQue(!showQue);
    };
    const handelCloseForm = () => {
        setCloseFrom(!closeFrom);
        navigate('/sign-in');
    };
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        event.preventDefault();
        const { name, value } = event.target;
        if (name === "day" || name === "month" || name === "year") {
            dispatch({
                type: "input",
                field: "dateNaissance",
                value: { ...state.dateNaissance, [name]: value },
            });
        } else {
            dispatch({
                type: "input",
                field: name as keyof State,
                value: value,
            });
        }
    };
    const handelPassword = () => {
        setShowPassword(!showPassword);
    };
    const { mutate } = useMutation({
        mutationFn: registerFn,
        onSuccess: (data) => {
            setIsLoading(true)
            const { accessToken, refreshtoken } = data.token;
            setAccessToken(accessToken);
            Cookies.set('refreshToken', refreshtoken, { expires: 30, secure: true, sameSite: 'Strict' });
            setTimeout(() => {
                setIsLoading(false)
                if (data.message === "Responsable created successfully") {
                    navigate('/ens-responsable')
                }
                if (data.message === "Principale created successfully") {
                    navigate('/ens-principale')
                }

            }, 3000)
            console.log('Logged in successfully');
        },
    })
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { nom, prenom, email, password, dateNaissance, role, sexe } = state;
        const dobISO = convertToISOString({
            ...dateNaissance
        });
        mutate({ nom, prenom, email, dateNaissance: dobISO, password, role, sexe })
    };
    return (
        <div
            className='w-full h-screen flex justify-center items-center bg-[#f2f4f8] '
        >
            <form
                className='bg-white flex flex-col gap-4 px-8 py-9 rounded-2xl shadow w-[31rem]'
                onSubmit={handleSubmit}
            >
                <div className=' relative'>
                    <h2 className='text-3xl pb-2'>Sign Up</h2>
                    <span>It’s quick and easy.</span>
                    <IoCloseCircleOutline
                        className=' absolute -top-5 -right-4 text-2xl text-gray-400 '
                        onClick={handelCloseForm}
                    />
                </div>
                <hr />
                <div className='flex justify-between gap-4 mb-2'>
                    <Input
                        placeholder='First Name'
                        autoComplete="nom"
                        name='nom'
                        value={state.nom}
                        onChange={handleChange}
                        className='flex-1 '
                    />
                    <Input
                        placeholder='Last Name'
                        name='prenom'
                        autoComplete='prenom'
                        value={state.prenom}
                        onChange={handleChange}
                        className='flex-1'
                    />
                </div>
                <Input
                    placeholder='Email'
                    name='email'
                    autoComplete="email"
                    value={state.email}
                    onChange={handleChange}
                    type='email'
                    className='mb-2'
                />
                <div className=" relative">
                    <input autoComplete="password" type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={state.password} onChange={handleChange} className={`border border-gray-400 outline-none  py-2.5 px-4 rounded-lg w-full`} />
                    {state.password.length > 0 ? (
                        showPassword ? (
                            <FaEye
                                className=' absolute right-3 top-4  duration-300 ease-in-out'
                                onClick={handelPassword}
                            />
                        ) : (
                            <FaEyeSlash
                                className=' absolute right-3 top-4 duration-300 ease-in-out'
                                onClick={handelPassword}
                            />
                        )
                    ) : (
                        ""
                    )}
                </div>

                <div className='flex flex-col gap-2 relative '>
                    <div className='flex items-center gap-1'>
                        <h5 className='text-[1rem] font-light'>Date of birth</h5>
                        <PiSealQuestionFill
                            className='text-green-600'
                            onClick={handelQuestion}
                        />
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <SelectComponent
                            options={days}
                            defaultValue={state.dateNaissance.day}
                            name='day'
                            onChange={handleChange}
                        />
                        <SelectComponent
                            options={months}
                            defaultValue={state.dateNaissance.month}
                            name='month'
                            onChange={handleChange}
                        />
                        <SelectComponent
                            options={years}
                            defaultValue={state.dateNaissance.year}
                            name='year'
                            onChange={handleChange}
                        />
                    </div>
                    {showQue && (
                        <div className=' absolute px-2 py-2.5 w-80 text-sm bg-white -left-[19.35rem] rounded-sm shadow-inner  drop-shadow-md shadow-black/10 duration-300'>
                            <p className=' leading-normal'>
                                <strong>Providing your birthday</strong> helps make sure that
                                you get the right <strong>OnionLog</strong> experience for your
                                age. If you want to change who sees this, go to the About
                                section of your profile
                            </p>
                        </div>
                    )}
                </div>
                <div className='w-full flex flex-col gap-2 mb-2'>
                    <h5 className='text-[1rem] font-light'>Gender</h5>
                    <div className='w-full flex items-center justify-center gap-6'>
                        {['Male', 'Female'].map((gender) => (
                            <label htmlFor={gender} key={gender} className={`basis-1/2 border border-gray-400 flex items-center justify-between px-4 py-1.5 rounded-lg ${state.sexe === gender ? "bg-slate-200" : ""}`}>
                                <span >{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                                <input id={gender} type="radio" name="sexe" value={gender} checked={state.sexe === gender} onChange={handleChange} />
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <SelectComponent
                        options={role}
                        defaultValue={role[0]}
                        name='role'
                        onChange={handleChange}
                        className=""
                    />
                </div>
                <button className='bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-800 transform duration-300 focus:scale-[0.99] shadow' type="submit">
                    {isLoading ? "Submit ..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default SignUP;