import { ChangeEvent, useState, KeyboardEvent } from "react";
import { IoSearch, IoSend } from "react-icons/io5";
import CardMessage from "../../../components/CardMessage";
import { GoDotFill } from "react-icons/go";
import { useChatStore } from "../../../store";
import { HiDotsVertical } from "react-icons/hi";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { useShallow } from "zustand/shallow";

export type Message = {
  image: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  currentDate: string;
  messageValid: number;
};
const fakeData: Message[] = [
  {
    image:
      "https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "Ayyoub",
    lastName: "Benslimane",
    lastMessage: "Hello",
    currentDate: "Dec 03",
    messageValid: 0,
  },
  {
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "Sara",
    lastName: "Doe",
    lastMessage: "How are you?",
    currentDate: "Feb 14",
    messageValid: 1,
  },
  {
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "John",
    lastName: "Smith",
    lastMessage: "See you later!",
    currentDate: "Jan 10",
    messageValid: 2,
  },
  {
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "Emily",
    lastName: "Johnson",
    lastMessage: "Good morning!",
    currentDate: "Mar 05",
    messageValid: 4,
  },
  {
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "David",
    lastName: "Williams",
    lastMessage: "Let's meet up!",
    currentDate: "Apr 22",
    messageValid: 1,
  },
  {
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "Sophia",
    lastName: "Brown",
    lastMessage: "Call me back",
    currentDate: "May 19",
    messageValid: 2,
  },
  {
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "James",
    lastName: "Jones",
    lastMessage: "Happy Birthday!",
    currentDate: "Jun 30",
    messageValid: 3,
  },
  {
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "Olivia",
    lastName: "Miller",
    lastMessage: "I'll be there soon",
    currentDate: "Jul 08",
    messageValid: 4,
  },
  {
    image:
      "https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "Liam",
    lastName: "Davis",
    lastMessage: "Check your email",
    currentDate: "Aug 21",
    messageValid: 1,
  },
  {
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "Isabella",
    lastName: "Wilson",
    lastMessage: "See you tomorrow!",
    currentDate: "Sep 12",
    messageValid: 2,
  },
  {
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "Ethan",
    lastName: "Anderson",
    lastMessage: "I'll call you later",
    currentDate: "Oct 29",
    messageValid: 3,
  },
  {
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    firstName: "Ava",
    lastName: "Thomas",
    lastMessage: "Take care!",
    currentDate: "Nov 15",
    messageValid: 4,
  },
];

function ChatHeader() {
  return (
    <div className="px-2 sm:p-4 sm:h-30 ">
      <h2 className="font-medium text-3xl mb-4">Chat</h2>
      <div className="relative w-full">
        <input
          placeholder="Search ..."
          type="text"
          className="border outline-none border-gray-300 w-full  rounded-md py-2 px-10  placeholder:text-gray-400"
        />
        <IoSearch className=" absolute top-2 left-2 text-2xl text-gray-800" />
      </div>
    </div>
  );
}

function ChatBody() {
  return (
    <div className="flex flex-col ">
      {fakeData.map((data, index) => (
        <CardMessage key={index} {...data} />
      ))}
    </div>
  );
}
function LeftChat() {
  const isopen = useChatStore((state) => state.status.isOpen);
  return (
    <div
      className={`w-full md:basis-1/2 lg:basis-1/3 flex flex-col  border-r border-gray-200 p-2  sm:overflow-y-scroll scroll-smooth ${
        isopen ? "hidden sm:block" : ""
      }`}
    >
      <ChatHeader />
      <ChatBody />
    </div>
  );
}
function RightHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useChatStore((state) => state.user);
  const fullName = user.lastName + " " + user.firstName;
  return (
    <div className="w-full flex items-center  justify-between border border-r-0   rounded-r-0 border-gray-200 rounded-l-md sm:border-r sm:rounded-md sm:shadow p-4">
      <div className="flex items-center gap-4  px-2">
        <div className="relative w-12 h-12">
          <img
            src={user.image}
            alt=""
            className="w-12 h-12 rounded-full object-cover  outline-none "
            loading="lazy"
          />
          <div className="absolute bottom-0 -right-1  text-green-400 ">
            <GoDotFill className="text-xl" />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <span className="font-bold uppercase">{fullName}</span>
        </div>
      </div>
      <div className="relative hidden sm:block">
        <HiDotsVertical
          className="text-2xl font-bold hover:text-green-600 cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        />
        {isOpen && (
          <div
            className=" absolute -top-2.5 right-5 bg-white shadow w-40 px-4 py-2 border rounded border-gray-200 cursor-pointer "
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="font-bold hover:text-green-600">
              supprimer chat
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
function RightBody() {
  return (
    <div className="border w-full h-[520px] rounded border-gray-200 "></div>
  );
}
function InputChat() {
  const [data, setData] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setData(event.target.value);
  };
  const sendMessage = () => {
    if (!data.trim()) return;
    console.log("Message send : ", data.trim());
    setData("");
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  return (
    <div className="relative">
      <input
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={data}
        placeholder="Type something here ..."
        type="text"
        className="border outline-none border-gray-300 w-full  rounded-md py-3 px-4  placeholder:text-gray-400"
      />
      <IoSend
        onClick={sendMessage}
        className={`absolute top-3.5 right-3.5 text-2xl ${
          !data ? "text-gray-400" : "text-sky-600"
        } transition-all duration-200 ease-in`}
      />
    </div>
  );
}
function RightChat() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isopen = useChatStore(useShallow((state) => state.status.isOpen));
  const setStatus = useChatStore(useShallow((state) => state.setStatus));
  return (
    <div
      className={`w-full md:basis-1/2 lg:basis-2/3   sm:flex flex-col gap-4 p-4 ${
        isopen ? "" : "hidden sm:block"
      }`}
    >
      <div className="flex items-center justify-between">
        <RightHeader />
        <div className="w-16 relative sm:hidden">
          <div className="h-9.5 w-13 border border-gray-200 border-r-0  border-t-0  rounded-bl-sm flex items-center justify-center text-green-500">
            <BsArrowLeftCircleFill
              className="text-3xl"
              onClick={() => setStatus(false)}
            />
          </div>
          <div className="h-11 border border-gray-200 rounded-r-sm border-t-0  border-l-0 relative">
            <div className=" absolute right-3 top-2 ">
              <HiDotsVertical
                className="text-2xl font-bold hover:text-green-600 cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
              />
              {isOpen && (
                <div
                  className=" absolute -top-2.5 right-7 bg-white shadow w-40 px-4 py-2 border rounded border-gray-200 cursor-pointer "
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <span className="font-bold hover:text-green-600">
                    supprimer chat
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <RightBody />
      <InputChat />
    </div>
  );
}
const Chat = () => {
  return (
    <main className="flex mt-16  sm:mt-20 w-full sm:h-[730px]">
      <LeftChat />
      <RightChat />
    </main>
  );
};

export default Chat;
