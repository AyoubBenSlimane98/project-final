import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useAffectionCasStore } from "../../../../store";
import { useShallow } from "zustand/shallow";
import { useCallback, useState } from "react";
import { BinomesTypes } from "../../consultation/GroupeBinome";

const allTasks: string[] = [
    "authentifier",
    "creer les groupes",
    "creer les binomes",
    "consulter son rapport",
    "modifier rapport",
    "supprimer rapport",
    "consulter les binomes",
    "affecter les cas",
    "affecter la responsabilité",
    "consulter chat les questions",
    "répondre aux questions",
    "Consulter liste groupes",
];

function SecondStepCasInfo({ task }: { task: string }) {
    const taskId = `check-${task.replace(/\s+/g, "_")}`;
    const cas = useAffectionCasStore(useShallow((state) => state.cas));
    const [isChecked, setIsChecked] = useState<boolean>(cas.includes(task));
    const addCas = useAffectionCasStore(useShallow((state) => state.addCas));


    const handleChange = () => {
        setIsChecked((prev) => !prev);
        if (!isChecked) {
            addCas(task);
        };
    }
    return (
        <div className="flex items-center gap-x-3 hover:bg-gray-100 hover:text-blue-600 hover:rounded-md px-6 py-2 transform transition-all duration-300 ease-in-out cursor-pointer">
            <input
                type="checkbox"
                name={task.replace(/\s+/g, "_")}
                id={taskId}
                className="cursor-pointer accent-green-600"
                checked={isChecked}
                onChange={handleChange}
            />
            <label htmlFor={taskId} className="font-serif first-letter:uppercase cursor-pointer">
                {task}
            </label>
        </div>
    );
}
function SecondStepCardInfo({ fullName, image, groupe, right = false }: BinomesTypes & { right?: boolean }) {

    return (
        <div className={`flex w-96 ${right ? 'sm:flex-row-reverse' : ''} flex-col py-6 sm:flex-row items-center    px-4 gap-4  border border-gray-100 bg-white  rounded-md shadow-xl sm:py-2 outline-none`}>
            <img src={image} alt={`Profile picture of ${fullName}`} className="w-16 h-16 rounded-full bg-amber-800" loading="lazy" />
            <div className=" shrink-0 flex flex-col items-center justify-center  ">
                <span className=" font-medium">{fullName} </span>
                <span className=" font-light text-sm">Groupe {groupe}</span>
            </div>
        </div>
    )
}


const SecondStep = () => {

    const { setNextstep, nextStep, user, setCurrentNextStep, curentNextStep, cas, binomeId } = useAffectionCasStore(
        useShallow((state) => ({
            setNextstep: state.setNextstep,
            nextStep: state.nextStep,
            user: state.user,
            setCurrentNextStep: state.setCurrentNextstep,
            curentNextStep: state.curentNextStep,
            cas: state.cas,
            binomeId: state.binomeId,
            deleteAllCas: state.deleteAllCas

        }))
    );
    const navigate = useNavigate();

    const prevStep = useCallback(() => {
        setNextstep(!nextStep);
        navigate('/ens-responsable/gestion-affection-les-cas');
    }, [setNextstep, nextStep, navigate]);

    const suivantStep = useCallback(() => {
        if (cas.length > 0 && user[0].binomeID === binomeId) {
            setCurrentNextStep(!curentNextStep);
            navigate('/ens-responsable/gestion-affection-les-cas/step3');
        }
    }
        , [binomeId, cas.length, curentNextStep, navigate, setCurrentNextStep, user]);
    return (
        <section className="w-full sm:h-svh  py-6 flex flex-col items-center  ">
            <div className="w-full sm:w-2/3 sm:h-24 flex gap-4 pl-4 sm:gap-10 justify-between items-center mb-6  ">
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
                    <h3 className="text-lg font-semibold mb-4">Les cas créés par chaque acteur</h3>
                    <div className="h-80 w-full border border-gray-200 rounded overflow-y-scroll md:overflow-y-hidden  hover:overflow-auto py-5 px-2 flex flex-col gap-2 overflow-hidden" >
                        {allTasks.map((task, index) => (
                            <SecondStepCasInfo key={`${task} -${index} `} task={task} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full px-4 flex items-center  justify-center space-x-8 sm:w-2/3">
                <button className="w-1/2 py-1.5 outline-none border-none md:w-64 bg-gray-950 sm:py-2.5 rounded-md sm:font-semibold text-lg text-white  first-letter:uppercase flex items-center justify-center gap-2" onClick={prevStep}  >
                    <FiChevronsLeft className="sm:text-2xl" />   Précédent
                </button>
                <button className="w-1/2  py-1.5 outline-none border-none md:w-64 bg-green-600 sm:py-2.5 rounded-md sm:font-semibold text-lg text-white  first-letter:uppercase flex items-center justify-center gap-2" onClick={suivantStep} >
                    Suivant <FiChevronsRight className="sm:text-2xl" />
                </button>
            </div>
        </section>
    )
}

export default SecondStep;