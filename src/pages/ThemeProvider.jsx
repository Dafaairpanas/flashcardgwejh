import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const generateRandomTheme = () => {
  const baseHue = Math.floor(Math.random() * 360);
  const offset = (Math.random() * 30 + 30) * (Math.random() > 0.5 ? 1 : -1);
  let secondaryHue = Math.round(baseHue + offset);
  
  if (secondaryHue < 0) secondaryHue += 360;
  if (secondaryHue >= 360) secondaryHue -= 360;

  const s1 = Math.floor(Math.random() * 20) + 80;
  const s2 = Math.floor(Math.random() * 20) + 80;
  const l1 = Math.floor(Math.random() * 10) + 75;
  const l2 = Math.floor(Math.random() * 10) + 75;

  const c1 = `hsl(${baseHue}, ${s1}%, ${l1}%)`;
  const c2 = `hsl(${secondaryHue}, ${s2}%, ${l2}%)`;
  
  const grad = `linear-gradient(135deg, ${c1}, ${c2})`;
  const color = `hsla(${baseHue}, ${s1}%, ${l1}%, 0.5)`;

  return { grad, color, c1, c2 };
};

export default function ThemeProvider({ children }) {
  const [overrideTheme, setOverrideTheme] = useState(null);
  
  useEffect(() => {
    let interval;
    
    const applyTheme = (theme) => {
      document.documentElement.style.setProperty('--theme-c1', theme.c1);
      document.documentElement.style.setProperty('--theme-c2', theme.c2);
      document.documentElement.style.setProperty('--theme-grad', theme.grad);
      document.documentElement.style.setProperty('--theme-glow', theme.color);
    };

    if (overrideTheme) {
      applyTheme(overrideTheme);
    } else {
      // Auto global theme
      applyTheme(generateRandomTheme());
      interval = setInterval(() => {
        applyTheme(generateRandomTheme());
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [overrideTheme]);

  return (
    <ThemeContext.Provider value={{ setOverrideTheme, generateRandomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
