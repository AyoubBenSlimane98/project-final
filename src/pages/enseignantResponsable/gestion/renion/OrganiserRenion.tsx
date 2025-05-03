// import { MdOutlineAddLink } from "react-icons/md";
// import { useAuthStore } from "../../../../store";
// import { ChangeEvent, useEffect, useState } from "react";
// import { FiChevronDown, FiChevronUp } from "react-icons/fi";
// import { GiCheckMark } from "react-icons/gi";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { FaCheckCircle } from "react-icons/fa";
// import { PiWarningFill } from "react-icons/pi";
// interface Renuions {
//     titre: string;
//     remarque: string;
//     lien: string;
//     dateDebut: string;
//     groupeId: number;
//     enseignantId: number;
// }
// type Groupe = {
//     idG: number;
//     nom: string;
// };
// type CustomSelectGroupeProps = {
//     responsable: Groupe[];
//     label: string;
//     setGroupeId: (value: number) => void;
// };

// const createNewRenuion = async ({ form, accessToken }: { form: Renuions, accessToken: string }) => {
//     const response = await fetch(`http://localhost:4000/api/responsable/reunion`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(form)
//     });
//     if (!response.ok) throw new Error("Cannot fetch to create reunion");
//     return response.json();
// }
// const getAllGroupesOfResponsable = async (accessToken: string, enseignantId: number) => {
//     const response = await fetch(`http://localhost:4000/api/responsable/groupe-responsable/${enseignantId}`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
//     if (!response.ok) throw new Error("Cannot fetch for get number of groupes");
//     return response.json();
// };

// const getResponsableId = async (accessToken: string) => {

//     const response = await fetch(`http://localhost:4000/api/responsable/enseignant`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
//     if (!response.ok) throw new Error("Cannot fetch for get responsable");
//     return response.json();
// };

// function CustomGroupSelect({ responsable, label, setGroupeId }: CustomSelectGroupeProps) {

//     const [isOpen, setIsOpen] = useState<boolean>(false);
//     const [dataResponsable, setDataResponsable] = useState<Groupe[]>(responsable);
//     const [itemSelection, setItemSelection] = useState<Groupe | null>(dataResponsable.length > 0 ? dataResponsable[0] : null);

//     const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//         const value = event.target.value;
//         const filtered = responsable.filter((item) => item.nom.toLowerCase().includes(value.toLowerCase()));

//         setDataResponsable(filtered);
//         setItemSelection(filtered.length > 0 ? filtered[0] : null);
//     };

//     const handleSelection = (item: Groupe) => {
//         setItemSelection(item);
//         setIsOpen(false);
//         setGroupeId(item.idG)
//     };
//     return (
//         <div className='w-full flex flex-col gap-2 text-[#09090B] py-1 ' >
//             <h2 className='block mb-2 text-md font-medium text-gray-900'>{label} </h2>
//             <div className='relative w-full'>
//                 <div className='relative mb-2'>
//                     <input
//                         type="text"
//                         className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
//                         onChange={handleChange}
//                         value={itemSelection ? `${itemSelection.nom}` : ''}
//                         onClick={() => setIsOpen(!isOpen)}
//                     />
//                     {isOpen ? (
//                         <FiChevronUp className='absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(false)} />
//                     ) : (
//                         <FiChevronDown className='absolute top-1/2  right-0 text-xl cursor-pointer  -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(true)} />
//                     )}
//                 </div>

//                 {isOpen && (
//                     <ul className='absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto'>
//                         {dataResponsable.length > 0 ? (
//                             dataResponsable.map((item) => (
//                                 <li
//                                     key={item.idG}
//                                     className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${itemSelection?.idG === item.idG ? "bg-[#F4F7FD]" : ""} transform duration-300 ease-in-out transition-all`}
//                                     onClick={() => handleSelection(item)}
//                                 >
//                                     <span>{itemSelection?.idG === item.idG ? <GiCheckMark className='text-sm text-[#7CFC00] ' /> : <p className='w-3.5'></p>}</span>
//                                     <span className='font-medium'>{item.nom} </span>
//                                 </li>
//                             ))
//                         ) : (
//                             <li className='py-1 px-2.5 text-gray-500'>Aucun résultat trouvé</li>
//                         )}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// }
// export const OrganiserRenion = () => {
//     const [isError, setError] = useState<boolean>(false)
//     const [isSucces, setIsSucces] = useState<boolean>(false)
//     const accessToken = useAuthStore((state) => state.accessToken)
//     const [enseignantId, setEnseignantId] = useState<number>()
//     const [groupeId, setGroupeId] = useState<number>();
//     const [form, setForm] = useState<Renuions>({ titre: '', remarque: '', lien: '', dateDebut: '', enseignantId: 0, groupeId: 0 })

