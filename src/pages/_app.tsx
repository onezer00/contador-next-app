import type { AppProps } from 'next/app';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import '../styles/globals.css';

const GlobalStyle = createGlobalStyle`
  /* Adicione estilos globais customizados aqui, se necessário */
`;

const theme = {
  colors: {
    primary: '#0070f3',
  },
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
} 