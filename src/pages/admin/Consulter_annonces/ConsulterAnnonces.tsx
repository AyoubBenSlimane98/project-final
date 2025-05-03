import { ChangeEvent, useEffect, useState } from "react";
import { FaImage, FaUserEdit } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { RiDeleteBin5Fill, RiImageAddFill } from "react-icons/ri";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store";
import { useShallow } from "zustand/shallow";
import { IoCloseOutline } from "react-icons/io5";

type MyPostItemprpos = {
    post: Post;
    setIsUpdate: (isUpdate: boolean) => void;
    setUpdatePost: (post: Post) => void;
    setIsDelete: (isDelete: boolean) => void;
    refetch: () => void;
}
type MyUpdatePrpos = {
    updatePost: Post;
    setIsUpdate: (isUpdate: boolean) => void;
    accessToken: string;
    refetch: () => void;
}
type MyDeletePrpos = {
    updatePost: Post;
    accessToken: string;
    setIsDelete: (isDelete: boolean) => void;
    refetch: () => void;
}

type Post = {
    idA: number;
    titre: string;
    description: string;
    image: string;
    createdAt: string;
    updadedAt: string;
}
type UpdatePost = {
    titre: string;
    description: string;
    image: string;
}
const uploadFile = async (formData: FormData) => {
    const response = await fetch('http://localhost:4000/api/file-upload/upload', {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");
    return response.json();
};
const getAllAnnonces = async (accessToken: string) => {
    const response = await fetch(
        "http://localhost:4000/api/admin/all-Annonces",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) throw new Error("Unable to Get all POST's");
    return response.json()
}
const getInfoAdmin = async (accessToken: string) => {
    const response = await fetch(
        "http://localhost:4000/api/admin/info-profil",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) throw new Error("Unable to Get Info Admin");
    return response.json()
}
const deletePost = async ({ id, accessToken }: { id: number; accessToken: string }) => {
    console.log({ id, accessToken })
    const response = await fetch(`http://localhost:4000/api/admin/annonce/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) throw new Error("Upload failed");
    return response.json();
}
const updateAnnoces = async ({ id, accessToken, post }: { id: number; accessToken: string, post: UpdatePost }) => {
    console.log({ id, accessToken })
    const response = await fetch(`http://localhost:4000/api/admin/annonce/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...post })
    });

    if (!response.ok) throw new Error("Upload failed");
    return response.json();
}

function PostItem({ post, setIsUpdate, setUpdatePost, setIsDelete }: MyPostItemprpos) {
    const accessToken = useAuthStore(useShallow((state) => state.accessToken))
    const { data } = useQuery({
        queryKey: ["Info-Admin", accessToken],
        queryFn: ({ queryKey }) => {
            const [, accessToken] = queryKey;
            return getInfoAdmin(accessToken as string);
        },
        enabled: !!accessToken
    })

    const [isOpen, setIsOpen] = useState<boolean>(false);


    const isoDate = post.createdAt
    const date = new Date(isoDate);
    const formatted = `${date.getFullYear()}, ${date.toLocaleString('en-US', { month: 'long' })} ${String(date.getDate()).padStart(2, '0')}`;
    return (
        <section className='w-2xl h-auto bg-white flex flex-col rounded-md shadow relative'>
            <header className="flex items-center justify-between pl-4 pr-2 py-4">
                <div className="flex items-center gap-4">
                    <img onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://scontent.fczl2-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeF_OWSBlL4_ahZGK8uktg7YWt9TLzuBU1Ba31MvO4FTUAcNr-rcAk0Q6wgee_n1MVfJVXKEYXEpVc_A8npzsuDs&_nc_ohc=pCF_EXqQ5MYQ7kNvwGqbQH8&_nc_oc=AdmOQDv_qA9yPoDAQK2j4m8cM77HYt2osPaGYZiWQNIR41-_Kkg1lN_m_n79WacUl90&_nc_zt=24&_nc_ht=scontent.fczl2-2.fna&oh=00_AfEfE4VyUFM1gD2VkajBmRMamhtVSp2NpcihUNDqLsAtzg&oe=681B903A'
                    }}
                        src={`http://localhost:4000/${data?.image}`}
                        alt="" className="w-14 h-14 object-cover rounded-full border border-gray-200"
                        loading="lazy" />
                    <div>
                        <h2 className="text-lg pb-1">{data?.bio}</h2>
                        <p className="text-[12px] font-mono">{formatted}</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="hover:bg-gray-100 p-1 rounded-full flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        <HiDotsVertical className="text-2xl" />
                    </div>
                    {isOpen && (
                        <ul className="absolute flex flex-col bg-white w-56 drop-shadow-xs shadow-lg rounded-md px-2 py-3 gap-2 right-9 top-0 *:hover:bg-slate-100 *:hover:px-4 transform duration-300 ease-in-out transition border border-gray-100" onMouseLeave={() => setIsOpen(false)}>

                            <li className="flex items-center font-medium p-1 cursor-pointer" onClick={() => { setIsUpdate(true); setIsOpen(false); setUpdatePost(post) }} >
                                <FaUserEdit className="mr-2 text-blue-500" /> Edit
                            </li>
                            <li className="flex items-center font-medium p-1 cursor-pointer" onClick={() => { setIsOpen(false); setIsDelete(true); setUpdatePost(post) }}>
                                <RiDeleteBin5Fill className="mr-2 text-red-500" /> Delete
                            </li>
                        </ul>
                    )}
                </div>
            </header>
            <hr className="text-gray-200 w-full h-0.5 mb-4 " />
            <div className="flex flex-col px-2 mb-2">
                {post.description && <div className="text-[0.95rem] px-1 font-light mb-4">
                    <h2 className="font-semibold text-xl pb-2"> {post.titre}</h2>
                    <p> {post.description}</p>
                </div>}
                {post.image && <div className="w-full h-96  "><img src={`http://localhost:4000/${post.image}`} alt="" className="w-full h-96 aspect-square " loading="lazy" /></div>}
            </div>
        </section>
    );
}

