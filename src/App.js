import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Cookies from 'universal-cookie';

import Login from './Login'
import Reserva from './Reserva'
import Home from './Home/Home'
import Aviso from './Aviso'
import Calendario from './Calendario'
import Relatorio from './Relatorio'
import Manutencao from './Manutencao'
import ListaLaboratorio from './Laboratorio/ListaLaboratorios'
import Laboratorio from './Laboratorio'

import Status from './Status'

import { autenticado } from './Service'
const cookies = new Cookies();

class App extends React.Component{

	constructor(props){
		super(props)
		this.state = { destino : null}
	}

	componentDidMount(){
		autenticado(function(data){
			if(data){
				
				var cookie = cookies.get('WebApp');
				console.log(cookie)
				this.setState({ destino : cookie.type_user}) 
			}
			

		}.bind(this))
		
	}

	render(){
		return(
			<Router>
				<div>
					<Route path="/status" component={Status} />
					<Route exact path="/" component={Login} />
					<Route path="/reserva" component={Reserva} />
					<Route path="/home" component={Home} />
					<Route path="/avisos" component={Aviso} />
					<Route path="/calendario" component={Calendario} />
					<Route path="/relatorio" component={Relatorio} />
					<Route path="/manutencao" component={Manutencao} />
					<Route path="/laboratorio/:id" component={Laboratorio} />
					<Route path="/laboratorios" component={ListaLaboratorio} />
					{this.state.destino !== null &&

						<Redirect to={this.state.destino === 'cod_univ' ? "/home" : '/reserva'}/>
					}
				</div>
			</Router>
		)
	}
}

export default App;
