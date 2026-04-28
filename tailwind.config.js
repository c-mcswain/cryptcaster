/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
			display: ['Cinzel', 'serif'],
  			mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
        creepy: ['Almendra', 'serif'],
        pixel: ['VT323', 'monospace'],
        gothic: ['Cinzel', 'serif']
  		},
  		colors: {
        'blood-red': '#4A0404',
        'nocturnal-purple': '#12001F',
        'crypt-purple': '#1A002E',
        'slime-green': '#32CD32',
        'phantom-pink': '#D4145A',
        'hot-pink': '#D4145A',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			ring: 'hsl(var(--ring))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  		},
  		boxShadow: {
  			retro: '3px 3px 0px 0px rgba(50, 205, 50, 0.8)',
        'retro-pink': '3px 3px 0px 0px rgba(212, 20, 90, 0.8)',
        'retro-lg': '6px 6px 0px 0px rgba(50, 205, 50, 0.6)',
  		},
  		keyframes: {
  			'blink': {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0' }
  			},
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 5px rgba(50, 205, 50, 0.5))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 15px rgba(50, 205, 50, 0.2))' }
        },
        'mist-flow': {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(10%)' }
        }
  		},
  		animation: {
  			'blink': 'blink 1.5s step-end infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'mist': 'mist-flow 20s ease-in-out infinite alternate',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")]
}