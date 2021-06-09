# Coptic Wordlist Project
I am trying to generate an open sourced coptic wordlist (now it's just bohairic) that could be used for auto completion ...etc

## The Original Source of data?
I got the database of the website [Coptic-Dictionary.org](https://coptic-dictionary.org/) from their repo [KELLIA/dictionary](https://github.com/KELLIA/dictionary). you can get it using wget or by any means. For example:
```
wget "https://github.com/KELLIA/dictionary/blob/master/alpha_kyima_rc1.db?raw=true" -o ../data/alpha_kyima_rc1.db
```
But make sure that that it get stored in the dir named `data` and named `alpha_kyima_rc1.db`

## What did I do?
I generated step by step an easy to deal with version of the included Bohairic words in that DB then I am working on generating a wordlist that includes all the possibilites **(not complete yet)** using a script that I created.

## How can I regenerate it?
First you need to excute
```
npm install
```
Then you can run the script by excuting
```
npm start
```
