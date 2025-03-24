import { Route } from 'react-router'
import LayoutEnsPrincipale from '../layouts/LayoutEnsPrincipale';
import CreerGroupe from '../pages/enseignantPrincipale/creerGroupe/CreerGroupe';
import GestionGroupes from '../pages/enseignantPrincipale/listeGroupe/GestionGroupes';
import ListeBinomes from '../pages/enseignantPrincipale/creerGroupe/ListeBinomes';
import ListeGroupes from '../pages/enseignantPrincipale/listeGroupe/ListeGroupes';
import AffecterTheme from '../pages/enseignantPrincipale/listeGroupe/AffecterTheme';
import Profil from '../pages/enseignantPrincipale/profil/Profil';
import ListeAffectionTheme from '../pages/enseignantPrincipale/listeGroupe/ListeAffectionTheme';
import EditerGroupes from '../pages/enseignantPrincipale/listeGroupe/EditerGroupes';
import Welcome from '../pages/enseignantPrincipale/welcome/Welcome';


const EnsPrincipaleRoutes = (
    <>
        <Route path="/ens-principale" element={<LayoutEnsPrincipale />}>
            <Route path='' element={<Welcome />} />
            <Route path='creer-groupes' element={<CreerGroupe />} />
            <Route path='creer-groupes/liste-binomes' element={<ListeBinomes />} />
            <Route path='consulter-la-liste-groupe' element={<ListeGroupes />} />

            <Route path='gestion-groupes' element={<GestionGroupes />} />
            <Route path='gestion-groupes/liste-affection-theme' element={<ListeAffectionTheme />} />
            <Route path='gestion-groupes/editer-groupes' element={<EditerGroupes />} />

            <Route path='affecter-theme' element={<AffecterTheme />} />
            <Route path='profil' element={<Profil />} />
        </Route>
    </>
)

export default EnsPrincipaleRoutes;