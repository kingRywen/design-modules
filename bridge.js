/**method 添加方法函数 */
Function.prototype.method = function (name,fn) {
    this.prototype[name] = fn;
    return this;
}