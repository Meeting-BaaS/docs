module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      // Add screens config to support 2xl
      content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './content/**/*.{md,mdx}',
      ],
      theme: {
        extend: {
          screens: {
            '2xl': '1536px',
          },
        },
      },
      // Enable arbitrary values
      future: {
        hoverOnlyWhenSupported: true,
      },
    },
  },
};
