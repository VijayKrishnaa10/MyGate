import { LightningElement, wire , api} from 'lwc';
import getRelatedImageFiles from '@salesforce/apex/fileimagePreview.getRelatedFilesByRecordId';
import getImageFiles from '@salesforce/apex/fileimagePreview.getImageFilesByRecordId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class FlatImageDisplay extends LightningElement {
    @api recordId;
    filesList = [];
    filesListObj;
    picture1;
    picture2;
    picture3;
    imageDisplay = true;
    wiredAccountsResult;

    // connectedCallback() {}
    // @wire(getRelatedImageFiles, { recordId: '$recordId' })
    // wiredResult({ error, data }) {
    //     if (data) {
    //         console.log('data',data);
    //         this.filesList = Object.keys(data).map(item =>({
    //             "label": data[item],
    //             "value":item,
    //             "url":`/sfc/servlet.shepherd/document/download/${item}`
    //         }))
    //         console.log('filesList', this.filesList);
    //     } else if (error) {
    //         console.log('error');
    //     }
    // }
    @wire(getImageFiles, { recordId: '$recordId' })
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            if (result.data.length != 0) {
                console.log('data', result.data);
                var base_url = window.location.origin;
                console.log('baseUrl', base_url);
                for (let i = 0; i < result.data.length; i++) {
                    this.filesListObj = {
                        "label": result.data[i].Id,
                        "url": `/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${result.data[i].Id}`
                    }
                    this.filesList.push(this.filesListObj);
                    // this.filesList = data.map(item =>({
                    //     "label": data[item].Id,
                    //     "url":`/sfc/servlet.shepherd/document/download/${data[item].Id}`
                    // }))
                }
                if(result.data.length >= 3){
                    this.picture1 = base_url + this.filesList[0].url;
                    this.picture2 = base_url + this.filesList[1].url;
                    this.picture3 = base_url + this.filesList[2].url;
                }else if(result.data.length == 2){
                    this.picture1 = base_url + this.filesList[0].url;
                    this.picture2 = base_url + this.filesList[1].url;
                    this.picture3 = base_url + this.filesList[0].url;
                }else if(result.data.length == 0){
                    this.picture1 = base_url + this.filesList[0].url;
                    this.picture2 = base_url + this.filesList[0].url;
                    this.picture3 = base_url + this.filesList[0].url;
                }
                console.log('filesListObj', this.filesListObj);
                console.log('filesList', this.filesList);
            }else if(result.data.length === 0){
                this.imageDisplay = false;
            }
        } else if (result.error) {
            console.log('error', this.recordId);
            this.imageDisplay = false;
        }
    }

    // @wire(getImageFiles, { recordId: '$recordId' })
    // wiredResult({ error, data }) {
    //     if (data) {
    //         this.wiredAccountsResult = data;
    //         if (data.length != 0) {
    //             console.log('data', data);
    //             var base_url = window.location.origin;
    //             console.log('baseUrl', base_url);
    //             for (let i = 0; i <= 2; i++) {
    //                 this.filesListObj = {
    //                     "label": data[i].Id,
    //                     "url": `/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${data[i].Id}`
    //                 }
    //                 this.filesList.push(this.filesListObj);
    //             }
    //             this.picture1 = base_url + this.filesList[0].url;
    //             this.picture2 = base_url + this.filesList[1].url;
    //             this.picture3 = base_url + this.filesList[2].url;
    //             console.log('filesListObj', this.filesListObj);
    //             console.log('filesList', this.filesList);
    //         }else if(data.length === 0){
    //             this.imageDisplay = false;
    //         }
    //     } else if (error) {
    //         console.log('error', this.recordId);

    //         this.imageDisplay = false;
    //     }
    // }

    get acceptedFormats() {
        return ['.pdf', '.png','.jpg','.jpeg'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        this.imageDisplay = true;
        const evt = new ShowToastEvent({
            title: "Images Added",
            message: "No. of files uploaded : " + uploadedFiles.length,
            variant: "success"
        });
        this.dispatchEvent(evt);
        return refreshApex(this.wiredAccountsResult);
    }

}