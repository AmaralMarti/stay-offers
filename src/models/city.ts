import { Schema, model, Model, Document } from 'mongoose'
import { IHotel } from './hotel'

interface ICity {
    id: string
    code: string
    name: string
    countryName:string
    countryCode: string
    latitude: number
    longitude: number
}

const CitySchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    countryName: {
        type: String,
        required: false,        
    },
    countryCode: {
        type: String,
        required: false,
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

interface CityDoc extends Document {
    id: string
    code: string
    name: string
    countryName:string
    countryCode: string
    latitude: number
    longitude: number
}

CitySchema.statics.build = (attr: ICity): CityDoc => {
    return new City(attr)
}

interface CityModelInterface extends Model<CityDoc> {
    build(attr: ICity): CityDoc
}

const City = model<CityDoc, CityModelInterface>('City', CitySchema)

export { ICity, City }
