import { Slide } from './index';

export function warn (ctx:Slide | null, error_text:string | Error, is_warn = false) : void {
  const handle_error = ctx ? ctx.onerror : null;
  if (error_text instanceof Error) {
    error_text.message = `[InputRange tip]: ${error_text.message}.`;
    send_warn(<any>error_text, handle_error, is_warn);
    return;
  }

  const message = `${error_text}.`;

  try {
    throw Error(message);
  } catch (err) {
    send_warn(err, handle_error, is_warn);
  }
}

function send_warn ({ message, stack = '' }, handle_error, is_warn) : void {
  const _stack = get_error_stack(stack);
  let err_str = `[InputRange tip]: ${message}\n\n`;

  for (let i = 0; i < _stack.length; i++) {
    const { method, detail } = _stack[i];
    err_str += `${'\u0020'.repeat(i * 2)}[${method}] ---> ${detail}\n`;
  }

  if (handle_error && handle_error(message, _stack, err_str) !== false) {
    return;
  }

  if (!is_warn) {
    throw err_str;
  }

  console.warn(err_str);
}

export type StackDetail = {
  method: string;
  detail: string;
}

function get_error_stack (stack_msg) : StackDetail[] {
  if (!stack_msg) { return []; }
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
    return { method: 'native code', detail: info };
  }

  return {
    method: match[2] || 'anonymous',
    detail: match[
      is_chorme ? 4 : 3
    ],
  }
}