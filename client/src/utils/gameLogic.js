import symbols from "../symbols.json";

export class board {    
    getSymbols(matches){
        const sym1 = [], sym2 = [];
        let match = {}, clear = false;

        //Pick random symbol that is not in the matches array and add it to each array
        do {
            const random = this.pickRandom(symbols);
            if (matches.indexOf(random)===-1) 
            {
                //Object.assign({},this.pickRandom(symbols)) ==> Prevent unintentional link (Play Page)
                sym1.push(random);
                sym2.push(Object.assign({},random));
                match = random;
            }
            if (matches.length >= symbols.length)
            {
                
                console.log(matches.length);
                matches = [];
                console.log("call clear matches");
                clear = true;
                //clear();
                //if matches.length === symbols.length clear the matches array
                //(pass a function from parent component in order to clear state) 
            }
        } while (sym1.length < 1 && sym2.length < 1);

        //generate a random symbol & push if unique until sym1 has 6 symbols 
        do { 
            const random1 = this.pickRandom(symbols);
            if (sym1.indexOf(random1)===-1) sym1.push(random1);
        } while (sym1.length < 6);

        //generate a random symbol & push if unique until sym2 has 6 symbols
        do {  
            const random2 = this.pickRandom(symbols);
            if (sym1.indexOf(random2) === -1 && sym2.indexOf(random2) === -1) sym2.push(random2);
        } while (sym2.length < 6);
        
        return {
            //shuffle array otherwise match will always be first item 
            sym1: this.shuffleArray(sym1),            
            sym2: this.shuffleArray(sym2),
            match,
            clear
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

 