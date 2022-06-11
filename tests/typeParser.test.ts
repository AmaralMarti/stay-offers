import { dateToString, addDays } from '../src/types/typeParser'

describe('Conversão de data para string', () => {
  it('Converte com sucesso a data para string', async () => {
    const date = new Date('2022-01-01T00:00:00')
    const string = dateToString(date)
    expect(string).toEqual('2022-01-01')
  })

  it('A saída é diferente da entrada', async () => {
    const date = new Date('2022-01-01T00:00:00')
    const string = dateToString(date)
    expect(string).not.toEqual('2022-01-01T00:00:00')
  })  

})

describe('Adiciona um dia em uma data', () => {
  it('Adiciona com sucesso 1 dia na data', async () => {
    const date = new Date('2022-01-01T00:00:00')
    const newDate = addDays(date, 1)
    expect(newDate).toEqual(new Date('2022-01-02T00:00:00'))
  })

  it('Adiciona com sucesso 5 dia na data', async () => {
    const date = new Date('2022-01-01T00:00:00')
    const newDate = addDays(date, 5)
    expect(newDate).toEqual(new Date('2022-01-06T00:00:00'))
  })  

  it('A saída é diferente da entrada', async () => {
    const date = new Date('2022-01-01T00:00:00')
    const newDate = addDays(date, 1)
    expect(newDate).not.toEqual(new Date('2022-01-01T00:00:00'))
  })  

})