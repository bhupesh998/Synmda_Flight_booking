# Flight Booking System

## Overview
The Flight Booking System allows users to book, view, modify, and cancel flight tickets using a REST API. This document provides instructions on setting up and running the project, along with API details and example requests.

## Prerequisites
- Node.js (v14 or later)
- npm (Node Package Manager)

## Installation and Setup
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd flight-booking-system
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```
   The server will start at `http://localhost:3000`.
4. Run tests:
   ```sh
   npm test
   ```

## API Endpoints

| Endpoint                  | Method | Request Body | Response |
|---------------------------|--------|--------------|----------|
| `/bookFlight`            | POST   | `{ "name": "string", "email": "string", "destination": "string", "travelDate": "YYYY-MM-DD" }` | Returns booking confirmation with flight details and seat number. |
| `/updateSeat`            | POST   | `{ "email": "string", "flightNumber": "string", "newSeatNumber": "string", "passengerId": number }` | Confirms seat update for the passenger. |
| `/cancelFlight`          | POST   | `{ "passengerId": number }` | Returns cancellation confirmation with passenger details. |
| `/getSeatsBooked`        | GET    | `{ "flightNumber": "string" }` | Returns a list of passengers and their seat numbers. |
| `/getJourneyDetails`     | GET    | `{ "email": "string" }` | Returns all booked flights for a passenger. |

## Example Requests

### 1. Book Flight Ticket
```sh
curl --location 'http://localhost:3000/bookFlight' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "bhupesh",
    "email": "abc.xyz@email.com",
    "destination": "mumbai",
    "travelDate": "2025-03-25"
}'
```
**Response:**
```json
{
    "status": true,
    "result": {
        "passengerId": 1743088229763,
        "passengerName": "bhupesh",
        "passengerEmail": "abc.xyz@email.com",
        "startLocation": "INDORE",
        "endLocation": "MUMBAI",
        "bookedSeat": "2C",
        "travelDate": "2025-03-25",
        "travelByFlight": "1234567",
        "bookedOn": 1743088229763
    }
}
```

### 2. Modify Seat Assignment
```sh
curl --location 'http://localhost:3000/updateSeat' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "abc.xyz@email.com",
    "flightNumber": "1234567",
    "newSeatNumber": "3D",
    "passengerId": 1743008581610
}'
```
**Response:**
```json
{
    "status": true,
    "result": "Seat Updated For PassengerId 1743008581610 to New Seat 3D"
}
```

### 3. Cancel Flight Ticket
```sh
curl --location 'http://localhost:3000/cancelFlight' \
--header 'Content-Type: application/json' \
--data-raw '{
    "passengerId": 1743008581610
}'
```
**Response:**
```json
{
    "status": true,
    "result": [
        {
            "passengerId": 1743008581610,
            "passengerName": "bhupesh",
            "passengerEmail": "abc.xyz@email.com",
            "startLocation": "INDORE",
            "endLocation": "MUMBAI",
            "bookedSeat": "3D",
            "travelDate": "2025-03-25",
            "travelByFlight": "1234567",
            "bookedOn": 1743088793167
        }
    ]
}
```

### 4. View All Passengers on a Flight
```sh
curl --location --request GET 'http://localhost:3000/getSeatsBooked' \
--header 'Content-Type: application/json' \
--data-raw '{
    "flightNumber": "1234567"
}'
```
**Response:**
```json
{
    "status": true,
    "result": [
        { "passengerName": "pamesh", "passengerEmail": "abc.xyz@email.com", "bookedSeat": "2D" },
        { "passengerName": "bhupesh", "passengerEmail": "abc.xyz@email.com", "bookedSeat": "1A" }
    ]
}
```

### 5. View Journey Details
```sh
curl --location --request GET 'http://localhost:3000/getJourneyDetails' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "abc.xyz@email.com"
}'
```
**Response:**
```json
{
    "status": true,
    "result": [
        {
            "passengerId": 1742925341072,
            "passengerName": "pamesh",
            "passengerEmail": "abc.xyz@email.com",
            "startLocation": "INDORE",
            "endLocation": "MUMBAI",
            "bookedSeat": "2D",
            "travelDate": "2025-03-25",
            "travelByFlight": "1234567",
            "bookedOn": 1743008112951
        }
    ]
}
```

## Conclusion
This Flight Booking System provides an easy-to-use API for booking, managing, and viewing flight tickets. Use the provided API endpoints and example requests to interact with the system efficiently. Happy booking!

