import symbols from "../symbols.json";

export class board {    
    getSymbols(matches){
        const sym1 = [], sym2 = [];
        let match = {};

        //generate a random symbol & push if unique until sym1 has 6 symbols 
        do { 
            const random1 = this.pickRandom(symbols);
            if (sym1.indexOf(random1)===-1) sym1.push(random1);
        } while (sym1.length < 6);

        //randomly pick one symbol from sym1 and push to sym2
        do {
            const random2 = this.pickRandom(sym1);
            if (matches.indexOf(random2)===-1) sym2.push(random2);
        } while (sym2.length < 1);
        
        //generate a random symbol & push if unique until sym2 has 6 symbols
        do {  
            const random3 = this.pickRandom(symbols);
            if (sym1.indexOf(random3) === -1 && sym2.indexOf(random3) === -1) 
            {
                sym2.push(random3);
                match = random3;
            }
        } while (sym2.length < 6);
        
        return {
            sym1,
            //shuffle array otherwise match will always be first item in sym2
            sym2: this.shuffleArray(sym2),
            match
        };
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

 