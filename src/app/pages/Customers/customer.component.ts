import { Component } from '@angular/core';
@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css'],
    standalone: true // 🔥 THIS IS MISSING
})
export class CustomerComponent {
    constructor() {
        console.log('CustomerComponent initialized');
    }
}