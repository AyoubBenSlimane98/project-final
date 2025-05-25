import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { useAuthStore, useGroupeStore } from "../../../../store";
import { CustomSelectGroupeProps, Groupe } from "../affection_cas/FirstStep";
import { useShallow } from "zustand/shallow";
import { FaCheckCircle } from "react-icons/fa";
const EtapeNom = ["Analyse", "Conception", "Developpement"];

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
type CustomSelectEtapeProps = {
  responsable: string[];
  label: string;
  setFromEtape: (formEtape: {
    etape: string;
    dateDebut: Date;
    dateFin: Date;
  }) => void;
};
function MultiSelectDropdown({
  setSlectionTaches,
  errorEtape,
}: {
  setSlectionTaches: (taches: string[]) => void;
  errorEtape: boolean;
}) {
  const [selected, setSelected] = useState<(keyof typeof TacheNom)[]>([]);
  const [open, setOpen] = useState(false);

  const handleSelect = (key: keyof typeof TacheNom) => {
    if (!selected.includes(key)) {
      setSelected([...selected, key]);
    }
  };

  const handleRemove = (key: keyof typeof TacheNom) => {
    setSelected(selected.filter((item) => item !== key));
  };

  const options = Object.keys(TacheNom) as (keyof typeof TacheNom)[];
  useEffect(() => {
    setSlectionTaches(selected);
  }, [selected, setSlectionTaches]);
  return (
    <div className="relative w-full mb-4">
      <div
        className={`${
          errorEtape ? "border-red-500" : "border-gray-300"
        } border  rounded-md p-2 cursor-pointer`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-2">
          {selected.map((key) => (
            <span
              key={key}
              className="bg-blue-200 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
            >
              {TacheNom[key]}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(key);
                }}
              >
                ✕
              </button>
            </span>
          ))}
          {selected.length === 0 && (
            <span className="text-gray-500 text-sm py-1">
              Sélectionner des tâches...
            </span>
          )}
        </div>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow">
          {options
            .filter((key) => !selected.includes(key))
            .map((key) => (
              <div
                key={key}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSelect(key)}
              >
                {TacheNom[key]}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

const createEtapeTache = async ({
  idS,
  payload,
  accessToken,
}: {
  idS: number;
  payload: {
    etape: {
      etape: string;
      dateDebut: string;
      dateFin: string;
    };
    taches: {
      tache: string;
      dateDebut: string;
      dateFin: string;
    }[];
  };
  accessToken: string;
}) => {
  console.log(idS, payload);
  const response = await fetch(
    `http://localhost:4000/api/responsable/etape-tache/${idS}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) throw new Error("Cannot fetch for get id of sujet groupe");
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
function CustomGroupSelect({ responsable, label }: CustomSelectGroupeProps) {
  const { groupe, setGroupe } = useGroupeStore(
    useShallow((state) => ({
      groupe: state.groupe,
      setGroupe: state.setGroupe,
    }))
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dataResponsable, setDataResponsable] = useState<Groupe[]>(responsable);
  const [itemSelection, setItemSelection] = useState<Groupe | null>();

  useEffect(() => {
    if (dataResponsable.length > 0 && groupe == -1) {
      setItemSelection(dataResponsable[0]);
      setGroupe(dataResponsable[0].idG);
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
    setGroupe(item.idG);
  };

  return (
    <div className="w-full flex flex-col  gap-2 text-[#09090B] py-1 ">
      <h2 className="block  text-md  text-gray-900">{label} </h2>
      <div className="relative  w-full">
        <div className="relative  mb-2">
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4"
            onChange={handleChange}
            value={
              itemSelection
                ? itemSelection.nom
                : dataResponsable.find((itm) => itm.idG === groupe)?.nom || ""
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
          <ul className="absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto">
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
function CustomEtapeSelect({
  responsable,
  label,
  setFromEtape,
}: CustomSelectEtapeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dataResponsable, setDataResponsable] = useState<string[]>(responsable);
  const [itemSelection, setItemSelection] = useState<string | null>(null);

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
      item.toLowerCase().includes(value)
    );
    setDataResponsable(filtered);
    if (filtered.length > 0) {
      setItemSelection(filtered[0]);
    } else {
      setItemSelection(null);
    }
  };

  const handleSelection = (item: string) => {
    setItemSelection(item);
    setIsOpen(false);
  };
  useEffect(() => {
    if (itemSelection) {
      setFromEtape({
        etape: itemSelection,
        dateDebut: new Date(),
        dateFin: new Date(),
      });
    }
  }, [itemSelection, setFromEtape]);
  return (
    <div className="w-full flex flex-col  gap-2 text-[#09090B] mb-4">
      <h2 className="block mb-2 text-md font-medium text-gray-900">{label}</h2>
      <div className="relative w-full">
        <div className="relative mb-2">
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4"
            onChange={handleChange}
            value={itemSelection || ""}
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
                  key={item}
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
                  <span className="font-medium">{item}</span>
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

const PrecicerEtapes = () => {
  const groupe = useGroupeStore(useShallow((state) => state.groupe));
  const [isSucces, setIsSucces] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [slectionTaches, setSlectionTaches] = useState<string[]>();
  const [errorDate, setErrorDate] = useState(false);
  const [errorEtapeDte, setErrorEtapeDate] = useState(false);
  const [errorEtape, setErrorEtape] = useState(false);
  const [isNext, setIsNext] = useState(true);

  const accessToken = useAuthStore((state) => state.accessToken);
  const [formEtape, setFormEtape] = useState<{
    etape: string;
    dateDebut: Date;
    dateFin: Date;
  }>({
    etape: "",
    dateDebut: new Date(),
    dateFin: new Date(),
  });

  const [formData, setFormData] = useState<
    Record<string, { dateDebut: string; dateFin: string }>
  >({});

  const handleChangeTache = (
    e: React.ChangeEvent<HTMLInputElement>,
    tache: string,
    type: "dateDebut" | "dateFin"
  ) => {
    const value = e.target.value;

    const updated = {
      ...formData[tache],
      [type]: value,
    };

    setFormData((prev) => ({
      ...prev,
      [tache]: updated,
    }));

    // Vérification des dates si les deux sont remplies
    if (updated.dateDebut && updated.dateFin) {
      const debut = new Date(updated.dateDebut);
      const fin = new Date(updated.dateFin);
      setErrorDate(fin < debut);
    }
  };

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
  const { data: idS } = useQuery({
    queryKey: ["sujet-id", groupe],
    queryFn: () => getIdOfSujet({ accessToken: accessToken!, idG: groupe }),
    enabled: !!accessToken && groupe !== -1,
    staleTime: 0,
    gcTime: 0,
  });

  const handleNext = () => {
    let hasError = false;

    if (!slectionTaches || slectionTaches.length === 0) {
      setErrorEtape(true);
      hasError = true;
    }

    if (formEtape.dateDebut > formEtape.dateFin) {
      setErrorEtapeDate(true);
      hasError = true;
    } else {
      setErrorEtapeDate(false);
    }

    if (hasError) return;

    setErrorDate(false);
    setErrorEtape(false);
    setIsNext(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormEtape((prev) => ({
      ...prev,
      [name]:
        name === "dateDebut" || name === "dateFin" ? new Date(value) : value,
    }));
  };

  const payload = {
    etape: {
      etape: formEtape.etape,
      dateDebut: formEtape.dateDebut.toISOString().split("T")[0],
      dateFin: formEtape.dateFin.toISOString().split("T")[0],
    },
    taches: Object.entries(formData).map(([key, value]) => ({
      tache: key,
      dateDebut: value.dateDebut,
      dateFin: value.dateFin,
    })),
  };

  const { mutate } = useMutation({
    mutationKey: ["createEtapeTache"],
    mutationFn: ({
      idS,
      payload,
      accessToken,
    }: {
      idS: number;
      payload: {
        etape: {
          etape: string;
          dateDebut: string;
          dateFin: string;
        };
        taches: {
          tache: string;
          dateDebut: string;
          dateFin: string;
        }[];
      };
      accessToken: string;
    }) =>
      createEtapeTache({
        idS: idS,
        payload,
        accessToken: accessToken!,
      }),
    onSuccess: () => {
      setIsLoading(false);
      setIsSucces(true);
      setTimeout(() => {
        //////////////////////////////////////////////////////////////
        setSlectionTaches([]);
        setIsSucces(false);
        setIsNext(!isNext);
        setFormEtape({
          etape: "",
          dateDebut: new Date(),
          dateFin: new Date(),
        });
      }, 3000);
    },
  });

  const handleSubmit = () => {
    setIsLoading(true);
    if (idS && accessToken && payload && slectionTaches) {
      mutate({
        idS: idS.idS,
        payload: payload,
        accessToken: accessToken!,
      });
    }
  };

  return (
    <section className="w-full min-h-screen px-6 pb-10 flex flex-col justify-center items-center gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-hidden bg-[#F4F7FD] relative">
      {isNext ? (
        <div className="px-6 py-10 w-3xl bg-white rounded-lg shadow-md">
          {groupes && (
            <CustomGroupSelect
              responsable={groupes}
              label="Selection un groupe : "
            />
          )}
          <CustomEtapeSelect
            responsable={EtapeNom}
            label="Sélectionner une étape"
            setFromEtape={setFormEtape}
          />
          <MultiSelectDropdown
            setSlectionTaches={setSlectionTaches}
            errorEtape={errorEtape}
          />
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="basis-1/2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="date"
              >
                Date Début
              </label>
              <input
                id="dateDebut"
                name="dateDebut"
                value={formEtape.dateDebut.toISOString().split("T")[0]}
                type="date"
                onChange={handleChange}
                className={`bg-gray-50 border  rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 w-full ${
                  errorEtapeDte ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div className="basis-1/2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="date"
              >
                Date Fin
              </label>
              <input
                id="dateFin"
                name="dateFin"
                type="date"
                value={formEtape.dateFin.toISOString().split("T")[0]}
                onChange={handleChange}
                className={`bg-gray-50 border  rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 w-full ${
                  errorEtapeDte ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-center gap-x-6">
            <button
              onClick={handleNext}
              type="button"
              className="outline-none basis-1/2 border-none bg-green-500 hover:bg-green-600 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
            >
              Suivant
            </button>
            <button
              // onClick={restAll}
              type="button"
              className="outline-none basis-1/2 border-none bg-red-500 hover:bg-red-700 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="px-6 mt-24 mb-12  py-10 w-4xl  bg-white rounded-lg shadow-md ">
          {slectionTaches?.map((tache) => (
            <div
              key={tache}
              className="flex flex-col gap-2 mb-2 border-b border-gray-300 pb-2"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {TacheNom[tache as keyof typeof TacheNom]}
              </h3>
              <div className="flex gap-4 mb-6">
                <div className="basis-1/2">
                  <label
                    className="block text-sm font-bold text-gray-700 mb-2"
                    htmlFor={`dateDebut-${tache}`}
                  >
                    Date Début
                  </label>
                  <input
                    type="date"
                    id={`dateDebut-${tache}`}
                    value={formData[tache]?.dateDebut || ""}
                    onChange={(e) => handleChangeTache(e, tache, "dateDebut")}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-900 border ${
                      errorDate ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                <div className="basis-1/2">
                  <label
                    className="block text-sm font-bold text-gray-700 mb-2"
                    htmlFor={`dateFin-${tache}`}
                  >
                    Date Fin
                  </label>
                  <input
                    type="date"
                    id={`dateFin-${tache}`}
                    value={formData[tache]?.dateFin || ""}
                    onChange={(e) => handleChangeTache(e, tache, "dateFin")}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-900 border ${
                      errorDate ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="w-full mt-6 flex items-center justify-center gap-x-6">
            <button
              onClick={() => setIsNext(true)}
              type="button"
              className="basis-1/2 bg-gray-400 hover:bg-gray-700 text-white rounded-md py-3 font-medium cursor-pointer"
            >
              Precdent
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              className="basis-1/2 bg-green-500 hover:bg-green-600 text-white rounded-md py-3 font-medium cursor-pointer"
            >
              {isLoading ? " Ajouter..." : " Ajouter"}
            </button>
          </div>
        </div>
      )}
      <div
        className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${
          isSucces ? "bottom-40" : "-bottom-40 hidden"
        } `}
      >
        <FaCheckCircle className=" text-green-500 text-3xl" />{" "}
        <p>le rapport ont été depose avec succès.</p>
      </div>
    </section>
  );
};

export default PrecicerEtapes;
