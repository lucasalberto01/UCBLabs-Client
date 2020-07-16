import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, Input, Label } from 'reactstrap';
import { listaLabs, listarReservas } from '../Service'
import Moment from 'moment';


class VerReservas extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false,
            labs : [],
            date : Moment().format('YYYY-MM-DD'),
            id_lab : 0,
            dados : []
        }
    }

    componentDidMount(){
        listaLabs(({Laboratorios}) =>{
            console.log(Laboratorios)
            this.setState({labs : Laboratorios})
        })
    }

    onSelectLab = ({target}) =>{
        this.setState({id_lab : parseInt(target.value)}, () => this.onLoad())
    }

    onSelectDate = ({target}) =>{
        this.setState({date : target.value}, () => this.onLoad())
    }

    onLoad = () =>{
        let {id_lab, date } = this.state

        console.log({id_lab, date })
        this.setState({dados : []})

        if(id_lab === 0 || date === null){
            return;
        }

        let payload = {
            id_lab,
            data : date
        }

        listarReservas(payload , (data)=>{
            console.log(data)
            this.setState({dados : data.dados})
        });


    }

    onDisplay = () =>{
        this.setState({exibir : true})
    }

    render(){
        return(
            <Modal isOpen={this.state.exibir} toggle={() => this.setState({exibir : false })} className="modal-lg" >
                <ModalHeader toggle={() => this.setState({exibir : false })} >Ver Reservas</ModalHeader>
                <ModalBody style={{minHeight : 750}}>
                    <div>
                        <h5>Reservas</h5>
                        <p>Veja todas as reservas e todos os tempos livres de um laboratirio</p>
                    </div>
                    <hr/>
                    <Form>
                        <Row form>
                            <Col col={6}>
                                <Label>Selecione um laboratirio</Label>
                                <Input defaultValue={this.state.id_lab} type="select" onChange={this.onSelectLab}>
                                    <option value={0}>Selecione um Laboratorio</option>
                                    {this.state.labs.map(element =>(
                                        <option value={element.id_lab}>{element.local} - {element.lab_tipo_nome}</option>
                                    ))}
                                </Input>
                            </Col>
                            <Col col={6}>
                                <Label>Selecione uma data</Label>
                                <Input type="date" value={this.state.date} onChange={this.onSelectDate} />
                            </Col>
                        </Row>
                    </Form>
                    <h5 className="text-muted mt-4 border-bottom pb-2">Reservas e Horarios</h5>
                    <div className="row" style={{overflow : 'auto', height: '60vh'}}>
                        
                        {this.state.dados.map((element, index) =>(
                            <div className="media text-muted col-4" key={index}>
                                <svg className="bd-placeholder-img mr-2 rounded" width={32} height={32} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill={element.color === null ? "#CCC" : element.color} /><text x="50%" y="50%" fill={element.color === null ? "#CCC" : element.color} dy=".3em">32x32</text></svg>

                                <div className="media-body pb-1 mb-2 mb-0 small lh-125 border-bottom border-gray">
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <strong className="text-gray-dark">{element.hora_inicio} - {element.hora_fim}</strong>
                                    </div>
                                    <span className="d-block"> {element.materia === null ? 'Trancada' : element.materia }</span>
                                </div>
                            </div> 
                        ))}

                        {this.state.dados.length === 0 &&
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <span>Selecione um laboratorio e uma data</span>
                                </div>
                            </div>
                        }
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}

export default VerReservas;