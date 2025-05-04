
import { AiOutlineDingding } from "react-icons/ai";

import { useAuthStore, useEtudiantStore } from "../../../store";
import { useShallow } from "zustand/shallow";
import { useQuery } from "@tanstack/react-query";
type CasItem = {
    idCas: number;
    acteur: string;
    cas: string;
};
const getAllCas = async ({ idG, accessToken }: { idG: number; accessToken: string }) => {
    const response = await fetch(`http://localhost:4000/api/eutdaint/cas/${idG}/groupe`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch les Cas!");
    return response.json();
};
function CardInfo({ cas }: { cas: CasItem }) {
    return (
        <div className="group">
            <p className="flex items-center justify-between px-4 py-3 font-serif text-gray-900 text-nowrap hover:bg-black hover:rounded hover:text-white transition-all duration-300 ease-in-out cursor-pointer">
                <AiOutlineDingding className="text-xl" />
                <span className="mx-2 text-center flex-1">{cas.acteur}</span>
                <span className="mx-2 text-center flex-1">{cas.cas}</span>
                <AiOutlineDingding className="text-xl" />
            </p>
            <hr className="text-gray-200 mb-2 transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:h-0" />
        </div>
    );
}
const ListeCasEtud = () => {
    const accessToken = useAuthStore((state) => state.accessToken)
    const { idG, } = useEtudiantStore(useShallow((state) => ({
        idG: state.idG,
    })))
    const { data: dataListCas, } = useQuery({
        queryKey: ['CasList', accessToken, idG],
        queryFn: async () => {
            if (accessToken === undefined) throw new Error('accessToken not found')
            return await getAllCas({ accessToken, idG });
        },
        enabled: !!accessToken && idG !== -1,
        staleTime: 0,
        gcTime: 0
    });
    
    return (
        <section className="  w-full h-svh  flex justify-center items-center bg-slate-100 ">
            <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2 w-6xl text-xl h-[500px]  ">
                <div className="flex items-center  justify-between px-6 py-3 font-serif text-gray-900 text-nowrap  rounded-md">
                    <span>Acteur</span>
                    <span>cas d'utilisation</span>
                </div>
                <hr className="text-gray-300"/>
                <ul className=" cursor-pointer overflow-hidden w-full h-full px-4 flex flex-col gap-2 rounded-md  hover:overflow-auto   *:rounded-md transform duration-300 ease-in-out transition-all  ">
                    {dataListCas?.map((item: CasItem) => (
                        <CardInfo key={item.idCas} cas={item} />
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default ListeCasEtud
