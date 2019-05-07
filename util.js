const deleteElementById = (elementId) => {
  if (!elementId) return;
  const divToRemove = document.getElementById(elementId);
  if (!divToRemove) return;
  divToRemove.parentNode.removeChild(divToRemove);
};

const deleteElementBySelector = (selector) => {
  if (!selector) return;
  const divToRemove = document.querySelector(selector);
  if (!divToRemove) return;
  divToRemove.parentNode.removeChild(divToRemove);
};

