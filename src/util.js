const deleteElementBySelector = (selector) => {
  if (!selector) return;
  const divToRemove = document.querySelector(selector);
  if (!divToRemove) return;
  divToRemove.parentNode.removeChild(divToRemove);
};

const generateId = () =>{
  const date = new Date().getTime().toString();
  const randomNumber = (Math.random() * 1000).toString();
  return date + randomNumber;
};

export {deleteElementBySelector, generateId};
