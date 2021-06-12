import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoTransferenciasComponent } from './listado-transferencias.component';

describe('ListadoTransferenciasComponent', () => {
  let component: ListadoTransferenciasComponent;
  let fixture: ComponentFixture<ListadoTransferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoTransferenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
