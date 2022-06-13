import { Schema, model, Model, Document } from 'mongoose'

interface ICity {
    cityCode: string
    name: string
    countryName:string
    countryCode: string
    latitude: number
    longitude: number
}

const CitySchema = new Schema({
    cityCode: {
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

CitySchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id

    return object
})

interface CityDoc extends Document {
    cityCode: string
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

export { ICity, City, CityDoc }

