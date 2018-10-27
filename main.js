const { PerformanceObserver, performance } = require('perf_hooks');
const hmm = require('./hmm');
const rule = require('./rule');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let previousTag = '';

// building matrix model
function matrixModel(sentence){

  let result = new Array();
  let LSekuens = sentence.length;
  let matrix = new Array( LSekuens );

  for(let i = 0; i < LSekuens; i++){

    let tagProbabilities = new Array();
    for (let listtag of hmm.listTagsetWord( sentence[i] )) {

      if( i == 0) previousTag = 'start';

      let argmax = hmm.argmax(sentence[i], listtag, previousTag);
      tagProbabilities.push([listtag, argmax]);
    }
    previousTag = bestTag(tagProbabilities);
    result.push([sentence[i], previousTag]);
  }

  return result;
}

// best probability of tag
function bestTag(tagProbabilities){
  let best_tag = '';
  let best_prob = 0;
  if (tagProbabilities.length == 1) {
    best_tag = tagProbabilities[0][0];
  }else {
    for(let i = 0; i < tagProbabilities.length; i++){
      if (tagProbabilities[i][1] >= best_prob) {
        best_tag = tagProbabilities[i][0];
        best_prob = tagProbabilities[i][1];
      }
    }
  }
  return best_tag;
}

// input and output
rl.question('Input : ', (answer) => {
  let t0 = performance.now();
  let sentence = answer.split(' ');
  
  console.log('Please wait...');

  let result = matrixModel(sentence);
  console.log('POS Tagger : ');
  console.log(result);
  
  console.log('TREE : ');
  console.log(rule.tree( result ) );

  let t1 = performance.now();
  console.log('Execution Time : '+(t1-t0));

  rl.close();
});
