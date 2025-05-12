import { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router";
import logoImg from "../assets/logos-Photoroom.jpg";
import { PiUserCircleDuotone } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { IoMenu } from "react-icons/io5";
import { HeaderContext } from "../context/headerContext";
import { useAuthStore } from "../store";
import { useMutation, useQuery } from "@tanstack/react-query";

import Cookies from "js-cookie";
import { useShallow } from "zustand/shallow";

const getProfil = async (accessToken: string) => {
  const response = await fetch("http://localhost:4000/api/principal/profil", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get all articles");
  }

  return response.json();
};

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
};
type NavBarItemProps = {
  to: string;
  children: React.ReactNode;
};

function SideNavConsultation() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.3rem]  space-y-2   bg-gray-800 text-white *:hover:text-green-600 transform transition-all duration-300 ease-in-out rounded-lg shadow-lg p-4 z-[999]">
      <li>
        <NavLink to="/ens-responsable">Consultation rapport</NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable/consultation-question">
          Consultation question
        </NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable">Consultation feedback</NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable/consultation-binommes">
          Consultation les binomes
        </NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable">Consultation progression</NavLink>
      </li>
    </ul>
  );
}

function SideNavGestion() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.3rem]  space-y-2  bg-gray-800 text-white *:hover:text-green-600 transform transition-all duration-300 ease-in-out rounded-lg shadow-lg  z-[999]  p-4">
      <li>
        <NavLink to="/ens-responsable/gestion-decrir-le-sujet">
          Decrir le sujet
        </NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable/gestion-organiser-renion">
          Organiser renion
        </NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable/gestion-affection-les-cas">
          Affecter les cas
        </NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable/gestion-affection-responsabilite">
          Affecter responsabilite{" "}
        </NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable/gestion-preciser-cas">
          Preciser les cas{" "}
        </NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable/gestion-preciser-etapes">
          Preciser les etapes
        </NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable/gestion-absances">
          Absances
        </NavLink>
      </li>
    </ul>
  );
}
function SideNavRport() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.3rem]  space-y-2  bg-gray-800 text-white *:hover:text-green-600 transform transition-all duration-300 ease-in-out rounded-lg shadow-lg p-4 z-[999]">
      <li>
        <NavLink to="/ens-responsable">les taches</NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable">les etapes </NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable">rapport final </NavLink>
      </li>
    </ul>
  );
}

function Nav() {
  const context = useContext(HeaderContext);

  return (
    <nav className="hidden md:flex h-20 md:items-center md:gap-4  ml-14">
      <NavLink
        to="/ens-responsable/annoces"
        onMouseEnter={() => context?.setActiveMenu(null)}
      >
        Annoces
      </NavLink>
      <NavLink
        to="/ens-responsable/evaluation"
        onMouseEnter={() => context?.setActiveMenu(null)}
      >
        Evaluation
      </NavLink>
      {[
        {
          name: "consultation",
          component: <SideNavConsultation />,
        },
        { name: "rapport", component: <SideNavRport /> },
        { name: "gestion", component: <SideNavGestion /> },
      ].map(({ name, component }) => (
        <div
          key={name}
          className="relative "
          onMouseEnter={() => context?.setActiveMenu(name)}
        >
          <p className="px-4 cursor-pointer">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </p>
          <div onMouseLeave={() => context?.setActiveMenu(null)}>
            {context?.activeMenu === name && component}
          </div>
        </div>
      ))}
    </nav>
  );
}

