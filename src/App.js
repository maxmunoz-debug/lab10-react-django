import React, { Component } from 'react';
import './App.css';

// Componentes de Material-UI
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Stack
} from '@mui/material';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      recuperado: false,
      // Campos del formulario para nuevos productos
      codigo: '',
      descripcion: '',
      precio: ''
    };
  }

  componentWillMount() {
    this.cargarProductos();
  }

  // Método para obtener los productos de la API de Django
  cargarProductos = () => {
    fetch('http://localhost:8000/api/producto/')
      .then((response) => response.json())
      .then((prod) => {
        this.setState({
          productos: prod,
          recuperado: true
        });
      })
      .catch((error) => console.error('Error al cargar productos:', error));
  };

  // Manejador de cambio en los inputs del formulario
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // Manejador para enviar el nuevo producto a Django mediante POST
  handleSubmit = (e) => {
    e.preventDefault();
    const { codigo, descripcion, precio } = this.state;

    // Validación simple
    if (!codigo || !descripcion || !precio) {
      alert('Por favor complete todos los campos.');
      return;
    }

    const nuevoProducto = {
      codigo: parseInt(codigo),
      descripcion: descripcion,
      precio: parseFloat(precio)
    };

    // Envío del nuevo producto al servidor Django
    fetch('http://localhost:8000/api/producto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoProducto)
    })
      .then((response) => response.json())
      .then((prodCreado) => {
        // Añade el producto a la lista local y limpia el formulario
        this.setState((prevState) => ({
          productos: [...prevState.productos, prodCreado],
          codigo: '',
          descripcion: '',
          precio: ''
        }));
      })
      .catch((error) => console.error('Error al guardar producto:', error));
  };

  // Renderiza la tabla y formulario con Material-UI
  mostrarTabla() {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Gestión de Productos (Laboratorio 10)
        </Typography>

        {/* Formulario para agregar nuevos datos con Material-UI */}
        <Card sx={{ mb: 4, p: 1, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              Agregar Nuevo Producto
            </Typography>
            <Box component="form" onSubmit={this.handleSubmit}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField
                  label="Código"
                  name="codigo"
                  type="number"
                  value={this.state.codigo}
                  onChange={this.handleChange}
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                />
                <TextField
                  label="Descripción"
                  name="descripcion"
                  value={this.state.descripcion}
                  onChange={this.handleChange}
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                />
                <TextField
                  label="Precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  value={this.state.precio}
                  onChange={this.handleChange}
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                />
              </Stack>
              <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                Guardar Producto
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Tabla con diseño Material-UI */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
          Lista de Productos
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio (S/)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.productos.map((prod) => (
                <TableRow key={prod.codigo} hover>
                  <TableCell>{prod.codigo}</TableCell>
                  <TableCell>{prod.descripcion}</TableCell>
                  <TableCell>S/ {parseFloat(prod.precio).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }

  render() {
    if (this.state.recuperado) {
      return this.mostrarTabla();
    } else {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Recuperando datos...
          </Typography>
        </Box>
      );
    }
  }
}

export default App;