// tquery.js - https://github.com/jeromeetienne/tquery - MIT License
// vim: ts=4 sts=4 sw=4 expandtab
// -- kriskowal Kris Kowal Copyright (C) 2009-2011 MIT License
// -- tlrobinson Tom Robinson Copyright (C) 2009-2010 MIT License (Narwhal Project)
// -- dantman Daniel Friesen Copyright (C) 2010 XXX TODO License or CLA
// -- fschaefer Florian Schäfer Copyright (C) 2010 MIT License
// -- Gozala Irakli Gozalishvili Copyright (C) 2010 MIT License
// -- kitcambridge Kit Cambridge Copyright (C) 2011 MIT License
// -- kossnocorp Sasha Koss XXX TODO License or CLA
// -- bryanforbes Bryan Forbes XXX TODO License or CLA
// -- killdream Quildreen Motta Copyright (C) 2011 MIT Licence
// -- michaelficarra Michael Ficarra Copyright (C) 2011 3-clause BSD License
// -- sharkbrainguy Gerard Paapu Copyright (C) 2011 MIT License
// -- bbqsrc Brendan Molloy (C) 2011 Creative Commons Zero (public domain)
// -- iwyg XXX TODO License or CLA
// -- DomenicDenicola Domenic Denicola Copyright (C) 2011 MIT License
// -- xavierm02 Montillet Xavier Copyright (C) 2011 MIT License
// -- Raynos Jake Verbaten Copyright (C) 2011 MIT Licence
// -- samsonjs Sami Samhuri Copyright (C) 2010 MIT License
// -- rwldrn Rick Waldron Copyright (C) 2011 MIT License
// -- lexer Alexey Zakharov XXX TODO License or CLA

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

// Module systems magic dance
(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(definition);
    // CommonJS and <script>
    } else {
        definition();
    }
})(function () {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
 */

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var F = function(){};
                F.prototype = target.prototype;
                var self = new F;

                var result = target.apply(
                    self,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return self;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        // XXX bound.length is never writable, so don't even try
        //
        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.
        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
// Having a toString local variable name breaks in Opera so use _toString.
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var self = toObject(this),
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object context
                fun.call(thisp, self[i], i, self);
            }
        }
    };
}

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, self);
        }
        return result;
    };
}

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, self)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, self)) {
                return false;
            }
        }
        return true;
    };
}

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self)) {
                return true;
            }
        }
        return false;
    };
}

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1) {
            throw new TypeError('reduce of empty array with no initial value');
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length) {
                    throw new TypeError('reduce of empty array with no initial value');
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, self);
            }
        }

        return result;
    };
}

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1) {
            throw new TypeError('reduceRight of empty array with no initial value');
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError('reduceRight of empty array with no initial value');
                }
            } while (true);
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, self);
            }
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/kriskowal/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor
                ? object.constructor.prototype
                : prototypeOfObject
        );
    };
}

// ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a non-object: ";

    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null) {
            throw new TypeError(ERR_NON_OBJECT + object);
        }
        // If object does not owns property return undefined immediately.
        if (!owns(object, property)) {
            return;
        }

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        var descriptor =  { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) {
                    descriptor.get = getter;
                }
                if (setter) {
                    descriptor.set = setter;
                }
                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        return descriptor;
    };
}

// ES5 15.2.3.4
// http://es5.github.com/#x15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
// http://es5.github.com/#x15.2.3.5
if (!Object.create) {
    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = { "__proto__": null };
        } else {
            if (typeof prototype != "object") {
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            }
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            object.__proto__ = prototype;
        }
        if (properties !== void 0) {
            Object.defineProperties(object, properties);
        }
        return object;
    };
}

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/kriskowal/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
        // returns falsy
    }
}

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null) {
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        }
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null) {
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        }
        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If it's a data property.
        if (owns(descriptor, "value")) {
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(owns(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors) {
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            }
            // If we got that far then getters and setters can be defined !!
            if (owns(descriptor, "get")) {
                defineGetter(object, property, descriptor.get);
            }
            if (owns(descriptor, "set")) {
                defineSetter(object, property, descriptor.set);
            }
        }
        return object;
    };
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property) && property != "__proto__") {
                Object.defineProperty(object, property, properties[property]);
            }
        }
        return object;
    };
}

// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}

// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}

// ES5 15.2.3.12
// http://es5.github.com/#x15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}

// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) !== object) {
            throw new TypeError(); // TODO message
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
if (!Object.keys) {
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if ((typeof object != "object" && typeof object != "function") || object === null) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
if (!Date.prototype.toISOString || (new Date(-62198755200000).toISOString().indexOf('-000001') === -1)) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value, year;
        if (!isFinite(this)) {
            throw new RangeError("Date.prototype.toISOString called on non-finite value.");
        }

        // the date time string format is specified in 15.9.1.15.
        result = [this.getUTCMonth() + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = this.getUTCFullYear();
        year = (year < 0 ? '-' : (year > 9999 ? '+' : '')) + ('00000' + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6);

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two digits.
            if (value < 10) {
                result[length] = "0" + value;
            }
        }
        // pad milliseconds to have three digits.
        return year + "-" + result.slice(0, 2).join("-") + "T" + result.slice(2).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
    }
}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function toJSON(key) {
        // When the toJSON method is called with argument key, the following
        // steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ToPrimitive(O, hint Number).
        // 3. If tv is a Number and is not finite, return null.
        // XXX
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof this.toISOString != "function") {
            throw new TypeError('toISOString property is not callable');
        }
        // 6. Return the result of calling the [[Call]] internal method of
        //  toISO with O as the this value and an empty argument list.
        return this.toISOString();

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (!Date.parse || Date.parse("+275760-09-13T00:00:00.000Z") !== 8.64e15) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        var Date = function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign + 6-digit extended year
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:\\.(\\d{3}))?" + // milliseconds capture
                ")?" +
            "(?:" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate) {
            Date[key] = NativeDate[key];
        }

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                match.shift(); // kill match[0], the full match
                // parse months, days, hours, minutes, seconds, and milliseconds
                for (var i = 1; i < 7; i++) {
                    // provide default values if necessary
                    match[i] = +(match[i] || (i < 3 ? 1 : 0));
                    // match[1] is the month. Months are 0-11 in JavaScript
                    // `Date` objects, but 1-12 in ISO notation, so we
                    // decrement.
                    if (i == 1) {
                        match[i]--;
                    }
                }

                // parse the UTC offset component
                var minuteOffset = +match.pop(), hourOffset = +match.pop(), sign = match.pop();

                // compute the explicit time zone offset if specified
                var offset = 0;
                if (sign) {
                    // detect invalid offsets and return early
                    if (hourOffset > 23 || minuteOffset > 59) {
                        return NaN;
                    }

                    // express the provided time zone offset in minutes. The offset is
                    // negative for time zones west of UTC; positive otherwise.
                    offset = (hourOffset * 60 + minuteOffset) * 6e4 * (sign == "+" ? -1 : 1);
                }

                // Date.UTC for years between 0 and 99 converts year to 1900 + year
                // The Gregorian calendar has a 400-year cycle, so
                // to Date.UTC(year + 400, .... ) - 12622780800000 == Date.UTC(year, ...),
                // where 12622780800000 - number of milliseconds in Gregorian calendar 400 years
                var year = +match[0];
                if (0 <= year && year <= 99) {
                    match[0] = year + 400;
                    return NativeDate.UTC.apply(this, match) + offset - 12622780800000;
                }

                // compute a new UTC date value, accounting for the optional offset
                return NativeDate.UTC.apply(this, match) + offset;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

//
// String
// ======
//

// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        if (this === undefined || this === null) {
            throw new TypeError("can't convert "+this+" to object");
        }
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer
var toInteger = function (n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
};

var prepareString = "a"[0] != "a";
    // ES5 9.9
    // http://es5.github.com/#x9.9
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    // If the implementation doesn't support by-index access of
    // string characters (ex. IE < 9), split the string
    if (prepareString && typeof o == "string" && o) {
        return o.split("");
    }
    return Object(o);
};
});
// Three.js - http://github.com/mrdoob/three.js
'use strict';var THREE=THREE||{REVISION:"49"};self.Int32Array||(self.Int32Array=Array,self.Float32Array=Array);
(function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c){window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(b){var c=Date.now(),f=Math.max(0,16-(c-a)),g=window.setTimeout(function(){b(c+f)},f);a=c+f;return g};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=
function(a){clearTimeout(a)}})();THREE.Clock=function(a){this.autoStart=a!==void 0?a:true;this.elapsedTime=this.oldTime=this.startTime=0;this.running=false};THREE.Clock.prototype.start=function(){this.oldTime=this.startTime=Date.now();this.running=true};THREE.Clock.prototype.stop=function(){this.getElapsedTime();this.running=false};THREE.Clock.prototype.getElapsedTime=function(){return this.elapsedTime=this.elapsedTime+this.getDelta()};
THREE.Clock.prototype.getDelta=function(){var a=0;this.autoStart&&!this.running&&this.start();if(this.running){var b=Date.now(),a=0.001*(b-this.oldTime);this.oldTime=b;this.elapsedTime=this.elapsedTime+a}return a};THREE.Color=function(a){a!==void 0&&this.setHex(a);return this};
THREE.Color.prototype={constructor:THREE.Color,r:1,g:1,b:1,copy:function(a){this.r=a.r;this.g=a.g;this.b=a.b;return this},copyGammaToLinear:function(a){this.r=a.r*a.r;this.g=a.g*a.g;this.b=a.b*a.b;return this},copyLinearToGamma:function(a){this.r=Math.sqrt(a.r);this.g=Math.sqrt(a.g);this.b=Math.sqrt(a.b);return this},convertGammaToLinear:function(){var a=this.r,b=this.g,c=this.b;this.r=a*a;this.g=b*b;this.b=c*c;return this},convertLinearToGamma:function(){this.r=Math.sqrt(this.r);this.g=Math.sqrt(this.g);
this.b=Math.sqrt(this.b);return this},setRGB:function(a,b,c){this.r=a;this.g=b;this.b=c;return this},setHSV:function(a,b,c){var d,e,f;if(c===0)this.r=this.g=this.b=0;else{d=Math.floor(a*6);e=a*6-d;a=c*(1-b);f=c*(1-b*e);b=c*(1-b*(1-e));switch(d){case 1:this.r=f;this.g=c;this.b=a;break;case 2:this.r=a;this.g=c;this.b=b;break;case 3:this.r=a;this.g=f;this.b=c;break;case 4:this.r=b;this.g=a;this.b=c;break;case 5:this.r=c;this.g=a;this.b=f;break;case 6:case 0:this.r=c;this.g=b;this.b=a}}return this},setHex:function(a){a=
Math.floor(a);this.r=(a>>16&255)/255;this.g=(a>>8&255)/255;this.b=(a&255)/255;return this},lerpSelf:function(a,b){this.r=this.r+(a.r-this.r)*b;this.g=this.g+(a.g-this.g)*b;this.b=this.b+(a.b-this.b)*b;return this},getHex:function(){return Math.floor(this.r*255)<<16^Math.floor(this.g*255)<<8^Math.floor(this.b*255)},getContextStyle:function(){return"rgb("+Math.floor(this.r*255)+","+Math.floor(this.g*255)+","+Math.floor(this.b*255)+")"},clone:function(){return(new THREE.Color).setRGB(this.r,this.g,this.b)}};
THREE.Vector2=function(a,b){this.x=a||0;this.y=b||0};
THREE.Vector2.prototype={constructor:THREE.Vector2,set:function(a,b){this.x=a;this.y=b;return this},copy:function(a){this.x=a.x;this.y=a.y;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this},subSelf:function(a){this.x=this.x-a.x;this.y=this.y-a.y;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;return this},divideScalar:function(a){if(a){this.x=
this.x/a;this.y=this.y/a}else this.set(0,0);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y},lengthSq:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.lengthSq())},normalize:function(){return this.divideScalar(this.length())},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x,a=this.y-a.y;return b*b+a*a},setLength:function(a){return this.normalize().multiplyScalar(a)},
lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;return this},equals:function(a){return a.x===this.x&&a.y===this.y},isZero:function(){return this.lengthSq()<1.0E-4},clone:function(){return new THREE.Vector2(this.x,this.y)}};THREE.Vector3=function(a,b,c){this.x=a||0;this.y=b||0;this.z=c||0};
THREE.Vector3.prototype={constructor:THREE.Vector3,set:function(a,b,c){this.x=a;this.y=b;this.z=c;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;this.z=this.z+a.z;return this},addScalar:function(a){this.x=this.x+a;this.y=this.y+
a;this.z=this.z+a;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this},subSelf:function(a){this.x=this.x-a.x;this.y=this.y-a.y;this.z=this.z-a.z;return this},multiply:function(a,b){this.x=a.x*b.x;this.y=a.y*b.y;this.z=a.z*b.z;return this},multiplySelf:function(a){this.x=this.x*a.x;this.y=this.y*a.y;this.z=this.z*a.z;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;this.z=this.z*a;return this},divideSelf:function(a){this.x=this.x/a.x;this.y=
this.y/a.y;this.z=this.z/a.z;return this},divideScalar:function(a){if(a){this.x=this.x/a;this.y=this.y/a;this.z=this.z/a}else this.z=this.y=this.x=0;return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},length:function(){return Math.sqrt(this.lengthSq())},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)},normalize:function(){return this.divideScalar(this.length())},
setLength:function(a){return this.normalize().multiplyScalar(a)},lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;this.z=this.z+(a.z-this.z)*b;return this},cross:function(a,b){this.x=a.y*b.z-a.z*b.y;this.y=a.z*b.x-a.x*b.z;this.z=a.x*b.y-a.y*b.x;return this},crossSelf:function(a){var b=this.x,c=this.y,d=this.z;this.x=c*a.z-d*a.y;this.y=d*a.x-b*a.z;this.z=b*a.y-c*a.x;return this},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){return(new THREE.Vector3).sub(this,
a).lengthSq()},getPositionFromMatrix:function(a){this.x=a.elements[12];this.y=a.elements[13];this.z=a.elements[14];return this},getRotationFromMatrix:function(a,b){var c=b?b.x:1,d=b?b.y:1,e=b?b.z:1,f=a.elements[0]/c,g=a.elements[4]/d,c=a.elements[1]/c,d=a.elements[5]/d,h=a.elements[9]/e,j=a.elements[10]/e;this.y=Math.asin(a.elements[8]/e);e=Math.cos(this.y);if(Math.abs(e)>1.0E-5){this.x=Math.atan2(-h/e,j/e);this.z=Math.atan2(-g/e,f/e)}else{this.x=0;this.z=Math.atan2(c,d)}return this},getScaleFromMatrix:function(a){var b=
this.set(a.elements[0],a.elements[1],a.elements[2]).length(),c=this.set(a.elements[4],a.elements[5],a.elements[6]).length(),a=this.set(a.elements[8],a.elements[9],a.elements[10]).length();this.x=b;this.y=c;this.z=a},equals:function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z},isZero:function(){return this.lengthSq()<1.0E-4},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)}};THREE.Vector4=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=d!==void 0?d:1};
THREE.Vector4.prototype={constructor:THREE.Vector4,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w!==void 0?a.w:1;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;this.w=a.w+b.w;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;this.z=this.z+a.z;this.w=this.w+a.w;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;this.w=a.w-b.w;return this},subSelf:function(a){this.x=
this.x-a.x;this.y=this.y-a.y;this.z=this.z-a.z;this.w=this.w-a.w;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;this.z=this.z*a;this.w=this.w*a;return this},divideScalar:function(a){if(a){this.x=this.x/a;this.y=this.y/a;this.z=this.z/a;this.w=this.w/a}else{this.z=this.y=this.x=0;this.w=1}return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z+this.w*a.w},lengthSq:function(){return this.dot(this)},length:function(){return Math.sqrt(this.lengthSq())},
normalize:function(){return this.divideScalar(this.length())},setLength:function(a){return this.normalize().multiplyScalar(a)},lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;this.z=this.z+(a.z-this.z)*b;this.w=this.w+(a.w-this.w)*b;return this},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)}};THREE.Frustum=function(){this.planes=[new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4]};
THREE.Frustum.prototype.setFromMatrix=function(a){var b,c=this.planes,d=a.elements,a=d[0];b=d[1];var e=d[2],f=d[3],g=d[4],h=d[5],j=d[6],l=d[7],k=d[8],p=d[9],m=d[10],o=d[11],q=d[12],n=d[13],r=d[14],d=d[15];c[0].set(f-a,l-g,o-k,d-q);c[1].set(f+a,l+g,o+k,d+q);c[2].set(f+b,l+h,o+p,d+n);c[3].set(f-b,l-h,o-p,d-n);c[4].set(f-e,l-j,o-m,d-r);c[5].set(f+e,l+j,o+m,d+r);for(a=0;a<6;a++){b=c[a];b.divideScalar(Math.sqrt(b.x*b.x+b.y*b.y+b.z*b.z))}};
THREE.Frustum.prototype.contains=function(a){for(var b=this.planes,c=a.matrixWorld,d=c.elements,c=-a.geometry.boundingSphere.radius*c.getMaxScaleOnAxis(),e=0;e<6;e++){a=b[e].x*d[12]+b[e].y*d[13]+b[e].z*d[14]+b[e].w;if(a<=c)return false}return true};THREE.Frustum.__v1=new THREE.Vector3;
THREE.Ray=function(a,b){function c(a,b,c){q.sub(c,a);u=q.dot(b);t=n.add(a,r.copy(b).multiplyScalar(u));return y=c.distanceTo(t)}function d(a,b,c,d){q.sub(d,b);n.sub(c,b);r.sub(a,b);s=q.dot(q);w=q.dot(n);H=q.dot(r);E=n.dot(n);z=n.dot(r);v=1/(s*E-w*w);A=(E*H-w*z)*v;J=(s*z-w*H)*v;return A>=0&&J>=0&&A+J<1}this.origin=a||new THREE.Vector3;this.direction=b||new THREE.Vector3;var e=1.0E-4;this.setPrecision=function(a){e=a};var f=new THREE.Vector3,g=new THREE.Vector3,h=new THREE.Vector3,j=new THREE.Vector3,
l=new THREE.Vector3,k=new THREE.Vector3,p=new THREE.Vector3,m=new THREE.Vector3,o=new THREE.Vector3;this.intersectObject=function(a){var b,n=[];if(a instanceof THREE.Particle){var q=c(this.origin,this.direction,a.matrixWorld.getPosition());if(q>a.scale.x)return[];b={distance:q,point:a.position,face:null,object:a};n.push(b)}else if(a instanceof THREE.Mesh){var q=c(this.origin,this.direction,a.matrixWorld.getPosition()),r=THREE.Frustum.__v1.set(a.matrixWorld.getColumnX().length(),a.matrixWorld.getColumnY().length(),
a.matrixWorld.getColumnZ().length());if(q>a.geometry.boundingSphere.radius*Math.max(r.x,Math.max(r.y,r.z)))return n;var s,i,t=a.geometry,u=t.vertices,C;a.matrixRotationWorld.extractRotation(a.matrixWorld);q=0;for(r=t.faces.length;q<r;q++){b=t.faces[q];l.copy(this.origin);k.copy(this.direction);C=a.matrixWorld;p=C.multiplyVector3(p.copy(b.centroid)).subSelf(l);m=a.matrixRotationWorld.multiplyVector3(m.copy(b.normal));s=k.dot(m);if(!(Math.abs(s)<e)){i=m.dot(p)/s;if(!(i<0)&&(a.doubleSided||(a.flipSided?
s>0:s<0))){o.add(l,k.multiplyScalar(i));if(b instanceof THREE.Face3){f=C.multiplyVector3(f.copy(u[b.a]));g=C.multiplyVector3(g.copy(u[b.b]));h=C.multiplyVector3(h.copy(u[b.c]));if(d(o,f,g,h)){b={distance:l.distanceTo(o),point:o.clone(),face:b,object:a};n.push(b)}}else if(b instanceof THREE.Face4){f=C.multiplyVector3(f.copy(u[b.a]));g=C.multiplyVector3(g.copy(u[b.b]));h=C.multiplyVector3(h.copy(u[b.c]));j=C.multiplyVector3(j.copy(u[b.d]));if(d(o,f,g,j)||d(o,g,h,j)){b={distance:l.distanceTo(o),point:o.clone(),
face:b,object:a};n.push(b)}}}}}}return n};this.intersectObjects=function(a){for(var b=[],c=0,d=a.length;c<d;c++)Array.prototype.push.apply(b,this.intersectObject(a[c]));b.sort(function(a,b){return a.distance-b.distance});return b};var q=new THREE.Vector3,n=new THREE.Vector3,r=new THREE.Vector3,u,t,y,s,w,H,E,z,v,A,J};
THREE.Rectangle=function(){function a(){f=d-b;g=e-c}var b,c,d,e,f,g,h=true;this.getX=function(){return b};this.getY=function(){return c};this.getWidth=function(){return f};this.getHeight=function(){return g};this.getLeft=function(){return b};this.getTop=function(){return c};this.getRight=function(){return d};this.getBottom=function(){return e};this.set=function(f,g,k,p){h=false;b=f;c=g;d=k;e=p;a()};this.addPoint=function(f,g){if(h){h=false;b=f;c=g;d=f;e=g}else{b=b<f?b:f;c=c<g?c:g;d=d>f?d:f;e=e>g?
e:g}a()};this.add3Points=function(f,g,k,p,m,o){if(h){h=false;b=f<k?f<m?f:m:k<m?k:m;c=g<p?g<o?g:o:p<o?p:o;d=f>k?f>m?f:m:k>m?k:m;e=g>p?g>o?g:o:p>o?p:o}else{b=f<k?f<m?f<b?f:b:m<b?m:b:k<m?k<b?k:b:m<b?m:b;c=g<p?g<o?g<c?g:c:o<c?o:c:p<o?p<c?p:c:o<c?o:c;d=f>k?f>m?f>d?f:d:m>d?m:d:k>m?k>d?k:d:m>d?m:d;e=g>p?g>o?g>e?g:e:o>e?o:e:p>o?p>e?p:e:o>e?o:e}a()};this.addRectangle=function(f){if(h){h=false;b=f.getLeft();c=f.getTop();d=f.getRight();e=f.getBottom()}else{b=b<f.getLeft()?b:f.getLeft();c=c<f.getTop()?c:f.getTop();
d=d>f.getRight()?d:f.getRight();e=e>f.getBottom()?e:f.getBottom()}a()};this.inflate=function(f){b=b-f;c=c-f;d=d+f;e=e+f;a()};this.minSelf=function(f){b=b>f.getLeft()?b:f.getLeft();c=c>f.getTop()?c:f.getTop();d=d<f.getRight()?d:f.getRight();e=e<f.getBottom()?e:f.getBottom();a()};this.intersects=function(a){return d<a.getLeft()||b>a.getRight()||e<a.getTop()||c>a.getBottom()?false:true};this.empty=function(){h=true;e=d=c=b=0;a()};this.isEmpty=function(){return h}};
THREE.Math={clamp:function(a,b,c){return a<b?b:a>c?c:a},clampBottom:function(a,b){return a<b?b:a},mapLinear:function(a,b,c,d,e){return d+(a-b)*(e-d)/(c-b)},random16:function(){return(65280*Math.random()+255*Math.random())/65535},randInt:function(a,b){return a+Math.floor(Math.random()*(b-a+1))},randFloat:function(a,b){return a+Math.random()*(b-a)},randFloatSpread:function(a){return a*(0.5-Math.random())},sign:function(a){return a<0?-1:a>0?1:0}};THREE.Matrix3=function(){this.elements=new Float32Array(9)};
THREE.Matrix3.prototype={constructor:THREE.Matrix3,getInverse:function(a){var b=a.elements,a=b[10]*b[5]-b[6]*b[9],c=-b[10]*b[1]+b[2]*b[9],d=b[6]*b[1]-b[2]*b[5],e=-b[10]*b[4]+b[6]*b[8],f=b[10]*b[0]-b[2]*b[8],g=-b[6]*b[0]+b[2]*b[4],h=b[9]*b[4]-b[5]*b[8],j=-b[9]*b[0]+b[1]*b[8],l=b[5]*b[0]-b[1]*b[4],b=b[0]*a+b[1]*e+b[2]*h;b===0&&console.warn("Matrix3.getInverse(): determinant == 0");var b=1/b,k=this.elements;k[0]=b*a;k[1]=b*c;k[2]=b*d;k[3]=b*e;k[4]=b*f;k[5]=b*g;k[6]=b*h;k[7]=b*j;k[8]=b*l;return this},
transpose:function(){var a,b=this.elements;a=b[1];b[1]=b[3];b[3]=a;a=b[2];b[2]=b[6];b[6]=a;a=b[5];b[5]=b[7];b[7]=a;return this},transposeIntoArray:function(a){var b=this.m;a[0]=b[0];a[1]=b[3];a[2]=b[6];a[3]=b[1];a[4]=b[4];a[5]=b[7];a[6]=b[2];a[7]=b[5];a[8]=b[8];return this}};THREE.Matrix4=function(a,b,c,d,e,f,g,h,j,l,k,p,m,o,q,n){this.elements=new Float32Array(16);this.set(a!==void 0?a:1,b||0,c||0,d||0,e||0,f!==void 0?f:1,g||0,h||0,j||0,l||0,k!==void 0?k:1,p||0,m||0,o||0,q||0,n!==void 0?n:1)};
THREE.Matrix4.prototype={constructor:THREE.Matrix4,set:function(a,b,c,d,e,f,g,h,j,l,k,p,m,o,q,n){var r=this.elements;r[0]=a;r[4]=b;r[8]=c;r[12]=d;r[1]=e;r[5]=f;r[9]=g;r[13]=h;r[2]=j;r[6]=l;r[10]=k;r[14]=p;r[3]=m;r[7]=o;r[11]=q;r[15]=n;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},copy:function(a){a=a.elements;this.set(a[0],a[4],a[8],a[12],a[1],a[5],a[9],a[13],a[2],a[6],a[10],a[14],a[3],a[7],a[11],a[15]);return this},lookAt:function(a,b,c){var d=this.elements,
e=THREE.Matrix4.__v1,f=THREE.Matrix4.__v2,g=THREE.Matrix4.__v3;g.sub(a,b).normalize();if(g.length()===0)g.z=1;e.cross(c,g).normalize();if(e.length()===0){g.x=g.x+1.0E-4;e.cross(c,g).normalize()}f.cross(g,e);d[0]=e.x;d[4]=f.x;d[8]=g.x;d[1]=e.y;d[5]=f.y;d[9]=g.y;d[2]=e.z;d[6]=f.z;d[10]=g.z;return this},multiply:function(a,b){var c=a.elements,d=b.elements,e=this.elements,f=c[0],g=c[4],h=c[8],j=c[12],l=c[1],k=c[5],p=c[9],m=c[13],o=c[2],q=c[6],n=c[10],r=c[14],u=c[3],t=c[7],y=c[11],c=c[15],s=d[0],w=d[4],
H=d[8],E=d[12],z=d[1],v=d[5],A=d[9],J=d[13],K=d[2],R=d[6],P=d[10],D=d[14],M=d[3],G=d[7],i=d[11],d=d[15];e[0]=f*s+g*z+h*K+j*M;e[4]=f*w+g*v+h*R+j*G;e[8]=f*H+g*A+h*P+j*i;e[12]=f*E+g*J+h*D+j*d;e[1]=l*s+k*z+p*K+m*M;e[5]=l*w+k*v+p*R+m*G;e[9]=l*H+k*A+p*P+m*i;e[13]=l*E+k*J+p*D+m*d;e[2]=o*s+q*z+n*K+r*M;e[6]=o*w+q*v+n*R+r*G;e[10]=o*H+q*A+n*P+r*i;e[14]=o*E+q*J+n*D+r*d;e[3]=u*s+t*z+y*K+c*M;e[7]=u*w+t*v+y*R+c*G;e[11]=u*H+t*A+y*P+c*i;e[15]=u*E+t*J+y*D+c*d;return this},multiplySelf:function(a){return this.multiply(this,
a)},multiplyToArray:function(a,b,c){var d=this.elements;this.multiply(a,b);c[0]=d[0];c[1]=d[1];c[2]=d[2];c[3]=d[3];c[4]=d[4];c[5]=d[5];c[6]=d[6];c[7]=d[7];c[8]=d[8];c[9]=d[9];c[10]=d[10];c[11]=d[11];c[12]=d[12];c[13]=d[13];c[14]=d[14];c[15]=d[15];return this},multiplyScalar:function(a){var b=this.elements;b[0]=b[0]*a;b[4]=b[4]*a;b[8]=b[8]*a;b[12]=b[12]*a;b[1]=b[1]*a;b[5]=b[5]*a;b[9]=b[9]*a;b[13]=b[13]*a;b[2]=b[2]*a;b[6]=b[6]*a;b[10]=b[10]*a;b[14]=b[14]*a;b[3]=b[3]*a;b[7]=b[7]*a;b[11]=b[11]*a;b[15]=
b[15]*a;return this},multiplyVector3:function(a){var b=this.elements,c=a.x,d=a.y,e=a.z,f=1/(b[3]*c+b[7]*d+b[11]*e+b[15]);a.x=(b[0]*c+b[4]*d+b[8]*e+b[12])*f;a.y=(b[1]*c+b[5]*d+b[9]*e+b[13])*f;a.z=(b[2]*c+b[6]*d+b[10]*e+b[14])*f;return a},multiplyVector4:function(a){var b=this.elements,c=a.x,d=a.y,e=a.z,f=a.w;a.x=b[0]*c+b[4]*d+b[8]*e+b[12]*f;a.y=b[1]*c+b[5]*d+b[9]*e+b[13]*f;a.z=b[2]*c+b[6]*d+b[10]*e+b[14]*f;a.w=b[3]*c+b[7]*d+b[11]*e+b[15]*f;return a},rotateAxis:function(a){var b=this.elements,c=a.x,
d=a.y,e=a.z;a.x=c*b[0]+d*b[4]+e*b[8];a.y=c*b[1]+d*b[5]+e*b[9];a.z=c*b[2]+d*b[6]+e*b[10];a.normalize();return a},crossVector:function(a){var b=this.elements,c=new THREE.Vector4;c.x=b[0]*a.x+b[4]*a.y+b[8]*a.z+b[12]*a.w;c.y=b[1]*a.x+b[5]*a.y+b[9]*a.z+b[13]*a.w;c.z=b[2]*a.x+b[6]*a.y+b[10]*a.z+b[14]*a.w;c.w=a.w?b[3]*a.x+b[7]*a.y+b[11]*a.z+b[15]*a.w:1;return c},determinant:function(){var a=this.elements,b=a[0],c=a[4],d=a[8],e=a[12],f=a[1],g=a[5],h=a[9],j=a[13],l=a[2],k=a[6],p=a[10],m=a[14],o=a[3],q=a[7],
n=a[11],a=a[15];return e*h*k*o-d*j*k*o-e*g*p*o+c*j*p*o+d*g*m*o-c*h*m*o-e*h*l*q+d*j*l*q+e*f*p*q-b*j*p*q-d*f*m*q+b*h*m*q+e*g*l*n-c*j*l*n-e*f*k*n+b*j*k*n+c*f*m*n-b*g*m*n-d*g*l*a+c*h*l*a+d*f*k*a-b*h*k*a-c*f*p*a+b*g*p*a},transpose:function(){var a=this.elements,b;b=a[1];a[1]=a[4];a[4]=b;b=a[2];a[2]=a[8];a[8]=b;b=a[6];a[6]=a[9];a[9]=b;b=a[3];a[3]=a[12];a[12]=b;b=a[7];a[7]=a[13];a[13]=b;b=a[11];a[11]=a[14];a[14]=b;return this},flattenToArray:function(a){var b=this.elements;a[0]=b[0];a[1]=b[1];a[2]=b[2];
a[3]=b[3];a[4]=b[4];a[5]=b[5];a[6]=b[6];a[7]=b[7];a[8]=b[8];a[9]=b[9];a[10]=b[10];a[11]=b[11];a[12]=b[12];a[13]=b[13];a[14]=b[14];a[15]=b[15];return a},flattenToArrayOffset:function(a,b){var c=this.elements;a[b]=c[0];a[b+1]=c[1];a[b+2]=c[2];a[b+3]=c[3];a[b+4]=c[4];a[b+5]=c[5];a[b+6]=c[6];a[b+7]=c[7];a[b+8]=c[8];a[b+9]=c[9];a[b+10]=c[10];a[b+11]=c[11];a[b+12]=c[12];a[b+13]=c[13];a[b+14]=c[14];a[b+15]=c[15];return a},getPosition:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[12],a[13],
a[14])},setPosition:function(a){var b=this.elements;b[12]=a.x;b[13]=a.y;b[14]=a.z;return this},getColumnX:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[0],a[1],a[2])},getColumnY:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[4],a[5],a[6])},getColumnZ:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[8],a[9],a[10])},getInverse:function(a){var b=this.elements,c=a.elements,d=c[0],e=c[4],f=c[8],g=c[12],h=c[1],j=c[5],l=c[9],k=c[13],p=c[2],m=c[6],o=c[10],q=
c[14],n=c[3],r=c[7],u=c[11],c=c[15];b[0]=l*q*r-k*o*r+k*m*u-j*q*u-l*m*c+j*o*c;b[4]=g*o*r-f*q*r-g*m*u+e*q*u+f*m*c-e*o*c;b[8]=f*k*r-g*l*r+g*j*u-e*k*u-f*j*c+e*l*c;b[12]=g*l*m-f*k*m-g*j*o+e*k*o+f*j*q-e*l*q;b[1]=k*o*n-l*q*n-k*p*u+h*q*u+l*p*c-h*o*c;b[5]=f*q*n-g*o*n+g*p*u-d*q*u-f*p*c+d*o*c;b[9]=g*l*n-f*k*n-g*h*u+d*k*u+f*h*c-d*l*c;b[13]=f*k*p-g*l*p+g*h*o-d*k*o-f*h*q+d*l*q;b[2]=j*q*n-k*m*n+k*p*r-h*q*r-j*p*c+h*m*c;b[6]=g*m*n-e*q*n-g*p*r+d*q*r+e*p*c-d*m*c;b[10]=e*k*n-g*j*n+g*h*r-d*k*r-e*h*c+d*j*c;b[14]=g*j*p-
e*k*p-g*h*m+d*k*m+e*h*q-d*j*q;b[3]=l*m*n-j*o*n-l*p*r+h*o*r+j*p*u-h*m*u;b[7]=e*o*n-f*m*n+f*p*r-d*o*r-e*p*u+d*m*u;b[11]=f*j*n-e*l*n-f*h*r+d*l*r+e*h*u-d*j*u;b[15]=e*l*p-f*j*p+f*h*m-d*l*m-e*h*o+d*j*o;this.multiplyScalar(1/a.determinant());return this},setRotationFromEuler:function(a,b){var c=this.elements,d=a.x,e=a.y,f=a.z,g=Math.cos(d),d=Math.sin(d),h=Math.cos(e),e=Math.sin(e),j=Math.cos(f),f=Math.sin(f);switch(b){case "YXZ":var l=h*j,k=h*f,p=e*j,m=e*f;c[0]=l+m*d;c[4]=p*d-k;c[8]=g*e;c[1]=g*f;c[5]=g*
j;c[9]=-d;c[2]=k*d-p;c[6]=m+l*d;c[10]=g*h;break;case "ZXY":l=h*j;k=h*f;p=e*j;m=e*f;c[0]=l-m*d;c[4]=-g*f;c[8]=p+k*d;c[1]=k+p*d;c[5]=g*j;c[9]=m-l*d;c[2]=-g*e;c[6]=d;c[10]=g*h;break;case "ZYX":l=g*j;k=g*f;p=d*j;m=d*f;c[0]=h*j;c[4]=p*e-k;c[8]=l*e+m;c[1]=h*f;c[5]=m*e+l;c[9]=k*e-p;c[2]=-e;c[6]=d*h;c[10]=g*h;break;case "YZX":l=g*h;k=g*e;p=d*h;m=d*e;c[0]=h*j;c[4]=m-l*f;c[8]=p*f+k;c[1]=f;c[5]=g*j;c[9]=-d*j;c[2]=-e*j;c[6]=k*f+p;c[10]=l-m*f;break;case "XZY":l=g*h;k=g*e;p=d*h;m=d*e;c[0]=h*j;c[4]=-f;c[8]=e*j;
c[1]=l*f+m;c[5]=g*j;c[9]=k*f-p;c[2]=p*f-k;c[6]=d*j;c[10]=m*f+l;break;default:l=g*j;k=g*f;p=d*j;m=d*f;c[0]=h*j;c[4]=-h*f;c[8]=e;c[1]=k+p*e;c[5]=l-m*e;c[9]=-d*h;c[2]=m-l*e;c[6]=p+k*e;c[10]=g*h}return this},setRotationFromQuaternion:function(a){var b=this.elements,c=a.x,d=a.y,e=a.z,f=a.w,g=c+c,h=d+d,j=e+e,a=c*g,l=c*h,c=c*j,k=d*h,d=d*j,e=e*j,g=f*g,h=f*h,f=f*j;b[0]=1-(k+e);b[4]=l-f;b[8]=c+h;b[1]=l+f;b[5]=1-(a+e);b[9]=d-g;b[2]=c-h;b[6]=d+g;b[10]=1-(a+k);return this},compose:function(a,b,c){var d=this.elements,
e=THREE.Matrix4.__m1,f=THREE.Matrix4.__m2;e.identity();e.setRotationFromQuaternion(b);f.makeScale(c.x,c.y,c.z);this.multiply(e,f);d[12]=a.x;d[13]=a.y;d[14]=a.z;return this},decompose:function(a,b,c){var d=this.elements,e=THREE.Matrix4.__v1,f=THREE.Matrix4.__v2,g=THREE.Matrix4.__v3;e.set(d[0],d[1],d[2]);f.set(d[4],d[5],d[6]);g.set(d[8],d[9],d[10]);a=a instanceof THREE.Vector3?a:new THREE.Vector3;b=b instanceof THREE.Quaternion?b:new THREE.Quaternion;c=c instanceof THREE.Vector3?c:new THREE.Vector3;
c.x=e.length();c.y=f.length();c.z=g.length();a.x=d[12];a.y=d[13];a.z=d[14];d=THREE.Matrix4.__m1;d.copy(this);d.elements[0]=d.elements[0]/c.x;d.elements[1]=d.elements[1]/c.x;d.elements[2]=d.elements[2]/c.x;d.elements[4]=d.elements[4]/c.y;d.elements[5]=d.elements[5]/c.y;d.elements[6]=d.elements[6]/c.y;d.elements[8]=d.elements[8]/c.z;d.elements[9]=d.elements[9]/c.z;d.elements[10]=d.elements[10]/c.z;b.setFromRotationMatrix(d);return[a,b,c]},extractPosition:function(a){var b=this.elements,a=a.elements;
b[12]=a[12];b[13]=a[13];b[14]=a[14];return this},extractRotation:function(a){var b=this.elements,a=a.elements,c=THREE.Matrix4.__v1,d=1/c.set(a[0],a[1],a[2]).length(),e=1/c.set(a[4],a[5],a[6]).length(),c=1/c.set(a[8],a[9],a[10]).length();b[0]=a[0]*d;b[1]=a[1]*d;b[2]=a[2]*d;b[4]=a[4]*e;b[5]=a[5]*e;b[6]=a[6]*e;b[8]=a[8]*c;b[9]=a[9]*c;b[10]=a[10]*c;return this},translate:function(a){var b=this.elements,c=a.x,d=a.y,a=a.z;b[12]=b[0]*c+b[4]*d+b[8]*a+b[12];b[13]=b[1]*c+b[5]*d+b[9]*a+b[13];b[14]=b[2]*c+b[6]*
d+b[10]*a+b[14];b[15]=b[3]*c+b[7]*d+b[11]*a+b[15];return this},rotateX:function(a){var b=this.elements,c=b[4],d=b[5],e=b[6],f=b[7],g=b[8],h=b[9],j=b[10],l=b[11],k=Math.cos(a),a=Math.sin(a);b[4]=k*c+a*g;b[5]=k*d+a*h;b[6]=k*e+a*j;b[7]=k*f+a*l;b[8]=k*g-a*c;b[9]=k*h-a*d;b[10]=k*j-a*e;b[11]=k*l-a*f;return this},rotateY:function(a){var b=this.elements,c=b[0],d=b[1],e=b[2],f=b[3],g=b[8],h=b[9],j=b[10],l=b[11],k=Math.cos(a),a=Math.sin(a);b[0]=k*c-a*g;b[1]=k*d-a*h;b[2]=k*e-a*j;b[3]=k*f-a*l;b[8]=k*g+a*c;b[9]=
k*h+a*d;b[10]=k*j+a*e;b[11]=k*l+a*f;return this},rotateZ:function(a){var b=this.elements,c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],j=b[6],l=b[7],k=Math.cos(a),a=Math.sin(a);b[0]=k*c+a*g;b[1]=k*d+a*h;b[2]=k*e+a*j;b[3]=k*f+a*l;b[4]=k*g-a*c;b[5]=k*h-a*d;b[6]=k*j-a*e;b[7]=k*l-a*f;return this},rotateByAxis:function(a,b){var c=this.elements;if(a.x===1&&a.y===0&&a.z===0)return this.rotateX(b);if(a.x===0&&a.y===1&&a.z===0)return this.rotateY(b);if(a.x===0&&a.y===0&&a.z===1)return this.rotateZ(b);var d=a.x,
e=a.y,f=a.z,g=Math.sqrt(d*d+e*e+f*f),d=d/g,e=e/g,f=f/g,g=d*d,h=e*e,j=f*f,l=Math.cos(b),k=Math.sin(b),p=1-l,m=d*e*p,o=d*f*p,p=e*f*p,d=d*k,q=e*k,k=f*k,f=g+(1-g)*l,g=m+k,e=o-q,m=m-k,h=h+(1-h)*l,k=p+d,o=o+q,p=p-d,j=j+(1-j)*l,l=c[0],d=c[1],q=c[2],n=c[3],r=c[4],u=c[5],t=c[6],y=c[7],s=c[8],w=c[9],H=c[10],E=c[11];c[0]=f*l+g*r+e*s;c[1]=f*d+g*u+e*w;c[2]=f*q+g*t+e*H;c[3]=f*n+g*y+e*E;c[4]=m*l+h*r+k*s;c[5]=m*d+h*u+k*w;c[6]=m*q+h*t+k*H;c[7]=m*n+h*y+k*E;c[8]=o*l+p*r+j*s;c[9]=o*d+p*u+j*w;c[10]=o*q+p*t+j*H;c[11]=
o*n+p*y+j*E;return this},scale:function(a){var b=this.elements,c=a.x,d=a.y,a=a.z;b[0]=b[0]*c;b[4]=b[4]*d;b[8]=b[8]*a;b[1]=b[1]*c;b[5]=b[5]*d;b[9]=b[9]*a;b[2]=b[2]*c;b[6]=b[6]*d;b[10]=b[10]*a;b[3]=b[3]*c;b[7]=b[7]*d;b[11]=b[11]*a;return this},getMaxScaleOnAxis:function(){var a=this.elements;return Math.sqrt(Math.max(a[0]*a[0]+a[1]*a[1]+a[2]*a[2],Math.max(a[4]*a[4]+a[5]*a[5]+a[6]*a[6],a[8]*a[8]+a[9]*a[9]+a[10]*a[10])))},makeTranslation:function(a,b,c){this.set(1,0,0,a,0,1,0,b,0,0,1,c,0,0,0,1);return this},
makeRotationX:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(1,0,0,0,0,b,-a,0,0,a,b,0,0,0,0,1);return this},makeRotationY:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(b,0,a,0,0,1,0,0,-a,0,b,0,0,0,0,1);return this},makeRotationZ:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(b,-a,0,0,a,b,0,0,0,0,1,0,0,0,0,1);return this},makeRotationAxis:function(a,b){var c=Math.cos(b),d=Math.sin(b),e=1-c,f=a.x,g=a.y,h=a.z,j=e*f,l=e*g;this.set(j*f+c,j*g-d*h,j*h+d*g,0,j*g+d*h,l*g+c,l*h-d*f,0,j*h-
d*g,l*h+d*f,e*h*h+c,0,0,0,0,1);return this},makeScale:function(a,b,c){this.set(a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1);return this},makeFrustum:function(a,b,c,d,e,f){var g=this.elements;g[0]=2*e/(b-a);g[4]=0;g[8]=(b+a)/(b-a);g[12]=0;g[1]=0;g[5]=2*e/(d-c);g[9]=(d+c)/(d-c);g[13]=0;g[2]=0;g[6]=0;g[10]=-(f+e)/(f-e);g[14]=-2*f*e/(f-e);g[3]=0;g[7]=0;g[11]=-1;g[15]=0;return this},makePerspective:function(a,b,c,d){var a=c*Math.tan(a*Math.PI/360),e=-a;return this.makeFrustum(e*b,a*b,e,a,c,d)},makeOrthographic:function(a,
b,c,d,e,f){var g=this.elements,h=b-a,j=c-d,l=f-e;g[0]=2/h;g[4]=0;g[8]=0;g[12]=-((b+a)/h);g[1]=0;g[5]=2/j;g[9]=0;g[13]=-((c+d)/j);g[2]=0;g[6]=0;g[10]=-2/l;g[14]=-((f+e)/l);g[3]=0;g[7]=0;g[11]=0;g[15]=1;return this},clone:function(){var a=this.elements;return new THREE.Matrix4(a[0],a[4],a[8],a[12],a[1],a[5],a[9],a[13],a[2],a[6],a[10],a[14],a[3],a[7],a[11],a[15])}};THREE.Matrix4.__v1=new THREE.Vector3;THREE.Matrix4.__v2=new THREE.Vector3;THREE.Matrix4.__v3=new THREE.Vector3;THREE.Matrix4.__m1=new THREE.Matrix4;
THREE.Matrix4.__m2=new THREE.Matrix4;
THREE.Object3D=function(){this.id=THREE.Object3DCount++;this.name="";this.parent=void 0;this.children=[];this.up=new THREE.Vector3(0,1,0);this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.eulerOrder="XYZ";this.scale=new THREE.Vector3(1,1,1);this.flipSided=this.doubleSided=false;this.renderDepth=null;this.rotationAutoUpdate=true;this.matrix=new THREE.Matrix4;this.matrixWorld=new THREE.Matrix4;this.matrixRotationWorld=new THREE.Matrix4;this.matrixWorldNeedsUpdate=this.matrixAutoUpdate=
true;this.quaternion=new THREE.Quaternion;this.useQuaternion=false;this.boundRadius=0;this.boundRadiusScale=1;this.visible=true;this.receiveShadow=this.castShadow=false;this.frustumCulled=true;this._vector=new THREE.Vector3};
THREE.Object3D.prototype={constructor:THREE.Object3D,applyMatrix:function(a){this.matrix.multiply(a,this.matrix);this.scale.getScaleFromMatrix(this.matrix);this.rotation.getRotationFromMatrix(this.matrix,this.scale);this.position.getPositionFromMatrix(this.matrix)},translate:function(a,b){this.matrix.rotateAxis(b);this.position.addSelf(b.multiplyScalar(a))},translateX:function(a){this.translate(a,this._vector.set(1,0,0))},translateY:function(a){this.translate(a,this._vector.set(0,1,0))},translateZ:function(a){this.translate(a,
this._vector.set(0,0,1))},lookAt:function(a){this.matrix.lookAt(a,this.position,this.up);this.rotationAutoUpdate&&this.rotation.getRotationFromMatrix(this.matrix)},add:function(a){if(a===this)console.warn("THREE.Object3D.add: An object can't be added as a child of itself.");else if(a instanceof THREE.Object3D){a.parent!==void 0&&a.parent.remove(a);a.parent=this;this.children.push(a);for(var b=this;b.parent!==void 0;)b=b.parent;b!==void 0&&b instanceof THREE.Scene&&b.__addObject(a)}},remove:function(a){var b=
this.children.indexOf(a);if(b!==-1){a.parent=void 0;this.children.splice(b,1);for(b=this;b.parent!==void 0;)b=b.parent;b!==void 0&&b instanceof THREE.Scene&&b.__removeObject(a)}},getChildByName:function(a,b){var c,d,e;c=0;for(d=this.children.length;c<d;c++){e=this.children[c];if(e.name===a)return e;if(b){e=e.getChildByName(a,b);if(e!==void 0)return e}}},updateMatrix:function(){this.matrix.setPosition(this.position);this.useQuaternion?this.matrix.setRotationFromQuaternion(this.quaternion):this.matrix.setRotationFromEuler(this.rotation,
this.eulerOrder);if(this.scale.x!==1||this.scale.y!==1||this.scale.z!==1){this.matrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,Math.max(this.scale.y,this.scale.z))}this.matrixWorldNeedsUpdate=true},updateMatrixWorld:function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a){this.parent?this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixWorldNeedsUpdate=false;a=true}for(var b=0,c=this.children.length;b<
c;b++)this.children[b].updateMatrixWorld(a)}};THREE.Object3DCount=0;
THREE.Projector=function(){function a(){var a=g[f]=g[f]||new THREE.RenderableObject;f++;return a}function b(){var a=l[j]=l[j]||new THREE.RenderableVertex;j++;return a}function c(a,b){return b.z-a.z}function d(a,b){var c=0,d=1,e=a.z+a.w,f=b.z+b.w,g=-a.z+a.w,h=-b.z+b.w;if(e>=0&&f>=0&&g>=0&&h>=0)return true;if(e<0&&f<0||g<0&&h<0)return false;e<0?c=Math.max(c,e/(e-f)):f<0&&(d=Math.min(d,e/(e-f)));g<0?c=Math.max(c,g/(g-h)):h<0&&(d=Math.min(d,g/(g-h)));if(d<c)return false;a.lerpSelf(b,c);b.lerpSelf(a,1-
d);return true}var e,f,g=[],h,j,l=[],k,p,m=[],o,q=[],n,r,u=[],t,y,s=[],w={objects:[],sprites:[],lights:[],elements:[]},H=new THREE.Vector3,E=new THREE.Vector4,z=new THREE.Matrix4,v=new THREE.Matrix4,A=new THREE.Frustum,J=new THREE.Vector4,K=new THREE.Vector4;this.projectVector=function(a,b){b.matrixWorldInverse.getInverse(b.matrixWorld);z.multiply(b.projectionMatrix,b.matrixWorldInverse);z.multiplyVector3(a);return a};this.unprojectVector=function(a,b){b.projectionMatrixInverse.getInverse(b.projectionMatrix);
z.multiply(b.matrixWorld,b.projectionMatrixInverse);z.multiplyVector3(a);return a};this.pickingRay=function(a,b){var c;a.z=-1;c=new THREE.Vector3(a.x,a.y,1);this.unprojectVector(a,b);this.unprojectVector(c,b);c.subSelf(a).normalize();return new THREE.Ray(a,c)};this.projectGraph=function(b,d){f=0;w.objects.length=0;w.sprites.length=0;w.lights.length=0;var g=function(b){if(b.visible!==false){if((b instanceof THREE.Mesh||b instanceof THREE.Line)&&(b.frustumCulled===false||A.contains(b))){H.copy(b.matrixWorld.getPosition());
z.multiplyVector3(H);e=a();e.object=b;e.z=H.z;w.objects.push(e)}else if(b instanceof THREE.Sprite||b instanceof THREE.Particle){H.copy(b.matrixWorld.getPosition());z.multiplyVector3(H);e=a();e.object=b;e.z=H.z;w.sprites.push(e)}else b instanceof THREE.Light&&w.lights.push(b);for(var c=0,d=b.children.length;c<d;c++)g(b.children[c])}};g(b);d&&w.objects.sort(c);return w};this.projectScene=function(a,e,f){var g=e.near,G=e.far,i=false,H,U,C,Y,F,ea,fa,ia,O,Q,Z,$,ha,Ma,Ka;y=r=o=p=0;w.elements.length=0;if(e.parent===
void 0){console.warn("DEPRECATED: Camera hasn't been added to a Scene. Adding it...");a.add(e)}a.updateMatrixWorld();e.matrixWorldInverse.getInverse(e.matrixWorld);z.multiply(e.projectionMatrix,e.matrixWorldInverse);A.setFromMatrix(z);w=this.projectGraph(a,false);a=0;for(H=w.objects.length;a<H;a++){O=w.objects[a].object;Q=O.matrixWorld;j=0;if(O instanceof THREE.Mesh){Z=O.geometry;$=O.geometry.materials;Y=Z.vertices;ha=Z.faces;Ma=Z.faceVertexUvs;Z=O.matrixRotationWorld.extractRotation(Q);U=0;for(C=
Y.length;U<C;U++){h=b();h.positionWorld.copy(Y[U]);Q.multiplyVector3(h.positionWorld);h.positionScreen.copy(h.positionWorld);z.multiplyVector4(h.positionScreen);h.positionScreen.x=h.positionScreen.x/h.positionScreen.w;h.positionScreen.y=h.positionScreen.y/h.positionScreen.w;h.visible=h.positionScreen.z>g&&h.positionScreen.z<G}Y=0;for(U=ha.length;Y<U;Y++){C=ha[Y];if(C instanceof THREE.Face3){F=l[C.a];ea=l[C.b];fa=l[C.c];if(F.visible&&ea.visible&&fa.visible){i=(fa.positionScreen.x-F.positionScreen.x)*
(ea.positionScreen.y-F.positionScreen.y)-(fa.positionScreen.y-F.positionScreen.y)*(ea.positionScreen.x-F.positionScreen.x)<0;if(O.doubleSided||i!=O.flipSided){ia=m[p]=m[p]||new THREE.RenderableFace3;p++;k=ia;k.v1.copy(F);k.v2.copy(ea);k.v3.copy(fa)}else continue}else continue}else if(C instanceof THREE.Face4){F=l[C.a];ea=l[C.b];fa=l[C.c];ia=l[C.d];if(F.visible&&ea.visible&&fa.visible&&ia.visible){i=(ia.positionScreen.x-F.positionScreen.x)*(ea.positionScreen.y-F.positionScreen.y)-(ia.positionScreen.y-
F.positionScreen.y)*(ea.positionScreen.x-F.positionScreen.x)<0||(ea.positionScreen.x-fa.positionScreen.x)*(ia.positionScreen.y-fa.positionScreen.y)-(ea.positionScreen.y-fa.positionScreen.y)*(ia.positionScreen.x-fa.positionScreen.x)<0;if(O.doubleSided||i!=O.flipSided){Ka=q[o]=q[o]||new THREE.RenderableFace4;o++;k=Ka;k.v1.copy(F);k.v2.copy(ea);k.v3.copy(fa);k.v4.copy(ia)}else continue}else continue}k.normalWorld.copy(C.normal);!i&&(O.flipSided||O.doubleSided)&&k.normalWorld.negate();Z.multiplyVector3(k.normalWorld);
k.centroidWorld.copy(C.centroid);Q.multiplyVector3(k.centroidWorld);k.centroidScreen.copy(k.centroidWorld);z.multiplyVector3(k.centroidScreen);fa=C.vertexNormals;F=0;for(ea=fa.length;F<ea;F++){ia=k.vertexNormalsWorld[F];ia.copy(fa[F]);!i&&(O.flipSided||O.doubleSided)&&ia.negate();Z.multiplyVector3(ia)}F=0;for(ea=Ma.length;F<ea;F++)if(Ka=Ma[F][Y]){fa=0;for(ia=Ka.length;fa<ia;fa++)k.uvs[F][fa]=Ka[fa]}k.material=O.material;k.faceMaterial=C.materialIndex!==null?$[C.materialIndex]:null;k.z=k.centroidScreen.z;
w.elements.push(k)}}else if(O instanceof THREE.Line){v.multiply(z,Q);Y=O.geometry.vertices;F=b();F.positionScreen.copy(Y[0]);v.multiplyVector4(F.positionScreen);Q=O.type===THREE.LinePieces?2:1;U=1;for(C=Y.length;U<C;U++){F=b();F.positionScreen.copy(Y[U]);v.multiplyVector4(F.positionScreen);if(!((U+1)%Q>0)){ea=l[j-2];J.copy(F.positionScreen);K.copy(ea.positionScreen);if(d(J,K)){J.multiplyScalar(1/J.w);K.multiplyScalar(1/K.w);$=u[r]=u[r]||new THREE.RenderableLine;r++;n=$;n.v1.positionScreen.copy(J);
n.v2.positionScreen.copy(K);n.z=Math.max(J.z,K.z);n.material=O.material;w.elements.push(n)}}}}}a=0;for(H=w.sprites.length;a<H;a++){O=w.sprites[a].object;Q=O.matrixWorld;if(O instanceof THREE.Particle){E.set(Q.elements[12],Q.elements[13],Q.elements[14],1);z.multiplyVector4(E);E.z=E.z/E.w;if(E.z>0&&E.z<1){g=s[y]=s[y]||new THREE.RenderableParticle;y++;t=g;t.x=E.x/E.w;t.y=E.y/E.w;t.z=E.z;t.rotation=O.rotation.z;t.scale.x=O.scale.x*Math.abs(t.x-(E.x+e.projectionMatrix.elements[0])/(E.w+e.projectionMatrix.elements[12]));
t.scale.y=O.scale.y*Math.abs(t.y-(E.y+e.projectionMatrix.elements[5])/(E.w+e.projectionMatrix.elements[13]));t.material=O.material;w.elements.push(t)}}}f&&w.elements.sort(c);return w}};THREE.Quaternion=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=d!==void 0?d:1};
THREE.Quaternion.prototype={constructor:THREE.Quaternion,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w;return this},setFromEuler:function(a){var b=Math.PI/360,c=a.x*b,d=a.y*b,e=a.z*b,a=Math.cos(d),d=Math.sin(d),b=Math.cos(-e),e=Math.sin(-e),f=Math.cos(c),c=Math.sin(c),g=a*b,h=d*e;this.w=g*f-h*c;this.x=g*c+h*f;this.y=d*b*f+a*e*c;this.z=a*e*f-d*b*c;return this},setFromAxisAngle:function(a,b){var c=b/2,d=Math.sin(c);
this.x=a.x*d;this.y=a.y*d;this.z=a.z*d;this.w=Math.cos(c);return this},setFromRotationMatrix:function(a){var b=Math.pow(a.determinant(),1/3);this.w=Math.sqrt(Math.max(0,b+a.elements[0]+a.elements[5]+a.elements[10]))/2;this.x=Math.sqrt(Math.max(0,b+a.elements[0]-a.elements[5]-a.elements[10]))/2;this.y=Math.sqrt(Math.max(0,b-a.elements[0]+a.elements[5]-a.elements[10]))/2;this.z=Math.sqrt(Math.max(0,b-a.elements[0]-a.elements[5]+a.elements[10]))/2;this.x=a.elements[6]-a.elements[9]<0?-Math.abs(this.x):
Math.abs(this.x);this.y=a.elements[8]-a.elements[2]<0?-Math.abs(this.y):Math.abs(this.y);this.z=a.elements[1]-a.elements[4]<0?-Math.abs(this.z):Math.abs(this.z);this.normalize();return this},calculateW:function(){this.w=-Math.sqrt(Math.abs(1-this.x*this.x-this.y*this.y-this.z*this.z));return this},inverse:function(){this.x=this.x*-1;this.y=this.y*-1;this.z=this.z*-1;return this},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},normalize:function(){var a=
Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);if(a===0)this.w=this.z=this.y=this.x=0;else{a=1/a;this.x=this.x*a;this.y=this.y*a;this.z=this.z*a;this.w=this.w*a}return this},multiply:function(a,b){this.x=a.x*b.w+a.y*b.z-a.z*b.y+a.w*b.x;this.y=-a.x*b.z+a.y*b.w+a.z*b.x+a.w*b.y;this.z=a.x*b.y-a.y*b.x+a.z*b.w+a.w*b.z;this.w=-a.x*b.x-a.y*b.y-a.z*b.z+a.w*b.w;return this},multiplySelf:function(a){var b=this.x,c=this.y,d=this.z,e=this.w,f=a.x,g=a.y,h=a.z,a=a.w;this.x=b*a+e*f+c*h-d*g;this.y=
c*a+e*g+d*f-b*h;this.z=d*a+e*h+b*g-c*f;this.w=e*a-b*f-c*g-d*h;return this},multiplyVector3:function(a,b){b||(b=a);var c=a.x,d=a.y,e=a.z,f=this.x,g=this.y,h=this.z,j=this.w,l=j*c+g*e-h*d,k=j*d+h*c-f*e,p=j*e+f*d-g*c,c=-f*c-g*d-h*e;b.x=l*j+c*-f+k*-h-p*-g;b.y=k*j+c*-g+p*-f-l*-h;b.z=p*j+c*-h+l*-g-k*-f;return b},clone:function(){return new THREE.Quaternion(this.x,this.y,this.z,this.w)}};
THREE.Quaternion.slerp=function(a,b,c,d){var e=a.w*b.w+a.x*b.x+a.y*b.y+a.z*b.z;if(e<0){c.w=-b.w;c.x=-b.x;c.y=-b.y;c.z=-b.z;e=-e}else c.copy(b);if(Math.abs(e)>=1){c.w=a.w;c.x=a.x;c.y=a.y;c.z=a.z;return c}var f=Math.acos(e),e=Math.sqrt(1-e*e);if(Math.abs(e)<0.001){c.w=0.5*(a.w+b.w);c.x=0.5*(a.x+b.x);c.y=0.5*(a.y+b.y);c.z=0.5*(a.z+b.z);return c}b=Math.sin((1-d)*f)/e;d=Math.sin(d*f)/e;c.w=a.w*b+c.w*d;c.x=a.x*b+c.x*d;c.y=a.y*b+c.y*d;c.z=a.z*b+c.z*d;return c};THREE.Vertex=function(){console.warn("THREE.Vertex has been DEPRECATED. Use THREE.Vector3 instead.")};
THREE.Face3=function(a,b,c,d,e,f){this.a=a;this.b=b;this.c=c;this.normal=d instanceof THREE.Vector3?d:new THREE.Vector3;this.vertexNormals=d instanceof Array?d:[];this.color=e instanceof THREE.Color?e:new THREE.Color;this.vertexColors=e instanceof Array?e:[];this.vertexTangents=[];this.materialIndex=f;this.centroid=new THREE.Vector3};
THREE.Face3.prototype={constructor:THREE.Face3,clone:function(){var a=new THREE.Face3(this.a,this.b,this.c);a.normal.copy(this.normal);a.color.copy(this.color);a.centroid.copy(this.centroid);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();
return a}};THREE.Face4=function(a,b,c,d,e,f,g){this.a=a;this.b=b;this.c=c;this.d=d;this.normal=e instanceof THREE.Vector3?e:new THREE.Vector3;this.vertexNormals=e instanceof Array?e:[];this.color=f instanceof THREE.Color?f:new THREE.Color;this.vertexColors=f instanceof Array?f:[];this.vertexTangents=[];this.materialIndex=g;this.centroid=new THREE.Vector3};
THREE.Face4.prototype={constructor:THREE.Face4,clone:function(){var a=new THREE.Face4(this.a,this.b,this.c,this.d);a.normal.copy(this.normal);a.color.copy(this.color);a.centroid.copy(this.centroid);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();
return a}};THREE.UV=function(a,b){this.u=a||0;this.v=b||0};THREE.UV.prototype={constructor:THREE.UV,set:function(a,b){this.u=a;this.v=b;return this},copy:function(a){this.u=a.u;this.v=a.v;return this},lerpSelf:function(a,b){this.u=this.u+(a.u-this.u)*b;this.v=this.v+(a.v-this.v)*b;return this},clone:function(){return new THREE.UV(this.u,this.v)}};
THREE.Geometry=function(){this.id=THREE.GeometryCount++;this.vertices=[];this.colors=[];this.materials=[];this.faces=[];this.faceUvs=[[]];this.faceVertexUvs=[[]];this.morphTargets=[];this.morphColors=[];this.morphNormals=[];this.skinWeights=[];this.skinIndices=[];this.boundingSphere=this.boundingBox=null;this.dynamic=this.hasTangents=false};
THREE.Geometry.prototype={constructor:THREE.Geometry,applyMatrix:function(a){var b=new THREE.Matrix4;b.extractRotation(a);for(var c=0,d=this.vertices.length;c<d;c++)a.multiplyVector3(this.vertices[c]);c=0;for(d=this.faces.length;c<d;c++){var e=this.faces[c];b.multiplyVector3(e.normal);for(var f=0,g=e.vertexNormals.length;f<g;f++)b.multiplyVector3(e.vertexNormals[f]);a.multiplyVector3(e.centroid)}},computeCentroids:function(){var a,b,c;a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];c.centroid.set(0,
0,0);if(c instanceof THREE.Face3){c.centroid.addSelf(this.vertices[c.a]);c.centroid.addSelf(this.vertices[c.b]);c.centroid.addSelf(this.vertices[c.c]);c.centroid.divideScalar(3)}else if(c instanceof THREE.Face4){c.centroid.addSelf(this.vertices[c.a]);c.centroid.addSelf(this.vertices[c.b]);c.centroid.addSelf(this.vertices[c.c]);c.centroid.addSelf(this.vertices[c.d]);c.centroid.divideScalar(4)}}},computeFaceNormals:function(){var a,b,c,d,e,f,g=new THREE.Vector3,h=new THREE.Vector3;a=0;for(b=this.faces.length;a<
b;a++){c=this.faces[a];d=this.vertices[c.a];e=this.vertices[c.b];f=this.vertices[c.c];g.sub(f,e);h.sub(d,e);g.crossSelf(h);g.isZero()||g.normalize();c.normal.copy(g)}},computeVertexNormals:function(){var a,b,c,d;if(this.__tmpVertices===void 0){d=this.__tmpVertices=Array(this.vertices.length);a=0;for(b=this.vertices.length;a<b;a++)d[a]=new THREE.Vector3;a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];if(c instanceof THREE.Face3)c.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];
else if(c instanceof THREE.Face4)c.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3]}}else{d=this.__tmpVertices;a=0;for(b=this.vertices.length;a<b;a++)d[a].set(0,0,0)}a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];if(c instanceof THREE.Face3){d[c.a].addSelf(c.normal);d[c.b].addSelf(c.normal);d[c.c].addSelf(c.normal)}else if(c instanceof THREE.Face4){d[c.a].addSelf(c.normal);d[c.b].addSelf(c.normal);d[c.c].addSelf(c.normal);d[c.d].addSelf(c.normal)}}a=0;
for(b=this.vertices.length;a<b;a++)d[a].normalize();a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];if(c instanceof THREE.Face3){c.vertexNormals[0].copy(d[c.a]);c.vertexNormals[1].copy(d[c.b]);c.vertexNormals[2].copy(d[c.c])}else if(c instanceof THREE.Face4){c.vertexNormals[0].copy(d[c.a]);c.vertexNormals[1].copy(d[c.b]);c.vertexNormals[2].copy(d[c.c]);c.vertexNormals[3].copy(d[c.d])}}},computeMorphNormals:function(){var a,b,c,d,e;c=0;for(d=this.faces.length;c<d;c++){e=this.faces[c];e.__originalFaceNormal?
e.__originalFaceNormal.copy(e.normal):e.__originalFaceNormal=e.normal.clone();if(!e.__originalVertexNormals)e.__originalVertexNormals=[];a=0;for(b=e.vertexNormals.length;a<b;a++)e.__originalVertexNormals[a]?e.__originalVertexNormals[a].copy(e.vertexNormals[a]):e.__originalVertexNormals[a]=e.vertexNormals[a].clone()}var f=new THREE.Geometry;f.faces=this.faces;a=0;for(b=this.morphTargets.length;a<b;a++){if(!this.morphNormals[a]){this.morphNormals[a]={};this.morphNormals[a].faceNormals=[];this.morphNormals[a].vertexNormals=
[];var g=this.morphNormals[a].faceNormals,h=this.morphNormals[a].vertexNormals,j,l;c=0;for(d=this.faces.length;c<d;c++){e=this.faces[c];j=new THREE.Vector3;l=e instanceof THREE.Face3?{a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3}:{a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3,d:new THREE.Vector3};g.push(j);h.push(l)}}g=this.morphNormals[a];f.vertices=this.morphTargets[a].vertices;f.computeFaceNormals();f.computeVertexNormals();c=0;for(d=this.faces.length;c<d;c++){e=this.faces[c];
j=g.faceNormals[c];l=g.vertexNormals[c];j.copy(e.normal);if(e instanceof THREE.Face3){l.a.copy(e.vertexNormals[0]);l.b.copy(e.vertexNormals[1]);l.c.copy(e.vertexNormals[2])}else{l.a.copy(e.vertexNormals[0]);l.b.copy(e.vertexNormals[1]);l.c.copy(e.vertexNormals[2]);l.d.copy(e.vertexNormals[3])}}}c=0;for(d=this.faces.length;c<d;c++){e=this.faces[c];e.normal=e.__originalFaceNormal;e.vertexNormals=e.__originalVertexNormals}},computeTangents:function(){function a(a,b,c,d,e,f,F){h=a.vertices[b];j=a.vertices[c];
l=a.vertices[d];k=g[e];p=g[f];m=g[F];o=j.x-h.x;q=l.x-h.x;n=j.y-h.y;r=l.y-h.y;u=j.z-h.z;t=l.z-h.z;y=p.u-k.u;s=m.u-k.u;w=p.v-k.v;H=m.v-k.v;E=1/(y*H-s*w);J.set((H*o-w*q)*E,(H*n-w*r)*E,(H*u-w*t)*E);K.set((y*q-s*o)*E,(y*r-s*n)*E,(y*t-s*u)*E);v[b].addSelf(J);v[c].addSelf(J);v[d].addSelf(J);A[b].addSelf(K);A[c].addSelf(K);A[d].addSelf(K)}var b,c,d,e,f,g,h,j,l,k,p,m,o,q,n,r,u,t,y,s,w,H,E,z,v=[],A=[],J=new THREE.Vector3,K=new THREE.Vector3,R=new THREE.Vector3,P=new THREE.Vector3,D=new THREE.Vector3;b=0;for(c=
this.vertices.length;b<c;b++){v[b]=new THREE.Vector3;A[b]=new THREE.Vector3}b=0;for(c=this.faces.length;b<c;b++){f=this.faces[b];g=this.faceVertexUvs[0][b];if(f instanceof THREE.Face3)a(this,f.a,f.b,f.c,0,1,2);else if(f instanceof THREE.Face4){a(this,f.a,f.b,f.d,0,1,3);a(this,f.b,f.c,f.d,1,2,3)}}var M=["a","b","c","d"];b=0;for(c=this.faces.length;b<c;b++){f=this.faces[b];for(d=0;d<f.vertexNormals.length;d++){D.copy(f.vertexNormals[d]);e=f[M[d]];z=v[e];R.copy(z);R.subSelf(D.multiplyScalar(D.dot(z))).normalize();
P.cross(f.vertexNormals[d],z);e=P.dot(A[e]);e=e<0?-1:1;f.vertexTangents[d]=new THREE.Vector4(R.x,R.y,R.z,e)}}this.hasTangents=true},computeBoundingBox:function(){if(!this.boundingBox)this.boundingBox={min:new THREE.Vector3,max:new THREE.Vector3};if(this.vertices.length>0){var a;a=this.vertices[0];this.boundingBox.min.copy(a);this.boundingBox.max.copy(a);for(var b=this.boundingBox.min,c=this.boundingBox.max,d=1,e=this.vertices.length;d<e;d++){a=this.vertices[d];if(a.x<b.x)b.x=a.x;else if(a.x>c.x)c.x=
a.x;if(a.y<b.y)b.y=a.y;else if(a.y>c.y)c.y=a.y;if(a.z<b.z)b.z=a.z;else if(a.z>c.z)c.z=a.z}}else{this.boundingBox.min.set(0,0,0);this.boundingBox.max.set(0,0,0)}},computeBoundingSphere:function(){if(!this.boundingSphere)this.boundingSphere={radius:0};for(var a,b=0,c=0,d=this.vertices.length;c<d;c++){a=this.vertices[c].length();a>b&&(b=a)}this.boundingSphere.radius=b},mergeVertices:function(){var a={},b=[],c=[],d,e=Math.pow(10,4),f,g,h;f=0;for(g=this.vertices.length;f<g;f++){d=this.vertices[f];d=[Math.round(d.x*
e),Math.round(d.y*e),Math.round(d.z*e)].join("_");if(a[d]===void 0){a[d]=f;b.push(this.vertices[f]);c[f]=b.length-1}else c[f]=c[a[d]]}f=0;for(g=this.faces.length;f<g;f++){e=this.faces[f];if(e instanceof THREE.Face3){e.a=c[e.a];e.b=c[e.b];e.c=c[e.c]}else if(e instanceof THREE.Face4){e.a=c[e.a];e.b=c[e.b];e.c=c[e.c];e.d=c[e.d];d=[e.a,e.b,e.c,e.d];for(a=3;a>0;a--)if(d.indexOf(e["abcd"[a]])!=a){d.splice(a,1);this.faces[f]=new THREE.Face3(d[0],d[1],d[2]);e=0;for(d=this.faceVertexUvs.length;e<d;e++)(h=
this.faceVertexUvs[e][f])&&h.splice(a,1);break}}}c=this.vertices.length-b.length;this.vertices=b;return c}};THREE.GeometryCount=0;
THREE.Spline=function(a){function b(a,b,c,d,e,f,g){a=(c-a)*0.5;d=(d-b)*0.5;return(2*(b-c)+a+d)*g+(-3*(b-c)-2*a-d)*f+a*e+b}this.points=a;var c=[],d={x:0,y:0,z:0},e,f,g,h,j,l,k,p,m;this.initFromArray=function(a){this.points=[];for(var b=0;b<a.length;b++)this.points[b]={x:a[b][0],y:a[b][1],z:a[b][2]}};this.getPoint=function(a){e=(this.points.length-1)*a;f=Math.floor(e);g=e-f;c[0]=f===0?f:f-1;c[1]=f;c[2]=f>this.points.length-2?this.points.length-1:f+1;c[3]=f>this.points.length-3?this.points.length-1:
f+2;l=this.points[c[0]];k=this.points[c[1]];p=this.points[c[2]];m=this.points[c[3]];h=g*g;j=g*h;d.x=b(l.x,k.x,p.x,m.x,g,h,j);d.y=b(l.y,k.y,p.y,m.y,g,h,j);d.z=b(l.z,k.z,p.z,m.z,g,h,j);return d};this.getControlPointsArray=function(){var a,b,c=this.points.length,d=[];for(a=0;a<c;a++){b=this.points[a];d[a]=[b.x,b.y,b.z]}return d};this.getLength=function(a){var b,c,d,e=b=b=0,f=new THREE.Vector3,g=new THREE.Vector3,h=[],j=0;h[0]=0;a||(a=100);c=this.points.length*a;f.copy(this.points[0]);for(a=1;a<c;a++){b=
a/c;d=this.getPoint(b);g.copy(d);j=j+g.distanceTo(f);f.copy(d);b=(this.points.length-1)*b;b=Math.floor(b);if(b!=e){h[b]=j;e=b}}h[h.length]=j;return{chunks:h,total:j}};this.reparametrizeByArcLength=function(a){var b,c,d,e,f,g,h=[],j=new THREE.Vector3,k=this.getLength();h.push(j.copy(this.points[0]).clone());for(b=1;b<this.points.length;b++){c=k.chunks[b]-k.chunks[b-1];g=Math.ceil(a*c/k.total);e=(b-1)/(this.points.length-1);f=b/(this.points.length-1);for(c=1;c<g-1;c++){d=e+c*(1/g)*(f-e);d=this.getPoint(d);
h.push(j.copy(d).clone())}h.push(j.copy(this.points[b]).clone())}this.points=h}};THREE.Camera=function(){THREE.Object3D.call(this);this.matrixWorldInverse=new THREE.Matrix4;this.projectionMatrix=new THREE.Matrix4;this.projectionMatrixInverse=new THREE.Matrix4};THREE.Camera.prototype=new THREE.Object3D;THREE.Camera.prototype.constructor=THREE.Camera;THREE.Camera.prototype.lookAt=function(a){this.matrix.lookAt(this.position,a,this.up);this.rotationAutoUpdate&&this.rotation.getRotationFromMatrix(this.matrix)};
THREE.OrthographicCamera=function(a,b,c,d,e,f){THREE.Camera.call(this);this.left=a;this.right=b;this.top=c;this.bottom=d;this.near=e!==void 0?e:0.1;this.far=f!==void 0?f:2E3;this.updateProjectionMatrix()};THREE.OrthographicCamera.prototype=new THREE.Camera;THREE.OrthographicCamera.prototype.constructor=THREE.OrthographicCamera;THREE.OrthographicCamera.prototype.updateProjectionMatrix=function(){this.projectionMatrix.makeOrthographic(this.left,this.right,this.top,this.bottom,this.near,this.far)};
THREE.PerspectiveCamera=function(a,b,c,d){THREE.Camera.call(this);this.fov=a!==void 0?a:50;this.aspect=b!==void 0?b:1;this.near=c!==void 0?c:0.1;this.far=d!==void 0?d:2E3;this.updateProjectionMatrix()};THREE.PerspectiveCamera.prototype=new THREE.Camera;THREE.PerspectiveCamera.prototype.constructor=THREE.PerspectiveCamera;THREE.PerspectiveCamera.prototype.setLens=function(a,b){this.fov=2*Math.atan((b!==void 0?b:24)/(a*2))*(180/Math.PI);this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.setViewOffset=function(a,b,c,d,e,f){this.fullWidth=a;this.fullHeight=b;this.x=c;this.y=d;this.width=e;this.height=f;this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.updateProjectionMatrix=function(){if(this.fullWidth){var a=this.fullWidth/this.fullHeight,b=Math.tan(this.fov*Math.PI/360)*this.near,c=-b,d=a*c,a=Math.abs(a*b-d),c=Math.abs(b-c);this.projectionMatrix.makeFrustum(d+this.x*a/this.fullWidth,d+(this.x+this.width)*a/this.fullWidth,b-(this.y+this.height)*c/this.fullHeight,b-this.y*c/this.fullHeight,this.near,this.far)}else this.projectionMatrix.makePerspective(this.fov,this.aspect,this.near,this.far)};
THREE.Light=function(a){THREE.Object3D.call(this);this.color=new THREE.Color(a)};THREE.Light.prototype=new THREE.Object3D;THREE.Light.prototype.constructor=THREE.Light;THREE.Light.prototype.supr=THREE.Object3D.prototype;THREE.AmbientLight=function(a){THREE.Light.call(this,a)};THREE.AmbientLight.prototype=new THREE.Light;THREE.AmbientLight.prototype.constructor=THREE.AmbientLight;
THREE.DirectionalLight=function(a,b,c){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,1,0);this.target=new THREE.Object3D;this.intensity=b!==void 0?b:1;this.distance=c!==void 0?c:0;this.onlyShadow=this.castShadow=false;this.shadowCameraNear=50;this.shadowCameraFar=5E3;this.shadowCameraLeft=-500;this.shadowCameraTop=this.shadowCameraRight=500;this.shadowCameraBottom=-500;this.shadowCameraVisible=false;this.shadowBias=0;this.shadowDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;
this.shadowCascade=false;this.shadowCascadeOffset=new THREE.Vector3(0,0,-1E3);this.shadowCascadeCount=2;this.shadowCascadeBias=[0,0,0];this.shadowCascadeWidth=[512,512,512];this.shadowCascadeHeight=[512,512,512];this.shadowCascadeNearZ=[-1,0.99,0.998];this.shadowCascadeFarZ=[0.99,0.998,1];this.shadowCascadeArray=[];this.shadowMatrix=this.shadowCamera=this.shadowMapSize=this.shadowMap=null};THREE.DirectionalLight.prototype=new THREE.Light;THREE.DirectionalLight.prototype.constructor=THREE.DirectionalLight;
THREE.PointLight=function(a,b,c){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,0,0);this.intensity=b!==void 0?b:1;this.distance=c!==void 0?c:0};THREE.PointLight.prototype=new THREE.Light;THREE.PointLight.prototype.constructor=THREE.PointLight;
THREE.SpotLight=function(a,b,c,d,e){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,1,0);this.target=new THREE.Object3D;this.intensity=b!==void 0?b:1;this.distance=c!==void 0?c:0;this.angle=d!==void 0?d:Math.PI/2;this.exponent=e!==void 0?e:10;this.onlyShadow=this.castShadow=false;this.shadowCameraNear=50;this.shadowCameraFar=5E3;this.shadowCameraFov=50;this.shadowCameraVisible=false;this.shadowBias=0;this.shadowDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;this.shadowMatrix=
this.shadowCamera=this.shadowMapSize=this.shadowMap=null};THREE.SpotLight.prototype=new THREE.Light;THREE.SpotLight.prototype.constructor=THREE.SpotLight;THREE.Loader=function(a){this.statusDomElement=(this.showStatus=a)?THREE.Loader.prototype.addStatusElement():null;this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){}};
THREE.Loader.prototype={constructor:THREE.Loader,crossOrigin:"anonymous",addStatusElement:function(){var a=document.createElement("div");a.style.position="absolute";a.style.right="0px";a.style.top="0px";a.style.fontSize="0.8em";a.style.textAlign="left";a.style.background="rgba(0,0,0,0.25)";a.style.color="#fff";a.style.width="120px";a.style.padding="0.5em 0.5em 0.5em 0.5em";a.style.zIndex=1E3;a.innerHTML="Loading ...";return a},updateProgress:function(a){var b="Loaded ",b=a.total?b+((100*a.loaded/
a.total).toFixed(0)+"%"):b+((a.loaded/1E3).toFixed(2)+" KB");this.statusDomElement.innerHTML=b},extractUrlBase:function(a){a=a.split("/");a.pop();return(a.length<1?".":a.join("/"))+"/"},initMaterials:function(a,b,c){a.materials=[];for(var d=0;d<b.length;++d)a.materials[d]=THREE.Loader.prototype.createMaterial(b[d],c)},hasNormals:function(a){var b,c,d=a.materials.length;for(c=0;c<d;c++){b=a.materials[c];if(b instanceof THREE.ShaderMaterial)return true}return false},createMaterial:function(a,b){function c(a){a=
Math.log(a)/Math.LN2;return Math.floor(a)==a}function d(a){a=Math.log(a)/Math.LN2;return Math.pow(2,Math.round(a))}function e(a,b){var e=new Image;e.onload=function(){if(!c(this.width)||!c(this.height)){var b=d(this.width),e=d(this.height);a.image.width=b;a.image.height=e;a.image.getContext("2d").drawImage(this,0,0,b,e)}else a.image=this;a.needsUpdate=true};e.crossOrigin=h.crossOrigin;e.src=b}function f(a,c,d,f,g,h){var j=document.createElement("canvas");a[c]=new THREE.Texture(j);a[c].sourceFile=
d;if(f){a[c].repeat.set(f[0],f[1]);if(f[0]!=1)a[c].wrapS=THREE.RepeatWrapping;if(f[1]!=1)a[c].wrapT=THREE.RepeatWrapping}g&&a[c].offset.set(g[0],g[1]);if(h){f={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};if(f[h[0]]!==void 0)a[c].wrapS=f[h[0]];if(f[h[1]]!==void 0)a[c].wrapT=f[h[1]]}e(a[c],b+"/"+d)}function g(a){return(a[0]*255<<16)+(a[1]*255<<8)+a[2]*255}var h=this,j="MeshLambertMaterial",l={color:15658734,opacity:1,map:null,lightMap:null,normalMap:null,wireframe:a.wireframe};
if(a.shading){var k=a.shading.toLowerCase();k==="phong"?j="MeshPhongMaterial":k==="basic"&&(j="MeshBasicMaterial")}if(a.blending!==void 0&&THREE[a.blending]!==void 0)l.blending=THREE[a.blending];if(a.transparent!==void 0||a.opacity<1)l.transparent=a.transparent;if(a.depthTest!==void 0)l.depthTest=a.depthTest;if(a.depthWrite!==void 0)l.depthWrite=a.depthWrite;if(a.vertexColors!==void 0)if(a.vertexColors=="face")l.vertexColors=THREE.FaceColors;else if(a.vertexColors)l.vertexColors=THREE.VertexColors;
if(a.colorDiffuse)l.color=g(a.colorDiffuse);else if(a.DbgColor)l.color=a.DbgColor;if(a.colorSpecular)l.specular=g(a.colorSpecular);if(a.colorAmbient)l.ambient=g(a.colorAmbient);if(a.transparency)l.opacity=a.transparency;if(a.specularCoef)l.shininess=a.specularCoef;a.mapDiffuse&&b&&f(l,"map",a.mapDiffuse,a.mapDiffuseRepeat,a.mapDiffuseOffset,a.mapDiffuseWrap);a.mapLight&&b&&f(l,"lightMap",a.mapLight,a.mapLightRepeat,a.mapLightOffset,a.mapLightWrap);a.mapNormal&&b&&f(l,"normalMap",a.mapNormal,a.mapNormalRepeat,
a.mapNormalOffset,a.mapNormalWrap);a.mapSpecular&&b&&f(l,"specularMap",a.mapSpecular,a.mapSpecularRepeat,a.mapSpecularOffset,a.mapSpecularWrap);if(a.mapNormal){j=THREE.ShaderUtils.lib.normal;k=THREE.UniformsUtils.clone(j.uniforms);k.tNormal.texture=l.normalMap;if(a.mapNormalFactor)k.uNormalScale.value=a.mapNormalFactor;if(l.map){k.tDiffuse.texture=l.map;k.enableDiffuse.value=true}if(l.specularMap){k.tSpecular.texture=l.specularMap;k.enableSpecular.value=true}if(l.lightMap){k.tAO.texture=l.lightMap;
k.enableAO.value=true}k.uDiffuseColor.value.setHex(l.color);k.uSpecularColor.value.setHex(l.specular);k.uAmbientColor.value.setHex(l.ambient);k.uShininess.value=l.shininess;if(l.opacity!==void 0)k.uOpacity.value=l.opacity;l=new THREE.ShaderMaterial({fragmentShader:j.fragmentShader,vertexShader:j.vertexShader,uniforms:k,lights:true,fog:true})}else l=new THREE[j](l);if(a.DbgName!==void 0)l.name=a.DbgName;return l}};THREE.BinaryLoader=function(a){THREE.Loader.call(this,a)};
THREE.BinaryLoader.prototype=new THREE.Loader;THREE.BinaryLoader.prototype.constructor=THREE.BinaryLoader;THREE.BinaryLoader.prototype.load=function(a,b,c,d){var c=c?c:this.extractUrlBase(a),d=d?d:this.extractUrlBase(a),e=this.showProgress?THREE.Loader.prototype.updateProgress:null;this.onLoadStart();this.loadAjaxJSON(this,a,b,c,d,e)};
THREE.BinaryLoader.prototype.loadAjaxJSON=function(a,b,c,d,e,f){var g=new XMLHttpRequest;g.onreadystatechange=function(){if(g.readyState==4)if(g.status==200||g.status==0){var h=JSON.parse(g.responseText);a.loadAjaxBuffers(h,c,e,d,f)}else console.error("THREE.BinaryLoader: Couldn't load ["+b+"] ["+g.status+"]")};g.open("GET",b,true);g.overrideMimeType&&g.overrideMimeType("text/plain; charset=x-user-defined");g.setRequestHeader("Content-Type","text/plain");g.send(null)};
THREE.BinaryLoader.prototype.loadAjaxBuffers=function(a,b,c,d,e){var f=new XMLHttpRequest,g=c+"/"+a.buffers,h=0;f.onreadystatechange=function(){if(f.readyState==4)f.status==200||f.status==0?THREE.BinaryLoader.prototype.createBinModel(f.response,b,d,a.materials):console.error("THREE.BinaryLoader: Couldn't load ["+g+"] ["+f.status+"]");else if(f.readyState==3){if(e){h==0&&(h=f.getResponseHeader("Content-Length"));e({total:h,loaded:f.responseText.length})}}else f.readyState==2&&(h=f.getResponseHeader("Content-Length"))};
f.open("GET",g,true);f.responseType="arraybuffer";f.send(null)};
THREE.BinaryLoader.prototype.createBinModel=function(a,b,c,d){var e=function(b){var c,e,j,l,k,p,m,o,q,n,r,u,t,y,s;function w(a){return a%4?4-a%4:0}function H(a,b){return(new Uint8Array(a,b,1))[0]}function E(a,b){return(new Uint32Array(a,b,1))[0]}function z(b,c){var d,e,f,g,h,i,j,k,l=new Uint32Array(a,c,3*b);for(d=0;d<b;d++){e=l[d*3];f=l[d*3+1];g=l[d*3+2];h=G[e*2];e=G[e*2+1];i=G[f*2];j=G[f*2+1];f=G[g*2];k=G[g*2+1];g=P.faceVertexUvs[0];var m=[];m.push(new THREE.UV(h,e));m.push(new THREE.UV(i,j));m.push(new THREE.UV(f,
k));g.push(m)}}function v(b,c){var d,e,f,g,h,i,j,k,l,m,n=new Uint32Array(a,c,4*b);for(d=0;d<b;d++){e=n[d*4];f=n[d*4+1];g=n[d*4+2];h=n[d*4+3];i=G[e*2];e=G[e*2+1];j=G[f*2];l=G[f*2+1];k=G[g*2];m=G[g*2+1];g=G[h*2];f=G[h*2+1];h=P.faceVertexUvs[0];var o=[];o.push(new THREE.UV(i,e));o.push(new THREE.UV(j,l));o.push(new THREE.UV(k,m));o.push(new THREE.UV(g,f));h.push(o)}}function A(b,c,d){for(var e,f,g,h,c=new Uint32Array(a,c,3*b),i=new Uint16Array(a,d,b),d=0;d<b;d++){e=c[d*3];f=c[d*3+1];g=c[d*3+2];h=i[d];
P.faces.push(new THREE.Face3(e,f,g,null,null,h))}}function J(b,c,d){for(var e,f,g,h,i,c=new Uint32Array(a,c,4*b),j=new Uint16Array(a,d,b),d=0;d<b;d++){e=c[d*4];f=c[d*4+1];g=c[d*4+2];h=c[d*4+3];i=j[d];P.faces.push(new THREE.Face4(e,f,g,h,null,null,i))}}function K(b,c,d,e){for(var f,g,h,i,j,k,l,c=new Uint32Array(a,c,3*b),d=new Uint32Array(a,d,3*b),m=new Uint16Array(a,e,b),e=0;e<b;e++){f=c[e*3];g=c[e*3+1];h=c[e*3+2];j=d[e*3];k=d[e*3+1];l=d[e*3+2];i=m[e];var n=M[k*3],o=M[k*3+1];k=M[k*3+2];var p=M[l*3],
q=M[l*3+1];l=M[l*3+2];P.faces.push(new THREE.Face3(f,g,h,[new THREE.Vector3(M[j*3],M[j*3+1],M[j*3+2]),new THREE.Vector3(n,o,k),new THREE.Vector3(p,q,l)],null,i))}}function R(b,c,d,e){for(var f,g,h,i,j,k,l,m,n,c=new Uint32Array(a,c,4*b),d=new Uint32Array(a,d,4*b),o=new Uint16Array(a,e,b),e=0;e<b;e++){f=c[e*4];g=c[e*4+1];h=c[e*4+2];i=c[e*4+3];k=d[e*4];l=d[e*4+1];m=d[e*4+2];n=d[e*4+3];j=o[e];var p=M[l*3],q=M[l*3+1];l=M[l*3+2];var r=M[m*3],s=M[m*3+1];m=M[m*3+2];var t=M[n*3],u=M[n*3+1];n=M[n*3+2];P.faces.push(new THREE.Face4(f,
g,h,i,[new THREE.Vector3(M[k*3],M[k*3+1],M[k*3+2]),new THREE.Vector3(p,q,l),new THREE.Vector3(r,s,m),new THREE.Vector3(t,u,n)],null,j))}}var P=this,D=0,M=[],G=[],i,T,U;THREE.Geometry.call(this);THREE.Loader.prototype.initMaterials(P,d,b);(function(a,b,c){for(var a=new Uint8Array(a,b,c),d="",e=0;e<c;e++)d=d+String.fromCharCode(a[b+e]);return d})(a,D,12);c=H(a,D+12);H(a,D+13);H(a,D+14);H(a,D+15);e=H(a,D+16);j=H(a,D+17);l=H(a,D+18);k=H(a,D+19);p=E(a,D+20);m=E(a,D+20+4);o=E(a,D+20+8);b=E(a,D+20+12);q=
E(a,D+20+16);n=E(a,D+20+20);r=E(a,D+20+24);u=E(a,D+20+28);t=E(a,D+20+32);y=E(a,D+20+36);s=E(a,D+20+40);D=D+c;c=e*3+k;U=e*4+k;i=b*c;T=q*(c+j*3);e=n*(c+l*3);k=r*(c+j*3+l*3);c=u*U;j=t*(U+j*4);l=y*(U+l*4);D=D+function(b){var b=new Float32Array(a,b,p*3),c,d,e,f;for(c=0;c<p;c++){d=b[c*3];e=b[c*3+1];f=b[c*3+2];P.vertices.push(new THREE.Vector3(d,e,f))}return p*3*Float32Array.BYTES_PER_ELEMENT}(D);D=D+function(b){if(m){var b=new Int8Array(a,b,m*3),c,d,e,f;for(c=0;c<m;c++){d=b[c*3];e=b[c*3+1];f=b[c*3+2];M.push(d/
127,e/127,f/127)}}return m*3*Int8Array.BYTES_PER_ELEMENT}(D);D=D+w(m*3);D=D+function(b){if(o){var b=new Float32Array(a,b,o*2),c,d,e;for(c=0;c<o;c++){d=b[c*2];e=b[c*2+1];G.push(d,e)}}return o*2*Float32Array.BYTES_PER_ELEMENT}(D);i=D+i+w(b*2);T=i+T+w(q*2);e=T+e+w(n*2);k=e+k+w(r*2);c=k+c+w(u*2);j=c+j+w(t*2);l=j+l+w(y*2);(function(a){if(n){var b=a+n*Uint32Array.BYTES_PER_ELEMENT*3;A(n,a,b+n*Uint32Array.BYTES_PER_ELEMENT*3);z(n,b)}})(T);(function(a){if(r){var b=a+r*Uint32Array.BYTES_PER_ELEMENT*3,c=b+
r*Uint32Array.BYTES_PER_ELEMENT*3;K(r,a,b,c+r*Uint32Array.BYTES_PER_ELEMENT*3);z(r,c)}})(e);(function(a){if(y){var b=a+y*Uint32Array.BYTES_PER_ELEMENT*4;J(y,a,b+y*Uint32Array.BYTES_PER_ELEMENT*4);v(y,b)}})(j);(function(a){if(s){var b=a+s*Uint32Array.BYTES_PER_ELEMENT*4,c=b+s*Uint32Array.BYTES_PER_ELEMENT*4;R(s,a,b,c+s*Uint32Array.BYTES_PER_ELEMENT*4);v(s,c)}})(l);b&&A(b,D,D+b*Uint32Array.BYTES_PER_ELEMENT*3);(function(a){if(q){var b=a+q*Uint32Array.BYTES_PER_ELEMENT*3;K(q,a,b,b+q*Uint32Array.BYTES_PER_ELEMENT*
3)}})(i);u&&J(u,k,k+u*Uint32Array.BYTES_PER_ELEMENT*4);(function(a){if(t){var b=a+t*Uint32Array.BYTES_PER_ELEMENT*4;R(t,a,b,b+t*Uint32Array.BYTES_PER_ELEMENT*4)}})(c);this.computeCentroids();this.computeFaceNormals();THREE.Loader.prototype.hasNormals(this)&&this.computeTangents()};e.prototype=new THREE.Geometry;e.prototype.constructor=e;b(new e(c))};THREE.JSONLoader=function(a){THREE.Loader.call(this,a)};THREE.JSONLoader.prototype=new THREE.Loader;THREE.JSONLoader.prototype.constructor=THREE.JSONLoader;
THREE.JSONLoader.prototype.load=function(a,b,c){c=c?c:this.extractUrlBase(a);this.onLoadStart();this.loadAjaxJSON(this,a,b,c)};
THREE.JSONLoader.prototype.loadAjaxJSON=function(a,b,c,d,e){var f=new XMLHttpRequest,g=0;f.onreadystatechange=function(){if(f.readyState===f.DONE)if(f.status===200||f.status===0){if(f.responseText){var h=JSON.parse(f.responseText);a.createModel(h,c,d)}else console.warn("THREE.JSONLoader: ["+b+"] seems to be unreachable or file there is empty");a.onLoadComplete()}else console.error("THREE.JSONLoader: Couldn't load ["+b+"] ["+f.status+"]");else if(f.readyState===f.LOADING){if(e){g===0&&(g=f.getResponseHeader("Content-Length"));
e({total:g,loaded:f.responseText.length})}}else f.readyState===f.HEADERS_RECEIVED&&(g=f.getResponseHeader("Content-Length"))};f.open("GET",b,true);f.overrideMimeType&&f.overrideMimeType("text/plain; charset=x-user-defined");f.setRequestHeader("Content-Type","text/plain");f.send(null)};
THREE.JSONLoader.prototype.createModel=function(a,b,c){var d=new THREE.Geometry,e=a.scale!==void 0?1/a.scale:1;this.initMaterials(d,a.materials,c);(function(b){var c,e,j,l,k,p,m,o,q,n,r,u,t,y,s=a.faces;p=a.vertices;var w=a.normals,H=a.colors,E=0;for(c=0;c<a.uvs.length;c++)a.uvs[c].length&&E++;for(c=0;c<E;c++){d.faceUvs[c]=[];d.faceVertexUvs[c]=[]}l=0;for(k=p.length;l<k;){m=new THREE.Vector3;m.x=p[l++]*b;m.y=p[l++]*b;m.z=p[l++]*b;d.vertices.push(m)}l=0;for(k=s.length;l<k;){b=s[l++];p=b&1;j=b&2;c=b&
4;e=b&8;o=b&16;m=b&32;n=b&64;b=b&128;if(p){r=new THREE.Face4;r.a=s[l++];r.b=s[l++];r.c=s[l++];r.d=s[l++];p=4}else{r=new THREE.Face3;r.a=s[l++];r.b=s[l++];r.c=s[l++];p=3}if(j){j=s[l++];r.materialIndex=j}j=d.faces.length;if(c)for(c=0;c<E;c++){u=a.uvs[c];q=s[l++];y=u[q*2];q=u[q*2+1];d.faceUvs[c][j]=new THREE.UV(y,q)}if(e)for(c=0;c<E;c++){u=a.uvs[c];t=[];for(e=0;e<p;e++){q=s[l++];y=u[q*2];q=u[q*2+1];t[e]=new THREE.UV(y,q)}d.faceVertexUvs[c][j]=t}if(o){o=s[l++]*3;e=new THREE.Vector3;e.x=w[o++];e.y=w[o++];
e.z=w[o];r.normal=e}if(m)for(c=0;c<p;c++){o=s[l++]*3;e=new THREE.Vector3;e.x=w[o++];e.y=w[o++];e.z=w[o];r.vertexNormals.push(e)}if(n){m=s[l++];m=new THREE.Color(H[m]);r.color=m}if(b)for(c=0;c<p;c++){m=s[l++];m=new THREE.Color(H[m]);r.vertexColors.push(m)}d.faces.push(r)}})(e);(function(){var b,c,e,j;if(a.skinWeights){b=0;for(c=a.skinWeights.length;b<c;b=b+2){e=a.skinWeights[b];j=a.skinWeights[b+1];d.skinWeights.push(new THREE.Vector4(e,j,0,0))}}if(a.skinIndices){b=0;for(c=a.skinIndices.length;b<c;b=
b+2){e=a.skinIndices[b];j=a.skinIndices[b+1];d.skinIndices.push(new THREE.Vector4(e,j,0,0))}}d.bones=a.bones;d.animation=a.animation})();(function(b){if(a.morphTargets!==void 0){var c,e,j,l,k,p;c=0;for(e=a.morphTargets.length;c<e;c++){d.morphTargets[c]={};d.morphTargets[c].name=a.morphTargets[c].name;d.morphTargets[c].vertices=[];k=d.morphTargets[c].vertices;p=a.morphTargets[c].vertices;j=0;for(l=p.length;j<l;j=j+3){var m=new THREE.Vector3;m.x=p[j]*b;m.y=p[j+1]*b;m.z=p[j+2]*b;k.push(m)}}}if(a.morphColors!==
void 0){c=0;for(e=a.morphColors.length;c<e;c++){d.morphColors[c]={};d.morphColors[c].name=a.morphColors[c].name;d.morphColors[c].colors=[];l=d.morphColors[c].colors;k=a.morphColors[c].colors;b=0;for(j=k.length;b<j;b=b+3){p=new THREE.Color(16755200);p.setRGB(k[b],k[b+1],k[b+2]);l.push(p)}}}})(e);d.computeCentroids();d.computeFaceNormals();this.hasNormals(d)&&d.computeTangents();b(d)};
THREE.SceneLoader=function(){this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){};this.callbackSync=function(){};this.callbackProgress=function(){}};THREE.SceneLoader.prototype.constructor=THREE.SceneLoader;
THREE.SceneLoader.prototype.load=function(a,b){var c=this,d=new XMLHttpRequest;d.onreadystatechange=function(){if(d.readyState==4)if(d.status==200||d.status==0){var e=JSON.parse(d.responseText);c.createScene(e,b,a)}else console.error("THREE.SceneLoader: Couldn't load ["+a+"] ["+d.status+"]")};d.open("GET",a,true);d.overrideMimeType&&d.overrideMimeType("text/plain; charset=x-user-defined");d.setRequestHeader("Content-Type","text/plain");d.send(null)};
THREE.SceneLoader.prototype.createScene=function(a,b,c){function d(a,b){return b=="relativeToHTML"?a:l+"/"+a}function e(){var a;for(m in D.objects)if(!C.objects[m]){u=D.objects[m];if(u.geometry!==void 0){if(J=C.geometries[u.geometry]){a=false;K=C.materials[u.materials[0]];(a=K instanceof THREE.ShaderMaterial)&&J.computeTangents();w=u.position;H=u.rotation;E=u.quaternion;z=u.scale;t=u.matrix;E=0;u.materials.length==0&&(K=new THREE.MeshFaceMaterial);u.materials.length>1&&(K=new THREE.MeshFaceMaterial);
a=new THREE.Mesh(J,K);a.name=m;if(t){a.matrixAutoUpdate=false;a.matrix.set(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15])}else{a.position.set(w[0],w[1],w[2]);if(E){a.quaternion.set(E[0],E[1],E[2],E[3]);a.useQuaternion=true}else a.rotation.set(H[0],H[1],H[2]);a.scale.set(z[0],z[1],z[2])}a.visible=u.visible;a.doubleSided=u.doubleSided;a.castShadow=u.castShadow;a.receiveShadow=u.receiveShadow;C.scene.add(a);C.objects[m]=a}}else{w=u.position;H=u.rotation;E=u.quaternion;
z=u.scale;E=0;a=new THREE.Object3D;a.name=m;a.position.set(w[0],w[1],w[2]);if(E){a.quaternion.set(E[0],E[1],E[2],E[3]);a.useQuaternion=true}else a.rotation.set(H[0],H[1],H[2]);a.scale.set(z[0],z[1],z[2]);a.visible=u.visible!==void 0?u.visible:false;C.scene.add(a);C.objects[m]=a;C.empties[m]=a}}}function f(a){return function(b){C.geometries[a]=b;e();G=G-1;j.onLoadComplete();h()}}function g(a){return function(b){C.geometries[a]=b}}function h(){j.callbackProgress({totalModels:T,totalTextures:U,loadedModels:T-
G,loadedTextures:U-i},C);j.onLoadProgress();G==0&&i==0&&b(C)}var j=this,l=THREE.Loader.prototype.extractUrlBase(c),k,p,m,o,q,n,r,u,t,y,s,w,H,E,z,v,A,J,K,R,P,D,M,G,i,T,U,C;D=a;c=new THREE.BinaryLoader;M=new THREE.JSONLoader;i=G=0;C={scene:new THREE.Scene,geometries:{},materials:{},textures:{},objects:{},cameras:{},lights:{},fogs:{},empties:{}};if(D.transform){a=D.transform.position;y=D.transform.rotation;v=D.transform.scale;a&&C.scene.position.set(a[0],a[1],a[2]);y&&C.scene.rotation.set(y[0],y[1],
y[2]);v&&C.scene.scale.set(v[0],v[1],v[2]);if(a||y||v){C.scene.updateMatrix();C.scene.updateMatrixWorld()}}a=function(){i=i-1;h();j.onLoadComplete()};for(q in D.cameras){v=D.cameras[q];v.type=="perspective"?R=new THREE.PerspectiveCamera(v.fov,v.aspect,v.near,v.far):v.type=="ortho"&&(R=new THREE.OrthographicCamera(v.left,v.right,v.top,v.bottom,v.near,v.far));w=v.position;y=v.target;v=v.up;R.position.set(w[0],w[1],w[2]);R.target=new THREE.Vector3(y[0],y[1],y[2]);v&&R.up.set(v[0],v[1],v[2]);C.cameras[q]=
R}for(o in D.lights){y=D.lights[o];q=y.color!==void 0?y.color:16777215;R=y.intensity!==void 0?y.intensity:1;if(y.type=="directional"){w=y.direction;s=new THREE.DirectionalLight(q,R);s.position.set(w[0],w[1],w[2]);s.position.normalize()}else if(y.type=="point"){w=y.position;s=y.distance;s=new THREE.PointLight(q,R,s);s.position.set(w[0],w[1],w[2])}else y.type=="ambient"&&(s=new THREE.AmbientLight(q));C.scene.add(s);C.lights[o]=s}for(n in D.fogs){o=D.fogs[n];o.type=="linear"?P=new THREE.Fog(0,o.near,
o.far):o.type=="exp2"&&(P=new THREE.FogExp2(0,o.density));v=o.color;P.color.setRGB(v[0],v[1],v[2]);C.fogs[n]=P}if(C.cameras&&D.defaults.camera)C.currentCamera=C.cameras[D.defaults.camera];if(C.fogs&&D.defaults.fog)C.scene.fog=C.fogs[D.defaults.fog];v=D.defaults.bgcolor;C.bgColor=new THREE.Color;C.bgColor.setRGB(v[0],v[1],v[2]);C.bgColorAlpha=D.defaults.bgalpha;for(k in D.geometries){n=D.geometries[k];if(n.type=="bin_mesh"||n.type=="ascii_mesh"){G=G+1;j.onLoadStart()}}T=G;for(k in D.geometries){n=
D.geometries[k];if(n.type=="cube"){J=new THREE.CubeGeometry(n.width,n.height,n.depth,n.segmentsWidth,n.segmentsHeight,n.segmentsDepth,null,n.flipped,n.sides);C.geometries[k]=J}else if(n.type=="plane"){J=new THREE.PlaneGeometry(n.width,n.height,n.segmentsWidth,n.segmentsHeight);C.geometries[k]=J}else if(n.type=="sphere"){J=new THREE.SphereGeometry(n.radius,n.segmentsWidth,n.segmentsHeight);C.geometries[k]=J}else if(n.type=="cylinder"){J=new THREE.CylinderGeometry(n.topRad,n.botRad,n.height,n.radSegs,
n.heightSegs);C.geometries[k]=J}else if(n.type=="torus"){J=new THREE.TorusGeometry(n.radius,n.tube,n.segmentsR,n.segmentsT);C.geometries[k]=J}else if(n.type=="icosahedron"){J=new THREE.IcosahedronGeometry(n.radius,n.subdivisions);C.geometries[k]=J}else if(n.type=="bin_mesh")c.load(d(n.url,D.urlBaseType),f(k));else if(n.type=="ascii_mesh")M.load(d(n.url,D.urlBaseType),f(k));else if(n.type=="embedded_mesh"){n=D.embeds[n.id];n.metadata=D.metadata;n&&M.createModel(n,g(k),"")}}for(r in D.textures){k=D.textures[r];
if(k.url instanceof Array){i=i+k.url.length;for(n=0;n<k.url.length;n++)j.onLoadStart()}else{i=i+1;j.onLoadStart()}}U=i;for(r in D.textures){k=D.textures[r];if(k.mapping!=void 0&&THREE[k.mapping]!=void 0)k.mapping=new THREE[k.mapping];if(k.url instanceof Array){n=[];for(P=0;P<k.url.length;P++)n[P]=d(k.url[P],D.urlBaseType);n=THREE.ImageUtils.loadTextureCube(n,k.mapping,a)}else{n=THREE.ImageUtils.loadTexture(d(k.url,D.urlBaseType),k.mapping,a);if(THREE[k.minFilter]!=void 0)n.minFilter=THREE[k.minFilter];
if(THREE[k.magFilter]!=void 0)n.magFilter=THREE[k.magFilter];if(k.repeat){n.repeat.set(k.repeat[0],k.repeat[1]);if(k.repeat[0]!=1)n.wrapS=THREE.RepeatWrapping;if(k.repeat[1]!=1)n.wrapT=THREE.RepeatWrapping}k.offset&&n.offset.set(k.offset[0],k.offset[1]);if(k.wrap){P={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};if(P[k.wrap[0]]!==void 0)n.wrapS=P[k.wrap[0]];if(P[k.wrap[1]]!==void 0)n.wrapT=P[k.wrap[1]]}}C.textures[r]=n}for(p in D.materials){t=D.materials[p];for(A in t.parameters)if(A==
"envMap"||A=="map"||A=="lightMap")t.parameters[A]=C.textures[t.parameters[A]];else if(A=="shading")t.parameters[A]=t.parameters[A]=="flat"?THREE.FlatShading:THREE.SmoothShading;else if(A=="blending")t.parameters[A]=THREE[t.parameters[A]]?THREE[t.parameters[A]]:THREE.NormalBlending;else if(A=="combine")t.parameters[A]=t.parameters[A]=="MixOperation"?THREE.MixOperation:THREE.MultiplyOperation;else if(A=="vertexColors")if(t.parameters[A]=="face")t.parameters[A]=THREE.FaceColors;else if(t.parameters[A])t.parameters[A]=
THREE.VertexColors;if(t.parameters.opacity!==void 0&&t.parameters.opacity<1)t.parameters.transparent=true;if(t.parameters.normalMap){r=THREE.ShaderUtils.lib.normal;a=THREE.UniformsUtils.clone(r.uniforms);k=t.parameters.color;n=t.parameters.specular;P=t.parameters.ambient;c=t.parameters.shininess;a.tNormal.texture=C.textures[t.parameters.normalMap];if(t.parameters.normalMapFactor)a.uNormalScale.value=t.parameters.normalMapFactor;if(t.parameters.map){a.tDiffuse.texture=t.parameters.map;a.enableDiffuse.value=
true}if(t.parameters.lightMap){a.tAO.texture=t.parameters.lightMap;a.enableAO.value=true}if(t.parameters.specularMap){a.tSpecular.texture=C.textures[t.parameters.specularMap];a.enableSpecular.value=true}a.uDiffuseColor.value.setHex(k);a.uSpecularColor.value.setHex(n);a.uAmbientColor.value.setHex(P);a.uShininess.value=c;if(t.parameters.opacity)a.uOpacity.value=t.parameters.opacity;K=new THREE.ShaderMaterial({fragmentShader:r.fragmentShader,vertexShader:r.vertexShader,uniforms:a,lights:true,fog:true})}else K=
new THREE[t.type](t.parameters);C.materials[p]=K}e();j.callbackSync(C);h()};
THREE.Material=function(a){a=a||{};this.id=THREE.MaterialCount++;this.name="";this.opacity=a.opacity!==void 0?a.opacity:1;this.transparent=a.transparent!==void 0?a.transparent:false;this.blending=a.blending!==void 0?a.blending:THREE.NormalBlending;this.blendSrc=a.blendSrc!==void 0?a.blendSrc:THREE.SrcAlphaFactor;this.blendDst=a.blendDst!==void 0?a.blendDst:THREE.OneMinusSrcAlphaFactor;this.blendEquation=a.blendEquation!==void 0?a.blendEquation:THREE.AddEquation;this.depthTest=a.depthTest!==void 0?
a.depthTest:true;this.depthWrite=a.depthWrite!==void 0?a.depthWrite:true;this.polygonOffset=a.polygonOffset!==void 0?a.polygonOffset:false;this.polygonOffsetFactor=a.polygonOffsetFactor!==void 0?a.polygonOffsetFactor:0;this.polygonOffsetUnits=a.polygonOffsetUnits!==void 0?a.polygonOffsetUnits:0;this.alphaTest=a.alphaTest!==void 0?a.alphaTest:0;this.overdraw=a.overdraw!==void 0?a.overdraw:false;this.needsUpdate=this.visible=true};THREE.MaterialCount=0;THREE.NoShading=0;THREE.FlatShading=1;
THREE.SmoothShading=2;THREE.NoColors=0;THREE.FaceColors=1;THREE.VertexColors=2;THREE.NoBlending=0;THREE.NormalBlending=1;THREE.AdditiveBlending=2;THREE.SubtractiveBlending=3;THREE.MultiplyBlending=4;THREE.AdditiveAlphaBlending=5;THREE.CustomBlending=6;THREE.AddEquation=100;THREE.SubtractEquation=101;THREE.ReverseSubtractEquation=102;THREE.ZeroFactor=200;THREE.OneFactor=201;THREE.SrcColorFactor=202;THREE.OneMinusSrcColorFactor=203;THREE.SrcAlphaFactor=204;THREE.OneMinusSrcAlphaFactor=205;
THREE.DstAlphaFactor=206;THREE.OneMinusDstAlphaFactor=207;THREE.DstColorFactor=208;THREE.OneMinusDstColorFactor=209;THREE.SrcAlphaSaturateFactor=210;
THREE.LineBasicMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.linewidth=a.linewidth!==void 0?a.linewidth:1;this.linecap=a.linecap!==void 0?a.linecap:"round";this.linejoin=a.linejoin!==void 0?a.linejoin:"round";this.vertexColors=a.vertexColors?a.vertexColors:false;this.fog=a.fog!==void 0?a.fog:true};THREE.LineBasicMaterial.prototype=new THREE.Material;THREE.LineBasicMaterial.prototype.constructor=THREE.LineBasicMaterial;
THREE.MeshBasicMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.map=a.map!==void 0?a.map:null;this.lightMap=a.lightMap!==void 0?a.lightMap:null;this.envMap=a.envMap!==void 0?a.envMap:null;this.combine=a.combine!==void 0?a.combine:THREE.MultiplyOperation;this.reflectivity=a.reflectivity!==void 0?a.reflectivity:1;this.refractionRatio=a.refractionRatio!==void 0?a.refractionRatio:0.98;this.fog=a.fog!==void 0?a.fog:
true;this.shading=a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1;this.wireframeLinecap=a.wireframeLinecap!==void 0?a.wireframeLinecap:"round";this.wireframeLinejoin=a.wireframeLinejoin!==void 0?a.wireframeLinejoin:"round";this.vertexColors=a.vertexColors!==void 0?a.vertexColors:THREE.NoColors;this.skinning=a.skinning!==void 0?a.skinning:false;this.morphTargets=a.morphTargets!==
void 0?a.morphTargets:false};THREE.MeshBasicMaterial.prototype=new THREE.Material;THREE.MeshBasicMaterial.prototype.constructor=THREE.MeshBasicMaterial;
THREE.MeshLambertMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.ambient=a.ambient!==void 0?new THREE.Color(a.ambient):new THREE.Color(16777215);this.emissive=a.emissive!==void 0?new THREE.Color(a.emissive):new THREE.Color(0);this.wrapAround=a.wrapAround!==void 0?a.wrapAround:false;this.wrapRGB=new THREE.Vector3(1,1,1);this.map=a.map!==void 0?a.map:null;this.lightMap=a.lightMap!==void 0?a.lightMap:null;this.envMap=
a.envMap!==void 0?a.envMap:null;this.combine=a.combine!==void 0?a.combine:THREE.MultiplyOperation;this.reflectivity=a.reflectivity!==void 0?a.reflectivity:1;this.refractionRatio=a.refractionRatio!==void 0?a.refractionRatio:0.98;this.fog=a.fog!==void 0?a.fog:true;this.shading=a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1;this.wireframeLinecap=a.wireframeLinecap!==void 0?
a.wireframeLinecap:"round";this.wireframeLinejoin=a.wireframeLinejoin!==void 0?a.wireframeLinejoin:"round";this.vertexColors=a.vertexColors!==void 0?a.vertexColors:THREE.NoColors;this.skinning=a.skinning!==void 0?a.skinning:false;this.morphTargets=a.morphTargets!==void 0?a.morphTargets:false;this.morphNormals=a.morphNormals!==void 0?a.morphNormals:false};THREE.MeshLambertMaterial.prototype=new THREE.Material;THREE.MeshLambertMaterial.prototype.constructor=THREE.MeshLambertMaterial;
THREE.MeshPhongMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.ambient=a.ambient!==void 0?new THREE.Color(a.ambient):new THREE.Color(16777215);this.emissive=a.emissive!==void 0?new THREE.Color(a.emissive):new THREE.Color(0);this.specular=a.specular!==void 0?new THREE.Color(a.specular):new THREE.Color(1118481);this.shininess=a.shininess!==void 0?a.shininess:30;this.metal=a.metal!==void 0?a.metal:false;this.perPixel=
a.perPixel!==void 0?a.perPixel:false;this.wrapAround=a.wrapAround!==void 0?a.wrapAround:false;this.wrapRGB=new THREE.Vector3(1,1,1);this.map=a.map!==void 0?a.map:null;this.lightMap=a.lightMap!==void 0?a.lightMap:null;this.envMap=a.envMap!==void 0?a.envMap:null;this.combine=a.combine!==void 0?a.combine:THREE.MultiplyOperation;this.reflectivity=a.reflectivity!==void 0?a.reflectivity:1;this.refractionRatio=a.refractionRatio!==void 0?a.refractionRatio:0.98;this.fog=a.fog!==void 0?a.fog:true;this.shading=
a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1;this.wireframeLinecap=a.wireframeLinecap!==void 0?a.wireframeLinecap:"round";this.wireframeLinejoin=a.wireframeLinejoin!==void 0?a.wireframeLinejoin:"round";this.vertexColors=a.vertexColors!==void 0?a.vertexColors:THREE.NoColors;this.skinning=a.skinning!==void 0?a.skinning:false;this.morphTargets=a.morphTargets!==void 0?
a.morphTargets:false;this.morphNormals=a.morphNormals!==void 0?a.morphNormals:false};THREE.MeshPhongMaterial.prototype=new THREE.Material;THREE.MeshPhongMaterial.prototype.constructor=THREE.MeshPhongMaterial;THREE.MeshDepthMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.shading=a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1};
THREE.MeshDepthMaterial.prototype=new THREE.Material;THREE.MeshDepthMaterial.prototype.constructor=THREE.MeshDepthMaterial;THREE.MeshNormalMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.shading=a.shading?a.shading:THREE.FlatShading;this.wireframe=a.wireframe?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth?a.wireframeLinewidth:1};THREE.MeshNormalMaterial.prototype=new THREE.Material;THREE.MeshNormalMaterial.prototype.constructor=THREE.MeshNormalMaterial;
THREE.MeshFaceMaterial=function(){};THREE.ParticleBasicMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.map=a.map!==void 0?a.map:null;this.size=a.size!==void 0?a.size:1;this.sizeAttenuation=a.sizeAttenuation!==void 0?a.sizeAttenuation:true;this.vertexColors=a.vertexColors!==void 0?a.vertexColors:false;this.fog=a.fog!==void 0?a.fog:true};THREE.ParticleBasicMaterial.prototype=new THREE.Material;
THREE.ParticleBasicMaterial.prototype.constructor=THREE.ParticleBasicMaterial;THREE.ParticleCanvasMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.program=a.program!==void 0?a.program:function(){}};THREE.ParticleCanvasMaterial.prototype=new THREE.Material;THREE.ParticleCanvasMaterial.prototype.constructor=THREE.ParticleCanvasMaterial;
THREE.ParticleDOMMaterial=function(a){THREE.Material.call(this);this.domElement=a};
THREE.ShaderMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.fragmentShader=a.fragmentShader!==void 0?a.fragmentShader:"void main() {}";this.vertexShader=a.vertexShader!==void 0?a.vertexShader:"void main() {}";this.uniforms=a.uniforms!==void 0?a.uniforms:{};this.attributes=a.attributes;this.shading=a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1;this.fog=
a.fog!==void 0?a.fog:false;this.lights=a.lights!==void 0?a.lights:false;this.vertexColors=a.vertexColors!==void 0?a.vertexColors:THREE.NoColors;this.skinning=a.skinning!==void 0?a.skinning:false;this.morphTargets=a.morphTargets!==void 0?a.morphTargets:false;this.morphNormals=a.morphNormals!==void 0?a.morphNormals:false};THREE.ShaderMaterial.prototype=new THREE.Material;THREE.ShaderMaterial.prototype.constructor=THREE.ShaderMaterial;
THREE.Texture=function(a,b,c,d,e,f,g,h){this.id=THREE.TextureCount++;this.image=a;this.mapping=b!==void 0?b:new THREE.UVMapping;this.wrapS=c!==void 0?c:THREE.ClampToEdgeWrapping;this.wrapT=d!==void 0?d:THREE.ClampToEdgeWrapping;this.magFilter=e!==void 0?e:THREE.LinearFilter;this.minFilter=f!==void 0?f:THREE.LinearMipMapLinearFilter;this.format=g!==void 0?g:THREE.RGBAFormat;this.type=h!==void 0?h:THREE.UnsignedByteType;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.generateMipmaps=
true;this.needsUpdate=this.premultiplyAlpha=false;this.onUpdate=null};THREE.Texture.prototype={constructor:THREE.Texture,clone:function(){var a=new THREE.Texture(this.image,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter,this.format,this.type);a.offset.copy(this.offset);a.repeat.copy(this.repeat);return a}};THREE.TextureCount=0;THREE.MultiplyOperation=0;THREE.MixOperation=1;THREE.UVMapping=function(){};THREE.CubeReflectionMapping=function(){};THREE.CubeRefractionMapping=function(){};
THREE.SphericalReflectionMapping=function(){};THREE.SphericalRefractionMapping=function(){};THREE.RepeatWrapping=0;THREE.ClampToEdgeWrapping=1;THREE.MirroredRepeatWrapping=2;THREE.NearestFilter=3;THREE.NearestMipMapNearestFilter=4;THREE.NearestMipMapLinearFilter=5;THREE.LinearFilter=6;THREE.LinearMipMapNearestFilter=7;THREE.LinearMipMapLinearFilter=8;THREE.ByteType=9;THREE.UnsignedByteType=10;THREE.ShortType=11;THREE.UnsignedShortType=12;THREE.IntType=13;THREE.UnsignedIntType=14;THREE.FloatType=15;
THREE.AlphaFormat=16;THREE.RGBFormat=17;THREE.RGBAFormat=18;THREE.LuminanceFormat=19;THREE.LuminanceAlphaFormat=20;THREE.DataTexture=function(a,b,c,d,e,f,g,h,j,l){THREE.Texture.call(this,null,f,g,h,j,l,d,e);this.image={data:a,width:b,height:c}};THREE.DataTexture.prototype=new THREE.Texture;THREE.DataTexture.prototype.constructor=THREE.DataTexture;
THREE.DataTexture.prototype.clone=function(){var a=new THREE.DataTexture(this.image.data,this.image.width,this.image.height,this.format,this.type,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter);a.offset.copy(this.offset);a.repeat.copy(this.repeat);return a};THREE.Particle=function(a){THREE.Object3D.call(this);this.material=a};THREE.Particle.prototype=new THREE.Object3D;THREE.Particle.prototype.constructor=THREE.Particle;
THREE.ParticleSystem=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.ParticleBasicMaterial({color:Math.random()*16777215});this.sortParticles=false;if(this.geometry){this.geometry.boundingSphere||this.geometry.computeBoundingSphere();this.boundRadius=a.boundingSphere.radius}this.frustumCulled=false};THREE.ParticleSystem.prototype=new THREE.Object3D;THREE.ParticleSystem.prototype.constructor=THREE.ParticleSystem;
THREE.Line=function(a,b,c){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.LineBasicMaterial({color:Math.random()*16777215});this.type=c!==void 0?c:THREE.LineStrip;this.geometry&&(this.geometry.boundingSphere||this.geometry.computeBoundingSphere())};THREE.LineStrip=0;THREE.LinePieces=1;THREE.Line.prototype=new THREE.Object3D;THREE.Line.prototype.constructor=THREE.Line;
THREE.Mesh=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.MeshBasicMaterial({color:Math.random()*16777215,wireframe:true});if(this.geometry){this.geometry.boundingSphere||this.geometry.computeBoundingSphere();this.boundRadius=a.boundingSphere.radius;if(this.geometry.morphTargets.length){this.morphTargetBase=-1;this.morphTargetForcedOrder=[];this.morphTargetInfluences=[];this.morphTargetDictionary={};for(var c=0;c<this.geometry.morphTargets.length;c++){this.morphTargetInfluences.push(0);
this.morphTargetDictionary[this.geometry.morphTargets[c].name]=c}}}};THREE.Mesh.prototype=new THREE.Object3D;THREE.Mesh.prototype.constructor=THREE.Mesh;THREE.Mesh.prototype.supr=THREE.Object3D.prototype;THREE.Mesh.prototype.getMorphTargetIndexByName=function(a){if(this.morphTargetDictionary[a]!==void 0)return this.morphTargetDictionary[a];console.log("THREE.Mesh.getMorphTargetIndexByName: morph target "+a+" does not exist. Returning 0.");return 0};
THREE.Bone=function(a){THREE.Object3D.call(this);this.skin=a;this.skinMatrix=new THREE.Matrix4};THREE.Bone.prototype=new THREE.Object3D;THREE.Bone.prototype.constructor=THREE.Bone;THREE.Bone.prototype.supr=THREE.Object3D.prototype;
THREE.Bone.prototype.update=function(a,b){this.matrixAutoUpdate&&(b=b|this.updateMatrix());if(b||this.matrixWorldNeedsUpdate){a?this.skinMatrix.multiply(a,this.matrix):this.skinMatrix.copy(this.matrix);this.matrixWorldNeedsUpdate=false;b=true}var c,d=this.children.length;for(c=0;c<d;c++)this.children[c].update(this.skinMatrix,b)};
THREE.SkinnedMesh=function(a,b){THREE.Mesh.call(this,a,b);this.identityMatrix=new THREE.Matrix4;this.bones=[];this.boneMatrices=[];var c,d,e,f,g,h;if(this.geometry.bones!==void 0){for(c=0;c<this.geometry.bones.length;c++){e=this.geometry.bones[c];f=e.pos;g=e.rotq;h=e.scl;d=this.addBone();d.name=e.name;d.position.set(f[0],f[1],f[2]);d.quaternion.set(g[0],g[1],g[2],g[3]);d.useQuaternion=true;h!==void 0?d.scale.set(h[0],h[1],h[2]):d.scale.set(1,1,1)}for(c=0;c<this.bones.length;c++){e=this.geometry.bones[c];
d=this.bones[c];e.parent===-1?this.add(d):this.bones[e.parent].add(d)}this.boneMatrices=new Float32Array(16*this.bones.length);this.pose()}};THREE.SkinnedMesh.prototype=new THREE.Mesh;THREE.SkinnedMesh.prototype.constructor=THREE.SkinnedMesh;THREE.SkinnedMesh.prototype.addBone=function(a){a===void 0&&(a=new THREE.Bone(this));this.bones.push(a);return a};
THREE.SkinnedMesh.prototype.updateMatrixWorld=function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a){this.parent?this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixWorldNeedsUpdate=false}for(var a=0,b=this.children.length;a<b;a++){var c=this.children[a];c instanceof THREE.Bone?c.update(this.identityMatrix,false):c.updateMatrixWorld(true)}for(var b=this.bones.length,c=this.bones,d=this.boneMatrices,a=0;a<b;a++)c[a].skinMatrix.flattenToArrayOffset(d,
a*16)};
THREE.SkinnedMesh.prototype.pose=function(){this.updateMatrixWorld(true);for(var a,b=[],c=0;c<this.bones.length;c++){a=this.bones[c];var d=new THREE.Matrix4;d.getInverse(a.skinMatrix);b.push(d);a.skinMatrix.flattenToArrayOffset(this.boneMatrices,c*16)}if(this.geometry.skinVerticesA===void 0){this.geometry.skinVerticesA=[];this.geometry.skinVerticesB=[];for(a=0;a<this.geometry.skinIndices.length;a++){var c=this.geometry.vertices[a],e=this.geometry.skinIndices[a].x,f=this.geometry.skinIndices[a].y,d=
new THREE.Vector3(c.x,c.y,c.z);this.geometry.skinVerticesA.push(b[e].multiplyVector3(d));d=new THREE.Vector3(c.x,c.y,c.z);this.geometry.skinVerticesB.push(b[f].multiplyVector3(d));if(this.geometry.skinWeights[a].x+this.geometry.skinWeights[a].y!==1){c=(1-(this.geometry.skinWeights[a].x+this.geometry.skinWeights[a].y))*0.5;this.geometry.skinWeights[a].x=this.geometry.skinWeights[a].x+c;this.geometry.skinWeights[a].y=this.geometry.skinWeights[a].y+c}}}};
THREE.MorphAnimMesh=function(a,b){THREE.Mesh.call(this,a,b);this.duration=1E3;this.mirroredLoop=false;this.currentKeyframe=this.lastKeyframe=this.time=0;this.direction=1;this.directionBackwards=false;this.setFrameRange(0,this.geometry.morphTargets.length-1)};THREE.MorphAnimMesh.prototype=new THREE.Mesh;THREE.MorphAnimMesh.prototype.constructor=THREE.MorphAnimMesh;
THREE.MorphAnimMesh.prototype.setFrameRange=function(a,b){this.startKeyframe=a;this.endKeyframe=b;this.length=this.endKeyframe-this.startKeyframe+1};THREE.MorphAnimMesh.prototype.setDirectionForward=function(){this.direction=1;this.directionBackwards=false};THREE.MorphAnimMesh.prototype.setDirectionBackward=function(){this.direction=-1;this.directionBackwards=true};
THREE.MorphAnimMesh.prototype.parseAnimations=function(){var a=this.geometry;if(!a.animations)a.animations={};for(var b,c=a.animations,d=/([a-z]+)(\d+)/,e=0,f=a.morphTargets.length;e<f;e++){var g=a.morphTargets[e].name.match(d);if(g&&g.length>1){g=g[1];c[g]||(c[g]={start:Infinity,end:-Infinity});var h=c[g];if(e<h.start)h.start=e;if(e>h.end)h.end=e;b||(b=g)}}a.firstAnimation=b};
THREE.MorphAnimMesh.prototype.setAnimationLabel=function(a,b,c){if(!this.geometry.animations)this.geometry.animations={};this.geometry.animations[a]={start:b,end:c}};THREE.MorphAnimMesh.prototype.playAnimation=function(a,b){var c=this.geometry.animations[a];if(c){this.setFrameRange(c.start,c.end);this.duration=1E3*((c.end-c.start)/b);this.time=0}else console.warn("animation["+a+"] undefined")};
THREE.MorphAnimMesh.prototype.updateAnimation=function(a){var b=this.duration/this.length;this.time=this.time+this.direction*a;if(this.mirroredLoop){if(this.time>this.duration||this.time<0){this.direction=this.direction*-1;if(this.time>this.duration){this.time=this.duration;this.directionBackwards=true}if(this.time<0){this.time=0;this.directionBackwards=false}}}else{this.time=this.time%this.duration;if(this.time<0)this.time=this.time+this.duration}a=this.startKeyframe+THREE.Math.clamp(Math.floor(this.time/
b),0,this.length-1);if(a!==this.currentKeyframe){this.morphTargetInfluences[this.lastKeyframe]=0;this.morphTargetInfluences[this.currentKeyframe]=1;this.morphTargetInfluences[a]=0;this.lastKeyframe=this.currentKeyframe;this.currentKeyframe=a}b=this.time%b/b;this.directionBackwards&&(b=1-b);this.morphTargetInfluences[this.currentKeyframe]=b;this.morphTargetInfluences[this.lastKeyframe]=1-b};THREE.Ribbon=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b};
THREE.Ribbon.prototype=new THREE.Object3D;THREE.Ribbon.prototype.constructor=THREE.Ribbon;THREE.LOD=function(){THREE.Object3D.call(this);this.LODs=[]};THREE.LOD.prototype=new THREE.Object3D;THREE.LOD.prototype.constructor=THREE.LOD;THREE.LOD.prototype.supr=THREE.Object3D.prototype;THREE.LOD.prototype.addLevel=function(a,b){b===void 0&&(b=0);for(var b=Math.abs(b),c=0;c<this.LODs.length;c++)if(b<this.LODs[c].visibleAtDistance)break;this.LODs.splice(c,0,{visibleAtDistance:b,object3D:a});this.add(a)};
THREE.LOD.prototype.update=function(a){if(this.LODs.length>1){a.matrixWorldInverse.getInverse(a.matrixWorld);a=a.matrixWorldInverse;a=-(a.elements[2]*this.matrixWorld.elements[12]+a.elements[6]*this.matrixWorld.elements[13]+a.elements[10]*this.matrixWorld.elements[14]+a.elements[14]);this.LODs[0].object3D.visible=true;for(var b=1;b<this.LODs.length;b++)if(a>=this.LODs[b].visibleAtDistance){this.LODs[b-1].object3D.visible=false;this.LODs[b].object3D.visible=true}else break;for(;b<this.LODs.length;b++)this.LODs[b].object3D.visible=
false}};
THREE.Sprite=function(a){THREE.Object3D.call(this);this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.map=a.map!==void 0?a.map:new THREE.Texture;this.blending=a.blending!==void 0?a.blending:THREE.NormalBlending;this.blendSrc=a.blendSrc!==void 0?a.blendSrc:THREE.SrcAlphaFactor;this.blendDst=a.blendDst!==void 0?a.blendDst:THREE.OneMinusSrcAlphaFactor;this.blendEquation=a.blendEquation!==void 0?a.blendEquation:THREE.AddEquation;this.useScreenCoordinates=a.useScreenCoordinates!==void 0?
a.useScreenCoordinates:true;this.mergeWith3D=a.mergeWith3D!==void 0?a.mergeWith3D:!this.useScreenCoordinates;this.affectedByDistance=a.affectedByDistance!==void 0?a.affectedByDistance:!this.useScreenCoordinates;this.scaleByViewport=a.scaleByViewport!==void 0?a.scaleByViewport:!this.affectedByDistance;this.alignment=a.alignment instanceof THREE.Vector2?a.alignment:THREE.SpriteAlignment.center;this.rotation3d=this.rotation;this.rotation=0;this.opacity=1;this.uvOffset=new THREE.Vector2(0,0);this.uvScale=
new THREE.Vector2(1,1)};THREE.Sprite.prototype=new THREE.Object3D;THREE.Sprite.prototype.constructor=THREE.Sprite;THREE.Sprite.prototype.updateMatrix=function(){this.matrix.setPosition(this.position);this.rotation3d.set(0,0,this.rotation);this.matrix.setRotationFromEuler(this.rotation3d);if(this.scale.x!==1||this.scale.y!==1){this.matrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,this.scale.y)}this.matrixWorldNeedsUpdate=true};THREE.SpriteAlignment={};
THREE.SpriteAlignment.topLeft=new THREE.Vector2(1,-1);THREE.SpriteAlignment.topCenter=new THREE.Vector2(0,-1);THREE.SpriteAlignment.topRight=new THREE.Vector2(-1,-1);THREE.SpriteAlignment.centerLeft=new THREE.Vector2(1,0);THREE.SpriteAlignment.center=new THREE.Vector2(0,0);THREE.SpriteAlignment.centerRight=new THREE.Vector2(-1,0);THREE.SpriteAlignment.bottomLeft=new THREE.Vector2(1,1);THREE.SpriteAlignment.bottomCenter=new THREE.Vector2(0,1);
THREE.SpriteAlignment.bottomRight=new THREE.Vector2(-1,1);THREE.Scene=function(){THREE.Object3D.call(this);this.overrideMaterial=this.fog=null;this.matrixAutoUpdate=false;this.__objects=[];this.__lights=[];this.__objectsAdded=[];this.__objectsRemoved=[]};THREE.Scene.prototype=new THREE.Object3D;THREE.Scene.prototype.constructor=THREE.Scene;
THREE.Scene.prototype.__addObject=function(a){if(a instanceof THREE.Light)this.__lights.indexOf(a)===-1&&this.__lights.push(a);else if(!(a instanceof THREE.Camera||a instanceof THREE.Bone)&&this.__objects.indexOf(a)===-1){this.__objects.push(a);this.__objectsAdded.push(a);var b=this.__objectsRemoved.indexOf(a);b!==-1&&this.__objectsRemoved.splice(b,1)}for(b=0;b<a.children.length;b++)this.__addObject(a.children[b])};
THREE.Scene.prototype.__removeObject=function(a){if(a instanceof THREE.Light){var b=this.__lights.indexOf(a);b!==-1&&this.__lights.splice(b,1)}else if(!(a instanceof THREE.Camera)){b=this.__objects.indexOf(a);if(b!==-1){this.__objects.splice(b,1);this.__objectsRemoved.push(a);b=this.__objectsAdded.indexOf(a);b!==-1&&this.__objectsAdded.splice(b,1)}}for(b=0;b<a.children.length;b++)this.__removeObject(a.children[b])};
THREE.Fog=function(a,b,c){this.color=new THREE.Color(a);this.near=b!==void 0?b:1;this.far=c!==void 0?c:1E3};THREE.FogExp2=function(a,b){this.color=new THREE.Color(a);this.density=b!==void 0?b:2.5E-4};
THREE.DOMRenderer=function(){console.log("THREE.DOMRenderer",THREE.REVISION);var a,b,c,d,e,f,g,h=new THREE.Projector;g=function(a){for(var b=document.documentElement,c=0;c<a.length;c++)if(typeof b.style[a[c]]==="string")return a[c];return null}(["transform","MozTransform","WebkitTransform","msTransform","OTransform"]);this.domElement=document.createElement("div");this.setSize=function(a,b){c=a;d=b;e=c/2;f=d/2};this.render=function(c,d){var k,p,m,o,q,n;a=h.projectScene(c,d);b=a.elements;k=0;for(p=
b.length;k<p;k++){m=b[k];if(m instanceof THREE.RenderableParticle&&m.material instanceof THREE.ParticleDOMMaterial){o=m.material.domElement;q=m.x*e+e-(o.offsetWidth>>1);n=m.y*f+f-(o.offsetHeight>>1);o.style.left=q+"px";o.style.top=n+"px";o.style.zIndex=Math.abs(Math.floor((1-m.z)*d.far/d.near));g&&(o.style[g]="scale("+m.scale.x*e+","+m.scale.y*f+")")}}}};
THREE.CanvasRenderer=function(a){function b(a){if(t!=a)n.globalAlpha=t=a}function c(a){if(y!=a){switch(a){case THREE.NormalBlending:n.globalCompositeOperation="source-over";break;case THREE.AdditiveBlending:n.globalCompositeOperation="lighter"}y=a}}function d(a){if(s!=a)n.strokeStyle=s=a}function e(a){if(w!=a)n.fillStyle=w=a}console.log("THREE.CanvasRenderer",THREE.REVISION);var a=a||{},f=this,g,h,j,l=new THREE.Projector,k=a.canvas!==void 0?a.canvas:document.createElement("canvas"),p,m,o,q,n=k.getContext("2d"),
r=new THREE.Color(0),u=0,t=1,y=0,s=null,w=null,H=null,E=null,z=null,v,A,J,K,R=new THREE.RenderableVertex,P=new THREE.RenderableVertex,D,M,G,i,T,U,C,Y,F,ea,fa,ia,O=new THREE.Color,Q=new THREE.Color,Z=new THREE.Color,$=new THREE.Color,ha=new THREE.Color,Ma=[],Ka=[],Ra,La,Sa,Na,Kb,lb,gb,Lb,hb,Cb,Wa=new THREE.Rectangle,Ba=new THREE.Rectangle,xa=new THREE.Rectangle,$a=false,aa=new THREE.Color,Ta=new THREE.Color,Qa=new THREE.Color,oa=new THREE.Vector3,ib,Db,Sc,ab,pc,Bc,a=16;ib=document.createElement("canvas");
ib.width=ib.height=2;Db=ib.getContext("2d");Db.fillStyle="rgba(0,0,0,1)";Db.fillRect(0,0,2,2);Sc=Db.getImageData(0,0,2,2);ab=Sc.data;pc=document.createElement("canvas");pc.width=pc.height=a;Bc=pc.getContext("2d");Bc.translate(-a/2,-a/2);Bc.scale(a,a);a--;this.domElement=k;this.sortElements=this.sortObjects=this.autoClear=true;this.info={render:{vertices:0,faces:0}};this.setSize=function(a,b){p=a;m=b;o=Math.floor(p/2);q=Math.floor(m/2);k.width=p;k.height=m;Wa.set(-o,-q,o,q);Ba.set(-o,-q,o,q);t=1;y=
0;z=E=H=w=s=null};this.setClearColor=function(a,b){r.copy(a);u=b!==void 0?b:1;Ba.set(-o,-q,o,q)};this.setClearColorHex=function(a,b){r.setHex(a);u=b!==void 0?b:1;Ba.set(-o,-q,o,q)};this.clear=function(){n.setTransform(1,0,0,-1,o,q);if(!Ba.isEmpty()){Ba.minSelf(Wa);Ba.inflate(2);u<1&&n.clearRect(Math.floor(Ba.getX()),Math.floor(Ba.getY()),Math.floor(Ba.getWidth()),Math.floor(Ba.getHeight()));if(u>0){c(THREE.NormalBlending);b(1);e("rgba("+Math.floor(r.r*255)+","+Math.floor(r.g*255)+","+Math.floor(r.b*
255)+","+u+")");n.fillRect(Math.floor(Ba.getX()),Math.floor(Ba.getY()),Math.floor(Ba.getWidth()),Math.floor(Ba.getHeight()))}Ba.empty()}};this.render=function(a,k){function m(a){var b,c,d,e;aa.setRGB(0,0,0);Ta.setRGB(0,0,0);Qa.setRGB(0,0,0);b=0;for(c=a.length;b<c;b++){d=a[b];e=d.color;if(d instanceof THREE.AmbientLight){aa.r=aa.r+e.r;aa.g=aa.g+e.g;aa.b=aa.b+e.b}else if(d instanceof THREE.DirectionalLight){Ta.r=Ta.r+e.r;Ta.g=Ta.g+e.g;Ta.b=Ta.b+e.b}else if(d instanceof THREE.PointLight){Qa.r=Qa.r+e.r;
Qa.g=Qa.g+e.g;Qa.b=Qa.b+e.b}}}function p(a,b,c,d){var e,f,g,i,h,j;e=0;for(f=a.length;e<f;e++){g=a[e];i=g.color;if(g instanceof THREE.DirectionalLight){h=g.matrixWorld.getPosition();j=c.dot(h);if(!(j<=0)){j=j*g.intensity;d.r=d.r+i.r*j;d.g=d.g+i.g*j;d.b=d.b+i.b*j}}else if(g instanceof THREE.PointLight){h=g.matrixWorld.getPosition();j=c.dot(oa.sub(h,b).normalize());if(!(j<=0)){j=j*(g.distance==0?1:1-Math.min(b.distanceTo(h)/g.distance,1));if(j!=0){j=j*g.intensity;d.r=d.r+i.r*j;d.g=d.g+i.g*j;d.b=d.b+
i.b*j}}}}}function r(a,f,g){b(g.opacity);c(g.blending);var i,h,j,k,l,m;if(g instanceof THREE.ParticleBasicMaterial){if(g.map){k=g.map.image;l=k.width>>1;m=k.height>>1;g=f.scale.x*o;j=f.scale.y*q;i=g*l;h=j*m;xa.set(a.x-i,a.y-h,a.x+i,a.y+h);if(Wa.intersects(xa)){n.save();n.translate(a.x,a.y);n.rotate(-f.rotation);n.scale(g,-j);n.translate(-l,-m);n.drawImage(k,0,0);n.restore()}}}else if(g instanceof THREE.ParticleCanvasMaterial){i=f.scale.x*o;h=f.scale.y*q;xa.set(a.x-i,a.y-h,a.x+i,a.y+h);if(Wa.intersects(xa)){d(g.color.getContextStyle());
e(g.color.getContextStyle());n.save();n.translate(a.x,a.y);n.rotate(-f.rotation);n.scale(i,h);g.program(n);n.restore()}}}function s(a,e,f,g){b(g.opacity);c(g.blending);n.beginPath();n.moveTo(a.positionScreen.x,a.positionScreen.y);n.lineTo(e.positionScreen.x,e.positionScreen.y);n.closePath();if(g instanceof THREE.LineBasicMaterial){a=g.linewidth;if(H!=a)n.lineWidth=H=a;a=g.linecap;if(E!=a)n.lineCap=E=a;a=g.linejoin;if(z!=a)n.lineJoin=z=a;d(g.color.getContextStyle());n.stroke();xa.inflate(g.linewidth*
2)}}function t(a,d,e,g,h,l,m,n){f.info.render.vertices=f.info.render.vertices+3;f.info.render.faces++;b(n.opacity);c(n.blending);D=a.positionScreen.x;M=a.positionScreen.y;G=d.positionScreen.x;i=d.positionScreen.y;T=e.positionScreen.x;U=e.positionScreen.y;w(D,M,G,i,T,U);if(n instanceof THREE.MeshBasicMaterial)if(n.map){if(n.map.mapping instanceof THREE.UVMapping){Na=m.uvs[0];ad(D,M,G,i,T,U,Na[g].u,Na[g].v,Na[h].u,Na[h].v,Na[l].u,Na[l].v,n.map)}}else if(n.envMap){if(n.envMap.mapping instanceof THREE.SphericalReflectionMapping){a=
k.matrixWorldInverse;oa.copy(m.vertexNormalsWorld[g]);Kb=(oa.x*a.elements[0]+oa.y*a.elements[4]+oa.z*a.elements[8])*0.5+0.5;lb=-(oa.x*a.elements[1]+oa.y*a.elements[5]+oa.z*a.elements[9])*0.5+0.5;oa.copy(m.vertexNormalsWorld[h]);gb=(oa.x*a.elements[0]+oa.y*a.elements[4]+oa.z*a.elements[8])*0.5+0.5;Lb=-(oa.x*a.elements[1]+oa.y*a.elements[5]+oa.z*a.elements[9])*0.5+0.5;oa.copy(m.vertexNormalsWorld[l]);hb=(oa.x*a.elements[0]+oa.y*a.elements[4]+oa.z*a.elements[8])*0.5+0.5;Cb=-(oa.x*a.elements[1]+oa.y*
a.elements[5]+oa.z*a.elements[9])*0.5+0.5;ad(D,M,G,i,T,U,Kb,lb,gb,Lb,hb,Cb,n.envMap)}}else n.wireframe?Mb(n.color,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):Eb(n.color);else if(n instanceof THREE.MeshLambertMaterial)if($a)if(!n.wireframe&&n.shading==THREE.SmoothShading&&m.vertexNormalsWorld.length==3){Q.r=Z.r=$.r=aa.r;Q.g=Z.g=$.g=aa.g;Q.b=Z.b=$.b=aa.b;p(j,m.v1.positionWorld,m.vertexNormalsWorld[0],Q);p(j,m.v2.positionWorld,m.vertexNormalsWorld[1],Z);p(j,m.v3.positionWorld,m.vertexNormalsWorld[2],
$);Q.r=Math.max(0,Math.min(n.color.r*Q.r,1));Q.g=Math.max(0,Math.min(n.color.g*Q.g,1));Q.b=Math.max(0,Math.min(n.color.b*Q.b,1));Z.r=Math.max(0,Math.min(n.color.r*Z.r,1));Z.g=Math.max(0,Math.min(n.color.g*Z.g,1));Z.b=Math.max(0,Math.min(n.color.b*Z.b,1));$.r=Math.max(0,Math.min(n.color.r*$.r,1));$.g=Math.max(0,Math.min(n.color.g*$.g,1));$.b=Math.max(0,Math.min(n.color.b*$.b,1));ha.r=(Z.r+$.r)*0.5;ha.g=(Z.g+$.g)*0.5;ha.b=(Z.b+$.b)*0.5;Sa=Cc(Q,Z,$,ha);gc(D,M,G,i,T,U,0,0,1,0,0,1,Sa)}else{O.r=aa.r;O.g=
aa.g;O.b=aa.b;p(j,m.centroidWorld,m.normalWorld,O);O.r=Math.max(0,Math.min(n.color.r*O.r,1));O.g=Math.max(0,Math.min(n.color.g*O.g,1));O.b=Math.max(0,Math.min(n.color.b*O.b,1));n.wireframe?Mb(O,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):Eb(O)}else n.wireframe?Mb(n.color,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):Eb(n.color);else if(n instanceof THREE.MeshDepthMaterial){Ra=k.near;La=k.far;Q.r=Q.g=Q.b=1-ac(a.positionScreen.z,Ra,La);Z.r=Z.g=Z.b=1-ac(d.positionScreen.z,
Ra,La);$.r=$.g=$.b=1-ac(e.positionScreen.z,Ra,La);ha.r=(Z.r+$.r)*0.5;ha.g=(Z.g+$.g)*0.5;ha.b=(Z.b+$.b)*0.5;Sa=Cc(Q,Z,$,ha);gc(D,M,G,i,T,U,0,0,1,0,0,1,Sa)}else if(n instanceof THREE.MeshNormalMaterial){O.r=hc(m.normalWorld.x);O.g=hc(m.normalWorld.y);O.b=hc(m.normalWorld.z);n.wireframe?Mb(O,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):Eb(O)}}function u(a,d,e,g,h,l,n,m,o){f.info.render.vertices=f.info.render.vertices+4;f.info.render.faces++;b(m.opacity);c(m.blending);if(m.map||m.envMap){t(a,
d,g,0,1,3,n,m,o);t(h,e,l,1,2,3,n,m,o)}else{D=a.positionScreen.x;M=a.positionScreen.y;G=d.positionScreen.x;i=d.positionScreen.y;T=e.positionScreen.x;U=e.positionScreen.y;C=g.positionScreen.x;Y=g.positionScreen.y;F=h.positionScreen.x;ea=h.positionScreen.y;fa=l.positionScreen.x;ia=l.positionScreen.y;if(m instanceof THREE.MeshBasicMaterial){y(D,M,G,i,T,U,C,Y);m.wireframe?Mb(m.color,m.wireframeLinewidth,m.wireframeLinecap,m.wireframeLinejoin):Eb(m.color)}else if(m instanceof THREE.MeshLambertMaterial)if($a)if(!m.wireframe&&
m.shading==THREE.SmoothShading&&n.vertexNormalsWorld.length==4){Q.r=Z.r=$.r=ha.r=aa.r;Q.g=Z.g=$.g=ha.g=aa.g;Q.b=Z.b=$.b=ha.b=aa.b;p(j,n.v1.positionWorld,n.vertexNormalsWorld[0],Q);p(j,n.v2.positionWorld,n.vertexNormalsWorld[1],Z);p(j,n.v4.positionWorld,n.vertexNormalsWorld[3],$);p(j,n.v3.positionWorld,n.vertexNormalsWorld[2],ha);Q.r=Math.max(0,Math.min(m.color.r*Q.r,1));Q.g=Math.max(0,Math.min(m.color.g*Q.g,1));Q.b=Math.max(0,Math.min(m.color.b*Q.b,1));Z.r=Math.max(0,Math.min(m.color.r*Z.r,1));Z.g=
Math.max(0,Math.min(m.color.g*Z.g,1));Z.b=Math.max(0,Math.min(m.color.b*Z.b,1));$.r=Math.max(0,Math.min(m.color.r*$.r,1));$.g=Math.max(0,Math.min(m.color.g*$.g,1));$.b=Math.max(0,Math.min(m.color.b*$.b,1));ha.r=Math.max(0,Math.min(m.color.r*ha.r,1));ha.g=Math.max(0,Math.min(m.color.g*ha.g,1));ha.b=Math.max(0,Math.min(m.color.b*ha.b,1));Sa=Cc(Q,Z,$,ha);w(D,M,G,i,C,Y);gc(D,M,G,i,C,Y,0,0,1,0,0,1,Sa);w(F,ea,T,U,fa,ia);gc(F,ea,T,U,fa,ia,1,0,1,1,0,1,Sa)}else{O.r=aa.r;O.g=aa.g;O.b=aa.b;p(j,n.centroidWorld,
n.normalWorld,O);O.r=Math.max(0,Math.min(m.color.r*O.r,1));O.g=Math.max(0,Math.min(m.color.g*O.g,1));O.b=Math.max(0,Math.min(m.color.b*O.b,1));y(D,M,G,i,T,U,C,Y);m.wireframe?Mb(O,m.wireframeLinewidth,m.wireframeLinecap,m.wireframeLinejoin):Eb(O)}else{y(D,M,G,i,T,U,C,Y);m.wireframe?Mb(m.color,m.wireframeLinewidth,m.wireframeLinecap,m.wireframeLinejoin):Eb(m.color)}else if(m instanceof THREE.MeshNormalMaterial){O.r=hc(n.normalWorld.x);O.g=hc(n.normalWorld.y);O.b=hc(n.normalWorld.z);y(D,M,G,i,T,U,C,
Y);m.wireframe?Mb(O,m.wireframeLinewidth,m.wireframeLinecap,m.wireframeLinejoin):Eb(O)}else if(m instanceof THREE.MeshDepthMaterial){Ra=k.near;La=k.far;Q.r=Q.g=Q.b=1-ac(a.positionScreen.z,Ra,La);Z.r=Z.g=Z.b=1-ac(d.positionScreen.z,Ra,La);$.r=$.g=$.b=1-ac(g.positionScreen.z,Ra,La);ha.r=ha.g=ha.b=1-ac(e.positionScreen.z,Ra,La);Sa=Cc(Q,Z,$,ha);w(D,M,G,i,C,Y);gc(D,M,G,i,C,Y,0,0,1,0,0,1,Sa);w(F,ea,T,U,fa,ia);gc(F,ea,T,U,fa,ia,1,0,1,1,0,1,Sa)}}}function w(a,b,c,d,e,f){n.beginPath();n.moveTo(a,b);n.lineTo(c,
d);n.lineTo(e,f);n.lineTo(a,b);n.closePath()}function y(a,b,c,d,e,f,g,i){n.beginPath();n.moveTo(a,b);n.lineTo(c,d);n.lineTo(e,f);n.lineTo(g,i);n.lineTo(a,b);n.closePath()}function Mb(a,b,c,e){if(H!=b)n.lineWidth=H=b;if(E!=c)n.lineCap=E=c;if(z!=e)n.lineJoin=z=e;d(a.getContextStyle());n.stroke();xa.inflate(b*2)}function Eb(a){e(a.getContextStyle());n.fill()}function ad(a,b,c,d,f,g,i,h,j,k,l,m,p){if(p.image.width!=0){if(p.needsUpdate==true||Ma[p.id]==void 0){var o=p.wrapS==THREE.RepeatWrapping,q=p.wrapT==
THREE.RepeatWrapping;Ma[p.id]=n.createPattern(p.image,o&&q?"repeat":o&&!q?"repeat-x":!o&&q?"repeat-y":"no-repeat");p.needsUpdate=false}e(Ma[p.id]);var o=p.offset.x/p.repeat.x,q=p.offset.y/p.repeat.y,Db=p.image.width*p.repeat.x,r=p.image.height*p.repeat.y,i=(i+o)*Db,h=(h+q)*r,c=c-a,d=d-b,f=f-a,g=g-b,j=(j+o)*Db-i,k=(k+q)*r-h,l=(l+o)*Db-i,m=(m+q)*r-h,o=j*m-l*k;if(o==0){if(Ka[p.id]===void 0){b=document.createElement("canvas");b.width=p.image.width;b.height=p.image.height;b=b.getContext("2d");b.drawImage(p.image,
0,0);Ka[p.id]=b.getImageData(0,0,p.image.width,p.image.height).data}b=Ka[p.id];i=(Math.floor(i)+Math.floor(h)*p.image.width)*4;O.setRGB(b[i]/255,b[i+1]/255,b[i+2]/255);Eb(O)}else{o=1/o;p=(m*c-k*f)*o;k=(m*d-k*g)*o;c=(j*f-l*c)*o;d=(j*g-l*d)*o;a=a-p*i-c*h;i=b-k*i-d*h;n.save();n.transform(p,k,c,d,a,i);n.fill();n.restore()}}}function gc(a,b,c,d,e,f,g,i,h,j,k,l,m){var p,o;p=m.width-1;o=m.height-1;g=g*p;i=i*o;c=c-a;d=d-b;e=e-a;f=f-b;h=h*p-g;j=j*o-i;k=k*p-g;l=l*o-i;o=1/(h*l-k*j);p=(l*c-j*e)*o;j=(l*d-j*f)*
o;c=(h*e-k*c)*o;d=(h*f-k*d)*o;a=a-p*g-c*i;b=b-j*g-d*i;n.save();n.transform(p,j,c,d,a,b);n.clip();n.drawImage(m,0,0);n.restore()}function Cc(a,b,c,d){var e=~~(a.r*255),f=~~(a.g*255),a=~~(a.b*255),g=~~(b.r*255),i=~~(b.g*255),b=~~(b.b*255),h=~~(c.r*255),j=~~(c.g*255),c=~~(c.b*255),k=~~(d.r*255),l=~~(d.g*255),d=~~(d.b*255);ab[0]=e<0?0:e>255?255:e;ab[1]=f<0?0:f>255?255:f;ab[2]=a<0?0:a>255?255:a;ab[4]=g<0?0:g>255?255:g;ab[5]=i<0?0:i>255?255:i;ab[6]=b<0?0:b>255?255:b;ab[8]=h<0?0:h>255?255:h;ab[9]=j<0?0:
j>255?255:j;ab[10]=c<0?0:c>255?255:c;ab[12]=k<0?0:k>255?255:k;ab[13]=l<0?0:l>255?255:l;ab[14]=d<0?0:d>255?255:d;Db.putImageData(Sc,0,0);Bc.drawImage(ib,0,0);return pc}function ac(a,b,c){a=(a-b)/(c-b);return a*a*(3-2*a)}function hc(a){a=(a+1)*0.5;return a<0?0:a>1?1:a}function Nb(a,b){var c=b.x-a.x,d=b.y-a.y,e=c*c+d*d;if(e!=0){e=1/Math.sqrt(e);c=c*e;d=d*e;b.x=b.x+c;b.y=b.y+d;a.x=a.x-c;a.y=a.y-d}}var Dc,bd,Ha,eb;this.autoClear?this.clear():n.setTransform(1,0,0,-1,o,q);f.info.render.vertices=0;f.info.render.faces=
0;g=l.projectScene(a,k,this.sortElements);h=g.elements;j=g.lights;($a=j.length>0)&&m(j);Dc=0;for(bd=h.length;Dc<bd;Dc++){Ha=h[Dc];eb=Ha.material;eb=eb instanceof THREE.MeshFaceMaterial?Ha.faceMaterial:eb;if(!(eb===void 0||eb.visible===false)){xa.empty();if(Ha instanceof THREE.RenderableParticle){v=Ha;v.x=v.x*o;v.y=v.y*q;r(v,Ha,eb,a)}else if(Ha instanceof THREE.RenderableLine){v=Ha.v1;A=Ha.v2;v.positionScreen.x=v.positionScreen.x*o;v.positionScreen.y=v.positionScreen.y*q;A.positionScreen.x=A.positionScreen.x*
o;A.positionScreen.y=A.positionScreen.y*q;xa.addPoint(v.positionScreen.x,v.positionScreen.y);xa.addPoint(A.positionScreen.x,A.positionScreen.y);Wa.intersects(xa)&&s(v,A,Ha,eb,a)}else if(Ha instanceof THREE.RenderableFace3){v=Ha.v1;A=Ha.v2;J=Ha.v3;v.positionScreen.x=v.positionScreen.x*o;v.positionScreen.y=v.positionScreen.y*q;A.positionScreen.x=A.positionScreen.x*o;A.positionScreen.y=A.positionScreen.y*q;J.positionScreen.x=J.positionScreen.x*o;J.positionScreen.y=J.positionScreen.y*q;if(eb.overdraw){Nb(v.positionScreen,
A.positionScreen);Nb(A.positionScreen,J.positionScreen);Nb(J.positionScreen,v.positionScreen)}xa.add3Points(v.positionScreen.x,v.positionScreen.y,A.positionScreen.x,A.positionScreen.y,J.positionScreen.x,J.positionScreen.y);Wa.intersects(xa)&&t(v,A,J,0,1,2,Ha,eb,a)}else if(Ha instanceof THREE.RenderableFace4){v=Ha.v1;A=Ha.v2;J=Ha.v3;K=Ha.v4;v.positionScreen.x=v.positionScreen.x*o;v.positionScreen.y=v.positionScreen.y*q;A.positionScreen.x=A.positionScreen.x*o;A.positionScreen.y=A.positionScreen.y*q;
J.positionScreen.x=J.positionScreen.x*o;J.positionScreen.y=J.positionScreen.y*q;K.positionScreen.x=K.positionScreen.x*o;K.positionScreen.y=K.positionScreen.y*q;R.positionScreen.copy(A.positionScreen);P.positionScreen.copy(K.positionScreen);if(eb.overdraw){Nb(v.positionScreen,A.positionScreen);Nb(A.positionScreen,K.positionScreen);Nb(K.positionScreen,v.positionScreen);Nb(J.positionScreen,R.positionScreen);Nb(J.positionScreen,P.positionScreen)}xa.addPoint(v.positionScreen.x,v.positionScreen.y);xa.addPoint(A.positionScreen.x,
A.positionScreen.y);xa.addPoint(J.positionScreen.x,J.positionScreen.y);xa.addPoint(K.positionScreen.x,K.positionScreen.y);Wa.intersects(xa)&&u(v,A,J,K,R,P,Ha,eb,a)}Ba.addRectangle(xa)}}n.setTransform(1,0,0,1,0,0)}};
THREE.SVGRenderer=function(){function a(a,b,c,d){var e,f,g,h,j,k;e=0;for(f=a.length;e<f;e++){g=a[e];h=g.color;if(g instanceof THREE.DirectionalLight){j=g.matrixWorld.getPosition();k=c.dot(j);if(!(k<=0)){k=k*g.intensity;d.r=d.r+h.r*k;d.g=d.g+h.g*k;d.b=d.b+h.b*k}}else if(g instanceof THREE.PointLight){j=g.matrixWorld.getPosition();k=c.dot(v.sub(j,b).normalize());if(!(k<=0)){k=k*(g.distance==0?1:1-Math.min(b.distanceTo(j)/g.distance,1));if(k!=0){k=k*g.intensity;d.r=d.r+h.r*k;d.g=d.g+h.g*k;d.b=d.b+h.b*
k}}}}}function b(a){if(A[a]==null){A[a]=document.createElementNS("http://www.w3.org/2000/svg","path");D==0&&A[a].setAttribute("shape-rendering","crispEdges")}return A[a]}function c(a){a=(a+1)*0.5;return a<0?0:a>1?1:a}console.log("THREE.SVGRenderer",THREE.REVISION);var d=this,e,f,g,h=new THREE.Projector,j=document.createElementNS("http://www.w3.org/2000/svg","svg"),l,k,p,m,o,q,n,r,u=new THREE.Rectangle,t=new THREE.Rectangle,y=false,s=new THREE.Color,w=new THREE.Color,H=new THREE.Color,E=new THREE.Color,
z,v=new THREE.Vector3,A=[],J=[],K,R,P,D=1;this.domElement=j;this.sortElements=this.sortObjects=this.autoClear=true;this.info={render:{vertices:0,faces:0}};this.setQuality=function(a){switch(a){case "high":D=1;break;case "low":D=0}};this.setSize=function(a,b){l=a;k=b;p=l/2;m=k/2;j.setAttribute("viewBox",-p+" "+-m+" "+l+" "+k);j.setAttribute("width",l);j.setAttribute("height",k);u.set(-p,-m,p,m)};this.clear=function(){for(;j.childNodes.length>0;)j.removeChild(j.childNodes[0])};this.render=function(k,
l){var i,v,A,C;this.autoClear&&this.clear();d.info.render.vertices=0;d.info.render.faces=0;e=h.projectScene(k,l,this.sortElements);f=e.elements;g=e.lights;P=R=0;if(y=g.length>0){w.setRGB(0,0,0);H.setRGB(0,0,0);E.setRGB(0,0,0);i=0;for(v=g.length;i<v;i++){C=g[i];A=C.color;if(C instanceof THREE.AmbientLight){w.r=w.r+A.r;w.g=w.g+A.g;w.b=w.b+A.b}else if(C instanceof THREE.DirectionalLight){H.r=H.r+A.r;H.g=H.g+A.g;H.b=H.b+A.b}else if(C instanceof THREE.PointLight){E.r=E.r+A.r;E.g=E.g+A.g;E.b=E.b+A.b}}}i=
0;for(v=f.length;i<v;i++){A=f[i];C=A.material;C=C instanceof THREE.MeshFaceMaterial?A.faceMaterial:C;if(!(C===void 0||C.visible===false)){t.empty();if(A instanceof THREE.RenderableParticle){o=A;o.x=o.x*p;o.y=o.y*-m}else if(A instanceof THREE.RenderableLine){o=A.v1;q=A.v2;o.positionScreen.x=o.positionScreen.x*p;o.positionScreen.y=o.positionScreen.y*-m;q.positionScreen.x=q.positionScreen.x*p;q.positionScreen.y=q.positionScreen.y*-m;t.addPoint(o.positionScreen.x,o.positionScreen.y);t.addPoint(q.positionScreen.x,
q.positionScreen.y);if(u.intersects(t)){A=o;var Y=q,F=P++;if(J[F]==null){J[F]=document.createElementNS("http://www.w3.org/2000/svg","line");D==0&&J[F].setAttribute("shape-rendering","crispEdges")}K=J[F];K.setAttribute("x1",A.positionScreen.x);K.setAttribute("y1",A.positionScreen.y);K.setAttribute("x2",Y.positionScreen.x);K.setAttribute("y2",Y.positionScreen.y);if(C instanceof THREE.LineBasicMaterial){K.setAttribute("style","fill: none; stroke: "+C.color.getContextStyle()+"; stroke-width: "+C.linewidth+
"; stroke-opacity: "+C.opacity+"; stroke-linecap: "+C.linecap+"; stroke-linejoin: "+C.linejoin);j.appendChild(K)}}}else if(A instanceof THREE.RenderableFace3){o=A.v1;q=A.v2;n=A.v3;o.positionScreen.x=o.positionScreen.x*p;o.positionScreen.y=o.positionScreen.y*-m;q.positionScreen.x=q.positionScreen.x*p;q.positionScreen.y=q.positionScreen.y*-m;n.positionScreen.x=n.positionScreen.x*p;n.positionScreen.y=n.positionScreen.y*-m;t.addPoint(o.positionScreen.x,o.positionScreen.y);t.addPoint(q.positionScreen.x,
q.positionScreen.y);t.addPoint(n.positionScreen.x,n.positionScreen.y);if(u.intersects(t)){var Y=o,F=q,ea=n;d.info.render.vertices=d.info.render.vertices+3;d.info.render.faces++;K=b(R++);K.setAttribute("d","M "+Y.positionScreen.x+" "+Y.positionScreen.y+" L "+F.positionScreen.x+" "+F.positionScreen.y+" L "+ea.positionScreen.x+","+ea.positionScreen.y+"z");if(C instanceof THREE.MeshBasicMaterial)s.copy(C.color);else if(C instanceof THREE.MeshLambertMaterial)if(y){s.r=w.r;s.g=w.g;s.b=w.b;a(g,A.centroidWorld,
A.normalWorld,s);s.r=Math.max(0,Math.min(C.color.r*s.r,1));s.g=Math.max(0,Math.min(C.color.g*s.g,1));s.b=Math.max(0,Math.min(C.color.b*s.b,1))}else s.copy(C.color);else if(C instanceof THREE.MeshDepthMaterial){z=1-C.__2near/(C.__farPlusNear-A.z*C.__farMinusNear);s.setRGB(z,z,z)}else C instanceof THREE.MeshNormalMaterial&&s.setRGB(c(A.normalWorld.x),c(A.normalWorld.y),c(A.normalWorld.z));C.wireframe?K.setAttribute("style","fill: none; stroke: "+s.getContextStyle()+"; stroke-width: "+C.wireframeLinewidth+
"; stroke-opacity: "+C.opacity+"; stroke-linecap: "+C.wireframeLinecap+"; stroke-linejoin: "+C.wireframeLinejoin):K.setAttribute("style","fill: "+s.getContextStyle()+"; fill-opacity: "+C.opacity);j.appendChild(K)}}else if(A instanceof THREE.RenderableFace4){o=A.v1;q=A.v2;n=A.v3;r=A.v4;o.positionScreen.x=o.positionScreen.x*p;o.positionScreen.y=o.positionScreen.y*-m;q.positionScreen.x=q.positionScreen.x*p;q.positionScreen.y=q.positionScreen.y*-m;n.positionScreen.x=n.positionScreen.x*p;n.positionScreen.y=
n.positionScreen.y*-m;r.positionScreen.x=r.positionScreen.x*p;r.positionScreen.y=r.positionScreen.y*-m;t.addPoint(o.positionScreen.x,o.positionScreen.y);t.addPoint(q.positionScreen.x,q.positionScreen.y);t.addPoint(n.positionScreen.x,n.positionScreen.y);t.addPoint(r.positionScreen.x,r.positionScreen.y);if(u.intersects(t)){var Y=o,F=q,ea=n,fa=r;d.info.render.vertices=d.info.render.vertices+4;d.info.render.faces++;K=b(R++);K.setAttribute("d","M "+Y.positionScreen.x+" "+Y.positionScreen.y+" L "+F.positionScreen.x+
" "+F.positionScreen.y+" L "+ea.positionScreen.x+","+ea.positionScreen.y+" L "+fa.positionScreen.x+","+fa.positionScreen.y+"z");if(C instanceof THREE.MeshBasicMaterial)s.copy(C.color);else if(C instanceof THREE.MeshLambertMaterial)if(y){s.r=w.r;s.g=w.g;s.b=w.b;a(g,A.centroidWorld,A.normalWorld,s);s.r=Math.max(0,Math.min(C.color.r*s.r,1));s.g=Math.max(0,Math.min(C.color.g*s.g,1));s.b=Math.max(0,Math.min(C.color.b*s.b,1))}else s.copy(C.color);else if(C instanceof THREE.MeshDepthMaterial){z=1-C.__2near/
(C.__farPlusNear-A.z*C.__farMinusNear);s.setRGB(z,z,z)}else C instanceof THREE.MeshNormalMaterial&&s.setRGB(c(A.normalWorld.x),c(A.normalWorld.y),c(A.normalWorld.z));C.wireframe?K.setAttribute("style","fill: none; stroke: "+s.getContextStyle()+"; stroke-width: "+C.wireframeLinewidth+"; stroke-opacity: "+C.opacity+"; stroke-linecap: "+C.wireframeLinecap+"; stroke-linejoin: "+C.wireframeLinejoin):K.setAttribute("style","fill: "+s.getContextStyle()+"; fill-opacity: "+C.opacity);j.appendChild(K)}}}}}};
THREE.ShaderChunk={fog_pars_fragment:"#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#endif",fog_fragment:"#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif",
envmap_pars_fragment:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float reflectivity;\nuniform samplerCube envMap;\nuniform float flipEnvMap;\nuniform int combine;\n#endif",envmap_fragment:"#ifdef USE_ENVMAP\n#ifdef DOUBLE_SIDED\nfloat flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\nvec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * vReflect.x, vReflect.yz ) );\n#else\nvec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * vReflect.x, vReflect.yz ) );\n#endif\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\nif ( combine == 1 ) {\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, reflectivity );\n} else {\ngl_FragColor.xyz = gl_FragColor.xyz * cubeColor.xyz;\n}\n#endif",
envmap_pars_vertex:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float refractionRatio;\nuniform bool useRefract;\n#endif",envmap_vertex:"#ifdef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = mat3( objectMatrix[ 0 ].xyz, objectMatrix[ 1 ].xyz, objectMatrix[ 2 ].xyz ) * normal;\nif ( useRefract ) {\nvReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refractionRatio );\n} else {\nvReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );\n}\n#endif",
map_particle_pars_fragment:"#ifdef USE_MAP\nuniform sampler2D map;\n#endif",map_particle_fragment:"#ifdef USE_MAP\ngl_FragColor = gl_FragColor * texture2D( map, gl_PointCoord );\n#endif",map_pars_vertex:"#ifdef USE_MAP\nvarying vec2 vUv;\nuniform vec4 offsetRepeat;\n#endif",map_pars_fragment:"#ifdef USE_MAP\nvarying vec2 vUv;\nuniform sampler2D map;\n#endif",map_vertex:"#ifdef USE_MAP\nvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif",map_fragment:"#ifdef USE_MAP\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( map, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( map, vUv );\n#endif\n#endif",
lightmap_pars_fragment:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\nuniform sampler2D lightMap;\n#endif",lightmap_pars_vertex:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\n#endif",lightmap_fragment:"#ifdef USE_LIGHTMAP\ngl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n#endif",lightmap_vertex:"#ifdef USE_LIGHTMAP\nvUv2 = uv2;\n#endif",lights_lambert_pars_vertex:"uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngle[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif",
lights_lambert_vertex:"vLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\nvLightBack = vec3( 0.0 );\n#endif\ntransformedNormal = normalize( transformedNormal );\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( transformedNormal, dirVector );\nvec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\ndirectionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\ndirectionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n#ifdef DOUBLE_SIDED\nvLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n#endif\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\npointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\npointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += pointLightColor[ i ] * pointLightWeighting * lDistance;\n#ifdef DOUBLE_SIDED\nvLightBack += pointLightColor[ i ] * pointLightWeightingBack * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nlVector = normalize( lVector );\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - mPosition.xyz ) );\nif ( spotEffect > spotLightAngle[ i ] ) {\nspotEffect = pow( spotEffect, spotLightExponent[ i ] );\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\nspotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\nspotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;\n#ifdef DOUBLE_SIDED\nvLightBack += spotLightColor[ i ] * spotLightWeightingBack * lDistance * spotEffect;\n#endif\n}\n}\n#endif\nvLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;\n#ifdef DOUBLE_SIDED\nvLightBack = vLightBack * diffuse + ambient * ambientLightColor + emissive;\n#endif",
lights_phong_pars_vertex:"#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvarying vec3 vWorldPosition;\n#endif",lights_phong_vertex:"#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nvSpotLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvWorldPosition = mPosition.xyz;\n#endif",
lights_phong_pars_fragment:"uniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#else\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngle[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#else\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\nvarying vec3 vWorldPosition;\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",
lights_phong_fragment:"vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse  = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );\nfloat lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\npointDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\nvec3 pointHalfVector = normalize( lVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = max( pow( pointDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\npointSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvec3 spotDiffuse  = vec3( 0.0 );\nvec3 spotSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );\nfloat lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\nif ( spotEffect > spotLightAngle[ i ] ) {\nspotEffect = pow( spotEffect, spotLightExponent[ i ] );\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\nspotDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\nvec3 spotHalfVector = normalize( lVector + viewPosition );\nfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\nfloat spotSpecularWeight = max( pow( spotDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );\nspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\nspotSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse  = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( normal, dirVector );\n#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\ndirDiffuse  += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = max( pow( dirDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\n#if MAX_SPOT_LIGHTS > 0\ntotalDiffuse += spotDiffuse;\ntotalSpecular += spotSpecular;\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif",
color_pars_fragment:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_fragment:"#ifdef USE_COLOR\ngl_FragColor = gl_FragColor * vec4( vColor, opacity );\n#endif",color_pars_vertex:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_vertex:"#ifdef USE_COLOR\n#ifdef GAMMA_INPUT\nvColor = color * color;\n#else\nvColor = color;\n#endif\n#endif",skinning_pars_vertex:"#ifdef USE_SKINNING\nuniform mat4 boneGlobalMatrices[ MAX_BONES ];\n#endif",skinning_vertex:"#ifdef USE_SKINNING\ngl_Position  = ( boneGlobalMatrices[ int( skinIndex.x ) ] * skinVertexA ) * skinWeight.x;\ngl_Position += ( boneGlobalMatrices[ int( skinIndex.y ) ] * skinVertexB ) * skinWeight.y;\ngl_Position  = projectionMatrix * modelViewMatrix * gl_Position;\n#endif",
morphtarget_pars_vertex:"#ifdef USE_MORPHTARGETS\n#ifndef USE_MORPHNORMALS\nuniform float morphTargetInfluences[ 8 ];\n#else\nuniform float morphTargetInfluences[ 4 ];\n#endif\n#endif",morphtarget_vertex:"#ifdef USE_MORPHTARGETS\nvec3 morphed = vec3( 0.0 );\nmorphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\nmorphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\nmorphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\nmorphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n#ifndef USE_MORPHNORMALS\nmorphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\nmorphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\nmorphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\nmorphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n#endif\nmorphed += position;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );\n#endif",
default_vertex:"#ifndef USE_MORPHTARGETS\n#ifndef USE_SKINNING\ngl_Position = projectionMatrix * mvPosition;\n#endif\n#endif",morphnormal_vertex:"#ifdef USE_MORPHNORMALS\nvec3 morphedNormal = vec3( 0.0 );\nmorphedNormal +=  ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\nmorphedNormal +=  ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\nmorphedNormal +=  ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\nmorphedNormal +=  ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\nmorphedNormal += normal;\nvec3 transformedNormal = normalMatrix * morphedNormal;\n#else\nvec3 transformedNormal = normalMatrix * normal;\n#endif",
shadowmap_pars_fragment:"#ifdef USE_SHADOWMAP\nuniform sampler2D shadowMap[ MAX_SHADOWS ];\nuniform vec2 shadowMapSize[ MAX_SHADOWS ];\nuniform float shadowDarkness[ MAX_SHADOWS ];\nuniform float shadowBias[ MAX_SHADOWS ];\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nfloat unpackDepth( const in vec4 rgba_depth ) {\nconst vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\nfloat depth = dot( rgba_depth, bit_shift );\nreturn depth;\n}\n#endif",shadowmap_fragment:"#ifdef USE_SHADOWMAP\n#ifdef SHADOWMAP_DEBUG\nvec3 frustumColors[3];\nfrustumColors[0] = vec3( 1.0, 0.5, 0.0 );\nfrustumColors[1] = vec3( 0.0, 1.0, 0.8 );\nfrustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n#endif\n#ifdef SHADOWMAP_CASCADE\nint inFrustumCount = 0;\n#endif\nfloat fDepth;\nvec3 shadowColor = vec3( 1.0 );\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\nbvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\nbool inFrustum = all( inFrustumVec );\n#ifdef SHADOWMAP_CASCADE\ninFrustumCount += int( inFrustum );\nbvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n#else\nbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n#endif\nbool frustumTest = all( frustumTestVec );\nif ( frustumTest ) {\nshadowCoord.z += shadowBias[ i ];\n#ifdef SHADOWMAP_SOFT\nfloat shadow = 0.0;\nconst float shadowDelta = 1.0 / 9.0;\nfloat xPixelOffset = 1.0 / shadowMapSize[ i ].x;\nfloat yPixelOffset = 1.0 / shadowMapSize[ i ].y;\nfloat dx0 = -1.25 * xPixelOffset;\nfloat dy0 = -1.25 * yPixelOffset;\nfloat dx1 = 1.25 * xPixelOffset;\nfloat dy1 = 1.25 * yPixelOffset;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nshadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n#else\nvec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\nfloat fDepth = unpackDepth( rgbaDepth );\nif ( fDepth < shadowCoord.z )\nshadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n#endif\n}\n#ifdef SHADOWMAP_DEBUG\n#ifdef SHADOWMAP_CASCADE\nif ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n#else\nif ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n#endif\n#endif\n}\n#ifdef GAMMA_OUTPUT\nshadowColor *= shadowColor;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n#endif",
shadowmap_pars_vertex:"#ifdef USE_SHADOWMAP\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nuniform mat4 shadowMatrix[ MAX_SHADOWS ];\n#endif",shadowmap_vertex:"#ifdef USE_SHADOWMAP\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\n#ifdef USE_MORPHTARGETS\nvShadowCoord[ i ] = shadowMatrix[ i ] * objectMatrix * vec4( morphed, 1.0 );\n#else\nvShadowCoord[ i ] = shadowMatrix[ i ] * objectMatrix * vec4( position, 1.0 );\n#endif\n}\n#endif",alphatest_fragment:"#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif",
linear_to_gamma_fragment:"#ifdef GAMMA_OUTPUT\ngl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n#endif"};
THREE.UniformsUtils={merge:function(a){var b,c,d,e={};for(b=0;b<a.length;b++){d=this.clone(a[b]);for(c in d)e[c]=d[c]}return e},clone:function(a){var b,c,d,e={};for(b in a){e[b]={};for(c in a[b]){d=a[b][c];e[b][c]=d instanceof THREE.Color||d instanceof THREE.Vector2||d instanceof THREE.Vector3||d instanceof THREE.Vector4||d instanceof THREE.Matrix4||d instanceof THREE.Texture?d.clone():d instanceof Array?d.slice():d}}return e}};
THREE.UniformsLib={common:{diffuse:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},map:{type:"t",value:0,texture:null},offsetRepeat:{type:"v4",value:new THREE.Vector4(0,0,1,1)},lightMap:{type:"t",value:2,texture:null},envMap:{type:"t",value:1,texture:null},flipEnvMap:{type:"f",value:-1},useRefract:{type:"i",value:0},reflectivity:{type:"f",value:1},refractionRatio:{type:"f",value:0.98},combine:{type:"i",value:0},morphTargetInfluences:{type:"f",value:0}},fog:{fogDensity:{type:"f",
value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},lights:{ambientLightColor:{type:"fv",value:[]},directionalLightDirection:{type:"fv",value:[]},directionalLightColor:{type:"fv",value:[]},pointLightColor:{type:"fv",value:[]},pointLightPosition:{type:"fv",value:[]},pointLightDistance:{type:"fv1",value:[]},spotLightColor:{type:"fv",value:[]},spotLightPosition:{type:"fv",value:[]},spotLightDirection:{type:"fv",value:[]},spotLightDistance:{type:"fv1",
value:[]},spotLightAngle:{type:"fv1",value:[]},spotLightExponent:{type:"fv1",value:[]}},particle:{psColor:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},size:{type:"f",value:1},scale:{type:"f",value:1},map:{type:"t",value:0,texture:null},fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},shadowmap:{shadowMap:{type:"tv",value:6,texture:[]},shadowMapSize:{type:"v2v",value:[]},shadowBias:{type:"fv1",
value:[]},shadowDarkness:{type:"fv1",value:[]},shadowMatrix:{type:"m4v",value:[]}}};
THREE.ShaderLib={depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2E3},opacity:{type:"f",value:1}},vertexShader:"void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform float mNear;\nuniform float mFar;\nuniform float opacity;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), opacity );\n}"},normal:{uniforms:{opacity:{type:"f",
value:1}},vertexShader:"varying vec3 vNormal;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalMatrix * normal;\ngl_Position = projectionMatrix * mvPosition;\n}",fragmentShader:"uniform float opacity;\nvarying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );\n}"},basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.shadowmap]),vertexShader:[THREE.ShaderChunk.map_pars_vertex,
THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,
THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( diffuse, opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,
THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},lambert:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,
1,1)}}]),vertexShader:["varying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_lambert_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,
THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.morphnormal_vertex,"#ifndef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\n#endif",THREE.ShaderChunk.lights_lambert_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",
THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,"#ifdef DOUBLE_SIDED\nif ( gl_FrontFacing )\ngl_FragColor.xyz *= vLightFront;\nelse\ngl_FragColor.xyz *= vLightBack;\n#else\ngl_FragColor.xyz *= vLightFront;\n#endif",
THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},phong:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},specular:{type:"c",value:new THREE.Color(1118481)},
shininess:{type:"f",value:30},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["varying vec3 vViewPosition;\nvarying vec3 vNormal;",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_phong_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,"#ifndef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\n#endif\nvViewPosition = -mvPosition.xyz;",THREE.ShaderChunk.morphnormal_vertex,"vNormal = transformedNormal;",THREE.ShaderChunk.lights_phong_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),
fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.lights_phong_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",
THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.lights_phong_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},particle_basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.particle,THREE.UniformsLib.shadowmap]),vertexShader:["uniform float size;\nuniform float scale;",
THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {",THREE.ShaderChunk.color_vertex,"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n#ifdef USE_SIZEATTENUATION\ngl_PointSize = size * ( scale / length( mvPosition.xyz ) );\n#else\ngl_PointSize = size;\n#endif\ngl_Position = projectionMatrix * mvPosition;",THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 psColor;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,
THREE.ShaderChunk.map_particle_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( psColor, opacity );",THREE.ShaderChunk.map_particle_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},depthRGBA:{uniforms:{},vertexShader:[THREE.ShaderChunk.morphtarget_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,"}"].join("\n"),fragmentShader:"vec4 pack_depth( const in float depth ) {\nconst vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\nconst vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\nvec4 res = fract( depth * bit_shift );\nres -= res.xxyz * bit_mask;\nreturn res;\n}\nvoid main() {\ngl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );\n}"}};
THREE.WebGLRenderer=function(a){function b(a,b){var c=a.vertices.length,d=b.material;if(d.attributes){if(a.__webglCustomAttributesList===void 0)a.__webglCustomAttributesList=[];for(var e in d.attributes){var f=d.attributes[e];if(!f.__webglInitialized||f.createUniqueBuffers){f.__webglInitialized=true;var g=1;f.type==="v2"?g=2:f.type==="v3"?g=3:f.type==="v4"?g=4:f.type==="c"&&(g=3);f.size=g;f.array=new Float32Array(c*g);f.buffer=i.createBuffer();f.buffer.belongsToAttribute=e;f.needsUpdate=true}a.__webglCustomAttributesList.push(f)}}}
function c(a,b){if(a.material&&!(a.material instanceof THREE.MeshFaceMaterial))return a.material;if(b.materialIndex>=0)return a.geometry.materials[b.materialIndex]}function d(a){return a instanceof THREE.MeshBasicMaterial&&!a.envMap||a instanceof THREE.MeshDepthMaterial?false:a&&a.shading!==void 0&&a.shading===THREE.SmoothShading?THREE.SmoothShading:THREE.FlatShading}function e(a){return a.map||a.lightMap||a instanceof THREE.ShaderMaterial?true:false}function f(a,b,c){var d,e,f,g,h=a.vertices;g=h.length;
var j=a.colors,k=j.length,l=a.__vertexArray,m=a.__colorArray,n=a.__sortArray,p=a.verticesNeedUpdate,o=a.colorsNeedUpdate,q=a.__webglCustomAttributesList;if(c.sortParticles){xa.copy(Ba);xa.multiplySelf(c.matrixWorld);for(d=0;d<g;d++){e=h[d];$a.copy(e);xa.multiplyVector3($a);n[d]=[$a.z,d]}n.sort(function(a,b){return b[0]-a[0]});for(d=0;d<g;d++){e=h[n[d][1]];f=d*3;l[f]=e.x;l[f+1]=e.y;l[f+2]=e.z}for(d=0;d<k;d++){f=d*3;e=j[n[d][1]];m[f]=e.r;m[f+1]=e.g;m[f+2]=e.b}if(q){j=0;for(k=q.length;j<k;j++){h=q[j];
if(h.boundTo===void 0||h.boundTo==="vertices"){f=0;e=h.value.length;if(h.size===1)for(d=0;d<e;d++){g=n[d][1];h.array[d]=h.value[g]}else if(h.size===2)for(d=0;d<e;d++){g=n[d][1];g=h.value[g];h.array[f]=g.x;h.array[f+1]=g.y;f=f+2}else if(h.size===3)if(h.type==="c")for(d=0;d<e;d++){g=n[d][1];g=h.value[g];h.array[f]=g.r;h.array[f+1]=g.g;h.array[f+2]=g.b;f=f+3}else for(d=0;d<e;d++){g=n[d][1];g=h.value[g];h.array[f]=g.x;h.array[f+1]=g.y;h.array[f+2]=g.z;f=f+3}else if(h.size===4)for(d=0;d<e;d++){g=n[d][1];
g=h.value[g];h.array[f]=g.x;h.array[f+1]=g.y;h.array[f+2]=g.z;h.array[f+3]=g.w;f=f+4}}}}}else{if(p)for(d=0;d<g;d++){e=h[d];f=d*3;l[f]=e.x;l[f+1]=e.y;l[f+2]=e.z}if(o)for(d=0;d<k;d++){e=j[d];f=d*3;m[f]=e.r;m[f+1]=e.g;m[f+2]=e.b}if(q){j=0;for(k=q.length;j<k;j++){h=q[j];if(h.needsUpdate&&(h.boundTo===void 0||h.boundTo==="vertices")){e=h.value.length;f=0;if(h.size===1)for(d=0;d<e;d++)h.array[d]=h.value[d];else if(h.size===2)for(d=0;d<e;d++){g=h.value[d];h.array[f]=g.x;h.array[f+1]=g.y;f=f+2}else if(h.size===
3)if(h.type==="c")for(d=0;d<e;d++){g=h.value[d];h.array[f]=g.r;h.array[f+1]=g.g;h.array[f+2]=g.b;f=f+3}else for(d=0;d<e;d++){g=h.value[d];h.array[f]=g.x;h.array[f+1]=g.y;h.array[f+2]=g.z;f=f+3}else if(h.size===4)for(d=0;d<e;d++){g=h.value[d];h.array[f]=g.x;h.array[f+1]=g.y;h.array[f+2]=g.z;h.array[f+3]=g.w;f=f+4}}}}}if(p||c.sortParticles){i.bindBuffer(i.ARRAY_BUFFER,a.__webglVertexBuffer);i.bufferData(i.ARRAY_BUFFER,l,b)}if(o||c.sortParticles){i.bindBuffer(i.ARRAY_BUFFER,a.__webglColorBuffer);i.bufferData(i.ARRAY_BUFFER,
m,b)}if(q){j=0;for(k=q.length;j<k;j++){h=q[j];if(h.needsUpdate||c.sortParticles){i.bindBuffer(i.ARRAY_BUFFER,h.buffer);i.bufferData(i.ARRAY_BUFFER,h.array,b)}}}}function g(a,b){return b.z-a.z}function h(a,b,c){if(a.length)for(var d=0,e=a.length;d<e;d++){ea=U=null;Y=F=O=ia=Ka=Ma=Q=-1;Ta=true;a[d].render(b,c,hb,Cb);ea=U=null;Y=F=O=ia=Ka=Ma=Q=-1;Ta=true}}function j(a,b,c,d,e,f,g,h){var i,j,k,l;if(b){j=a.length-1;l=b=-1}else{j=0;b=a.length;l=1}for(var m=j;m!==b;m=m+l){i=a[m];if(i.render){j=i.object;k=
i.buffer;if(h)i=h;else{i=i[c];if(!i)continue;g&&G.setBlending(i.blending,i.blendEquation,i.blendSrc,i.blendDst);G.setDepthTest(i.depthTest);G.setDepthWrite(i.depthWrite);u(i.polygonOffset,i.polygonOffsetFactor,i.polygonOffsetUnits)}G.setObjectFaces(j);k instanceof THREE.BufferGeometry?G.renderBufferDirect(d,e,f,i,k,j):G.renderBuffer(d,e,f,i,k,j)}}}function l(a,b,c,d,e,f,g){for(var h,i,j=0,k=a.length;j<k;j++){h=a[j];i=h.object;if(i.visible){if(g)h=g;else{h=h[b];if(!h)continue;f&&G.setBlending(h.blending,
h.blendEquation,h.blendSrc,h.blendDst);G.setDepthTest(h.depthTest);G.setDepthWrite(h.depthWrite);u(h.polygonOffset,h.polygonOffsetFactor,h.polygonOffsetUnits)}G.renderImmediateObject(c,d,e,h,i)}}}function k(a,b,c){a.push({buffer:b,object:c,opaque:null,transparent:null})}function p(a){for(var b in a.attributes)if(a.attributes[b].needsUpdate)return true;return false}function m(a){for(var b in a.attributes)a.attributes[b].needsUpdate=false}function o(a,b){for(var c=a.length-1;c>=0;c--)a[c].object===
b&&a.splice(c,1)}function q(a,b){for(var c=a.length-1;c>=0;c--)a[c]===b&&a.splice(c,1)}function n(a,b,c,d,e){if(!d.program||d.needsUpdate){G.initMaterial(d,b,c,e);d.needsUpdate=false}if(d.morphTargets&&!e.__webglMorphTargetInfluences){e.__webglMorphTargetInfluences=new Float32Array(G.maxMorphTargets);for(var f=0,g=G.maxMorphTargets;f<g;f++)e.__webglMorphTargetInfluences[f]=0}var h=false,f=d.program,g=f.uniforms,j=d.uniforms;if(f!==U){i.useProgram(f);U=f;h=true}if(d.id!==Y){Y=d.id;h=true}if(h||a!==
ea){i.uniformMatrix4fv(g.projectionMatrix,false,a._projectionMatrixArray);a!==ea&&(ea=a)}if(h){if(c&&d.fog){j.fogColor.value=c.color;if(c instanceof THREE.Fog){j.fogNear.value=c.near;j.fogFar.value=c.far}else if(c instanceof THREE.FogExp2)j.fogDensity.value=c.density}if(d instanceof THREE.MeshPhongMaterial||d instanceof THREE.MeshLambertMaterial||d.lights){if(Ta){for(var k,l=0,m=0,n=0,p,o,q,r=Qa,s=r.directional.colors,t=r.directional.positions,u=r.point.colors,v=r.point.positions,w=r.point.distances,
z=r.spot.colors,A=r.spot.positions,C=r.spot.distances,D=r.spot.directions,F=r.spot.angles,J=r.spot.exponents,K=0,Q=0,M=0,O=q=0,c=O=0,h=b.length;c<h;c++){k=b[c];if(!k.onlyShadow){p=k.color;o=k.intensity;q=k.distance;if(k instanceof THREE.AmbientLight)if(G.gammaInput){l=l+p.r*p.r;m=m+p.g*p.g;n=n+p.b*p.b}else{l=l+p.r;m=m+p.g;n=n+p.b}else if(k instanceof THREE.DirectionalLight){q=K*3;if(G.gammaInput){s[q]=p.r*p.r*o*o;s[q+1]=p.g*p.g*o*o;s[q+2]=p.b*p.b*o*o}else{s[q]=p.r*o;s[q+1]=p.g*o;s[q+2]=p.b*o}aa.copy(k.matrixWorld.getPosition());
aa.subSelf(k.target.matrixWorld.getPosition());aa.normalize();t[q]=aa.x;t[q+1]=aa.y;t[q+2]=aa.z;K=K+1}else if(k instanceof THREE.PointLight){O=Q*3;if(G.gammaInput){u[O]=p.r*p.r*o*o;u[O+1]=p.g*p.g*o*o;u[O+2]=p.b*p.b*o*o}else{u[O]=p.r*o;u[O+1]=p.g*o;u[O+2]=p.b*o}p=k.matrixWorld.getPosition();v[O]=p.x;v[O+1]=p.y;v[O+2]=p.z;w[Q]=q;Q=Q+1}else if(k instanceof THREE.SpotLight){O=M*3;if(G.gammaInput){z[O]=p.r*p.r*o*o;z[O+1]=p.g*p.g*o*o;z[O+2]=p.b*p.b*o*o}else{z[O]=p.r*o;z[O+1]=p.g*o;z[O+2]=p.b*o}p=k.matrixWorld.getPosition();
A[O]=p.x;A[O+1]=p.y;A[O+2]=p.z;C[M]=q;aa.copy(p);aa.subSelf(k.target.matrixWorld.getPosition());aa.normalize();D[O]=aa.x;D[O+1]=aa.y;D[O+2]=aa.z;F[M]=Math.cos(k.angle);J[M]=k.exponent;M=M+1}}}c=K*3;for(h=s.length;c<h;c++)s[c]=0;c=Q*3;for(h=u.length;c<h;c++)u[c]=0;c=M*3;for(h=z.length;c<h;c++)z[c]=0;r.directional.length=K;r.point.length=Q;r.spot.length=M;r.ambient[0]=l;r.ambient[1]=m;r.ambient[2]=n;Ta=false}c=Qa;j.ambientLightColor.value=c.ambient;j.directionalLightColor.value=c.directional.colors;
j.directionalLightDirection.value=c.directional.positions;j.pointLightColor.value=c.point.colors;j.pointLightPosition.value=c.point.positions;j.pointLightDistance.value=c.point.distances;j.spotLightColor.value=c.spot.colors;j.spotLightPosition.value=c.spot.positions;j.spotLightDistance.value=c.spot.distances;j.spotLightDirection.value=c.spot.directions;j.spotLightAngle.value=c.spot.angles;j.spotLightExponent.value=c.spot.exponents}if(d instanceof THREE.MeshBasicMaterial||d instanceof THREE.MeshLambertMaterial||
d instanceof THREE.MeshPhongMaterial){j.opacity.value=d.opacity;G.gammaInput?j.diffuse.value.copyGammaToLinear(d.color):j.diffuse.value=d.color;(j.map.texture=d.map)&&j.offsetRepeat.value.set(d.map.offset.x,d.map.offset.y,d.map.repeat.x,d.map.repeat.y);j.lightMap.texture=d.lightMap;j.envMap.texture=d.envMap;j.flipEnvMap.value=d.envMap instanceof THREE.WebGLRenderTargetCube?1:-1;j.reflectivity.value=d.reflectivity;j.refractionRatio.value=d.refractionRatio;j.combine.value=d.combine;j.useRefract.value=
d.envMap&&d.envMap.mapping instanceof THREE.CubeRefractionMapping}if(d instanceof THREE.LineBasicMaterial){j.diffuse.value=d.color;j.opacity.value=d.opacity}else if(d instanceof THREE.ParticleBasicMaterial){j.psColor.value=d.color;j.opacity.value=d.opacity;j.size.value=d.size;j.scale.value=E.height/2;j.map.texture=d.map}else if(d instanceof THREE.MeshPhongMaterial){j.shininess.value=d.shininess;if(G.gammaInput){j.ambient.value.copyGammaToLinear(d.ambient);j.emissive.value.copyGammaToLinear(d.emissive);
j.specular.value.copyGammaToLinear(d.specular)}else{j.ambient.value=d.ambient;j.emissive.value=d.emissive;j.specular.value=d.specular}d.wrapAround&&j.wrapRGB.value.copy(d.wrapRGB)}else if(d instanceof THREE.MeshLambertMaterial){if(G.gammaInput){j.ambient.value.copyGammaToLinear(d.ambient);j.emissive.value.copyGammaToLinear(d.emissive)}else{j.ambient.value=d.ambient;j.emissive.value=d.emissive}d.wrapAround&&j.wrapRGB.value.copy(d.wrapRGB)}else if(d instanceof THREE.MeshDepthMaterial){j.mNear.value=
a.near;j.mFar.value=a.far;j.opacity.value=d.opacity}else if(d instanceof THREE.MeshNormalMaterial)j.opacity.value=d.opacity;if(e.receiveShadow&&!d._shadowPass&&j.shadowMatrix){h=c=0;for(k=b.length;h<k;h++){l=b[h];if(l.castShadow&&(l instanceof THREE.SpotLight||l instanceof THREE.DirectionalLight&&!l.shadowCascade)){j.shadowMap.texture[c]=l.shadowMap;j.shadowMapSize.value[c]=l.shadowMapSize;j.shadowMatrix.value[c]=l.shadowMatrix;j.shadowDarkness.value[c]=l.shadowDarkness;j.shadowBias.value[c]=l.shadowBias;
c++}}}b=d.uniformsList;j=0;for(c=b.length;j<c;j++)if(l=f.uniforms[b[j][1]]){h=b[j][0];m=h.type;k=h.value;switch(m){case "i":i.uniform1i(l,k);break;case "f":i.uniform1f(l,k);break;case "v2":i.uniform2f(l,k.x,k.y);break;case "v3":i.uniform3f(l,k.x,k.y,k.z);break;case "v4":i.uniform4f(l,k.x,k.y,k.z,k.w);break;case "c":i.uniform3f(l,k.r,k.g,k.b);break;case "fv1":i.uniform1fv(l,k);break;case "fv":i.uniform3fv(l,k);break;case "v2v":if(!h._array)h._array=new Float32Array(2*k.length);m=0;for(n=k.length;m<
n;m++){r=m*2;h._array[r]=k[m].x;h._array[r+1]=k[m].y}i.uniform2fv(l,h._array);break;case "v3v":if(!h._array)h._array=new Float32Array(3*k.length);m=0;for(n=k.length;m<n;m++){r=m*3;h._array[r]=k[m].x;h._array[r+1]=k[m].y;h._array[r+2]=k[m].z}i.uniform3fv(l,h._array);break;case "v4v":if(!h._array)h._array=new Float32Array(4*k.length);m=0;for(n=k.length;m<n;m++){r=m*4;h._array[r]=k[m].x;h._array[r+1]=k[m].y;h._array[r+2]=k[m].z;h._array[r+3]=k[m].w}i.uniform4fv(l,h._array);break;case "m4":if(!h._array)h._array=
new Float32Array(16);k.flattenToArray(h._array);i.uniformMatrix4fv(l,false,h._array);break;case "m4v":if(!h._array)h._array=new Float32Array(16*k.length);m=0;for(n=k.length;m<n;m++)k[m].flattenToArrayOffset(h._array,m*16);i.uniformMatrix4fv(l,false,h._array);break;case "t":i.uniform1i(l,k);l=h.texture;if(!l)continue;if(l.image instanceof Array&&l.image.length===6){h=l;if(h.image.length===6)if(h.needsUpdate){if(!h.image.__webglTextureCube)h.image.__webglTextureCube=i.createTexture();i.activeTexture(i.TEXTURE0+
k);i.bindTexture(i.TEXTURE_CUBE_MAP,h.image.__webglTextureCube);k=[];for(l=0;l<6;l++){m=k;n=l;if(G.autoScaleCubemaps){r=h.image[l];t=ib;if(!(r.width<=t&&r.height<=t)){u=Math.max(r.width,r.height);s=Math.floor(r.width*t/u);t=Math.floor(r.height*t/u);u=document.createElement("canvas");u.width=s;u.height=t;u.getContext("2d").drawImage(r,0,0,r.width,r.height,0,0,s,t);r=u}}else r=h.image[l];m[n]=r}l=k[0];m=(l.width&l.width-1)===0&&(l.height&l.height-1)===0;n=H(h.format);r=H(h.type);y(i.TEXTURE_CUBE_MAP,
h,m);for(l=0;l<6;l++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+l,0,n,n,r,k[l]);h.generateMipmaps&&m&&i.generateMipmap(i.TEXTURE_CUBE_MAP);h.needsUpdate=false;if(h.onUpdate)h.onUpdate()}else{i.activeTexture(i.TEXTURE0+k);i.bindTexture(i.TEXTURE_CUBE_MAP,h.image.__webglTextureCube)}}else if(l instanceof THREE.WebGLRenderTargetCube){h=l;i.activeTexture(i.TEXTURE0+k);i.bindTexture(i.TEXTURE_CUBE_MAP,h.__webglTexture)}else G.setTexture(l,k);break;case "tv":if(!h._array){h._array=[];m=0;for(n=h.texture.length;m<
n;m++)h._array[m]=k+m}i.uniform1iv(l,h._array);m=0;for(n=h.texture.length;m<n;m++)(l=h.texture[m])&&G.setTexture(l,h._array[m])}}if((d instanceof THREE.ShaderMaterial||d instanceof THREE.MeshPhongMaterial||d.envMap)&&g.cameraPosition!==null){b=a.matrixWorld.getPosition();i.uniform3f(g.cameraPosition,b.x,b.y,b.z)}(d instanceof THREE.MeshPhongMaterial||d instanceof THREE.MeshLambertMaterial||d instanceof THREE.ShaderMaterial||d.skinning)&&g.viewMatrix!==null&&i.uniformMatrix4fv(g.viewMatrix,false,a._viewMatrixArray);
d.skinning&&i.uniformMatrix4fv(g.boneGlobalMatrices,false,e.boneMatrices)}i.uniformMatrix4fv(g.modelViewMatrix,false,e._modelViewMatrix.elements);g.normalMatrix&&i.uniformMatrix3fv(g.normalMatrix,false,e._normalMatrix.elements);g.objectMatrix!==null&&i.uniformMatrix4fv(g.objectMatrix,false,e.matrixWorld.elements);return f}function r(a,b){a._modelViewMatrix.multiply(b.matrixWorldInverse,a.matrixWorld);a._normalMatrix.getInverse(a._modelViewMatrix);a._normalMatrix.transpose()}function u(a,b,c){if(Ra!==
a){a?i.enable(i.POLYGON_OFFSET_FILL):i.disable(i.POLYGON_OFFSET_FILL);Ra=a}if(a&&(La!==b||Sa!==c)){i.polygonOffset(b,c);La=b;Sa=c}}function t(a,b){var c;a==="fragment"?c=i.createShader(i.FRAGMENT_SHADER):a==="vertex"&&(c=i.createShader(i.VERTEX_SHADER));i.shaderSource(c,b);i.compileShader(c);if(!i.getShaderParameter(c,i.COMPILE_STATUS)){console.error(i.getShaderInfoLog(c));console.error(b);return null}return c}function y(a,b,c){if(c){i.texParameteri(a,i.TEXTURE_WRAP_S,H(b.wrapS));i.texParameteri(a,
i.TEXTURE_WRAP_T,H(b.wrapT));i.texParameteri(a,i.TEXTURE_MAG_FILTER,H(b.magFilter));i.texParameteri(a,i.TEXTURE_MIN_FILTER,H(b.minFilter))}else{i.texParameteri(a,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE);i.texParameteri(a,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE);i.texParameteri(a,i.TEXTURE_MAG_FILTER,w(b.magFilter));i.texParameteri(a,i.TEXTURE_MIN_FILTER,w(b.minFilter))}}function s(a,b){i.bindRenderbuffer(i.RENDERBUFFER,a);if(b.depthBuffer&&!b.stencilBuffer){i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_COMPONENT16,
b.width,b.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,a)}else if(b.depthBuffer&&b.stencilBuffer){i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,b.width,b.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,a)}else i.renderbufferStorage(i.RENDERBUFFER,i.RGBA4,b.width,b.height)}function w(a){switch(a){case THREE.NearestFilter:case THREE.NearestMipMapNearestFilter:case THREE.NearestMipMapLinearFilter:return i.NEAREST;default:return i.LINEAR}}
function H(a){switch(a){case THREE.RepeatWrapping:return i.REPEAT;case THREE.ClampToEdgeWrapping:return i.CLAMP_TO_EDGE;case THREE.MirroredRepeatWrapping:return i.MIRRORED_REPEAT;case THREE.NearestFilter:return i.NEAREST;case THREE.NearestMipMapNearestFilter:return i.NEAREST_MIPMAP_NEAREST;case THREE.NearestMipMapLinearFilter:return i.NEAREST_MIPMAP_LINEAR;case THREE.LinearFilter:return i.LINEAR;case THREE.LinearMipMapNearestFilter:return i.LINEAR_MIPMAP_NEAREST;case THREE.LinearMipMapLinearFilter:return i.LINEAR_MIPMAP_LINEAR;
case THREE.ByteType:return i.BYTE;case THREE.UnsignedByteType:return i.UNSIGNED_BYTE;case THREE.ShortType:return i.SHORT;case THREE.UnsignedShortType:return i.UNSIGNED_SHORT;case THREE.IntType:return i.INT;case THREE.UnsignedIntType:return i.UNSIGNED_INT;case THREE.FloatType:return i.FLOAT;case THREE.AlphaFormat:return i.ALPHA;case THREE.RGBFormat:return i.RGB;case THREE.RGBAFormat:return i.RGBA;case THREE.LuminanceFormat:return i.LUMINANCE;case THREE.LuminanceAlphaFormat:return i.LUMINANCE_ALPHA;
case THREE.AddEquation:return i.FUNC_ADD;case THREE.SubtractEquation:return i.FUNC_SUBTRACT;case THREE.ReverseSubtractEquation:return i.FUNC_REVERSE_SUBTRACT;case THREE.ZeroFactor:return i.ZERO;case THREE.OneFactor:return i.ONE;case THREE.SrcColorFactor:return i.SRC_COLOR;case THREE.OneMinusSrcColorFactor:return i.ONE_MINUS_SRC_COLOR;case THREE.SrcAlphaFactor:return i.SRC_ALPHA;case THREE.OneMinusSrcAlphaFactor:return i.ONE_MINUS_SRC_ALPHA;case THREE.DstAlphaFactor:return i.DST_ALPHA;case THREE.OneMinusDstAlphaFactor:return i.ONE_MINUS_DST_ALPHA;
case THREE.DstColorFactor:return i.DST_COLOR;case THREE.OneMinusDstColorFactor:return i.ONE_MINUS_DST_COLOR;case THREE.SrcAlphaSaturateFactor:return i.SRC_ALPHA_SATURATE}return 0}console.log("THREE.WebGLRenderer",THREE.REVISION);var a=a||{},E=a.canvas!==void 0?a.canvas:document.createElement("canvas"),z=a.precision!==void 0?a.precision:"highp",v=a.alpha!==void 0?a.alpha:true,A=a.premultipliedAlpha!==void 0?a.premultipliedAlpha:true,J=a.antialias!==void 0?a.antialias:false,K=a.stencil!==void 0?a.stencil:
true,R=a.preserveDrawingBuffer!==void 0?a.preserveDrawingBuffer:false,P=a.clearColor!==void 0?new THREE.Color(a.clearColor):new THREE.Color(0),D=a.clearAlpha!==void 0?a.clearAlpha:0,M=a.maxLights!==void 0?a.maxLights:4;this.domElement=E;this.context=null;this.autoUpdateScene=this.autoUpdateObjects=this.sortObjects=this.autoClearStencil=this.autoClearDepth=this.autoClearColor=this.autoClear=true;this.shadowMapEnabled=this.physicallyBasedShading=this.gammaOutput=this.gammaInput=false;this.shadowMapCullFrontFaces=
this.shadowMapSoft=this.shadowMapAutoUpdate=true;this.shadowMapCascade=this.shadowMapDebug=false;this.maxMorphTargets=8;this.maxMorphNormals=4;this.autoScaleCubemaps=true;this.renderPluginsPre=[];this.renderPluginsPost=[];this.info={memory:{programs:0,geometries:0,textures:0},render:{calls:0,vertices:0,faces:0,points:0}};var G=this,i,T=[],U=null,C=null,Y=-1,F=null,ea=null,fa=0,ia=-1,O=-1,Q=-1,Z=-1,$=-1,ha=-1,Ma=-1,Ka=-1,Ra=null,La=null,Sa=null,Na=null,Kb=0,lb=0,gb=0,Lb=0,hb=0,Cb=0,Wa=new THREE.Frustum,
Ba=new THREE.Matrix4,xa=new THREE.Matrix4,$a=new THREE.Vector4,aa=new THREE.Vector3,Ta=true,Qa={ambient:[0,0,0],directional:{length:0,colors:[],positions:[]},point:{length:0,colors:[],positions:[],distances:[]},spot:{length:0,colors:[],positions:[],distances:[],directions:[],angles:[],exponents:[]}};i=function(){var a;try{if(!(a=E.getContext("experimental-webgl",{alpha:v,premultipliedAlpha:A,antialias:J,stencil:K,preserveDrawingBuffer:R})))throw"Error creating WebGL context.";}catch(b){console.error(b)}a.getExtension("OES_texture_float")||
console.log("THREE.WebGLRenderer: Float textures not supported.");return a}();i.clearColor(0,0,0,1);i.clearDepth(1);i.clearStencil(0);i.enable(i.DEPTH_TEST);i.depthFunc(i.LEQUAL);i.frontFace(i.CCW);i.cullFace(i.BACK);i.enable(i.CULL_FACE);i.enable(i.BLEND);i.blendEquation(i.FUNC_ADD);i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA);i.clearColor(P.r,P.g,P.b,D);this.context=i;var oa=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS);i.getParameter(i.MAX_TEXTURE_SIZE);var ib=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE);
this.getContext=function(){return i};this.supportsVertexTextures=function(){return oa>0};this.setSize=function(a,b){E.width=a;E.height=b;this.setViewport(0,0,E.width,E.height)};this.setViewport=function(a,b,c,d){Kb=a;lb=b;gb=c;Lb=d;i.viewport(Kb,lb,gb,Lb)};this.setScissor=function(a,b,c,d){i.scissor(a,b,c,d)};this.enableScissorTest=function(a){a?i.enable(i.SCISSOR_TEST):i.disable(i.SCISSOR_TEST)};this.setClearColorHex=function(a,b){P.setHex(a);D=b;i.clearColor(P.r,P.g,P.b,D)};this.setClearColor=function(a,
b){P.copy(a);D=b;i.clearColor(P.r,P.g,P.b,D)};this.getClearColor=function(){return P};this.getClearAlpha=function(){return D};this.clear=function(a,b,c){var d=0;if(a===void 0||a)d=d|i.COLOR_BUFFER_BIT;if(b===void 0||b)d=d|i.DEPTH_BUFFER_BIT;if(c===void 0||c)d=d|i.STENCIL_BUFFER_BIT;i.clear(d)};this.clearTarget=function(a,b,c,d){this.setRenderTarget(a);this.clear(b,c,d)};this.addPostPlugin=function(a){a.init(this);this.renderPluginsPost.push(a)};this.addPrePlugin=function(a){a.init(this);this.renderPluginsPre.push(a)};
this.deallocateObject=function(a){if(a.__webglInit){a.__webglInit=false;delete a._modelViewMatrix;delete a._normalMatrix;delete a._normalMatrixArray;delete a._modelViewMatrixArray;delete a._objectMatrixArray;if(a instanceof THREE.Mesh)for(var b in a.geometry.geometryGroups){var c=a.geometry.geometryGroups[b];i.deleteBuffer(c.__webglVertexBuffer);i.deleteBuffer(c.__webglNormalBuffer);i.deleteBuffer(c.__webglTangentBuffer);i.deleteBuffer(c.__webglColorBuffer);i.deleteBuffer(c.__webglUVBuffer);i.deleteBuffer(c.__webglUV2Buffer);
i.deleteBuffer(c.__webglSkinVertexABuffer);i.deleteBuffer(c.__webglSkinVertexBBuffer);i.deleteBuffer(c.__webglSkinIndicesBuffer);i.deleteBuffer(c.__webglSkinWeightsBuffer);i.deleteBuffer(c.__webglFaceBuffer);i.deleteBuffer(c.__webglLineBuffer);var d=void 0,e=void 0;if(c.numMorphTargets){d=0;for(e=c.numMorphTargets;d<e;d++)i.deleteBuffer(c.__webglMorphTargetsBuffers[d])}if(c.numMorphNormals){d=0;for(e=c.numMorphNormals;d<e;d++)i.deleteBuffer(c.__webglMorphNormalsBuffers[d])}if(c.__webglCustomAttributesList){d=
void 0;for(d in c.__webglCustomAttributesList)i.deleteBuffer(c.__webglCustomAttributesList[d].buffer)}G.info.memory.geometries--}else if(a instanceof THREE.Ribbon){a=a.geometry;i.deleteBuffer(a.__webglVertexBuffer);i.deleteBuffer(a.__webglColorBuffer);G.info.memory.geometries--}else if(a instanceof THREE.Line){a=a.geometry;i.deleteBuffer(a.__webglVertexBuffer);i.deleteBuffer(a.__webglColorBuffer);G.info.memory.geometries--}else if(a instanceof THREE.ParticleSystem){a=a.geometry;i.deleteBuffer(a.__webglVertexBuffer);
i.deleteBuffer(a.__webglColorBuffer);G.info.memory.geometries--}}};this.deallocateTexture=function(a){if(a.__webglInit){a.__webglInit=false;i.deleteTexture(a.__webglTexture);G.info.memory.textures--}};this.deallocateRenderTarget=function(a){if(a&&a.__webglTexture){i.deleteTexture(a.__webglTexture);if(a instanceof THREE.WebGLRenderTargetCube)for(var b=0;b<6;b++){i.deleteFramebuffer(a.__webglFramebuffer[b]);i.deleteRenderbuffer(a.__webglRenderbuffer[b])}else{i.deleteFramebuffer(a.__webglFramebuffer);
i.deleteRenderbuffer(a.__webglRenderbuffer)}}};this.updateShadowMap=function(a,b){U=null;Y=F=Ka=Ma=Q=-1;Ta=true;O=ia=-1;this.shadowMapPlugin.update(a,b)};this.renderBufferImmediate=function(a,b,c){if(!a.__webglVertexBuffer)a.__webglVertexBuffer=i.createBuffer();if(!a.__webglNormalBuffer)a.__webglNormalBuffer=i.createBuffer();if(a.hasPos){i.bindBuffer(i.ARRAY_BUFFER,a.__webglVertexBuffer);i.bufferData(i.ARRAY_BUFFER,a.positionArray,i.DYNAMIC_DRAW);i.enableVertexAttribArray(b.attributes.position);i.vertexAttribPointer(b.attributes.position,
3,i.FLOAT,false,0,0)}if(a.hasNormal){i.bindBuffer(i.ARRAY_BUFFER,a.__webglNormalBuffer);if(c===THREE.FlatShading){var d,e,f,g,h,j,k,l,m,n,p=a.count*3;for(n=0;n<p;n=n+9){c=a.normalArray;d=c[n];e=c[n+1];f=c[n+2];g=c[n+3];j=c[n+4];l=c[n+5];h=c[n+6];k=c[n+7];m=c[n+8];d=(d+g+h)/3;e=(e+j+k)/3;f=(f+l+m)/3;c[n]=d;c[n+1]=e;c[n+2]=f;c[n+3]=d;c[n+4]=e;c[n+5]=f;c[n+6]=d;c[n+7]=e;c[n+8]=f}}i.bufferData(i.ARRAY_BUFFER,a.normalArray,i.DYNAMIC_DRAW);i.enableVertexAttribArray(b.attributes.normal);i.vertexAttribPointer(b.attributes.normal,
3,i.FLOAT,false,0,0)}i.drawArrays(i.TRIANGLES,0,a.count);a.count=0};this.renderBufferDirect=function(a,b,c,d,e,f){if(d.visible!==false){c=n(a,b,c,d,f);a=c.attributes;b=false;d=e.id*16777215+c.id*2+(d.wireframe?1:0);if(d!==F){F=d;b=true}if(f instanceof THREE.Mesh){f=e.offsets;d=0;for(c=f.length;d<c;++d){if(b){i.bindBuffer(i.ARRAY_BUFFER,e.vertexPositionBuffer);i.vertexAttribPointer(a.position,e.vertexPositionBuffer.itemSize,i.FLOAT,false,0,f[d].index*12);if(a.normal>=0&&e.vertexNormalBuffer){i.bindBuffer(i.ARRAY_BUFFER,
e.vertexNormalBuffer);i.vertexAttribPointer(a.normal,e.vertexNormalBuffer.itemSize,i.FLOAT,false,0,f[d].index*12)}if(a.uv>=0&&e.vertexUvBuffer)if(e.vertexUvBuffer){i.bindBuffer(i.ARRAY_BUFFER,e.vertexUvBuffer);i.vertexAttribPointer(a.uv,e.vertexUvBuffer.itemSize,i.FLOAT,false,0,f[d].index*8);i.enableVertexAttribArray(a.uv)}else i.disableVertexAttribArray(a.uv);if(a.color>=0&&e.vertexColorBuffer){i.bindBuffer(i.ARRAY_BUFFER,e.vertexColorBuffer);i.vertexAttribPointer(a.color,e.vertexColorBuffer.itemSize,
i.FLOAT,false,0,f[d].index*16)}i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.vertexIndexBuffer)}i.drawElements(i.TRIANGLES,f[d].count,i.UNSIGNED_SHORT,f[d].start*2);G.info.render.calls++;G.info.render.vertices=G.info.render.vertices+f[d].count;G.info.render.faces=G.info.render.faces+f[d].count/3}}}};this.renderBuffer=function(a,b,c,d,e,f){if(d.visible!==false){var g,h,c=n(a,b,c,d,f),b=c.attributes,a=false,c=e.id*16777215+c.id*2+(d.wireframe?1:0);if(c!==F){F=c;a=true}if(!d.morphTargets&&b.position>=0){if(a){i.bindBuffer(i.ARRAY_BUFFER,
e.__webglVertexBuffer);i.vertexAttribPointer(b.position,3,i.FLOAT,false,0,0)}}else if(f.morphTargetBase){c=d.program.attributes;if(f.morphTargetBase!==-1){i.bindBuffer(i.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[f.morphTargetBase]);i.vertexAttribPointer(c.position,3,i.FLOAT,false,0,0)}else if(c.position>=0){i.bindBuffer(i.ARRAY_BUFFER,e.__webglVertexBuffer);i.vertexAttribPointer(c.position,3,i.FLOAT,false,0,0)}if(f.morphTargetForcedOrder.length){g=0;var j=f.morphTargetForcedOrder;for(h=f.morphTargetInfluences;g<
d.numSupportedMorphTargets&&g<j.length;){i.bindBuffer(i.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[j[g]]);i.vertexAttribPointer(c["morphTarget"+g],3,i.FLOAT,false,0,0);if(d.morphNormals){i.bindBuffer(i.ARRAY_BUFFER,e.__webglMorphNormalsBuffers[j[g]]);i.vertexAttribPointer(c["morphNormal"+g],3,i.FLOAT,false,0,0)}f.__webglMorphTargetInfluences[g]=h[j[g]];g++}}else{var j=[],k=-1,l=0;h=f.morphTargetInfluences;var m,p=h.length;g=0;for(f.morphTargetBase!==-1&&(j[f.morphTargetBase]=true);g<d.numSupportedMorphTargets;){for(m=
0;m<p;m++)if(!j[m]&&h[m]>k){l=m;k=h[l]}i.bindBuffer(i.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[l]);i.vertexAttribPointer(c["morphTarget"+g],3,i.FLOAT,false,0,0);if(d.morphNormals){i.bindBuffer(i.ARRAY_BUFFER,e.__webglMorphNormalsBuffers[l]);i.vertexAttribPointer(c["morphNormal"+g],3,i.FLOAT,false,0,0)}f.__webglMorphTargetInfluences[g]=k;j[l]=1;k=-1;g++}}d.program.uniforms.morphTargetInfluences!==null&&i.uniform1fv(d.program.uniforms.morphTargetInfluences,f.__webglMorphTargetInfluences)}if(a){if(e.__webglCustomAttributesList){g=
0;for(h=e.__webglCustomAttributesList.length;g<h;g++){c=e.__webglCustomAttributesList[g];if(b[c.buffer.belongsToAttribute]>=0){i.bindBuffer(i.ARRAY_BUFFER,c.buffer);i.vertexAttribPointer(b[c.buffer.belongsToAttribute],c.size,i.FLOAT,false,0,0)}}}if(b.color>=0){i.bindBuffer(i.ARRAY_BUFFER,e.__webglColorBuffer);i.vertexAttribPointer(b.color,3,i.FLOAT,false,0,0)}if(b.normal>=0){i.bindBuffer(i.ARRAY_BUFFER,e.__webglNormalBuffer);i.vertexAttribPointer(b.normal,3,i.FLOAT,false,0,0)}if(b.tangent>=0){i.bindBuffer(i.ARRAY_BUFFER,
e.__webglTangentBuffer);i.vertexAttribPointer(b.tangent,4,i.FLOAT,false,0,0)}if(b.uv>=0)if(e.__webglUVBuffer){i.bindBuffer(i.ARRAY_BUFFER,e.__webglUVBuffer);i.vertexAttribPointer(b.uv,2,i.FLOAT,false,0,0);i.enableVertexAttribArray(b.uv)}else i.disableVertexAttribArray(b.uv);if(b.uv2>=0)if(e.__webglUV2Buffer){i.bindBuffer(i.ARRAY_BUFFER,e.__webglUV2Buffer);i.vertexAttribPointer(b.uv2,2,i.FLOAT,false,0,0);i.enableVertexAttribArray(b.uv2)}else i.disableVertexAttribArray(b.uv2);if(d.skinning&&b.skinVertexA>=
0&&b.skinVertexB>=0&&b.skinIndex>=0&&b.skinWeight>=0){i.bindBuffer(i.ARRAY_BUFFER,e.__webglSkinVertexABuffer);i.vertexAttribPointer(b.skinVertexA,4,i.FLOAT,false,0,0);i.bindBuffer(i.ARRAY_BUFFER,e.__webglSkinVertexBBuffer);i.vertexAttribPointer(b.skinVertexB,4,i.FLOAT,false,0,0);i.bindBuffer(i.ARRAY_BUFFER,e.__webglSkinIndicesBuffer);i.vertexAttribPointer(b.skinIndex,4,i.FLOAT,false,0,0);i.bindBuffer(i.ARRAY_BUFFER,e.__webglSkinWeightsBuffer);i.vertexAttribPointer(b.skinWeight,4,i.FLOAT,false,0,0)}}if(f instanceof
THREE.Mesh){if(d.wireframe){d=d.wireframeLinewidth;if(d!==Na){i.lineWidth(d);Na=d}a&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.__webglLineBuffer);i.drawElements(i.LINES,e.__webglLineCount,i.UNSIGNED_SHORT,0)}else{a&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.__webglFaceBuffer);i.drawElements(i.TRIANGLES,e.__webglFaceCount,i.UNSIGNED_SHORT,0)}G.info.render.calls++;G.info.render.vertices=G.info.render.vertices+e.__webglFaceCount;G.info.render.faces=G.info.render.faces+e.__webglFaceCount/3}else if(f instanceof
THREE.Line){f=f.type===THREE.LineStrip?i.LINE_STRIP:i.LINES;d=d.linewidth;if(d!==Na){i.lineWidth(d);Na=d}i.drawArrays(f,0,e.__webglLineCount);G.info.render.calls++}else if(f instanceof THREE.ParticleSystem){i.drawArrays(i.POINTS,0,e.__webglParticleCount);G.info.render.calls++;G.info.render.points=G.info.render.points+e.__webglParticleCount}else if(f instanceof THREE.Ribbon){i.drawArrays(i.TRIANGLE_STRIP,0,e.__webglVertexCount);G.info.render.calls++}}};this.render=function(a,b,c,d){var e,f,k,m,n=a.__lights,
p=a.fog;Y=-1;Ta=true;if(b.parent===void 0){console.warn("DEPRECATED: Camera hasn't been added to a Scene. Adding it...");a.add(b)}this.autoUpdateScene&&a.updateMatrixWorld();if(!b._viewMatrixArray)b._viewMatrixArray=new Float32Array(16);if(!b._projectionMatrixArray)b._projectionMatrixArray=new Float32Array(16);b.matrixWorldInverse.getInverse(b.matrixWorld);b.matrixWorldInverse.flattenToArray(b._viewMatrixArray);b.projectionMatrix.flattenToArray(b._projectionMatrixArray);Ba.multiply(b.projectionMatrix,
b.matrixWorldInverse);Wa.setFromMatrix(Ba);this.autoUpdateObjects&&this.initWebGLObjects(a);h(this.renderPluginsPre,a,b);G.info.render.calls=0;G.info.render.vertices=0;G.info.render.faces=0;G.info.render.points=0;this.setRenderTarget(c);(this.autoClear||d)&&this.clear(this.autoClearColor,this.autoClearDepth,this.autoClearStencil);m=a.__webglObjects;d=0;for(e=m.length;d<e;d++){f=m[d];k=f.object;f.render=false;if(k.visible&&(!(k instanceof THREE.Mesh||k instanceof THREE.ParticleSystem)||!k.frustumCulled||
Wa.contains(k))){r(k,b);var o=f,q=o.object,s=o.buffer,t=void 0,t=t=void 0,t=q.material;if(t instanceof THREE.MeshFaceMaterial){t=s.materialIndex;if(t>=0){t=q.geometry.materials[t];if(t.transparent){o.transparent=t;o.opaque=null}else{o.opaque=t;o.transparent=null}}}else if(t)if(t.transparent){o.transparent=t;o.opaque=null}else{o.opaque=t;o.transparent=null}f.render=true;if(this.sortObjects)if(k.renderDepth)f.z=k.renderDepth;else{$a.copy(k.matrixWorld.getPosition());Ba.multiplyVector3($a);f.z=$a.z}}}this.sortObjects&&
m.sort(g);m=a.__webglObjectsImmediate;d=0;for(e=m.length;d<e;d++){f=m[d];k=f.object;if(k.visible){r(k,b);k=f.object.material;if(k.transparent){f.transparent=k;f.opaque=null}else{f.opaque=k;f.transparent=null}}}if(a.overrideMaterial){d=a.overrideMaterial;this.setBlending(d.blending,d.blendEquation,d.blendSrc,d.blendDst);this.setDepthTest(d.depthTest);this.setDepthWrite(d.depthWrite);u(d.polygonOffset,d.polygonOffsetFactor,d.polygonOffsetUnits);j(a.__webglObjects,false,"",b,n,p,true,d);l(a.__webglObjectsImmediate,
"",b,n,p,false,d)}else{this.setBlending(THREE.NormalBlending);j(a.__webglObjects,true,"opaque",b,n,p,false);l(a.__webglObjectsImmediate,"opaque",b,n,p,false);j(a.__webglObjects,false,"transparent",b,n,p,true);l(a.__webglObjectsImmediate,"transparent",b,n,p,true)}h(this.renderPluginsPost,a,b);if(c&&c.generateMipmaps&&c.minFilter!==THREE.NearestFilter&&c.minFilter!==THREE.LinearFilter)if(c instanceof THREE.WebGLRenderTargetCube){i.bindTexture(i.TEXTURE_CUBE_MAP,c.__webglTexture);i.generateMipmap(i.TEXTURE_CUBE_MAP);
i.bindTexture(i.TEXTURE_CUBE_MAP,null)}else{i.bindTexture(i.TEXTURE_2D,c.__webglTexture);i.generateMipmap(i.TEXTURE_2D);i.bindTexture(i.TEXTURE_2D,null)}this.setDepthTest(true);this.setDepthWrite(true)};this.renderImmediateObject=function(a,b,c,d,e){var f=n(a,b,c,d,e);F=-1;G.setObjectFaces(e);e.immediateRenderCallback?e.immediateRenderCallback(f,i,Wa):e.render(function(a){G.renderBufferImmediate(a,f,d.shading)})};this.initWebGLObjects=function(a){if(!a.__webglObjects){a.__webglObjects=[];a.__webglObjectsImmediate=
[];a.__webglSprites=[];a.__webglFlares=[]}for(;a.__objectsAdded.length;){var g=a.__objectsAdded[0],h=a,j=void 0,l=void 0,n=void 0;if(!g.__webglInit){g.__webglInit=true;g._modelViewMatrix=new THREE.Matrix4;g._normalMatrix=new THREE.Matrix3;if(g instanceof THREE.Mesh){l=g.geometry;if(l instanceof THREE.Geometry){if(l.geometryGroups===void 0){var r=l,s=void 0,t=void 0,u=void 0,v=void 0,w=void 0,z=void 0,y=void 0,A={},C=r.morphTargets.length,D=r.morphNormals.length;r.geometryGroups={};s=0;for(t=r.faces.length;s<
t;s++){u=r.faces[s];v=u.materialIndex;z=v!==void 0?v:-1;A[z]===void 0&&(A[z]={hash:z,counter:0});y=A[z].hash+"_"+A[z].counter;r.geometryGroups[y]===void 0&&(r.geometryGroups[y]={faces3:[],faces4:[],materialIndex:v,vertices:0,numMorphTargets:C,numMorphNormals:D});w=u instanceof THREE.Face3?3:4;if(r.geometryGroups[y].vertices+w>65535){A[z].counter=A[z].counter+1;y=A[z].hash+"_"+A[z].counter;r.geometryGroups[y]===void 0&&(r.geometryGroups[y]={faces3:[],faces4:[],materialIndex:v,vertices:0,numMorphTargets:C,
numMorphNormals:D})}u instanceof THREE.Face3?r.geometryGroups[y].faces3.push(s):r.geometryGroups[y].faces4.push(s);r.geometryGroups[y].vertices=r.geometryGroups[y].vertices+w}r.geometryGroupsList=[];var E=void 0;for(E in r.geometryGroups){r.geometryGroups[E].id=fa++;r.geometryGroupsList.push(r.geometryGroups[E])}}for(j in l.geometryGroups){n=l.geometryGroups[j];if(!n.__webglVertexBuffer){var F=n;F.__webglVertexBuffer=i.createBuffer();F.__webglNormalBuffer=i.createBuffer();F.__webglTangentBuffer=i.createBuffer();
F.__webglColorBuffer=i.createBuffer();F.__webglUVBuffer=i.createBuffer();F.__webglUV2Buffer=i.createBuffer();F.__webglSkinVertexABuffer=i.createBuffer();F.__webglSkinVertexBBuffer=i.createBuffer();F.__webglSkinIndicesBuffer=i.createBuffer();F.__webglSkinWeightsBuffer=i.createBuffer();F.__webglFaceBuffer=i.createBuffer();F.__webglLineBuffer=i.createBuffer();var H=void 0,K=void 0;if(F.numMorphTargets){F.__webglMorphTargetsBuffers=[];H=0;for(K=F.numMorphTargets;H<K;H++)F.__webglMorphTargetsBuffers.push(i.createBuffer())}if(F.numMorphNormals){F.__webglMorphNormalsBuffers=
[];H=0;for(K=F.numMorphNormals;H<K;H++)F.__webglMorphNormalsBuffers.push(i.createBuffer())}G.info.memory.geometries++;var Q=n,J=g,O=J.geometry,M=Q.faces3,$=Q.faces4,P=M.length*3+$.length*4,Z=M.length*1+$.length*2,Y=M.length*3+$.length*4,R=c(J,Q),T=e(R),ea=d(R),ia=R.vertexColors?R.vertexColors:false;Q.__vertexArray=new Float32Array(P*3);if(ea)Q.__normalArray=new Float32Array(P*3);if(O.hasTangents)Q.__tangentArray=new Float32Array(P*4);if(ia)Q.__colorArray=new Float32Array(P*3);if(T){if(O.faceUvs.length>
0||O.faceVertexUvs.length>0)Q.__uvArray=new Float32Array(P*2);if(O.faceUvs.length>1||O.faceVertexUvs.length>1)Q.__uv2Array=new Float32Array(P*2)}if(J.geometry.skinWeights.length&&J.geometry.skinIndices.length){Q.__skinVertexAArray=new Float32Array(P*4);Q.__skinVertexBArray=new Float32Array(P*4);Q.__skinIndexArray=new Float32Array(P*4);Q.__skinWeightArray=new Float32Array(P*4)}Q.__faceArray=new Uint16Array(Z*3);Q.__lineArray=new Uint16Array(Y*2);var U=void 0,ha=void 0;if(Q.numMorphTargets){Q.__morphTargetsArrays=
[];U=0;for(ha=Q.numMorphTargets;U<ha;U++)Q.__morphTargetsArrays.push(new Float32Array(P*3))}if(Q.numMorphNormals){Q.__morphNormalsArrays=[];U=0;for(ha=Q.numMorphNormals;U<ha;U++)Q.__morphNormalsArrays.push(new Float32Array(P*3))}Q.__webglFaceCount=Z*3;Q.__webglLineCount=Y*2;if(R.attributes){if(Q.__webglCustomAttributesList===void 0)Q.__webglCustomAttributesList=[];var Ra=void 0;for(Ra in R.attributes){var Ma=R.attributes[Ra],aa={},Ka;for(Ka in Ma)aa[Ka]=Ma[Ka];if(!aa.__webglInitialized||aa.createUniqueBuffers){aa.__webglInitialized=
true;var La=1;aa.type==="v2"?La=2:aa.type==="v3"?La=3:aa.type==="v4"?La=4:aa.type==="c"&&(La=3);aa.size=La;aa.array=new Float32Array(P*La);aa.buffer=i.createBuffer();aa.buffer.belongsToAttribute=Ra;Ma.needsUpdate=true;aa.__original=Ma}Q.__webglCustomAttributesList.push(aa)}}Q.__inittedArrays=true;l.verticesNeedUpdate=true;l.morphTargetsNeedUpdate=true;l.elementsNeedUpdate=true;l.uvsNeedUpdate=true;l.normalsNeedUpdate=true;l.tangetsNeedUpdate=true;l.colorsNeedUpdate=true}}}}else if(g instanceof THREE.Ribbon){l=
g.geometry;if(!l.__webglVertexBuffer){var Sa=l;Sa.__webglVertexBuffer=i.createBuffer();Sa.__webglColorBuffer=i.createBuffer();G.info.memory.geometries++;var oa=l,xa=oa.vertices.length;oa.__vertexArray=new Float32Array(xa*3);oa.__colorArray=new Float32Array(xa*3);oa.__webglVertexCount=xa;l.verticesNeedUpdate=true;l.colorsNeedUpdate=true}}else if(g instanceof THREE.Line){l=g.geometry;if(!l.__webglVertexBuffer){var Ba=l;Ba.__webglVertexBuffer=i.createBuffer();Ba.__webglColorBuffer=i.createBuffer();G.info.memory.geometries++;
var Na=l,Ta=g,Wa=Na.vertices.length;Na.__vertexArray=new Float32Array(Wa*3);Na.__colorArray=new Float32Array(Wa*3);Na.__webglLineCount=Wa;b(Na,Ta);l.verticesNeedUpdate=true;l.colorsNeedUpdate=true}}else if(g instanceof THREE.ParticleSystem){l=g.geometry;if(!l.__webglVertexBuffer){var $a=l;$a.__webglVertexBuffer=i.createBuffer();$a.__webglColorBuffer=i.createBuffer();G.info.geometries++;var Qa=l,Kb=g,lb=Qa.vertices.length;Qa.__vertexArray=new Float32Array(lb*3);Qa.__colorArray=new Float32Array(lb*
3);Qa.__sortArray=[];Qa.__webglParticleCount=lb;b(Qa,Kb);l.verticesNeedUpdate=true;l.colorsNeedUpdate=true}}}if(!g.__webglActive){if(g instanceof THREE.Mesh){l=g.geometry;if(l instanceof THREE.BufferGeometry)k(h.__webglObjects,l,g);else for(j in l.geometryGroups){n=l.geometryGroups[j];k(h.__webglObjects,n,g)}}else if(g instanceof THREE.Ribbon||g instanceof THREE.Line||g instanceof THREE.ParticleSystem){l=g.geometry;k(h.__webglObjects,l,g)}else g instanceof THREE.ImmediateRenderObject||g.immediateRenderCallback?
h.__webglObjectsImmediate.push({object:g,opaque:null,transparent:null}):g instanceof THREE.Sprite?h.__webglSprites.push(g):g instanceof THREE.LensFlare&&h.__webglFlares.push(g);g.__webglActive=true}a.__objectsAdded.splice(0,1)}for(;a.__objectsRemoved.length;){var bb=a.__objectsRemoved[0],gb=a;bb instanceof THREE.Mesh||bb instanceof THREE.ParticleSystem||bb instanceof THREE.Ribbon||bb instanceof THREE.Line?o(gb.__webglObjects,bb):bb instanceof THREE.Sprite?q(gb.__webglSprites,bb):bb instanceof THREE.LensFlare?
q(gb.__webglFlares,bb):(bb instanceof THREE.ImmediateRenderObject||bb.immediateRenderCallback)&&o(gb.__webglObjectsImmediate,bb);bb.__webglActive=false;a.__objectsRemoved.splice(0,1)}for(var ib=0,Lb=a.__webglObjects.length;ib<Lb;ib++){var jb=a.__webglObjects[ib].object,ga=jb.geometry,hb=void 0,ic=void 0,Ua=void 0;if(jb instanceof THREE.Mesh)if(ga instanceof THREE.BufferGeometry){ga.verticesNeedUpdate=false;ga.elementsNeedUpdate=false;ga.uvsNeedUpdate=false;ga.normalsNeedUpdate=false;ga.colorsNeedUpdate=
false}else{for(var Cb=0,nd=ga.geometryGroupsList.length;Cb<nd;Cb++){hb=ga.geometryGroupsList[Cb];Ua=c(jb,hb);ic=Ua.attributes&&p(Ua);if(ga.verticesNeedUpdate||ga.morphTargetsNeedUpdate||ga.elementsNeedUpdate||ga.uvsNeedUpdate||ga.normalsNeedUpdate||ga.colorsNeedUpdate||ga.tangetsNeedUpdate||ic){var ca=hb,od=jb,Xa=i.DYNAMIC_DRAW,pd=!ga.dynamic,bc=Ua;if(ca.__inittedArrays){var cd=d(bc),Tc=bc.vertexColors?bc.vertexColors:false,dd=e(bc),Ec=cd===THREE.SmoothShading,I=void 0,S=void 0,fb=void 0,N=void 0,
jc=void 0,Ob=void 0,kb=void 0,Fc=void 0,Fb=void 0,kc=void 0,lc=void 0,V=void 0,W=void 0,X=void 0,ma=void 0,mb=void 0,nb=void 0,ob=void 0,qc=void 0,pb=void 0,qb=void 0,rb=void 0,rc=void 0,sb=void 0,tb=void 0,ub=void 0,sc=void 0,vb=void 0,wb=void 0,xb=void 0,tc=void 0,yb=void 0,zb=void 0,Ab=void 0,uc=void 0,Pb=void 0,Qb=void 0,Rb=void 0,Gc=void 0,Sb=void 0,Tb=void 0,Ub=void 0,Hc=void 0,ja=void 0,ed=void 0,Vb=void 0,mc=void 0,nc=void 0,Ea=void 0,fd=void 0,Ca=void 0,Da=void 0,Wb=void 0,Gb=void 0,wa=0,
Aa=0,Hb=0,Ib=0,cb=0,Ja=0,na=0,Oa=0,ya=0,L=0,ba=0,B=0,Ya=void 0,Fa=ca.__vertexArray,vc=ca.__uvArray,wc=ca.__uv2Array,db=ca.__normalArray,qa=ca.__tangentArray,Ga=ca.__colorArray,ra=ca.__skinVertexAArray,sa=ca.__skinVertexBArray,ta=ca.__skinIndexArray,ua=ca.__skinWeightArray,Uc=ca.__morphTargetsArrays,Vc=ca.__morphNormalsArrays,Wc=ca.__webglCustomAttributesList,x=void 0,Bb=ca.__faceArray,Za=ca.__lineArray,Pa=od.geometry,qd=Pa.elementsNeedUpdate,gd=Pa.uvsNeedUpdate,rd=Pa.normalsNeedUpdate,sd=Pa.tangetsNeedUpdate,
td=Pa.colorsNeedUpdate,ud=Pa.morphTargetsNeedUpdate,cc=Pa.vertices,ka=ca.faces3,la=ca.faces4,za=Pa.faces,Xc=Pa.faceVertexUvs[0],Yc=Pa.faceVertexUvs[1],dc=Pa.skinVerticesA,ec=Pa.skinVerticesB,fc=Pa.skinIndices,Xb=Pa.skinWeights,Yb=Pa.morphTargets,Ic=Pa.morphNormals;if(Pa.verticesNeedUpdate){I=0;for(S=ka.length;I<S;I++){N=za[ka[I]];V=cc[N.a];W=cc[N.b];X=cc[N.c];Fa[Aa]=V.x;Fa[Aa+1]=V.y;Fa[Aa+2]=V.z;Fa[Aa+3]=W.x;Fa[Aa+4]=W.y;Fa[Aa+5]=W.z;Fa[Aa+6]=X.x;Fa[Aa+7]=X.y;Fa[Aa+8]=X.z;Aa=Aa+9}I=0;for(S=la.length;I<
S;I++){N=za[la[I]];V=cc[N.a];W=cc[N.b];X=cc[N.c];ma=cc[N.d];Fa[Aa]=V.x;Fa[Aa+1]=V.y;Fa[Aa+2]=V.z;Fa[Aa+3]=W.x;Fa[Aa+4]=W.y;Fa[Aa+5]=W.z;Fa[Aa+6]=X.x;Fa[Aa+7]=X.y;Fa[Aa+8]=X.z;Fa[Aa+9]=ma.x;Fa[Aa+10]=ma.y;Fa[Aa+11]=ma.z;Aa=Aa+12}i.bindBuffer(i.ARRAY_BUFFER,ca.__webglVertexBuffer);i.bufferData(i.ARRAY_BUFFER,Fa,Xa)}if(ud){Ea=0;for(fd=Yb.length;Ea<fd;Ea++){I=ba=0;for(S=ka.length;I<S;I++){Wb=ka[I];N=za[Wb];V=Yb[Ea].vertices[N.a];W=Yb[Ea].vertices[N.b];X=Yb[Ea].vertices[N.c];Ca=Uc[Ea];Ca[ba]=V.x;Ca[ba+
1]=V.y;Ca[ba+2]=V.z;Ca[ba+3]=W.x;Ca[ba+4]=W.y;Ca[ba+5]=W.z;Ca[ba+6]=X.x;Ca[ba+7]=X.y;Ca[ba+8]=X.z;if(bc.morphNormals){if(Ec){Gb=Ic[Ea].vertexNormals[Wb];pb=Gb.a;qb=Gb.b;rb=Gb.c}else rb=qb=pb=Ic[Ea].faceNormals[Wb];Da=Vc[Ea];Da[ba]=pb.x;Da[ba+1]=pb.y;Da[ba+2]=pb.z;Da[ba+3]=qb.x;Da[ba+4]=qb.y;Da[ba+5]=qb.z;Da[ba+6]=rb.x;Da[ba+7]=rb.y;Da[ba+8]=rb.z}ba=ba+9}I=0;for(S=la.length;I<S;I++){Wb=la[I];N=za[Wb];V=Yb[Ea].vertices[N.a];W=Yb[Ea].vertices[N.b];X=Yb[Ea].vertices[N.c];ma=Yb[Ea].vertices[N.d];Ca=Uc[Ea];
Ca[ba]=V.x;Ca[ba+1]=V.y;Ca[ba+2]=V.z;Ca[ba+3]=W.x;Ca[ba+4]=W.y;Ca[ba+5]=W.z;Ca[ba+6]=X.x;Ca[ba+7]=X.y;Ca[ba+8]=X.z;Ca[ba+9]=ma.x;Ca[ba+10]=ma.y;Ca[ba+11]=ma.z;if(bc.morphNormals){if(Ec){Gb=Ic[Ea].vertexNormals[Wb];pb=Gb.a;qb=Gb.b;rb=Gb.c;rc=Gb.d}else rc=rb=qb=pb=Ic[Ea].faceNormals[Wb];Da=Vc[Ea];Da[ba]=pb.x;Da[ba+1]=pb.y;Da[ba+2]=pb.z;Da[ba+3]=qb.x;Da[ba+4]=qb.y;Da[ba+5]=qb.z;Da[ba+6]=rb.x;Da[ba+7]=rb.y;Da[ba+8]=rb.z;Da[ba+9]=rc.x;Da[ba+10]=rc.y;Da[ba+11]=rc.z}ba=ba+12}i.bindBuffer(i.ARRAY_BUFFER,
ca.__webglMorphTargetsBuffers[Ea]);i.bufferData(i.ARRAY_BUFFER,Uc[Ea],Xa);if(bc.morphNormals){i.bindBuffer(i.ARRAY_BUFFER,ca.__webglMorphNormalsBuffers[Ea]);i.bufferData(i.ARRAY_BUFFER,Vc[Ea],Xa)}}}if(Xb.length){I=0;for(S=ka.length;I<S;I++){N=za[ka[I]];vb=Xb[N.a];wb=Xb[N.b];xb=Xb[N.c];ua[L]=vb.x;ua[L+1]=vb.y;ua[L+2]=vb.z;ua[L+3]=vb.w;ua[L+4]=wb.x;ua[L+5]=wb.y;ua[L+6]=wb.z;ua[L+7]=wb.w;ua[L+8]=xb.x;ua[L+9]=xb.y;ua[L+10]=xb.z;ua[L+11]=xb.w;yb=fc[N.a];zb=fc[N.b];Ab=fc[N.c];ta[L]=yb.x;ta[L+1]=yb.y;ta[L+
2]=yb.z;ta[L+3]=yb.w;ta[L+4]=zb.x;ta[L+5]=zb.y;ta[L+6]=zb.z;ta[L+7]=zb.w;ta[L+8]=Ab.x;ta[L+9]=Ab.y;ta[L+10]=Ab.z;ta[L+11]=Ab.w;Pb=dc[N.a];Qb=dc[N.b];Rb=dc[N.c];ra[L]=Pb.x;ra[L+1]=Pb.y;ra[L+2]=Pb.z;ra[L+3]=1;ra[L+4]=Qb.x;ra[L+5]=Qb.y;ra[L+6]=Qb.z;ra[L+7]=1;ra[L+8]=Rb.x;ra[L+9]=Rb.y;ra[L+10]=Rb.z;ra[L+11]=1;Sb=ec[N.a];Tb=ec[N.b];Ub=ec[N.c];sa[L]=Sb.x;sa[L+1]=Sb.y;sa[L+2]=Sb.z;sa[L+3]=1;sa[L+4]=Tb.x;sa[L+5]=Tb.y;sa[L+6]=Tb.z;sa[L+7]=1;sa[L+8]=Ub.x;sa[L+9]=Ub.y;sa[L+10]=Ub.z;sa[L+11]=1;L=L+12}I=0;for(S=
la.length;I<S;I++){N=za[la[I]];vb=Xb[N.a];wb=Xb[N.b];xb=Xb[N.c];tc=Xb[N.d];ua[L]=vb.x;ua[L+1]=vb.y;ua[L+2]=vb.z;ua[L+3]=vb.w;ua[L+4]=wb.x;ua[L+5]=wb.y;ua[L+6]=wb.z;ua[L+7]=wb.w;ua[L+8]=xb.x;ua[L+9]=xb.y;ua[L+10]=xb.z;ua[L+11]=xb.w;ua[L+12]=tc.x;ua[L+13]=tc.y;ua[L+14]=tc.z;ua[L+15]=tc.w;yb=fc[N.a];zb=fc[N.b];Ab=fc[N.c];uc=fc[N.d];ta[L]=yb.x;ta[L+1]=yb.y;ta[L+2]=yb.z;ta[L+3]=yb.w;ta[L+4]=zb.x;ta[L+5]=zb.y;ta[L+6]=zb.z;ta[L+7]=zb.w;ta[L+8]=Ab.x;ta[L+9]=Ab.y;ta[L+10]=Ab.z;ta[L+11]=Ab.w;ta[L+12]=uc.x;
ta[L+13]=uc.y;ta[L+14]=uc.z;ta[L+15]=uc.w;Pb=dc[N.a];Qb=dc[N.b];Rb=dc[N.c];Gc=dc[N.d];ra[L]=Pb.x;ra[L+1]=Pb.y;ra[L+2]=Pb.z;ra[L+3]=1;ra[L+4]=Qb.x;ra[L+5]=Qb.y;ra[L+6]=Qb.z;ra[L+7]=1;ra[L+8]=Rb.x;ra[L+9]=Rb.y;ra[L+10]=Rb.z;ra[L+11]=1;ra[L+12]=Gc.x;ra[L+13]=Gc.y;ra[L+14]=Gc.z;ra[L+15]=1;Sb=ec[N.a];Tb=ec[N.b];Ub=ec[N.c];Hc=ec[N.d];sa[L]=Sb.x;sa[L+1]=Sb.y;sa[L+2]=Sb.z;sa[L+3]=1;sa[L+4]=Tb.x;sa[L+5]=Tb.y;sa[L+6]=Tb.z;sa[L+7]=1;sa[L+8]=Ub.x;sa[L+9]=Ub.y;sa[L+10]=Ub.z;sa[L+11]=1;sa[L+12]=Hc.x;sa[L+13]=Hc.y;
sa[L+14]=Hc.z;sa[L+15]=1;L=L+16}if(L>0){i.bindBuffer(i.ARRAY_BUFFER,ca.__webglSkinVertexABuffer);i.bufferData(i.ARRAY_BUFFER,ra,Xa);i.bindBuffer(i.ARRAY_BUFFER,ca.__webglSkinVertexBBuffer);i.bufferData(i.ARRAY_BUFFER,sa,Xa);i.bindBuffer(i.ARRAY_BUFFER,ca.__webglSkinIndicesBuffer);i.bufferData(i.ARRAY_BUFFER,ta,Xa);i.bindBuffer(i.ARRAY_BUFFER,ca.__webglSkinWeightsBuffer);i.bufferData(i.ARRAY_BUFFER,ua,Xa)}}if(td&&Tc){I=0;for(S=ka.length;I<S;I++){N=za[ka[I]];kb=N.vertexColors;Fc=N.color;if(kb.length===
3&&Tc===THREE.VertexColors){sb=kb[0];tb=kb[1];ub=kb[2]}else ub=tb=sb=Fc;Ga[ya]=sb.r;Ga[ya+1]=sb.g;Ga[ya+2]=sb.b;Ga[ya+3]=tb.r;Ga[ya+4]=tb.g;Ga[ya+5]=tb.b;Ga[ya+6]=ub.r;Ga[ya+7]=ub.g;Ga[ya+8]=ub.b;ya=ya+9}I=0;for(S=la.length;I<S;I++){N=za[la[I]];kb=N.vertexColors;Fc=N.color;if(kb.length===4&&Tc===THREE.VertexColors){sb=kb[0];tb=kb[1];ub=kb[2];sc=kb[3]}else sc=ub=tb=sb=Fc;Ga[ya]=sb.r;Ga[ya+1]=sb.g;Ga[ya+2]=sb.b;Ga[ya+3]=tb.r;Ga[ya+4]=tb.g;Ga[ya+5]=tb.b;Ga[ya+6]=ub.r;Ga[ya+7]=ub.g;Ga[ya+8]=ub.b;Ga[ya+
9]=sc.r;Ga[ya+10]=sc.g;Ga[ya+11]=sc.b;ya=ya+12}if(ya>0){i.bindBuffer(i.ARRAY_BUFFER,ca.__webglColorBuffer);i.bufferData(i.ARRAY_BUFFER,Ga,Xa)}}if(sd&&Pa.hasTangents){I=0;for(S=ka.length;I<S;I++){N=za[ka[I]];Fb=N.vertexTangents;mb=Fb[0];nb=Fb[1];ob=Fb[2];qa[na]=mb.x;qa[na+1]=mb.y;qa[na+2]=mb.z;qa[na+3]=mb.w;qa[na+4]=nb.x;qa[na+5]=nb.y;qa[na+6]=nb.z;qa[na+7]=nb.w;qa[na+8]=ob.x;qa[na+9]=ob.y;qa[na+10]=ob.z;qa[na+11]=ob.w;na=na+12}I=0;for(S=la.length;I<S;I++){N=za[la[I]];Fb=N.vertexTangents;mb=Fb[0];
nb=Fb[1];ob=Fb[2];qc=Fb[3];qa[na]=mb.x;qa[na+1]=mb.y;qa[na+2]=mb.z;qa[na+3]=mb.w;qa[na+4]=nb.x;qa[na+5]=nb.y;qa[na+6]=nb.z;qa[na+7]=nb.w;qa[na+8]=ob.x;qa[na+9]=ob.y;qa[na+10]=ob.z;qa[na+11]=ob.w;qa[na+12]=qc.x;qa[na+13]=qc.y;qa[na+14]=qc.z;qa[na+15]=qc.w;na=na+16}i.bindBuffer(i.ARRAY_BUFFER,ca.__webglTangentBuffer);i.bufferData(i.ARRAY_BUFFER,qa,Xa)}if(rd&&cd){I=0;for(S=ka.length;I<S;I++){N=za[ka[I]];jc=N.vertexNormals;Ob=N.normal;if(jc.length===3&&Ec)for(ja=0;ja<3;ja++){Vb=jc[ja];db[Ja]=Vb.x;db[Ja+
1]=Vb.y;db[Ja+2]=Vb.z;Ja=Ja+3}else for(ja=0;ja<3;ja++){db[Ja]=Ob.x;db[Ja+1]=Ob.y;db[Ja+2]=Ob.z;Ja=Ja+3}}I=0;for(S=la.length;I<S;I++){N=za[la[I]];jc=N.vertexNormals;Ob=N.normal;if(jc.length===4&&Ec)for(ja=0;ja<4;ja++){Vb=jc[ja];db[Ja]=Vb.x;db[Ja+1]=Vb.y;db[Ja+2]=Vb.z;Ja=Ja+3}else for(ja=0;ja<4;ja++){db[Ja]=Ob.x;db[Ja+1]=Ob.y;db[Ja+2]=Ob.z;Ja=Ja+3}}i.bindBuffer(i.ARRAY_BUFFER,ca.__webglNormalBuffer);i.bufferData(i.ARRAY_BUFFER,db,Xa)}if(gd&&Xc&&dd){I=0;for(S=ka.length;I<S;I++){fb=ka[I];N=za[fb];kc=
Xc[fb];if(kc!==void 0)for(ja=0;ja<3;ja++){mc=kc[ja];vc[Hb]=mc.u;vc[Hb+1]=mc.v;Hb=Hb+2}}I=0;for(S=la.length;I<S;I++){fb=la[I];N=za[fb];kc=Xc[fb];if(kc!==void 0)for(ja=0;ja<4;ja++){mc=kc[ja];vc[Hb]=mc.u;vc[Hb+1]=mc.v;Hb=Hb+2}}if(Hb>0){i.bindBuffer(i.ARRAY_BUFFER,ca.__webglUVBuffer);i.bufferData(i.ARRAY_BUFFER,vc,Xa)}}if(gd&&Yc&&dd){I=0;for(S=ka.length;I<S;I++){fb=ka[I];N=za[fb];lc=Yc[fb];if(lc!==void 0)for(ja=0;ja<3;ja++){nc=lc[ja];wc[Ib]=nc.u;wc[Ib+1]=nc.v;Ib=Ib+2}}I=0;for(S=la.length;I<S;I++){fb=
la[I];N=za[fb];lc=Yc[fb];if(lc!==void 0)for(ja=0;ja<4;ja++){nc=lc[ja];wc[Ib]=nc.u;wc[Ib+1]=nc.v;Ib=Ib+2}}if(Ib>0){i.bindBuffer(i.ARRAY_BUFFER,ca.__webglUV2Buffer);i.bufferData(i.ARRAY_BUFFER,wc,Xa)}}if(qd){I=0;for(S=ka.length;I<S;I++){N=za[ka[I]];Bb[cb]=wa;Bb[cb+1]=wa+1;Bb[cb+2]=wa+2;cb=cb+3;Za[Oa]=wa;Za[Oa+1]=wa+1;Za[Oa+2]=wa;Za[Oa+3]=wa+2;Za[Oa+4]=wa+1;Za[Oa+5]=wa+2;Oa=Oa+6;wa=wa+3}I=0;for(S=la.length;I<S;I++){N=za[la[I]];Bb[cb]=wa;Bb[cb+1]=wa+1;Bb[cb+2]=wa+3;Bb[cb+3]=wa+1;Bb[cb+4]=wa+2;Bb[cb+5]=
wa+3;cb=cb+6;Za[Oa]=wa;Za[Oa+1]=wa+1;Za[Oa+2]=wa;Za[Oa+3]=wa+3;Za[Oa+4]=wa+1;Za[Oa+5]=wa+2;Za[Oa+6]=wa+2;Za[Oa+7]=wa+3;Oa=Oa+8;wa=wa+4}i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,ca.__webglFaceBuffer);i.bufferData(i.ELEMENT_ARRAY_BUFFER,Bb,Xa);i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,ca.__webglLineBuffer);i.bufferData(i.ELEMENT_ARRAY_BUFFER,Za,Xa)}if(Wc){ja=0;for(ed=Wc.length;ja<ed;ja++){x=Wc[ja];if(x.__original.needsUpdate){B=0;if(x.size===1)if(x.boundTo===void 0||x.boundTo==="vertices"){I=0;for(S=ka.length;I<
S;I++){N=za[ka[I]];x.array[B]=x.value[N.a];x.array[B+1]=x.value[N.b];x.array[B+2]=x.value[N.c];B=B+3}I=0;for(S=la.length;I<S;I++){N=za[la[I]];x.array[B]=x.value[N.a];x.array[B+1]=x.value[N.b];x.array[B+2]=x.value[N.c];x.array[B+3]=x.value[N.d];B=B+4}}else{if(x.boundTo==="faces"){I=0;for(S=ka.length;I<S;I++){Ya=x.value[ka[I]];x.array[B]=Ya;x.array[B+1]=Ya;x.array[B+2]=Ya;B=B+3}I=0;for(S=la.length;I<S;I++){Ya=x.value[la[I]];x.array[B]=Ya;x.array[B+1]=Ya;x.array[B+2]=Ya;x.array[B+3]=Ya;B=B+4}}}else if(x.size===
2)if(x.boundTo===void 0||x.boundTo==="vertices"){I=0;for(S=ka.length;I<S;I++){N=za[ka[I]];V=x.value[N.a];W=x.value[N.b];X=x.value[N.c];x.array[B]=V.x;x.array[B+1]=V.y;x.array[B+2]=W.x;x.array[B+3]=W.y;x.array[B+4]=X.x;x.array[B+5]=X.y;B=B+6}I=0;for(S=la.length;I<S;I++){N=za[la[I]];V=x.value[N.a];W=x.value[N.b];X=x.value[N.c];ma=x.value[N.d];x.array[B]=V.x;x.array[B+1]=V.y;x.array[B+2]=W.x;x.array[B+3]=W.y;x.array[B+4]=X.x;x.array[B+5]=X.y;x.array[B+6]=ma.x;x.array[B+7]=ma.y;B=B+8}}else{if(x.boundTo===
"faces"){I=0;for(S=ka.length;I<S;I++){X=W=V=Ya=x.value[ka[I]];x.array[B]=V.x;x.array[B+1]=V.y;x.array[B+2]=W.x;x.array[B+3]=W.y;x.array[B+4]=X.x;x.array[B+5]=X.y;B=B+6}I=0;for(S=la.length;I<S;I++){ma=X=W=V=Ya=x.value[la[I]];x.array[B]=V.x;x.array[B+1]=V.y;x.array[B+2]=W.x;x.array[B+3]=W.y;x.array[B+4]=X.x;x.array[B+5]=X.y;x.array[B+6]=ma.x;x.array[B+7]=ma.y;B=B+8}}}else if(x.size===3){var da;da=x.type==="c"?["r","g","b"]:["x","y","z"];if(x.boundTo===void 0||x.boundTo==="vertices"){I=0;for(S=ka.length;I<
S;I++){N=za[ka[I]];V=x.value[N.a];W=x.value[N.b];X=x.value[N.c];x.array[B]=V[da[0]];x.array[B+1]=V[da[1]];x.array[B+2]=V[da[2]];x.array[B+3]=W[da[0]];x.array[B+4]=W[da[1]];x.array[B+5]=W[da[2]];x.array[B+6]=X[da[0]];x.array[B+7]=X[da[1]];x.array[B+8]=X[da[2]];B=B+9}I=0;for(S=la.length;I<S;I++){N=za[la[I]];V=x.value[N.a];W=x.value[N.b];X=x.value[N.c];ma=x.value[N.d];x.array[B]=V[da[0]];x.array[B+1]=V[da[1]];x.array[B+2]=V[da[2]];x.array[B+3]=W[da[0]];x.array[B+4]=W[da[1]];x.array[B+5]=W[da[2]];x.array[B+
6]=X[da[0]];x.array[B+7]=X[da[1]];x.array[B+8]=X[da[2]];x.array[B+9]=ma[da[0]];x.array[B+10]=ma[da[1]];x.array[B+11]=ma[da[2]];B=B+12}}else if(x.boundTo==="faces"){I=0;for(S=ka.length;I<S;I++){X=W=V=Ya=x.value[ka[I]];x.array[B]=V[da[0]];x.array[B+1]=V[da[1]];x.array[B+2]=V[da[2]];x.array[B+3]=W[da[0]];x.array[B+4]=W[da[1]];x.array[B+5]=W[da[2]];x.array[B+6]=X[da[0]];x.array[B+7]=X[da[1]];x.array[B+8]=X[da[2]];B=B+9}I=0;for(S=la.length;I<S;I++){ma=X=W=V=Ya=x.value[la[I]];x.array[B]=V[da[0]];x.array[B+
1]=V[da[1]];x.array[B+2]=V[da[2]];x.array[B+3]=W[da[0]];x.array[B+4]=W[da[1]];x.array[B+5]=W[da[2]];x.array[B+6]=X[da[0]];x.array[B+7]=X[da[1]];x.array[B+8]=X[da[2]];x.array[B+9]=ma[da[0]];x.array[B+10]=ma[da[1]];x.array[B+11]=ma[da[2]];B=B+12}}}else if(x.size===4)if(x.boundTo===void 0||x.boundTo==="vertices"){I=0;for(S=ka.length;I<S;I++){N=za[ka[I]];V=x.value[N.a];W=x.value[N.b];X=x.value[N.c];x.array[B]=V.x;x.array[B+1]=V.y;x.array[B+2]=V.z;x.array[B+3]=V.w;x.array[B+4]=W.x;x.array[B+5]=W.y;x.array[B+
6]=W.z;x.array[B+7]=W.w;x.array[B+8]=X.x;x.array[B+9]=X.y;x.array[B+10]=X.z;x.array[B+11]=X.w;B=B+12}I=0;for(S=la.length;I<S;I++){N=za[la[I]];V=x.value[N.a];W=x.value[N.b];X=x.value[N.c];ma=x.value[N.d];x.array[B]=V.x;x.array[B+1]=V.y;x.array[B+2]=V.z;x.array[B+3]=V.w;x.array[B+4]=W.x;x.array[B+5]=W.y;x.array[B+6]=W.z;x.array[B+7]=W.w;x.array[B+8]=X.x;x.array[B+9]=X.y;x.array[B+10]=X.z;x.array[B+11]=X.w;x.array[B+12]=ma.x;x.array[B+13]=ma.y;x.array[B+14]=ma.z;x.array[B+15]=ma.w;B=B+16}}else if(x.boundTo===
"faces"){I=0;for(S=ka.length;I<S;I++){X=W=V=Ya=x.value[ka[I]];x.array[B]=V.x;x.array[B+1]=V.y;x.array[B+2]=V.z;x.array[B+3]=V.w;x.array[B+4]=W.x;x.array[B+5]=W.y;x.array[B+6]=W.z;x.array[B+7]=W.w;x.array[B+8]=X.x;x.array[B+9]=X.y;x.array[B+10]=X.z;x.array[B+11]=X.w;B=B+12}I=0;for(S=la.length;I<S;I++){ma=X=W=V=Ya=x.value[la[I]];x.array[B]=V.x;x.array[B+1]=V.y;x.array[B+2]=V.z;x.array[B+3]=V.w;x.array[B+4]=W.x;x.array[B+5]=W.y;x.array[B+6]=W.z;x.array[B+7]=W.w;x.array[B+8]=X.x;x.array[B+9]=X.y;x.array[B+
10]=X.z;x.array[B+11]=X.w;x.array[B+12]=ma.x;x.array[B+13]=ma.y;x.array[B+14]=ma.z;x.array[B+15]=ma.w;B=B+16}}i.bindBuffer(i.ARRAY_BUFFER,x.buffer);i.bufferData(i.ARRAY_BUFFER,x.array,Xa)}}}if(pd){delete ca.__inittedArrays;delete ca.__colorArray;delete ca.__normalArray;delete ca.__tangentArray;delete ca.__uvArray;delete ca.__uv2Array;delete ca.__faceArray;delete ca.__vertexArray;delete ca.__lineArray;delete ca.__skinVertexAArray;delete ca.__skinVertexBArray;delete ca.__skinIndexArray;delete ca.__skinWeightArray}}}}ga.verticesNeedUpdate=
false;ga.morphTargetsNeedUpdate=false;ga.elementsNeedUpdate=false;ga.uvsNeedUpdate=false;ga.normalsNeedUpdate=false;ga.colorsNeedUpdate=false;ga.tangetsNeedUpdate=false;Ua.attributes&&m(Ua)}else if(jb instanceof THREE.Ribbon){if(ga.verticesNeedUpdate||ga.colorsNeedUpdate){var Zb=ga,hd=i.DYNAMIC_DRAW,xc=void 0,yc=void 0,Jc=void 0,$b=void 0,Kc=void 0,id=Zb.vertices,jd=Zb.colors,vd=id.length,wd=jd.length,Lc=Zb.__vertexArray,Mc=Zb.__colorArray,xd=Zb.colorsNeedUpdate;if(Zb.verticesNeedUpdate){for(xc=0;xc<
vd;xc++){Jc=id[xc];$b=xc*3;Lc[$b]=Jc.x;Lc[$b+1]=Jc.y;Lc[$b+2]=Jc.z}i.bindBuffer(i.ARRAY_BUFFER,Zb.__webglVertexBuffer);i.bufferData(i.ARRAY_BUFFER,Lc,hd)}if(xd){for(yc=0;yc<wd;yc++){Kc=jd[yc];$b=yc*3;Mc[$b]=Kc.r;Mc[$b+1]=Kc.g;Mc[$b+2]=Kc.b}i.bindBuffer(i.ARRAY_BUFFER,Zb.__webglColorBuffer);i.bufferData(i.ARRAY_BUFFER,Mc,hd)}}ga.verticesNeedUpdate=false;ga.colorsNeedUpdate=false}else if(jb instanceof THREE.Line){Ua=c(jb,hb);ic=Ua.attributes&&p(Ua);if(ga.verticesNeedUpdate||ga.colorsNeedUpdate||ic){var Jb=
ga,Zc=i.DYNAMIC_DRAW,zc=void 0,Ac=void 0,Nc=void 0,va=void 0,Oc=void 0,kd=Jb.vertices,ld=Jb.colors,yd=kd.length,zd=ld.length,Pc=Jb.__vertexArray,Qc=Jb.__colorArray,Ad=Jb.colorsNeedUpdate,$c=Jb.__webglCustomAttributesList,Rc=void 0,md=void 0,Ia=void 0,oc=void 0,Va=void 0,pa=void 0;if(Jb.verticesNeedUpdate){for(zc=0;zc<yd;zc++){Nc=kd[zc];va=zc*3;Pc[va]=Nc.x;Pc[va+1]=Nc.y;Pc[va+2]=Nc.z}i.bindBuffer(i.ARRAY_BUFFER,Jb.__webglVertexBuffer);i.bufferData(i.ARRAY_BUFFER,Pc,Zc)}if(Ad){for(Ac=0;Ac<zd;Ac++){Oc=
ld[Ac];va=Ac*3;Qc[va]=Oc.r;Qc[va+1]=Oc.g;Qc[va+2]=Oc.b}i.bindBuffer(i.ARRAY_BUFFER,Jb.__webglColorBuffer);i.bufferData(i.ARRAY_BUFFER,Qc,Zc)}if($c){Rc=0;for(md=$c.length;Rc<md;Rc++){pa=$c[Rc];if(pa.needsUpdate&&(pa.boundTo===void 0||pa.boundTo==="vertices")){va=0;oc=pa.value.length;if(pa.size===1)for(Ia=0;Ia<oc;Ia++)pa.array[Ia]=pa.value[Ia];else if(pa.size===2)for(Ia=0;Ia<oc;Ia++){Va=pa.value[Ia];pa.array[va]=Va.x;pa.array[va+1]=Va.y;va=va+2}else if(pa.size===3)if(pa.type==="c")for(Ia=0;Ia<oc;Ia++){Va=
pa.value[Ia];pa.array[va]=Va.r;pa.array[va+1]=Va.g;pa.array[va+2]=Va.b;va=va+3}else for(Ia=0;Ia<oc;Ia++){Va=pa.value[Ia];pa.array[va]=Va.x;pa.array[va+1]=Va.y;pa.array[va+2]=Va.z;va=va+3}else if(pa.size===4)for(Ia=0;Ia<oc;Ia++){Va=pa.value[Ia];pa.array[va]=Va.x;pa.array[va+1]=Va.y;pa.array[va+2]=Va.z;pa.array[va+3]=Va.w;va=va+4}i.bindBuffer(i.ARRAY_BUFFER,pa.buffer);i.bufferData(i.ARRAY_BUFFER,pa.array,Zc)}}}}ga.verticesNeedUpdate=false;ga.colorsNeedUpdate=false;Ua.attributes&&m(Ua)}else if(jb instanceof
THREE.ParticleSystem){Ua=c(jb,hb);ic=Ua.attributes&&p(Ua);(ga.verticesNeedUpdate||ga.colorsNeedUpdate||jb.sortParticles||ic)&&f(ga,i.DYNAMIC_DRAW,jb);ga.verticesNeedUpdate=false;ga.colorsNeedUpdate=false;Ua.attributes&&m(Ua)}}};this.initMaterial=function(a,b,c,d){var e,f,g;a instanceof THREE.MeshDepthMaterial?g="depth":a instanceof THREE.MeshNormalMaterial?g="normal":a instanceof THREE.MeshBasicMaterial?g="basic":a instanceof THREE.MeshLambertMaterial?g="lambert":a instanceof THREE.MeshPhongMaterial?
g="phong":a instanceof THREE.LineBasicMaterial?g="basic":a instanceof THREE.ParticleBasicMaterial&&(g="particle_basic");if(g){var h=THREE.ShaderLib[g];a.uniforms=THREE.UniformsUtils.clone(h.uniforms);a.vertexShader=h.vertexShader;a.fragmentShader=h.fragmentShader}var j,k,l,m,n;j=m=n=h=0;for(k=b.length;j<k;j++){l=b[j];if(!l.onlyShadow){l instanceof THREE.DirectionalLight&&m++;l instanceof THREE.PointLight&&n++;l instanceof THREE.SpotLight&&h++}}if(n+h+m<=M){k=m;l=n;m=h}else{k=Math.ceil(M*m/(n+m));
m=l=M-k}var p=0,h=0;for(n=b.length;h<n;h++){j=b[h];if(j.castShadow){j instanceof THREE.SpotLight&&p++;j instanceof THREE.DirectionalLight&&!j.shadowCascade&&p++}}var o=50;if(d!==void 0&&d instanceof THREE.SkinnedMesh)o=d.bones.length;var q;a:{n=a.fragmentShader;j=a.vertexShader;var h=a.uniforms,b=a.attributes,c={map:!!a.map,envMap:!!a.envMap,lightMap:!!a.lightMap,vertexColors:a.vertexColors,fog:c,useFog:a.fog,sizeAttenuation:a.sizeAttenuation,skinning:a.skinning,maxBones:o,morphTargets:a.morphTargets,
morphNormals:a.morphNormals,maxMorphTargets:this.maxMorphTargets,maxMorphNormals:this.maxMorphNormals,maxDirLights:k,maxPointLights:l,maxSpotLights:m,maxShadows:p,shadowMapEnabled:this.shadowMapEnabled&&d.receiveShadow,shadowMapSoft:this.shadowMapSoft,shadowMapDebug:this.shadowMapDebug,shadowMapCascade:this.shadowMapCascade,alphaTest:a.alphaTest,metal:a.metal,perPixel:a.perPixel,wrapAround:a.wrapAround,doubleSided:d&&d.doubleSided},r,d=[];if(g)d.push(g);else{d.push(n);d.push(j)}for(r in c){d.push(r);
d.push(c[r])}g=d.join();r=0;for(d=T.length;r<d;r++)if(T[r].code===g){q=T[r].program;break a}r=i.createProgram();d=["precision "+z+" float;",oa>0?"#define VERTEX_TEXTURES":"",G.gammaInput?"#define GAMMA_INPUT":"",G.gammaOutput?"#define GAMMA_OUTPUT":"",G.physicallyBasedShading?"#define PHYSICALLY_BASED_SHADING":"","#define MAX_DIR_LIGHTS "+c.maxDirLights,"#define MAX_POINT_LIGHTS "+c.maxPointLights,"#define MAX_SPOT_LIGHTS "+c.maxSpotLights,"#define MAX_SHADOWS "+c.maxShadows,"#define MAX_BONES "+
c.maxBones,c.map?"#define USE_MAP":"",c.envMap?"#define USE_ENVMAP":"",c.lightMap?"#define USE_LIGHTMAP":"",c.vertexColors?"#define USE_COLOR":"",c.skinning?"#define USE_SKINNING":"",c.morphTargets?"#define USE_MORPHTARGETS":"",c.morphNormals?"#define USE_MORPHNORMALS":"",c.perPixel?"#define PHONG_PER_PIXEL":"",c.wrapAround?"#define WRAP_AROUND":"",c.doubleSided?"#define DOUBLE_SIDED":"",c.shadowMapEnabled?"#define USE_SHADOWMAP":"",c.shadowMapSoft?"#define SHADOWMAP_SOFT":"",c.shadowMapDebug?"#define SHADOWMAP_DEBUG":
"",c.shadowMapCascade?"#define SHADOWMAP_CASCADE":"",c.sizeAttenuation?"#define USE_SIZEATTENUATION":"","uniform mat4 objectMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n#ifdef USE_COLOR\nattribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\nattribute vec3 morphTarget0;\nattribute vec3 morphTarget1;\nattribute vec3 morphTarget2;\nattribute vec3 morphTarget3;\n#ifdef USE_MORPHNORMALS\nattribute vec3 morphNormal0;\nattribute vec3 morphNormal1;\nattribute vec3 morphNormal2;\nattribute vec3 morphNormal3;\n#else\nattribute vec3 morphTarget4;\nattribute vec3 morphTarget5;\nattribute vec3 morphTarget6;\nattribute vec3 morphTarget7;\n#endif\n#endif\n#ifdef USE_SKINNING\nattribute vec4 skinVertexA;\nattribute vec4 skinVertexB;\nattribute vec4 skinIndex;\nattribute vec4 skinWeight;\n#endif\n"].join("\n");
k=["precision "+z+" float;","#define MAX_DIR_LIGHTS "+c.maxDirLights,"#define MAX_POINT_LIGHTS "+c.maxPointLights,"#define MAX_SPOT_LIGHTS "+c.maxSpotLights,"#define MAX_SHADOWS "+c.maxShadows,c.alphaTest?"#define ALPHATEST "+c.alphaTest:"",G.gammaInput?"#define GAMMA_INPUT":"",G.gammaOutput?"#define GAMMA_OUTPUT":"",G.physicallyBasedShading?"#define PHYSICALLY_BASED_SHADING":"",c.useFog&&c.fog?"#define USE_FOG":"",c.useFog&&c.fog instanceof THREE.FogExp2?"#define FOG_EXP2":"",c.map?"#define USE_MAP":
"",c.envMap?"#define USE_ENVMAP":"",c.lightMap?"#define USE_LIGHTMAP":"",c.vertexColors?"#define USE_COLOR":"",c.metal?"#define METAL":"",c.perPixel?"#define PHONG_PER_PIXEL":"",c.wrapAround?"#define WRAP_AROUND":"",c.doubleSided?"#define DOUBLE_SIDED":"",c.shadowMapEnabled?"#define USE_SHADOWMAP":"",c.shadowMapSoft?"#define SHADOWMAP_SOFT":"",c.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",c.shadowMapCascade?"#define SHADOWMAP_CASCADE":"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n");
i.attachShader(r,t("fragment",k+n));i.attachShader(r,t("vertex",d+j));i.linkProgram(r);i.getProgramParameter(r,i.LINK_STATUS)||console.error("Could not initialise shader\nVALIDATE_STATUS: "+i.getProgramParameter(r,i.VALIDATE_STATUS)+", gl error ["+i.getError()+"]");r.uniforms={};r.attributes={};var s,d=["viewMatrix","modelViewMatrix","projectionMatrix","normalMatrix","objectMatrix","cameraPosition","boneGlobalMatrices","morphTargetInfluences"];for(s in h)d.push(s);s=d;d=0;for(h=s.length;d<h;d++){n=
s[d];r.uniforms[n]=i.getUniformLocation(r,n)}d=["position","normal","uv","uv2","tangent","color","skinVertexA","skinVertexB","skinIndex","skinWeight"];for(s=0;s<c.maxMorphTargets;s++)d.push("morphTarget"+s);for(s=0;s<c.maxMorphNormals;s++)d.push("morphNormal"+s);for(q in b)d.push(q);q=d;s=0;for(b=q.length;s<b;s++){c=q[s];r.attributes[c]=i.getAttribLocation(r,c)}r.id=T.length;T.push({program:r,code:g});G.info.memory.programs=T.length;q=r}a.program=q;q=a.program.attributes;q.position>=0&&i.enableVertexAttribArray(q.position);
q.color>=0&&i.enableVertexAttribArray(q.color);q.normal>=0&&i.enableVertexAttribArray(q.normal);q.tangent>=0&&i.enableVertexAttribArray(q.tangent);if(a.skinning&&q.skinVertexA>=0&&q.skinVertexB>=0&&q.skinIndex>=0&&q.skinWeight>=0){i.enableVertexAttribArray(q.skinVertexA);i.enableVertexAttribArray(q.skinVertexB);i.enableVertexAttribArray(q.skinIndex);i.enableVertexAttribArray(q.skinWeight)}if(a.attributes)for(f in a.attributes)q[f]!==void 0&&q[f]>=0&&i.enableVertexAttribArray(q[f]);if(a.morphTargets){a.numSupportedMorphTargets=
0;r="morphTarget";for(f=0;f<this.maxMorphTargets;f++){s=r+f;if(q[s]>=0){i.enableVertexAttribArray(q[s]);a.numSupportedMorphTargets++}}}if(a.morphNormals){a.numSupportedMorphNormals=0;r="morphNormal";for(f=0;f<this.maxMorphNormals;f++){s=r+f;if(q[s]>=0){i.enableVertexAttribArray(q[s]);a.numSupportedMorphNormals++}}}a.uniformsList=[];for(e in a.uniforms)a.uniformsList.push([a.uniforms[e],e])};this.setFaceCulling=function(a,b){if(a){!b||b==="ccw"?i.frontFace(i.CCW):i.frontFace(i.CW);a==="back"?i.cullFace(i.BACK):
a==="front"?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK);i.enable(i.CULL_FACE)}else i.disable(i.CULL_FACE)};this.setObjectFaces=function(a){if(ia!==a.doubleSided){a.doubleSided?i.disable(i.CULL_FACE):i.enable(i.CULL_FACE);ia=a.doubleSided}if(O!==a.flipSided){a.flipSided?i.frontFace(i.CW):i.frontFace(i.CCW);O=a.flipSided}};this.setDepthTest=function(a){if(Ma!==a){a?i.enable(i.DEPTH_TEST):i.disable(i.DEPTH_TEST);Ma=a}};this.setDepthWrite=function(a){if(Ka!==a){i.depthMask(a);Ka=a}};this.setBlending=
function(a,b,c,d){if(a!==Q){switch(a){case THREE.NoBlending:i.disable(i.BLEND);break;case THREE.AdditiveBlending:i.enable(i.BLEND);i.blendEquation(i.FUNC_ADD);i.blendFunc(i.SRC_ALPHA,i.ONE);break;case THREE.SubtractiveBlending:i.enable(i.BLEND);i.blendEquation(i.FUNC_ADD);i.blendFunc(i.ZERO,i.ONE_MINUS_SRC_COLOR);break;case THREE.MultiplyBlending:i.enable(i.BLEND);i.blendEquation(i.FUNC_ADD);i.blendFunc(i.ZERO,i.SRC_COLOR);break;case THREE.CustomBlending:i.enable(i.BLEND);break;default:i.enable(i.BLEND);
i.blendEquationSeparate(i.FUNC_ADD,i.FUNC_ADD);i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA)}Q=a}if(a===THREE.CustomBlending){if(b!==Z){i.blendEquation(H(b));Z=b}if(c!==$||d!==ha){i.blendFunc(H(c),H(d));$=c;ha=d}}else ha=$=Z=null};this.setTexture=function(a,b){if(a.needsUpdate){if(!a.__webglInit){a.__webglInit=true;a.__webglTexture=i.createTexture();G.info.memory.textures++}i.activeTexture(i.TEXTURE0+b);i.bindTexture(i.TEXTURE_2D,a.__webglTexture);i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
a.premultiplyAlpha);var c=a.image,d=(c.width&c.width-1)===0&&(c.height&c.height-1)===0,e=H(a.format),f=H(a.type);y(i.TEXTURE_2D,a,d);a instanceof THREE.DataTexture?i.texImage2D(i.TEXTURE_2D,0,e,c.width,c.height,0,e,f,c.data):i.texImage2D(i.TEXTURE_2D,0,e,e,f,a.image);a.generateMipmaps&&d&&i.generateMipmap(i.TEXTURE_2D);a.needsUpdate=false;if(a.onUpdate)a.onUpdate()}else{i.activeTexture(i.TEXTURE0+b);i.bindTexture(i.TEXTURE_2D,a.__webglTexture)}};this.setRenderTarget=function(a){var b=a instanceof
THREE.WebGLRenderTargetCube;if(a&&!a.__webglFramebuffer){if(a.depthBuffer===void 0)a.depthBuffer=true;if(a.stencilBuffer===void 0)a.stencilBuffer=true;a.__webglTexture=i.createTexture();var c=(a.width&a.width-1)===0&&(a.height&a.height-1)===0,d=H(a.format),e=H(a.type);if(b){a.__webglFramebuffer=[];a.__webglRenderbuffer=[];i.bindTexture(i.TEXTURE_CUBE_MAP,a.__webglTexture);y(i.TEXTURE_CUBE_MAP,a,c);for(var f=0;f<6;f++){a.__webglFramebuffer[f]=i.createFramebuffer();a.__webglRenderbuffer[f]=i.createRenderbuffer();
i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+f,0,d,a.width,a.height,0,d,e,null);var g=a,h=i.TEXTURE_CUBE_MAP_POSITIVE_X+f;i.bindFramebuffer(i.FRAMEBUFFER,a.__webglFramebuffer[f]);i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,h,g.__webglTexture,0);s(a.__webglRenderbuffer[f],a)}c&&i.generateMipmap(i.TEXTURE_CUBE_MAP)}else{a.__webglFramebuffer=i.createFramebuffer();a.__webglRenderbuffer=i.createRenderbuffer();i.bindTexture(i.TEXTURE_2D,a.__webglTexture);y(i.TEXTURE_2D,a,c);i.texImage2D(i.TEXTURE_2D,
0,d,a.width,a.height,0,d,e,null);d=i.TEXTURE_2D;i.bindFramebuffer(i.FRAMEBUFFER,a.__webglFramebuffer);i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,d,a.__webglTexture,0);s(a.__webglRenderbuffer,a);c&&i.generateMipmap(i.TEXTURE_2D)}b?i.bindTexture(i.TEXTURE_CUBE_MAP,null):i.bindTexture(i.TEXTURE_2D,null);i.bindRenderbuffer(i.RENDERBUFFER,null);i.bindFramebuffer(i.FRAMEBUFFER,null)}if(a){b=b?a.__webglFramebuffer[a.activeCubeFace]:a.__webglFramebuffer;c=a.width;a=a.height;e=d=0}else{b=null;
c=gb;a=Lb;d=Kb;e=lb}if(b!==C){i.bindFramebuffer(i.FRAMEBUFFER,b);i.viewport(d,e,c,a);C=b}hb=c;Cb=a};this.shadowMapPlugin=new THREE.ShadowMapPlugin;this.addPrePlugin(this.shadowMapPlugin);this.addPostPlugin(new THREE.SpritePlugin);this.addPostPlugin(new THREE.LensFlarePlugin)};
THREE.WebGLRenderTarget=function(a,b,c){this.width=a;this.height=b;c=c||{};this.wrapS=c.wrapS!==void 0?c.wrapS:THREE.ClampToEdgeWrapping;this.wrapT=c.wrapT!==void 0?c.wrapT:THREE.ClampToEdgeWrapping;this.magFilter=c.magFilter!==void 0?c.magFilter:THREE.LinearFilter;this.minFilter=c.minFilter!==void 0?c.minFilter:THREE.LinearMipMapLinearFilter;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.format=c.format!==void 0?c.format:THREE.RGBAFormat;this.type=c.type!==void 0?c.type:
THREE.UnsignedByteType;this.depthBuffer=c.depthBuffer!==void 0?c.depthBuffer:true;this.stencilBuffer=c.stencilBuffer!==void 0?c.stencilBuffer:true;this.generateMipmaps=true};
THREE.WebGLRenderTarget.prototype.clone=function(){var a=new THREE.WebGLRenderTarget(this.width,this.height);a.wrapS=this.wrapS;a.wrapT=this.wrapT;a.magFilter=this.magFilter;a.minFilter=this.minFilter;a.offset.copy(this.offset);a.repeat.copy(this.repeat);a.format=this.format;a.type=this.type;a.depthBuffer=this.depthBuffer;a.stencilBuffer=this.stencilBuffer;return a};THREE.WebGLRenderTargetCube=function(a,b,c){THREE.WebGLRenderTarget.call(this,a,b,c);this.activeCubeFace=0};
THREE.WebGLRenderTargetCube.prototype=new THREE.WebGLRenderTarget;THREE.WebGLRenderTargetCube.prototype.constructor=THREE.WebGLRenderTargetCube;THREE.RenderableVertex=function(){this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.visible=true};THREE.RenderableVertex.prototype.copy=function(a){this.positionWorld.copy(a.positionWorld);this.positionScreen.copy(a.positionScreen)};
THREE.RenderableFace3=function(){this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.faceMaterial=this.material=null;this.uvs=[[]];this.z=null};
THREE.RenderableFace4=function(){this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.v4=new THREE.RenderableVertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.faceMaterial=this.material=null;this.uvs=[[]];this.z=null};THREE.RenderableObject=function(){this.z=this.object=null};
THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=null;this.scale=new THREE.Vector2;this.material=null};THREE.RenderableLine=function(){this.z=null;this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.material=null};
THREE.ColorUtils={adjustHSV:function(a,b,c,d){var e=THREE.ColorUtils.__hsv;THREE.ColorUtils.rgbToHsv(a,e);e.h=THREE.Math.clamp(e.h+b,0,1);e.s=THREE.Math.clamp(e.s+c,0,1);e.v=THREE.Math.clamp(e.v+d,0,1);a.setHSV(e.h,e.s,e.v)},rgbToHsv:function(a,b){var c=a.r,d=a.g,e=a.b,f=Math.max(Math.max(c,d),e),g=Math.min(Math.min(c,d),e);if(g===f)g=c=0;else{var h=f-g,g=h/f,c=(c===f?(d-e)/h:d===f?2+(e-c)/h:4+(c-d)/h)/6;c<0&&(c=c+1);c>1&&(c=c-1)}b===void 0&&(b={h:0,s:0,v:0});b.h=c;b.s=g;b.v=f;return b}};
THREE.ColorUtils.__hsv={h:0,s:0,v:0};
THREE.GeometryUtils={merge:function(a,b){for(var c,d,e=a.vertices.length,f=b instanceof THREE.Mesh?b.geometry:b,g=a.vertices,h=f.vertices,j=a.faces,l=f.faces,k=a.faceVertexUvs[0],p=f.faceVertexUvs[0],m={},o=0;o<a.materials.length;o++)m[a.materials[o].id]=o;if(b instanceof THREE.Mesh){b.matrixAutoUpdate&&b.updateMatrix();c=b.matrix;d=new THREE.Matrix4;d.extractRotation(c,b.scale)}for(var o=0,q=h.length;o<q;o++){var n=h[o].clone();c&&c.multiplyVector3(n);g.push(n)}o=0;for(q=l.length;o<q;o++){var g=
l[o],r,u,t=g.vertexNormals,y=g.vertexColors;g instanceof THREE.Face3?r=new THREE.Face3(g.a+e,g.b+e,g.c+e):g instanceof THREE.Face4&&(r=new THREE.Face4(g.a+e,g.b+e,g.c+e,g.d+e));r.normal.copy(g.normal);d&&d.multiplyVector3(r.normal);h=0;for(n=t.length;h<n;h++){u=t[h].clone();d&&d.multiplyVector3(u);r.vertexNormals.push(u)}r.color.copy(g.color);h=0;for(n=y.length;h<n;h++){u=y[h];r.vertexColors.push(u.clone())}if(g.materialIndex!==void 0){h=f.materials[g.materialIndex];n=h.id;y=m[n];if(y===void 0){y=
a.materials.length;m[n]=y;a.materials.push(h)}r.materialIndex=y}r.centroid.copy(g.centroid);c&&c.multiplyVector3(r.centroid);j.push(r)}o=0;for(q=p.length;o<q;o++){c=p[o];d=[];h=0;for(n=c.length;h<n;h++)d.push(new THREE.UV(c[h].u,c[h].v));k.push(d)}},clone:function(a){var b=new THREE.Geometry,c,d=a.vertices,e=a.faces,f=a.faceVertexUvs[0];if(a.materials)b.materials=a.materials.slice();a=0;for(c=d.length;a<c;a++)b.vertices.push(d[a].clone());a=0;for(c=e.length;a<c;a++)b.faces.push(e[a].clone());a=0;
for(c=f.length;a<c;a++){for(var d=f[a],e=[],g=0,h=d.length;g<h;g++)e.push(new THREE.UV(d[g].u,d[g].v));b.faceVertexUvs[0].push(e)}return b},randomPointInTriangle:function(a,b,c){var d,e,f,g=new THREE.Vector3,h=THREE.GeometryUtils.__v1;d=THREE.GeometryUtils.random();e=THREE.GeometryUtils.random();if(d+e>1){d=1-d;e=1-e}f=1-d-e;g.copy(a);g.multiplyScalar(d);h.copy(b);h.multiplyScalar(e);g.addSelf(h);h.copy(c);h.multiplyScalar(f);g.addSelf(h);return g},randomPointInFace:function(a,b,c){var d,e,f;if(a instanceof
THREE.Face3){d=b.vertices[a.a];e=b.vertices[a.b];f=b.vertices[a.c];return THREE.GeometryUtils.randomPointInTriangle(d,e,f)}if(a instanceof THREE.Face4){d=b.vertices[a.a];e=b.vertices[a.b];f=b.vertices[a.c];var b=b.vertices[a.d],g;if(c)if(a._area1&&a._area2){c=a._area1;g=a._area2}else{c=THREE.GeometryUtils.triangleArea(d,e,b);g=THREE.GeometryUtils.triangleArea(e,f,b);a._area1=c;a._area2=g}else{c=THREE.GeometryUtils.triangleArea(d,e,b);g=THREE.GeometryUtils.triangleArea(e,f,b)}return THREE.GeometryUtils.random()*
(c+g)<c?THREE.GeometryUtils.randomPointInTriangle(d,e,b):THREE.GeometryUtils.randomPointInTriangle(e,f,b)}},randomPointsInGeometry:function(a,b){function c(a){function b(c,d){if(d<c)return c;var e=c+Math.floor((d-c)/2);return l[e]>a?b(c,e-1):l[e]<a?b(e+1,d):e}return b(0,l.length-1)}var d,e,f=a.faces,g=a.vertices,h=f.length,j=0,l=[],k,p,m,o;for(e=0;e<h;e++){d=f[e];if(d instanceof THREE.Face3){k=g[d.a];p=g[d.b];m=g[d.c];d._area=THREE.GeometryUtils.triangleArea(k,p,m)}else if(d instanceof THREE.Face4){k=
g[d.a];p=g[d.b];m=g[d.c];o=g[d.d];d._area1=THREE.GeometryUtils.triangleArea(k,p,o);d._area2=THREE.GeometryUtils.triangleArea(p,m,o);d._area=d._area1+d._area2}j=j+d._area;l[e]=j}d=[];for(e=0;e<b;e++){g=THREE.GeometryUtils.random()*j;g=c(g);d[e]=THREE.GeometryUtils.randomPointInFace(f[g],a,true)}return d},triangleArea:function(a,b,c){var d,e=THREE.GeometryUtils.__v1;e.sub(a,b);d=e.length();e.sub(a,c);a=e.length();e.sub(b,c);c=e.length();b=0.5*(d+a+c);return Math.sqrt(b*(b-d)*(b-a)*(b-c))},center:function(a){a.computeBoundingBox();
var b=a.boundingBox,c=new THREE.Vector3;c.add(b.min,b.max);c.multiplyScalar(-0.5);a.applyMatrix((new THREE.Matrix4).makeTranslation(c.x,c.y,c.z));a.computeBoundingBox();return c},normalizeUVs:function(a){for(var a=a.faceVertexUvs[0],b=0,c=a.length;b<c;b++)for(var d=a[b],e=0,f=d.length;e<f;e++){if(d[e].u!==1)d[e].u=d[e].u-Math.floor(d[e].u);if(d[e].v!==1)d[e].v=d[e].v-Math.floor(d[e].v)}},triangulateQuads:function(a){var b,c,d,e,f=[],g=[],h=[];b=0;for(c=a.faceUvs.length;b<c;b++)g[b]=[];b=0;for(c=a.faceVertexUvs.length;b<
c;b++)h[b]=[];b=0;for(c=a.faces.length;b<c;b++){d=a.faces[b];if(d instanceof THREE.Face4){e=d.a;var j=d.b,l=d.c,k=d.d,p=new THREE.Face3,m=new THREE.Face3;p.color.copy(d.color);m.color.copy(d.color);p.materialIndex=d.materialIndex;m.materialIndex=d.materialIndex;p.a=e;p.b=j;p.c=k;m.a=j;m.b=l;m.c=k;if(d.vertexColors.length===4){p.vertexColors[0]=d.vertexColors[0].clone();p.vertexColors[1]=d.vertexColors[1].clone();p.vertexColors[2]=d.vertexColors[3].clone();m.vertexColors[0]=d.vertexColors[1].clone();
m.vertexColors[1]=d.vertexColors[2].clone();m.vertexColors[2]=d.vertexColors[3].clone()}f.push(p,m);d=0;for(e=a.faceVertexUvs.length;d<e;d++)if(a.faceVertexUvs[d].length){p=a.faceVertexUvs[d][b];j=p[1];l=p[2];k=p[3];p=[p[0].clone(),j.clone(),k.clone()];j=[j.clone(),l.clone(),k.clone()];h[d].push(p,j)}d=0;for(e=a.faceUvs.length;d<e;d++)if(a.faceUvs[d].length){j=a.faceUvs[d][b];g[d].push(j,j)}}else{f.push(d);d=0;for(e=a.faceUvs.length;d<e;d++)g[d].push(a.faceUvs[d]);d=0;for(e=a.faceVertexUvs.length;d<
e;d++)h[d].push(a.faceVertexUvs[d])}}a.faces=f;a.faceUvs=g;a.faceVertexUvs=h;a.computeCentroids();a.computeFaceNormals();a.computeVertexNormals();a.hasTangents&&a.computeTangents()},explode:function(a){for(var b=[],c=0,d=a.faces.length;c<d;c++){var e=b.length,f=a.faces[c];if(f instanceof THREE.Face4){var g=f.a,h=f.b,j=f.c,g=a.vertices[g],h=a.vertices[h],j=a.vertices[j],l=a.vertices[f.d];b.push(g.clone());b.push(h.clone());b.push(j.clone());b.push(l.clone());f.a=e;f.b=e+1;f.c=e+2;f.d=e+3}else{g=f.a;
h=f.b;j=f.c;g=a.vertices[g];h=a.vertices[h];j=a.vertices[j];b.push(g.clone());b.push(h.clone());b.push(j.clone());f.a=e;f.b=e+1;f.c=e+2}}a.vertices=b;delete a.__tmpVertices},tessellate:function(a,b){var c,d,e,f,g,h,j,l,k,p,m,o,q,n,r,u,t,y,s,w=[],H=[];c=0;for(d=a.faceVertexUvs.length;c<d;c++)H[c]=[];c=0;for(d=a.faces.length;c<d;c++){e=a.faces[c];if(e instanceof THREE.Face3){f=e.a;g=e.b;h=e.c;l=a.vertices[f];k=a.vertices[g];p=a.vertices[h];o=l.distanceTo(k);q=k.distanceTo(p);m=l.distanceTo(p);if(o>
b||q>b||m>b){j=a.vertices.length;y=e.clone();s=e.clone();if(o>=q&&o>=m){l=l.clone();l.lerpSelf(k,0.5);y.a=f;y.b=j;y.c=h;s.a=j;s.b=g;s.c=h;if(e.vertexNormals.length===3){f=e.vertexNormals[0].clone();f.lerpSelf(e.vertexNormals[1],0.5);y.vertexNormals[1].copy(f);s.vertexNormals[0].copy(f)}if(e.vertexColors.length===3){f=e.vertexColors[0].clone();f.lerpSelf(e.vertexColors[1],0.5);y.vertexColors[1].copy(f);s.vertexColors[0].copy(f)}e=0}else if(q>=o&&q>=m){l=k.clone();l.lerpSelf(p,0.5);y.a=f;y.b=g;y.c=
j;s.a=j;s.b=h;s.c=f;if(e.vertexNormals.length===3){f=e.vertexNormals[1].clone();f.lerpSelf(e.vertexNormals[2],0.5);y.vertexNormals[2].copy(f);s.vertexNormals[0].copy(f);s.vertexNormals[1].copy(e.vertexNormals[2]);s.vertexNormals[2].copy(e.vertexNormals[0])}if(e.vertexColors.length===3){f=e.vertexColors[1].clone();f.lerpSelf(e.vertexColors[2],0.5);y.vertexColors[2].copy(f);s.vertexColors[0].copy(f);s.vertexColors[1].copy(e.vertexColors[2]);s.vertexColors[2].copy(e.vertexColors[0])}e=1}else{l=l.clone();
l.lerpSelf(p,0.5);y.a=f;y.b=g;y.c=j;s.a=j;s.b=g;s.c=h;if(e.vertexNormals.length===3){f=e.vertexNormals[0].clone();f.lerpSelf(e.vertexNormals[2],0.5);y.vertexNormals[2].copy(f);s.vertexNormals[0].copy(f)}if(e.vertexColors.length===3){f=e.vertexColors[0].clone();f.lerpSelf(e.vertexColors[2],0.5);y.vertexColors[2].copy(f);s.vertexColors[0].copy(f)}e=2}w.push(y,s);a.vertices.push(l);f=0;for(g=a.faceVertexUvs.length;f<g;f++)if(a.faceVertexUvs[f].length){l=a.faceVertexUvs[f][c];s=l[0];h=l[1];y=l[2];if(e===
0){k=s.clone();k.lerpSelf(h,0.5);l=[s.clone(),k.clone(),y.clone()];h=[k.clone(),h.clone(),y.clone()]}else if(e===1){k=h.clone();k.lerpSelf(y,0.5);l=[s.clone(),h.clone(),k.clone()];h=[k.clone(),y.clone(),s.clone()]}else{k=s.clone();k.lerpSelf(y,0.5);l=[s.clone(),h.clone(),k.clone()];h=[k.clone(),h.clone(),y.clone()]}H[f].push(l,h)}}else{w.push(e);f=0;for(g=a.faceVertexUvs.length;f<g;f++)H[f].push(a.faceVertexUvs[f][c])}}else{f=e.a;g=e.b;h=e.c;j=e.d;l=a.vertices[f];k=a.vertices[g];p=a.vertices[h];m=
a.vertices[j];o=l.distanceTo(k);q=k.distanceTo(p);n=p.distanceTo(m);r=l.distanceTo(m);if(o>b||q>b||n>b||r>b){u=a.vertices.length;t=a.vertices.length+1;y=e.clone();s=e.clone();if(o>=q&&o>=n&&o>=r||n>=q&&n>=o&&n>=r){o=l.clone();o.lerpSelf(k,0.5);k=p.clone();k.lerpSelf(m,0.5);y.a=f;y.b=u;y.c=t;y.d=j;s.a=u;s.b=g;s.c=h;s.d=t;if(e.vertexNormals.length===4){f=e.vertexNormals[0].clone();f.lerpSelf(e.vertexNormals[1],0.5);g=e.vertexNormals[2].clone();g.lerpSelf(e.vertexNormals[3],0.5);y.vertexNormals[1].copy(f);
y.vertexNormals[2].copy(g);s.vertexNormals[0].copy(f);s.vertexNormals[3].copy(g)}if(e.vertexColors.length===4){f=e.vertexColors[0].clone();f.lerpSelf(e.vertexColors[1],0.5);g=e.vertexColors[2].clone();g.lerpSelf(e.vertexColors[3],0.5);y.vertexColors[1].copy(f);y.vertexColors[2].copy(g);s.vertexColors[0].copy(f);s.vertexColors[3].copy(g)}e=0}else{o=k.clone();o.lerpSelf(p,0.5);k=m.clone();k.lerpSelf(l,0.5);y.a=f;y.b=g;y.c=u;y.d=t;s.a=t;s.b=u;s.c=h;s.d=j;if(e.vertexNormals.length===4){f=e.vertexNormals[1].clone();
f.lerpSelf(e.vertexNormals[2],0.5);g=e.vertexNormals[3].clone();g.lerpSelf(e.vertexNormals[0],0.5);y.vertexNormals[2].copy(f);y.vertexNormals[3].copy(g);s.vertexNormals[0].copy(g);s.vertexNormals[1].copy(f)}if(e.vertexColors.length===4){f=e.vertexColors[1].clone();f.lerpSelf(e.vertexColors[2],0.5);g=e.vertexColors[3].clone();g.lerpSelf(e.vertexColors[0],0.5);y.vertexColors[2].copy(f);y.vertexColors[3].copy(g);s.vertexColors[0].copy(g);s.vertexColors[1].copy(f)}e=1}w.push(y,s);a.vertices.push(o,k);
f=0;for(g=a.faceVertexUvs.length;f<g;f++)if(a.faceVertexUvs[f].length){l=a.faceVertexUvs[f][c];s=l[0];h=l[1];y=l[2];l=l[3];if(e===0){k=s.clone();k.lerpSelf(h,0.5);p=y.clone();p.lerpSelf(l,0.5);s=[s.clone(),k.clone(),p.clone(),l.clone()];h=[k.clone(),h.clone(),y.clone(),p.clone()]}else{k=h.clone();k.lerpSelf(y,0.5);p=l.clone();p.lerpSelf(s,0.5);s=[s.clone(),h.clone(),k.clone(),p.clone()];h=[p.clone(),k.clone(),y.clone(),l.clone()]}H[f].push(s,h)}}else{w.push(e);f=0;for(g=a.faceVertexUvs.length;f<g;f++)H[f].push(a.faceVertexUvs[f][c])}}}a.faces=
w;a.faceVertexUvs=H}};THREE.GeometryUtils.random=THREE.Math.random16;THREE.GeometryUtils.__v1=new THREE.Vector3;
THREE.ImageUtils={crossOrigin:"anonymous",loadTexture:function(a,b,c){var d=new Image,e=new THREE.Texture(d,b);d.onload=function(){e.needsUpdate=true;c&&c(this)};d.crossOrigin=this.crossOrigin;d.src=a;return e},loadTextureCube:function(a,b,c){var d,e=[],f=new THREE.Texture(e,b),b=e.loadCount=0;for(d=a.length;b<d;++b){e[b]=new Image;e[b].onload=function(){e.loadCount=e.loadCount+1;if(e.loadCount===6)f.needsUpdate=true;c&&c(this)};e[b].crossOrigin=this.crossOrigin;e[b].src=a[b]}return f},getNormalMap:function(a,
b){var c=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);return[a[0]/b,a[1]/b,a[2]/b]},b=b|1,d=a.width,e=a.height,f=document.createElement("canvas");f.width=d;f.height=e;var g=f.getContext("2d");g.drawImage(a,0,0);for(var h=g.getImageData(0,0,d,e).data,j=g.createImageData(d,e),l=j.data,k=0;k<d;k++)for(var p=0;p<e;p++){var m=p-1<0?0:p-1,o=p+1>e-1?e-1:p+1,q=k-1<0?0:k-1,n=k+1>d-1?d-1:k+1,r=[],u=[0,0,h[(p*d+k)*4]/255*b];r.push([-1,0,h[(p*d+q)*4]/255*b]);r.push([-1,-1,h[(m*d+q)*4]/255*b]);r.push([0,
-1,h[(m*d+k)*4]/255*b]);r.push([1,-1,h[(m*d+n)*4]/255*b]);r.push([1,0,h[(p*d+n)*4]/255*b]);r.push([1,1,h[(o*d+n)*4]/255*b]);r.push([0,1,h[(o*d+k)*4]/255*b]);r.push([-1,1,h[(o*d+q)*4]/255*b]);m=[];q=r.length;for(o=0;o<q;o++){var n=r[o],t=r[(o+1)%q],n=[n[0]-u[0],n[1]-u[1],n[2]-u[2]],t=[t[0]-u[0],t[1]-u[1],t[2]-u[2]];m.push(c([n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]))}r=[0,0,0];for(o=0;o<m.length;o++){r[0]=r[0]+m[o][0];r[1]=r[1]+m[o][1];r[2]=r[2]+m[o][2]}r[0]=r[0]/m.length;r[1]=
r[1]/m.length;r[2]=r[2]/m.length;u=(p*d+k)*4;l[u]=(r[0]+1)/2*255|0;l[u+1]=(r[1]+0.5)*255|0;l[u+2]=r[2]*255|0;l[u+3]=255}g.putImageData(j,0,0);return f},generateDataTexture:function(a,b,c){for(var d=a*b,e=new Uint8Array(3*d),f=Math.floor(c.r*255),g=Math.floor(c.g*255),c=Math.floor(c.b*255),h=0;h<d;h++){e[h*3]=f;e[h*3+1]=g;e[h*3+2]=c}a=new THREE.DataTexture(e,a,b,THREE.RGBFormat);a.needsUpdate=true;return a}};
THREE.SceneUtils={showHierarchy:function(a,b){THREE.SceneUtils.traverseHierarchy(a,function(a){a.visible=b})},traverseHierarchy:function(a,b){var c,d,e=a.children.length;for(d=0;d<e;d++){c=a.children[d];b(c);THREE.SceneUtils.traverseHierarchy(c,b)}},createMultiMaterialObject:function(a,b){var c,d=b.length,e=new THREE.Object3D;for(c=0;c<d;c++){var f=new THREE.Mesh(a,b[c]);e.add(f)}return e},cloneObject:function(a){var b;if(a instanceof THREE.MorphAnimMesh){b=new THREE.MorphAnimMesh(a.geometry,a.material);
b.duration=a.duration;b.mirroredLoop=a.mirroredLoop;b.time=a.time;b.lastKeyframe=a.lastKeyframe;b.currentKeyframe=a.currentKeyframe;b.direction=a.direction;b.directionBackwards=a.directionBackwards}else if(a instanceof THREE.SkinnedMesh)b=new THREE.SkinnedMesh(a.geometry,a.material);else if(a instanceof THREE.Mesh)b=new THREE.Mesh(a.geometry,a.material);else if(a instanceof THREE.Line)b=new THREE.Line(a.geometry,a.material,a.type);else if(a instanceof THREE.Ribbon)b=new THREE.Ribbon(a.geometry,a.material);
else if(a instanceof THREE.ParticleSystem){b=new THREE.ParticleSystem(a.geometry,a.material);b.sortParticles=a.sortParticles}else if(a instanceof THREE.Particle)b=new THREE.Particle(a.material);else if(a instanceof THREE.Sprite){b=new THREE.Sprite({});b.color.copy(a.color);b.map=a.map;b.blending=a.blending;b.useScreenCoordinates=a.useScreenCoordinates;b.mergeWith3D=a.mergeWith3D;b.affectedByDistance=a.affectedByDistance;b.scaleByViewport=a.scaleByViewport;b.alignment=a.alignment;b.rotation3d.copy(a.rotation3d);
b.rotation=a.rotation;b.opacity=a.opacity;b.uvOffset.copy(a.uvOffset);b.uvScale.copy(a.uvScale)}else if(a instanceof THREE.LOD)b=new THREE.LOD;else if(a instanceof THREE.MarchingCubes){b=new THREE.MarchingCubes(a.resolution,a.material);b.field.set(a.field);b.isolation=a.isolation}else a instanceof THREE.Object3D&&(b=new THREE.Object3D);b.name=a.name;b.parent=a.parent;b.up.copy(a.up);b.position.copy(a.position);b.rotation instanceof THREE.Vector3&&b.rotation.copy(a.rotation);b.eulerOrder=a.eulerOrder;
b.scale.copy(a.scale);b.dynamic=a.dynamic;b.doubleSided=a.doubleSided;b.flipSided=a.flipSided;b.renderDepth=a.renderDepth;b.rotationAutoUpdate=a.rotationAutoUpdate;b.matrix.copy(a.matrix);b.matrixWorld.copy(a.matrixWorld);b.matrixRotationWorld.copy(a.matrixRotationWorld);b.matrixAutoUpdate=a.matrixAutoUpdate;b.matrixWorldNeedsUpdate=a.matrixWorldNeedsUpdate;b.quaternion.copy(a.quaternion);b.useQuaternion=a.useQuaternion;b.boundRadius=a.boundRadius;b.boundRadiusScale=a.boundRadiusScale;b.visible=a.visible;
b.castShadow=a.castShadow;b.receiveShadow=a.receiveShadow;b.frustumCulled=a.frustumCulled;for(var c=0;c<a.children.length;c++){var d=THREE.SceneUtils.cloneObject(a.children[c]);b.children[c]=d;d.parent=b}if(a instanceof THREE.LOD)for(c=0;c<a.LODs.length;c++)b.LODs[c]={visibleAtDistance:a.LODs[c].visibleAtDistance,object3D:b.children[c]};return b},detach:function(a,b,c){a.applyMatrix(b.matrixWorld);b.remove(a);c.add(a)},attach:function(a,b,c){var d=new THREE.Matrix4;d.getInverse(c.matrixWorld);a.applyMatrix(d);
b.remove(a);c.add(a)}};
THREE.WebGLRenderer&&(THREE.ShaderUtils={lib:{fresnel:{uniforms:{mRefractionRatio:{type:"f",value:1.02},mFresnelBias:{type:"f",value:0.1},mFresnelPower:{type:"f",value:2},mFresnelScale:{type:"f",value:1},tCube:{type:"t",value:1,texture:null}},fragmentShader:"uniform samplerCube tCube;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\nvec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );\nrefractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;\nrefractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;\nrefractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;\nrefractedColor.a = 1.0;\ngl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );\n}",vertexShader:"uniform float mRefractionRatio;\nuniform float mFresnelBias;\nuniform float mFresnelScale;\nuniform float mFresnelPower;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );\nvec3 I = mPosition.xyz - cameraPosition;\nvReflect = reflect( I, nWorld );\nvRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );\nvRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );\nvRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );\nvReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );\ngl_Position = projectionMatrix * mvPosition;\n}"},
normal:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{enableAO:{type:"i",value:0},enableDiffuse:{type:"i",value:0},enableSpecular:{type:"i",value:0},enableReflection:{type:"i",value:0},tDiffuse:{type:"t",value:0,texture:null},tCube:{type:"t",value:1,texture:null},tNormal:{type:"t",value:2,texture:null},tSpecular:{type:"t",value:3,texture:null},tAO:{type:"t",value:4,texture:null},tDisplacement:{type:"t",value:5,texture:null},uNormalScale:{type:"f",
value:1},uDisplacementBias:{type:"f",value:0},uDisplacementScale:{type:"f",value:1},uDiffuseColor:{type:"c",value:new THREE.Color(16777215)},uSpecularColor:{type:"c",value:new THREE.Color(1118481)},uAmbientColor:{type:"c",value:new THREE.Color(16777215)},uShininess:{type:"f",value:30},uOpacity:{type:"f",value:1},uReflectivity:{type:"f",value:0.5},uOffset:{type:"v2",value:new THREE.Vector2(0,0)},uRepeat:{type:"v2",value:new THREE.Vector2(1,1)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),
fragmentShader:["uniform vec3 uAmbientColor;\nuniform vec3 uDiffuseColor;\nuniform vec3 uSpecularColor;\nuniform float uShininess;\nuniform float uOpacity;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform bool enableReflection;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform samplerCube tCube;\nuniform float uNormalScale;\nuniform float uReflectivity;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;",
THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3( 1.0 ), uOpacity );\nvec3 specularTex = vec3( 1.0 );\nvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\nnormalTex.xy *= uNormalScale;\nnormalTex = normalize( normalTex );\nif( enableDiffuse ) {\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( tDiffuse, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );\n#endif\n}\nif( enableAO ) {\n#ifdef GAMMA_INPUT\nvec4 aoColor = texture2D( tAO, vUv );\naoColor.xyz *= aoColor.xyz;\ngl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;\n#endif\n}\nif( enableSpecular )\nspecularTex = texture2D( tSpecular, vUv ).xyz;\nmat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );\nvec3 finalNormal = tsb * normalTex;\nvec3 normal = normalize( finalNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec3 pointVector = normalize( vPointLight[ i ].xyz );\nfloat pointDistance = vPointLight[ i ].w;\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\n#endif\npointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;\nvec3 pointHalfVector = normalize( pointVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( pointVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;\n#else\npointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight * pointDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\n#ifdef WRAP_AROUND\nfloat directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );\nfloat directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\n#endif\ndirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor) + totalSpecular;\nif ( enableReflection ) {\nvec3 wPos = cameraPosition - vViewPosition;\nvec3 vReflect = reflect( normalize( wPos ), normal );\nvec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * uReflectivity );\n}",
THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n"),vertexShader:["attribute vec4 tangent;\nuniform vec2 uOffset;\nuniform vec2 uRepeat;\n#ifdef VERTEX_TEXTURES\nuniform sampler2D tDisplacement;\nuniform float uDisplacementScale;\nuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;",
THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvViewPosition = -mvPosition.xyz;\nvNormal = normalMatrix * normal;\nvTangent = normalMatrix * tangent.xyz;\nvBinormal = cross( vNormal, vTangent ) * tangent.w;\nvUv = uv * uRepeat + uOffset;\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#ifdef VERTEX_TEXTURES\nvec3 dv = texture2D( tDisplacement, uv ).xyz;\nfloat df = uDisplacementScale * dv.x + uDisplacementBias;\nvec4 displacedPosition = vec4( normalize( vNormal.xyz ) * df, 0.0 ) + mvPosition;\ngl_Position = projectionMatrix * displacedPosition;\n#else\ngl_Position = projectionMatrix * mvPosition;\n#endif",
THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n")},cube:{uniforms:{tCube:{type:"t",value:1,texture:null},tFlip:{type:"f",value:-1}},vertexShader:"varying vec3 vViewPosition;\nvoid main() {\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vViewPosition;\nvoid main() {\nvec3 wPos = cameraPosition - vViewPosition;\ngl_FragColor = textureCube( tCube, vec3( tFlip * wPos.x, wPos.yz ) );\n}"}}});
THREE.BufferGeometry=function(){this.id=THREE.GeometryCount++;this.vertexColorArray=this.vertexUvArray=this.vertexNormalArray=this.vertexPositionArray=this.vertexIndexArray=this.vertexColorBuffer=this.vertexUvBuffer=this.vertexNormalBuffer=this.vertexPositionBuffer=this.vertexIndexBuffer=null;this.dynamic=false;this.boundingSphere=this.boundingBox=null;this.morphTargets=[]};THREE.BufferGeometry.prototype={constructor:THREE.BufferGeometry,computeBoundingBox:function(){},computeBoundingSphere:function(){}};
THREE.Curve=function(){};THREE.Curve.prototype.getPoint=function(){console.log("Warning, getPoint() not implemented!");return null};THREE.Curve.prototype.getPointAt=function(a){return this.getPoint(this.getUtoTmapping(a))};THREE.Curve.prototype.getPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPoint(b/a));return c};THREE.Curve.prototype.getSpacedPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPointAt(b/a));return c};
THREE.Curve.prototype.getLength=function(){var a=this.getLengths();return a[a.length-1]};THREE.Curve.prototype.getLengths=function(a){a||(a=this.__arcLengthDivisions?this.__arcLengthDivisions:200);if(this.cacheArcLengths&&this.cacheArcLengths.length==a+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=false;var b=[],c,d=this.getPoint(0),e,f=0;b.push(0);for(e=1;e<=a;e++){c=this.getPoint(e/a);f=f+c.distanceTo(d);b.push(f);d=c}return this.cacheArcLengths=b};
THREE.Curve.prototype.updateArcLengths=function(){this.needsUpdate=true;this.getLengths()};THREE.Curve.prototype.getUtoTmapping=function(a,b){var c=this.getLengths(),d=0,e=c.length,f;f=b?b:a*c[e-1];for(var g=0,h=e-1,j;g<=h;){d=Math.floor(g+(h-g)/2);j=c[d]-f;if(j<0)g=d+1;else if(j>0)h=d-1;else{h=d;break}}d=h;if(c[d]==f)return d/(e-1);g=c[d];return c=(d+(f-g)/(c[d+1]-g))/(e-1)};THREE.Curve.prototype.getNormalVector=function(a){a=this.getTangent(a);return new THREE.Vector2(-a.y,a.x)};
THREE.Curve.prototype.getTangent=function(a){var b=a-1.0E-4,a=a+1.0E-4;b<0&&(b=0);a>1&&(a=1);b=this.getPoint(b);return this.getPoint(a).clone().subSelf(b).normalize()};THREE.Curve.prototype.getTangentAt=function(a){return this.getTangent(this.getUtoTmapping(a))};THREE.LineCurve=function(a,b){this.v1=a;this.v2=b};THREE.LineCurve.prototype=new THREE.Curve;THREE.LineCurve.prototype.constructor=THREE.LineCurve;
THREE.LineCurve.prototype.getPoint=function(a){var b=this.v2.clone().subSelf(this.v1);b.multiplyScalar(a).addSelf(this.v1);return b};THREE.LineCurve.prototype.getPointAt=function(a){return this.getPoint(a)};THREE.LineCurve.prototype.getTangent=function(){return this.v2.clone().subSelf(this.v1).normalize()};THREE.QuadraticBezierCurve=function(a,b,c){this.v0=a;this.v1=b;this.v2=c};THREE.QuadraticBezierCurve.prototype=new THREE.Curve;THREE.QuadraticBezierCurve.prototype.constructor=THREE.QuadraticBezierCurve;
THREE.QuadraticBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);return new THREE.Vector2(b,a)};THREE.QuadraticBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.y,this.v1.y,this.v2.y);b=new THREE.Vector2(b,a);b.normalize();return b};
THREE.CubicBezierCurve=function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d};THREE.CubicBezierCurve.prototype=new THREE.Curve;THREE.CubicBezierCurve.prototype.constructor=THREE.CubicBezierCurve;THREE.CubicBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);return new THREE.Vector2(b,a)};
THREE.CubicBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);b=new THREE.Vector2(b,a);b.normalize();return b};THREE.SplineCurve=function(a){this.points=a==void 0?[]:a};THREE.SplineCurve.prototype=new THREE.Curve;THREE.SplineCurve.prototype.constructor=THREE.SplineCurve;
THREE.SplineCurve.prototype.getPoint=function(a){var b=new THREE.Vector2,c=[],d=this.points,e;e=(d.length-1)*a;a=Math.floor(e);e=e-a;c[0]=a==0?a:a-1;c[1]=a;c[2]=a>d.length-2?d.length-1:a+1;c[3]=a>d.length-3?d.length-1:a+2;b.x=THREE.Curve.Utils.interpolate(d[c[0]].x,d[c[1]].x,d[c[2]].x,d[c[3]].x,e);b.y=THREE.Curve.Utils.interpolate(d[c[0]].y,d[c[1]].y,d[c[2]].y,d[c[3]].y,e);return b};
THREE.ArcCurve=function(a,b,c,d,e,f){this.aX=a;this.aY=b;this.aRadius=c;this.aStartAngle=d;this.aEndAngle=e;this.aClockwise=f};THREE.ArcCurve.prototype=new THREE.Curve;THREE.ArcCurve.prototype.constructor=THREE.ArcCurve;THREE.ArcCurve.prototype.getPoint=function(a){var b=this.aEndAngle-this.aStartAngle;this.aClockwise||(a=1-a);b=this.aStartAngle+a*b;a=this.aX+this.aRadius*Math.cos(b);b=this.aY+this.aRadius*Math.sin(b);return new THREE.Vector2(a,b)};
THREE.Curve.Utils={tangentQuadraticBezier:function(a,b,c,d){return 2*(1-a)*(c-b)+2*a*(d-c)},tangentCubicBezier:function(a,b,c,d,e){return-3*b*(1-a)*(1-a)+3*c*(1-a)*(1-a)-6*a*c*(1-a)+6*a*d*(1-a)-3*a*a*d+3*a*a*e},tangentSpline:function(a){return 6*a*a-6*a+(3*a*a-4*a+1)+(-6*a*a+6*a)+(3*a*a-2*a)},interpolate:function(a,b,c,d,e){var a=(c-a)*0.5,d=(d-b)*0.5,f=e*e;return(2*b-2*c+a+d)*e*f+(-3*b+3*c-2*a-d)*f+a*e+b}};
THREE.Curve.create=function(a,b){a.prototype=new THREE.Curve;a.prototype.constructor=a;a.prototype.getPoint=b;return a};THREE.LineCurve3=THREE.Curve.create(function(a,b){this.v1=a;this.v2=b},function(a){var b=new THREE.Vector3;b.sub(this.v2,this.v1);b.multiplyScalar(a);b.addSelf(this.v1);return b});
THREE.QuadraticBezierCurve3=THREE.Curve.create(function(a,b,c){this.v0=a;this.v1=b;this.v2=c},function(a){var b,c;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);c=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);a=THREE.Shape.Utils.b2(a,this.v0.z,this.v1.z,this.v2.z);return new THREE.Vector3(b,c,a)});
THREE.CubicBezierCurve3=THREE.Curve.create(function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d},function(a){var b,c;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);c=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);a=THREE.Shape.Utils.b3(a,this.v0.z,this.v1.z,this.v2.z,this.v3.z);return new THREE.Vector3(b,c,a)});
THREE.SplineCurve3=THREE.Curve.create(function(a){this.points=a==void 0?[]:a},function(a){var b=new THREE.Vector3,c=[],d=this.points,e,a=(d.length-1)*a;e=Math.floor(a);a=a-e;c[0]=e==0?e:e-1;c[1]=e;c[2]=e>d.length-2?d.length-1:e+1;c[3]=e>d.length-3?d.length-1:e+2;e=d[c[0]];var f=d[c[1]],g=d[c[2]],c=d[c[3]];b.x=THREE.Curve.Utils.interpolate(e.x,f.x,g.x,c.x,a);b.y=THREE.Curve.Utils.interpolate(e.y,f.y,g.y,c.y,a);b.z=THREE.Curve.Utils.interpolate(e.z,f.z,g.z,c.z,a);return b});
THREE.ClosedSplineCurve3=THREE.Curve.create(function(a){this.points=a==void 0?[]:a},function(a){var b=new THREE.Vector3,c=[],d=this.points,e;e=(d.length-0)*a;a=Math.floor(e);e=e-a;a=a+(a>0?0:(Math.floor(Math.abs(a)/d.length)+1)*d.length);c[0]=(a-1)%d.length;c[1]=a%d.length;c[2]=(a+1)%d.length;c[3]=(a+2)%d.length;b.x=THREE.Curve.Utils.interpolate(d[c[0]].x,d[c[1]].x,d[c[2]].x,d[c[3]].x,e);b.y=THREE.Curve.Utils.interpolate(d[c[0]].y,d[c[1]].y,d[c[2]].y,d[c[3]].y,e);b.z=THREE.Curve.Utils.interpolate(d[c[0]].z,
d[c[1]].z,d[c[2]].z,d[c[3]].z,e);return b});THREE.CurvePath=function(){this.curves=[];this.bends=[];this.autoClose=false};THREE.CurvePath.prototype=new THREE.Curve;THREE.CurvePath.prototype.constructor=THREE.CurvePath;THREE.CurvePath.prototype.add=function(a){this.curves.push(a)};THREE.CurvePath.prototype.checkConnection=function(){};
THREE.CurvePath.prototype.closePath=function(){var a=this.curves[0].getPoint(0),b=this.curves[this.curves.length-1].getPoint(1);a.equals(b)||this.curves.push(new THREE.LineCurve(b,a))};THREE.CurvePath.prototype.getPoint=function(a){for(var b=a*this.getLength(),c=this.getCurveLengths(),a=0;a<c.length;){if(c[a]>=b){b=c[a]-b;a=this.curves[a];b=1-b/a.getLength();return a.getPointAt(b)}a++}return null};THREE.CurvePath.prototype.getLength=function(){var a=this.getCurveLengths();return a[a.length-1]};
THREE.CurvePath.prototype.getCurveLengths=function(){if(this.cacheLengths&&this.cacheLengths.length==this.curves.length)return this.cacheLengths;var a=[],b=0,c,d=this.curves.length;for(c=0;c<d;c++){b=b+this.curves[c].getLength();a.push(b)}return this.cacheLengths=a};
THREE.CurvePath.prototype.getBoundingBox=function(){var a=this.getPoints(),b,c,d,e;b=c=Number.NEGATIVE_INFINITY;d=e=Number.POSITIVE_INFINITY;var f,g,h,j;j=new THREE.Vector2;g=0;for(h=a.length;g<h;g++){f=a[g];if(f.x>b)b=f.x;else if(f.x<d)d=f.x;if(f.y>c)c=f.y;else if(f.y<c)e=f.y;j.addSelf(f.x,f.y)}return{minX:d,minY:e,maxX:b,maxY:c,centroid:j.divideScalar(h)}};THREE.CurvePath.prototype.createPointsGeometry=function(a){return this.createGeometry(this.getPoints(a,true))};
THREE.CurvePath.prototype.createSpacedPointsGeometry=function(a){return this.createGeometry(this.getSpacedPoints(a,true))};THREE.CurvePath.prototype.createGeometry=function(a){for(var b=new THREE.Geometry,c=0;c<a.length;c++)b.vertices.push(new THREE.Vector3(a[c].x,a[c].y,0));return b};THREE.CurvePath.prototype.addWrapPath=function(a){this.bends.push(a)};
THREE.CurvePath.prototype.getTransformedPoints=function(a,b){var c=this.getPoints(a),d,e;if(!b)b=this.bends;d=0;for(e=b.length;d<e;d++)c=this.getWrapPoints(c,b[d]);return c};THREE.CurvePath.prototype.getTransformedSpacedPoints=function(a,b){var c=this.getSpacedPoints(a),d,e;if(!b)b=this.bends;d=0;for(e=b.length;d<e;d++)c=this.getWrapPoints(c,b[d]);return c};
THREE.CurvePath.prototype.getWrapPoints=function(a,b){var c=this.getBoundingBox(),d,e,f,g,h,j;d=0;for(e=a.length;d<e;d++){f=a[d];g=f.x;h=f.y;j=g/c.maxX;j=b.getUtoTmapping(j,g);g=b.getPoint(j);h=b.getNormalVector(j).multiplyScalar(h);f.x=g.x+h.x;f.y=g.y+h.y}return a};
THREE.EventTarget=function(){var a={};this.addEventListener=function(b,c){a[b]==void 0&&(a[b]=[]);a[b].indexOf(c)===-1&&a[b].push(c)};this.dispatchEvent=function(b){for(var c in a[b.type])a[b.type][c](b)};this.removeEventListener=function(b,c){var d=a[b].indexOf(c);d!==-1&&a[b].splice(d,1)}};THREE.Gyroscope=function(){THREE.Object3D.call(this)};THREE.Gyroscope.prototype=new THREE.Object3D;THREE.Gyroscope.prototype.constructor=THREE.Gyroscope;
THREE.Gyroscope.prototype.updateMatrixWorld=function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a){if(this.parent){this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix);this.matrixWorld.decompose(this.translationWorld,this.rotationWorld,this.scaleWorld);this.matrix.decompose(this.translationObject,this.rotationObject,this.scaleObject);this.matrixWorld.compose(this.translationWorld,this.rotationObject,this.scaleWorld)}else this.matrixWorld.copy(this.matrix);
this.matrixWorldNeedsUpdate=false;a=true}for(var b=0,c=this.children.length;b<c;b++)this.children[b].updateMatrixWorld(a)};THREE.Gyroscope.prototype.translationWorld=new THREE.Vector3;THREE.Gyroscope.prototype.translationObject=new THREE.Vector3;THREE.Gyroscope.prototype.rotationWorld=new THREE.Quaternion;THREE.Gyroscope.prototype.rotationObject=new THREE.Quaternion;THREE.Gyroscope.prototype.scaleWorld=new THREE.Vector3;THREE.Gyroscope.prototype.scaleObject=new THREE.Vector3;
THREE.Path=function(a){THREE.CurvePath.call(this);this.actions=[];a&&this.fromPoints(a)};THREE.Path.prototype=new THREE.CurvePath;THREE.Path.prototype.constructor=THREE.Path;THREE.PathActions={MOVE_TO:"moveTo",LINE_TO:"lineTo",QUADRATIC_CURVE_TO:"quadraticCurveTo",BEZIER_CURVE_TO:"bezierCurveTo",CSPLINE_THRU:"splineThru",ARC:"arc"};THREE.Path.prototype.fromPoints=function(a){this.moveTo(a[0].x,a[0].y);for(var b=1,c=a.length;b<c;b++)this.lineTo(a[b].x,a[b].y)};
THREE.Path.prototype.moveTo=function(a,b){var c=Array.prototype.slice.call(arguments);this.actions.push({action:THREE.PathActions.MOVE_TO,args:c})};THREE.Path.prototype.lineTo=function(a,b){var c=Array.prototype.slice.call(arguments),d=this.actions[this.actions.length-1].args;this.curves.push(new THREE.LineCurve(new THREE.Vector2(d[d.length-2],d[d.length-1]),new THREE.Vector2(a,b)));this.actions.push({action:THREE.PathActions.LINE_TO,args:c})};
THREE.Path.prototype.quadraticCurveTo=function(a,b,c,d){var e=Array.prototype.slice.call(arguments),f=this.actions[this.actions.length-1].args;this.curves.push(new THREE.QuadraticBezierCurve(new THREE.Vector2(f[f.length-2],f[f.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,d)));this.actions.push({action:THREE.PathActions.QUADRATIC_CURVE_TO,args:e})};
THREE.Path.prototype.bezierCurveTo=function(a,b,c,d,e,f){var g=Array.prototype.slice.call(arguments),h=this.actions[this.actions.length-1].args;this.curves.push(new THREE.CubicBezierCurve(new THREE.Vector2(h[h.length-2],h[h.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,d),new THREE.Vector2(e,f)));this.actions.push({action:THREE.PathActions.BEZIER_CURVE_TO,args:g})};
THREE.Path.prototype.splineThru=function(a){var b=Array.prototype.slice.call(arguments),c=this.actions[this.actions.length-1].args,c=[new THREE.Vector2(c[c.length-2],c[c.length-1])];Array.prototype.push.apply(c,a);this.curves.push(new THREE.SplineCurve(c));this.actions.push({action:THREE.PathActions.CSPLINE_THRU,args:b})};
THREE.Path.prototype.arc=function(a,b,c,d,e,f){var g=Array.prototype.slice.call(arguments),h=this.actions[this.actions.length-1],h=new THREE.ArcCurve(h.x+a,h.y+b,c,d,e,f);this.curves.push(h);h=h.getPoint(f?1:0);g.push(h.x);g.push(h.y);this.actions.push({action:THREE.PathActions.ARC,args:g})};
THREE.Path.prototype.absarc=function(a,b,c,d,e,f){var g=Array.prototype.slice.call(arguments),h=new THREE.ArcCurve(a,b,c,d,e,f);this.curves.push(h);h=h.getPoint(f?1:0);g.push(h.x);g.push(h.y);this.actions.push({action:THREE.PathActions.ARC,args:g})};THREE.Path.prototype.getSpacedPoints=function(a){a||(a=40);for(var b=[],c=0;c<a;c++)b.push(this.getPoint(c/a));return b};
THREE.Path.prototype.getPoints=function(a,b){if(this.useSpacedPoints){console.log("tata");return this.getSpacedPoints(a,b)}var a=a||12,c=[],d,e,f,g,h,j,l,k,p,m,o,q,n;d=0;for(e=this.actions.length;d<e;d++){f=this.actions[d];g=f.action;f=f.args;switch(g){case THREE.PathActions.MOVE_TO:c.push(new THREE.Vector2(f[0],f[1]));break;case THREE.PathActions.LINE_TO:c.push(new THREE.Vector2(f[0],f[1]));break;case THREE.PathActions.QUADRATIC_CURVE_TO:h=f[2];j=f[3];p=f[0];m=f[1];if(c.length>0){g=c[c.length-1];
o=g.x;q=g.y}else{g=this.actions[d-1].args;o=g[g.length-2];q=g[g.length-1]}for(f=1;f<=a;f++){n=f/a;g=THREE.Shape.Utils.b2(n,o,p,h);n=THREE.Shape.Utils.b2(n,q,m,j);c.push(new THREE.Vector2(g,n))}break;case THREE.PathActions.BEZIER_CURVE_TO:h=f[4];j=f[5];p=f[0];m=f[1];l=f[2];k=f[3];if(c.length>0){g=c[c.length-1];o=g.x;q=g.y}else{g=this.actions[d-1].args;o=g[g.length-2];q=g[g.length-1]}for(f=1;f<=a;f++){n=f/a;g=THREE.Shape.Utils.b3(n,o,p,l,h);n=THREE.Shape.Utils.b3(n,q,m,k,j);c.push(new THREE.Vector2(g,
n))}break;case THREE.PathActions.CSPLINE_THRU:g=this.actions[d-1].args;n=[new THREE.Vector2(g[g.length-2],g[g.length-1])];g=a*f[0].length;n=n.concat(f[0]);n=new THREE.SplineCurve(n);for(f=1;f<=g;f++)c.push(n.getPointAt(f/g));break;case THREE.PathActions.ARC:h=f[0];j=f[1];l=f[2];p=f[3];m=!!f[5];k=f[4]-p;o=a*2;for(f=1;f<=o;f++){n=f/o;m||(n=1-n);n=p+n*k;g=h+l*Math.cos(n);n=j+l*Math.sin(n);c.push(new THREE.Vector2(g,n))}}}d=c[c.length-1];Math.abs(d.x-c[0].x)<1.0E-10&&Math.abs(d.y-c[0].y)<1.0E-10&&c.splice(c.length-
1,1);b&&c.push(c[0]);return c};THREE.Path.prototype.transform=function(a,b){this.getBoundingBox();return this.getWrapPoints(this.getPoints(b),a)};THREE.Path.prototype.nltransform=function(a,b,c,d,e,f){var g=this.getPoints(),h,j,l,k,p;h=0;for(j=g.length;h<j;h++){l=g[h];k=l.x;p=l.y;l.x=a*k+b*p+c;l.y=d*p+e*k+f}return g};
THREE.Path.prototype.debug=function(a){var b=this.getBoundingBox();if(!a){a=document.createElement("canvas");a.setAttribute("width",b.maxX+100);a.setAttribute("height",b.maxY+100);document.body.appendChild(a)}b=a.getContext("2d");b.fillStyle="white";b.fillRect(0,0,a.width,a.height);b.strokeStyle="black";b.beginPath();var c,d,e,a=0;for(c=this.actions.length;a<c;a++){d=this.actions[a];e=d.args;d=d.action;d!=THREE.PathActions.CSPLINE_THRU&&b[d].apply(b,e)}b.stroke();b.closePath();b.strokeStyle="red";
d=this.getPoints();a=0;for(c=d.length;a<c;a++){e=d[a];b.beginPath();b.arc(e.x,e.y,1.5,0,Math.PI*2,false);b.stroke();b.closePath()}};
THREE.Path.prototype.toShapes=function(){var a,b,c,d,e=[],f=new THREE.Path;a=0;for(b=this.actions.length;a<b;a++){c=this.actions[a];d=c.args;c=c.action;if(c==THREE.PathActions.MOVE_TO&&f.actions.length!=0){e.push(f);f=new THREE.Path}f[c].apply(f,d)}f.actions.length!=0&&e.push(f);if(e.length==0)return[];var g;d=[];a=!THREE.Shape.Utils.isClockWise(e[0].getPoints());if(e.length==1){f=e[0];g=new THREE.Shape;g.actions=f.actions;g.curves=f.curves;d.push(g);return d}if(a){g=new THREE.Shape;a=0;for(b=e.length;a<
b;a++){f=e[a];if(THREE.Shape.Utils.isClockWise(f.getPoints())){g.actions=f.actions;g.curves=f.curves;d.push(g);g=new THREE.Shape}else g.holes.push(f)}}else{a=0;for(b=e.length;a<b;a++){f=e[a];if(THREE.Shape.Utils.isClockWise(f.getPoints())){g&&d.push(g);g=new THREE.Shape;g.actions=f.actions;g.curves=f.curves}else g.holes.push(f)}d.push(g)}return d};THREE.Shape=function(){THREE.Path.apply(this,arguments);this.holes=[]};THREE.Shape.prototype=new THREE.Path;THREE.Shape.prototype.constructor=THREE.Path;
THREE.Shape.prototype.extrude=function(a){return new THREE.ExtrudeGeometry(this,a)};THREE.Shape.prototype.getPointsHoles=function(a){var b,c=this.holes.length,d=[];for(b=0;b<c;b++)d[b]=this.holes[b].getTransformedPoints(a,this.bends);return d};THREE.Shape.prototype.getSpacedPointsHoles=function(a){var b,c=this.holes.length,d=[];for(b=0;b<c;b++)d[b]=this.holes[b].getTransformedSpacedPoints(a,this.bends);return d};
THREE.Shape.prototype.extractAllPoints=function(a){return{shape:this.getTransformedPoints(a),holes:this.getPointsHoles(a)}};THREE.Shape.prototype.extractPoints=function(a){return this.useSpacedPoints?this.extractAllSpacedPoints(a):this.extractAllPoints(a)};THREE.Shape.prototype.extractAllSpacedPoints=function(a){return{shape:this.getTransformedSpacedPoints(a),holes:this.getSpacedPointsHoles(a)}};
THREE.Shape.Utils={removeHoles:function(a,b){var c=a.concat(),d=c.concat(),e,f,g,h,j,l,k,p,m,o,q=[];for(j=0;j<b.length;j++){l=b[j];Array.prototype.push.apply(d,l);f=Number.POSITIVE_INFINITY;for(e=0;e<l.length;e++){m=l[e];o=[];for(p=0;p<c.length;p++){k=c[p];k=m.distanceToSquared(k);o.push(k);if(k<f){f=k;g=e;h=p}}}e=h-1>=0?h-1:c.length-1;f=g-1>=0?g-1:l.length-1;var n=[l[g],c[h],c[e]];p=THREE.FontUtils.Triangulate.area(n);var r=[l[g],l[f],c[h]];m=THREE.FontUtils.Triangulate.area(r);o=h;k=g;h=h+1;g=g+
-1;h<0&&(h=h+c.length);h=h%c.length;g<0&&(g=g+l.length);g=g%l.length;e=h-1>=0?h-1:c.length-1;f=g-1>=0?g-1:l.length-1;n=[l[g],c[h],c[e]];n=THREE.FontUtils.Triangulate.area(n);r=[l[g],l[f],c[h]];r=THREE.FontUtils.Triangulate.area(r);if(p+m>n+r){h=o;g=k;h<0&&(h=h+c.length);h=h%c.length;g<0&&(g=g+l.length);g=g%l.length;e=h-1>=0?h-1:c.length-1;f=g-1>=0?g-1:l.length-1}p=c.slice(0,h);m=c.slice(h);o=l.slice(g);k=l.slice(0,g);f=[l[g],l[f],c[h]];q.push([l[g],c[h],c[e]]);q.push(f);c=p.concat(o).concat(k).concat(m)}return{shape:c,
isolatedPts:q,allpoints:d}},triangulateShape:function(a,b){var c=THREE.Shape.Utils.removeHoles(a,b),d=c.allpoints,e=c.isolatedPts,c=THREE.FontUtils.Triangulate(c.shape,false),f,g,h,j,l={};f=0;for(g=d.length;f<g;f++){j=d[f].x+":"+d[f].y;l[j]!==void 0&&console.log("Duplicate point",j);l[j]=f}f=0;for(g=c.length;f<g;f++){h=c[f];for(d=0;d<3;d++){j=h[d].x+":"+h[d].y;j=l[j];j!==void 0&&(h[d]=j)}}f=0;for(g=e.length;f<g;f++){h=e[f];for(d=0;d<3;d++){j=h[d].x+":"+h[d].y;j=l[j];j!==void 0&&(h[d]=j)}}return c.concat(e)},
isClockWise:function(a){return THREE.FontUtils.Triangulate.area(a)<0},b2p0:function(a,b){var c=1-a;return c*c*b},b2p1:function(a,b){return 2*(1-a)*a*b},b2p2:function(a,b){return a*a*b},b2:function(a,b,c,d){return this.b2p0(a,b)+this.b2p1(a,c)+this.b2p2(a,d)},b3p0:function(a,b){var c=1-a;return c*c*c*b},b3p1:function(a,b){var c=1-a;return 3*c*c*a*b},b3p2:function(a,b){return 3*(1-a)*a*a*b},b3p3:function(a,b){return a*a*a*b},b3:function(a,b,c,d,e){return this.b3p0(a,b)+this.b3p1(a,c)+this.b3p2(a,d)+
this.b3p3(a,e)}};THREE.TextPath=function(a,b){THREE.Path.call(this);this.parameters=b||{};this.set(a)};THREE.TextPath.prototype.set=function(a,b){b=b||this.parameters;this.text=a;var c=b.curveSegments!==void 0?b.curveSegments:4,d=b.font!==void 0?b.font:"helvetiker",e=b.weight!==void 0?b.weight:"normal",f=b.style!==void 0?b.style:"normal";THREE.FontUtils.size=b.size!==void 0?b.size:100;THREE.FontUtils.divisions=c;THREE.FontUtils.face=d;THREE.FontUtils.weight=e;THREE.FontUtils.style=f};
THREE.TextPath.prototype.toShapes=function(){for(var a=THREE.FontUtils.drawText(this.text).paths,b=[],c=0,d=a.length;c<d;c++)Array.prototype.push.apply(b,a[c].toShapes());return b};
THREE.AnimationHandler=function(){var a=[],b={},c={update:function(b){for(var c=0;c<a.length;c++)a[c].update(b)},addToUpdate:function(b){a.indexOf(b)===-1&&a.push(b)},removeFromUpdate:function(b){b=a.indexOf(b);b!==-1&&a.splice(b,1)},add:function(a){b[a.name]!==void 0&&console.log("THREE.AnimationHandler.add: Warning! "+a.name+" already exists in library. Overwriting.");b[a.name]=a;if(a.initialized!==true){for(var c=0;c<a.hierarchy.length;c++){for(var d=0;d<a.hierarchy[c].keys.length;d++){if(a.hierarchy[c].keys[d].time<
0)a.hierarchy[c].keys[d].time=0;if(a.hierarchy[c].keys[d].rot!==void 0&&!(a.hierarchy[c].keys[d].rot instanceof THREE.Quaternion)){var h=a.hierarchy[c].keys[d].rot;a.hierarchy[c].keys[d].rot=new THREE.Quaternion(h[0],h[1],h[2],h[3])}}if(a.hierarchy[c].keys.length&&a.hierarchy[c].keys[0].morphTargets!==void 0){h={};for(d=0;d<a.hierarchy[c].keys.length;d++)for(var j=0;j<a.hierarchy[c].keys[d].morphTargets.length;j++){var l=a.hierarchy[c].keys[d].morphTargets[j];h[l]=-1}a.hierarchy[c].usedMorphTargets=
h;for(d=0;d<a.hierarchy[c].keys.length;d++){var k={};for(l in h){for(j=0;j<a.hierarchy[c].keys[d].morphTargets.length;j++)if(a.hierarchy[c].keys[d].morphTargets[j]===l){k[l]=a.hierarchy[c].keys[d].morphTargetsInfluences[j];break}j===a.hierarchy[c].keys[d].morphTargets.length&&(k[l]=0)}a.hierarchy[c].keys[d].morphTargetsInfluences=k}}for(d=1;d<a.hierarchy[c].keys.length;d++)if(a.hierarchy[c].keys[d].time===a.hierarchy[c].keys[d-1].time){a.hierarchy[c].keys.splice(d,1);d--}for(d=0;d<a.hierarchy[c].keys.length;d++)a.hierarchy[c].keys[d].index=
d}d=parseInt(a.length*a.fps,10);a.JIT={};a.JIT.hierarchy=[];for(c=0;c<a.hierarchy.length;c++)a.JIT.hierarchy.push(Array(d));a.initialized=true}},get:function(a){if(typeof a==="string"){if(b[a])return b[a];console.log("THREE.AnimationHandler.get: Couldn't find animation "+a);return null}},parse:function(a){var b=[];if(a instanceof THREE.SkinnedMesh)for(var c=0;c<a.bones.length;c++)b.push(a.bones[c]);else d(a,b);return b}},d=function(a,b){b.push(a);for(var c=0;c<a.children.length;c++)d(a.children[c],
b)};c.LINEAR=0;c.CATMULLROM=1;c.CATMULLROM_FORWARD=2;return c}();THREE.Animation=function(a,b,c,d){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=1;this.isPlaying=false;this.loop=this.isPaused=true;this.interpolationType=c!==void 0?c:THREE.AnimationHandler.LINEAR;this.JITCompile=d!==void 0?d:true;this.points=[];this.target=new THREE.Vector3};
THREE.Animation.prototype.play=function(a,b){if(!this.isPlaying){this.isPlaying=true;this.loop=a!==void 0?a:true;this.currentTime=b!==void 0?b:0;var c,d=this.hierarchy.length,e;for(c=0;c<d;c++){e=this.hierarchy[c];if(this.interpolationType!==THREE.AnimationHandler.CATMULLROM_FORWARD)e.useQuaternion=true;e.matrixAutoUpdate=true;if(e.animationCache===void 0){e.animationCache={};e.animationCache.prevKey={pos:0,rot:0,scl:0};e.animationCache.nextKey={pos:0,rot:0,scl:0};e.animationCache.originalMatrix=
e instanceof THREE.Bone?e.skinMatrix:e.matrix}var f=e.animationCache.prevKey;e=e.animationCache.nextKey;f.pos=this.data.hierarchy[c].keys[0];f.rot=this.data.hierarchy[c].keys[0];f.scl=this.data.hierarchy[c].keys[0];e.pos=this.getNextKeyWith("pos",c,1);e.rot=this.getNextKeyWith("rot",c,1);e.scl=this.getNextKeyWith("scl",c,1)}this.update(0)}this.isPaused=false;THREE.AnimationHandler.addToUpdate(this)};
THREE.Animation.prototype.pause=function(){this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};
THREE.Animation.prototype.stop=function(){this.isPaused=this.isPlaying=false;THREE.AnimationHandler.removeFromUpdate(this);for(var a=0;a<this.hierarchy.length;a++)if(this.hierarchy[a].animationCache!==void 0){this.hierarchy[a]instanceof THREE.Bone?this.hierarchy[a].skinMatrix=this.hierarchy[a].animationCache.originalMatrix:this.hierarchy[a].matrix=this.hierarchy[a].animationCache.originalMatrix;delete this.hierarchy[a].animationCache}};
THREE.Animation.prototype.update=function(a){if(this.isPlaying){var b=["pos","rot","scl"],c,d,e,f,g,h,j,l,k=this.data.JIT.hierarchy,p,m;m=this.currentTime=this.currentTime+a*this.timeScale;p=this.currentTime=this.currentTime%this.data.length;l=parseInt(Math.min(p*this.data.fps,this.data.length*this.data.fps),10);for(var o=0,q=this.hierarchy.length;o<q;o++){a=this.hierarchy[o];j=a.animationCache;if(this.JITCompile&&k[o][l]!==void 0)if(a instanceof THREE.Bone){a.skinMatrix=k[o][l];a.matrixAutoUpdate=
false;a.matrixWorldNeedsUpdate=false}else{a.matrix=k[o][l];a.matrixAutoUpdate=false;a.matrixWorldNeedsUpdate=true}else{if(this.JITCompile)a instanceof THREE.Bone?a.skinMatrix=a.animationCache.originalMatrix:a.matrix=a.animationCache.originalMatrix;for(var n=0;n<3;n++){c=b[n];g=j.prevKey[c];h=j.nextKey[c];if(h.time<=m){if(p<m)if(this.loop){g=this.data.hierarchy[o].keys[0];for(h=this.getNextKeyWith(c,o,1);h.time<p;){g=h;h=this.getNextKeyWith(c,o,h.index+1)}}else{this.stop();return}else{do{g=h;h=this.getNextKeyWith(c,
o,h.index+1)}while(h.time<p)}j.prevKey[c]=g;j.nextKey[c]=h}a.matrixAutoUpdate=true;a.matrixWorldNeedsUpdate=true;d=(p-g.time)/(h.time-g.time);e=g[c];f=h[c];if(d<0||d>1){console.log("THREE.Animation.update: Warning! Scale out of bounds:"+d+" on bone "+o);d=d<0?0:1}if(c==="pos"){c=a.position;if(this.interpolationType===THREE.AnimationHandler.LINEAR){c.x=e[0]+(f[0]-e[0])*d;c.y=e[1]+(f[1]-e[1])*d;c.z=e[2]+(f[2]-e[2])*d}else if(this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===
THREE.AnimationHandler.CATMULLROM_FORWARD){this.points[0]=this.getPrevKeyWith("pos",o,g.index-1).pos;this.points[1]=e;this.points[2]=f;this.points[3]=this.getNextKeyWith("pos",o,h.index+1).pos;d=d*0.33+0.33;e=this.interpolateCatmullRom(this.points,d);c.x=e[0];c.y=e[1];c.z=e[2];if(this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD){d=this.interpolateCatmullRom(this.points,d*1.01);this.target.set(d[0],d[1],d[2]);this.target.subSelf(c);this.target.y=0;this.target.normalize();d=Math.atan2(this.target.x,
this.target.z);a.rotation.set(0,d,0)}}}else if(c==="rot")THREE.Quaternion.slerp(e,f,a.quaternion,d);else if(c==="scl"){c=a.scale;c.x=e[0]+(f[0]-e[0])*d;c.y=e[1]+(f[1]-e[1])*d;c.z=e[2]+(f[2]-e[2])*d}}}}if(this.JITCompile&&k[0][l]===void 0){this.hierarchy[0].updateMatrixWorld(true);for(o=0;o<this.hierarchy.length;o++)k[o][l]=this.hierarchy[o]instanceof THREE.Bone?this.hierarchy[o].skinMatrix.clone():this.hierarchy[o].matrix.clone()}}};
THREE.Animation.prototype.interpolateCatmullRom=function(a,b){var c=[],d=[],e,f,g,h,j,l;e=(a.length-1)*b;f=Math.floor(e);e=e-f;c[0]=f===0?f:f-1;c[1]=f;c[2]=f>a.length-2?f:f+1;c[3]=f>a.length-3?f:f+2;f=a[c[0]];h=a[c[1]];j=a[c[2]];l=a[c[3]];c=e*e;g=e*c;d[0]=this.interpolate(f[0],h[0],j[0],l[0],e,c,g);d[1]=this.interpolate(f[1],h[1],j[1],l[1],e,c,g);d[2]=this.interpolate(f[2],h[2],j[2],l[2],e,c,g);return d};
THREE.Animation.prototype.interpolate=function(a,b,c,d,e,f,g){a=(c-a)*0.5;d=(d-b)*0.5;return(2*(b-c)+a+d)*g+(-3*(b-c)-2*a-d)*f+a*e+b};THREE.Animation.prototype.getNextKeyWith=function(a,b,c){for(var d=this.data.hierarchy[b].keys,c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?c<d.length-1?c:d.length-1:c%d.length;c<d.length;c++)if(d[c][a]!==void 0)return d[c];return this.data.hierarchy[b].keys[0]};
THREE.Animation.prototype.getPrevKeyWith=function(a,b,c){for(var d=this.data.hierarchy[b].keys,c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?c>0?c:0:c>=0?c:c+d.length;c>=0;c--)if(d[c][a]!==void 0)return d[c];return this.data.hierarchy[b].keys[d.length-1]};
THREE.KeyFrameAnimation=function(a,b,c){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=0.001;this.isPlaying=false;this.loop=this.isPaused=true;this.JITCompile=c!==void 0?c:true;a=0;for(b=this.hierarchy.length;a<b;a++){var c=this.data.hierarchy[a].sids,d=this.hierarchy[a];if(this.data.hierarchy[a].keys.length&&c){for(var e=0;e<c.length;e++){var f=c[e],g=this.getNextKeyWith(f,a,0);g&&g.apply(f)}d.matrixAutoUpdate=
false;this.data.hierarchy[a].node.updateMatrix();d.matrixWorldNeedsUpdate=true}}};
THREE.KeyFrameAnimation.prototype.play=function(a,b){if(!this.isPlaying){this.isPlaying=true;this.loop=a!==void 0?a:true;this.currentTime=b!==void 0?b:0;this.startTimeMs=b;this.startTime=1E7;this.endTime=-this.startTime;var c,d=this.hierarchy.length,e,f;for(c=0;c<d;c++){e=this.hierarchy[c];f=this.data.hierarchy[c];e.useQuaternion=true;if(f.animationCache===void 0){f.animationCache={};f.animationCache.prevKey=null;f.animationCache.nextKey=null;f.animationCache.originalMatrix=e instanceof THREE.Bone?
e.skinMatrix:e.matrix}e=this.data.hierarchy[c].keys;if(e.length){f.animationCache.prevKey=e[0];f.animationCache.nextKey=e[1];this.startTime=Math.min(e[0].time,this.startTime);this.endTime=Math.max(e[e.length-1].time,this.endTime)}}this.update(0)}this.isPaused=false;THREE.AnimationHandler.addToUpdate(this)};THREE.KeyFrameAnimation.prototype.pause=function(){this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};
THREE.KeyFrameAnimation.prototype.stop=function(){this.isPaused=this.isPlaying=false;THREE.AnimationHandler.removeFromUpdate(this);for(var a=0;a<this.data.hierarchy.length;a++){var b=this.hierarchy[a],c=this.data.hierarchy[a];if(c.animationCache!==void 0){var d=c.animationCache.originalMatrix;if(b instanceof THREE.Bone){d.copy(b.skinMatrix);b.skinMatrix=d}else{d.copy(b.matrix);b.matrix=d}delete c.animationCache}}};
THREE.KeyFrameAnimation.prototype.update=function(a){if(this.isPlaying){var b,c,d,e,f=this.data.JIT.hierarchy,g,h,j;h=this.currentTime=this.currentTime+a*this.timeScale;g=this.currentTime=this.currentTime%this.data.length;if(g<this.startTimeMs)g=this.currentTime=this.startTimeMs+g;e=parseInt(Math.min(g*this.data.fps,this.data.length*this.data.fps),10);if((j=g<h)&&!this.loop){for(var a=0,l=this.hierarchy.length;a<l;a++){var k=this.data.hierarchy[a].keys,f=this.data.hierarchy[a].sids;d=k.length-1;e=
this.hierarchy[a];if(k.length){for(k=0;k<f.length;k++){g=f[k];(h=this.getPrevKeyWith(g,a,d))&&h.apply(g)}this.data.hierarchy[a].node.updateMatrix();e.matrixWorldNeedsUpdate=true}}this.stop()}else if(!(g<this.startTime)){a=0;for(l=this.hierarchy.length;a<l;a++){d=this.hierarchy[a];b=this.data.hierarchy[a];var k=b.keys,p=b.animationCache;if(this.JITCompile&&f[a][e]!==void 0)if(d instanceof THREE.Bone){d.skinMatrix=f[a][e];d.matrixWorldNeedsUpdate=false}else{d.matrix=f[a][e];d.matrixWorldNeedsUpdate=
true}else if(k.length){if(this.JITCompile&&p)d instanceof THREE.Bone?d.skinMatrix=p.originalMatrix:d.matrix=p.originalMatrix;b=p.prevKey;c=p.nextKey;if(b&&c){if(c.time<=h){if(j&&this.loop){b=k[0];for(c=k[1];c.time<g;){b=c;c=k[b.index+1]}}else if(!j)for(var m=k.length-1;c.time<g&&c.index!==m;){b=c;c=k[b.index+1]}p.prevKey=b;p.nextKey=c}c.time>=g?b.interpolate(c,g):b.interpolate(c,c.time)}this.data.hierarchy[a].node.updateMatrix();d.matrixWorldNeedsUpdate=true}}if(this.JITCompile&&f[0][e]===void 0){this.hierarchy[0].updateMatrixWorld(true);
for(a=0;a<this.hierarchy.length;a++)f[a][e]=this.hierarchy[a]instanceof THREE.Bone?this.hierarchy[a].skinMatrix.clone():this.hierarchy[a].matrix.clone()}}}};THREE.KeyFrameAnimation.prototype.getNextKeyWith=function(a,b,c){b=this.data.hierarchy[b].keys;for(c=c%b.length;c<b.length;c++)if(b[c].hasTarget(a))return b[c];return b[0]};
THREE.KeyFrameAnimation.prototype.getPrevKeyWith=function(a,b,c){b=this.data.hierarchy[b].keys;for(c=c>=0?c:c+b.length;c>=0;c--)if(b[c].hasTarget(a))return b[c];return b[b.length-1]};
THREE.CubeCamera=function(a,b,c){THREE.Object3D.call(this);var d=new THREE.PerspectiveCamera(90,1,a,b);d.up.set(0,-1,0);d.lookAt(new THREE.Vector3(1,0,0));this.add(d);var e=new THREE.PerspectiveCamera(90,1,a,b);e.up.set(0,-1,0);e.lookAt(new THREE.Vector3(-1,0,0));this.add(e);var f=new THREE.PerspectiveCamera(90,1,a,b);f.up.set(0,0,1);f.lookAt(new THREE.Vector3(0,1,0));this.add(f);var g=new THREE.PerspectiveCamera(90,1,a,b);g.up.set(0,0,-1);g.lookAt(new THREE.Vector3(0,-1,0));this.add(g);var h=new THREE.PerspectiveCamera(90,
1,a,b);h.up.set(0,-1,0);h.lookAt(new THREE.Vector3(0,0,1));this.add(h);var j=new THREE.PerspectiveCamera(90,1,a,b);j.up.set(0,-1,0);j.lookAt(new THREE.Vector3(0,0,-1));this.add(j);this.renderTarget=new THREE.WebGLRenderTargetCube(c,c,{format:THREE.RGBFormat,magFilter:THREE.LinearFilter,minFilter:THREE.LinearFilter});this.updateCubeMap=function(a,b){var c=this.renderTarget,m=c.generateMipmaps;c.generateMipmaps=false;c.activeCubeFace=0;a.render(b,d,c);c.activeCubeFace=1;a.render(b,e,c);c.activeCubeFace=
2;a.render(b,f,c);c.activeCubeFace=3;a.render(b,g,c);c.activeCubeFace=4;a.render(b,h,c);c.generateMipmaps=m;c.activeCubeFace=5;a.render(b,j,c)}};THREE.CubeCamera.prototype=new THREE.Object3D;THREE.CubeCamera.prototype.constructor=THREE.CubeCamera;
THREE.CombinedCamera=function(a,b,c,d,e,f,g){THREE.Camera.call(this);this.fov=c;this.left=-a/2;this.right=a/2;this.top=b/2;this.bottom=-b/2;this.cameraO=new THREE.OrthographicCamera(a/-2,a/2,b/2,b/-2,f,g);this.cameraP=new THREE.PerspectiveCamera(c,a/b,d,e);this.zoom=1;this.toPerspective()};THREE.CombinedCamera.prototype=new THREE.Camera;THREE.CombinedCamera.prototype.constructor=THREE.CombinedCamera;
THREE.CombinedCamera.prototype.toPerspective=function(){this.near=this.cameraP.near;this.far=this.cameraP.far;this.cameraP.fov=this.fov/this.zoom;this.cameraP.updateProjectionMatrix();this.projectionMatrix=this.cameraP.projectionMatrix;this.inPersepectiveMode=true;this.inOrthographicMode=false};
THREE.CombinedCamera.prototype.toOrthographic=function(){var a=this.cameraP.aspect,b=(this.cameraP.near+this.cameraP.far)/2,b=Math.tan(this.fov/2)*b,a=2*b*a/2,b=b/this.zoom,a=a/this.zoom;this.cameraO.left=-a;this.cameraO.right=a;this.cameraO.top=b;this.cameraO.bottom=-b;this.cameraO.updateProjectionMatrix();this.near=this.cameraO.near;this.far=this.cameraO.far;this.projectionMatrix=this.cameraO.projectionMatrix;this.inPersepectiveMode=false;this.inOrthographicMode=true};
THREE.CombinedCamera.prototype.setSize=function(a,b){this.cameraP.aspect=a/b;this.left=-a/2;this.right=a/2;this.top=b/2;this.bottom=-b/2};THREE.CombinedCamera.prototype.setFov=function(a){this.fov=a;this.inPersepectiveMode?this.toPerspective():this.toOrthographic()};THREE.CombinedCamera.prototype.updateProjectionMatrix=function(){if(this.inPersepectiveMode)this.toPerspective();else{this.toPerspective();this.toOrthographic()}};
THREE.CombinedCamera.prototype.setLens=function(a,b){var c=2*Math.atan((b!==void 0?b:24)/(a*2))*(180/Math.PI);this.setFov(c);return c};THREE.CombinedCamera.prototype.setZoom=function(a){this.zoom=a;this.inPersepectiveMode?this.toPerspective():this.toOrthographic()};THREE.CombinedCamera.prototype.toFrontView=function(){this.rotation.x=0;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=false};
THREE.CombinedCamera.prototype.toBackView=function(){this.rotation.x=0;this.rotation.y=Math.PI;this.rotation.z=0;this.rotationAutoUpdate=false};THREE.CombinedCamera.prototype.toLeftView=function(){this.rotation.x=0;this.rotation.y=-Math.PI/2;this.rotation.z=0;this.rotationAutoUpdate=false};THREE.CombinedCamera.prototype.toRightView=function(){this.rotation.x=0;this.rotation.y=Math.PI/2;this.rotation.z=0;this.rotationAutoUpdate=false};
THREE.CombinedCamera.prototype.toTopView=function(){this.rotation.x=-Math.PI/2;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=false};THREE.CombinedCamera.prototype.toBottomView=function(){this.rotation.x=Math.PI/2;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=false};
THREE.FirstPersonControls=function(a,b){function c(a,b){return function(){b.apply(a,arguments)}}this.object=a;this.target=new THREE.Vector3(0,0,0);this.domElement=b!==void 0?b:document;this.movementSpeed=1;this.lookSpeed=0.005;this.noFly=false;this.lookVertical=true;this.autoForward=false;this.activeLook=true;this.heightSpeed=false;this.heightCoef=1;this.heightMin=0;this.constrainVertical=false;this.verticalMin=0;this.verticalMax=Math.PI;this.theta=this.phi=this.lon=this.lat=this.mouseY=this.mouseX=
this.autoSpeedFactor=0;this.mouseDragOn=this.freeze=this.moveRight=this.moveLeft=this.moveBackward=this.moveForward=false;if(this.domElement===document){this.viewHalfX=window.innerWidth/2;this.viewHalfY=window.innerHeight/2}else{this.viewHalfX=this.domElement.offsetWidth/2;this.viewHalfY=this.domElement.offsetHeight/2;this.domElement.setAttribute("tabindex",-1)}this.onMouseDown=function(a){this.domElement!==document&&this.domElement.focus();a.preventDefault();a.stopPropagation();if(this.activeLook)switch(a.button){case 0:this.moveForward=
true;break;case 2:this.moveBackward=true}this.mouseDragOn=true};this.onMouseUp=function(a){a.preventDefault();a.stopPropagation();if(this.activeLook)switch(a.button){case 0:this.moveForward=false;break;case 2:this.moveBackward=false}this.mouseDragOn=false};this.onMouseMove=function(a){if(this.domElement===document){this.mouseX=a.pageX-this.viewHalfX;this.mouseY=a.pageY-this.viewHalfY}else{this.mouseX=a.pageX-this.domElement.offsetLeft-this.viewHalfX;this.mouseY=a.pageY-this.domElement.offsetTop-this.viewHalfY}};
this.onKeyDown=function(a){switch(a.keyCode){case 38:case 87:this.moveForward=true;break;case 37:case 65:this.moveLeft=true;break;case 40:case 83:this.moveBackward=true;break;case 39:case 68:this.moveRight=true;break;case 82:this.moveUp=true;break;case 70:this.moveDown=true;break;case 81:this.freeze=!this.freeze}};this.onKeyUp=function(a){switch(a.keyCode){case 38:case 87:this.moveForward=false;break;case 37:case 65:this.moveLeft=false;break;case 40:case 83:this.moveBackward=false;break;case 39:case 68:this.moveRight=
false;break;case 82:this.moveUp=false;break;case 70:this.moveDown=false}};this.update=function(a){var b=0;if(!this.freeze){if(this.heightSpeed){b=THREE.Math.clamp(this.object.position.y,this.heightMin,this.heightMax)-this.heightMin;this.autoSpeedFactor=a*b*this.heightCoef}else this.autoSpeedFactor=0;b=a*this.movementSpeed;(this.moveForward||this.autoForward&&!this.moveBackward)&&this.object.translateZ(-(b+this.autoSpeedFactor));this.moveBackward&&this.object.translateZ(b);this.moveLeft&&this.object.translateX(-b);
this.moveRight&&this.object.translateX(b);this.moveUp&&this.object.translateY(b);this.moveDown&&this.object.translateY(-b);a=a*this.lookSpeed;this.activeLook||(a=0);this.lon=this.lon+this.mouseX*a;if(this.lookVertical)this.lat=this.lat-this.mouseY*a;this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*Math.PI/180;this.theta=this.lon*Math.PI/180;var b=this.target,c=this.object.position;b.x=c.x+100*Math.sin(this.phi)*Math.cos(this.theta);b.y=c.y+100*Math.cos(this.phi);b.z=c.z+100*Math.sin(this.phi)*
Math.sin(this.theta);b=1;this.constrainVertical&&(b=Math.PI/(this.verticalMax-this.verticalMin));this.lon=this.lon+this.mouseX*a;if(this.lookVertical)this.lat=this.lat-this.mouseY*a*b;this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*Math.PI/180;this.theta=this.lon*Math.PI/180;if(this.constrainVertical)this.phi=THREE.Math.mapLinear(this.phi,0,Math.PI,this.verticalMin,this.verticalMax);b=this.target;c=this.object.position;b.x=c.x+100*Math.sin(this.phi)*Math.cos(this.theta);b.y=c.y+
100*Math.cos(this.phi);b.z=c.z+100*Math.sin(this.phi)*Math.sin(this.theta);this.object.lookAt(b)}};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},false);this.domElement.addEventListener("mousemove",c(this,this.onMouseMove),false);this.domElement.addEventListener("mousedown",c(this,this.onMouseDown),false);this.domElement.addEventListener("mouseup",c(this,this.onMouseUp),false);this.domElement.addEventListener("keydown",c(this,this.onKeyDown),false);this.domElement.addEventListener("keyup",
c(this,this.onKeyUp),false)};
THREE.PathControls=function(a,b){function c(a){return(a=a*2)<1?0.5*a*a:-0.5*(--a*(a-2)-1)}function d(a,b){return function(){b.apply(a,arguments)}}function e(a,b,c,d){var e={name:c,fps:0.6,length:d,hierarchy:[]},f,g=b.getControlPointsArray(),h=b.getLength(),r=g.length,u=0;f=r-1;b={parent:-1,keys:[]};b.keys[0]={time:0,pos:g[0],rot:[0,0,0,1],scl:[1,1,1]};b.keys[f]={time:d,pos:g[f],rot:[0,0,0,1],scl:[1,1,1]};for(f=1;f<r-1;f++){u=d*h.chunks[f]/h.total;b.keys[f]={time:u,pos:g[f]}}e.hierarchy[0]=b;THREE.AnimationHandler.add(e);
return new THREE.Animation(a,c,THREE.AnimationHandler.CATMULLROM_FORWARD,false)}function f(a,b){var c,d,e=new THREE.Geometry;for(c=0;c<a.points.length*b;c++){d=c/(a.points.length*b);d=a.getPoint(d);e.vertices[c]=new THREE.Vector3(d.x,d.y,d.z)}return e}this.object=a;this.domElement=b!==void 0?b:document;this.id="PathControls"+THREE.PathControlsIdCounter++;this.duration=1E4;this.waypoints=[];this.useConstantSpeed=true;this.resamplingCoef=50;this.debugPath=new THREE.Object3D;this.debugDummy=new THREE.Object3D;
this.animationParent=new THREE.Object3D;this.lookSpeed=0.005;this.lookHorizontal=this.lookVertical=true;this.verticalAngleMap={srcRange:[0,2*Math.PI],dstRange:[0,2*Math.PI]};this.horizontalAngleMap={srcRange:[0,2*Math.PI],dstRange:[0,2*Math.PI]};this.target=new THREE.Object3D;this.theta=this.phi=this.lon=this.lat=this.mouseY=this.mouseX=0;if(this.domElement===document){this.viewHalfX=window.innerWidth/2;this.viewHalfY=window.innerHeight/2}else{this.viewHalfX=this.domElement.offsetWidth/2;this.viewHalfY=
this.domElement.offsetHeight/2;this.domElement.setAttribute("tabindex",-1)}var g=Math.PI*2,h=Math.PI/180;this.update=function(a){var b;if(this.lookHorizontal)this.lon=this.lon+this.mouseX*this.lookSpeed*a;if(this.lookVertical)this.lat=this.lat-this.mouseY*this.lookSpeed*a;this.lon=Math.max(0,Math.min(360,this.lon));this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*h;this.theta=this.lon*h;a=this.phi%g;this.phi=a>=0?a:a+g;b=this.verticalAngleMap.srcRange;a=this.verticalAngleMap.dstRange;
b=THREE.Math.mapLinear(this.phi,b[0],b[1],a[0],a[1]);var d=a[1]-a[0];this.phi=c((b-a[0])/d)*d+a[0];b=this.horizontalAngleMap.srcRange;a=this.horizontalAngleMap.dstRange;b=THREE.Math.mapLinear(this.theta,b[0],b[1],a[0],a[1]);d=a[1]-a[0];this.theta=c((b-a[0])/d)*d+a[0];a=this.target.position;a.x=100*Math.sin(this.phi)*Math.cos(this.theta);a.y=100*Math.cos(this.phi);a.z=100*Math.sin(this.phi)*Math.sin(this.theta);this.object.lookAt(this.target.position)};this.onMouseMove=function(a){if(this.domElement===
document){this.mouseX=a.pageX-this.viewHalfX;this.mouseY=a.pageY-this.viewHalfY}else{this.mouseX=a.pageX-this.domElement.offsetLeft-this.viewHalfX;this.mouseY=a.pageY-this.domElement.offsetTop-this.viewHalfY}};this.init=function(){this.spline=new THREE.Spline;this.spline.initFromArray(this.waypoints);this.useConstantSpeed&&this.spline.reparametrizeByArcLength(this.resamplingCoef);if(this.createDebugDummy){var a=new THREE.MeshLambertMaterial({color:30719}),b=new THREE.MeshLambertMaterial({color:65280}),
c=new THREE.CubeGeometry(10,10,20),g=new THREE.CubeGeometry(2,2,10);this.animationParent=new THREE.Mesh(c,a);a=new THREE.Mesh(g,b);a.position.set(0,10,0);this.animation=e(this.animationParent,this.spline,this.id,this.duration);this.animationParent.add(this.object);this.animationParent.add(this.target);this.animationParent.add(a)}else{this.animation=e(this.animationParent,this.spline,this.id,this.duration);this.animationParent.add(this.target);this.animationParent.add(this.object)}if(this.createDebugPath){var a=
this.debugPath,b=this.spline,g=f(b,10),c=f(b,10),h=new THREE.LineBasicMaterial({color:16711680,linewidth:3}),g=new THREE.Line(g,h),c=new THREE.ParticleSystem(c,new THREE.ParticleBasicMaterial({color:16755200,size:3}));g.scale.set(1,1,1);a.add(g);c.scale.set(1,1,1);a.add(c);for(var g=new THREE.SphereGeometry(1,16,8),h=new THREE.MeshBasicMaterial({color:65280}),o=0;o<b.points.length;o++){c=new THREE.Mesh(g,h);c.position.copy(b.points[o]);a.add(c)}}this.domElement.addEventListener("mousemove",d(this,
this.onMouseMove),false)}};THREE.PathControlsIdCounter=0;
THREE.FlyControls=function(a,b){function c(a,b){return function(){b.apply(a,arguments)}}this.object=a;this.domElement=b!==void 0?b:document;b&&this.domElement.setAttribute("tabindex",-1);this.movementSpeed=1;this.rollSpeed=0.005;this.autoForward=this.dragToLook=false;this.object.useQuaternion=true;this.tmpQuaternion=new THREE.Quaternion;this.mouseStatus=0;this.moveState={up:0,down:0,left:0,right:0,forward:0,back:0,pitchUp:0,pitchDown:0,yawLeft:0,yawRight:0,rollLeft:0,rollRight:0};this.moveVector=
new THREE.Vector3(0,0,0);this.rotationVector=new THREE.Vector3(0,0,0);this.handleEvent=function(a){if(typeof this[a.type]=="function")this[a.type](a)};this.keydown=function(a){if(!a.altKey){switch(a.keyCode){case 16:this.movementSpeedMultiplier=0.1;break;case 87:this.moveState.forward=1;break;case 83:this.moveState.back=1;break;case 65:this.moveState.left=1;break;case 68:this.moveState.right=1;break;case 82:this.moveState.up=1;break;case 70:this.moveState.down=1;break;case 38:this.moveState.pitchUp=
1;break;case 40:this.moveState.pitchDown=1;break;case 37:this.moveState.yawLeft=1;break;case 39:this.moveState.yawRight=1;break;case 81:this.moveState.rollLeft=1;break;case 69:this.moveState.rollRight=1}this.updateMovementVector();this.updateRotationVector()}};this.keyup=function(a){switch(a.keyCode){case 16:this.movementSpeedMultiplier=1;break;case 87:this.moveState.forward=0;break;case 83:this.moveState.back=0;break;case 65:this.moveState.left=0;break;case 68:this.moveState.right=0;break;case 82:this.moveState.up=
0;break;case 70:this.moveState.down=0;break;case 38:this.moveState.pitchUp=0;break;case 40:this.moveState.pitchDown=0;break;case 37:this.moveState.yawLeft=0;break;case 39:this.moveState.yawRight=0;break;case 81:this.moveState.rollLeft=0;break;case 69:this.moveState.rollRight=0}this.updateMovementVector();this.updateRotationVector()};this.mousedown=function(a){this.domElement!==document&&this.domElement.focus();a.preventDefault();a.stopPropagation();if(this.dragToLook)this.mouseStatus++;else switch(a.button){case 0:this.object.moveForward=
true;break;case 2:this.object.moveBackward=true}};this.mousemove=function(a){if(!this.dragToLook||this.mouseStatus>0){var b=this.getContainerDimensions(),c=b.size[0]/2,g=b.size[1]/2;this.moveState.yawLeft=-(a.pageX-b.offset[0]-c)/c;this.moveState.pitchDown=(a.pageY-b.offset[1]-g)/g;this.updateRotationVector()}};this.mouseup=function(a){a.preventDefault();a.stopPropagation();if(this.dragToLook){this.mouseStatus--;this.moveState.yawLeft=this.moveState.pitchDown=0}else switch(a.button){case 0:this.moveForward=
false;break;case 2:this.moveBackward=false}this.updateRotationVector()};this.update=function(a){var b=a*this.movementSpeed,a=a*this.rollSpeed;this.object.translateX(this.moveVector.x*b);this.object.translateY(this.moveVector.y*b);this.object.translateZ(this.moveVector.z*b);this.tmpQuaternion.set(this.rotationVector.x*a,this.rotationVector.y*a,this.rotationVector.z*a,1).normalize();this.object.quaternion.multiplySelf(this.tmpQuaternion);this.object.matrix.setPosition(this.object.position);this.object.matrix.setRotationFromQuaternion(this.object.quaternion);
this.object.matrixWorldNeedsUpdate=true};this.updateMovementVector=function(){var a=this.moveState.forward||this.autoForward&&!this.moveState.back?1:0;this.moveVector.x=-this.moveState.left+this.moveState.right;this.moveVector.y=-this.moveState.down+this.moveState.up;this.moveVector.z=-a+this.moveState.back};this.updateRotationVector=function(){this.rotationVector.x=-this.moveState.pitchDown+this.moveState.pitchUp;this.rotationVector.y=-this.moveState.yawRight+this.moveState.yawLeft;this.rotationVector.z=
-this.moveState.rollRight+this.moveState.rollLeft};this.getContainerDimensions=function(){return this.domElement!=document?{size:[this.domElement.offsetWidth,this.domElement.offsetHeight],offset:[this.domElement.offsetLeft,this.domElement.offsetTop]}:{size:[window.innerWidth,window.innerHeight],offset:[0,0]}};this.domElement.addEventListener("mousemove",c(this,this.mousemove),false);this.domElement.addEventListener("mousedown",c(this,this.mousedown),false);this.domElement.addEventListener("mouseup",
c(this,this.mouseup),false);this.domElement.addEventListener("keydown",c(this,this.keydown),false);this.domElement.addEventListener("keyup",c(this,this.keyup),false);this.updateMovementVector();this.updateRotationVector()};
THREE.RollControls=function(a,b){this.object=a;this.domElement=b!==void 0?b:document;this.mouseLook=true;this.autoForward=false;this.rollSpeed=this.movementSpeed=this.lookSpeed=1;this.constrainVertical=[-0.9,0.9];this.object.matrixAutoUpdate=false;this.forward=new THREE.Vector3(0,0,1);this.roll=0;var c=new THREE.Vector3,d=new THREE.Vector3,e=new THREE.Vector3,f=new THREE.Matrix4,g=false,h=1,j=0,l=0,k=0,p=0,m=0,o=window.innerWidth/2,q=window.innerHeight/2;this.update=function(a){if(this.mouseLook){var b=
a*this.lookSpeed;this.rotateHorizontally(b*p);this.rotateVertically(b*m)}b=a*this.movementSpeed;this.object.translateZ(-b*(j>0||this.autoForward&&!(j<0)?1:j));this.object.translateX(b*l);this.object.translateY(b*k);if(g)this.roll=this.roll+this.rollSpeed*a*h;if(this.forward.y>this.constrainVertical[1]){this.forward.y=this.constrainVertical[1];this.forward.normalize()}else if(this.forward.y<this.constrainVertical[0]){this.forward.y=this.constrainVertical[0];this.forward.normalize()}e.copy(this.forward);
d.set(0,1,0);c.cross(d,e).normalize();d.cross(e,c).normalize();this.object.matrix.elements[0]=c.x;this.object.matrix.elements[4]=d.x;this.object.matrix.elements[8]=e.x;this.object.matrix.elements[1]=c.y;this.object.matrix.elements[5]=d.y;this.object.matrix.elements[9]=e.y;this.object.matrix.elements[2]=c.z;this.object.matrix.elements[6]=d.z;this.object.matrix.elements[10]=e.z;f.identity();f.elements[0]=Math.cos(this.roll);f.elements[4]=-Math.sin(this.roll);f.elements[1]=Math.sin(this.roll);f.elements[5]=
Math.cos(this.roll);this.object.matrix.multiplySelf(f);this.object.matrixWorldNeedsUpdate=true;this.object.matrix.elements[12]=this.object.position.x;this.object.matrix.elements[13]=this.object.position.y;this.object.matrix.elements[14]=this.object.position.z};this.translateX=function(a){this.object.position.x=this.object.position.x+this.object.matrix.elements[0]*a;this.object.position.y=this.object.position.y+this.object.matrix.elements[1]*a;this.object.position.z=this.object.position.z+this.object.matrix.elements[2]*
a};this.translateY=function(a){this.object.position.x=this.object.position.x+this.object.matrix.elements[4]*a;this.object.position.y=this.object.position.y+this.object.matrix.elements[5]*a;this.object.position.z=this.object.position.z+this.object.matrix.elements[6]*a};this.translateZ=function(a){this.object.position.x=this.object.position.x-this.object.matrix.elements[8]*a;this.object.position.y=this.object.position.y-this.object.matrix.elements[9]*a;this.object.position.z=this.object.position.z-
this.object.matrix.elements[10]*a};this.rotateHorizontally=function(a){c.set(this.object.matrix.elements[0],this.object.matrix.elements[1],this.object.matrix.elements[2]);c.multiplyScalar(a);this.forward.subSelf(c);this.forward.normalize()};this.rotateVertically=function(a){d.set(this.object.matrix.elements[4],this.object.matrix.elements[5],this.object.matrix.elements[6]);d.multiplyScalar(a);this.forward.addSelf(d);this.forward.normalize()};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},
false);this.domElement.addEventListener("mousemove",function(a){p=(a.clientX-o)/window.innerWidth;m=(a.clientY-q)/window.innerHeight},false);this.domElement.addEventListener("mousedown",function(a){a.preventDefault();a.stopPropagation();switch(a.button){case 0:j=1;break;case 2:j=-1}},false);this.domElement.addEventListener("mouseup",function(a){a.preventDefault();a.stopPropagation();switch(a.button){case 0:j=0;break;case 2:j=0}},false);this.domElement.addEventListener("keydown",function(a){switch(a.keyCode){case 38:case 87:j=
1;break;case 37:case 65:l=-1;break;case 40:case 83:j=-1;break;case 39:case 68:l=1;break;case 81:g=true;h=1;break;case 69:g=true;h=-1;break;case 82:k=1;break;case 70:k=-1}},false);this.domElement.addEventListener("keyup",function(a){switch(a.keyCode){case 38:case 87:j=0;break;case 37:case 65:l=0;break;case 40:case 83:j=0;break;case 39:case 68:l=0;break;case 81:g=false;break;case 69:g=false;break;case 82:k=0;break;case 70:k=0}},false)};
THREE.TrackballControls=function(a,b){THREE.EventTarget.call(this);var c=this;this.object=a;this.domElement=b!==void 0?b:document;this.enabled=true;this.screen={width:window.innerWidth,height:window.innerHeight,offsetLeft:0,offsetTop:0};this.radius=(this.screen.width+this.screen.height)/4;this.rotateSpeed=1;this.zoomSpeed=1.2;this.panSpeed=0.3;this.staticMoving=this.noPan=this.noZoom=this.noRotate=false;this.dynamicDampingFactor=0.2;this.minDistance=0;this.maxDistance=Infinity;this.keys=[65,83,68];
this.target=new THREE.Vector3;var d=new THREE.Vector3,e=false,f=-1,g=new THREE.Vector3,h=new THREE.Vector3,j=new THREE.Vector3,l=new THREE.Vector2,k=new THREE.Vector2,p=new THREE.Vector2,m=new THREE.Vector2,o={type:"change"};this.handleEvent=function(a){if(typeof this[a.type]=="function")this[a.type](a)};this.getMouseOnScreen=function(a,b){return new THREE.Vector2((a-c.screen.offsetLeft)/c.radius*0.5,(b-c.screen.offsetTop)/c.radius*0.5)};this.getMouseProjectionOnBall=function(a,b){var d=new THREE.Vector3((a-
c.screen.width*0.5-c.screen.offsetLeft)/c.radius,(c.screen.height*0.5+c.screen.offsetTop-b)/c.radius,0),e=d.length();e>1?d.normalize():d.z=Math.sqrt(1-e*e);g.copy(c.object.position).subSelf(c.target);e=c.object.up.clone().setLength(d.y);e.addSelf(c.object.up.clone().crossSelf(g).setLength(d.x));e.addSelf(g.setLength(d.z));return e};this.rotateCamera=function(){var a=Math.acos(h.dot(j)/h.length()/j.length());if(a){var b=(new THREE.Vector3).cross(h,j).normalize(),d=new THREE.Quaternion,a=a*c.rotateSpeed;
d.setFromAxisAngle(b,-a);d.multiplyVector3(g);d.multiplyVector3(c.object.up);d.multiplyVector3(j);if(c.staticMoving)h=j;else{d.setFromAxisAngle(b,a*(c.dynamicDampingFactor-1));d.multiplyVector3(h)}}};this.zoomCamera=function(){var a=1+(k.y-l.y)*c.zoomSpeed;if(a!==1&&a>0){g.multiplyScalar(a);c.staticMoving?l=k:l.y=l.y+(k.y-l.y)*this.dynamicDampingFactor}};this.panCamera=function(){var a=m.clone().subSelf(p);if(a.lengthSq()){a.multiplyScalar(g.length()*c.panSpeed);var b=g.clone().crossSelf(c.object.up).setLength(a.x);
b.addSelf(c.object.up.clone().setLength(a.y));c.object.position.addSelf(b);c.target.addSelf(b);c.staticMoving?p=m:p.addSelf(a.sub(m,p).multiplyScalar(c.dynamicDampingFactor))}};this.checkDistances=function(){if(!c.noZoom||!c.noPan){c.object.position.lengthSq()>c.maxDistance*c.maxDistance&&c.object.position.setLength(c.maxDistance);g.lengthSq()<c.minDistance*c.minDistance&&c.object.position.add(c.target,g.setLength(c.minDistance))}};this.update=function(){g.copy(c.object.position).subSelf(c.target);
c.noRotate||c.rotateCamera();c.noZoom||c.zoomCamera();c.noPan||c.panCamera();c.object.position.add(c.target,g);c.checkDistances();c.object.lookAt(c.target);if(d.distanceTo(c.object.position)>0){c.dispatchEvent(o);d.copy(c.object.position)}};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},false);this.domElement.addEventListener("mousemove",function(a){if(c.enabled){if(e){h=j=c.getMouseProjectionOnBall(a.clientX,a.clientY);l=k=c.getMouseOnScreen(a.clientX,a.clientY);p=
m=c.getMouseOnScreen(a.clientX,a.clientY);e=false}f!==-1&&(f===0&&!c.noRotate?j=c.getMouseProjectionOnBall(a.clientX,a.clientY):f===1&&!c.noZoom?k=c.getMouseOnScreen(a.clientX,a.clientY):f===2&&!c.noPan&&(m=c.getMouseOnScreen(a.clientX,a.clientY)))}},false);this.domElement.addEventListener("mousedown",function(a){if(c.enabled){a.preventDefault();a.stopPropagation();if(f===-1){f=a.button;f===0&&!c.noRotate?h=j=c.getMouseProjectionOnBall(a.clientX,a.clientY):f===1&&!c.noZoom?l=k=c.getMouseOnScreen(a.clientX,
a.clientY):this.noPan||(p=m=c.getMouseOnScreen(a.clientX,a.clientY))}}},false);this.domElement.addEventListener("mouseup",function(a){if(c.enabled){a.preventDefault();a.stopPropagation();f=-1}},false);window.addEventListener("keydown",function(a){if(c.enabled&&f===-1){a.keyCode===c.keys[0]&&!c.noRotate?f=0:a.keyCode===c.keys[1]&&!c.noZoom?f=1:a.keyCode===c.keys[2]&&!c.noPan&&(f=2);f!==-1&&(e=true)}},false);window.addEventListener("keyup",function(){c.enabled&&f!==-1&&(f=-1)},false)};
THREE.CubeGeometry=function(a,b,c,d,e,f,g,h){function j(a,b,c,g,h,j,k,m){var n,p=d||1,o=e||1,q=h/2,r=j/2,t=l.vertices.length;if(a==="x"&&b==="y"||a==="y"&&b==="x")n="z";else if(a==="x"&&b==="z"||a==="z"&&b==="x"){n="y";o=f||1}else if(a==="z"&&b==="y"||a==="y"&&b==="z"){n="x";p=f||1}var i=p+1,u=o+1,y=h/p,C=j/o,Y=new THREE.Vector3;Y[n]=k>0?1:-1;for(h=0;h<u;h++)for(j=0;j<i;j++){var F=new THREE.Vector3;F[a]=(j*y-q)*c;F[b]=(h*C-r)*g;F[n]=k;l.vertices.push(F)}for(h=0;h<o;h++)for(j=0;j<p;j++){a=new THREE.Face4(j+
i*h+t,j+i*(h+1)+t,j+1+i*(h+1)+t,j+1+i*h+t);a.normal.copy(Y);a.vertexNormals.push(Y.clone(),Y.clone(),Y.clone(),Y.clone());a.materialIndex=m;l.faces.push(a);l.faceVertexUvs[0].push([new THREE.UV(j/p,h/o),new THREE.UV(j/p,(h+1)/o),new THREE.UV((j+1)/p,(h+1)/o),new THREE.UV((j+1)/p,h/o)])}}THREE.Geometry.call(this);var l=this,k=a/2,p=b/2,m=c/2,o,q,n,r,u,t;if(g!==void 0){if(g instanceof Array)this.materials=g;else{this.materials=[];for(o=0;o<6;o++)this.materials.push(g)}o=0;r=1;q=2;u=3;n=4;t=5}else this.materials=
[];this.sides={px:true,nx:true,py:true,ny:true,pz:true,nz:true};if(h!=void 0)for(var y in h)this.sides[y]!==void 0&&(this.sides[y]=h[y]);this.sides.px&&j("z","y",-1,-1,c,b,k,o);this.sides.nx&&j("z","y",1,-1,c,b,-k,r);this.sides.py&&j("x","z",1,1,a,c,p,q);this.sides.ny&&j("x","z",1,-1,a,c,-p,u);this.sides.pz&&j("x","y",1,-1,a,b,m,n);this.sides.nz&&j("x","y",-1,-1,a,b,-m,t);this.computeCentroids();this.mergeVertices()};THREE.CubeGeometry.prototype=new THREE.Geometry;
THREE.CubeGeometry.prototype.constructor=THREE.CubeGeometry;
THREE.CylinderGeometry=function(a,b,c,d,e,f){THREE.Geometry.call(this);var a=a!==void 0?a:20,b=b!==void 0?b:20,c=c!==void 0?c:100,g=c/2,d=d||8,e=e||1,h,j,l=[],k=[];for(j=0;j<=e;j++){var p=[],m=[],o=j/e,q=o*(b-a)+a;for(h=0;h<=d;h++){var n=h/d,r=new THREE.Vector3;r.x=q*Math.sin(n*Math.PI*2);r.y=-o*c+g;r.z=q*Math.cos(n*Math.PI*2);this.vertices.push(r);p.push(this.vertices.length-1);m.push(new THREE.UV(n,o))}l.push(p);k.push(m)}c=(b-a)/c;for(h=0;h<d;h++){if(a!==0){p=this.vertices[l[0][h]].clone();m=this.vertices[l[0][h+
1]].clone()}else{p=this.vertices[l[1][h]].clone();m=this.vertices[l[1][h+1]].clone()}p.setY(Math.sqrt(p.x*p.x+p.z*p.z)*c).normalize();m.setY(Math.sqrt(m.x*m.x+m.z*m.z)*c).normalize();for(j=0;j<e;j++){var o=l[j][h],q=l[j+1][h],n=l[j+1][h+1],r=l[j][h+1],u=p.clone(),t=p.clone(),y=m.clone(),s=m.clone(),w=k[j][h].clone(),H=k[j+1][h].clone(),E=k[j+1][h+1].clone(),z=k[j][h+1].clone();this.faces.push(new THREE.Face4(o,q,n,r,[u,t,y,s]));this.faceVertexUvs[0].push([w,H,E,z])}}if(!f&&a>0){this.vertices.push(new THREE.Vector3(0,
g,0));for(h=0;h<d;h++){o=l[0][h];q=l[0][h+1];n=this.vertices.length-1;u=new THREE.Vector3(0,1,0);t=new THREE.Vector3(0,1,0);y=new THREE.Vector3(0,1,0);w=k[0][h].clone();H=k[0][h+1].clone();E=new THREE.UV(H.u,0);this.faces.push(new THREE.Face3(o,q,n,[u,t,y]));this.faceVertexUvs[0].push([w,H,E])}}if(!f&&b>0){this.vertices.push(new THREE.Vector3(0,-g,0));for(h=0;h<d;h++){o=l[j][h+1];q=l[j][h];n=this.vertices.length-1;u=new THREE.Vector3(0,-1,0);t=new THREE.Vector3(0,-1,0);y=new THREE.Vector3(0,-1,0);
w=k[j][h+1].clone();H=k[j][h].clone();E=new THREE.UV(H.u,1);this.faces.push(new THREE.Face3(o,q,n,[u,t,y]));this.faceVertexUvs[0].push([w,H,E])}}this.computeCentroids();this.computeFaceNormals()};THREE.CylinderGeometry.prototype=new THREE.Geometry;THREE.CylinderGeometry.prototype.constructor=THREE.CylinderGeometry;
THREE.ExtrudeGeometry=function(a,b){if(typeof a!=="undefined"){THREE.Geometry.call(this);a=a instanceof Array?a:[a];this.shapebb=a[a.length-1].getBoundingBox();this.addShapeList(a,b);this.computeCentroids();this.computeFaceNormals()}};THREE.ExtrudeGeometry.prototype=new THREE.Geometry;THREE.ExtrudeGeometry.prototype.constructor=THREE.ExtrudeGeometry;THREE.ExtrudeGeometry.prototype.addShapeList=function(a,b){for(var c=a.length,d=0;d<c;d++)this.addShape(a[d],b)};
THREE.ExtrudeGeometry.prototype.addShape=function(a,b){function c(a,b,c){b||console.log("die");return b.clone().multiplyScalar(c).addSelf(a)}function d(a,b,c){var d=THREE.ExtrudeGeometry.__v1,e=THREE.ExtrudeGeometry.__v2,f=THREE.ExtrudeGeometry.__v3,g=THREE.ExtrudeGeometry.__v4,h=THREE.ExtrudeGeometry.__v5,i=THREE.ExtrudeGeometry.__v6;d.set(a.x-b.x,a.y-b.y);e.set(a.x-c.x,a.y-c.y);d=d.normalize();e=e.normalize();f.set(-d.y,d.x);g.set(e.y,-e.x);h.copy(a).addSelf(f);i.copy(a).addSelf(g);if(h.equals(i))return g.clone();
h.copy(b).addSelf(f);i.copy(c).addSelf(g);f=d.dot(g);g=i.subSelf(h).dot(g);if(f===0){console.log("Either infinite or no solutions!");g===0?console.log("Its finite solutions."):console.log("Too bad, no solutions.")}g=g/f;if(g<0){b=Math.atan2(b.y-a.y,b.x-a.x);a=Math.atan2(c.y-a.y,c.x-a.x);b>a&&(a=a+Math.PI*2);c=(b+a)/2;a=-Math.cos(c);c=-Math.sin(c);return new THREE.Vector2(a,c)}return d.multiplyScalar(g).addSelf(h).subSelf(a).clone()}function e(c,d){var e,f;for(F=c.length;--F>=0;){e=F;f=F-1;f<0&&(f=
c.length-1);for(var g=0,h=m+k*2,g=0;g<h;g++){var i=U*g,j=U*(g+1),l=d+e+i,i=d+f+i,n=d+f+j,j=d+e+j,p=c,o=g,q=h,l=l+J,i=i+J,n=n+J,j=j+J;A.faces.push(new THREE.Face4(l,i,n,j,null,null,t));l=O.generateSideWallUV(A,a,p,b,l,i,n,j,o,q);A.faceVertexUvs[0].push(l)}}}function f(a,b,c){A.vertices.push(new THREE.Vector3(a,b,c))}function g(c,d,e,f){c=c+J;d=d+J;e=e+J;A.faces.push(new THREE.Face3(c,d,e,null,null,u));c=f?O.generateBottomUV(A,a,b,c,d,e):O.generateTopUV(A,a,b,c,d,e);A.faceVertexUvs[0].push(c)}var h=
b.amount!==void 0?b.amount:100,j=b.bevelThickness!==void 0?b.bevelThickness:6,l=b.bevelSize!==void 0?b.bevelSize:j-2,k=b.bevelSegments!==void 0?b.bevelSegments:3,p=b.bevelEnabled!==void 0?b.bevelEnabled:true,m=b.steps!==void 0?b.steps:1,o=b.bendPath,q=b.extrudePath,n,r=false,u=b.material,t=b.extrudeMaterial,y,s,w,H;if(q){n=q.getSpacedPoints(m);r=true;p=false;y=new THREE.TubeGeometry.FrenetFrames(q,m,false);s=new THREE.Vector3;w=new THREE.Vector3;H=new THREE.Vector3}if(!p)l=j=k=0;var E,z,v,A=this,
J=this.vertices.length;o&&a.addWrapPath(o);var q=a.extractPoints(),o=q.shape,K=q.holes;if(q=!THREE.Shape.Utils.isClockWise(o)){o=o.reverse();z=0;for(v=K.length;z<v;z++){E=K[z];THREE.Shape.Utils.isClockWise(E)&&(K[z]=E.reverse())}q=false}var R=THREE.Shape.Utils.triangulateShape(o,K),P=o;z=0;for(v=K.length;z<v;z++){E=K[z];o=o.concat(E)}var D,M,G,i,T,U=o.length,C,Y=R.length,q=[],F=0;G=P.length;D=G-1;for(M=F+1;F<G;F++,D++,M++){D===G&&(D=0);M===G&&(M=0);q[F]=d(P[F],P[D],P[M])}var ea=[],fa,ia=q.concat();
z=0;for(v=K.length;z<v;z++){E=K[z];fa=[];F=0;G=E.length;D=G-1;for(M=F+1;F<G;F++,D++,M++){D===G&&(D=0);M===G&&(M=0);fa[F]=d(E[F],E[D],E[M])}ea.push(fa);ia=ia.concat(fa)}for(D=0;D<k;D++){G=D/k;i=j*(1-G);M=l*Math.sin(G*Math.PI/2);F=0;for(G=P.length;F<G;F++){T=c(P[F],q[F],M);f(T.x,T.y,-i)}z=0;for(v=K.length;z<v;z++){E=K[z];fa=ea[z];F=0;for(G=E.length;F<G;F++){T=c(E[F],fa[F],M);f(T.x,T.y,-i)}}}M=l;for(F=0;F<U;F++){T=p?c(o[F],ia[F],M):o[F];if(r){w.copy(y.normals[0]).multiplyScalar(T.x);s.copy(y.binormals[0]).multiplyScalar(T.y);
H.copy(n[0]).addSelf(w).addSelf(s);f(H.x,H.y,H.z)}else f(T.x,T.y,0)}for(G=1;G<=m;G++)for(F=0;F<U;F++){T=p?c(o[F],ia[F],M):o[F];if(r){w.copy(y.normals[G]).multiplyScalar(T.x);s.copy(y.binormals[G]).multiplyScalar(T.y);H.copy(n[G]).addSelf(w).addSelf(s);f(H.x,H.y,H.z)}else f(T.x,T.y,h/m*G)}for(D=k-1;D>=0;D--){G=D/k;i=j*(1-G);M=l*Math.sin(G*Math.PI/2);F=0;for(G=P.length;F<G;F++){T=c(P[F],q[F],M);f(T.x,T.y,h+i)}z=0;for(v=K.length;z<v;z++){E=K[z];fa=ea[z];F=0;for(G=E.length;F<G;F++){T=c(E[F],fa[F],M);
r?f(T.x,T.y+n[m-1].y,n[m-1].x+i):f(T.x,T.y,h+i)}}}var O=THREE.ExtrudeGeometry.WorldUVGenerator;(function(){if(p){var a;a=U*0;for(F=0;F<Y;F++){C=R[F];g(C[2]+a,C[1]+a,C[0]+a,true)}a=m+k*2;a=U*a;for(F=0;F<Y;F++){C=R[F];g(C[0]+a,C[1]+a,C[2]+a,false)}}else{for(F=0;F<Y;F++){C=R[F];g(C[2],C[1],C[0],true)}for(F=0;F<Y;F++){C=R[F];g(C[0]+U*m,C[1]+U*m,C[2]+U*m,false)}}})();(function(){var a=0;e(P,a);a=a+P.length;z=0;for(v=K.length;z<v;z++){E=K[z];e(E,a);a=a+E.length}})()};
THREE.ExtrudeGeometry.WorldUVGenerator={generateTopUV:function(a,b,c,d,e,f){b=a.vertices[e].x;e=a.vertices[e].y;c=a.vertices[f].x;f=a.vertices[f].y;return[new THREE.UV(a.vertices[d].x,1-a.vertices[d].y),new THREE.UV(b,1-e),new THREE.UV(c,1-f)]},generateBottomUV:function(a,b,c,d,e,f){return this.generateTopUV(a,b,c,d,e,f)},generateSideWallUV:function(a,b,c,d,e,f,g,h){var b=a.vertices[e].x,c=a.vertices[e].y,e=a.vertices[e].z,d=a.vertices[f].x,j=a.vertices[f].y,f=a.vertices[f].z,l=a.vertices[g].x,k=
a.vertices[g].y,g=a.vertices[g].z,p=a.vertices[h].x,m=a.vertices[h].y,a=a.vertices[h].z;return Math.abs(c-j)<0.01?[new THREE.UV(b,e),new THREE.UV(d,f),new THREE.UV(l,g),new THREE.UV(p,a)]:[new THREE.UV(c,e),new THREE.UV(j,f),new THREE.UV(k,g),new THREE.UV(m,a)]}};THREE.ExtrudeGeometry.__v1=new THREE.Vector2;THREE.ExtrudeGeometry.__v2=new THREE.Vector2;THREE.ExtrudeGeometry.__v3=new THREE.Vector2;THREE.ExtrudeGeometry.__v4=new THREE.Vector2;THREE.ExtrudeGeometry.__v5=new THREE.Vector2;
THREE.ExtrudeGeometry.__v6=new THREE.Vector2;
THREE.LatheGeometry=function(a,b,c){THREE.Geometry.call(this);for(var b=b||12,c=c||2*Math.PI,d=[],e=(new THREE.Matrix4).makeRotationZ(c/b),f=0;f<a.length;f++){d[f]=a[f].clone();this.vertices.push(d[f])}for(var g=b+1,c=0;c<g;c++)for(f=0;f<d.length;f++){d[f]=e.multiplyVector3(d[f].clone());this.vertices.push(d[f])}for(c=0;c<b;c++){d=0;for(e=a.length;d<e-1;d++){this.faces.push(new THREE.Face4(c*e+d,(c+1)%g*e+d,(c+1)%g*e+(d+1)%e,c*e+(d+1)%e));this.faceVertexUvs[0].push([new THREE.UV(1-c/b,d/e),new THREE.UV(1-
(c+1)/b,d/e),new THREE.UV(1-(c+1)/b,(d+1)/e),new THREE.UV(1-c/b,(d+1)/e)])}}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.LatheGeometry.prototype=new THREE.Geometry;THREE.LatheGeometry.prototype.constructor=THREE.LatheGeometry;
THREE.PlaneGeometry=function(a,b,c,d){THREE.Geometry.call(this);for(var e=a/2,f=b/2,c=c||1,d=d||1,g=c+1,h=d+1,j=a/c,l=b/d,k=new THREE.Vector3(0,1,0),a=0;a<h;a++)for(b=0;b<g;b++)this.vertices.push(new THREE.Vector3(b*j-e,0,a*l-f));for(a=0;a<d;a++)for(b=0;b<c;b++){e=new THREE.Face4(b+g*a,b+g*(a+1),b+1+g*(a+1),b+1+g*a);e.normal.copy(k);e.vertexNormals.push(k.clone(),k.clone(),k.clone(),k.clone());this.faces.push(e);this.faceVertexUvs[0].push([new THREE.UV(b/c,a/d),new THREE.UV(b/c,(a+1)/d),new THREE.UV((b+
1)/c,(a+1)/d),new THREE.UV((b+1)/c,a/d)])}this.computeCentroids()};THREE.PlaneGeometry.prototype=new THREE.Geometry;THREE.PlaneGeometry.prototype.constructor=THREE.PlaneGeometry;
THREE.SphereGeometry=function(a,b,c,d,e,f,g){THREE.Geometry.call(this);var a=a||50,d=d!==void 0?d:0,e=e!==void 0?e:Math.PI*2,f=f!==void 0?f:0,g=g!==void 0?g:Math.PI,b=Math.max(3,Math.floor(b)||8),c=Math.max(2,Math.floor(c)||6),h,j,l=[],k=[];for(j=0;j<=c;j++){var p=[],m=[];for(h=0;h<=b;h++){var o=h/b,q=j/c,n=new THREE.Vector3;n.x=-a*Math.cos(d+o*e)*Math.sin(f+q*g);n.y=a*Math.cos(f+q*g);n.z=a*Math.sin(d+o*e)*Math.sin(f+q*g);this.vertices.push(n);p.push(this.vertices.length-1);m.push(new THREE.UV(o,
q))}l.push(p);k.push(m)}for(j=0;j<c;j++)for(h=0;h<b;h++){var d=l[j][h+1],e=l[j][h],f=l[j+1][h],g=l[j+1][h+1],p=this.vertices[d].clone().normalize(),m=this.vertices[e].clone().normalize(),o=this.vertices[f].clone().normalize(),q=this.vertices[g].clone().normalize(),n=k[j][h+1].clone(),r=k[j][h].clone(),u=k[j+1][h].clone(),t=k[j+1][h+1].clone();if(Math.abs(this.vertices[d].y)==a){this.faces.push(new THREE.Face3(d,f,g,[p,o,q]));this.faceVertexUvs[0].push([n,u,t])}else if(Math.abs(this.vertices[f].y)==
a){this.faces.push(new THREE.Face3(d,e,f,[p,m,o]));this.faceVertexUvs[0].push([n,r,u])}else{this.faces.push(new THREE.Face4(d,e,f,g,[p,m,o,q]));this.faceVertexUvs[0].push([n,r,u,t])}}this.computeCentroids();this.computeFaceNormals();this.boundingSphere={radius:a}};THREE.SphereGeometry.prototype=new THREE.Geometry;THREE.SphereGeometry.prototype.constructor=THREE.SphereGeometry;
THREE.TextGeometry=function(a,b){var c=(new THREE.TextPath(a,b)).toShapes();b.amount=b.height!==void 0?b.height:50;if(b.bevelThickness===void 0)b.bevelThickness=10;if(b.bevelSize===void 0)b.bevelSize=8;if(b.bevelEnabled===void 0)b.bevelEnabled=false;if(b.bend){var d=c[c.length-1].getBoundingBox().maxX;b.bendPath=new THREE.QuadraticBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(d/2,120),new THREE.Vector2(d,0))}THREE.ExtrudeGeometry.call(this,c,b)};THREE.TextGeometry.prototype=new THREE.ExtrudeGeometry;
THREE.TextGeometry.prototype.constructor=THREE.TextGeometry;
THREE.FontUtils={faces:{},face:"helvetiker",weight:"normal",style:"normal",size:150,divisions:10,getFace:function(){return this.faces[this.face][this.weight][this.style]},loadFace:function(a){var b=a.familyName.toLowerCase();this.faces[b]=this.faces[b]||{};this.faces[b][a.cssFontWeight]=this.faces[b][a.cssFontWeight]||{};this.faces[b][a.cssFontWeight][a.cssFontStyle]=a;return this.faces[b][a.cssFontWeight][a.cssFontStyle]=a},drawText:function(a){for(var b=this.getFace(),c=this.size/b.resolution,d=
0,e=(""+a).split(""),f=e.length,g=[],a=0;a<f;a++){var h=new THREE.Path,h=this.extractGlyphPoints(e[a],b,c,d,h),d=d+h.offset;g.push(h.path)}return{paths:g,offset:d/2}},extractGlyphPoints:function(a,b,c,d,e){var f=[],g,h,j,l,k,p,m,o,q,n,r,u=b.glyphs[a]||b.glyphs["?"];if(u){if(u.o){b=u._cachedOutline||(u._cachedOutline=u.o.split(" "));l=b.length;for(a=0;a<l;){j=b[a++];switch(j){case "m":j=b[a++]*c+d;k=b[a++]*c;f.push(new THREE.Vector2(j,k));e.moveTo(j,k);break;case "l":j=b[a++]*c+d;k=b[a++]*c;f.push(new THREE.Vector2(j,
k));e.lineTo(j,k);break;case "q":j=b[a++]*c+d;k=b[a++]*c;o=b[a++]*c+d;q=b[a++]*c;e.quadraticCurveTo(o,q,j,k);if(g=f[f.length-1]){p=g.x;m=g.y;g=1;for(h=this.divisions;g<=h;g++){var t=g/h,y=THREE.Shape.Utils.b2(t,p,o,j),t=THREE.Shape.Utils.b2(t,m,q,k);f.push(new THREE.Vector2(y,t))}}break;case "b":j=b[a++]*c+d;k=b[a++]*c;o=b[a++]*c+d;q=b[a++]*-c;n=b[a++]*c+d;r=b[a++]*-c;e.bezierCurveTo(j,k,o,q,n,r);if(g=f[f.length-1]){p=g.x;m=g.y;g=1;for(h=this.divisions;g<=h;g++){t=g/h;y=THREE.Shape.Utils.b3(t,p,o,
n,j);t=THREE.Shape.Utils.b3(t,m,q,r,k);f.push(new THREE.Vector2(y,t))}}}}}return{offset:u.ha*c,points:f,path:e}}}};
(function(a){var b=function(a){for(var b=a.length,e=0,f=b-1,g=0;g<b;f=g++)e=e+(a[f].x*a[g].y-a[g].x*a[f].y);return e*0.5};a.Triangulate=function(a,d){var e=a.length;if(e<3)return null;var f=[],g=[],h=[],j,l,k;if(b(a)>0)for(l=0;l<e;l++)g[l]=l;else for(l=0;l<e;l++)g[l]=e-1-l;var p=2*e;for(l=e-1;e>2;){if(p--<=0){console.log("Warning, unable to triangulate polygon!");break}j=l;e<=j&&(j=0);l=j+1;e<=l&&(l=0);k=l+1;e<=k&&(k=0);var m;a:{m=a;var o=j,q=l,n=k,r=e,u=g,t=void 0,y=void 0,s=void 0,w=void 0,H=void 0,
E=void 0,z=void 0,v=void 0,A=void 0,y=m[u[o]].x,s=m[u[o]].y,w=m[u[q]].x,H=m[u[q]].y,E=m[u[n]].x,z=m[u[n]].y;if(1.0E-10>(w-y)*(z-s)-(H-s)*(E-y))m=false;else{for(t=0;t<r;t++)if(!(t==o||t==q||t==n)){var v=m[u[t]].x,A=m[u[t]].y,J=void 0,K=void 0,R=void 0,P=void 0,D=void 0,M=void 0,G=void 0,i=void 0,T=void 0,U=void 0,C=void 0,Y=void 0,J=R=D=void 0,J=E-w,K=z-H,R=y-E,P=s-z,D=w-y,M=H-s,G=v-y,i=A-s,T=v-w,U=A-H,C=v-E,Y=A-z,J=J*U-K*T,D=D*i-M*G,R=R*Y-P*C;if(J>=0&&R>=0&&D>=0){m=false;break a}}m=true}}if(m){f.push([a[g[j]],
a[g[l]],a[g[k]]]);h.push([g[j],g[l],g[k]]);j=l;for(k=l+1;k<e;j++,k++)g[j]=g[k];e--;p=2*e}}return d?h:f};a.Triangulate.area=b;return a})(THREE.FontUtils);self._typeface_js={faces:THREE.FontUtils.faces,loadFace:THREE.FontUtils.loadFace};
THREE.TorusGeometry=function(a,b,c,d,e){THREE.Geometry.call(this);this.radius=a||100;this.tube=b||40;this.segmentsR=c||8;this.segmentsT=d||6;this.arc=e||Math.PI*2;e=new THREE.Vector3;a=[];b=[];for(c=0;c<=this.segmentsR;c++)for(d=0;d<=this.segmentsT;d++){var f=d/this.segmentsT*this.arc,g=c/this.segmentsR*Math.PI*2;e.x=this.radius*Math.cos(f);e.y=this.radius*Math.sin(f);var h=new THREE.Vector3;h.x=(this.radius+this.tube*Math.cos(g))*Math.cos(f);h.y=(this.radius+this.tube*Math.cos(g))*Math.sin(f);h.z=
this.tube*Math.sin(g);this.vertices.push(h);a.push(new THREE.UV(d/this.segmentsT,1-c/this.segmentsR));b.push(h.clone().subSelf(e).normalize())}for(c=1;c<=this.segmentsR;c++)for(d=1;d<=this.segmentsT;d++){var e=(this.segmentsT+1)*c+d-1,f=(this.segmentsT+1)*(c-1)+d-1,g=(this.segmentsT+1)*(c-1)+d,h=(this.segmentsT+1)*c+d,j=new THREE.Face4(e,f,g,h,[b[e],b[f],b[g],b[h]]);j.normal.addSelf(b[e]);j.normal.addSelf(b[f]);j.normal.addSelf(b[g]);j.normal.addSelf(b[h]);j.normal.normalize();this.faces.push(j);
this.faceVertexUvs[0].push([a[e].clone(),a[f].clone(),a[g].clone(),a[h].clone()])}this.computeCentroids()};THREE.TorusGeometry.prototype=new THREE.Geometry;THREE.TorusGeometry.prototype.constructor=THREE.TorusGeometry;
THREE.TorusKnotGeometry=function(a,b,c,d,e,f,g){function h(a,b,c,d,e,f){var g=Math.cos(a);Math.cos(b);b=Math.sin(a);a=c/d*a;c=Math.cos(a);g=e*(2+c)*0.5*g;b=e*(2+c)*b*0.5;e=f*e*Math.sin(a)*0.5;return new THREE.Vector3(g,b,e)}THREE.Geometry.call(this);this.radius=a||200;this.tube=b||40;this.segmentsR=c||64;this.segmentsT=d||8;this.p=e||2;this.q=f||3;this.heightScale=g||1;this.grid=Array(this.segmentsR);c=new THREE.Vector3;d=new THREE.Vector3;e=new THREE.Vector3;for(a=0;a<this.segmentsR;++a){this.grid[a]=
Array(this.segmentsT);for(b=0;b<this.segmentsT;++b){var j=a/this.segmentsR*2*this.p*Math.PI,g=b/this.segmentsT*2*Math.PI,f=h(j,g,this.q,this.p,this.radius,this.heightScale),j=h(j+0.01,g,this.q,this.p,this.radius,this.heightScale);c.sub(j,f);d.add(j,f);e.cross(c,d);d.cross(e,c);e.normalize();d.normalize();j=-this.tube*Math.cos(g);g=this.tube*Math.sin(g);f.x=f.x+(j*d.x+g*e.x);f.y=f.y+(j*d.y+g*e.y);f.z=f.z+(j*d.z+g*e.z);this.grid[a][b]=this.vertices.push(new THREE.Vector3(f.x,f.y,f.z))-1}}for(a=0;a<
this.segmentsR;++a)for(b=0;b<this.segmentsT;++b){var e=(a+1)%this.segmentsR,f=(b+1)%this.segmentsT,c=this.grid[a][b],d=this.grid[e][b],e=this.grid[e][f],f=this.grid[a][f],g=new THREE.UV(a/this.segmentsR,b/this.segmentsT),j=new THREE.UV((a+1)/this.segmentsR,b/this.segmentsT),l=new THREE.UV((a+1)/this.segmentsR,(b+1)/this.segmentsT),k=new THREE.UV(a/this.segmentsR,(b+1)/this.segmentsT);this.faces.push(new THREE.Face4(c,d,e,f));this.faceVertexUvs[0].push([g,j,l,k])}this.computeCentroids();this.computeFaceNormals();
this.computeVertexNormals()};THREE.TorusKnotGeometry.prototype=new THREE.Geometry;THREE.TorusKnotGeometry.prototype.constructor=THREE.TorusKnotGeometry;
THREE.TubeGeometry=function(a,b,c,d,e,f){THREE.Geometry.call(this);this.path=a;this.segments=b||64;this.radius=c||1;this.segmentsRadius=d||8;this.closed=e||false;if(f)this.debug=new THREE.Object3D;this.grid=[];var g,h,f=this.segments+1,j,l,k,p=new THREE.Vector3,m,o,q,b=new THREE.TubeGeometry.FrenetFrames(a,b,e);m=b.tangents;o=b.normals;q=b.binormals;this.tangents=m;this.normals=o;this.binormals=q;for(b=0;b<f;b++){this.grid[b]=[];d=b/(f-1);k=a.getPointAt(d);d=m[b];g=o[b];h=q[b];if(this.debug){this.debug.add(new THREE.ArrowHelper(d,
k,c,255));this.debug.add(new THREE.ArrowHelper(g,k,c,16711680));this.debug.add(new THREE.ArrowHelper(h,k,c,65280))}for(d=0;d<this.segmentsRadius;d++){j=d/this.segmentsRadius*2*Math.PI;l=-this.radius*Math.cos(j);j=this.radius*Math.sin(j);p.copy(k);p.x=p.x+(l*g.x+j*h.x);p.y=p.y+(l*g.y+j*h.y);p.z=p.z+(l*g.z+j*h.z);this.grid[b][d]=this.vertices.push(new THREE.Vector3(p.x,p.y,p.z))-1}}for(b=0;b<this.segments;b++)for(d=0;d<this.segmentsRadius;d++){f=e?(b+1)%this.segments:b+1;p=(d+1)%this.segmentsRadius;
a=this.grid[b][d];c=this.grid[f][d];f=this.grid[f][p];p=this.grid[b][p];m=new THREE.UV(b/this.segments,d/this.segmentsRadius);o=new THREE.UV((b+1)/this.segments,d/this.segmentsRadius);q=new THREE.UV((b+1)/this.segments,(d+1)/this.segmentsRadius);g=new THREE.UV(b/this.segments,(d+1)/this.segmentsRadius);this.faces.push(new THREE.Face4(a,c,f,p));this.faceVertexUvs[0].push([m,o,q,g])}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.TubeGeometry.prototype=new THREE.Geometry;
THREE.TubeGeometry.prototype.constructor=THREE.TubeGeometry;
THREE.TubeGeometry.FrenetFrames=function(a,b,c){new THREE.Vector3;var d=new THREE.Vector3;new THREE.Vector3;var e=[],f=[],g=[],h=new THREE.Vector3,j=new THREE.Matrix4,b=b+1,l,k,p;this.tangents=e;this.normals=f;this.binormals=g;for(l=0;l<b;l++){k=l/(b-1);e[l]=a.getTangentAt(k);e[l].normalize()}f[0]=new THREE.Vector3;g[0]=new THREE.Vector3;a=Number.MAX_VALUE;l=Math.abs(e[0].x);k=Math.abs(e[0].y);p=Math.abs(e[0].z);if(l<=a){a=l;d.set(1,0,0)}if(k<=a){a=k;d.set(0,1,0)}p<=a&&d.set(0,0,1);h.cross(e[0],d).normalize();
f[0].cross(e[0],h);g[0].cross(e[0],f[0]);for(l=1;l<b;l++){f[l]=f[l-1].clone();g[l]=g[l-1].clone();h.cross(e[l-1],e[l]);if(h.length()>1.0E-4){h.normalize();d=Math.acos(e[l-1].dot(e[l]));j.makeRotationAxis(h,d).multiplyVector3(f[l])}g[l].cross(e[l],f[l])}if(c){d=Math.acos(f[0].dot(f[b-1]));d=d/(b-1);e[0].dot(h.cross(f[0],f[b-1]))>0&&(d=-d);for(l=1;l<b;l++){j.makeRotationAxis(e[l],d*l).multiplyVector3(f[l]);g[l].cross(e[l],f[l])}}};
THREE.PolyhedronGeometry=function(a,b,c,d){function e(a){var b=a.normalize().clone();b.index=j.vertices.push(b)-1;var c=Math.atan2(a.z,-a.x)/2/Math.PI+0.5,a=Math.atan2(-a.y,Math.sqrt(a.x*a.x+a.z*a.z))/Math.PI+0.5;b.uv=new THREE.UV(c,a);return b}function f(a,b,c,d){if(d<1){d=new THREE.Face3(a.index,b.index,c.index,[a.clone(),b.clone(),c.clone()]);d.centroid.addSelf(a).addSelf(b).addSelf(c).divideScalar(3);d.normal=d.centroid.clone().normalize();j.faces.push(d);d=Math.atan2(d.centroid.z,-d.centroid.x);
j.faceVertexUvs[0].push([h(a.uv,a,d),h(b.uv,b,d),h(c.uv,c,d)])}else{d=d-1;f(a,g(a,b),g(a,c),d);f(g(a,b),b,g(b,c),d);f(g(a,c),g(b,c),c,d);f(g(a,b),g(b,c),g(a,c),d)}}function g(a,b){p[a.index]||(p[a.index]=[]);p[b.index]||(p[b.index]=[]);var c=p[a.index][b.index];c===void 0&&(p[a.index][b.index]=p[b.index][a.index]=c=e((new THREE.Vector3).add(a,b).divideScalar(2)));return c}function h(a,b,c){c<0&&a.u===1&&(a=new THREE.UV(a.u-1,a.v));b.x===0&&b.z===0&&(a=new THREE.UV(c/2/Math.PI+0.5,a.v));return a}THREE.Geometry.call(this);
for(var c=c||1,d=d||0,j=this,l=0,k=a.length;l<k;l++)e(new THREE.Vector3(a[l][0],a[l][1],a[l][2]));for(var p=[],a=this.vertices,l=0,k=b.length;l<k;l++)f(a[b[l][0]],a[b[l][1]],a[b[l][2]],d);this.mergeVertices();l=0;for(k=this.vertices.length;l<k;l++)this.vertices[l].multiplyScalar(c);this.computeCentroids();this.boundingSphere={radius:c}};THREE.PolyhedronGeometry.prototype=new THREE.Geometry;THREE.PolyhedronGeometry.prototype.constructor=THREE.PolyhedronGeometry;
THREE.IcosahedronGeometry=function(a,b){var c=(1+Math.sqrt(5))/2;THREE.PolyhedronGeometry.call(this,[[-1,c,0],[1,c,0],[-1,-c,0],[1,-c,0],[0,-1,c],[0,1,c],[0,-1,-c],[0,1,-c],[c,0,-1],[c,0,1],[-c,0,-1],[-c,0,1]],[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],a,b)};THREE.IcosahedronGeometry.prototype=new THREE.Geometry;THREE.IcosahedronGeometry.prototype.constructor=THREE.IcosahedronGeometry;
THREE.OctahedronGeometry=function(a,b){THREE.PolyhedronGeometry.call(this,[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],[[0,2,4],[0,4,3],[0,3,5],[0,5,2],[1,2,5],[1,5,3],[1,3,4],[1,4,2]],a,b)};THREE.OctahedronGeometry.prototype=new THREE.Geometry;THREE.OctahedronGeometry.prototype.constructor=THREE.OctahedronGeometry;THREE.TetrahedronGeometry=function(a,b){THREE.PolyhedronGeometry.call(this,[[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]],[[2,1,0],[0,3,2],[1,3,0],[2,3,1]],a,b)};
THREE.TetrahedronGeometry.prototype=new THREE.Geometry;THREE.TetrahedronGeometry.prototype.constructor=THREE.TetrahedronGeometry;
THREE.ParametricGeometry=function(a,b,c,d){THREE.Geometry.call(this);var e=this.vertices,f=this.faces,g=this.faceVertexUvs[0],d=d===void 0?false:d,h,j,l,k,p=b+1;for(h=0;h<=c;h++){k=h/c;for(j=0;j<=b;j++){l=j/b;l=a(l,k);e.push(l)}}var m,o,q,n;for(h=0;h<c;h++)for(j=0;j<b;j++){a=h*p+j;e=h*p+j+1;k=(h+1)*p+j;l=(h+1)*p+j+1;m=new THREE.UV(h/b,j/c);o=new THREE.UV(h/b,(j+1)/c);q=new THREE.UV((h+1)/b,j/c);n=new THREE.UV((h+1)/b,(j+1)/c);if(d){f.push(new THREE.Face3(a,e,k));f.push(new THREE.Face3(e,l,k));g.push([m,
o,q]);g.push([o,n,q])}else{f.push(new THREE.Face4(a,e,l,k));g.push([m,o,q,n])}}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.ParametricGeometry.prototype=new THREE.Geometry;THREE.ParametricGeometry.prototype.constructor=THREE.ParametricGeometry;
THREE.AxisHelper=function(){THREE.Object3D.call(this);var a=new THREE.Geometry;a.vertices.push(new THREE.Vector3);a.vertices.push(new THREE.Vector3(0,100,0));var b=new THREE.CylinderGeometry(0,5,25,5,1),c;c=new THREE.Line(a,new THREE.LineBasicMaterial({color:16711680}));c.rotation.z=-Math.PI/2;this.add(c);c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:16711680}));c.position.x=100;c.rotation.z=-Math.PI/2;this.add(c);c=new THREE.Line(a,new THREE.LineBasicMaterial({color:65280}));this.add(c);
c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:65280}));c.position.y=100;this.add(c);c=new THREE.Line(a,new THREE.LineBasicMaterial({color:255}));c.rotation.x=Math.PI/2;this.add(c);c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:255}));c.position.z=100;c.rotation.x=Math.PI/2;this.add(c)};THREE.AxisHelper.prototype=new THREE.Object3D;THREE.AxisHelper.prototype.constructor=THREE.AxisHelper;
THREE.ArrowHelper=function(a,b,c,d){THREE.Object3D.call(this);d===void 0&&(d=16776960);c===void 0&&(c=20);var e=new THREE.Geometry;e.vertices.push(new THREE.Vector3(0,0,0));e.vertices.push(new THREE.Vector3(0,1,0));this.line=new THREE.Line(e,new THREE.LineBasicMaterial({color:d}));this.add(this.line);e=new THREE.CylinderGeometry(0,0.05,0.25,5,1);this.cone=new THREE.Mesh(e,new THREE.MeshBasicMaterial({color:d}));this.cone.position.set(0,1,0);this.add(this.cone);if(b instanceof THREE.Vector3)this.position=
b;this.setDirection(a);this.setLength(c)};THREE.ArrowHelper.prototype=new THREE.Object3D;THREE.ArrowHelper.prototype.constructor=THREE.ArrowHelper;THREE.ArrowHelper.prototype.setDirection=function(a){var b=(new THREE.Vector3(0,1,0)).crossSelf(a),a=Math.acos((new THREE.Vector3(0,1,0)).dot(a.clone().normalize()));this.matrix=(new THREE.Matrix4).makeRotationAxis(b.normalize(),a);this.rotation.getRotationFromMatrix(this.matrix,this.scale)};
THREE.ArrowHelper.prototype.setLength=function(a){this.scale.set(a,a,a)};THREE.ArrowHelper.prototype.setColor=function(a){this.line.material.color.setHex(a);this.cone.material.color.setHex(a)};
THREE.CameraHelper=function(a){function b(a,b,d){c(a,d);c(b,d)}function c(a,b){d.lineGeometry.vertices.push(new THREE.Vector3);d.lineGeometry.colors.push(new THREE.Color(b));d.pointMap[a]===void 0&&(d.pointMap[a]=[]);d.pointMap[a].push(d.lineGeometry.vertices.length-1)}THREE.Object3D.call(this);var d=this;this.lineGeometry=new THREE.Geometry;this.lineMaterial=new THREE.LineBasicMaterial({color:16777215,vertexColors:THREE.FaceColors});this.pointMap={};b("n1","n2",16755200);b("n2","n4",16755200);b("n4",
"n3",16755200);b("n3","n1",16755200);b("f1","f2",16755200);b("f2","f4",16755200);b("f4","f3",16755200);b("f3","f1",16755200);b("n1","f1",16755200);b("n2","f2",16755200);b("n3","f3",16755200);b("n4","f4",16755200);b("p","n1",16711680);b("p","n2",16711680);b("p","n3",16711680);b("p","n4",16711680);b("u1","u2",43775);b("u2","u3",43775);b("u3","u1",43775);b("c","t",16777215);b("p","c",3355443);b("cn1","cn2",3355443);b("cn3","cn4",3355443);b("cf1","cf2",3355443);b("cf3","cf4",3355443);this.camera=a;this.update(a);
this.lines=new THREE.Line(this.lineGeometry,this.lineMaterial,THREE.LinePieces);this.add(this.lines)};THREE.CameraHelper.prototype=new THREE.Object3D;THREE.CameraHelper.prototype.constructor=THREE.CameraHelper;
THREE.CameraHelper.prototype.update=function(){function a(a,d,e,f){THREE.CameraHelper.__v.set(d,e,f);THREE.CameraHelper.__projector.unprojectVector(THREE.CameraHelper.__v,THREE.CameraHelper.__c);a=b.pointMap[a];if(a!==void 0){d=0;for(e=a.length;d<e;d++)b.lineGeometry.vertices[a[d]].copy(THREE.CameraHelper.__v)}}var b=this;THREE.CameraHelper.__c.projectionMatrix.copy(this.camera.projectionMatrix);a("c",0,0,-1);a("t",0,0,1);a("n1",-1,-1,-1);a("n2",1,-1,-1);a("n3",-1,1,-1);a("n4",1,1,-1);a("f1",-1,-1,
1);a("f2",1,-1,1);a("f3",-1,1,1);a("f4",1,1,1);a("u1",0.7,1.1,-1);a("u2",-0.7,1.1,-1);a("u3",0,2,-1);a("cf1",-1,0,1);a("cf2",1,0,1);a("cf3",0,-1,1);a("cf4",0,1,1);a("cn1",-1,0,-1);a("cn2",1,0,-1);a("cn3",0,-1,-1);a("cn4",0,1,-1);this.lineGeometry.verticesNeedUpdate=true};THREE.CameraHelper.__projector=new THREE.Projector;THREE.CameraHelper.__v=new THREE.Vector3;THREE.CameraHelper.__c=new THREE.Camera;
THREE.SubdivisionModifier=function(a){this.subdivisions=a===void 0?1:a;this.useOldVertexColors=false;this.supportUVs=true;this.debug=false};THREE.SubdivisionModifier.prototype.constructor=THREE.SubdivisionModifier;THREE.SubdivisionModifier.prototype.modify=function(a){for(var b=this.subdivisions;b-- >0;)this.smooth(a)};
THREE.SubdivisionModifier.prototype.smooth=function(a){function b(){m.debug&&console.log.apply(console,arguments)}function c(){console&&console.log.apply(console,arguments)}function d(a,c,d,e,g,h,i){var j=new THREE.Face4(a,c,d,e,null,g.color,g.material);if(m.useOldVertexColors){j.vertexColors=[];for(var l,n,o,q=0;q<4;q++){o=h[q];l=new THREE.Color;l.setRGB(0,0,0);for(var r=0;r<o.length;r++){n=g.vertexColors[o[r]-1];l.r=l.r+n.r;l.g=l.g+n.g;l.b=l.b+n.b}l.r=l.r/o.length;l.g=l.g/o.length;l.b=l.b/o.length;
j.vertexColors[q]=l}}k.push(j);if(m.supportUVs){g=[f(a,""),f(c,i),f(d,i),f(e,i)];g[0]?g[1]?g[2]?g[3]?p.push(g):b("d :( ",e+":"+i):b("c :( ",d+":"+i):b("b :( ",c+":"+i):b("a :( ",a+":"+i)}}function e(a,b){return Math.min(a,b)+"_"+Math.max(a,b)}function f(a,d){var e=a+":"+d,f=t[e];if(!f){a>=y&&a<y+q.length?b("face pt"):b("edge pt");c("warning, UV not found for",e);return null}return f}function g(a,b,d){var e=a+":"+b;e in t?c("dup vertexNo",a,"oldFaceNo",b,"value",d,"key",e,t[e]):t[e]=d}function h(a,
b){R[a]===void 0&&(R[a]=[]);R[a].push(b)}function j(a,b,c){P[a]===void 0&&(P[a]={});P[a][b]=c}var l=[],k=[],p=[],m=this,o=a.vertices,q=a.faces,l=o.concat(),n=[],r={},u={},t={},y=o.length,s,w,H,E,z,v=a.faceVertexUvs[0],A;b("originalFaces, uvs, originalVerticesLength",q.length,v.length,y);if(m.supportUVs){s=0;for(w=v.length;s<w;s++){H=0;for(E=v[s].length;H<E;H++){A=q[s]["abcd".charAt(H)];g(A,s,v[s][H])}}}if(v.length==0)m.supportUVs=false;s=0;for(z in t)s++;if(!s){m.supportUVs=false;b("no uvs")}b("-- Original Faces + Vertices UVs completed",
t,"vs",v.length);s=0;for(w=q.length;s<w;s++){z=q[s];n.push(z.centroid);l.push(z.centroid);if(m.supportUVs){v=new THREE.UV;if(z instanceof THREE.Face3){v.u=f(z.a,s).u+f(z.b,s).u+f(z.c,s).u;v.v=f(z.a,s).v+f(z.b,s).v+f(z.c,s).v;v.u=v.u/3;v.v=v.v/3}else if(z instanceof THREE.Face4){v.u=f(z.a,s).u+f(z.b,s).u+f(z.c,s).u+f(z.d,s).u;v.v=f(z.a,s).v+f(z.b,s).v+f(z.c,s).v+f(z.d,s).v;v.u=v.u/4;v.v=v.v/4}g(y+s,"",v)}}b("-- added UVs for new Faces",t);w=function(a){function b(a,c){h[a]===void 0&&(h[a]=[]);h[a].push(c)}
var c,d,f,g,h={};c=0;for(d=a.faces.length;c<d;c++){f=a.faces[c];if(f instanceof THREE.Face3){g=e(f.a,f.b);b(g,c);g=e(f.b,f.c);b(g,c);g=e(f.c,f.a);b(g,c)}else if(f instanceof THREE.Face4){g=e(f.a,f.b);b(g,c);g=e(f.b,f.c);b(g,c);g=e(f.c,f.d);b(g,c);g=e(f.d,f.a);b(g,c)}}return h}(a);A=0;var J,K,R={},P={};for(s in w){v=w[s];J=s.split("_");K=J[0];J=J[1];h(K,[K,J]);h(J,[K,J]);H=0;for(E=v.length;H<E;H++){z=v[H];j(K,z,s);j(J,z,s)}v.length<2&&(u[s]=true)}b("vertexEdgeMap",R,"vertexFaceMap",P);for(s in w){v=
w[s];z=v[0];E=v[1];J=s.split("_");K=J[0];J=J[1];v=new THREE.Vector3;if(u[s]){v.addSelf(o[K]);v.addSelf(o[J]);v.multiplyScalar(0.5)}else{v.addSelf(n[z]);v.addSelf(n[E]);v.addSelf(o[K]);v.addSelf(o[J]);v.multiplyScalar(0.25)}r[s]=y+q.length+A;l.push(v);A++;if(m.supportUVs){v=new THREE.UV;v.u=f(K,z).u+f(J,z).u;v.v=f(K,z).v+f(J,z).v;v.u=v.u/2;v.v=v.v/2;g(r[s],z,v);if(!u[s]){v=new THREE.UV;v.u=f(K,E).u+f(J,E).u;v.v=f(K,E).v+f(J,E).v;v.u=v.u/2;v.v=v.v/2;g(r[s],E,v)}}}b("-- Step 2 done");var D,M;E=["123",
"12","2","23"];J=["123","23","3","31"];var G=["123","31","1","12"],i=["1234","12","2","23"],T=["1234","23","3","34"],U=["1234","34","4","41"],C=["1234","41","1","12"];s=0;for(w=n.length;s<w;s++){z=q[s];v=y+s;if(z instanceof THREE.Face3){A=e(z.a,z.b);K=e(z.b,z.c);D=e(z.c,z.a);d(v,r[A],z.b,r[K],z,E,s);d(v,r[K],z.c,r[D],z,J,s);d(v,r[D],z.a,r[A],z,G,s)}else if(z instanceof THREE.Face4){A=e(z.a,z.b);K=e(z.b,z.c);D=e(z.c,z.d);M=e(z.d,z.a);d(v,r[A],z.b,r[K],z,i,s);d(v,r[K],z.c,r[D],z,T,s);d(v,r[D],z.d,r[M],
z,U,s);d(v,r[M],z.a,r[A],z,C,s)}else b("face should be a face!",z)}r=new THREE.Vector3;z=new THREE.Vector3;s=0;for(w=o.length;s<w;s++)if(R[s]!==void 0){r.set(0,0,0);z.set(0,0,0);K=new THREE.Vector3(0,0,0);v=0;for(H in P[s]){r.addSelf(n[H]);v++}E=0;A=R[s].length;for(H=0;H<A;H++)u[e(R[s][H][0],R[s][H][1])]&&E++;if(E!=2){r.divideScalar(v);for(H=0;H<A;H++){v=R[s][H];v=o[v[0]].clone().addSelf(o[v[1]]).divideScalar(2);z.addSelf(v)}z.divideScalar(A);K.addSelf(o[s]);K.multiplyScalar(A-3);K.addSelf(r);K.addSelf(z.multiplyScalar(2));
K.divideScalar(A);l[s]=K}}a.vertices=l;a.faces=k;a.faceVertexUvs[0]=p;delete a.__tmpVertices;a.computeCentroids();a.computeFaceNormals();a.computeVertexNormals()};THREE.ImmediateRenderObject=function(){THREE.Object3D.call(this);this.render=function(){}};THREE.ImmediateRenderObject.prototype=new THREE.Object3D;THREE.ImmediateRenderObject.prototype.constructor=THREE.ImmediateRenderObject;
THREE.LensFlare=function(a,b,c,d,e){THREE.Object3D.call(this);this.lensFlares=[];this.positionScreen=new THREE.Vector3;this.customUpdateCallback=void 0;a!==void 0&&this.add(a,b,c,d,e)};THREE.LensFlare.prototype=new THREE.Object3D;THREE.LensFlare.prototype.constructor=THREE.LensFlare;THREE.LensFlare.prototype.supr=THREE.Object3D.prototype;
THREE.LensFlare.prototype.add=function(a,b,c,d,e,f){b===void 0&&(b=-1);c===void 0&&(c=0);f===void 0&&(f=1);e===void 0&&(e=new THREE.Color(16777215));if(d===void 0)d=THREE.NormalBlending;c=Math.min(c,Math.max(0,c));this.lensFlares.push({texture:a,size:b,distance:c,x:0,y:0,z:0,scale:1,rotation:1,opacity:f,color:e,blending:d})};
THREE.LensFlare.prototype.updateLensFlares=function(){var a,b=this.lensFlares.length,c,d=-this.positionScreen.x*2,e=-this.positionScreen.y*2;for(a=0;a<b;a++){c=this.lensFlares[a];c.x=this.positionScreen.x+d*c.distance;c.y=this.positionScreen.y+e*c.distance;c.wantedRotation=c.x*Math.PI*0.25;c.rotation=c.rotation+(c.wantedRotation-c.rotation)*0.25}};
THREE.MorphBlendMesh=function(a,b){THREE.Mesh.call(this,a,b);this.animationsMap={};this.animationsList=[];var c=this.geometry.morphTargets.length;this.createAnimation("__default",0,c-1,c/1);this.setAnimationWeight("__default",1)};THREE.MorphBlendMesh.prototype=new THREE.Mesh;THREE.MorphBlendMesh.prototype.constructor=THREE.MorphBlendMesh;
THREE.MorphBlendMesh.prototype.createAnimation=function(a,b,c,d){b={startFrame:b,endFrame:c,length:c-b+1,fps:d,duration:(c-b)/d,lastFrame:0,currentFrame:0,active:false,time:0,direction:1,weight:1,directionBackwards:false,mirroredLoop:false};this.animationsMap[a]=b;this.animationsList.push(b)};
THREE.MorphBlendMesh.prototype.autoCreateAnimations=function(a){for(var b=/([a-z]+)(\d+)/,c,d={},e=this.geometry,f=0,g=e.morphTargets.length;f<g;f++){var h=e.morphTargets[f].name.match(b);if(h&&h.length>1){var j=h[1];d[j]||(d[j]={start:Infinity,end:-Infinity});h=d[j];if(f<h.start)h.start=f;if(f>h.end)h.end=f;c||(c=j)}}for(j in d){h=d[j];this.createAnimation(j,h.start,h.end,a)}this.firstAnimation=c};
THREE.MorphBlendMesh.prototype.setAnimationDirectionForward=function(a){if(a=this.animationsMap[a]){a.direction=1;a.directionBackwards=false}};THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward=function(a){if(a=this.animationsMap[a]){a.direction=-1;a.directionBackwards=true}};THREE.MorphBlendMesh.prototype.setAnimationFPS=function(a,b){var c=this.animationsMap[a];if(c){c.fps=b;c.duration=(c.end-c.start)/c.fps}};
THREE.MorphBlendMesh.prototype.setAnimationDuration=function(a,b){var c=this.animationsMap[a];if(c){c.duration=b;c.fps=(c.end-c.start)/c.duration}};THREE.MorphBlendMesh.prototype.setAnimationWeight=function(a,b){var c=this.animationsMap[a];if(c)c.weight=b};THREE.MorphBlendMesh.prototype.setAnimationTime=function(a,b){var c=this.animationsMap[a];if(c)c.time=b};THREE.MorphBlendMesh.prototype.getAnimationTime=function(a){var b=0;if(a=this.animationsMap[a])b=a.time;return b};
THREE.MorphBlendMesh.prototype.getAnimationDuration=function(a){var b=-1;if(a=this.animationsMap[a])b=a.duration;return b};THREE.MorphBlendMesh.prototype.playAnimation=function(a){var b=this.animationsMap[a];if(b){b.time=0;b.active=true}else console.warn("animation["+a+"] undefined")};THREE.MorphBlendMesh.prototype.stopAnimation=function(a){if(a=this.animationsMap[a])a.active=false};
THREE.MorphBlendMesh.prototype.update=function(a){for(var b=0,c=this.animationsList.length;b<c;b++){var d=this.animationsList[b];if(d.active){var e=d.duration/d.length;d.time=d.time+d.direction*a;if(d.mirroredLoop){if(d.time>d.duration||d.time<0){d.direction=d.direction*-1;if(d.time>d.duration){d.time=d.duration;d.directionBackwards=true}if(d.time<0){d.time=0;d.directionBackwards=false}}}else{d.time=d.time%d.duration;if(d.time<0)d.time=d.time+d.duration}var f=d.startFrame+THREE.Math.clamp(Math.floor(d.time/
e),0,d.length-1),g=d.weight;if(f!==d.currentFrame){this.morphTargetInfluences[d.lastFrame]=0;this.morphTargetInfluences[d.currentFrame]=1*g;this.morphTargetInfluences[f]=0;d.lastFrame=d.currentFrame;d.currentFrame=f}e=d.time%e/e;d.directionBackwards&&(e=1-e);this.morphTargetInfluences[d.currentFrame]=e*g;this.morphTargetInfluences[d.lastFrame]=(1-e)*g}}};
THREE.LensFlarePlugin=function(){function a(a){var c=b.createProgram(),d=b.createShader(b.FRAGMENT_SHADER),e=b.createShader(b.VERTEX_SHADER);b.shaderSource(d,a.fragmentShader);b.shaderSource(e,a.vertexShader);b.compileShader(d);b.compileShader(e);b.attachShader(c,d);b.attachShader(c,e);b.linkProgram(c);return c}var b,c,d,e,f,g,h,j,l,k,p,m,o;this.init=function(q){b=q.context;c=q;d=new Float32Array(16);e=new Uint16Array(6);q=0;d[q++]=-1;d[q++]=-1;d[q++]=0;d[q++]=0;d[q++]=1;d[q++]=-1;d[q++]=1;d[q++]=
0;d[q++]=1;d[q++]=1;d[q++]=1;d[q++]=1;d[q++]=-1;d[q++]=1;d[q++]=0;d[q++]=1;q=0;e[q++]=0;e[q++]=1;e[q++]=2;e[q++]=0;e[q++]=2;e[q++]=3;f=b.createBuffer();g=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,f);b.bufferData(b.ARRAY_BUFFER,d,b.STATIC_DRAW);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,g);b.bufferData(b.ELEMENT_ARRAY_BUFFER,e,b.STATIC_DRAW);h=b.createTexture();j=b.createTexture();b.bindTexture(b.TEXTURE_2D,h);b.texImage2D(b.TEXTURE_2D,0,b.RGB,16,16,0,b.RGB,b.UNSIGNED_BYTE,null);b.texParameteri(b.TEXTURE_2D,
b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);b.bindTexture(b.TEXTURE_2D,j);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,16,16,0,b.RGBA,b.UNSIGNED_BYTE,null);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);
b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);if(b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS)<=0){l=false;k=a(THREE.ShaderFlares.lensFlare)}else{l=true;k=a(THREE.ShaderFlares.lensFlareVertexTexture)}p={};m={};p.vertex=b.getAttribLocation(k,"position");p.uv=b.getAttribLocation(k,"uv");m.renderType=b.getUniformLocation(k,"renderType");m.map=b.getUniformLocation(k,"map");m.occlusionMap=b.getUniformLocation(k,"occlusionMap");m.opacity=b.getUniformLocation(k,"opacity");m.color=b.getUniformLocation(k,
"color");m.scale=b.getUniformLocation(k,"scale");m.rotation=b.getUniformLocation(k,"rotation");m.screenPosition=b.getUniformLocation(k,"screenPosition");o=false};this.render=function(a,d,e,u){var a=a.__webglFlares,t=a.length;if(t){var y=new THREE.Vector3,s=u/e,w=e*0.5,H=u*0.5,E=16/u,z=new THREE.Vector2(E*s,E),v=new THREE.Vector3(1,1,0),A=new THREE.Vector2(1,1),J=m,E=p;b.useProgram(k);if(!o){b.enableVertexAttribArray(p.vertex);b.enableVertexAttribArray(p.uv);o=true}b.uniform1i(J.occlusionMap,0);b.uniform1i(J.map,
1);b.bindBuffer(b.ARRAY_BUFFER,f);b.vertexAttribPointer(E.vertex,2,b.FLOAT,false,16,0);b.vertexAttribPointer(E.uv,2,b.FLOAT,false,16,8);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,g);b.disable(b.CULL_FACE);b.depthMask(false);var K,R,P,D,M;for(K=0;K<t;K++){E=16/u;z.set(E*s,E);D=a[K];y.set(D.matrixWorld.elements[12],D.matrixWorld.elements[13],D.matrixWorld.elements[14]);d.matrixWorldInverse.multiplyVector3(y);d.projectionMatrix.multiplyVector3(y);v.copy(y);A.x=v.x*w+w;A.y=v.y*H+H;if(l||A.x>0&&A.x<e&&A.y>0&&
A.y<u){b.activeTexture(b.TEXTURE1);b.bindTexture(b.TEXTURE_2D,h);b.copyTexImage2D(b.TEXTURE_2D,0,b.RGB,A.x-8,A.y-8,16,16,0);b.uniform1i(J.renderType,0);b.uniform2f(J.scale,z.x,z.y);b.uniform3f(J.screenPosition,v.x,v.y,v.z);b.disable(b.BLEND);b.enable(b.DEPTH_TEST);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0);b.activeTexture(b.TEXTURE0);b.bindTexture(b.TEXTURE_2D,j);b.copyTexImage2D(b.TEXTURE_2D,0,b.RGBA,A.x-8,A.y-8,16,16,0);b.uniform1i(J.renderType,1);b.disable(b.DEPTH_TEST);b.activeTexture(b.TEXTURE1);
b.bindTexture(b.TEXTURE_2D,h);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0);D.positionScreen.copy(v);D.customUpdateCallback?D.customUpdateCallback(D):D.updateLensFlares();b.uniform1i(J.renderType,2);b.enable(b.BLEND);R=0;for(P=D.lensFlares.length;R<P;R++){M=D.lensFlares[R];if(M.opacity>0.001&&M.scale>0.001){v.x=M.x;v.y=M.y;v.z=M.z;E=M.size*M.scale/u;z.x=E*s;z.y=E;b.uniform3f(J.screenPosition,v.x,v.y,v.z);b.uniform2f(J.scale,z.x,z.y);b.uniform1f(J.rotation,M.rotation);b.uniform1f(J.opacity,M.opacity);
b.uniform3f(J.color,M.color.r,M.color.g,M.color.b);c.setBlending(M.blending,M.blendEquation,M.blendSrc,M.blendDst);c.setTexture(M.texture,1);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0)}}}}b.enable(b.CULL_FACE);b.enable(b.DEPTH_TEST);b.depthMask(true)}}};
THREE.ShadowMapPlugin=function(){var a,b,c,d,e=new THREE.Frustum,f=new THREE.Matrix4,g=new THREE.Vector3,h=new THREE.Vector3;this.init=function(e){a=e.context;b=e;var e=THREE.ShaderLib.depthRGBA,f=THREE.UniformsUtils.clone(e.uniforms);c=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:f});d=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:f,morphTargets:true});c._shadowPass=true;d._shadowPass=true};this.render=
function(a,c){b.shadowMapEnabled&&b.shadowMapAutoUpdate&&this.update(a,c)};this.update=function(j,l){var k,p,m,o,q,n,r,u,t,y=[];o=0;a.clearColor(1,1,1,1);a.disable(a.BLEND);a.enable(a.CULL_FACE);b.shadowMapCullFrontFaces?a.cullFace(a.FRONT):a.cullFace(a.BACK);b.setDepthTest(true);k=0;for(p=j.__lights.length;k<p;k++){m=j.__lights[k];if(m.castShadow)if(m instanceof THREE.DirectionalLight&&m.shadowCascade)for(q=0;q<m.shadowCascadeCount;q++){var s;if(m.shadowCascadeArray[q])s=m.shadowCascadeArray[q];
else{t=m;r=q;s=new THREE.DirectionalLight;s.isVirtual=true;s.onlyShadow=true;s.castShadow=true;s.shadowCameraNear=t.shadowCameraNear;s.shadowCameraFar=t.shadowCameraFar;s.shadowCameraLeft=t.shadowCameraLeft;s.shadowCameraRight=t.shadowCameraRight;s.shadowCameraBottom=t.shadowCameraBottom;s.shadowCameraTop=t.shadowCameraTop;s.shadowCameraVisible=t.shadowCameraVisible;s.shadowDarkness=t.shadowDarkness;s.shadowBias=t.shadowCascadeBias[r];s.shadowMapWidth=t.shadowCascadeWidth[r];s.shadowMapHeight=t.shadowCascadeHeight[r];
s.pointsWorld=[];s.pointsFrustum=[];u=s.pointsWorld;n=s.pointsFrustum;for(var w=0;w<8;w++){u[w]=new THREE.Vector3;n[w]=new THREE.Vector3}u=t.shadowCascadeNearZ[r];t=t.shadowCascadeFarZ[r];n[0].set(-1,-1,u);n[1].set(1,-1,u);n[2].set(-1,1,u);n[3].set(1,1,u);n[4].set(-1,-1,t);n[5].set(1,-1,t);n[6].set(-1,1,t);n[7].set(1,1,t);s.originalCamera=l;n=new THREE.Gyroscope;n.position=m.shadowCascadeOffset;n.add(s);n.add(s.target);l.add(n);m.shadowCascadeArray[q]=s;console.log("Created virtualLight",s)}r=m;u=
q;t=r.shadowCascadeArray[u];t.position.copy(r.position);t.target.position.copy(r.target.position);t.lookAt(t.target);t.shadowCameraVisible=r.shadowCameraVisible;t.shadowDarkness=r.shadowDarkness;t.shadowBias=r.shadowCascadeBias[u];n=r.shadowCascadeNearZ[u];r=r.shadowCascadeFarZ[u];t=t.pointsFrustum;t[0].z=n;t[1].z=n;t[2].z=n;t[3].z=n;t[4].z=r;t[5].z=r;t[6].z=r;t[7].z=r;y[o]=s;o++}else{y[o]=m;o++}}k=0;for(p=y.length;k<p;k++){m=y[k];if(!m.shadowMap){m.shadowMap=new THREE.WebGLRenderTarget(m.shadowMapWidth,
m.shadowMapHeight,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat});m.shadowMapSize=new THREE.Vector2(m.shadowMapWidth,m.shadowMapHeight);m.shadowMatrix=new THREE.Matrix4}if(!m.shadowCamera){if(m instanceof THREE.SpotLight)m.shadowCamera=new THREE.PerspectiveCamera(m.shadowCameraFov,m.shadowMapWidth/m.shadowMapHeight,m.shadowCameraNear,m.shadowCameraFar);else if(m instanceof THREE.DirectionalLight)m.shadowCamera=new THREE.OrthographicCamera(m.shadowCameraLeft,m.shadowCameraRight,
m.shadowCameraTop,m.shadowCameraBottom,m.shadowCameraNear,m.shadowCameraFar);else{console.error("Unsupported light type for shadow");continue}j.add(m.shadowCamera);b.autoUpdateScene&&j.updateMatrixWorld()}if(m.shadowCameraVisible&&!m.cameraHelper){m.cameraHelper=new THREE.CameraHelper(m.shadowCamera);m.shadowCamera.add(m.cameraHelper)}if(m.isVirtual&&s.originalCamera==l){q=l;o=m.shadowCamera;n=m.pointsFrustum;t=m.pointsWorld;g.set(Infinity,Infinity,Infinity);h.set(-Infinity,-Infinity,-Infinity);for(r=
0;r<8;r++){u=t[r];u.copy(n[r]);THREE.ShadowMapPlugin.__projector.unprojectVector(u,q);o.matrixWorldInverse.multiplyVector3(u);if(u.x<g.x)g.x=u.x;if(u.x>h.x)h.x=u.x;if(u.y<g.y)g.y=u.y;if(u.y>h.y)h.y=u.y;if(u.z<g.z)g.z=u.z;if(u.z>h.z)h.z=u.z}o.left=g.x;o.right=h.x;o.top=h.y;o.bottom=g.y;o.updateProjectionMatrix()}o=m.shadowMap;n=m.shadowMatrix;q=m.shadowCamera;q.position.copy(m.matrixWorld.getPosition());q.lookAt(m.target.matrixWorld.getPosition());q.updateMatrixWorld();q.matrixWorldInverse.getInverse(q.matrixWorld);
if(m.cameraHelper)m.cameraHelper.lines.visible=m.shadowCameraVisible;m.shadowCameraVisible&&m.cameraHelper.update();n.set(0.5,0,0,0.5,0,0.5,0,0.5,0,0,0.5,0.5,0,0,0,1);n.multiplySelf(q.projectionMatrix);n.multiplySelf(q.matrixWorldInverse);if(!q._viewMatrixArray)q._viewMatrixArray=new Float32Array(16);if(!q._projectionMatrixArray)q._projectionMatrixArray=new Float32Array(16);q.matrixWorldInverse.flattenToArray(q._viewMatrixArray);q.projectionMatrix.flattenToArray(q._projectionMatrixArray);f.multiply(q.projectionMatrix,
q.matrixWorldInverse);e.setFromMatrix(f);b.setRenderTarget(o);b.clear();t=j.__webglObjects;m=0;for(o=t.length;m<o;m++){r=t[m];n=r.object;r.render=false;if(n.visible&&n.castShadow&&(!(n instanceof THREE.Mesh)||!n.frustumCulled||e.contains(n))){n._modelViewMatrix.multiply(q.matrixWorldInverse,n.matrixWorld);r.render=true}}m=0;for(o=t.length;m<o;m++){r=t[m];if(r.render){n=r.object;r=r.buffer;u=n.customDepthMaterial?n.customDepthMaterial:n.geometry.morphTargets.length?d:c;r instanceof THREE.BufferGeometry?
b.renderBufferDirect(q,j.__lights,null,u,r,n):b.renderBuffer(q,j.__lights,null,u,r,n)}}t=j.__webglObjectsImmediate;m=0;for(o=t.length;m<o;m++){r=t[m];n=r.object;if(n.visible&&n.castShadow){n._modelViewMatrix.multiply(q.matrixWorldInverse,n.matrixWorld);b.renderImmediateObject(q,j.__lights,null,c,n)}}}k=b.getClearColor();p=b.getClearAlpha();a.clearColor(k.r,k.g,k.b,p);a.enable(a.BLEND);b.shadowMapCullFrontFaces&&a.cullFace(a.BACK)}};THREE.ShadowMapPlugin.__projector=new THREE.Projector;
THREE.SpritePlugin=function(){function a(a,b){return b.z-a.z}var b,c,d,e,f,g,h,j,l,k;this.init=function(a){b=a.context;c=a;d=new Float32Array(16);e=new Uint16Array(6);a=0;d[a++]=-1;d[a++]=-1;d[a++]=0;d[a++]=1;d[a++]=1;d[a++]=-1;d[a++]=1;d[a++]=1;d[a++]=1;d[a++]=1;d[a++]=1;d[a++]=0;d[a++]=-1;d[a++]=1;d[a++]=0;a=d[a++]=0;e[a++]=0;e[a++]=1;e[a++]=2;e[a++]=0;e[a++]=2;e[a++]=3;f=b.createBuffer();g=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,f);b.bufferData(b.ARRAY_BUFFER,d,b.STATIC_DRAW);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,
g);b.bufferData(b.ELEMENT_ARRAY_BUFFER,e,b.STATIC_DRAW);var a=THREE.ShaderSprite.sprite,m=b.createProgram(),o=b.createShader(b.FRAGMENT_SHADER),q=b.createShader(b.VERTEX_SHADER);b.shaderSource(o,a.fragmentShader);b.shaderSource(q,a.vertexShader);b.compileShader(o);b.compileShader(q);b.attachShader(m,o);b.attachShader(m,q);b.linkProgram(m);h=m;j={};l={};j.position=b.getAttribLocation(h,"position");j.uv=b.getAttribLocation(h,"uv");l.uvOffset=b.getUniformLocation(h,"uvOffset");l.uvScale=b.getUniformLocation(h,
"uvScale");l.rotation=b.getUniformLocation(h,"rotation");l.scale=b.getUniformLocation(h,"scale");l.alignment=b.getUniformLocation(h,"alignment");l.color=b.getUniformLocation(h,"color");l.map=b.getUniformLocation(h,"map");l.opacity=b.getUniformLocation(h,"opacity");l.useScreenCoordinates=b.getUniformLocation(h,"useScreenCoordinates");l.affectedByDistance=b.getUniformLocation(h,"affectedByDistance");l.screenPosition=b.getUniformLocation(h,"screenPosition");l.modelViewMatrix=b.getUniformLocation(h,"modelViewMatrix");
l.projectionMatrix=b.getUniformLocation(h,"projectionMatrix");k=false};this.render=function(d,e,o,q){var d=d.__webglSprites,n=d.length;if(n){var r=j,u=l,t=q/o,o=o*0.5,y=q*0.5,s=true;b.useProgram(h);if(!k){b.enableVertexAttribArray(r.position);b.enableVertexAttribArray(r.uv);k=true}b.disable(b.CULL_FACE);b.enable(b.BLEND);b.depthMask(true);b.bindBuffer(b.ARRAY_BUFFER,f);b.vertexAttribPointer(r.position,2,b.FLOAT,false,16,0);b.vertexAttribPointer(r.uv,2,b.FLOAT,false,16,8);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,
g);b.uniformMatrix4fv(u.projectionMatrix,false,e._projectionMatrixArray);b.activeTexture(b.TEXTURE0);b.uniform1i(u.map,0);for(var w,H=[],r=0;r<n;r++){w=d[r];if(w.visible&&w.opacity!==0)if(w.useScreenCoordinates)w.z=-w.position.z;else{w._modelViewMatrix.multiply(e.matrixWorldInverse,w.matrixWorld);w.z=-w._modelViewMatrix.elements[14]}}d.sort(a);for(r=0;r<n;r++){w=d[r];if(w.visible&&w.opacity!==0&&w.map&&w.map.image&&w.map.image.width){if(w.useScreenCoordinates){b.uniform1i(u.useScreenCoordinates,1);
b.uniform3f(u.screenPosition,(w.position.x-o)/o,(y-w.position.y)/y,Math.max(0,Math.min(1,w.position.z)))}else{b.uniform1i(u.useScreenCoordinates,0);b.uniform1i(u.affectedByDistance,w.affectedByDistance?1:0);b.uniformMatrix4fv(u.modelViewMatrix,false,w._modelViewMatrix.elements)}e=w.map.image.width/(w.scaleByViewport?q:1);H[0]=e*t*w.scale.x;H[1]=e*w.scale.y;b.uniform2f(u.uvScale,w.uvScale.x,w.uvScale.y);b.uniform2f(u.uvOffset,w.uvOffset.x,w.uvOffset.y);b.uniform2f(u.alignment,w.alignment.x,w.alignment.y);
b.uniform1f(u.opacity,w.opacity);b.uniform3f(u.color,w.color.r,w.color.g,w.color.b);b.uniform1f(u.rotation,w.rotation);b.uniform2fv(u.scale,H);if(w.mergeWith3D&&!s){b.enable(b.DEPTH_TEST);s=true}else if(!w.mergeWith3D&&s){b.disable(b.DEPTH_TEST);s=false}c.setBlending(w.blending,w.blendEquation,w.blendSrc,w.blendDst);c.setTexture(w.map,0);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0)}}b.enable(b.CULL_FACE);b.enable(b.DEPTH_TEST);b.depthMask(true)}}};
THREE.DepthPassPlugin=function(){this.enabled=false;this.renderTarget=null;var a,b,c,d,e=new THREE.Frustum,f=new THREE.Matrix4;this.init=function(e){a=e.context;b=e;var e=THREE.ShaderLib.depthRGBA,f=THREE.UniformsUtils.clone(e.uniforms);c=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:f});d=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:f,morphTargets:true});c._shadowPass=true;d._shadowPass=true};this.render=
function(a,b){this.enabled&&this.update(a,b)};this.update=function(g,h){var j,l,k,p,m,o;a.clearColor(1,1,1,1);a.disable(a.BLEND);b.setDepthTest(true);b.autoUpdateScene&&g.updateMatrixWorld();if(!h._viewMatrixArray)h._viewMatrixArray=new Float32Array(16);if(!h._projectionMatrixArray)h._projectionMatrixArray=new Float32Array(16);h.matrixWorldInverse.getInverse(h.matrixWorld);h.matrixWorldInverse.flattenToArray(h._viewMatrixArray);h.projectionMatrix.flattenToArray(h._projectionMatrixArray);f.multiply(h.projectionMatrix,
h.matrixWorldInverse);e.setFromMatrix(f);b.setRenderTarget(this.renderTarget);b.clear();o=g.__webglObjects;j=0;for(l=o.length;j<l;j++){k=o[j];m=k.object;k.render=false;if(m.visible&&(!(m instanceof THREE.Mesh)||!m.frustumCulled||e.contains(m))){m._modelViewMatrix.multiply(h.matrixWorldInverse,m.matrixWorld);k.render=true}}j=0;for(l=o.length;j<l;j++){k=o[j];if(k.render){m=k.object;k=k.buffer;b.setObjectFaces(m);p=m.customDepthMaterial?m.customDepthMaterial:m.geometry.morphTargets.length?d:c;k instanceof
THREE.BufferGeometry?b.renderBufferDirect(h,g.__lights,null,p,k,m):b.renderBuffer(h,g.__lights,null,p,k,m)}}o=g.__webglObjectsImmediate;j=0;for(l=o.length;j<l;j++){k=o[j];m=k.object;if(m.visible&&m.castShadow){m._modelViewMatrix.multiply(h.matrixWorldInverse,m.matrixWorld);b.renderImmediateObject(h,g.__lights,null,c,m)}}j=b.getClearColor();l=b.getClearAlpha();a.clearColor(j.r,j.g,j.b,l);a.enable(a.BLEND)}};
THREE.ShaderFlares={lensFlareVertexTexture:{vertexShader:"uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility = (       visibility.r / 9.0 ) *\n( 1.0 - visibility.g / 9.0 ) *\n(       visibility.b / 9.0 ) *\n( 1.0 - visibility.a / 9.0 );\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",fragmentShader:"precision mediump float;\nuniform sampler2D map;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"},
lensFlare:{vertexShader:"uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",fragmentShader:"precision mediump float;\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * visibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"}};
THREE.ShaderSprite={sprite:{vertexShader:"uniform int useScreenCoordinates;\nuniform int affectedByDistance;\nuniform vec3 screenPosition;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 alignment;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position + alignment;\nvec2 rotatedPosition;\nrotatedPosition.x = ( cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y ) * scale.x;\nrotatedPosition.y = ( sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y ) * scale.y;\nvec4 finalPosition;\nif( useScreenCoordinates != 0 ) {\nfinalPosition = vec4( screenPosition.xy + rotatedPosition, screenPosition.z, 1.0 );\n} else {\nfinalPosition = projectionMatrix * modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition * ( affectedByDistance == 1 ? 1.0 : finalPosition.z );\n}\ngl_Position = finalPosition;\n}",
fragmentShader:"precision mediump float;\nuniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\n}"}};
// tquery.js - https://github.com/jeromeetienne/tquery - MIT License
/**
 * @fileOverview This file is the core of tQuery library. 
*/

/**
 * Create a tQuery element
 *
 * @class root class
 * 
 * @param {} object
 * @param {THREE.Object3D} rootnode
 * @returns {tQuery.*} the tQuery object created
*/
var tQuery	= function(object, root)
{
	// support for tQuery(geometry, material)
	if( arguments.length === 2 && 
			(arguments[0] instanceof THREE.Geometry || arguments[0] instanceof tQuery.Geometry)
			&& 
			(arguments[1] instanceof THREE.Material || arguments[1] instanceof tQuery.Material)
			){
		var tGeometry	= arguments[0] instanceof tQuery.Geometry ? arguments[0].get(0) : arguments[0];
		var tMaterial	= arguments[1] instanceof tQuery.Material ? arguments[1].get(0) : arguments[1];
		var tMesh	= new THREE.Mesh(tGeometry, tMaterial);
		return tQuery( tMesh );
	}

// TODO make tthat cleaner
// - there is a list of functions registered by each plugins
//   - handle() object instanceof THREE.Mesh
//   - create() return new tQuery(object)
// - this list is processed in order here

	// if the object is an array, compare only the first element
	// - up to the subconstructor to check if the whole array has proper type
	var instance	= Array.isArray(object) ? object[0] : object;

	if( instance instanceof THREE.Mesh  && tQuery.Mesh){
		return new tQuery.Mesh(object);
	}else if( instance instanceof THREE.DirectionalLight && tQuery.DirectionalLight){
		return new tQuery.DirectionalLight(object);
	}else if( instance instanceof THREE.AmbientLight && tQuery.AmbientLight){
		return new tQuery.AmbientLight(object);
	}else if( instance instanceof THREE.Light && tQuery.Light){
		return new tQuery.Light(object);

	}else if( instance instanceof THREE.Object3D  && tQuery.Object3D){
		return new tQuery.Object3D(object);
	}else if( instance instanceof THREE.Geometry && tQuery.Geometry){
		return new tQuery.Geometry(object);
	}else if( instance instanceof THREE.Material && tQuery.Material){
		return new tQuery.Material(object);
	}else if( typeof instance === "string" && tQuery.Object3D){
		return new tQuery.Object3D(object, root);
	}else{
		console.assert(false, "unsupported type")
	}
	return undefined;
};

/**
 * The version of tQuery
*/
tQuery.VERSION	= "r49.1";

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * generic getter/setter
 * 
 * @param {Object} object the object in which store the data
 * @param {String} key the key/name of the data to get/set
 * @param {*} value the value to set (optional)
 * @param {Boolean} mustNotExist if true, ensure that the key doesnt already exist, optional default to false
 * 
 * @returns {*} return the value stored in this object for this key
*/
tQuery.data	= function(object, key, value, mustNotExist)
{
	// sanity check
	console.assert( object, 'invalid parameters' );
	console.assert( typeof key === 'string', 'invalid parameters');

	// init _tqData
	object['_tqData']	= object['_tqData']	|| {};
	// honor mustNotExist
	if( mustNotExist ){
		console.assert(object['_tqData'][key] === undefined, "This key already exists "+key);
	}
	// set the value if any
	if( value ){
		object['_tqData'][key]	= value;
	}
	// return the value
	return object['_tqData'][key];
};

/**
 * Same as jQuery.removeData()
 *
 * @param {Boolean} mustExist if true, ensure the key does exist, default to false
*/
tQuery.removeData	= function(object, key, mustExist)
{
	// handle the 'key as Array' case
	if( key instanceof Array ){
		key.forEach(function(key){
			tQuery.removeData(object, key);
		})
		return;
	}
	// sanity check
	console.assert( typeof key === "string");
	// honor mustNotExist
	if( mustExist ){
		console.assert(object['_tqData'][key] !== undefined, "This key doesnt already exists "+key);
	}
	// do delete the key
	delete object['_tqData'][key];
	// TOTO remove object[_tqData] if empty now
}


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * loop over a Array.
 * 
 * @param {Array} arr the array to traverse.
 * @param {Function} callback the function to notify. function(element){ }.
 * 			loop interrupted if it returns false
 * 
 * @returns {Boolean} return true if completed, false if interrupted
*/
tQuery.each	= function(arr, callback){
	for(var i = 0; i < arr.length; i++){
		var keepLooping	= callback(arr[i])
		if( keepLooping === false )	return false;
	}
	return true;
};

/**
 * Make a child Class inherit from the parent class.
 *
 * @param {Object} childClass the child class which gonna inherit
 * @param {Object} parentClass the class which gonna be inherited
*/
tQuery.inherit	= function(childClass, parentClass){
	// trick to avoid calling parentClass constructor
	var tempFn		= function() {};
	tempFn.prototype	= parentClass.prototype;
	childClass.prototype	= new tempFn();

	childClass.parent	= parentClass.prototype;
	childClass.prototype.constructor= childClass;	
};

/**
 * extend function. mainly aimed at handling default values - jme: im not sure at all it is the proper one.
 * http://jsapi.info/_/extend
 * similar to jquery one but much smaller
*/
tQuery.extend = function(obj, base){
	var result	= {};
	base && Object.keys(base).forEach(function(key){
		result[key]	= base[key];
	})
	obj && Object.keys(obj).forEach(function(key){
		result[key]	= obj[key];
	})
	return result;
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Make an object pluginable
 * 
 * @param {Object} object the object on which you mixin function
 * @param {Object} dest the object in which to register the plugin
 * @param {string} suffix the suffix to add to the function name
*/
tQuery._pluginsOn	= function(object, dest, fnNameSuffix){
	dest		= dest	|| object.prototype || object;
	fnNameSuffix	= fnNameSuffix || '';
	object['register'+fnNameSuffix]		= function(name, funct) {
		if( dest[name] ){
			throw new Error('Conflict! Already method called: ' + name);
		}
		dest[name]	= funct;
	};
	object['unregister'+fnNameSuffix]	= function(name){
		if( dest.hasOwnProperty(name) === false ){
			throw new Error('Plugin not found: ' + name);
		}
		delete dest[name];
	};
	object['registered'+fnNameSuffix]	= function(name){
		return dest.hasOwnProperty(name) === true;
	}
};

tQuery.pluginsInstanceOn= function(klass){ return tQuery._pluginsOn(klass);			};
tQuery.pluginsStaticOn	= function(klass){ return tQuery._pluginsOn(klass, klass, 'Static');	};

/** for backward compatibility only */
tQuery.pluginsOn	= function(object, dest){
	console.warn("tQuery.pluginsOn is obsolete. prefere .pluginsInstanceOn, .pluginsStaticOn");
	console.trace();
	return tQuery._pluginsOn(object, dest)
}
// make it pluginable
tQuery.pluginsOn(tQuery, tQuery);


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

tQuery.mixinAttributes	= function(dstObject, properties){
	// mixin the new property
	// FIXME the inheritance should work now... not sure
	dstObject.prototype._attrProps	= tQuery.extend(dstObject.prototype._attrProps, properties);

	dstObject.prototype.attr	= function(name, value){
		// handle parameters
		if( name instanceof Object && value === undefined ){
			Object.keys(name).forEach(function(key){
				this.attr(key, name[key]);
			}.bind(this));
		}else if( typeof(name) === 'string' ){
			console.assert( Object.keys(this._attrProps).indexOf(name) !== -1, 'invalid property name:'+name);
		}else	console.assert(false, 'invalid parameter');

		// handle setter
		if( value !== undefined ){
			var convertFn	= this._attrProps[name];
			value		= convertFn(value);
			this.each(function(element){
				element[name]	= value;
			})
			return this;			
		}
		// handle getter
		if( this.length === 0 )	return undefined
		var element	= this.get(0);
		return element[name];
	};

	// add shortcuts
	Object.keys(properties).forEach(function(name){
		dstObject.prototype[name]	= function(value){
			return this.attr(name, value);
		};
	}.bind(this));
};

//////////////////////////////////////////////////////////////////////////////////
//		put some helpers						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Flow control - from https://github.com/jeromeetienne/gowiththeflow.js
*/
tQuery.Flow	= function(){
	var self, stack = [], timerId = setTimeout(function(){ timerId = null; self._next(); }, 0);
	return self = {
		destroy	: function(){ timerId && clearTimeout(timerId);	},
		par	: function(callback, isSeq){
			if(isSeq || !(stack[stack.length-1] instanceof Array)) stack.push([]);
			stack[stack.length-1].push(callback);
			return self;
		},seq	: function(callback){ return self.par(callback, true);	},
		_next	: function(err, result){
			var errors = [], results = [], callbacks = stack.shift() || [], nbReturn = callbacks.length, isSeq = nbReturn == 1;
			callbacks && callbacks.forEach(function(fct, index){
				fct(function(error, result){
					errors[index]	= error;
					results[index]	= result;		
					if(--nbReturn == 0)	self._next(isSeq?errors[0]:errors, isSeq?results[0]:results)
				}, err, result)
			})
		}
	}
};

/**
 * microevents.js - https://github.com/jeromeetienne/microevent.js
*/
tQuery.MicroeventMixin	= function(destObj){
	var bind	= function(event, fct){
		if(this._events === undefined) 	this._events	= {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
		return fct;
	};
	var unbind	= function(event, fct){
		if(this._events === undefined) 	this._events	= {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	};
	var trigger	= function(event /* , args... */){
		if(this._events === undefined) 	this._events	= {};
		if( this._events[event] === undefined )	return;
		var tmpArray	= this._events[event].slice(); 
		for(var i = 0; i < tmpArray.length; i++){
			tmpArray[i].apply(this, Array.prototype.slice.call(arguments, 1))
		}
	};
	
	// backward compatibility
	destObj.bind	= bind;
	destObj.unbind	= unbind;
	destObj.trigger	= trigger;

	destObj.addEventListener	= function(event, fct){
		this.bind(event, fct)
		return this;	// for chained API
	}
	destObj.removeEventListener	= function(event, fct){
		this.unbind(event, fct)
		return this;	// for chained API
	}
	destObj.dispatchEvent		= function(event /* , args... */){
		this.trigger.apply(this, arguments)
		return this;
	}
};

tQuery.convert	= {};

/**
 * Convert the value into a THREE.Color object
 * 
 * @return {THREE.Color} the resulting color
*/
tQuery.convert.toThreeColor	= function(value){
	if( arguments.length === 1 && typeof(value) === 'number'){
		return new THREE.Color(value);
	}else if( arguments.length === 1 && value instanceof THREE.Color ){
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.toNumber	= function(value){
	if( arguments.length === 1 && typeof(value) === 'number'){
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.toNumberZeroToOne	= function(value){
	if( arguments.length === 1 && typeof(value) === 'number'){
		value	= Math.min(value, 1.0);
		value	= Math.max(value, 0);
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.toInteger	= function(value){
	if( arguments.length === 1 && typeof(value) === 'number'){
		value	= Math.floor(value);
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.identity	= function(value){
	return value;
};

tQuery.convert.toBoolean	= function(value){
	if( arguments.length === 1 && typeof(value) === 'boolean'){
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.toString	= function(value){
	if( arguments.length === 1 && typeof(value) === 'string'){
		return value;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};

tQuery.convert.toTexture	= function(value){
	if( arguments.length === 1 && value instanceof THREE.Texture ){
		return value;
	}else if( arguments.length === 1 && typeof(value) === 'string' ){
		return THREE.ImageUtils.loadTexture(value);
	}else if( arguments.length === 1 && (value instanceof Image || value instanceof HTMLCanvasElement) ){
		var texture		= new THREE.Texture( value );
		texture.needsUpdate	= true;
		return texture;
	}else{
		console.assert(false, "invalid parameter");
	}
	return undefined;	// never reached - just to workaround linter complaint
};
/**
 * implementation of the tQuery.Node
 *
 * @class base class for tQuery objects
 *
 * @param {Object} object an instance or an array of instance
*/
tQuery.Node	= function(object)
{
	// handle parameters
	if( object instanceof Array )	this._lists	= object;
	else if( !object )		this._lists	= [];
	else				this._lists	= [object];
	this.length	= this._lists.length;
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Retrieve the elements matched by the tQuery object
 * 
 * @param {Function} callback the function to notify. function(element){ }.
 * 			loop interrupted if it returns false
 * 
 * @returns {Boolean} return true if completed, false if interrupted
*/
tQuery.Node.prototype.get	= function(idx)
{
	if( idx === undefined )	return this._lists;
	// sanity check - it MUST be defined
	console.assert(this._lists[idx], "element not defined");
	return this._lists[idx];
};

/**
 * loop over element
 * 
 * @param {Function} callback the function to notify. function(element){ }.
 * 			loop interrupted if it returns false
 * 
 * @returns {Boolean} return true if completed, false if interrupted
*/
tQuery.Node.prototype.each	= function(callback)
{
	return tQuery.each(this._lists, callback)
};

/**
 * getter/setter of the back pointer
 *
 * @param {Object} back the value to return when .back() is called. optional
*/
tQuery.Node.prototype.back	= function(value)
{
	if( value  === undefined )	return this._back;
	this._back	= value;
	return this;
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * same as .data() in jquery
*/
tQuery.Node.prototype.data	= function(key, value)
{
	// handle the setter case
	if( value ){
		this.each(function(element){
			tQuery.data(element, key, value);
		});
		return this;	// for chained API
	}
	// return the value of the first element
	if( this.length > 0 )	return tQuery.data(this.get(0), key)
	// return undegined if the list is empty
	console.assert(this.length === 0);
	return undefined
}


/**
 * same as .data() in jquery
*/
tQuery.Node.prototype.removeData	= function(key)
{
	this.each(function(element){
		tQuery.removeData(element, key);
	});
	return this;	// for chained API
}/**
 * Handle object3D
 *
 * @class include THREE.Object3D
 *
 * @param {} object
 * @param {THREE.Object3D} rootnode
 * @returns {tQuery.*} the tQuery object created
*/
tQuery.Object3D	= function(object, root)
{
	// handle the case of selector
	if( typeof object === "string" ){
		object	= tQuery.Object3D._select(object, root);
	}

	// call parent ctor
	tQuery.Object3D.parent.constructor.call(this, object)

	// sanity check - all items MUST be THREE.Object3D
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Object3D); });
};

/**
 * inherit from tQuery.Node
*/
tQuery.inherit(tQuery.Object3D, tQuery.Node);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.Object3D);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.Object3D, {
	eulerOrder		: tQuery.convert.toString,
	
	doubleSided		: tQuery.convert.toBoolean,
	flipSided		: tQuery.convert.toBoolean,
	
	rotationAutoUpdate	: tQuery.convert.toBoolean,
	matrixAutoUpdate	: tQuery.convert.toBoolean,
	matrixWorldNeedsUpdate	: tQuery.convert.toBoolean,
	useQuaternion		: tQuery.convert.toBoolean,

	visible			: tQuery.convert.toBoolean,

	receiveShadow		: tQuery.convert.toBoolean,
	castShadow		: tQuery.convert.toBoolean
});

/**
 * Traverse the hierarchy of Object3D. 
 * 
 * @returns {tQuery.Object3D} return the tQuery.Object3D itself
*/
tQuery.Object3D.prototype.traverseHierarchy	= function(callback){
	this.each(function(object3d){
		THREE.SceneUtils.traverseHierarchy(object3d, function(object3d){
			callback(object3d);
		});
	});
	return this;	// for chained API
};


//////////////////////////////////////////////////////////////////////////////////
//		geometry and material						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * get geometry.
 *
 * TODO this should be move in tQuery.Mesh
 * 
 * @returns {tQuery.Geometry} return the geometries from the tQuery.Object3D
*/
tQuery.Object3D.prototype.geometry	= function(value){
	var geometries	= [];
	this.each(function(object3d){
		geometries.push(object3d.geometry)
	});
	return new tQuery.Geometry(geometries).back(this);
};

/**
 * get material.
 * 
 * TODO this should be move in tQuery.Mesh
 * 
 * @returns {tQuery.Material} return the materials from the tQuery.Object3D
*/
tQuery.Object3D.prototype.material	= function(){
	var materials	= [];
	this.each(function(object3d){
		materials.push(object3d.material)
	});
	return new tQuery.Material(materials);
};


/**
 * Clone a Object3D
*/
tQuery.Object3D.prototype.clone	= function(){
	var clones	= [];
	this._lists.forEach(function(object3d){
		var clone	= THREE.SceneUtils.cloneObject(object3d)
		clones.push(clone);
	})  
	return tQuery(clones)
}

//////////////////////////////////////////////////////////////////////////////////
//			addTo/removeFrom tQuery.World/tQuery.Object3d		//
//////////////////////////////////////////////////////////////////////////////////

/**
 * add all matched elements to a world
 * 
 * @param {tQuery.World or tQuery.Object3D} target object to which add it
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.addTo	= function(target)
{
	console.assert( target instanceof tQuery.World || target instanceof tQuery.Object3D || target instanceof THREE.Object3D )
	this.each(function(object3d){
		target.add(object3d)
	}.bind(this));
	return this;
}

/**
 * remove all matched elements from a world
 * 
 * @param {tQuery.World or tQuery.Object3D} target object to which add it
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.removeFrom	= function(target)
{
	console.assert( target instanceof tQuery.World || target instanceof tQuery.Object3D )
	this.each(function(object3d){
		target.remove(object3d)
	}.bind(this));
	return this;
}

//////////////////////////////////////////////////////////////////////////////////
//			addTo/removeFrom tQuery.World/tQuery.Object3d		//
//////////////////////////////////////////////////////////////////////////////////

/**
 * add all matched elements to a world
 * 
 * @param {tQuery.Object3D} target object to which add it
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.add	= function(object3d)
{
	if( object3d instanceof tQuery.Object3D ){
		this.each(function(object1){
			object3d.each(function(object2){
				object1.add(object2);
			})
		}.bind(this));
	}else if( object3d instanceof THREE.Object3D ){
		this.each(function(object1){
			object1.add(object3d);
		});
	}else	console.assert(false, "invalid parameter");
	return this;
}

/**
 * remove all matched elements from a world
 * 
 * @param {tQuery.Object3D} object3d the object to add in this object
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.remove	= function(tqObject3d)
{
	console.assert( tqObject3d instanceof tQuery.Object3D )
	this.each(function(object1){
		tqObject3d.each(function(object2){
			object1.remove(object2);
		})
	}.bind(this));
	return this;
}

//////////////////////////////////////////////////////////////////////////////////
//		Handle dom attribute						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Getter/Setter for the id of the matched elements
*/
tQuery.Object3D.prototype.id	= function(value)
{
	// sanity check 
	console.assert(this.length <= 1, "tQuery.Object3D.id used on multi-elements" );
	if( value !== undefined ){
		if( this.length > 0 ){
			var object3d	= this.get(0);
			object3d._tqId	= value;
		}
		return this;
	}else{
		if( this.length > 0 ){
			var object3d	= this.get(0);
			return object3d._tqId;
		}
		return undefined;
	}
};

/**
 * add a class to all matched elements
 * 
 * @param {string} className the name of the class to add
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.addClass	= function(className){
	this.each(function(tObject3d){
		// init ._tqClasses if needed
		tObject3d._tqClasses	= tObject3d._tqClasses	|| '';

		if( tQuery.Object3D._hasClassOne(tObject3d, className) )	return;
		
		tObject3d._tqClasses	+= ' '+className;
	}.bind(this));
	return this;
};

/**
 * remove a class to all matched elements
 * 
 * @param {string} className the name of the class to remove
 * @returns {tQuery.Object3D} chained API
*/
tQuery.Object3D.prototype.removeClass	= function(className){
	this.each(function(tObject3d){
		tQuery.Object3D._removeClassOne(tObject3d, className);
	}.bind(this));
	return this;	// for chained api
};

/**
 * return true if any of the matched elements has this class
 *
 * @param {string} className the name of the class
 * @returns {tQuery.Object3D} true if any of the matched elements has this class, false overwise
*/
tQuery.Object3D.prototype.hasClass	= function(className){
	var completed	= this.each(function(object3d){
		// init ._tqClasses if needed
		object3d._tqClasses	= object3d._tqClasses	|| '';

		var hasClass	= tQuery.Object3D._hasClassOne(object3d, className);
		return hasClass ? false : true;
	}.bind(this));
	return completed ? false : true;
};

tQuery.Object3D._hasClassOne	= function(object3d, className){
	if( object3d._tqClasses === undefined )	return false;
	var classes	= object3d._tqClasses;
	var re		= new RegExp('(^| |\t)+('+className+')($| |\t)+');
	return classes.match(re) ? true : false;
};

tQuery.Object3D._removeClassOne	= function(object3d, className){
	if( object3d._tqClasses === undefined )	return;
	var re		= new RegExp('(^| |\t)('+className+')($| |\t)');
	object3d._tqClasses	= object3d._tqClasses.replace(re, ' ');
};

//////////////////////////////////////////////////////////////////////////////////
//			handling selection					//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Object3D._select	= function(selector, root){
	// handle parameter
	root		= root	|| tQuery.world.tScene();
	if( root instanceof tQuery.Object3D )	root	= root.get(0)
	var selectItems	= selector.split(' ').filter(function(v){ return v.length > 0;})
	
	// sanity check
	console.assert(root instanceof THREE.Object3D);

	var lists	= [];
	root.children.forEach(function(child){
		var nodes	= this._crawls(child, selectItems);
		// FIXME reallocate the array without need
		lists		= lists.concat(nodes);
	}.bind(this));	
	return lists;
}

tQuery.Object3D._crawls	= function(root, selectItems)
{
	var result	= [];
//console.log("crawl", root, selectItems)
	console.assert( selectItems.length >= 1 );
	var match	= this._selectItemMatch(root, selectItems[0]);
//console.log("  match", match)
	var nextSelect	= match ? selectItems.slice(1) : selectItems;
//console.log("  nextSelect", nextSelect)

	if( nextSelect.length === 0 )	return [root];

	root.children.forEach(function(child){
		var nodes	= this._crawls(child, nextSelect);
		// FIXME reallocate the array without need
		result		= result.concat(nodes);
	}.bind(this));

	return result;
}

// all the geometries keywords
tQuery.Object3D._selectableGeometries	= Object.keys(THREE).filter(function(value){
	return value.match(/.+Geometry$/);}).map(function(value){ return value.replace(/Geometry$/,'').toLowerCase();
});

// all the light keywords
tQuery.Object3D._selectableLights	= Object.keys(THREE).filter(function(value){
	return value.match(/.+Light$/);}).map(function(value){ return value.replace(/Light$/,'').toLowerCase();
});

tQuery.Object3D._selectableClasses	= ['mesh', 'light'];

tQuery.Object3D._selectItemMatch	= function(object3d, selectItem)
{
	// sanity check
	console.assert( object3d instanceof THREE.Object3D );
	console.assert( typeof selectItem === 'string' );

	// parse selectItem into subItems
	var subItems	= selectItem.match(new RegExp("([^.#]+|\.[^.#]+|\#[^.#]+)", "g"));;

	// go thru each subItem
	var completed	= tQuery.each(subItems, function(subItem){
		var meta	= subItem.charAt(0);
		var suffix	= subItem.slice(1);
		//console.log("meta", meta, subItem, suffix, object3d)
		if( meta === "." ){
			var hasClass	= tQuery.Object3D._hasClassOne(object3d, suffix);
			return hasClass ? true : false;
		}else if( meta === "#" ){
			return object3d._tqId === suffix ? true : false;
		}else if( subItem === "*" ){
			return true;
		}else if( this._selectableGeometries.indexOf(subItem) !== -1 ){	// Handle geometries
			var geometry	= object3d.geometry;
			var className	= subItem.charAt(0).toUpperCase() + subItem.slice(1) + "Geometry";
			return geometry instanceof THREE[className];
		}else if( this._selectableLights.indexOf(subItem) !== -1 ){	// Handle light
			var className	= subItem.charAt(0).toUpperCase() + subItem.slice(1) + "Light";
			return object3d instanceof THREE[className];
		}else if( this._selectableClasses.indexOf(subItem) !== -1 ){	// Handle light
			var className	= subItem.charAt(0).toUpperCase() + subItem.slice(1);
			return object3d instanceof THREE[className];
		}
		// this point should never be reached
		console.assert(false, "invalid selector: "+subItem);
		return true;
	}.bind(this));

	return completed ? true : false;
}
/**
 * Handle geometry. It inherit from tQuery.Node
 *
 * @class handle THREE.Geometry. It inherit from {@link tQuery.Node}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.Geometry} object an instance or an array of instance
*/
tQuery.Geometry	= function(object)
{
	// call parent
	tQuery.Geometry.parent.constructor.call(this, object)

	// sanity check - all items MUST be THREE.Geometry
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Geometry); });
};

/**
 * inherit from tQuery.Node
*/
tQuery.inherit(tQuery.Geometry, tQuery.Node);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.Geometry);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.Geometry, {
	hasTangents	: tQuery.convert.toBoolean,
	dynamic		: tQuery.convert.toBoolean
});/**
 * Handle material
 *
 * @class include THREE.Material. It inherit from {@link tQuery.Node}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.Material} object an instance or array of instance
*/
tQuery.Material	= function(object)
{
	// call parent
	tQuery.Material.parent.constructor.call(this, object)

	// sanity check - all items MUST be THREE.Material
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Material); });
};

/**
 * inherit from tQuery.Node
*/
tQuery.inherit(tQuery.Material, tQuery.Node);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.Material);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.Material, {
	opacity		: tQuery.convert.toNumber,
	transparent	: tQuery.convert.toBoolean
});
/**
 * Handle light
 *
 * @class include THREE.Light. It inherit from {@link tQuery.Node}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.Light} object an instance or array of instance
*/
tQuery.Light	= function(elements)
{
	// call parent ctor
	tQuery.Light.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Light
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Light); });
};

/**
 * inherit from tQuery.Node
 * - TODO this should inherit from tQuery.Object3D but but in inheritance
*/
tQuery.inherit(tQuery.Light, tQuery.Object3D);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.Light);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.Light, {
	color	: tQuery.convert.toThreeColor
});


/**
 * Handle mesh
 *
 * @class include THREE.Mesh. It inherit from {@link tQuery.Node}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.Mesh} object an instance or array of instance
*/
tQuery.Mesh	= function(elements)
{
	// call parent ctor
	var parent	= tQuery.Mesh.parent;
	parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Mesh
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.Mesh); });
};

/**
 * inherit from tQuery.Object3D
*/
tQuery.inherit(tQuery.Mesh, tQuery.Object3D);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.Mesh);

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * TODO to remove. this function is crap
*/
tQuery.Mesh.prototype.material	= function(value){
	var parent	= tQuery.Mesh.parent;
	// handle the getter case
	if( value == undefined )	return parent.material.call(this);
	// handle parameter polymorphism
	if( value instanceof tQuery.Material )	value	= value.get(0)
	// sanity check
	console.assert( value instanceof THREE.Material )
	// handle the setter case
	this.each(function(tMesh){
		tMesh.material	= value;
	});
	return this;	// for the chained API
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Handle world (aka scene+camera+renderer)
 *
 * @class youpla
 * 
 * @param {THREE.Material} object an instance or an array of instance
*/
tQuery.World	= function(opts)
{
	// handle parameters
	opts	= opts	|| {};
	opts	= tQuery.extend(opts, {
		renderW		: window.innerWidth,
		renderH		: window.innerHeight,
		webGLNeeded	: true, 
		autoRendering	: true,
		scene		: null,
		camera		: null,
		renderer	: null
	});
	this._opts	= opts;

	// update default world.
	// - TODO no sanity check ?
	// - not clear what to do with this...
	// - tQuery.world is the user world. like the camera controls
	console.assert( !tQuery.word );
	tQuery.world	= this;

	this._autoRendering	= true;
	
	// create a scene
	this._scene	= opts.scene	||(new THREE.Scene());

 	// create a camera in the scene
	if( !opts.camera ){
		this._camera	= new THREE.PerspectiveCamera(35, opts.renderW / opts.renderH, 0.01, 10000 );
		this._camera.position.set(0, 0, 3);
		this._scene.add(this._camera);
	}else{
		this._camera	= opts.camera;
	}
	
	// create the loop
	this._loop	= new tQuery.Loop();

	// hook the render function in this._loop
	this._loop.hookOnRender(this._$loopCb = function(){
		this.render();
	}.bind(this));

	// create a renderer
	if( opts.renderer ){
		this._renderer	= opts.renderer;
	}else if( tQuery.World.hasWebGL() ){
		this._renderer	= new THREE.WebGLRenderer({
			antialias		: true,	// to get smoother output
			preserveDrawingBuffer	: true	// to allow screenshot
		});
	}else if( !opts.webGLNeeded ){
		this._renderer	= new THREE.CanvasRenderer();
	}else{
		this._addGetWebGLMessage();
		throw new Error("WebGL required and not available")
	}
	this._renderer.setClearColorHex( 0xBBBBBB, 1 );
	this._renderer.setSize( opts.renderW, opts.renderH );
};

// make it pluginable
tQuery.pluginsInstanceOn(tQuery.World);

// make it eventable
tQuery.MicroeventMixin(tQuery.World.prototype)


tQuery.World.prototype.destroy	= function(){
	// microevent.js notification
	this.trigger('destroy');
	// unhook the render function in this._loop
	this._loop.unhookOnRender(this._$loopCb);
	// destroy the loop
	this._loop.destroy();
	// remove this._cameraControls if needed
	this.removeCameraControls();
	// remove renderer element
	var parent	= this._renderer.domElement.parentElement;
	parent	&& parent.removeChild(this._renderer.domElement);
	
	// clear the global if needed
	if( tQuery.world === this )	tQuery.world = null;
}

//////////////////////////////////////////////////////////////////////////////////
//		WebGL Support							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.World._hasWebGL	= undefined;
/**
 * @returns {Boolean} true if webgl is available, false otherwise
*/
tQuery.World.hasWebGL	= function(){
	if( tQuery.World._hasWebGL !== undefined )	return tQuery.World._hasWebGL;

	// test from Detector.js
	try{
		tQuery.World._hasWebGL	= !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' );
	} catch( e ){
		tQuery.World._hasWebGL	= false;
	}
	return tQuery.World._hasWebGL;
};

/**
*/
tQuery.World.prototype._addGetWebGLMessage	= function(parent)
{
	parent	= parent || document.body;
	
	// message directly taken from Detector.js
	var domElement = document.createElement( 'div' );
	domElement.style.fontFamily	= 'monospace';
	domElement.style.fontSize	= '13px';
	domElement.style.textAlign	= 'center';
	domElement.style.background	= '#eee';
	domElement.style.color		= '#000';
	domElement.style.padding	= '1em';
	domElement.style.width		= '475px';
	domElement.style.margin		= '5em auto 0';
	domElement.innerHTML		= window.WebGLRenderingContext ? [
		'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />',
		'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
	].join( '\n' ) : [
		'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br/>',
		'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
	].join( '\n' );

	parent.appendChild(domElement);
}

//////////////////////////////////////////////////////////////////////////////////
//		add/remove object3D						//
//////////////////////////////////////////////////////////////////////////////////

// TODO why not a getter/setter here
tQuery.World.prototype.setCameraControls	= function(control){
	if( this.hasCameraControls() )	this.removeCameraControls();
	this._cameraControls	= control;
	return this;	// for chained API
};

tQuery.World.prototype.getCameraControls	= function(){
	return this._cameraControls;
};


tQuery.World.prototype.removeCameraControls	= function(){
	if( this.hasCameraControls() === false )	return this;
	this._cameraControls	= undefined;
	return this;	// for chained API
};

tQuery.World.prototype.hasCameraControls	= function(){
	return this._cameraControls !== undefined ? true : false;
};

//////////////////////////////////////////////////////////////////////////////////
//		add/remove object3D						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * add an object to the scene
 * 
 * @param {tQuery.Object3D} object3D to add to the scene (THREE.Object3D is accepted)
*/
tQuery.World.prototype.add	= function(object3d)
{
	if( object3d instanceof tQuery.Object3D ){
		object3d.each(function(object3d){
			this._scene.add(object3d)			
		}.bind(this));
	}else if( object3d instanceof THREE.Object3D ){
		this._scene.add(object3d)		
	}else	console.assert(false, "invalid type");
	// for chained API
	return this;
}

/**
 * remove an object to the scene
 * 
 * @param {tQuery.Object3D} object3D to add to the scene (THREE.Object3D is accepted)
*/
tQuery.World.prototype.remove	= function(object3d)
{
	if( object3d instanceof tQuery.Object3D ){
		object3d.each(function(object3d){
			this._scene.remove(object3d)
		}.bind(this));
	}else if( object3d instanceof THREE.Object3D ){
		this._scene.remove(object3d)
	}else	console.assert(false, "invalid type");
	// for chained API
	return this;
}

tQuery.World.prototype.appendTo	= function(domElement)
{
	domElement.appendChild(this._renderer.domElement)
	// for chained API
	return this;
}

/**
 * Start the loop
*/
tQuery.World.prototype.start	= function(){
	this._loop.start();
	return this;	// for chained API
}
/**
 * Stop the loop
*/
tQuery.World.prototype.stop	= function(){
	this._loop.stop();
	return this;	// for chained API
}

tQuery.World.prototype.loop	= function(){ return this._loop;	}

tQuery.World.prototype.tRenderer= function(){ return this._renderer;	}
tQuery.World.prototype.tScene	= function(){ return this._scene;	}
tQuery.World.prototype.tCamera	= function(){ return this._camera;	}


// backward compatible functions to remove
tQuery.World.prototype.renderer	= function(){  console.trace();console.warn("world.renderer() is ovbslete, use .tRenderer() instead");
						return this._renderer;	}
tQuery.World.prototype.camera	= function(){ console.trace();console.warn("world.camera() is obsolete, use .tCamerar() instead");
						return this._camera;	}
tQuery.World.prototype.scene	= function(){ console.trace();console.warn("world.scene() is obsolete, use .tScene() instead");
						return this._scene;	}
tQuery.World.prototype.get	= function(){ return this._scene;	}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

tQuery.World.prototype.autoRendering	= function(value){
	if(value === undefined)	return this._autoRendering;
	this._autoRendering	= value;
	return this;
}


tQuery.World.prototype.render	= function()
{
	// update the cameraControl
	if( this.hasCameraControls() )	this._cameraControls.update();
	// render the scene 
	if( this._autoRendering )	this._renderer.render( this._scene, this._camera );
}
//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Handle the rendering loop
 *
 * @class This class handle the rendering loop
 *
 * @param {THREE.World} world the world to display (optional)
*/
tQuery.Loop	= function()
{	
	// internally if world present do that
	this._hooks	= [];
	this._lastTime	= null;
};

// make it pluginable
tQuery.pluginsInstanceOn(tQuery.Loop);

/**
 * destructor
*/
tQuery.Loop.prototype.destroy	= function()
{
	this.stop();
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * start looping
 * 
 * @returns {tQuery.Loop} chained API
*/
tQuery.Loop.prototype.start	= function()
{
	if( this._timerId )	this.stop();
	this._timerId	= requestAnimationFrame( this._onAnimationFrame.bind(this) );
	// for chained API
	return this;
}

/**
 * stop looping
 * 
 * @returns {tQuery.Loop} chained API
*/
tQuery.Loop.prototype.stop	= function()
{
	cancelAnimationFrame(this._timerId);
	this._timerId	= null;
	// for chained API
	return this;
}

tQuery.Loop.prototype._onAnimationFrame	= function(time)
{
	// loop on request animation loop
	// - it has to be at the begining of the function
	// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	this._timerId	= requestAnimationFrame( this._onAnimationFrame.bind(this) );

	// update time values
	var now		= time/1000;
	if( !this._lastTime )	this._lastTime = now - 1/60;
	var delta	= now - this._lastTime;
	this._lastTime	= now;

	// run all the hooks - from lower priority to higher - in order of registration
	for(var priority = 0; priority <= this._hooks.length; priority++){
		if( this._hooks[priority] === undefined )	continue;
		var callbacks	= this._hooks[priority].slice(0)
		for(var i = 0; i < callbacks.length; i++){
			callbacks[i](delta, now);
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////
//		Handle the hooks						//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Loop.prototype.PRE_RENDER		= 20;
tQuery.Loop.prototype.ON_RENDER		= 50;
tQuery.Loop.prototype.POST_RENDER	= 80;

/**
 * hook a callback at a given priority
 *
 * @param {Number} priority for this callback
 * @param {Function} callback the function which will be called function(time){}
 * @returns {Function} the callback function. usefull for this._$callback = loop.hook(this._callback.bind(this))
 *                     and later loop.unhook(this._$callback)
*/
tQuery.Loop.prototype.hook	= function(priority, callback)
{
	// handle parameters
	if( typeof priority === 'function' ){
		callback	= priority;
		priority	= this.PRE_RENDER;
	}

	this._hooks[priority]	= this._hooks[priority] || [];
	console.assert(this._hooks[priority].indexOf(callback) === -1)
	this._hooks[priority].push(callback);
	return callback;
}

/**
 * unhook a callback at a given priority
 *
 * @param {Number} priority for this callback
 * @param {Function} callback the function which will be called function(time){}
 * @returns {tQuery.Loop} chained API
*/
tQuery.Loop.prototype.unhook	= function(priority, callback)
{
	// handle parameters
	if( typeof priority === 'function' ){
		callback	= priority;
		priority	= this.PRE_RENDER;
	}

	var index	= this._hooks[priority].indexOf(callback);
	console.assert(index !== -1);
	this._hooks[priority].splice(index, 1);
	this._hooks[priority].length === 0 && delete this._hooks[priority]
	// for chained API
	return this;
}


// bunch of shortcut
// - TODO should it be in a plugin ?

tQuery.Loop.prototype.hookPreRender	= function(callback){ return this.hook(this.PRE_RENDER, callback);	};
tQuery.Loop.prototype.hookOnRender	= function(callback){ return this.hook(this.ON_RENDER, callback);	};
tQuery.Loop.prototype.hookPostRender	= function(callback){ return this.hook(this.POST_RENDER, callback);	};
tQuery.Loop.prototype.unhookPreRender	= function(callback){ return this.unhook(this.PRE_RENDER, callback);	};
tQuery.Loop.prototype.unhookOnRender	= function(callback){ return this.unhook(this.ON_RENDER, callback);	};
tQuery.Loop.prototype.unhookPostRender	= function(callback){ return this.unhook(this.POST_RENDER, callback);	};
/**
 * @fileOverview plugins for tQuery.core to help creation of object
*/


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Create tQuery.World
*/
tQuery.register('createWorld', function(opts){
	return new tQuery.World(opts);
});

/**
 * Create tQuery.World
*/
tQuery.register('createObject3D', function(){
	var object3d	= new THREE.Object3D();
	return tQuery(object3d);
});


/**
 * Create tQuery.loop
 * 
 * @param {tQuery.World} world the world to display (optional)
 * @function
*/
tQuery.register('createLoop', function(world){
	return new tQuery.Loop(world);
});


tQuery.register('createDirectionalLight', function(){
	var tLight	= new THREE.DirectionalLight();
	return new tQuery.DirectionalLight([tLight]);
});

tQuery.register('createSpotLight', function(){
	var tLight	= new THREE.SpotLight();
	return new tQuery.SpotLight([tLight]);
});

tQuery.register('createPointLight', function(){
	var tLight	= new THREE.PointLight();
	return new tQuery.PointLight([tLight]);
});

tQuery.register('createAmbientLight', function(){
	var tLight	= new THREE.AmbientLight();
	return new tQuery.AmbientLight([tLight]);
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * contains the default material to use when create tQuery.Object3D
 * 
 * @fieldOf tQuery
 * @name defaultObject3DMaterial
*/
tQuery.register('defaultObject3DMaterial', new THREE.MeshNormalMaterial());

tQuery.Geometry.prototype.toMesh	= function(material){
	var meshes	= [];
	this.each(function(tGeometry){
		// handle paramters
		material	= material || tQuery.defaultObject3DMaterial;
		// create the THREE.Mesh
		var mesh	= new THREE.Mesh(tGeometry, material)
		// return it
		meshes.push(mesh);
	});
	return new tQuery.Mesh(meshes);
};


/**
 * Create a cube
 * 
 * @returns {tQuery.Object3D} a tQuery.Object3D containing it
*/
tQuery.register('createCube', function(){
	var ctor	= THREE.CubeGeometry;
	var dflGeometry	= [1, 1, 1];
	return this._createMesh(ctor, dflGeometry, arguments)
});

tQuery.register('createTorus', function(){
	var ctor	= THREE.TorusGeometry;
	var dflGeometry	= [0.5-0.15, 0.15];
	return this._createMesh(ctor, dflGeometry, arguments)
});

tQuery.register('createVector3', function(){
	return new THREE.Vector3();
});

tQuery.register('createSphere', function(){
	var ctor	= THREE.SphereGeometry;
	var dflGeometry	= [0.5, 32, 16];
	return this._createMesh(ctor, dflGeometry, arguments)
});

tQuery.register('createPlane', function(){
	var ctor	= THREE.PlaneGeometry;
	var dflGeometry	= [1, 1, 16, 16];
	return this._createMesh(ctor, dflGeometry, arguments)
});

tQuery.register('createCylinder', function(){
	var ctor	= THREE.CylinderGeometry;
	var dflGeometry	= [0.5, 0.5, 1, 16, 4];
	return this._createMesh(ctor, dflGeometry, arguments)
});

tQuery.register('_createMesh', function(ctor, dflGeometry, args)
{
	// convert args to array if it is instanceof Arguments
	// FIXME if( args instanceof Arguments )
	args	= Array.prototype.slice.call( args );
	
	// init the material
	var material	= tQuery.defaultObject3DMaterial;
	// if the last arguments is a material, use it
	if( args.length && args[args.length-1] instanceof THREE.Material ){
		material	= args.pop();
	}
	
	// ugly trick to get .apply() to work 
	var createFn	= function(ctor, a0, a1, a2, a3, a4, a5, a6, a7){
		console.assert(arguments.length <= 9);
		//console.log("createFn", arguments)
		return new ctor(a0,a1,a2,a3,a4,a5,a6,a7);
	}
	if( args.length === 0 )	args	= dflGeometry.slice();
	args.unshift(ctor);
	var geometry	= createFn.apply(this, args);

	// set the geometry.dynamic by default
	geometry.dynamic= true;
	// create the THREE.Mesh
	var mesh	= new THREE.Mesh(geometry, material)
	// return it
	return tQuery(mesh);
});

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

tQuery.register('createAxis', function(){
	var axis	= new THREE.AxisHelper();
	axis.scale.multiplyScalar(1/100);
	return tQuery(axis);
});
/**
 * Handle ambient light
 *
 * @class include THREE.AmbientLight. It inherit from {@link tQuery.Light}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.AmbientLight} element an instance or array of instance
*/
tQuery.AmbientLight	= function(elements)
{
	// call parent ctor
	tQuery.AmbientLight.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Light
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.AmbientLight); });
};

/**
 * inherit from tQuery.Node
*/
tQuery.inherit(tQuery.AmbientLight, tQuery.Light);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.AmbientLight);
/**
 * Handle directional light
 *
 * @class include THREE.DirectionalLight. It inherit from {@link tQuery.Light}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.DirectionalLight} element an instance or array of instance
*/
tQuery.DirectionalLight	= function(elements)
{
	// call parent ctor
	tQuery.DirectionalLight.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Light
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.DirectionalLight); });
};

/**
 * inherit from tQuery.Light
*/
tQuery.inherit(tQuery.DirectionalLight, tQuery.Light);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.DirectionalLight);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.DirectionalLight, {
	intensity	: tQuery.convert.toNumber,
	distance	: tQuery.convert.toNumber,

	shadowDarkness		: tQuery.convert.toNumberZeroToOne,
	shadowBias		: tQuery.convert.toNumber,

	shadowMapWidth		: tQuery.convert.toInteger,
	shadowMapHeight		: tQuery.convert.toInteger,

	shadowCameraRight	: tQuery.convert.toNumber,
	shadowCameraLeft	: tQuery.convert.toNumber,
	shadowCameraTop		: tQuery.convert.toNumber,
	shadowCameraBottom	: tQuery.convert.toNumber,
	shadowCameraVisible	: tQuery.convert.toBoolean,
	
	shadowCameraNear	: tQuery.convert.toNumber,
	shadowCameraFar		: tQuery.convert.toNumber
});



/**
 * Handle directional light
 *
 * @class include THREE.PointLight. It inherit from {@link tQuery.Light}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.PointLight} element an instance or array of instance
*/
tQuery.PointLight	= function(elements)
{
	// call parent ctor
	tQuery.PointLight.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Light
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.PointLight); });
};

/**
 * inherit from tQuery.Light
*/
tQuery.inherit(tQuery.PointLight, tQuery.Light);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.PointLight);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.PointLight, {
	intensity	: tQuery.convert.toNumber,
	distance	: tQuery.convert.toNumber
});


/**
 * Handle directional light
 *
 * @class include THREE.SpotLight. It inherit from {@link tQuery.Light}
 * 
 * @borrows tQuery.Node#get as this.get
 * @borrows tQuery.Node#each as this.each
 * @borrows tQuery.Node#back as this.back
 *
 * @param {THREE.SpotLight} element an instance or array of instance
*/
tQuery.SpotLight	= function(elements)
{
	// call parent ctor
	tQuery.SpotLight.parent.constructor.call(this, elements)

	// sanity check - all items MUST be THREE.Light
	this._lists.forEach(function(item){ console.assert(item instanceof THREE.SpotLight); });
};

/**
 * inherit from tQuery.Light
*/
tQuery.inherit(tQuery.SpotLight, tQuery.Light);

/**
 * Make it pluginable
*/
tQuery.pluginsInstanceOn(tQuery.SpotLight);

/**
 * define all acceptable attributes for this class
*/
tQuery.mixinAttributes(tQuery.SpotLight, {
	intensity	: tQuery.convert.toNumber,
	distance	: tQuery.convert.toNumber,

	shadowDarkness		: tQuery.convert.toNumberZeroToOne,
	shadowBias		: tQuery.convert.toNumber,
	shadowMapWidth		: tQuery.convert.toInteger,
	shadowMapHeight		: tQuery.convert.toInteger,
	shadowCameraRight	: tQuery.convert.toNumber,
	shadowCameraLeft	: tQuery.convert.toNumber,
	shadowCameraTop		: tQuery.convert.toNumber,
	shadowCameraBottom	: tQuery.convert.toNumber,
	shadowCameraVisible	: tQuery.convert.toBoolean
});


/**
 * @fileOverview Plugins for tQuery.Geometry: tool box to play with geometry
*/

(function(){	// TODO why is there a closure here ?

//////////////////////////////////////////////////////////////////////////////////
//		Size functions							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Geometry.register('computeAll', function(){
	this.each(function(tGeometry){
		tGeometry.computeBoundingBox();
		tGeometry.computeCentroids();
		tGeometry.computeFaceNormals();
		tGeometry.computeVertexNormals();
		//tGeometry.computeTangents();
	});

	// return this, to get chained API	
	return this;
});

/**
 * zoom a geometry
 *
 * @name zoom
 * @methodOf tQuery.Geometry
*/
tQuery.Geometry.register('scaleBy', function(vector3){
	// handle parameters
	if( typeof vector3 === "number" && arguments.length === 1 ){
		vector3	= new THREE.Vector3(vector3, vector3, vector3);
	}else if( typeof vector3 === "number" && arguments.length === 3 ){
		vector3	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(vector3 instanceof THREE.Vector3, "Geometry.vector3 parameter error");

	// change all geometry.vertices
	this.each(function(geometry){
		for(var i = 0; i < geometry.vertices.length; i++) {
			var vertex	= geometry.vertices[i];
			vertex.multiplySelf(vector3); 
		}
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	})

	// return this, to get chained API	
	return this;
});

tQuery.Geometry.register('size', function(){
	// only on zero-or-one element
	console.assert(this.length <= 1)
	// if no element, return undefined
	if( this.length === 0 )	return undefined

	// else measure the size of the element
	var geometry	= this.get(0);
	// compute middle
	var size= new THREE.Vector3()
	size.x	= geometry.boundingBox.max.x - geometry.boundingBox.min.x;
	size.y	= geometry.boundingBox.max.y - geometry.boundingBox.min.y;
	size.z	= geometry.boundingBox.max.z - geometry.boundingBox.min.z;

	// return the just computed middle
	return size;	
});

/**
*/
tQuery.Geometry.register('normalize', function(){
	// change all geometry.vertices
	this.each(function(geometry){
		var node	= tQuery(geometry);
		var size	= node.size();
		if( size.x >= size.y && size.x >= size.z ){
			node.zoom(1/size.x);
		}else if( size.y >= size.x && size.y >= size.z ){
			node.zoom(1/size.y);
		}else{
			node.zoom(1/size.z);
		}
	});
	// return this, to get chained API	
	return this;
});


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////


tQuery.Geometry.register('middlePoint', function(){
	// only on zero-or-one element
	console.assert(this.length <= 1)
	// if no element, return undegined
	if( this.length === 0 )	return undefined
	// else measure the size of the element
	var geometry	= this.get(0);
	// compute middle
	var middle	= new THREE.Vector3()
	middle.x	= ( geometry.boundingBox.max.x + geometry.boundingBox.min.x ) / 2;
	middle.y	= ( geometry.boundingBox.max.y + geometry.boundingBox.min.y ) / 2;
	middle.z	= ( geometry.boundingBox.max.z + geometry.boundingBox.min.z ) / 2;

	// return the just computed middle
	return middle;
});

//////////////////////////////////////////////////////////////////////////////////
//		move functions							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Geometry.register('translate', function(delta){
	// handle parameters
	if( typeof delta === "number" && arguments.length === 3 ){
		delta	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(delta instanceof THREE.Vector3, "Geometry.translate parameter error");

	// change all geometry.vertices
	this.each(function(geometry){
		// change all geometry.vertices
		for(var i = 0; i < geometry.vertices.length; i++) {
			var vertex	= geometry.vertices[i];
			vertex.addSelf(delta); 
		}
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	})

	// return this, to get chained API	
	return this;
});

tQuery.Geometry.register('rotate', function(angles, order){
	// handle parameters
	if( typeof angles === "number" && arguments.length === 3 ){
		angles	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(angles instanceof THREE.Vector3, "Geometry.rotate parameter error");

	// set default rotation order if needed
	order	= order	|| 'XYZ';
	// compute transformation matrix
	var matrix	= new THREE.Matrix4();
	matrix.setRotationFromEuler(angles, order);

	// change all geometry.vertices
	this.each(function(geometry){
		// apply the matrix
		geometry.applyMatrix( matrix );
	
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	});

	// return this, to get chained API	
	return this;
});

/**
*/
tQuery.Geometry.register('center', function(noX, noY, noZ){
	// change all geometry.vertices
	this.each(function(tGeometry){
		var geometry	= tQuery(tGeometry);
		// compute delta
		var delta 	= geometry.middlePoint().negate();
		if( noX )	delta.x	= 0;
		if( noY )	delta.y	= 0;
		if( noZ )	delta.z	= 0;

		return geometry.translate(delta)
	});
	// return this, to get chained API	
	return this;
});

/**
 * Smooth the geometry using catmull-clark
 *
 * @param {Number} subdivision the number of subdivision to do
*/
tQuery.Geometry.register('smooth', function(subdivision){
	// init the modifier
	var modifier	= new THREE.SubdivisionModifier( subdivision );
	// apply it to each geometry
	this.each(function(geometry){
		// apply it
		modifier.modify( geometry )
	
		// mark the vertices as dirty
		geometry.verticesNeedUpdate = true;
		geometry.computeBoundingBox();
	});
	// return this, to get chained API	
	return this;
});

// some shortcuts
tQuery.Geometry.register('translateX'	, function(delta){ return this.translate(delta, 0, 0);	});
tQuery.Geometry.register('translateY'	, function(delta){ return this.translate(0, delta, 0);	});
tQuery.Geometry.register('translateZ'	, function(delta){ return this.translate(0, 0, delta);	});
tQuery.Geometry.register('rotateX'	, function(angle){ return this.rotate(angle, 0, 0);	});
tQuery.Geometry.register('rotateY'	, function(angle){ return this.rotate(0, angle, 0);	});
tQuery.Geometry.register('rotateZ'	, function(angle){ return this.rotate(0, 0, angle);	});
tQuery.Geometry.register('scaleXBy'	, function(ratio){ return this.scaleBy(ratio, 1, 1);	});
tQuery.Geometry.register('scaleYBy'	, function(ratio){ return this.scaleBy(1, ratio, 1);	});
tQuery.Geometry.register('scaleZBy'	, function(ratio){ return this.scaleBy(1, 1, ratio);	});

// backward compatibility
tQuery.Geometry.register('zoom'		, function(value){return this.scaleBy(value);		});
tQuery.Geometry.register('zoomX'	, function(ratio){ return this.zoom(ratio, 1, 1);	});
tQuery.Geometry.register('zoomY'	, function(ratio){ return this.zoom(1, ratio, 1);	});
tQuery.Geometry.register('zoomZ'	, function(ratio){ return this.zoom(1, 1, ratio);	});


})();	// closure function end
/**
 * @fileOverview Plugins for tQuery.Object3D to play with .position/.rotation/.scale
*/

(function(){	// TODO why is there a closure here ?

//////////////////////////////////////////////////////////////////////////////////
//		set function							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Object3D.register('scale', function(scale){
	// handle parameters
	if( typeof scale === "number" && arguments.length === 1 ){
		scale	= new THREE.Vector3(scale, scale, scale);
	}else if( typeof scale === "number" && arguments.length === 3 ){
		scale	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(scale instanceof THREE.Vector3, "Geometry.scale parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.scale.copy(scale);
	});

	// return this, to get chained API	
	return this;
});

tQuery.Object3D.register('position', function(vector3){
	// handle parameters
	if( typeof vector3 === "number" && arguments.length === 3 ){
		vector3	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(vector3 instanceof THREE.Vector3, "Object3D.position parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.position.copy(vector3);
	})

	// return this, to get chained API	
	return this;
});

tQuery.Object3D.register('rotation', function(vector3){
	// handle parameters
	if( typeof vector3 === "number" && arguments.length === 3 ){
		vector3	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(vector3 instanceof THREE.Vector3, "Object3D.rotation parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.rotation.copy(vector3);
	})

	// return this, to get chained API	
	return this;
});

//////////////////////////////////////////////////////////////////////////////////
//		add function							//
//////////////////////////////////////////////////////////////////////////////////

tQuery.Object3D.register('translate', function(delta){
	// handle parameters
	if( typeof delta === "number" && arguments.length === 3 ){
		delta	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(delta instanceof THREE.Vector3, "Object3D.translate parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.position.addSelf(delta);
	})

	// return this, to get chained API	
	return this;
});


tQuery.Object3D.register('rotate', function(angles){
	// handle parameters
	if( typeof angles === "number" && arguments.length === 3 ){
		angles	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(angles instanceof THREE.Vector3, "Object3D.rotate parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.rotation.addSelf(angles);
	})

	// return this, to get chained API	
	return this;
});

tQuery.Object3D.register('scaleBy', function(ratio){
	// handle parameters
	if( typeof ratio === "number" && arguments.length === 1 ){
		ratio	= new THREE.Vector3(ratio, ratio, ratio);
	}else if( typeof ratio === "number" && arguments.length === 3 ){
		ratio	= new THREE.Vector3(arguments[0], arguments[1], arguments[2]);
	}
	console.assert(ratio instanceof THREE.Vector3, "Object3D.rotate parameter error");

	// do the operation on each node
	this.each(function(object3d){
		object3d.scale.multiplySelf(ratio);
	})

	// return this, to get chained API	
	return this;
});


// some shortcuts
tQuery.Object3D.register('translateX'	, function(delta){ return this.translate(delta, 0, 0);	});
tQuery.Object3D.register('translateY'	, function(delta){ return this.translate(0, delta, 0);	});
tQuery.Object3D.register('translateZ'	, function(delta){ return this.translate(0, 0, delta);	});
tQuery.Object3D.register('rotateX'	, function(angle){ return this.rotate(angle, 0, 0);	});
tQuery.Object3D.register('rotateY'	, function(angle){ return this.rotate(0, angle, 0);	});
tQuery.Object3D.register('rotateZ'	, function(angle){ return this.rotate(0, 0, angle);	});
tQuery.Object3D.register('scaleXBy'	, function(ratio){ return this.scaleBy(ratio, 1, 1);	});
tQuery.Object3D.register('scaleYBy'	, function(ratio){ return this.scaleBy(1, ratio, 1);	});
tQuery.Object3D.register('scaleZBy'	, function(ratio){ return this.scaleBy(1, 1, ratio);	});

// backward compatibility
tQuery.Object3D.register('zoom'		, function(value){ return this.scaleBy(value);		});
tQuery.Object3D.register('zoomX'	, function(ratio){ return this.zoom(ratio, 1, 1);	});
tQuery.Object3D.register('zoomY'	, function(ratio){ return this.zoom(1, ratio, 1);	});
tQuery.Object3D.register('zoomZ'	, function(ratio){ return this.zoom(1, 1, ratio);	});

})();	// closure function end
// backward compatibility only
tQuery.World.register('fullpage', function(){
	console.log("world.fullpage() is obsolete. use world.boilerplate() instead.");
	return this.boilerplate();
});

tQuery.World.register('boilerplate', function(opts){
	// put renderer fullpage
	var domElement	= document.body;
	domElement.style.margin		= "0";
	domElement.style.padding	= "0";
	domElement.style.overflow	= 'hidden';
	this.appendTo(domElement);
	this._renderer.setSize( domElement.offsetWidth, domElement.offsetHeight );
	
	// add the boilerplate
	this.addBoilerplate(opts);
	
	// for chained API
	return this;
});

/**
 * Define a page title
*/
tQuery.World.register('pageTitle', function(element){
	// handle parameters polymorphism
	if( typeof(element) === 'string' ){
		var element	= document.querySelector(element);
	}
	// sanity check
	console.assert( element instanceof HTMLElement);
	// set element.style
	element.style.position	= "absolute";
	element.style.width	= "100%";
	element.style.textAlign	= "center";
	element.style.fontWeight= "bolder";
	element.style.fontColor	= "white";
	element.style.paddingTop= "0.5em";
	element.style.fontFamily= "arial";
	// for chained API
	return this;
});

tQuery.World.register('addBoilerplate', function(opts){
	var _this	= this;
	// sanity check - no boilerplate is already installed
	console.assert( this.hasBoilerplate() !== true );
	// handle parameters	
	opts	= tQuery.extend(opts, {
		stats		: true,
		cameraControls	: true,
		windowResize	: true,
		screenshot	: true,
		fullscreen	: true
	});
	// get the context
	var ctx	= {};
	
	// make tRenderer.domElement style "display: block" - by default it is inline-block
	// - so it is affected by line-height and create a white line at the bottom
	this.tRenderer().domElement.style.display = "block"

	// create the context
	tQuery.data(this, '_boilerplateCtx', ctx);

	// get some variables
	var tCamera	= this.tCamera();
	var tRenderer	= this.tRenderer();

	// add Stats.js - https://github.com/mrdoob/stats.js
	if( opts.stats ){
		ctx.stats	= new Stats();
		ctx.stats.domElement.style.position	= 'absolute';
		ctx.stats.domElement.style.bottom	= '0px';
		tRenderer.domElement.parentNode && tRenderer.domElement.parentNode.appendChild( ctx.stats.domElement );
		ctx.loopStats	= function(){
			ctx.stats.update();
		};
		this.loop().hook(ctx.loopStats);		
	}

	// create a camera contol
	if( opts.cameraControls ){
		ctx.cameraControls	= new THREEx.DragPanControls(tCamera);
		this.setCameraControls(ctx.cameraControls);		
	}

	// transparently support window resize
	if( opts.windowResize ){
		ctx.windowResize	= THREEx.WindowResize.bind(tRenderer, tCamera);		
	}
	// allow 'p' to make screenshot
	if( opts.screenshot ){		
		ctx.screenshot		= THREEx.Screenshot.bindKey(tRenderer);
	}
	// allow 'f' to go fullscreen where this feature is supported
	if( opts.fullscreen && THREEx.FullScreen.available() ){
		ctx.fullscreen	= THREEx.FullScreen.bindKey();		
	}

	// bind 'destroy' event on tQuery.world
	ctx._$onDestroy	= this.bind('destroy', function(){
		if( this.hasBoilerplate() === false )	return;
		this.removeBoilerplate();	
	});
	
	// for chained API
	return this;
});

tQuery.World.register('hasBoilerplate', function(){
	// get the context
	var ctx	= tQuery.data(this, "_boilerplateCtx")
	// return true if ctx if defined, false otherwise
	return ctx === undefined ? false : true;
});

tQuery.World.register('removeBoilerplate', function(){
	// get context
	var ctx	= tQuery.data(this, '_boilerplateCtx');
	// if not present, return now
	if( ctx === undefined )	return	this;
	// remove the context from this
	tQuery.removeData(this, '_boilerplateCtx');

	// unbind 'destroy' for tQuery.World
	this.unbind('destroy', this._$onDestroy);

	// remove stats.js
	ctx.stats		&& document.body.removeChild(ctx.stats.domElement );
	ctx.stats		&& this.loop().unhook(ctx.loopStats);
	// remove camera
	ctx.cameraControls	&& this.removeCameraControls()
	// stop windowResize
	ctx.windowResize	&& ctx.windowResize.stop();
	// unbind screenshot
	ctx.screenshot		&& ctx.screenshot.unbind();
	// unbind fullscreen
	ctx.fullscreen		&& ctx.fullscreen.unbind();
});// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: Start updating renderer and camera
//
// ```windowResize.stop()```
// # Code

//

/** @namespace */
var THREEx	= THREEx 		|| {};

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
THREEx.WindowResize	= function(renderer, camera){
	var callback	= function(){
		// notify the renderer of the size change
		renderer.setSize( window.innerWidth, window.innerHeight );
		// update the camera
		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}

THREEx.WindowResize.bind	= function(renderer, camera){
	return THREEx.WindowResize(renderer, camera);
}
/** @namespace */
var THREEx	= THREEx 		|| {};

// TODO http://29a.ch/2011/9/11/uploading-from-html5-canvas-to-imgur-data-uri
// able to upload your screenshot without running servers

// forced closure
(function(){

	/**
	 * Take a screenshot of a renderer
	 * - require WebGLRenderer to have "preserveDrawingBuffer: true" to be set
	 * - TODO is it possible to check if this variable is set ? if so check it
	 *   and make advice in the console.log
	 *   - maybe with direct access to the gl context...
	 * 
	 * @param {Object} renderer to use
	 * @param {String} mimetype of the output image. default to "image/png"
	 * @param {String} dataUrl of the image
	*/
	var toDataURL	= function(renderer, mimetype)
	{
		mimetype	= mimetype	|| "image/png";
		var dataUrl	= renderer.domElement.toDataURL(mimetype);
		return dataUrl;
	}

	/**
	 * resize an image to another resolution while preserving aspect
	 *
	 * @param {String} srcUrl the url of the image to resize
	 * @param {Number} dstWidth the destination width of the image
	 * @param {Number} dstHeight the destination height of the image
	 * @param {Number} callback the callback to notify once completed with callback(newImageUrl)
	*/
	var _aspectResize	= function(srcUrl, dstW, dstH, callback){
		// to compute the width/height while keeping aspect
		var cpuScaleAspect	= function(maxW, maxH, curW, curH){
			var ratio	= curH / curW;
			if( curW >= maxW && ratio <= 1 ){ 
				curW	= maxW;
				curH	= maxW * ratio;
			}else if(curH >= maxH){
				curH	= maxH;
				curW	= maxH / ratio;
			}
			return { width: curW, height: curH };
		}
		// callback once the image is loaded
		var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
		var onLoad	= __bind(function(){
			// init the canvas
			var canvas	= document.createElement('canvas');
			canvas.width	= dstW;	canvas.height	= dstH;
			var ctx		= canvas.getContext('2d');

			// TODO is this needed
			ctx.fillStyle	= "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// scale the image while preserving the aspect
			var scaled	= cpuScaleAspect(canvas.width, canvas.height, image.width, image.height);

			// actually draw the image on canvas
			var offsetX	= (canvas.width  - scaled.width )/2;
			var offsetY	= (canvas.height - scaled.height)/2;
			ctx.drawImage(image, offsetX, offsetY, scaled.width, scaled.height);

			// dump the canvas to an URL		
			var mimetype	= "image/png";
			var newDataUrl	= canvas.toDataURL(mimetype);
			// notify the url to the caller
			callback && callback(newDataUrl)
		}, this);

		// Create new Image object
		var image 	= new Image();
		image.onload	= onLoad;
		image.src	= srcUrl;
	}
	

	// Super cooked function: THREEx.Screenshot.bindKey(renderer)
	// and you are done to get screenshot on your demo

	/**
	 * Bind a key to renderer screenshot
	*/
	var bindKey	= function(renderer, opts){
		// handle parameters
		opts		= opts		|| {};
		var charCode	= opts.charCode	|| 'p'.charCodeAt(0);
		var width	= opts.width;
		var height	= opts.height;
		var callback	= opts.callback	|| function(url){
			window.open(url, "name-"+Math.random());
		};

		// callback to handle keypress
		var __bind	= function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
		var onKeyPress	= __bind(function(event){
			// return now if the KeyPress isnt for the proper charCode
			if( event.which !== charCode )	return;
			// get the renderer output
			var dataUrl	= this.toDataURL(renderer);

			if( width === undefined && height === undefined ){
				callback( dataUrl )
			}else{
				// resize it and notify the callback
				// * resize == async so if callback is a window open, it triggers the pop blocker
				_aspectResize(dataUrl, width, height, callback);				
			}
		}, this);

		// listen to keypress
		// NOTE: for firefox it seems mandatory to listen to document directly
		document.addEventListener('keypress', onKeyPress, false);

		return {
			unbind	: function(){
				document.removeEventListener('keypress', onKeyPress, false);
			}
		};
	}

	// export it	
	THREEx.Screenshot	= {
		toDataURL	: toDataURL,
		bindKey		: bindKey
	};
})();
// This THREEx helper makes it easy to handle the fullscreen API
// * it hides the prefix for each browser
// * it hides the little discrepencies of the various vendor API
// * at the time of this writing (nov 2011) it is available in 
//   [firefox nightly](http://blog.pearce.org.nz/2011/11/firefoxs-html-full-screen-api-enabled.html),
//   [webkit nightly](http://peter.sh/2011/01/javascript-full-screen-api-navigation-timing-and-repeating-css-gradients/) and
//   [chrome stable](http://updates.html5rocks.com/2011/10/Let-Your-Content-Do-the-Talking-Fullscreen-API).

// 
// # Code

//

/** @namespace */
var THREEx		= THREEx 		|| {};
THREEx.FullScreen	= THREEx.FullScreen	|| {};

/**
 * test if it is possible to have fullscreen
 * 
 * @returns {Boolean} true if fullscreen API is available, false otherwise
*/
THREEx.FullScreen.available	= function()
{
	return this._hasWebkitFullScreen || this._hasMozFullScreen;
}

/**
 * test if fullscreen is currently activated
 * 
 * @returns {Boolean} true if fullscreen is currently activated, false otherwise
*/
THREEx.FullScreen.activated	= function()
{
	if( this._hasWebkitFullScreen ){
		return document.webkitIsFullScreen;
	}else if( this._hasMozFullScreen ){
		return document.mozFullScreen;
	}else{
		console.assert(false);
	}
}

/**
 * Request fullscreen on a given element
 * @param {DomElement} element to make fullscreen. optional. default to document.body
*/
THREEx.FullScreen.request	= function(element)
{
	element	= element	|| document.body;
	if( this._hasWebkitFullScreen ){
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}else if( this._hasMozFullScreen ){
		element.mozRequestFullScreen();
	}else{
		console.assert(false);
	}
}

/**
 * Cancel fullscreen
*/
THREEx.FullScreen.cancel	= function()
{
	if( this._hasWebkitFullScreen ){
		document.webkitCancelFullScreen();
	}else if( this._hasMozFullScreen ){
		document.mozCancelFullScreen();
	}else{
		console.assert(false);
	}
}


// internal functions to know which fullscreen API implementation is available
THREEx.FullScreen._hasWebkitFullScreen	= 'webkitCancelFullScreen' in document	? true : false;	
THREEx.FullScreen._hasMozFullScreen	= 'mozCancelFullScreen' in document	? true : false;	

/**
 * Bind a key to renderer screenshot
*/
THREEx.FullScreen.bindKey	= function(opts){
	opts		= opts		|| {};
	var charCode	= opts.charCode	|| 'f'.charCodeAt(0);
	var dblclick	= opts.dblclick !== undefined ? opts.dblclick : false;
	var element	= opts.element

	var toggle	= function(){
		if( THREEx.FullScreen.activated() ){
			THREEx.FullScreen.cancel();
		}else{
			THREEx.FullScreen.request(element);
		}		
	}

	// callback to handle keypress
	var __bind	= function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	var onKeyPress	= __bind(function(event){
		// return now if the KeyPress isnt for the proper charCode
		if( event.which !== charCode )	return;
		// toggle fullscreen
		toggle();
	}, this);

	// listen to keypress
	// NOTE: for firefox it seems mandatory to listen to document directly
	document.addEventListener('keypress', onKeyPress, false);
	// listen to dblclick
	dblclick && document.addEventListener('dblclick', toggle, false);

	return {
		unbind	: function(){
			document.removeEventListener('keypress', onKeyPress, false);
			dblclick && document.removeEventListener('dblclick', toggle, false);
		}
	};
}
/** @namespace */
var THREEx	= THREEx 		|| {};

THREEx.DragPanControls	= function(object, domElement)
{
	this._object	= object;
	this._domElement= domElement || document;

	// parameters that you can change after initialisation
	this.target	= new THREE.Vector3(0, 0, 0);
	this.speedX	= 0.03;
	this.speedY	= 0.03;
	this.rangeX	= -40;
	this.rangeY	= +40;

	// private variables
	this._mouseX	= 0;
	this._mouseY	= 0;

	var _this	= this;
	this._$onMouseMove	= function(){ _this._onMouseMove.apply(_this, arguments); };
	this._$onTouchStart	= function(){ _this._onTouchStart.apply(_this, arguments); };
	this._$onTouchMove	= function(){ _this._onTouchMove.apply(_this, arguments); };

	this._domElement.addEventListener( 'mousemove', this._$onMouseMove, false );
	this._domElement.addEventListener( 'touchstart', this._$onTouchStart,false );
	this._domElement.addEventListener( 'touchmove', this._$onTouchMove, false );
}

THREEx.DragPanControls.prototype.destroy	= function()
{
	this._domElement.removeEventListener( 'mousemove', this._$onMouseMove, false );
	this._domElement.removeEventListener( 'touchstart', this._$onTouchStart,false );
	this._domElement.removeEventListener( 'touchmove', this._$onTouchMove, false );
}

THREEx.DragPanControls.prototype.update	= function(event)
{
	this._object.position.x += ( this._mouseX * this.rangeX - this._object.position.x ) * this.speedX;
	this._object.position.y += ( this._mouseY * this.rangeY - this._object.position.y ) * this.speedY;
	this._object.lookAt( this.target );
}

THREEx.DragPanControls.prototype._onMouseMove	= function(event)
{
	this._mouseX	= ( event.clientX / window.innerWidth ) - 0.5;
	this._mouseY	= ( event.clientY / window.innerHeight) - 0.5;
}

THREEx.DragPanControls.prototype._onTouchStart	= function(event)
{
	if( event.touches.length != 1 )	return;

	// no preventDefault to get click event on ios

	this._mouseX	= ( event.touches[ 0 ].pageX / window.innerWidth ) - 0.5;
	this._mouseY	= ( event.touches[ 0 ].pageY / window.innerHeight) - 0.5;
}

THREEx.DragPanControls.prototype._onTouchMove	= function(event)
{
	if( event.touches.length != 1 )	return;

	event.preventDefault();

	this._mouseX	= ( event.touches[ 0 ].pageX / window.innerWidth ) - 0.5;
	this._mouseY	= ( event.touches[ 0 ].pageY / window.innerHeight) - 0.5;
}

// stats.js r8 - http://github.com/mrdoob/stats.js
var Stats=function(){var h,a,n=0,o=0,i=Date.now(),u=i,p=i,l=0,q=1E3,r=0,e,j,f,b=[[16,16,48],[0,255,255]],m=0,s=1E3,t=0,d,k,g,c=[[16,48,16],[0,255,0]];h=document.createElement("div");h.style.cursor="pointer";h.style.width="80px";h.style.opacity="0.9";h.style.zIndex="10001";h.addEventListener("mousedown",function(a){a.preventDefault();n=(n+1)%2;n==0?(e.style.display="block",d.style.display="none"):(e.style.display="none",d.style.display="block")},!1);e=document.createElement("div");e.style.textAlign=
"left";e.style.lineHeight="1.2em";e.style.backgroundColor="rgb("+Math.floor(b[0][0]/2)+","+Math.floor(b[0][1]/2)+","+Math.floor(b[0][2]/2)+")";e.style.padding="0 0 3px 3px";h.appendChild(e);j=document.createElement("div");j.style.fontFamily="Helvetica, Arial, sans-serif";j.style.fontSize="9px";j.style.color="rgb("+b[1][0]+","+b[1][1]+","+b[1][2]+")";j.style.fontWeight="bold";j.innerHTML="FPS";e.appendChild(j);f=document.createElement("div");f.style.position="relative";f.style.width="74px";f.style.height=
"30px";f.style.backgroundColor="rgb("+b[1][0]+","+b[1][1]+","+b[1][2]+")";for(e.appendChild(f);f.children.length<74;)a=document.createElement("span"),a.style.width="1px",a.style.height="30px",a.style.cssFloat="left",a.style.backgroundColor="rgb("+b[0][0]+","+b[0][1]+","+b[0][2]+")",f.appendChild(a);d=document.createElement("div");d.style.textAlign="left";d.style.lineHeight="1.2em";d.style.backgroundColor="rgb("+Math.floor(c[0][0]/2)+","+Math.floor(c[0][1]/2)+","+Math.floor(c[0][2]/2)+")";d.style.padding=
"0 0 3px 3px";d.style.display="none";h.appendChild(d);k=document.createElement("div");k.style.fontFamily="Helvetica, Arial, sans-serif";k.style.fontSize="9px";k.style.color="rgb("+c[1][0]+","+c[1][1]+","+c[1][2]+")";k.style.fontWeight="bold";k.innerHTML="MS";d.appendChild(k);g=document.createElement("div");g.style.position="relative";g.style.width="74px";g.style.height="30px";g.style.backgroundColor="rgb("+c[1][0]+","+c[1][1]+","+c[1][2]+")";for(d.appendChild(g);g.children.length<74;)a=document.createElement("span"),
a.style.width="1px",a.style.height=Math.random()*30+"px",a.style.cssFloat="left",a.style.backgroundColor="rgb("+c[0][0]+","+c[0][1]+","+c[0][2]+")",g.appendChild(a);return{domElement:h,update:function(){i=Date.now();m=i-u;s=Math.min(s,m);t=Math.max(t,m);k.textContent=m+" MS ("+s+"-"+t+")";var a=Math.min(30,30-m/200*30);g.appendChild(g.firstChild).style.height=a+"px";u=i;o++;if(i>p+1E3)l=Math.round(o*1E3/(i-p)),q=Math.min(q,l),r=Math.max(r,l),j.textContent=l+" FPS ("+q+"-"+r+")",a=Math.min(30,30-l/
100*30),f.appendChild(f.firstChild).style.height=a+"px",p=i,o=0}}};

