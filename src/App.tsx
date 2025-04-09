import { Navigate, Route, Routes } from "react-router";
import NotFound from "./pages/not found 404/NotFound";
import { LayoutAdmin } from "./layouts/LayoutAdmin";
import Welcome from "./pages/admin/welcome/Welcome";
import AjouterAnnonces from "./pages/admin/ajouter_annonces/AjouterAnnonces";
import { ConsulterAnnonces } from "./pages/admin/Consulter_annonces/ConsulterAnnonces";
import Utilisateur from "./pages/admin/utilisatur/Utilisateur";
import Parametre from "./pages/admin/parametres/Parametre";
import AnnoncesBloque from "./pages/admin/Consulter_annonces/AnnoncesBloque";
import Compte from "./pages/admin/compte/Compte";

import LayoutEnsPrincipale from './layouts/LayoutEnsPrincipale';
import CreerGroupe from './pages/enseignantPrincipale/creerGroupe/CreerGroupe';
import GestionGroupes from './pages/enseignantPrincipale/listeGroupe/GestionGroupes';
import ListeBinomes from './pages/enseignantPrincipale/creerGroupe/ListeBinomes';
import ListeGroupes from './pages/enseignantPrincipale/listeGroupe/ListeGroupes';
import AffecterTheme from './pages/enseignantPrincipale/listeGroupe/AffecterTheme';
import Profil from './pages/enseignantPrincipale/profil/Profil';
import ListeAffectionTheme from './pages/enseignantPrincipale/listeGroupe/ListeAffectionTheme';
import EditerGroupes from './pages/enseignantPrincipale/listeGroupe/EditerGroupes';

import LayoutEns from "./layouts/LayoutEns";
import Question from "./pages/enseignantResponsable/consultation/Question";
import GroupeBinome from "./pages/enseignantResponsable/consultation/GroupeBinome";
import Rapport from "./pages/enseignantResponsable/rapport/Rapport";
import DecrirSujet from "./pages/enseignantResponsable/gestion/sujet/DecrirSujet";
import AffectionResponsablite from "./pages/enseignantResponsable/gestion/affection_res/AffectionResponsablite";
import LayoutAffection from "./layouts/LayoutAffection";
import FirstStep from "./pages/enseignantResponsable/gestion/affection_cas/FirstStep";
import SecondStep from "./pages/enseignantResponsable/gestion/affection_cas/SecondStep";
import ThreedStep from "./pages/enseignantResponsable/gestion/affection_cas/ThreedStep";
import Chat from "./pages/enseignantResponsable/chat/Chat";
import AllPost from "./pages/enseignantResponsable/post/AllPost";
import { OrganiserRenion } from "./pages/enseignantResponsable/gestion/renion/OrganiserRenion";
import LayoutEtudiant from "./layouts/LayoutEtudiant";
import Annoces from "./pages/etudiant/Annoces/Annoces";
import DescriptionSujet from "./pages/etudiant/consultation/DescriptionSujet";
import DeposerRapport from "./pages/etudiant/deposeRapport/DeposerRapport";
import RppaortEtu from "./pages/etudiant/consultation/RppaortEtu";
import ListeCasEtud from "./pages/etudiant/consultation/ListeCasEtud";
import ListeAllCas from "./pages/etudiant/consultation/ListeAllCas";
import PoserQuestions from "./pages/etudiant/poserQuestions/PoserQuestions";
import SignIN from "./pages/auth/SignIN";
import SignUP from "./pages/auth/SignUP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetEmail from "./pages/auth/ResetEmail";
import PrivateRoute from "./routes/PrivateRoute";
import WelcomeEnsP from "./pages/enseignantPrincipale/welcome/WelcomeEnsP";
import ChangePassword from "./pages/auth/ChangePassword";
const App = () => {


    return (
        <Routes>
            <Route path="/" element={<Navigate to="/sign-in" />} />
            <Route index path="/sign-in" element={<SignIN />} />
            <Route path="/sign-up" element={<SignUP />} />
            <Route path="/password">
                <Route index element={<ForgotPassword />} />
                <Route path="reset-email" element={<ResetEmail />} />
                <Route path="change" element={<ChangePassword />} />
            </Route>

            <Route path="/admin" element={<PrivateRoute><LayoutAdmin /></PrivateRoute>}>
                <Route index element={<Welcome />} />
                <Route path="ajouter-annoces" element={<AjouterAnnonces />} />
                <Route path="annonces" element={<ConsulterAnnonces />} />
                <Route path="utilisateurs" element={<Utilisateur />} />
                <Route path="parametre" element={<Parametre />} />
                <Route path="parametre/annonces-bloque" element={<AnnoncesBloque />} />
                <Route path="parametre/profil" element={<Compte />} />
            </Route>

            <Route path="/ens-principale" element={<PrivateRoute><LayoutEnsPrincipale /></PrivateRoute>}>
                <Route index element={<WelcomeEnsP />} />
                <Route path='creer-groupes' element={<CreerGroupe />} />
                <Route path='creer-groupes/liste-binomes' element={<ListeBinomes />} />
                <Route path='consulter-la-liste-groupe' element={<ListeGroupes />} />
                <Route path='gestion-groupes' element={<GestionGroupes />} />
                <Route path='gestion-groupes/liste-affection-theme' element={<ListeAffectionTheme />} />
                <Route path='gestion-groupes/editer-groupes' element={<EditerGroupes />} />
                <Route path='affecter-theme' element={<AffecterTheme />} />
                <Route path='profil' element={<Profil />} />
            </Route>

            <Route path="/ens-responsable" element={<PrivateRoute><LayoutEns /></PrivateRoute>}>
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
                    path="gestion-organiser-renion"
                    element={<OrganiserRenion />}
                />
                <Route
                    path="evaluation"
                    element={<div className="w-full h-svh">evaluation</div>}
                />
                <Route path="compte" element={<Compte />} />
                <Route path="chat" element={<Chat />} />
            </Route>

            <Route path="/etudiant" element={<PrivateRoute><LayoutEtudiant /></PrivateRoute>}>
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
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;

