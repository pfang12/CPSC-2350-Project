module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        garamound: ["EB Garamond", "serif"],
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
      // all the shades and fonts are here
      //  shades- #9b77c1,#a686c8, #bca4d6, #c8b4dd,#d3c3e3,#ded2ea,#e9e1f1
      // tints-#825ea7,#735395,#654982,#563e70,#3a2a4a,#1d1525

      colors: {
        font: "#262731",
        fontShade1: "#51525a",
        primary: "#9068ba",
        primaryShade1: "#a686c8",
        primaryShade2: "#c8b4dd",
        primaryShade3: "#ded2ea",
        primaryShade4: "#e9e1f1",
        primaryTint1: "#3a2a4a",
        dPurple: "#1D1525",
        amethyst: "#9068BA",
        thistle: "#C8B4DD",
        magnolia: "#F5F1F9",
        seasalt: "#F9F9F9",
        iqRed: "#ED553B",
        iqRedHalf: "#F59E8F",
        iqYellow: "#F6B023",
        iqYellowHalf: "#FAD589",
        iqGreen: "#3CA277",
        iqGreenHalf: "#97D8BD",
        iqBlue: "#20639B",
        iqBlueHalf: "#99C6EA"      
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
