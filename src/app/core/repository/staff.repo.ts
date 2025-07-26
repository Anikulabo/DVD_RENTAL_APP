import { Injectable } from "@angular/core";
import { BaseRepository } from "./baseRepository";
import { Staff } from "../model/staff.model";

@Injectable({providedIn:"root"})
export class StaffRepository extends BaseRepository<Staff>{
    protected idKey="staffId"
      getStaffIdByUserId(userId: number): number | null {
        return this.getAll().find(staff => staff.userId === userId)?.staffId || null;
    }
}