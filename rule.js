module.exports = {
  tree : function(sentence){

    /*
    *   Pola - 1 : Subjek didepan
    *   Pola - 2 : Keterangan didepan
    * 
    */

    let result = new Array();
    let sub = new Array();
    let pre = new Array();
    let obj = new Array();
    let ket = new Array();

    let flag = '', pola = '';

    for (let i = 0; i < sentence.length; i++) {

      let word = sentence[i][0];
      let tag = sentence[i][1];
      let lefttag = '';
      let righttag = '';
      try {
        lefttag = sentence[i-1][1];
        righttag = sentence[i+1][1];
      } catch (error) {}

      // penentuan pola kalimat
      if ( i == 0 && isNoun(tag) )
      {
        pola = 1;
        flag = 'S';
        sub.push( [word, tag] );
        continue;
      }
      else if (i == 0 && isPreposition( tag ))
      {
        pola = 2;
        flag = 'K';
        ket.push( [word, tag] );
        continue;
      }
      // /penentuan pola kalimat

      switch (pola) {
        case 1:
          
          /*
          *   SUBJEK
          */
          // jika masih dalam lingkup subjek dan kelas kata selain verba, maka termasuk subjek 
          if ( flag == 'S' && !isVerb(tag) )
          {
            if ( isAdverb( tag ) || isModal( tag ) || isNegation( tag ) || isNumerals( tag )) 
            {
              flag = 'P';
              pre.push( [word, tag] );
            }
            else
            {
              sub.push( [word, tag] );

              // jika determinan, maka selanjutnya adalah predikat
              if ( isDeterminer( tag ) )
              {
                flag = 'P';
              }
            }
          }

          /*
          *   PREDIKAT
          */
          // jika masih dalam lingkup subjek atau predikat dan kelas kata verba atau adjektiva atau nomina yang
          // kelas kata sebelumnya determiner atau numeralia, maka termasuk predikat
          else if ( (flag == 'S' || flag == 'P') && isVerb( tag ) || isAdjective( tag ) || isNumerals( tag ) ||
                    ( isNoun( tag ) && isPredicateGroup( lefttag ) ) )
          {
            flag = 'P';
            pre.push( [word, tag] );
            
            // jika kelas kata verba dan kelas kata setelahnya adalah nomina, maka selanjutnya adalah objek
            if ( isVerb( tag && isNoun( righttag ) ) ) {
              flag = 'O';
              continue;
            }
          }

          /*
          *   OBJEK
          */
          // jika masih dalam lingkup predikat atau predikat dan selain kelas kata verba, maka termasuk objek
          else if ( (flag == 'P' || flag == 'O') && !isVerb( tag ) )
          {
            flag = 'O';

            // jika bukan kata konjungsi, maka termasuk objek
            if ( !isPreposition( tag ) )
            {
              obj.push( [word, tag] );
            }

            // jika termasuk kata konjungsi, maka termasuk keterangan
            else
            {
              flag = 'K';
              ket.push( [word, tag] );
              continue;
            }
          }

          /*
          *   KETERANGAN
          */
          // jika masih dalam lingkup Keterangan dan diawali kelas kata konjungsi atau nomina, maka termasuk keterangan
          else if ( flag == 'K' && isNoun( tag ) || isPreposition( tag ) )
          {
            ket.push( [word, tag] )
          }

          break;
        
        case 2 :
          
          // jika masih dalam lingkup keterangan dan kelas kata selain kata kerja, maka termasuk keterangan
          if ( flag == 'K' && !isVerb( tag ) ) 
          {
            flag = 'K';
            ket.push( [word, tag] ); 
            if ( isPreposition( tag ) && isVerb( righttag )) 
            {
              flag = 'P';  
            } 
          }
          
          // TOBE CONTINUE ....

          break;

        default:
          break;
      }

    }

    if (sub.length != 0 && pre.length != 0 && obj.length == 0 && ket.length == 0) 
    {
      result = {
        'SUBJEK' : sub,
        'PREDIKAT' : pre
      };
    }
    else if (sub.length != 0 && pre.length != 0 && obj.length != 0 && ket.length == 0) 
    {
      result = {
        'SUBJEK' : sub,
        'PREDIKAT' : pre,
        'OBJEK' : obj
      };
    }
    else if (sub.length != 0 && pre.length != 0 && obj.length != 0 && ket.length != 0)
    {
      result = {
        'SUBJEK' : sub,
        'PREDIKAT' : pre,
        'OBJEK' : obj,
        'KETERANGAN' : ket
      };
    }
    else
    {
      result = {
        'SUBJEK' : sub,
        'PREDIKAT' : pre,
        'OBJEK' : obj,
        'KETERANGAN' : ket
      };
    }
    
    return result;
  }
};



function isPredicateGroup(tag){

  if ( isModal(tag) || isAdverb(tag) || isNegation(tag) || isDeterminer(tag) ) {
    return true;
  }else{
    return false;
  }
}

function isModal(tag) {
  
  if (tag == 'md')
    return true;
  else 
    return false;
}

// negasi / penolakan
function isNegation(tag) {
  
  if (tag == 'neg')
    return true;
  else 
    return false;
}

// adverbia 
function isAdverb(tag){

  if (tag == 'rb') {
    return true;
  }else{
    return false;
  }
}

// determiner
function isDeterminer(tag) {
  
  if (tag == 'dt') {
    return true;
  }else{
    return false;
  }
}

// numeralia
function isNumerals(tag){

  if (tag == 'cdp'){
    return true;
  }else{
    return false;
  }
}

// adjektiva
function isAdjective(tag){

  if (tag == 'jj') {
    return true;
  }else{
    return false;
  }
}

// konjungsi
function isConjunction(tag){

  if (tag == 'cc') {
    return true;
  }else{
    return false;
  }
}

// preposisi
function isPreposition(tag){
  
  if(tag == 'in')
    return true;
  else
    return false;
}

// nomina
function isNoun(tag){
  let flag = 0;
  let nountag = [ 'nn', 'nnc', 'nnu', 'nnp', 'prp', 'prp', 'prn' ];

  for (var i = 0; i < nountag.length; i++) {
    if (tag == nountag[i]){
      flag = 1;
      break;
    }
  }

  if(flag > 0) return true;
  else return false;
}

// verbia
function isVerb(tag){
  let flag = 0;
  let verbtag = [ 'vb', 'vbt', 'vbi' ];

  for (var i = 0; i < verbtag.length; i++) {
    if (tag == verbtag[i]){
      flag = 1;
      break;
    }
  }

  if(flag > 0) return true;
  else return false;
}


