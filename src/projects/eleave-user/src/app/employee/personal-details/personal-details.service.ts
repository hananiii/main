import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export enum genderStatus {
    "Female",
    "Male"
}

export enum maritalStatus {
    "Single",
    "Married"
}

/**
 * Get changed value of profile completeness percentage
 * @export
 * @class PersonalDetailsService
 */
@Injectable()
export class PersonalDetailsService {
    /**
     * Emit the changed value
     * @memberof PersonalDetailsService
     */
    percentChanged = new BehaviorSubject<any>(null);

    /**
     *Creates an instance of PersonalDetailsService.
     * @memberof PersonalDetailsService
     */
    constructor() {
    }

}