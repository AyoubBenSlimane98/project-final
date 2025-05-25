import { ChangeEvent, useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IoMdAdd, IoMdCheckmark } from "react-icons/io";
import { useAuthStore, useEvaluationStore } from "../../../store";
import { useShallow } from "zustand/shallow";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaCalendarAlt, FaLink, FaClock } from "react-icons/fa";

import { IoClose } from "react-icons/io5";
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
const updateEvaluationRapport = async ({
  idR,
  statut,
  accessToken,
}: {
  idR: number;
  statut: string;
  accessToken: string;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/responsable/evaluation-rapport`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ idR, statut }),
    }
  );
  if (!response.ok) throw new Error("Cannot fetch for get all tache of groupe");
  return response.json();
};
const noteEvaluationRapport = async ({
  idB,
  idEtape,
  note,
  accessToken,
}: {
  idB: number;
  idEtape: number;
  note: number;
  accessToken: string;
}) => {
  console.log("idEtape : ", idEtape, typeof idEtape);
  const response = await fetch(
    `http://localhost:4000/api/responsable/note/${idEtape}/${idB}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ note }),
    }
  );
  if (!response.ok) throw new Error("Cannot fetch for set note etape binome ");
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
// const AddNoteCard = ({
//   setAddNote,
//   etapesOptions,
// }: {
//   setAddNote: (add: boolean) => void;
//   etapesOptions: EtapeProps[];
// }) => {
//   const accessToken = useAuthStore((state) => state.accessToken);
//   const { idEtape, idB } = useEvaluationStore(
//     useShallow((state) => ({
//       idEtape: state.idEtape,
//       idB: state.idB,
//     }))
//   );
//   const [note, setNote] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.trim();
//     setNote(value);
//     const numberValue = Number(value);
//     if (value === "") {
//       setError("");
//     } else if (isNaN(numberValue)) {
//       setError("Veuillez entrer un numéro valide.");
//     } else if (numberValue < 0 || numberValue > 2) {
//       setError("La note doit être comprise entre 0 et 2.");
//     } else {
//       setError("");
//     }
//   };

//   const { mutate } = useMutation({
//     mutationFn: ({
//       idB,
//       idEtape,
//       note,
//       accessToken,
//     }: {
//       idB: number;
//       idEtape: number;
//       note: number;
//       accessToken: string;
//     }) =>
//       noteEvaluationRapport({
//         idB,
//         idEtape,
//         note,
//         accessToken,
//       }),
//     onSuccess: () => {
//       setTimeout(() => {
//         setIsLoading(false);
//         setNote("");
//       }, 2000);
//     },
//     onError: () => {
//       setError("la note exsite pour cette binome");
//     },
//   });
//   const handleSave = () => {
//     setIsLoading(true);
//     if (accessToken && idB !== -1 && idEtape !== -1) {
//       mutate({ idB, idEtape, note: Number(note), accessToken });
//     }
//   };
//   return (
//     <div className="w-xl mx-auto mt-10 px-6 py-8 bg-white rounded shadow-md relative ">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">
//           Ajouter une note
//         </h2>
//         <IoClose
//           className="text-2xl text-gray-400 absolute right-4 top-5 hover:text-red-500 transform duration-200 ease-in-out transition-all"
//           onClick={() => setAddNote(false)}
//         />
//       </div>

//       <input
//         value={note}
//         onChange={handleChange}
//         placeholder="Entrez un nombre entre 0 et 2"
//         className={`w-full p-3 border ${
//           error ? "border-red-500" : "border-gray-300"
//         } rounded-lg focus:outline-none focus:ring-2 ${
//           error ? "focus:ring-red-500" : "focus:ring-blue-500"
//         } resize-none`}
//       />

