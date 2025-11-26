// src/StartPage.jsx - 名称与样式修正
import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WaveScene from './WaveScene'; 

const StartPage = () => {
    const navigate = useNavigate();

    const buttonStyle = {
        background: 'rgba(0, 0, 0, 0.35)',
        color: 'white',
        border: '1px solid white',
        padding: '15px 40px',
        fontSize: '1rem',
        fontFamily: 'Space Grotesk, sans-serif',
        letterSpacing: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        textTransform: 'uppercase',
        marginTop: '40px',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        pointerEvents: 'auto',
        boxShadow: '0 0 12px rgba(255,255,255,0.25)'
    };

    const handleStart = () => {
        navigate('/main');
    };

    return (
        <Motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="starry-sky"
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden'
            }}
        >
            <WaveScene />

            <div 
                style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#fff',
                    pointerEvents: 'none',
                    padding: '0 1.5rem'
                }}
            >
                <div style={{ maxWidth: 600 }}>
                    <h1 
                        style={{ 
                            fontSize: '3rem',
                            letterSpacing: '12px',
                            fontWeight: 400,
                            margin: 0
                        }}
                    >
                        JULIE LUAN
                    </h1>
                    <p 
                        style={{ 
                            marginTop: '1rem',
                            fontSize: '1rem',
                            letterSpacing: '4px',
                            color: '#bbb'
                        }}
                    >
                        MY UNIVERSE
                    </p>
                </div>

                <button 
                    onClick={handleStart}
                    style={buttonStyle}
                >
                    ENTER ORBIT
                </button>
            </div>
        </Motion.div>
    );
};

export default StartPage;