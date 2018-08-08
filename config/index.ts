import base from './base'
import dev from './dev'
import test from './test'
import qa from './qa'
import prod from './prod'
import Config from 'config'

const env = process.env.NODE_ENV || 'dev'
console.log(`env is: ${env}`)
const envs: { [index: string]: any } = { dev, test, qa, prod }
export default mergeDeep(base, envs[env])

/**
 * helper methods (they should be here other than ..util namespace)
 */
function mergeDeep(target: Config, source: Config): Config {
    const output = Object.assign({}, target)
    if (!isObject(target) || !isObject(source)) {
        return <Config>output
    }
    Object.keys(source).forEach(key => {
        if (target[key] && isObject(source[key])) {
            output[key] = mergeDeep(target[key], source[key])
            return
        }
        output[key] = source[key]
    })
    return <Config>output
}

function isObject(item: Config) {
    return item && typeof item === 'object' && !Array.isArray(item)
}
