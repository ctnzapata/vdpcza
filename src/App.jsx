import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import RequireAuth from './components/Auth/RequireAuth';
import Dashboard from './components/Dashboard/Dashboard';
import Travel from './components/Travel/Travel';
import Memories from './components/Memories/Memories';
import Playlist from './components/Playlist/Playlist';
import Gifts from './components/Gifts/Gifts';
import Restaurants from './components/Restaurants/Restaurants';
import BucketList from './components/BucketList/BucketList';
import Profile from './components/Auth/Profile';

const RequireAdmin = ({ children }) => {
    const { user } = useAuth();
    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<RequireAuth><Layout /></RequireAuth>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/travel" element={<RequireAdmin><Travel /></RequireAdmin>} />
                    <Route path="/memories" element={<RequireAdmin><Memories /></RequireAdmin>} />
                    <Route path="/playlist" element={<Playlist />} />
                    <Route path="/gifts" element={<Gifts />} />
                    <Route path="/restaurants" element={<Restaurants />} />
                    <Route path="/bucket-list" element={<BucketList />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
