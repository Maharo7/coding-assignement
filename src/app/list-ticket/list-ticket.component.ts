import { Component , OnInit , ViewChild } from '@angular/core';
import { Ticket } from '../../interfaces/ticket.interface'
import { BackendService } from '../backend.service';
import { Table } from 'primeng/table';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from 'src/interfaces/user.interface';
import { UtilsService } from '../utils.service';
import { TicketUser } from 'src/interfaces/ticket-User.interface';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  providers: [MessageService, UtilsService],
  styleUrls: ['./list-ticket.component.css']
})
export class ListTicketComponent implements OnInit{
  tickets: Ticket[];
  ticketsUser: TicketUser[];
  users: User[];
  searchValue: string | undefined;
  isLoaded : boolean;
  descriptionToAdd : string;

  statut: string[] | undefined;
  selectedStatut: string | undefined;

  constructor(private backendService :BackendService, private utilsService: UtilsService){
  }

  ngOnInit() {
    this.statut=["true" , "false"];
    this.getAllTickets();
  }

  getAllTickets() {
    this.isLoaded = false;
    this.backendService.tickets()
      .subscribe((tickets) => {
        if (tickets) {
          const ticketObservables = tickets.map(ticket => this.getTicketUser(ticket));
          forkJoin(ticketObservables).subscribe((ticketUsers: TicketUser[]) => {
            this.ticketsUser = ticketUsers;
            this.isLoaded = true;
          });
        }
      });
  }

  getTicketUser(ticket: Ticket): Observable<TicketUser> {
    return this.backendService.user(ticket.assigneeId).pipe(
      map(user => ({
        id: ticket.id,
        completed: ticket.completed,
        description: ticket.description,
        user: user
      }))
    );
  }


  onSubmit(form: NgForm) {
    const newTicketPayload = { description: this.descriptionToAdd };
    this.backendService.newTicket(newTicketPayload).subscribe((ticket) => {
      if(ticket) {
        this.getAllTickets();
        console.log("New Ticket Created:", ticket);
        this.utilsService.showToastSuccess("New ticket "+ticket.description+ " created");
      }
    });
  }

  @ViewChild('ticketTable') ticketTable: Table;
  applyGlobalFilter(value: string) {
    this.ticketTable.filterGlobal(value, 'contains');
  }

}
