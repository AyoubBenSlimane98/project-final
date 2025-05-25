import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store";

import { useMutation, useQuery } from "@tanstack/react-query";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

interface Rapport {
  nom: string;
  lien: string | null;
}
interface Payload {
  responsabilite: string;
  idG: number;
  description: string;
}
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
const groupeSujet = async ({
  accessToken,
  idG,
}: {
  accessToken: string;
  idG: number;
}) => {
  const response = await fetch(
    `http://localhost:4000/api/eutdaint/groupe-sujet/${idG}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok)
    throw new Error("Cannot fetch data for get all rapport of chapiter!");
  return response.json();
};
const createFeedBack = async ({
  accessToken,
  payload,
}: {
  accessToken: string;
  payload: Payload;
}) => {
  const response = await fetch(`http://localhost:4000/api/eutdaint/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok)
    throw new Error("Cannot fetch data for get all rapport of chapiter!");
  return response.json();
};
const RapportList = ({ dataRapport }: { dataRapport: Rapport[] }) => {
  const [rapports] = useState<Rapport[]>(dataRapport);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<string | null>(null);

  //   if (loading) return <div className="text-gray-500">Loading...</div>;
  //   if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Rapports par Chapitre</h2>
      <ul className="space-y-4">
        {rapports.map((rapport, index) => (
          <li
            key={index}
            className="border border-gray-300 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg">
                {rapport.nom === "Analyse"
                  ? "Chapiter 1"
                  : rapport.nom === "Conception"
                  ? "Chapiter 2"
                  : "Chapiter 3"}
              </span>
              {rapport.lien ? (
                <a
                  href={rapport.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Voir le rapport
                </a>
              ) : (
                <span className="text-gray-400 italic">Aucun lien</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ConsulterRapportEtapes = () => {
  const payload = {
    responsabilite: "",
    idG: -1,
    description: "",
  };
  const [isSucces, setIsSucces] = useState<boolean>(false);
  const [selectedChapter, setSelectedChapter] = useState<string>("chapter_1");
  const [description, setDescription] = useState<string>("");
  const accessToken = useAuthStore((state) => state.accessToken);
  const [groupId, setGroupId] = useState(-1);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setGroupId(dataEtudiant.idG);
    }
  }, [dataEtudiant, setGroupId]);
  const { data: dataRapport } = useQuery({
    queryKey: ["dataEtudiant", accessToken, groupId],
    queryFn: async () => {
      if (accessToken === undefined) throw new Error("accessToken not found");
      return await groupeSujet({ accessToken, idG: groupId });
    },
    enabled: !!accessToken && groupId !== -1,
    staleTime: 0,
    gcTime: 0,
  });

  const { mutate } = useMutation({
    mutationFn: ({
      payload,
      accessToken,
    }: {
      payload: Payload;
      accessToken: string;
    }) =>
      createFeedBack({
        payload,
        accessToken,
      }),
    onSuccess: () => {
      setTimeout(() => {
        setIsLoading(false);
        setIsSucces(true);
      }, 2000);
      setTimeout(() => {
        setIsSucces(false);
        setOpen(false);
      }, 4000);
    },
    onError: (error) => {
      setTimeout(() => {
        setIsLoading(false);
        setOpen(false);
      }, 2000);
      console.warn("feedback: ", error.message);
    },
  });
  const handleSend = () => {
    payload.description = description;
    payload.responsabilite = selectedChapter;
    payload.idG = groupId;
    setIsLoading(true);
    if (accessToken && groupId !== -1) {
      mutate({ payload, accessToken });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 mt-20">
      <div className="w-full flex justify-end mb-6">
        <button
          className="px-4 py-3 flex items-center gap-2 rounded bg-blue-600 text-white text-sm text-nowrap cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <IoMdAdd className="text-xl" />
          Add FeedBack
        </button>
      </div>
      {dataRapport && <RapportList dataRapport={dataRapport} />}
      {open && (
        <section className="absolute top-0 left-0 w-full h-svh bg-black/45 z-30 flex justify-center items-center">
          <div className="w-xl bg-white border  border-gray-200 rounded-md mt-20 flex flex-col items-center gap-4 py-10 px-8  relative">
            <div className="mb-2">
              <IoClose
                className="text-2xl text-gray-400 absolute right-4 top-5 hover:text-red-500 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full border  border-gray-400 rounded py-2 px-2 "
            >
              <option value="chapter_1">chapiter 1</option>
              <option value="chapter_2">chapiter 2</option>
              <option value="chapter_3">chapiter 3</option>
            </select>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border  border-gray-400 rounded py-2 px-4 "
              placeholder="type somthing..."
            ></textarea>
            <button
              onClick={handleSend}
              className="w-full rounded-xl py-1.5 border border-gray-300  bg-gray-100 hover:bg-black hover:text-white transition duration-150 ease-in-out cursor-pointer "
            >
              {isLoading ? "Send ..." : "Send"}
            </button>
          </div>
          <div
            className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${
              isSucces ? "bottom-20" : "-bottom-40 hidden"
            } `}
          >
            <FaCheckCircle className=" text-green-500 text-3xl" />{" "}
            <p>L'etape et sont taches ont été affectés avec succès.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ConsulterRapportEtapes;
