import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import { HeaderComponent } from './header/header.component';
import {ButtonModule} from 'primeng-lts/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { ListTicketComponent } from './list-ticket/list-ticket.component';
import { FieldsetModule } from 'primeng/fieldset';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { UtilsService } from './utils.service';
import { DropdownModule } from 'primeng/dropdown';
import { DetailTicketComponent } from './detail-ticket/detail-ticket.component';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng-lts/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
    declarations: [AppComponent, HeaderComponent, ListTicketComponent, DetailTicketComponent, PageNotFoundComponent],
    imports: [BrowserModule, ButtonModule, TabMenuModule, FieldsetModule, AppRoutingModule, BrowserAnimationsModule, FormsModule, CardModule, TableModule,
        ProgressSpinnerModule, InputTextModule, ToastModule, DropdownModule, TagModule, InputTextareaModule],
    providers: [BackendService, UtilsService ,MessageService],
    bootstrap: [AppComponent]
})
export class AppModule {

}
