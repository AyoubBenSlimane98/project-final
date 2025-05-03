import { FiChevronDown, FiChevronsLeft, FiChevronsRight, FiChevronUp } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useAffectionCasStore, useAuthStore } from "../../../../store";
import { useShallow } from "zustand/shallow";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { BinomeUser } from "./FirstStep";
import { IoMdCheckmark } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { FaUserLock } from "react-icons/fa";


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
export type Props = {
    casItem: Cas;
};

function SecondStepCasInfo({ casItem }: Props) {
    const { cas, statut, idCas } = casItem;
    const taskId = `check-${cas.replace(/\s+/g, "_")}`;

    const storeCas = useAffectionCasStore(useShallow((state) => state.cas));
    const addCas = useAffectionCasStore(useShallow((state) => state.addCas));
    const deleteCas = useAffectionCasStore(useShallow((state) => state.deleteCas));

    const [isChecked, setIsChecked] = useState<boolean>(
        statut || storeCas.some((c) => c.idCas === idCas)
    );

    const handleChange = () => {
        if (statut) return;

        const newChecked = !isChecked;
        setIsChecked(newChecked);

        if (newChecked) {
            addCas({ cas, idCas });
        } else {
            deleteCas(idCas);
        }
    };

    return (
        <div className="flex items-center gap-x-3 hover:bg-gray-100 hover:rounded-md px-6 py-2 transition-all duration-300 ease-in-out">
            <input
                type="checkbox"
                id={taskId}
                name={taskId}
                className="accent-green-600 cursor-pointer"
                checked={isChecked}
                onChange={handleChange}
                disabled={statut}
            />
            <label
                htmlFor={taskId}
                className={`font-serif first-letter:uppercase cursor-pointer text-nowrap ${statut ? "text-gray-400 italic" : "text-gray-900"
                    }`}
            >
                {cas}
            </label>
            {statut && (
                <>
                    <span className="text-xs text-gray-400 italic text-nowrap">
                        (déjà affecté)
                    </span>
                    <div className="w-full flex justify-end">
                        <FaUserLock className="text-blue-600" />
                    </div>
                </>
            )}
        </div>
    );
}
function SecondStepCardInfo({ fullName, image, right = false }: BinomeUser & { right?: boolean }) {
    const groupe = useAffectionCasStore((state) => state.groupe)
    return (
        <div className={`flex w-96 ${right ? 'sm:flex-row-reverse' : ''} flex-col py-6 sm:flex-row items-center    px-4 gap-4  border border-gray-100 bg-white  rounded-md shadow-xl sm:py-2 outline-none`}>
            <img onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://scontent.fczl2-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeF_OWSBlL4_ahZGK8uktg7YWt9TLzuBU1Ba31MvO4FTUAcNr-rcAk0Q6wgee_n1MVfJVXKEYXEpVc_A8npzsuDs&_nc_ohc=pCF_EXqQ5MYQ7kNvwGqbQH8&_nc_oc=AdmOQDv_qA9yPoDAQK2j4m8cM77HYt2osPaGYZiWQNIR41-_Kkg1lN_m_n79WacUl90&_nc_zt=24&_nc_ht=scontent.fczl2-2.fna&oh=00_AfEfE4VyUFM1gD2VkajBmRMamhtVSp2NpcihUNDqLsAtzg&oe=681B903A';
            }}
                src={`http://localhost:4000/${image}`} alt={`Profile picture of ${fullName}`} className="w-16 h-16 rounded-full bg-amber-800" loading="lazy" />
            <div className=" shrink-0 flex flex-col items-center justify-center  ">
                <span className=" font-medium">{fullName} </span>
                <span className=" font-light text-sm"> {groupe}</span>
            </div>
        </div>
    )
}

type CustomSelectGroupeProps = {
    responsable: Actor[];
    label: string;
};

