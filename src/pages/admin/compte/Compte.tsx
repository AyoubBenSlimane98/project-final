import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaCamera } from "react-icons/fa";
import { useAuthStore } from "../../../store";
import { useShallow } from "zustand/shallow";
import { BsPatchCheckFill } from "react-icons/bs";

type UserProfile = {
  email: string;
  user: {
    bio: string;
    dateNaissance: string; // ISO date string
    image: string;
    nom: string;
    prenom: string;
    sexe: "Male" | "Female"; // use a union or just `string` if not sure
  };
};
type MyProfileProps = {
  accessToken: string;
  refetch: () => void;
  dataProfil: UserProfile;
}
type MyInputProps = {
  name: string;
  label: string;
  value: string;
  status?: boolean;
  error?: boolean;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void
};
type MyInfoProps = {
  bio: string;
  nom: string;
  prenom: string;
};

const uploadFile = async (formData: FormData) => {
  const response = await fetch('http://localhost:4000/api/file-upload/upload', {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");
  return response.json();
};

const getProfil = async (accessToken: string) => {
  const response = await fetch('http://localhost:4000/api/admin/profil', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get all articles');
  }

  return response.json();
}
const updateImage = async ({ image, accessToken }: { image: string, accessToken: string }) => {
  const response = await fetch('http://localhost:4000/api/admin/profil/img', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ image })
  });

  if (!response.ok) {
    throw new Error('Failed to get all articles');
  }

  return response.json();
}
const updateInfoProfil = async ({ accessToken, data }: { accessToken: string, data: MyInfoProps }) => {
  const response = await fetch('http://localhost:4000/api/admin/profil/info', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ...data })
  });

  if (!response.ok) {
    throw new Error('Failed to change info profile');
  }

  return response.json();
}
const updatePasswordProfil = async ({ accessToken, form }: {
  accessToken: string, form: {
    oldPassword: string,
    newPassword: string
  }
}) => {
  console.log({ accessToken, form })
  const response = await fetch('http://localhost:4000/api/admin/profil/password', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ...form })
  });

  if (!response.ok) {
    throw new Error('Failed to change password ');
  }

  return response.json();
}

