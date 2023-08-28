import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ListTicketComponent } from './list-ticket.component';
import { async, of} from 'rxjs';
import { BackendService } from '../backend.service';
import { FormsModule } from '@angular/forms'; 

describe('ListTicketComponent', () => {
  let component: ListTicketComponent;
  let fixture: ComponentFixture<ListTicketComponent>;
  let backendService: BackendService;

  beforeEach(waitForAsync (() => {
    TestBed.configureTestingModule({
      declarations: [ListTicketComponent],
      imports: [FormsModule],
      providers: [BackendService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTicketComponent);
    component = fixture.componentInstance;
    backendService = TestBed.inject(BackendService); 

    fixture.detectChanges();
  });
  

  it('Should get all user', () => {
    const mockUsers = [{ id: 1, name: 'Victor' }];
    spyOn(backendService, 'users').and.returnValue(of(mockUsers));
    component.ngOnInit();
    expect(component.users.length).toBeGreaterThanOrEqual(1);
    expect(component.users[0].name).toEqual('Victor');
  });

});