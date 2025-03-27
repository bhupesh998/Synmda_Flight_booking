
const moment = require('moment')
const fs = require('fs').promises

async function flightBook(req, res) {

    try {

        const flightsJSON = await readJSON('./database/flights.json')
        console.log("fligj", flightsJSON);
        
        const passengerJSON = await readJSON('./database/passenger.json')

        const { name, email, destination, travelDate } = req.body

        if (name && email && destination && travelDate) {

            let travelDateFormatted = moment(travelDate).format('YYYY-MM-DD')

            if (flightsJSON.length > 0) {

                let flightDetails = flightsJSON.filter((item) => item.flightDestination == destination.toUpperCase() && item.flightDate == travelDateFormatted)

                if (flightDetails && flightDetails.length > 0) {

                    let item = flightDetails[0]
                    console.log("flight Details=======>", item);
                    
                    let seatNum = getBookedSeatNumber(item)

                    if (!seatNum.status) {

                        item.seatMap.forEach(element => {

                            if (element.row == seatNum.row) {
                                element.bookedSeats.push(seatNum.seatNumber)
                            }
                        });

                        let passengerObj = {
                            "passengerId": new Date().valueOf(),
                            "passengerName": name,
                            "passengerEmail": email,
                            "startLocation": item.flightStartLocation,
                            "endLocation": item.flightDestination,
                            "bookedSeat": seatNum.seatNumber,
                            "travelDate": travelDateFormatted,
                            "travelByFlight": item.flightNumber,
                            "bookedOn": Date.now()
                        }


                        passengerJSON.push(passengerObj)

                        const index = flightsJSON.findIndex(flight => flight.flightNumber === item.flightNumber);
                        flightsJSON[index] = item

                        let flightSaveResult = await updateFile('./database/flights.json', flightsJSON)
                        console.log("file sabe Result=======>", flightSaveResult);
                        
                        if (flightSaveResult) {
                            let passengerSaveResult = await updateFile('./database/passenger.json', passengerJSON)
                            console.log("passenger save Result=======>", flightSaveResult);
                            if(passengerSaveResult){
                                res.status(200).json({ "status": true, "result": passengerObj })
                            }else{
                                res.status(400).json({ message: "Passenger Updation Failed" })
                            }

                        } else {
                            res.status(400).json({ message: "Flight Updation Failed" })
                        }
                    } else {
                        res.status(400).json({ message: "No Seats Available" })
                    }

                } else {
                    res.status(400).json({ message: "No Flights Available for Desitination or Travel Date" })
                }

            } else {
                res.status(400).json({ message: "No Flights Available" })
            }



        } else {
            res.status(417).json({ message: "Please Provide Valid Inputs" })
        }
    } catch (error) {
        console.log("error======>", error)
        res.status(500).json({ message: "Internal Server Error" })
    }




}

function getBookedSeatNumber(flightObj) {
    let seatMap = flightObj.seatMap;
    let noSeatsAvailable = true;
    let rowNum = 0;
    let seatNumber = '';

    for (let i = 0; i < seatMap.length; i++) {
        let totalSeats = seatMap[i].totalSeats;
        let bookedSeats = seatMap[i].bookedSeats;

        // Find the first unoccupied seat in this row
        for (let j = 0; j < totalSeats; j++) {
            let potentialSeat = seatMap[i].row + String.fromCharCode(65 + j); // A, B, C, D...

            if (!bookedSeats.includes(potentialSeat)) { // If seat is not booked
                seatNumber = potentialSeat;
                rowNum = seatMap[i].row;
                noSeatsAvailable = false;
                break;
            }
        }

        if (!noSeatsAvailable) break; // Stop searching if seat found
    }

    return {
        status: noSeatsAvailable, // If no seat is available, return true
        row: rowNum,
        seatNumber: seatNumber
    };
}


async function updateFile(filePath, Data) {

    try {
        await fs.writeFile(filePath, JSON.stringify(Data, null, 2));
        console.log("File updated successfully!");
        return true; // Return true on success
    } catch (error) {
        console.error("Error writing file:", error);
        return false; // Return false on failure
    }

}

async function readJSON(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

module.exports.flightBook = flightBook
module.exports.readJSON = readJSON
module.exports.updateFile = updateFile