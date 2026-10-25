import '@mantine/core/styles.css';
import './shared/styles/admin.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from './router';
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      theme={{
        primaryColor: 'teal',
        defaultRadius: 'md',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      }}
    >
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
);
