
import { IoClose, IoSend } from 'react-icons/io5'

import { ChangeEvent, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { FaCommentDots, FaHeart } from 'react-icons/fa';
import { PostContext, usePostContext } from '../../../context';


type Posts = {
    id: number;
    content?: string;
    date: Date;
    image?: string;
    nbrComment: number;
    nbrLike: number;
}

const posts: Posts[] = [
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



function TitlePost() {
    const { setIsOpen, setIsComment, isComment, isOpen } = usePostContext();
    return (
        <header className='w-[700px] bg-white flex justify-end items-center gap-12 h-[60px] drop-shadow-md rounded-t-2xl'>
            <div className='shrink-0  basis-2/3 flex items-center justify-between pr-2 '>
                <h2 className='text-3xl font-semibold '>Admin's Post</h2>
                <div className='shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[#EFF2F5] hover:text-red-400  transform duration-150 ease-in-out transition ' onClick={() => { setIsOpen(!isOpen); setIsComment(!isComment) }} >
                    <IoClose className='text-2xl ' />
                </div>
            </div>
        </header>
    )
}
function Comment() {
    return (
        <div className=" w-full flex  gap-4 text-[#080809]  ">
            <img src="https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className="w-9 h-9 object-cover shrink-0 mt-1 rounded-full" loading="lazy" />
            <div className=" bg-[#EFF2F5] border-none outline-none rounded-4xl px-4 py-2 w-full">
                <p className="font-medium mb-2">Benslimane ayyoub</p>
                <p className="text-sm text-wrap"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem quia dolores ex reprehenderit at repellat? Possimus amet quos sint dolor error blanditiis quibusdam rerum doloribus, esse voluptates similique maxime quas.</p>
            </div>
        </div>
    )
}
function BodyPost() {
    const { isComment } = usePostContext();

    return (
        <section className='w-[700px] h-[460px] bg-white flex flex-col gap-1 outline-none border-r-2 border-l-2 border-white px-4 overflow-auto'>
            {/* Header */}
            <header className="py-2.5 flex items-center justify-between gap-x-2.5 ">
                <div className="flex items-center justify-baseline gap-2">
                    <img
                        src="https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt=""
                        className="w-12 h-12 object-cover rounded-full "
                        loading="lazy" />
                    <div className="">
                        <h2 className="font-medium">Benslimane Ayyoub</h2>
                        <p className="text-[14px] font-mono">Dec 12</p>
                    </div>
                </div>
                <div className="hover:bg-gray-100 w-9 h-9 rounded-full flex items-center justify-end transform duration-300 ease-in-out transition cursor-pointer" >
                    <HiDotsVertical className="text-2xl " />
                </div>
            </header>
            <hr className="text-gray-200 w-full h-0.5 mb-4" />

            {/* body */}
            <div className="flex flex-col gap-y-2.5  ">

                <div className="w-full  whitespace-normal leading-5  line-clamp-4  text-[0.95rem] px-1  text-[#080809] font-light mb-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, quia odit eos dolorem illo quaerat delectus molestiae eaque, veritatis tempore debitis tenetur, necessitatibus facilis ea quibusdam tempora repellat ex expedita!
                </div>
                <div className="mb-4">
                    <img src="https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className="w-[700px] h-[625px] " loading="lazy" />
                </div>
            </div>
            {/* footer */}
            <div className={`w-full flex flex-col  items-center justify-between `} >
                <div className="w-full px-6">
                    <div className=" shrink-0 flex flex-row items-center justify-between w-full  text-sm pb-1.5 cursor-default  ">
                        <div>3 like</div>
                        <div>12 comment</div>
                    </div>
                    <hr className="text-gray-200 w-full pb-1" />
                    <div className="w-full flex justify-between items-center gap-20">
                        <div className="text-[#59626B] basis-1/2 flex items-center justify-center gap-x-3 hover:bg-[#F2F2F2] transform duration-300 ease-in-out transition rounded-md py-1 px-2 cursor-pointer">
                            <FaHeart className="text-lg" />
                            <span className=" font-medium text-lg">like</span>
                        </div>
                        <div className="text-[#59626B] basis-1/2 flex items-center justify-center gap-x-3 hover:bg-[#F2F2F2] transform duration-300 ease-in-out transition rounded-md py-1 px-2 cursor-pointer"  >
                            <FaCommentDots className="text-xl" />
                            <span className=" font-medium text-lg">comment</span>
                        </div>
                    </div>
                </div>
                {isComment && (
                    <div className="w-full h-full">
                        <div className="w-full px-6 mt-1"><hr className="text-gray-200 w-full " /></div>
                        <div className="w-full flex flex-col items-center gap-4  px-4 py-4">
                            <Comment />
                            <Comment />
                            <Comment />
                            <Comment />
                            <Comment />
                            <Comment />
                            <Comment />
                            <Comment />
                        </div>
                    </div>
                )}

            </div>
        </section>
    )
}
function CommentPosts() {
    const [comment, setComment] = useState<string | null>(null);
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value)
    }
    return (
        <footer className='w-[700px] h-[108px] bg-white  px-4 drop-shadow-lg rounded-b-2xl'>
            <div className="w-full h-full flex  gap-4 py-4 px-3  outline-none  ">
                <img src="https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className="w-9 h-9 object-cover mt-1 rounded-full" loading="lazy" />
                <div className="w-full flex gap-x-1 items-center text-[#080809]">
                    <textarea name="" id="" className="w-full h-20 border-none outline-none rounded-md p-2 text-sm resize-none bg-[#EFF2F5]" placeholder="cree votre comment ici ..." onChange={handleChange}></textarea>
                    <button className="shrink-0 w-10 h-10  pl-2 flex items-center justify-center  cursor-pointer" disabled={comment === ""}>
                        <IoSend className={`${comment ? "text-[#005FCE]" : "text-[#BDC3C9]"} text-3xl`} />
                    </button>
                </div>
            </div>
        </footer>
    )
}
function PostPop() {

    return (

        <section  >
            <TitlePost />
            <BodyPost />
            <CommentPosts />
        </section>

    )
}

