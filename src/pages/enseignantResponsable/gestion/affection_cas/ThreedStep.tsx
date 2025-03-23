import { FiChevronsLeft } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useAffectionCasStore } from "../../../../store";
import { useCallback, useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";

function ThirdStepCas({ task }: { task: string }) {
    const deleteCas = useAffectionCasStore((state) => state.deleteCas);

    return (
        <div className="bg-white shadow border border-gray-200 w-full py-4 flex items-center justify-between gap-5 px-4 rounded-md hover:bg-purple-500 hover:text-white hover:border-none transition-all duration-200 ease-in-out">
            <span className="text-sm text-justify max-w-xl leading-6">{task}</span>
            <button
                className="text-sm px-2 bg-red-500 text-white sm:px-6 py-1.5 rounded-full"
                onClick={() => deleteCas(task)}
            >
                Supprimer
            </button>
        </div>
    );
}

function ThirdStep() {
    const allTasks = useAffectionCasStore((state) => state.cas);
    const setCurrentNextstep = useAffectionCasStore((state) => state.setCurrentNextstep);
    const currentNextstep = useAffectionCasStore((state) => state.curentNextStep);
    const setConfirm = useAffectionCasStore((state) => state.setConfirm);
    const setNextstep = useAffectionCasStore((state) => state.setNextstep);
    const setBinomeID = useAffectionCasStore((state) => state.setBinomeID);

    const [show, setShow] = useState<boolean>(false);
    const navigate = useNavigate();

    const prevStep = useCallback(() => {
        setCurrentNextstep(!currentNextstep);
        navigate('/gestion-affection-les-cas/step2');
    }, [setCurrentNextstep, currentNextstep, navigate]);

    const confirmStep = () => {
        setConfirm(true);
        setShow(true);
    };

    useEffect(() => {

        const timer1 = setTimeout(() => setShow(false), 3000);


        const timer2 = setTimeout(() => {
            setCurrentNextstep(false);
            setNextstep(false);
            setConfirm(false);
            setBinomeID(-1);
            navigate('/gestion-affection-les-cas'); // Move inside the timeout
        }, 5000);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [show, navigate, setCurrentNextstep, setNextstep, setConfirm, setBinomeID]);

    return (
        <section className="w-full sm:h-svh py-6 flex flex-col items-center relative">
            <div className="w-[90%] md:w-[80%] h-96 border border-gray-200">
                <div className="bg-green-600 text-white font-bold flex items-center justify-center h-12">
                    <span>Tous les cas ajoutés pour ce binôme</span>
                </div>
                <div className="px-4 py-3 flex flex-col gap-y-2 overflow-y-auto h-80">
                    {allTasks.map((task) => (
                        <ThirdStepCas key={task} task={task} />
                    ))}
                </div>
            </div>

            <div className="w-full px-4 mt-12 flex items-center justify-center space-x-8 sm:w-2/3">
                <button
                    className="w-1/2 py-1.5 sm:w-64 bg-gray-950 sm:py-2.5 rounded-md sm:font-semibold text-lg text-white flex items-center justify-center gap-2"
                    onClick={prevStep}
                >
                    <FiChevronsLeft className="sm:text-2xl" /> Précédent
                </button>
                <button
                    className="w-1/2 py-1.5 sm:w-64 bg-green-600 sm:py-2.5 rounded-md sm:font-semibold text-lg text-white flex items-center justify-center gap-2"
                    onClick={confirmStep}
                >
                    Confirmer
                </button>
            </div>

            {show && (
                <div className="flex items-center space-x-3 bg-slate-950 text-white py-4 px-6 rounded-md absolute top-2/4 -translate-y-1/2">
                    <FaCheck className="text-green-400 text-xl" />
                    <h2>Le processus a été effectué avec succès. Vous serez redirigé vers la page principale.</h2>
                </div>
            )}
        </section>
    );
}

export default ThirdStep;

