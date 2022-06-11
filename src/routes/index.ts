import { NextFunction, Request, Response, Router } from 'express'
import { RouterV1 } from './v1'

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
    response.json({ 
       error: error.message
    })    
}

const router = Router()

router.get('/', defaultMessage)
router.use(errorHandler)

router.use('/v1', RouterV1)

export { router as Router  }