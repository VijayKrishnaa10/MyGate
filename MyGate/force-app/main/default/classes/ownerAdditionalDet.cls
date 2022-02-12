public with sharing class ownerAdditionalDet {
    @AuraEnabled
    public static List<Flat_Owner__c> ownerAdditionalDetails(String recordId) {
        return [
            SELECT Id, Name,Image__c,Flat_Number__c,Phone_Number__c,Email__c,(select id, vehicle_number__c,name,color__c from Vehicles__r), 
            (select id, Name, total_members_in_home__c from families__r),(select id,name, Intercom_Number__c, alternate_phone__c from intercoms__r),
            (select Entry_time__c, name from household_staffs__r) from Flat_Owner__c where Id = : recordId
        ];
    }

    @AuraEnabled
    public static void ownerRentalDetails(String recordId, Boolean rental){
        flat_owner__c owner = new flat_owner__c();
        owner.Id = recordId;
        owner.For_Rent__c = rental;
        try{
           update owner;
        }catch(Exception e){
            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
         }
        // update owner;
    }
}