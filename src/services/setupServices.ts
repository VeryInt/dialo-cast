// 用于在应用启动时注册所有服务，需要在主进程中启动
// 类似 nodejs 服务

import _ from 'lodash'
import fileServices from './FileServices'
import apiServices from './APIServices'
import systemServices from './SystemServices'

export default function setupServices() {
    fileServices()
    apiServices()
    systemServices()
}
