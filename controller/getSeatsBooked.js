const { readJSON } = require('./flightBook')
const fs = require('fs').promises

async function getSeatsBooked(req,res){
 try {

    const passengerJSON = await readJSON('./database/passenger.json')

    if(req.body.flightNumber){

        let passengerJourneys = passengerJSON
        .filter((item) => item.travelByFlight === req.body.flightNumber) // Filter based on flightNumber
        .map((item) => ({  // Map to extract only required fields
            passengerName: item.passengerName,
            passengerEmail: item.passengerEmail,
            bookedSeat: item.bookedSeat
        }));

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

module.exports.getSeatsBooked = getSeatsBooked