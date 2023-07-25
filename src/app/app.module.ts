import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import { HeaderComponent } from './header/header.component';
import {ButtonModule} from 'primeng/button';
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

@NgModule({
    declarations: [AppComponent, HeaderComponent, ListTicketComponent],
    imports: [BrowserModule, ButtonModule, TabMenuModule, FieldsetModule, AppRoutingModule, BrowserAnimationsModule, FormsModule, CardModule, TableModule,
        ProgressSpinnerModule, InputTextModule, ToastModule],
    providers: [BackendService, UtilsService],
    bootstrap: [AppComponent]
})
export class AppModule {

}
