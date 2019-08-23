import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

/**
 * Employee Directory Page
 * @export
 * @class EmployeeDirectoryPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-employee-directory',
    templateUrl: './employee-directory.page.html',
    styleUrls: ['./employee-directory.page.scss'],
})
export class EmployeeDirectoryPage implements OnInit {

    /**
     *Creates an instance of EmployeeDirectoryPage.
     * @memberof EmployeeDirectoryPage
     */
    constructor() { }

    ngOnInit() { }

}