function MenuProfile({ setIsOpen }: { setIsOpen: (value: boolean) => void }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { mutate } = useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      setAccessToken("");
      Cookies.remove("refreshToken");
      sessionStorage.clear();
    },
    onError: (error) => {
      console.warn("Unauthorized to log out", error);
    },
  });
  const handleLogout = () => {
    if (accessToken) {
      mutate(accessToken);
    }
  };
  return (
    <div className="absolute top-16.5 -right-5 w-80 space-y-2  bg-gray-800 text-white  transform transition-all duration-300 ease-in-out rounded-lg shadow-lg p-4 z-[999]">
      <NavLink
        onClick={() => setIsOpen(false)}
        to="/ens-responsable/compte"
        className="flex items-center gap-2 hover:bg-gray-100 hover:text-green-600 p-2 rounded-lg transform transition-all duration-300 ease-in-out"
      >
        <PiUserCircleDuotone className="text-xl" />
        <span>Compte</span>
      </NavLink>
      <NavLink
        onClick={handleLogout}
        to="/sign-in"
        className="flex items-center gap-2 hover:bg-gray-100 hover:text-green-600 p-2 rounded-lg transform transition-all duration-300 ease-in-out"
      >
        <HiOutlineLogout className="text-xl" />
        <span>Déconnexion</span>
      </NavLink>
    </div>
  );
}
function Profile({ setIsOpen }: { setIsOpen: (value: boolean) => void }) {
  const accessToken = useAuthStore(useShallow((state) => state.accessToken));

  const { data } = useQuery({
    queryKey: ["profil", accessToken],
    queryFn: () => getProfil(accessToken!),
    enabled: !!accessToken,
  });

  if (!data) return null;
  return (
    <div className=" hidden md:block shrink-0" onClick={() => setIsOpen(true)}>
      <img
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src =
            "https://scontent.fczl2-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeF_OWSBlL4_ahZGK8uktg7YWt9TLzuBU1Ba31MvO4FTUAcNr-rcAk0Q6wgee_n1MVfJVXKEYXEpVc_A8npzsuDs&_nc_ohc=pCF_EXqQ5MYQ7kNvwGqbQH8&_nc_oc=AdmOQDv_qA9yPoDAQK2j4m8cM77HYt2osPaGYZiWQNIR41-_Kkg1lN_m_n79WacUl90&_nc_zt=24&_nc_ht=scontent.fczl2-2.fna&oh=00_AfEfE4VyUFM1gD2VkajBmRMamhtVSp2NpcihUNDqLsAtzg&oe=681B903A";
        }}
        src={`http://localhost:4000/${data.user?.image}`}
        alt={`${data.user?.prenom} ${data.user?.nom}`}
        loading="lazy"
        className="w-11 h-11 lg:w-12 lg:h-12 rounded-full acpect-ratio-1/1"
      />
    </div>
  );
}

