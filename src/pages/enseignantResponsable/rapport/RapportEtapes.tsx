import { useQuery } from "@tanstack/react-query";
import { useAuthStore, useGroupeStore } from "../../../store";
import { IoMdCheckmark } from "react-icons/io";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { ChangeEvent, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

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

const getRapportEtapeGroupe = async ({
  idG,
  etape,
  accessToken,
}: {
  idG: number;
  etape: string;
  accessToken: string;
}) => {
  console.log({
    idG,
    etape,
    accessToken,
  });
  const response = await fetch(
    `http://localhost:4000/api/responsable/etape?idG=${idG}&etape=${etape}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("API Error:", response.status, error);
    throw new Error(
      error?.message || "Cannot fetch for get groupes of responsable"
    );
  }
  return response.json();
};
export type Groupe = {
  idG: number;
  nom: string;
};
export type CustomSelectGroupeProps = {
  responsable: Groupe[];
  label: string;
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
    <div className="w-full flex items-center justify-between gap-2 text-[#09090B] ">
      <h2 className="block mb-2 text-md font-medium text-gray-900">{label} </h2>
      <div className="relative w-xl ">
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

const EtapeNom = ["Analyse", "Conception", "Developpement"];

type CustomSelectEtapeProps = {
  responsable: string[];
  label: string;
  setEtape: (etape: string) => void;
};
function CustomEtapeSelect({
  responsable,
  label,
  setEtape,
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
      setEtape(itemSelection);
    }
  }, [itemSelection, setEtape]);
  return (
    <div className="w-full flex items-center justify-between gap-2 text-[#09090B] mb-4">
      <h2 className="block mb-2 text-md font-medium text-gray-900">{label}</h2>
      <div className="relative w-xl">
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

export type RapportFinalProps = {
  rapportInfo: {
    titre: string;
    idR: number;
    createdAt: string;
  };
  latestVersion: {
    description: string;
    lien: string;
    updatedAt: string;
  };
  binomeEtudiant: {
    nom: string;
    prenom: string;
  }[];
};

const RapportFinalCard = ({
  rapportInfo,
  latestVersion,
  binomeEtudiant,
}: RapportFinalProps) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        📄 <span>Rapport</span>
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">📘 Titre</h3>
          <p className="text-gray-700">{rapportInfo.titre}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            📝 Description
          </h3>
          <p className="text-gray-600">{latestVersion.description}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            👥 Binôme Responsable
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {binomeEtudiant.map((item, index) => (
              <li key={index}>
                {item.nom} {item.prenom}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <a
            href={latestVersion.lien}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            📂 Ouvrir le rapport
          </a>
          <span className="text-sm text-gray-500">
            Mis à jour le{" "}
            {new Date(latestVersion.updatedAt).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            à{" "}
            {new Date(latestVersion.updatedAt).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
const RapportEtapes = () => {
  const { groupe } = useGroupeStore(
    useShallow((state) => ({
      groupe: state.groupe,
    }))
  );
  const [etape, setEtape] = useState<string>("");
  const [responsabilteBinome, setResponsabilte] = useState<string>("");
  const accessToken = useAuthStore((state) => state.accessToken);
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

  useEffect(() => {
    let responsabilite: "chapter_1" | "chapter_2" | "chapter_3" | "";

    switch (etape) {
      case "Analyse":
        responsabilite = "chapter_1";
        break;
      case "Conception":
        responsabilite = "chapter_2";
        break;
      case "Developpement":
        responsabilite = "chapter_3";
        break;
      default:
        responsabilite = "";
    }

    setResponsabilte(responsabilite);
  }, [etape]);
  const {
    data: rapportData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rapportEtape", groupe, etape],
    queryFn: () =>
      getRapportEtapeGroupe({
        idG: groupe!,
        etape: responsabilteBinome,
        accessToken: accessToken!,
      }),
    enabled: !!accessToken && !!responsabilteBinome && groupe !== -1,
  });

  return (
    <section className="flex flex-col items-center gap-y-6 pt-6 w-full h-svh mx-auto  px-12 mt-20 overflow-hidden ">
      {groupes && (
        <CustomGroupSelect
          responsable={groupes}
          label="Veuillez sélectionner un groupe : "
        />
      )}
      <CustomEtapeSelect
        responsable={EtapeNom}
        label="Veuillez sélectionner une étape : "
        setEtape={setEtape}
      />
      <div className="py-8 bg-gray-100  w-full">
        {isLoading && <p className="text-center mt-10">Chargement...</p>}
        {isError && (
          <p className="text-center text-gray-500 mt-10">
            accoun rapport {etape} exsit for this groupe
          </p>
        )}
        {rapportData && <RapportFinalCard {...rapportData} />}
      </div>
    </section>
  );
};

export default RapportEtapes;
