

/*

  This file will contain the functionality of classifying the user input .
  this is called the encoder for now .

  
  [* , / , + , -];

  charAt(2)
  .slice(s,end);
  .concat('string')
  .split('', 5)
  .substring(nstarts, nends);
  .trimstart();
  .Number(n)
  .isNaN

*/

let input = '';



function ReadInput(input){

  let process1 = input.split('', input.length);
  console.log(process1)
  let process2 = []
  for(let i = 0; i < process1.length; i++){
    let x = classifyIN(process1[i], process1)
   process2.push(x)
  }
  console.log(process2)

}
function classifyIN(input, listInputs){
   
 
  if(!isNaN(Number(input))){
     return Number(input)
  }else{

    if( input == 'x'){
       return 'x'
    }else{
      let operation = ['+', '-', '*', '/']
      operation = operation.filter((o) => (o == input))
      return operation[0]
    }

  }
}
ReadInput(input)


