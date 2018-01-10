// modified from https://github.com/joshaven/string_score/blob/master/string_score.js

const StringScore = (word, searchTerm, fuzziness) => {
  // If the string is equal to the word, perfect match.
  if (word === searchTerm) {
    return 1;
  }

  // if it's not a perfect match and is empty return 0
  if (searchTerm === '') {
    return 0;
  }

  let runningScore = 0;
  let charScore;
  let finalScore;
  const string = word;
  const lString = string.toLowerCase();
  const strLength = string.length;
  const lWord = searchTerm.toLowerCase();
  const wordLength = searchTerm.length;
  let idxOf;
  let startAt = 0;
  let fuzzies = 1;
  let fuzzyFactor;
  let i;

  // Cache fuzzyFactor for speed increase
  if (fuzziness) {
    fuzzyFactor = 1 - fuzziness;
  }

  // Walk through word and add up scores.
  // Code duplication occurs to prevent checking fuzziness inside for loop
  if (fuzziness) {
    for (i = 0; i < wordLength; i += 1) {
      // Find next first case-insensitive match of a character.
      idxOf = lString.indexOf(lWord[i], startAt);

      if (idxOf === -1) {
        fuzzies += fuzzyFactor;
      } else {
        if (startAt === idxOf) {
          // Consecutive letter & start-of-string Bonus
          charScore = 0.7;
        } else {
          charScore = 0.1;

          // Acronym Bonus
          // Weighing Logic: Typing the first character of an acronym is as if you
          // preceded it with two perfect character matches.
          if (string[idxOf - 1] === ' ') { charScore += 0.8; }
        }

        // Same case bonus.
        if (string[idxOf] === searchTerm[i]) { charScore += 0.1; }

        // Update scores and startAt position for next round of indexOf
        runningScore += charScore;
        startAt = idxOf + 1;
      }
    }
  } else {
    for (i = 0; i < wordLength; i += 1) {
      idxOf = lString.indexOf(lWord[i], startAt);
      if (idxOf === -1) {
        return 0;
      }

      if (startAt === idxOf) {
        charScore = 0.7;
      } else {
        charScore = 0.1;
        if (string[idxOf - 1] === ' ') { charScore += 0.8; }
      }
      if (string[idxOf] === searchTerm[i]) { charScore += 0.1; }
      runningScore += charScore;
      startAt = idxOf + 1;
    }
  }

  // Reduce penalty for longer strings.
  finalScore = (0.5 * ((runningScore / strLength) + (runningScore / wordLength))) / fuzzies;
  if ((lWord[0] === lString[0]) && (finalScore < 0.85)) {
    finalScore += 0.15;
  }
  return finalScore;
};
module.exports = StringScore;
