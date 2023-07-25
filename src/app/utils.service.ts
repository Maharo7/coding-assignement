import { Injectable } from '@angular/core';
import { MessageService } from 'primeng-lts/api';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private messageService: MessageService) { }

  showToastSuccess(message : string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }
}
