import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import logoImg from "../assets/logos-Photoroom.jpg";
import { PiUserCircleDuotone } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { IoMdNotifications } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store";

const getInfoEtudiant = async (accessToken: string) => {
  const response = await fetch(`http://localhost:4000/api/eutdaint/binome`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Cannot fetch data of binome!");
  return response.json();
};
type NavBarItemProps = {
  to: string;
  children: React.ReactNode;
};
function NavBarItem({
  to,
  children,
  setIsMenuOpen,
}: NavBarItemProps & { setIsMenuOpen: (isMenuOpen: boolean) => void }) {
  return (
    <NavLink
      onMouseEnter={() => setIsMenuOpen(children === "Consultation")}
      to={to}
      className={({ isActive }) =>
        `block duration-300 transform ease-in-out transition-all px-2 py-1.5 lg:py-2 lg:px-4  ${
          isActive
            ? " text-green-400  rounded-full font-medium"
            : "text-white hover:text-green-400"
        } `
      }
    >
      {children}
    </NavLink>
  );
}
function Notification({
  setIsOpenNotification,
  isOpenNotification,
}: {
  setIsOpenNotification: (prev: boolean) => void;
  isOpenNotification: boolean;
}) {
  const [count, setCount] = useState<number>(1);
  return (
    <div
      className=" hidden bg-white  shrink-0  md:flex md:items-center md:justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full relative"
      onClick={() => setIsOpenNotification(!isOpenNotification)}
    >
      <IoMdNotifications className="text-2xl text-yellow-400 " />
      <div className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] absolute  right-0 top-0 ">
        {count}
      </div>
    </div>
  );
}
function MenuProfile({
  setIsOpenProfile,
}: {
  setIsOpenProfile: (value: boolean) => void;
}) {
  return (
    <div className="absolute top-16.5 -right-5 w-80 space-y-2  bg-gray-800 text-white  transform transition-all duration-300 ease-in-out rounded-lg shadow-lg p-4 z-[999]">
      <NavLink
        onClick={() => setIsOpenProfile(false)}
        to="/etudiant/compte"
        className="flex items-center gap-2 hover:bg-gray-100 hover:text-green-600 p-2 rounded-lg transform transition-all duration-300 ease-in-out"
      >
        <PiUserCircleDuotone className="text-xl" />
        <span>Compte</span>
      </NavLink>
      <NavLink
        to="/"
        className="flex items-center gap-2 hover:bg-gray-100 hover:text-green-600 p-2 rounded-lg transform transition-all duration-300 ease-in-out"
      >
        <HiOutlineLogout className="text-xl" />
        <span>Déconnexion</span>
      </NavLink>
    </div>
  );
}
function Profile({
  setIsOpenProfile,
  isOpenProfile,
}: {
  setIsOpenProfile: (value: boolean) => void;
  isOpenProfile: boolean;
}) {
  return (
    <div
      className=" hidden md:block shrink-0"
      onClick={() => setIsOpenProfile(!isOpenProfile)}
    >
      <img
        src="https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt=""
        loading="lazy"
        className="w-11 h-11 lg:w-12 lg:h-12 rounded-full acpect-ratio-1/1"
      />
    </div>
  );
}
function SideNavConsultation() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.8rem]  space-y-2   bg-gray-800 text-white *:hover:text-green-600  transform transition-all duration-300 ease-in-out rounded-lg shadow-lg p-4 z-[999]">
      <li>
        <NavLink to="/etudiant/liste-cas">Consultation les cas</NavLink>
      </li>
      <li>
        <NavLink to="/etudiant/rapport">Consultation son rapport</NavLink>
      </li>
      <li>
        <NavLink to="/etudiant/liste-cas-etudiant">
          Consultation la liste de ses cas
        </NavLink>
      </li>
      <li>
        <NavLink to="/etudiant/description-sujet">
          Consultation la description sujet
        </NavLink>
      </li>
      <li>
        <NavLink to="/ens-responsable/consultation-binommes">
          Consultation l'evaluation enseignant
        </NavLink>
      </li>
    </ul>
  );
}
function Nav() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data } = useQuery({
    queryKey: ["dataEtudiant", accessToken],
    queryFn: async () => {
      if (accessToken === undefined) throw new Error("accessToken not found");
      return await getInfoEtudiant(accessToken);
    },
    enabled: !!accessToken,
    staleTime: 0,
    gcTime: 0,
  });
  return (
    <nav
      className="hidden md:flex h-20 md:items-center md:gap-4  ml-14"
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <NavBarItem
        to="/etudiant/annoces"
        children="Annoces"
        setIsMenuOpen={setIsMenuOpen}
      />
      <div className="relative  transform transition-all duration-300 ease-in-out">
        <NavBarItem
          to="/etudiant/consultation"
          children="Consultation"
          setIsMenuOpen={setIsMenuOpen}
        />
        {isMenuOpen && <SideNavConsultation />}
      </div>
      <NavBarItem
        to="/etudiant/deposer-rapport"
        children="Rapport Tache"
        setIsMenuOpen={setIsMenuOpen}
      />
      <NavBarItem
        to="/etudiant/poser-questions"
        children="Poser Questions"
        setIsMenuOpen={setIsMenuOpen}
      />
      {data?.responsabilite !== null && (
        <NavBarItem
          to="/etudiant/deposer-rapport-etape"
          children="Rapport Responsablite"
          setIsMenuOpen={setIsMenuOpen}
        />
      )}
    </nav>
  );
}
function Header() {
  const [isOpenProfile, setIsOpenProfile] = useState<boolean>(false);
  const [popShow, setPopShow] = useState<"compte" | "notification" | "close">(
    "close"
  );
  const [isOpenNotification, setIsOpenNotification] = useState<boolean>(false);

  return (
    <header className="w-full sm:h-20 flex justify-between items-center  py-1 bg-gray-800 text-white sm:px-4 md:pr-6 fixed top-0 z-50">
      <NavLink
        to="/etudiant"
        className="bg-gray-800 sm:flex sm:items-center gap-4"
      >
        <img
          src={logoImg}
          alt=""
          className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
        />
      </NavLink>
      <Nav />
      <div
        className="flex items-center gap-3 sm:flex sm:items-center  sm:justify-end lg:gap-6 "
        onMouseLeave={() => setPopShow("close")}
      >
        <div
          className="relative "
          onMouseEnter={() => setPopShow("notification")}
        >
          <Notification
            setIsOpenNotification={setIsOpenNotification}
            isOpenNotification={isOpenNotification}
          />
          {popShow === "notification" && isOpenNotification === false && (
            <div className="absolute top-16.5 -right-5  space-y-2  bg-[#313131] text-[#B2B3B5]  transform transition-all duration-300 ease-in-out rounded-lg shadow-lg px-2 py-1.5 z-[99]">
              Notification
            </div>
          )}
          {isOpenNotification && (
            <div className="flex  px-4 py-2.5 flex-col gap-4 drop-shadow shadow absolute top-17 -right-22  w-[400px]   h-[600px]  space-y-2  bg-white  transform transition-all duration-300 ease-in-out rounded-lg z-[999]">
              <div className="text-gray-950 py-2.5">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-medium ">Notification</h2>
                  <NavLink
                    to=""
                    className="underline text-blue-500 hover:text-blue-600"
                  >
                    voir tous
                  </NavLink>
                </div>
                <hr className="text-gray-200 w-full h-0.5" />
              </div>
              <div className="">ff</div>
            </div>
          )}
        </div>
        <div className="relative" onMouseEnter={() => setPopShow("compte")}>
          <Profile
            setIsOpenProfile={setIsOpenProfile}
            isOpenProfile={isOpenProfile}
          />
          {popShow === "compte" && isOpenProfile === false && (
            <div className="absolute top-16.5 -right-5  space-y-2  bg-[#313131] text-[#B2B3B5]  transform transition-all duration-300 ease-in-out rounded-lg shadow-lg px-2 py-1.5 z-[99]">
              Compte
            </div>
          )}
          {isOpenProfile && <MenuProfile setIsOpenProfile={setIsOpenProfile} />}
        </div>
      </div>
    </header>
  );
}
const LayoutEtudiant = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default LayoutEtudiant;
