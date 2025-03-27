const { readJSON, updateFile } = require("./flightBook");

async function updateSeat(req, res) {
    try {
        const flightsJSON = await readJSON('./database/flights.json');
        const passengerJSON = await readJSON('./database/passenger.json');

        const { email, flightNumber, newSeatNumber, passengerId } = req.body;

        if (email && flightNumber && newSeatNumber && passengerId) {
            let passengerJourneys = passengerJSON.filter(
                (item) => item.travelByFlight === flightNumber && item.passengerId == passengerId
            );

            if (passengerJourneys.length === 0) {
                return res.status(400).json({ message: "Journey Data Not Found" });
            }

            let oldSeatNumber = passengerJourneys[0].bookedSeat;
            let flightToChange = flightsJSON.find((item) => item.flightNumber == flightNumber);

            if (!flightToChange) {
                return res.status(400).json({ message: "Flight Not Found With Given Details" });
            }

            if (oldSeatNumber === newSeatNumber) {
                return res.status(400).json({ message: "Seat Already Assigned" });
            }

            let seatMap = flightToChange.seatMap;

            // Check if newSeatNumber is already occupied
            let seatOccupied = seatMap.some((row) => row.bookedSeats.includes(newSeatNumber));
            if (seatOccupied) {
                return res.status(400).json({ message: `Seat ${newSeatNumber} is already occupied!` });
            }

            // Remove old seat & assign new seat
            seatMap.forEach((row) => {
                row.bookedSeats = row.bookedSeats.filter((seat) => seat !== oldSeatNumber);
                if (newSeatNumber.includes(row.row)) {
                    row.bookedSeats.push(newSeatNumber);
                }
            });

            console.log("Updated seatMap for flight:", flightNumber, JSON.stringify(seatMap));

            flightToChange.seatMap = seatMap;
            let flightSaveResult = await updateFile('./database/flights.json', flightsJSON);

            if (!flightSaveResult) {
                return res.status(400).json({ message: "Flight Updation Failed" });
            }

            passengerJSON.forEach((item) => {
                if (item.passengerId == passengerId) {
                    item.bookedSeat = newSeatNumber;
                    item.bookedOn = Date.now();
                }
            });

            let passengerSaveResult = await updateFile('./database/passenger.json', passengerJSON);

            if (!passengerSaveResult) {
                return res.status(400).json({ message: "Passenger Updation Failed" });
            }

            return res.status(200).json({
                status: true,
                result: `Seat Updated For PassengerId ${passengerId} to New Seat ${newSeatNumber}`
            });

        } else {
            return res.status(417).json({ message: "Please Provide Valid Inputs" });
        }
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.updateSeat = updateSeat;
