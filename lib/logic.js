/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {ehr.SampleTransaction} sampleTransaction
 * @transaction
 */
async function sampleTransaction(tx) {
    // Save the old value of the asset.
    const oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('ehr.SampleAsset');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('ehr', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
}
/**
     * Place an order for a vehicle
     * @param {ehr.appointments.addAppointment} addAppointment - the addAppointment transaction
     * @transaction
     */


    function addAppointment(addAppointment){
        console.log('addAppointment');
    
        var NS_D = 'id.appointment'
    
        var assetRegistry;
        var id = addAppointment.appointment.appointmentID;
        return getAssetRegistry(NS_D + '.Appointment')
            .then(function(ar){
                assetRegistry = ar;
                return assetRegistry.get(id);
            })
            .then(function(asset){
                asset.time = addAppointment.time;
                asset.realTime = addAppointment.realTime;
                return assetRegistry.update(asset);
            })
    }
    
    /**
         * Place an order for a vehicle
         * @param {ehr.updateMedication} tx   - the updateMedication transaction
         * @transaction
         */
        function updateMedication(tx){
            console.log('update past medication');
            var store=[];
            let asset = tx.asset;
            asset.pastMedicationArray = store;
            return getAssetRegistry('ehr.PatientInfo');
              store.push(tx.newmedication);
          return assetRegistry.update(store);
          }
         /**
         * Place an order for a vehicle
         * @param {ehr.updatePastVisits} tx- the updateMedication transaction
         * @transaction
         */
        function updatePastVisits(tx){
            console.log('update past visits');
            var store=[];
            let asset = tx.asset;
            asset.pastVisitsArray = store;
            return getAssetRegistry('ehr.PatientInfo');
              store.push(tx.newvisit);
          return assetRegistry.update(store);
             
          }
             /**
               * Place an order for a vehicle
               * @param {ehr.updateContact} tx- the updateContac transaction
               * @transaction
               */
          async function updateContact(tx){
            let asset = tx.asset;
        asset.phonenumber = tx.newphonenumber;
        // Get the asset registry that stores the assets. Note that
        // getAssetRegistry() returns a promise, so we have to await for it.
        let assetRegistry = await getAssetRegistry('ehr.PatientInfo');
    
        // Update the asset in the asset registry. Again, note
        // that update() returns a promise, so so we have to return
        // the promise so that Composer waits for it to be resolved.
        await assetRegistry.update(asset);
          }
           /**
         * Place an order for a vehicle
         * @param {ehr.economics.SendBill} newBill - the SendBill transaction
         * @transaction
         */
        function SendBill(newBill) {
            var balanceDue = newBill.bill.amount;
          
              var ID = newBill.bill.id;
              console.log("Bill has been sent");
            return getParticipantRegistry('ehr.Patient')
                .then(function(patientRegistry) {
                      console.log("OK");
                      return patientRegistry.get(ID).then(function(patient){
                        console.log("BBB");
                          patient.balanceDue += newBill.bill.amount;
                         newBill.bill.paid = false;
                         return patientRegistry.update(patient);
                    })
                })
        }
         /**
             * Place an order for a vehicle
             * @param {ehr.economics.PayBill} oldBill - the PayBill transaction
             * @transaction
             */
        function PayBill(oldBill) {
            //var balancePaid = oldBill.bill.amount;
          
              var ID = oldBill.bill.id;
              var moneyID = oldBill.bill.moneyID;
              var amt = oldBill.bill.amount;
              console.log("paid");
            return getAssetRegistry('ehr.economics.HospitalMoneyPool')
                .then(function(assetRegistry) {
                      console.log("OK");
                      return assetRegistry.get(moneyID).then(function(_moneypool){
                        console.log("BBB");
                          _moneypool.moneypool += amt;
                         oldBill.bill.paid = true;
                         return assetRegistry.update(_moneypool);
                      
                    })
                })
                .then(function(){getParticipantRegistry('ehr.Patient')
                    .then(function(patientRegistry) {
                        console.log("OK");
                        return patientRegistry.get(ID).then(function(patient){
                            console.log("BBB");
                            patient.balanceDue -= amt;
                            oldBill.bill.paid = true;
                            return patientRegistry.update(patient);
                        })
                    })
                 })
                 
    }
