
import { FaUserShield } from 'react-icons/fa'

const Welcome = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F7FD] p-6 w-full h-svh" >
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center h-96 w-3xl flex flex-col items-center justify-center">
                <FaUserShield className="text-6xl text-blue-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-800">Bienvenue, administrateur !</h1>
                <p className="text-gray-600 mt-2">Gérez votre <span className='text-[#4318FF] font-medium px-1.5'>DASHBOARD</span>avec facilité et contrôle.</p>
            </div>
        </div >
    )
}

export default Welcome