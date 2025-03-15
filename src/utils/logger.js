/**
 * logger.js - 日志系统
 * 提供不同级别的日志记录功能，支持在控制台输出和保存到本地存储
 */

// 日志级别定义
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// 默认配置
const DEFAULT_CONFIG = {
  level: LOG_LEVELS.INFO,  // 默认日志级别
  useColors: true,         // 在控制台使用颜色
  saveToStorage: false,    // 是否保存到localStorage
  storageKey: 'md_readable_logs', // localStorage的键名
  maxStorageLogs: 100,     // 本地存储最大日志数量
  showTimestamp: true,     // 显示时间戳
  prefix: 'MD-Readable'    // 日志前缀
};

// 当前配置
let currentConfig = { ...DEFAULT_CONFIG };

// 颜色配置
const COLORS = {
  DEBUG: '#7f8c8d', // 灰色
  INFO: '#2ecc71',  // 绿色
  WARN: '#f39c12',  // 橙色
  ERROR: '#e74c3c', // 红色
};

/**
 * 格式化日志消息
 * @param {string} level - 日志级别
 * @param {string} message - 日志消息
 * @param {any[]} args - 额外参数
 * @returns {string} 格式化后的日志消息
 */
function formatLogMessage(level, message, args) {
  let formattedMessage = '';
  
  // 添加时间戳
  if (currentConfig.showTimestamp) {
    const now = new Date();
    formattedMessage += `[${now.toISOString()}] `;
  }
  
  // 添加前缀和级别
  formattedMessage += `[${currentConfig.prefix}] [${level}] `;
  
  // 添加消息
  formattedMessage += message;
  
  return formattedMessage;
}

/**
 * 保存日志到本地存储
 * @param {string} level - 日志级别
 * @param {string} message - 格式化后的日志消息
 */
function saveToStorage(level, message) {
  if (!currentConfig.saveToStorage) return;
  
  try {
    // 获取现有日志
    const storedLogs = JSON.parse(localStorage.getItem(currentConfig.storageKey) || '[]');
    
    // 添加新日志
    storedLogs.push({
      timestamp: new Date().toISOString(),
      level,
      message
    });
    
    // 如果超出最大数量，删除最旧的日志
    while (storedLogs.length > currentConfig.maxStorageLogs) {
      storedLogs.shift();
    }
    
    // 保存回本地存储
    localStorage.setItem(currentConfig.storageKey, JSON.stringify(storedLogs));
  } catch (error) {
    console.error('保存日志到本地存储失败:', error);
  }
}

/**
 * 创建日志函数
 * @param {string} level - 日志级别
 * @returns {Function} 日志函数
 */
function createLoggerFunction(level) {
  const levelValue = LOG_LEVELS[level];
  
  return function(message, ...args) {
    // 检查当前日志级别
    if (levelValue < currentConfig.level) return;
    
    const formattedMessage = formatLogMessage(level, message, args);
    
    // 控制台输出
    if (currentConfig.useColors && console[level.toLowerCase()]) {
      console[level.toLowerCase()](
        `%c${formattedMessage}`,
        `color: ${COLORS[level]}`,
        ...args
      );
    } else {
      console.log(formattedMessage, ...args);
    }
    
    // 保存到本地存储
    saveToStorage(level, message);
  };
}

// 导出日志函数
const logger = {
  debug: createLoggerFunction('DEBUG'),
  info: createLoggerFunction('INFO'),
  warn: createLoggerFunction('WARN'),
  error: createLoggerFunction('ERROR'),
  
  /**
   * 配置日志系统
   * @param {Object} config - 配置对象
   */
  configure: function(config = {}) {
    currentConfig = { ...currentConfig, ...config };
    return this;
  },
  
  /**
   * 获取当前配置
   * @returns {Object} 当前配置
   */
  getConfig: function() {
    return { ...currentConfig };
  },
  
  /**
   * 清除本地存储中的日志
   */
  clearStoredLogs: function() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(currentConfig.storageKey);
    }
  },
  
  /**
   * 获取存储的日志
   * @returns {Array} 存储的日志数组
   */
  getStoredLogs: function() {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem(currentConfig.storageKey) || '[]');
    }
    return [];
  },
  
  // 导出日志级别常量
  levels: LOG_LEVELS
};

export default logger; 