function Post({ image, content, nbrComment, nbrLike }: Posts) {
    const { setIsOpen, setIsComment, isComment, isOpen } = usePostContext();
    return (
        <section className='w-[700px] h-auto bg-white flex flex-col pt-4 pb-2 outline-none border  border-white rounded-xl px-4 '>
            {/* Header */}
            <header className="py-2.5 flex items-center justify-between  ">
                <div className="flex items-center justify-baseline gap-4">
                    <img
                        src="https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt=""
                        className="w-12 h-12 object-cover rounded-full "
                        loading="lazy" />
                    <div className="">
                        <h2 className="font-medium">Benslimane Ayyoub</h2>
                        <p className="text-[14px] font-mono">Dec 12</p>
                    </div>
                </div>
                <div className="hover:bg-gray-100 w-9 h-9 rounded-full flex items-center justify-end transform duration-300 ease-in-out transition cursor-pointer" >
                    <HiDotsVertical className="text-2xl " />
                </div>
            </header>
            <hr className="text-gray-200 w-full h-0.5 mb-4" />
            {/* body */}
            <div className="flex flex-col ">

                {content && <div className="w-full  whitespace-normal leading-5  line-clamp-4  text-[0.95rem] px-1  text-[#080809] font-light mb-4">
                    {content}
                </div>}
                {image && <div className="mb-2.5 bg-black w-full flex items-center justify-center ">
                    <img src={image} alt="" className="w-96 h-96 aspect-auto " loading="lazy" />
                </div>}
            </div>

            {/* footer */}
            <div className={`w-full flex flex-col  items-center justify-between  `} >
                <div className="w-full ">
                    <div className=" shrink-0 flex flex-row items-center justify-between w-full  text-sm pb-2 cursor-default  ">
                        <div>{nbrLike} like</div>
                        <div>{nbrComment} comment</div>
                    </div>
                    <hr className="text-gray-200 w-full pb-2.5" />
                    <div className="w-full flex justify-between items-center gap-20">
                        <div className="text-[#59626B] basis-1/2 flex items-center justify-center gap-x-3 hover:bg-[#F2F2F2] transform duration-300 ease-in-out transition rounded-md py-1 px-2 cursor-pointer">
                            <FaHeart className="text-lg" />
                            <span className=" font-medium text-lg">like</span>
                        </div>
                        <div className="text-[#59626B] basis-1/2 flex items-center justify-center gap-x-3 hover:bg-[#F2F2F2] transform duration-300 ease-in-out transition rounded-md py-1 px-2 cursor-pointer" onClick={() => { setIsOpen(!isOpen); setIsComment(!isComment) }}  >
                            <FaCommentDots className="text-xl" />
                            <span className=" font-medium text-lg">comment</span>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    )
}
const AllPost = () => {
    const [isComment, setIsComment] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <PostContext.Provider value={{ isComment, isOpen, setIsOpen, setIsComment }}>
            <main className={`w-full min-h-screen relative bg-[#F6F6F6]   `}>
                <div className={`w-full h-full flex flex-col gap-8 justify-evenly items-center overflow-hidden relative ${isOpen ? "opacity-40" : ""} pt-28 pb-12`}>
                    {posts.map((post) => (<Post key={post.id} {...post} />))}
                </div>
                {isOpen && <div className='fixed top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2 z-40 mt-8'><PostPop /></div>}
            </main>
        </PostContext.Provider >
    )
}

export default AllPost

