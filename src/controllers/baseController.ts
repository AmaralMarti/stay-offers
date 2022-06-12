import { Response } from 'express'
import { Types, isValidObjectId, Document } from 'mongoose'

class BaseController {
    protected static async loadEntity(id: string, response: Response): Promise<Document|null> {
        const _id = BaseController.getObjectId(id)

        if (!_id) {
            response.status(400).json({
                status: 400,
                message: `Invalid ${this.getModelLabel()} ID`,
            })

            return null
        }

        const hotel = await this.getModel().findOne({_id})

        if (!hotel) {
            response.status(404).json({
                status: 404,
                message: `${this.getModelLabel()} not found`,
            })

            return null
        }

        return hotel
    }

    private static getObjectId(param: string): Types.ObjectId|null {
        if (!isValidObjectId(param)) {
            return null
        }

        const objectId = new Types.ObjectId(param)

        return objectId
    }

    protected static getModel(): any { }

    protected static getModelLabel(): string {
        return 'Register'
     }

}

export { BaseController }
