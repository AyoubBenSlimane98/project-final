import { Route } from 'react-router'
import { LayoutAdmin } from '../layouts/LayoutAdmin';
import AjouterAnnonces from '../pages/admin/ajouter_annonces/AjouterAnnonces';
import { ConsulterAnnonces } from '../pages/admin/Consulter_annonces/ConsulterAnnonces';
import Compte from '../pages/admin/compte/Compte';
import Utilisateur from '../pages/admin/utilisatur/Utilisateur';
import Parametre from '../pages/admin/parametres/Parametre';
import AnnoncesBloque from '../pages/admin/Consulter_annonces/AnnoncesBloque';

const AdminRoutes = (
    <>
        <Route path="/admin" element={<LayoutAdmin />}>
            <Route index path='ajouter-annoces' element={<AjouterAnnonces />} />
            <Route path='annonces' element={<ConsulterAnnonces />} />
            <Route path='utilisateurs' element={<Utilisateur />} />
            <Route path='parametre' element={<Parametre />} />
            <Route path='parametre/annonces-bloque' element={<AnnoncesBloque />} />
            <Route path='parametre/profil' element={<Compte />} />
        </Route>
    </>
)

export default AdminRoutes;
