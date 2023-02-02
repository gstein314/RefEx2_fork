export default ({ app }, inject) => {
  inject(
    'highlightedSuggestion',
    (fullText, highlightedPart, chrLegnth = 3) => {
      const alphabetRegExp = /\w+/g;
      highlightedPart =
        alphabetRegExp[Symbol.match](highlightedPart)?.join(' ');
      const reg = new RegExp(highlightedPart, 'gi');
      const isHighlight = reg.test(highlightedPart);
      if (highlightedPart?.length >= chrLegnth && isHighlight) {
        console.log('fullText: ', fullText);
        return fullText.replaceAll(reg, `<mark>$&</mark>`);
      } else {
        return fullText;
      }
    }
  );
  inject('firstLetterUppercase', str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });
  inject('variableName', str => {
    return str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  });
};
