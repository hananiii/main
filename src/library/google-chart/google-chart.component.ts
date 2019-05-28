import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-google-chart',
    templateUrl: './google-chart.component.html',
    styleUrls: ['./google-chart.component.scss']
})
export class GoogleChartComponent implements OnInit {

    constructor() { }
    title = 'Employee Leave Statistics';
    type = 'ColumnChart';
    data = [
        ["Mon", 50, 100, 150],
        ["Tue", 30, 200, 100],
        ["Wed", 20, 150, 250],
        ["Thu", 66, 180, 200],
        ["Fri", 80, 100, 230]
    ];
    columnNames = ['Day', 'Rejected', 'Approved', 'Submitted'];
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
    width = 700;
    height = 500;

    ngOnInit() {

    }
}