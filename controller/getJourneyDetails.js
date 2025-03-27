const { readJSON } = require('./flightBook')
const fs = require('fs').promises

async function getJourneyDetails(req,res){
 try {

    const passengerJSON = await readJSON('./database/passenger.json')

    if(req.body.email){

       let passengerJourneys =  passengerJSON.filter((item)=>item.passengerEmail.toLowerCase() == req.body.email.toLowerCase() )

       if(passengerJourneys && passengerJourneys.length > 0){
        res.status(200).json({ status: true , result: passengerJourneys })
       }else{
        res.status(200).json({ status: true , result: [] })
       }

    }else{
        res.status(417).json({ message: "Please Provide Valid Inputs" })
    }
    


 } catch (error) {
        console.log("error======>", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports.getJourneyDetails = getJourneyDetails