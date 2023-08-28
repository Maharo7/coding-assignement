import { Component , OnInit , ViewChild } from '@angular/core';
import { Ticket } from '../../interfaces/ticket.interface'
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { User } from 'src/interfaces/user.interface';
import { UtilsService } from '../utils.service';
import { TicketUser } from 'src/interfaces/ticket-User.interface';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BackendService } from '../backend.service';
import { AddTicketComponent } from '../add-ticket/add-ticket.component';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  providers: [MessageService, UtilsService],
  styleUrls: ['./list-ticket.component.css']
})
export class ListTicketComponent implements OnInit{
  
  tickets: Ticket[] = [];
  ticketsUser: TicketUser[];
  users: User[] = [];
  selectedUser: User;
  searchValue: string | undefined;
  isLoaded: boolean;

  statut: { status: string }[] | undefined;
  selectedStatut: { status: string } | undefined;
  @ViewChild(AddTicketComponent) addTicketComponent: AddTicketComponent;

  constructor(private backendService :BackendService, private utilsService: UtilsService){
  }

  ngOnInit() {
    this.statut = [
      { status: 'true' },
      { status: 'false' }
    ];
    this.getAllUsers();
    this.getAllTickets();
    // this.subscribeToTicketAdded();
  }

  ngAfterViewInit() {
    this.subscribeToTicketAdded();
  }

  private subscribeToTicketAdded() {
    this.addTicketComponent.ticketAdded.subscribe(newTicket => {
      if (newTicket) {
        this.getAllTickets();
      }
    });
  }

  // ngAfterViewInit() {
  //   // Subscribe to the ticketAdded event from AddTicketComponent
  //   this.addTicketComponent.ticketAdded.subscribe(newTicket => {
  //     console.log('TEST');
      
  //     if (newTicket) {
  //       this.tickets.push(newTicket);
  //       this.getAllTickets();
  //     }
  //   });
  // }

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
              // this.isLoaded = true;
              return throwError(error); 
            })
          ).subscribe((ticketUsers: TicketUser[]) => {
            const ticketsUserNotNull = []
            ticketUsers.map((ticketUser) => {
              if(ticketUser){
                ticketsUserNotNull.push(ticketUser);
              }
            })
            this.ticketsUser = ticketsUserNotNull;
            this.isLoaded = true;
          });
        } else {
          this.ticketsUser = [];
          this.isLoaded = true;
        }
      },
      (error) => {
          this.utilsService.showToastError('There is an error in retrieving the tickets' ,1000);
        console.error('getAllTickets Error: ', error);
      }
    );
  }
  
  getTicketUser(ticket: Ticket): Observable<TicketUser> {
    if (!ticket.assigneeId) {
      return of({
        id: ticket.id,
        completed: ticket.completed,
        description: ticket.description,
        user: null 
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
        return of(null); 
      })
    );
  }
  
  getAllUsers() {
    this.backendService.users().pipe(
      catchError((error) => {
        this.utilsService.showToastError('There is an error in retrieving the users' , 1000);
        console.error('Error getting all users:', error);
        return of([]); 
      })
    ).subscribe((users) => {
      if(users){
        this.users = users;
      }
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
      this.ticketTable.filter('', 'user.name', 'contains');
    }
  }

  applyStatusFilter() {
    if (this.selectedStatut) {
      this.ticketTable.filter(this.selectedStatut.status, 'completed', 'contains');
    } else {
      this.ticketTable.filter('', 'completed', 'contains');
    }
  }

}
