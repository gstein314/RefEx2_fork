export default ({ app }, inject) => {
  inject(
    'highlightedSuggestion',
    (originalDescription, userInput, minChrLength = 3) => {
      const wordAndSpace = /[^\w\s]/g;
      const wordsOnlyInput = userInput.replaceAll(wordAndSpace, ' ');
      const oneSpaceInput = wordsOnlyInput.replace(/\s\s+/g, ' ').split(' ');
      // console.log(oneSpaceInput);
      let highlightedText = originalDescription;
      for (const word of oneSpaceInput) {
        const reg = new RegExp(word, 'gi');
        const hasWord = reg.test(word);
        if (word.length >= minChrLength && hasWord) {
          highlightedText = highlightedText.replaceAll(reg, `<mark>$&</mark>`);
          console.log(highlightedText);
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
