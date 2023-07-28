import { Component , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/interfaces/ticket.interface';
import { User } from 'src/interfaces/user.interface';
import { BackendService } from '../backend.service';
import { UtilsService } from '../utils.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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

  constructor(private route : ActivatedRoute, private backendService :BackendService , private utilsService :UtilsService){
  }

  ngOnInit() {
    const id = this.route.snapshot.params["id"];
    this.getTicketsById(id);
    this.getAllUsers();
  }

  getTicketsById(id : number) {
    this.isLoaded = false;
    this.backendService.ticket(id).subscribe(
      (ticket) => {
        if(ticket){
          this.ticket = ticket;
          if(ticket.assigneeId) {
            this.backendService.user(ticket.assigneeId).subscribe(
              (user) => {
                if(user) {
                  this.user = user;
                }
                this.isLoaded = true;
              }
            )
          }  
          else { this.isLoaded = true; } 
        }
      }
    )
  }

  getSeverity(status : boolean) {
    return this.utilsService.getSeverityForStatut(status);
  }

  getAllUsers() {
    this.backendService.users().subscribe((users) => {
      if (users) {
        this.usersToSelect = users;
      }
    });
  }

  assignTicket() {
    this.isAssignLoaded = true;
    this.backendService.assign(this.ticket.id, this.selectedUser.id).pipe(
      catchError((error) => {
        this.utilsService.showToastError('Failed to assign the ticket' , 0);
        console.error('Error assigning ticket:', error);
        this.isAssignLoaded = false;
        return of(null);
      })
    ).subscribe((ticket) => {
      if (ticket) {
        this.user = this.selectedUser;
        // this.utilsService.showToastSuccessWithDelay('Ticket : '+ticket.description+ ' assigned to '+this.selectedUser.name ,2000 );
      }
      this.isAssignLoaded = false;
    });
  }

  completeTicket() {
    this.isCompleteLoaded = true;
    this.backendService.complete(this.ticket.id,true).pipe(
      catchError((error) => {
        console.error('Error completing ticket:', error);
        this.utilsService.showToastError('Failed to complete the ticket' , 0);
        this.isCompleteLoaded = false;
        return of(null);
      })
    )
    .subscribe((ticket) => {
      if(ticket){
        this.ticket=ticket;
        // this.utilsService.showToastSuccessWithDelay('Ticket : '+ticket.description+ ' completed' ,2000 );
      }
      this.isCompleteLoaded = false;
    })
  }

}  
