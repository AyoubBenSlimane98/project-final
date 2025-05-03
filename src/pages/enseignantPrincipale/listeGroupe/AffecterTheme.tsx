import { NavLink } from 'react-router'
import { useAuthStore } from '../../../store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState, } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { GiCheckMark } from 'react-icons/gi'
import { PiWarningFill } from 'react-icons/pi';
import { FaCheckCircle } from 'react-icons/fa';

type AffecterThemeProps = {
    setError: (error: boolean) => void;
    setIsSucces: (succes: boolean) => void
}
type EnseignantResponsable = {
    idU: number;
    nom: string;
    prenom: string;
}
type Sujet = {
    idS: number;
    titre: string;
};
type Groupe = {
    idG: number;
    nom: string;
};
const setSujetToGroup = async (accessToken: string, {
    groupeId,
    enseignantId,
    sujetId,
}: { groupeId: number; enseignantId: number; sujetId: number }) => {
    console.log({ accessToken, groupeId, enseignantId, sujetId })
    const response = await fetch(`http://localhost:4000/api/principal/affect-sujet-group`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            groupeId,
            enseignantId,
            sujetId,
        })
    });
    if (!response.ok) throw new Error("Cannot fetch for get number of groupes");
    return response.json();
}

const getAllGroupes = async (accessToken: string) => {
    const response = await fetch(`http://localhost:4000/api/principal/groupe/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch for get number of groupes");
    return response.json();
};
const getAllResponsableValide = async (accessToken: string) => {
    const response = await fetch('http://localhost:4000/api/responsable', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch for get any ensiagnant responsable");
    return response.json();
};
const getSujetOfResponsable = async ({ enseignantId, accessToken }: { enseignantId: number, accessToken: string }) => {
    const response = await fetch(`http://localhost:4000/api/responsable/${enseignantId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch for get any sujet for  ensiagnant responsable");
    return response.json();
};

type CustomSelectResProps = {
    responsable: EnseignantResponsable[];
    label: string;
    setEnseignantId: (value: number) => void;
};
type CustomSelectSujetProps = {
    responsable: Sujet[];
    label: string;
    setSujetId: (value: number) => void;
};
type CustomSelectGroupeProps = {
    responsable: Groupe[];
    label: string;
    setGroupeId: (value: number) => void;
};

function CustomSelectResponsable({ responsable, label, setEnseignantId }: CustomSelectResProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dataResponsable, setDataResponsable] = useState<EnseignantResponsable[]>(responsable);
    const [itemSelection, setItemSelection] = useState<EnseignantResponsable | null>(dataResponsable.length > 0 ? dataResponsable[0] : null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const filtered = responsable.filter((item) =>
            `${item.prenom} ${item.nom}`.toLowerCase().includes(value.toLowerCase())
        );
        setDataResponsable(filtered);
        setItemSelection(filtered.length > 0 ? filtered[0] : null);
    };

    const handleSelectionResponsable = (item: EnseignantResponsable) => {
        setItemSelection(item);
        setIsOpen(false);
        setEnseignantId(item.idU);
    };

    return (
        <div className='w-full flex flex-col gap-2 text-[#09090B] py-1 ' >
            <h2 className='block mb-2 text-md font-medium text-gray-900'>{label} </h2>
            <div className='relative w-full'>
                <div className='relative mb-2'>
                    <input
                        type="text"
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
                        onChange={handleChange}
                        value={itemSelection ? `${itemSelection.prenom} ${itemSelection.nom}` : ''}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    {isOpen ? (
                        <FiChevronUp className='absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(false)} />
                    ) : (
                        <FiChevronDown className='absolute top-1/2  right-0 text-xl cursor-pointer  -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(true)} />
                    )}
                </div>

                {isOpen && (
                    <ul className='absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto'>

                        {dataResponsable.length > 0 ? (
                            dataResponsable.map((item) => (
                                <li
                                    key={item.idU}
                                    className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${itemSelection?.idU === item.idU ? "bg-[#F4F7FD]" : ""} transform duration-300 ease-in-out transition-all`}
                                    onClick={() => handleSelectionResponsable(item)}
                                >
                                    <span>{itemSelection?.idU === item.idU ? <GiCheckMark className='text-sm text-[#7CFC00] ' /> : <p className='w-3.5'></p>}</span>
                                    <span className='font-medium'>{item.nom} {item.prenom}</span>
                                </li>
                            ))
                        ) : (
                            <li className='py-1 px-2.5 text-gray-500'>Aucun résultat trouvé</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
function CustomSelectSuject({ responsable, label, setSujetId }: CustomSelectSujetProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dataResponsable, setDataResponsable] = useState<Sujet[]>(responsable);
    const [itemSelection, setItemSelection] = useState<Sujet | null>(dataResponsable.length > 0 ? dataResponsable[0] : null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const filtered = responsable.filter((item) => item.titre.toLowerCase().includes(value.toLowerCase()));

        setDataResponsable(filtered);
        setItemSelection(filtered.length > 0 ? filtered[0] : null);
    };

    const handleSelection = (item: Sujet) => {
        setItemSelection(item);
        setIsOpen(false);
        setSujetId(item.idS)
    };

    return (
        <div className='w-full flex flex-col gap-2 text-[#09090B] py-1 ' >
            <h2 className='block mb-2 text-md font-medium text-gray-900'>{label} </h2>
            <div className='relative w-full'>
                <div className='relative mb-2'>
                    <input
                        type="text"
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
                        onChange={handleChange}
                        value={itemSelection ? `${itemSelection.titre}` : ''}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    {isOpen ? (
                        <FiChevronUp className='absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(false)} />
                    ) : (
                        <FiChevronDown className='absolute top-1/2  right-0 text-xl cursor-pointer  -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(true)} />
                    )}
                </div>

                {isOpen && (
                    <ul className='absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto'>
                        {dataResponsable.length > 0 ? (
                            dataResponsable.map((item) => (
                                <li
                                    key={item.idS}
                                    className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${itemSelection?.idS === item.idS ? "bg-[#F4F7FD]" : ""} transform duration-300 ease-in-out transition-all`}
                                    onClick={() => handleSelection(item)}
                                >
                                    <span>{itemSelection?.idS === item.idS ? <GiCheckMark className='text-sm text-[#7CFC00] ' /> : <p className='w-3.5'></p>}</span>
                                    <span className='font-medium'>{item.titre} </span>
                                </li>
                            ))
                        ) : (
                            <li className='py-1 px-2.5 text-gray-500'>Aucun résultat trouvé</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
function CustomGroupSelect({ responsable, label, setGroupeId }: CustomSelectGroupeProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dataResponsable, setDataResponsable] = useState<Groupe[]>(responsable);
    const [itemSelection, setItemSelection] = useState<Groupe | null>(dataResponsable.length > 0 ? dataResponsable[0] : null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const filtered = responsable.filter((item) => item.nom.toLowerCase().includes(value.toLowerCase()));

        setDataResponsable(filtered);
        setItemSelection(filtered.length > 0 ? filtered[0] : null);
    };

    const handleSelection = (item: Groupe) => {
        setItemSelection(item);
        setIsOpen(false);
        setGroupeId(item.idG)
    };

    return (
        <div className='w-full flex flex-col gap-2 text-[#09090B] py-1 ' >
            <h2 className='block mb-2 text-md font-medium text-gray-900'>{label} </h2>
            <div className='relative w-full'>
                <div className='relative mb-2'>
                    <input
                        type="text"
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
                        onChange={handleChange}
                        value={itemSelection ? `${itemSelection.nom}` : ''}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    {isOpen ? (
                        <FiChevronUp className='absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(false)} />
                    ) : (
                        <FiChevronDown className='absolute top-1/2  right-0 text-xl cursor-pointer  -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(true)} />
                    )}
                </div>

                {isOpen && (
                    <ul className='absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto'>
                        {dataResponsable.length > 0 ? (
                            dataResponsable.map((item) => (
                                <li
                                    key={item.idG}
                                    className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${itemSelection?.idG === item.idG ? "bg-[#F4F7FD]" : ""} transform duration-300 ease-in-out transition-all`}
                                    onClick={() => handleSelection(item)}
                                >
                                    <span>{itemSelection?.idG === item.idG ? <GiCheckMark className='text-sm text-[#7CFC00] ' /> : <p className='w-3.5'></p>}</span>
                                    <span className='font-medium'>{item.nom} </span>
                                </li>
                            ))
                        ) : (
                            <li className='py-1 px-2.5 text-gray-500'>Aucun résultat trouvé</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
function InfoAffection({ setError, setIsSucces }: AffecterThemeProps) {
    const [isLoading, setLoading] = useState<boolean>(false)
    const accessToken = useAuthStore((state) => state.accessToken)
    const [enseignantId, setEnseignantId] = useState<number>();
    const [sujetId, setSujetId] = useState<number>();
    const [groupeId, setGroupeId] = useState<number>();
    const [, setReset] = useState(false);

    const { data: dataGroupes } = useQuery({
        queryKey: ['groupes'],
        queryFn: () => getAllGroupes(accessToken!),
        enabled: !!accessToken
    });

    const { data: dataResponsable } = useQuery({
        queryKey: ['Responsable', accessToken],
        queryFn: async () => {
            console.log("Fetching all responsables");
            return await getAllResponsableValide(accessToken!);
        },
        enabled: !!accessToken,
        staleTime: 0,
        gcTime: 0
    });

    const { data: dataSujet, isFetching } = useQuery({
        queryKey: ['Sujet', accessToken, enseignantId],
        queryFn: async () => {
            console.log("Fetching sujets for enseignantId:", enseignantId);
            if (enseignantId === undefined) throw new Error("No enseignantId");
            return await getSujetOfResponsable({ accessToken: accessToken!, enseignantId });
        },
        enabled: !!accessToken && enseignantId !== undefined,
        staleTime: 0,
        gcTime: 0
    });

    const { mutate } = useMutation({
        mutationFn: ({ accessToken, groupeId, enseignantId, sujetId }: { accessToken: string; groupeId: number; enseignantId: number; sujetId: number }) =>
            setSujetToGroup(accessToken, { groupeId, enseignantId, sujetId }),
        onSuccess: () => {
            setLoading(true)
            setTimeout(() => setLoading(false), 3000)
            setIsSucces(true)
        },
        onError(error) {
            setError(true)
            console.warn(error.message)
        }
    })
    const handleSend = () => {
        if (accessToken && enseignantId && sujetId && groupeId) {
            mutate({
                accessToken,
                groupeId,
                enseignantId,
                sujetId,
            })
        }
    }
    const handleAnnuler = () => {
        setReset(prev => !prev);  // toggle to trigger reset
        setEnseignantId(undefined);
        setSujetId(undefined);
        setGroupeId(undefined);
    }
    return (
        <div className='w-2xl py-10 bg-white rounded-md drop-shadow-md shadow px-10'>

            <div className='space-y-2 mb-4'>
                {dataResponsable && (
                    <CustomSelectResponsable
                        label="Veuillez sélectionner un enseignant responsable :"
                        responsable={dataResponsable}
                        setEnseignantId={setEnseignantId}

                    />
                )}
                {enseignantId && isFetching && (
                    <p className="text-sm text-gray-500">Chargement des sujets...</p>
                )}
                {enseignantId && dataSujet && (
                    <CustomSelectSuject
                        label="Veuillez sélectionner un thème :"
                        responsable={dataSujet}
                        setSujetId={setSujetId}

                    />
                )}

                {dataGroupes && <CustomGroupSelect label="Veuillez sélectionner un groupe :" responsable={dataGroupes} setGroupeId={setGroupeId} />}
            </div>
            <div className="w-full flex justify-end items-center py-2 mr-20 pr-1 -mt-6 mb-4">
                <NavLink to="/ens-principale/gestion-groupes/liste-affection-theme" className="text-blue-500 text-sm font-medium underline">
                    Voir tous les effets
                </NavLink>
            </div>
            <div className=' flex items-center justify-center gap-x-6 '>
                <button
                    className="outline-none basis-1/2 border-none bg-green-500 hover:bg-green-700 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
                    type="button"
                    onClick={handleSend}
                >
                    {isLoading ? "Affecter..." : " Affecter"}
                </button>

                <button
                    onClick={handleAnnuler}
                    type="button"
                    className="outline-none basis-1/2 border-none bg-red-500 hover:bg-red-700 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
                >
                    Annuler
                </button>
            </div>
        </div>

    )
}


const AffecterTheme = () => {
    const [isError, setError] = useState<boolean>(false)
    const [isSucces, setIsSucces] = useState<boolean>(false)
    useEffect(() => {
        if (isSucces) {
            const timer = setTimeout(() => setIsSucces(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isSucces]);
    useEffect(() => {
        if (isError) {
            const timer = setTimeout(() => setError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isError]);

    return (
        <section className="w-full h-svh px-6 pb-10 flex flex-col items-center justify-center  gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-hidden bg-[#F4F7FD] relative">

            <InfoAffection setError={setError} setIsSucces={setIsSucces} />
            <div
                className={`py-6 px-4 rounded-md bg-white flex items-center gap-4 shadow-md drop-shadow-lg absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isError ? "bottom-10 opacity-100" : "-bottom-20 opacity-0"
                    }`}
            >
                <PiWarningFill className="text-yellow-500 text-3xl" />
                <p className="whitespace-nowrap font-semibold text-gray-700">
                    Désolé, le thème a déjà été affecté.
                </p>
            </div>

            <div
                className={`py-6 px-4 rounded-md bg-white flex items-center gap-4 shadow-md drop-shadow-lg absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isSucces ? "bottom-10 opacity-100" : "-bottom-20 opacity-0"
                    }`}
            >
                <FaCheckCircle className="text-green-500 text-3xl" />
                <p className="whitespace-nowrap font-semibold text-gray-700">
                    Le thème a été affecté avec succès.
                </p>
            </div>

            <NavLink to="/ens-principale/gestion-groupes" className=" fixed bottom-8  right-4 bg-green-500 hover:bg-green-600 transform ease-in-out duration-300 transition-all text-white w-12 h-12 rounded-full flex items-center justify-center">
                <BiArrowBack className="text-2xl" />
            </NavLink>
        </section>
    )
}

export default AffecterTheme


