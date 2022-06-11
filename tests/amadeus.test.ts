import { Amadeus } from '../src/services/amadeus'

describe('Interface com Amadeus', () => {
  it('Instancia o objeto', async () => {
    const amadeus = new Amadeus()
        
    expect(amadeus).toBeDefined()
  })

  it('Pesquisa New York', async () => {
    const amadeus = new Amadeus()
    const data = await amadeus.searchCity('new york')
             
    expect(data?.data[0].subType).toEqual('CITY')
    expect(data?.data[0].name).toEqual('NEW YORK')
  })  

  // it('Pesquisa ofertas em New York', async () => {
  //   const amadeus = new Amadeus()
  //   const data = await amadeus.getOffersByCity('NYC',)
             
  //   expect(data?.data[0].subType).toEqual('CITY')
  //   expect(data?.data[0].name).toEqual('NEW YORK')
  // })  

})
