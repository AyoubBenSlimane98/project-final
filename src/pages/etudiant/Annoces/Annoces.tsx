import { useAuthStore } from '../../../store';
import { useShallow } from 'zustand/shallow';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';


type PostProps = {
    idA: number;
    titre: string;
    description: string;
    image?: string;
    createdAt: string;
    updadedAt: string;
    idU: number
}

const getAllAnnonces = async (accessToken: string) => {
    const response = await fetch(
        "http://localhost:4000/api/eutdaint/annoces",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) throw new Error("Unable to Get all POST's");
    return response.json()
}
const getInfoAdmin = async ({ accessToken, idU }: { accessToken: string; idU: number }) => {
    const response = await fetch(
        `http://localhost:4000/api/admin/info-profil/${idU}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) throw new Error("Unable to Get Info Admin");
    return response.json()
}

function PostItem(post: PostProps) {
    const accessToken = useAuthStore(useShallow((state) => state.accessToken))
    const { data } = useQuery({
        queryKey: ["Info-Admin", accessToken],
        queryFn: ({ queryKey }) => {
            const [, accessToken] = queryKey;
            return getInfoAdmin({ accessToken: accessToken as string, idU: post.idU });
        },
        enabled: !!accessToken
    })

    const isoDate = post.createdAt;
    const date = new Date(isoDate);
    const formatted = `${date.getFullYear()}, ${date.toLocaleString('en-US', { month: 'long' })} ${String(date.getDate()).padStart(2, '0')}`;
    return (
        <section className='w-2xl h-auto bg-white flex flex-col rounded-md shadow relative drop-shadow '>
            <header className="flex items-center justify-between pl-4 pr-2 py-4">
                <div className="flex items-center gap-4">
                    <img onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://scontent.fczl2-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeF_OWSBlL4_ahZGK8uktg7YWt9TLzuBU1Ba31MvO4FTUAcNr-rcAk0Q6wgee_n1MVfJVXKEYXEpVc_A8npzsuDs&_nc_ohc=pCF_EXqQ5MYQ7kNvwGqbQH8&_nc_oc=AdmOQDv_qA9yPoDAQK2j4m8cM77HYt2osPaGYZiWQNIR41-_Kkg1lN_m_n79WacUl90&_nc_zt=24&_nc_ht=scontent.fczl2-2.fna&oh=00_AfEfE4VyUFM1gD2VkajBmRMamhtVSp2NpcihUNDqLsAtzg&oe=681B903A'
                    }}
                        src={`http://localhost:4000/${data?.image}`}
                        alt="" className="w-14 h-14 object-cover rounded-full border border-gray-200"
                        loading="lazy" />
                    <div>
                        <h2 className="text-lg pb-1">{data?.bio}</h2>
                        <p className="text-[12px] font-mono">{formatted}</p>
                    </div>
                </div>
            </header>
            <hr className="text-gray-200 w-full h-0.5 mb-4 " />
            <div className="flex flex-col px-2 mb-2">
                {post.description && <div className="text-[0.95rem] px-1 font-light mb-4">
                    <h2 className="font-semibold text-xl pb-2"> {post.titre}</h2>
                    <p> {post.description}</p>
                </div>}
                {post.image && <div className="w-full h-96  "><img src={`http://localhost:4000/${post.image}`} alt="" className="w-full h-96 aspect-square " loading="lazy" /></div>}
            </div>
        </section>
    );
}


const Annoces = () => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const accessToken = useAuthStore((state) => state.accessToken)
    const { data } = useQuery({
        queryKey: ["All-Posts", accessToken],
        queryFn: ({ queryKey }) => {
            const [, accessToken] = queryKey;
            return getAllAnnonces(accessToken as string);
        },
        enabled: !!accessToken
    })
    useEffect(() => {
        if (data) {
            setPosts(data)

        }
    }, [data])

    return (

        <main className={`w-full min-h-screen relative bg-[#F6F6F6]   `}>
            <div className={`w-full h-full flex flex-col gap-8 justify-evenly items-center overflow-hidden relative  pt-28 pb-12`}>
                {posts.map((post) => (<PostItem key={post.idA} {...post} />))}
            </div>

        </main>

    )
}

export default Annoces;
