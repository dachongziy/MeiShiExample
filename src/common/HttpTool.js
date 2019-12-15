// 设定超时的限额
const delay = timeout => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject('请求超时'), timeout * 1000)
    })
}

// 对fetch() 请求数据的get请求进行进一步封装
const get = ({url, params = {}, timeout}) => {
    const paramArr = []
    // 将后部携带的参数进行数组化
    if (Object.keys(params).length !== 0) {
        for (const key in params) {
            paramArr.push(`${key}=${params[key]}`)
        }
    }
    // 将前面的url与后面的参数进行组合
    const urlStr = `${url}?${paramArr.join('&')}`

    // 可以选择超时时间或者不设定
    if (timeout === undefined) {
        return fetch(urlStr)
    } else {
        return Promise.race([fetch(urlStr), delay(timeout)])
    }
}

export { get }
