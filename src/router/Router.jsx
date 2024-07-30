import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginComponet } from '../layout/LoginComponent';
import { HomeComponent } from '../components/HomeComponent';
import { PublicRoute } from './guards/PublicRoute';
import { ProtectedRoute } from './guards/ProtectedRoute';

export const Router = () => {
    return (
        <div className='main'>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to='/login' />} />
                    <Route path='/login' element={<PublicRoute><LoginComponet /></PublicRoute>} />
                    <Route path='/home' element={<ProtectedRoute><HomeComponent /></ProtectedRoute>} />
                    <Route path='*' element={<h1>404</h1>} />
                </Routes>
            </BrowserRouter>
        </div>
    )
};
