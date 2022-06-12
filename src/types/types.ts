type ApiParameters = {
    key: string
    secret: string
}

type ApplicationParameters = {
    serverPort: number
    api: ApiParameters
    database: string
}

type Dictionary = {
    [key: string]: string
}

type RequesTokenAmadeusResponse = {
    type: string
    username: string
    application_name: string
    client_id: string
    token_type: string
    access_token: string
    expires_in: number
    state: string
    scope: string
}

type CityAmadeusResponse = {
    type: string
    subType: string
    name: string
    detailedName: string
    id: string
    self: {
        href: string
        methods: string[]
    },
    timeZoneOffset: string
    iataCode: string
    geoCode: {
        latitude: number
        longitude: number
    },
    address: {
        cityName: string
        cityCode: string
        countryName: string
        countryCode: string
        stateCode: string
        regionCode: string
    }
}

type SearchCityAmadeusResponse = {
    meta: {
        count: number,
        links: {
            first?: string
            previous?: string
            self: string
            next?: string
            last?: string
        }
    }
    data: CityAmadeusResponse[]
}

type HotelAmadeusResponse = {
    chainCode: string
    iataCode: string
    dupeId: number
    name: string
    hotelId: string
    geoCode: {
        latitude: number
        longitude: number
    },
    address: {
        countryCode: string
    }
}

type SearchHotelAmadeusResponse = {
    data: HotelAmadeusResponse[]
}

type OfferAmadeusResponse = {
    id: string
    checkInDate: Date
    checkOutDate: Date
    rateCode: string
    rateFamilyEstimated: {
        code: string
        type: string
    },
    description: {
        text: string
        lang: string
    },
    commission: {
        percentage: string
    },
    room: {
        type: string
        typeEstimated: {
            category: string
            beds: number
            bedType: string
        },
        description: {
            text: string
            lang: string
        }
    },
    guests: {
        adults: number
    },
    price: {
        currency: string
        base: string
        total: string
        taxes: {
            code: string
            pricingFrequency: string
            pricingMode: string
            percentage: string
            included: boolean
        }[]
        variations: {
            changes: {
                startDate: Date
                endDate: Date
                base: string
            }[]
        }
    },
    policies: {
        guarantee: {
            acceptedPayments: {
                creditCards: string[]
                methods: string[]
            }
        },
        paymentType: string
        checkInOut: {
            checkIn: string
            checkOut: string
        },
        cancellation: {
            deadline: Date
        }
    }
}

type SearchOfferAmadeusResponse = {
    data: {
        type: string
        hotel: {
            type: string
            hotelId: string
            chainCode: string
            name: string
            cityCode: string
            address: {
                countryCode: string
                stateCode: string
            },
            amenities: string[]
        },
        available: boolean
        offers: OfferAmadeusResponse[]
        self: string
    }[]
}

export {
    ApiParameters,
    ApplicationParameters,
    Dictionary,
    RequesTokenAmadeusResponse,
    SearchCityAmadeusResponse,
    SearchHotelAmadeusResponse,
    SearchOfferAmadeusResponse
}
