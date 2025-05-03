
import { useNavigate } from "react-router";
import { useAffectionCasStore, useAuthStore } from "../../../../store";
import { useCallback, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useShallow } from "zustand/shallow";
import { useMutation } from "@tanstack/react-query";
import { Props } from "./SecondStep";

const updateCasofSujet = async ({
    idS,
    idB,
    accessToken,
    cas
}: {
    idS: number;
    cas: { cas: string; idCas: number }[];
    idB: number;
    accessToken: string;
}) => {
    const response = await fetch(`http://localhost:4000/api/responsable/update-cas?idB=${idB}&idS=${idS}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ cas })
    });
    if (!response.ok) throw new Error("Cannot fetch for get id of sujet groupe");
    return response.json();
};

function ThirdStepCas({ task }: { task: Props }) {
    const deleteCas = useAffectionCasStore((state) => state.deleteCas);

    return (
        <div className="bg-white shadow border border-gray-200 w-full py-4 flex items-center justify-between gap-5 px-4 rounded-md hover:bg-purple-500 hover:text-white hover:border-none transition-all duration-200 ease-in-out">
            <span className="text-sm text-justify max-w-xl leading-6">{task.casItem.cas}</span>
            <button
                className="text-sm px-2 bg-red-500 text-white sm:px-6 py-1.5 rounded-full"
                onClick={() => deleteCas(task.casItem.idCas)}
            >
                Supprimer
            </button>
        </div>
    );
}

function ThirdStep() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const {
        cas: allTasks,
        setCurrentNextstep,
        idS,
        idB,
        setConfirm,
        resetAll
    } = useAffectionCasStore(
        useShallow((state) => ({
            cas: state.cas,
            setCurrentNextstep: state.setCurrentNextstep,
            idB: state.binomeId,
            setConfirm: state.setConfirm,
            setNextstep: state.setNextstep,
            idS: state.idS,
            resetAll: state.resetAll
        }))
    );

    const [isLoading, setIsLoading] = useState(false)
    const [isSucces, setIsSucces] = useState<boolean>(true);
    const navigate = useNavigate();

    const prevStep = useCallback(() => {
        setConfirm(false);
        setCurrentNextstep(false);
        navigate('/ens-responsable/gestion-affection-les-cas/step2');
    }, [setConfirm, setCurrentNextstep, navigate]);

    const { mutate } = useMutation({
        mutationFn: ({
            idS,
            idB,
            accessToken,
            cas
        }: {
            idS: number;
            idB: number;
            cas: { cas: string; idCas: number }[];
            accessToken: string;
        }) => updateCasofSujet({
            idS,
            idB,
            accessToken,
            cas
        }),
        onSuccess: () => {
            setIsLoading(true)
            setConfirm(true);
            setIsSucces(true);
            setTimeout(() => {
                setIsLoading(false)
                setIsSucces(false);
                navigate('/ens-responsable/gestion-affection-les-cas');
                resetAll();
            }, 3000);
        },
        onError: (error) => {
            console.warn(error.message);
        }
    });

    const confirmStep = () => {
        setConfirm(true);
        if (accessToken && idS && allTasks.length > 0 && idB) {
            mutate({ idS, accessToken, cas: allTasks, idB });
        }
    };

    return (
        <section className="w-full  pt-6 flex flex-col items-center relative">
            <div className="w-[90%] md:w-[80%] h-96 border border-gray-200">
                <div className="bg-green-600 text-white font-bold flex items-center justify-center h-12">
                    <span>Tous les cas ajoutés pour ce binôme</span>
                </div>
                <div className="px-4 py-3 flex flex-col gap-y-2 overflow-y-auto h-80">
                    {allTasks.map((task) => (
                        <ThirdStepCas key={task.idCas} task={{ casItem: { ...task, statut: true } }} />
                    ))}
                </div>
            </div>

            <div className="w-2/3 flex items-center justify-center  gap-x-6 pt-4">
                <button
                    onClick={prevStep}
                    type="button"
                    className=" cursor-pointer outline-none w-96 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-md py-3 text-gray-700 font-medium transition-all"
                >
                    Précédent
                </button>
                <button

                    onClick={confirmStep}
                    type="button"
                    className={` outline-none w-96 border-none bg-blue-400 hover:bg-blue-600 rounded-md py-3 text-white font-medium transition-all}`}
                >
                    {isLoading ? "  Affecter ..." : "  Affecter"}
                </button>
            </div>

            <div className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${isSucces ? "bottom-40" : "-bottom-40 hidden"} `}>
                <FaCheckCircle className=" text-green-500 text-3xl" />   <p>Les cas ont été affectés avec succès.</p>
            </div>
        </section>
    );
}

export default ThirdStep;
