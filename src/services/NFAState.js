 export default class NFAState {
   constructor(id, isAccept) {
     this.id = id;
     this.isAccept = isAccept;
     this.nextStates = [];
   };

   addStates(token, state) {
     this.nextStates.push([token, state]);
   }
 }