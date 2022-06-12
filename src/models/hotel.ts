import { Schema, model, Model, Document } from 'mongoose'

interface IHotel {
    hotelId: string
    name: string
    cityCode: string
    latitude: number
    longitude: number
}

const HotelSchema = new Schema({
    hotelId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    cityCode: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: false,
    },
    longitude: {
        type: Number,
        required: false,
    },
})

interface HotelDoc extends Document {
    hotelId: string
    name: string
    cityCode: string
    latitude: number
    longitude: number
}

HotelSchema.statics.build = (attr: IHotel): HotelDoc => {
    return new Hotel(attr)
}

interface HotelModelInterface extends Model<HotelDoc> {
    build(attr: IHotel): HotelDoc
}

const Hotel = model<HotelDoc, HotelModelInterface>('Hotel', HotelSchema)

export { IHotel, Hotel, HotelDoc }
