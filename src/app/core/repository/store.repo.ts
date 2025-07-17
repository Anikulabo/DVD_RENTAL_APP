import { Injectable } from "@angular/core";
import { BaseRepository } from "./baseRepository";
import { Store } from "../model/store.model";
@Injectable({
    providedIn:"root"
})
export class StoreRepository extends BaseRepository<Store>{
    protected  idKey="storeId"
}