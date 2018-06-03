export function warn (error_text:string, is_warn = false) : void {
  const message = `${error_text} --- from input-range.js.`;

  try {
    throw Error(message);
  } catch (err) {
    send_warn(err, is_warn);
  }
}

function send_warn ({ message, stack }, is_warn) : void {
  const _stack = get_error_stack(stack);
  const space = '\u0020'.repeat(4);
  let err_str = `[tip]: ${message}\n\n`;

  for (const { method, detail } of _stack) {
    err_str += `${space}[${method}] ---> ${detail}\n`;
  }

  if (!is_warn) {
    throw err_str;
  }

  console.warn(err_str);
}

type StackDetail = {
  method: string;
  detail: string;
}
function get_error_stack (stack_msg) : StackDetail[] {
  const arr = stack_msg.replace(/↵/g, '\n').split('\n');
  const stack:StackDetail[] = [];

  for (const e of arr) {
    if (!e || e.slice(0, 5) === 'Error') { continue; }

    stack.push(get_match(e, ~e.indexOf('at')));
  }

  return stack;
}

function get_match (info:string, is_chorme:number) : StackDetail {
  const match = is_chorme
    ? /\s*at\s(([^\s]+)(\s\())?([^\(\)]+)\)?/g.exec(info)
    : /((.+)@)?(.+)\n?/g.exec(info);

  if (!match) {
    return { method: '', detail: info };
  }

  return {
    method: match[2] || ' ',
    detail: match[
      is_chorme ? 4 : 3
    ],
  }
}