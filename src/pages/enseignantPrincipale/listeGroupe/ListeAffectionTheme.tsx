import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { BiArrowBack, BiSortAlt2 } from "react-icons/bi"
import { FaSearch } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { MdGroups2 } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";
import { NavLink } from "react-router"
import { useAuthStore } from "../../../store";
import { useQuery } from "@tanstack/react-query";

type GroupeAffectation = {
    groupe: string;
    fullName: string;
    sujet: string;
};

export type ColumnSort = {
    id: string;
    desc: boolean;
};

const getAllAffectation = async (accessToken: string) => {
    const response = await fetch(`http://localhost:4000/api/principal/sujet-affecrer`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) throw new Error("Cannot fetch for get affection themes");
    return response.json();
};
export type SortingState = ColumnSort[];
const ListeAffectionTheme = () => {
    const accessToken = useAuthStore((state) => state.accessToken)
    const columnHelper = createColumnHelper<GroupeAffectation>();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const { data: dataAffectation } = useQuery({
        queryKey: ['affect'],
        queryFn: () => getAllAffectation(accessToken!),
        enabled: !!accessToken
    });

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 8,
    });

    const [dataAffect, setDataAffect] = useState<GroupeAffectation[]>([]);
    useEffect(() => {
        if (dataAffectation) {
            setDataAffect(dataAffectation)
        }
    }, [dataAffectation])
    const columns = useMemo(() => [
        columnHelper.display({
            id: 'rowIndex',
            cell: (info) => info.row.index + 1,
            header: () => (
                <span className="flex items-center text-white font-medium">
                     N°
                </span>
            ),
        }),

        columnHelper.accessor('fullName', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="font-medium text-white flex items-center text-nowrap ">
                    <FaCircleUser className="mr-2 text-xl" /> Enseignant responsable
                </span>
            ),
        }),
        columnHelper.accessor("sujet", {

            cell: (info) => (
                <span className="italic text-blue-600">{info.getValue()} </span>
            ),
            header: () => (
                <span className="flex items-center text-white font-medium">
                    <RiPagesLine className="mr-2 text-xl" /> Theme
                </span>
            ),
        }),
        columnHelper.accessor('groupe', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="font-medium text-white flex items-center ">
                    <MdGroups2 className="mr-2 text-xl" /> Groupe
                </span>
            ),
        }),
    ], [columnHelper]);



    const table = useReactTable({
        columns,
        data: dataAffect,
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
    return (
        <section className="flex flex-col  h-svh w-full gap-4 mx-auto py-14 px-4 sm:px-6 lg:px-8  bg-[#F4F7FD]  relative ">
            <div className="relative w-full mb-6">
                <input
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FaSearch className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
            </div>
            <div className={`bg-white w-full max-h-[468px] shadow-md rounded-lg ${pagination.pageSize > 8 ? "overflow-auto" : ""}  mb-3`}>
                <table className="min-w-full  divide-y divide-gray-200   ">
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
            <div className="flex flex-col sm:flex-row justify-between items-center  text-sm text-gray-700 w-full">
                <div className="flex items-center mb-4 sm:mb-0">
                    <span className="mr-2 font-medium">Items per page</span>
                    <select className="border bg-white  border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 cursor-pointer w-20"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                        {[4, 8, 12, 16, 20].map((pageSize) => (
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
            <NavLink to="/ens-principale/affecter-theme" className=" fixed bottom-8  right-4 bg-green-500 hover:bg-green-600 transform ease-in-out duration-300 transition-all text-white w-12 h-12 rounded-full flex items-center justify-center">
                <BiArrowBack className="text-2xl" />
            </NavLink>
        </section>
    )
}

export default ListeAffectionTheme

