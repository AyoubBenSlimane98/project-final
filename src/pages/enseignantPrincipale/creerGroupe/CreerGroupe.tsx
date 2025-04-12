import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { NavLink } from "react-router";
import { useAuthStore } from "../../../store";
import { PiWarningFill } from "react-icons/pi";

export type BinomeWithStudents = {
    id: number;
    Etudaint1: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        matricul: string;
        sexe: "Female" | "Male";
        dateNaissance: string;
    };
    Etudaint2: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        matricul: string;
        sexe: "Female" | "Male";
        dateNaissance: string;
    } | null;
};
const getListBinommes = async () => {
    const response = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) throw new Error("Cannot fetch binômes!");
    return response.json();
};
const getCountBinommes = async () => {
    const response = await fetch("http://localhost:8080/api/user/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) throw new Error("Cannot fetch binômes!");
    return response.json();
};

const createGroupes = async ({ accessToken, id, users }: { accessToken: string, id: number, users: BinomeWithStudents }) => {
    const response = await fetch(`http://localhost:4000/api/principal/create-groupe/${id}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ users })
    })
    if (!response.ok) throw new Error('can not created this groupe')
    return response.json()
}
const CreerGroupe = () => {
    const accessToken = useAuthStore((state) => state.accessToken)
    const [users, setUsers] = useState();
    const [value, setValue] = useState<number>(1);
    const [count, setCount] = useState<number>(0)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isError, setError] = useState<boolean>(false)

    const groupSize = Math.ceil(count / value);
    const groupes = [];
    let remaining: number = count;
    let index: number = 1;
    while (remaining > 0) {
        const binomesInGroup = Math.min(groupSize, remaining);
        groupes.push({ name: `Groupe ${index}`, binomes: binomesInGroup });
        remaining -= binomesInGroup;
        index++;
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const newValue = event.target.value;
        if (newValue === "") {
            setValue(1);
            return;
        }
        const numericValue = Number(newValue);
        if (numericValue >= 1 && numericValue <= 20) {
            setValue(numericValue);

        }
    };
    const { data: countData } = useQuery({
        queryKey: ["count"],
        queryFn: getCountBinommes
    })
    const {
        data: binomesData,
    } = useQuery({ queryKey: ["binomes"], queryFn: getListBinommes, });


    useEffect(() => {
        if (countData) {
            setCount(countData.count)
        }
    }, [countData])
    useEffect(() => {
        if (binomesData) {
            setUsers(binomesData)
        }
    }, [binomesData])
    const { mutate } = useMutation({
        mutationFn: ({ accessToken, id, users }: { accessToken: string, id: number, users: BinomeWithStudents }) => createGroupes({ accessToken, id, users }),
        onSuccess: (data) => {
            console.log("data: ", data)
        },
        onError: (error) => {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 6000)
            console.warn(error)
        }
    })
    const handleSubmit = () => {
        if (accessToken && users) { mutate({ accessToken, id: value, users }) }
    }
    return (
        <section className="w-full h-svh px-6 pb-10 flex flex-col justify-center items-center gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-hidden bg-[#F4F7FD] relative">
            <div className="w-[580px] h-72 bg-white rounded-[20px] flex flex-col justify-center items-center drop-shadow-md shadow ">

                <div className="w-full px-10 mb-4">
                    <h2 className="font-medium text-lg">
                        Entrez le nombre de binome que vous souhaitez dans une groupe créé :
                    </h2>
                </div>

                <div className="w-full  relative  px-10">
                    <input
                        type="number"
                        className={`border-[1.5px]  w-full py-2 rounded-md px-4 border-gray-400`}
                        value={value ?? ""}
                        onChange={handleChange}
                    />

                </div>

                <div className={`${count > 0 && value > 1 ? " justify-between" : "justify-end "} w-full px-11 flex items-center py-2   mb-2 `}>
                    {value !== 1 && <p className="text-sm">    Il sera créé <span className="text-blue-500">{value}</span> groupes <span className=" underline text-blue-500 cursor-pointer" onClick={() => setIsOpen(true)}>détails</span></p>}
                    <NavLink to="/ens-principale/creer-groupes/liste-binomes" className="text-blue-500 text-sm font-medium underline">
                        Liste des binômes
                    </NavLink>
                </div>
                {isOpen && <ul className="space-y-1 px-4 py-4 absolute w-80 bg-white z-50 shadow drop-shadow rounded-md  ">
                    <div className="w-full flex items-center justify-end"><IoCloseOutline onClick={() => setIsOpen(false)} className=" text-xl hover:text-red-500 transform duration-200 ease-in-out transition" /></div>
                    {groupes.map((groupe, idx) => (
                        <li key={idx} className="text-sm text-gray-700 hover:bg-slate-100 py-0.5 px-2 transform duration-200 ease-in-out transition">
                            <p>{groupe.name} : <strong>{groupe.binomes}</strong> binôme{groupe.binomes > 1 ? "s" : ""}</p>
                        </li>
                    ))}
                </ul>}


                <div className="w-full flex items-center justify-center gap-x-6 px-10">
                    <button
                        onClick={handleSubmit}
                        type="button"
                        className="outline-none basis-1/2 border-none bg-blue-500 hover:bg-blue-600 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
                    >
                        Créer
                    </button>
                    <button
                        onClick={() => setValue(1)}
                        type="button"
                        className="outline-none basis-1/2 border-none bg-red-500 hover:bg-red-700 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
                    >
                        Annuler
                    </button>
                </div>
            </div>
            <div className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${isError ? "bottom-10" : "-bottom-20"} `}>
                <PiWarningFill className=" text-yellow-500 text-3xl" />   <p>Désolé, cette fonctionnalité n'est pas disponible pour le moment. Les groupes ont déjà été créés.</p>
            </div>
        </section>
    );
};

export default CreerGroupe;

