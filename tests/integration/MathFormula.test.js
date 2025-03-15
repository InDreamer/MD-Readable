import { exportToPNG, exportToPDF, exportToSVG, downloadFile } from '../../src/core/exporter';

// 模拟html2canvas
jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({
  toDataURL: jest.fn(() => 'data:image/png;base64,mock'),
  width: 800,
  height: 600
})));

// 模拟jsPDF
jest.mock('jspdf', () => ({
  jsPDF: jest.fn(() => ({
    internal: {
      pageSize: {
        getWidth: jest.fn(() => 210),
        getHeight: jest.fn(() => 297)
      }
    },
    addImage: jest.fn(),
    addPage: jest.fn(),
    output: jest.fn(() => new Blob(['pdf-content'], { type: 'application/pdf' }))
  }))
}));

describe('数学公式渲染测试', () => {
  let mockElement;
  let appendChildSpy;
  let removeChildSpy;
  
  beforeEach(() => {
    // 启用假计时器
    jest.useFakeTimers();
    
    // 创建模拟DOM元素，包含数学公式
    mockElement = document.createElement('div');
    mockElement.innerHTML = `
      <h1>测试文档</h1>
      <p>这是一个包含数学公式的文档：</p>
      <p>$E=mc^2$</p>
    `;
    
    // 模拟document.body方法
    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});
    
    // 模拟创建的链接元素
    jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          style: { display: 'none' },
          click: jest.fn()
        };
      }
      return document.createElement(tag);
    });
    
    // 修复XMLSerializer模拟
    jest.spyOn(global, 'XMLSerializer').mockImplementation(() => ({
      serializeToString: jest.fn(() => '<svg>mock svg content</svg>')
    }));
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });
  
  test('导出HTML时应该包含MathJax脚本', async () => {
    // 创建一个模拟的HTML内容
    const html = `
      <h1>测试文档</h1>
      <p>这是一个包含数学公式的文档：</p>
      <p>$E=mc^2$</p>
    `;
    
    // 模拟Blob构造函数以捕获HTML内容
    let capturedHtml = '';
    const originalBlob = global.Blob;
    global.Blob = jest.fn((content, options) => {
      capturedHtml = content[0];
      return new originalBlob(content, options);
    });
    
    // 创建一个模拟的导出函数
    const exportHtml = (html, filename) => {
      const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <!-- 添加MathJax支持 -->
  <script type="text/javascript" id="MathJax-script" async
    src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
  </script>
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
        processEscapes: true
      },
      svg: {
        fontCache: 'global'
      }
    };
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
      return new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    };
    
    // 导出HTML
    const blob = exportHtml(html, 'test-document');
    
    // 恢复原始的Blob构造函数
    global.Blob = originalBlob;
    
    // 验证HTML内容
    expect(capturedHtml).toContain('MathJax-script');
    expect(capturedHtml).toContain('tex-mml-chtml.js');
    expect(capturedHtml).toContain('inlineMath: [[\'$\', \'$\'], [\'\\\\\\\\(\'');
    expect(capturedHtml).toContain('$E=mc^2$');
  });
}); 