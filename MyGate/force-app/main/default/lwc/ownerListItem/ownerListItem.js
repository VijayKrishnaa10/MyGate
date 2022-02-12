import { LightningElement , api} from 'lwc';

export default class OwnerListItem extends LightningElement {
    @api owner;
    handleClick(event) {
        // 1. Prevent default behavior of anchor tag click which is to navigate to the href url
        event.preventDefault();
        // 2. Create a custom event that bubbles. Read about event best practices at http://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.events_best_practices
        const selectEvent = new CustomEvent('ownerselect', {
            bubbles: true
        });
        // 3. Fire the custom event
        this.dispatchEvent(selectEvent);
    }

    handleNext(){
        console.log(this.owner);
        console.log(owner);
    }
}