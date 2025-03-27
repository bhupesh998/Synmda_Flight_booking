
const express = require('express')
const router = express.Router()

const flightBookingController = require('../controller/flightBook')
const { getJourneyDetails } = require('../controller/getJourneyDetails')
const { getSeatsBooked } = require('../controller/getSeatsBooked')
const { cancelFlight } = require('../controller/cancelFlight')
const { updateSeat } = require('../controller/updateSeat')

router.get("/ping", (req,res)=>{
    res.json("pong")
})

router.post("/bookFlight", (req,res)=>{
    flightBookingController.flightBook(req,res)
})

router.get("/getJoureyDetails", (req,res)=>{
    getJourneyDetails(req,res)
})

router.get("/getSeatsBooked", (req,res)=>{
    getSeatsBooked(req,res)
})

router.post('/cancelFlight', (req,res)=>{
    cancelFlight(req,res)
})

router.post('/updateSeat', (req,res)=>{
    updateSeat(req,res)
})

module.exports = router