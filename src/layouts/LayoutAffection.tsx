import { Outlet } from "react-router";
import { useAffectionCasStore } from "../store";

function Header() {
  const nextstep = useAffectionCasStore((state) => state.nextStep);
  const curentNextStep = useAffectionCasStore((state) => state.curentNextStep);
  const Confirme = useAffectionCasStore((state) => state.confirm);
  return (
    <div className="p-4  sm:w-[90%] w-full mt-12  mb-20 flex justify-center  items-center">
      <div className="w-1/4 flex items-center justify-end *:bg-green-400">
        <div className="w-2/4 h-0.5 bg-gray-400"></div>
        <div className="shrink-0 w-9 h-9 border-2  border-green-400 flex items-center justify-center font-bold rounded-full text-white">
          1
        </div>
      </div>
      <div
        className={`w-1/4 flex items-center ${
          nextstep
            ? "*:bg-green-400 *:text-white *:border-green-400 transform transition-colors duration-300 ease-in-out"
            : ""
        }`}
      >
        <div className="w-full h-0.5 bg-gray-400"></div>
        <div className="shrink-0 w-9 h-9 border-2  border-gray-400 flex items-center justify-center font-bold rounded-full text-gray-400">
          2
        </div>
      </div>
      <div
        className={`w-1/4 flex items-center ${
          curentNextStep
            ? "*:bg-green-400 *:text-white *:border-green-400 transform transition-colors duration-300 ease-in-out"
            : ""
        }`}
      >
        <div className="w-full h-0.5 bg-gray-400"></div>
        <div className="shrink-0 w-9 h-9 border-2  border-gray-400 flex items-center justify-center font-bold rounded-full text-gray-400">
          3
        </div>
      </div>
      <div
        className={`w-1/4 ${
          Confirme
            ? "*:bg-green-400 *:text-white *:border-green-400 transform transition-colors duration-300 ease-in-out"
            : ""
        }`}
      >
        <div className="w-2/4 h-0.5 bg-gray-400"></div>
      </div>
    </div>
  );
}
const LayoutAffection = () => {
  return (
    <main className="w-full min-h-svh mt-16 px-2 sm:h-svh p-6 flex flex-col items-center  sm:mt-20 ">
      <Outlet />
      <Header />
    </main>
  );
};

export default LayoutAffection;
