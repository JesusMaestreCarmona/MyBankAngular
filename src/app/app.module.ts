import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// My components
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { DialogoGeneralComponent } from './components/dialogo-general/dialogo-general.component';
import { ImagenUsuarioComponent } from './components/imagen-usuario/imagen-usuario.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginUsuarioComponent } from './components/login-usuario/login-usuario.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { ListadoTransferenciasComponent } from './components/listado-transferencias/listado-transferencias.component';
import { ListadoPeticionesComponent } from './components/listado-peticiones/listado-peticiones.component';
import { ListadoMovimientosComponent } from './components/listado-movimientos/listado-movimientos.component';
import { SeleccionMovimientoComponent } from './components/seleccion-movimiento/seleccion-movimiento.component';
import { ModificarDatosUsuarioComponent } from './components/modificar-datos-usuario/modificar-datos-usuario.component';
import { DetalleTransferenciaComponent } from './components/detalle-transferencia/detalle-transferencia.component';
import { DetalleCuentaComponent } from './components/detalle-cuenta/detalle-cuenta.component';
import { DetalleMovimientoComponent } from './components/detalle-movimiento/detalle-movimiento.component';

// Material components
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// Other components
import { MatCurrencyFormatModule } from 'mat-currency-format';
import { FiltroListadosComponent } from './components/filtro-listados/filtro-listados.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogoGeneralComponent,
    LoginUsuarioComponent,
    ImagenUsuarioComponent,
    HeaderComponent,
    SeleccionMovimientoComponent,
    ListadoPeticionesComponent,
    DetalleTransferenciaComponent,
    DetalleCuentaComponent,
    ModificarDatosUsuarioComponent,
    RegistroUsuarioComponent,
    ListadoMovimientosComponent,
    DetalleMovimientoComponent,
    ListadoTransferenciasComponent,
    FiltroListadosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCurrencyFormatModule,
    MatBadgeModule,
    MatSelectModule,
    MatStepperModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatButtonToggleModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
              {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