function CustomGroupSelect({ responsable, label }: CustomSelectGroupeProps) {
    const setActeur = useAffectionCasStore((state) => state.setActeur);
    const acteur = useAffectionCasStore((state) => state.acteur);
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


const SecondStep = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const { setNextstep, user, setCurrentNextStep, cas, binomeId, idS, acteur, deleteAllCas } = useAffectionCasStore(
        useShallow((state) => ({
            setNextstep: state.setNextstep,
            nextStep: state.nextStep,
            user: state.user,
            setCurrentNextStep: state.setCurrentNextstep,
            curentNextStep: state.curentNextStep,
            cas: state.cas,
            binomeId: state.binomeId,
            deleteAllCas: state.deleteAllCas,
            idS: state.idS,
            acteur: state.acteur,

        }))
    );
    const navigate = useNavigate();

    const { data: acteurSujet } = useQuery({
        queryKey: ['acteurSujet', idS],
        queryFn: () => getAllActorOfCas({ accessToken: accessToken!, idS }),
        enabled: !!accessToken && idS !== -1,
        staleTime: 1000 * 60 * 30,
    });
    const { data: casList, refetch } = useQuery({
        queryKey: ['casList', idS, acteur],
        queryFn: () => getAllCasofSujet({ accessToken: accessToken!, idS, acteur }),
        enabled: !!accessToken && idS !== -1 && acteur !== undefined,
        staleTime: 1000 * 60 * 30,

    });

    const prevStep = useCallback(() => {
        setNextstep(false);
        navigate('/ens-responsable/gestion-affection-les-cas');
        deleteAllCas()
    }, [setNextstep, navigate, deleteAllCas]);

    const suivantStep = useCallback(() => {
        if (cas.length > 0 && user[0].idB === binomeId) {
            setCurrentNextStep(true);
            navigate('/ens-responsable/gestion-affection-les-cas/step3');
        }
    }
        , [binomeId, cas.length, navigate, setCurrentNextStep, user]);

    useEffect(() => {
        if (acteur) {
            refetch();
        }
    }, [acteur, refetch]);
    console.log(cas)
    return (
        <section className="w-full flex flex-col items-center  ">
            <div className="w-full sm:w-2/3 sm:h-24 flex gap-4 px-4 sm:gap-10 justify-between items-center mb-4  ">
                {user.length > 1 ? (
                    <>
                        <SecondStepCardInfo {...user[0]} />
                        <SecondStepCardInfo {...user[1]} right={true} />
                    </>
                ) : (
                    <SecondStepCardInfo {...user[0]} />
                )}
            </div>

            <div className="w-full flex items-center justify-center mb-6">
                <div className="w-full px-4 sm:w-2/3">
                    {acteurSujet && <CustomGroupSelect responsable={acteurSujet} label="Les cas créés par chaque acteur" />}
                    <div className="h-64 w-full border border-gray-200 rounded overflow-y-scroll md:overflow-y-hidden  hover:overflow-auto py-2.5 px-4 flex flex-col gap-2 overflow-hidden" >
                        {casList?.map((item: Cas) => (
                            <SecondStepCasInfo key={item.idCas} casItem={item} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full px-10 flex items-center justify-between space-x-8 sm:w-2/3">
                <button
                    className="w-1/2 py-1.5 outline-none border-none md:w-64 bg-gray-950 sm:py-2.5 rounded-md sm:font-semibold text-lg text-white  first-letter:uppercase flex items-center justify-center gap-2"
                    onClick={prevStep}  >
                    <FiChevronsLeft className="sm:text-2xl" />   Précédent
                </button>
                <button className="w-1/2  py-1.5 outline-none border-none md:w-64 bg-green-600 sm:py-2.5 rounded-md sm:font-semibold text-lg text-white  first-letter:uppercase flex items-center justify-center gap-2"
                    onClick={suivantStep} >
                    Suivant <FiChevronsRight className="sm:text-2xl" />
                </button>
            </div>
        </section>
    )
}

export default SecondStep;