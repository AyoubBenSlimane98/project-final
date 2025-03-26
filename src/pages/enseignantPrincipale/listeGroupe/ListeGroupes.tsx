import { ChangeEvent, useEffect, useState, } from "react";
import { FaSearch } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
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
import { FaUser, FaUserGraduate } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { PiIdentificationCardFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";





export type BinomesTypes = {
    image?: string;
    etudiantID: number;
    fullName: string;
    email: string;
    matricule: number;
    groupe: number;
    binomeID: number;
};
type CustomSelectProps = {
    responsable: string[];
    label: string;
    width?: string
    heightInput?: string
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
        image: "https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        etudiantID: 2,
        fullName: "Amira Manaer",
        email: "amira_manar@gmail.com",
        matricule: 212234521997,
        groupe: 1,
        binomeID: 1,
        image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        etudiantID: 3,
        fullName: "Karim Belhadj",
        email: "karim_belhadj@gmail.com",
        matricule: 212234522111,
        groupe: 2,
        binomeID: 2,
        image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        etudiantID: 4,
        fullName: "Nadia Saidi",
        email: "nadia_saidi@gmail.com",
        matricule: 212234522222,
        groupe: 2,
        binomeID: 3,
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        etudiantID: 5,
        fullName: "Mohamed Chibane",
        email: "mohamed_chibane@gmail.com",
        matricule: 212234523333,
        groupe: 3,
        binomeID: 4,
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        etudiantID: 8,
        fullName: "Leila Hamidi",
        email: "leila_hamidi@gmail.com",
        matricule: 212234526666,
        groupe: 4,
        binomeID: 4,
        image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        etudiantID: 9,
        fullName: "Walid Zeroual",
        email: "walid_zeroual@gmail.com",
        matricule: 212234527777,
        groupe: 5,
        binomeID: 5,
        image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        etudiantID: 10,
        fullName: "Sonia Khelifi",
        email: "sonia_khelifi@gmail.com",
        matricule: 212234528888,
        groupe: 5,
        binomeID: 5,
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        etudiantID: 12,
        fullName: "Hana Boumediene",
        email: "hana_boumediene@gmail.com",
        matricule: 212234530000,
        groupe: 6,
        binomeID: 6,
        image: "https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        etudiantID: 13,
        fullName: "Omar Benzema",
        email: "omar_benzema@gmail.com",
        matricule: 212234531111,
        groupe: 7,
        binomeID: 7,
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
];
const groupes: string[] = ["Groupe 1", "Groupe 2", "Groupe 3", "Groupe 4", "Groupe 5", "Groupe 6", "Groupe 7", "Groupe 8"]

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

function CustomSelect({ responsable, label, width = "w-80", heightInput = "py-2.5" }: CustomSelectProps) {
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
                                    onClick={() => handleSelection(item)}
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

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isClose, setIsClose] = useState<boolean>(true);
    const columnHelper = createColumnHelper<BinomesTypes>();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [hoveredBinomeID, setHoveredBinomeID] = useState<number | null>(null);

    const columns = [
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
                    <FaPeopleGroup className="mr-2 text-xl" /> Groupe
                </span>
            ), sortingFn: customSortingFn,
            filterFn: customFilterFn,
        }),


    ];
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
        <section className="flex flex-col  h-svh w-full gap-4 mx-auto py-10 px-4 sm:px-6 lg:px-8  bg-[#F4F7FD] relative ">
            <section className="">
                <div className=" flex justify-between items-center mb-8">
                    {isClose && <CustomSelect responsable={groupes} label="Veuillez sélectionner un groupe :" />}
                    {isOpen ? <div className={` ${isClose ? "" : "w-full"} flex transform duration-300 ease-in transition-all`}>
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
                    </div>}

                </div>
                <div className={`bg-white shadow-md max-h-[595px]  rounded-lg  overflow-auto `}>
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
                                                    ) :
                                                        <BiSortAlt2 className="text-xl text-white ml-2" />
                                                    }
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
                                        className={`transition-all cursor-pointer  ${hoveredBinomeID === currentBinomeID ? "bg-[#F4F7FC]" : ""
                                            }`}
                                        onMouseEnter={() => setHoveredBinomeID(currentBinomeID)}
                                        onMouseLeave={() => setHoveredBinomeID(null)}
                                    >
                                        {row.getVisibleCells().map((cell) => {

                                            if (["binomeID"].includes(cell.column.id)) {
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

            <NavLink to="/ens-principale/gestion-groupes" className=" fixed bottom-6  right-4 bg-green-500 hover:bg-green-600 transform ease-in-out duration-300 transition-all text-white w-12 h-12 rounded-full flex items-center justify-center">
                <BiArrowBack className="text-2xl" />
            </NavLink>
        </section>
    )
}

export default ListeGroupes
