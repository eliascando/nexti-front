import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Box
} from '@mui/material';
import { ApiFetch } from '../services/Api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { format, parseISO } from 'date-fns';
import { Navigate } from 'react-router-dom';

export const HomeComponent = () => {
  const { user, setUser } = useContext(UserContext);

  const [eventos, setEventos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventoId, setCurrentEventoId] = useState(null);
  const [newEvento, setNewEvento] = useState({
    fechaEvento: '',
    lugar: '',
    descripcion: '',
    precio: 0,
    usuarioRegistro: user.id,
  });

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      let res = await ApiFetch('evento/all', 'GET');
      if (res && res.success) {
        setEventos(res.data);
      } else {
        console.error('Error fetching eventos:', res);
      }
    } catch (error) {
      console.error('Error fetching eventos:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = () => {
    setIsEditing(false);
    setNewEvento({
      fechaEvento: '',
      lugar: '',
      descripcion: '',
      precio: 0,
      usuarioRegistro: user.id,
    });
    setOpen(true);
  };

  const handleEditOpen = (evento) => {
    setIsEditing(true);
    setCurrentEventoId(evento.id);
    setNewEvento({
      fechaEvento: evento.fechaEvento.split('T')[0],
      lugar: evento.lugar,
      descripcion: evento.descripcion,
      precio: evento.precio,
      usuarioRegistro: evento.usuarioRegistro,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvento({
      ...newEvento,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await ApiFetch(`evento/actualizar/${currentEventoId}`, 'PUT', {
          ...newEvento,
          fechaEvento: new Date(newEvento.fechaEvento).toISOString(),
          usuarioModifica: user.id,
        });
      } else {
        await ApiFetch('evento/nuevo', 'POST', {
          ...newEvento,
          fechaEvento: new Date(newEvento.fechaEvento).toISOString(),
        });
      }
      fetchEventos();
      setOpen(false);
    } catch (error) {
      console.error('Error saving evento:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ApiFetch(`evento/${id}/${user.id}`, 'DELETE');
      fetchEventos();
    } catch (error) {
      console.error('Error deleting evento:', error);
    }
  };

  const handleSearch = async (id) => {
    try {
      let res = await ApiFetch(`evento/id/${id}`, 'GET');
      if (res && res.success) {
        setEventos([res.data]);
      } else {
        console.error('Error fetching evento:', res);
      }
    } catch (error) {
      console.error('Error fetching evento:', error);
    }
  };

  const formatDate = (date) => {
    return format(parseISO(date), 'dd/MM/yyyy');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    Navigate('/login');
    window.location.reload();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Bienvenido, {user.nombre} {user.apellido}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box mt={2} mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Button
            onClick={handleClickOpen}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Agregar Evento
          </Button>
          <TextField
            label="Buscar Evento por ID"
            type="number"
            onBlur={(e) => handleSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              )
            }}
            style={{ width: '250px' }}
          />
        </Box>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha del Evento</TableCell>
                  <TableCell>Lugar</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Fecha de Registro</TableCell>
                  <TableCell>Usuario de Registro</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((evento) => (
                  <TableRow key={evento.id}>
                    <TableCell>{evento.id}</TableCell>
                    <TableCell>{formatDate(evento.fechaEvento)}</TableCell>
                    <TableCell>{evento.lugar}</TableCell>
                    <TableCell>{evento.descripcion}</TableCell>
                    <TableCell>{formatCurrency(evento.precio)}</TableCell>
                    <TableCell>{formatDate(evento.fechaRegistro)}</TableCell>
                    <TableCell>{evento.usuarioRegistro}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditOpen(evento)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleDelete(evento.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={eventos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Editar Evento' : 'Agregar Nuevo Evento'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="fechaEvento"
            label="Fecha del Evento"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={newEvento.fechaEvento}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="lugar"
            label="Lugar"
            type="text"
            fullWidth
            value={newEvento.lugar}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="descripcion"
            label="Descripción"
            type="text"
            fullWidth
            value={newEvento.descripcion}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="precio"
            label="Precio"
            type="number"
            fullWidth
            value={newEvento.precio}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? 'Guardar Cambios' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Box mt={2} mb={2} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          &copy; {new Date().getFullYear()} NextiPrueba - Elías Cando
        </Typography>
      </Box>
    </>
  );
};
