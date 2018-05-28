function get_class_string (val:any) : string {
  return Object.prototype.toString.call(val);
}

export function warn (error_text:string, is_warn = false) : void {
  const message = `${error_text} --- from input-range.js.`;

  if (!is_warn) {
    throw Error(message);
  }
  console.warn(message);
}

// only loop own property
export function is_empty_obj (obj:any) : boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export function is_string (string:any) : boolean {
  return get_class_string(string) === '[object String]';
}

export function is_number (number:any) : boolean {
  return get_class_string(number) === '[object Number]';
}