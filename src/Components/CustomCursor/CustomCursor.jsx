import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const positionRef = useRef({ mouseX: 0, mouseY: 0, outlineX: 0, outlineY: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'custom-cursor-outline';
    document.body.appendChild(cursorOutline);
    cursorOutlineRef.current = cursorOutline;

    // Mouse move handler - just store position
    const handleMouseMove = (e) => {
      positionRef.current.mouseX = e.clientX;
      positionRef.current.mouseY = e.clientY;
    };

    // Mouse over interactive elements - throttled check
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.classList.contains('clickable') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        cursor.classList.add('hover');
        cursorOutline.classList.add('hover');
      }
    };

    // Mouse out of interactive elements
    const handleMouseOut = () => {
      cursor.classList.remove('hover');
      cursorOutline.classList.remove('hover');
    };

    // Click effect
    const handleMouseDown = () => {
      cursor.classList.add('click');
      setTimeout(() => {
        cursor.classList.remove('click');
      }, 300);
    };

    // Optimized animation loop - single RAF for 60fps
    const animate = () => {
      const pos = positionRef.current;
      
      // Update cursor position immediately (GPU accelerated)
      cursor.style.transform = `translate3d(${pos.mouseX}px, ${pos.mouseY}px, 0) translate(-50%, -50%)`;

      // Smooth trailing for outline - faster lerp for snappier feel
      pos.outlineX += (pos.mouseX - pos.outlineX) * 0.25;
      pos.outlineY += (pos.mouseY - pos.outlineY) * 0.25;

      cursorOutline.style.transform = `translate3d(${pos.outlineX}px, ${pos.outlineY}px, 0) translate(-50%, -50%)`;

      rafId.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Add event listeners with passive flag for performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });

    // Cleanup
    return () => {
      // Cancel animation frame
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      
      if (cursor && cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
      if (cursorOutline && cursorOutline.parentNode) {
        cursorOutline.parentNode.removeChild(cursorOutline);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CustomCursor;
