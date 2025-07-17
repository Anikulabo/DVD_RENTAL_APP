import { Injectable } from "@angular/core";
import { BaseRepository } from "./baseRepository";
import { Payment } from "../model/payment.model";

@Injectable({
    providedIn:"root"
})
export class PaymentRepository extends BaseRepository<Payment>{
    protected idKey="paymentId"
}