import { Schema, model, Model, Document } from 'mongoose'

interface IOffer {
    offerId: string
    hotelId: string
    checkInDate: Date
    checkOutDate: Date
    description: string
    adults: number
    currency: string
    totalPrice: number
}

const OfferSchema = new Schema({
    offerId: {
        type: String,
        required: true,
    },
    hotelId: {
        type: String,
        required: true,
    },
    checkInDate: {
        type: Date,
        required: false
    },
    checkOutDate: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: true,
    },
    adults: {
        type: Number,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    totalPrice: {
        type: Number,
        required: false,
    },
})

OfferSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id

    return object
})

interface OfferDoc extends Document {
    offerId: string
    hotelId: string
    checkInDate: Date
    checkOutDate: Date
    description: string
    adults: number
    currency: string
    totalPrice: number
}

OfferSchema.statics.build = (attr: IOffer): OfferDoc => {
    return new Offer(attr)
}

interface OfferModelInterface extends Model<OfferDoc> {
    build(attr: IOffer): OfferDoc
}

const Offer = model<OfferDoc, OfferModelInterface>('Offer', OfferSchema)

export { IOffer, Offer, OfferDoc }
