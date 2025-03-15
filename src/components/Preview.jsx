import React, { useRef, useEffect } from 'react';
import { applyTheme } from '../core/renderer';
import ScrollButtons from './ScrollButtons';
import logger from '../utils/logger';
import '../styles/Preview.css';

/**
 * Markdown预览组件
 * @param {Object} props - 组件属性
 * @param {string} props.html - 解析后的HTML内容
 * @param {string} props.theme - 当前主题
 */
function Preview({ html, theme }) {
  const previewRef = useRef(null);
  const previewContentId = 'preview-content';
  
  // 应用主题和渲染HTML
  useEffect(() => {
    if (previewRef.current) {
      logger.debug('更新预览内容', { theme });
      const themedHtml = applyTheme(html, theme);
      previewRef.current.innerHTML = themedHtml;
      
      // 处理预览区域内的链接，在新标签页中打开
      const links = previewRef.current.querySelectorAll('a');
      links.forEach(link => {
        if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    }
  }, [html, theme]);
  
  return (
    <div className="preview-container">
      <div className="preview-header">
        <h3>预览</h3>
      </div>
      <div 
        className="preview-content" 
        ref={previewRef} 
        id={previewContentId}
      ></div>
      <ScrollButtons targetId={previewContentId} />
    </div>
  );
}

export default Preview; 