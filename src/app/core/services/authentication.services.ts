import { Injectable } from "@angular/core";
import { UserRepository } from "../repository/user.repo";
import { CustomerRepository, StaffRepository } from "../repository";
import { Observable, of, throwError } from "rxjs";

@Injectable({providedIn:"root"})
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private customerRepo: CustomerRepository,
    private staffRepo: StaffRepository
  ) {}

  login(username: string, password: string): Observable<{ username: number; role: string; detailId: number }> {
    const user = this.userRepo.validateUser(username, password);
    let detailId = 0;

    if (!user) {
      return throwError(() => new Error('Invalid username or password.'));
    }

    if (user.role === 'customer') {
      const customerDetailId = this.customerRepo.getCustomerDetailByUserId(user.userId);
      if (customerDetailId === null) {
        return throwError(() => new Error('Customer detail not found for user.'));
      }
      detailId = customerDetailId;
    }

    if (user.role === 'staff') {
      const staffId = this.staffRepo.getStaffIdByUserId(user.userId);
      if (staffId === null) {
        return throwError(() => new Error('Staff ID not found for user.'));
      }
      detailId = staffId;
    }

    return of({
      username: user.userId,
      role: user.role,
      detailId: detailId
    });
  }

  forgotPassword(username: string, newPassword: string): Observable<void> {
    this.userRepo.updateUserPassword(username, newPassword);
    return of(void 0); // or just `of(undefined)` – this is a standard way to represent "done" in observables
  }
}