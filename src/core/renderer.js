/**
 * 排版渲染引擎
 * 用于将HTML内容按照不同主题进行渲染
 */

// 主题配置
const themes = {
  default: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333',
    backgroundColor: '#fff',
    headingColor: '#222',
    linkColor: '#0366d6',
    codeBackground: '#f6f8fa',
    codeFontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    blockquoteColor: '#6a737d',
    blockquoteBorderColor: '#dfe2e5',
    tableBorderColor: '#dfe2e5',
    maxWidth: '800px'
  },
  dark: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#e6e6e6',
    backgroundColor: '#1e1e1e',
    headingColor: '#fff',
    linkColor: '#58a6ff',
    codeBackground: '#2d2d2d',
    codeFontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    blockquoteColor: '#9e9e9e',
    blockquoteBorderColor: '#444',
    tableBorderColor: '#444',
    maxWidth: '800px'
  },
  paper: {
    fontFamily: '"Merriweather", "Georgia", serif',
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#333',
    backgroundColor: '#fff9f0',
    headingColor: '#222',
    linkColor: '#d35400',
    codeBackground: '#f8f2e9',
    codeFontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    blockquoteColor: '#6a737d',
    blockquoteBorderColor: '#e0d6cc',
    tableBorderColor: '#e0d6cc',
    maxWidth: '700px'
  },
  minimal: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333',
    backgroundColor: '#fff',
    headingColor: '#000',
    linkColor: '#2563eb',
    codeBackground: '#f5f5f5',
    codeFontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    blockquoteColor: '#6a737d',
    blockquoteBorderColor: '#e5e7eb',
    tableBorderColor: '#e5e7eb',
    maxWidth: '650px'
  }
};

/**
 * 生成主题CSS
 * @param {string} themeName - 主题名称
 * @returns {string} 主题CSS
 */
export function generateThemeCSS(themeName = 'default') {
  const theme = themes[themeName] || themes.default;
  
  return `
    .markdown-body {
      font-family: ${theme.fontFamily};
      font-size: ${theme.fontSize};
      line-height: ${theme.lineHeight};
      color: ${theme.color};
      background-color: ${theme.backgroundColor};
      max-width: ${theme.maxWidth};
      margin: 0 auto;
      padding: 2rem;
    }
    
    .markdown-body h1, 
    .markdown-body h2, 
    .markdown-body h3, 
    .markdown-body h4, 
    .markdown-body h5, 
    .markdown-body h6 {
      color: ${theme.headingColor};
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    
    .markdown-body h1 {
      font-size: 2em;
      border-bottom: 1px solid ${theme.tableBorderColor};
      padding-bottom: 0.3em;
    }
    
    .markdown-body h2 {
      font-size: 1.5em;
      border-bottom: 1px solid ${theme.tableBorderColor};
      padding-bottom: 0.3em;
    }
    
    .markdown-body h3 {
      font-size: 1.25em;
    }
    
    .markdown-body h4 {
      font-size: 1em;
    }
    
    .markdown-body h5 {
      font-size: 0.875em;
    }
    
    .markdown-body h6 {
      font-size: 0.85em;
      color: ${theme.blockquoteColor};
    }
    
    .markdown-body a {
      color: ${theme.linkColor};
      text-decoration: none;
    }
    
    .markdown-body a:hover {
      text-decoration: underline;
    }
    
    .markdown-body code {
      font-family: ${theme.codeFontFamily};
      background-color: ${theme.codeBackground};
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.85em;
    }
    
    .markdown-body pre {
      background-color: ${theme.codeBackground};
      border-radius: 3px;
      padding: 1em;
      overflow: auto;
    }
    
    .markdown-body pre code {
      background-color: transparent;
      padding: 0;
      font-size: 0.85em;
      white-space: pre;
    }
    
    .markdown-body blockquote {
      color: ${theme.blockquoteColor};
      border-left: 4px solid ${theme.blockquoteBorderColor};
      margin: 0;
      padding: 0 1em;
    }
    
    .markdown-body table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    
    .markdown-body table th,
    .markdown-body table td {
      border: 1px solid ${theme.tableBorderColor};
      padding: 0.5em 1em;
    }
    
    .markdown-body table th {
      background-color: ${theme.codeBackground};
    }
    
    .markdown-body img {
      max-width: 100%;
      height: auto;
    }
    
    .markdown-body hr {
      height: 1px;
      background-color: ${theme.tableBorderColor};
      border: none;
      margin: 2em 0;
    }
    
    .markdown-body ul,
    .markdown-body ol {
      padding-left: 2em;
    }
    
    .markdown-body li + li {
      margin-top: 0.25em;
    }
    
    .markdown-body .math-block {
      overflow-x: auto;
      margin: 1em 0;
    }
  `;
}

/**
 * 获取可用的主题列表
 * @returns {Array} 主题名称数组
 */
export function getAvailableThemes() {
  return Object.keys(themes);
}

/**
 * 应用主题到HTML内容
 * @param {string} html - HTML内容
 * @param {string} themeName - 主题名称
 * @returns {string} 应用主题后的HTML
 */
export function applyTheme(html, themeName = 'default') {
  const themeCSS = generateThemeCSS(themeName);
  
  return `
    <style>
      ${themeCSS}
    </style>
    <div class="markdown-body">
      ${html}
    </div>
  `;
}

export default {
  applyTheme,
  generateThemeCSS,
  getAvailableThemes
}; 