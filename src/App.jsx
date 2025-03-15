import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ExportPanel from './components/ExportPanel';
import Header from './components/Header';
import { parseMarkdown } from './core/parser';
import './styles/App.css';

function App() {
  const [markdown, setMarkdown] = useState('# 欢迎使用 MD-Readable\n\n这是一个功能强大的Markdown文档处理工具，支持实时预览、多种格式导出和自定义主题。\n\n## 开始使用\n\n在左侧编辑器中输入Markdown内容，右侧将实时显示预览效果。\n\n### 支持的功能\n\n- **粗体**、*斜体*、~~删除线~~\n- [链接](https://example.com)\n- 图片 ![示例图片](https://via.placeholder.com/150)\n- 代码块\n```javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```\n- 数学公式 $E=mc^2$\n- 表格\n\n| 表头1 | 表头2 |\n| ----- | ----- |\n| 内容1 | 内容2 |\n| 内容3 | 内容4 |');
  const [html, setHtml] = useState('');
  const [theme, setTheme] = useState('default');
  const [showExportPanel, setShowExportPanel] = useState(false);

  useEffect(() => {
    const parsedHtml = parseMarkdown(markdown);
    setHtml(parsedHtml);
  }, [markdown]);

  const handleExport = () => {
    setShowExportPanel(!showExportPanel);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className={`app-container theme-${theme}`}>
      <Header 
        onExport={handleExport} 
        onThemeChange={handleThemeChange}
        currentTheme={theme}
      />
      <main className="main-content">
        <Editor markdown={markdown} onChange={setMarkdown} />
        <Preview html={html} theme={theme} />
      </main>
      {showExportPanel && (
        <ExportPanel 
          markdown={markdown} 
          html={html} 
          onClose={() => setShowExportPanel(false)} 
        />
      )}
    </div>
  );
}

export default App; 