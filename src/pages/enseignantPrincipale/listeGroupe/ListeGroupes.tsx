import { ChangeEvent, useEffect, useMemo, useState, } from "react";
import { FaSearch } from "react-icons/fa";
import { NavLink } from "react-router"
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    Row,
} from "@tanstack/react-table";
import { BiArrowBack, BiSortAlt2 } from "react-icons/bi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";


export type BinomeWithStudents = {
    etudiant1: {
        matricule: string;
        user: {
            nom: string;
            prenom: string;
            sexe: "Male" | "Female";
            compte: {
                email: string;
            };
        };
    };
    etudiant2: {
        matricule: string;
        user: {
            nom: string;
            prenom: string;
            sexe: "Male" | "Female";
            compte: {
                email: string;
            };
        };
    } | null;
};

type CustomSelectProps = {
    responsable: string[];
    label: string;
    width?: string
    heightInput?: string;
    setPostion: (value: number) => void;
    refetch: () => void;
    currentPosition: number;
};

function createGroupes(n: number): string[] {
    const groupes: string[] = [];
    for (let i = 1; i <= n; i++) {
        groupes.push(`Groupe ${i}`);
    }
    return groupes;
}
export type ColumnSort = {
    id: string;
    desc: boolean;
};
export type SortingState = ColumnSort[];

