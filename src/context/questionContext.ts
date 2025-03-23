import { createContext } from "react";
import Question from "../pages/enseignantResponsable/consultation/Question";

type QuestionContextType = {
  selectedQuestion: Question | null;
  setSelectedQuestion: (question: Question | null) => void;
  type: Question["type"];
  setType: (type: Question["type"]) => void;
};
export const QuestionContext = createContext<QuestionContextType | null>(null);
