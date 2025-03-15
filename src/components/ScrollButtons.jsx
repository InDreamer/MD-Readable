import React from 'react';
import '../styles/ScrollButtons.css';
import logger from '../utils/logger';

/**
 * 滚动按钮组件
 * 提供快速滚动到顶部和底部的功能
 * @param {Object} props - 组件属性
 * @param {string} props.targetId - 目标元素的ID
 */
const ScrollButtons = ({ targetId }) => {
  // 滚动到顶部
  const scrollToTop = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      logger.debug('滚动到顶部', { targetId });
      targetElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      logger.warn('滚动目标元素未找到', { targetId });
    }
  };

  // 滚动到底部
  const scrollToBottom = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      logger.debug('滚动到底部', { targetId });
      targetElement.scrollTo({
        top: targetElement.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      logger.warn('滚动目标元素未找到', { targetId });
    }
  };

  return (
    <div className="scroll-buttons">
      <button 
        className="scroll-button scroll-top" 
        onClick={scrollToTop}
        title="滚动到顶部"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
        </svg>
      </button>
      <button 
        className="scroll-button scroll-bottom" 
        onClick={scrollToBottom}
        title="滚动到底部"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path>
        </svg>
      </button>
    </div>
  );
};

export default ScrollButtons;
