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

export { dateToString, addDays }