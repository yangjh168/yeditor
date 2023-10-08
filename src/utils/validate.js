/**
 * 判断给定的对象是否是字符串
 * @method isString
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是字符串
 */
export const isString = (obj) => Object.prototype.toString.apply(obj) == '[object String]';

/**
 * 判断给定的对象是否是数组
 * @method isArray
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是数组
 */
export const isArray = (obj) => Object.prototype.toString.apply(obj) == '[object Array]';

/**
 * 判断给定的对象是否是一个Function
 * @method isFunction
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是Function
 */
export const isFunction = (obj) => Object.prototype.toString.apply(obj) == '[object Function]';

/**
 * 判断给定的对象是否是Number
 * @method isNumber
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是Number
 */
export const isNumber = (obj) => Object.prototype.toString.apply(obj) == '[object Number]';

/**
 * 判断给定的对象是否是一个正则表达式
 * @method isRegExp
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是正则表达式
 */
export const isRegExp = (obj) => Object.prototype.toString.apply(obj) == '[object RegExp]';

/**
 * 判断给定的对象是否是一个普通对象
 * @method isObject
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是普通对象
 */
export const isObject = (obj) => Object.prototype.toString.apply(obj) == '[object Object]';

/**
 * 判断给定的对象是否是一个日期对象
 * @method isObject
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是日期对象
 */
export const isDate = (obj) => Object.prototype.toString.apply(obj) == '[object Date]';