import { GoDotFill } from "react-icons/go";
import { Message } from "../pages/enseignantResponsable/chat/Chat";

import { useChatStore } from "../store";

const CardMessage = ({
  image,
  firstName,
  lastName,
  lastMessage,
  currentDate,
  messageValid,
}: Message) => {
  const setDataUser = useChatStore((state) => state.setDataUser);
  const setStatus = useChatStore((state) => state.setStatus);
  const handleClick = () => {
    setStatus(true);
    setDataUser({
      image,
      firstName,
      lastName,
      lastMessage,
      currentDate,
      messageValid,
    });
  };
  return (
    <div
      className="flex justify-between gap-4 items-center hover:bg-slate-100 p-4 hover:rounded hover:shadow transition-all duration-300 ease-in-out"
      onClick={handleClick}
    >
      <div className="flex gap-4 items-center">
        <div className="relative w-12 h-12">
          <img
            src={image}
            alt=""
            className="w-12 h-12 rounded-full object-cover  outline-none "
            loading="lazy"
          />
          <div className="absolute bottom-0 -right-1  text-green-400 ">
            <GoDotFill className="text-xl" />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <span className="font-medium">{`${firstName} ${lastName}`}</span>
          <p className="text-gray-800 text-sm">{lastMessage}</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 items-end">
        <span className="font-extralight text-sm">{currentDate}</span>
        {messageValid > 0 && (
          <div className="bg-red-600 text-white w-5 font-extralight text-sm h-5 flex items-center justify-center rounded-full">
            {messageValid}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardMessage;
