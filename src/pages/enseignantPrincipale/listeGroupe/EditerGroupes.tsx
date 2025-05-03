import { ChangeEvent, useEffect, useMemo, useState, } from "react";
import { FaCheckCircle, FaSearch, FaUserEdit, } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { NavLink } from "react-router"
import { BiArrowBack, BiSortAlt2, } from "react-icons/bi";
import { useAuthStore, useGroupeStore } from "../../../store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, Row, SortingState, useReactTable } from "@tanstack/react-table";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useShallow } from "zustand/shallow";
import { MdOutlineClose } from "react-icons/md";


export type Groupe = {
    idG: number;
    nom: string;
};
export type CustomSelectGroupeProps = {
    responsable: Groupe[];
    label?: string;
};
const updateStudentsGroups = async ({ updates, accessToken }: { updates: Selection[]; accessToken: string }) => {
    const response = await fetch(`http://localhost:4000/api/principal/update-groups`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ updates }),
    });
    if (!response.ok) throw new Error("Cannot fetch for change binomes of groupes");
    return response.json();
};

//----------------------------------------------- not chage this -----------------------------------------------
const getAllGroupes = async (accessToken: string) => {
    const response = await fetch(`http://localhost:4000/api/principal/groupe/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch for get number of groupes");
    return response.json();
};

function CustomGroupSelect({ responsable, label }: CustomSelectGroupeProps) {
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
            <h2 className='block mb-2 text-md font-medium text-gray-900 text-nowrap pb-1'>{label} </h2>
            <div className='relative w-full'>
                <div className='relative w-1/2 mb-2'>
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
                                    <span>{itemSelection?.idG === item.idG ? <GiCheckMark className='text-sm text-[#7CFC00] ' /> : <p className='w-3.5'></p>}</span>
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
//----------------------------------------------- not chage this -----------------------------------------------
type StudentBinome = {
    fullName: string;
    groupe: string;
    idB: number;
    matricule: string;
};
const getMemmbersGroupes = async ({ idG, accessToken }: { idG: number, accessToken: string }) => {
    const response = await fetch(`http://localhost:4000/api/principal/all-groupes/${idG}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) throw new Error("Cannot fetch memmbers of groube");
    return response.json();
};
//----------------------------------------------------------------------------------------------
const customFilterFn = (row: Row<StudentBinome>, columnId: string, filterValue: string) => {
    const value = row.original[columnId as keyof StudentBinome];

    if (!value) return false;

    return String(value).toLowerCase().includes(filterValue.toLowerCase());
};
const customSortingFn = (
    rowA: Row<StudentBinome>,
    rowB: Row<StudentBinome>,
    columnId: string
): number => {
    const valueA = rowA.original[columnId as keyof StudentBinome] ?? "";
    const valueB = rowB.original[columnId as keyof StudentBinome] ?? "";

    console.log("value", valueA);

    const binomeA = rowA.original.idB;
    const binomeB = rowB.original.idB;

    if (binomeA === binomeB) {
        return valueA.toString().localeCompare(valueB.toString());
    }

    return binomeA - binomeB;
};
//----------------------------------------------------------------------------------------------

type Student = {
    idU: number;
    nom: string;
    prenom: string;
};

type DeleteBinomeCardProps = {
    binome: Student[];
    handleDeleteBinome: (selectedIds: number[]) => void;
    setIsDelete: (isDelete: boolean) => void;
};
const getBinomes = async ({ idB, accessToken }: { idB: number, accessToken: string }) => {
    const response = await fetch(`http://localhost:4000/api/principal/binome/${idB}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) throw new Error("Cannot fetch memmbers of groube");
    return response.json();
};
const deleteStudents = async (ids: number[], accessToken: string) => {
    const response = await fetch(`http://localhost:4000/api/principal/delete-students`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
        throw new Error("Error deleting students");
    }

    return response.json();
};
const DeleteBinomeCard = ({ binome, handleDeleteBinome, setIsDelete }: DeleteBinomeCardProps) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isActice, setIsActice] = useState<boolean>(false);

    const toggleSelection = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const handleDelete = () => {
        if (selectedIds.length > 0) {
            setIsActice(true)
            handleDeleteBinome(selectedIds);
            setTimeout(() => {
                setIsActice(false)
            }, 2000)
        }
    };
    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md drop-shadow p-6 space-y-4 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50 ">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Supprimer Binôme</h2>
                <MdOutlineClose className="text-xl text-gray-400 cursor-pointer hover:text-red-500" onClick={() => setIsDelete(false)} />
            </div>
            <div className="space-y-2">
                {binome.map((student) => (
                    <label
                        key={student.idU}
                        className="flex items-center gap-3 p-2 border border-gray-100 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(student.idU)}
                            onChange={() => toggleSelection(student.idU)}
                            className="w-4 h-4"
                        />
                        <span className="text-gray-700">{student.nom} {student.prenom}</span>
                    </label>
                ))}
            </div>

            <button
                onClick={handleDelete}
                disabled={selectedIds.length === 0}
                className="mt-4 w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md disabled:bg-gray-300 transition-all"
            >
                {isActice ? " Supprimer..." : ' Supprimer'}
            </button>
        </div>
    );
};

