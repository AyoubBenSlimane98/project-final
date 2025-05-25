import { ChangeEvent, useEffect, useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useAuthStore, useEtudiantStore } from "../../../store";
import { useShallow } from "zustand/shallow";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import { useMemo } from "react";
type EtapeType = {
  idEtape: number;
  nom: string;
};

type Payload = {
  idB: number;
  idEtape: number;
  titre: string;
  description: string;
  rapportUrl: string;
};

export type CustomSelectEtpeProps = {
  responsable: EtapeType[];
  label: string;
  setEtapeId: (id: number) => void;
};

const getAllEtapesOfGroupe = async ({
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
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("Server error:", error);
    throw new Error("Cannot get Etape of groupe");
  }
  return response.json();
};

const DeposerRapportEtapeGroupe = async ({
  payload,
  accessToken,
}: {
  payload: Payload;
  accessToken: string;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/eutdaint/deposer-rapport-etape`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("Server error:", error);
    throw new Error("Cannot update binome responsibility");
  }
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

const DeposerRapportEtape = () => {
  const [chapterName, setChapterName] = useState("");
  const [isSucces, setIsSucces] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const [nextStep, setNextStep] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    embedUrl: string;
  }>({
    url: "",
    embedUrl: "",
  });
  const [form, setForm] = useState<{ titre: string; description: string }>({
    titre: "",
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
  const { idB, idG, setBinomeId, setGroupId } = useEtudiantStore(
    useShallow((state) => ({
      idG: state.idG,
      idB: state.idB,
      setBinomeId: state.setBinomeId,
      setGroupId: state.setGroupId,
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

  const payload = useMemo(
    () => ({
      idB: idB,
      idEtape: -1,
      titre: form.titre,
      description: form.description,
      rapportUrl: selectedFile.url,
    }),
    [idB, form.titre, form.description, selectedFile.url]
  );

  useEffect(() => {
    if (dataEtudiant) {
      setBinomeId(dataEtudiant.idB);
      payload.idEtape = dataEtudiant.idEtape;
      setGroupId(dataEtudiant.idG);
      console.log(dataEtudiant);
    }
  }, [dataEtudiant, payload, setBinomeId, setGroupId]);
  const { data: etapesGroupe } = useQuery({
    queryKey: ["etpes", idG],
    queryFn: () => getAllEtapesOfGroupe({ accessToken: accessToken!, idG }),
    enabled: !!accessToken && idG !== -1,
    staleTime: 0,
    gcTime: 0,
  });
  const { mutate } = useMutation({
    mutationKey: ["deposer-rapport-etape", payload],
    mutationFn: ({
      payload,
      accessToken,
    }: {
      payload: Payload;
      accessToken: string;
    }) => DeposerRapportEtapeGroupe({ payload, accessToken: accessToken! }),
    onSuccess: () => {
      setTimeout(() => {
        setIsLoading(false);
        setIsSucces(true);
      }, 1000);
      setTimeout(() => {
        setIsSucces(false);
        setNextStep(false);
        setSelectedFile({ embedUrl: "", url: "" });
        setForm({ titre: "", description: "" });
      }, 3000);
    },
    onError: (error) => {
      console.error("Error depositing report:", error);
    },
  });

  const handleSubmit = () => {
    setIsLoading(true);
    if (accessToken && payload) {
      if (idB !== -1) {
        mutate({ payload, accessToken: accessToken! });
      }
    }
  };

  const [data, setData] = useState<EtapeType[]>([]);

  useEffect(() => {
    const responsabilite = dataEtudiant?.responsabilite;
    let filteredEtapes: EtapeType[] = etapesGroupe || [];

    switch (responsabilite) {
      case "chapter_1":
        setChapterName("Chapter 1");
        filteredEtapes = filteredEtapes.filter(
          (etape: EtapeType) => etape.nom === "Analyse"
        );
        break;

      case "chapter_2":
        setChapterName("Chapter 2");
        filteredEtapes = filteredEtapes.filter(
          (etape: EtapeType) => etape.nom === "Conception"
        );
        break;

      case "chapter_3":
        setChapterName("Chapter 3");
        filteredEtapes = filteredEtapes.filter(
          (etape: EtapeType) => etape.nom === "Developpement"
        );
        break;
      default:
        break;
    }

    setData(filteredEtapes);
  }, [dataEtudiant?.responsabilite, etapesGroupe]);

  return (
    <section className="w-full h-svh py-8 flex flex-col items-center justify-center bg-[#F4F7FD]">
      {!nextStep && (
        <div className="bg-white w-xl px-6 py-10 rounded-md shadow border border-gray-100  ">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Déposer rapport{" "}
            <span className="px-2 text-teal-600 first-letter:uppercase">
              {" "}
              {chapterName}
            </span>
          </h2>

          {dataEtudiant?.responsabilite !== "introduction_resume_conclustion" &&
            data.length > 0 && (
              <input
                readOnly
                type="text"
                value={data[0].nom}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4 cursor-pointer"
              />
            )}

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
                    <p className="text-green-600">
                      Le rapport a été téléchargé.
                    </p>
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
              value={form.titre}
              name="titre"
              type="text"
              placeholder="Entrez le titre du rapport"
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
              Précédent
            </button>
            <button
              onClick={handleSubmit}
              className=" outline-none w-full bg-blue-500 hover:bg-blue-700 rounded-md py-2.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer"
            >
              {isLoading ? "Déposer..." : "Déposer"}
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
        <p>L'étape et son rapport ont été déposés avec succès.</p>
      </div>
    </section>
  );
};

export default DeposerRapportEtape;
