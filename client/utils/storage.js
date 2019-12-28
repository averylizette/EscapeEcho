export function getFromStorage(key) {
    if (!key) return null

    try {
        const valueStr = localStorage.getItem(key); // TODO more research on localStorage object 
        if (valueStr) {
            return JSON.parse(valueStr)
        }
        return null
    } catch (err) {
    return null
    }
}

export function setInStorage(key, obj) {
    if (!key) console.error('Error: Key is missing, cannot set in storage') // TODO look into console.error

    try {
        localStorage.setItem(key, JSON.stringify(obj));
    } catch (err) {
        console.error(err, 'error setting key in local storage')
    }
    
}