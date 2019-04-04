import React, { Component } from "react";

import SimpleStorage, { clearStorage } from "react-simple-storage";

// import api from "../../services/api";
import "./styles.css";

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codigo: "",
      cep: "",
      endereco: "",
      numero: 0,
      loec: [],
      busca: "",
      busca_res: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  /* handleSearchInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  } */

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.cep !== "") {
      this.loadAddress()
        .then(res => {
          this.setState({ endereco: res.ENDERECO });
          this.addItem();
        })
        .catch(err => console.log(err));
    }
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    if (this.state.busca !== "") {
      this.searchAddress()
        .then(res => {
          
          var _resUnique = [...new Set(res)];
          this.setState({ busca_res: _resUnique });
        })
        .catch(err => console.log(err));
    }
  }

  removeItem = () => {
    this.setState(state => {
      const loec = state.loec.filter(item => {
        return item.codigo !== state.codigo;
      });
      return {
        loec
      };
    });
  };

  addItem = () => {
    var duplicado = false;
    this.state.loec.map(item => {
      if (this.state.codigo === item.codigo) {
        duplicado = true;
        return duplicado;
      }
      return duplicado;
    });

    if (duplicado) {
      var confirma = window.confirm("Objeto já informado. Excluir?");
      if (confirma) {
        this.removeItem();
        window.alert("Objeto excluído");
      }
    } else {
      this.setState(state => {
        const loec = [
          ...state.loec,
          {
            codigo: state.codigo,
            cep: state.cep,
            endereco: state.endereco,
            numero: state.numero
          }
        ];

        return {
          loec,
          codigo: "",
          cep: "",
          endereco: "",
          numero: 0
        };
      });
    }
  };

  onRemoveItem = i => {
    this.setState(state => {
      const loec = state.loec.filter((item, j) => i !== j);
      return {
        loec
      };
    });
  };

  loadAddress = async () => {
    const response = await fetch(
      `/address/${encodeURIComponent(this.state.cep)}`
    );
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  searchAddress = async () => {
    console.log(`/search/${encodeURIComponent(this.state.busca)}`);
    const response = await fetch(
      `/search/${encodeURIComponent(this.state.busca)}`
    );
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  render() {
    return (
      <div className="Main">
        {/* <SimpleStorage parent={this} prefix={"Main"} /> */}
        <form
          onSubmit={this.handleSubmit}
          className="form-row align-items-center"
        >
          <div className="col-auto">
            <input
              type="text"
              name="codigo"
              className="form-control mb-2"
              placeholder="Código do objeto"
              value={this.state.codigo}
              onChange={this.handleInputChange}
              autoFocus
            />
          </div>

          <div className="col-auto">
            <input
              type="text"
              name="cep"
              className="form-control mb-2"
              placeholder="CEP"
              value={this.state.cep}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="col-auto">
            <input
              type="number"
              name="numero"
              className="form-control mb-2"
              value={this.state.numero}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              Incluir
            </button>
          </div>
          <div className="col-auto">
            <button className="btn btn-success">Imprimir</button>
          </div>
        </form>

        <form
          onSubmit={this.handleSearchSubmit}
          className="form-row align-items-center"
        >
          <div className="col-auto">
            <input
              type="text"
              name="busca"
              className="form-control mb-2"
              placeholder="Busca por endereço"
              value={this.state.busca}
              onChange={this.handleInputChange}
              autoFocus
            />
          </div>

          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </div>
        </form>
        {/* <div className="col-auto">
            <button className="btn btn-primary" onClick={() => clearStorage("Main")}>
              Limpar ALL_STORAGE
            </button>
          </div> */}
        <ol className="list-group">
          {this.state.busca_res.map((item, index) => (
            <li key={item.CEP} className="list-group-item">
              CEP:{item.CEP} -> {item.ENDERECO},
            </li>
          ))}
        </ol>

        <hr />
        <ol className="list-group">
          {this.state.loec.map((item, index) => (
            <li key={item.codigo} className="list-group-item">
              <p className="barcode">*{item.codigo}*</p>
              {item.endereco}, {item.numero} - CEP:{item.cep}
              {/* <button className="btn btn-danger" onClick={() => this.onRemoveItem(index)}>Excluir</button> */}
            </li>
          ))}
        </ol>
      </div>
    );
  }
}
