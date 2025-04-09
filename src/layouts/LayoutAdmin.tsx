import { NavLink, Outlet } from "react-router"
import logo from '../assets/logosaa-Photoroom.jpg'
import { FaRegEdit, FaUsers } from "react-icons/fa"
import { LuLogOut } from "react-icons/lu"
import { IoSettings } from "react-icons/io5"
import { HiAnnotation } from "react-icons/hi"
import { useAuthStore } from "../store"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie";


const logoutFn = async (accessToken: string) => {
    const response = await fetch(
        "http://localhost:4000/api/authentication/logout",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) throw new Error("Unauthorized to logout");

    return response.json();

}
function Header() {
    const accessToken = useAuthStore((state) => state.accessToken)
    const setAccessToken = useAuthStore((state) => state.setAccessToken)
    const { mutate } = useMutation({
        mutationFn: logoutFn,
        onSuccess: () => {
            setAccessToken('');
            Cookies.remove("refreshToken");
            sessionStorage.clear();
        },
        onError: (error) => {
            console.warn("Unauthorized to log out", error)
        }
    })
    const handleLogout = () => {
        if (accessToken) {
            mutate(accessToken);
        }
    };
    return (
        <section className=" min-w-80 h-svh flex flex-col justify-between items-center bg-white py-10">

            <div className="mt-16 flex flex-col gap-4  w-full px-6">
                <div className="flex items-center justify-center gap-2 py-4 mb-10">
                    <img src={logo} alt="logo" className="w-12 h-12 aspect-square " />
                    <h2 className="text-3xl font-bold pr-6 text-[#4319FF]">DASHBOARD</h2>
                </div>
                <NavLink to='/admin/ajouter-annoces' className={({ isActive }) =>
                    `basis-full flex items-center justify-baseline gap-3 duration-300 px-6 transform ease-in-out transition-all py-4 ${isActive
                        ? " bg-[#4319FF] *:text-white rounded-md"
                        : "*:text-[#A3AED0] hover:bg-[#F4F7FD]"
                    } `
                }>
                    <FaRegEdit className=" text-xl" />  <span className="font-medium">Gérer les publications</span>
                </NavLink>
                <NavLink
                    to='/admin/annonces'
                    className={({ isActive }) => `basis-full flex items-center justify-baseline px-6  gap-3 duration-300 transform ease-in-out transition-all py-4 ${isActive ? " bg-[#4319FF] *:text-white rounded-md"
                        : "*:text-[#A3AED0] hover:bg-[#F4F7FD]"
                        } `
                    }  >
                    <HiAnnotation className=" text-2xl" /> <span className="font-medium">Annonces</span>
                </NavLink>
                <NavLink to='/admin/utilisateurs' className={({ isActive }) =>
                    `basis-full flex items-center justify-center gap-3 duration-300 transform ease-in-out transition-all py-4 ${isActive
                        ? " bg-[#4319FF] *:text-white rounded-md"
                        : "*:text-[#A3AED0] hover:bg-[#F4F7FD]"
                    } `
                }>
                    <FaUsers className=" text-2xl" />  <span className="font-medium" >Gestion des utilisateurs</span>
                </NavLink>
                <NavLink to='/admin/parametre' className={({ isActive }) =>
                    `basis-full flex items-center justify-baseline px-6 gap-3 duration-300 transform ease-in-out transition-all py-4 ${isActive
                        ? " bg-[#4319FF] *:text-white rounded-md"
                        : "*:text-[#A3AED0] hover:bg-[#F4F7FD]"
                    } `
                }>
                    <IoSettings className=" text-xl" />  <span className="font-medium" >Paramètres</span>
                </NavLink>
            </div>
            <div className=" w-full   flex flex-col  justify-end px-6">
                <NavLink to='/' className={
                    ` flex items-center justify-baseline px-6 gap-3 duration-300 transform ease-in-out transition-all py-4 text-[#A3AED0]  hover:bg-red-500 hover:text-white rounded-md
                    } `
                }
                    onClick={handleLogout}
                >
                    <LuLogOut className=" text-2xl" />  <span className="font-medium" >Se déconnecter</span>
                </NavLink>
            </div>
        </section>
    )
}

export const LayoutAdmin = () => {
    return (
        <main className="w-full flex overflow-hidden ">
            <Header />
            <Outlet />
        </main>
    )
}
