import { ChangeEvent, useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import {  IoMdCheckmark } from "react-icons/io";
import { useAuthStore, useEvaluationStore } from "../../../store";
import { useShallow } from "zustand/shallow";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt, FaLink, FaClock } from "react-icons/fa";


import { NavLink } from "react-router";
import { BiArrowBack } from "react-icons/bi";
interface Task {
  idR: number;
  tacheNom: string;
  dateFin: string;
  rapport: string;
  versionDescription: string;
  lien: string;
  updatedAt: string;
  statut: "Accepté" | "Rejeté";
}
const getAllTacheOfGroupe = async ({
  idG,
  accessToken,
}: {
  idG: number;
  accessToken: string;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/responsable/etape/${idG}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) throw new Error("Cannot fetch for get all tache of groupe");
  return response.json();
};
const getAllTacheOfEtapeByBinome = async ({
  idB,
  idEtape,
  accessToken,
}: {
  idB: number;
  idEtape: number;
  accessToken: string;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/responsable/taches?idB=${idB}&idEtape=${idEtape}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) throw new Error("Cannot fetch for get all tache of groupe");
  return response.json();
};

type EtapeProps = {
  idEtape: number;
  nom: string;
};
type CustomSelectEtapeProps = {
  responsable: EtapeProps[];
  label: string;
  setIdEtape: (id: number) => void;
};

function CustomEtapeSelect({
  responsable,
  label,
  setIdEtape,
}: CustomSelectEtapeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dataResponsable, setDataResponsable] =
    useState<EtapeProps[]>(responsable);
  const [itemSelection, setItemSelection] = useState<EtapeProps | null>(null);

  useEffect(() => {
    if (responsable.length > 0) {
      setDataResponsable(responsable);
      setItemSelection(responsable[0]);
    } else {
      setDataResponsable([]);
      setItemSelection(null);
    }
  }, [responsable]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    const filtered = responsable.filter((item) =>
      item.nom.toLowerCase().includes(value)
    );
    setDataResponsable(filtered);
    if (filtered.length > 0) {
      setItemSelection(filtered[0]);
    } else {
      setItemSelection(null);
    }
  };

  const handleSelection = (item: EtapeProps) => {
    setItemSelection(item);
    setIsOpen(false);
  };

  useEffect(() => {
    if (itemSelection) {
      setIdEtape(itemSelection.idEtape);
    }
  }, [itemSelection, setIdEtape]);
  return (
    <div className="w-[70%] flex  items-center  gap-2 text-[#09090B]">
      <h2 className="block mb-2 text-md font-medium text-gray-900 text-nowrap">
        {label}
      </h2>
      <div className="relative w-1/2">
        <div className="relative mb-2">
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4"
            onChange={handleChange}
            value={itemSelection?.nom || ""}
            placeholder="Sélectionner un responsable"
            onClick={() => setIsOpen(!isOpen)}
            readOnly
          />
          {isOpen ? (
            <FiChevronUp
              className="absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform transition-all"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <FiChevronDown
              className="absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform transition-all"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>

        {isOpen && (
          <ul className="absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto">
            {dataResponsable.length > 0 ? (
              dataResponsable.map((item) => (
                <li
                  key={item.idEtape}
                  className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${
                    itemSelection === item ? "bg-[#F4F7FD]" : ""
                  } transition-all`}
                  onClick={() => handleSelection(item)}
                >
                  <span>
                    {itemSelection === item ? (
                      <IoMdCheckmark className="text-sm text-[#7CFC00]" />
                    ) : (
                      <span className="w-3.5" />
                    )}
                  </span>
                  <span className="font-medium">{item.nom}</span>
                </li>
              ))
            ) : (
              <li className="py-1 px-2.5 text-gray-500">
                Aucun résultat trouvé
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

const TaskCard = ({ task }: { task: Task }) => {
  const formattedDate = new Date(task.dateFin).toLocaleDateString();
  const updatedAt = new Date(task.updatedAt).toLocaleString();

  return (
    <div className="w-full bg-white border border-gray-200 rounded-md drop-shadow px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 hover:bg-slate-50 transition-all duration-200 ease-in-out transform">
      <h2 className="text-lg font-semibold text-gray-800 w-64">
        {task.tacheNom}
      </h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-sm text-gray-600">
        <p className="flex items-center gap-2 ">
          <FaCalendarAlt className="text-green-500" />
          <span className="font-medium">Date de fin :</span> {formattedDate}
        </p>
        <p className="flex items-center gap-2">
          <FaClock className="text-green-500" />
          <span className="font-medium">Mis à jour le :</span> {updatedAt}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <a
          href={task.lien}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <FaLink className="text-green-500" />
          Voir le document
        </a>
      </div>
    </div>
  );
};

const RapportEtapeBinome = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [idEtape, setIdEtape] = useState<number>(-1);

  const { idG, idB, setEtapeId } = useEvaluationStore(
    useShallow((state) => ({
      idG: state.idG,
      idB: state.idB,
      setEtapeId: state.setEtapeId,
    }))
  );

  const [etapesOptions, setEtapesOptions] = useState<EtapeProps[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: Etapes } = useQuery({
    queryKey: ["etapes", idG],
    queryFn: () => getAllTacheOfGroupe({ accessToken: accessToken!, idG }),
    enabled: !!accessToken && idG !== -1,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (Etapes) {
      setEtapesOptions(Etapes);
    }
  }, [Etapes]);

  const {
    data: BinomeEtapes,
    isError,
    isFetching,

  } = useQuery({
    queryKey: ["etapes-binome", idB, idEtape],
    queryFn: () =>
      getAllTacheOfEtapeByBinome({ idB, idEtape, accessToken: accessToken! }),
    enabled: !!accessToken && idB !== -1 && idEtape !== -1,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (isError) {
      setErrorMessage(
        "Erreur lors du chargement des tâches. Veuillez réessayer."
      );
      setTasks([]);
    } else if (BinomeEtapes && BinomeEtapes.length === 0) {
      setErrorMessage("Aucune tâche trouvée pour cette étape.");
      setTasks([]);
    } else if (BinomeEtapes) {
      setErrorMessage(null);
      setTasks(BinomeEtapes);
    }
  }, [BinomeEtapes, isError]);
  useEffect(() => {
    if (idEtape !== -1) {
      setErrorMessage(null);
    }
  }, [idEtape]);
  useEffect(() => {
    if (idEtape !== -1) {
      setEtapeId(idEtape);
    }
  }, [idEtape, setEtapeId]);

  return (
    <section className="w-full min-h-svh mt-20 px-12 py-10">
      <div className="flex items-center justify-between mb-10">
        <CustomEtapeSelect
          responsable={etapesOptions}
          label="Choisissez une étape pour voir toutes les tâches assignées à ce binôme : "
          setIdEtape={setIdEtape}
        />
      </div>
      <section className="mt-6">
        {errorMessage ? (
          <div className="text-red-600 font-semibold  flex items-center justify-center h-96 w-full">
            <p>{errorMessage}</p>
          </div>
        ) : isFetching ? (
          <div className="  flex items-center justify-center h-96 w-full">
            <p>Chargement des tâches...</p>
          </div>
        ) : (
          tasks.map((task, index) => <TaskCard key={index} task={task} />)
        )}
      </section>

      <NavLink
        to="/ens-responsable/rapport-taches"
        className="fixed bottom-8 right-4 bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center"
      >
        <BiArrowBack className="text-2xl" />
      </NavLink>
    </section>
  );
};

export default RapportEtapeBinome;
