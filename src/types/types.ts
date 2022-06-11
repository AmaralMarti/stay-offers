type ApiParameters = {
    key: string
    secret: string
}

type DatabaseParameters = {
    host: string
    port: number
    user: string
    password: string
}

type ApplicationParameters = {
    serverPort: number 
    api: ApiParameters
    database: DatabaseParameters
}

export { ApiParameters, DatabaseParameters, ApplicationParameters }