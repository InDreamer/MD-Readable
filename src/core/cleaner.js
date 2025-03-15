/**
 * 文本净化处理器
 * 用于去除Markdown标记和提取样式信息
 */

/**
 * 去除Markdown标记，返回纯文本
 * @param {string} markdown - Markdown文本
 * @returns {string} 纯文本内容
 */
export function stripMarkdown(markdown) {
  if (!markdown) return '';
  
  let text = markdown;
  
  // 移除标题标记 # ## ###
  text = text.replace(/^#{1,6}\s+/gm, '');
  
  // 移除强调标记 ** * __ _
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  
  // 移除删除线 ~~text~~
  text = text.replace(/~~(.*?)~~/g, '$1');
  
  // 移除链接 [text](url)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // 移除图片 ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  
  // 移除代码块
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // 移除HTML标签
  text = text.replace(/<[^>]*>/g, '');
  
  // 移除引用块 >
  text = text.replace(/^>\s+/gm, '');
  
  // 移除水平线 --- or ***
  text = text.replace(/^(\*{3,}|-{3,})$/gm, '');
  
  // 移除列表标记 - * +
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  
  // 移除数字列表标记 1. 2.
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');
  
  // 移除表格
  text = text.replace(/\|.*\|/g, '');
  text = text.replace(/^[\s]*[-:]+[-:|\s]*$/gm, '');
  
  // 移除数学公式
  text = text.replace(/\$\$(.*?)\$\$/g, '');
  text = text.replace(/\$(.*?)\$/g, '');
  
  // 移除多余空行
  text = text.replace(/\n{3,}/g, '\n\n');
  
  return text.trim();
}

/**
 * 提取Markdown文本中的样式信息
 * @param {string} markdown - Markdown文本
 * @returns {Object} 样式信息对象
 */
export function extractStyles(markdown) {
  if (!markdown) return {};
  
  const styles = {
    headings: [],
    emphasis: [],
    links: [],
    images: [],
    codeBlocks: [],
    lists: [],
    tables: [],
    mathExpressions: []
  };
  
  // 提取标题
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let headingMatch;
  while ((headingMatch = headingRegex.exec(markdown)) !== null) {
    styles.headings.push({
      level: headingMatch[1].length,
      text: headingMatch[2].trim(),
      position: headingMatch.index
    });
  }
  
  // 提取强调文本
  const boldRegex = /(\*\*|__)(.*?)\1/g;
  let boldMatch;
  while ((boldMatch = boldRegex.exec(markdown)) !== null) {
    styles.emphasis.push({
      type: 'bold',
      text: boldMatch[2],
      position: boldMatch.index
    });
  }
  
  const italicRegex = /(\*|_)(.*?)\1/g;
  let italicMatch;
  while ((italicMatch = italicRegex.exec(markdown)) !== null) {
    // 排除已经匹配为粗体的内容
    if (!markdown.substring(italicMatch.index - 1, italicMatch.index + 1).match(/\*\*/)) {
      styles.emphasis.push({
        type: 'italic',
        text: italicMatch[2],
        position: italicMatch.index
      });
    }
  }
  
  // 提取链接
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(markdown)) !== null) {
    styles.links.push({
      text: linkMatch[1],
      url: linkMatch[2],
      position: linkMatch.index
    });
  }
  
  // 提取图片
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let imageMatch;
  while ((imageMatch = imageRegex.exec(markdown)) !== null) {
    styles.images.push({
      alt: imageMatch[1],
      url: imageMatch[2],
      position: imageMatch.index
    });
  }
  
  // 提取代码块
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let codeBlockMatch;
  while ((codeBlockMatch = codeBlockRegex.exec(markdown)) !== null) {
    styles.codeBlocks.push({
      language: codeBlockMatch[1],
      code: codeBlockMatch[2],
      position: codeBlockMatch.index
    });
  }
  
  // 提取数学公式
  const mathBlockRegex = /\$\$([\s\S]*?)\$\$/g;
  let mathBlockMatch;
  while ((mathBlockMatch = mathBlockRegex.exec(markdown)) !== null) {
    styles.mathExpressions.push({
      type: 'block',
      formula: mathBlockMatch[1],
      position: mathBlockMatch.index
    });
  }
  
  const mathInlineRegex = /\$([^$\n]+)\$/g;
  let mathInlineMatch;
  while ((mathInlineMatch = mathInlineRegex.exec(markdown)) !== null) {
    styles.mathExpressions.push({
      type: 'inline',
      formula: mathInlineMatch[1],
      position: mathInlineMatch.index
    });
  }
  
  return styles;
}

export default {
  stripMarkdown,
  extractStyles
}; 