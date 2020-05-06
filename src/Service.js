import Cookies from 'universal-cookie';
import * as axios from 'axios'
import io from 'socket.io-client'

const cookies = new Cookies();
const URL = 'http://localhost:3333'
//const URL = 'http://191.252.219.159:8080'


const socket = io(URL);

socket.on('connect', function(data){
    console.log('Conectado id', socket.id)
})

socket.on('StatusUpdata', function(data){
    console.log(data)
})

function autenticado(callback){
    if(cookies.get('WebApp') === undefined){
        callback(false)
        
    }else{
        callback(true);
    }
    
}

function login(data, callback){
    let matricula = data.matricula
    let senha = data.senha
    console.log(data);
    if(matricula === '2019' && senha === 'demo'){

        cookies.set('WebApp', {id_usuario : 1, type_user : 'cod_univ'}, {path : '/'})
        callback({'auth' : true, 'type_user' : 'cod_univ'})

    }else if(matricula === '20192' && senha === 'demo'){
        cookies.set('WebApp', {id_usuario : 1, type_user : 'cod_lab'}, {path : '/'})
        callback({'auth' : true, 'type_user' : 'cod_lab'})

    }else{
        callback({'auth' : false, 'type_user' : null})
    }
}

function logout(callback){
    cookies.remove('WebApp')
    callback(true)
}

function listaLabs(callback){
    axios.post(URL + '/laboratorio/lista', {responseType : 'json'})
    .then(function (response) {
        callback(response.data)
        
    })
    .catch(function (error) {
        // handle error
        alert(JSON.stringify(error) )
    })
}
function listarTiposLabs(callback){
    axios.post(URL + '/tipos-laboratorios/listar')
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function novoLab(data, callback){
    axios.post(URL + '/laboratotio/novo', { data })
    .then(function(response){
        callback(response)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function getDadosLab(id_lab, callback){
    axios.post(URL + '/laboratotio/mostra/' + id_lab)
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function editarLab(data, callback){
    let id_lab = data.id_lab
    axios.post(URL + '/laboratotio/editar/' + id_lab, { data })
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })

}

function apagarLab(id_lab, callback){
    axios.post(URL + '/laboratotio/apagar/' + id_lab)
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function listarReservas(data, callback){
    axios.post(URL + '/horarios/listar', { data })
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function getDadosReserva(id_lab, callback){
    axios.post(URL + '/reserva/lab/' + id_lab)
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function getDadosStatusReserva(callback){
    axios.post(URL + '/reserva/status')
    .then(function(response){
        callback(response.data)
    })
}

function tiposAlertas(callback){
    axios.post(URL + '/avisos/listartipos')
    .then(function(response){
        callback(response.data)
    })
}

function salvarAlerta(data, callback){
    axios.post(URL + '/avisos/add', {data})
    .then(function(response){
        callback(response.data)
    })
}

function listarAlertas(callback){
    axios.post(URL + '/avisos/lista')
    .then(function(response){
        callback(response.data)
    })
}

function editarAlerta(data, callback){
    axios.post(URL + '/avisos/editar', {data})
    .then(function(response){
        callback(response.data)
    })
}

function apagarAlerta(id_lab, callback){
    axios.post(URL + '/avisos/apagar/' + id_lab)
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function NovaReserva(data, callback){
    axios.post(URL + '/reserva/add', { data })
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })

}

function ListarDiciplinas(callback){
    axios.post(URL + '/diciplina/listar')
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function ListarHorarios(callback){
    axios.post(URL + '/horarios/listar-horarios')
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function NovoPedido(data, callback){
    axios.post(URL + '/pedido/novo', { data })
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function ListarPedidos(id_remetente, callback){
    axios.post(URL + '/pedido/listar_id/' + id_remetente)
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function ListarTodosPedidos(callback){
    axios.post(URL + '/pedidos/litar-todos')
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })

}

function ExibirDadosPedido(id_pedido, callback){
    axios.post(URL + '/pedidos/exibir/' + id_pedido)
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })

}

function CancelarPedido(id_pedido, callback){
    axios.post(URL + '/pedidos/cancelar/' + id_pedido)
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function DadosReserva(id_reserva, callback){
    axios.post(URL + '/reserva/exibir/' + id_reserva)
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

function verificaReserva(data, callback){
    axios.post(URL + '/reserva/verifica', { data})
    .then(function(response){
        callback(response.data)
    })
    .catch(function(error){
        alert(JSON.stringify(error))
    })
}

export {
    socket,
    autenticado,
    login,
    logout,
    listaLabs,
    novoLab,
    getDadosLab,
    editarLab,
    apagarLab,
    listarReservas,
    getDadosReserva,
    getDadosStatusReserva,
    NovaReserva,
    DadosReserva,
    tiposAlertas,
    salvarAlerta,
    listarAlertas,
    editarAlerta,
    apagarAlerta,
    listarTiposLabs,
    ListarDiciplinas,
    ListarHorarios,
    NovoPedido,
    ListarPedidos,
    ListarTodosPedidos,
    ExibirDadosPedido,
    CancelarPedido,
    verificaReserva
}