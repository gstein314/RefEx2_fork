export default ({ app }, inject) => {
  inject('boldenSuggestion', (fullText, highlightedPart) => {
    if (!fullText || !highlightedPart) return text;
    return fullText.replace(highlightedPart, `<b>${highlightedPart}</b>`);
  });
  inject(
    'getSuggestionURL',
    (queryStr, optionalStr) => `api/suggest?query=${queryStr}${optionalStr}`
  );
};
