import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Restaurant } from './restaurant/restaurant.component';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'localhost:3000';

  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl+'/getRestaurants').pipe(
      catchError(this.handleError<Restaurant[]>('getRestaurants', []))
    );
  }

  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.http.post<Restaurant>(this.apiUrl +'/addRestaurant', restaurant).pipe(
      catchError(this.handleError<Restaurant>('addRestaurant'))
    );
  }

  updateRestaurant(restaurant: Restaurant): Observable<any> {
    return this.http.put(this.apiUrl+`restaurant:${restaurant.id}`, restaurant).pipe(
      catchError(this.handleError<any>('updateRestaurant'))
    );
  }

  deleteRestaurant(id: number): Observable<Restaurant> {
    const url = `${this.apiUrl +'restaurant'}/${id}`;
    return this.http.delete<Restaurant>(url).pipe(
      catchError(this.handleError<Restaurant>('deleteRestaurant'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
