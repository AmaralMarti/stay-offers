import { isValidObjectId, Types } from "mongoose"

const dateToString = (date: Date): string => {
    const dateTimeString = date.toISOString()
    const dateString = dateTimeString.split('T')[0]

    return dateString
}

const addDays = (date: Date, days: number): Date => {
    const newDate = new Date(date.toISOString())
    newDate.setDate(newDate.getDate() + days)

    return newDate
}

const toNumber = (value: any, defaultValue: number): number => {
    const parsedValue = parseInt(value)

    if (isNaN(parsedValue)) {
        return defaultValue
    }

    return parsedValue
}

const toObjectId = (value: string, defaultValue: Types.ObjectId|null): Types.ObjectId|null => {
    if (!isValidObjectId(value)) {
        return defaultValue
    }

    return new Types.ObjectId(value)
}

const toDate = (value: any, defaultValue: Date|null): Date|null => {
    const parsedValue = new Date(value)

    console.log(parsedValue.toString())

    const isInvalid = parsedValue.toString() === 'Invalid Date'

    if (isInvalid) {
        return defaultValue
    }

    return parsedValue
}

export { dateToString, addDays, toNumber, toObjectId, toDate }
