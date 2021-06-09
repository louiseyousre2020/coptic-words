// Required things for doing my jon :)
const sqlite3 = require("sqlite3");
const fs = require("fs");
const utils = require("./utils");

// CONSONANTS
const DB_FILE_PATH = "data/alpha_kyima_rc1.db";
const ENTRIES_JSON_FILE_PATH = "data/alpha_kyima_rc1-entries.json";
const PURE_WORDLIST_JSON_FILE_PATH = "data/pure_wordlist.json";
const ENTRIES_TABLE_NAME = "entries";
const TARGET_DIALECTS = ["B"];
const FILTERED_WORDLIST_JSON_FILE_PATH = "data/filtered_wordlist.json";
const TEXT_WORDLIST_FILE_PATH = "data/text_word_list.txt";

// Doing My Job
console.log(">>>>>>>> I");

const dictDb = new sqlite3.Database(DB_FILE_PATH, (err) => {
  if (err) throw err;
  else console.log("[1] Connected to the database successfully.");
});

const sql = `SELECT * FROM ${ENTRIES_TABLE_NAME}`;

dictDb.all(sql, [], (err, rows) => {
  if (err) throw err;
  console.log("[2] Got the data successfully from the database file!");
  fs.writeFileSync(ENTRIES_JSON_FILE_PATH, JSON.stringify(rows, null, 3));
  console.log(
    `[3] Wrote the table '${ENTRIES_TABLE_NAME}' data to json file '${ENTRIES_JSON_FILE_PATH}' successfully!`
  );

  const pureWordList = rows.map(utils.entryMapper);

  console.log(`[4] Generated the pure wordlist data successfully!`);

  fs.writeFileSync(
    PURE_WORDLIST_JSON_FILE_PATH,
    JSON.stringify(pureWordList, null, 3)
  );

  console.log(
    `[5] Wrote the pure wordlist data to '${PURE_WORDLIST_JSON_FILE_PATH}' successfully!`
  );

  const filterdPureWordList = utils.filterThePureWordList(
    pureWordList,
    TARGET_DIALECTS
  );

  console.log(
    `[6] Filtered the pure wordlist leaving the words of the dialect${
      TARGET_DIALECTS.length === 1 ? "" : "s"
    } (${TARGET_DIALECTS}) only successfully!`
  );

  fs.writeFileSync(
    FILTERED_WORDLIST_JSON_FILE_PATH,
    JSON.stringify(filterdPureWordList, null, 3)
  );

  console.log(
    `[7] Wrote the filtered wordlist data to '${FILTERED_WORDLIST_JSON_FILE_PATH}' successfully!`
  );

  const textWordList = utils.generateTextWordList(filterdPureWordList);
  console.log(`[8] Generated the text wordlist successfully!`);

  fs.writeFileSync(TEXT_WORDLIST_FILE_PATH, textWordList);
  console.log(
    `[9] Wrote the text wordlist to ${TEXT_WORDLIST_FILE_PATH} successfully!`
  );
});

dictDb.close((err) => {
  if (err) throw err.message;
  console.log("[-] Closed the database connection successfully.");
  console.log("My job is done :)");
});