//     const { data: dataResponsableId } = useQuery({
//         queryKey: ['responsable'],
//         queryFn: () => getResponsableId(accessToken!),
//         enabled: !!accessToken
//     })

//     const { data: dataGroupes } = useQuery({
//         queryKey: ['groupes', enseignantId],
//         queryFn: () => getAllGroupesOfResponsable(accessToken!, enseignantId!),
//         enabled: !!accessToken && !!enseignantId,
//     });

//     const { mutate } = useMutation({
//         mutationFn: createNewRenuion,
//         onSuccess: () => {
//             setIsSucces(true)
//             setForm({ titre: '', remarque: '', lien: '', dateDebut: '', enseignantId: 0, groupeId: 0 });
//         },
//         onError: () => {
//             setError(true)
//         }
//     })
//     useEffect(() => {
//         if (dataResponsableId) {
//             setForm((prev) => ({ ...prev, enseignantId: dataResponsableId }))
//             setEnseignantId(dataResponsableId)
//         }
//     }, [dataResponsableId])
//     useEffect(() => {
//         if (groupeId) {
//             setForm((prev) => ({ ...prev, groupeId }))
//         }
//     }, [groupeId])

//     const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = event.target;
//         setForm((prev) => ({ ...prev, [name]: value }))
//     }

//     const handleSubmit = () => {
//         if (accessToken) {
//             mutate({ form, accessToken })
//         }
//     }
//     useEffect(() => {
//         if (isSucces) {
//             const timer = setTimeout(() => setIsSucces(false), 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [isSucces]);
//     useEffect(() => {
//         if (isError) {
//             const timer = setTimeout(() => setError(false), 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [isError]);
//     const handleAnnuler = () => {
//         setForm({ titre: '', remarque: '', lien: '', dateDebut: '', enseignantId: 0, groupeId: 0 })
//     }
//     return (
//         <section className="w-full h-full flex justify-center items-center bg-[#F4F7FD] overflow-hidden pt-30 pb-24">
//             <form className="w-1/2 bg-white shadow-md rounded-md px-8 pt-6 pb-8  m-10 " onSubmit={handleSubmit}>
//                 <h2 className="text-2xl font-bold mb-4">Organiser une réunion</h2>
//                 <div className="mb-3 flex flex-col  gap-4">
//                     <input
//                         className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
//                         id="title"
//                         name="titre"
//                         type="text"
//                         onChange={handleChange}
//                         placeholder="Entrez le titre de la réunion"
//                     />
//                     <div className="flex items-center  gap-4">
//                         <input
//                             id="meet-link"
//                             type="url"
//                             name="lien"
//                             onChange={handleChange}
//                             placeholder="https://meet.google.com/qtp-rxmv-sjw"
//                             required
//                             pattern="https://.*"
//                             className='bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-2.5 px-4'
//                         />
//                         <button
//                             className=" cursor-pointer border outline-none bg-gray-50  border-gray-300 text-gray-900   transform duration-200 ease-in-out transition-all hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded-md hover:border-blue-700 "
//                             type="button"
//                             onClick={() => window.open("https://meet.google.com/landing", "_blank")}
//                         >
//                             <MdOutlineAddLink className="text-2xl " />
//                         </button>
//                     </div>
//                     {dataGroupes && <CustomGroupSelect label="Veuillez sélectionner un groupe :" responsable={dataGroupes} setGroupeId={setGroupeId} />}
//                     <textarea
//                         className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
//                         id="notes"
//                         name="remarque"
//                         onChange={handleChange}
//                         placeholder="Entrez des remarques supplémentaires"
//                         rows={3}
//                     ></textarea>
//                 </div>

//                 <div className="mb-6 ">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
//                         début de la réunion
//                     </label>
//                     <input
//                         name="dateDebut"
//                         onChange={handleChange}
//                         className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
//                         id="date"
//                         type="datetime-local"
//                         defaultValue={""}
//                         placeholder="Sélectionnez la date et l'heure de début"
//                     />
//                 </div>

