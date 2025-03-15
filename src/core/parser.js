import { marked } from 'marked';
import hljs from 'highlight.js';
import katex from 'katex';

// 配置marked选项
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, lang) {
    try {
      return hljs.highlight(code, { language: lang }).value;
    } catch (e) {
      return hljs.highlightAuto(code).value;
    }
  },
  langPrefix: 'hljs language-',
  pedantic: false,
  gfm: true,
  breaks: true,
  sanitize: false,
  smartypants: false,
  xhtml: false
});

// 扩展renderer以支持数学公式
const renderer = new marked.Renderer();
const originalParagraph = renderer.paragraph.bind(renderer);

// 处理行内数学公式 $...$
renderer.paragraph = (text) => {
  const mathRegex = /\$(.+?)\$/g;
  const processedText = text.replace(mathRegex, (match, formula) => {
    try {
      return katex.renderToString(formula, { throwOnError: false, displayMode: false });
    } catch (e) {
      console.error('KaTeX渲染错误:', e);
      return match;
    }
  });
  return originalParagraph(processedText);
};

// 处理块级数学公式 $$...$$
const originalCode = renderer.code.bind(renderer);
renderer.code = (code, language) => {
  if (language === 'math' || language === 'tex') {
    try {
      return `<div class="math-block">${katex.renderToString(code, { throwOnError: false, displayMode: true })}</div>`;
    } catch (e) {
      console.error('KaTeX渲染错误:', e);
      return `<pre>数学公式渲染错误: ${e.message}</pre>`;
    }
  }
  return originalCode(code, language);
};

/**
 * 解析Markdown文本为HTML
 * @param {string} markdown - Markdown文本
 * @returns {string} 解析后的HTML
 */
export function parseMarkdown(markdown) {
  if (!markdown) return '';
  
  marked.use({ renderer });
  
  try {
    return marked(markdown);
  } catch (error) {
    console.error('Markdown解析错误:', error);
    return `<div class="error">Markdown解析错误: ${error.message}</div>`;
  }
}

/**
 * 解析Markdown文本为HTML，并提取元数据
 * @param {string} markdown - Markdown文本
 * @returns {Object} 包含HTML和元数据的对象
 */
export function parseMarkdownWithMeta(markdown) {
  if (!markdown) return { html: '', meta: {} };
  
  // 简单的元数据提取，格式为 ---key: value---
  const metaRegex = /^---\s*([\s\S]*?)\s*---/;
  const metaMatch = markdown.match(metaRegex);
  
  let meta = {};
  let cleanMarkdown = markdown;
  
  if (metaMatch) {
    const metaContent = metaMatch[1];
    cleanMarkdown = markdown.replace(metaMatch[0], '').trim();
    
    // 解析元数据
    metaContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        meta[key.trim()] = valueParts.join(':').trim();
      }
    });
  }
  
  return {
    html: parseMarkdown(cleanMarkdown),
    meta
  };
}

export default {
  parseMarkdown,
  parseMarkdownWithMeta
}; 