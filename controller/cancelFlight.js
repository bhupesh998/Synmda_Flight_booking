
const { readJSON, updateFile } = require('./flightBook');


async function cancelFlight(req, res) {

    try {

        const flightsJSON = await readJSON('./database/flights.json')

        const passengerJSON = await readJSON('./database/passenger.json')

        const { passengerId } = req.body

        if (passengerId) {
            console.log(passengerId)
            let passengerDetails = passengerJSON.filter((item) => item.passengerId == passengerId)
            let updatedPassengerJSON = passengerJSON.filter((item) => item.passengerId != passengerId)

            let passengerJSONUpdated = await updateFile('./database/passenger.json', updatedPassengerJSON)

            if (passengerJSONUpdated) {

                if (passengerDetails && passengerDetails.length > 0) {

                    let bookSeatNumber = passengerDetails[0].bookedSeat
                    let flightNumber = passengerDetails[0].travelByFlight

                    let updatedFlightsJson = removeBookedSeat(flightsJSON, flightNumber, bookSeatNumber)

                    let flightSaveResult = await updateFile('./database/flights.json', updatedFlightsJson)
                    console.log("file sabe Result=======>", flightSaveResult);

                    if (flightSaveResult) {


                        res.status(200).json({ "status": true, "result": passengerDetails })
                    } else {
                        res.status(400).json({ message: "Flight Updation Failed" })
                    }
                }

            } else {
                res.status(400).json({ message: "Data Updation Failed" })
            }


        } else {
            res.status(417).json({ message: "Please Provide Valid Inputs" })
        }
    } catch (error) {
        console.log("error======>", error)
        res.status(500).json({ message: "Internal Server Error" })
    }




}


function removeBookedSeat(flightsArray, flightNumber, seatNumber) {
    return flightsArray.map(flight => {
        // Modify only the flight that matches the given flightNumber
        if (flight.flightNumber === flightNumber) {
            return {
                ...flight,
                seatMap: flight.seatMap.map(row => ({
                    ...row,
                    bookedSeats: row.bookedSeats.filter(seat => seat !== seatNumber) // Remove the seat
                }))
            };
        }
        return flight; // Keep other flights unchanged
    });
}



module.exports.cancelFlight = cancelFlight
