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

function isEnnable(word) {
  return !["ⲃ", "ⲙ", "ⲡ", "ⲫ", "ⲯ"].includes(word[1]);
}

function getSecondPersonK(verb) {
  const condition1 = verb[0] === "ⲙ";
  const condition2 = verb[0] === "ⲛ";
  const condition3 = verb[0] + verb[1] === "ⲟⲩ";
  return condition1 || condition2 || condition3 ? "ⲭ̀" : "ⲕ̀";
}

function addStartJinkim(word) {
  return "̀" + word;
}

function getVerbConjugatedForms(verb) {
  return [
    // with preps.. etc
    "ⲉ̀",
    isEnnable(verb) ? "ⲛ̀" : "ⲙ̀",
    // 1-Pers
    "ϯ",
    addStartJinkim(getSecondPersonK(verb)),
    "ⲧⲉ",
    "ϥ̀",
    "ⲥ̀",
    "ⲧⲉⲛ",
    "ⲧⲉⲧⲉⲛ",
    "ⲥⲉ",
    // 1-Pers-Neg
    "ⲛ̀ϯ",
    "ⲛ̀" + addStartJinkim(getSecondPersonK(verb)),
    "ⲛ̀ⲧⲉ",
    "ⲛ̀ϥ̀",
    "ⲛ̀ⲥ̀",
    "ⲛ̀ⲧⲉⲛ",
    "ⲛ̀ⲧⲉⲧⲉⲛ",
    "ⲛ̀ⲥⲉ",
    // 1-Fut
    "ϯⲛⲁ",
    "ⲭ̀ⲛⲁ",
    "ⲧⲉⲣⲁ",
    "ϥ̀ⲛⲁ",
    "ⲥ̀ⲛⲁ",
    "ⲧⲉⲛⲛⲁ",
    "ⲧⲉⲧⲉⲛⲛⲁ",
    "ⲥⲉⲛⲁ",
    // 1-Fut-Neg
    "ⲛ̀ϯⲛⲁ",
    "ⲛ̀ⲭ̀ⲛⲁ",
    "ⲛ̀ⲧⲉⲣⲁ",
    "ⲛ̀ϥ̀ⲛⲁ",
    "ⲛ̀ⲥ̀ⲛⲁ",
    "ⲛ̀ⲧⲉⲛⲛⲁ",
    "ⲛ̀ⲧⲉⲧⲉⲛⲛⲁ",
    "ⲛ̀ⲥⲉⲛⲁ",
    // ⲁⲣⲉ
    "ⲁⲓ",
    "ⲁⲕ", // should we use getSecondPersonK(verb)
    "ⲁⲣⲉ",
    "ⲁϥ",
    "ⲁⲥ",
    "ⲁⲛ",
    "ⲁⲣⲉⲧⲉⲛ",
    "ⲁⲩ",
    // ⲙ̀ⲡⲉ
    "ⲙ̀ⲡⲓ",
    "ⲙ̀ⲡⲉⲕ",
    "ⲙ̀ⲡⲉ",
    "ⲙ̀ⲡⲉϥ",
    "ⲙ̀ⲡⲉⲥ",
    "ⲙ̀ⲡⲉⲛ",
    "ⲙ̀ⲡⲉⲧⲉⲛ",
    "ⲙ̀ⲡⲟⲩ",
    // ⲉⲣⲉ
    "ⲉⲓ",
    "ⲉⲕ", // should we use? getSecondPersonK(verb)
    "ⲉⲣⲉ",
    "ⲉϥ",
    "ⲉⲥ",
    "ⲉⲛ",
    "ⲉⲣⲉⲧⲉⲛ",
    "ⲉⲩ",
    // ⲉⲣⲉ + ⲉ̀
    "ⲉⲓⲉ̀",
    "ⲉⲕⲉ̀",
    "ⲉⲣⲉⲉ̀",
    "ⲉϥⲉ̀",
    "ⲉⲥⲉ̀",
    "ⲉⲛⲉ̀",
    "ⲉⲣⲉⲧⲉⲛⲉ̀",
    "ⲉⲩⲉ̀",
    // ⲛ̀ⲛⲉ
    "ⲛ̀ⲛⲁ",
    "ⲛ̀ⲛⲉⲕ",
    "ⲛ̀ⲛⲉ",
    "ⲛ̀ⲛⲉϥ",
    "ⲛ̀ⲛⲉⲥ",
    "ⲛ̀ⲛⲉⲛ",
    "ⲛ̀ⲛⲉⲧⲉⲛ",
    "ⲛ̀ⲛⲟⲩ",
    // ⲉⲣⲉ + ⲛⲁ
    "ⲉⲓⲛⲁ",
    "ⲉⲭⲛⲁ",
    "ⲉⲣⲉⲛⲁ",
    "ⲉϥⲛⲁ",
    "ⲉⲥⲛⲁ",
    "ⲉⲛⲛⲁ",
    "ⲉⲣⲉⲧⲉⲛⲛⲁ",
    "ⲉⲩⲛⲁ",
    // ⲉⲧ + ⲁⲣⲉ
    "ⲉⲧⲁⲓ",
    "ⲉⲧⲁⲕ",
    "ⲉⲧⲁⲣⲉ",
    "ⲉⲧⲁϥ",
    "ⲉⲧⲁⲥ",
    "ⲉⲧⲁⲛ",
    "ⲉⲧⲁⲣⲉⲧⲉⲛ",
    "ⲉⲧⲁⲩ",
    // ⲉⲧ + ⲙ̀ⲡⲉ
    "ⲉⲧⲙ̀ⲡⲓ",
    "ⲉⲧⲙ̀ⲡⲉⲕ",
    "ⲉⲧⲙ̀ⲡⲉ",
    "ⲉⲧⲙ̀ⲡⲉϥ",
    "ⲉⲧⲙ̀ⲡⲉⲥ",
    "ⲉⲧⲙ̀ⲡⲉⲛ",
    "ⲉⲧⲙ̀ⲡⲉⲧⲉⲛ",
    "ⲉⲧⲙ̀ⲡⲟⲩ",
    // ⲛⲉ ⲁⲣⲉ
    "ⲛⲉⲁⲓ",
    "ⲛⲉⲁⲕ",
    "ⲛⲉⲁⲣⲉ",
    "ⲛⲉⲁϥ",
    "ⲛⲉⲁⲥ",
    "ⲛⲉⲁⲛ",
    "ⲛⲉⲁⲣⲉⲧⲉⲛ",
    "ⲛⲉⲁⲩ",
    // ⲛⲉ + ⲙ̀ⲡⲉ
    "ⲛⲉⲙ̀ⲡⲓ",
    "ⲛⲉⲙ̀ⲡⲉⲕ",
    "ⲛⲉⲙ̀ⲡⲉ",
    "ⲛⲉⲙ̀ⲡⲉϥ",
    "ⲛⲉⲙ̀ⲡⲉⲥ",
    "ⲛⲉⲙ̀ⲡⲉⲛ",
    "ⲛⲉⲙ̀ⲡⲉⲧⲉⲛ",
    "ⲛⲉⲙ̀ⲡⲟⲩ",
    // ⲛⲁⲣⲉ
    "ⲛⲁⲓ",
    "ⲛⲁⲕ",
    "ⲛⲁⲣⲉ",
    "ⲛⲁϥ",
    "ⲛⲁⲥ",
    "ⲛⲁⲛ",
    "ⲛⲁⲣⲉⲧⲉⲛ",
    "ⲛⲁⲩ",
    // ⲉ̀ + ⲛⲁⲣⲉ
    "ⲉ̀ⲛⲁⲓ",
    "ⲉ̀ⲛⲁⲕ",
    "ⲉ̀ⲛⲁⲣⲉ",
    "ⲉ̀ⲛⲁϥ",
    "ⲉ̀ⲛⲁⲥ",
    "ⲉ̀ⲛⲁⲛ",
    "ⲉ̀ⲛⲁⲣⲉⲧⲉⲛ",
    "ⲉ̀ⲛⲁⲩ",
    // ϣⲁⲣⲉ
    "ϣⲁⲓ",
    "ϣⲁⲕ",
    "ϣⲁⲣⲉ",
    "ϣⲁϥ",
    "ϣⲁⲥ",
    "ϣⲁⲛ",
    "ϣⲁⲣⲉⲧⲉⲛ",
    "ϣⲁⲩ",
    // ⲛⲉ + ϣⲁⲣⲉ
    "ⲛⲉϣⲁⲓ",
    "ⲛⲉϣⲁⲕ",
    "ⲛⲉϣⲁⲣⲉ",
    "ⲛⲉϣⲁϥ",
    "ⲛⲉϣⲁⲥ",
    "ⲛⲉϣⲁⲛ",
    "ⲛⲉϣⲁⲣⲉⲧⲉⲛ",
    "ⲛⲉϣⲁⲩ",
    // ⲙ̀ⲡⲁⲣⲉ
    "ⲙ̀ⲡⲁⲓ",
    "ⲙ̀ⲡⲁⲕ",
    "ⲙ̀ⲡⲁⲣⲉ",
    "ⲙ̀ⲡⲁϥ",
    "ⲙ̀ⲡⲁⲥ",
    "ⲙ̀ⲡⲁⲛ",
    "ⲙ̀ⲡⲁⲣⲉⲧⲉⲛ",
    "ⲙ̀ⲡⲁⲩ",
    // ⲛⲉ + ⲙ̀ⲡⲁⲣⲉ
    "ⲛⲉⲙ̀ⲡⲁⲓ",
    "ⲛⲉⲙ̀ⲡⲁⲕ",
    "ⲛⲉⲙ̀ⲡⲁⲣⲉ",
    "ⲛⲉⲙ̀ⲡⲁϥ",
    "ⲛⲉⲙ̀ⲡⲁⲥ",
    "ⲛⲉⲙ̀ⲡⲁⲛ",
    "ⲛⲉⲙ̀ⲡⲁⲣⲉⲧⲉⲛ",
    "ⲛⲉⲙ̀ⲡⲁⲩ",
    // ⲉ̀ + ϣⲁⲣⲉ
    "ⲉ̀ϣⲁⲓ",
    "ⲉ̀ϣⲁⲕ",
    "ⲉ̀ϣⲁⲣⲉ",
    "ⲉ̀ϣⲁϥ",
    "ⲉ̀ϣⲁⲥ",
    "ⲉ̀ϣⲁⲛ",
    "ⲉ̀ϣⲁⲣⲉⲧⲉⲛ",
    "ⲉ̀ϣⲁⲩ",
    // 2-Fut
    "ⲁⲓⲛⲁ",
    "ⲁⲕⲛⲁ",
    "ⲁⲣⲉⲛⲁ",
    "ⲁϥⲛⲁ",
    "ⲁⲥⲛⲁ",
    "ⲁⲛⲛⲁ",
    "ⲁⲣⲉⲧⲉⲛⲛⲁ",
    "ⲁⲩⲛⲁ",
    // cond.
    "ⲁⲓϣⲁⲛ",
    "ⲁⲕϣⲁⲛ",
    "ⲁⲣⲉϣⲁⲛ",
    "ⲁϥϣⲁⲛ",
    "ⲁⲥϣⲁⲛ",
    "ⲁⲛϣⲁⲛ",
    "ⲁⲣⲉⲧⲉⲛϣⲁⲛ",
    "ⲁⲩϣⲁⲛ",
    // cond.-neg
    "ⲁⲓϣ̀ⲧⲉⲙ",
    "ⲁⲕϣ̀ⲧⲉⲙ",
    "ⲁⲣⲉϣ̀ⲧⲉⲙ",
    "ⲁϥϣ̀ⲧⲉⲙ",
    "ⲁⲥϣ̀ⲧⲉⲙ",
    "ⲁⲛϣ̀ⲧⲉⲙ",
    "ⲁⲣⲉⲧⲉⲛϣ̀ⲧⲉⲙ",
    "ⲁⲩϣ̀ⲧⲉⲙ",
    // Conj.
    "ⲛ̀ⲧⲁ",
    "ⲛ̀ⲧⲉⲕ",
    "ⲛ̀ⲧⲉ",
    "ⲛ̀ⲧⲉϥ",
    "ⲛ̀ⲧⲉⲥ",
    "ⲛ̀ⲧⲉⲛ",
    "ⲛ̀ⲧⲉⲧⲉⲛ",
    "ⲛ̀ⲧⲟⲩ",
    // Conj.-Neg
    "ⲛ̀ⲧⲁϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲉⲕϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲉϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲉϥϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲉⲥϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲉⲛϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲉⲧⲉⲛϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲟⲩϣ̀ⲧⲉⲙ",
    // ϣⲁⲛ̀ⲧⲉ
    "ϣⲁⲛ̀ⲧⲁ",
    "ϣⲁⲛ̀ⲧⲉⲕ",
    "ϣⲁⲛ̀ⲧⲉ",
    "ϣⲁⲛ̀ⲧⲉϥ",
    "ϣⲁⲛ̀ⲧⲉⲥ",
    "ϣⲁⲛ̀ⲧⲉⲛ",
    "ϣⲁⲛ̀ⲧⲉⲧⲉⲛ",
    "ϣⲁⲛ̀ⲧⲟⲩ",
    // ϣⲁⲧⲉ
    "ϣⲁϯ",
    "ϣⲁⲧⲉⲕ",
    "ϣⲁⲧⲉ",
    "ϣⲁⲧⲉϥ",
    "ϣⲁⲧⲉⲥ",
    "ϣⲁⲧⲉⲛ",
    "ϣⲁⲧⲉⲧⲉⲛ",
    "ϣⲁⲧⲟⲩ",
    // relative-pres.
    "ⲉϯ",
    "ⲉⲧⲉⲕ",
    "ⲉⲧⲉ",
    "ⲉⲧⲉϥ",
    "ⲉⲧⲉⲥ",
    "ⲉⲧⲉⲛ",
    "ⲉⲧⲉⲧⲉⲛ",
    "ⲉⲧⲟⲩ",
    // relative-fut.
    "ⲉϯⲛⲁ",
    "ⲉⲧⲉⲕⲛⲁ",
    "ⲉⲧⲉⲛⲁ",
    "ⲉⲧⲉϥⲛⲁ",
    "ⲉⲧⲉⲥⲛⲁ",
    "ⲉⲧⲉⲛⲛⲁ",
    "ⲉⲧⲉⲧⲉⲛⲛⲁ",
    "ⲉⲧⲟⲩⲛⲁ",
    // caus.
    "ⲉⲑⲣⲓ",
    "ⲉⲑⲣⲉⲕ",
    "ⲉⲑⲣⲉ",
    "ⲉⲑⲣⲉϥ",
    "ⲉⲑⲣⲉⲥ",
    "ⲉⲑⲣⲉⲛ",
    "ⲉⲑⲣⲉⲧⲉⲛ",
    "ⲉⲑⲣⲟⲩ",
    // caus.-neg
    "ⲉⲑⲣⲓϣ̀ⲧⲉⲙ",
    "ⲉⲑⲣⲉⲕϣ̀ⲧⲉⲙ",
    "ⲉⲑⲣⲉϣ̀ⲧⲉⲙ",
    "ⲉⲑⲣⲉϥϣ̀ⲧⲉⲙ",
    "ⲉⲑⲣⲉⲥϣ̀ⲧⲉⲙ",
    "ⲉⲑⲣⲉⲛϣ̀ⲧⲉⲙ",
    "ⲉⲑⲣⲉⲧⲉⲛϣ̀ⲧⲉⲙ",
    "ⲉⲑⲣⲟⲩϣ̀ⲧⲉⲙ",
    // caus.
    "ⲑ̀ⲣⲓ",
    "ⲑ̀ⲣⲉⲕ",
    "ⲑ̀ⲣⲉ",
    "ⲑ̀ⲣⲉϥ",
    "ⲑ̀ⲣⲉⲥ",
    "ⲑ̀ⲣⲉⲛ",
    "ⲑ̀ⲣⲉⲧⲉⲛ",
    "ⲑ̀ⲣⲟⲩ",
    // caus.-neg
    "ⲑ̀ⲣⲓϣ̀ⲧⲉⲙ",
    "ⲑ̀ⲣⲉⲕϣ̀ⲧⲉⲙ",
    "ⲑ̀ⲣⲉϣ̀ⲧⲉⲙ",
    "ⲑ̀ⲣⲉϥϣ̀ⲧⲉⲙ",
    "ⲑ̀ⲣⲉⲥϣ̀ⲧⲉⲙ",
    "ⲑ̀ⲣⲉⲛϣ̀ⲧⲉⲙ",
    "ⲑ̀ⲣⲉⲧⲉⲛϣ̀ⲧⲉⲙ",
    "ⲑ̀ⲣⲟⲩϣ̀ⲧⲉⲙ",
    // fut.-conj.
    "ⲛ̀ⲧⲁⲣⲓ",
    "ⲛ̀ⲧⲁⲣⲉⲕ",
    "ⲛ̀ⲧⲁⲣⲉ",
    "ⲛ̀ⲧⲁⲣⲉϥ",
    "ⲛ̀ⲧⲁⲣⲉⲥ",
    "ⲛ̀ⲧⲁⲣⲉⲛ",
    "ⲛ̀ⲧⲁⲣⲉⲧⲉⲛ",
    "ⲛ̀ⲧⲁⲣⲟⲩ",
    // fut.-conj.-neg
    "ⲛ̀ⲧⲁⲣⲓϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲁⲣⲉⲕϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲁⲣⲉϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲁⲣⲉϥϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲁⲣⲉⲥϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲁⲣⲉⲛϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲁⲣⲉⲧⲉⲛϣ̀ⲧⲉⲙ",
    "ⲛ̀ⲧⲁⲣⲟⲩϣ̀ⲧⲉⲙ",
    // ⲙⲁⲣⲉ
    "ⲙⲁⲣⲓ",
    "ⲙⲁⲣⲉⲕ",
    "ⲙⲁⲣⲉ",
    "ⲙⲁⲣⲉϥ",
    "ⲙⲁⲣⲉⲥ",
    "ⲙⲁⲣⲉⲛ",
    "ⲙⲁⲣⲉⲧⲉⲛ",
    "ⲙⲁⲣⲟⲩ",
    // ⲙⲁⲣⲉϣ̀ⲧⲉⲙ
    "ⲙⲁⲣⲓϣ̀ⲧⲉⲙ",
    "ⲙⲁⲣⲉⲕϣ̀ⲧⲉⲙ",
    "ⲙⲁⲣⲉϣ̀ⲧⲉⲙ",
    "ⲙⲁⲣⲉϥϣ̀ⲧⲉⲙ",
    "ⲙⲁⲣⲉⲥϣ̀ⲧⲉⲙ",
    "ⲙⲁⲣⲉⲛϣ̀ⲧⲉⲙ",
    "ⲙⲁⲣⲉⲧⲉⲛϣ̀ⲧⲉⲙ",
    "ⲙⲁⲣⲟⲩϣ̀ⲧⲉⲙ",
    // ⲙ̀ⲡⲁⲧⲉ
    "ⲙ̀ⲡⲁϯ",
    "ⲙ̀ⲡⲁⲧⲉⲕ",
    "ⲙ̀ⲡⲁⲧⲉ",
    "ⲙ̀ⲡⲁⲧⲉϥ",
    "ⲙ̀ⲡⲁⲧⲉⲥ",
    "ⲙ̀ⲡⲁⲧⲉⲛ",
    "ⲙ̀ⲡⲁⲧⲉⲧⲉⲛ",
    "ⲙ̀ⲡⲁⲧⲟⲩ",
    // ⲡ̀ϫⲓⲛⲧⲉ
    "ⲡ̀ϫⲓⲛⲧⲁ",
    "ⲡ̀ϫⲓⲛⲧⲉⲕ",
    "ⲡ̀ϫⲓⲛⲧⲉ",
    "ⲡ̀ϫⲓⲛⲧⲉϥ",
    "ⲡ̀ϫⲓⲛⲧⲉⲥ",
    "ⲡ̀ϫⲓⲛⲧⲉⲛ",
    "ⲡ̀ϫⲓⲛⲧⲉⲧⲉⲛ",
    "ⲡ̀ϫⲓⲛⲧⲟⲩ",
    // ⲉ̀ + ⲡ̀ϫⲓⲛⲧⲉ
    "ⲉ̀ⲡ̀ϫⲓⲛⲧⲁ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲧⲉⲕ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲧⲉ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲧⲉϥ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲧⲉⲥ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲧⲉⲛ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲧⲉⲧⲉⲛ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲧⲟⲩ",
    // ⲡ̀ϫⲓⲛⲑ̀ⲣⲉ
    "ⲡ̀ϫⲓⲛⲑ̀ⲣⲓ",
    "ⲡ̀ϫⲓⲛⲑ̀ⲣⲉⲕ",
    "ⲡ̀ϫⲓⲛⲑ̀ⲣⲉ",
    "ⲡ̀ϫⲓⲛⲑ̀ⲣⲉϥ",
    "ⲡ̀ϫⲓⲛⲑ̀ⲣⲉⲥ",
    "ⲡ̀ϫⲓⲛⲑ̀ⲣⲉⲛ",
    "ⲡ̀ϫⲓⲛⲑ̀ⲣⲉⲧⲉⲛ",
    "ⲡ̀ϫⲓⲛⲑ̀ⲣⲟⲩ",
    // ⲉ̀ + ⲡ̀ϫⲓⲛⲑ̀ⲣⲉ
    "ⲉ̀ⲡ̀ϫⲓⲛⲑ̀ⲣⲓ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲑ̀ⲣⲉⲕ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲑ̀ⲣⲉ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲑ̀ⲣⲉϥ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲑ̀ⲣⲉⲥ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲑ̀ⲣⲉⲛ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲑ̀ⲣⲉⲧⲉⲛ",
    "ⲉ̀ⲡ̀ϫⲓⲛⲑ̀ⲣⲟⲩ",
  ].map((x) => x + verb);
}

