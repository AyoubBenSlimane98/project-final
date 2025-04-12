import { ChangeEvent, useState } from "react";
import { NavLink } from "react-router";

const CreerGroupe = () => {
    const [value, setValue] = useState<number | null>(1);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const newValue = event.target.value;
        if (newValue === "") {
            setValue(null);
            return;
        }
        const numericValue = Number(newValue);
        if (numericValue >= 1 && numericValue <= 20) {
            setValue(numericValue);

        }
    };

    return (
        <section className="w-full h-svh px-6 pb-10 flex flex-col justify-center items-center gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-auto bg-[#F4F7FD]">
            <div className="w-[540px] h-72 bg-white rounded-[20px] flex flex-col justify-center items-center drop-shadow-md shadow ">

                <div className="w-full px-10 mb-4">
                    <h2 className="font-medium text-lg">
                        Entrez le nombre de binome que vous souhaitez dans une groupe créé :
                    </h2>
                </div>

                <div className="w-full  relative  px-10">
                    <input
                        type="number"
                        className={`border-[1.5px]  w-full py-2 rounded-md px-4 border-gray-400`}
                        value={value ?? ""}
                        onChange={handleChange}
                    />

                </div>

                <div className="w-full flex justify-end items-center py-2 mr-20 pr-1 mb-2">
                    <NavLink to="/ens-principale/creer-groupes/liste-binomes" className="text-blue-500 text-sm font-medium underline">
                        Liste des binômes
                    </NavLink>
                </div>

                <div className="w-full flex items-center justify-center gap-x-6 px-10">
                    <button
                        type="button"
                        className="outline-none basis-1/2 border-none bg-blue-500 hover:bg-blue-600 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
                    >
                        Créer
                    </button>
                    <button
                        type="button"
                        className="outline-none basis-1/2 border-none bg-red-500 hover:bg-red-700 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CreerGroupe;

