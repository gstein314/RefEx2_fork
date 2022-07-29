export default ({ app }, inject) => {
  inject('highlightedSuggestion', (fullText, highlightedPart) => {
    const reg = new RegExp(highlightedPart, 'gi');
    const match = fullText.match(reg);
    if (match) {
      return fullText.replace(match, `<mark>${match}</mark>`);
    } else {
      return fullText;
    }
  });
  inject('firstLetterUppercase', str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });
  inject('variableName', str => {
    return str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  });
};
