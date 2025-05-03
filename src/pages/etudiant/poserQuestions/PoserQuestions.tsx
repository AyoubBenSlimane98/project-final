import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react"
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "../../../store";
import { FaCheckCircle } from "react-icons/fa";
type QuestionProps = {
    question: string;
    enseignantRId: number;
    etudiantId: number;
}

const sendQuestion = async ({ accessToken, question }: { accessToken: string; question: QuestionProps }) => {
    const response = await fetch(
        "http://localhost:4000/api/eutdaint/question",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(question)
        }
    );

    if (!response.ok) throw new Error("Unable to Get data of etudiant and responsable of groupe");
    return response.json()
}
const getDataAboutuser = async (accessToken: string) => {
    const response = await fetch(
        "http://localhost:4000/api/eutdaint/question",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) throw new Error("Unable to send question");
    return response.json()
}
const PoserQuestions = () => {
    const accessToken = useAuthStore(useShallow((state) => state.accessToken))
    const [question, setQuestion] = useState<QuestionProps>({ question: '', enseignantRId: 0, etudiantId: 0 });
    const [isSucces, setIsSucces] = useState<boolean>(false)
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setQuestion((prev) => ({ ...prev, [name]: value }))
    }
    const { data } = useQuery({
        queryKey: ["questions", accessToken],
        queryFn: ({ queryKey }) => {
            const [, accessToken] = queryKey;
            return getDataAboutuser(accessToken!)
        },
        enabled: !!accessToken
    })
    useEffect(() => {
        if (accessToken && data) {
            setQuestion((prev) => ({ ...prev, enseignantRId: data.enseignantRId, etudiantId: data.etudiantId }))
        }
    }, [accessToken, data])

    const { mutate } = useMutation({
        mutationFn: ({ accessToken, question }: { accessToken: string; question: QuestionProps }) => sendQuestion({ accessToken, question }),
        onSuccess: () => {
            setIsSucces(true)
            setQuestion({ question: '', enseignantRId: data.enseignantRId, etudiantId: data.etudiantId })
        },
        onError: () => { }

    })
    const handleSend = () => {
        if (accessToken) {
            mutate({ accessToken, question })
        }
    }
    useEffect(() => {
        if (isSucces) {
            const timer = setTimeout(() => setIsSucces(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isSucces]);
    console.log(question)

    return (
        <section className="w-ful h-screen  flex items-center justify-center bg-[#F3F4F7] ">
            <div className=" w-2xl bg-white py-8 flex flex-col justify-center items-center px-6 rounded-md drop-shadow shadow gap-4">
                <div className="w-full "><h2 className="block font-medium text-2xl">Poser votre question : </h2></div>
                <textarea
                    value={question.question}
                    onChange={handleChange}
                    name="question"
                    placeholder="Écrire le contenu de votre question ici ..."
                    className="w-full px-4 py-2.5 border border-gray-400 outline-none rounded-md placeholder:text-sm focus:border-2 h-40 text-sm text-justify focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all"
                ></textarea>
                <div className="w-full   flex items-center justify-center gap-x-6  ">
                    <button className=" outline-none w-full bg-blue-500 hover:bg-blue-700 rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={handleSend}>Envoyer</button>
                    <button className=" outline-none w-full bg-red-500 hover:bg-red-700  rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => setQuestion({ question: '', enseignantRId: data.enseignantRId, etudiantId: data.etudiantId })}>Annuler</button>
                </div>
            </div>
            <div className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${isSucces ? "bottom-10" : "-bottom-20"} `}>
                <FaCheckCircle className=" text-green-500 text-3xl" />   <p>Question ont été Envoyer avec succès.</p>
            </div>
        </section>
    )
}

export default PoserQuestions
