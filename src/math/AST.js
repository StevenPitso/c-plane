// immutable expression tree nodes.

// Every node has a `type` and a `toString()` for debugging.

// The Evaluator (Step 7) will walk this tree; the Derivative (Step 11) will transform it.

export const Node = {

  Number(value)   { return { type: 'Number',   value }; },
  Variable(name)  { return { type: 'Variable', name }; },

  Constant(name)  { return { type: 'Constant', name }; },
  Unary(op, operand)      { return { type: 'Unary', op, operand }; },

  Binary(op, left, right) { return { type: 'Binary', op, left, right }; },
  Call(name, args)        { return { type: 'Call', name, args }; },

};

// Pretty-print an AST for debugging. Not part of the evaluator path.
export function astToString(node, indent = 0) {

  const pad = '  '.repeat(indent);

  switch (node.type) {
    case 'Number':
      return `${pad}Number(${node.value})`;

    case 'Variable':
      return `${pad}Variable(${node.name})`;

    case 'Constant':
      return `${pad}Constant(${node.name})`;

    case 'Unary':
      return `${pad}Unary(${node.op})\n${astToString(node.operand, indent + 1)}`;

    case 'Binary':
      return `${pad}Binary(${node.op})\n${astToString(node.left, indent + 1)}\n${astToString(node.right, indent + 1)}`;

    case 'Call':
      return `${pad}Call(${node.name})\n${node.args.map(a => astToString(a, indent + 1)).join('\n')}`;

    default:
      return `${pad}Unknown(${node.type})`;

  }


}


