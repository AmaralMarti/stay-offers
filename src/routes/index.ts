import Express, { NextFunction, Request, Response, Router } from 'express'
import { RouterV1 } from './v1'
import swaggerUi from 'swagger-ui-express'
import documentation from '../swagger.json'

const defaultMessage = (request: Request, response: Response) => {
    response.send(`
        <html>
            <head>
                <title>Teste</title>
            </head>
            <body>
                <h1>This is an API</h1>
            </body>
        </html>
    `)
}

const errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
    console.log('Error', error)
    response.status(400).json({
       error: error.message
    })
}

const router = Router()

router.use(Express.json())
router.use(errorHandler)
router.get('/', defaultMessage)
router.use('/v1', RouterV1)
router.use('/documentation', swaggerUi.serve, swaggerUi.setup(documentation))

export { router as Router  }
