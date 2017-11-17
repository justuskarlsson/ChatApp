
export default class {
    
    constructor(...listeners){
        this._listeners = {}
        listeners.map(listen=>{
            this._listeners[listen] = {
                0:0
            }
        })
    }


    update = (key, val, route = "", data = {}) => {
        this[key] = val
        // maybe add check so that 
        console.log(`${key} was updated with ${val}`)
        if (this._listeners[key]){
            Object.entries(this._listeners[key]).map( ([funcKey,{func, check}]) =>{
                if (funcKey != 0){
                        // if lCheck => lCheck(route, args)
                    if( check(route, data) ){
                        func(val)
                    }
                }
            })
        }

    }

    on = (key, func, check=(route, data)=>(true) ) => {
        // function to check if update is valied
        // (route, args) => route == "message/new" && args.roomID == this.state.id
        this._listeners[key][0] ++
        var id = this._listeners[key][0]

        this._listeners[key][id] = {
            func,
            check
        }
        //console.log(`Listener ${id} on ${key} was added.`)
        const off = ()=> {
            delete this._listeners[key][id]
        //    console.log(`Listener ${id} on ${key} was removed.`)
        }
        return {
            off
        }
    }

}