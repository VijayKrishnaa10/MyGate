public with sharing class addAdditionalDetails {
    @AuraEnabled
    public static Vehicle__c addVehicleDetails(Vehicle__c vehicle) {
        Vehicle__c vehi = new Vehicle__c();
        vehi.id = vehicle.id;
        vehi.name = vehicle.name;
        vehi.vehicle_number__c = vehicle.vehicle_number__c;
        vehi.color__c = vehicle.color__c;
        insert vehi;
        return vehi;
    }

    @AuraEnabled
    public static Vehicle__c createVehicleDetails(string id, string name, string color, integer vehicleNumber) {
        Vehicle__c vehi = new Vehicle__c();
        vehi.Flat_Owner__c = id;
        vehi.name = name;
        vehi.color__c = color;
        vehi.vehicle_number__c = vehicleNumber;        
        insert vehi;
        return vehi;
    }

    @AuraEnabled
    public static family__c createFamilyDetails(string id, string name, integer totalMembers) {
        family__c family = new family__c();
        family.Flat_Owner__c = id;
        family.name = name;
        family.total_members_in_home__c = totalMembers;    
        insert family;
        return family;
    }

    @AuraEnabled
    public static household_staff__c createStaffDetails(string id, string name, Datetime entryTime) {
        household_staff__c staff = new household_staff__c();
        staff.Flat_Owner__c = id;
        staff.name = name;
        staff.Entry_time__c = entryTime;      
        insert staff;
        return staff;
    }

    @AuraEnabled
    public static intercom__c createIntercomDetails(string id, string name, String intercomNumber, String alternateNumber) {
        intercom__c intercom = new intercom__c();
        intercom.Flat_Owner__c = id;
        intercom.name = name;
        intercom.Intercom_Number__c = intercomNumber;
        intercom.Alternate_Phone__c = alternateNumber;        
        insert intercom;
        return intercom;
    }
}