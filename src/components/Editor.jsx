import React, { useRef, useEffect } from 'react';
import '../styles/Editor.css';

/**
 * Markdown编辑器组件
 * @param {Object} props - 组件属性
 * @param {string} props.markdown - Markdown文本内容
 * @param {Function} props.onChange - 内容变更回调函数
 */
function Editor({ markdown, onChange }) {
  const textareaRef = useRef(null);
  
  // 处理输入变化
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  
  // 处理Tab键
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      // 在光标位置插入Tab字符（两个空格）
      const newValue = markdown.substring(0, start) + '  ' + markdown.substring(end);
      onChange(newValue);
      
      // 重新设置光标位置
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };
  
  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [markdown]);
  
  return (
    <div className="editor-container">
      <div className="editor-header">
        <h3>Markdown编辑器</h3>
      </div>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={markdown}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="在此输入Markdown内容..."
        spellCheck="false"
      />
    </div>
  );
}

export default Editor; 