import { useQuery } from "@tanstack/react-query";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { BiArrowBack, BiSortAlt2 } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { NavLink } from "react-router";

const getListBinommes = async () => {
    const response = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) throw new Error("Cannot fetch binômes!");
    return response.json();
};

export type BinomeWithStudents = {
    id: number;
    Etudaint1: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        matricul: string;
    };
    Etudaint2: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        matricul: string;
    } | null;
};


export type BinomeTableRow = {
    binomeID: number;
    fullName: string;
    email: string;
    matricule: string;
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

const ListeBinomes = () => {
    const columnHelper = createColumnHelper<BinomeTableRow>();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [hoveredBinomeID, setHoveredBinomeID] = useState<number | null>(null);
    const [tableData, setTableData] = useState<BinomeTableRow[]>([]);

    const columns = [
        columnHelper.accessor("binomeID", {
            cell: (info) => info.getValue(),
            header: () => <span className="text-lg">#</span>,
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
    ];

    const {
        data: binomesData,
        isLoading,
        isError,
    } = useQuery({ queryKey: ["binomes"], queryFn: getListBinommes });

    useEffect(() => {
        if (binomesData) {
            const formattedRows: BinomeTableRow[] = binomesData.flatMap((binome: BinomeWithStudents) => {
                const rows: BinomeTableRow[] = [];

                if (binome.Etudaint1) {
                    rows.push({
                        binomeID: binome.id,
                        fullName: `${binome.Etudaint1.nom} ${binome.Etudaint1.prenom}`,
                        email: binome.Etudaint1.email,
                        matricule: binome.Etudaint1.matricul,
                    });
                }

                if (binome.Etudaint2) {
                    rows.push({
                        binomeID: binome.id,
                        fullName: `${binome.Etudaint2.nom} ${binome.Etudaint2.prenom}`,
                        email: binome.Etudaint2.email,
                        matricule: binome.Etudaint2.matricul,
                    });
                }

                return rows;
            });

            setTableData(formattedRows);
        }

    }, [binomesData]);


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

    if (isLoading)
        return <div className="text-center mt-10">Chargement des données...</div>;

    if (isError)
        return (
            <div className="text-center mt-10 text-red-500">
                Une erreur s’est produite lors du chargement des binômes.
            </div>
        );

    return (
        <main className="flex flex-col  py-10 h-svh w-full mx-auto  px-12 bg-[#F4F7FD] relative">
            <div className="mb-9  relative ">
                <input
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className=" w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                />
                <FaSearch className="absolute left-3  top-1/2 -translate-y-1/2 text-gray-400" />
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
    );
};

export default ListeBinomes;


