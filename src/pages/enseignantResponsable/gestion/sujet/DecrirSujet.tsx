import { ChangeEvent, useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { HiViewGridAdd } from "react-icons/hi";
import { MdAddLink } from "react-icons/md";
import { RiDeleteBin5Fill, RiSave3Line } from "react-icons/ri";
import { useAuthStore, useSujetStore } from "../../../../store";
import { useShallow } from "zustand/shallow";
import { useMutation } from "@tanstack/react-query";

export type ReferenceSujet = {
    reference: string;
}
export type PrerequisSujet = {
    prerequis: string;
}
export type CreateSujet = {
    titre: string;
    description: string;
    references?: ReferenceSujet[];
    prerequises?: PrerequisSujet[];
}

const createdSujet = async ({ accessToken, createSujet }: { accessToken: string, createSujet: CreateSujet }) => {
    console.log('api : ', { accessToken, ...createSujet })
    const response = await fetch('http://localhost:4000/api/responsable/sujet', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...createSujet })

    })
    if (!response.ok) throw new Error("feild to accest to api ")
    return response.json()
}
function CardInfoRef({ name }: { name: string }) {
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const handleEdit = () => {
        setIsEdit((prev) => !prev);
    };
    const { updateReference, deleteReference } = useSujetStore(
        useShallow((state) => ({
            updateReference: state.updateReference,
            deleteReference: state.deleteReference,
        }))
    );
    const [input, setInput] = useState<string>(name);
    return (
        <div className="bg-white shadow border outline-none border-gray-200 w-full p-0.5 flex items-center justify-between gap-5 rounded-md transform duration-200 ease-in-out transition-all cursor-pointer">
            <input type="text" value={input} name={name} className={`py-1.5 w-full px-2 text-sm text-wrap ${isEdit ? "border border-blue-600 rounded-md" : ""}`} disabled={!isEdit} onChange={(event) => setInput(event.target.value)} />
            <div className="flex items-center gap-3 px-2">
                {isEdit ? (
                    <RiSave3Line className="text-green-600" onClick={() => { handleEdit(); updateReference(name, input) }} />
                ) : (
                    <FaUserEdit className="text-blue-600" onClick={handleEdit} />
                )}
                <RiDeleteBin5Fill className="text-red-600" onClick={() => deleteReference(name)} />
            </div>
        </div>
    );
}

function CardInfoPrerquis({ name }: { name: string }) {
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const handleEdit = () => {
        setIsEdit((prev) => !prev);
    };
    const { updatePrerequis, deletePrerequis } = useSujetStore(
        useShallow((state) => ({
            updatePrerequis: state.updatePrerequis,
            deletePrerequis: state.deletePrerequis,
        }))
    );
    const [input, setInput] = useState<string>(name);
    return (
        <div className="bg-white shadow border outline-none border-gray-200 w-full p-0.5 flex items-center justify-between gap-5 rounded-md transform duration-200 ease-in-out transition-all cursor-pointer">
            <input type="text" value={input} name={name} className={`py-1.5 w-full px-2 text-sm text-wrap ${isEdit ? "border border-blue-600 rounded-md" : ""}`} disabled={!isEdit} onChange={(event) => setInput(event.target.value)} />
            <div className="flex items-center gap-3 px-2">
                {isEdit ? (
                    <RiSave3Line className="text-green-600" onClick={() => { handleEdit(); updatePrerequis(name, input) }} />
                ) : (
                    <FaUserEdit className="text-blue-600" onClick={handleEdit} />
                )}
                <RiDeleteBin5Fill className="text-red-600" onClick={() => deletePrerequis(name === input ? name : input)} />
            </div>
        </div>
    );
}

