import { Component, Input, OnInit } from '@angular/core';
/**
 * Spinner Component
 * @export
 * @class SpinnerComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
    /**
     * This is local input property of color
     * @memberof SpinnerComponent
     */
    @Input() color = 'primary';

    /**
     *Creates an instance of SpinnerComponent.
     * @memberof SpinnerComponent
     */
    constructor() { }

    /**
     * Initial method
     * @memberof SpinnerComponent
     */
    ngOnInit() {

    }
}