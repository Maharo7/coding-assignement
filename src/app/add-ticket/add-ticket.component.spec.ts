import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTicketComponent } from './add-ticket.component';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../backend.service';
import { of } from 'rxjs';

describe('AddTicketComponent', () => {
  let component: AddTicketComponent;
  let fixture: ComponentFixture<AddTicketComponent>;
  let backendService: BackendService;

  beforeEach(waitForAsync (() => {
    TestBed.configureTestingModule({
      declarations: [AddTicketComponent],
      imports: [FormsModule],
      providers: [BackendService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTicketComponent);
    component = fixture.componentInstance;
    backendService = TestBed.inject(BackendService); 

    fixture.detectChanges();
  });
  

  it('should add a ticket', () => {
    const ticketDescription = 'new ticket description';
    component.descriptionToAdd = ticketDescription;
    const newTicketSpy = spyOn(backendService, 'newTicket').and.returnValue(of({ id: 1, description: ticketDescription, assigneeId : null, completed: false }));
    component.onSubmit();
    expect(component.ticketsTest.length).toBe(1);
    expect(component.ticketsTest[0].description).toBe(ticketDescription);
    expect(newTicketSpy).toHaveBeenCalledWith({ description: ticketDescription });
  });
});
