import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Saloon } from 'src/schemas/saloon.schema';
import { User, UserDocument, UserType } from 'src/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { AddSaloonEmployeeDto, CreateSaloonDto, PaginationDto } from './dto/create-saloon.dto';
import { CreateBookSaloonDto } from './dto/book-saloon.dto';
import { Booking } from 'src/schemas/booking.schema';

@Injectable()
export class SaloonService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Saloon.name) private saloonModel: Model<Saloon>,
        @InjectModel(Booking.name) private bookingModel: Model<Booking>
    ) { }

    //create a saloon

    async createSaloon(createSaloonDto: CreateSaloonDto) {
        try {
            const { name, city, place, latitude, longitude, email, password } = createSaloonDto;

            // Check if the owner exists
            const ownerExists = await this.userModel.findOne({ email })
            if (ownerExists) throw new BadRequestException('Owner with this email already exists');
            // Create the owner
            const newOwner: any = await this.userModel.create({
                name,
                email,
                password,
                userType: UserType.ADMIN
            });

            // Create the saloon
            const newSaloon = await this.saloonModel.create({
                name,
                city,
                place,
                latitude,
                longitude,
                owner: newOwner._id, // Assign the newly created owner's ID
                isActive: true
            });
            newOwner.saloonId = newSaloon._id; // Assign the saloon ID to the owner
            await newOwner.save(); // Save the updated owner

            return {
                message: 'Saloon created successfully',
                data: newSaloon
            }

        } catch (error) {
            throw new Error(error);
        }
    }

    //get all saloons
    async getAllSaloons(paginationDto: PaginationDto) {
        try {
            const { page = 1, limit = 100, isActive, search } = paginationDto;
            const skip = (page - 1) * limit;
            const filter = {};
            if (search) {
                filter['name'] = { $regex: search, $options: 'i' }; // Case-insensitive search
                filter['city'] = { $regex: search, $options: 'i' }; // Case-insensitive search
                filter['place'] = { $regex: search, $options: 'i' }; // Case-insensitive search
            }
            if (isActive !== undefined) {
                filter['isActive'] = isActive; // Filter by isActive status
            }


            const saloons = await this.saloonModel.find(filter).populate('owner', 'name email')
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                message: 'Saloons fetched successfully',
                data: saloons
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async addSaloonEmployee(userId: string, addSaloonEmployeeDto: AddSaloonEmployeeDto) {
        try {
            const user: any = await this.userModel.findById(userId);
            if (!user) throw new BadRequestException('User not found');
            if (!user.isActive) throw new BadRequestException('User is not active');
            // Create the new employee
            const newEmployee = await this.userModel.create({
                ...addSaloonEmployeeDto,
                userType: UserType.EMPLOYEE,
                saloonId: new Types.ObjectId(user.saloonId), // Assign the saloon ID from the user
                isActive: true

            });

            return {
                message: 'Employee added successfully',
                data: newEmployee
            };
        } catch (error) {
            throw new Error(error);

        }
    }

    async getAllEmployees(userId: string, paginationDto: PaginationDto) {
        try {
            const { page = 1, limit = 100 } = paginationDto;
            const user: any = await this.userModel.findById(userId);
            if (!user) throw new BadRequestException('User not found');
            if (!user.isActive) throw new BadRequestException('User is not active');
            const filter: any = {};
            filter['saloonId'] = user.saloonId;
            if (!user.saloonId) {
                filter['saloonId'] = paginationDto.saloonId;
            }
            if (paginationDto.isActive !== undefined) {
                filter['isActive'] = paginationDto.isActive; // Filter by isActive status
            }

            const skip = (page - 1) * limit;
            const employees = await this.userModel.find(filter)
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                message: 'Employees fetched successfully',
                data: employees
            }

        } catch (error) {
            throw new Error(error);

        }
    }

    async bookSaloon(userId: string, createBookSaloonDto: CreateBookSaloonDto) {
        try {
            const user: any = await this.userModel.findById(userId);
            if (!user) throw new BadRequestException('User not found');
            if (!user.isActive) throw new BadRequestException('User is not active');
            if (createBookSaloonDto.saloonId) createBookSaloonDto.saloonId = new Types.ObjectId(createBookSaloonDto.saloonId);
            if (createBookSaloonDto.employeeId) createBookSaloonDto.employeeId = new Types.ObjectId(createBookSaloonDto.employeeId);

            const newBooking = await this.bookingModel.create({
                ...createBookSaloonDto,
                userId: user._id
            });

            return {
                message: 'Saloon booked successfully',
                data: newBooking
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    async getMyBookings(userId: string, paginationDto: PaginationDto) {
        try {
            const { page = 1, limit = 100 } = paginationDto;
            const user: any = await this.userModel.findById(userId);
            if (!user) throw new BadRequestException('User not found');
            if (!user.isActive) throw new BadRequestException('User is not active');

            const skip = (page - 1) * limit;
            const bookings = await this.bookingModel.find({ userId: user._id })
                .populate('saloonId', 'name city place')
                .populate('employeeId', 'name')
                .skip(skip)
                .limit(limit)
                .lean();

            return {
                message: 'Booked saloons fetched successfully',
                data: bookings
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    async getMyBookingsByEmployee(userId: string, paginationDto: PaginationDto) {
        const user: any = await this.userModel.findById(userId);
        if (!user) throw new BadRequestException('User not found');
        if (!user.isActive) throw new BadRequestException('User is not active');

        const { page = 1, limit = 100 } = paginationDto;
        const skip = (page - 1) * limit;
        const bookings = await this.bookingModel.find({ employeeId: user._id })
            .populate('saloonId', 'name city place')
            .populate('userId', 'name email')
            .skip(skip)
            .limit(limit)
            .lean();

        return {
            message: 'Booked saloons fetched successfully',
            data: bookings
        };
    }

    async updateBookingStatus(userId: string, bookingId: string, status: string) {
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking) throw new BadRequestException('Booking not found');
        booking.bookingStatus = status;
        booking.updatedBy = new Types.ObjectId(userId);

        await booking.save();
        return {
            message: 'Booking status updated successfully',
            data: booking
        };
    }




}
