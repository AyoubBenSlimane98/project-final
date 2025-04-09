import { ChangeEvent, useState } from "react"


const PoserQuestions = () => {
    const [question, setQuestion] = useState<string>('');
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(event.target.value)
    }
    return (
        <section className="w-ful h-screen  flex items-center justify-center bg-[#F3F4F7] ">
            <div className=" w-2xl bg-white py-8 flex flex-col justify-center items-center px-6 rounded-md drop-shadow shadow gap-4">
                <div className="w-full "><h2 className="block font-medium text-2xl">Poser votre question : </h2></div>
                <textarea
                    value={question}
                    onChange={handleChange}
                    name="question"
                    placeholder="Écrire le contenu de votre question ici ..."
                    className="w-full px-4 py-2.5 border border-gray-400 outline-none rounded-md placeholder:text-sm focus:border-2 h-40 text-sm text-justify focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all"
                ></textarea>
                <div className="w-full   flex items-center justify-center gap-x-6  ">
                    <button className=" outline-none w-full bg-blue-500 hover:bg-blue-700 rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer">Envoyer</button>
                    <button className=" outline-none w-full bg-red-500 hover:bg-red-700  rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => setQuestion('')}>Annuler</button>
                </div>
            </div>
        </section>
    )
}

export default PoserQuestions
