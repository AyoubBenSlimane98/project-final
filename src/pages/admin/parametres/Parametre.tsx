
import { ImProfile } from "react-icons/im";
import { IoMdArrowForward } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { MdAppBlocking } from "react-icons/md";
import { NavLink } from "react-router";

const Parametre = () => {
    return (
        <section className="w-full h-svh  px-6 pb-10 flex flex-col gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-auto bg-[#F4F7FD]">
            
            <div className="w-full flex flex-col gap-6 bg-white  h-fit px-6 py-10 mt-6 rounded-md">
                
                <NavLink to='/admin/parametre/annonces-bloque' className="w-full h-20 flex items-center justify-between gap-3 duration-300 px-6 transform ease-in-out transition-all shadow bg-[#F4F7FD] text-[#080809] hover:bg-[#E3E6E9]  rounded-md py-4 ">
                    <div className=" inline-flex items-center space-x-3"><MdAppBlocking className=" text-xl" />  <span className="font-medium"> Annoces bloque </span></div>
                    <IoMdArrowForward className="text-2xl" />
                </NavLink>
                <NavLink to='/' className="w-full h-20 flex items-center justify-between gap-3 duration-300 px-6 transform ease-in-out transition-all bg-[#F4F7FD] shadow text-[#080809] hover:bg-[#E3E6E9]  rounded-md py-4 ">
                    <div className=" inline-flex items-center space-x-3"><LuLogOut className=" text-xl" />  <span className="font-medium"> Se déconnecter</span></div>
                    <IoMdArrowForward className="text-2xl" />
                </NavLink>
        </div>
        </section>
    )
}

export default Parametre
