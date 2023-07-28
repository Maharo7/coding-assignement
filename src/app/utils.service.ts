import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private messageService: MessageService) { }

  showToastSuccess(message : string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showToastSuccessWithDelay(message : string , delay : number) {
    setTimeout(() => {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }, delay);
  }

  showToastError(message : string , delay : number) {
    setTimeout(() => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
    }, delay);
    
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
