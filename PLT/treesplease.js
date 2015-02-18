// Access functions & scope

var specialForms = {
  'if': conditional,
  'let': let,
  'assignment': assignment
};


var builtIns = {
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
    return ''+ args.slice(0, -1); // remove comma
  }

};

var scopes = { }; // to hold any created scopes

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

function moveOverAssignment(currentArr, arr){

  var expression = arr[0];
  expression = replaceVars(expression, Object.keys(scopes));
  currentArr.push(evaluate(PLT.parser.parse(expression)));

  var remainingArr = arr.slice(1);
  if (remainingArr.length > 0){
    return moveOverAssignment(currentArr, remainingArr);
  } else {
    return currentArr.join(", ");
  }
}

function replaceVars(expression, keys){

  var key = keys[0];
  expression = expression.replace(key, '"' + scopes[key] + '"');

  var remainingKeys = keys.slice(1);
  if (remainingKeys.length > 0){
    return replaceVars(expression, remainingKeys);
  } else {
    return expression;
  }
}

function unpackAssignment(assignmentArr){
  for (var i=0; i < assignmentArr.length; i++){
    assignment(assignmentArr[i].left, assignmentArr[i].right);
  }
  return true;
}

function conditional(operator, args) { 
  if (args[0]){
    return evaluate(args[1]);
  } else {
    return evaluate(args[2]);
  }
}

function let(operator, args) {
  return moveOverAssignment([], args.slice(1)); // first arg from let returns true 
}

function assignment(a, b) {
  scopes[a] = b;
}

function infix (operator, args) {
  args = moveOverArgs([], args);
  return eval(args.join(operator));
}

// Evaluation

var evaluate = function(ast, scope) {

  var unpacked = (function unpack(left, right) {

    if (ast.operator === 'let'){
      left = unpackAssignment(left);
    } else if (typeof left === 'object'){
      left = evaluate(left);
    } else {
      left = left;
    }

    var args = [];
    args.push(left);
    return args.concat(right);

  })(ast.left, ast.right);

  var special = specialForms[ast.operator],
      builtIn = builtIns['' + ast.operator],
      scope = scopes[scope];

  // console.log(special, builtIn, scope);

  if (special) {
    return special(ast.operator, unpacked);
  } else if (builtIn) {
    return builtIn(ast.operator, unpacked);
  } else if (scope) {
    return scope[ast.operator](ast.operator, unpacked);
  } else {
    return "Reference error. " + ast.operator + " is not defined."
  }

};

// Run function

var run = function(source) {
  var ast = PLT.parser.parse(source);
  return evaluate(ast);
};