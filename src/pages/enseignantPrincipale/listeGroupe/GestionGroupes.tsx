import { AiOutlinePartition, AiOutlineSolution } from "react-icons/ai";
import { IoMdArrowForward } from "react-icons/io";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { TiGroup } from "react-icons/ti";
import { NavLink } from "react-router";


const GestionGroupes = () => {
    return (
        <section className="w-full h-svh  px-6 pb-10 flex flex-col gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-auto bg-[#F4F7FD]">

            <div className="w-full flex flex-col gap-6 bg-white  h-fit px-6 py-10 mt-6 rounded-md">
                
                <NavLink to='/ens-principale/consulter-la-liste-groupe' className="w-full h-20 flex items-center justify-between gap-3 duration-300 px-6 transform ease-in-out transition-all shadow bg-[#F4F7FD] text-[#080809] hover:bg-[#E3E6E9]  rounded-md py-4 ">
                    <div className=" inline-flex items-center space-x-3"><TiGroup className=" text-xl" />  <span className="font-medium"> Consulter la liste groupe</span></div>
                    <IoMdArrowForward className="text-2xl" />
                </NavLink>
                <NavLink to='/ens-principale/affecter-theme' className="w-full h-20 flex items-center justify-between gap-3 duration-300 px-6 transform ease-in-out transition-all shadow bg-[#F4F7FD] text-[#080809] hover:bg-[#E3E6E9]  rounded-md py-4 ">
                    <div className=" inline-flex items-center space-x-3"><AiOutlinePartition className=" text-xl" />  <span className="font-medium"> Affecter theme </span></div>
                    <IoMdArrowForward className="text-2xl" />
                </NavLink>
                <NavLink to='/admin/parametre/annonces-bloque' className="w-full h-20 flex items-center justify-between gap-3 duration-300 px-6 transform ease-in-out transition-all shadow bg-[#F4F7FD] text-[#080809] hover:bg-[#E3E6E9]  rounded-md py-4 ">
                    <div className=" inline-flex items-center space-x-3"><AiOutlineSolution className=" text-xl" />  <span className="font-medium"> Éditer un groupe </span></div>
                    <IoMdArrowForward className="text-2xl" />
                </NavLink>
                <NavLink to='/admin/parametre/annonces-bloque' className="w-full h-20 flex items-center justify-between gap-3 duration-300 px-6 transform ease-in-out transition-all shadow bg-[#F4F7FD] text-[#080809] hover:bg-[#E3E6E9]  rounded-md py-4 ">
                    <div className=" inline-flex items-center space-x-3"><RiDeleteBin5Fill className=" text-xl" />  <span className="font-medium"> Supprimer un groupe </span></div>
                    <IoMdArrowForward className="text-2xl" />
                </NavLink>
               
            </div>
        </section>
    )
}

export default GestionGroupes;
