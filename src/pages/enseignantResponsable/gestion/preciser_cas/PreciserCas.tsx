import { ChangeEvent, useEffect, useState } from "react";
import { useAuthStore, useCasStore, useGroupeStore } from "../../../../store";
import { useShallow } from "zustand/shallow";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import {
  CustomSelectGroupeProps,
  Groupe,
} from "../../consultation/GroupeBinome";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MdAddLink } from "react-icons/md";
import { RiDeleteBin5Fill, RiSave3Line } from "react-icons/ri";
import { FaCheckCircle, FaUserEdit } from "react-icons/fa";
type Data = {
  acteur: string;
  cas: string[];
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
const setCasOfSujet = async ({
  idG,
  accessToken,
  data,
}: {
  idG: number;
  accessToken: string;
  data: Data;
}) => {
  console.log(data, idG, accessToken);
  const response = await fetch(
    `http://localhost:4000/api/responsable/set-cas/${idG}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Cannot fetch for get set Cas  of sujet");
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
function CardInfoRef({ name }: { name: string }) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleEdit = () => {
    setIsEdit((prev) => !prev);
  };
  const { updateCas, deleteCas } = useCasStore(
    useShallow((state) => ({
      updateCas: state.updateCas,
      deleteCas: state.deleteCas,
    }))
  );
  const [input, setInput] = useState<string>(name);
  return (
    <div className="bg-white shadow border outline-none border-gray-200 w-full px-1 py-1.5 flex items-center justify-between gap-5 rounded-md transform duration-200 ease-in-out transition-all cursor-pointer">
      <input
        type="text"
        value={input}
        name={name}
        className={`py-1.5 w-full px-2 text-sm text-wrap ${
          isEdit ? "border border-blue-600 rounded-md" : ""
        }`}
        disabled={!isEdit}
        onChange={(event) => setInput(event.target.value)}
      />
      <div className="flex items-center gap-3 px-2">
        {isEdit ? (
          <RiSave3Line
            className="text-green-600"
            onClick={() => {
              handleEdit();
              updateCas(name, input);
            }}
          />
        ) : (
          <FaUserEdit className="text-blue-600" onClick={handleEdit} />
        )}
        <RiDeleteBin5Fill
          className="text-red-600"
          onClick={() => deleteCas(name)}
        />
      </div>
    </div>
  );
}
const PreciserCas = () => {
  const groupe = useGroupeStore(useShallow((state) => state.groupe));
  const { allCas, createCas, next, setNext, actor, setActor, restAll } =
    useCasStore(
      useShallow((state) => ({
        allCas: state.allCas,
        createCas: state.createCas,
        next: state.next,
        setNext: state.setNext,
        actor: state.actor,
        setActor: state.setActor,
        restAll: state.resetAll,
      }))
    );
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isSucces, setIsSucces] = useState<boolean>(false);
  const [errorActor, setErrorActor] = useState(false);
  const [errorCas, setErrorCas] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cas, setCas] = useState<string | undefined>();
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
  const handleNext = () => {
    if (groupe !== -1 && actor) {
      setNext(false);
    } else {
      setErrorActor(true);
    }
  };
  const hanleCas = (cas: string) => {
    if (!allCas.includes(cas)) {
      createCas(cas);
      setCas("");
    } else {
      setErrorCas(true);
    }
  };
  useEffect(() => {
    if (actor) {
      setErrorActor(false);
    }
  }, [actor]);

  useEffect(() => {
    if (cas) {
      setErrorCas(false);
    }
  }, [cas]);
  const { mutate } = useMutation({
    mutationFn: ({
      idG,
      accessToken,
      data,
    }: {
      idG: number;
      accessToken: string;
      data: Data;
    }) =>
      setCasOfSujet({
        idG,
        accessToken,
        data,
      }),
    onSuccess: () => {
      setIsSucces(true);
      setTimeout(() => {
        setIsSucces(false);
        restAll();
      }, 6000);
    },
    onError: (error) => {
      console.warn(error.message);
    },
  });
  const handleSend = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
    if (accessToken && actor && allCas.length > 0 && groupe) {
      mutate({
        idG: groupe,
        accessToken,
        data: { acteur: actor, cas: allCas },
      });
    }
  };
  return (
    <section className="w-full h-svh px-6 pb-10 flex flex-col justify-center items-center gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-hidden bg-[#F4F7FD] relative">
      {next ? (
        <div className="w-xl  bg-white  flex flex-col  drop-shadow-md shadow px-6 py-8 rounded-md">
          <div className="w-full  mb-2">
            <h2 className="fblock font-medium text-xl ">
              Ajoute les cas de sujet
            </h2>
          </div>

          <div className="w-full mb-6">
            {groupes && (
              <CustomGroupSelect
                responsable={groupes}
                label="Selection un groupe : "
              />
            )}
            <div className="space-y-1">
              <label htmlFor="" className="block  text-md  text-gray-900">
                Nom de acteur
              </label>
              <input
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                name="nom"
                type="text"
                placeholder="Entrez le nom de acteur"
                className={`w-full py-2 px-4 border  outline-none rounded-md placeholder:text-sm focus:border-2 focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all ${
                  errorActor ? "border-red-600" : "border-gray-300"
                }`}
              />
            </div>
            <div className="w-full flex justify-end py-1">
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline cursor-pointer text-sm"
              >
                Diagramme de cas d'utilisation
              </a>
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
              onClick={restAll}
              type="button"
              className="outline-none basis-1/2 border-none bg-red-500 hover:bg-red-700 rounded-md py-2 text-white font-medium transition-all cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <section className=" w-2xl md:basis-1/3 bg-white  border border-gray-200 rounded-md px-6 py-6 flex flex-col gap-y-4 shadow shadow-gray-200">
          <div className="">
            <label htmlFor="" className="block font-medium text-xl mb-4">
              Cas d'utilisation{" "}
            </label>
            <div className="flex items-center justify-between gap-4 mb-4">
              <input
                onChange={(event) => setCas(event.target.value)}
                type="text"
                value={cas}
                placeholder="Ajouter une cas d'utilisation"
                className={`w-full py-2 px-4 border  outline-none rounded-md  placeholder:text-sm focus:border-2 focus:border-sky-600 focus:outline-2 focus:outline-sky-600 transform duration-200 ease-in transition-all ${
                  errorCas ? "border-red-600" : "border-gray-300"
                }`}
              />
              <div
                className=" shrink-0 w-14 h-10 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer  hover:bg-gray-100 "
                onClick={() => hanleCas(cas!)}
              >
                <MdAddLink className="text-xl text-blue-600" />
              </div>
            </div>
            {
              <div className=" w-full h-48  px-2 py-3 overflow-hidden flex flex-col gap-y-2.5 border border-gray-200 rounded-md hover:overflow-auto hover:bg-gray-50  cursor-pointer ">
                {allCas.map((ref, index) => (
                  <CardInfoRef key={index} name={ref} />
                ))}
              </div>
            }
          </div>
          <div className="w-full flex items-center justify-center gap-x-6">
            <button
              onClick={() => setNext(!next)}
              type="button"
              className=" cursor-pointer outline-none basis-1/2 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-md py-2 text-gray-700 font-medium transition-all"
            >
              Précédent
            </button>
            <button
              disabled={allCas.length === 0 && !actor}
              onClick={handleSend}
              type="button"
              className={` ${
                allCas.length === 0 && !actor
                  ? " cursor-not-allowed"
                  : "cursor-pointer"
              } outline-none basis-1/2 border-none bg-blue-400 hover:bg-blue-600 rounded-md py-2 text-white font-medium transition-all}`}
            >
              {isLoading ? " Créer ..." : " Créer"}
            </button>
          </div>
        </section>
      )}
      <div
        className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${
          isSucces ? "bottom-10" : "-bottom-20 hidden"
        } `}
      >
        <FaCheckCircle className=" text-green-500 text-3xl" />{" "}
        <p>Les cas ont été créés avec succès.</p>
      </div>
    </section>
  );
};

export default PreciserCas;
