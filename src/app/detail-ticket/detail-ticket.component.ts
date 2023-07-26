import { Component , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/interfaces/ticket.interface';
import { User } from 'src/interfaces/user.interface';
import { BackendService } from '../backend.service';
import { UtilsService } from '../utils.service';

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

  assignTicket(){
    this.isAssignLoaded = true;
    this.backendService.assign(this.ticket.id,this.selectedUser.id).subscribe((ticket) => {
      if(ticket){
        this.user=this.selectedUser;
      }
      this.isAssignLoaded = false;
    })
  }

  completeTicket() {
    this.backendService.complete(this.ticket.id,true).subscribe((ticket) => {
      if(ticket){
        this.ticket=ticket;
      }
    })
  }

}  
