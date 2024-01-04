$(document).ready(function () {
  var words = [];
  var wordlist = [];
  var symbols = [
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '_',
    '+',
    '-',
    '=',
    '{',
    '}',
    '[',
    ']',
    '|',
    '\\',
    ':',
    ';',
    '"',
    "'",
    '<',
    '>',
    ',',
    '.',
    '?',
    '/',
  ];
  var finalList = [];
  var wordlist_lowerAndUpperCaseWords = [];
  var wordlist_wordsWithNumbers = [];
  var wordlist_wordsWithSymbols = [];
  var wordlist_concatenationOfTwoWords = [];
  var wordlist_concatenationOfThreeWords = [];
  var wordlist_allConcatenations = [];
  var wordlist_basicWords = [];
  var wordlist_wordsWithDates = [];
  var includeNumbers = true;
  var includeSymbols = true;
  var includeDate = false;

  $('#generateWordlist').submit(function (ev) {
    ev.preventDefault();
    clearVariables();

    includeNumbers = $('#numbers').prop('checked');
    includeSymbols = $('#symbols').prop('checked');
    includeDate = $('#date').val();

    $('#spinner').show();

    setTimeout(function () {
      generateWordlist();
      enableDownloadButton();
      showFileSize();
      if ($('#output').val()) {
        $('#spinner').hide();
      }
    }, 100);
  });

  $('#clearInputs').click(function () {
    $('input[name="word"]').val('');
    $('#results').text('');
    $('#output').val('');
    $('#date').val('');
    clearVariables();
    clearFileSize();
    disableDownloadButton();
  });

  function enableDownloadButton() {
    $('#download').prop('disabled', false);
  }

  function disableDownloadButton() {
    $('#download').prop('disabled', true);
  }

  function clearVariables() {
    words = [];
    finalList = [];
    wordlist = [];
    wordlist_lowerAndUpperCaseWords = [];
    wordlist_wordsWithNumbers = [];
    wordlist_wordsWithSymbols = [];
    wordlist_concatenationOfTwoWords = [];
    wordlist_concatenationOfThreeWords = [];
    wordlist_allConcatenations = [];
    wordlist_basicWords = [];
    wordlist_wordsWithDates = [];
  }

  function showFileSize() {
    let blob = new Blob([finalList], { type: 'text/plain' });
    let fileSize = blob.size / (1024 * 1024);
    $('#fileSize').text('File size: ' + fileSize.toFixed(2) + ' MB');
  }

  function clearFileSize() {
    $('#fileSize').text('');
  }

  function generateWordlist() {
    $('input[name="word"]').each(function () {
      let word = $(this).val();
      if (word.trim() !== '') {
        words.push(word);
      }
    });

    if (words.length > 0) {
      if (includeNumbers) {
        words.forEach((word, index) => {
          applyAllLowerAndUpperCase(word);
          applyRemoveLetters(word);
          applyAllNumbers(word);
          firstLetterCapitalizedAndTheOriginalWord(word);
        });
      } else {
        words.forEach((word, index) => {
          applyAllLowerAndUpperCase(word);
          applyRemoveLetters(word);
          firstLetterCapitalizedAndTheOriginalWord(word);
        });
      }

      if (includeDate) {
        words.forEach((word, index) => {
          applyAllDates(word);
        });
      }

      if (includeSymbols) {
        words.forEach((word, index) => {
          applyAllSymbols(word);
        });
      }
    }

    if (words.length === 1) {
      // Eliminar valores repetidos
      wordlist_lowerAndUpperCaseWords = Array.from(
        new Set(wordlist_lowerAndUpperCaseWords)
      );

      if (includeNumbers) {
        wordlist_lowerAndUpperCaseWords.forEach((word, index) => {
          applyAllNumbers(word);
        });
      }

      if (includeSymbols) {
        wordlist_lowerAndUpperCaseWords.forEach((word, index) => {
          applyAllSymbols(word);
        });
      }

      if (includeDate) {
        wordlist_lowerAndUpperCaseWords.forEach((word, index) => {
          applyAllDates(word);
        });

        wordlist_wordsWithNumbers.forEach((word, index) => {
          applyAllDates(word, false);
        });

        wordlist_wordsWithSymbols.forEach((word, index) => {
          applyAllDates(word, false);
        });

        wordlist_wordsWithDates.forEach((word, index) => {
          applySymbolsN1_N2(word, false);
          applyNumbersToN6(word, false);
        });
      }

      if (includeNumbers) {
        wordlist_wordsWithSymbols.forEach((word, index) => {
          applyNumbersToN6(word, false);
        });
      }

      if (includeSymbols) {
        wordlist_wordsWithNumbers.forEach((word, index) => {
          applySymbolsN1_N2(word, false);
        });
      }
    } else if (words.length > 1) {
      let newWord;

      //word1: hola, word2: test | output: HolaTest
      if (words.length === 2) {
        wordlist_lowerAndUpperCaseWords.forEach((word1) => {
          wordlist_lowerAndUpperCaseWords.forEach((word2) => {
            newWord = word1 + word2;
            wordlist.push(newWord);
          });
        });

        wordlist_basicWords.forEach((word1) => {
          wordlist_basicWords.forEach((word2) => {
            newWord = word1 + word2;
            wordlist_concatenationOfTwoWords.push(newWord);
          });
        });

        //word1: Hola, word2: Test, word3: Tecnologia | output: HolaTestTecnologia
      } else if (words.length === 3) {
        wordlist_lowerAndUpperCaseWords.forEach((word1) => {
          wordlist_lowerAndUpperCaseWords.forEach((word2) => {
            wordlist_lowerAndUpperCaseWords.forEach((word3) => {
              newWord = word1 + word2;
              wordlist.push(newWord + word3);
            });
          });
        });

        wordlist_basicWords.forEach((word1) => {
          wordlist_basicWords.forEach((word2) => {
            wordlist_basicWords.forEach((word3) => {
              newWord = word1 + word2;
              wordlist_concatenationOfThreeWords.push(newWord + word3);
            });
          });
        });
      }

      // Se coloca en un array todas las concatenaciones realizadas previamente
      wordlist_allConcatenations = wordlist_concatenationOfTwoWords.concat(
        wordlist_concatenationOfThreeWords
      );

      if (includeNumbers) {
        wordlist_allConcatenations.forEach((word, index) => {
          applyAllNumbers(word);
        });
      }

      if (includeSymbols) {
        wordlist_allConcatenations.forEach((word, index) => {
          applySymbolsN1_N2(word);
          replaceLettersBySymbols(word);
        });
      }

      if (includeDate) {
        wordlist_allConcatenations.forEach((word, index) => {
          applyAllDates(word);
        });
      }

      if (includeNumbers) {
        wordlist_wordsWithSymbols.forEach((word, index) => {
          applyNumbersToN2(word, false);
        });
      }

      if (includeSymbols) {
        wordlist_wordsWithNumbers.forEach((word, index) => {
          applySymbolsN1_N2(word, false);
        });
      }
    }

    showOutput();
  }

  $('#download').click(function () {
    let blob = new Blob([finalList], { type: 'text/plain' });

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'wordlist.txt';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  function applyAllSymbols(word, saveInSymbolsArray = true) {
    symbolsN1(word, saveInSymbolsArray);
    symbolsN2(word, saveInSymbolsArray);
    symbolsN3(word, saveInSymbolsArray);
    symbolsN4(word, saveInSymbolsArray);
    symbolsN5(word, saveInSymbolsArray);
    replaceLettersBySymbols(word, saveInSymbolsArray);
  }

  function applySymbolsN1_N2(word, saveInSymbolsArray = true) {
    symbolsN1(word, saveInSymbolsArray);
    symbolsN2(word, saveInSymbolsArray);
  }

  function applySymbolsN1_N2_N5(word, saveInSymbolsArray = true) {
    symbolsN1(word, saveInSymbolsArray);
    symbolsN2(word, saveInSymbolsArray);
    symbolsN5(word, saveInSymbolsArray);
  }

  function applyAllLowerAndUpperCase(word) {
    upperCaseN1(word);
    upperCaseN2(word);
    upperCaseN3(word);
    upperCaseN4(word);
    upperCaseN5(word);
    upperCaseN6(word);
    lowerCaseN1(word);
    lowerCaseN2(word);
    lowerCaseN3(word);
    lowerCaseN4(word);
    lowerCaseN5(word);
    lowerCaseN6(word);
    alternateUpperAndLowerCase(word);
  }

  function applyAllNumbers(word, saveInNumbersArray = true) {
    numbersN1(word, saveInNumbersArray);
    numbersN2(word, saveInNumbersArray);
    numbersN3(word, saveInNumbersArray);
    numbersN4(word, saveInNumbersArray);
    numbersN5(word, saveInNumbersArray);
    numbersN6(word, saveInNumbersArray);
    numbersN7(word, saveInNumbersArray);
    numbersN8(word, saveInNumbersArray);
    numbersN9(word, saveInNumbersArray);
    numbersN10(word, saveInNumbersArray);
    numbersN11(word, saveInNumbersArray);
    numbersN12(word, saveInNumbersArray);
    numbersN13(word, saveInNumbersArray);
    numbersN14(word, saveInNumbersArray);
  }

  function applyNumbersToN2(word, saveInNumbersArray = true) {
    numbersN1(word, saveInNumbersArray);
    numbersN2(word, saveInNumbersArray);
  }

  function applyNumbersToN4(word, saveInNumbersArray = true) {
    numbersN1(word, saveInNumbersArray);
    numbersN2(word, saveInNumbersArray);
    numbersN3(word, saveInNumbersArray);
    numbersN4(word, saveInNumbersArray);
  }

  function applyNumbersToN6(word, saveInNumbersArray = true) {
    numbersN1(word, saveInNumbersArray);
    numbersN2(word, saveInNumbersArray);
    numbersN3(word, saveInNumbersArray);
    numbersN4(word, saveInNumbersArray);
    numbersN5(word, saveInNumbersArray);
    numbersN6(word, saveInNumbersArray);
  }

  function applyRemoveLetters(word) {
    removeLettersN1(word);
    removeLettersN2(word);
  }

  function applyAllDates(word, saveInDatesArray = true) {
    dateN1(word, saveInDatesArray);
    dateN2(word, saveInDatesArray);
    dateN3(word, saveInDatesArray);
  }

  // input: test | output: Test, tEst, teSt, tesT
  function upperCaseN1(word) {
    let splitWord = word.split('');
    let newWord;

    splitWord.forEach((letter, index) => {
      newWord =
        word.slice(0, index) +
        letter.toString().toUpperCase() +
        word.slice(index + 1);
      wordlist.push(newWord);
      wordlist_lowerAndUpperCaseWords.push(newWord);
    });
  }

  // input: test | output: Test, TEst, TESt, TEST
  function upperCaseN2(word) {
    let splitWord = word.split('');
    let newWord;

    splitWord.forEach((letter, index) => {
      newWord = word.slice(0, index + 1).toUpperCase() + word.slice(index + 1);
      wordlist.push(newWord);
      wordlist_lowerAndUpperCaseWords.push(newWord);
    });
  }

  // input: test | output: tesT, teST, tEST, TEST
  function upperCaseN3(word) {
    let splitWord = word.split('');
    let newWord;

    splitWord.forEach((letter, index) => {
      newWord =
        word.slice(0, word.length - (index + 1)) +
        word.slice(word.length - (index + 1)).toUpperCase();
      wordlist.push(newWord);
      wordlist_lowerAndUpperCaseWords.push(newWord);
    });
  }

  // input: jamon | output: JamoN, jAmOn
  // input: cabeza | output: CabezA, cAbeZa, caBEza
  function upperCaseN4(word) {
    let splitWord = word.split('');
    let newWord;

    splitWord.forEach((letter, index) => {
      newWord =
        word.substring(0, index) +
        letter.toUpperCase() +
        word.substring(index + 1, word.length - (index + 1)) +
        word[word.length - (index + 1)].toUpperCase() +
        word.substring(word.length - index);
      if (newWord.length === word.length) {
        wordlist.push(newWord);
      }
    });
  }

  //input: medicina | output: MEdiciNA, MEDicINA, MEDICINA
  function upperCaseN5(word) {
    let splitWord = word.split('');
    let newWord;

    splitWord.forEach((letter, index) => {
      newWord =
        word.slice(0, index + 2).toUpperCase() +
        word.slice(index + 2, word.length - (index + 2)) +
        word.slice(word.length - (index + 2)).toUpperCase();

      if (newWord.length === word.length) {
        wordlist.push(newWord);
      }
    });
  }

  //input: medicina | output: medICina
  //input: jamon | output: jaMon
  //input: hola | output: hOLa
  function upperCaseN6(word) {
    let newWord;
    let size = word.length;
    let middle = Math.floor(word.length / 2);

    if (size % 2 === 0) {
      newWord =
        word.substring(0, middle - 1) +
        word.substring(middle - 1, middle + 1).toUpperCase() +
        word.substring(middle + 1);
    } else {
      newWord =
        word.substring(0, middle) +
        word.substring(middle, middle + 1).toUpperCase() +
        word.substring(middle + 1);
    }
    wordlist.push(newWord);
  }

  // input:TEST | output: tEST, TeST, TEsT, TESt
  function lowerCaseN1(word) {
    let splitWord = word.split('');
    let newWord;

    splitWord.forEach((letter, index) => {
      newWord =
        word.slice(0, index) +
        letter.toString().toLowerCase() +
        word.slice(index + 1);
      wordlist.push(newWord);
      wordlist_lowerAndUpperCaseWords.push(newWord);
    });
  }

  // input:TEST | output: tEST, teST, tesT, test
  function lowerCaseN2(word) {
    let splitWord = word.split('');
    let newWord;

    splitWord.forEach((letter, index) => {
      newWord = word.slice(0, index + 1).toLowerCase() + word.slice(index + 1);
      wordlist.push(newWord);
      wordlist_lowerAndUpperCaseWords.push(newWord);
    });
  }

  // input: TEST | output: TESt, TEst, Test, test
  function lowerCaseN3(word) {
    let splitWord = word.split('');
    let newWord;

    splitWord.forEach((letter, index) => {
      newWord =
        word.slice(0, word.length - (index + 1)) +
        word.slice(word.length - (index + 1)).toLowerCase();
      wordlist.push(newWord);
      wordlist_lowerAndUpperCaseWords.push(newWord);
    });
  }

  // input: JAMON | output: jAMOn, JaMoN
  // input: CABEZA | output: cABEZa, CaBEzA, CAbeZA
  function lowerCaseN4(word) {
    let splitWord = word.split('');
    let newWord;

    splitWord.forEach((letter, index) => {
      newWord =
        word.substring(0, index) +
        letter.toLowerCase() +
        word.substring(index + 1, word.length - (index + 1)) +
        word[word.length - (index + 1)].toLowerCase() +
        word.substring(word.length - index);
      if (newWord.length === word.length) {
        wordlist.push(newWord);
      }
    });
  }

  //input: MEDICINA | output: meDICIna, medICina, medicina
  function lowerCaseN5(word) {
    let splitWord = word.split('');
    let newWord;

    splitWord.forEach((letter, index) => {
      newWord =
        word.slice(0, index + 2).toLowerCase() +
        word.slice(index + 2, word.length - (index + 2)) +
        word.slice(word.length - (index + 2)).toLowerCase();

      if (newWord.length === word.length) {
        wordlist.push(newWord);
      }
    });
  }

  //input: MEDICINA | output: MEDicINA
  //input: JAMON | output: JAmON
  //input: HOLA | output: HolA
  function lowerCaseN6(word) {
    let newWord;
    let size = word.length;
    let middle = Math.floor(word.length / 2);

    if (size % 2 === 0) {
      newWord =
        word.substring(0, middle - 1) +
        word.substring(middle - 1, middle + 1).toLowerCase() +
        word.substring(middle + 1);
    } else {
      newWord =
        word.substring(0, middle) +
        word.substring(middle, middle + 1).toLowerCase() +
        word.substring(middle + 1);
    }
    wordlist.push(newWord);
  }

  //input: medicina | output: mEdIcInA, MeDiCiNa
  function alternateUpperAndLowerCase(word) {
    let splitWord = word.split('');
    let newWord = '';

    splitWord.forEach((letter, index) => {
      newWord += index % 2 === 0 ? letter.toLowerCase() : letter.toUpperCase();
    });
    wordlist.push(newWord);

    newWord = '';

    splitWord.forEach((letter, index) => {
      newWord += index % 2 === 0 ? letter.toUpperCase() : letter.toLowerCase();
    });
    wordlist.push(newWord);
  }

  //input: test | output: tes, te, t
  function removeLettersN1(word) {
    let splitWord = word.split('');
    let newWord = '';

    splitWord.forEach((letter, index) => {
      newWord = word.substring(0, word.length - index);
      wordlist.push(newWord);
    });
  }

  //input: test | output: est, st, t
  function removeLettersN2(word) {
    let splitWord = word.split('');
    let newWord = '';

    splitWord.forEach((letter, index) => {
      newWord = word.substring(index, word.length);
      wordlist.push(newWord);
    });
  }

  //input: test | output: test0, test1, test2, test3, test4...
  function numbersN1(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      newWord = word + i;
      wordlist.push(newWord);
      if (saveInNumbersArray) {
        wordlist_wordsWithNumbers.push(newWord);
      }
    }
  }

  //input: test | output: 0test, 1test, 2test, 3test, 4test...
  function numbersN2(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      newWord = i + word;
      wordlist.push(newWord);
      if (saveInNumbersArray) {
        wordlist_wordsWithNumbers.push(newWord);
      }
    }
  }

  //input: test | output: test00, test01, test02, test03...test10, test11, test12, test13...test20, test21, test22, test23...
  function numbersN3(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        newWord = word + i.toString() + j.toString();
        wordlist.push(newWord);
        if (saveInNumbersArray) {
          wordlist_wordsWithNumbers.push(newWord);
        }
      }
    }
  }

  //input: test | output: 00test, 01test, 02test, 03test...10test, 11test, 12test, 13test...20test, 21test, 22test, 23test...
  function numbersN4(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        newWord = i.toString() + j.toString() + word;
        wordlist.push(newWord);
        if (saveInNumbersArray) {
          wordlist_wordsWithNumbers.push(newWord);
        }
      }
    }
  }

  //input: test | output: test012, test123, test234, test345
  function numbersN5(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 8; i++) {
      newWord = word + i.toString() + (i + 1).toString() + (i + 2).toString();
      wordlist.push(newWord);
      if (saveInNumbersArray) {
        wordlist_wordsWithNumbers.push(newWord);
      }
    }
  }

  //input: test | output: 012test, 123test, 234test, 345test
  function numbersN6(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 8; i++) {
      newWord = i.toString() + (i + 1).toString() + (i + 2).toString() + word;
      wordlist.push(newWord);
      if (saveInNumbersArray) {
        wordlist_wordsWithNumbers.push(newWord);
      }
    }
  }

  //input: test | output: test000, test001, test002, test003
  function numbersN7(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      newWord = word + '00' + i;
      wordlist.push(newWord);
    }
  }

  //input: test | output: 000test, 001test, 002test, 003test
  function numbersN8(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      newWord = '00' + i + word;
      wordlist.push(newWord);
    }
  }

  //input: test | output: 0test0, 1test1, 2test2, 3test3
  function numbersN9(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      newWord = i + word + i;
      wordlist.push(newWord);
    }
  }

  //input: test | output: 0test0, 0test1, 0test2...1test0, 1test1, 1test2...2test0, 2test1, 2test2...
  function numbersN10(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        newWord = i + word + j;
        wordlist.push(newWord);
      }
    }
  }

  //input: test | output: 00test00, 01test01, 02test02, 03test03, 04test04...
  function numbersN11(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      newWord = '0' + i + word + '0' + i;
      wordlist.push(newWord);
    }
  }

  //input: test | output: 00test0, 01test1, 02test2, 03test3
  function numbersN12(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      newWord = '0' + i + word + i;
      wordlist.push(newWord);
    }
  }

  //input: test | output: 0test00, 1test01, 2test02, 3test03
  function numbersN13(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      newWord = i + word + '0' + i;
      wordlist.push(newWord);
    }
  }

  //input: test | output: 00test00, 00test01, 00test02...01test00, 01test01, 01test02...02test00, 02test01, 02test02...03test00, 03test01, 03test02...
  function numbersN14(word, saveInNumbersArray) {
    let newWord;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        newWord = '0' + i + word + '0' + j;
        wordlist.push(newWord);
      }
    }
  }

  //input: test | output: test!, test", test#, test$, test%...
  function symbolsN1(word, saveInSymbolsArray) {
    let newWord;
    for (let i = 0; i < symbols.length; i++) {
      newWord = word + symbols[i];
      wordlist.push(newWord);
      if (saveInSymbolsArray) {
        wordlist_wordsWithSymbols.push(newWord);
      }
    }
  }

  //input: test | output: !test, "test, #test, $test, %test...
  function symbolsN2(word, saveInSymbolsArray) {
    let newWord;
    for (let i = 0; i < symbols.length; i++) {
      newWord = symbols[i] + word;
      wordlist.push(newWord);
      if (saveInSymbolsArray) {
        wordlist_wordsWithSymbols.push(newWord);
      }
    }
  }

  //input: test | output: test!!, test!", test!#, test!$...test"!, test"", test"#...test#!, test#", test#$...
  function symbolsN3(word) {
    let newWord;
    for (let i = 0; i < symbols.length; i++) {
      for (let j = 0; j < symbols.length; j++) {
        newWord = word + symbols[i] + symbols[j];
        wordlist.push(newWord);
      }
    }
  }

  //input: test | output: !!test, !"test, !#test, !$test..."!test, ""test, "#test...#!test, #"test, #$test...
  function symbolsN4(word) {
    let newWord;
    for (let i = 0; i < symbols.length; i++) {
      for (let j = 0; j < symbols.length; j++) {
        newWord = symbols[i] + symbols[j] + word;
        wordlist.push(newWord);
      }
    }
  }

  //input: test | output: !test!, !test", !test#..."test!, "test", "test#...
  function symbolsN5(word) {
    let newWord;
    for (let i = 0; i < symbols.length; i++) {
      for (let j = 0; j < symbols.length; j++) {
        newWord = symbols[i] + word + symbols[j];
        wordlist.push(newWord);
      }
    }
  }

  //input: test | output: te$t
  function replaceLettersBySymbols(word) {
    let newWord;
    newWord = word.replace(/s/gi, '$');
    wordlist.push(newWord);
    newWord = word.replace(/a/gi, '@');
    wordlist.push(newWord);
    newWord = word.replace(/o/gi, '@');
    wordlist.push(newWord);
    newWord = word.replace(/e/gi, '3');
    wordlist.push(newWord);
    newWord = word.replace(/i/gi, '!');
    wordlist.push(newWord);
    newWord = word.replace(/l/gi, '!');
    wordlist.push(newWord);
    newWord = word.replace(/o/gi, '0');
    wordlist.push(newWord);
  }

  //format = [word] + [date]
  function dateN1(word, saveInDatesArray) {
    let newWord;
    let date = $('#date').val();

    let yearFormats = [date.slice(0, 4), date.slice(2, 4)];
    let monthFormats = [date.slice(5, 7), date.slice(6, 7)];
    let dayFormats = [date.slice(8, 10), date.slice(9, 10)];

    //input:test | output: test2023-12-05
    newWord = word + date;
    wordlist.push(newWord);

    for (let i = 0; i < 2; i++) {
      //input:test | output: test1999
      newWord = word + yearFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test12
      newWord = word + monthFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test03
      newWord = word + dayFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test28122023
      newWord = word + dayFormats[i] + monthFormats[i] + yearFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test20232812
      newWord = word + yearFormats[i] + dayFormats[i] + monthFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test20231228
      newWord = word + yearFormats[i] + monthFormats[i] + dayFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test12282023
      newWord = word + monthFormats[i] + dayFormats[i] + yearFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test12202328
      newWord = word + monthFormats[i] + yearFormats[i] + dayFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test2812
      newWord = word + dayFormats[i] + monthFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test1228
      newWord = word + monthFormats[i] + dayFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test122023
      newWord = word + monthFormats[i] + yearFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test202312
      newWord = word + yearFormats[i] + monthFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test282023
      newWord = word + dayFormats[i] + yearFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: test202328
      newWord = word + yearFormats[i] + dayFormats[i];
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }
    }
  }

  //format = [date] + [word]
  function dateN2(word, saveInDatesArray) {
    let newWord;
    let date = $('#date').val();

    let yearFormats = [date.slice(0, 4), date.slice(2, 4)];
    let monthFormats = [date.slice(5, 7), date.slice(6, 7)];
    let dayFormats = [date.slice(8, 10), date.slice(9, 10)];

    //input:test | output: 2023-12-05test
    newWord = date + word;
    wordlist.push(newWord);

    for (let i = 0; i < 2; i++) {
      //input:test | output: 1999test
      newWord = yearFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 12test
      newWord = monthFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }
      //input:test | output: 03test
      newWord = dayFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }
      //input:test | output: 28122023test
      newWord = dayFormats[i] + monthFormats[i] + yearFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 20232812test
      newWord = yearFormats[i] + dayFormats[i] + monthFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 20231228test
      newWord = yearFormats[i] + monthFormats[i] + dayFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 12282023test
      newWord = monthFormats[i] + dayFormats[i] + yearFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 12202328test
      newWord = monthFormats[i] + yearFormats[i] + dayFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 2812test
      newWord = dayFormats[i] + monthFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 1228test
      newWord = monthFormats[i] + dayFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 122023test
      newWord = monthFormats[i] + yearFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 202312test
      newWord = yearFormats[i] + monthFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 282023test
      newWord = dayFormats[i] + yearFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }

      //input:test | output: 202328test
      newWord = yearFormats[i] + dayFormats[i] + word;
      wordlist.push(newWord);
      if (saveInDatesArray) {
        wordlist_wordsWithDates.push(newWord);
      }
    }
  }

  // format = [date] + word + [date]
  function dateN3(word) {
    let newWord;
    let date = $('#date').val();

    let yearFormats = [date.slice(0, 4), date.slice(2, 4)];
    let monthFormats = [date.slice(5, 7), date.slice(6, 7)];
    let dayFormats = [date.slice(8, 10), date.slice(9, 10)];

    //input: test | output: 2023-12-28test2023-12-28
    newWord = date + word + date;
    wordlist.push(newWord);

    for (let i = 0; i < 2; i++) {
      //input: test | output: 28test28
      newWord = dayFormats[i] + word + dayFormats[i];
      wordlist.push(newWord);

      //input: test | output: 12test12
      newWord = monthFormats[i] + word + monthFormats[i];
      wordlist.push(newWord);

      //input: test | output: 2023test2023
      newWord = yearFormats[i] + word + yearFormats[i];
      wordlist.push(newWord);

      //input: test | output: 28test12
      newWord = dayFormats[i] + word + monthFormats[i];
      wordlist.push(newWord);

      //input: test | output: 12test28
      newWord = monthFormats[i] + word + dayFormats[i];
      wordlist.push(newWord);

      //input: test | output: 28test2023
      newWord = dayFormats[i] + word + yearFormats[i];
      wordlist.push(newWord);

      //input: test | output: 2023test28
      newWord = yearFormats[i] + word + dayFormats[i];
      wordlist.push(newWord);

      //input: test | output: 12test2023
      newWord = monthFormats[i] + word + yearFormats[i];
      wordlist.push(newWord);

      //input: test | output: 2023test12
      newWord = yearFormats[i] + word + monthFormats[i];
      wordlist.push(newWord);

      //input: test | output: 2812test2023
      newWord = dayFormats[i] + monthFormats[i] + word + yearFormats[i];
      wordlist.push(newWord);

      //input: test | output: 1228test2023
      newWord = monthFormats[i] + dayFormats[i] + word + yearFormats[i];
      wordlist.push(newWord);

      //input: test | output: 282023test12
      newWord = dayFormats[i] + yearFormats[i] + word + monthFormats[i];
      wordlist.push(newWord);

      //input: test | output: 202328test12
      newWord = yearFormats[i] + dayFormats[i] + word + monthFormats[i];
      wordlist.push(newWord);

      //input: test | output: 202312test28
      newWord = yearFormats[i] + monthFormats[i] + word + dayFormats[i];
      wordlist.push(newWord);

      //input: test | output: 122023test28
      newWord = monthFormats[i] + yearFormats[i] + word + dayFormats[i];
      wordlist.push(newWord);

      //input: test | output: 2023test2812
      newWord = yearFormats[i] + word + dayFormats[i] + monthFormats[i];
      wordlist.push(newWord);

      //input: test | output: 2023test1228
      newWord = yearFormats[i] + word + monthFormats[i] + dayFormats[i];
      wordlist.push(newWord);

      //input: test | output: 12test282023
      newWord = monthFormats[i] + word + dayFormats[i] + yearFormats[i];
      wordlist.push(newWord);

      //input: test | output: 12test202328
      newWord = monthFormats[i] + word + yearFormats[i] + dayFormats[i];
      wordlist.push(newWord);

      //input: test | output: 28test202312
      newWord = dayFormats[i] + word + yearFormats[i] + monthFormats[i];
      wordlist.push(newWord);

      //input: test | output: 28test122023
      newWord = dayFormats[i] + word + monthFormats[i] + yearFormats[i];
      wordlist.push(newWord);
    }
  }

  function firstLetterCapitalizedAndTheOriginalWord(word) {
    let newWord;
    newWord = word.charAt(0).toUpperCase() + word.slice(1);
    wordlist_basicWords.push(newWord);
    wordlist_basicWords.push(word);
  }

  function showOutput() {
    let listWithUniqueValues = Array.from(new Set(wordlist));
    finalList = listWithUniqueValues.join('\n');
    let showPreview = listWithUniqueValues.slice(0, 25).join('\n');
    let results = listWithUniqueValues.length;

    $('#output').val(
      showPreview + '\n\n' + '(PREVIEW, PLEASE DOWNLOAD THE LIST)'
    );
    $('#results').text('Results: ' + results);
    $('#results').show();
  }
});
