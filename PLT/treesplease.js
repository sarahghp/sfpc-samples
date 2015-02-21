// Access functions & scope

var specialForms = {
  'if': function (args) { 
    if (evaluate(args[0])){
      return evaluate(args[1]);
    } else {
      return evaluate(args[2]);
    }
  }

  ,
  'let': function (args){ 
    var flatArgs = _.flatten(args);
    return specialForms.assignment(flatArgs[0], flatArgs.slice(1));
  },

  'assignment': function (assign, rest, scoped) {
    // the first expression following 'let' MUST be a binding

    var variable = assign.expressions[0].expressions,
        value = assign.expressions[1],
        // scoped = scoped || false,
        userScope = scopes['user'],
        thisScope = userScope[userScope.length - 1]; 

    // put identity in current scope or create new scope and add

    if (scoped) {
      thisScope[variable] = value;
    } else {
      userScope.push({});
      thisScope[variable] = value; 
    }
      
    // iterate through all assignments before then evaluate other expressions

    if(rest.length && rest[0].operator === 'assignment'){
      return specialForms.assignment(rest[0], rest.slice(1), true);
    } else {
      return moveOverArgs([], rest);
    }
  },

  'var': lookup;
};

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
    }

  },

  'user': [ ] // user-defined scopes
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


function lookup(args, scope){

  var scope = scope;  

  var res = (function checkScope(check){
    if (check >= 0){
      if (scopes.user[scope][args]){
        return scopes.user[scope][args];
      } else {
        return checkScope(scope--);
      }
    } else {
    return 'Reference error. There is no variable ' + args + '. '
    }
  })(scope);

  return res;
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
    return special(ast.expressions, scope);
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