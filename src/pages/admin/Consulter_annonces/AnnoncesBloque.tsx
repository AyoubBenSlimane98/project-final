import { BiArrowBack } from "react-icons/bi"
import { HiDotsHorizontal } from "react-icons/hi";
import { NavLink } from "react-router"
import admin from "../../../assets/adminnnn.jpg"
import { ChangeEvent, useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { LiaReplySolid } from "react-icons/lia";
import { IoCloseOutline } from "react-icons/io5";
import { BlockedPostContext, useBlockedPostContext } from "../../../context";

export type Posts = {
    id: number;
    content?: string;
    date: Date;
    image?: string;
    nbrComment: number;
    nbrLike: number;
}

const allposts: Posts[] = [
    {
        id: 1,
        content: "Exploring the beauty of nature! 🌿",
        date: new Date("2025-03-19T14:00:00Z"),
        image: "https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        nbrComment: 12,
        nbrLike: 45,
    },
    {
        id: 2,
        content: "Just finished an amazing coding session! 💻🔥",
        date: new Date("2025-03-18T10:30:00Z"),
        nbrComment: 8,
        nbrLike: 32,
    },
    {
        id: 3,
        content: "Weekend getaway to the mountains! ⛰️",
        date: new Date("2025-03-17T08:45:00Z"),
        image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        nbrComment: 20,
        nbrLike: 67,
    },
    {
        id: 4,
        content: "New AI model just released! Exciting times ahead. 🤖",
        date: new Date("2025-03-16T19:15:00Z"),
        nbrComment: 15,
        nbrLike: 50,
    },
    {
        id: 5,
        content: "Football match was intense today! ⚽",
        date: new Date("2025-03-15T16:00:00Z"),
        image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        nbrComment: 25,
        nbrLike: 80,
    },
    {
        id: 6,
        content: "Cooking something special tonight! 🍲",
        date: new Date("2025-03-14T12:00:00Z"),
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        nbrComment: 10,
        nbrLike: 30,
    },
    {
        id: 7,
        content: "Learning new TypeScript tricks! 🚀",
        date: new Date("2025-03-13T18:00:00Z"),
        nbrComment: 6,
        nbrLike: 25,
    },
    {
        id: 8,
        content: "Visited a historical site today. Amazing experience! 🏛️",
        date: new Date("2025-03-12T09:30:00Z"),
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        nbrComment: 14,
        nbrLike: 45,
    },
    {
        id: 9,
        content: "Mobile app project is coming along well! 📱",
        date: new Date("2025-03-11T22:00:00Z"),
        nbrComment: 9,
        nbrLike: 35,
    },
    {
        id: 10,
        content: "Exploring new AI algorithms today! 🤓",
        date: new Date("2025-03-10T14:45:00Z"),
        nbrComment: 12,
        nbrLike: 40,
    },
    {
        id: 11,
        content: "Excited for my next travel adventure! ✈️",
        date: new Date("2025-03-09T10:15:00Z"),
        nbrComment: 18,
        nbrLike: 55,
    },
    {
        id: 12,
        content: "Dark mode or light mode? 🤔",
        date: new Date("2025-03-08T21:00:00Z"),
        nbrComment: 30,
        nbrLike: 70,
    },
    {
        id: 13,
        content: "Cybersecurity is more important than ever. Stay safe! 🔐",
        date: new Date("2025-03-07T13:30:00Z"),
        nbrComment: 11,
        nbrLike: 42,
    },
    {
        id: 14,
        content: "Working on a new open-source project! 🌍",
        date: new Date("2025-03-06T17:00:00Z"),
        nbrComment: 7,
        nbrLike: 27,
    },
    {
        id: 15,
        content: "Who else loves Kotlin? 😍",
        date: new Date("2025-03-05T15:00:00Z"),
        nbrComment: 20,
        nbrLike: 60,
    },
];
type PostBlockedProps = {
    post: Posts;
}

function ViewPost({ setIsActive }: { setIsActive: (isACtive: boolean) => void }) {
    const { selectionPost } = useBlockedPostContext();
    return (
        <div className="w-xl h-auto flex flex-col  rounded-lg bg-white relative z-[8888] drop-shadow-2xl shadow border border-gray-300 ">
            <div className=" flex items-center justify-between py-6 px-4">
                <div className="w-full text-center">
                    <p className="font-medium text-3xl"> Poste</p>
                </div>
                <IoCloseOutline className="text-4xl text-gray-400 hover:text-red-600 transform duration-300 ease-in transition " onClick={() => { setIsActive(false) }} />
            </div>
            <div className="w-full h-[1px] bg-gray-200" > </div >
            <div className="flex items-center gap-2.5 py-1.5 px-2">
                <img src={admin} alt="" className="w-14 h-14 object-cover rounded-full border border-gray-200" loading="lazy" />
                <h2 className="font-medium mb-2">Benslimane Ayyoub</h2>
            </div>
            <div className="w-full h-[1px] bg-gray-200 mb-4" > </div >
            <div className="flex flex-col px-2 mb-6">
                {selectionPost?.content && <p className="text-[0.95rem] px-1 font-light mb-4">
                    {selectionPost?.content}
                </p>}
                {selectionPost?.image && <div className="w-full h-96 flex items-center justify-center  relative rounded-md ">
                    <div className="absolute top-0 left-0 w-full h-96 bg-black/90  z-30  rounded-md "></div>
                    <img src={selectionPost?.image} alt="" className="z-50 w-96 h-96 aspect-square " loading="lazy" />
                </div>}
            </div>
        </div >
    )
}
function CardPostBlocked({ post, setIsActive, }: PostBlockedProps & { setIsActive: (isActive: boolean) => void, }) {
    const [isOpenView, setIsOpenView] = useState<boolean>(false);
    const [checkPost, setCheckPost] = useState<boolean>(false);
    const { setSelectionPost, setCount, setSelectionAllPosts, selectionAllPosts, setPosts } = useBlockedPostContext();

    useEffect(() => {
        setCheckPost(!!selectionAllPosts?.find((item) => item.id === post.id))
    }, [post.id, selectionAllPosts])

    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckPost(event.target.checked);

        setSelectionAllPosts((prevSelection: Posts[]) => {
            const updatedSelection = prevSelection ? [...prevSelection] : [];
            if (event.target.checked) {
                if (!updatedSelection.some((item) => item.id === post.id)) {
                    updatedSelection.push(post);
                }
            } else {
                return updatedSelection.filter((item) => item.id !== post.id);
            }
            return updatedSelection;
        });

        setCount((prev) => (event.target.checked ? prev + 1 : prev - 1));
    };

    const deletedPost = (id: number) => {
        setPosts(allposts.filter((item) => item.id !== id))
    }
    return (
        <section className="w-ful py-6 bg-white flex items-center justify-between px-4 rounded-md drop-shadow shadow ">
            <div className=" flex items-center gap-4">
                <div className="flex items-center gap-4">
                    <input type="checkbox" name="check-post" id="all-boleck" className="w-4 h-4" checked={checkPost} onChange={handleCheck} />
                    <img src={admin} alt="" className="w-14 h-14 object-cover rounded-full border border-gray-200" loading="lazy" />
                </div>
                <div className="w-xl">
                    <h2 className="font-medium mb-2">Benslimane Ayyoub</h2>
                    <p className=" line-clamp-1 text-sm font-extralight">
                        {post.content}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 h-full relative ">
                <button className="outline-none  px-6 border  border-gray-400 text-black hover:bg-gray-100 rounded-md py-1  font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => { setIsActive(true); setSelectionPost(post); }} >
                    Voir
                </button>
                <div className="hover:bg-[#F4F7FD] rounded-full p-1 transform duration-200 ease-in-out transition">
                    <HiDotsHorizontal className="text-3xl cursor-pointer" onClick={() => setIsOpenView(!isOpenView)} />

                </div>                {
                    isOpenView && <ul className=" z-50 absolute -top-1 border border-gray-200 right-10 bg-white drop-shadow-md shadow rounded-md w-[400px] flex flex-col gap-2 px-2 py-3.5 *:hover:bg-[#F4F7FD] *:rounded-md transform duration-300 ease-in-out transition-all cursor-pointer">
                        <li className="flex items-center py-1.5 px-2 gap-x-2">
                            <LiaReplySolid className="text-xl" />  <span className="font-medium">Restaurer à page annoces</span>
                        </li>
                        <li className="flex items-center py-1.5 px-2 gap-x-2">
                            <FaTrashAlt className="text-sm" /> <span className="font-medium" onClick={() => deletedPost(post.id)}>Supprimer</span>
                        </li>
                    </ul>
                }
            </div>
        </section>
    )
}
const AnnoncesBloque = () => {
    const [count, setCount] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);

    const [posts, setPosts] = useState<Posts[]>(allposts);
    const [selectionPost, setSelectionPost] = useState<Posts | null>(null);
    const [selectionAllPosts, setSelectionAllPosts] = useState<Posts[]>([]);

    const handleCheckAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectionAllPosts(event.target.checked ? posts : []);
            setCount(event.target.checked ? posts.length : 0);
        }

    };
    const deselectedAll = () => {
        if (selectionAllPosts.length == posts.length) {
            setSelectionAllPosts([]);
            setCount(0);
        } else {
            setSelectionAllPosts([]);
            setCount(0);
            console.log(" delete anther this")
        }

    }


    console.log(selectionAllPosts)

    return (
        <BlockedPostContext.Provider value={{ selectionPost, setSelectionPost, selectionAllPosts, setSelectionAllPosts, count, setCount, setPosts }}>
            <section className="w-full h-svh pt-4   px-10 flex flex-col bg-[#F4F7FD] relative">
                <section className=" shrink-0 w-full h-24 mb-7">
                    <div className="  w-full h-24 bg-white flex items-center justify-between px-4 rounded-md  drop-shadow shadow ">
                        <div className=" flex items-center">
                            <input type="checkbox" name="check-all-post" id="all-boleck" className="w-4 h-4" onChange={handleCheckAll} checked={selectionAllPosts.length == posts.length} />
                            <label htmlFor="all-boleck" className="font-medium text-lg ml-2"> Tous </label>
                        </div>
                        <p className="text-lg  text-green-500">
                            {count > 0 ? count : ""}
                        </p>
                        <div className="flex items-center gap-3">
                            {count > 0 && <button className="outline-none w-44  border flex items-center gap-2 justify-center border-gray-400 text-black hover:bg-gray-100 rounded-md py-1.5  font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={deselectedAll} >
                                Désélectionner
                            </button>}
                            <button disabled={count == 0} className={`outline-none w-44  flex items-center gap-2 justify-center    rounded-md py-1.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer ${count == 0 ? "bg-gray-300" : "bg-indigo-600  hover:bg-indigo-700 "}`}  >
                                <LiaReplySolid className="text-xl" />  Restaurer
                            </button>
                            <button disabled={count == 0} className={`outline-none w-44 border-none flex items-center gap-2 justify-center   rounded-md py-1.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer ${count == 0 ? "bg-gray-300" : " bg-red-500 hover:bg-red-700"} `} >
                                <FaTrashAlt /> <span>supprimer</span>
                            </button>
                        </div>
                    </div>
                </section>
                <section className=" shrink-0 w-full h-[575px] bg-white flex flex-col gap-y-8 overflow-auto py-4 px-4 rounded-md shadow">
                    {posts.map((post) => (
                        <CardPostBlocked key={post.id} post={post} setIsActive={setIsActive} />
                    ))}
                </section>
                <section className={`  ${isActive ? "absolute top-0 left-0 w-full h-svh bg-black/45  z-30 flex items-center justify-center" : " hidden"} `}>
                    <ViewPost setIsActive={setIsActive} />
                </section>
                <NavLink to="/admin/parametre" className=" fixed bottom-4  right-4 bg-green-500 hover:bg-green-600 transform ease-in-out duration-300 transition-all text-white w-12 h-12 rounded-full flex items-center justify-center">
                    <BiArrowBack className="text-2xl" />
                </NavLink>
            </section>
        </BlockedPostContext.Provider>
    )
}

export default AnnoncesBloque
