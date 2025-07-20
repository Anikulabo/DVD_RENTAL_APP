import { Injectable } from "@angular/core";
import { UserRecord } from "../model";
import { BaseRepository } from "./baseRepository";
@Injectable({
    providedIn: 'root',
})
export class UserRepository extends BaseRepository<UserRecord> {
    protected idKey = 'userId';

    getUserByUsername(username: string): UserRecord | null {
        return this._items.find(user => user.username === username) ?? null;
    }

    updateUserPassword(username: string, newPassword: string): void {
        const user = this.getUserByUsername(username);
        if (!user) {
            throw new Error(`User with username '${username}' not found.`);
        }
        this.update(user.userId,{password:newPassword})
    }

    addUser(user: UserRecord): void {
        if (this.getUserByUsername(user.username)) {
            throw new Error(`Username ${user.username} already exists.`);
        }
        this.add(user); // Safe now
    }

    validateUser(username: string, password: string): UserRecord | null {
        return this._items.find(
            u => u.username === username && u.password === password
        ) ?? null;
    }
}
