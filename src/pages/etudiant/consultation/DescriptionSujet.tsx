import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "../../../store";
import { AiOutlineDingding } from "react-icons/ai";

type SujetTheme = {
    titre: string;
    description: string;
}

type RefrenceTheme = {
    reference: string;
}

type PrequesTheme = {
    prerequis: string;
}

const getSujetGroupe = async (accessToken: string) => {
    console.log("access token : ", accessToken)
    const response = await fetch(
        "http://localhost:4000/api/eutdaint/sujet",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) throw new Error("Unable to fetch sujet data");
    return response.json();
}

function CardInfo({ cas }: { cas: string }) {

    return (
        <div className="group">
            <p className="flex items-center justify-between px-4 py-3 font-serif text-gray-900 text-nowrap hover:bg-black hover:rounded hover:text-white transition-all duration-300 ease-in-out cursor-pointer">
                <AiOutlineDingding className="text-xl" />
                <span className="mx-2 text-center flex-1">{cas}</span>
                <AiOutlineDingding className="text-xl" />
            </p>
            <hr className="text-gray-200 mb-2 transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:h-0" />
        </div>


    );
}
const DescriptionSujet = () => {
    const accessToken = useAuthStore(useShallow((state) => state.accessToken));
    const [sujet, setSujet] = useState<SujetTheme>({ titre: "", description: "" });
    const [refrenceTheme, setRefrenceTheme] = useState<RefrenceTheme[]>([]);
    const [prequesTheme, setPrequesTheme] = useState<PrequesTheme[]>([]);

    // Fetch data using React Query
    const { data, error, isLoading } = useQuery({
        queryKey: ["sujetGroupe", accessToken],
        queryFn: ({ queryKey }) => {
            const [, accessToken] = queryKey;
            return getSujetGroupe(accessToken!);
        },
        enabled: !!accessToken,
    });

    // Update state once data is fetched
    useEffect(() => {
        if (data) {
            setSujet({
                titre: data.titre || "Default Title",
                description: data.description || "Default description text",
            });
            setRefrenceTheme(data.reference || []);
            setPrequesTheme(data.prerequis || []);
        }
    }, [data]);

    // Loading and error handling
    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error instanceof Error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <section className="w-full py-6 mt-20 flex flex-col items-center justify-center bg-[#F4F7FD]">
            <div className="w-6xl flex flex-col gap-8">
                <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-4">
                    <div className="w-4xl mb-4">
                        <h2 className="text-4xl font-medium">Description sujet</h2>
                    </div>
                    <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2 ">
                        <h2 className="font-medium text-lg">Nom du project :</h2>
                        <p className="font-light text-gray-800 px-2">{sujet.titre}</p>
                    </div>
                    <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2">
                        <h2 className="font-medium text-lg">Description :</h2>
                        <p className="font-light text-gray-800 text-justify leading-relaxed px-2 indent-8">{sujet.description}</p>
                    </div>
                    <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2">
                        <h2 className="font-medium text-lg mb-2">References :</h2>
                        <ul className=" cursor-pointer overflow-hidden w-full px-4  flex flex-col gap-2 rounded-md  hover:overflow-auto   *:rounded-md transform duration-300 ease-in-out transition-all min-h-60 max-h-72 ">
                            {refrenceTheme.map((refs, index) => (
                                <CardInfo key={index} cas={refs.reference} />
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2">
                        <h2 className="font-medium text-lg mb-2">Prerequis :</h2>
                        <ul className=" cursor-pointer overflow-hidden w-full px-4  flex flex-col gap-2 rounded-md  hover:overflow-auto   *:rounded-md transform duration-300 ease-in-out transition-all min-h-60 max-h-72 ">
                            {prequesTheme.map((item, index) => (
                                <CardInfo key={index} cas={item.prerequis} />
                            ))}
                        </ul>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default DescriptionSujet;

