import { Injectable } from "@angular/core";
import { UserRepository } from "../repository/user.repo";
import { CustomerRepository, StaffRepository } from "../repository";

@Injectable({providedIn:"root"})
export class AuthService{
    constructor(private userRepo:UserRepository, private customerRepo:CustomerRepository, private staffRepo:StaffRepository){}
    login(username:string,password:string){
        const user=this.userRepo.validateUser(username,password);
        var detailId = 0;
        if(!user){
               throw new Error('Invalid username or password.');
        }
        if(user.role === 'customer'){
            const customerDetailId = this.customerRepo.getCustomerDetailByUserId(user.userId);
            if (customerDetailId === null) {
                throw new Error('Customer detail not found for user.');
            }
            detailId = customerDetailId;
        }
        if(user.role === 'staff'){
            const staffId = this.staffRepo.getStaffIdByUserId(user.userId);
            if (staffId === null) {
                throw new Error('Staff ID not found for user.');
            }
            detailId = staffId;
        }

        return {
            username: user.userId,
            role: user.role,
            detailId: detailId
        };
    }
       forgotPassword(username: string, newPassword: string): void {
        this.userRepo.updateUserPassword(username, newPassword);
    }
}