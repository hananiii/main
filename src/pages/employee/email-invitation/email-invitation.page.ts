import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Email Invitation Page
 * @export
 * @class EmailInvitationPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-email-invitation',
    templateUrl: './email-invitation.page.html',
    styleUrls: ['./email-invitation.page.scss'],
})
export class EmailInvitationPage implements OnInit {

    /**
     * This is local property for data binding
     * @type {string}
     * @memberof EmailInvitationPage
     */
    public application: string = 'WorkHub';

    /**
     * This is local property for data binding
     * @type {string}
     * @memberof EmailInvitationPage
     */
    public admin: string = 'user@example.com';

    /**
     * This is local property for data binding
     * @type {string}
     * @memberof EmailInvitationPage
     */
    public applicationDescription: string = '[include some of the product description and what it can offers to users. It must be brief and not too long]';

    /**
     *Creates an instance of EmailInvitationPage.
     * @param {Router} router
     * @memberof EmailInvitationPage
     */
    constructor(private router: Router) {
    }

    /**
     * Initial method
     * @memberof EmailInvitationPage
     */
    ngOnInit() {
    }

    /**
     * This method is used to route to first time update password page
     *
     * @memberof EmailInvitationPage
     */
    routeToUpdatePassword() {
        this.router.navigate(['/update-password']);
    }



}
