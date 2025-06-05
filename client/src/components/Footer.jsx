import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: '#181510',
                textAlign: 'center',
                position: 'fixed',
                bottom: 0,
                width: '100%',
                borderTop: '2px solid #a08c5b',
                boxShadow: '0px -2px 10px rgba(0,0,0,0.1)'
            }}
        >
            <Typography
                variant="body1"
                sx={{
                    color: '#d4af37',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    '& span': {
                        color: '#e9dbbd'
                    }
                }}
            >
                All rights reserved! <span>{new Date().getFullYear()}</span>
            </Typography>
        </Box>
    );
};

export default Footer; 