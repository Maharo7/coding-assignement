import { Component , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/interfaces/ticket.interface';
import { User } from 'src/interfaces/user.interface';
import { BackendService } from '../backend.service';
import { UtilsService } from '../utils.service';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'app-detail-ticket',
  templateUrl: './detail-ticket.component.html',
  styleUrls: ['./detail-ticket.component.css']
})
export class DetailTicketComponent implements OnInit {
  ticket : Ticket;
  user : User;
  isLoaded : boolean;
  usersToSelect : User[];
  selectedUser : User;
  isAssignLoaded: boolean;
  isCompleteLoaded : boolean;
  id : number;

  constructor(private route : ActivatedRoute, private backendService :BackendService , private utilsService :UtilsService){
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getTicketsById(this.id);
    this.getAllUsers();
  }

  getTicketsById(id: number) {
    this.isLoaded = false;
    this.backendService.ticket(id).pipe(
      catchError((error) => {
        console.error('Error retrieving ticket:', error);
        this.utilsService.showToastError('An error occurred while retrieving the ticket.', 1000);
        return of(null);
      })
    ).subscribe((ticket) => {
      if (ticket) {
        this.ticket = ticket;
        if (ticket.assigneeId) {
          this.backendService.user(ticket.assigneeId).pipe(
            catchError((error) => {
              console.error('Error retrieving user:', error);
              this.utilsService.showToastError('An error occurred while retrieving the user.', 1000);
              return of(null);
            })
          ).subscribe((user) => {
            if (user) {
              this.user = user;
            }
            this.isLoaded = true;
          });
        } else {
          this.isLoaded = true;
        }
      }
    });
  }

  getSeverity(status : boolean) {
    return this.utilsService.getSeverityForStatut(status);
  }

  getAllUsers() {
    this.backendService.users().pipe(
      catchError((error) => {
        console.error('Error getting all users:', error);
        return of([]); 
      })
    ).subscribe((users) => {
      this.usersToSelect = users;
    });
  }

  assignTicket() {
    this.isAssignLoaded = true;
    this.backendService.assign(this.ticket.id, this.selectedUser.id).pipe(
      catchError((error) => {
        this.utilsService.showToastError('Failed to assign the ticket' , 2000);
        console.error('Error assigning ticket:', error);
        // this.isAssignLoaded = false;
        return of(null);
      })
    ).subscribe((ticket) => {
      if (ticket) {
        this.user = this.selectedUser;
      }
      this.isAssignLoaded = false;
    });
  }

  completeTicket() {
    this.isCompleteLoaded = true;
    this.backendService.complete(this.ticket.id,true).pipe(
      catchError((error) => {
        console.error('Error completing ticket:', error);
        this.utilsService.showToastError('Failed to complete the ticket' , 2000);
        // this.isCompleteLoaded = false;
        return of(null);
      })
    )
    .subscribe((ticket) => {
      if(ticket){
        this.ticket=ticket;
      }
      this.isCompleteLoaded = false;
    })
  }

}  
