import { ChangeEvent, useEffect, useState } from 'react'
import useDrivePicker from 'react-google-drive-picker';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { GiCheckMark } from 'react-icons/gi';
import { RiUploadCloud2Line } from 'react-icons/ri';

export type casPrpos = {
    nom: string;
}
export type tachePrpos = {
    nom: string;
}

type CustomSelectProps = {
    responsable: casPrpos[] | tachePrpos[];
    label: string;
};
const allCas: casPrpos[] = [
    { nom: "User Authentication" },
    { nom: "Data Backup" },
    { nom: "Payment Processing" }
];
const alltaches: tachePrpos[] = [
    { "nom": "Implement login system" },
    { "nom": "Schedule daily database backups" },
    { "nom": "Integrate payment gateway" }
]
function CustomSelect({ responsable, label }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dataResponsable, setDataResponsable] = useState(responsable);
    const [itemSelection, setItemSelection] = useState<string>(responsable.length > 0 ? responsable[0].nom : "");

    useEffect(() => {
        setDataResponsable(responsable);
    }, [responsable]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value;
        const filter = responsable.filter((item) => item.nom.toLowerCase().includes(value.toLowerCase()));
        setDataResponsable(filter);
        setItemSelection(value);
    };

    const handleSelection = (item: string) => {
        setItemSelection(item);
        setIsOpen(false);
    };

    return (
        <div className='w-full flex flex-col gap-2 text-[#09090B] py-1 ' >
            <h2 className='block mb-1 text-md font-medium text-gray-900'>{label} </h2>
            <div className='relative w-full'>
                <div className='relative mb-2'>
                    <input
                        type="text"
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
                        onChange={handleChange}
                        value={itemSelection}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    {isOpen ? (
                        <FiChevronUp className='absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(false)} />
                    ) : (
                        <FiChevronDown className='absolute top-1/2  right-0 text-xl cursor-pointer  -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(true)} />
                    )}
                </div>

                {isOpen && (
                    <ul className='absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto'>
                        {dataResponsable.length > 0 ? (
                            dataResponsable.map((item, index) => (
                                <li
                                    key={index}
                                    className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${itemSelection === item.nom ? "bg-[#F4F7FD]" : ""} transform duration-300 ease-in-out transition-all`}
                                    onClick={() => handleSelection(item.nom)}
                                >
                                    <span>{itemSelection === item.nom ? <GiCheckMark className='text-sm text-[#7CFC00] ' /> : <p className='w-3.5'></p>}</span>
                                    <span className='font-medium'>{item.nom}</span>
                                </li>
                            ))
                        ) : (
                            <li className='py-1 px-2.5 text-gray-500'>Aucun résultat trouvé</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
const DeposerRapport = () => {
    const [taches,] = useState(alltaches);
    const [cas, ] = useState(allCas);
    const [nextStep, setNextStep] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<{
        url: string,
        embedUrl: string
    }>({
        url: '',
        embedUrl: ''
    });
    const [form, setForm] = useState<{ nom: string; description: string }>({ nom: '', description: '' });
    const [openPicker] = useDrivePicker();

    const handlepickerOpen = () => {
        openPicker({
            clientId: "911473589234-p49ak2j28n8hupo850n7sb6u6tulqsdl.apps.googleusercontent.com",
            developerKey: "AIzaSyAVIGMYERgJVLRAYhMRH2noFJBvOyyV1qA",
            viewId: "DOCS",
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: false,
            callbackFunction: (data) => {
                console.log(data)
                if (data.action === "picked") {
                    setSelectedFile({
                        embedUrl: data.docs[0].embedUrl,
                        url: data.docs[0].url,
                    });

                }
            }
        });
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };
    return (
        <section className="w-full h-svh py-8 flex flex-col items-center justify-center bg-[#F4F7FD]">
            {!nextStep && <div className='bg-white w-xl px-6 py-10 rounded-md shadow border border-gray-100  '>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Déposer un Rapport</h2>
                <CustomSelect responsable={taches} label="Veuillez sélectionner une tâche :" />
                <CustomSelect responsable={cas} label="Veuillez sélectionner un cas :" />
               <div className='py-4'>
                    <div className="flex flex-col items-center justify-center border border-dashed border-gray-400 p-4 rounded-lg  " onClick={handlepickerOpen}>
                        <label className="cursor-pointer flex flex-col items-center space-y-2">
                            <RiUploadCloud2Line className="w-10 h-10 text-gray-500" />
                            <span className="text-sm text-gray-500">Cliquez pour télécharger le rapport</span>
                            {selectedFile.url !== "" && <div className="text-sm  mt-2"> <p className='text-green-600'>Le rapport a été téléchargé.</p>  </div>}
                        </label>
                    </div>
    
                    {selectedFile.url !== "" && <div className=' pt-2 w-full flex items-center justify-end'><a href={selectedFile.embedUrl} target='_blank' className=' underline text-blue-500 font-medium' >Voir rapport</a></div>}
               </div>
                <div className="flex items-center justify-center gap-x-6 mt-2 ">
                    <button disabled={selectedFile.url === ""} className={`${selectedFile.url === "" ? "cursor-not-allowed" : "cursor-pointer"} outline-none w-full bg-blue-500 hover:bg-blue-700 rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all `} onClick={() => { setNextStep(!nextStep) }}>Suivant</button>
                    <button className=" outline-none w-full bg-red-500 hover:bg-red-700  rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => setSelectedFile({ embedUrl: "", url: "" })}>Annuler</button>
                </div>
            </div>}
            {nextStep && <div className='bg-white w-xl px-6 py-10 rounded-md shadow border border-gray-100  space-y-4'>
                <div className="space-y-1">
                    <label
                        htmlFor=""
                        className="block font-medium">
                        titre du rapport
                    </label>
                    <input
                        onChange={handleChange}
                        value={form.nom}
                        name="nom"
                        type="text"
                        placeholder="Entrez le titre  du rapport "
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
                <div className="flex items-center justify-center gap-x-6  ">
                    <button className=" outline-none w-full bg-blue-500 hover:bg-blue-700 rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer">Deposer</button>
                    <button className=" outline-none w-full bg-red-500 hover:bg-red-700  rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => { setNextStep(!nextStep) }}>Annuler</button>
                </div>
            </div>}
           
        </section>
    )
}

export default DeposerRapport

