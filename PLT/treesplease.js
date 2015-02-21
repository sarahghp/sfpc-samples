// Access functions & scope

var specialForms = {
  'if': conditional,
  'let': let,

  'assignment': function (assign, rest) { // here as dispatched from let > evaluate
    var variable = assign.expressions[0].expressions;
    scopes['user'][variable] = assign.expressions[1];

    // iterate through all assignments before then evaluate other expressions

    if(rest.length && rest[0].operator === 'assignment'){
      specialForms.assignment(rest[0], rest.slice(1));
    } else {
      return moveOverArgs([], rest);
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
      var args = moveOverArgs([], args);
      return eval(args.join('==='));
    },
    
    'print': function (operator, args) {
      var args = moveOverArgs([], args);
      return args.join('');
    },

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
  return specialForms.assignment(flatArgs[0], flatArgs.slice(1));
}

function lookup(operator, args){
  // find var, return it
  console.log('lookup called');
  
  if (scopes.user[args]){
    return scopes.user[args];
  } else {
    return 'Reference error. There is no variable ' + args + '. ';
  }
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

  console.log(ast, ast.operator, scope);

  if (special) {
    return special(ast.operator, ast.expressions);
  } else if (func) {
    return func(ast.operator, ast.expressions);
  } else {
    return "Reference error: " + ast.operator + " is not defined."
  }

};

// Run function

var run = function(source) {
  var ast = PLT.parser.parse(source);
  return evaluate(ast);
};