//       {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//       <button
//         onClick={handleSave}
//         disabled={!!error || note.trim() === ""}
//         className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
//           error || note.trim() === ""
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700"
//         }`}
//       >
//         {isLoading ? "Enregistrement..." : "Enregistrer la note"}
//       </button>
//     </div>
//   );
// };
const TaskCard = ({ task, refetch }: { task: Task; refetch: () => void }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const formattedDate = new Date(task.dateFin).toLocaleDateString();
  const updatedAt = new Date(task.updatedAt).toLocaleString();

  const { mutate } = useMutation({
    mutationFn: ({
      idR,
      statut,
      accessToken,
    }: {
      idR: number;
      statut: string;
      accessToken: string;
    }) =>
      updateEvaluationRapport({
        idR,
        statut,
        accessToken,
      }),
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.warn(error.message);
    },
  });
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (accessToken && task) {
      mutate({ idR: task.idR, statut: event.target.value, accessToken });
    }
  };
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
        <select
          value={task.statut}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="Rejeté">Rejeté</option>
          <option value="Accepté">Accepté</option>
        </select>

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
const MAX_NOTES: Record<string, number> = {
  analyse: 2,
  conception: 2,
  developpement: 12,
};
const AddNoteCard = ({
  setAddNote,
  etapesOptions,
}: {
  setAddNote: (add: boolean) => void;
  etapesOptions: EtapeProps[];
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { idEtape, idB } = useEvaluationStore(
    useShallow((state) => ({
      idEtape: state.idEtape,
      idB: state.idB,
    }))
  );
  console.log(etapesOptions);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const etapeCourante = etapesOptions.find(
    (etape) => etape.idEtape === idEtape
  );
  const nomEtape = etapeCourante?.nom.toLowerCase() ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setNote(value);

    const numberValue = Number(value);

    if (value === "") {
      setError("");
      return;
    }

    if (isNaN(numberValue)) {
      setError("Veuillez entrer un numéro valide.");
      return;
    }

    const maxNote = MAX_NOTES[nomEtape];

    if (maxNote !== undefined) {
      if (numberValue < 0 || numberValue > maxNote) {
        setError(`La note doit être comprise entre 0 et ${maxNote}.`);
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  const { mutate } = useMutation({
    mutationFn: ({
      idB,
      idEtape,
      note,
      accessToken,
    }: {
      idB: number;
      idEtape: number;
      note: number;
      accessToken: string;
    }) =>
      noteEvaluationRapport({
        idB,
        idEtape,
        note,
        accessToken,
      }),
    onSuccess: () => {
      setTimeout(() => {
        setIsLoading(false);
        setNote("");
        setAddNote(false); // إغلاق النافذة المنبثقة عند النجاح
      }, 2000);
    },
    onError: (error) => {
      console.warn("note : ", error.message);
      setIsLoading(false);
    },
  });

  const handleSave = () => {
    setIsLoading(true);
    if (accessToken && idB !== -1 && idEtape !== -1) {
      mutate({ idB, idEtape, note: Number(note), accessToken });
    }
  };

  console.log({ note, error });
  console.log(nomEtape);
  return (
    <div className="w-xl mx-auto mt-10 px-6 py-8 bg-white rounded shadow-md relative">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Ajouter une note
        </h2>
        <IoClose
          className="text-2xl text-gray-400 absolute right-4 top-5 hover:text-red-500 cursor-pointer"
          onClick={() => setAddNote(false)}
        />
      </div>

      <input
        value={note}
        onChange={handleChange}
        placeholder={
          MAX_NOTES[nomEtape] !== undefined
            ? `Entrez une note entre 0 et ${MAX_NOTES[nomEtape]}`
            : "Entrez une note"
        }
        className={`w-full p-3 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-blue-500"
        }`}
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        onClick={handleSave}
        disabled={!!error || note.trim() === ""}
        className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
          !!error || note.trim() === ""
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Enregistrement..." : "Enregistrer la note"}
      </button>
    </div>
  );
};

const EvaluationBinome = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [idEtape, setIdEtape] = useState<number>(-1);
  const [addNote, setAddNote] = useState<boolean>(false);
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
    refetch,
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
        <button
          className="px-4 py-3 flex items-center gap-2 rounded bg-blue-600 text-white text-sm text-nowrap cursor-pointer"
          onClick={() => setAddNote(true)}
        >
          <IoMdAdd className="text-xl" />
          Note de Etape
        </button>
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
          tasks.map((task, index) => (
            <TaskCard key={index} task={task} refetch={refetch} />
          ))
        )}
      </section>
      {addNote && (
        <section className="absolute top-0 left-0 w-full h-svh bg-black/45 z-30 flex justify-center items-center">
          <AddNoteCard setAddNote={setAddNote} etapesOptions={etapesOptions} />
        </section>
      )}
      <NavLink
        to="/ens-responsable/evaluation"
        className="fixed bottom-8 right-4 bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center"
      >
        <BiArrowBack className="text-2xl" />
      </NavLink>
    </section>
  );
};

export default EvaluationBinome;
