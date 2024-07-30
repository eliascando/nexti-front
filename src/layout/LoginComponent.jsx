import React, { useContext, useEffect } from 'react';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UserContext } from '../context/UserContext';
import { ApiFetch } from '../services/Api';
import { useNavigate } from 'react-router-dom';

export const LoginComponet = () => {

    const { user, setUser } = useContext(UserContext);
    const Navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);
    const [iniciarSesion, setIniciarSesion] = React.useState(false);
    const [registrarse, setRegistrarse] = React.useState(false);
    const [valRegister, setValRegister] = React.useState(true);

    // Datos para registrarse
    const [nombre, setNombre] = React.useState('');
    const [apellido, setApellido] = React.useState('');
    const [correo, setCorreo] = React.useState('');
    const [clave, setClave] = React.useState('');

    useEffect(()=>{
        if(nombre !== '' && apellido !== '' && correo !== '' && clave !== ''){
            setValRegister(false);
        }else{
            setValRegister(true);
        }
    },[nombre, apellido, correo, clave]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async() => {
        let res = await ApiFetch('login','POST', {
            correo,
            clave
        });

        console.log(res);

        if (res.success === true) {
            console.log('Usuario logueado');
            alert('Usuario logueado');
            setUser(res.data);
            Navigate('/home');
        }
    };

    const handleRegister = async() => {
        
        let res = await ApiFetch('usuario/registro','POST',{
            nombre,
            apellido,
            correo,
            clave
        });

        console.log(res);

        if (res.success === true) {
            console.log('Usuario registrado');
            alert('Usuario registrado');
            setNombre('');
            setApellido('');
            setCorreo('');
            setClave('');
            setRegistrarse(false);
        }
    };

    return (
        <div>
            {
                !registrarse ?
                (
                    <>
                        <h1>Login</h1>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel>Correo</InputLabel>
                            <OutlinedInput
                                type="text"
                                label="Correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                        </FormControl>
                        <br></br>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={clave}
                                onChange={(e) => setClave(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <br></br>
                        <Button
                            variant="contained"
                            disabled={iniciarSesion}
                            onClick={handleLogin}
                        >
                            Iniciar Sesión
                        </Button>
                        <br></br>
                        -o-
                        <br></br>
                        <Button
                            variant="contained"
                            onClick={() => setRegistrarse(true)}
                        >
                            Registrarse
                        </Button>
                    </>
                ) : 
                (
                    <>
                        <h1>Registrarse</h1>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <TextField
                                label="Nombre"
                                variant="outlined"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </FormControl>
                        <br></br>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <TextField
                                label="Apellido"
                                variant="outlined"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                            />
                        </FormControl>
                        <br></br>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <TextField
                                label="Correo"
                                variant="outlined"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                        </FormControl>
                        <br></br>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={clave}
                                onChange={(e) => setClave(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <br></br>
                        <Button
                            variant="contained"
                            disabled={valRegister}
                            onClick={handleRegister}
                        >
                            Registrarse
                        </Button>
                        <br></br>
                        <Button
                            variant="contained"
                            onClick={() => setRegistrarse(false)}
                        >
                            Volver
                        </Button>
                    </>
                )
            }
        </div>
    );
};
