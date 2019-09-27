import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Email Invitation Page
 * @export
 * @class EmailInvitationComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-email-invitation',
    templateUrl: './email-invitation.component.html',
    styleUrls: ['./email-invitation.component.scss'],
})
export class EmailInvitationComponent implements OnInit {

    /**
     * This is local property for data binding
     * @type {string}
     * @memberof EmailInvitationComponent
     */
    public application: string = 'WorkHub';

    /**
     * This is local property for data binding
     * @type {string}
     * @memberof EmailInvitationComponent
     */
    public admin: string = 'user@example.com';

    /**
     * This is local property for data binding
     * @type {string}
     * @memberof EmailInvitationComponent
     */
    public applicationDescription: string = '[include some of the product description and what it can offers to users. It must be brief and not too long]';

    /**
     *Creates an instance of EmailInvitationComponent.
     * @param {Router} router
     * @memberof EmailInvitationComponent
     */
    constructor(private router: Router) {
    }

    /**
     * Initial method
     * @memberof EmailInvitationComponent
     */
    ngOnInit() {
    }

    /**
     * This method is used to route to first time update password page
     *
     * @memberof EmailInvitationComponent
     */
    routeToUpdatePassword() {
        this.router.navigate(['/update-password']);
    }



}
