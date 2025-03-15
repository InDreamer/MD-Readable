/**
 * 图片生成器
 * 用于将Markdown内容导出为PDF/PNG/SVG等格式
 */
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import logger from '../utils/logger';

/**
 * 导出为PNG图片
 * @param {HTMLElement} element - 要导出的DOM元素
 * @param {Object} options - 导出选项
 * @returns {Promise<string>} 导出的图片数据URL
 */
export async function exportToPNG(element, options = {}) {
  const defaultOptions = {
    scale: 2, // 默认缩放比例，提高清晰度
    backgroundColor: null, // 背景色，null表示透明
    logging: false,
    useCORS: true, // 允许加载跨域图片
    allowTaint: true
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  logger.info('开始导出PNG', { 
    elementId: element.id, 
    width: element.offsetWidth, 
    height: element.offsetHeight,
    scale: mergedOptions.scale
  });
  
  try {
    const canvas = await html2canvas(element, mergedOptions);
    const dataUrl = canvas.toDataURL('image/png');
    logger.info('PNG导出成功', { 
      width: canvas.width, 
      height: canvas.height,
      size: Math.round(dataUrl.length / 1024) + 'KB'
    });
    return dataUrl;
  } catch (error) {
    logger.error('导出PNG失败:', error);
    throw new Error(`导出PNG失败: ${error.message}`);
  }
}

/**
 * 导出为PDF文档
 * @param {HTMLElement} element - 要导出的DOM元素
 * @param {Object} options - 导出选项
 * @returns {Promise<Blob>} 导出的PDF数据Blob
 */
export async function exportToPDF(element, options = {}) {
  const defaultOptions = {
    filename: 'document.pdf',
    format: 'a4',
    orientation: 'portrait', // 'portrait' 或 'landscape'
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    scale: 2,
    backgroundColor: '#ffffff'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  logger.info('开始导出PDF', { 
    elementId: element.id, 
    format: mergedOptions.format,
    orientation: mergedOptions.orientation
  });
  
  try {
    // 首先将元素渲染为Canvas
    const canvas = await html2canvas(element, {
      scale: mergedOptions.scale,
      backgroundColor: mergedOptions.backgroundColor,
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    // 创建PDF文档
    const pdf = new jsPDF({
      orientation: mergedOptions.orientation,
      unit: 'mm',
      format: mergedOptions.format
    });
    
    // 获取Canvas和PDF的尺寸
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pdf.internal.pageSize.getWidth() - mergedOptions.margin.left - mergedOptions.margin.right;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = mergedOptions.margin.top;
    let pageHeight = pdf.internal.pageSize.getHeight() - mergedOptions.margin.top - mergedOptions.margin.bottom;
    
    // 添加第一页
    pdf.addImage(imgData, 'PNG', mergedOptions.margin.left, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // 如果内容超过一页，添加更多页面
    while (heightLeft > 0) {
      position = 0;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', mergedOptions.margin.left, position - imgHeight + pageHeight, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // 返回PDF数据
    const pdfDataUri = pdf.output('datauristring');
    logger.info('PDF导出成功', { 
      pages: pdf.getNumberOfPages(),
      size: Math.round(pdfDataUri.length / 1024) + 'KB'
    });
    return pdf.output('blob');
  } catch (error) {
    logger.error('导出PDF失败:', error);
    throw new Error(`导出PDF失败: ${error.message}`);
  }
}

/**
 * 导出为SVG
 * 注意：这是一个简化的实现，实际上html2canvas不直接支持SVG导出
 * 这里我们使用一个变通方法，将内容转换为SVG格式
 * @param {HTMLElement} element - 要导出的DOM元素
 * @param {Object} options - 导出选项
 * @returns {Promise<string>} 导出的SVG数据
 */
export async function exportToSVG(element, options = {}) {
  logger.info('开始导出SVG', { 
    elementId: element.id
  });
  
  try {
    // 获取元素的HTML内容
    const htmlContent = element.outerHTML;
    
    // 创建一个SVG元素
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    
    // 设置SVG属性
    const rect = element.getBoundingClientRect();
    svg.setAttribute("width", rect.width);
    svg.setAttribute("height", rect.height);
    svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    
    // 创建一个外来对象元素
    const foreignObject = document.createElementNS(svgNS, "foreignObject");
    foreignObject.setAttribute("width", "100%");
    foreignObject.setAttribute("height", "100%");
    foreignObject.setAttribute("x", "0");
    foreignObject.setAttribute("y", "0");
    
    // 将HTML内容嵌入到外来对象中
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    foreignObject.appendChild(div);
    
    // 将外来对象添加到SVG中
    svg.appendChild(foreignObject);
    
    // 将SVG转换为字符串
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);
    
    // 添加XML声明和DOCTYPE
    svgString = '<?xml version="1.0" standalone="no"?>\n' + svgString;
    
    // 返回SVG数据
    const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    logger.info('SVG导出成功', { 
      size: Math.round(svgData.length / 1024) + 'KB'
    });
    return svgData;
  } catch (error) {
    logger.error('导出SVG失败:', error);
    throw new Error(`导出SVG失败: ${error.message}`);
  }
}

/**
 * 下载文件
 * @param {string|Blob} data - 要下载的数据
 * @param {string} filename - 文件名
 */
export function downloadFile(data, filename) {
  logger.info('开始下载文件', { filename });
  
  const link = document.createElement('a');
  
  if (data instanceof Blob) {
    link.href = URL.createObjectURL(data);
  } else {
    link.href = data;
  }
  
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    if (data instanceof Blob) {
      URL.revokeObjectURL(link.href);
    }
    logger.info('文件下载成功', { filename });
  }, 100);
}

export default {
  exportToPNG,
  exportToPDF,
  exportToSVG,
  downloadFile
}; 