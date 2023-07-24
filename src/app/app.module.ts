import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import { HeaderComponent } from './header/header.component';
import {ButtonModule} from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { ListTicketComponent } from './list-ticket/list-ticket.component';
import { FieldsetModule } from 'primeng/fieldset';

@NgModule({
    declarations: [AppComponent, HeaderComponent, ListTicketComponent],
    imports: [BrowserModule,ButtonModule,TabMenuModule,FieldsetModule],
    providers: [BackendService],
    bootstrap: [AppComponent]
})
export class AppModule {

}
