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
  inject('getToday', () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return yyyy + mm + dd;
  });
};
