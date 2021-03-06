import React, { Component } from 'react';
import Producto from './../Producto/Producto';
import Buscador from './../Buscador/Buscador';
import Navegacion from './../Navegacion/Navegacion';
import './Productos.css';

import axios from 'axios';

class Productos extends Component {

    state = {
        productos: [],   
        terminoBusqueda: '',
    } 

    componentWillMount() {
        console.log('Antes: accessToken');
        console.log('accessToken: ' + this.props.auth.accessToken);
        // console.log('Auth: '); 
        // console.log(this.props.auth);
        // this.props.auth.logout();
        console.log('-------------');
        this.queryAPI(); 
        console.log('-------------');
        console.log('Después: accessToken');
        console.log('accessToken: ' + this.props.auth.accessToken);
        let estado = this.props.auth.isAuthenticated();
        console.log('Estado: ' + estado);
        console.log('Productos: ' + this.props.auth.isAuthenticated());
    }

    queryAPI = () => {
        // console.log(this.props.auth.isAuthenticated());
        // console.log(this.props.auth.getAccessToken());
        const { getAccessToken } = this.props.auth;

        const headers = { 'Authorization': `Bearer ${getAccessToken()}`};

        const url = 'http://localhost:5000/productos';

        return axios.get(url, {headers})
            .then(respuesta => this.setState({productos: respuesta.data}));
    }

    busquedaProducto = (busqueda) => {
        // console.log(busqueda);
        if(busqueda.length > 3) {

            // Obtener copia del state
            let productos = [...this.state.productos];
            //console.log(productos);

            // Filtrar
            let resultado;
            resultado = productos.filter(producto => (
                producto.nombre.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1 
            ))
           // console.log(resultado);

            // Enviar al state los productos filtrados y la búsqueda
            this.setState({
                terminoBusqueda: busqueda,
                productos: resultado
            })

            // console.log(this.state.terminoBusqueda);
        } else {
            this.setState({
                terminoBusqueda: '',
            }, () => {
                this.queryAPI();
            })
        }
    }

    login = () => {
        this.props.auth.login(); 
    }

    render() {

        const { isAuthenticated } = this.props.auth;

        return(
            <div className="productos">
                
                {
                    isAuthenticated() && (
                        <React.Fragment>
                            <h2>Nuestros Productos</h2>
                            { /* Componente: Buscador */ }
                            <Buscador
                                        busqueda={this.busquedaProducto}
                            ></Buscador>
                            <ul className="lista-productos">
                                {Object.keys(this.state.productos).map(producto => (
                                    <Producto
                                                informacion={this.state.productos[producto]}
                                                key={producto}
                                    ></Producto>
                                ))}
                            </ul>
                        </React.Fragment>
                    )
                }
                
                {
                    !isAuthenticated() && (
                        <div className="contenedor-boton">
                            <p>Para ver el contenido debes estar logueado: </p>
                            <a className="boton" onClick={this.login}>Iniciar Sesión</a>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default Productos;
