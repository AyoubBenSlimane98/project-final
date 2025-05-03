
import { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import { FaCheckCircle, FaSearch } from "react-icons/fa";
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
    getFilteredRowModel,
    Row,
} from "@tanstack/react-table";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useShallow } from "zustand/shallow";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoMdCheckmark } from "react-icons/io";
import { useAuthStore, useResponsablStore } from "../../../../store";
import { IoCloseOutline } from "react-icons/io5";
import { AiTwotoneWarning } from "react-icons/ai";

export type BinomeUser = {
    idB: number;
    bio: string;
    image: string | null;
    fullName: string;
};
type StudentBinome = {
    idB: number;
    matricule: string;
    fullName: string;
    groupe: string;
    responsabilite: string;
};

export type Groupe = {
    idG: number;
    nom: string;
};
export type CustomSelectGroupeProps = {
    responsable: Groupe[];
    label?: string;
};


export type ColumnSort = {
    id: string;
    desc: boolean;
};
export type SortingState = ColumnSort[];
function formatResponsabilite(responsabilite: string): string {
    if (!responsabilite) return 'Pas encore définie';

    if (responsabilite === 'introduction_resume_conclustion') {
        return 'introduction / resume / conclustion';
    }

    return responsabilite.replace(/_/g, ' ').replace(/chapter (\d)/, 'chapter $1');
}

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

