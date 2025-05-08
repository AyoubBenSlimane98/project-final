import { ChangeEvent, useEffect, useRef, useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useAuthStore, useEtudiantStore } from "../../../store";
import { useShallow } from "zustand/shallow";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoMdCheckmark } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

enum TacheNom {
  DiagrammeCasUtilisation = "Diagramme de cas d’utilisation",
  DescriptionTextuelle = "Description Textuelle",
  DescriptionGraphique = "Description Graphique",
  DiagrammeClasseParticipative = "Diagramme de classe participative",
  IHM = "IHM",
  DiagrammeClasse = "Diagramme de classe",
  DiagrammeSequenceDetaille = "Diagramme de séquence détaillé",
  Developpement = "Developpement",
}

type Payload = {
  idB: number;
  idG: number;
  idS: number;
  tache: string;
  nom: string;
  titre: string;
  description: string;
  rapportUrl: string;
};

export type casPrpos = {
  nom: string;
};
export type tachePrpos = {
  nom: string;
};
type CasItem = {
  idCas: number;
  acteur: string;
  cas: string;
};
type TachItem = {
  idTach: number;
  tache: string;
  groupe: string;
};
export type CustomSelectGroupeProps = {
  responsable: CasItem[];
  label?: string;
};
export type CustomSelectTacheProps = {
  responsable: TachItem[];
  label: string;
  setTache: (tache: string) => void;
};

const allTaches: TachItem[] = [
  {
    idTach: 1,
    tache: "Diagramme de cas d’utilisation",
    groupe: "Étape 1 : Analyse (Spécification)",
  },
  {
    idTach: 2,
    tache: "Description Textuelle",
    groupe: "Étape 1 : Analyse (Spécification)",
  },
  {
    idTach: 3,
    tache: "Description Graphique",
    groupe: "Étape 1 : Analyse (Spécification)",
  },
  { idTach: 4, tache: "IHM", groupe: "Étape 1 : Analyse (Spécification)" },
  {
    idTach: 5,
    tache: "Diagramme de classe participative",
    groupe: "Étape 2 : Conception",
  },
  { idTach: 6, tache: "Diagramme de classe", groupe: "Étape 2 : Conception" },
  {
    idTach: 7,
    tache: "Diagramme de séquence détaillé",
    groupe: "Étape 2 : Conception",
  },
  { idTach: 8, tache: "Développement", groupe: "Étape 3 : Développement" },
];

