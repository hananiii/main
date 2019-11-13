import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { RequestOptions, Http, Headers } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { LocalStorageService } from 'angular-web-storage';

/**
 * Bulk Import Page
 * @export
 * @class BulkImportComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-bulk-import',
    templateUrl: './bulk-import.component.html',
    styleUrls: ['./bulk-import.component.scss'],
})
export class BulkImportComponent implements OnInit {

    /**
     * Get file name of imported/dropped file
     * @type {*}
     * @memberof BulkImportComponent
     */
    public filename: any;

    /**
     * Show upload button after imported/dropped file
     * @memberof BulkImportComponent
     */
    public showUploadButton: boolean = false;

    /**
     * Form group format for file
     * @type {FormGroup}
     * @memberof BulkImportComponent
     */
    public fileform: FormGroup;

    /**
     * Get document info from imported/dropped file
     * @type {UploadFile[]}
     * @memberof BulkImportComponent
     */
    public files: UploadFile[] = [];

    /**
     * Form data from document to post to API
     * @type {FormData}
     * @memberof BulkImportComponent
     */
    public formData: FormData = new FormData();

    /**
     * emit output to close menu
     * @memberof BulkImportComponent
     */
    @Output() closeMenu = new EventEmitter();


    /**
     * Return value of filename from imported document
     * @readonly
     * @type {string}
     * @memberof BulkImportComponent
     */
    get fileName(): string {
        return this.filename;
    }

    /**
     *Creates an instance of BulkImportComponent.
     * @param {Http} http
     * @param {FormBuilder} fb
     * @param {LocalStorageService} local
     * @memberof BulkImportComponent
     */
    constructor(private http: Http, private fb: FormBuilder, public local: LocalStorageService) {
    }

    ngOnInit() {
        this.fileform = this.fb.group({
            file: ''
        });
    }

    /**
    * To download CSV employee data Template 
    * @memberof BulkImportComponent
    */
    downloadFile() {
        const blob = new Blob([`STAFF_EMAIL,STAFF_ID,FULLNAME,NICKNAME,NRIC,DOB,GENDER,PHONE_NUMBER,COMPANY_NUMBER,MARITAL_STATUS,ADDRESS,POSTCODE,CITY,STATE,COUNTRY,DESIGNATION,DEPARTMENT,COST_CENTRE,BRANCH,DIVISION,COMPANY,JOIN_DATE,CONFIRMATION_DATE,RESIGNATION_DATE
        leavetest@zen.com.my,ZEN-00001,Test 1 ZEN,Test 1,990101-10-5656,2018-09-07,Male,012-3338272,13222222,Single,"This is address,",44333,Shah Alam,Selangor,Malaysia,Software Tester,Tester,,Cyberjaya,,Zen Company Sdn Bhd,2018-07-09,2018-12-09,2021-12-31
        leavetest2@zen.com.my,ZEN-00002,Test 2 ZEN,Test 2,870101-10-5680,2018-07-09,Female,,1344433,Married,,,,,Malaysia,Software Engineer,Tester,,Cyberjaya,,Zen Company Sdn Bhd,2018-07-09,2018-10-09,2020-07-09
        leavetest2@zen.com.my,ZEN-00002,Test 2 ZEN,Test 3,000101-07-5682,2018-07-09,Female,,1344433,Married,,,,,Malaysia,Solution Consultant,Tester,,Cyberjaya,,Zen Company Sdn Bhd,2018-12-09,2018-10-09,2020-07-09`], { type: "text/plain" });
        if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
            window.navigator.msSaveBlob(blob, "csv-template.csv");
        else {
            const a = window.document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.download = "template.csv";
            document.body.appendChild(a);
            a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
            document.body.removeChild(a);
        }
    }

    /**
     * Get dropped file details
     * Submit file to API
     * @param {UploadEvent} event
     * @memberof BulkImportComponent
     */
    public dropped(event: UploadEvent) {
        this.files = event.files;
        for (const droppedFile of event.files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    this.filename = file.name;
                    this.fileform.get('file').setValue(file);
                    this.onSubmit();
                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
    }

    /**
     * Get the uploaded file details
     * Set value to fileform (form data)
     * @param {*} event
     * @param {*} uploadedFileName
     * @memberof BulkImportComponent
     */
    openFile(event, uploadedFileName) {
        if (uploadedFileName) {
            this.showUploadButton = true;
        }
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.filename = file.name;
            this.fileform.get('file').setValue(file);
        }
    }

    /**
     * Upload file to API
     * @returns
     * @memberof BulkImportComponent
     */
    onSubmit() {
        this.formData.append('file', new Blob([(this.fileform.get('file').value)], { type: 'text/csv' }), this.fileName);
        const queryHeaders = new Headers();
        queryHeaders.append('Authorization', 'JWT ' + JSON.parse(this.local.get('access_token')));
        const options = new RequestOptions({ headers: queryHeaders });
        return new Promise((resolve) => {
            this.http.post('http://zencore.zen.com.my:3000/api/userimport/csv', this.formData, options)
                .pipe(map((response) => {
                    return response;
                })).subscribe(
                    (response) => {
                        resolve(response.json());
                        this.closeMenu.emit('true');
                        // this.dialogBulkImport.close();
                        // this.dialog.open(BulkImportSuccessComponent);
                    },
                    (err) => {
                        // if (err.status === 401) {
                        //     window.location.href = '/login';
                        // }
                    }
                )
        })
    }
}
