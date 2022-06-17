export default ({ app }, inject) => {
  inject('boldenSuggestion', (fullText, highlightedPart) => {
    if (!fullText || !highlightedPart) return fullText;
    return fullText.replace(highlightedPart, `<b>${highlightedPart}</b>`);
  });
  inject('firstLetterUppercase', str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });
  inject('variableName', str => {
    return str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  });
};
