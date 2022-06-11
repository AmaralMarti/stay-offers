const AmadeusApi = require('amadeus')
import { dateToString, addDays } from '../types/typeParser'
import { ICity } from '../models/city'
import { IHotel } from '../models/hotel'
import { ApiParameters } from '../types/types'

class Amadeus {
    private api: any

    private CITY: string = 'CITY'
    private PAGE_LIMIT: number = 10
    
    private pagination = {
        'page[offset]': 0,
        'page[limit]': 1000,
    }

    constructor(parameters: ApiParameters) {       
        this.api = new AmadeusApi({
            clientId: parameters.key,
            clientSecret: parameters.secret,
        })
    }

    public async searchCity(keyword: string): Promise<ICity[]> {
        try {
            const pagination = {
                'page[offset]': 0,
                'page[limit]': this.PAGE_LIMIT,                
            }

            const data: ICity[] = []
            let pageData: any
            do {
                const response = await this.api.referenceData.locations.get({
                   keyword,
                    subType: this.CITY,                
                    ...pagination
                });
                
                pageData = JSON.parse(response.body)

                pageData.data.forEach((pageItem: any) => {
                    // console.log(pageItem)
                    // console.log('==================================')
                    const city: ICity = {
                        id: pageItem.id,
                        code: pageItem.iataCode,
                        name: pageItem.name,
                        countryName: pageItem.address.countryName,
                        countryCode: pageItem.address.countryCode,
                        latitude: pageItem.geoCode.latitude,
                        longitude: pageItem.geoCode.longitude,
                    }

                    data.push(city)
                })


                pagination['page[offset]'] += this.PAGE_LIMIT
            } while (pageData.meta.links.next);

            return data
        } catch (e: any) {
            console.log('Error:', e)
            return []
        }
    }

    public async getHotelsByCity(cityCode: string): Promise<IHotel[]> {
        try {
            const pagination = {
                'page[offset]': 0,
                'page[limit]': this.PAGE_LIMIT,                
            }

            const data: IHotel[] = []

            const response = await this.api.referenceData.locations.hotels.byCity.get({
                cityCode,
            });

            const pageData = JSON.parse(response.body)

            pageData.data.forEach((pageItem: any) => {
                const hotel: IHotel = {
                    id: pageItem.hotelId,
                    name: pageItem.name,
                    cityCode: pageItem.iataCode,
                    latitude: pageItem.geoCode.latitude,
                    longitude: pageItem.geoCode.longitude,
                }

                data.push(hotel)
            })

            return data
        } catch (e: any) {
            console.log('Error:', e)
            return []
        }
    }

    public async getOffersByHotel(hotelId: string) {
        try {
            const response = await this.api.shopping.hotelOffersByHotel.get({
                hotelId,
                ...this.pagination
            });
            
            return JSON.parse(response.body)
        } catch (e: any) {
            console.log(e)
            return null
        }
    }    

    // public async getOffersByCity(cityCode: string, adults: number|null = null, checkInDate: Date|null = null, checkOutDate: Date|null = null): Promise<any> {
    //     try {
    //         adults = adults || 1
    //         checkInDate = checkInDate || new Date()
    //         checkOutDate = checkOutDate || addDays(checkInDate, 1)

    //         console.log({cityCode, adults, checkInDate, checkOutDate})

    //         const response = await this.api.shopping.hotelOffers.get({
    //             cityCode,
    //             // adults,
    //             // checkInDate: dateToString(checkInDate),
    //             // checkOutDate: dateToString(checkOutDate),
    //             ...this.pagination
    //         });
            
    //         return JSON.parse(response.body)
    //     } catch (e: any) {
    //         return null
    //     }        
    // }

    // public async getOffersByHotel(hotelId: string, adults: number|null, checkInDate: Date|null, checkOutDate: Date|null): Promise<any[]> {
    //     try {
    //         adults = adults || 1
    //         checkInDate = checkInDate || new Date()
    //         checkOutDate = checkOutDate || addDays(checkInDate, 1)

    //         const response = await this.api.shopping.hotelOffersByHotel.get({
    //             hotelId,
    //             adults,
    //             checkInDate: dateToString(checkInDate),
    //             checkOutDate: dateToString(checkOutDate),
    //             ...this.pagination
    //         });
            
    //         return JSON.parse(response.body)
    //     } catch (e: any) {
    //         return []
    //     }        
    // }    

}

export { Amadeus }
   
