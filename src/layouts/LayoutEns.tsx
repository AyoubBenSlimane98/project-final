import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import logoImg from "../assets/logos-Photoroom.jpg";
import { PiUserCircleDuotone, PiUserSwitchFill } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { IoMenu } from "react-icons/io5";
import { HeaderContext } from "../context/headerContext";
import { useAuthStore } from "../store";
import { useMutation, useQuery } from "@tanstack/react-query";

import Cookies from "js-cookie";
import { useShallow } from "zustand/shallow";

function getEmailFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.email || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
const loginFn = async ({
  email,
  accessToken,
}: {
  email: string;
  accessToken: string;
}) => {
  console.log({
    email,
    accessToken,
  });
  const response = await fetch(
    "http://localhost:4000/api/principal/switch-account",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ email, role: "principale" }),
    }
  );

  if (!response.ok) {
    throw new Error("Email or Password not correct");
  }
  return response.json();
};
const canSwitchAccount = async (accessToken: string) => {
  const response = await fetch(
    "http://localhost:4000/api/responsable/switch-account",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Unauthorized to switch account");

  return response.json();
};

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


function SideNavConsultation() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.3rem]  space-y-2   bg-gray-800 text-white *:hover:text-green-600 transform transition-all duration-300 ease-in-out rounded-lg shadow-lg p-4 z-[999]">
      <li className="px-2">
        <NavLink to="/ens-responsable/consultation-question">
          Consultation question
        </NavLink>
      </li>
      <li className="px-2">
        <NavLink to="/ens-responsable">Consultation feedback</NavLink>
      </li>
      <li className="px-2">
        <NavLink to="/ens-responsable/consultation-binommes">
          Consultation les binomes
        </NavLink>
      </li>
      <li className="px-2">
        <NavLink to="/ens-responsable">Consultation progression</NavLink>
      </li>
    </ul>
  );
}

function SideNavSujet() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.3rem] space-y-2 bg-gray-800 text-white *:hover:text-green-600 transform transition-all duration-300 ease-in-out rounded-lg shadow-lg z-[999] p-4">
      <li className="px-2">
        <NavLink to="/ens-responsable/gestion-decrir-le-sujet">
          Décrire le sujet
        </NavLink>
      </li>
      <li className="px-2">
        <NavLink to="/ens-responsable/gestion-preciser-cas">
          Préciser les cas
        </NavLink>
      </li>
      <li className="px-2">
        <NavLink to="/ens-responsable/gestion-preciser-etapes">
          Préciser les étapes
        </NavLink>
      </li>
    </ul>
  );
}
function SideNavGestion() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.3rem] space-y-2 bg-gray-800 text-white *:hover:text-green-600 transform transition-all duration-300 ease-in-out rounded-lg shadow-lg z-[999] p-4">
      <li className="px-2">
        <NavLink to="/ens-responsable/evaluation">Evaluation</NavLink>
      </li>
      <li className="px-2">
        <NavLink to="/ens-responsable/gestion-absances">
          Absences & Note Finale
        </NavLink>
      </li>
    </ul>
  );
}
function SideNavAffection() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.3rem] space-y-2 bg-gray-800 text-white *:hover:text-green-600 transform transition-all duration-300 ease-in-out rounded-lg shadow-lg z-[999] p-4">
      <li className="px-2">
        <NavLink to="/ens-responsable/gestion-affection-les-cas">
          Affecter les cas
        </NavLink>
      </li>
      <li className="px-2">
        <NavLink to="/ens-responsable/gestion-affection-responsabilite">
          Affecter responsabilité
        </NavLink>
      </li>
      <li className="px-2">
        <NavLink to="/ens-responsable/gestion-organiser-renion">
          Organiser réuniones
        </NavLink>
      </li>
    </ul>
  );
}
function SideNavRport() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.3rem]  space-y-2  bg-gray-800 text-white *:hover:text-green-600 transform transition-all duration-300 ease-in-out rounded-lg shadow-lg p-4 z-[999]">
      <li className="px-2">
        <NavLink to="/ens-responsable/rapport-taches">
          Rapport les taches
        </NavLink>
      </li>
      <li className="px-2">
        <NavLink to="/ens-responsable/rapport-etapes">
          Rapport les etapes{" "}
        </NavLink>
      </li>
      <li className="px-2">
        <NavLink to="/ens-responsable/rapport-final"> Rapport final </NavLink>
      </li>
    </ul>
  );
}

