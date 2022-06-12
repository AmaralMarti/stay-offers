import { ICity } from '../models/city'
import { IHotel } from '../models/hotel'
import { ApiParameters, Dictionary, RequesTokenAmadeusResponse, SearchCityAmadeusResponse, SearchHotelAmadeusResponse, SearchOfferAmadeusResponse } from '../types/types'
import Axios, { AxiosRequestConfig } from 'axios'
import { URLSearchParams } from 'url'
import { addDays, dateToString } from '../types/typeParser'
import { IOffer } from '../models/offer'


enum UriType {
    accessToken = 'accessToken',
    searchCity = 'searchCity',
    hotelsByCity = 'hotelsByCity',
    offersByHotel = 'offersByHotel',
}

class Amadeus {
    private parameters: ApiParameters

    public baseUrl: string = 'https://test.api.amadeus.com'

    public maxPageLimit = 32767

    public adults = 1
    public checkInDate = dateToString(new Date())
    public checkOutDate = dateToString(addDays(new Date(), 1))

    private uriList: Dictionary = {
        accessToken: '/v1/security/oauth2/token',
        searchCity: '/v1/reference-data/locations?subType=CITY&page[offset]=%:pageOffset:%&page[limit]=%:pageLimit:%&keyword=%:keyword:%',
        hotelsByCity: '/v1/reference-data/locations/hotels/by-city?cityCode=%:cityCode:%',
        offersByHotel: '/v3/shopping/hotel-offers?hotelIds=%:hotelIds:%&adults=%:adults:%&checkInDate=%:checkInDate:%&checkOutDate=%:checkOutDate:%'
    }

    constructor(parameters: ApiParameters) {
        this.parameters = parameters
    }

    private getUrl(uriType: UriType, queryParams?: Dictionary): string {
        let uri = this.uriList[uriType]

        queryParams ||= {}
        for (let param in queryParams) {
            const value = queryParams[param]
            uri = uri.replace(`%:${param}:%`, value)
        }

        return `${this.baseUrl}${uri}`
    }

    private async getAccessToken(): Promise<string> {
        const params = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: this.parameters.key,
            client_secret: this.parameters.secret,
        })

        const url = this.getUrl(UriType.accessToken)

        const { data } = await Axios.post<RequesTokenAmadeusResponse>(url, params.toString())

        return data.access_token
    }

    private async getHeaders(): Promise<AxiosRequestConfig> {
        const token = await this.getAccessToken()

        return {
            headers: {
                Authorization: `Bearer ${token}`
            },
        };
    }

    public async searchCity(keyword: string): Promise<ICity[]> {
        const queryParams = {
            pageOffset: '0',
            pageLimit: `${this.maxPageLimit}`,
            keyword,
        }

        const url = this.getUrl(UriType.searchCity, queryParams)
        const headers = await this.getHeaders()

        const { data } = await Axios.get<SearchCityAmadeusResponse>(url, headers)

        const cities: ICity[] = []

        for (const item of data.data) {
            const city: ICity = {
                cityCode: item.iataCode,
                name: item.name,
                countryName: item.address.countryName,
                countryCode: item.address.countryCode,
                latitude: item.geoCode.latitude,
                longitude: item.geoCode.longitude,
            }

            cities.push(city)
        }

        return cities
    }

    public async getHotelsByCity(cityCode: string): Promise<IHotel[]> {
        const queryParams = {
            cityCode,
        }

        const url = this.getUrl(UriType.hotelsByCity, queryParams)
        const headers = await this.getHeaders()

        const { data } = await Axios.get<SearchHotelAmadeusResponse>(url, headers)

        const hotels: IHotel[] = []

        for (const item of data.data) {
            const hotel: IHotel = {
                hotelId: item.hotelId,
                name: item.name,
                cityCode: item.iataCode,
                latitude: item.geoCode.latitude,
                longitude: item.geoCode.longitude,
            }

            hotels.push(hotel)
        }

        return hotels
    }

    public async getOffersByHotel(hotelIds: string): Promise<IOffer[]> {
        const queryParams = {
            hotelIds,
            adults: `${this.adults}`,
            checkInDate: this.checkInDate,
            checkOutDate: this.checkOutDate
        }

        const url = this.getUrl(UriType.offersByHotel, queryParams)

        const headers = await this.getHeaders()

        const offers: IOffer[] = []

        try{
            const { data } = await Axios.get<SearchOfferAmadeusResponse>(url, headers)

            for (const dataItem of data.data) {
                for (const item of dataItem.offers) {
                    const offer: IOffer = {
                        offerId: item.id,
                        hotelId: dataItem.hotel.hotelId,
                        checkInDate: item.checkInDate,
                        checkOutDate: item.checkInDate,
                        description: item.room.description.text,
                        adults: item.guests.adults,
                        currency: item.price.currency,
                        totalPrice: +item.price.total,
                    }

                    offers.push(offer)
                }
            }
        } catch (e: any) {
            const status = e?.response?.status ?? null
            const message = e?.response?.statusText ?? null

            if (status && message) {
                console.log({ status, message })
            } else {
                console.log(e)
            }
        }

        return offers
    }
}

export { Amadeus }

/*

// Cidades
https://test.api.amadeus.com/v1/reference-data/locations?keyword=london&subType=CITY
https://test.api.amadeus.com/v1/reference-data/locations?keyword=london&subType=CITY&page[offset]=0&page[limit]=2
 - Tem paginação

// Hotel por cidade
https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=NYC
 - Tem paginação (mais ou menos - Não tem)


// Ofertas por hotel
https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=BWNYC152
https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=BWNYC152&adults=2&checkInDate=2022-06-11&checkOutDate=2022-06-12

*/
