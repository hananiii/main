import { Component, OnInit } from '@angular/core';
/**
 * Google Chart Component
 * @export
 * @class GoogleChartComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-google-chart',
    templateUrl: './google-chart.component.html',
    styleUrls: ['./google-chart.component.scss']
})
export class GoogleChartComponent implements OnInit {
    /**
     *Creates an instance of GoogleChartComponent.
     * @memberof GoogleChartComponent
     */
    constructor() { }

    /**
     * This is input property of title in google chart
     * @memberof GoogleChartComponent
     */
    title = 'Employee Leave Statistics';

    /**
     * This is input property of type in google chart
     * @memberof GoogleChartComponent
     */
    type = 'ColumnChart';

    /**
     * This is input property of data in google chart
     * @memberof GoogleChartComponent
     */
    data = [
        ["Mon", 50, 100, 150],
        ["Tue", 30, 200, 100],
        ["Wed", 20, 150, 250],
        ["Thu", 66, 180, 200],
        ["Fri", 80, 100, 230]
    ];

    /**
     * This is input property of columnNames in google chart
     * @memberof GoogleChartComponent
     */
    columnNames = ['Day', 'Rejected', 'Approved', 'Submitted'];

    /**
     * This is input property of options in google chart
     * @memberof GoogleChartComponent
     */
    options = {
        hAxis: {
            title: ''
        },
        vAxis: {
            minValue: 0
        },
        isStacked: true,
        colors: ['#e95c4b', '#1e9965', '#edce51'],
    };

    /**
     * This is input property of width in google chart
     * @memberof GoogleChartComponent
     */
    width = 600;

    /**
     * This is input property of height in google chart
     * @memberof GoogleChartComponent
     */
    height = 500;

    /**
     * Initial method
     * @memberof GoogleChartComponent
     */
    ngOnInit() {

    }
}