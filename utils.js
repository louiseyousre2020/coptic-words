function parseSearchField(str) {
  let result = str.split("\n").filter((x) => x !== "");
  result = result.map((x) => {
    if (x.endsWith("~"))
      return { word: x.replace("~", ""), dialect: null, cf: null };
    else {
      x = x.split("~");
      x[1] = x[1].split("^^");
      return { word: x[0], dialect: x[1][0], cf: x[1][1] };
    }
  });
  return result;
}

function extractTypeFromNameField(str) {
  return str.split("\n")[0];
}

function entryMapper(entry) {
  return {
    pos: entry.POS,
    type: extractTypeFromNameField(entry.Name),
    entries: parseSearchField(entry.Search),
  };
}

function filterThePureWordList(pureWordList, dialects) {
  const filterdPureWordList = pureWordList
    .map((x) => {
      x.entries = x.entries.filter((entry) => {
        return (
          entry.word != "" &&
          !entry.word.includes(" ") &&
          entry.dialect != "" &&
          entry.dialect != null &&
          dialects.includes(entry.dialect)
        );
      });
      return x;
    })
    .filter((x) => x.entries.length !== 0);

  return filterdPureWordList;
}

function isCopticVowel(letter) {
  return ["ⲱ", "ⲉ", "ⲩ", "ⲓ", "ⲟ", "ⲁ", "ⲏ"].includes(letter);
}

function getPossesivesPrefixes(isMasculine, isPlural) {
  const genderLetter = isPlural ? "ⲛ" : isMasculine ? "ⲡ" : "ⲧ";
  return [
    `${genderLetter}ⲁ`,
    `${genderLetter}ⲉⲕ`,
    `${genderLetter}ⲉ`,
    `${genderLetter}ⲉϥ`,
    `${genderLetter}ⲉⲥ`,
    `${genderLetter}ⲉⲛ`,
    `${genderLetter}ⲉⲧⲉⲛ`,
    `${genderLetter}ⲟⲩ`,
  ];
}

function isWilmnour(word) {
  const condition1 = ["ⲃ", "ⲗ", "ⲙ", "ⲛ", "ⲣ"].includes(word[0]);
  const condition2 = word[0] === "ⲓ" && isCopticVowel(word[1]);
  const condition3 = word[0] + word[1] === "ⲟⲩ" && isCopticVowel(word[2]);
  return condition1 || condition2 || condition3;
}

function getNounOtherPossibilities(noun, isMasculine, isPlural) {
  if (isPlural) {
    return [
      "ⲛⲓ",
      "ⲛⲉⲛ",
      "ϩⲁⲛ",
      ...getPossesivesPrefixes(isMasculine, isPlural),
    ].map((x) => x + noun);
  } else {
    if (isMasculine) {
      return [
        isWilmnour(noun) ? "ⲫ" : "ⲡ",
        "ⲡⲓ",
        "ⲟⲩ",
        ...getPossesivesPrefixes(isMasculine, isPlural),
      ].map((x) => x + noun);
    } else {
      return [
        isWilmnour(noun) ? "ⲑ" : "ⲧ",
        "ϯ",
        "ⲟⲩ",
        ...getPossesivesPrefixes(isMasculine, isPlural),
      ].map((x) => x + noun);
    }
  }
}

function getWordOtherPossinilities(x, type) {
  switch (type) {
    case "Subst. m.":
    case "Subst. m. Völkername":
      return getNounOtherPossibilities(x, true, false);
    case "Subst. f.":
    case "Subst. f. Völkername":
    case "Subst. f. arabisches Lehnwort":
      return getNounOtherPossibilities(x, false, false);
    case "Subst. pl.":
    case "Subst. pl. semitisches Lehnwort":
    case 'Subst. pl. ⲁ- "Haus" + ⲁϩⲱⲣ (?)':
    case "Subst. m. pl.":
    case "Subst. f. pl.":
      return getNounOtherPossibilities(x, null, true);
    default:
      return [x]; // Just a Placeholder
  }
}

function generateTextWordList(wl) {
  return wl
    .map((x) => {
      return x.entries.map((z) => getWordOtherPossinilities(z.word, x.type));
    })
    .reduce((prev, cur) => {
      return [
        ...prev,
        ...cur.reduce((prev1, cur1) => {
          return [...prev1, ...cur1];
        }, []),
      ];
    }, [])
    .join("\n");
}

module.exports = {
  entryMapper,
  filterThePureWordList,
  generateTextWordList,
};
