import symbols from "../symbols.json";

export class board {    
    getSymbols(matches){
        const sym1 = [], sym2 = [];
        let match = {};

        //Reevaluate .... generate random symbol not in matches array 
        //Object.assign({},this.pickRandom(symbols)) ==> Prevent unintentional link (Play Page)
        //and push to both arrays to prevent infinite loop
        //if matches.length === symbols.length clear the matches array 
        //(pass a function from parent component in order to clear state) 

        //generate a random symbol & push if unique until sym1 has 6 symbols 
        do { 
            const random1 = this.pickRandom(symbols);
            if (sym1.indexOf(random1)===-1) sym1.push(random1);
        } while (sym1.length < 6);

        //randomly pick one symbol from sym1 and push to sym2
        do {
            const random2 = this.pickRandom(sym1);
            if (matches.indexOf(random2)===-1) 
            {
                sym2.push(Object.assign({},random2));
                match = random2;
            }
        } while (sym2.length < 1);
        
        //generate a random symbol & push if unique until sym2 has 6 symbols
        do {  
            const random3 = this.pickRandom(symbols);
            if (sym1.indexOf(random3) === -1 && sym2.indexOf(random3) === -1) sym2.push(random3);
            
        } while (sym2.length < 6);
        
        return {
            //shuffle array otherwise match will always be first item 
            sym1: this.shuffleArray(sym1),            
            sym2: this.shuffleArray(sym2),
            match
        };
    };

    getAnswers(match, others){
        //generate array with the match and 7 other randomly selected symbols
        const array = [match];
        do { 
            const random = this.pickRandom(others);
            if (array.indexOf(random)===-1) array.push(random);
        } while (array.length < 8);

        return this.shuffleArray(array);
    };

    pickRandom(arr){
        const index = Math.floor(Math.random() * (arr.length));
        return arr[index];
    };

    shuffleArray(arr){
        let i = 0, j = 0, temp = null;

        for (i = arr.length - 1; i > 0; i -= 1) 
        {
          j = Math.floor(Math.random() * (i + 1));
          temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }

        return arr;
    };
}

 