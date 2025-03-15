import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExportPanel from '../../src/components/ExportPanel';
import { exportToPNG, exportToPDF, exportToSVG, downloadFile } from '../../src/core/exporter';

// 模拟导出函数
jest.mock('../../src/core/exporter', () => ({
  exportToPNG: jest.fn(() => Promise.resolve('data:image/png;base64,mock')),
  exportToPDF: jest.fn(() => Promise.resolve(new Blob(['pdf-content'], { type: 'application/pdf' }))),
  exportToSVG: jest.fn(() => Promise.resolve('data:image/svg+xml;charset=utf-8,mock')),
  downloadFile: jest.fn()
}));

describe('ExportPanel组件测试', () => {
  const mockProps = {
    markdown: '# 测试标题\n\n这是一段测试内容\n\n$E=mc^2$',
    html: '<h1>测试标题</h1><p>这是一段测试内容</p><p>$E=mc^2$</p>',
    onClose: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    // 启用假计时器
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('应该正确渲染ExportPanel组件', () => {
    render(<ExportPanel {...mockProps} />);
    
    expect(screen.getByText('导出文档')).toBeInTheDocument();
    expect(screen.getByText('导出格式:')).toBeInTheDocument();
    expect(screen.getByText('文件名:')).toBeInTheDocument();
    expect(screen.getByText('导出预览')).toBeInTheDocument();
    expect(screen.getByText('导出')).toBeInTheDocument();
  });
  
  test('点击关闭按钮应该调用onClose回调', () => {
    render(<ExportPanel {...mockProps} />);
    
    fireEvent.click(screen.getByText('×'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });
  
  test('应该能够更改导出格式', () => {
    render(<ExportPanel {...mockProps} />);
    
    const formatSelect = screen.getByLabelText('导出格式:');
    fireEvent.change(formatSelect, { target: { value: 'png' } });
    
    expect(formatSelect.value).toBe('png');
  });
  
  test('应该能够更改文件名', () => {
    render(<ExportPanel {...mockProps} />);
    
    const filenameInput = screen.getByLabelText('文件名:');
    fireEvent.change(filenameInput, { target: { value: 'test-document' } });
    
    expect(filenameInput.value).toBe('test-document');
  });
  
  test('导出PNG格式应该调用正确的函数', async () => {
    render(<ExportPanel {...mockProps} />);
    
    const formatSelect = screen.getByLabelText('导出格式:');
    fireEvent.change(formatSelect, { target: { value: 'png' } });
    
    fireEvent.click(screen.getByText('导出'));
    
    await waitFor(() => {
      expect(exportToPNG).toHaveBeenCalled();
      expect(downloadFile).toHaveBeenCalledWith('data:image/png;base64,mock', 'document.png');
    });
  });
  
  test('导出PDF格式应该调用正确的函数', async () => {
    render(<ExportPanel {...mockProps} />);
    
    // PDF是默认格式，不需要更改
    
    fireEvent.click(screen.getByText('导出'));
    
    await waitFor(() => {
      expect(exportToPDF).toHaveBeenCalled();
      expect(downloadFile).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'application/pdf' }),
        'document.pdf'
      );
    });
  });
  
  test('导出SVG格式应该调用正确的函数', async () => {
    render(<ExportPanel {...mockProps} />);
    
    const formatSelect = screen.getByLabelText('导出格式:');
    fireEvent.change(formatSelect, { target: { value: 'svg' } });
    
    fireEvent.click(screen.getByText('导出'));
    
    await waitFor(() => {
      expect(exportToSVG).toHaveBeenCalled();
      expect(downloadFile).toHaveBeenCalledWith(
        'data:image/svg+xml;charset=utf-8,mock',
        'document.svg'
      );
    });
  });
  
  test('导出Markdown格式应该调用正确的函数', async () => {
    render(<ExportPanel {...mockProps} />);
    
    const formatSelect = screen.getByLabelText('导出格式:');
    fireEvent.change(formatSelect, { target: { value: 'md' } });
    
    fireEvent.click(screen.getByText('导出'));
    
    await waitFor(() => {
      expect(downloadFile).toHaveBeenCalledWith(
        expect.any(Blob),
        'document.md'
      );
    });
  });
  
  test('导出HTML格式应该调用正确的函数', async () => {
    render(<ExportPanel {...mockProps} />);
    
    const formatSelect = screen.getByLabelText('导出格式:');
    fireEvent.change(formatSelect, { target: { value: 'html' } });
    
    fireEvent.click(screen.getByText('导出'));
    
    await waitFor(() => {
      expect(downloadFile).toHaveBeenCalledWith(
        expect.any(Blob),
        'document.html'
      );
    });
  });
  
  test('导出过程中应该禁用按钮和输入框', async () => {
    // 模拟一个延迟的导出函数
    exportToPDF.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => {
        resolve(new Blob(['pdf-content'], { type: 'application/pdf' }));
      }, 100);
    }));
    
    render(<ExportPanel {...mockProps} />);
    
    fireEvent.click(screen.getByText('导出'));
    
    // 检查导出中状态
    expect(screen.getByText('导出中...')).toBeInTheDocument();
    expect(screen.getByLabelText('导出格式:')).toBeDisabled();
    expect(screen.getByLabelText('文件名:')).toBeDisabled();
    expect(screen.getByText('导出中...')).toBeDisabled();
    
    // 前进计时器
    jest.advanceTimersByTime(100);
    
    // 等待导出完成
    await waitFor(() => {
      expect(screen.getByText('导出')).toBeInTheDocument();
    });
    
    // 检查导出完成后的状态
    expect(screen.getByLabelText('导出格式:')).not.toBeDisabled();
    expect(screen.getByLabelText('文件名:')).not.toBeDisabled();
    expect(screen.getByText('导出')).not.toBeDisabled();
  });
  
  // 添加错误处理测试
  test('导出失败时应该显示错误信息', async () => {
    // 模拟导出失败
    exportToPDF.mockImplementationOnce(() => Promise.reject(new Error('导出失败')));
    
    render(<ExportPanel {...mockProps} />);
    
    fireEvent.click(screen.getByText('导出'));
    
    // 等待错误信息显示
    await waitFor(() => {
      expect(screen.getByText('导出失败: 导出失败')).toBeInTheDocument();
    });
    
    // 检查导出完成后的状态
    expect(screen.getByLabelText('导出格式:')).not.toBeDisabled();
    expect(screen.getByLabelText('文件名:')).not.toBeDisabled();
    expect(screen.getByText('导出')).not.toBeDisabled();
  });
}); 