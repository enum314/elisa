//@ts-check

/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#3abeff',
					100: '#33bbff',
					200: '#1fb4ff',
					300: '#0aadff',
					400: '#00a3f5',
					500: '#0096e0',
					600: '#007ab8',
					700: '#006da3',
					800: '#005f8f',
				},
				secondary: {
					DEFAULT: '#2d3142',
					100: '#535A79',
					200: '#4A516D',
					300: '#424861',
					400: '#3A3F55',
					600: '#292D3D',
					700: '#191B24',
					800: '#111218',
					900: '#08090C',
				},
				accent: {
					DEFAULT: '#b8336a',
					100: '#B03066',
					200: '#A02C5C',
					300: '#902753',
					400: '#80234A',
					500: '#701F41',
					600: '#601A37',
					700: '#401225',
					800: '#300D1C',
				},
			},
		},
	},
	plugins: [],
};

module.exports = config;
