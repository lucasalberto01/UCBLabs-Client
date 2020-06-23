import store from '../store'

function setConnectado(){
    let payload = {
        type : 'CONECTADO'
    }
    store.dispatch(payload)
}

function setDesconectado(){
    let payload = {
        type : 'DESCONECTADO'
    }
    store.dispatch(payload)
}

export {
    setConnectado,
    setDesconectado
}