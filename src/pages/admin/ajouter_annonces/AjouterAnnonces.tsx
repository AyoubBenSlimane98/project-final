

import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiImageAddFill } from "react-icons/ri";
import { useAuthStore } from "../../../store";
import { useShallow } from "zustand/shallow";
import { FaCheckCircle } from "react-icons/fa";

const addNewArticle = async (form: {
    titre: string,
    description: string,
    image?: string
}, accessToken: string) => {
    const response = await fetch('http://localhost:4000/api/admin/annonce', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...form }),
    });

    if (!response.ok) throw new Error("Upload failed");
    return response.json();
}
const uploadFile = async (formData: FormData) => {
    const response = await fetch('http://localhost:4000/api/file-upload/upload', {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");
    return response.json();
};
const AjouterAnnonces = () => {
    const [isSucces, setIsSucces] = useState<boolean>(false)
    const accessToken = useAuthStore(useShallow((state) => state.accessToken))
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [form, setForm] = useState<{ titre: string; description: string; image?: string }>({ titre: '', description: '', image: "" });
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 1. Create FormData and append the file with the correct field name ('file')
        const formData = new FormData();
        formData.append("file", file);  // Use the field name 'file' to match backend

        // 2. Show image preview
        setImagePreview(URL.createObjectURL(file));

        // 3. Call mutate with the FormData
        mutate(formData);
    };
    const removeImage = () => {
        setImagePreview(null);
        setUploadedImageUrl(null);
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));

    };
    const { mutate } = useMutation({
        mutationFn: uploadFile,
        onSuccess: (data) => {
            console.log(data)
            setUploadedImageUrl(data.filePath);
        },
        onError: (error) => {
            console.error(error);

        }
    });
    useEffect(() => {
        if (isSucces) {
            const timer = setTimeout(() => setIsSucces(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isSucces]);
    const { mutate: addNewArticleMutate } = useMutation({
        mutationFn: ({ form, accessToken }: { form: { titre: string; description: string; image?: string }, accessToken: string }) => addNewArticle(form, accessToken),
        onSuccess: () => {
            setIsSucces(true)
            setForm({ titre: '', description: '', image: '' });
            setImagePreview(null);
            setUploadedImageUrl(null);
        },
        onError: (error) => {
            console.error(error);

        }
    });
    const handleSubmit = () => {
        if (accessToken) {
            addNewArticleMutate({
                form: {
                    titre: form.titre,
                    description: form.description,
                    image: uploadedImageUrl ?? "",
                },
                accessToken,
            });
        }

    }
    const handleCancel = () => {
        setForm({ titre: '', description: '', image: "" });
        removeImage()
    }
    return (
        <main className="w-full p-6 flex flex-col mx-auto items-center justify-center gap-2 bg-[#F4F7FD]">

            <div className="w-2xl border border-gray-200 rounded-md px-8 pb-8 pt-6 flex flex-col shadow shadow-gray-200 bg-white">

                <label htmlFor="" className="mb-4">
                    <span className="font-medium">Title: </span>
                    <input type="text" name="titre" id=""
                        value={form.titre}
                        onChange={handleChange}
                        placeholder="Enter the title"
                        className="mt-2 w-full  py-2 px-4 border border-gray-400 outline-none rounded-md  placeholder:text-sm focus:border-2  text-sm text-justify  focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all "
                    />
                </label>
                <div className="space-y-1 mb-4" >
                    <label htmlFor="" className="block font-medium mb-2">Description: </label>
                    <textarea
                        name="description"
                        placeholder="type somthing here..."
                        value={form.description}
                        onChange={handleChange}
                        id=""
                        className="w-full resize-none py-1.5 px-4 border border-gray-400 outline-none rounded-md  placeholder:text-sm focus:border-2 h-28  text-sm text-justify  focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all "></textarea>
                </div>

                {imagePreview ? (
                    <div className="w-full h-56 border border-dashed border-gray-400 rounded-md flex items-center justify-center relative p-4 mb-4">
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-48 w-auto rounded-md shadow-lg"
                            />
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
                        <span className="text-xs text-gray-400">Click to upload</span>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                )}

                <div className="flex items-center justify-center gap-x-6">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 hover:bg-blue-700 rounded-md py-2.5 text-white font-medium"
                    >
                        Ajouter
                    </button>
                    <button onClick={handleCancel} className="w-full bg-red-500 hover:bg-red-700 rounded-md py-2.5 text-white font-medium">
                        Annuler
                    </button>
                </div>
            </div>
            <div className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${isSucces ? "bottom-10" : "-bottom-20"} `}>
                <FaCheckCircle className=" text-green-500 text-3xl" />   <p>Annoce ont été créés avec succès.</p>
            </div>
        </main>
    );
};

export default AjouterAnnonces;
