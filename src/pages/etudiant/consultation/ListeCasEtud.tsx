import { useState } from "react"
import { IoClose } from "react-icons/io5";

function InfoCas({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {

    return (
        <div className="shrink-0 w-full h-20 bg-white rounded-2xl flex items-center justify-between px-6 relative drop-shadow shadow border border-gray-50 cursor-pointer ">
            <p className="max-w-4xl text-nowrap line-clamp-1  ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis molestias
            </p>
            <button className="border border-gray-300 w-32 py-1.5 rounded-full hover:bg-black hover:text-white hover:border-none transform duration-300 ease-in-out transition-all cursor-pointer" onClick={() => { setIsOpen(true) }}>Détails</button>

        </div>
    )
}
const ListeCasEtud = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <section className="  w-full h-svh  bg-slate-100 px-10 flex flex-col justify-center items-center pt-20">
            <div className="bg-white w-full py-4 px-4  rounded-md">
                <h2 className="text-4xl font-semibold py-6">la list de ses cas :</h2>
                <div className="bg-slate-100 w-full flex flex-col gap-5 py-6 px-6  h-[520px] overflow-hidden hover:overflow-auto rounded-md">
                    <InfoCas setIsOpen={setIsOpen} />
                    <InfoCas setIsOpen={setIsOpen} />
                    <InfoCas setIsOpen={setIsOpen} />
                    <InfoCas setIsOpen={setIsOpen} />
                    <InfoCas setIsOpen={setIsOpen} />
                    <InfoCas setIsOpen={setIsOpen} />
                    <InfoCas setIsOpen={setIsOpen} />
                    <InfoCas setIsOpen={setIsOpen} />
                    <InfoCas setIsOpen={setIsOpen} />
                    
                </div>
                {isOpen && <div className={`absolute w-xl bg-white drop-shadow-xl shadow-lg rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  border border-gray-300 z-[9999]`} >
                    <div className="w-full relative px-4 py-6">
                        <IoClose className="text-gray-400 text-2xl absolute right-2 top-3 hover:text-red-500 transform duration-300 ease-in-out transition-all cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
                        <h2 className="py-2">Decription :</h2>
                        <p className="font-extralight text-gray-950">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus blanditiis atque dolores laboriosam molestias ipsa iure iusto reiciendis hic fugiat deleniti nobis repudiandae dicta repellat distinctio, sit neque sint magnam?
                        </p>
                    </div>
                </div>}
            </div>


        </section>
    )
}

export default ListeCasEtud