function ToggleMenu() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <nav className=" md:hidden absolute top-[65px] left-0 w-full bg-gray-800 border-b rounded-b  text-white flex flex-col gap-2 p-4 z-50 shadow">
      <ul className="flex flex-col items-start gap-2 ">
        <li className="flex gap-2 w-full">
          <button
            className="flex items-center "
            onClick={() => toggleMenu("consultation")}
          >
            <span>Consultation</span>
          </button>
          {openMenus["consultation"] && (
            <ul className="w-full flex flex-col items-start gap-2 pl-6">
              <li>
                <NavLink to="/">Consultation rapport</NavLink>
              </li>
              <hr className="bg-gray-200 w-full" />
              <li>
                <NavLink to="/">Consultation question</NavLink>
              </li>
              <hr className="bg-gray-200 w-full" />
              <li>
                <NavLink to="/">Consultation feedback</NavLink>
              </li>
              <hr className="bg-gray-200 w-full" />
              <li>
                <NavLink to="/">Consultation progression</NavLink>
              </li>
              <hr className="bg-gray-200 w-full" />
              <li>
                <NavLink to="/consultation">Consultation les binomes</NavLink>
              </li>
            </ul>
          )}
        </li>

        <hr className="bg-gray-200 w-full" />

        <li className="flex gap-9 w-full">
          <button
            className="flex items-center "
            onClick={() => toggleMenu("rapport")}
          >
            <span>Rapport</span>
          </button>
          {openMenus["rapport"] && (
            <ul className="w-full flex flex-col items-start gap-2 pl-6">
              <li>
                <NavLink to="/rapport">Rapport les taches</NavLink>
              </li>
              <hr className="bg-gray-200 w-full" />
              <li>
                <NavLink to="/">Rapport les etapes</NavLink>
              </li>
              <hr className="bg-gray-200 w-full" />
              <li>
                <NavLink to="/">Rapport final</NavLink>
              </li>
            </ul>
          )}
        </li>

        <hr className="bg-gray-200 w-full" />

        <li className="flex gap-2  w-full">
          <button
            className="flex items-center"
            onClick={() => toggleMenu("progression")}
          >
            <span>Progression</span>
          </button>
          {openMenus["progression"] && (
            <ul className="w-full flex flex-col items-start gap-2 pl-6">
              <li>
                <NavLink to="/">Progression les etapes</NavLink>
              </li>
              <hr className="bg-gray-200 w-full" />
              <li>
                <NavLink to="/">Progression les binomes</NavLink>
              </li>
              <hr className="bg-gray-200 w-full" />
              <li>
                <NavLink to="/">Progression les groupes</NavLink>
              </li>
            </ul>
          )}
        </li>

        <hr className="bg-gray-200 w-full" />

        <li className="flex gap-8 w-full">
          <button
            className="flex items-center "
            onClick={() => toggleMenu("gestion")}
          >
            <span>Gestion</span>
          </button>
          {openMenus["gestion"] && (
            <ul className="w-full flex flex-col items-start gap-2 pl-6">
              <li>
                <NavLink to="/">Affecter les taches</NavLink>
              </li>
              <li>
                <NavLink to="/">Affecter responsabilite</NavLink>
              </li>
              <li>
                <NavLink to="/">Décrire le sujet</NavLink>
              </li>
              <li>
                <NavLink to="/">Organiser réunion</NavLink>
              </li>
            </ul>
          )}
        </li>

        <hr className="bg-gray-200 w-full" />

        <li className="flex gap-3 w-full">
          <button
            className="flex items-center "
            onClick={() => toggleMenu("evaluation")}
          >
            <span>Evaluation</span>
          </button>
          {openMenus["evaluation"] && (
            <ul className="w-full flex flex-col items-start gap-2 pl-6">
              <li>
                <NavLink to="/">Evaluation partie théorique</NavLink>
              </li>
              <li>
                <NavLink to="/">Evaluation les tâches</NavLink>
              </li>
            </ul>
          )}
        </li>
        <hr className="bg-gray-200 w-full" />
        <li>
          <NavLink to="compte">Compte</NavLink>
        </li>
        <hr className="bg-gray-200 w-full" />
        <li>
          <NavLink to="">Deconnexion</NavLink>
        </li>
      </ul>
    </nav>
  );
}
function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  return (
    <header className="w-full sm:h-20 flex justify-between items-center  py-1 bg-gray-800 text-white sm:px-4 md:pr-6 fixed top-0 z-50">
      <NavLink
        to="/ens-responsable"
        className="bg-gray-800 sm:flex sm:items-center gap-4"
      >
        <img
          src={logoImg}
          alt=""
          className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
        />
      </NavLink>
      <Nav />
      <div className="flex items-center gap-3 sm:flex sm:items-center  sm:justify-end lg:gap-6">
        <IoMenu
          className="text-3xl font-semibold md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        />
        {isMenuOpen && <ToggleMenu />}
        <div className="relative">
          <Profile setIsOpen={setIsOpen} />
          {isOpen && <MenuProfile setIsOpen={setIsOpen} />}
        </div>
      </div>
    </header>
  );
}
function NavFooter({ to, children }: NavBarItemProps) {
  return (
    <NavLink
      to={to}
      className="text-gray-400 hover:text-green-400 duration-300 ease-in-out transition-all"
    >
      {children}
    </NavLink>
  );
}

