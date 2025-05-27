const triggerMouseEvent = (element: HTMLElement) => {
  const mouseDownEvent = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    view: window
  });

  const mouseUpEvent = new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
    view: window
  });

  element.dispatchEvent(mouseDownEvent);
  setTimeout(() => {
    element.dispatchEvent(mouseUpEvent);
  }, 100);
};

export default triggerMouseEvent;