import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-email-invitation',
    templateUrl: './email-invitation.page.html',
    styleUrls: ['./email-invitation.page.scss'],
})
export class EmailInvitationPage implements OnInit {

    public application: string = 'WorkHub';
    public admin: string = 'user@example.com';
    public applicationDescription: string = '[include some of the product description and what it can offers to users. It must be brief and not too long]';

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    routeToUpdatePassword() {
        this.router.navigate(['/main/update-password']);
    }



}
