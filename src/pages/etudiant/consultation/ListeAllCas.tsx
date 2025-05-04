import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAuthStore, useEtudiantStore } from "../../../store";
import { useShallow } from "zustand/shallow";
import { IoMdCheckmark } from "react-icons/io";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { AiOutlineDingding } from "react-icons/ai";

const getInfoEtudiant = async (accessToken: string) => {
    const response = await fetch(`http://localhost:4000/api/eutdaint/binome`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch data of binome!");
    return response.json();
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


function InfoCas({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {


    return (

        <div className="shrink-0 w-full h-20 bg-white rounded-2xl flex items-center justify-between px-6 drop-shadow shadow border border-gray-50 cursor-pointer ">
            <p className="max-w-4xl text-nowrap line-clamp-1  ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis molestias
            </p>
            <button className="border border-gray-300 w-32 py-1.5 rounded-full hover:bg-black hover:text-white hover:border-none transform duration-300 ease-in-out transition-all cursor-pointer" onClick={() => setIsOpen(true)}>Détails</button>

        </div>
    )
}

const getIdOfSujet = async ({
    idG,
    accessToken,
}: {
    idG: number;
    accessToken: string;
}) => {

    const response = await fetch(`http://localhost:4000/api/responsable/sujet-groupe/${idG}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch for get id of sujet groupe");
    return response.json();
};

type Actor = {
    acteur: string;
};
const getAllCasofSujet = async ({
    idS,
    acteur,
    accessToken,
}: {
    idS: number;
    acteur: string;
    accessToken: string;
}) => {
    console.log('idS:', idS, typeof idS);
    const response = await fetch(`http://localhost:4000/api/responsable/cas-sujet?idS=${idS}&acteur=${acteur}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch for get id of sujet groupe");
    return response.json();
};
const getAllActorOfCas = async ({
    idS,
    accessToken,
}: {
    idS: number;
    accessToken: string;
}) => {

    const response = await fetch(`http://localhost:4000/api/responsable/sujet/${idS}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch for get id of sujet groupe");
    return response.json();
};

type Cas = {
    idCas: number;
    cas: string;
    statut: boolean;
};

type CustomSelectGroupeProps = {
    responsable: Actor[];
    label: string;
};

function CustomGroupSelect({ responsable, label }: CustomSelectGroupeProps) {
    const acteur = useEtudiantStore((state) => state.acteur)
    const setActeur = useEtudiantStore((state) => state.setActeur)
    const [isOpen, setIsOpen] = useState(false);
    const [dataResponsable, setDataResponsable] = useState<Actor[]>(responsable);
    const [itemSelection, setItemSelection] = useState<Actor | null>(null);

    useEffect(() => {
        if (responsable.length > 0) {
            setDataResponsable(responsable);
            setActeur(responsable[0].acteur);
            setItemSelection(responsable[0]);
        } else {
            setDataResponsable([]);
            setItemSelection(null);
        }
    }, [responsable, setActeur]);


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        const filtered = responsable.filter(item =>
            item.acteur.toLowerCase().includes(value)
        );
        setDataResponsable(filtered);
        if (filtered.length > 0) {
            setActeur(filtered[0].acteur);
            setItemSelection(filtered[0]);
        } else {
            setItemSelection(null);
        }
    };

    const handleSelection = (item: Actor) => {
        setItemSelection(item);
        setActeur(item.acteur);
        setIsOpen(false);
    };

    return (
        <div className="w-full flex items-center justify-between gap-2 text-[#09090B] mb-4">
            <h2 className="block mb-2 text-md font-medium text-gray-900">{label}</h2>
            <div className="relative w-1/2">
                <div className="relative mb-2">
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4"
                        onChange={handleChange}
                        value={acteur}
                        onClick={() => setIsOpen(!isOpen)}
                        readOnly
                    />
                    {isOpen ? (
                        <FiChevronUp
                            className="absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform transition-all"
                            onClick={() => setIsOpen(false)}
                        />
                    ) : (
                        <FiChevronDown
                            className="absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform transition-all"
                            onClick={() => setIsOpen(true)}
                        />
                    )}
                </div>

                {isOpen && (
                    <ul className="absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto">
                        {dataResponsable.length > 0 ? (
                            dataResponsable.map((item) => (
                                <li
                                    key={item.acteur}
                                    className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${itemSelection?.acteur === item.acteur ? 'bg-[#F4F7FD]' : ''
                                        } transition-all`}
                                    onClick={() => handleSelection(item)}
                                >
                                    <span>
                                        {itemSelection?.acteur === item.acteur ? (
                                            <IoMdCheckmark className="text-sm text-[#7CFC00]" />
                                        ) : (
                                            <span className="w-3.5" />
                                        )}
                                    </span>
                                    <span className="font-medium">{item.acteur}</span>
                                </li>
                            ))
                        ) : (
                            <li className="py-1 px-2.5 text-gray-500">Aucun résultat trouvé</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
function CasInfo({ cas }: { cas: string }) {

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
const ListeAllCas = () => {

    const accessToken = useAuthStore((state) => state.accessToken)
    const { acteur, idG, idS, setBinomeId, setGroupId, setSujetId } = useEtudiantStore(useShallow((state) => ({
        acteur: state.acteur,
        idG: state.idG,
        idS: state.idS,
        setBinomeId: state.setBinomeId,
        setGroupId: state.setGroupId,
        setSujetId: state.setSujetId,
    })))

    const { data: dataEtudiant, } = useQuery({
        queryKey: ['dataEtudiant', accessToken,],
        queryFn: async () => {
            if (accessToken === undefined) throw new Error('accessToken not found')
            return await getInfoEtudiant(accessToken);
        },
        enabled: !!accessToken,
        staleTime: 0,
        gcTime: 0
    });
    useEffect(() => {
        if (dataEtudiant) {
            setBinomeId(dataEtudiant.idB);
            setGroupId(dataEtudiant.idG)
        }
    }, [dataEtudiant, setBinomeId, setGroupId]);
   

    const { data: sujetId } = useQuery({
        queryKey: ['sujet-id', idG],
        queryFn: () => getIdOfSujet({ accessToken: accessToken!, idG }),
        enabled: !!accessToken && idG !== -1,
        staleTime: 0,
        gcTime: 0
    });

    useEffect(() => {
        if (sujetId) {
            setSujetId(sujetId.idS)
        }
    }, [setSujetId, sujetId])
    const { data: acteurSujet } = useQuery({
        queryKey: ['acteurSujet', idS],
        queryFn: () => getAllActorOfCas({ accessToken: accessToken!, idS }),
        enabled: !!accessToken && idS !== -1,
        staleTime: 1000 * 60 * 30,
    });

    const { data: casList } = useQuery({
        queryKey: ['casList', idS, acteur],
        queryFn: () => getAllCasofSujet({ accessToken: accessToken!, idS, acteur }),
        enabled: !!accessToken && idS !== -1 && acteur !== undefined,
        staleTime: 1000 * 60 * 30,
    });

    return (
        <section className="  w-full h-svh  bg-slate-100 px-40 mt-8 flex flex-col justify-center items-center ">
            <div className="bg-white w-full py-10 px-8 rounded-md drop-shadow border border-gray-200">
                <div className="w-4xl mb-10">
                    <h2 className="text-4xl font-medium">Consultaion les cas de theme </h2>
                </div>

                {acteurSujet && <CustomGroupSelect responsable={acteurSujet} label="Selection un acteur pour affiche all cas : " />}

                <div className=" drop-shadow border border-gray-200 px-4 py-4  h-96 overflow-hidden hover:overflow-auto rounded-md  ">
                    {casList?.map((item: Cas) => (
                        <CasInfo key={item.idCas} cas={item.cas} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ListeAllCas