function Footer() {
  return (
    <footer className="w-full p-4  bg-gray-800 text-white sm:px-6">
      <div className="p-2 flex flex-row  justify-between gap-4 flex-wrap sm:gap-8 sm:justify-between sm:items-start py-4 ">
        <div className="sm:basis-[12.5rem] flex flex-col gap-4  rounded-lg">
          <h2 className="font-semibold text-lg">Consultation</h2>
          <hr className="text-green-400 sm:w-[12.5rem]" />
          <nav className="flex flex-col gap-2 *:font-extralight">
            <NavFooter to="/ens-responsable/consultation-binommes">
              Consultation les binomes
            </NavFooter>
            <NavFooter to="/ens-responsable">Consultation rapport</NavFooter>
            <NavFooter to="/ens-responsable/consultation-question">
              Consultation question
            </NavFooter>
            <NavFooter to="/ens-responsable">Consultation feedback</NavFooter>
            <NavFooter to="/ens-responsable">
              Consultation progression
            </NavFooter>
          </nav>
        </div>
        <div className=" sm:basis-[12.5rem]  flex flex-col gap-4  rounded-lg">
          <h2 className="font-semibold text-lg">Rapport</h2>
          <hr className="text-green-400 sm:w-[12.5rem]" />
          <nav className="flex flex-col gap-2 *:font-extralight">
            <NavFooter to="/ens-responsable">rapport les taches</NavFooter>
            <NavFooter to="/ens-responsable">rapport les etapes</NavFooter>
            <NavFooter to="/ens-responsable">rapport final</NavFooter>
          </nav>
        </div>
        <div className="sm:basis-[12.5rem]  flex flex-col gap-4  rounded-lg">
          <h2 className="font-semibold text-lg">Progression</h2>
          <hr className="text-green-400 sm:w-[12.5rem]" />
          <nav className="flex flex-col gap-2 *:font-extralight">
            <NavFooter to="/ens-responsable">Progression les etapes</NavFooter>
            <NavFooter to="/ens-responsable">Progression les binomes</NavFooter>
            <NavFooter to="/ens-responsable">rapport les groupes</NavFooter>
          </nav>
        </div>
        <div className="sm:basis-[12.5rem]  flex flex-col gap-4  rounded-lg">
          <h2 className="font-semibold text-lg">Gestion</h2>
          <hr className="text-green-400 sm:w-[12.5rem]" />
          <nav className="flex flex-col gap-2 *:font-extralight">
            <NavFooter to="/ens-responsable/gestion-affection-les-cas">
              Affecter les cas
            </NavFooter>
            <NavFooter to="/ens-responsable/gestion-affection-responsabilite">
              Affecter responsabilite
            </NavFooter>
            <NavFooter to="/ens-responsable/gestion-decrir-le-sujet">
              Decrir le sujet
            </NavFooter>
            <NavFooter to="/ens-responsable">Organiser renion</NavFooter>
          </nav>
        </div>
        <div className="sm:basis-[12.5rem] flex flex-col gap-4  rounded-lg">
          <h2 className="font-semibold text-lg">Evaluation</h2>
          <hr className="text-green-400 sm:w-[12.5rem]" />
          <nav className="flex flex-col gap-2 *:font-extralight">
            <NavFooter to="/ens-responsable">
              Evaluation partie theorique
            </NavFooter>
            <NavFooter to="/ens-responsable">Evaluation les taches</NavFooter>
          </nav>
        </div>
      </div>
      <div className="w-full text-center text-gray-400 py-4">
        All rights reserved &copy; {new Date().getFullYear()} by{" "}
        <span className="font-medium text-green-600">Benslimane Ayyoub</span>
      </div>
    </footer>
  );
}
const LayoutEns = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  return (
    <HeaderContext.Provider value={{ activeMenu, setActiveMenu }}>
      <div className="flex flex-col">
        <Header />
        <main onMouseEnter={() => setActiveMenu(null)}>
          {" "}
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>
    </HeaderContext.Provider>
  );
};

export default LayoutEns;
