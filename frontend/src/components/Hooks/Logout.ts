const logout = (callback1: (arg: undefined)=>void, callback2: (arg: undefined)=>void) => {
    const date = new Date(Date.now() - 86400e3)
    document.cookie = `access=1; expires=` + date;
    document.cookie = `refresh=1; expires=` + date;
    callback1(undefined)
    callback2(undefined)
}

export { logout }