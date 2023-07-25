import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule , Routes } from '@angular/router';
import { ListTicketComponent } from './list-ticket/list-ticket.component';

const routes: Routes = [
  {path: "", redirectTo: "list-ticket", pathMatch: "full"},
  {path : "list-ticket", component : ListTicketComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
