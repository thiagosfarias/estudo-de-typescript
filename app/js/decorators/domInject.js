System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function domInject(seletor) {
        return function (target, key) {
            let elemento;
            const getter = function () {
                if (!elemento) {
                    console.log(`buscando  ${seletor} para injetar em ${key}`);
                    elemento = $(seletor);
                }
                return elemento;
            };
        };
    }
    exports_1("domInject", domInject);
    return {
        setters: [],
        execute: function () {
        }
    };
});
