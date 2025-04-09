
import { MdOutlineAddLink } from "react-icons/md";
import { CustomSelect } from "../../../../util/CustomSelect"
const groupe: string[] = ["Groupe 1", "Groupe 2", "Groupe 3"];

export const OrganiserRenion = () => {
    return (
        <section className="w-full h-full flex justify-center items-center bg-[#F4F7FD] overflow-hidden pt-30 pb-24">
            <form className="w-1/2 bg-white shadow-md rounded-md px-8 pt-6 pb-8 ">
                <h2 className="text-2xl font-bold mb-4">Organiser une réunion</h2>
                <div className="mb-3 flex flex-col  gap-4">                   
                    <input
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
                        id="title"
                        type="text"
                        placeholder="Entrez le titre de la réunion"
                    />
                    <div className="flex items-center  gap-4">
                        <input
                            id="meet-link"
                            type="url"
                            placeholder="https://meet.google.com/qtp-rxmv-sjw"
                            required
                            pattern="https://.*"
                            className='bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-2.5 px-4'
                        />
                        <button
                            className=" cursor-pointer border outline-none bg-gray-50  border-gray-300 text-gray-900   transform duration-200 ease-in-out transition-all hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded-md hover:border-blue-700 "
                            type="button"
                            onClick={() => window.open("https://meet.google.com/landing", "_blank")}
                        >
                            <MdOutlineAddLink className="text-2xl " />
                        </button>
                    </div>
                    <CustomSelect  responsable={groupe} />
                    <textarea
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
                        id="notes"
                        placeholder="Entrez des remarques supplémentaires"
                        rows={3}
                    ></textarea>
                </div>
               
                    <div className="mb-3 ">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                          début de la réunion
                        </label>
                        <input
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
                            id="date"
                            type="datetime-local"
                            defaultValue={""}
                            placeholder="Sélectionnez la date et l'heure de début"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                           fin de la réunion
                        </label>
                        <input
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
                            id="date"
                            type="datetime-local"
                            placeholder="Sélectionnez la date et l'heure de fin"
                        />
                    </div>
                   
                <div className="w-full flex justify-center items-center gap-6 ">
                    <button
                        className=" basis-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                    >
                        Organiser la réunion
                    </button>
                    <button
                        className="basis-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                    >
                        Annuler
                    </button>
                </div>
            </form >
        </section >
    )
}
