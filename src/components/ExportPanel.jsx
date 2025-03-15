import React, { useState, useRef } from 'react';
import { exportToPNG, exportToPDF, exportToSVG, downloadFile } from '../core/exporter';
import '../styles/ExportPanel.css';

/**
 * 导出面板组件
 * @param {Object} props - 组件属性
 * @param {string} props.markdown - Markdown文本内容
 * @param {string} props.html - 解析后的HTML内容
 * @param {Function} props.onClose - 关闭面板回调函数
 */
function ExportPanel({ markdown, html, onClose }) {
  const [format, setFormat] = useState('pdf');
  const [filename, setFilename] = useState('document');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const previewRef = useRef(null);
  
  // 处理格式变更
  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };
  
  // 处理文件名变更
  const handleFilenameChange = (e) => {
    setFilename(e.target.value);
  };
  
  // 处理导出操作
  const handleExport = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    setExportError('');
    
    try {
      let data;
      let fullFilename = filename;
      
      switch (format) {
        case 'png':
          data = await exportToPNG(previewRef.current);
          fullFilename = `${filename}.png`;
          break;
        case 'pdf':
          data = await exportToPDF(previewRef.current);
          fullFilename = `${filename}.pdf`;
          break;
        case 'svg':
          data = await exportToSVG(previewRef.current);
          fullFilename = `${filename}.svg`;
          break;
        case 'md':
          data = `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;
          fullFilename = `${filename}.md`;
          break;
        case 'html':
          data = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
          fullFilename = `${filename}.html`;
          break;
        default:
          throw new Error('不支持的导出格式');
      }
      
      downloadFile(data, fullFilename);
    } catch (error) {
      console.error('导出失败:', error);
      setExportError(`导出失败: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="export-panel">
      <div className="export-panel-content">
        <div className="export-panel-header">
          <h3>导出文档</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="export-form">
          <div className="form-group">
            <label htmlFor="format">导出格式:</label>
            <select 
              id="format" 
              value={format} 
              onChange={handleFormatChange}
              disabled={isExporting}
            >
              <option value="pdf">PDF文档</option>
              <option value="png">PNG图片</option>
              <option value="svg">SVG矢量图</option>
              <option value="md">Markdown文本</option>
              <option value="html">HTML文档</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="filename">文件名:</label>
            <input 
              type="text" 
              id="filename" 
              value={filename} 
              onChange={handleFilenameChange}
              disabled={isExporting}
              placeholder="输入文件名（不含扩展名）"
            />
          </div>
          
          {exportError && (
            <div className="error-message">{exportError}</div>
          )}
          
          <button 
            className="export-button" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? '导出中...' : '导出'}
          </button>
        </div>
        
        <div className="export-preview">
          <h4>导出预览</h4>
          <div className="preview-container" ref={previewRef}>
            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportPanel; 