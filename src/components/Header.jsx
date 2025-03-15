import React from 'react';
import { getAvailableThemes } from '../core/renderer';
import '../styles/Header.css';

/**
 * 头部组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onExport - 导出按钮点击回调
 * @param {Function} props.onThemeChange - 主题变更回调
 * @param {string} props.currentTheme - 当前主题
 * @param {Function} props.onShowLogs - 显示日志按钮点击回调
 */
function Header({ onExport, onThemeChange, currentTheme, onShowLogs }) {
  const themes = getAvailableThemes();
  
  // 处理主题变更
  const handleThemeChange = (e) => {
    onThemeChange(e.target.value);
  };
  
  return (
    <header className="app-header">
      <div className="logo">
        <h1>MD-Readable</h1>
        <span className="version">v0.1.0</span>
      </div>
      
      <div className="header-controls">
        <div className="theme-selector">
          <label htmlFor="theme-select">主题:</label>
          <select 
            id="theme-select" 
            value={currentTheme} 
            onChange={handleThemeChange}
          >
            {themes.map(theme => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <button className="export-button" onClick={onExport}>
          导出
        </button>
        
        {onShowLogs && (
          <button 
            className="logs-button" 
            onClick={onShowLogs}
            title="查看日志"
          >
            日志
          </button>
        )}
      </div>
    </header>
  );
}

export default Header; 