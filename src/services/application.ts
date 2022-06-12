import Cors from 'cors'
import { config as DotEnvConfig } from 'dotenv'
import { connect as ConnectDb } from 'mongoose'
import { Express } from 'express'
import NewExpress from 'express'
import { Router } from '../routes'
import { ApplicationParameters, DatabaseParameters } from '../types/types'


class Application {
    private server: Express
    public static parameters: ApplicationParameters

    constructor() {
        Application.parameters = this.loadParameters()

        this.conectDatabase(Application.parameters.database)

        this.server = NewExpress()
        this.prepareServer(this.server)
    }

    private loadParameters(): ApplicationParameters {
        DotEnvConfig()

        const {
            PORT = 3000,
            API_KEY = '',
            API_SECRET = '',
            DB_HOST = 'localhost',
            DB_PORT = 27017,
            DB_USER = 'root',
            DB_PASSWORD = ''
        } = process.env

        return {
            serverPort: +PORT,
            api: {
                key: API_KEY,
                secret: API_SECRET,
            },
            database: {
                host: DB_HOST,
                port: +DB_PORT,
                user: DB_USER,
                password: DB_PASSWORD,
            },
        }
    }

    private conectDatabase(parameters: DatabaseParameters) {
        const connectionString = `mongodb://${parameters.user}:${parameters.password}@${parameters.host}:${parameters.port}`

        ConnectDb(connectionString, {}, () => console.log('Database connected!'))
    }

    private prepareServer(server: Express) {
        server.use(Cors())
        server.use('/', Router)
    }

    public startServer() {
        const port = Application.parameters.serverPort

        this.server.listen(port, () => console.info(`Server running at ${ port } port`))
    }
}

export { Application }
