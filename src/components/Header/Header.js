import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    return (
        <header className="header">
            <div className="logo">
                <div className="logo1">Car</div>
                <div className="logo2">|</div>
                <div className="logo3">Now</div>
            </div>

            <div className="spacer">
                <nav className="nav">
                    <Link to="/home">Home</Link>
                    <Link to="/veiculos">Meus veículos</Link>
                    <Link to="/perfil">Perfil</Link>
                </nav>

                <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={query}
                    onChange={handleChange}
                    className="search-input"
                />
            </div>
        </header>
    );
}

export default Header;