function Nav() {
  const context = useContext(HeaderContext);

  return (
    <nav className="hidden md:flex h-20 md:items-center md:gap-x-2  ">
      <NavLink
        to="/ens-responsable/annoces"
        onMouseEnter={() => context?.setActiveMenu(null)}
      >
        Annoces
      </NavLink>

      {[
        {
          name: "consultation",
          component: <SideNavConsultation />,
        },
        {
          name: "sujet",
          component: <SideNavSujet />,
        },
        {
          name: "Affectations",
          component: <SideNavAffection />,
        },
        { name: "rapport", component: <SideNavRport /> },
        { name: "Suivi des progrès", component: <SideNavGestion /> },
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
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [canSwitch, setCanSwitch] = useState(false);

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

  const { mutate: switchMutate } = useMutation({
    mutationFn: canSwitchAccount,
    onSuccess: (data) => {
      console.log(data)
      if (data.access === true) {
        setCanSwitch(true);
      }
    },
    onError: (error) => {
      console.warn("Unauthorized to siwtch", error);
    },
  });
  useEffect(() => {
    if (accessToken) {
      switchMutate(accessToken);
    }
  }, [accessToken, switchMutate]);
  const { mutate: SwitchAccount } = useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      const { accessToken, refreshtoken } = data.token;

      setAccessToken(accessToken);
      Cookies.set("refreshToken", refreshtoken, {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });

      if (data.role === "principale") {
        navigate("/ens-principale");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
  const handleSwitchAccount = () => {
    if (accessToken && getEmailFromToken(accessToken)) {
      SwitchAccount({
        accessToken,
        email: getEmailFromToken(accessToken) || "",
      });
    }
  };

  return (
    <div className="absolute top-16.5 -right-5 w-80 space-y-2  bg-gray-800 text-white  transform transition-all duration-300 ease-in-out rounded-lg shadow-lg p-4 z-[999]">
      {canSwitch && (
        <div
          onClick={handleSwitchAccount}
          className="flex items-center gap-2 hover:bg-gray-100 hover:text-green-600 p-2 rounded-lg transform transition-all duration-300 ease-in-out cursor-pointer"
        >
          <PiUserSwitchFill className=" text-xl" />{" "}
          <span className="font-medium">Principale</span>
        </div>
      )}
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
function Profile({
  setIsOpen,
  isOpen,
}: {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
}) {
  const accessToken = useAuthStore(useShallow((state) => state.accessToken));

  const { data } = useQuery({
    queryKey: ["profil", accessToken],
    queryFn: () => getProfil(accessToken!),
    enabled: !!accessToken,
  });

  if (!data) return null;
  return (
    <div
      className=" hidden md:block shrink-0"
      onClick={() => setIsOpen(!isOpen)}
    >
      <img
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "";
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
                <NavLink to="/">Consultation rapport </NavLink>
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
          <Profile setIsOpen={setIsOpen} isOpen={isOpen} />
          {isOpen && <MenuProfile setIsOpen={setIsOpen} />}
        </div>
      </div>
    </header>
  );
}

const LayoutEns = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  return (
    <HeaderContext.Provider value={{ activeMenu, setActiveMenu }}>
      <div className="flex flex-col">
        <Header />
        <main onMouseEnter={() => setActiveMenu(null)}>
          <Outlet />
        </main>
      </div>
    </HeaderContext.Provider>
  );
};

export default LayoutEns;
