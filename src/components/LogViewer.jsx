import React, { useState, useEffect } from 'react';
import logger from '../utils/logger';
import '../styles/LogViewer.css';

/**
 * 日志查看器组件
 * 用于显示和管理应用日志
 */
const LogViewer = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 获取日志
  const fetchLogs = () => {
    // 从localStorage获取日志
    const storedLogs = logger.getStoredLogs();
    setLogs(storedLogs);
  };

  // 初始加载和自动刷新
  useEffect(() => {
    fetchLogs();
    
    let intervalId;
    if (autoRefresh && isOpen) {
      intervalId = setInterval(fetchLogs, 2000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, isOpen]);

  // 清除日志
  const handleClearLogs = () => {
    if (window.confirm('确定要清除所有日志吗？')) {
      logger.clearStoredLogs();
      setLogs([]);
    }
  };

  // 导出日志
  const handleExportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] [${log.level}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `md-readable-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 过滤日志
  const filteredLogs = logs.filter(log => {
    // 按级别过滤
    if (filter !== 'ALL' && log.level !== filter) {
      return false;
    }
    
    // 按搜索词过滤
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // 如果组件未打开，不渲染内容
  if (!isOpen) return null;

  return (
    <div className="log-viewer-overlay">
      <div className="log-viewer-container">
        <div className="log-viewer-header">
          <h2>日志查看器</h2>
          <div className="log-viewer-controls">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="log-filter"
            >
              <option value="ALL">所有级别</option>
              <option value="DEBUG">调试 (DEBUG)</option>
              <option value="INFO">信息 (INFO)</option>
              <option value="WARN">警告 (WARN)</option>
              <option value="ERROR">错误 (ERROR)</option>
            </select>
            
            <input 
              type="text" 
              placeholder="搜索日志..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="log-search"
            />
            
            <label className="auto-refresh-label">
              <input 
                type="checkbox" 
                checked={autoRefresh} 
                onChange={(e) => setAutoRefresh(e.target.checked)} 
              />
              自动刷新
            </label>
            
            <button onClick={fetchLogs} className="refresh-btn">刷新</button>
            <button onClick={handleExportLogs} className="export-btn">导出</button>
            <button onClick={handleClearLogs} className="clear-btn">清除</button>
            <button onClick={onClose} className="close-btn">关闭</button>
          </div>
        </div>
        
        <div className="log-viewer-content">
          {filteredLogs.length === 0 ? (
            <div className="no-logs">没有符合条件的日志</div>
          ) : (
            <table className="log-table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>级别</th>
                  <th>消息</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={index} className={`log-level-${log.level.toLowerCase()}`}>
                    <td className="log-timestamp">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="log-level">{log.level}</td>
                    <td className="log-message">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="log-viewer-footer">
          共 {filteredLogs.length} 条日志 (总计 {logs.length} 条)
        </div>
      </div>
    </div>
  );
};

export default LogViewer; 