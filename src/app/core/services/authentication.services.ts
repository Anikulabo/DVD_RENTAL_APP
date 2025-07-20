import { Injectable } from "@angular/core";
import { UserRepository } from "../repository/user.repo";

@Injectable({providedIn:"root"})
export class AuthService{
    constructor(private userRepo:UserRepository){}
    login(username:string,password:string){
        const user=this.userRepo.validateUser(username,password);
        if(!user){
               throw new Error('Invalid username or password.');
        }
           return {
            username: user.username,
            role: user.role
        };
    }
       forgotPassword(username: string, newPassword: string): void {
        this.userRepo.updateUserPassword(username, newPassword);
    }
}