//----------------------------------------------------------------------------------------------


type GroupSelectProps = {
    responsable: Groupe[];
    onChange: (groupId: number) => void;
};
type EditBinomeCardProps = {
    binome: Student[];
    groupes: Groupe[];
    refetch: () => void;
    setIsEdit: (isEdit: boolean) => void;
    setIsSuccessUpdated: (isSuccesDeleted: boolean) => void;
};

type Selection = {
    studentId: number;
    groupId: number;
};
const GroupSelect = ({ responsable, onChange }: GroupSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dataResponsable, setDataResponsable] = useState<Groupe[]>(responsable);
    const [itemSelection, setItemSelection] = useState<Groupe | null>(null);

    useEffect(() => {
        if (dataResponsable.length > 0) {
            setItemSelection(dataResponsable[0]);

        }
    }, [dataResponsable]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        const filtered = responsable.filter((item) => item.nom.toLowerCase().includes(value));
        setDataResponsable(filtered);
        if (filtered.length > 0) {
            setItemSelection(filtered[0]);
            onChange(filtered[0].idG);
        } else {
            setItemSelection(null);
        }
    };

    const handleSelection = (item: Groupe) => {
        setItemSelection(item);
        onChange(item.idG);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full text-[#09090B]">
            <div className="relative mb-1">
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4"
                    value={itemSelection ? itemSelection.nom : ""}
                    onChange={handleChange}
                    onClick={() => setIsOpen(!isOpen)}
                />
                {isOpen ? (
                    <FiChevronUp className="absolute top-1/2 right-3 text-xl cursor-pointer transform -translate-y-1/2" onClick={() => setIsOpen(false)} />
                ) : (
                    <FiChevronDown className="absolute top-1/2 right-3 text-xl cursor-pointer transform -translate-y-1/2" onClick={() => setIsOpen(true)} />
                )}
            </div>

            {isOpen && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg px-2 py-2 max-h-48 overflow-auto">
                    {dataResponsable.length > 0 ? (
                        dataResponsable.map((item) => (
                            <li
                                key={item.idG}
                                className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-100 rounded-sm ${itemSelection?.idG === item.idG ? "bg-gray-100" : ""
                                    }`}
                                onClick={() => handleSelection(item)}
                            >
                                <span>{itemSelection?.idG === item.idG ? <GiCheckMark className="text-green-500" /> : <div className="w-4" />}</span>
                                <span className="text-sm">{item.nom}</span>
                            </li>
                        ))
                    ) : (
                        <li className="py-1 px-2 text-gray-500">لا يوجد نتائج</li>
                    )}
                </ul>
            )}
        </div>
    );
};

const EditBinomeCard = ({ binome, groupes, setIsEdit, refetch, setIsSuccessUpdated }: EditBinomeCardProps) => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [selections, setSelections] = useState<Selection[]>([]);
    const [isActive, setIsActive] = useState<boolean>(false);

    const toggleSelection = (id: number) => {
        setSelections((prev) => {
            const exists = prev.find((sel) => sel.studentId === id);
            if (exists) {
                return prev.filter((sel) => sel.studentId !== id);
            } else {
                return [...prev, { studentId: id, groupId: groupes[0]?.idG ?? 0 }];
            }
        });
    };

    const handleGroupChange = (studentId: number, groupId: number) => {
        setSelections((prev) =>
            prev.map((sel) =>
                sel.studentId === studentId ? { ...sel, groupId } : sel
            )
        );
    };

    const { mutate } = useMutation({
        mutationFn: ({ updates, accessToken }: { updates: Selection[]; accessToken: string }) => {
            if (!accessToken) throw new Error("No access token found");
            return updateStudentsGroups({ updates, accessToken });
        },
        onSuccess: () => {
            console.log("Mise à jour réussie !");
            setTimeout(() => {
                setIsEdit(false);
                setIsSuccessUpdated(true)
                refetch()

            }, 2000)
        },
        onError: (error) => {
            console.error("Erreur de mise à jour:", error);
        },
    });
    const handleModifier = () => {
        if (selections.length > 0) {
            setIsActive(true);
            mutate({ updates: selections, accessToken: accessToken! })

            setTimeout(() => {
                setIsActive(false);
            }, 3000);
        }
    };

    const isSelected = (id: number) => selections.some((sel) => sel.studentId === id);

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-4 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Modifier Binome</h2>
                <MdOutlineClose className="text-2xl text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => setIsEdit(false)} />
            </div>

            <div className="space-y-4">
                {binome.map((student) => (
                    <div key={student.idU} className="flex items-center gap-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSelected(student.idU)}
                                onChange={() => toggleSelection(student.idU)}
                                className="w-4 h-4"
                            />
                            <span className="text-gray-700">{student.nom} {student.prenom}</span>
                        </label>
                        {isSelected(student.idU) && (
                            <div className="flex-1">
                                <GroupSelect
                                    responsable={groupes}
                                    onChange={(groupId) => handleGroupChange(student.idU, groupId)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={handleModifier}
                disabled={selections.length === 0}
                className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:bg-gray-300 transition-all"
            >
                {isActive ? "Modifier..." : "Modifier"}
            </button>
        </div>
    );
};
//----------------------------------------------------------------------------------------------
const EditerGroupes = () => {
    const { groupe } = useGroupeStore(useShallow((state) => ({
        groupe: state.groupe,
    })))
    const accessToken = useAuthStore((state) => state.accessToken)
    const [binomeId, setBinomeId] = useState<number>();
    const [binome, setBinome] = useState<Student[]>([])

    const columnHelper = createColumnHelper<StudentBinome>();
    const [hoveredBinomeID, setHoveredBinomeID] = useState<number | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [isClose, setIsClose] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isSuccessUpdated, setIsSuccessUpdated] = useState(false);
    const [isSuccesDeleted, setIsSuccessDeleted] = useState<boolean>(false)

    useEffect(() => {
        if (isSuccesDeleted || isSuccessUpdated) {
            const timer = setTimeout(() => {
                if (isSuccesDeleted) setIsSuccessDeleted(false);
                if (isSuccessUpdated) setIsSuccessUpdated(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccesDeleted, isSuccessUpdated]);

    const { data: groupes } = useQuery({
        queryKey: ['groupes'],
        queryFn: () => getAllGroupes(accessToken!),
        enabled: !!accessToken
    });

    const { data: memmbersGroupe, refetch } = useQuery({
        queryKey: ['memmbers', accessToken, groupe],
        queryFn: async () => {
            if (groupe === undefined) throw new Error("No  groupe with id");
            return await getMemmbersGroupes({ accessToken: accessToken!, idG: groupe });
        },
        enabled: !!accessToken && groupe !== undefined,
        staleTime: 0,
        gcTime: 0
    });

    const { data: binomesData, refetch: refetchBinome } = useQuery({
        queryKey: ['binomes', accessToken, binomeId],
        queryFn: async () => {
            if (binomeId === undefined) throw new Error("No  binome with id");
            return await getBinomes({ accessToken: accessToken!, idB: binomeId });
        },
        enabled: !!accessToken && binomeId !== undefined,
        staleTime: 0,
        gcTime: 0
    });

    useEffect(() => {
        if (binomesData) {
            setBinome(binomesData)
        }
    }, [binomesData]);

    const columns = useMemo(() => [
        columnHelper.display({
            id: 'index',
            cell: (info) => info.row.index + 1,
            header: () => <span className="text-lg">N°</span>
        }),
        columnHelper.accessor("matricule", {
            cell: (info) => info.getValue(),
            header: () => <span className="text-white font-medium">Matricule</span>,
            sortingFn: customSortingFn,
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
            sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),
        columnHelper.display({
            id: 'Modifier',
            cell: ({ row }) => (
                <div className="w-full flex items-center justify-center pl-2" onClick={() => { setBinomeId(row.original.idB); setIsEdit(true) }} >
                    <FaUserEdit className="mr-2 text-xl text-blue-500 hover:text-blue-600" />
                </div>
            ),
            header: 'Modifier',
        }),
        columnHelper.display({
            id: 'Supprimer',
            cell: ({ row }) => (
                <div className="w-full flex items-center justify-center pl-2" onClick={() => { setBinomeId(row.original.idB); setIsDelete(true) }}>
                    <RiDeleteBin5Fill className="mr-2 text-xl text-red-400 hover:text-red-600" />
                </div>
            ),
            header: 'Supprimer',
        }),


    ], [columnHelper]);


    const [data, setData] = useState<StudentBinome[]>([]);

    useEffect(() => {
        if (memmbersGroupe) {
            setData(memmbersGroupe);
        }
    }, [memmbersGroupe]);

    const table = useReactTable({
        columns,
        data: data,
        state: {
            sorting,
            globalFilter,

        },
        getCoreRowModel: getCoreRowModel(),

        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),

        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),

    });



    const { mutate } = useMutation({
        mutationFn: ({ ids, accessToken }: { ids: number[], accessToken: string }) => deleteStudents(ids, accessToken),
        onSuccess: () => {
            setTimeout(() => {
                setIsDelete(false)
                setIsSuccessDeleted(true)
                refetch()
                refetchBinome()
            }, 1000)

        }
    })
    const handleDeleteBinome = (selectedIds: number[]) => {
        if (accessToken && selectedIds.length > 0) {
            mutate({ ids: selectedIds, accessToken })
        }
    }

    return (
        <section className="flex flex-col  h-svh w-full gap-4 mx-auto py-10 px-4 sm:px-6 lg:px-8  bg-[#F4F7FD] relative ">
            <section className="">
                <div className=" flex justify-between items-center mb-8">
                    {isClose && groupes && <CustomGroupSelect label="Veuillez sélectionner un groupe :" responsable={groupes} />}
                    {isOpen ? <div className={` ${isClose ? "" : "w-full"} flex transform duration - 300 ease -in transition - all`}>
                        <input
                            placeholder="Search..."
                            className="w-full pl-6 pr-4 py-2 bg-white border border-r-0 border-gray-300 rounded-l-md shadow-sm outline-none "
                        />
                        <div className="w-26 h-11 bg-slate-200 rounded-r-md border border-gray-300 flex items-center justify-center shadow-sm " onClick={() => { setIsOpen(false); setIsClose(true); }}>
                            <FaSearch className="  text-gray-900 " />

                        </div>
                    </div> : <div className="w-12 h-12 border border-gray-300 bg-white flex items-center justify-center rounded-full transform duration-100 ease-linear transition-all" onClick={() => { setIsOpen(true); setIsClose(false); }} >

                        <FaSearch className=" text-gray-900 " />
                    </div>}

                </div>
                <div className={`bg - white shadow - md max - h - [595px]  rounded - lg  overflow - auto`}>
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
                                                    {header.column.getIsSorted() === "asc" && header.column.columnDef.header !== "Supprimer" && header.column.columnDef.header !== "Modifier" ? (
                                                        <BiSortAlt2 className="text-xl text-green-400 ml-2 rotate-180" />
                                                    ) : header.column.getIsSorted() === "desc" && header.column.columnDef.header !== "Supprimer" && header.column.columnDef.header !== "Modifier" ? (
                                                        <BiSortAlt2 className="text-xl text-red-400 ml-2" />
                                                    ) :
                                                        header.column.columnDef.header !== "Supprimer" && header.column.columnDef.header !== "Modifier" ? <BiSortAlt2 className="text-xl text-white ml-2" />
                                                            : ""}
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
                                    >
                                        {row.getVisibleCells().map((cell) => {

                                            if (["index", "Supprimer", "Modifier"].includes(cell.column.id)) {
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
            </section>

            <section className={`  ${isDelete || isEdit ? "absolute top-0 left-0 w-full h-svh bg-black/45 z-30" : ""} `}></section>


            {isDelete && <DeleteBinomeCard binome={binome} handleDeleteBinome={handleDeleteBinome} setIsDelete={setIsDelete} />}
            {isEdit && <EditBinomeCard binome={binome} groupes={groupes} setIsEdit={setIsEdit} refetch={refetch} setIsSuccessUpdated={setIsSuccessUpdated} />}
            <div
                className={`py-6 px-4 rounded-md bg-white flex items-center gap-4 shadow-md drop-shadow-lg absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isSuccessUpdated ? "bottom-10 opacity-100" : "-bottom-20 opacity-0"
                    }`}
            >
                <FaCheckCircle className="text-green-500 text-3xl" />
                <p className="whitespace-nowrap font-semibold text-gray-700">
                    Binôme modifié avec succès !
                </p>
            </div>
            <div
                className={`py-6 px-4 rounded-md bg-white flex items-center gap-4 shadow-md drop-shadow-lg absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isSuccesDeleted ? "bottom-10 opacity-100" : "-bottom-20 opacity-0"
                    }`}
            >
                <FaCheckCircle className="text-green-500 text-3xl" />
                <p className="whitespace-nowrap font-semibold text-gray-700">
                    Binôme supprimé avec succès !
                </p>
            </div>
            <NavLink to="/ens-principale/gestion-groupes" className=" fixed bottom-6  right-4 bg-green-500 hover:bg-green-600 transform ease-in-out duration-300 transition-all text-white w-12 h-12 rounded-full flex items-center justify-center">
                <BiArrowBack className="text-2xl" />
            </NavLink>
        </section>

    )
}

export default EditerGroupes

