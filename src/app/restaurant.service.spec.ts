import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant/restaurant.component';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestaurantService]
    });
    service = TestBed.inject(RestaurantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch restaurants', () => {
    const dummyRestaurants: Restaurant[] = [
      { id: 1, name: 'Test Restaurant', description: 'Test Description', location: 'Test Location' }
    ];

    service.getRestaurants().subscribe(restaurants => {
      expect(restaurants.length).toBe(1);
      expect(restaurants).toEqual(dummyRestaurants);
    });

    const req = httpMock.expectOne('localhost:3000/getRestaurants');
    expect(req.request.method).toBe('GET');
    req.flush(dummyRestaurants);
  });

  it('should add a restaurant', () => {
    const newRestaurant: Restaurant = { id: 2, name: 'New Restaurant', description: 'New Description', location: 'New Location' };

    service.addRestaurant(newRestaurant).subscribe(restaurant => {
      expect(restaurant).toEqual(newRestaurant);
    });

    const req = httpMock.expectOne('localhost:3000/addRestaurant');
    expect(req.request.method).toBe('POST');
    req.flush(newRestaurant);
  });

  it('should update a restaurant', () => {
    const updatedRestaurant: Restaurant = { id: 1, name: 'Updated Restaurant', description: 'Updated Description', location: 'Updated Location' };

    service.updateRestaurant(updatedRestaurant).subscribe(response => {
      expect(response).toEqual(updatedRestaurant);
    });

    const req = httpMock.expectOne('localhost:3000restaurant:1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedRestaurant);
  });

  it('should delete a restaurant', () => {
    const restaurantId = 1;

    service.deleteRestaurant(restaurantId).subscribe(response => {
      expect(response.id).toBe(restaurantId);
    });

    const req = httpMock.expectOne('localhost:3000restaurant/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ id: restaurantId, name: '', description: '', location: '' });
  });

  it('should handle errors gracefully', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };

    service.getRestaurants().subscribe(
      data => fail('should have failed with 404 error'),
      (error) => {
        expect(error).toBe('operation failed: Not Found');
      }
    );

    const req = httpMock.expectOne('localhost:3000/getRestaurants');
    req.flush('Not Found', errorResponse);
  });
});