const getNumberGroupes = async (accessToken: string) => {
    const response = await fetch(`http://localhost:4000/api/principal/groupe`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch for get number of groupes");
    return response.json();
};


const getListBinommes = async ({ id, accessToken }: { id: number; accessToken: string }) => {
    const response = await fetch(`http://localhost:4000/api/principal/groupe/${id}`, {
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

const customSortingFn = (
    rowA: Row<BinomeTableRow>,
    rowB: Row<BinomeTableRow>,
    columnId: string
) => {
    const valA = rowA.original[columnId as keyof BinomeTableRow] ?? "";
    const valB = rowB.original[columnId as keyof BinomeTableRow] ?? "";

    if (rowA.original.binomeID === rowB.original.binomeID) {
        return String(valA).localeCompare(String(valB));
    }
    return rowA.original.binomeID - rowB.original.binomeID;
};
function CustomSelect({ responsable, label, width = "w-80", heightInput = "py-2.5", setPostion, refetch, currentPosition }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dataResponsable, setDataResponsable] = useState<string[]>(responsable);
    const [itemSelection, setItemSelection] = useState<string>(responsable.length > 0 ? responsable[0] : "");

    useEffect(() => {
        setDataResponsable(responsable);
    }, [responsable]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value;
        const filter = responsable.filter((item) => item.toLowerCase().includes(value.toLowerCase()));
        setDataResponsable(filter);
        setItemSelection(value);
    };

    const handleSelection = (item: string) => {
        setItemSelection(item);
        setIsOpen(false);

        const position = dataResponsable.findIndex((res) => res === item);
        if (position !== -1 && position + 1 !== currentPosition) {
            setPostion(position + 1);
            refetch();
        }
    };

    return (
        <div className='w-full flex items-center  gap-2 text-[#09090B] ' >
            <h2 className='block text-md font-medium text-gray-900 text-nowrap'>{label} </h2>
            <div className='relative w-full'>
                <div className={`relative ${width}`}>
                    <input
                        type="text"
                        className={`bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  px-4 ${heightInput}`}
                        onChange={handleChange}
                        value={itemSelection}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    {isOpen ? (
                        <FiChevronUp className='absolute top-1/2 right-0 text-xl cursor-pointer -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(false)} />
                    ) : (
                        <FiChevronDown className='absolute top-1/2  right-0 text-xl cursor-pointer  -translate-y-1/2 -translate-x-1/2 transform duration-300 ease-in-out transition-all' onClick={() => setIsOpen(true)} />
                    )}
                </div>

                {isOpen && (
                    <ul className='absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto mt-2'>
                        {dataResponsable.length > 0 ? (
                            dataResponsable.map((item) => (
                                <li
                                    key={item}
                                    className={`flex items-center gap-2 py-1 px-2.5 cursor-pointer hover:bg-[#F4F7FD] rounded-sm ${itemSelection === item ? "bg-[#F4F7FD]" : ""} transform duration-300 ease-in-out transition-all`}
                                    onClick={() => {
                                        handleSelection(item);

                                    }}
                                >
                                    <span>{itemSelection === item ? <GiCheckMark className='text-sm text-[#7CFC00] ' /> : <p className='w-3.5'></p>}</span>
                                    <span className='font-medium'>{item}</span>
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

const ListeGroupes = () => {
    const accessToken = useAuthStore((state) => state.accessToken)
    const columnHelper = createColumnHelper<BinomeTableRow>();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [isClose, setIsClose] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredBinomeID, setHoveredBinomeID] = useState<number | null>(null);
    const [tableData, setTableData] = useState<BinomeTableRow[]>([]);
    const [numberG, setNumberG] = useState<number>(-1)
    const [postion, setPostion] = useState<number>(1)


    const groupes = useMemo(() => createGroupes(numberG), [numberG]);

    const { mutate } = useMutation({
        mutationFn: (accessToken: string) => getNumberGroupes(accessToken),
        onSuccess: (data) => {
            setNumberG(data.numberGroupe)
        },
        onError: (error) => {
            console.warn(error)
        }
    })
    const columns = useMemo(() => [
        columnHelper.accessor("binomeID", {
            cell: (info) => info.getValue(),
            header: () => <span className="text-lg">#</span>,
        }),

        columnHelper.accessor("fullName", {
            cell: (info) => info.getValue(),
            header: () => <span className="text-white font-medium">Nom et Prénom</span>,
            sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),
        columnHelper.accessor("email", {
            cell: (info) => (
                <span className="italic text-blue-600">{info.getValue()}</span>
            ),
            header: () => <span className="text-white font-medium">Email</span>,
            sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),
        columnHelper.accessor("matricule", {
            cell: (info) => info.getValue(),
            header: () => <span className="text-white font-medium">Matricule</span>,
            sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),
        columnHelper.accessor("sexe", {
            cell: (info) => (
                <span className="italic text-blue-600">{info.getValue()}</span>
            ),
            header: () => <span className="text-white font-medium">Sexe</span>,
            sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),
    ], [columnHelper]);

    const {
        data: binomesData,
        refetch
    } = useQuery({
        queryKey: ["binomes", accessToken],
        queryFn: async ({ queryKey }) => {
            const [, accessToken] = queryKey;
            if (!accessToken) throw new Error("Access token is missing");
            return getListBinommes({ id: postion, accessToken });
        },
    });

    useEffect(() => {
        if (binomesData) {
            const formattedRows: BinomeTableRow[] = binomesData.flatMap(
                (binome: BinomeWithStudents, index: number) => {
                    const rows: BinomeTableRow[] = [];

                    if (binome.etudiant1) {
                        const e1 = binome.etudiant1.user;
                        rows.push({
                            binomeID: index + 1, // since you don’t have an ID field anymore
                            fullName: `${e1.nom} ${e1.prenom}`,
                            email: e1.compte.email,
                            sexe: e1.sexe,
                            matricule: binome.etudiant1.matricule,
                        });
                    }

                    if (binome.etudiant2) {
                        const e2 = binome.etudiant2.user;
                        rows.push({
                            binomeID: index + 1,
                            fullName: `${e2.nom} ${e2.prenom}`,
                            email: e2.compte.email,
                            matricule: binome.etudiant2.matricule,
                            sexe: e2.sexe,
                        });
                    }

                    return rows;
                }
            );

            setTableData(formattedRows);
        }
    }, [binomesData]);

    useEffect(() => {
        if (accessToken) {
            mutate(accessToken)
        }
    }, [accessToken, mutate])

    const table = useReactTable({
        columns,
        data: tableData,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
    });


    return (

        <main className="flex flex-col  py-10 h-svh w-full mx-auto  px-12 bg-[#F4F7FD] relative">

            <div className=" flex justify-between items-center mb-8" >
                {isClose && <CustomSelect responsable={groupes} label="Veuillez sélectionner un groupe :" setPostion={setPostion} refetch={refetch} currentPosition={postion} />}
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
            <div className="bg-white shadow-md max-h-[575px] rounded-lg  overflow-hidden hover:overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <div
                                            className={`flex items-center ${header.column.getCanSort()
                                                ? "cursor-pointer hover:text-gray-300"
                                                : ""
                                                }`}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            <BiSortAlt2
                                                className={`text-xl ml-2 ${header.column.getIsSorted() === "asc"
                                                    ? "text-green-400 rotate-180"
                                                    : header.column.getIsSorted() === "desc"
                                                        ? "text-red-400"
                                                        : "text-white"
                                                    }`}
                                            />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row, index, allRows) => {
                            const currentBinomeID = row.original.binomeID;
                            const previousBinomeID =
                                index > 0 ? allRows[index - 1].original.binomeID : null;
                            const isFirst = currentBinomeID !== previousBinomeID;
                            const rowSpan = allRows.filter(
                                (r) => r.original.binomeID === currentBinomeID
                            ).length;

                            return (
                                <tr
                                    key={row.id}
                                    className={`transition-all cursor-pointer ${hoveredBinomeID === currentBinomeID
                                        ? "bg-[#F4F7FC]"
                                        : ""
                                        }`}
                                    onMouseEnter={() => setHoveredBinomeID(currentBinomeID)}
                                    onMouseLeave={() => setHoveredBinomeID(null)}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        if (cell.column.id === "binomeID") {
                                            return isFirst ? (
                                                <td
                                                    key={cell.id}
                                                    rowSpan={rowSpan}
                                                    className="px-6 py-4  text-center align-middle border-r border-gray-200"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            ) : null;
                                        }

                                        return (
                                            <td
                                                key={cell.id}
                                                className="px-6 py-4 text-sm text-gray-500"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <NavLink
                to="/ens-principale/creer-groupes"
                className="fixed bottom-8 right-4 bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center"
            >
                <BiArrowBack className="text-2xl" />
            </NavLink>
        </main>
    )
}

export default ListeGroupes