function UpdatePost({ setIsUpdate, updatePost, accessToken, refetch }: MyUpdatePrpos) {
    const [imageView, setImageView] = useState<boolean>(false);
    const [form, setForm] = useState<{ titre: string; description: string; image: string }>({ titre: '', description: '', image: "" });
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        mutate(formData);
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
            setForm((prev) => ({ ...prev, image: data.filePath }))
        },
        onError: (error) => {
            console.error(error);

        }
    });

    useEffect(() => {
        setForm({ titre: updatePost.titre, description: updatePost.description, image: updatePost.image })
    }, [updatePost])

    const { mutate: updateOldPost } = useMutation({
        mutationFn: ({ id, accessToken, post }: { id: number, accessToken: string, post: UpdatePost }) => updateAnnoces({ id, accessToken, post }),
        onSuccess: (data) => {
            console.log(data);
            setIsUpdate(false);
            refetch()
        },
        onError: (error) => {
            console.warn(error)
        }
    })
    const handleUpdatePost = () => {
        if (accessToken && form && updatePost) {
            updateOldPost({ id: updatePost.idA, accessToken, post: { ...form } })
        }
    }
    return (
        <div className="w-3xl  rounded-sm  flex flex-col bg-white " >
            <header className=" flex items-center justify-between py-6 pr-4 ">
                <div className="w-[60%] px-6">
                    <p className=" text-3xl font-medium">Annoces</p>
                </div>
                <IoCloseOutline className="text-3xl text-gray-400" onClick={() => setIsUpdate(false)} />
            </header>
            <hr className="text-gray-300 w-full h-0.5  shadow drop-shadow" />
            <div className=" px-6 py-8 flex flex-col drop-shadow  bg-white relative">
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
                {form.image && (
                    <div className=" w-full flex items-center justify-between">
                        <p className="block font-medium ">Image view </p>
                        <div className=" flex items-center gap-6 ">
                            <button onClick={() => setImageView(true)} className="flex items-center  text-gray-500 text-sm cursor-pointer justify-center  px-6 border border-gray-400 py-2 rounded-md  hover:bg-slate-50 transform duration-200 ease-in-out transition-all gap-2"><FaImage className="text-xl" /><span>View</span> </button>
                            <label
                                htmlFor="file-upload"
                                className=" text-gray-500 text-sm cursor-pointer flex justify-center gap-2 px-6 items-center border border-gray-400 py-2 rounded-md  hover:bg-slate-50 transform duration-200 ease-in-out transition-all"
                            >
                                <RiImageAddFill className="text-xl text-green-400" />
                                <span className="text-xs text-gray-400">Upload</span>
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>
                )}
                {imageView && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ">
                        <IoCloseOutline className="text-3xl text-red-400 hover:text-red-600 transform duration-150 ease-in-out  absolute right-1 top-1" onClick={() => setImageView(false)} />
                        <img
                            src={`http://localhost:4000/${form.image}`}
                            alt="Preview"
                            className="h-72 shadow-lg "
                        />
                    </div>
                )}
            </div>
            <footer className=" border-t border-gray-200 rounded-none  shadow flex items-center justify-center gap-x-6 p-6 ">
                <button className=" outline-none w-full bg-blue-500 hover:bg-blue-700 rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={handleUpdatePost}>Modifier</button>
                <button className=" outline-none w-full bg-red-500 hover:bg-red-700  rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => setIsUpdate(false)}>Annuler</button>
            </footer>
        </div >
    )
}
function CardPostToDelete({ accessToken, updatePost, setIsDelete, refetch }: MyDeletePrpos) {
    const { mutate } = useMutation({
        mutationFn: ({ id, accessToken }: { id: number; accessToken: string }) => deletePost({ id, accessToken }),
        onSuccess: (data) => {
            setIsDelete(false);
            refetch();
            console.log("data succes : ", data)
        },
        onError: (error) => {
            console.warn(error)
        }
    })
    const handleDelete = () => {
        if (accessToken && updatePost) {
            mutate({ id: updatePost.idA, accessToken });
        }
    }
    return (
        <div className="z-40   w-[520px] h-56 !bg-white flex flex-col items-center justify-center rounded-[20px]  drop-shadow-lg shadow absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" >
            <div className="mb-6">
                <h2 className=" font-medium text-xl mb-2">Voulez-vous vraiment supprimer cet post ?</h2>

            </div>
            <div className="w-full flex items-center justify-center gap-x-6 ">
                <button className="outline-none w-44  border border-gray-400 text-black hover:bg-gray-950 rounded-md py-1.5 hover:text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => setIsDelete(false)} >
                    Annuler
                </button>
                <button className="outline-none w-44 border-none  bg-red-500 hover:bg-red-700 rounded-md py-1.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={handleDelete}  >
                    supprimer
                </button>
            </div>
        </div>
    )
}
export const ConsulterAnnonces = () => {
    const accessToken = useAuthStore(useShallow((state) => state.accessToken))
    const [posts, setPosts] = useState<Post[]>([]);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [updatePost, setUpdatePost] = useState<Post | null>(null);


    const { data, refetch } = useQuery({
        queryKey: ["All-Posts", accessToken],
        queryFn: ({ queryKey }) => {
            const [, accessToken] = queryKey;
            return getAllAnnonces(accessToken as string);
        },
        enabled: !!accessToken
    })
    useEffect(() => {
        if (data) {
            setPosts(data.annonces)
        }
    }, [data])

    return (

        <section className="w-full h-svh bg-[#F4F7FD] relative">
            {posts.length === 0 && <div className="w-full h-svh flex items-center justify-center">
                <h2 className="text-5xl text-gray-500">il n'y a pas de Annonces</h2>
            </div>}
            <div className="w-full py-8 h-full overflow-auto flex flex-col items-center gap-y-8">
                {posts.map((post) => (
                    <PostItem key={post.idA} post={post} setIsUpdate={setIsUpdate} setUpdatePost={setUpdatePost} setIsDelete={setIsDelete} refetch={refetch} />
                ))}
            </div>
            {isDelete &&

                <section className="absolute top-0 left-0 w-full h-svh bg-black/45 z-30 flex justify-center items-center">
                    {updatePost && accessToken && <CardPostToDelete updatePost={updatePost} accessToken={accessToken} setIsDelete={setIsDelete} refetch={refetch} />}
                </section>

            }
            {isUpdate && (
                <section className="absolute top-0 left-0 w-full h-svh bg-black/45 z-30 flex justify-center items-center">
                    {updatePost && accessToken && <UpdatePost setIsUpdate={setIsUpdate} updatePost={updatePost} accessToken={accessToken} refetch={refetch} />}
                </section>
            )}


        </section>

    );
};




