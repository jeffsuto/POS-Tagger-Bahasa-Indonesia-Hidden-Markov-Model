const fs = require('fs');

let sentence;
let wordtag = new Array();
let tagset = new Set();

// Read file corpus and storing to variable sentence
sentence = fs.readFileSync('lexicon.txt', 'utf-8').split('\n');

// Tokenize sentence to word and tag
for(let i = 0; i < sentence.length; i++){
  let t = sentence[i].split(' ');
  t.unshift('START/start');
  wordtag.push(t);
}

// Module exports
module.exports = {

  frequencyOfCorpus : function (word, tag, previous){

    let WORDTAG     = 0,
        TAG         = 0,
        PREVIOUS_TAG = 0,
        WORD_WITH_TAG = 0,
        TAG_WITH_PREVIOUS_TAG = 0;

    for (var i = 0; i < wordtag.length; i++) {
      for (var j = 1; j < wordtag[i].length - 1; j++) {

        let temp = wordtag[i][j].split('/');
        let prev = wordtag[i][j-1].split('/');

        // counting frequency of wordtag
        WORDTAG++;

        // counting frequency of tag
        if(tag == temp[1])
          TAG++;

        // counting frequency of previous tag
        if(previous == prev[1])
          PREVIOUS_TAG++;

        // counting frequency of word with tag
        if(word.toLowerCase() == temp[0].toLowerCase() && tag == temp[1])
          WORD_WITH_TAG++;

        // counting frequency of tag
        if(tag == temp[1] && previous == prev[1])
          TAG_WITH_PREVIOUS_TAG++;

      }
    }

    let frequency = {
      'WORDTAG' : WORDTAG,
      'TAG'     : TAG,
      'PREVIOUS_TAG' : PREVIOUS_TAG,
      'WORD_WITH_TAG': WORD_WITH_TAG,
      'TAG_WITH_PREVIOUS_TAG' : TAG_WITH_PREVIOUS_TAG
    }
    return frequency;
  },

  // Get list of tagset
  listOfTagset : function(word){

    for(let i = 0; i < wordtag.length; i++){
      for(let j = 0; j < wordtag[i].length - 1; j++){

        // Tokenize between word and tag
        let t = wordtag[i][j].split('/');

        // make tagset
        if( word.toLowerCase() == t[0].toLowerCase() && t[1] !== undefined ){
          tagset.add(t[1]);
        }
      }
    }

    return tagset;
  }
};
