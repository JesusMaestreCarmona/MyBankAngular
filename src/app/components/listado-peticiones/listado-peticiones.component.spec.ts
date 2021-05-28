import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPeticionesComponent } from './listado-peticiones.component';

describe('ListadoPeticionesComponent', () => {
  let component: ListadoPeticionesComponent;
  let fixture: ComponentFixture<ListadoPeticionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoPeticionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPeticionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
