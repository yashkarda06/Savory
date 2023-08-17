import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { DonationItem } from '../donation/donation.component.js';
@Component({
  selector: 'app-donated-list',
  templateUrl: './donated-list.component.html',
  styleUrls: ['./donated-list.component.scss']
})
export class DonatedListComponent implements OnInit {
  items: any[] = [];

  constructor(private firestore: AngularFirestore) {
    this.getItems();
    this.scheduleExpiryCheck();
  }

  getItems() {
    this.firestore.collection('Donation').valueChanges().subscribe((data) => {
      this.items = data;
    });
  }
  ngOnInit(): void {
   
   
  }

  
  scheduleExpiryCheck() {
    setInterval(() => {
      const now = new Date();
      const expiredItems = this.items.filter(item => item.expiry.toDate() <= now);

      if (expiredItems.length > 0) {
        expiredItems.forEach(item => {
          this.firestore.collection('Donation').doc(item.name).delete()
            .then(() => console.log('Expired item deleted:', item.name))
            .catch(error => console.error('Error deleting expired item:', item.name, error));
        });
      }
    }, 60 * 1000); // Check every minute, you can adjust the interval as needed
  }

}
