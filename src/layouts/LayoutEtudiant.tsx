import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import logoImg from "../assets/logos-Photoroom.jpg";
import { PiUserCircleDuotone } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { IoMdNotifications } from "react-icons/io";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store";
import { useShallow } from "zustand/shallow";
import { RiDeleteBin5Fill } from "react-icons/ri";

const allGQuestionAndReponse = async (accessToken: string) => {
  const response = await fetch(`http://localhost:4000/api/eutdaint/questions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Cannot fetch Questions of etudiant!");
  return response.json();
};
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
  setIsMenuOpen2,
}: NavBarItemProps & {
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  setIsMenuOpen2?: (isMenuOpen: boolean) => void;
}) {
  return (
    <NavLink
      onMouseEnter={() => {
        setIsMenuOpen(children === "Consultation");
        if (setIsMenuOpen2) setIsMenuOpen2(children === "Responsablite");
      }}
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
  count,
  setIsOpenNotification,
  isOpenNotification,
}: {
  count: number;
  setIsOpenNotification: (prev: boolean) => void;
  isOpenNotification: boolean;
}) {
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
const allFeedBack = async ({
  accessToken,
  idB,
}: {
  accessToken: string;
  idB: number;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/eutdaint/feedbacks/${idB}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get all articles");
  }

  return response.json();
};
const deleteFeedBack = async ({
  accessToken,
  idF,
}: {
  accessToken: string;
  idF: number;
}) => {
  const response = await fetch(`http://localhost:4000/api/eutdaint/${idF}`, {
    method: "DELETE",
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
const deleteQuestion = async ({
  accessToken,
  idQ,
}: {
  accessToken: string;
  idQ: number;
}) => {
  console.log({ idQ });
  const response = await fetch(
    `http://localhost:4000/api/eutdaint/question/${idQ}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to deleted question");
  }

  return response.json();
};

function Profile({
  setIsOpenProfile,
  isOpenProfile,
}: {
  setIsOpenProfile: (value: boolean) => void;
  isOpenProfile: boolean;
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
      onClick={() => setIsOpenProfile(!isOpenProfile)}
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
function SideNavEtape() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.8rem]  space-y-2   bg-gray-800 text-white *:hover:text-green-600  transform transition-all duration-300 ease-in-out rounded-lg shadow-lg p-4 z-[999]">
      <li>
        <NavLink to="/etudiant/rapport-etapes">
          Consultation les tâches de votre etape
        </NavLink>
      </li>
      <li>
        <NavLink to="/etudiant/deposer-rapport-etape">
          Deposer rapport Responsabilite
        </NavLink>
      </li>
    </ul>
  );
}
function SideNavAllEtapes() {
  return (
    <ul className="absolute max-w-fit text-nowrap top-[3.8rem]  space-y-2   bg-gray-800 text-white *:hover:text-green-600  transform transition-all duration-300 ease-in-out rounded-lg shadow-lg p-4 z-[999]">
      <li>
        <NavLink to="/etudiant/rapport-all-etapes">
          Consultation tous chapiter 1 / 2 / 3
        </NavLink>
      </li>
      <li>
        <NavLink to="/etudiant/deposer-rapport-final">
          Deposer rapport Responsabilite
        </NavLink>
      </li>
    </ul>
  );
}
function Nav({
  isOpen,
  responsabiliteOf,
}: {
  isOpen: boolean;
  responsabiliteOf: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMenuOpen2, setIsMenuOpen2] = useState<boolean>(false);

  return (
    <nav
      className="hidden md:flex h-20 md:items-center md:gap-4  ml-14"
      onMouseLeave={() => {
        setIsMenuOpen(false);
        setIsMenuOpen2(false);
      }}
    >
      <NavBarItem
        to="/etudiant/annoces"
        children="Annoces"
        setIsMenuOpen2={setIsMenuOpen2}
        setIsMenuOpen={setIsMenuOpen}
      />
      <div className="relative  transform transition-all duration-300 ease-in-out">
        <NavBarItem
          to="/etudiant/consultation"
          children="Consultation"
          setIsMenuOpen2={setIsMenuOpen2}
          setIsMenuOpen={setIsMenuOpen}
        />
        {isMenuOpen && <SideNavConsultation />}
      </div>
      <NavBarItem
        to="/etudiant/deposer-rapport"
        children="Rapport Tache"
        setIsMenuOpen2={setIsMenuOpen2}
        setIsMenuOpen={setIsMenuOpen}
      />
      <NavBarItem
        to="/etudiant/poser-questions"
        children="Poser Questions"
        setIsMenuOpen2={setIsMenuOpen2}
        setIsMenuOpen={setIsMenuOpen}
      />
      {isOpen && (
        <div className="relative  transform transition-all duration-300 ease-in-out">
          <NavBarItem
            to="/etudiant/rapport"
            children="Responsablite"
            setIsMenuOpen={setIsMenuOpen}
            setIsMenuOpen2={setIsMenuOpen2}
          />
          {responsabiliteOf !== "introduction_resume_conclustion"
            ? isMenuOpen2 && <SideNavEtape />
            : isMenuOpen2 && <SideNavAllEtapes />}
        </div>
      )}
    </nav>
  );
}

function Header({
  idB,
  isOpen,
  responsabiliteOf,
}: {
  idB: number;
  isOpen: boolean;
  responsabiliteOf: string;
}) {
  const [count, setCount] = useState<number>(0);

  const accessToken = useAuthStore((state) => state.accessToken);
  const [isOpenProfile, setIsOpenProfile] = useState<boolean>(false);
  const [popShow, setPopShow] = useState<"compte" | "notification" | "close">(
    "close"
  );
  const [isOpenNotification, setIsOpenNotification] = useState<boolean>(false);

  const { data, refetch } = useQuery({
    queryKey: ["dataFeedBack", accessToken],
    queryFn: async () => {
      if (accessToken === undefined) throw new Error("accessToken not found");
      return await allFeedBack({ accessToken, idB });
    },
    enabled: !!accessToken,
    staleTime: 0,
    gcTime: 0,
  });
  const { data: questionEtu, refetch: refetchQuestuion } = useQuery({
    queryKey: ["questionEtud", accessToken],
    queryFn: async () => {
      if (accessToken === undefined) throw new Error("accessToken not found");
      return await allGQuestionAndReponse(accessToken);
    },
    enabled: !!accessToken,
    staleTime: 0,
    gcTime: 0,
  });
  const { mutate } = useMutation({
    mutationFn: ({ idF, accessToken }: { idF: number; accessToken: string }) =>
      deleteFeedBack({
        idF,
        accessToken,
      }),
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.warn("feedback: ", error.message);
    },
  });
  const { mutate: mutateQuestion } = useMutation({
    mutationFn: ({ idQ, accessToken }: { idQ: number; accessToken: string }) =>
      deleteQuestion({
        idQ,
        accessToken,
      }),
    onSuccess: () => {
      refetchQuestuion();
    },
    onError: (error) => {
      console.warn("feedback: ", error.message);
    },
  });
  /*--------------------------------------------------------------------------*/
  useEffect(() => {
    if (data) {
      setCount(data.length);
    }
  }, [data]);
  useEffect(() => {
    if (questionEtu) {
      setCount((prev) => prev + questionEtu.length);
    }
  }, [questionEtu]);

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
      <Nav isOpen={isOpen} responsabiliteOf={responsabiliteOf} />
      <div
        className="flex items-center gap-3 sm:flex sm:items-center  sm:justify-end lg:gap-6 "
        onMouseLeave={() => setPopShow("close")}
      >
        <div
          className="relative "
          onMouseEnter={() => setPopShow("notification")}
        >
          <Notification
            count={count}
            setIsOpenNotification={setIsOpenNotification}
            isOpenNotification={isOpenNotification}
          />
          {popShow === "notification" && isOpenNotification === false && (
            <div className="absolute top-16.5 -right-5  space-y-2  bg-[#313131] text-[#B2B3B5]  transform transition-all duration-300 ease-in-out rounded-lg shadow-lg px-2 py-1.5 z-[99]">
              Notification
            </div>
          )}
          {isOpenNotification && (
            <div className="flex  px-4 py-2.5 flex-col gap-4 drop-shadow shadow absolute top-17 -right-22  w-[400px]   h-[600px]  space-y-2  bg-white  transform transition-all duration-300 ease-in-out rounded z-[999]">
              <div className="text-gray-950 py-2.5">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-medium ">Notification</h2>
                </div>
                <hr className="text-gray-600 w-full h-0.5" />
                <ul className="text-gray-700 flex flex-col  py-4 gap-y-3  overflow-auto ">
                  {count > 0 &&
                    data?.map(
                      (
                        item: { description: string; idF: number },
                        index: number
                      ) => (
                        <li
                          key={index}
                          className="text-sm cursor-pointer hover:bg-gray-100 py-2 px-2 hover:border hover:border-gray-300  hover:shadow  hover:drop-shadow flex items-center justify-between border-b border-gray-300 hover:border-b-0 transition duration-150 ease-in-out"
                        >
                          <span>
                            <span className=" font-bold">Responsable : </span>{" "}
                            <span className="text-teal-600">
                              {" "}
                              {item.description}
                            </span>
                          </span>
                          <RiDeleteBin5Fill
                            className="hover:text-red-600 transition duration-150 ease-in-out text-lg "
                            onClick={() => {
                              mutate({
                                accessToken: accessToken!,
                                idF: item.idF,
                              });
                            }}
                          />
                        </li>
                      )
                    )}
                  {questionEtu.map(
                    (item: {
                      idQ: number;
                      question: string;
                      reponse: string;
                      idF: number;
                    }) => (
                      <li
                        key={item.idQ}
                        className="text-sm cursor-pointer hover:bg-gray-100 py-2 px-2 hover:border hover:border-gray-300  hover:shadow  hover:drop-shadow flex items-center justify-between border-b border-gray-300 hover:border-b-0 transition duration-150 ease-in-out"
                      >
                        <div className=" flex flex-col gap-1.5 text-sm">
                          <span>
                            <span className=" font-bold">Question :</span>{" "}
                            {item.question}
                          </span>
                          <span>
                            <span className=" font-bold">Reponse :</span>{" "}
                            <span className="text-teal-600">
                              {item.reponse}
                            </span>
                          </span>
                        </div>
                        <RiDeleteBin5Fill
                          className="hover:text-red-600 transition duration-150 ease-in-out text-lg "
                          onClick={() => {
                            mutateQuestion({
                              accessToken: accessToken!,
                              idQ: item.idQ,
                            });
                          }}
                        />
                      </li>
                    )
                  )}
                  {count == 0 && (
                    <p className=" w-full flex items-center justify-center min-h-screen text-gray-400">
                      {" "}
                      Acunan notification
                    </p>
                  )}
                </ul>
              </div>
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
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [binomeID, setBinomeID] = useState<number>(-1);
  const [responsabiliteOf, setResponsabilOf] = useState<string>("");
  const [dataEtu, setDataEtu] = useState<{
    idB: number;
    responsabilite: string;
    idEtape: number;
    idG: number;
  }>();
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
  useEffect(() => {
    if (data) {
      setDataEtu(data);
      setResponsabilOf(data.responsabilite);
      setBinomeID(data.idB);
    }
  }, [data]);
  useEffect(() => {
    if (dataEtu?.responsabilite !== undefined) {
      setIsOpen(true);
    }
  }, [dataEtu?.responsabilite]);

  return (
    <>
      {binomeID !== -1 && (
        <>
          <Header
            isOpen={isOpen}
            responsabiliteOf={responsabiliteOf}
            idB={binomeID}
          />
          <Outlet />
        </>
      )}
    </>
  );
};

export default LayoutEtudiant;
