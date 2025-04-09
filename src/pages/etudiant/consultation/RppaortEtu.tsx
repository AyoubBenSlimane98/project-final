import { useState } from "react";


type SujetTheme = {
    nom: string;
    description: string;
}
const sujetsThemes: SujetTheme = {
    nom: "Artificial Intelligence",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit repellat sint maiores perspiciatis eius inventore tempora iste! Quis tempora consectetur laborum deserunt soluta consequuntur fuga, temporibus, doloremque repellendus maxime harum.",
};
const RppaortEtu = () => {
    const [sujet] = useState<SujetTheme>(sujetsThemes);
    

    ;
    return (
        <section className="w-full py-6 mt-20 flex flex-col items-center justify-center bg-[#F4F7FD]">
            <div className="w-4xl flex flex-col gap-8 ">

                <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-4">
                    <div className="w-4xl mb-4">
                        <h2 className="text-4xl font-medium">Rapport d'etudiant </h2>
                    </div>
                    <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2">
                        <h2 className="font-medium text-lg">Titre :  </h2>
                        <p className=" font-light text-gray-800 px-2">{sujet.nom}</p>
                    </div>
                    <div className="bg-white py-6 px-4 rounded-md shadow border border-gray-200 flex flex-col gap-2">
                        <h2 className="font-medium text-lg">Description : </h2>
                        <p className=" font-light text-gray-800 text-justify  leading-relaxed px-2 indent-8"> {sujet.description}</p>
                    </div>
                </div>

                <iframe
                    src="https://drive.google.com/file/d/1ScTF8zgaHG01agiZRfxAmdw64PUEM4iF/preview"
                    width="800"
                    height="600"
                    allow="autoplay"
                    className="shadow-lg w-4xl border-none  bg-white rounded-lg overflow-hidden"
                ></iframe>



            </div>

        </section>
    )
}

export default RppaortEtu
