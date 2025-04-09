import { useState } from "react"
type SujetTheme = {
    nom: string;
    description: string;
}
type RefrenceTheme = {
    refTheme: string;
}
type PrequesTheme = {
    preTheme: string;
}
const sujetsThemes: SujetTheme = {
    nom: "Artificial Intelligence",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit repellat sint maiores perspiciatis eius inventore tempora iste! Quis tempora consectetur laborum deserunt soluta consequuntur fuga, temporibus, doloremque repellendus maxime harum.",
};

const referencesThemes: RefrenceTheme[] = [
    {
        refTheme: "AI-101",
    },
    {
        refTheme: "SEC-202",
    },
    {
        refTheme: "SE-303",
    },
    {
        refTheme: "AI-401",
    },
    {
        refTheme: "SEC-502",
    },
    {
        refTheme: "SE-603",
    },
    {
        refTheme: "AI-101",
    },
    {
        refTheme: "SEC-202",
    },
    {
        refTheme: "SE-303",
    },
    {
        refTheme: "AI-401",
    },
    {
        refTheme: "SEC-502",
    },
    {
        refTheme: "SE-603",
    }
];

const prequesThemes: PrequesTheme[] = [
    {
        preTheme: "Mathematics Basics",
    },
    {
        preTheme: "Programming Fundamentals",
    },
    {
        preTheme: "Computer Networks",
    },
    {
        preTheme: "Mathematics Basics",
    },
    {
        preTheme: "Programming Fundamentals",
    },
    {
        preTheme: "Computer Networks",
    }
];

const DescriptionSujet = () => {
    const [sujet, setSujet] = useState<SujetTheme>(sujetsThemes);
    const [refrenceTheme, setRefrenceTheme] = useState<RefrenceTheme[]>(referencesThemes);
    const [prequesTheme, setPrequesTheme] = useState<PrequesTheme[]>(prequesThemes);
    return (
        <section className="w-full py-6 mt-20 flex flex-col items-center justify-center bg-[#F4F7FD]">
            <div className="w-4xl flex flex-col gap-8 ">
                <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2">
                    <div className="w-4xl mb-4">
                        <h2 className="text-4xl font-medium">Description sujet </h2>
                    </div>
                    <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2 mb-2">
                        <h2 className="font-medium text-lg">Nom du project :  </h2>
                        <p className=" font-light text-gray-800 px-2">{sujet.nom}</p>
                    </div>
                    <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2">
                        <h2 className="font-medium text-lg">Description : </h2>
                        <p className=" font-light text-gray-800 text-justify  leading-relaxed px-2 indent-8"> {sujet.description}</p>
                    </div>
                </div>
                <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2">
                    <h2 className="font-medium text-lg mb-2">References : </h2>
                    <ul className=" overflow-hidden w-full px-4 py-4 flex flex-col gap-2 rounded-md *:hover:bg-white hover:overflow-auto   *:rounded-md transform duration-300 ease-in-out transition-all min-h-60 max-h-72 bg-[#F4F7FD]"> 
                        {refrenceTheme.map((refs, index) => <li key={index} className="py-2 px-2.5  font-light text-gray-800 "> {refs.refTheme}</li>)}
                    </ul>
                </div>
                <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2">
                    <h2 className="font-medium text-lg mb-2">Prerequis : </h2>
                    <ul className=" overflow-hidden w-full px-4 py-4 flex flex-col gap-2 rounded-md *:hover:bg-white hover:overflow-auto   *:rounded-md transform duration-300 ease-in-out transition-all min-h-60 max-h-72 bg-[#F4F7FD]"> 
                        {prequesTheme.map((item, index) => <li key={index} className="py-2 px-2.5  font-light text-gray-800 "> {item.preTheme}</li>)}
                    </ul>
                </div>

            </div>
        </section>
    )
}

export default DescriptionSujet
