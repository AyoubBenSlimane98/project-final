import { useContext, useState } from "react";
import { FiX } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { QuestionContext } from "../../../context";

type Question = {
  image: string;
  bio: string;
  question: string;
  type: 'en attente' | 'Rejeté' | 'Répondre';
};

const questions: Question[] = [
  {
    image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
    bio: "@security_expert_1",
    question: "Comment améliorer la sécurité d’une application web ?",
    type: "en attente",
  },
  {
    image: "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg",
    bio: "@cyber_guardian",
    question: "Comment sécuriser une API REST ?",
    type: "Répondre",
  },
  {
    image: "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg",
    bio: "@infosec_wizard",
    question: "Quelles sont les meilleures pratiques pour protéger une base de données ?",
    type: "Rejeté",
  },
  {
    image: "https://images.pexels.com/photos/5380668/pexels-photo-5380668.jpeg",
    bio: "@data_protector",
    question: "Comment éviter les attaques par injection SQL dans une application web ?",
    type: "en attente",
  },
  {
    image: "https://images.pexels.com/photos/3747134/pexels-photo-3747134.jpeg",
    bio: "@secure_login",
    question: "Quels sont les avantages et inconvénients de l'authentification à deux facteurs (2FA) ?",
    type: "Répondre",
  },
  {
    image: "https://images.pexels.com/photos/5473958/pexels-photo-5473958.jpeg",
    bio: "@password_keeper",
    question: "Comment se protéger contre les attaques par force brute sur un site web ?",
    type: "Rejeté",
  },
  {
    image: "https://images.pexels.com/photos/13424862/pexels-photo-13424862.jpeg",
    bio: "@hash_master",
    question: "Pourquoi et comment chiffrer les mots de passe stockés en base de données ?",
    type: "en attente",
  },
  {
    image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg",
    bio: "@owasp_hacker",
    question: "Quelles sont les principales failles de sécurité du web selon l’OWASP Top 10 ?",
    type: "Répondre",
  },
  {
    image: "https://images.pexels.com/photos/11035373/pexels-photo-11035373.jpeg",
    bio: "@pentest_hero",
    question: "Quels outils utiliser pour tester la sécurité d’une application web ?",
    type: "Rejeté",
  },
  {
    image: "https://images.pexels.com/photos/613267/pexels-photo-613267.jpeg",
    bio: "@firewall_guard",
    question: "Comment mettre en place un pare-feu applicatif web (WAF) ?",
    type: "en attente",
  },
];


function CardQuestion({ image, bio, question, type }: Question) {
  const context = useContext(QuestionContext);

  return (
    <div
      className="flex flex-col sm:flex-row justify-between gap-4  items-center hover:bg-slate-50 md:p-4 hover:rounded hover:shadow transition-all duration-300 ease-in-out cursor-pointer "

    >
      <div className="flex gap-4 items-center w-96">
        <img src={image} alt="" className="w-12 h-12 rounded-full object-cover" loading="lazy" />
        <div className="flex flex-col space-y-2">
          <span className="font-medium">{bio}</span>
          <p className="text-gray-800 text-sm md:text-wrap lg:text-nowrap">{question}</p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-10 sm:space-x-3 md:space-x-6">
        <button className="border sm:text-sm sm:text-nowrap border-gray-400 rounded-full px-4 py-1.5">
          {type}
        </button>
        <button
          className="border sm:text-sm sm:text-nowrap border-gray-400 rounded-md px-4 py-1.5"
          onClick={(e) => {
            e.stopPropagation(); 
            context?.setSelectedQuestion({ image, bio, question, type });
          }}
        >
          Répondre
        </button>
      </div>
      <hr className="w-full sm:hidden " />
    </div>
  );
}


function RepondreQuestion() {
  const context = useContext(QuestionContext);

  if (!context?.selectedQuestion) return null;

  return (
    <div className="border border-gray-200 shadow-2xl px-6 py-4 flex flex-col gap-y-4 rounded-md w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
        onClick={() => context.setSelectedQuestion(null)}
      >
        <FiX size={20} />
      </button>
      <h3 className="text-xl font-medium mb-1">Question</h3>
      <p className="text-gray-800">{context.selectedQuestion.question}</p>
      <textarea
        placeholder="Tapez votre réponse ici..."
        className="w-full border border-gray-200 h-20 outline-none p-2"
      ></textarea>
      <div className="flex items-center gap-4">
        <button
          className="bg-gray-950 text-white px-4 py-2 rounded-md flex items-center gap-2 w-40 justify-center"
          onClick={() => context?.setType("Répondre")}
        >
          <IoMdCheckmark />
          Approuver
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 w-40 justify-center"
          onClick={() => context?.setType("Rejeté")}
        >
          <FiX />
          Rejeter
        </button>
      </div>
    </div>
  );
}


function BodyQuestion() {
  return (
    <div className="w-full sm:space-y-6 md:space-y-0 h-[600px] border border-gray-200 rounded-sm shadow p-4 overflow-auto">
      {questions.map((q, index) => (
        <CardQuestion key={index} {...q} />
      ))}
    </div>
  );
}

const Question = () => {
  const [type, setType] = useState<Question['type']>('en attente');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  return (
    <QuestionContext.Provider value={{ selectedQuestion, setSelectedQuestion, type, setType }}>
      <section className="w-full p-6 mt-20 h-full sm:h-svh relative overflow-hidden">
        <h2 className="font-medium text-2xl mb-6">Consulter les Questions & Réponses</h2>
        {selectedQuestion && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[96%] shadow-lg bg-white rounded-lg z-[9998]">
            <RepondreQuestion />
          </div>
        )}
        <div className={`w-full  ${selectedQuestion ? ' opacity-10' : ' opacity-100'}`}> <BodyQuestion /></div>
      </section>
    </QuestionContext.Provider>
  );
};

export default Question;
