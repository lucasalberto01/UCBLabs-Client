import React from 'react'
import { Modal, ModalHeader,ModalBody, Form, FormGroup, Label, Input, Button, ModalFooter } from 'reactstrap'
import Swal from 'sweetalert2'

class ModalImport extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exibir : false
        }
    }

    onDisplay = () =>{
        this.setState({exibir : true})
    }

    onContinue = () =>{
        Swal.fire({
            type : 'warning',
            title : "Espera",
            text : "Essa função ainda está em desenvolvimento, ainda não temos o modelo de csv esperado",
        }).then(resp =>{
            if(resp.value){
                this.setState({exibir : false})
            }
        })
    }

    render(){
        return(
            <Modal isOpen={this.state.exibir} toggle={() => this.setState({ exibir : false })} >
                <ModalHeader className="text-center" toggle={() => this.setState({ exibir : false })} >Importar CSV</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Selecione o arquivo CSV</Label>
                            <Input type="file" accept=".csv"/>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn btn-success" onClick={this.onContinue}>Continuar</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default ModalImport;