function getVerbOtherPossibilities(
  verb,
  form /* absolute, construct, pronominal, qualitative */
) {
  if (form === "absolute") {
    return [...getVerbConjugatedForms(verb)];
  } else if (form === "pronominal") {
  } else if (form === "qualitative") {
  } else throw new Error("Unexpected verb type");
}

function getNounOtherPossibilities(noun, isMasculine, isPlural) {
  if (isPlural) {
    return [
      "ⲛⲓ",
      "ⲛ̀ⲛⲓ", // Genitive + Definite Article
      "ⲛⲉⲛ",
      "ⲛ̀ⲛⲉⲛ", // Genitive + Definite Article
      "ϩⲁⲛ",
      "ⲉ̀ϩⲁⲛ", // Prep e + indefinite article
      ...getPossesivesPrefixes(isMasculine, isPlural),
    ].map((x) => x + noun);
  } else {
    if (isMasculine) {
      return [
        isWilmnour(noun) ? "ⲫ̀" : "ⲡ̀",
        "ⲙ̀" + isWilmnour(noun) ? "ⲫ̀" : "ⲡ̀", // Genitive + Definite Article
        "ⲡⲓ",
        "ⲙ̀ⲡⲓ", // Genitive + Definite Article
        "ⲟⲩ",
        "ⲉ̀ⲟⲩ", // prep e + indefinite article - 1
        "ⲉⲩ", // prep e + indefinite article - 2
        ...getPossesivesPrefixes(isMasculine, isPlural),
      ].map((x) => x + noun);
    } else {
      return [
        isWilmnour(noun) ? "ⲑ̀" : "ⲧ̀",
        "ⲛ̀" + (isWilmnour(noun) ? "ⲑ̀" : "ⲧ̀"), // Genitive + Definite Article
        "ϯ",
        "ⲛ̀ϯ", // Genitive + Definite Article
        "ⲟⲩ",
        "ⲉ̀ⲟⲩ", // prep e + indefinite article - 1
        "ⲉⲩ", // prep e + indefinite article - 2
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
    case "Vb. Kompositverb":
    case "Vb. Infinitiv T-Kausativ":
      return getVerbOtherPossibilities(x, "absolute");
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
