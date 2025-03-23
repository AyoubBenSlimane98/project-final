import { Route } from 'react-router'
import LayoutEnsPrincipale from '../layouts/LayoutEnsPrincipale';
import CreerGroupe from '../pages/enseignantPrincipale/creerGroupe/CreerGroupe';
import GestionGroupes from '../pages/enseignantPrincipale/listeGroupe/GestionGroupes';
import ListeBinomes from '../pages/enseignantPrincipale/creerGroupe/ListeBinomes';
import ListeGroupes from '../pages/enseignantPrincipale/listeGroupe/ListeGroupes';
import AffecterTheme from '../pages/enseignantPrincipale/listeGroupe/AffecterTheme';
import Profil from '../pages/enseignantPrincipale/profil/Profil';


const EnsPrincipaleRoutes = (
    <>
        <Route path="/ens-principale" element={<LayoutEnsPrincipale />}>
            <Route path='creer-groupes' element={<CreerGroupe />} />
            <Route path='creer-groupes/liste-binomes' element={<ListeBinomes />} />
            <Route path='gestion-groupes' element={<GestionGroupes />} />
            <Route path='affecter-theme' element={<AffecterTheme />} />
            <Route path='consulter-la-liste-groupe' element={<ListeGroupes />} />
            <Route path='profil' element={<Profil />} />
        </Route>
    </>
)

export default EnsPrincipaleRoutes;