import { Route } from "react-router";
import LayoutEns from "../layouts/LayoutEns";
import Question from "../pages/enseignantResponsable/consultation/Question";
import GroupeBinome from "../pages/enseignantResponsable/consultation/GroupeBinome";
import Rapport from "../pages/enseignantResponsable/rapport/Rapport";
import DecrirSujet from "../pages/enseignantResponsable/gestion/sujet/DecrirSujet";
import AffectionResponsablite from "../pages/enseignantResponsable/gestion/affection_res/AffectionResponsablite";
import LayoutAffection from "../layouts/LayoutAffection";
import FirstStep from "../pages/enseignantResponsable/gestion/affection_cas/FirstStep";
import SecondStep from "../pages/enseignantResponsable/gestion/affection_cas/SecondStep";
import ThreedStep from "../pages/enseignantResponsable/gestion/affection_cas/ThreedStep";
import Compte from "../pages/enseignantResponsable/compte/Compte";
import Chat from "../pages/enseignantResponsable/chat/Chat";
import AllPost from "../pages/enseignantResponsable/post/AllPost";

const EnsRespobsableRoutes = (
  <>
    <Route path="/ens-res" element={<LayoutEns />}>
      <Route index element={<AllPost />} />
      <Route path="consultation-question" element={<Question />} />
      <Route path="consultation-binommes" element={<GroupeBinome />} />
      <Route path="rapport" element={<Rapport />} />
      <Route
        path="progression"
        element={<div className="w-full h-svh">progression</div>}
      />

      <Route path="gestion-decrir-le-sujet" element={<DecrirSujet />} />
      <Route
        path="gestion-affection-responsabilite"
        element={<AffectionResponsablite />}
      />
      <Route path="gestion-affection-les-cas" element={<LayoutAffection />}>
        <Route index element={<FirstStep />} />
        <Route path="step2" element={<SecondStep />} />
        <Route path="step3" element={<ThreedStep />} />
      </Route>
      <Route
        path="evaluation"
        element={<div className="w-full h-svh">evaluation</div>}
      />
      <Route path="compte" element={<Compte />} />
      <Route path="chat" element={<Chat />} />
    </Route>
  </>
);

export default EnsRespobsableRoutes;
