import { ChangeEvent, useContext, useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { QuestionContext } from "../../../context";
import { useAuthStore, useGroupeStore } from "../../../store";
import { useShallow } from "zustand/shallow";
import { CustomSelectGroupeProps, Groupe } from "../../enseignantPrincipale/listeGroupe/EditerGroupes";
import { useMutation, useQuery } from "@tanstack/react-query";



export type Question = {
  idQ: number;
  question: string;
  reponse: string | null;
  etat: "attandre" | string;
};

type User = {
  idU: number;
  user: {
    image: string | null;
    bio: string;
  };
  Question: Question[];
};

type ResponseData = {
  data: User[];
};
//-------------------------------------------------------------------------------------------------------
const getAllGroupesOfResponsable = async ({
  enseignantId,
  accessToken,
}: {
  enseignantId: number;
  accessToken: string;
}) => {
  const response = await fetch(`http://localhost:4000/api/responsable/groupe-responsable/${enseignantId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Cannot fetch for get groupes of responsable");
  return response.json();
};
const repondreQuestions = async ({
  data,
  accessToken,
}: {
  data: { idQ: number; reponse: string };
  accessToken: string;
}) => {
  console.log("test Data : ", data, accessToken)
  const response = await fetch("http://localhost:4000/api/responsable/repondre", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to respond to the question");
  return response.json();
};
const bloquerQuestion = async ({
  idQ,
  accessToken,
}: {
  idQ: number;
  accessToken: string;
}) => {
  const response = await fetch(`http://localhost:4000/api/responsable/bloquer/${idQ}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throw new Error("Failed to block the question");
  return response.json();
};
const getAllQuestionSendToResponsable = async ({
  enseignantId,
  accessToken,
  groupeId
}: {
  groupeId: number,
  enseignantId: number;
  accessToken: string;
}) => {
  const response = await fetch(`http://localhost:4000/api/responsable/groupe?groupeId=${groupeId}&enseignantId=${enseignantId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Cannot fetch groups for responsable");
  return response.json();
};

const getResponsableId = async (accessToken: string) => {
  const response = await fetch(`http://localhost:4000/api/responsable/enseignant`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Cannot fetch responsable ID");
  return response.json();
};
//-------------------------------------------------------------------------------------------------------

type CardQuestionProps = {
  question: {
    idQ: number;
    question: string;
    reponse: string | null;
    etat: string;
  };
  bio: string;
  image: string | null;
};

function CardQuestion({ question, bio, image }: CardQuestionProps) {
  const context = useContext(QuestionContext);
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 border border-gray-200  rounded-md items-center hover:bg-slate-50 md:p-4 hover:rounded hover:shadow transition-all duration-300 ease-in-out cursor-pointer">
      <div className="flex gap-4 items-center w-full mb-2">
        <img
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://scontent.fczl2-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeF_OWSBlL4_ahZGK8uktg7YWt9TLzuBU1Ba31MvO4FTUAcNr-rcAk0Q6wgee_n1MVfJVXKEYXEpVc_A8npzsuDs&_nc_ohc=pCF_EXqQ5MYQ7kNvwGqbQH8&_nc_oc=AdmOQDv_qA9yPoDAQK2j4m8cM77HYt2osPaGYZiWQNIR41-_Kkg1lN_m_n79WacUl90&_nc_zt=24&_nc_ht=scontent.fczl2-2.fna&oh=00_AfEfE4VyUFM1gD2VkajBmRMamhtVSp2NpcihUNDqLsAtzg&oe=681B903A';
          }}
          src={`http://localhost:4000/${image}`}
          alt="User"
          className="w-12 h-12 rounded-full object-cover"
          loading="lazy"
        />
        <div className="flex flex-col space-y-1 w-full">
          <span className="font-medium">{bio}</span>
          <p className="text-gray-800 text-sm break-words">{question.question || "Question vide"}</p>
        </div>
      </div>
      <div className="ml-4 flex items-center space-x-4">
        <button disabled className="border sm:text-sm sm:text-nowrap border-gray-400 rounded-full px-4 py-1.5 bg-slate-50">
          {question.etat}
        </button>
        <button className="border-none outline-none text-sm rounded-md px-4 py-1.5 bg-black text-white" onClick={(e) => {
          e.stopPropagation();
          context?.setSelectedQuestion(question);
        }}>
          Répondre
        </button>
      </div>
    </div>
  );
}

