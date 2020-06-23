import { createStore } from 'redux'

const INICIAL = {
    status : 'Desconectado',
    color : 'badge-danger'
}

function processo(state = INICIAL, action){
    if(action.type === 'CONECTADO'){
        return {...state, status : 'Conectado', color : 'badge-success' }
    }
    if(action.type === 'DESCONECTADO'){
        return {...state, status : 'Desconectado', color : 'badge-danger' }
    }

    return state
}

export default createStore(processo)