import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTicketComponent } from './detail-ticket.component';

describe('DetailTicketComponent', () => {
  let component: DetailTicketComponent;
  let fixture: ComponentFixture<DetailTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailTicketComponent]
    });
    fixture = TestBed.createComponent(DetailTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
