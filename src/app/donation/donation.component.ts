import { Component, OnInit } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs'
import { NgForm } from '@angular/forms';

interface Donation{
  Address: string;
  District: string;
  // Email: string;
  Phone: string;
  Quantity: string;
  category: string;
  name: string;
  type: string;
  expiry: Date;
}


@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss']
})
export class DonationComponent implements OnInit {
 
  ngOnInit(): void {
    
  }
  private donationsCollection!: AngularFirestoreCollection<Donation>;
  donations !: Observable<Donation[]>;

  constructor(private firestore: AngularFirestore) { }

 
    onSubmit(form: NgForm) {
      const data: Donation = {
        name: form.value.foodname,
        type: form.value.meal,
        category: form.value['image-choice'],
        Quantity: form.value.Quantity,
        Phone: form.value.Phone,
        // Email: form.value.Email,
        District: form.value.District,
        Address: form.value.Address,
        expiry: form.value.expiry
      };
      console.log(data); // log data to check if all fields are defined and have a value
      this.firestore.collection('Donation').add(data)
        .then(() => console.log('Data added successfully!'))
        .catch((error) => console.error('Error adding data: ', error));
        form.resetForm();
    }
}
export interface DonationItem {
  name: string;
  type: string;
  category: string;
  Quantity: string;
  Phone: string;
  // Email: string;
  expiry:Date;
  District: string;
  Address: string;
}