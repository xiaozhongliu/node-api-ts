import fs from 'fs'
import path from 'path'
import auth from 'http-auth'
import config from '../config'

const basic = auth.basic({
    realm: 'Http Auth Realm',
}, (username, password, cb) => {
    cb(username === config.HTTP_AUTH.USERNAME && password === config.HTTP_AUTH.PASSWORD)
})

export default (req, res, next) => {
    // 1. intercept request on favicon.ico
    if (req.path === '/favicon.ico') {
        return res.status(204).end()
    }

    // 2. apply http auth to log accessing
    if (config.HTTP_AUTH.ITEMS_REG.test(req.path)) {
        return basic.check(req, res, (request, response, err) => {
            if (err) {
                return next(err)
            }

            if (/\.log$/.test(request.url)) {
                const logPath = path.resolve(config.API_LOG_PATH, request.url.substr(1))
                return fs.createReadStream(logPath).pipe(res)
            }

            next()
        })
    }

    next()
}