//-------------------------------------------------------------------------------------------------------

function RepondreQuestion({ refetch }: { refetch: () => void }) {
  const context = useContext(QuestionContext);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [reponse, setReponse] = useState("");
  const [isReponde, setIsReponde] = useState(false);
  const [isReject, setIsReject] = useState(false);

  const { mutate: submitReponse } = useMutation({
    mutationFn: ({
      data,
      accessToken,
    }: {
      data: { idQ: number; reponse: string };
      accessToken: string;
    }) => repondreQuestions({ data, accessToken }),
    onSuccess: () => {
      setIsReponde(true)

      setTimeout(() => {
        context?.setSelectedQuestion(null);
        refetch()
        setIsReponde(false)
      }, 2000)

    },
  });



  const { mutate: blockReponse } = useMutation({
    mutationFn: ({
      idQ,
      accessToken,
    }: {
      idQ: number;
      accessToken: string;
    }) => bloquerQuestion({ idQ, accessToken }),
    onSuccess: () => {
      setIsReject(true)
      setTimeout(() => {
        context?.setSelectedQuestion(null);
        refetch()
        setIsReject(false)
      }, 2000)
    },
  });
  if (!context?.selectedQuestion) return null;

  const handleRepondre = () => {
    if (reponse.trim() && accessToken && context.selectedQuestion?.idQ !== undefined) {
      submitReponse({ data: { idQ: context.selectedQuestion.idQ, reponse }, accessToken });

    }
  };
  const handleRejeter = () => {
    if (accessToken && context.selectedQuestion?.idQ !== undefined) {
      blockReponse({ idQ: context.selectedQuestion?.idQ, accessToken });

    }
  };
  return (
    <div className="border border-gray-200 shadow-2xl px-6 py-4 flex flex-col gap-y-4 rounded-md w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
        onClick={() => context.setSelectedQuestion(null)}
      >
        <FiX size={20} />
      </button>
      <h3 className="text-xl font-medium mb-1">Question</h3>
      <p className="text-gray-800">{context.selectedQuestion.question}</p>
      <textarea
        onChange={(e) => setReponse(e.target.value)}
        placeholder="Tapez votre réponse ici..."
        className="w-full border border-gray-200 h-20 outline-none p-2"
      ></textarea>
      <div className="flex items-center gap-4">
        <button
          onClick={handleRepondre}
          className="bg-gray-950 text-white px-4 py-2 rounded-md flex items-center gap-2 w-40 justify-center"
        >
          <IoMdCheckmark />
          {isReponde ? "  Approuver..." : "  Approuver"}
        </button>
        <button
          onClick={handleRejeter}
          className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 w-40 justify-center"
        >
          <FiX />
          {isReject ? "Rejeter..." : "Rejeter"}
        </button>
      </div>
    </div>
  );
}
//-------------------------------------------------------------------------------------------------------

function BodyQuestion(data: ResponseData) {
  return (
    <div className="w-full sm:space-y-6 md:space-y-4 h-[600px] border border-gray-200 rounded-sm shadow p-4 overflow-auto">
      {data.data.flatMap((user) =>
        user.Question.map((q) => (
          <CardQuestion key={q.idQ} question={q} bio={user.user.bio} image={user.user.image} />
        ))
      )}
    </div>
  );
}

