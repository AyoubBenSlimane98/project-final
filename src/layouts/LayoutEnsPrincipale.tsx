import { FaRegEdit } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { NavLink, Outlet } from "react-router";
import logo from "../assets/logosaa-Photoroom.jpg"
import { TiThList } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store";
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
        <section className=" min-w-80 h-svh bg-white pt-6 ">
            <div className="flex items-center justify-center gap-2 py-4 ">
                <img src={logo} alt="logo" className="w-12 h-12 aspect-square " />

            </div>
            <div className="mt-16 flex flex-col gap-4  w-full px-6" >
                <NavLink to='/ens-principale/creer-groupes' className={({ isActive }) =>
                    `basis-full flex items-center justify-baseline gap-3 duration-300 px-6 transform ease-in-out transition-all py-4 ${isActive
                        ? " bg-[#4319FF] *:text-white rounded-md"
                        : "*:text-[#A3AED0] hover:bg-[#F4F7FD]"
                    } `
                }>
                    <FaRegEdit className=" text-xl" />  <span className="font-medium">Gérer les groupes</span>
                </NavLink>
                <NavLink to='/ens-principale/gestion-groupes' className={({ isActive }) =>
                    `basis-full flex items-center justify-baseline gap-3 duration-300 px-6 transform ease-in-out transition-all py-4 ${isActive
                        ? " bg-[#4319FF] *:text-white rounded-md"
                        : "*:text-[#A3AED0] hover:bg-[#F4F7FD]"
                    } `
                }>
                    <TiThList className=" text-xl" />  <span className="font-medium">Gestion des groupes</span>
                </NavLink>
                <NavLink to='/ens-principale/profil' className={({ isActive }) =>
                    `basis-full flex items-center justify-baseline gap-3 duration-300 px-6 transform ease-in-out transition-all py-4 ${isActive
                        ? " bg-[#4319FF] *:text-white rounded-md"
                        : "*:text-[#A3AED0] hover:bg-[#F4F7FD]"
                    } `
                }>
                    <CgProfile className=" text-xl" />  <span className="font-medium">profil</span>
                </NavLink>

                <div className="h-96 w-full flex  items-end">
                    <NavLink to='/sign-in' className={
                        ` flex items-center justify-baseline px-6 gap-3 duration-300 transform ease-in-out transition-all py-4 text-[#A3AED0]  hover:bg-red-500 hover:text-white rounded-md
                    } `
                    }
                        onClick={handleLogout}
                    >
                        <LuLogOut className=" text-2xl" />  <span className="font-medium" >Se déconnecter</span>
                    </NavLink>
                </div>
            </div>

        </section>
    )
}

const LayoutEnsPrincipale = () => {
    return (
        <main className="w-full flex overflow-hidden ">
            <Header />
            <Outlet />
        </main>
    )
}

export default LayoutEnsPrincipale;
