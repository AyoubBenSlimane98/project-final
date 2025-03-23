import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { MdBlock } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AnnoncesContext, useAnnocesContext } from "../../../context";
import admin from "../../../assets/adminnnn.jpg"

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

type PostItemProps = {
    post: Posts;
};
function PostItem({ post }: PostItemProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { blockPost, blockedPosts, setPostToDelete } = useAnnocesContext();
    const isBlocked = blockedPosts.some((p) => p.id === post.id);

    return (
        <section className='w-[600px] h-auto bg-white flex flex-col p-3 rounded-xl shadow relative'>
            <header className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={admin} alt="" className="w-12 h-12 object-cover rounded-full border border-gray-200" loading="lazy" />
                    <div>
                        <h2 className="font-medium">Benslimane Ayyoub</h2>
                        <p className="text-[14px] font-mono">{post.date.toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="hover:bg-gray-100 p-1 rounded-full flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        <HiDotsVertical className="text-2xl" />
                    </div>
                    {isOpen && (
                        <ul className="absolute flex flex-col bg-white w-44 drop-shadow-xs shadow-lg rounded-lg px-2 py-3 gap-2 right-9 top-0 *:hover:bg-slate-100 *:hover:px-4 transform duration-300 ease-in-out transition border border-gray-100">
                            <li className="flex items-center font-medium p-1 cursor-pointer" onClick={() => { blockPost(post); setIsOpen(false); }}>
                                <MdBlock className="mr-2 text-red-500" /> Block
                            </li>
                            <li className="flex items-center font-medium p-1 cursor-pointer">
                                <FaUserEdit className="mr-2 text-blue-500" /> Edit
                            </li>
                            <li className="flex items-center font-medium p-1 cursor-pointer" onClick={() => setPostToDelete(post)}>
                                <RiDeleteBin5Fill className="mr-2 text-red-500" /> Delete
                            </li>
                        </ul>
                    )}
                </div>
            </header>
            <hr className="text-gray-200 w-full h-0.5 mb-4" />
            <div className="flex flex-col">
                {post.content && <p className="text-[0.95rem] px-1 font-light mb-4">{post.content}</p>}
                {post.image && <div className="w-full h-96 "><img src={post.image} alt="" className="w-full h-96 aspect-square rounded-md" loading="lazy" /></div>}
            </div>
            {isBlocked && (
                <section className="absolute top-0 left-0 w-full h-full rounded-xl bg-black/45 flex justify-center items-center">
                    <MdBlock className="text-red-500 text-7xl" />
                </section>
            )}
        </section>
    );
}

export const ConsulterAnnonces = () => {
    const [posts, setPosts] = useState<Posts[]>(allposts);
    const [blockedPosts, setBlockedPosts] = useState<Posts[]>([]);
    const [postToDelete, setPostToDelete] = useState<Posts | null>(null);

    const deletePost = (post: Posts) => {
        setPosts(posts.filter((p) => p.id !== post.id));
        setPostToDelete(null);
    };


    const blockPost = (post: Posts) => {
        setBlockedPosts((prev) => [...prev, post]);
        setTimeout(() => { setPosts(posts.filter((p) => p.id !== post.id)); }, 3000)
    };

    return (
        <AnnoncesContext.Provider value={{ setPostToDelete, blockPost, blockedPosts }}>
            <section className="w-full h-svh bg-[#F4F7FD]">
                <div className="w-full py-8 h-full overflow-auto flex flex-col items-center gap-y-8">
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
                {postToDelete &&
                    <div className="z-50  ml-40 w-[520px] h-56 bg-white flex flex-col items-center justify-center rounded-[20px]  drop-shadow-lg shadow absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" >
                        <div className="mb-6">
                            <h2 className=" font-medium text-xl mb-2">Voulez-vous vraiment supprimer cet post ?</h2>

                        </div>
                        <div className="w-full flex items-center justify-center gap-x-6 ">
                            <button className="outline-none w-44  border border-gray-400 text-black hover:bg-gray-950 rounded-md py-1.5 hover:text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => setPostToDelete(null)} >
                                Annuler
                            </button>
                            <button className="outline-none w-44 border-none  bg-red-500 hover:bg-red-700 rounded-md py-1.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => deletePost(postToDelete)}  >
                                supprimer
                            </button>
                        </div>
                    </div>
                }
            </section>
        </AnnoncesContext.Provider>
    );
};

