import { Injectable } from "@angular/core";
import { BaseRepository } from "./baseRepository";
import { Inventory } from "../model/inventory.model";

@Injectable({providedIn:"root"})
export class InventoryRepository extends BaseRepository<Inventory>{
    protected idKey="inventoryId"
}