const deposerRapportEtu = async ({
  payload,
  accessToken,
}: {
  payload: Payload;
  accessToken: string;
}) => {
  console.log("payload", payload);
  const response = await fetch(
    `http://localhost:4000/api/eutdaint/deposer-rapport`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ...payload }),
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("Server error:", error); // Optional: log error details
    throw new Error("Cannot update binome responsibility");
  }
  return response.json();
};
const getIdOfSujet = async ({
  idG,
  accessToken,
}: {
  idG: number;
  accessToken: string;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/responsable/sujet-groupe/${idG}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) throw new Error("Cannot fetch for get id of sujet groupe");
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

function CustomTacheSelect({
  responsable,
  label,
  setTache,
}: CustomSelectTacheProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dataResponsable, setDataResponsable] =
    useState<TachItem[]>(responsable);
  const [itemSelection, setItemSelection] = useState<TachItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (responsable.length > 0) {
      setDataResponsable(responsable);
      setItemSelection(responsable[0]);
    }
  }, [responsable, setTache]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.parentElement?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    const filtered = responsable.filter((item) => {
      // البحث باستخدام المفتاح في TacheNom
      const key = Object.keys(TacheNom).find((key) =>
        TacheNom[key as keyof typeof TacheNom].toLowerCase().includes(value)
      );
      return (
        key &&
        item.tache
          .toLowerCase()
          .includes(TacheNom[key as keyof typeof TacheNom].toLowerCase())
      );
    });
    setDataResponsable(filtered);
    setItemSelection(filtered.length > 0 ? filtered[0] : null);
  };

  const handleSelection = (item: TachItem) => {
    setItemSelection(item);
    setIsOpen(false);
    const key = Object.keys(TacheNom).find(
      (key) => TacheNom[key as keyof typeof TacheNom] === item.tache
    );
    setTache(key || ""); // إرسال المفتاح
  };

  const groupedData = dataResponsable.reduce((acc, item) => {
    if (!acc[item.groupe]) acc[item.groupe] = [];
    acc[item.groupe].push(item);
    return acc;
  }, {} as Record<string, TachItem[]>);

  return (
    <div className="custom-select-container w-full flex flex-col gap-1 text-[#09090B] py-1">
      <label className="text-md font-medium text-gray-900">{label}</label>
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4 pr-8"
          value={itemSelection?.tache || ""}
          onChange={handleChange}
          onClick={() => setIsOpen(!isOpen)}
          placeholder="Choisir un cas"
        />
        {isOpen ? (
          <FiChevronUp
            className="absolute top-1/2 right-2 text-xl cursor-pointer transform -translate-y-1/2"
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <FiChevronDown
            className="absolute top-1/2 right-2 text-xl cursor-pointer transform -translate-y-1/2"
            onClick={() => setIsOpen(true)}
          />
        )}

        {isOpen && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {Object.entries(groupedData).map(([groupLabel, items]) => (
              <li key={groupLabel}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-100">
                  {groupLabel}
                </div>
                {items.map((item) => (
                  <div
                    key={item.idTach}
                    className={`flex items-center gap-2 py-2 px-4 cursor-pointer hover:bg-[#F4F7FD] transition-all ${
                      itemSelection?.idTach === item.idTach
                        ? "bg-[#F4F7FD]"
                        : ""
                    }`}
                    onClick={() => handleSelection(item)}
                  >
                    <span>
                      {itemSelection?.idTach === item.idTach ? (
                        <IoMdCheckmark className="text-[#7CFC00]" />
                      ) : (
                        <span className="w-4 inline-block" />
                      )}
                    </span>
                    <span className="font-medium">{item.tache}</span>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const DeposerRapport = () => {
  const [isSucces, setIsSucces] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tache, setTache] = useState<string>("");
  const [nextStep, setNextStep] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    embedUrl: string;
  }>({
    url: "",
    embedUrl: "",
  });
  const [form, setForm] = useState<{ nom: string; description: string }>({
    nom: "",
    description: "",
  });
  const [openPicker] = useDrivePicker();

  const handlepickerOpen = () => {
    openPicker({
      clientId:
        "911473589234-p49ak2j28n8hupo850n7sb6u6tulqsdl.apps.googleusercontent.com",
      developerKey: "AIzaSyAVIGMYERgJVLRAYhMRH2noFJBvOyyV1qA",
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: (data) => {
        console.log(data);
        if (data.action === "picked") {
          setSelectedFile({
            embedUrl: data.docs[0].embedUrl,
            url: data.docs[0].url,
          });
        }
      },
    });
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const accessToken = useAuthStore((state) => state.accessToken);
  const { idB, idG, idS, setBinomeId, setGroupId, setSujetId } =
    useEtudiantStore(
      useShallow((state) => ({
        idG: state.idG,
        idB: state.idB,
        idS: state.idS,
        setBinomeId: state.setBinomeId,
        setGroupId: state.setGroupId,
        setSujetId: state.setSujetId,
      }))
    );

  const { data: dataEtudiant } = useQuery({
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
    if (dataEtudiant) {
      setBinomeId(dataEtudiant.idB);
      setGroupId(dataEtudiant.idG);
    }
  }, [dataEtudiant, setBinomeId, setGroupId]);

  const { data: sujetId } = useQuery({
    queryKey: ["sujet-id", idG],
    queryFn: () => getIdOfSujet({ accessToken: accessToken!, idG }),
    enabled: !!accessToken && idG !== -1,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (sujetId) {
      setSujetId(sujetId.idS);
    }
  }, [setSujetId, sujetId]);

  //    const { data: ListCasBinome } = useQuery({
  //     queryKey: ['Liste-Cas-binome', idB, accessToken],
  //     queryFn: () => getAllCasOfBinome({ accessToken: accessToken!, idB }),
  //     enabled: !!accessToken && idB !== -1,
  //     staleTime: 0,
  //     gcTime: 0
  // });

  const payload = {
    idB: idB,
    idG: idG,
    idS: idS,
    tache: tache,
    nom: form.nom,
    titre: form.nom,
    description: form.description,
    rapportUrl: selectedFile.url,
  };

  const { mutate } = useMutation({
    mutationKey: ["deposer-rapport", payload],
    mutationFn: ({
      payload,
      accessToken,
    }: {
      payload: Payload;
      accessToken: string;
    }) => deposerRapportEtu({ payload, accessToken: accessToken! }),
    onSuccess: () => {
      setTimeout(() => {
        setIsLoading(false);
        setIsSucces(true);
      }, 1000);
      setTimeout(() => {
        setIsSucces(false);
        setNextStep(false);
        setSelectedFile({ embedUrl: "", url: "" });
        setForm({ nom: "", description: "" });
        setTache("");
      }, 3000);
    },
    onError: (error) => {
      console.error("Error depositing report:", error);
    },
  });
  const handleSubmit = () => {
    setIsLoading(true);
    if (accessToken && payload) {
      mutate({ payload, accessToken: accessToken! });
    }
  };

  return (
    <section className="w-full h-svh py-8 flex flex-col items-center justify-center bg-[#F4F7FD]">
      {!nextStep && (
        <div className="bg-white w-xl px-6 py-10 rounded-md shadow border border-gray-100  ">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Déposer un Rapport
          </h2>
          <CustomTacheSelect
            responsable={allTaches}
            label="Veuillez sélectionner une tâche :"
            setTache={setTache}
          />
          {/* {ListCasBinome&&<CustomGroupSelect responsable={ListCasBinome} label="Veuillez sélectionner un cas :" />} */}
          <div className="py-4">
            <div
              className="flex flex-col items-center justify-center border border-dashed border-gray-400 p-4 rounded-lg  "
              onClick={handlepickerOpen}
            >
              <label className="cursor-pointer flex flex-col items-center space-y-2">
                <RiUploadCloud2Line className="w-10 h-10 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Cliquez pour télécharger le rapport
                </span>
                {selectedFile.url !== "" && (
                  <div className="text-sm  mt-2">
                    {" "}
                    <p className="text-green-600">
                      Le rapport a été téléchargé.
                    </p>{" "}
                  </div>
                )}
              </label>
            </div>

            {selectedFile.url !== "" && (
              <div className=" pt-2 w-full flex items-center justify-end">
                <a
                  href={selectedFile.embedUrl}
                  target="_blank"
                  className=" underline text-blue-500 font-medium"
                >
                  Voir rapport
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-x-6 mt-2 ">
            <button
              disabled={selectedFile.url === ""}
              className={`${
                selectedFile.url === ""
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } outline-none w-full bg-blue-500 hover:bg-blue-700 rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all `}
              onClick={() => {
                setNextStep(!nextStep);
              }}
            >
              Suivant
            </button>
            <button
              className=" outline-none w-full bg-red-500 hover:bg-red-700  rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer"
              onClick={() => setSelectedFile({ embedUrl: "", url: "" })}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
      {nextStep && (
        <div className="bg-white w-xl px-6 py-10 rounded-md shadow border border-gray-100  space-y-4">
          <div className="space-y-1">
            <label htmlFor="" className="block font-medium">
              titre du rapport
            </label>
            <input
              onChange={handleChange}
              value={form.nom}
              name="nom"
              type="text"
              placeholder="Entrez le titre  du rapport "
              className="w-full py-1.5 px-4 border border-gray-400 outline-none rounded-md placeholder:text-sm focus:border-2 focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              onChange={handleChange}
              value={form.description}
              name="description"
              placeholder="Écrire le contenu de la description ici ..."
              id="description"
              className="w-full px-4 py-2 border border-gray-400 outline-none rounded-md placeholder:text-sm focus:border-2 h-40 text-sm text-justify focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all"
            ></textarea>
          </div>
          <div className="flex items-center justify-center gap-x-6  ">
            <button
              className=" outline-none w-full bg-slate-500 hover:bg-slate-700  rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer"
              onClick={() => {
                setNextStep(!nextStep);
              }}
            >
              Prescdent
            </button>
            <button
              onClick={handleSubmit}
              className=" outline-none w-full bg-blue-500 hover:bg-blue-700 rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer"
            >
              {isLoading ? " Deposer..." : " Deposer"}
            </button>
          </div>
        </div>
      )}
      <div
        className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${
          isSucces ? "bottom-20" : "-bottom-40 hidden"
        } `}
      >
        <FaCheckCircle className=" text-green-500 text-3xl" />{" "}
        <p>L'etape et sont taches ont été affectés avec succès.</p>
      </div>
    </section>
  );
};

export default DeposerRapport;
