import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { FaCamera } from "react-icons/fa";
import { NavLink } from "react-router";

type MyInputProps = {
  label: string;
  value: string;
  status?: boolean;
};
function AboutMe() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <div className="w-full px-6 py-4 shadow-lg rounded-lg border border-gray-200 flex flex-col gap-4  sm:flex-row justify-between items-center bg-white">
      <div className="flex items-center space-x-6">
        <div className=" shrink-0 w-24 h-24 relative">
          <img
            src="https://images.pexels.com/photos/868113/pexels-photo-868113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
            className="w-24 h-24 rounded-full object-cover border border-gray-200 outline-none "
            loading="lazy"
          />
          {isEditing && (
            <div className="absolute bottom-0 right-0 bg-gray-200 text-sky-600 rounded-full p-2 transform translate-all duration-300 ease-in-out">
              <FaCamera />
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="font-medium text-lg sm:text-xl uppercase">Benslimane Ayyoub</h3>
          <p className="font-extralight sm:text-lg text-gray-500">@Ayyoub_ben33</p>
        </div>
      </div>
      <div className="w-full sm:max-w-fit h-full py-2 ">
        <button
          className={`w-full  flex justify-center items-center space-x-2 text-white py-1.5 px-2.5 sm:px-4  sm:py-2 rounded-full ${
            !isEditing ? "bg-sky-500" : "bg-green-500"
          } transform translate-all duration-300 ease-in-out`}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {!isEditing ? (
            <>
              <span> Modifier</span> <CiEdit className="text-2xl" />
            </>
          ) : (
            <span> Sauvegarder</span>
          )}
        </button>
      </div>
    </div>
  );
}
function MyInput({ label, value, status }: MyInputProps) {
  const isEmail = label === "Email";
  const inputClasses = ` ${
    status
      ? isEmail
        ? "border-gray-200 outline-none border rounded px-2 py-1.5 bg-gray-100"
        : "border-gray-200 outline-none border rounded px-2 py-1.5"
      : "outline-none border-none "
  }`;
  return (
    <div className="basis-1/2 flex flex-col space-y-2 ">
      <label htmlFor={label} className="text-gray-400">
        {label}
      </label>
      <input
        id={label}
        readOnly={isEmail || !status}
        type="text"
        defaultValue={value}
        className={inputClasses}
      />
    </div>
  );
}
function MyInformation() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <div className="w-full px-6 py-8 shadow-lg rounded-lg border border-gray-200 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <button
          className={` hidden sm:flex items-center space-x-2 text-white px-4 text-center py-2 rounded-full ${
            !isEditing ? "bg-sky-500" : "bg-green-500"
          }`}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {!isEditing ? (
            <>
              <span> Modifier</span> <CiEdit className="text-2xl" />
            </>
          ) : (
            <span> Sauvegarder</span>
          )}
        </button>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col justify-baseline sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-8">
          <MyInput label="Prénom" value="Ayyoub" status={isEditing} />
          <MyInput label="Nom" value="Benslimane" status={isEditing} />
        </div>
        <div className="flex flex-col justify-baseline sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-8">
          <MyInput
            label="Nom d'utilisateur"
            value="Ayyoub_ben33"
            status={isEditing}
          />

          <MyInput label="Tel" value="+21365777777" status={isEditing} />
        </div>
        <MyInput
          label="Email"
          value="ayyoubbenslimane@gmail.com"
          status={isEditing}
        />
        <button
          className={`flex items-center justify-center sm:hidden space-x-2 text-white py-1.5 px-2.5 sm:px-4 text-center sm:py-2 rounded-full ${
            !isEditing ? "bg-sky-500" : "bg-green-500"
          }`}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {!isEditing ? (
            <>
              <span> Modifier</span> <CiEdit className="text-2xl" />
            </>
          ) : (
            <span> Sauvegarder</span>
          )}
        </button>
      </div>
    </div>
  );
}
function MyPassword() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <div className="w-full px-6 py-4  shadow-lg rounded-lg border border-gray-200 bg-white">
      <div className="flex justify-between items-center ">
        <h2 className="sm:text-lg font-semibold">Changer le mot de passe</h2>
        <button
          className={`flex items-center space-x-2 text-white  text-center py-1 px-2.5 sm:py-2 sm:px-4 rounded-full ${
            !isEditing ? "bg-sky-500" : "bg-green-500 hidden sm:flex"
          }`}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {!isEditing ? (
            <>
              <span> Modifier</span> <CiEdit className="text-2xl" />
            </>
          ) : (
            <span> Sauvegarder</span>
          )}
        </button>
      </div>
      {isEditing && (
        <div className="w-full flex flex-col space-y-4 mt-4 mb-2">
          <MyInput label="Ancien mot de passe" value="" status={true} />
          <MyInput label="Nouveau mot de passe" value="" status={true} />
          <MyInput label="Confirmer le mot de passe" value="" status={true} />
          <button
            className={`flex items-center justify-center sm:hidden space-x-2 text-white px-4 text-center py-2 rounded-full ${
              !isEditing ? "bg-sky-500" : "bg-green-500"
            }`}
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {!isEditing ? (
              <>
                <span> Modifier</span> <CiEdit className="text-2xl" />
              </>
            ) : (
              <span> Sauvegarder</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
const Compte = () => {
  return (
      <div className="w-full h-svh  px-6 pb-10 flex flex-col gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-auto bg-[#F4F7FD]">
      <h3 className="text-3xl ">Mon Profil</h3>
      <AboutMe />
      <MyInformation />
      <MyPassword />
      <NavLink to="/admin/parametre" className=" fixed bottom-8  right-4 bg-green-500 hover:bg-green-600 transform ease-in-out duration-300 transition-all text-white w-12 h-12 rounded-full flex items-center justify-center">
        <BiArrowBack className="text-2xl" />
      </NavLink>
    </div>
  );
};

export default Compte;