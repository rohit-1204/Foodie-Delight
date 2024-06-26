import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantComponent, Restaurant } from './restaurant.component';
import { RestaurantService } from '../restaurant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

class MockRestaurantService {
  getRestaurants() {
    return of([
      { id: 1, name: 'Test Restaurant', description: 'Test Description', location: 'Test Location' }
    ]);
  }
  addRestaurant(restaurant: Restaurant) {
    return of(restaurant);
  }
  updateRestaurant(restaurant: Restaurant) {
    return of(restaurant);
  }
  deleteRestaurant(id: number) {
    return of(id);
  }
}

class MockNgbModal {
  open(content: any) {
    return {
      result: Promise.resolve('Mock result')
    };
  }
}

describe('RestaurantComponent', () => {
  let component: RestaurantComponent;
  let fixture: ComponentFixture<RestaurantComponent>;
  let restaurantService: RestaurantService;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RestaurantComponent],
      providers: [
        { provide: RestaurantService, useClass: MockRestaurantService },
        { provide: NgbModal, useClass: MockNgbModal },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantComponent);
    component = fixture.componentInstance;
    restaurantService = TestBed.inject(RestaurantService);
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch restaurants on init', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.restaurants.length).toBe(1);
  });

  it('should open modal and reset form on openModel', () => {
    spyOn(component, 'open').and.callThrough();
    component.openModel({} as any);
    expect(component.open).toHaveBeenCalled();
    expect(component.restaurantForm.value).toEqual({ restaurantName: '', description: '', location: '' });
  });

  it('should add a restaurant', () => {
    component.restaurantForm.setValue({ restaurantName: 'New Restaurant', description: 'New Description', location: 'New Location' });
    spyOn(restaurantService, 'addRestaurant').and.callThrough();
    spyOn(component.restaurants, 'push');
    component.addRestaurant({ close: () => {} });
    expect(restaurantService.addRestaurant).toHaveBeenCalled();
    expect(component.restaurants.push).toHaveBeenCalled();
  });

  it('should edit a restaurant', () => {
    const restaurant: Restaurant = { id: 1, name: 'Test Restaurant', description: 'Test Description', location: 'Test Location' };
    component.editRestaurant(restaurant, {});
    expect(component.header).toBe('Update Restaurant');
    expect(component.restaurantForm.value).toEqual({ restaurantName: 'Test Restaurant', description: 'Test Description', location: 'Test Location' });
  });

  it('should update a restaurant', () => {
    component.editingRestaurant = { id: 1, name: 'Updated Restaurant', description: 'Updated Description', location: 'Updated Location' };
    spyOn(restaurantService, 'updateRestaurant').and.callThrough();
    component.updateRestaurant();
    expect(restaurantService.updateRestaurant).toHaveBeenCalled();
    expect(component.editingRestaurant).toBeNull();
  });

  it('should delete a restaurant', () => {
    spyOn(restaurantService, 'deleteRestaurant').and.callThrough();
    component.deleteRestaurant(1);
    expect(restaurantService.deleteRestaurant).toHaveBeenCalled();
  });

  it('should navigate to the next page', () => {
    component.totalPages = 2;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should navigate to the previous page', () => {
    component.currentPage = 2;
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should set the current page on number click', () => {
    component.numberClick(2);
    expect(component.currentPage).toBe(2);
  });

  it('should set the restaurants for the current page', () => {
    component.data = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Restaurant ${i + 1}`,
      description: `Description ${i + 1}`,
      location: `Location ${i + 1}`
    }));
    component.rowsPerPage = 5;
    component.setPage(1);
    expect(component.restaurants.length).toBe(5);
  });
});
