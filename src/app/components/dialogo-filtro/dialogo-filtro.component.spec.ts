import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoFiltroComponent } from './dialogo-filtro.component';

describe('DialogoFiltroComponent', () => {
  let component: DialogoFiltroComponent;
  let fixture: ComponentFixture<DialogoFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoFiltroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
