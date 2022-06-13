import { Schema, model, Model, Document } from 'mongoose'

interface ISync {
    processing: boolean
    model: string
}

const SyncSchema = new Schema({
    processing: {
        type: Boolean,
        required: true,
    },
    model: {
        type: String,
        required: true
    },
})

SyncSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id

    return object
})

interface SyncDoc extends Document {
    processing: boolean
    model: string
}

SyncSchema.statics.build = (attr: ISync): SyncDoc => {
    return new Sync(attr)
}

interface SyncModelInterface extends Model<SyncDoc> {
    build(attr: ISync): SyncDoc
}

const Sync = model<SyncDoc, SyncModelInterface>('Sync', SyncSchema)

export { ISync, Sync, SyncDoc }
