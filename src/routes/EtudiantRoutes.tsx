import { Navigate, Route } from "react-router";
import LayoutEtudiant from "../layouts/LayoutEtudiant";
import DeposerRapport from "../pages/etudiant/deposeRapport/DeposerRapport";
import PoserQuestions from "../pages/etudiant/poserQuestions/PoserQuestions";
import Compte from "../pages/etudiant/compte/Compte";
import Annoces from "../pages/etudiant/Annoces/Annoces";
import DescriptionSujet from "../pages/etudiant/consultation/DescriptionSujet";
import RppaortEtu from "../pages/etudiant/consultation/RppaortEtu";
import ListeCasEtud from "../pages/etudiant/consultation/ListeCasEtud";
import ListeAllCas from "../pages/etudiant/consultation/ListeAllCas";

const EtudiantRoutes = (
    <>
        <Route path="/etudiant" element={<LayoutEtudiant />}>
            <Route index element={<Navigate to="/etudiant/annoces" replace />} />
            <Route path="annoces" element={<Annoces />} />
            <Route path="description-sujet" element={<DescriptionSujet />} />
            <Route path="deposer-rapport" element={<DeposerRapport />} />
            <Route path="rapport" element={<RppaortEtu />} />
            <Route path="liste-cas-etudiant" element={<ListeCasEtud />} />
            <Route path="liste-cas" element={<ListeAllCas />} />
            <Route path="poser-questions" element={<PoserQuestions />} />
            <Route path="compte" element={<Compte />} />
        </Route>
    </>
);

export default EtudiantRoutes;