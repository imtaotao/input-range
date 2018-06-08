export function warn(error_text, is_warn = false) {
    const message = `${error_text} --- from input-range.js.`;
    if (!is_warn) {
        try {
            throw Error(message);
        }
        catch (err) {
            send_warn(err, is_warn);
        }
    }
}
function send_warn({ message, stack }, is_warn) {
    const _stack = get_error_stack(stack);
    const space = '\u0020'.repeat(4);
    let err_str = `[tip]: ${message}\n\n`;
    for (const { method, detail } of _stack) {
        err_str += `${space}[${method}] ---> "${detail}"\n`;
    }
    if (!is_warn) {
        throw err_str;
    }
    console.warn(err_str);
}
function get_error_stack(stack_msg) {
    const arr = stack_msg.replace(/↵/g, '\n').split('\n');
    const stack = [];
    for (const e of arr) {
        if (!e || e.slice(0, 5) === 'Error') {
            continue;
        }
        stack.push(get_match(e, ~e.indexOf('at')));
    }
    return stack;
}
function get_match(info, is_chorme) {
    const match = is_chorme
        ? /\s*at\s(([^\s]+)(\s\())?([^\(\)]+)\)?/g.exec(info)
        : /((.+)@)?(.+)\n?/g.exec(info);
    if (!match) {
        return { method: '', detail: info };
    }
    return {
        method: match[2] || ' ',
        detail: match[is_chorme ? 4 : 3],
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvZGVidWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxlQUFnQixVQUFpQixFQUFFLE9BQU8sR0FBRyxLQUFLO0lBQ3RELE1BQU0sT0FBTyxHQUFHLEdBQUcsVUFBVSwyQkFBMkIsQ0FBQztJQUV6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUM7WUFDSCxNQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNiLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUIsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQsbUJBQW9CLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU87SUFDN0MsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakMsSUFBSSxPQUFPLEdBQUcsVUFBVSxPQUFPLE1BQU0sQ0FBQztJQUV0QyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEMsT0FBTyxJQUFJLEdBQUcsS0FBSyxJQUFJLE1BQU0sV0FBVyxNQUFNLEtBQUssQ0FBQztJQUN0RCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2IsTUFBTSxPQUFPLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQU1ELHlCQUEwQixTQUFTO0lBQ2pDLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0RCxNQUFNLEtBQUssR0FBaUIsRUFBRSxDQUFDO0lBRS9CLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUFDLFFBQVEsQ0FBQztRQUFDLENBQUM7UUFFbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsbUJBQW9CLElBQVcsRUFBRSxTQUFnQjtJQUMvQyxNQUFNLEtBQUssR0FBRyxTQUFTO1FBQ3JCLENBQUMsQ0FBQyx3Q0FBd0MsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3JELENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ1gsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVELE1BQU0sQ0FBQztRQUNMLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRztRQUN2QixNQUFNLEVBQUUsS0FBSyxDQUNYLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2xCO0tBQ0YsQ0FBQTtBQUNILENBQUMifQ==