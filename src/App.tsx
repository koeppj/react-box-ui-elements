import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, CssBaseline } from '@mui/material';
import { Dashboard, Folder, Group, Assessment, AccountCircle } from '@mui/icons-material';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <img src={logo} className="App-logo" alt="logo" />
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              My Application
            </Typography>
            <AccountCircle />
          </Toolbar>
        </AppBar>
        </Box>
    </Router>
  );
}

export default App;
