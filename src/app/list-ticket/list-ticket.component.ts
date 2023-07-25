import { Component , OnInit , ViewChild } from '@angular/core';
import { Ticket } from '../../interfaces/ticket.interface'
import { BackendService } from '../backend.service';
import { Table } from 'primeng/table'; // Import the Table class from PrimeNG


@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  styleUrls: ['./list-ticket.component.css']
})
export class ListTicketComponent implements OnInit{
  tickets;
  searchValue: string | undefined;
  isLoaded : boolean = false;

  constructor(private backendService :BackendService){
  }

  @ViewChild('ticketTable') ticketTable: Table;

  applyGlobalFilter(value: string) {
    this.ticketTable.filterGlobal(value, 'contains');
  }

  ngOnInit() {
    this.getAllTickets();
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
}
