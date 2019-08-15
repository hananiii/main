import { Component, OnInit } from "@angular/core";
import { APIService } from "src/services/shared-service/api.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PersonalDetailsService } from "../personal-details/personal-details.service";

@Component({
    selector: 'app-award-certification',
    templateUrl: './award-certification.page.html',
    styleUrls: ['./award-certification.page.scss'],
})
export class AwardCertificationPage implements OnInit {

    public progressPercentage: number;
    public showHeader: boolean = true;
    public showContent: boolean = false;
    public items: any;
    public awards: any = [];
    public displayEditAward: boolean = false;
    public fileform: FormGroup;
    public imagePath;
    public imgURL: any;
    public filename: string;
    public showImg: boolean = false;
    public showPdf: boolean = false;
    public showAttach: boolean = true;
    public employ: any;

    get personalList() {
        return this.items;
    }

    constructor(private apiService: APIService, private fb: FormBuilder, private xservice: PersonalDetailsService) {
        xservice.percentChanged.subscribe(value => {
            this.progressPercentage = value;
        })
    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.items = data;
                console.log(this.items);
                this.apiService.get_employment_details(this.items.id).subscribe(
                    data => {
                        this.employ = data;
                    })
                this.showContent = true;
                const award = this.items.personalDetail.certification;
                if (award != undefined) {
                    if (typeof (award.certificationDetail) == 'object') {
                        this.awards.push(award.certificationDetail);
                        console.log(this.awards);
                    } else {
                        this.awards = award.certificationDetail;
                    }
                } else {
                    this.awards = [];
                }

                // "certification": {
                //     "certificationDetail": {
                //       "certificationName": "Bachelor Degree In Computer Science",
                //       "certificationEnrollYear": 2011,
                //       "certificationGraduateYear": 2015,
                //       "certificationAttachment": "attachment1.png"
                //     }
                //   }
            });

        this.fileform = this.fb.group({
            file: ''
        });
    }

    openFile(event, fileName) {
        console.log(event, fileName);
        if (fileName) {
            // this.showUploadButton = true;
            console.log(fileName);
        }
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const a = file.name;
            this.fileform.get('file').setValue(file);
            console.log(a, this.fileform);
            var reader = new FileReader();
            this.imagePath = file.name;
            reader.readAsDataURL(file.name[0]);
            reader.onload = (_event) => {
                this.imgURL = reader.result;
            }
        }
    }

    preview(files) {
        if (files.length === 0)
            return;

        var mimeType = files[0].type;
        this.filename = files[0].name;
        console.log(this.filename);
        if (mimeType.match(/image\/*/) == null) {
            this.showPdf = true;
            this.showAttach = false;
            var reader = new FileReader();
            this.imagePath = files;
            reader.readAsDataURL(files[0]);
            reader.onload = (_event) => {
                this.imgURL = reader.result;
            }
            return;
        }
        this.showImg = true;
        this.showAttach = false;
        var reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
            this.imgURL = reader.result;
        }
    }

    clickToHideAttachment() {
        this.imgURL = null;
        this.showPdf = false;
        this.showImg = false;
    }

    updateCertificate() {
        const body = this.items.personalDetail;
        body['certification'] = {};
        body['certification']['certificationDetail'] = this.awards;
        body['certification']['certificationDetail']['certificationName'] = this.filename;
        console.log(body);
        this.apiService.patch_personal_details(body).subscribe(response => {
            console.log(response);
            this.apiService.get_personal_details().subscribe(
                (data: any[]) => {
                    this.items = data;
                })
        })
    }


}