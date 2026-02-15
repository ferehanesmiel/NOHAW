
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch" htmlFor="checkbox">
        <input 
          type="checkbox" 
          id="checkbox" 
          onChange={toggleTheme} 
          checked={theme === 'dark'} 
        />
        <div className="slider round"></div>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
