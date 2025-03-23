
import { BiArrowBack } from 'react-icons/bi'
import { NavLink } from 'react-router'

const AffecterTheme = () => {
  return (
      <section className="w-full h-svh px-6 pb-10 flex flex-col justify-center items-center gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-auto bg-[#F4F7FD]">
          <NavLink to="/ens-principale/gestion-groupes" className=" fixed bottom-8  right-4 bg-green-500 hover:bg-green-600 transform ease-in-out duration-300 transition-all text-white w-12 h-12 rounded-full flex items-center justify-center">
              <BiArrowBack className="text-2xl" />
          </NavLink>
      </section>
  )
}

export default AffecterTheme
