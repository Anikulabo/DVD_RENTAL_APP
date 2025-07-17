import { Injectable } from "@angular/core";
import { BaseRepository } from "./baseRepository";
import { Rental } from "../model/rental.model";

@Injectable({providedIn:"root"})
export class RentalRepository extends BaseRepository<Rental>{
    protected idKey="rentalId"
}