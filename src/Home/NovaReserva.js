import React from 'react';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Row, Col, Button  } from 'reactstrap';

import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from  "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { ListarDiciplinas, NovaReserva as NewReserva, listaLabs, listarReservas } from './../Service'
import Cookies from 'universal-cookie';

import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

import Swal from 'sweetalert2'

const cookies = new Cookies();

class NovaReserva extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			modal : false,
			force : false,
			lista_lab : [],
			lista_diciplinas : [],
			horarios : [],
			data : '', 
			id_lab : 0,
			id_diciplina : 0,
			hora_selecionada : null,
			id_lab_horario : 0,
			observacao : null
		}
	}

	display = (force=false)=>{
		this.setState({modal : true, force})
	}

	componentDidMount(){

		listaLabs(({Laboratorios }) =>{
			this.setState({lista_lab : Laboratorios})
		})

		ListarDiciplinas((data) =>{
			
			this.setState({lista_diciplinas : data.diciplinas})
		})
	}

	ReloadHorarios = () =>{
		let { id_lab , data} = this.state
		id_lab = parseInt(id_lab)

		this.setState({horarios : [], hora_selecionada : null})
		if(data === '' || id_lab === 0){
			return;
		}

		let payload = {
			data,
			id_lab
		}
		listarReservas(payload, ({dados})=>{
			console.log(dados)
			this.setState({horarios : dados, hora_selecionada : null});
		})
	}

	onSelectData = ({target }) =>{
		this.setState({data : target.value}, () => this.ReloadHorarios())
	}

	onSelectLab = ({target }) =>{
		this.setState({id_lab : target.value}, () => this.ReloadHorarios())
	}
	

	onSelecionarHorario = (hora_inicio, id_lab_horario)=>{

		this.setState({
			
			horarios : this.state.horarios.filter(element =>{
					
				if(element.hora_inicio === hora_inicio){
					element.selecionado = true;
					this.setState({ id_lab_horario, hora_selecionada : { hora_inicio : element.hora_inicio, hora_fim : element.hora_fim }})
				}else{
					element.selecionado = undefined;
				}      
	
				return element
			})
		})
	}

	onUsed = (materia) =>{
		Swal.fire({
			title : "Opss",
			text : "Esse horario já está sendo usado pela materia " + materia,
			type : "error"
		})
	}

	envio = (e) =>{
		e.preventDefault();

		let { id_lab, hora_selecionada, data, id_diciplina, observacao, id_lab_horario } = this.state
		let cokie = cookies.get('WebApp')

		id_diciplina = parseInt(id_diciplina)
		id_lab = parseInt(id_lab)

		if(id_lab !== 0 && hora_selecionada != null && data !== '' && id_diciplina !== null && cokie.id_usuario !== null && id_lab_horario !== 0){
			let payload = {
				id_lab, 
				id_disciplina : id_diciplina, 
				id_pessoa : cokie.id_usuario, 
				id_lab_horario, 
				data_reserva : data
			}
		
			NewReserva(payload, (data) =>{
				if(!data.erro){
					Swal.fire({
						type : 'success',
						title : 'Pronto',
						text : 'Pedido Realizado com Sucesso'
					})
					this.setState({modal : false})
				}else{
					Swal.fire({
						type : 'error',
						title : 'Opss',
						text : 'Algo de errado aconteceu, tente novamente\n' + data.msg
					})
				}
			})

		}else{
			Swal.fire({
				type : 'error',
				title : 'Opss',
				text : 'Preencha todos os Campos'
			})
		}

		
	}



	render(){
		return(
		   
			<Modal isOpen={this.state.modal} toggle={()=>this.setState({modal : false})} style={{maxWidth:800}}>
				<ModalHeader toggle={()=>this.setState({modal : false})}>Nova Reserva</ModalHeader>
				<ModalBody>
					<Form onSubmit={this.envio}>
							<Row form>
								<Col md={6}>
									<FormGroup>
										<Label>Selecione um Laboratorio</Label>
										<Input type="select" onChange={this.onSelectLab}>
											<option value={0}>Selecione um tipo de laboratorio</option>
											{this.state.lista_lab.map((elemento, index) => (
												<option key={index} value={elemento.id_lab}>{elemento.local} - {elemento.lab_tipo_nome }</option>
											))}
											
										</Input>
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label>Data Reserva</Label>
										<Input type="date" value={this.state.data} onChange={this.onSelectData} />
									</FormGroup>
								</Col>
							</Row>
							<FormGroup>
								<Label>Diciplina</Label>
								<Input onChange={({target}) => this.setState({id_diciplina : target.value})} type="select">
									<option value={0}>Selecione uma disciplina</option>
									{this.state.lista_diciplinas.map((element, key ) =>(
											<option key={key} value={element.id_disciplina}>{element.nome_disciplina}</option>
									))}
										
								</Input>
							</FormGroup>

							<FormGroup>
								<Label>Horarios Disponiveis</Label>
								<div className="row horarios">
									{this.state.horarios.map((element, index) => (
										<div className="col-2" key={index}>									
											<div
												className="horario shadow-lg" 
												style={{backgroundColor : (element.materia === null) ? (element.selecionado ? '#4a4a4a' : '#023490') : 'red'}}
												onClick={() => element.materia === null ? this.onSelecionarHorario(element.hora_inicio, element.id_lab_horario) : this.onUsed(element.materia)}
											>
												<span>
													<p>{element.hora_inicio}</p>
													<p>-</p>
													<p>{element.hora_fim}</p>
												</span>
											</div>
										</div>
									))}
									{this.state.horarios.length === 0 &&
										<div className="col-12">
											<p>Selecione um laboratorio e uma Data para exibit os horarios disponives</p>
										</div>
									}
									
								</div>
							</FormGroup>
							<FormGroup>
								<Label>Observação</Label>
								<Input onChange={({target}) => {this.setState({observacao : target.value})}} type="textarea" />
							</FormGroup>
							<FormGroup>
								<Button color="success" type="submit" block>Continuar</Button>
							</FormGroup>
						</Form>
			
				</ModalBody>
			  
			</Modal>
		 
		)
	}
}

export default NovaReserva;