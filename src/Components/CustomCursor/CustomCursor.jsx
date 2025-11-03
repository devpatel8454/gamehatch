import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const positionRef = useRef({ mouseX: 0, mouseY: 0, outlineX: 0, outlineY: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    console.log('🎯 CustomCursor component mounted');
    
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.left = '0px';
    cursor.style.top = '0px';
    document.body.appendChild(cursor);
    cursorRef.current = cursor;
    console.log('✅ Cursor element created:', cursor);

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'custom-cursor-outline';
    cursorOutline.style.left = '0px';
    cursorOutline.style.top = '0px';
    document.body.appendChild(cursorOutline);
    cursorOutlineRef.current = cursorOutline;
    console.log('✅ Cursor outline created:', cursorOutline);

    // Mouse move handler - just store position, don't update DOM
    let moveCount = 0;
    const handleMouseMove = (e) => {
      positionRef.current.mouseX = e.clientX;
      positionRef.current.mouseY = e.clientY;
      
      // Log first few movements for debugging
      if (moveCount < 3) {
        console.log(`🖱️ Mouse move ${moveCount + 1}:`, e.clientX, e.clientY);
        moveCount++;
      }
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

    // Optimized animation loop using requestAnimationFrame
    let frameCount = 0;
    const animate = () => {
      const pos = positionRef.current;
      
      // Update cursor position immediately using transform (GPU accelerated)
      if (cursor) {
        cursor.style.transform = `translate(${pos.mouseX}px, ${pos.mouseY}px) translate(-50%, -50%)`;
        
        // Log first few frames
        if (frameCount < 3) {
          console.log(`🎬 Animation frame ${frameCount + 1}:`, pos.mouseX, pos.mouseY);
          console.log('Cursor computed style:', window.getComputedStyle(cursor).transform);
          frameCount++;
        }
      }

      // Smooth trailing for outline using lerp
      pos.outlineX += (pos.mouseX - pos.outlineX) * 0.2;
      pos.outlineY += (pos.mouseY - pos.outlineY) * 0.2;

      if (cursorOutline) {
        cursorOutline.style.transform = `translate(${pos.outlineX}px, ${pos.outlineY}px) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    console.log('🎬 Starting animation loop');
    animate();

    // Add event listeners with passive flag for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    console.log('✅ Event listeners attached');
    
    // Check cursor is in DOM
    setTimeout(() => {
      const cursorInDom = document.querySelector('.custom-cursor');
      const outlineInDom = document.querySelector('.custom-cursor-outline');
      console.log('🔍 Cursor in DOM:', !!cursorInDom);
      console.log('🔍 Outline in DOM:', !!outlineInDom);
      if (cursorInDom) {
        const styles = window.getComputedStyle(cursorInDom);
        console.log('📊 Cursor styles:', {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          zIndex: styles.zIndex,
          position: styles.position
        });
      }
    }, 100);

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
