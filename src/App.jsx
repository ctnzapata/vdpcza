import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<RequireAuth><Layout /></RequireAuth>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/travel" element={<Travel />} />
                    <Route path="/memories" element={<Memories />} />
                    <Route path="/playlist" element={<Playlist />} />
                    <Route path="/gifts" element={<Gifts />} />
                    <Route path="/restaurants" element={<Restaurants />} />
                    <Route path="/bucket-list" element={<BucketList />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
