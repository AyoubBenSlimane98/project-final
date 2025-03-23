
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
    getSortedRowModel,
    Row,
    SortingState,
} from "@tanstack/react-table";
import { useContext, useEffect, useMemo, useState } from "react";
import { BiSortAlt2 } from "react-icons/bi";
import { FaUser, FaUserGraduate } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiIdentificationCardFill } from "react-icons/pi";
import { BinomesTypes } from "../../consultation/GroupeBinome";
import { IoCloseOutline } from "react-icons/io5";
import { AffResContext } from "../../../../context";

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



const FirstStep = () => {
    const context = useContext(AffResContext);
    const columnHelper = createColumnHelper<BinomesTypes>();
    const [hoveredBinome, setHoveredBinome] = useState<number | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns = useMemo(() => [
        columnHelper.accessor('binomeID', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="flex items-center text-white font-medium">
                    <FaUser className="mr-2 " /><span className="text-lg"> #</span>
                </span>
            ),
            sortingFn: customSortingFn,

        }),
        columnHelper.accessor('matricule', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="flex items-center text-white font-medium">
                    <PiIdentificationCardFill className="mr-2 text-xl" />   Matricule
                </span>
            ),
            sortingFn: customSortingFn,

        }),

        columnHelper.accessor('fullName', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="font-medium text-white flex items-center text-nowrap ">
                    <FaUserGraduate className="mr-2 text-xl" />  Nom et Prénom
                </span>
            ), sortingFn: customSortingFn,

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

        }),
        columnHelper.accessor('groupe', {
            cell: (info) => info.getValue(),
            header: () => (
                <span className="font-medium text-white flex items-center ">
                    <FaPeopleGroup className="mr-2 text-xl" /> Groupe
                </span>
            ), sortingFn: customSortingFn,

        }),

    ], [columnHelper]);

    const [data] = useState<BinomesTypes[]>(list_binome);

    const table = useReactTable({
        columns,
        data,
        state: {
            sorting,

        },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        sortingFns: {
            binomeSorting: customSortingFn,
        },


    });


    const rowSpanMap = useMemo(() => {
        const spanMap: Record<number, number> = {};
        data.forEach((row) => {
            spanMap[row.binomeID] = (spanMap[row.binomeID] || 0) + 1;
        });
        return spanMap;
    }, [data]);

    const seenBinomeIDs = new Set<number>();
    return (
        <section className=" w-full md:max-w-4xl  py-4 mb-4 sm:h-svh   ">
            <div className="overflow-x-auto lg:overflow-hidden bg-white shadow-md rounded-lg">
                <table className="sm:min-w-full divide-y divide-gray-200 ">
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
                        {
                            table.getRowModel().rows.map((row) => {
                                const { binomeID } = row.original;
                                const isFirstOccurrence = !seenBinomeIDs.has(binomeID);
                                if (isFirstOccurrence) seenBinomeIDs.add(binomeID);

                                return (
                                    <tr
                                        key={row.id}
                                        className={`${hoveredBinome === binomeID ? "bg-gray-100" : ""}`}
                                        onMouseEnter={() => setHoveredBinome(binomeID)}
                                        onMouseLeave={() => setHoveredBinome(null)}
                                        onClick={() => { context.setBinomeID(row.original.binomeID); context.setIsOpen(!context.isOpen) }}
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            const columnId = cell.column.id;
                                            if (columnId === "binomeID" && isFirstOccurrence) {
                                                return (
                                                    <td
                                                        key={cell.id}
                                                        rowSpan={rowSpanMap[binomeID]}
                                                        className="px-6 py-4 text-sm font-bold text-gray-700 border-r border-r-gray-200"
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                );
                                            } else if (columnId === "binomeID") {
                                                return null; // Hide duplicate binomeID cells
                                            }

                                            return (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </section>
    )

}


function CardInfo({
    fullName,
    image,
    groupe,
}: BinomesTypes) {

    return (
        <div className={`flex  flex-col py-6 sm:flex-row items-center    px-4 gap-4    sm:py-2 outline-none`}>
            <img src={image}
                alt=""
                className="w-10 h-10 rounded-full object-cover" loading="lazy" />
            <div className=" shrink-0 flex flex-col ">
                <span className="font-medium">{fullName}</span>
                <span className="text-gray-500 text-sm">Groupe {groupe}</span>
            </div>

        </div>
    )
}

function CardResponsable() {
    const [selection, setSelection] = useState("etape");
    const context = useContext(AffResContext);
    const [data, setData] = useState<BinomesTypes[]>([]);

    useEffect(() => {
        if (context) {
            const filter = list_binome.filter((binome) => binome.binomeID === context.binomeID);
            setData(filter);
        }
    }, [context]);

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white w-xl flex flex-col items-center justify-center gap-y-2 px-6 pt-4 rounded-xl shadow-gray-200 border border-gray-200">
            <div className="flex relative mt-10">
                <h2 className="text-lg font-semibold text-center mb-2">
                    Voulez-vous que cette binôme devienne responsable de ?
                </h2>
                <IoCloseOutline
                    className="absolute -top-10 -right-8 text-3xl cursor-pointer"
                    onClick={() => context?.setIsOpen?.(false)}
                />
            </div>
            <div className="flex">
                {data.map((_d) => (
                    <CardInfo key={_d.binomeID} {..._d} />
                ))}
            </div>
            <div className="flex justify-evenly py-2 w-96 gap-y-1">
                <div className="space-x-2">
                    <input
                        type="radio"
                        name="responsable"
                        id="etape"
                        value="etape"
                        checked={selection === "etape"}
                        onChange={() => setSelection("etape")}
                    />
                    <label htmlFor="etape" className="cursor-pointer font-medium">
                        Étape
                    </label>
                </div>
                <div className="space-x-2">
                    <input
                        type="radio"
                        name="responsable"
                        id="memoire"
                        value="memoire"
                        checked={selection === "memoire"}
                        onChange={() => setSelection("memoire")}
                    />
                    <label htmlFor="memoire" className="cursor-pointer font-medium">
                        Mémoire
                    </label>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-x-6 mb-8">
                <button className="outline-none w-44 border border-gray-200 hover:bg-red-500 rounded-md py-1.5 hover:text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer" onClick={() => context?.setIsOpen?.(false)} >
                    No
                </button>
                <button className="outline-none w-44 bg-blue-500 hover:bg-blue-700 rounded-md py-1.5 text-white font-medium transform duration-200 ease-in-out transition-all cursor-pointer">
                    Oui
                </button>
            </div>
        </div>
    );
}

const AffectionResponsablite = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [binomeID, setBinomeID] = useState<number | null>(null);
    return (
        <AffResContext.Provider value={{ isOpen, setIsOpen, binomeID, setBinomeID }}>
            <main className='mt-20 w-full h-svh flex justify-center relative'>
                <FirstStep />
                {isOpen && <CardResponsable />}
            </main>
        </AffResContext.Provider >
    )
}

export default AffectionResponsablite