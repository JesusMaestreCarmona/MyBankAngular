import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMovimientosComponent } from './listado-movimientos.component';

describe('ListadoMovimientosComponent', () => {
  let component: ListadoMovimientosComponent;
  let fixture: ComponentFixture<ListadoMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoMovimientosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
