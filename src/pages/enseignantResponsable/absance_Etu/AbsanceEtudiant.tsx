import { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import { FaCheckCircle, FaSearch } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useShallow } from "zustand/shallow";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoMdCheckmark } from "react-icons/io";
import { useAuthStore, useResponsablStore } from "../../../store";
import { MdOutlineClose } from "react-icons/md";
type NotesType = {
  Analyse: number;
  Conception: number;
  Presence: number;
  Bonus: number;
  Developpement: number;
};
type Note = {
  nomEtape: string;
  note: number;
};
export type BinomeUser = {
  idB: number;
  bio: string;
  image: string | null;
  fullName: string;
};
type StudentBinome = {
  idU: number;
  fullName: string;
  presences: Array<{
    idDP: number;
    etat: string;
  }>;
};

export type Groupe = {
  idG: number;
  nom: string;
};
export type CustomSelectGroupeProps = {
  responsable: Groupe[];
  label?: string;
};

const getResponsableId = async (accessToken: string) => {
  const response = await fetch(
    `http://localhost:4000/api/responsable/enseignant`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) throw new Error("Cannot fetch responsable ID");
  return response.json();
};
const setOrUpdateNoteFinal = async ({
  accessToken,
  idU,
  noteFinal,
}: {
  accessToken: string;
  idU: number;
  noteFinal: number;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/responsable/etudiant/${idU}/noteFinal`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ noteFinal }),
    }
  );
  if (!response.ok) throw new Error("Cannot fetch responsable ID");
  return response.json();
};
const setEtatEtudiant = async ({
  accessToken,
  data,
}: {
  accessToken: string;
  data: { etudiantId: number; idDP: number; etat: string };
}) => {
  const response = await fetch(
    `http://localhost:4000/api/responsable/presence`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Cannot fetch responsable ID");
  return response.json();
};
const getAllDates = async (accessToken: string) => {
  const response = await fetch(`http://localhost:4000/api/responsable/dates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Cannot fetch get Dates");
  return response.json();
};

const getAllGroupesOfResponsable = async ({
  enseignantId,
  accessToken,
}: {
  enseignantId: number;
  accessToken: string;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/responsable/groupe-responsable/${enseignantId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok)
    throw new Error("Cannot fetch for get groupes of responsable");
  return response.json();
};
const getNoteEtapEtudiant = async ({
  idU,
  accessToken,
}: {
  idU: number;
  accessToken: string;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/eutdaint/note/${idU}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) throw new Error("Cannot fetch for get note of student ");
  return response.json();
};

const getMemmbersGroupes = async ({
  idG,
  accessToken,
}: {
  idG: number;
  accessToken: string;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/responsable/binomes/${idG}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) throw new Error("Cannot fetch binômes!");
  return response.json();
};

function CustomGroupSelect({ responsable, label }: CustomSelectGroupeProps) {
  const { groupe, setGroupe } = useResponsablStore(
    useShallow((state) => ({
      groupe: state.groupe,
      setGroupe: state.setGroupe,
    }))
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dataResponsable, setDataResponsable] = useState<Groupe[]>(responsable);
  const [itemSelection, setItemSelection] = useState<Groupe | null>();

  useEffect(() => {
    if (dataResponsable.length > 0 && groupe.idG == -1) {
      setItemSelection(dataResponsable[0]);
      setGroupe(dataResponsable[0]);
    }
  }, [dataResponsable, setGroupe, groupe]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filtered = responsable.filter((item) =>
      item.nom.toLowerCase().includes(value.toLowerCase())
    );

    setDataResponsable(filtered);
    setItemSelection(filtered.length > 0 ? filtered[0] : null);
  };

  const handleSelection = (item: Groupe) => {
    setItemSelection(item);
    setIsOpen(false);
    setGroupe(item);
  };

  return (
    <div className="w-full flex items-center gap-2 text-[#09090B] py-1 ">
      <h2 className="block mb-2 text-md font-medium text-gray-900">{label} </h2>
      <div className="relative w-1/2 ">
        <div className="relative  mb-2">
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4"
            onChange={handleChange}
            value={
              itemSelection
                ? itemSelection.nom
                : dataResponsable.find((itm) => itm.idG === groupe.idG)?.nom ||
                  ""
            }
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen ? (
            <FiChevronUp
              className="absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <FiChevronDown
              className="absolute top-1/2  right-0 text-xl cursor-pointer  -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>

        {isOpen && (
          <ul className="absolute z-50 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto">
            {dataResponsable.length > 0 ? (
              dataResponsable.map((item) => (
                <li
                  key={item.idG}
                  className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${
                    itemSelection?.idG === item.idG ? "bg-[#F4F7FD]" : ""
                  } transform duration-300 ease-in-out transition-all`}
                  onClick={() => handleSelection(item)}
                >
                  <span>
                    {itemSelection?.idG === item.idG ? (
                      <IoMdCheckmark className="text-sm text-[#7CFC00] " />
                    ) : (
                      <p className="w-3.5"></p>
                    )}
                  </span>
                  <span className="font-medium">{item.nom} </span>
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
const ModalNote = ({
  setIsNote,
  etuNotes,
  userId,
  setIsSucces,
}: {
  setIsNote: React.Dispatch<React.SetStateAction<boolean>>;
  etuNotes: Note[];
  userId: number;
  setIsSucces: (note: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [notes, setNotes] = useState<NotesType>({
    Analyse: 0,
    Conception: 0,
    Presence: 0,
    Bonus: 0,
    Developpement: 0,
  });
  const [errors, setErrors] = useState<{
    Bonus?: string;
    Presence?: string;
  }>({});

  const setError = (field: keyof NotesType, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === "") {
      setNotes((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError(name as keyof NotesType, "Champ vide.");
      return;
    }

    const numericValue = parseFloat(value);

    if (name === "Bonus" || name === "Presence") {
      if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 2) {
        setNotes((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
        setError(name as keyof NotesType, ""); // Clear error
      } else {
        setError(
          name as keyof NotesType,
          `La note de ${
            name === "Bonus" ? "bonus" : "présence"
          } doit être entre 0 et 2.`
        );
      }
    }
  };

  const calculateFinalNote = () =>
    Number(notes.Analyse) +
    Number(notes.Conception) +
    Number(notes.Developpement) +
    Number(notes.Bonus) +
    Number(notes.Presence);

  useEffect(() => {
    setNotes((prev) => {
      const updatedNotes = { ...prev };
      etuNotes.forEach(({ nomEtape, note }) => {
        if (nomEtape in updatedNotes) {
          updatedNotes[nomEtape as keyof NotesType] = note;
        }
      });
      return updatedNotes;
    });
  }, [etuNotes]);

  const { mutate } = useMutation({
    mutationFn: ({
      accessToken,
      idU,
      noteFinal,
    }: {
      accessToken: string;
      idU: number;
      noteFinal: number;
    }) =>
      setOrUpdateNoteFinal({
        accessToken,
        idU,
        noteFinal,
      }),
    onSuccess: () => {
      setIsSucces(true);
      
      setTimeout(() => {
        setIsLoading(false);
        setIsSucces(false);
      }, 2000);
    },
    onError: () => {
      setIsLoading(false);
    },
  });
  const handleSubmit = () => {
    setIsLoading(true);
    if (accessToken && userId !== -1) {
      mutate({
        idU: userId,
        accessToken,
        noteFinal: calculateFinalNote(),
      });
    }
  };
  return (
    <div className="max-w-2xl w-full fixed z-[888] bg-white border border-gray-200 rounded-md shadow drop-shadow-2xl left-1/2 top-1/2 mt-20 -translate-y-1/2 -translate-x-1/2 px-8 py-12">
      <MdOutlineClose
        className="text-3xl text-gray-400 absolute right-4 top-5 hover:text-red-500 cursor-pointer"
        onClick={() => setIsNote(false)}
      />
      <section className="flex items-center justify-between">
        {/* Étape 1 : Analyse */}
        <div className="flex flex-col mb-2">
          <label className="mb-2">Étape 1 : Analyse</label>
          <div className="flex">
            <input
              value={notes.Analyse}
              onChange={handleChange}
              name="Analyse"
              type="text"
              readOnly
              className="w-52 border border-r-0 border-gray-400 py-1 outline-none px-4"
            />
            <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
              / 2 pts
            </span>
          </div>
        </div>

        {/* Étape 2 : Conception */}
        <div className="flex flex-col mb-2">
          <label className="mb-2">Étape 2 : Conception</label>
          <div className="flex">
            <input
              name="Conception"
              value={notes.Conception}
              onChange={handleChange}
              type="number"
              readOnly
              className="w-52 border border-r-0 border-gray-400 py-1 outline-none px-4"
            />
            <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
              / 2 pts
            </span>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between">
        {/* Présence */}
        <div className="flex flex-col mb-2 w-full">
          <label className="mb-2">Présence</label>
          <div className="flex">
            <input
              value={notes.Presence}
              onChange={handleChange}
              name="Presence"
              type="number"
              className={`${
                errors.Presence ? "border-red-600" : "border-gray-400 "
              } w-52 border border-r-0 py-1 outline-none px-4`}
            />
            <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
              / 2 pts
            </span>
          </div>
          {errors.Presence && (
            <p className="text-red-600 text-sm" aria-live="assertive">
              {errors.Presence}
            </p>
          )}
        </div>

        {/* Bonus */}
        <div className="flex flex-col mb-2">
          <label className="mb-2">Bonus</label>
          <div className="flex">
            <input
              value={notes.Bonus}
              onChange={handleChange}
              name="Bonus"
              type="number"
              className={`${
                errors.Bonus ? "border-red-600" : "border-gray-400 "
              } w-52 border border-r-0 py-1 outline-none px-4`}
            />
            <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
              / 2 pts
            </span>
          </div>
          {errors.Bonus && (
            <p className="text-red-600 text-sm" aria-live="assertive">
              {errors.Bonus}
            </p>
          )}
        </div>
      </section>

      {/* Étape 3 : Développement */}
      <div className="flex flex-col mb-2 w-full">
        <label className="mb-2">Étape 3 : Développement</label>
        <div className="flex">
          <input
            value={notes.Developpement}
            onChange={handleChange}
            name="Developpement"
            type="text"
            readOnly
            className="grow border border-r-0 border-gray-400 py-1 outline-none px-4"
          />
          <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
            / 12 pts
          </span>
        </div>
      </div>

      {/* Final Note */}
      <div className="flex items-center justify-between mt-6">
        <label className="text-nowrap font-medium text-gray-700">
          Note finale
        </label>
        <div className="flex">
          <input
            type="text"
            value={calculateFinalNote()}
            readOnly
            className="w-52 border border-r-0 border-gray-400 py-1 outline-none px-4"
          />
          <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
            / 20 pts
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex items-center justify-center gap-x-6 mt-6">
        <button
          onClick={handleSubmit}
          type="button"
          disabled={!!errors.Bonus || !!errors.Presence}
          className={`outline-none basis-1/2 border-none rounded-md py-2 text-white font-medium transition-all cursor-pointer ${
            errors.Bonus || errors.Presence
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Ajouter ..." : "Ajouter"}
        </button>
        <button
          onClick={() => setIsNote(false)}
          type="button"
          className="outline-none basis-1/2 border-none bg-red-500 hover:bg-red-700 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

// const ModalNote = ({
//   setIsNote,
//   etuNotes,
// }: {
//   setIsNote: React.Dispatch<React.SetStateAction<boolean>>;
//   etuNotes: Note[];
// }) => {
//   const [notes, setNotes] = useState<NotesType>({
//     Analyse: 0,
//     Conception: 0,
//     Presence: 0,
//     Bonus: 0,
//     Developpement: 0,
//   });
//   const [errors, setErrors] = useState<{
//     Bonus?: string;
//     Presence?: string;
//   }>({});
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     // السماح بقيمة فارغة مؤقتًا
//     if (value === "") {
//       setNotes((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//       setErrors((prev) => ({ ...prev, [name]: "Champ vide." }));
//       return;
//     }

//     const numericValue = parseFloat(value);

//     if (name === "Bonus" || name === "Presence") {
//       if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 2) {
//         setNotes((prev) => ({
//           ...prev,
//           [name]: numericValue,
//         }));
//         setErrors((prev) => ({ ...prev, [name]: undefined }));
//       } else {
//         setErrors((prev) => ({
//           ...prev,
//           [name]: `La note de ${
//             name === "Bonus" ? "bonus" : "présence"
//           } doit être entre 0 et 2.`,
//         }));
//       }
//     }
//   };

//   const finalNote =
//     notes.Analyse +
//     notes.Conception +
//     notes.Developpement +
//     notes.Bonus +
//     notes.Presence;

//   useEffect(() => {
//     setNotes((prev) => {
//       const updatedNotes = { ...prev };
//       etuNotes.forEach(({ nomEtape, note }) => {
//         if (nomEtape in updatedNotes) {
//           if (nomEtape === "Bonus" || nomEtape === "Presence") {
//             updatedNotes[nomEtape as keyof NotesType] = note;
//           } else {
//             updatedNotes[nomEtape as keyof NotesType] = note;
//           }
//         }
//       });
//       return updatedNotes;
//     });
//   }, [etuNotes]);

//   const hasErrors = Object.values(errors).some((e) => e !== undefined);
//   return (
//     <div className="max-w-2xl w-full fixed z-[888] bg-white border border-gray-200 rounded-md shadow drop-shadow-2xl left-1/2 top-1/2 mt-20 -translate-y-1/2 -translate-x-1/2 px-8 py-12">
//       <MdOutlineClose
//         className="text-3xl text-gray-400 absolute right-4 top-5 hover:text-red-500 cursor-pointer"
//         onClick={() => {
//           setIsNote(false);
//         }}
//       />
//       <section className="flex items-center justify-between">
//         {/* Étape 1 : Analyse */}
//         <div className="flex flex-col mb-2">
//           <label className="mb-2">Étape 1 : Analyse</label>
//           <div className="flex">
//             <input
//               value={notes.Analyse}
//               onChange={handleChange}
//               name="Analyse"
//               type="text"
//               readOnly
//               className="w-52 border border-r-0 border-gray-400 py-1 outline-none px-4"
//             />
//             <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
//               / 2 pts
//             </span>
//           </div>
//         </div>

//         {/* Étape 2 : Conception */}
//         <div className="flex flex-col mb-2">
//           <label className="mb-2">Étape 2 : Conception</label>
//           <div className="flex">
//             <input
//               name="Conception"
//               value={notes.Conception}
//               onChange={handleChange}
//               type="number"
//               readOnly
//               className="w-52 border border-r-0 border-gray-400 py-1 outline-none px-4"
//             />
//             <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
//               / 2 pts
//             </span>
//           </div>
//         </div>
//       </section>

//       <section className="flex items-center justify-between">
//         {/* Présence */}
//         <div className="flex flex-col mb-2 w-full">
//           <label className="mb-2">Présence</label>
//           <div className="flex">
//             <input
//               value={notes.Presence}
//               onChange={handleChange}
//               name="Presence"
//               type="number"
//               className={`${
//                 errors.Presence ? "border-red-600" : "border-gray-400 "
//               } w-52 border border-r-0 py-1 outline-none px-4`}
//             />
//             <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
//               / 2 pts
//             </span>
//           </div>
//         </div>

//         {/* Bonus */}
//         <div className="flex flex-col mb-2">
//           <label className="mb-2">Bonus</label>
//           <div className="flex">
//             <input
//               value={notes.Bonus}
//               onChange={handleChange}
//               name="Bonus"
//               type="number"
//               className={`${
//                 errors.Bonus ? "border-red-600" : "border-gray-400 "
//               } w-52 border border-r-0 py-1 outline-none px-4`}
//             />
//             <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
//               / 2 pts
//             </span>
//           </div>
//         </div>
//       </section>

//       {/* Étape 3 : Développement */}
//       <div className="flex flex-col mb-2 w-full">
//         <label className="mb-2">Étape 3 : Développement</label>
//         <div className="flex">
//           <input
//             value={notes.Developpement}
//             onChange={handleChange}
//             name="Developpement"
//             type="text"
//             readOnly
//             className="grow border border-r-0 border-gray-400 py-1 outline-none px-4"
//           />
//           <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
//             / 12 pts
//           </span>
//         </div>
//       </div>

//       {/* Final Note */}
//       <div className="flex items-center justify-between mt-6">
//         <label className="text-nowrap font-medium text-gray-700">
//           Note finale
//         </label>
//         <div className="flex">
//           <input
//             type="text"
//             value={finalNote}
//             readOnly
//             className="w-52 border border-r-0 border-gray-400 py-1 outline-none px-4"
//           />
//           <span className="border border-l-0 border-gray-700 py-1.5 w-20 text-center bg-gray-700 text-white">
//             / 20 pts
//           </span>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="w-full flex items-center justify-center gap-x-6 mt-6">
//         <button
//           type="button"
//           disabled={hasErrors}
//           className={`outline-none basis-1/2 border-none rounded-md py-2 text-white font-medium transition-all cursor-pointer
//     ${
//       hasErrors
//         ? "bg-gray-400 cursor-not-allowed"
//         : "bg-blue-500 hover:bg-blue-600"
//     }`}
//         >
//           Ajouter
//         </button>
//         <button
//           onClick={() => {
//             setIsNote(false);
//           }}
//           type="button"
//           className="outline-none basis-1/2 border-none bg-red-500 hover:bg-red-700 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
//         >
//           Annuler
//         </button>
//       </div>
//     </div>
//   );
// };
const AbsanceEtudiant = () => {
  const [isSucces, setIsSucces] = useState<boolean>(false);
  const [etuNotes, setEtuNotes] = useState<Note[]>([]);
  const { groupe } = useResponsablStore(
    useShallow((state) => ({
      groupe: state.groupe,
      setBinomeID: state.setBinomeID,
      idB: state.idB,
      addUsers: state.addUsers,
      users: state.users,
    }))
  );
  const [userId, setUserId] = useState<number>(-1);
  const accessToken = useAuthStore((state) => state.accessToken);

  const columnHelper = createColumnHelper<StudentBinome>();

  const [globalFilter, setGlobalFilter] = useState("");
  const [isNote, setIsNote] = useState<boolean>(false);

  const [isClose, setIsClose] = useState<boolean>(true);
  const [datePrecence, setDatePrecence] = useState<
    {
      idDP: number;
      date: string;
    }[]
  >([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: dates } = useQuery({
    queryKey: ["dates"],
    queryFn: () => getAllDates(accessToken!),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (dates) {
      setDatePrecence(dates);
    }
  }, [dates]);

  const { data: responsableId } = useQuery({
    queryKey: ["responsable"],
    queryFn: () => getResponsableId(accessToken!),
    enabled: !!accessToken,
  });

  const { data: groupes } = useQuery({
    queryKey: ["groupes", responsableId],
    queryFn: () =>
      getAllGroupesOfResponsable({
        enseignantId: responsableId!,
        accessToken: accessToken!,
      }),
    enabled: !!accessToken && !!responsableId,
  });

  const [data, setData] = useState<StudentBinome[]>([]);

  const { data: memmbersGroupe, refetch } = useQuery({
    queryKey: ["memmbers", accessToken, groupe],
    queryFn: async () => {
      if (groupe === undefined) throw new Error("No  groupe with id");
      return await getMemmbersGroupes({
        accessToken: accessToken!,
        idG: groupe.idG,
      });
    },
    enabled: !!accessToken && groupe !== undefined,
  });
  useEffect(() => {
    if (memmbersGroupe) {
      setData(memmbersGroupe);
    }
  }, [memmbersGroupe]);

  const { mutate: mutateEtat } = useMutation({
    mutationFn: ({
      accessToken,
      data,
    }: {
      accessToken: string;
      data: { etudiantId: number; idDP: number; etat: string };
    }) => setEtatEtudiant({ accessToken, data }),
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.log("erroro .......", error.message);
    },
  });

  const columns = [
    columnHelper.accessor("fullName", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="text-white text-sm text-nowrap">Nom et Prénom</span>
      ),
    }),
    ...datePrecence.map((date: { idDP: number; date: string }) =>
      columnHelper.display({
        id: date.idDP.toString(),
        header: () => <span className="text-sm text-white">{date.date}</span>,
        cell: ({ row }) => {
          const presence = row.original.presences.find(
            (item) => item.idDP.toString() === date.idDP.toString()
          );

          const etat = presence ? presence.etat : "";

          return (
            <select
              className="border border-gray-300 px-6 py-2 rounded text-xs cursor-pointer"
              onChange={(e) =>
                handlePresenceChange(e, row.original.idU, date.idDP)
              }
              value={etat}
            >
              <option value="Absent">Absent</option>
              <option value="Present">Present</option>
            </select>
          );
        },
      })
    ),
    columnHelper.display({
      id: "note",
      cell: ({ row }) => (
        <div
          className="w-full bg-green-600 text-white text-center py-1.5 text-sm rounded-2xl cursor-pointer z-50 "
          onClick={() => {
            setIsNote(true);
            setUserId(row.original.idU);
          }}
        >
          Ajouter
        </div>
      ),
      header: () => (
        <span className="text-white text-sm text-nowrap">Note Final</span>
      ),
    }),
  ];
  const table = useReactTable({
    columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handlePresenceChange = (
    e: ChangeEvent<HTMLSelectElement>,
    etudiantId: number,
    idDP: number
  ) => {
    const newEtat = e.target.value;

    setData((prevData) =>
      prevData.map((student) => {
        if (student.idU === etudiantId) {
          const updatedPresences = student.presences.map((presence) => {
            if (presence.idDP === idDP) {
              return { ...presence, etat: newEtat };
            }
            return presence;
          });
          return { ...student, presences: updatedPresences };
        }
        return student;
      })
    );
    if (accessToken) {
      mutateEtat({
        accessToken,
        data: { etudiantId, idDP, etat: newEtat },
      });
    }
  };
  const { data: noteEudiant } = useQuery({
    queryKey: ["note-etu", userId],
    queryFn: () =>
      getNoteEtapEtudiant({
        idU: userId!,
        accessToken: accessToken!,
      }),
    enabled: !!accessToken && userId !== -1,
  });

  useEffect(() => {
    if (noteEudiant) {
      setEtuNotes(noteEudiant);
    }
  }, [noteEudiant]);
  return (
    <main className="flex flex-col items-center min-h-svh  w-full mx-auto  px-12 relative ">
      {isNote && (
        <section className="absolute top-0 left-0 w-full h-svh bg-black/45 z-30 flex justify-center items-center"></section>
      )}
      <div className="w-full flex justify-between items-center mt-26 mb-6">
        {isClose && groupes && (
          <CustomGroupSelect
            responsable={groupes}
            label="Veuillez sélectionner un groupe :"
          />
        )}
        {isOpen ? (
          <div
            className={` ${
              isClose ? "" : "w-full"
            } flex transform duration-300 ease-in transition-all`}
          >
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="w-full pl-6 pr-4 py-2 bg-white border border-r-0 border-gray-300 rounded-l-md shadow-sm outline-none "
            />
            <div
              className="w-26 h-11 bg-slate-200 rounded-r-md border border-gray-300 flex items-center justify-center shadow-sm "
              onClick={() => {
                setIsOpen(false);
                setIsClose(true);
              }}
            >
              <FaSearch className="  text-gray-900 " />
            </div>
          </div>
        ) : (
          <div
            className="w-12 h-12 border border-gray-300 bg-white flex items-center justify-center rounded-full transform duration-100 ease-linear transition-all"
            onClick={() => {
              setIsOpen(true);
              setIsClose(false);
            }}
          >
            <FaSearch className=" text-gray-900 " />
          </div>
        )}
      </div>

      <div className="bg-white shadow-md w-full rounded-lg max-h-[600px] overflow-hidden hover:overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-black sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-xs font-medium uppercase text-white bg-black"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isNote && (
        <ModalNote
          setIsNote={setIsNote}
          etuNotes={etuNotes}
          userId={userId}
          setIsSucces={setIsSucces}
        />
      )}
      <div
        className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${
          isSucces ? "bottom-40" : "-bottom-40 hidden"
        } `}
      >
        <FaCheckCircle className=" text-green-500 text-3xl" />{" "}
        <p>la note ont été affectés avec succès.</p>
      </div>
    </main>
  );
};

export default AbsanceEtudiant;
