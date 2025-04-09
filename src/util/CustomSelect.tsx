import { ChangeEvent, useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
type CustomSelectProps = {
    responsable: string[];
    label?: string;
};

export const CustomSelect = ({ responsable, label }: CustomSelectProps) => {
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
        <div className='w-full flex flex-col gap-2 text-[#09090B] ' >
            {label && <h2 className='block text-md font-medium text-gray-700'>{label} </h2>}
            <div className='relative w-full'>
                <div className='relative mb-2'>
                    <input
                        type="text"
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4'
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
                    <ul className='absolute z-10 w-full space-y-0.5 bg-white border border-gray-300 rounded-md shadow-lg px-1.5 py-2 max-h-48 overflow-auto'>
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


