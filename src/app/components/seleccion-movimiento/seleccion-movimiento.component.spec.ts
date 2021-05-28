import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionMovimientoComponent } from './seleccion-movimiento.component';

describe('SeleccionMovimientoComponent', () => {
  let component: SeleccionMovimientoComponent;
  let fixture: ComponentFixture<SeleccionMovimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionMovimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionMovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
