import { NextFunction, Request, Response } from 'express'
import { Types, isValidObjectId, Document } from 'mongoose'
import { toDate, toNumber, toObjectId } from '../types/typeParser'
import { Dictionary } from '../types/types'

enum FilterType {
    ObjectId,
    Date,
    Number,
    String,
}

class BaseController {
    public static perPage: number = 10

    protected static async getPaginatedData(request: Request, response: Response): Promise<void> {
        const filters = this.getModelFilters(request)

        const pagination = await this.getPagination(request, filters)

        if (pagination.invalid) {
            response.status(400).json({
                status: 400,
                message: 'Invalid pagination parameters'
            })

            return
        }

        const data = await this.getModel().find(filters).skip(pagination.parameters.offset).limit(pagination.parameters.limit)

        const payload = {
            pagination: pagination.meta,
            filters,
            data,
        }

        response.status(200).json(payload)
    }

    private static getModelFilters(request: Request): Dictionary {
        const filters: Dictionary = {}

        for (const filter of this.getFilters()) {
            const filterName = filter.alias || filter.name
            const filterValue = request.query[filter.name]

            let value: any = null

            if (filterValue) {
                switch (filter.type) {
                    case FilterType.ObjectId:
                        value = toObjectId(filterValue as string, null)
                        console.log(value)
                        break;

                    case FilterType.Number:
                        value = toNumber(filterValue, 0)
                        break;

                    case FilterType.Date:
                        value = toDate(filterValue, null)
                        break;

                    case FilterType.String:
                        value = filterValue as string
                        break;
                }
            }

            if (value) {
                filters[filterName] = value
            }
        }

        return filters
    }

    private static async getPagination(request: Request, filters: Dictionary): Promise<Dictionary> {
        const pagination = this.getPaginationParameters(request)

        const totalRecords = await this.getModel().find(filters).count()
        const totalPages = Math.ceil(totalRecords / pagination.limit)
        const invalid = totalPages > 0 && pagination.page > totalPages

        return {
            meta: {
                totalPages,
                currentPage: pagination.page,
                perPage: pagination.limit,
                totalRecords,
            },
            parameters: pagination,
            invalid,
        }
    }

    private static getPaginationParameters(request: Request): Dictionary {
        const paramPage = request.query.page as string
        const paramPerPage = request.query.perPage as string

        let page = toNumber(paramPage, 1)
        let perPage = toNumber(paramPerPage, this.perPage)

        page = page <= 0 ? 1 : page
        perPage = perPage <= 0 ? this.perPage : perPage

        const offset = (page - 1) * perPage
        const limit = perPage

        return {
            page,
            offset,
            limit,
        }
    }

    protected static async loadEntity(id: string, response: Response): Promise<Document|null> {
        const _id = toObjectId(id, null)

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

    protected static getModel(): any { }

    protected static getModelLabel(): string {
        return 'record'
     }

    protected static getFilters(): Dictionary[] {
        return []
    }

}

export { BaseController, FilterType }
