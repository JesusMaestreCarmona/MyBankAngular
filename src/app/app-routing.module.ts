import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginUsuarioComponent } from './components/login-usuario/login-usuario.component';
import { PortalComponent } from './components/portal/portal.component';
import { SeleccionMovimientoComponent } from './components/seleccion-movimiento/seleccion-movimiento.component';
import { ListadoPeticionesComponent } from './components/listado-peticiones/listado-peticiones.component';
import { ModificarDatosUsuarioComponent } from './components/modificar-datos-usuario/modificar-datos-usuario.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginUsuarioComponent },
  { path: 'portal', component: PortalComponent },
  { path: 'seleccion-movimiento', component: SeleccionMovimientoComponent },
  { path: 'listado-peticiones', component: ListadoPeticionesComponent },
  { path: 'modificar-datos', component: ModificarDatosUsuarioComponent },
  { path: 'registro', component: RegistroUsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
