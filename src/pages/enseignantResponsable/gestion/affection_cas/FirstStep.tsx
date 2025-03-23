
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getSortedRowModel,
  Row,
  SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { BiSortAlt2 } from "react-icons/bi";
import { FaUser, FaUserGraduate } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiIdentificationCardFill } from "react-icons/pi";
import { BinomesTypes } from "../../consultation/GroupeBinome";
import { useNavigate } from "react-router";

import { useShallow } from "zustand/shallow";
import { useAffectionCasStore } from "../../../../store";





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
  const setBinomeID = useAffectionCasStore(useShallow((state) => state.setBinomeID));
  const setNextstep = useAffectionCasStore(useShallow((state) => state.setNextstep));
  const nextstep = useAffectionCasStore(useShallow((state) => state.nextStep));
  const addUser = useAffectionCasStore(useShallow((state) => state.addUser));
  const deleteAllCas = useAffectionCasStore(useShallow((state) => state.deleteAllCas));
  const binomeID = useAffectionCasStore((state) => state.binomeId);
  const navigate = useNavigate();
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
  const nextStep = (id: number) => {
    const filter: BinomesTypes[] = list_binome.filter((item) => item.binomeID === id);
    if (binomeID !== id) { 
        deleteAllCas()
    }
    if (setBinomeID && filter.length > 0) {
      setBinomeID(id);
      addUser(filter);
      setNextstep(!nextstep);
      navigate('/gestion-affection-les-cas/step2');
    }
  };
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
                    onClick={() => nextStep(row.original.binomeID)}
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

export default FirstStep;