const updateResponsabilite = async ({
    idB,
    responsabilite,
    accessToken,
}: {
    idB: number;
    responsabilite: string;
    accessToken: string;
}) => {
    console.log("Sending responsabilite:", responsabilite);
    const response = await fetch(`http://localhost:4000/api/responsable/binome/${idB}/responsabilite`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ responsabilite })
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error("Server error:", error); // Optional: log error details
        throw new Error("Cannot update binome responsibility");
    }
    return response.json();
};
const getBinomeData = async ({
    idB,
    accessToken,
}: {
    idB: number;
    accessToken: string;
}) => {
    const response = await fetch(`http://localhost:4000/api/eutdaint/binomes/${idB}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch for get binome data");
    return response.json();
};


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

const getMemmbersGroupes = async ({ idG, accessToken }: { idG: number; accessToken: string }) => {
    const response = await fetch(`http://localhost:4000/api/responsable/all-groupes/${idG}/responsabilite`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch binômes!");
    return response.json();
};

export type BinomeTableRow = {
    binomeID: number;
    fullName: string;
    email: string;
    matricule: string;
    sexe: "Male" | "Female";
};

const customFilterFn = <T,>(row: Row<T>, columnId: string, filterValue: string) => {
    const value = row.getValue(columnId);
    return value ? String(value).toLowerCase().includes(filterValue.toLowerCase()) : false;
};


function CustomGroupSelect({ responsable, label }: CustomSelectGroupeProps) {

    const { groupe, setGroupe } = useResponsablStore(useShallow((state) => ({
        groupe: state.groupe,
        setGroupe: state.setGroupe
    })))
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dataResponsable, setDataResponsable] = useState<Groupe[]>(responsable);
    const [itemSelection, setItemSelection] = useState<Groupe | null>();

    useEffect(() => {
        if (dataResponsable.length > 0 && groupe.idG == -1) {
            setItemSelection(dataResponsable[0])
            setGroupe(dataResponsable[0])
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
        setGroupe(item)
    };

    return (
        <div className='w-full flex items-center gap-2 text-[#09090B] py-1 ' >
            <h2 className='block mb-2 text-md font-medium text-gray-900'>{label} </h2>
            <div className='relative w-1/2 '>
                <div className='relative  mb-2'>
                    <input
                        type="text"
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
                        onChange={handleChange}
                        value={
                            itemSelection
                                ? itemSelection.nom
                                : dataResponsable.find((itm) => itm.idG === groupe.idG)?.nom || ''
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

const RESPONSABILITE_DATA = [
    { key: "chapter_1", label: "chapter 1" },
    { key: "chapter_2", label: "chapter 2" },
    { key: "chapter_3", label: "chapter 3" },
    { key: "introduction_resume_conclustion", label: "introduction / resume / conclusion" },
];

type Responsabilite = {
    key: string;
    label: string;
};

type CustomResponsabiliteSelectProps = {

    onSelect: (value: Responsabilite) => void;
    initialValue?: Responsabilite;
};

function CustomResponsabiliteSelect({
    onSelect,
    initialValue,
}: CustomResponsabiliteSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<Responsabilite[]>(RESPONSABILITE_DATA);
    const [selected, setSelected] = useState<Responsabilite | null>(initialValue || null);

    useEffect(() => {
        if (!selected && data.length > 0) {
            setSelected(data[0]);
            onSelect(data[0]);
        }
    }, [data, selected, onSelect]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        const filtered = RESPONSABILITE_DATA.filter((item) =>
            item.label.toLowerCase().includes(value)
        );
        setData(filtered);
        setSelected(filtered.length > 0 ? filtered[0] : null);
    };

    const handleSelection = (item: Responsabilite) => {
        setSelected(item);
        setIsOpen(false);
        onSelect(item);
    };

    return (
        <div className='w-full flex items-center gap-2 text-[#09090B] py-1'>

            <div className='relative w-full'>
                <div className='relative mb-2'>
                    <input
                        type="text"
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
                        onChange={handleChange}
                        value={selected?.label || ""}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    {isOpen ? (
                        <FiChevronUp
                            className='absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2'
                            onClick={() => setIsOpen(false)}
                        />
                    ) : (
                        <FiChevronDown
                            className='absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2'
                            onClick={() => setIsOpen(true)}
                        />
                    )}
                </div>

                {isOpen && (
                    <ul className='absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto space-y-0.5'>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <li
                                    key={item.key}
                                    className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${selected?.key === item.key ? "bg-[#F4F7FD]" : ""}`}
                                    onClick={() => handleSelection(item)}
                                >
                                    <span>
                                        {selected?.key === item.key ? <IoMdCheckmark className='text-sm text-[#7CFC00]' /> : <p className='w-3.5' />}
                                    </span>
                                    <span className='font-medium'>{item.label}</span>
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
function CardInfo({
    fullName,
    image,
}: BinomeUser) {
    const groupe = useResponsablStore((state) => state.groupe)
    return (
        <div className={`flex   flex-col py-6 sm:flex-row items-center  gap-4    sm:py-2 outline-none`}>
            <img onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://scontent.fczl2-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeF_OWSBlL4_ahZGK8uktg7YWt9TLzuBU1Ba31MvO4FTUAcNr-rcAk0Q6wgee_n1MVfJVXKEYXEpVc_A8npzsuDs&_nc_ohc=pCF_EXqQ5MYQ7kNvwGqbQH8&_nc_oc=AdmOQDv_qA9yPoDAQK2j4m8cM77HYt2osPaGYZiWQNIR41-_Kkg1lN_m_n79WacUl90&_nc_zt=24&_nc_ht=scontent.fczl2-2.fna&oh=00_AfEfE4VyUFM1gD2VkajBmRMamhtVSp2NpcihUNDqLsAtzg&oe=681B903A';
            }}
                src={`http://localhost:4000/${image}`} alt={`Profile picture of ${fullName}`}
                className="w-14 h-14 rounded-full object-cover" loading="lazy" />
            <div className=" shrink-0 flex flex-col ">
                <span className="font-medium">{fullName}</span>
                <span className="text-gray-500 text-sm first-letter:uppercase"> {groupe.nom} </span>
            </div>

        </div>
    )
}

function CardResponsable({ users, setIsShow, setIsSucces, setIsError }: { users: BinomeUser[], setIsShow: (isShow: boolean) => void, setIsSucces: (isSucces: boolean) => void, setIsError: (isError: boolean) => void }) {
    const { idB, } = useResponsablStore(useShallow((state) => ({
        idB: state.idB,
    })))
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const accessToken = useAuthStore((state) => state.accessToken)
    const responsabilite = useResponsablStore((state) => state.responsabilite)
    const setResponsabilite = useResponsablStore((state) => state.setResponsabilite)
    const { mutate } = useMutation({
        mutationFn: ({
            idB,
            responsabilite,
            accessToken,
        }: {
            idB: number;
            accessToken: string;
            responsabilite: string
        }) => updateResponsabilite({
            idB,
            responsabilite,
            accessToken,
        }),
        onSuccess: () => {
            setIsLoading(true)
            setTimeout(() => {
                setIsSucces(true)
                setIsLoading(false)
                setIsShow(false)
            }, 2000)
        },
        onError:()=>{
            setIsLoading(true)
            setTimeout(() => {
                setIsError(true)
                setIsLoading(false)
                setIsShow(false)
            }, 2000)
        }

    })
    const handleResponsabilte = () => {

        if (accessToken && responsabilite && idB !== -1) {

            mutate({ accessToken, idB: idB, responsabilite: responsabilite.key })
        }
    }
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white w-xl flex flex-col px-8 py-10  rounded-md drop-shadow shadow-gray-200 border border-gray-200">
            <div className="flex justify-between mb-6">
                <h2 className="text-xl  text-center">
                    Affecter la responsabilte de cette binome?
                </h2>
                <IoCloseOutline
                    onClick={() => setIsShow(false)}
                    className=" text-3xl cursor-pointer text-red-400 "
                />
            </div>
            <div className="flex items-center justify-between ">
                {users.map((_d, index) => (
                    <CardInfo key={index} {..._d} />
                ))}
            </div>
            <CustomResponsabiliteSelect
                initialValue={{ key: "chapter_2", label: "chapter 2" }}
                onSelect={(selected) => {
                    setResponsabilite(selected)
                }} />
            <div className="w-full flex items-center justify-center gap-x-6 mt-4">
                <button
                    onClick={() => setIsShow(false)}
                    className="outline-none w-1/2 border border-gray-200 hover:bg-red-500 rounded-md py-2 hover:text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer"  >
                    Annuler
                </button>
                <button
                    onClick={handleResponsabilte}
                    className="outline-none w-1/2 bg-blue-500 hover:bg-blue-700 rounded-md py-2 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer">
                    {isLoading ? 'Affecter...' : 'Affecter'}
                </button>
            </div>
        </div>
    );
}

const AffectionResponsablite = () => {

    const { groupe, setBinomeID, addUsers, users } = useResponsablStore(useShallow((state) => ({
        groupe: state.groupe,
        setBinomeID: state.setBinomeID,
        idB: state.idB,
        addUsers: state.addUsers,
        users: state.users
    })))

    const accessToken = useAuthStore((state) => state.accessToken)

    const columnHelper = createColumnHelper<StudentBinome>();
    const [hoveredBinomeID, setHoveredBinomeID] = useState<number | null>(null);

    const [globalFilter, setGlobalFilter] = useState('');

    const [isClose, setIsClose] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isSucces, setIsSucces] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const columns = [
        columnHelper.display({
            id: 'index',
            cell: (info) => info.row.index + 1,
            header: () => <span className="text-lg">N°</span>
        }),
        columnHelper.accessor("matricule", {
            cell: (info) => info.getValue(),
            header: () => <span className="text-white font-medium">Matricule</span>,
            filterFn: customFilterFn,
        }),
        columnHelper.accessor("fullName", {
            cell: (info) => info.getValue(),
            header: () => <span className="text-white font-medium">Nom et Prénom</span>,
        }),
        columnHelper.accessor("groupe", {
            cell: (info) => (
                <span className="italic text-blue-600">{info.getValue()}</span>
            ),
            header: () => <span className="text-white font-medium">Groupe</span>,

            filterFn: customFilterFn,
        }),
        columnHelper.accessor('responsabilite', {
            cell: ({ getValue }) => formatResponsabilite(getValue() as string),
            header: () => <span className="text-lg">Responsabilite</span>
        }),



    ];

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

    const [data, setData] = useState<StudentBinome[]>([]);

    const { data: memmbersGroupe, } = useQuery({
        queryKey: ['memmbers', accessToken, groupe],
        queryFn: async () => {
            if (groupe === undefined) throw new Error("No  groupe with id");
            return await getMemmbersGroupes({ accessToken: accessToken!, idG: groupe.idG });
        },
        enabled: !!accessToken && groupe !== undefined,
        staleTime: 0,
        gcTime: 0
    });

    useEffect(() => {
        if (memmbersGroupe) {
            setData(memmbersGroupe);
        }
    }, [memmbersGroupe]);

    const table = useReactTable({
        columns,
        data: data,
        state: {
            globalFilter,

        },
        getCoreRowModel: getCoreRowModel(),

        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),

    });

    const { mutate } = useMutation({
        mutationFn: ({
            idB,
            accessToken,
        }: {
            idB: number;
            accessToken: string;
        }) => getBinomeData({
            idB,
            accessToken,
        }),
        onSuccess: (data) => {
            addUsers(data)
        }
    })

    const handleData = (id: number) => {
        setIsShow(true)
        if (accessToken) {
            setBinomeID(id)
            mutate({ accessToken, idB: id, })
        }
    }

    useEffect(() => {
        setTimeout(() => setIsSucces(false), 3000)
    }, [isSucces])
    useEffect(() => {
        setTimeout(() => setIsError(false), 3000)
    }, [isError])

    console.log(memmbersGroupe)
    return (
        <main className="flex flex-col items-center h-svh mt-26 w-full mx-auto  px-12 relative ">

            <div className="w-[90%]  flex justify-between items-center mb-8" >
                {isClose && groupes && <CustomGroupSelect responsable={groupes} label="Veuillez sélectionner un groupe :" />}
                {
                    isOpen ? <div className={` ${isClose ? "" : "w-full"} flex transform duration-300 ease-in transition-all`}>
                        <input
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-6 pr-4 py-2 bg-white border border-r-0 border-gray-300 rounded-l-md shadow-sm outline-none "
                        />
                        <div className="w-26 h-11 bg-slate-200 rounded-r-md border border-gray-300 flex items-center justify-center shadow-sm " onClick={() => { setIsOpen(false); setIsClose(true); }}>
                            <FaSearch className="  text-gray-900 " />

                        </div>
                    </div> : <div className="w-12 h-12 border border-gray-300 bg-white flex items-center justify-center rounded-full transform duration-100 ease-linear transition-all" onClick={() => { setIsOpen(true); setIsClose(false); }} >

                        <FaSearch className=" text-gray-900 " />
                    </div>
                }

            </div>
            <div className={`bg-white shadow-md max-h-[595px] w-[90%]   rounded-lg  overflow-auto`}>
                <table className="min-w-full  divide-y divide-gray-200    ">
                    <thead className="bg-black ">
                        {table.getHeaderGroups().map((headerGroupe) => (
                            <tr key={headerGroupe.id}>
                                {
                                    headerGroupe.headers.map((header) => (
                                        <th key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            <div className={`cursor-pointer select-none flex items-center ${header.column.getCanSort() ? "hover:text-gray-300" : ""
                                                }`}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}

                                            </div>
                                        </th>
                                    ))
                                }
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row, index, rows) => {
                            const currentBinomeID = row.original.idB;
                            const prevBinomeID = index > 0 ? rows[index - 1].original.idB : null;
                            const isFirstOccurrence = currentBinomeID !== prevBinomeID;
                            const rowSpan = rows.filter((r) => r.original.idB === currentBinomeID).length;

                            return (
                                <tr
                                    key={row.id}
                                    className={`transition - all cursor - pointer  ${hoveredBinomeID === currentBinomeID ? "bg-[#F4F7FC]" : ""
                                        }`}
                                    onMouseEnter={() => setHoveredBinomeID(currentBinomeID)}
                                    onMouseLeave={() => setHoveredBinomeID(null)}
                                    onClick={() => handleData(row.original.idB)}
                                >
                                    {row.getVisibleCells().map((cell) => {

                                        if (["index", "responsabilite"].includes(cell.column.id)) {
                                            return isFirstOccurrence ? (
                                                <td key={cell.id} rowSpan={rowSpan} className=" px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold text-center align-middle border border-b-0 border-t-0 border-gray-300">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ) : null;
                                        }
                                        return (
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 " >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>
            {isShow && <CardResponsable users={users} setIsShow={setIsShow} setIsSucces={setIsSucces} setIsError={setIsError} />}
            <div className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${isSucces ? "bottom-40" : "-bottom-40 hidden"} `}>
                <FaCheckCircle className=" text-green-500 text-3xl" />   <p>La responsabilte a été affectés avec succès.</p>
            </div>
            <div className={`py-6 px-4 rounded-md bg-white text-nowrap flex items-center gap-4 shadow drop-shadow absolute ${isError ? "bottom-40" : "-bottom-40 hidden"} `}>
                <AiTwotoneWarning className=" text-red-500 text-3xl" />   <p>Elle a été assignée à quelqu'un d'autre binome .</p>
            </div>
        </main>
    )

}

export default AffectionResponsablite