function AboutMe({ dataProfil, accessToken, refetch }: MyProfileProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    mutate(formData);
  };
  const { mutate } = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      setUploadedImageUrl(data.filePath);
    },
    onError: (error) => {
      console.error(error);

    }
  });
  const { user } = dataProfil;
  const { mutate: updateImgProfile } = useMutation({
    mutationFn: ({ image, accessToken }: { image: string, accessToken: string }) => updateImage({ image, accessToken }),
    onSuccess: (data) => {
      console.log(data);
      refetch()
    },
    onError: (error) => {
      console.error(error);

    }
  });
  const handleChangeImg = () => {
    if (isEditing && updateImgProfile) {
      if (uploadedImageUrl) {
        updateImgProfile({ image: uploadedImageUrl, accessToken });
      }
    }
  }
  return (
    <div className="w-full px-6 py-4 shadow-lg rounded-lg border border-gray-200 flex flex-col gap-4  sm:flex-row justify-between items-center bg-white">
      <div className="flex items-center space-x-6">
        <div className=" shrink-0 w-24 h-24 relative">
          <img
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://scontent.fczl2-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeF_OWSBlL4_ahZGK8uktg7YWt9TLzuBU1Ba31MvO4FTUAcNr-rcAk0Q6wgee_n1MVfJVXKEYXEpVc_A8npzsuDs&_nc_ohc=pCF_EXqQ5MYQ7kNvwGqbQH8&_nc_oc=AdmOQDv_qA9yPoDAQK2j4m8cM77HYt2osPaGYZiWQNIR41-_Kkg1lN_m_n79WacUl90&_nc_zt=24&_nc_ht=scontent.fczl2-2.fna&oh=00_AfEfE4VyUFM1gD2VkajBmRMamhtVSp2NpcihUNDqLsAtzg&oe=681B903A';
            }}
            src={`http://localhost:4000/${user?.image}`}
            alt={`${user?.prenom} ${user?.nom}`}
            className="w-24 h-24 rounded-full object-cover border border-gray-200 outline-none"
            loading="lazy"
          />
          {isEditing && (
            <label
              htmlFor="file-upload"
              className="absolute bottom-0 right-0 bg-gray-200 text-sky-600 rounded-full p-2 cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out"
            >
              <FaCamera />
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="font-medium text-lg sm:text-xl uppercase">{`${user?.prenom} ${user?.nom}`}</h3>
          <p className="font-extralight sm:text-lg text-gray-500">{user?.bio} </p>
        </div>
      </div>
      <div className="w-full sm:max-w-fit h-full py-2 ">
        <button
          className={`w-full  flex justify-center items-center space-x-2 text-white py-1.5 px-2.5 sm:px-4  sm:py-2 rounded-full ${!isEditing ? "bg-sky-500" : "bg-green-500"
            } transform translate-all duration-300 ease-in-out`}
          onClick={() => { setIsEditing((prev) => !prev); handleChangeImg() }}
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

function MyInput({ name, label, value, status, handleChange, error }: MyInputProps) {
  const isEmail = label === "Email";
  const inputClasses = ` ${status
    ? isEmail
      ? "border-gray-200 outline-none border rounded px-2 py-1.5 bg-gray-100"
      : error ? "border-red-600 outline-none border rounded px-2 py-1.5" : "border-gray-200 outline-none border rounded px-2 py-1.5" : "outline-none border-none "
    }`;
  return (
    <div className="basis-1/2 flex flex-col space-y-2 ">
      <label htmlFor={label} className="text-gray-400">
        {label}
      </label>
      <input
        name={name}
        onChange={handleChange}
        id={label}
        readOnly={isEmail || !status}
        type="text"
        value={value}
        className={inputClasses}
      />
    </div>
  );
}

function MyInformation({ dataProfil, accessToken, refetch }: MyProfileProps) {
  const { email, user } = dataProfil
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [data, setData] = useState<MyInfoProps>({ bio: '', nom: '', prenom: '' })
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  useEffect(() => {
    if (user) {
      setData({ bio: user.bio, nom: user.nom, prenom: user.prenom })
    }
  }, [user])

  const { mutate } = useMutation({
    mutationFn: ({ accessToken, data }: { accessToken: string, data: MyInfoProps }) => updateInfoProfil({ accessToken, data }),
    onSuccess: (data) => {
      console.log(data)
      refetch()
    },
    onError: (error) => {
      console.warn(error)
    }
  })
  const handleChangeInfo = () => {
    if (isEditing && accessToken) {
      mutate({ accessToken, data })
    }
  }

  return (
    <div className="w-full px-6 py-8 shadow-lg rounded-lg border border-gray-200 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <button
          className={` hidden sm:flex items-center space-x-2 text-white px-4 text-center py-2 rounded-full ${!isEditing ? "bg-sky-500" : "bg-green-500"
            }`}
          onClick={() => { setIsEditing((prev) => !prev); handleChangeInfo() }}
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
        <MyInput
          name="bio"
          label="Nom d'utilisateur"
          value={data.bio}
          status={isEditing}
          handleChange={handleChange}
        />
        <div className="flex flex-col justify-baseline sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-8">

          <MyInput name='prenom' label="Prénom" value={data.prenom} status={isEditing} handleChange={handleChange} />
          <MyInput name="nom" label="Nom" value={data.nom} status={isEditing} handleChange={handleChange} />
        </div>
        <MyInput
          name="email"
          label="Email"
          value={email}
          status={isEditing}
        />

      </div>
    </div>
  );
}
function MyPassword({ accessToken, refetch, setIsSucces }: {
  accessToken: string,
  refetch: () => void,
  setIsSucces: (isSucces: boolean) => void
}) {
  const [isEditing, setIsEditing] = useState<"edit" | "save">("edit");
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState<{ oldPassword: string, newPassword: string, confirmPassword: string }>({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const { mutate } = useMutation({
    mutationFn: ({ accessToken, form }: {
      accessToken: string, form: {
        oldPassword: string,
        newPassword: string
      }
    }) => updatePasswordProfil({ accessToken, form }),
    onSuccess: () => {
      setIsEditing('edit')
      setIsSucces(true)
      setTimeout(() => {
        setData({ oldPassword: '', newPassword: '', confirmPassword: '' })
        setIsSucces(false)
      }, 4000)

      refetch()
    },
    onError: (error) => {
      setError(true)

      setTimeout(() => {
        setData({ oldPassword: '', newPassword: '', confirmPassword: '' })
        setError(false)

      }, 4000)
      console.warn(error)
    }
  })
  const handleChangePassword = () => {

    if (data.confirmPassword === data.newPassword) {
      mutate({ accessToken, form: { oldPassword: data.oldPassword, newPassword: data.newPassword } })
    } else {
      setError(true)

      setTimeout(() => {
        setData({ oldPassword: '', newPassword: '', confirmPassword: '' })
        setError(false)

      }, 4000)
    }

  }
  const handleCancel = () => {
    setData({ oldPassword: '', newPassword: '', confirmPassword: '' })
  }
  return (

    <div className="w-full px-6 py-4  shadow-lg rounded-lg border border-gray-200 bg-white">
      <div className="flex justify-between items-center ">
        <h2 className="sm:text-lg font-semibold">Change Password</h2>
        <div className="flex items-center gap-4">
          {isEditing === "edit" && <button
            className="flex items-center justify-center space-x-2 text-white w-28 text-center py-2 px-2.5 sm:py-2 sm:px-4 rounded-full  bg-sky-500 sm:flex"
            onClick={() => setIsEditing("save")}
          >
            <span> Edit</span> <CiEdit className="text-2xl" />
          </button>}
          {isEditing === "save" && <div className="flex items-center gap-4 ">
            <button
              onClick={handleChangePassword}
              className={`flex items-center justify-center space-x-2 text-white w-28 text-center py-2 px-2.5 sm:py-2 sm:px-4 rounded-full bg-green-500 sm:flex"
                                }`}
            >
              <span>Save</span>
            </button>
            <button
              className={`flex items-center justify-center space-x-2 text-white w-28 text-center py-2 px-2.5 sm:py-2 sm:px-4 rounded-full bg-red-500 sm:flex"
                                }`}
              onClick={() => { setIsEditing("edit"); handleCancel() }}
            >
              <span> Cancel</span>
            </button>
          </div>}
        </div>
      </div>
      {isEditing === "save" && (
        <div className="w-full flex flex-col space-y-4 mt-4 mb-2">
          <MyInput label="Old Password" name="oldPassword" value={data.oldPassword} handleChange={handleChange} error={error} status={true} />
          <MyInput label="New Password" name="newPassword" value={data.newPassword} handleChange={handleChange} error={error} status={true} />
          <MyInput label="Confirme Password" name="confirmPassword" value={data.confirmPassword} handleChange={handleChange} error={error} status={true} />

        </div>
      )}
    </div>
  );
}
const Compte = () => {
  const [isSucces, setIsSucces] = useState(false)
  const accessToken = useAuthStore(useShallow((state) => state.accessToken))
  const [dataProfil, setDataProfil] = useState<UserProfile>({
    email: "",
    user: {
      bio: "",
      dateNaissance: "",
      image: "",
      nom: "",
      prenom: "",
      sexe: "Male",
    },
  });
  const { data, refetch } = useQuery({
    queryKey: ["profil", accessToken],
    queryFn: () => getProfil(accessToken!),
    enabled: !!accessToken
  });
  useEffect(() => {
    if (data) {
      setDataProfil(data)

    }
  }, [data]);
  // Destructure only if needed in the future
  if (!accessToken) return null;
  return (
    <div className="w-full h-svh  px-6 pb-10 flex flex-col gap-4 md:gap-6 sm:px-10 sm:py-6 overflow-auto bg-[#F4F7FD] relative">
      <h3 className="text-3xl ">Mon Profil</h3>
      <AboutMe
        dataProfil={dataProfil}
        accessToken={accessToken}
        refetch={refetch}
      />
      <MyInformation
        dataProfil={dataProfil}
        accessToken={accessToken}
        refetch={refetch}
      />

      <MyPassword accessToken={accessToken}
        refetch={refetch} setIsSucces={setIsSucces} />
      <div className={` absolute ${isSucces ? "bottom-10" : 'hidden'}  left-1/2 -translate-x-1/2  w-xl py-4  rounded-md bg-white drop-shadow shadow flex items-center justify-center gap-4`}>
        <BsPatchCheckFill className="text-4xl text-green-400" />
        <p className="font-medium ">
          Password updated successfully!
        </p>
      </div>
    </div>
  );
};

export default Compte;