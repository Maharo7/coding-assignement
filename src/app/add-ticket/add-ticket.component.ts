import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng-lts/api';
import { Ticket } from 'src/interfaces/ticket.interface';
import { UtilsService } from '../utils.service';
import { BackendService } from '../backend.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  providers : [MessageService, UtilsService, BackendService],
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent {
  descriptionToAdd: string;
  isAdding: boolean;
  ticketsTest: Ticket[] = [];
  @Output() ticketAdded = new EventEmitter<Ticket>();

  constructor(private backendService :BackendService, private utilsService: UtilsService){
  }
  
  onSubmit() {
    const newTicketPayload = { description: this.descriptionToAdd };
    this.isAdding = true;
    this.backendService.newTicket(newTicketPayload).pipe(
      catchError((error) => {
        console.error('Error creating new ticket:', error);
        this.utilsService.showToastError('An error occured while adding the ticket, Please try again' , 1000);
        this.isAdding = false;
        return of(null);
      })
    ).subscribe((ticket) => {
      if (ticket) {
        this.ticketsTest.push(ticket);
        // this.getAllTickets();
        this.utilsService.showToastSuccess('New ticket ' + ticket.description + ' created');
        this.ticketAdded.emit(ticket);
      }
      this.isAdding = false;
    });
  }
}
