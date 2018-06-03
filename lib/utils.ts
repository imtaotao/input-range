function get_class_string (val:any) : string {
  return Object.prototype.toString.call(val);
}

// only loop own property
export function is_empty_obj (obj:Object) : boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export function bind (fn:Function, ctx:Object) : Function {
  function boundFn (a) {
    const l: number = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx);
  }
  // record original fn length
  (<any>boundFn)._length = fn.length;
  return boundFn;
}

export function random_num (min = 0, max = 100000) : number {
  return parseInt(<any>(Math.random() * (max - min + 1) + min));
}

export function is_undef (val:any) : boolean {
  return val === undefined || val === null;
}

export function is_string (string:any) : boolean {
  return get_class_string(string) === '[object String]';
}

export function is_number (number:any) : boolean {
  return get_class_string(number) === '[object Number]';
}

export function is_boolen (boolean:any) : boolean {
  return get_class_string(boolean) === '[object Boolean]';
}