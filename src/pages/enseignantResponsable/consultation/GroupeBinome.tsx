import { ChangeEvent, useEffect, useState, } from "react";
import { FaSearch } from "react-icons/fa";
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
    getFilteredRowModel,
    Row,
} from "@tanstack/react-table";


import { useAuthStore, useGroupeStore } from "../../../store";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";


import { useShallow } from "zustand/shallow";
import { useQuery } from "@tanstack/react-query";
import { IoMdCheckmark } from "react-icons/io";

type StudentBinome = {
    idB: number;
    matricule: string;
    fullName: string;
    groupe: string;
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
    const response = await fetch(`http://localhost:4000/api/responsable/all-groupes/${idG}`, {
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

const GroupeBinome = () => {
    const groupe = useGroupeStore(useShallow((state) => state.groupe))
    const accessToken = useAuthStore((state) => state.accessToken)

    const columnHelper = createColumnHelper<StudentBinome>();
    const [hoveredBinomeID, setHoveredBinomeID] = useState<number | null>(null);

    const [globalFilter, setGlobalFilter] = useState('');

    const [isClose, setIsClose] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);


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
            return await getMemmbersGroupes({ accessToken: accessToken!, idG: groupe });
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





    console.log("Data : ", memmbersGroupe)
    return (

        <main className="flex flex-col items-center  py-10 h-svh w-full mx-auto  px-12 bg-[#F4F7FD] relative mt-20">

            <div className="w-[80%]  flex justify-between items-center mb-8" >
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
            <div className={`bg-white shadow-md max-h-[595px] w-[80%]   rounded-lg  overflow-auto`}>
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

        </main>
    )
}

export default GroupeBinome;