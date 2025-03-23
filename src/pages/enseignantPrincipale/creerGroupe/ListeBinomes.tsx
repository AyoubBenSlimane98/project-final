import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    Row,

} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { BiArrowBack, BiSortAlt2 } from "react-icons/bi";
import { FaSearch, FaUser, FaUserGraduate } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";

import { MdEmail } from "react-icons/md";
import { PiIdentificationCardFill } from "react-icons/pi";
import { NavLink } from "react-router";

export type BinomesTypes = {
    image?: string;
    etudiantID: number;
    fullName: string;
    email: string;
    matricule: number;
    groupe: number;
    binomeID: number;
};

export type ColumnSort = {
    id: string;
    desc: boolean;
};
export type SortingState = ColumnSort[];
const list_binome: BinomesTypes[] = [
    {
        etudiantID: 1,
        fullName: "Ayyoub Benslimane",
        email: "ayyoub_benslimane@gmail.com",
        matricule: 212234521344,
        groupe: 1,
        binomeID: 1,
    },
    {
        etudiantID: 2,
        fullName: "Amira Manaer",
        email: "amira_manar@gmail.com",
        matricule: 212234521997,
        groupe: 1,
        binomeID: 1,
    },
    {
        etudiantID: 3,
        fullName: "Karim Belhadj",
        email: "karim_belhadj@gmail.com",
        matricule: 212234522111,
        groupe: 2,
        binomeID: 2,
    },
    {
        etudiantID: 4,
        fullName: "Nadia Saidi",
        email: "nadia_saidi@gmail.com",
        matricule: 212234522222,
        groupe: 2,
        binomeID: 3,
    },
    {
        etudiantID: 5,
        fullName: "Mohamed Chibane",
        email: "mohamed_chibane@gmail.com",
        matricule: 212234523333,
        groupe: 3,
        binomeID: 4,
    },


    {
        etudiantID: 8,
        fullName: "Leila Hamidi",
        email: "leila_hamidi@gmail.com",
        matricule: 212234526666,
        groupe: 4,
        binomeID: 4,
    },
    {
        etudiantID: 9,
        fullName: "Walid Zeroual",
        email: "walid_zeroual@gmail.com",
        matricule: 212234527777,
        groupe: 5,
        binomeID: 5,
    },
    {
        etudiantID: 10,
        fullName: "Sonia Khelifi",
        email: "sonia_khelifi@gmail.com",
        matricule: 212234528888,
        groupe: 5,
        binomeID: 5,
    },

    {
        etudiantID: 12,
        fullName: "Hana Boumediene",
        email: "hana_boumediene@gmail.com",
        matricule: 212234530000,
        groupe: 6,
        binomeID: 6,
    },
    {
        etudiantID: 13,
        fullName: "Omar Benzema",
        email: "omar_benzema@gmail.com",
        matricule: 212234531111,
        groupe: 7,
        binomeID: 7,
    },
    {
        etudiantID: 14,
        fullName: "Kenza Tahar",
        email: "kenza_tahar@gmail.com",
        matricule: 212234532222,
        groupe: 7,
        binomeID: 7,
    },
    {
        etudiantID: 15,
        fullName: "Adel Mehdi",
        email: "adel_mehdi@gmail.com",
        matricule: 212234533333,
        groupe: 8,
        binomeID: 8,
    },
    {
        etudiantID: 16,
        fullName: "Fatima Rahmani",
        email: "fatima_rahmani@gmail.com",
        matricule: 212234534444,
        groupe: 8,
        binomeID: 8,
    },
    {
        etudiantID: 17,
        fullName: "Sofiane Larbi",
        email: "sofiane_larbi@gmail.com",
        matricule: 212234535555,
        groupe: 9,
        binomeID: 9,
    },
    {
        etudiantID: 18,
        fullName: "Amina Ziani",
        email: "amina_ziani@gmail.com",
        matricule: 212234536666,
        groupe: 9,
        binomeID: 9,
    },
    {
        etudiantID: 19,
        fullName: "Noureddine Hakimi",
        email: "noureddine_hakimi@gmail.com",
        matricule: 212234537777,
        groupe: 10,
        binomeID: 10,
    },
    {
        etudiantID: 20,
        fullName: "Samira Benyahia",
        email: "samira_benyahia@gmail.com",
        matricule: 212234538888,
        groupe: 10,
        binomeID: 10,
    },
    {
        etudiantID: 11,
        fullName: "Rachid Benamara",
        email: "rachid_benamara@gmail.com",
        matricule: 212234529999,
        groupe: 6,
        binomeID: 11,
    },
];