//-------------------------------------------------------------------------------------------------------
function CustomGroupSelect({ responsable }: CustomSelectGroupeProps) {
  const { groupe, setGroupe } = useGroupeStore(useShallow((state) => ({
    groupe: state.groupe,
    setGroupe: state.setGroupe
  })))
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dataResponsable, setDataResponsable] = useState<Groupe[]>(responsable);
  const [itemSelection, setItemSelection] = useState<Groupe | null>();

  useEffect(() => {
    if (dataResponsable.length > 0 && groupe == -1) {
      setItemSelection(dataResponsable[0])
      setGroupe(dataResponsable[0].idG)
    }
  }, [dataResponsable, setGroupe, groupe])
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filtered = responsable.filter((item) => item.nom.toLowerCase().includes(value.toLowerCase()));

    setDataResponsable(filtered);
    setItemSelection(filtered.length > 0 ? filtered[0] : null);
  };

  const handleSelection = (item: Groupe) => {
    setItemSelection(item);
    setIsOpen(false);
    setGroupe(item.idG)
  };

  return (
    <div className='w-full flex items-center gap-2 text-[#09090B] py-1 ' >
      <div className='relative w-full '>
        <div className='relative  mb-2'>
          <input
            type="text"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
            onChange={handleChange}
            value={
              itemSelection
                ? itemSelection.nom
                : dataResponsable.find((itm) => itm.idG === groupe)?.nom || ''
            }
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen ? (
            <FiChevronUp className='absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(false)} />
          ) : (
            <FiChevronDown className='absolute top-1/2  right-0 text-xl cursor-pointer  -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(true)} />
          )}
        </div>

        {isOpen && (
          <ul className='absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto'>
            {dataResponsable.length > 0 ? (
              dataResponsable.map((item) => (
                <li
                  key={item.idG}
                  className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${itemSelection?.idG === item.idG ? "bg-[#F4F7FD]" : ""} transform duration-300 ease-in-out transition-all`}
                  onClick={() => handleSelection(item)}
                >
                  <span>{itemSelection?.idG === item.idG ? <IoMdCheckmark className='text-sm text-[#7CFC00] ' /> : <p className='w-3.5'></p>}</span>
                  <span className='font-medium'>{item.nom} </span>
                </li>
              ))
            ) : (
              <li className='py-1 px-2.5 text-gray-500'>Aucun résultat trouvé</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
const Question = () => {
  const groupe = useGroupeStore((state) => state.groupe);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const { data: responsableId } = useQuery({
    queryKey: ['responsable'],
    queryFn: () => getResponsableId(accessToken!),
    enabled: !!accessToken,
  });

  const { data: groupes } = useQuery({
    queryKey: ['groupes', responsableId],
    queryFn: () =>
      getAllGroupesOfResponsable({
        enseignantId: responsableId!, accessToken: accessToken!
      }),
    enabled: !!accessToken && !!responsableId,
  });

  const { data: questionGroupes, isLoading, refetch } = useQuery({
    queryKey: ['groupes', responsableId, groupe],
    queryFn: () => getAllQuestionSendToResponsable({
      enseignantId: responsableId!,
      accessToken: accessToken!,
      groupeId: groupe
    }),
    enabled: !!accessToken && !!responsableId && groupe !== -1,
    staleTime: 0,
    gcTime: 0
  });

  console.log("test Data : ", questionGroupes, "Groupe : ", groupe)

  return (
    <QuestionContext.Provider value={{ selectedQuestion, setSelectedQuestion }}>
      <section className="w-full p-6 mt-20 h-full sm:h-svh relative overflow-hidden">
        <div className="w-full  flex items-center justify-between py-4">
          <h2 className="w-1/2 font-medium text-2xl mb-6">Consulter les Questions & Réponses</h2>
          <div className="w-1/2">{groupes && <CustomGroupSelect responsable={groupes} />}</div>
        </div>
        {selectedQuestion && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[96%] shadow-lg bg-white rounded-lg z-[9998]">
            <RepondreQuestion refetch={refetch} />
          </div>
        )}
        <div className={`w-full ${selectedQuestion ? 'opacity-10' : 'opacity-100'}`}>
          {isLoading && <div className="w-full h-96 flex items-center justify-center"> <p>Chargement des données...</p> </div>}
          {!isLoading && (!questionGroupes || questionGroupes.data.length === 0) && (
            <div className="w-full h-96 flex items-center justify-center">
              <p className="text-center text-gray-500 mt-40">Aucune question trouvée pour ce groupe.</p>
            </div>
          )}


          {!isLoading && questionGroupes && questionGroupes.data.length > 0 && (
            <BodyQuestion data={questionGroupes.data} />
          )}
        </div>


      </section>
    </QuestionContext.Provider>
  );
};

export default Question;
