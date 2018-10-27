const corpus = require('./corpus');

module.exports = {

  argmax : function(word, tag, previousTag){

    let frequency = corpus.frequencyOfCorpus(word, tag, previousTag);

    let likehood = (frequency['WORD_WITH_TAG'] / frequency['WORDTAG']) / (frequency['TAG'] / frequency['WORDTAG']);

    let prior = (frequency['TAG_WITH_PREVIOUS_TAG']/ frequency['WORDTAG']) / (frequency['PREVIOUS_TAG']/ frequency['WORDTAG']);

    return likehood*prior;
  },

  listTagsetWord : function(word){
    
    return corpus.listOfTagset(word);
  }

};
