import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

interface FoodItem {
  id: string;
  userId: string;
  name: string;
  expiry: string;
  quantity: number;
  price: number;
  photo: string;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  items: FoodItem[] = [];
  filteredItems: FoodItem[] = [];
  newFoodItem: FoodItem = {
    id:'',
    userId: '',
    name: '',
    expiry: '',
    quantity: 0,
    price: 0,
    photo: ''
  };
  searchTerm: string = '';
  showForm: boolean = false;
  private foodItemsCollection: AngularFirestoreCollection<FoodItem>;
  foodItems$: Observable<FoodItem[]> | undefined;

  constructor(
    private firestore: AngularFirestore,
    public authService: AuthService,
    private httpClient: HttpClient
  ) { 
    this.foodItemsCollection = firestore.collection<FoodItem>('inventory');
  }

  ngOnInit(): void {
    this.authService.afAuth.authState.subscribe(user => {
      if (user) {
        this.foodItems$ = this.foodItemsCollection.valueChanges({ idField: 'id' }).pipe(
          map(items => items.filter(item => item.userId === user.uid))
        );

        this.foodItems$.subscribe(items => {
          this.items = items;
          this.filteredItems = items;
        });
      }
    });
  }

  addItem() {
    const id = uuidv4();
    const userId = this.authService.getCurrentUser();
    const newItem: FoodItem = { ...this.newFoodItem, id, userId };
    this.items.push(newItem);
    this.filteredItems = this.items;
    this.newFoodItem = {
      id: '',
      userId: '',
      name: '',
      expiry: '',
      quantity: 0,
      price: 0,
      photo: ''
    };
    this.showForm = false;

    // Add the new item to Firebase
    this.firestore.collection('inventory').doc(id).set(newItem);
    this.checkExpiry();
  }



editItem(item: FoodItem) {
  const index = this.items.indexOf(item);
  if (index >= 0) {
    // Create a copy of the item to edit
    const editedItem = { ...item };
    // Open the form and prefill it with the item data
    this.newFoodItem = editedItem;
    this.showForm = true;
    // Remove the original item from the list
    this.items.splice(index, 1);
    this.filteredItems = this.items;
    // Delete the original item from Firestore
    this.firestore.collection('inventory').doc(item.id).delete()
      .then(() => console.log('Food item deleted from Firestore!'))
      .catch(error => console.error('Error deleting food item from Firestore: ', error));
  }
  this.checkExpiry();
}

  

  deleteItem(item: FoodItem) {
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this.items.splice(index, 1);
      this.filteredItems = this.items;
  
      // Delete the item from Firebase using its ID
      this.firestore.collection('inventory').doc(item.id).delete();
    }
    this.checkExpiry();
  }
  

  filterItems() {
    this.firestore.collection<FoodItem>('inventory', ref => ref.where('name', '>=', this.searchTerm)
      .where('name', '<=', this.searchTerm + '\uf8ff')).valueChanges().subscribe(items => {
        this.filteredItems = items;
      });
      this.checkExpiry();
  }
  
  checkExpiry() {
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  
    // Filter the items that are going to expire in two days
    const expiringItems = this.items.filter(item => new Date(item.expiry) <= twoDaysFromNow);
  
    // Iterate through the expiring items and send email notifications
    expiringItems.forEach(item => {
      const emailData = {
        recipient: this.authService.getUserEmail(), // Update with the recipient's email address
        subject: 'Expiry Notification',
        content: `The item '${item.name}' is going to expire on ${item.expiry}.`
      };
  
      this.httpClient.post('http://localhost:1500/send-email', emailData)
        .subscribe(
          response => console.log('Email sent successfully:', response),
          error => console.error('Failed to send email:', error)
        );
    });
  }
  

}
