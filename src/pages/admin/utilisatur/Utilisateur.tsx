import { useMutation, useQuery } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { BiSortAlt2 } from "react-icons/bi";
import { FaSearch, } from "react-icons/fa";
import { FaCircleUser, } from "react-icons/fa6";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useAuthStore } from "../../../store";



const getAllUsers = async (accessToken: string) => {
    const response = await fetch('http://localhost:4000/api/admin/all-users', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to get all users');
    }

    return response.json();
}
const deleteUser = async ({ email, accessToken }: { accessToken: string, email: string }) => {
    console.log({ email, accessToken })
    const response = await fetch('http://localhost:4000/api/admin/user', {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify( {email })
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }

    return response.json();
}

type User = {
    email: string;
    nom: string;
    prenom: string;
    role: 'etudiant' | 'enseignant' | 'admin';
};
export type ColumnSort = {
    id: string;
    desc: boolean;
};
export type SortingState = ColumnSort[];

const Utilisateur = () => {
    const accessToken = useAuthStore((state) => state.accessToken)
    const { data: usersData, refetch } = useQuery({
        queryKey: ["users", accessToken],
        queryFn: ({ queryKey }) => getAllUsers(queryKey[1] as string),
        enabled: !!accessToken,
    })

    const columnHelper = createColumnHelper<User>();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectorUser, setSelectorUser] = useState<User | undefined>();

    const [isopen, setIsopen] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [data, setData] = useState<User[]>([]);


    const columns = [
        columnHelper.display({
            cell: (row) => row.row.index + 1,
            header: "#"
        }),
        columnHelper.accessor(row => `${row.nom} ${row.prenom}`, {
            id: "fullName",
            cell: (info) => (
                <span className="flex items-center">
                    <FaCircleUser className="mr-2 text-xl" />
                    {info.getValue()}
                </span>
            ),
            header: () => (
                <span className="flex items-center text-white font-medium text-nowrap">
                    Nom et Prénom
                </span>
            ),
        }),
        columnHelper.accessor("email", {
            id: 'email',
            cell: (info) => (
                <span className="italic text-blue-600">{info.getValue() as string} </span>
            ),
            header: () => (
                <span className="flex items-center text-white font-medium">
                    Email
                </span>
            ),
        }),
        columnHelper.accessor("role", {
            cell: (info) => (
                <span className="italic text-blue-600">{info.getValue().toLocaleUpperCase()} </span>
            ),
            header: () => (
                <span className="flex items-center text-white font-medium">
                    Role
                </span>
            ),
        }),

        columnHelper.display(
            {
                id: "delete",
                cell: ({ row }) => (
                    <div
                        className="w-full  flex items-center justify-center pl-2"
                        onClick={() => { setSelectorUser(row.original); setIsopen(true); }}
                    >
                        <RiDeleteBin5Fill className="mr-2 text-xl text-red-400 hover:text-red-600 " />
                    </div>
                ),
                header: "Action"
            }),
    ];

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

    const { mutate } = useMutation({
        mutationFn: ({ email, accessToken }: { accessToken: string, email: string }) => deleteUser({ email, accessToken }),
        onSuccess: (data) => {
            console.log(data)
            setIsopen(false)
            refetch()
        },
        onError: (error) => {
            console.warn(error)
        }
    })

    const deleteFn = () => {
        if (selectorUser && accessToken) { mutate({ email: selectorUser.email, accessToken }) }
    }
    useEffect(() => {
        if (usersData) {
            setData(usersData)
        }
    }, [usersData])
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
                            <p className="pb-1">Email : <span className="text-blue-600">{selectorUser?.email}</span></p>
                            <p>Nom et Pernom : <span className="text-blue-600">{selectorUser?.nom} {selectorUser?.prenom}</span></p>

                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center gap-x-6 ">
                        <button className="outline-none w-44  border border-gray-400 text-black hover:bg-gray-950 rounded-md py-1.5 hover:text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => { setIsopen(false); }} >
                            Annuler
                        </button>
                        <button className="outline-none w-44 border-none  bg-red-500 hover:bg-red-700 rounded-md py-1.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={deleteFn}  >
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
