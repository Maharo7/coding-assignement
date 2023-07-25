import { Component , OnInit , ViewChild } from '@angular/core';
import { Ticket } from '../../interfaces/ticket.interface'
import { BackendService } from '../backend.service';
import { Table } from 'primeng/table';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from 'src/interfaces/user.interface';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  providers: [MessageService, UtilsService],
  styleUrls: ['./list-ticket.component.css']
})
export class ListTicketComponent implements OnInit{
  tickets: Ticket[];
  users: User[];
  searchValue: string | undefined;
  isLoaded : boolean = false;
  descriptionToAdd : string;

  constructor(private backendService :BackendService, private utilsService: UtilsService){
  }

  @ViewChild('ticketTable') ticketTable: Table;

  applyGlobalFilter(value: string) {
    this.ticketTable.filterGlobal(value, 'contains');
  }

  ngOnInit() {
    this.getAllTickets();
    this.getAllUsers();
  }

  getAllTickets() {
    this.backendService.tickets()
    .subscribe((ticket) => {
      if(ticket) {
        this.tickets = ticket;
        this.isLoaded = true;
      }
    })
  }

  getAllUsers() {
    this.backendService.users().subscribe((users) => {
      if (users) {
        this.users = users;
      }
    });
  }

  getUserName(assigneeId: number): string {
    const user = this.users.find((user) => user.id === assigneeId);
    return user ? user.name : '';
  }

  onSubmit(form: NgForm) {
    this.isLoaded = false;
    const newTicketPayload = { description: this.descriptionToAdd };
    this.backendService.newTicket(newTicketPayload).subscribe((ticket) => {
      if(ticket) {
        this.isLoaded = true;
        console.log("New Ticket Created:", ticket);
        this.utilsService.showToastSuccess("New ticket "+ticket.description+ " created");
      }
    });
  }
}
