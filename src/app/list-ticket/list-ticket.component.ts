import { Component , OnInit , ViewChild } from '@angular/core';
import { Ticket } from '../../interfaces/ticket.interface'
import { Table } from 'primeng/table';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from 'src/interfaces/user.interface';
import { UtilsService } from '../utils.service';
import { TicketUser } from 'src/interfaces/ticket-User.interface';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BackendService } from '../backend.service';

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
  selectedUser: User;
  searchValue: string | undefined;
  isLoaded: boolean;
  descriptionToAdd: string;
  isAdding: boolean;

  statut: { status: string }[] | undefined;
  selectedStatut: { status: string } | undefined;

  constructor(private backendService :BackendService, private utilsService: UtilsService){
  }

  ngOnInit() {
    this.statut = [
      { status: 'true' },
      { status: 'false' }
    ];
    this.getAllUsers();
    this.getAllTickets();
    
  }

  getAllTickets() {
    this.isLoaded = false;
    this.backendService.tickets().subscribe(
      (tickets) => {
        if (tickets && tickets.length >= 1) {
          const ticketObservables = tickets.map(ticket => this.getTicketUser(ticket));
          forkJoin(ticketObservables).pipe(
            catchError((error) => {
              this.utilsService.showToastError('There is an error in retrieving the tickets' , 1000);
              console.error('forkJoin: ', error);
              // this.isLoaded = true; // Set isLoaded to true to stop the loader
              return throwError(error); // Propagate the error to the outer observable
            })
          ).subscribe((ticketUsers: TicketUser[]) => {
            const ticketsUserNotNull = []
            ticketUsers.map((ticketUser) => {
              if(ticketUser){
                ticketsUserNotNull.push(ticketUser);
              }
            })
            this.ticketsUser = ticketsUserNotNull;
            this.isLoaded = true; // Set isLoaded to true after successful retrieval of tickets
          });
        } else {
          this.ticketsUser = [];
          this.isLoaded = true;
        }
      },
      (error) => {
          this.utilsService.showToastError('There is an error in retrieving the tickets' ,1000);
        console.error('getAllTickets Error: ', error);
        // this.isLoaded = true; // Set isLoaded to true to stop the loader
      }
    );
  }
  
  getTicketUser(ticket: Ticket): Observable<TicketUser> {
    if (!ticket.assigneeId) {
      return of({
        id: ticket.id,
        completed: ticket.completed,
        description: ticket.description,
        user: null // Set the user to null when there is no assigneeId
      });
    }
  
    return this.backendService.user(ticket.assigneeId).pipe(
      map(user => ({
        id: ticket.id,
        completed: ticket.completed,
        description: ticket.description,
        user: user
      })),
      catchError((error) => {
        this.utilsService.showToastError('There is an error in retrieving the users in tickets' , 1000);
        console.error('getTicketUser Error: ', error);
        return of(null); // Return an observable with null as a fallback value.
      })
    );
  }
  
  getAllUsers() {
    this.backendService.users().pipe(
      catchError((error) => {
        console.error('Error getting all users:', error);
        return of([]); // Return an empty array as a fallback value.
      })
    ).subscribe((users) => {
      this.users = users;
    });
  }

  onSubmit(form: NgForm) {
    const newTicketPayload = { description: this.descriptionToAdd };
    this.isAdding = true;
    this.backendService.newTicket(newTicketPayload).pipe(
      catchError((error) => {
        console.error('Error creating new ticket:', error);
        this.utilsService.showToastError('An error occured while adding the ticket, Please try again' , 1000);
        this.isAdding = false;
        return of(null); // Return an observable with null as a fallback value.
      })
    ).subscribe((ticket) => {
      if (ticket) {
        this.getAllTickets();
        this.utilsService.showToastSuccess('New ticket ' + ticket.description + ' created');
      }
      this.isAdding = false;
    });
  }

  @ViewChild('ticketTable') ticketTable: Table;
  applyGlobalFilter(value: string) {
    this.ticketTable.filterGlobal(value, 'contains');
  }

  applyUserFilter() {
    if (this.selectedUser) {
      this.ticketTable.filter(this.selectedUser.name, 'user.name', 'contains');
    } else {
      // If no userSelected, remove the filter
      this.ticketTable.filter('', 'user.name', 'contains');
    }
  }

  applyStatusFilter() {
    if (this.selectedStatut) {
      this.ticketTable.filter(this.selectedStatut.status, 'completed', 'contains');
    } else {
      // If no userSelected, remove the filter
      this.ticketTable.filter('', 'completed', 'contains');
    }
  }

}
