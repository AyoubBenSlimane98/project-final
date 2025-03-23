import { ChangeEvent, useState } from "react";
import { IoMdClose } from "react-icons/io";



const AjouterAnnonces = () => {

    const [image, setImage] = useState<string | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const file = files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // Create preview URL
        }
    };
    const removeImage = () => {
        setImage(null);
    };
    return (

        <main className="w-full  p-6 flex flex-col mx-auto items-center justify-center gap-2 bg-[#F4F7FD] ">

            <div className="w-2xl border border-gray-100  bg-white rounded-md py-4 flex items-center justify-center gap-x-6 shadow shadow-gray-200">
                <h2 className="text-2xl font-bold text-center text-gray-950 ">Ajouter Annonces</h2>
            </div>
            <div className="w-2xl border border-gray-200 rounded-md px-8 py-10 flex flex-col gap-y-4 shadow shadow-gray-200 bg-white ">

                <div className="space-y-1" >
                    <label htmlFor="" className="block font-medium">Qu'est-ce qui te préoccupe ?</label>
                    <textarea
                        name=""
                        id=""
                        className="w-full resize-none py-1.5 px-4 border border-gray-400 outline-none rounded-md  placeholder:text-sm focus:border-2 h-30  text-sm text-justify  focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all "></textarea>
                </div>

                <div className="w-full border border-dashed border-gray-400 h-56 rounded-md flex items-center justify-center relative p-4">
                    {image ? (
                        <div className="relative">
                            <img src={image} alt="Preview" className="h-48 w-auto rounded-md shadow-lg" />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <IoMdClose />
                            </button>
                        </div>
                    ) : (
                        <label
                            htmlFor="file-upload"
                            className="text-gray-500 text-sm cursor-pointer flex flex-col items-center"
                        >
                            <span className="font-semibold">Drag & Drop image here</span>
                            <span className="text-xs text-gray-400">(or click to upload)</span>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    )}
                </div>

            </div>
            <div className="w-2xl py-4 flex items-center justify-center gap-x-6 ">
                <button className=" outline-none w-64 bg-blue-500 hover:bg-blue-700 rounded-md py-2 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer">Ajouter</button>
                <button className=" outline-none w-64 bg-red-500 hover:bg-red-700  rounded-md py-2 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer">Annuler</button>
            </div>
        </main>

    )
}

export default AjouterAnnonces
