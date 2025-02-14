import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <Container maxWidth='md'>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        height='100vh'
        textAlign='center'
      >
        <Typography variant='h1' color='primary' fontWeight='bold'>
          404
        </Typography>
        <Typography variant='h5' color='textSecondary' mt={2} mb={4}>
          Упс! Страница не найдена.
        </Typography>
        <Button variant='contained' color='primary' component={Link} to='/'>
          На главную
        </Button>
      </Box>
    </Container>
  );
};