const DecrirSujet = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const { AddNom, addDescription, addReference, addPrerequis, prerequisInputSuject, refInputSuject, resetAll } = useSujetStore(
        useShallow((state) => ({
            AddNom: state.addNom,
            addDescription: state.addDescription,
            addReference: state.addReference,
            addPrerequis: state.addPrerequis,
            resetAll: state.resetAll,
            prerequisInputSuject: state.prerequisInputSuject,
            refInputSuject: state.refInputSuject,
        }))
    );
    const [form, setForm] = useState<{ nom: string; description: string }>({ nom: '', description: '' });
    const [refInput, setRefInput] = useState<string>('');
    const [prevInput, setPrevInput] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };
    useEffect(() => {
        addDescription(form.description);
        AddNom(form.nom);
    }, [form, addDescription, AddNom]);

    const { mutate } = useMutation({
        mutationFn: ({ accessToken, createSujet }: { accessToken: string, createSujet: CreateSujet }) => createdSujet({ accessToken, createSujet }),
        onSuccess: (data) => {
            console.log(data)
            resetAll()
            setForm({ nom: '', description: '' })
        },
        onError: (error) => {
            console.warn(error)
        }
    })
    const handleSumit = () => {

        if (accessToken) {
            mutate({ accessToken, createSujet: { titre: form.nom, description: form.description, references: refInputSuject.map(ref => ({ reference: ref })), prerequises: prerequisInputSuject.map(prerequis => ({ prerequis })) } })
        }
    }
    return (

        <main className="w-full h-full md:h-svh mt-20 p-6 flex flex-col mx-auto items-center gap-y-6 lg:mt-26  ">

            <div className="w-full border border-gray-100  bg-gray-100 rounded-md py-4 flex items-center justify-center gap-x-6 shadow shadow-gray-200 mb-4 lg:py-6">
                <h2 className="text-2xl font-bold text-center text-gray-950 ">Description Sujet</h2>
            </div>
            <section className="w-full flex flex-col md:flex-row  justify-evenly items-center gap-2  md:border md:border-gray-200  md:h-[400px]  md:px-4 lg:mb-4 lg:gap-4 lg:px-8">
                <section className=" w-full md:basis-1/3  ">
                    <div className="w-full h-80 border border-gray-200 rounded-md px-4 py-6 flex flex-col gap-y-4 shadow shadow-gray-200">
                        <div className="space-y-1">
                            <label
                                htmlFor=""
                                className="block font-medium">
                                Nom du project
                            </label>
                            <input
                                onChange={handleChange}
                                value={form.nom}
                                name="nom"
                                type="text"
                                placeholder="Entrez le nom du projet"
                                className="w-full py-1.5 px-4 border border-gray-400 outline-none rounded-md placeholder:text-sm focus:border-2 focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="description" className="block font-medium">Description</label>
                            <textarea
                                onChange={handleChange}
                                value={form.description}
                                name="description"
                                placeholder="Écrire le contenu de la description ici ..."
                                id="description"
                                className="w-full px-4 py-2 border border-gray-400 outline-none rounded-md placeholder:text-sm focus:border-2 h-40 text-sm text-justify focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all"
                            ></textarea>
                        </div>
                    </div>
                </section>
                <section className=" w-full md:basis-1/3  h-80 border border-gray-200 rounded-md px-4 py-6 flex flex-col gap-y-4 shadow shadow-gray-200">
                    <div className="space-y-1">
                        <label htmlFor="" className="block font-medium">Références</label>
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <input
                                onChange={(event) => setRefInput(event.target.value)}
                                type="text"
                                value={refInput}
                                placeholder="Ajouter une référence"
                                className="w-full py-1.5 px-4 border border-gray-400 outline-none rounded-md  placeholder:text-sm focus:border-2 focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all " />
                            <div className=" shrink-0 w-10 h-10 border border-gray-400 rounded-md flex items-center justify-center cursor-pointer  hover:bg-gray-100 " onClick={() => { addReference(refInput); setRefInput('') }} >
                                <MdAddLink className="text-xl text-blue-600" />
                            </div>
                        </div>
                        {refInputSuject.length > 0 && <div className=" w-full h-48  p-2 overflow-hidden flex flex-col gap-y-2 border border-gray-200 rounded-md hover:overflow-auto hover:bg-gray-50  cursor-pointer ">
                            {refInputSuject.map((ref, index) => <CardInfoRef key={index} name={ref} />)}
                        </div>}
                    </div>
                </section>
                <section className="w-full md:basis-1/3  h-80 border border-gray-200 rounded-md px-4 py-6 flex flex-col gap-y-4 shadow shadow-gray-200">
                    <div className="space-y-1">
                        <label htmlFor="" className="block font-medium">Prérequis</label>
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <input
                                onChange={(event) => setPrevInput(event.target.value)}
                                type="text"
                                value={prevInput}
                                placeholder="Ajouter une prérequis"
                                className="w-full py-1.5 px-4 border border-gray-400 outline-none rounded-md  placeholder:text-sm focus:border-2 focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all " />
                            <div className=" shrink-0 w-10 h-10 border border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100" onClick={() => { addPrerequis(prevInput); setPrevInput('') }} >
                                <HiViewGridAdd className="text-xl text-green-600" />
                            </div>
                        </div>
                        {prerequisInputSuject.length > 0 && <div className=" w-full h-48  p-2 overflow-hidden flex flex-col gap-y-2 border border-gray-200 rounded-md hover:overflow-auto hover:bg-gray-50 cursor-pointer ">
                            {prerequisInputSuject.map((prev: string, index: number) => <CardInfoPrerquis key={index} name={prev} />)}
                        </div>}
                    </div>
                </section>

            </section>

            <div className="w-full  py-4 flex items-center justify-center gap-x-6 ">
                <button className=" outline-none w-60 bg-blue-500 hover:bg-blue-700 rounded-md py-1.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={handleSumit}>créer</button>
                <button className=" outline-none w-60 bg-red-500 hover:bg-red-700  rounded-md py-1.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => { resetAll(); setForm({ nom: '', description: '' }) }}>Annuler</button>
            </div>
        </main>

    )
}

export default DecrirSujet;


