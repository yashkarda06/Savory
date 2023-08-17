import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'app/shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

interface Wastage {
  id: string;
  userId: string; // Add userId field
  name: string;
  Date: string;
  quantity: number;
  Reason: string;
}

@Component({
  selector: 'app-waste-tracking',
  templateUrl: './waste-tracking.component.html',
  styleUrls: ['./waste-tracking.component.scss']
})
export class WasteTrackingComponent implements OnInit {

  items: Wastage[] = [];
  filteredItems: Wastage[] = [];
  newItem: Wastage = {
    id:'',
    userId: '', // Initialize userId
    name: '',
    Date: '',
    quantity: 0,
    Reason: ''
  };
  private wastageCollection: AngularFirestoreCollection<Wastage>;
  wastage$: Observable<Wastage[]>;
  showForm: boolean = false;
  constructor(
    private firestore: AngularFirestore,
    public authService: AuthService,
    private httpClient: HttpClient
  ) {
    this.wastageCollection = firestore.collection<Wastage>('wastage');
    this.wastage$ = this.wastageCollection.valueChanges({ idField: 'id' });
  }

  ngOnInit(): void {
    this.authService.afAuth.authState.subscribe(user => {
      if (user) {
        this.wastage$ = this.wastageCollection.valueChanges({ idField: 'id' }).pipe(
          map(items => items.filter(item => item.userId === user.uid))
        );
  
        this.wastage$.subscribe(items => {
          this.items = items;
          this.filteredItems = items;
        });
      }
    });
  }

  addItem() {
    const id = uuidv4();
    const userId = this.authService.getCurrentUser(); // Get the current user's ID
    const newItem: Wastage = { ...this.newItem, id, userId };
    this.items.push(newItem);
    this.filteredItems = this.items;
    this.newItem = {
      id:'',
      userId: '',
      name: '',
      Date: '',
      quantity: 0,
      Reason: ''
    };
    this.showForm = false;

    // Add the new item to Firebase
    this.firestore.collection('wastage').doc(id).set(newItem);
  }
  
 
  deleteItem(item: Wastage) {
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this.items.splice(index, 1);
      this.filteredItems = this.items;

      // Delete the item from Firestore using its ID
      this.firestore.collection<Wastage>('wastage').doc(item.id)
        .delete()
        .then(() => {
          console.log('Item deleted successfully from the backend.');
        })
        .catch(error => {
          console.error('Error deleting item:', error);
        });
    }
  }
  
  SendReport() {
    const emailData = {
      recipient: this.authService.getUserEmail(),
      subject: 'Waste Tracking Report',
      content: this.generateReportContent()
    };
  console.log(emailData.recipient)
    this.httpClient.post('http://localhost:1500/send-email', emailData)
      .subscribe(
        response => console.log('Report email sent successfully:', response),
        error => console.error('Failed to send report email:', error)
      );
  }
  
  generateReportContent(): string {
    let reportContent = 'Waste Tracking Report:\n\n';
  
    reportContent += 'Food Name\tQuantity Wasted\tDate\tReason\n';
  
    this.items.forEach(item => {
      reportContent += `${item.name}\t${item.quantity}\t${item.Date}\t${item.Reason}\n`;
    });
  
    return reportContent;
  }
  

}
