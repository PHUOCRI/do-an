import React, { useEffect, useState } from 'react';
import './ScrollToTop.css'
import { UpOutlined } from '@ant-design/icons';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Kiểm tra vị trí scroll và cập nhật trạng thái hiển thị nút
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Xử lý sự kiện scroll
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Hàm scroll to top với animation mượt
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <div 
          className="scroll-to-top"
          onClick={scrollToTop}
          role="button"
          aria-label="Cuộn lên đầu trang"
          tabIndex={0}
        >
          <UpOutlined className="scroll-to-top-icon" />
        </div>
      )}
    </>
  );
}

export default ScrollToTop;