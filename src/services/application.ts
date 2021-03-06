import Cors from 'cors'
import { config as DotEnvConfig } from 'dotenv'
import { connect as ConnectDb } from 'mongoose'
import { Express } from 'express'
import NewExpress from 'express'
import { Router } from '../routes'
import { ApplicationParameters } from '../types/types'
import { Sync } from '../models/sync'


class Application {
    private server: Express
    public static parameters: ApplicationParameters

    constructor() {
        Application.parameters = this.loadParameters()

        this.conectDatabase(Application.parameters.database)

        this.server = NewExpress()
        this.prepareServer(this.server)

        this.clearSyncStatus()
    }

    private loadParameters(): ApplicationParameters {
        DotEnvConfig()

        const {
            PORT = 3000,
            API_KEY = '',
            API_SECRET = '',
            DB_CONNECTION_STRING=''
        } = process.env

        return {
            serverPort: +PORT,
            api: {
                key: API_KEY,
                secret: API_SECRET,
            },
            database: DB_CONNECTION_STRING,
        }
    }

    private conectDatabase(connectionString: string) {
        ConnectDb(connectionString, {}, () => console.log('Database connected!'))
    }

    private prepareServer(server: Express) {
        server.use(Cors())
        server.use('/', Router)
    }

    private async clearSyncStatus(): Promise<void> {
        await Sync.deleteMany({})
    }

    public startServer() {
        const port = Application.parameters.serverPort

        this.server.listen(port, () => console.info(`Server running at ${ port } port`))
    }
}

export { Application }
