import { ChangeEvent, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiImageAddFill } from "react-icons/ri";

const AjouterAnnonces = () => {

    const [image, setImage] = useState<string | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const file = files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); 
        }
    };
    const removeImage = () => {
        setImage(null);
    };
    return (

        <main className="w-full  p-6 flex flex-col mx-auto items-center justify-center gap-2 bg-[#F4F7FD] ">

            <div className="w-2xl border border-gray-200 rounded-md px-8 pb-8 pt-6 flex flex-col  shadow shadow-gray-200 bg-white ">
                <header className="mb-2 flex items-center justify-between ">
                    <div className="flex items-center gap-4">
                        <img src="https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className="w-12 h-12 object-cover rounded-full border border-gray-200" loading="lazy" />
                        <div>
                            <h2 className="font-medium">Benslimane Ayyoub</h2>
                            <p className="text-[14px] font-mono">{ }</p>
                        </div>
                    </div>

                </header>
                <hr className="text-gray-300 w-full h-0.5 mb-4" />
                <div className="space-y-1 mb-4" >
                    <label htmlFor="" className="block font-medium mb-2">Qu'est-ce qui te préoccupe ?</label>
                    <textarea
                        name=""
                        id=""
                        className="w-full resize-none py-1.5 px-4 border border-gray-400 outline-none rounded-md  placeholder:text-sm focus:border-2 h-40  text-sm text-justify  focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all "></textarea>
                </div>
                {image ? (
                    <div className="w-full h-56 border border-dashed border-gray-400 rounded-md flex items-center justify-center relative p-4 mb-4">

                        <div className="relative">
                            <img src={image} alt="Preview" className="h-48 w-auto rounded-md shadow-lg" />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <IoMdClose />
                            </button>
                        </div>

                    </div>
                ) : (
                    <label
                        htmlFor="file-upload"
                        className="text-gray-500 text-sm cursor-pointer flex justify-center gap-2 items-center border border-gray-400 py-2 rounded-md mb-4 hover:bg-slate-50 transform duration-200 ease-in-out transition-all"
                    >
                        <RiImageAddFill className="text-xl text-green-400" />
                        <span className="text-xs text-gray-400"> click to upload</span>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                )}
                <div className="flex items-center justify-center gap-x-6  ">
                    <button className=" outline-none w-full bg-blue-500 hover:bg-blue-700 rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer">Ajouter</button>
                    <button className=" outline-none w-full bg-red-500 hover:bg-red-700  rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer">Annuler</button>
                </div>
            </div>

        </main>

    )
}

export default AjouterAnnonces