const customFilterFn = (row: Row<BinomesTypes>, columnId: string, filterValue: string) => {
    const value = row.original[columnId as keyof BinomesTypes];

    if (!value) return false; // Skip null/undefined values

    return String(value).toLowerCase().includes(filterValue.toLowerCase());
};
const customSortingFn = (
    rowA: Row<BinomesTypes>,
    rowB: Row<BinomesTypes>,
    columnId: string
): number => {
    const valueA = rowA.original[columnId as keyof BinomesTypes] ?? "";
    const valueB = rowB.original[columnId as keyof BinomesTypes] ?? "";

    console.log("value", valueA);

    const binomeA = rowA.original.binomeID;
    const binomeB = rowB.original.binomeID;

    if (binomeA === binomeB) {
        return valueA.toString().localeCompare(valueB.toString());
    }

    return binomeA - binomeB;
};

const ListeBinomes = () => {
    const columnHelper = createColumnHelper<BinomesTypes>();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [hoveredBinomeID, setHoveredBinomeID] = useState<number | null>(null);
    const columns = useMemo(() => [
        columnHelper.accessor('binomeID', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="flex items-center text-white font-medium">
                    <FaUser className="mr-2 " /><span className="text-lg"> #</span>
                </span>
            ),
            sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),
        columnHelper.accessor('matricule', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="flex items-center text-white font-medium">
                    <PiIdentificationCardFill className="mr-2 text-xl" />   Matricule
                </span>
            ),
            sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),

        columnHelper.accessor('fullName', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="font-medium text-white flex items-center text-nowrap ">
                    <FaUserGraduate className="mr-2 text-xl" />  Nom et Prénom
                </span>
            ), sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),
        columnHelper.accessor('email', {
            id: 'email',
            cell: (info) => (
                <span className="italic text-blue-600">{info.getValue()}</span>
            ),
            header: () => (
                <span className="flex items-center text-white font-medium">
                    <MdEmail className="mr-2 text-xl" /> Email
                </span>
            ), sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),
        columnHelper.accessor('groupe', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="font-medium text-white flex items-center ">
                    <FaPeopleGroup className="mr-2 text-xl" /> Groupe section
                </span>
            ), sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),

    ], [columnHelper]);
    const [data] = useState<BinomesTypes[]>(list_binome);
    const table = useReactTable({
        columns,
        data,
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
    return (
        <main className="flex flex-col h-svh w-full mx-auto py-10 px-4 sm:px-6 lg:px-8  bg-[#F4F7FD]  relative ">
            <div className="mb-8 relative">
                <input
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FaSearch className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
            </div>
            <div className={`bg-white shadow-md max-h-[575px]  rounded-lg  overflow-auto `}>
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
                                                {header.column.getIsSorted() === "asc" ? (
                                                    <BiSortAlt2 className="text-xl text-green-400 ml-2 rotate-180" />
                                                ) : header.column.getIsSorted() === "desc" ? (
                                                    <BiSortAlt2 className="text-xl text-red-400 ml-2" />
                                                ) : (
                                                    <BiSortAlt2 className="text-xl text-white ml-2" />
                                                )}
                                            </div>
                                        </th>
                                    ))
                                }
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row, index, rows) => {
                            const currentBinomeID = row.original.binomeID;
                            const prevBinomeID = index > 0 ? rows[index - 1].original.binomeID : null;
                            const isFirstOccurrence = currentBinomeID !== prevBinomeID;
                            const rowSpan = rows.filter((r) => r.original.binomeID === currentBinomeID).length;

                            return (
                                <tr
                                    key={row.id}
                                    className={`transition-all cursor-pointer ${hoveredBinomeID === currentBinomeID ? "bg-[#F4F7FC]" : ""
                                        }`}
                                    onMouseEnter={() => setHoveredBinomeID(currentBinomeID)}
                                    onMouseLeave={() => setHoveredBinomeID(null)}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        // Columns to merge (binomeID, matricule, groupe)
                                        if (["binomeID"].includes(cell.column.id)) {
                                            return isFirstOccurrence ? (
                                                <td key={cell.id} rowSpan={rowSpan} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold text-center align-middle">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ) : null; // Hide duplicated rows
                                        }

                                        // Show fullName and email separately for each student
                                        return (
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
            <NavLink to="/ens-principale/creer-groupes" className=" fixed bottom-8  right-4 bg-green-500 hover:bg-green-600 transform ease-in-out duration-300 transition-all text-white w-12 h-12 rounded-full flex items-center justify-center">
                <BiArrowBack className="text-2xl" />
            </NavLink>
        </main>

    )
}

export default ListeBinomes;