//                 <div className="w-full flex justify-center items-center gap-6 ">
//                     <button
//                         onClick={handleSubmit}
//                         className=" basis-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         type="button"
//                     >
//                         Organiser la réunion
//                     </button>
//                     <button
//                         onClick={handleAnnuler}
//                         className="basis-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                         type="button"
//                     >
//                         Annuler
//                     </button>
//                 </div>
//             </form >
//             <div
//                 className={`py-6 px-4 rounded-md bg-white flex items-center gap-4 shadow-md drop-shadow-lg absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isSucces ? "bottom-10 opacity-100" : "-bottom-20 opacity-0"
//                     }`}
//             >
//                 <FaCheckCircle className="text-green-500 text-3xl" />
//                 <p className="whitespace-nowrap font-semibold text-gray-700">
//                     La réunion a été organisée avec succès.
//                 </p>
//             </div>
//             <div
//                 className={`py-6 px-4 rounded-md bg-white flex items-center gap-4 shadow-md drop-shadow-lg absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isError ? "bottom-10 opacity-100" : "-bottom-20 opacity-0"
//                     }`}
//             >
//                 <PiWarningFill className="text-yellow-500 text-3xl" />
//                 <p className="whitespace-nowrap font-semibold text-gray-700">
//                     Erreur lors de l'organisation de la réunion.
//                 </p>
//             </div>
//         </section >
//     )
// }
import { useState, useEffect, ChangeEvent } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../../../store";
import { MdOutlineAddLink } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";
import { PiWarningFill } from "react-icons/pi";

// ------------------- Types -------------------

interface ReunionForm {
    titre: string;
    remarque: string;
    lien: string;
    dateDebut: string;
    groupeId: number;
    enseignantId: number;
}

type Groupe = {
    idG: number;
    nom: string;
};

type CustomSelectProps = {
    responsable: Groupe[];
    label: string;
    setGroupeId: (value: number) => void;
};

// ------------------- API Calls -------------------

const createNewReunion = async ({ form, accessToken }: { form: ReunionForm; accessToken: string }) => {
    const response = await fetch(`http://localhost:4000/api/responsable/reunion`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
    });
    if (!response.ok) throw new Error("Cannot create reunion");
    return response.json();
};

