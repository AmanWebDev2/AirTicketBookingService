const { StatusCodes } = require('http-status-codes');

const { BookingService } = require('../services/index');

const bookingService = new BookingService();

class BookingController {

    async create(req,res){
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                success: true,
                data: response,
                message: 'successfully booked a flight',
                err: {}
            })
        } catch (error) {
            return res.status(error.statusCode).json({
                success: false,
                data: {},
                message: error.message,
                err: error.explanation
            })
        }
    };
}

module.exports = BookingController;