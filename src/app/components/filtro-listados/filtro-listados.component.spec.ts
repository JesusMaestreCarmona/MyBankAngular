import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroListadosComponent } from './filtro-listados.component';

describe('FiltroListadosComponent', () => {
  let component: FiltroListadosComponent;
  let fixture: ComponentFixture<FiltroListadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroListadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroListadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
