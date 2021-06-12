import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginUsuarioComponent } from './components/login-usuario/login-usuario.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { ListadoTransferenciasComponent } from './components/listado-transferencias/listado-transferencias.component';
import { ListadoPeticionesComponent } from './components/listado-peticiones/listado-peticiones.component';
import { ListadoMovimientosComponent } from './components/listado-movimientos/listado-movimientos.component';
import { ModificarDatosUsuarioComponent } from './components/modificar-datos-usuario/modificar-datos-usuario.component';
import { SeleccionMovimientoComponent } from './components/seleccion-movimiento/seleccion-movimiento.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginUsuarioComponent },
  { path: 'registro', component: RegistroUsuarioComponent },
  { path: 'listado-transferencias', component: ListadoTransferenciasComponent },
  { path: 'listado-peticiones', component: ListadoPeticionesComponent },
  { path: 'listado-movimientos', component: ListadoMovimientosComponent },
  { path: 'seleccion-movimiento', component: SeleccionMovimientoComponent },
  { path: 'modificar-datos', component: ModificarDatosUsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
