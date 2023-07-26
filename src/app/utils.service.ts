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

  getSeverityForStatut(status: boolean) {
    switch (status) {
        case true:
            return 'success';
        case false:
            return 'danger';
    }
  }
}
