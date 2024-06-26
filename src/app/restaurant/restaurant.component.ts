import { Component, OnInit, TemplateRef } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  location: string;
}

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  element: any;
  closeResult: string = '';
  restaurantForm: any;

  restaurants: Restaurant[] = [];
  newRestaurant: Restaurant = { id: 0, name: '', description: '', location: '' };
  editingRestaurant: Restaurant | null = null;
  cols: any = ['Id', 'Name', 'Description', 'Location', '']
  serachText: string = '';
  header: string = 'Add Restaurant';
  rowsPerPage = 5;
  currentPage = 1;
  totalPages = 0;
  data: any;

  constructor(private restaurantService: RestaurantService, private modalService: NgbModal, private fb: FormBuilder) {
    this.restaurantForm = this.fb.group({
      restaurantName: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe(restaurants => this.restaurants = restaurants);
  }

  addRestaurant(modal: any): void {
    modal.close()
    if (this.restaurantForm.valid) {
      let newRestro: Restaurant = { id: this.restaurants.length + 1, ...this.restaurantForm.value }
      this.restaurantService.addRestaurant(newRestro)
      this.restaurants.push(newRestro);
    }
  }

  editRestaurant(restaurant: Restaurant, content: any): void {
    this.header = 'Update Restaurant'
    this.modalService.open(content)
    this.restaurantForm.setValue(restaurant)
  }

  updateRestaurant(): void {
    if (this.editingRestaurant) {
      this.restaurantService.updateRestaurant(this.editingRestaurant).subscribe(() => {
        const index = this.restaurants.findIndex(r => r.id === this.editingRestaurant!.id);
        this.restaurants[index] = this.editingRestaurant!;
        this.editingRestaurant = null;
      });
    }
  }

  deleteRestaurant(id: number): void {
    this.restaurantService.deleteRestaurant(id).subscribe(() => {
      this.restaurants = this.restaurants.filter(r => r.id !== id);
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${'s'}`;
      },
    );
  }
  openModel(content: any) {
    this.open(content);
    this.restaurantForm.reset()
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPage(this.currentPage)

    }
  }
 
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPage(this.currentPage)
    }
  }
  numberClick(page:number){
    this.currentPage = page;
    this.setPage(this.currentPage)

  }
  setPage(page: number) {
    const startIndex = (page - 1) * this.rowsPerPage;
    const endIndex = Math.min(startIndex + this.rowsPerPage - 1, this.data.length - 1);
    this.restaurants = this.data.slice(startIndex, endIndex + 1);
    this.totalPages = Math.ceil(this.data.length / this.rowsPerPage);
  }
}
