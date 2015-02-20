// Access functions & scope

var specialForms = {
  'if': conditional,
  'let': let,

  'assignment': function (assign, rest) { // here as dispatched from let > evaluate
        var variable = assign.expressions[0].expressions; // only possible return structure from grammar for an assignment 
        console.log('assignment args: ', assign, rest);
        scopes['user'][variable] = assign.expressions[1];
        console.log(scopes['user']); 


        // iterate through all assignments before evaluating other expressions

        if(rest[0].operator === 'assignment'){
          specialForms.assignment(rest[0], rest.slice(1));
        } else {
          _.forEach(rest, evaluate);
        }
    },

  'var': lookup
}

var scopes = { 

  'built-in': {
    '+': infix,
    '-': infix,
    '*': infix,
    '<': infix,
    '>': infix,

    '=': function (operator, args) {
      args = moveOverArgs([], args);
      return eval(args.join('==='));
    },
    
    'print': function (operator, args) {
      return args.join('');
    },

    // 'lookup': function(exp) { // here as dispatched from let > evaluate
    //    // if there are two args it is an assignment, if not it is a retreival/lookup 
    // }
  },

  'user': { } // user-defined scope, hardcoded for now

}; 

// Utility functions

function moveOverArgs(currentArr, arr) {
  typeof arr[0] === 'object' ? currentArr.push(evaluate(arr[0])) : currentArr.push(arr[0]);
  
  var remainingArr = arr.slice(1);
  if (remainingArr.length > 0) { 
    return moveOverArgs(currentArr, remainingArr);
  } else {
    return currentArr;
  }
}

// function moveOverAssignment(currentArr, arr){

//   var expression = arr[0];
//   expression = replaceVars(expression, Object.keys(scopes));
//   currentArr.push(evaluate(PLT.parser.parse(expression)));

//   var remainingArr = arr.slice(1);
//   if (remainingArr.length > 0){
//     return moveOverAssignment(currentArr, remainingArr);
//   } else {
//     return currentArr.join(", ");
//   }
// }

// function replaceVars(expression, keys){

//   var key = keys[0];
//   expression = expression.replace(key, '"' + scopes[key] + '"');

//   var remainingKeys = keys.slice(1);
//   if (remainingKeys.length > 0){
//     return replaceVars(expression, remainingKeys);
//   } else {
//     return expression;
//   }
// }

// function unpackAssignment(assignmentArr){
//   for (var i=0; i < assignmentArr.length; i++){
//     assignment(assignmentArr[i].left, assignmentArr[i].right);
//   }
//   return true;
// }

function conditional(operator, args) { 
  if (evaluate(args[0])){
    return evaluate(args[1]);
  } else {
    return evaluate(args[2]);
  }
}

function let(operator, args) {
  // flatten array 1 level & evaluate

  var flatArgs = _.flatten(args);

  console.log('flat args:', flatArgs);
  console.log('flat args sliced:', flatArgs.slice(1));

  specialForms.assignment(flatArgs[0], flatArgs.slice(1));



  // dispatch args — if there are two args it is an assignment, if not it is a retreival/lookup <- put in lookup?
  // return moveOverAssignment([], args.slice(1)); // first arg from let returns true 
}

// function assignment(a, b) {
//   scopes[a] = b;
// }

function lookup(operator, args){
  // find var, return it
}

function infix (operator, args) {
  args = moveOverArgs([], args);
  return eval(args.join(operator));
}

// Evaluation

var evaluate = function(ast, scope) {

  // Check first that on recursion we haven't just received a scalar value that can be returned

  if(!(ast && typeof ast === 'object')) {
    return ast;
  }

  // Then set scope & evaluate

  var scope = scope || 'built-in',
      special = specialForms[ast.operator],
      func = scopes[scope][ast.operator];

  console.log(ast.operator, scope, func);

  if (special) {
    return special(ast.operator, ast.expressions);
  } else if (func) {
    return func(ast.operator, ast.expressions);
  } else {
    return "Reference error. " + ast.operator + " is not defined."
  }

};

// Run function

var run = function(source) {
  var ast = PLT.parser.parse(source);
  return evaluate(ast);
};