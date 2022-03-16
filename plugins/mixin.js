export default ({ app }, inject) => {
  inject('boldenSuggestion', (fullText, highlightedPart) => {
    if (!fullText || !highlightedPart) return text;
    return fullText.replace(highlightedPart, `<b>${highlightedPart}</b>`);
  });
  inject(
    'getSuggestionURL',
    (queryStr, optionalStr) => `api/suggest?query=${queryStr}${optionalStr}`
  );
  inject('firstLetterUppercase', str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });
};