const getAllGroupesOfResponsable = async (accessToken: string, enseignantId: number) => {
    const response = await fetch(`http://localhost:4000/api/responsable/groupe-responsable/${enseignantId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch groups");
    return response.json();
};

const getResponsableId = async (accessToken: string) => {
    const response = await fetch(`http://localhost:4000/api/responsable/enseignant`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch responsable ID");
    return response.json();
};

// ------------------- Custom Select Component -------------------

function CustomGroupSelect({ responsable, label, setGroupeId }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dataResponsable, setDataResponsable] = useState<Groupe[]>(responsable);
    const [itemSelection, setItemSelection] = useState<Groupe | null>(responsable.length > 0 ? responsable[0] : null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        const filtered = responsable.filter((item) => item.nom.toLowerCase().includes(value));
        setDataResponsable(filtered);
        setItemSelection(filtered.length > 0 ? filtered[0] : null);
    };

    const handleSelection = (item: Groupe) => {
        setItemSelection(item);
        setIsOpen(false);
        setGroupeId(item.idG);
    };

    return (
        <div className="w-full flex flex-col gap-2 text-[#09090B] py-1">
            <h2 className="block mb-2 text-md font-medium text-gray-900">{label}</h2>
            <div className="relative w-full">
                <div className="relative mb-2">
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4"
                        onChange={handleChange}
                        value={itemSelection ? itemSelection.nom : ''}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    {isOpen ? (
                        <FiChevronUp
                            className="absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transition-all"
                            onClick={() => setIsOpen(false)}
                        />
                    ) : (
                        <FiChevronDown
                            className="absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transition-all"
                            onClick={() => setIsOpen(true)}
                        />
                    )}
                </div>

                {isOpen && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto px-2 py-1">
                        {dataResponsable.length > 0 ? (
                            dataResponsable.map((item) => (
                                <li
                                    key={item.idG}
                                    className={`flex items-center gap-2 py-1 px-3 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${itemSelection?.idG === item.idG ? "bg-[#F4F7FD]" : ""
                                        }`}
                                    onClick={() => handleSelection(item)}
                                >
                                    {itemSelection?.idG === item.idG ? (
                                        <GiCheckMark className="text-sm text-[#7CFC00]" />
                                    ) : (
                                        <span className="w-3.5" />
                                    )}
                                    <span className="font-medium">{item.nom}</span>
                                </li>
                            ))
                        ) : (
                            <li className="py-1 px-3 text-gray-500">Aucun résultat trouvé</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}

// ------------------- Main Component -------------------

export const OrganiserRenion = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [enseignantId, setEnseignantId] = useState<number>();
    const [groupeId, setGroupeId] = useState<number>();
    const [form, setForm] = useState<ReunionForm>({
        titre: '',
        remarque: '',
        lien: '',
        dateDebut: '',
        enseignantId: 0,
        groupeId: 0,
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const { data: responsableId } = useQuery({
        queryKey: ['responsable'],
        queryFn: () => getResponsableId(accessToken!),
        enabled: !!accessToken,
    });

    const { data: groupes } = useQuery({
        queryKey: ['groupes', enseignantId],
        queryFn: () => getAllGroupesOfResponsable(accessToken!, enseignantId!),
        enabled: !!accessToken && !!enseignantId,
    });

    const { mutate } = useMutation({
        mutationFn: createNewReunion,
        onSuccess: () => setIsSuccess(true),
        onError: () => setIsError(true),
    });

    useEffect(() => {
        if (responsableId) {
            setForm((prev) => ({ ...prev, enseignantId: responsableId }));
            setEnseignantId(responsableId);
        }
    }, [responsableId]);

    useEffect(() => {
        if (groupeId) {
            setForm((prev) => ({ ...prev, groupeId }));
        }
    }, [groupeId]);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (accessToken) {
            mutate({ form, accessToken });
        }
    };

    const handleCancel = () => {
        setForm({
            titre: '',
            remarque: '',
            lien: '',
            dateDebut: '',
            enseignantId: 0,
            groupeId: 0,
        });
    };

    useEffect(() => {
        if (isSuccess || isError) {
            const timer = setTimeout(() => {
                setIsSuccess(false);
                setIsError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, isError]);

    return (
        <section className="w-full h-full flex justify-center items-center bg-[#F4F7FD] overflow-hidden pt-30 pb-24">
            <form className="w-1/2 bg-white shadow-md rounded-md px-8 pt-6 pb-8 m-10">
                <h2 className="text-2xl font-bold mb-4">Organiser une réunion</h2>

                <div className="mb-3 flex flex-col gap-4">
                    <input
                        name="titre"
                        type="text"
                        value={form.titre}
                        placeholder="Entrez le titre de la réunion"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />

                    <div className="flex gap-4">
                        <input
                            value={form.lien}
                            name="lien"
                            type="url"
                            pattern="https://.*"
                            required
                            placeholder="https://meet.google.com/qtp-rxmv-sjw"
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                        <button
                            type="button"
                            onClick={() => window.open("https://meet.google.com/landing", "_blank")}
                            className="bg-gray-50 border border-gray-300 rounded-md p-3 hover:bg-blue-700 hover:text-white"
                        >
                            <MdOutlineAddLink className="text-2xl" />
                        </button>
                    </div>

                    {groupes && (
                        <CustomGroupSelect
                            label="Veuillez sélectionner un groupe :"
                            responsable={groupes}
                            setGroupeId={setGroupeId}
                        />
                    )}

                    <textarea
                        name="remarque"
                        placeholder="Entrez des remarques supplémentaires"
                        rows={3}
                        value={form.remarque}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 w-full"
                    ></textarea>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                        Début de la réunion
                    </label>
                    <input
                        value={form.dateDebut}
                        name="dateDebut"
                        type="datetime-local"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                </div>

                <div className="w-full flex justify-center gap-6">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="basis-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Organiser la réunion
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="basis-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Annuler
                    </button>
                </div>
            </form>

            {/* Success Toast */}
            <div
                className={`absolute py-6 px-4 rounded-md bg-white flex items-center gap-4 shadow-md transition-all duration-500 ${isSuccess ? "bottom-10 opacity-100" : "-bottom-20 opacity-0"
                    }`}
            >
                <FaCheckCircle className="text-green-500 text-3xl" />
                <p className="font-semibold text-gray-700">La réunion a été organisée avec succès.</p>
            </div>

            {/* Error Toast */}
            <div
                className={`absolute py-6 px-4 rounded-md bg-white flex items-center gap-4 shadow-md transition-all duration-500 ${isError ? "bottom-10 opacity-100" : "-bottom-20 opacity-0"
                    }`}
            >
                <PiWarningFill className="text-yellow-500 text-3xl" />
                <p className="font-semibold text-gray-700">Erreur lors de l'organisation de la réunion.</p>
            </div>
        </section>
    );
};
