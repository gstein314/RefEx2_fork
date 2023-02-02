export default ({ app }, inject) => {
  inject(
    'highlightedSuggestion',
    (originalDescription, userInput, minChrLength = 3) => {
      const nonWordAndSpace = /[^\w\s]/g;
      const alphaNumInput = userInput.replaceAll(nonWordAndSpace, ' ');
      const oneSpaceInput = alphaNumInput.replace(/\s\s+/g, ' ').split(' ');
      let highlightedText = originalDescription;
      for (const word of oneSpaceInput) {
        const reg = new RegExp(word, 'gi');
        const hasWord = reg.test(word);
        if (word.length >= minChrLength && hasWord) {
          highlightedText = highlightedText.replaceAll(reg, `<mark>$&</mark>`);
        }
      }
      return highlightedText;
    }
  );
  inject('firstLetterUppercase', str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });
  inject('variableName', str => {
    return str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  });
};
