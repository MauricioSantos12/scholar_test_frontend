import { extendTheme } from '@chakra-ui/react';
import '@fontsource-variable/sora';
import '@fontsource/inter';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#eaf4ff',
      100: '#d4e9fe',
      200: '#a8d3fd',
      300: '#7bbdfb',
      400: '#4fa7f8',
      500: '#3d99f5',
      600: '#2f7cd0',
      700: '#2563a5',
      800: '#1c4b7a',
      900: 'hsl(210 90% 60% / .1)',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#dee6ed',
      600: '#64748b',
      700: '#475569',
      800: '#334155',
      900: '#1e293b',
    },
    dark_text: '#344256',
    text: '#65758b',
  },
  fonts: {
    heading: `'Sora Variable', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  components: {
    Button: {
      variants: {
        solid: {
          minH: 14,
          bg: 'primary.500',
          color: 'white',
          transition: 'all 0.4s ease-in-out',
          _hover: {
            bg: 'primary.600',
          },
        },
        selectedAnswer: {
          minH: 14,
          bg: 'primary.300',
          color: 'white',
          transition: 'all 0.4s ease-in-out',
          _hover: {
            bg: 'primary.600',
          },
        },
        white: {
          minH: 14,
          bg: 'white',
          color: 'text',
          transition: 'all 0.4s ease-in-out',
          _hover: {
            bg: 'primary.500',
            color: 'white',
          },
        },
        gray: {
          minH: 14,
          bg: '#f8fafc',
          border: '1px solid',
          borderColor: '#e2e8f0',
          color: 'text',
          transition: 'all 0.4s ease-in-out',
          _hover: {
            bg: 'primary.500',
            color: 'white',
          },
        },
        green: {
          minH: 14,
          bg: 'green.500',
          color: 'white',
          transition: 'all 0.4s ease-in-out',
          _hover: {
            bg: 'green.600',
          },
        },
        red: {
          minH: 14,
          bg: 'red.500',
          color: 'white',
          transition: 'all 0.4s ease-in-out',
          _hover: {
            bg: 'red.600',
          },
        },
        darkGray: {
          minH: 14,
          bg: 'secondary.500',
          color: 'secondary.800',
          transition: 'all 0.4s ease-in-out',
          _hover: {
            color: 'white',
            bg: 'secondary.600',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'secondary.100',
        color: 'text',
      },
      h1: {
        color: 'primary.600',
      },
    },
  },
});

export default theme;
