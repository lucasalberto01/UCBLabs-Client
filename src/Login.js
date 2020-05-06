import React from 'react';
import './App.css'
import logo from './img/logo-login.png'
import { login } from './Service'


class Login extends React.Component{

    constructor(props){
        super(props)
        this.state = {matricula : null, senha : null, erro_login : false}
        this.goLogin = this.goLogin.bind(this)
    }

    componentDidMount(){

    }

    goLogin(event){
        event.preventDefault()

        let data = {
            matricula : this.state.matricula,
            senha : this.state.senha

        }
        login(data, function(data){
            console.log(data)
            if(data.auth){
                if(data.type_user === 'cod_univ'){
                    this.props.history.push('/home')
                
                }else if(data.type_user === 'cod_lab'){
                    this.props.history.push('/reserva')

                }
                

            }else{
                this.setState({erro_login : true})
                /*
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Usuario não encontrado!',
                    footer: '<a href>Deseja ajuda?</a>'
                })
                */
            }
        }.bind(this))

    }

    render(){
        return(
            <div className="login">
                <div className={`box animated fadeIn`}>
                    <img className="logo" alt="Logo UCB" src={logo} />
                    <div className={`card border-info mx-auto shadow animated fast ${this.state.erro_login ? 'shake' : ''} `}>
                        <div className="card-header text-center">
                            Login
                        </div>
                        <div className="card-body">
                            <form onSubmit={this.goLogin}>
                                <div className="form-group">
                                    <label >Matricula</label>
                                    <input type="number" onChange={({target}) => this.setState({ matricula : target.value} )} className={this.state.erro_login ? 'form-control is-invalid' : 'form-control'} placeholder="Matricula..." />
                                    <div class="invalid-feedback">
                                        Verifique sua matricula e sua senha
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label >Senha</label>
                                    <input type="password" onChange={({target}) => this.setState({ senha : target.value} )} className={this.state.erro_login ? 'form-control is-invalid' : 'form-control'} placeholder="Senha..." />
                                </div>
                                <button type="submit" className="btn btn-block btn-primary">Go</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;