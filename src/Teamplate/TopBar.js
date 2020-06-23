import React from 'react'
import './../App.css'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import logo from './../img/logo-login.png'
import { Link, withRouter } from 'react-router-dom'
import { logout } from './../Service'

class TopBar extends React.Component{

    constructor(props){
        super(props)
        let disabled_nav = false;
        this.toggle = this.toggle.bind(this);
        if(this.props.disabled_nav){
            if(this.props.disabled_nav === true){
                disabled_nav = true
            }
        }
        this.state = {
          dropdownOpen: false,
          disabled_nav
        };

        this.onLogout = this.onLogout.bind(this);
        this.onPerfil = this.onPerfil.bind(this);
        this.onConfig = this.onConfig.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
    }

    onLogout(){
        logout((data) =>{
            if(data){
                this.props.history.push('/');
            }
        })
    }

    onPerfil(){
        this.props.history.push('/perfil');
    }

    onConfig(){
        this.props.history.push('/config');
    }

    render(){
        return(
            <div className="top-side">
                    <div className="container">
                        <div className="row top">
                            <div className="col-3">
                                <img className="logo" src={logo} />
                            </div>
                            <div className="col-9">
                                <div className="float-right">
                                <Dropdown isOpen={this.state.dropdownOpen} direction='down' toggle={this.toggle}>
                                    <DropdownToggle className="btn-perfil" tag={'a'} caret={true}>
                                      <i className="icon-user icons" />
                                    </DropdownToggle>
                                    <DropdownMenu className="drop-menu">
                                        <DropdownItem className="drop-item" header>Nome</DropdownItem>
                                        <DropdownItem className="drop-item" onClick={this.onPerfil} ><i className="icon-pencil icons" />Editar Conta</DropdownItem>
                                        <DropdownItem className="drop-item" onClick={this.onConfig} ><i className="icon-settings icons" />Config. Gerais</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem className="drop-item" onClick={this.onLogout} ><i className="icon-logout icons" />Logout</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>

                                </div>
                            </div>
                        </div>
                    </div>
                    {!this.state.disabled_nav && 
                    <div className="shadow-sm">

                        <nav className="navbar navbar-expand-lg navbar-light">
                            <div className="container link-menu">
                                <ul className="navbar-nav">
                                    <li className="nav-item active">
                                        <Link className="nav-link" to="/home"><i className="icon-home icons" />Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/avisos"><i className="icon-exclamation icons"></i>Avisos</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/laboratorios"><i className="icon-screen-desktop icons"></i>Laboratorios</Link>

                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/manutencao"><i className="icon-wrench icons"></i>Manutenção</Link>

                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/disciplina"><i className="icon-book-open icons"></i>Disciplinas</Link>

                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/relatorio"><i className="icon-chart icons"></i>Relatorios</Link>

                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                    }
                </div>
        )
    }

}

export default withRouter(TopBar)