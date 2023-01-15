const axios = require('axios');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { BookingRespository } = require('../repository/index');
const { ServiceError } = require('../utils/error');

class BookingService {
    constructor(){
        this.bookingRespository = new BookingRespository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError(
                    'Something went wrong in the booking service',
                    'Insufficient seats in the flight'
                )
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data,totalCost}; 
            const booking = await this.bookingRespository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL,{ totalSeats: flightData.totalSeats - booking.noOfSeats });
             const finalBookings = await this.bookingRespository.update(booking.id,{ status: "BOOKED" });
            return finalBookings;

        } catch (error) {
            if(error.name === 'ValidationError' || error.name === 'RepositoryError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;