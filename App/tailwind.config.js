module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        garamond: ["EB Garamond", "serif"],
        oswald: ["Oswald", "sans-serif"],
      },
      width: {
        70: "70px",
        100: "100px",
        150: "150px",
        190: "190px",
        225: "225px",
        275: "275px",
        300: "300px",
        320: "320px",
        340: "340px",
        350: "350px",
        375: "375px",
        460: "460px",
        656: "656px",
        880: "880px",
        508: "508px",
      },
      height: {
        80: "80px",
        150: "150px",
        225: "225px",
        300: "300px",
        340: "340px",
        370: "370px",
        420: "420px",
        510: "510px",
        600: "600px",
        650: "650px",
        685: "685px",
        800: "800px",
        "90vh": "90vh",
      },
      minWidth: {
        210: "210px",
        350: "350px",
        620: "620px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        dPurple: "#1D1525",
        amethyst: "#9068BA",
        thistle: "#C8B4DD",
        magnolia: "#F5F1F9",
        seasalt: "#F9F9F9",
        iqRed: "#ED553B",
        iqLightRed: "#F59E8F",
        iqYellow: "#F6B023",
        iqLightYellow: "#FAD589",
        iqGreen: "#3CA277",
        iqLightGreen: "#97D8BD",
        iqBlue: "#20639B",
        iqLightBlue: "#99C6EA"      
      },
      fontSize: {
        header: ["2rem"],
        button: ["1.5rem"],
        body: ["1rem"]
      },
      borderWidth: {
        3: "3px"
      }
    },
  },
  plugins: [
    require("tailwindcss-inner-border")
  ],
};
