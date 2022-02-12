import { LightningElement, wire , track} from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import RECORD_RENTAL_CHANNEL from '@salesforce/messageChannel/Record_Rental__c';
import getImageFiles from '@salesforce/apex/fileimagePreview.getImageFilesByRecordId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import Id from '@salesforce/schema/Account.Id';

export default class RentalImagePreview extends LightningElement {
    recordId;
    imageDisplay;
    filesList = [];
    filesListObj;
    @track previewImage;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            RECORD_RENTAL_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    handleMessage(message) {
        this.recordId = message.recordId;
        console.log('recordId', this.recordId);
    }

    @wire(getImageFiles, { recordId: '$recordId' })
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            this.filesList = [];
            this.imageDisplay = true;
            if (result.data.length != 0) {
                console.log('data', result.data);
                var base_url = window.location.origin;
                console.log('baseUrl', base_url);
                for (let i = 0; i < result.data.length; i++) {
                    this.filesListObj = {
                        "Id": i,
                        "label": result.data[i].Id,
                        "url": `/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${result.data[i].Id}`
                    }
                    this.filesList.push(this.filesListObj);
                }
                this.previewImage =  this.filesList[0].url;
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

    imageClick(event){
        console.log('Image Clicked')
        console.log('Id',event.target.dataset.factor);
        let i = event.target.dataset.factor;
        this.previewImage = this.filesList[i].url
    }

}