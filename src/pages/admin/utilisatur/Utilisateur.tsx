import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { BiSortAlt2 } from "react-icons/bi";
import { FaSearch, FaUser,  FaUserLock } from "react-icons/fa";
import { FaCircleUser, } from "react-icons/fa6";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { MdEmail } from "react-icons/md";

import { RiDeleteBin5Fill } from "react-icons/ri";
import { TbLockAccess } from "react-icons/tb";

export type BinomesTypes = {
    image?: string;
    etudiantID: number;
    fullName: string;
    email: string;
    matricule: number;
    groupe: number;
};
type Actions = {
    delete: string;
}
export type ColumnSort = {
    id: string;
    desc: boolean;
};
export type SortingState = ColumnSort[];

const generateRandomBinomes = (count: number): BinomesTypes[] => {
    const names = ["Ayyoub Benslimane", "Amira Manaer", "Karim Belhadj", "Nadia Saidi", "Mohamed Chibane", "Leila Hamidi", "Walid Zeroual", "Sonia Khelifi", "Hakim Benyahia", "Yasmine Lounis"];
    const domains = ["gmail.com", "yahoo.com", "outlook.com"];
    const binomes: BinomesTypes[] = [];

    for (let i = 1; i <= count; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const email = name.toLowerCase().replace(" ", "_") + "@" + domains[Math.floor(Math.random() * domains.length)];
        const matricule = 212234520000 + i;
        const groupe = Math.floor(Math.random() * 10) + 1; // Groups from 1 to 10

        binomes.push({
            etudiantID: i,
            fullName: name,
            email,
            matricule,
            groupe,
        });
    }
    return binomes;
};

const list_binome: BinomesTypes[] = generateRandomBinomes(100);

const Utilisateur = () => {
    const columnHelper = createColumnHelper<BinomesTypes | Actions>();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectorUser, setSelectorUser] = useState<BinomesTypes | undefined>();

    const [isopen, setIsopen] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [data, setData] = useState<BinomesTypes[]>(list_binome);


    const columns = useMemo(() => [
        columnHelper.accessor('etudiantID', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="flex items-center text-white font-medium ">
                    <FaUser className="mr-2 " /> ID
                </span>
            ),
        }),
        columnHelper.accessor('matricule', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="flex items-center text-white font-medium text-nowrap">
                    <FaUserLock className="mr-2 text-xl" /> Nom d'utilisateur
                </span>
            ),
        }),
        columnHelper.accessor('fullName', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="font-medium text-white flex items-center text-nowrap ">
                    <FaCircleUser className="mr-2 text-xl" /> Nom et Prénom
                </span>
            ),
        }),
        columnHelper.accessor('email', {
            id: 'email',
            cell: (info) => (
                <span className="italic text-blue-600">{info.getValue() as string} </span>
            ),
            header: () => (
                <span className="flex items-center text-white font-medium">
                    <MdEmail className="mr-2 text-xl" /> Email
                </span>
            ),
        }),
        columnHelper.accessor('groupe', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="font-medium text-white flex items-center ">
                    <TbLockAccess  className="mr-2 text-xl" /> Rôle
                </span>
            ),
        }),
        columnHelper.accessor("delete", {
            cell: ({ row }) => (
                <div
                    className="w-full  flex items-center justify-center pl-2"
                    onClick={() => { setSelectorUser(row.original as BinomesTypes); setIsopen(true); }}
                >
                    <RiDeleteBin5Fill className="mr-2 text-xl text-red-400 hover:text-red-600 " />
                </div>
            ),
            header: "Action"
        }),
    ], [columnHelper]);



    const table = useReactTable({
        columns,
        data,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
    });

    const deleteRow = () => {
        setData(prevData => prevData.filter(row => row.etudiantID !== selectorUser?.etudiantID));
        setIsopen(false);
    };
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
            <div className={`bg-white shadow-md rounded-lg ${pagination.pageSize > 10 ? "overflow-auto" : ""} `}>
                <table className="min-w-full max-h-[574px] divide-y divide-gray-200   ">

                    <thead className="bg-black">
                        {table.getHeaderGroups().map((headerGroupe) => (
                            <tr key={headerGroupe.id}>
                                {headerGroupe.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs text-gray-400 font-medium  uppercase tracking-wider"
                                    >
                                        <div
                                            className={`cursor-pointer select-none flex items-center `}
                                            onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && header.column.columnDef.header !== "Action" && (
                                                <BiSortAlt2
                                                    className={`text-xl ml-2 ${header.column.getIsSorted() === "asc"
                                                        ? "text-green-400 rotate-180"
                                                        : header.column.getIsSorted() === "desc"
                                                            ? "text-red-400"
                                                            : "text-white"
                                                        }`}
                                                />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-[#F4F7FC] transform duration-200 ease-in-out transition-all cursor-pointer"  >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-700">
                <div className="flex items-center mb-4 sm:mb-0">
                    <span className="mr-2 font-medium">Items per page</span>
                    <select className="border bg-white  border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 cursor-pointer"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 15, 20, 30, 40, 50, 100].map((pageSize) => (
                            <option key={pageSize} value={pageSize} >
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2 *:cursor-pointer">
                    <button className="p-2 rounded-md bg-[#4319FF] text-white disabled:opacity-50 transform duration-150 ease-in-out transition"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FiChevronsLeft className="text-xl" />
                    </button>
                    <button className="p-2 rounded-md bg-[#4319FF] text-white disabled:opacity-50 transform duration-150 ease-in-out transition"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FiChevronLeft className="text-xl" />
                    </button>
                    <div className="flex items-center space-x-2">
                        <input
                            min={1}
                            max={table.getPageCount()}
                            type="number"
                            value={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                            className="w-16 py-2 rounded-md border border-gray-300 text-center bg-white ml-2.5"
                        />
                        <span className="ml-1 mr-2.5 text-[17px] font-medium cursor-text"> of {table.getPageCount()}</span>
                    </div>
                    <button className="p-2 rounded-md bg-[#4319FF] text-white disabled:opacity-50 transform duration-150 ease-in-out transition"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <FiChevronRight className="text-xl" />
                    </button>
                    <button className="p-2 rounded-md bg-[#4319FF] text-white disabled:opacity-50 transform duration-150 ease-in-out transition"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <FiChevronsRight className="text-xl" />
                    </button>
                </div>
            </div>

            {
                isopen && <div className="z-50 w-[520px] h-56 bg-white flex flex-col items-center justify-center rounded-[20px]  drop-shadow-lg shadow absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" >
                    <div className="mb-6">
                        <h2 className=" font-medium text-xl mb-2">Voulez-vous vraiment supprimer cet utilisateur  ?</h2>
                        <div className="flex flex-col px-6 font-serif ">
                            <p>Nom et Pernom : <span className="text-blue-600">{selectorUser?.fullName}</span></p>
                            <p>Email : <span className="text-blue-600">{selectorUser?.email}</span></p>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center gap-x-6 ">
                        <button className="outline-none w-44  border border-gray-400 text-black hover:bg-gray-950 rounded-md py-1.5 hover:text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => { setIsopen(false); }} >
                            Annuler
                        </button>
                        <button className="outline-none w-44 border-none  bg-red-500 hover:bg-red-700 rounded-md py-1.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={deleteRow}  >
                            supprimer
                        </button>
                    </div>
                </div>
            }
            <section className={` ${isopen ? "absolute top-0 left-0 w-full h-svh bg-black/45 z-30" : ""} `}></section>
        </main>

    )
}

export default Utilisateur;
