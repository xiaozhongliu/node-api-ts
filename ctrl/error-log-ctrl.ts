import config from '../config'
import { mailer } from '../util'

export default {

    /**
     * alarm system level errors
     */
    createErrorLog(req, code, message, stack) {
        const errorLog = {
            endType: 'backend',
            appName: config.API_NAME,
            errTitle: message,
            errCode: code,
            errStack: stack,
            data: {
                url: req.url,
                method: req.method,
                header: {
                    clientip: req.header('http_x_forwarded_for'),
                },
            },
            username: req.body.username,
        }
        if (req.method !== 'GET') {
            errorLog.data.body = req.body
        }

        mailer.alarm(config.API_NAME, JSON.stringify(errorLog))

        // logic to save errors into db
    },
}
