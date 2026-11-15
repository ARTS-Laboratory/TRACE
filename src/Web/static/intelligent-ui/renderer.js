// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, E = Object.prototype.hasOwnProperty;
	function D(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function ee(e, t) {
		return D(e.type, t, e.props);
	}
	function te(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function ne(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var re = /\/+/g;
	function ie(e, t) {
		return typeof e == "object" && e && e.key != null ? ne("" + e.key) : t.toString(36);
	}
	function ae(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function oe(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, oe(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + ie(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(re, "$&/") + "/"), oe(o, r, i, "", function(e) {
			return e;
		})) : o != null && (te(o) && (o = ee(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(re, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + ie(a, u), c += oe(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + ie(a, u++), c += oe(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return oe(ae(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function se(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return oe(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function ce(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var le = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function ue(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, le);
		} catch (e) {
			le(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function de(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else ue(de.bind(null, e));
	}
	var fe = {
		map: se,
		forEach: function(e, t, n) {
			se(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return se(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return se(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!te(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = fe, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = de, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !E.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return D(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) E.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return D(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = te, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: ce
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = ue, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, ee());
			else {
				var t = n(l);
				t !== null && re(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && re(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? ee() : S = !1;
			}
		}
	}
	var ee;
	if (typeof y == "function") ee = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var te = new MessageChannel(), ne = te.port2;
		te.port1.onmessage = D, ee = function() {
			ne.postMessage(null);
		};
	} else ee = function() {
		_(D, 0);
	};
	function re(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, re(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, ee()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function d(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = d(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = d(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function h(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && h(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var x = null, S = null;
	function C(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function w(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function T(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function E(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var D = Object.assign, ee = Symbol.for("react.element"), te = Symbol.for("react.transitional.element"), ne = Symbol.for("react.portal"), re = Symbol.for("react.fragment"), ie = Symbol.for("react.strict_mode"), ae = Symbol.for("react.profiler"), oe = Symbol.for("react.consumer"), se = Symbol.for("react.context"), ce = Symbol.for("react.forward_ref"), le = Symbol.for("react.suspense"), ue = Symbol.for("react.suspense_list"), de = Symbol.for("react.memo"), fe = Symbol.for("react.lazy"), pe = Symbol.for("react.activity"), me = Symbol.for("react.legacy_hidden"), O = Symbol.for("react.memo_cache_sentinel"), he = Symbol.for("react.view_transition"), ge = Symbol.for("react.recoverable"), _e = Symbol.iterator;
	function ve(e) {
		return typeof e != "object" || !e ? null : (e = _e && e[_e] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var ye = Symbol.for("react.client.reference");
	function be(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === ye ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case re: return "Fragment";
			case ae: return "Profiler";
			case ie: return "StrictMode";
			case le: return "Suspense";
			case ue: return "SuspenseList";
			case pe: return "Activity";
			case he: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case ne: return "Portal";
			case se: return e.displayName || "Context";
			case oe: return (e._context.displayName || "Context") + ".Consumer";
			case ce:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case de: return t = e.displayName || null, t === null ? be(e.type) || "Memo" : t;
			case fe:
				t = e._payload, e = e._init;
				try {
					return be(e(t));
				} catch {}
		}
		return null;
	}
	var xe = Array.isArray, k = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, A = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Se = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, Ce = [], we = -1;
	function Te(e) {
		return { current: e };
	}
	function Ee(e) {
		0 > we || (e.current = Ce[we], Ce[we] = null, we--);
	}
	function De(e, t) {
		we++, Ce[we] = e.current, e.current = t;
	}
	var Oe = Te(null), ke = Te(null), Ae = Te(null), je = Te(null);
	function Me(e, t) {
		switch (De(Ae, t), De(ke, e), De(Oe, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? hp(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = hp(t), e = gp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		Ee(Oe), De(Oe, e);
	}
	function Ne() {
		Ee(Oe), Ee(ke), Ee(Ae);
	}
	function Pe(e) {
		var t = e.memoizedState;
		t !== null && (fh._currentValue = t.memoizedState, De(je, e)), t = Oe.current;
		var n = gp(t, e.type);
		t !== n && (De(ke, e), De(Oe, n));
	}
	function Fe(e) {
		ke.current === e && (Ee(Oe), Ee(ke)), je.current === e && (Ee(je), fh._currentValue = Se);
	}
	var Ie, Le;
	function Re(e) {
		if (Ie === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Ie = t && t[1] || "", Le = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Ie + e + Le;
	}
	var ze = !1;
	function Be(e, t) {
		if (!e || ze) return "";
		ze = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			ze = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Re(n) : "";
	}
	function Ve(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Re(e.type);
			case 16: return Re("Lazy");
			case 13: return e.child !== t && t !== null ? Re("Suspense Fallback") : Re("Suspense");
			case 19: return Re("SuspenseList");
			case 0:
			case 15: return Be(e.type, !1);
			case 11: return Be(e.type.render, !1);
			case 1: return Be(e.type, !0);
			case 31: return Re("Activity");
			case 30: return Re("ViewTransition");
			default: return "";
		}
	}
	function He(e) {
		try {
			var t = "", n = null;
			do
				t += Ve(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Ue = Object.prototype.hasOwnProperty, We = t.unstable_scheduleCallback, Ge = t.unstable_cancelCallback, Ke = t.unstable_shouldYield, j = t.unstable_requestPaint, qe = t.unstable_now, Je = t.unstable_getCurrentPriorityLevel, Ye = t.unstable_ImmediatePriority, Xe = t.unstable_UserBlockingPriority, Ze = t.unstable_NormalPriority, Qe = t.unstable_LowPriority, $e = t.unstable_IdlePriority, M = t.log, et = t.unstable_setDisableYieldValue, tt = null, nt = null;
	function rt(e) {
		if (typeof M == "function" && et(e), nt && typeof nt.setStrictMode == "function") try {
			nt.setStrictMode(tt, e);
		} catch {}
	}
	var it = Math.clz32 ? Math.clz32 : st, at = Math.log, ot = Math.LN2;
	function st(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (at(e) / ot | 0) | 0;
	}
	var ct = 256, lt = 262144, ut = 4194304;
	function dt(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function ft(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = dt(n))) : i = dt(o) : i = dt(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = dt(n))) : i = dt(o)) : i = dt(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function pt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function mt(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - it(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function ht(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function gt() {
		var e = ut;
		return ut <<= 1, !(ut & 62914560) && (ut = 4194304), e;
	}
	function _t(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function vt(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function yt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - it(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && bt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function bt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - it(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function xt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - it(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function St(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : Ct(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function Ct(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function wt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function Tt() {
		var e = A.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Z(e.type)) : e;
	}
	function Et(e, t) {
		var n = A.p;
		try {
			return A.p = e, t();
		} finally {
			A.p = n;
		}
	}
	var Dt = Math.random().toString(36).slice(2), Ot = "__reactFiber$" + Dt, kt = "__reactProps$" + Dt, At = "__reactContainer$" + Dt, jt = "__reactEvents$" + Dt, Mt = "__reactListeners$" + Dt, Nt = "__reactHandles$" + Dt, Pt = "__reactResources$" + Dt, Ft = "__reactMarker$" + Dt, It = "__reactLoad$" + Dt;
	function Lt(e) {
		delete e[Ot], delete e[kt], delete e[Mt], delete e[Nt];
	}
	function Rt(e) {
		var t;
		if (t = e[Ot]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[At] || n[Ot]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = _m(e); e !== null;) {
					if (n = e[Ot]) return n;
					e = _m(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function zt(e) {
		if (e = e[Ot] || e[At]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Bt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Vt(e) {
		var t = e[Pt];
		return t ||= e[Pt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Ht(e) {
		e[Ft] = !0;
	}
	function Ut(e) {
		e[It] = void 0;
	}
	var Wt = /* @__PURE__ */ new Set(), Gt = {};
	function Kt(e, t) {
		qt(e, t), qt(e + "Capture", t);
	}
	function qt(e, t) {
		for (Gt[e] = t, e = 0; e < t.length; e++) Wt.add(t[e]);
	}
	var Jt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Yt = {}, Xt = {};
	function Zt(e) {
		return Ue.call(Xt, e) ? !0 : Ue.call(Yt, e) ? !1 : Jt.test(e) ? Xt[e] = !0 : (Yt[e] = !0, !1);
	}
	var N = !1;
	function Qt() {
		var e = N;
		return N = !1, e;
	}
	function $t(e, t, n) {
		if (Zt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function en(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function tn(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function nn(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function rn(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function an(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function on(e) {
		if (!e._valueTracker) {
			var t = rn(e) ? "checked" : "value";
			e._valueTracker = an(e, t, "" + e[t]);
		}
	}
	function sn(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = rn(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var cn = /[\n"\\]/g;
	function ln(e) {
		return e.replace(cn, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function un(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + nn(t)) : e.value !== "" + nn(t) && (e.value = "" + nn(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : fn(e, nn(n)) : o === "number" && e.value == t ? fn(e, nn(e.value)) : fn(e, nn(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + nn(s) : e.removeAttribute("name");
	}
	function dn(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				on(e);
				return;
			}
			n = n == null ? "" : "" + nn(n), t = t == null ? n : "" + nn(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), on(e);
	}
	function fn(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function pn(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + nn(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function mn(e, t, n) {
		t != null && (t = "" + nn(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + nn(n);
	}
	function hn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (xe(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = nn(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), on(e);
	}
	function gn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var _n = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function vn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || _n.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function yn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", N = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (vn(e, a, r), N = !0);
		} else for (var o in t) t.hasOwnProperty(o) && vn(e, o, t[o]);
	}
	function bn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var xn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), Sn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function Cn(e) {
		return Sn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function wn() {}
	var Tn = null;
	function En(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var Dn = null, On = null;
	function kn(e) {
		var t = zt(e);
		if (t && (e = t.stateNode)) {
			var n = e[kt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (un(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + ln("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[kt] || null;
								if (!a) throw Error(i(90));
								un(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && sn(r);
					}
					break a;
				case "textarea":
					mn(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && pn(e, !!n.multiple, t, !1);
			}
		}
	}
	var An = !1;
	function jn(e, t, n) {
		if (An) return e(t, n);
		An = !0;
		try {
			return e(t);
		} finally {
			if (An = !1, (Dn !== null || On !== null) && (Wd(), Dn && (t = Dn, e = On, On = Dn = null, kn(t), e))) for (t = 0; t < e.length; t++) kn(e[t]);
		}
	}
	function Mn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[kt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var Nn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, Pn = !1;
	if (Nn) try {
		var Fn = {};
		Object.defineProperty(Fn, "passive", { get: function() {
			Pn = !0;
		} }), window.addEventListener("test", Fn, Fn), window.removeEventListener("test", Fn, Fn);
	} catch {
		Pn = !1;
	}
	var P = null, In = null, Ln = null;
	function Rn() {
		if (Ln) return Ln;
		var e, t = In, n = t.length, r, i = "value" in P ? P.value : P.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Ln = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function zn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Bn() {
		return !0;
	}
	function Vn() {
		return !1;
	}
	function Hn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Bn : Vn, this.isPropagationStopped = Vn, this;
		}
		return D(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Bn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Bn);
			},
			persist: function() {},
			isPersistent: Bn
		}), t;
	}
	var Un = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Wn = Hn(Un), Gn = D({}, Un, {
		view: 0,
		detail: 0
	}), Kn = Hn(Gn), qn, Jn, Yn, Xn = D({}, Gn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: sr,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Yn && (Yn && e.type === "mousemove" ? (qn = e.screenX - Yn.screenX, Jn = e.screenY - Yn.screenY) : Jn = qn = 0, Yn = e), qn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Jn;
		}
	}), Zn = Hn(Xn), Qn = Hn(D({}, Xn, { dataTransfer: 0 })), $n = Hn(D({}, Gn, { relatedTarget: 0 })), er = Hn(D({}, Un, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), tr = Hn(D({}, Un, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), nr = Hn(D({}, Un, { data: 0 })), rr = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, ir = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, ar = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function or(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = ar[e]) ? !!t[e] : !1;
	}
	function sr() {
		return or;
	}
	var cr = Hn(D({}, Gn, {
		key: function(e) {
			if (e.key) {
				var t = rr[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = zn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? ir[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: sr,
		charCode: function(e) {
			return e.type === "keypress" ? zn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? zn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), lr = Hn(D({}, Xn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), ur = Hn(D({}, Un, { submitter: 0 })), dr = Hn(D({}, Gn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: sr
	})), fr = Hn(D({}, Un, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), pr = Hn(D({}, Xn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), mr = Hn(D({}, Un, {
		newState: 0,
		oldState: 0,
		source: 0
	})), hr = [
		9,
		13,
		27,
		32
	], gr = Nn && "CompositionEvent" in window, _r = null;
	Nn && "documentMode" in document && (_r = document.documentMode);
	var vr = Nn && "TextEvent" in window && !_r, yr = Nn && (!gr || _r && 8 < _r && 11 >= _r), br = " ", xr = !1;
	function Sr(e, t) {
		switch (e) {
			case "keyup": return hr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function Cr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var wr = !1;
	function Tr(e, t) {
		switch (e) {
			case "compositionend": return Cr(t);
			case "keypress": return t.which === 32 ? (xr = !0, br) : null;
			case "textInput": return e = t.data, e === br && xr ? null : e;
			default: return null;
		}
	}
	function Er(e, t) {
		if (wr) return e === "compositionend" || !gr && Sr(e, t) ? (e = Rn(), Ln = In = P = null, wr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return yr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Dr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function Or(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Dr[e.type] : t === "textarea";
	}
	function kr(e, t, n, r) {
		Dn ? On ? On.push(r) : On = [r] : Dn = r, t = $f(t, "onChange"), 0 < t.length && (n = new Wn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Ar = null, jr = null;
	function Mr(e) {
		Kf(e, 0);
	}
	function Nr(e) {
		if (sn(Bt(e))) return e;
	}
	function Pr(e, t) {
		if (e === "change") return t;
	}
	var Fr = !1;
	if (Nn) {
		var Ir;
		if (Nn) {
			var Lr = "oninput" in document;
			if (!Lr) {
				var Rr = document.createElement("div");
				Rr.setAttribute("oninput", "return;"), Lr = typeof Rr.oninput == "function";
			}
			Ir = Lr;
		} else Ir = !1;
		Fr = Ir && (!document.documentMode || 9 < document.documentMode);
	}
	function zr() {
		Ar && (Ar.detachEvent("onpropertychange", Br), jr = Ar = null);
	}
	function Br(e) {
		if (e.propertyName === "value" && Nr(jr)) {
			var t = [];
			kr(t, jr, e, En(e)), jn(Mr, t);
		}
	}
	function Vr(e, t, n) {
		e === "focusin" ? (zr(), Ar = t, jr = n, Ar.attachEvent("onpropertychange", Br)) : e === "focusout" && zr();
	}
	function Hr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Nr(jr);
	}
	function Ur(e, t) {
		if (e === "click") return Nr(t);
	}
	function Wr(e, t) {
		if (e === "input" || e === "change") return Nr(t);
	}
	function Gr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Kr = typeof Object.is == "function" ? Object.is : Gr;
	function qr(e, t) {
		if (Kr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ue.call(t, i) || !Kr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Jr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Yr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Xr(e, t) {
		var n = Yr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Yr(n);
		}
	}
	function Zr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Zr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Qr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Jr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Jr(e.document);
		}
		return t;
	}
	function $r(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var ei = Nn && "documentMode" in document && 11 >= document.documentMode, ti = null, ni = null, ri = null, ii = !1;
	function ai(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		ii || ti == null || ti !== Jr(r) || (r = ti, "selectionStart" in r && $r(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), ri && qr(ri, r) || (ri = r, r = $f(ni, "onSelect"), 0 < r.length && (t = new Wn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = ti)));
	}
	function oi(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var si = {
		animationend: oi("Animation", "AnimationEnd"),
		animationiteration: oi("Animation", "AnimationIteration"),
		animationstart: oi("Animation", "AnimationStart"),
		transitionrun: oi("Transition", "TransitionRun"),
		transitionstart: oi("Transition", "TransitionStart"),
		transitioncancel: oi("Transition", "TransitionCancel"),
		transitionend: oi("Transition", "TransitionEnd")
	}, ci = {}, li = {};
	Nn && (li = document.createElement("div").style, "AnimationEvent" in window || (delete si.animationend.animation, delete si.animationiteration.animation, delete si.animationstart.animation), "TransitionEvent" in window || delete si.transitionend.transition);
	function ui(e) {
		if (ci[e]) return ci[e];
		if (!si[e]) return e;
		var t = si[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in li) return ci[e] = t[n];
		return e;
	}
	var di = ui("animationend"), fi = ui("animationiteration"), pi = ui("animationstart"), mi = ui("transitionrun"), hi = ui("transitionstart"), gi = ui("transitioncancel"), _i = ui("transitionend"), vi = /* @__PURE__ */ new Map(), yi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	yi.push("scrollEnd");
	function bi(e, t) {
		vi.set(e, t), Kt(t, [e]);
	}
	var xi = 0;
	function Si(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = Ed.identifierPrefix;
		var n = xi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function Ci(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = G;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function wi(e, t) {
		return e = Ci(e), t = Ci(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var Ti = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, Ei = [], Di = 0, Oi = 0;
	function ki() {
		for (var e = Di, t = Oi = Di = 0; t < e;) {
			var n = Ei[t];
			Ei[t++] = null;
			var r = Ei[t];
			Ei[t++] = null;
			var i = Ei[t];
			Ei[t++] = null;
			var a = Ei[t];
			if (Ei[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Ni(n, i, a);
		}
	}
	function Ai(e, t, n, r) {
		Ei[Di++] = e, Ei[Di++] = t, Ei[Di++] = n, Ei[Di++] = r, Oi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ji(e, t, n, r) {
		return Ai(e, t, n, r), Pi(e);
	}
	function Mi(e, t) {
		return Ai(e, null, null, t), Pi(e);
	}
	function Ni(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - it(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Pi(e) {
		if (50 < Pd) throw Pd = 0, Fd = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Fi = {};
	function Ii(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Li(e, t, n, r) {
		return new Ii(e, t, n, r);
	}
	function Ri(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function zi(e, t) {
		var n = e.alternate;
		return n === null ? (n = Li(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Bi(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Vi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Ri(r) && (s = 1);
		else if (typeof r == "string") s = Qm(e, n, Oe.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case pe: return e = Li(31, n, t, a), e.elementType = pe, e.lanes = o, e;
			case re: return Hi(n.children, a, o, t);
			case ie:
				s = 8, a |= 24;
				break;
			case ae: return e = Li(12, n, t, a | 2), e.elementType = ae, e.lanes = o, e;
			case le: return e = Li(13, n, t, a), e.elementType = le, e.lanes = o, e;
			case ue: return e = Li(19, n, t, a), e.elementType = ue, e.lanes = o, e;
			case me:
			case he: return e = a | 32, e = Li(30, n, t, e), e.elementType = he, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case se:
						s = 10;
						break a;
					case oe:
						s = 9;
						break a;
					case ce:
						s = 11;
						break a;
					case de:
						s = 14;
						break a;
					case fe:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Li(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Hi(e, t, n, r) {
		return e = Li(7, e, r, t), e.lanes = n, e;
	}
	function Ui(e, t, n) {
		return e = Li(6, e, null, t), e.lanes = n, e;
	}
	function Wi(e) {
		var t = Li(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Gi(e, t, n) {
		return t = Li(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Ki = /* @__PURE__ */ new WeakMap();
	function qi(e, t) {
		if (typeof e == "object" && e) {
			var n = Ki.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: He(t)
			}, Ki.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: He(t)
		};
	}
	var Ji = [], Yi = 0, Xi = null, Zi = 0, Qi = [], $i = 0, ea = null, ta = 1, na = "";
	function ra(e, t) {
		Ji[Yi++] = Zi, Ji[Yi++] = Xi, Xi = e, Zi = t;
	}
	function ia(e, t, n) {
		Qi[$i++] = ta, Qi[$i++] = na, Qi[$i++] = ea, ea = e;
		var r = ta;
		e = na;
		var i = 32 - it(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - it(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, ta = 1 << 32 - it(t) + i | n << i | r, na = a + e;
		} else ta = 1 << a | n << i | r, na = e;
	}
	function aa(e) {
		e.return !== null && (ra(e, 1), ia(e, 1, 0));
	}
	function oa(e) {
		for (; e === Xi;) Xi = Ji[--Yi], Ji[Yi] = null, Zi = Ji[--Yi], Ji[Yi] = null;
		for (; e === ea;) ea = Qi[--$i], Qi[$i] = null, na = Qi[--$i], Qi[$i] = null, ta = Qi[--$i], Qi[$i] = null;
	}
	function sa(e, t) {
		Qi[$i++] = ta, Qi[$i++] = na, Qi[$i++] = ea, ta = t.id, na = t.overflow, ea = e;
	}
	var ca = null, la = null, F = !1, ua = null, da = !1, fa = Error(i(519));
	function pa(e) {
		throw ya(qi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), fa;
	}
	function ma(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[Ot] = e, t[kt] = r, n) {
			case "dialog":
				q("cancel", t), q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Wf.length; n++) q(Wf[n], t);
				break;
			case "source":
				q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				q("error", t), q("load", t);
				break;
			case "details":
				q("toggle", t);
				break;
			case "input":
				q("invalid", t), dn(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				q("invalid", t);
				break;
			case "textarea": q("invalid", t), hn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || ip(t.textContent, n) ? (r.popover != null && (q("beforetoggle", t), q("toggle", t)), r.onScroll != null && q("scroll", t), r.onScrollEnd != null && q("scrollend", t), r.onClick != null && (t.onclick = wn), t = !0) : t = !1, t || pa(e, !0);
	}
	function ha(e) {
		for (ca = e.return; ca;) switch (ca.tag) {
			case 5:
			case 31:
			case 13:
				da = !1;
				return;
			case 27:
			case 3:
				da = !0;
				return;
			default: ca = ca.return;
		}
	}
	function ga(e) {
		if (e !== ca) return !1;
		if (!F) return ha(e), F = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || vp(e.type, e.memoizedProps)), n = !n), n && la && pa(e), ha(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			la = gm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			la = gm(e);
		} else t === 27 ? (t = la, Dp(e.type) ? (e = hm, hm = null, la = e) : la = t) : la = ca ? mm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function _a() {
		la = ca = null, F = !1;
	}
	function va() {
		var e = ua;
		return e !== null && (vd === null ? vd = e : vd.push.apply(vd, e), ua = null), e;
	}
	function ya(e) {
		ua === null ? ua = [e] : ua.push(e);
	}
	var ba = Te(null), xa = null, Sa = null;
	function Ca(e, t, n) {
		De(ba, t._currentValue), t._currentValue = n;
	}
	function wa(e) {
		e._currentValue = ba.current, Ee(ba);
	}
	function Ta(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Ea(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Ta(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Ta(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), Ta(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function Da(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Kr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === je.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [fh] : e.push(fh));
			}
			a = a.return;
		}
		return e !== null && Ea(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function Oa(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Kr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function ka(e) {
		xa = e, Sa = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Aa(e) {
		return Ma(xa, e);
	}
	function ja(e, t) {
		return xa === null && ka(e), Ma(e, t);
	}
	function Ma(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Sa === null) {
			if (e === null) throw Error(i(308));
			Sa = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Sa = Sa.next = t;
		return n;
	}
	var Na = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Pa = t.unstable_scheduleCallback, Fa = t.unstable_NormalPriority, Ia = {
		$$typeof: se,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function La() {
		return {
			controller: new Na(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Ra(e) {
		e.refCount--, e.refCount === 0 && Pa(Fa, function() {
			e.controller.abort();
		});
	}
	function za(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Ba = null;
	function Va(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Ha = null, Ua = 0, I = 0, Wa = null;
	function Ga(e, t) {
		if (Ha === null) {
			var n = Ha = [];
			Ua = 0, I = zf(), Wa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Ua++, t.then(Ka, Ka), t;
	}
	function Ka() {
		if (--Ua === 0 && (Ba = null, Ha !== null)) {
			Wa !== null && (Wa.status = "fulfilled");
			var e = Ha;
			Ha = null, I = 0, Wa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function qa(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ja = k.S;
	k.S = function(e, t) {
		if (xd = qe(), typeof t == "object" && t && typeof t.then == "function" && Ga(e, t), Ba !== null) for (var n = Tf; n !== null;) za(n, Ba), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = Tf; r !== null;) za(r, n), r = r.next;
			if (I !== 0) {
				r = Ba, r === null && (r = Ba = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ja !== null && Ja(e, t);
	};
	var Ya = Te(null);
	function Xa() {
		var e = Ya.current;
		return e === null ? id.pooledCache : e;
	}
	function Za(e, t) {
		t === null ? De(Ya, Ya.current) : De(Ya, t.pool);
	}
	function Qa() {
		var e = Xa();
		return e === null ? null : {
			parent: Ia._currentValue,
			pool: e
		};
	}
	var $a = Error(i(460)), eo = Error(i(474)), to = Error(i(542)), no = { then: function() {} };
	function ro(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function io(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(wn, wn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, co(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(wn, wn);
				else {
					if (e = id, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, co(e), e;
				}
				throw oo = t, $a;
		}
	}
	function ao(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (oo = e, $a) : e;
		}
	}
	var oo = null;
	function so() {
		if (oo === null) throw Error(i(459));
		var e = oo;
		return oo = null, e;
	}
	function co(e) {
		if (e === $a || e === to) throw Error(i(483));
	}
	var lo = null, uo = 0;
	function fo(e) {
		var t = uo;
		return uo += 1, lo === null && (lo = []), io(lo, e, t);
	}
	function po(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function mo(e, t) {
		throw t.$$typeof === ee ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function ho(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = zi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Ui(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === re ? (e = d(e, t, n.props.children, r, n.key), po(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === fe && ao(i) === t.type) ? (t = a(t, n.props), po(t, n), t.return = e, t) : (t = Vi(n.type, n.key, n.props, null, e.mode, r), po(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Gi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Hi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Ui("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case te: return n = Vi(t.type, t.key, t.props, null, e.mode, n), po(n, t), n.return = e, n;
					case ne: return t = Gi(t, e.mode, n), t.return = e, t;
					case fe: return t = ao(t), f(e, t, n);
				}
				if (xe(t) || ve(t)) return t = Hi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, fo(t), n);
				if (t.$$typeof === se) return f(e, ja(e, t), n);
				mo(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case te: return n.key === i ? l(e, t, n, r) : null;
					case ne: return n.key === i ? u(e, t, n, r) : null;
					case fe: return n = ao(n), p(e, t, n, r);
				}
				if (xe(n) || ve(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, fo(n), r);
				if (n.$$typeof === se) return p(e, t, ja(e, n), r);
				mo(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case te: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case ne: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case fe: return r = ao(r), m(e, t, n, r, i);
				}
				if (xe(r) || ve(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, fo(r), i);
				if (r.$$typeof === se) return m(e, t, n, ja(t, r), i);
				mo(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), F && ra(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return F && ra(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), F && ra(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), F && ra(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return F && ra(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), F && ra(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === re && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case te:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === re) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), po(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === fe && ao(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), po(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === re ? (c = Hi(o.props.children, e.mode, c, o.key), po(c, o), c.return = e, e = c) : (c = Vi(o.type, o.key, o.props, null, e.mode, c), po(c, o), c.return = e, e = c);
						}
						return s(e);
					case ne:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Gi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case fe: return o = ao(o), _(e, r, o, c);
				}
				if (xe(o)) return h(e, r, o, c);
				if (ve(o)) {
					if (l = ve(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, fo(o), c);
				if (o.$$typeof === se) return _(e, r, ja(e, o), c);
				mo(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Ui(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				uo = 0;
				var i = _(e, t, n, r);
				return lo = null, i;
			} catch (t) {
				if (t === $a || t === to) throw t;
				var a = Li(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var go = ho(!0), _o = ho(!1), vo = !1;
	function yo(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function bo(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function xo(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function So(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, H & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Pi(e), Ni(e, null, n), t;
		}
		return Ai(e, r, t, n), Pi(e);
	}
	function Co(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, xt(e, n);
		}
	}
	function wo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var To = !1;
	function Eo() {
		if (To) {
			var e = Wa;
			if (e !== null) throw e;
		}
	}
	function Do(e, t, n, r) {
		To = !1;
		var i = e.updateQueue;
		vo = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (W & f) === f : (r & f) === f) {
					f !== 0 && f === I && (To = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = D({}, d, f);
								break a;
							case 2: vo = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), fd |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Oo(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function ko(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Oo(n[e], t);
	}
	var Ao = Te(null), jo = Te(0);
	function Mo(e, t) {
		e = ud, De(jo, e), De(Ao, t), ud = e | t.baseLanes;
	}
	function No() {
		De(jo, ud), De(Ao, Ao.current);
	}
	function Po() {
		ud = jo.current, Ee(Ao), Ee(jo);
	}
	var Fo = Te(null), Io = null;
	function Lo(e) {
		var t = e.alternate;
		De(Ho, Ho.current & 1), De(Fo, e), Io === null && (t === null || Ao.current !== null || t.memoizedState !== null) && (Io = e);
	}
	function Ro(e) {
		De(Ho, Ho.current), De(Fo, e), Io === null && (Io = e);
	}
	function zo(e) {
		e.tag === 22 ? (De(Ho, Ho.current), De(Fo, e), Io === null && (Io = e)) : Bo();
	}
	function Bo() {
		De(Ho, Ho.current), De(Fo, Fo.current);
	}
	function Vo(e) {
		Ee(Fo), Io === e && (Io = null), Ee(Ho);
	}
	var Ho = Te(0);
	function Uo(e, t) {
		De(Fo, Fo.current), De(Ho, t);
	}
	function Wo(e) {
		Ee(Ho), Ee(Fo), Io === e && (Io = null);
	}
	function Go(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || dm(n) || fm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Ko = 0, L = null, R = null, qo = null, Jo = !1, Yo = !1, Xo = !1, Zo = 0, Qo = 0, $o = null, es = 0;
	function ts() {
		throw Error(i(321));
	}
	function ns(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Kr(e[n], t[n])) return !1;
		return !0;
	}
	function rs(e, t, n, r, i, a) {
		return Ko = a, L = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, k.H = e === null || e.memoizedState === null ? yc : bc, Xo = !1, a = n(r, i), Xo = !1, Yo && (a = as(t, n, r, i)), is(e), a;
	}
	function is(e) {
		k.H = vc;
		var t = R !== null && R.next !== null;
		if (Ko = 0, qo = R = L = null, Jo = !1, Qo = 0, $o = null, t) throw Error(i(300));
		e === null || Lc || (e = e.dependencies, e !== null && Oa(e) && (Lc = !0));
	}
	function as(e, t, n, r) {
		L = e;
		var a = 0;
		do {
			if (Yo && ($o = null), Qo = 0, Yo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, qo = R = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			k.H = xc, o = t(n, r);
		} while (Yo);
		return o;
	}
	function os() {
		var e = k.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? ps(t) : t, e = e.useState()[0], (R === null ? null : R.memoizedState) !== e && (L.flags |= 1024), t;
	}
	function ss() {
		var e = Zo !== 0;
		return Zo = 0, e;
	}
	function cs(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function ls(e) {
		if (Jo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Jo = !1;
		}
		Ko = 0, qo = R = L = null, Yo = !1, Qo = Zo = 0, $o = null;
	}
	function us() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return qo === null ? L.memoizedState = qo = e : qo = qo.next = e, qo;
	}
	function ds() {
		if (R === null) {
			var e = L.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = R.next;
		var t = qo === null ? L.memoizedState : qo.next;
		if (t !== null) qo = t, R = e;
		else {
			if (e === null) throw L.alternate === null ? Error(i(467)) : Error(i(310));
			R = e, e = {
				memoizedState: R.memoizedState,
				baseState: R.baseState,
				baseQueue: R.baseQueue,
				queue: R.queue,
				next: null
			}, qo === null ? L.memoizedState = qo = e : qo = qo.next = e;
		}
		return qo;
	}
	function fs() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function ps(e) {
		var t = Qo;
		return Qo += 1, $o === null && ($o = []), e = io($o, e, t), t = L, (qo === null ? t.memoizedState : qo.next) === null && (t = t.alternate, k.H = t === null || t.memoizedState === null ? yc : bc), e;
	}
	function ms(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return ps(e);
			if (e.$$typeof === ge) return;
			if (e.$$typeof === se) return Aa(e);
		}
		throw Error(i(438, String(e)));
	}
	function hs(e) {
		var t = null, n = L.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = L.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = fs(), L.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = O;
		return t.index++, n;
	}
	function gs(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function _s(e) {
		return vs(ds(), R, e);
	}
	function vs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Ko & f) === f : (W & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === I && (d = !0);
					else if ((Ko & p) === p) {
						u = u.next, p === I && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, L.lanes |= p, fd |= p;
					f = u.action, Xo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, L.lanes |= f, fd |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Kr(o, e.memoizedState) && (Lc = !0, d && (n = Wa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ys(e) {
		var t = ds(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Kr(o, t.memoizedState) || (Lc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function bs(e, t, n) {
		var r = L, a = ds(), o = F;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Kr((R || a).memoizedState, n);
		if (s && (a.memoizedState = n, Lc = !0), a = a.queue, Gs(Cs.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || qo !== null && !!(qo.memoizedState.tag & 1), Bs(e ? 9 : 8, { destroy: void 0 }, Ss.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, id === null) throw Error(i(349));
			o || Ko & 127 || xs(r, t, n);
		}
		return n;
	}
	function xs(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = L.updateQueue, t === null ? (t = fs(), L.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Ss(e, t, n, r) {
		t.value = n, t.getSnapshot = r, ws(t) && Ts(e);
	}
	function Cs(e, t, n) {
		return n(function() {
			ws(t) && Ts(e);
		});
	}
	function ws(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Kr(e, n);
		} catch {
			return !0;
		}
	}
	function Ts(e) {
		var t = Mi(e, 2);
		t !== null && zd(t, e, 2);
	}
	function Es(e) {
		var t = us();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Xo) {
				rt(!0);
				try {
					n();
				} finally {
					rt(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: gs,
			lastRenderedState: e
		}, t;
	}
	function Ds(e, t, n, r) {
		return e.baseState = n, vs(e, R, typeof r == "function" ? r : gs);
	}
	function Os(e, t, n, r, a) {
		if (hc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			k.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, ks(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function ks(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = k.T, o = {};
			o.types = a === null ? null : a.types, k.T = o;
			try {
				var s = n(i, r), c = k.S;
				c !== null && c(o, s), As(e, t, s);
			} catch (n) {
				Ms(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), k.T = a;
			}
		} else try {
			a = n(i, r), As(e, t, a);
		} catch (n) {
			Ms(e, t, n);
		}
	}
	function As(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			js(e, t, n);
		}, function(n) {
			return Ms(e, t, n);
		}) : js(e, t, n);
	}
	function js(e, t, n) {
		t.status = "fulfilled", t.value = n, Ns(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, ks(e, n)));
	}
	function Ms(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Ns(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Ns(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Ps(e, t) {
		return t;
	}
	function Fs(e, t) {
		if (F) {
			var n = id.formState;
			if (n !== null) {
				a: {
					var r = L;
					if (F) {
						if (la) {
							b: {
								for (var i = la, a = da; i.nodeType !== 8;) if (!a || (i = mm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								la = mm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						pa(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = us(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ps,
			lastRenderedState: t
		}, n.queue = r, n = pc.bind(null, L, r), r.dispatch = n, r = Es(!1), a = mc.bind(null, L, !1, r.queue), r = us(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Os.bind(null, L, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Is(e) {
		return Ls(ds(), R, e);
	}
	function Ls(e, t, n) {
		if (t = vs(e, t, Ps)[0], e = _s(gs)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = ps(t);
		} catch (e) {
			throw e === $a ? to : e;
		}
		else r = t;
		t = ds();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (L.flags |= 2048, Bs(9, { destroy: void 0 }, Rs.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Rs(e, t) {
		e.action = t;
	}
	function zs(e) {
		var t = ds(), n = R;
		if (n !== null) return Ls(t, n, e);
		ds(), t = t.memoizedState, n = ds();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Bs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = L.updateQueue, t === null && (t = fs(), L.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Vs() {
		return ds().memoizedState;
	}
	function Hs(e, t, n, r) {
		var i = us();
		L.flags |= e, i.memoizedState = Bs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Us(e, t, n, r) {
		var i = ds();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		R !== null && r !== null && ns(r, R.memoizedState.deps) ? i.memoizedState = Bs(t, a, n, r) : (L.flags |= e, i.memoizedState = Bs(1 | t, a, n, r));
	}
	function Ws(e, t) {
		Hs(8390656, 8, e, t);
	}
	function Gs(e, t) {
		Us(2048, 8, e, t);
	}
	function Ks(e) {
		L.flags |= 4;
		var t = L.updateQueue;
		if (t === null) t = fs(), L.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function qs(e) {
		var t = ds().memoizedState;
		return Ks({
			ref: t,
			nextImpl: e
		}), function() {
			if (H & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Js(e, t) {
		return Us(4, 2, e, t);
	}
	function Ys(e, t) {
		return Us(4, 4, e, t);
	}
	function Xs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Zs(e, t, n) {
		n = n == null ? null : n.concat([e]), Us(4, 4, Xs.bind(null, t, e), n);
	}
	function Qs() {}
	function $s(e, t) {
		var n = ds();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && ns(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function ec(e, t) {
		var n = ds();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && ns(t, r[1])) return r[0];
		if (r = e(), Xo) {
			rt(!0);
			try {
				e();
			} finally {
				rt(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function tc(e, t, n) {
		return n === void 0 || Ko & 1073741824 && !(W & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Ld(), L.lanes |= e, fd |= e, n);
	}
	function nc(e, t, n, r) {
		return Kr(n, t) ? n : Ao.current === null ? !(Ko & 106) || Ko & 1073741824 && !(W & 261930) ? (Lc = !0, e.memoizedState = n) : (e = Ld(), L.lanes |= e, fd |= e, t) : (e = tc(e, n, r), Kr(e, t) || (Lc = !0), e);
	}
	function rc(e, t, n, r, i) {
		var a = A.p;
		A.p = a !== 0 && 8 > a ? a : 8;
		var o = k.T, s = {};
		s.types = o === null ? null : o.types, k.T = s, mc(e, !1, t, n);
		try {
			var c = i(), l = k.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? z(e, t, qa(c, r), Id(e)) : z(e, t, r, Id(e));
		} catch (n) {
			z(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, Id());
		} finally {
			A.p = a, o !== null && s.types !== null && (o.types = s.types), k.T = o;
		}
	}
	function ic() {}
	function ac(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = oc(e).queue;
		rc(e, a, t, Se, n === null ? ic : function() {
			return sc(e), n(r);
		});
	}
	function oc(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: Se,
			baseState: Se,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: gs,
				lastRenderedState: Se
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: gs,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function sc(e) {
		var t = oc(e);
		t.next === null && (t = e.alternate.memoizedState), z(e, t.next.queue, {}, Id());
	}
	function cc() {
		return Aa(fh);
	}
	function lc() {
		return ds().memoizedState;
	}
	function uc() {
		return ds().memoizedState;
	}
	function dc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = Id();
					e = xo(n);
					var r = So(t, e, n);
					r !== null && (zd(r, t, n), Co(r, t, n)), t = { cache: La() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function fc(e, t, n) {
		var r = Id();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, hc(e) ? gc(t, n) : (n = ji(e, t, n, r), n !== null && (zd(n, e, r), _c(n, t, r)));
	}
	function pc(e, t, n) {
		z(e, t, n, Id());
	}
	function z(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (hc(e)) gc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Kr(s, o)) return Ai(e, t, i, 0), id === null && ki(), !1;
			} catch {}
			if (n = ji(e, t, i, r), n !== null) return zd(n, e, r), _c(n, t, r), !0;
		}
		return !1;
	}
	function mc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: zf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, hc(e)) {
			if (t) throw Error(i(479));
		} else t = ji(e, n, r, 2), t !== null && zd(t, e, 2);
	}
	function hc(e) {
		var t = e.alternate;
		return e === L || t !== null && t === L;
	}
	function gc(e, t) {
		Yo = Jo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function _c(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, xt(e, n);
		}
	}
	var vc = {
		readContext: Aa,
		use: ms,
		useCallback: ts,
		useContext: ts,
		useEffect: ts,
		useImperativeHandle: ts,
		useLayoutEffect: ts,
		useInsertionEffect: ts,
		useMemo: ts,
		useReducer: ts,
		useRef: ts,
		useState: ts,
		useDebugValue: ts,
		useDeferredValue: ts,
		useTransition: ts,
		useSyncExternalStore: ts,
		useId: ts,
		useHostTransitionStatus: ts,
		useFormState: ts,
		useActionState: ts,
		useOptimistic: ts,
		useMemoCache: ts,
		useCacheRefresh: ts,
		useEffectEvent: ts
	}, yc = {
		readContext: Aa,
		use: ms,
		useCallback: function(e, t) {
			return us().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Aa,
		useEffect: Ws,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Hs(4194308, 4, Xs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Hs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Hs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = us();
			t = t === void 0 ? null : t;
			var r = e();
			if (Xo) {
				rt(!0);
				try {
					e();
				} finally {
					rt(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = us();
			if (n !== void 0) {
				var i = n(t);
				if (Xo) {
					rt(!0);
					try {
						n(t);
					} finally {
						rt(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = fc.bind(null, L, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = us();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Es(e);
			var t = e.queue, n = pc.bind(null, L, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Qs,
		useDeferredValue: function(e, t) {
			return tc(us(), e, t);
		},
		useTransition: function() {
			var e = Es(!1);
			return e = rc.bind(null, L, e.queue, !0, !1), us().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = L, a = us();
			if (F) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), id === null) throw Error(i(349));
				W & 127 || xs(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Ws(Cs.bind(null, r, o, e), [e]), r.flags |= 2048, Bs(9, { destroy: void 0 }, Ss.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = us(), t = id.identifierPrefix;
			if (F) {
				var n = na, r = ta;
				n = (r & ~(1 << 32 - it(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Zo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = es++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: cc,
		useFormState: Fs,
		useActionState: Fs,
		useOptimistic: function(e) {
			var t = us();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = mc.bind(null, L, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: hs,
		useCacheRefresh: function() {
			return us().memoizedState = dc.bind(null, L);
		},
		useEffectEvent: function(e) {
			var t = us(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (H & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, bc = {
		readContext: Aa,
		use: ms,
		useCallback: $s,
		useContext: Aa,
		useEffect: Gs,
		useImperativeHandle: Zs,
		useInsertionEffect: Js,
		useLayoutEffect: Ys,
		useMemo: ec,
		useReducer: _s,
		useRef: Vs,
		useState: function() {
			return _s(gs);
		},
		useDebugValue: Qs,
		useDeferredValue: function(e, t) {
			return nc(ds(), R.memoizedState, e, t);
		},
		useTransition: function() {
			var e = _s(gs)[0], t = ds().memoizedState;
			return [typeof e == "boolean" ? e : ps(e), t];
		},
		useSyncExternalStore: bs,
		useId: lc,
		useHostTransitionStatus: cc,
		useFormState: Is,
		useActionState: Is,
		useOptimistic: function(e, t) {
			return Ds(ds(), R, e, t);
		},
		useMemoCache: hs,
		useCacheRefresh: uc,
		useEffectEvent: qs
	}, xc = {
		readContext: Aa,
		use: ms,
		useCallback: $s,
		useContext: Aa,
		useEffect: Gs,
		useImperativeHandle: Zs,
		useInsertionEffect: Js,
		useLayoutEffect: Ys,
		useMemo: ec,
		useReducer: ys,
		useRef: Vs,
		useState: function() {
			return ys(gs);
		},
		useDebugValue: Qs,
		useDeferredValue: function(e, t) {
			var n = ds();
			return R === null ? tc(n, e, t) : nc(n, R.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ys(gs)[0], t = ds().memoizedState;
			return [typeof e == "boolean" ? e : ps(e), t];
		},
		useSyncExternalStore: bs,
		useId: lc,
		useHostTransitionStatus: cc,
		useFormState: zs,
		useActionState: zs,
		useOptimistic: function(e, t) {
			var n = ds();
			return R === null ? (n.baseState = e, [e, n.queue.dispatch]) : Ds(n, R, e, t);
		},
		useMemoCache: hs,
		useCacheRefresh: uc,
		useEffectEvent: qs
	};
	function Sc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : D({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Cc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = Id(), i = xo(r);
			i.payload = t, n != null && (i.callback = n), t = So(e, i, r), t !== null && (zd(t, e, r), Co(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = Id(), i = xo(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = So(e, i, r), t !== null && (zd(t, e, r), Co(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = Id(), r = xo(n);
			r.tag = 2, t != null && (r.callback = t), t = So(e, r, n), t !== null && (zd(t, e, n), Co(t, e, n));
		}
	};
	function wc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !qr(n, r) || !qr(i, a) : !0;
	}
	function Tc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Cc.enqueueReplaceState(t, t.state, null);
	}
	function Ec(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = D({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Dc(e) {
		Ti(e);
	}
	function Oc(e) {
		console.error(e);
	}
	function kc(e) {
		Ti(e);
	}
	function Ac(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function jc(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Mc(e, t, n) {
		return n = xo(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Ac(e, t);
		}, n;
	}
	function Nc(e) {
		return e = xo(e), e.tag = 3, e;
	}
	function Pc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				jc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			jc(t, n, r), typeof i != "function" && (wd === null ? wd = /* @__PURE__ */ new Set([this]) : wd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Fc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Da(t, n, a, !0), n = Fo.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Io === null ? Zd() : n.alternate === null && dd === 0 && (dd = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === no ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), yf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === no ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), yf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return yf(e, r, a), Zd(), !1;
		}
		if (F) return t = Fo.current, t === null ? (r !== fa && (t = Error(i(423), { cause: r }), ya(qi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = qi(r, n), a = Mc(e.stateNode, r, a), wo(e, a), dd !== 4 && (dd = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== fa && (e = Error(i(422), { cause: r }), ya(qi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = qi(o, n), _d === null ? _d = [o] : _d.push(o), dd !== 4 && (dd = 2), t === null) return !0;
		r = qi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Mc(n.stateNode, r, e), wo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (wd === null || !wd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Nc(a), Pc(a, e, n, r), wo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Ic = Error(i(461)), Lc = !1;
	function Rc(e, t, n, r) {
		t.child = e === null ? _o(t, null, n, r) : go(t, e.child, n, r);
	}
	function zc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return ka(t), r = rs(e, t, n, o, a, i), s = ss(), e !== null && !Lc ? (cs(e, t, i), fl(e, t, i)) : (F && s && aa(t), t.flags |= 1, Rc(e, t, r, i), t.child);
	}
	function Bc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Ri(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Vc(e, t, a, r, i)) : (e = Vi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !pl(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? qr : n, n(o, r) && e.ref === t.ref) return fl(e, t, i);
		}
		return t.flags |= 1, e = zi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Vc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (qr(a, r) && e.ref === t.ref) {
				if (Lc = !1, t.pendingProps = r = a, pl(e, i)) e.flags & 131072 && (Lc = !0);
				else return t.lanes = e.lanes, fl(e, t, i);
			}
		}
		return Yc(e, t, n, r, i);
	}
	function Hc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Wc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Za(t, a === null ? null : a.cachePool), a === null ? No() : Mo(t, a), zo(t);
			else return r = t.lanes = 536870912, Wc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Za(t, null), No(), Bo()) : (Za(t, a.cachePool), Mo(t, a), Bo(), t.memoizedState = null);
		return Rc(e, t, i, n), t.child;
	}
	function Uc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Wc(e, t, n, r, i) {
		var a = Xa();
		return a = a === null ? null : {
			parent: Ia._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Za(t, null), No(), zo(t), e !== null && Da(e, t, r, !0), t.childLanes = i, null;
	}
	function Gc(e, t) {
		return t = rl({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Kc(e, t, n) {
		return go(t, e.child, null, n), e = Gc(t, t.pendingProps), e.flags |= 2, Vo(t), t.memoizedState = null, e;
	}
	function qc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (F) {
				if (r.mode === "hidden") return e = Gc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Uc(null, e);
				if (Ro(t), (e = la) ? (e = um(e, da), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: ea === null ? null : {
						id: ta,
						overflow: na
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Wi(e), n.return = t, t.child = n, ca = t, la = null)) : e = null, e === null) throw pa(t);
				return t.lanes = 536870912, null;
			}
			return Gc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Ro(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Kc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Lc || Da(e, t, n, !1), a = (n & e.childLanes) !== 0, Lc || a) {
				if (Ao.current === null) {
					if (r = id, r !== null && (s = St(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Mi(e, s), zd(r, e, s), Ic;
					Zd();
				}
				t = Kc(e, t, n);
			} else e = o.treeContext, la = mm(s.nextSibling), ca = t, F = !0, ua = null, da = !1, e !== null && sa(t, e), t = Gc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = zi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Jc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Yc(e, t, n, r, i) {
		return ka(t), n = rs(e, t, n, r, void 0, i), r = ss(), e !== null && !Lc ? (cs(e, t, i), fl(e, t, i)) : (F && r && aa(t), t.flags |= 1, Rc(e, t, n, i), t.child);
	}
	function Xc(e, t, n, r, i, a) {
		return ka(t), t.updateQueue = null, n = as(t, r, n, i), is(e), r = ss(), e !== null && !Lc ? (cs(e, t, a), fl(e, t, a)) : (F && r && aa(t), t.flags |= 1, Rc(e, t, n, a), t.child);
	}
	function Zc(e, t, n, r, i) {
		if (ka(t), t.stateNode === null) {
			var a = Fi, o = n.contextType;
			typeof o == "object" && o && (a = Aa(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Cc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, yo(t), o = n.contextType, a.context = typeof o == "object" && o ? Aa(o) : Fi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Sc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Cc.enqueueReplaceState(a, a.state, null), Do(t, r, a, i), Eo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Ec(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Fi, typeof u == "object" && u && (o = Aa(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Tc(t, a, r, o), vo = !1;
			var f = t.memoizedState;
			a.state = f, Do(t, r, a, i), Eo(), l = t.memoizedState, s || f !== l || vo ? (typeof d == "function" && (Sc(t, n, d, r), l = t.memoizedState), (c = vo || wc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, bo(e, t), o = t.memoizedProps, u = Ec(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Fi, typeof l == "object" && l && (c = Aa(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Tc(t, a, r, c), vo = !1, f = t.memoizedState, a.state = f, Do(t, r, a, i), Eo();
			var p = t.memoizedState;
			o !== d || f !== p || vo || e !== null && e.dependencies !== null && Oa(e.dependencies) ? (typeof s == "function" && (Sc(t, n, s, r), p = t.memoizedState), (u = vo || wc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Oa(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Jc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = go(t, e.child, null, i), t.child = go(t, null, n, i)) : Rc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = fl(e, t, i), e;
	}
	function Qc(e, t, n, r) {
		return _a(), t.flags |= 256, Rc(e, t, n, r), t.child;
	}
	var B = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function $c(e) {
		return {
			baseLanes: e,
			cachePool: Qa()
		};
	}
	function el(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= hd), e;
	}
	function tl(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Ho.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (F) {
				if (i ? Lo(t) : Bo(), (e = la) ? (e = um(e, da), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: ea === null ? null : {
						id: ta,
						overflow: na
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Wi(e), n.return = t, t.child = n, ca = t, la = null)) : e = null, e === null) throw pa(t);
				return t.lanes = fm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Bo(), i = t.mode, a = rl({
				mode: "hidden",
				children: a
			}, i), r = Hi(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = $c(n), r.childLanes = el(e, o, n), t.memoizedState = B, Uc(null, r)) : (Lo(t), nl(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return al(e, t, a, o, r, c, s, n);
		}
		return i ? (Bo(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = zi(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Hi(i, a, n, null), i.flags |= 2) : i = zi(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Uc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = $c(n) : (a = i.cachePool, a === null ? a = Qa() : (s = Ia._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = el(e, o, n), t.memoizedState = B, Uc(e.child, r)) : (Lo(t), n = e.child, e = n.sibling, n = zi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function nl(e, t) {
		return t = rl({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function rl(e, t) {
		return e = Li(22, e, null, t), e.lanes = 0, e;
	}
	function il(e, t, n) {
		return go(t, e.child, null, n), e = nl(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function al(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Lo(t), t.flags &= -257, il(e, t, c)) : t.memoizedState === null ? (Bo(), o = a.fallback, s = t.mode, a = rl({
			mode: "visible",
			children: a.children
		}, s), o = Hi(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, go(t, e.child, null, c), a = t.child, a.memoizedState = $c(c), a.childLanes = el(e, r, c), t.memoizedState = B, Uc(null, a)) : (Bo(), t.child = e.child, t.flags |= 128, null);
		if (Lo(t), fm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, ya({
				value: a,
				source: null,
				stack: null
			})), il(e, t, c);
		}
		if (Lc || Da(e, t, c, !1), r = (c & e.childLanes) !== 0, Lc || r) {
			if (Ao.current !== null) return il(e, t, c);
			if (r = id, r !== null && (a = St(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, Mi(e, a), zd(r, e, a), Ic;
			return dm(o) || Zd(), il(e, t, c);
		}
		return dm(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, la = mm(o.nextSibling), ca = t, F = !0, ua = null, da = !1, e !== null && sa(t, e), t = nl(t, a.children), t.flags |= 134221824, t);
	}
	function ol(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Ta(e.return, t, n);
	}
	function sl(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Go(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function cl(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function ll(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function ul(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Ho.current;
		if (t.flags & 128) return Uo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Uo(t, o), i === "backwards" && e !== null ? (ll(e), Rc(e, t, r, n), ll(e)) : Rc(e, t, r, n), r = F ? Zi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && ol(e, n, t);
			else if (e.tag === 19) ol(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = sl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, ll(t)), cl(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Go(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				cl(t, !0, n, null, a, r);
				break;
			case "together":
				cl(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = sl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), cl(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function dl(e, t, n) {
		var r = t.pendingProps;
		return Ca(t, t.type, r.value), Rc(e, t, r.children, n), t.child;
	}
	function fl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), fd |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Da(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = zi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = zi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function pl(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && Oa(e)));
	}
	function ml(e, t, n) {
		switch (t.tag) {
			case 3:
				Me(t, t.stateNode.containerInfo), Ca(t, Ia, e.memoizedState.cache), _a();
				break;
			case 27:
			case 5:
				Pe(t);
				break;
			case 4:
				Me(t, t.stateNode.containerInfo);
				break;
			case 10:
				Ca(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Ro(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Lo(t), t.flags |= 128, null;
					r = Da(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? tl(e, t, n) : (Lo(t), e = fl(e, t, n), e === null ? null : e.sibling);
				}
				Lo(t);
				break;
			case 19:
				if (t.flags & 128) return ul(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (Da(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return ul(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Uo(t, Ho.current), r) break;
				return null;
			case 22: return t.lanes = 0, Hc(e, t, n, t.pendingProps);
			case 24: Ca(t, Ia, e.memoizedState.cache);
		}
		return fl(e, t, n);
	}
	function hl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Lc = !0;
			else {
				if (!pl(e, n) && !(t.flags & 128)) return Lc = !1, ml(e, t, n);
				Lc = !!(e.flags & 131072);
			}
		} else Lc = !1, F && t.flags & 1048576 && ia(t, Zi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = ao(t.elementType), t.type = e, typeof e == "function") Ri(e) ? (r = Ec(e, r), t.tag = 1, t = Zc(null, t, e, r, n)) : (t.tag = 0, t = Yc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === ce) {
								t.tag = 11, t = zc(null, t, e, r, n);
								break a;
							}
							if (a === de) {
								t.tag = 14, t = Bc(null, t, e, r, n);
								break a;
							}
							if (a === se) {
								t.tag = 10, t.type = e, t = dl(null, t, n);
								break a;
							}
						}
						throw t = be(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Yc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Ec(r, t.pendingProps), Zc(e, t, r, a, n);
			case 3:
				a: {
					if (Me(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, bo(e, t), Do(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, Ca(t, Ia, r), r !== o.cache && Ea(t, [Ia], n, !0), Eo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Qc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = qi(Error(i(424)), t), ya(a), t = Qc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (la = mm(e.firstChild), ca = t, F = !0, ua = null, da = !0, n = _o(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (_a(), r === a) {
							t = fl(e, t, n);
							break a;
						}
						Rc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Jc(e, t), e === null ? (n = Rm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : F || (t.stateNode = _p(t.type, t.pendingProps, Ae.current, t)) : t.memoizedState = Rm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Pe(t), e === null && F && (r = t.stateNode = bm(t.type, t.pendingProps, Ae.current), ca = t, da = !0, a = la, Dp(t.type) ? (hm = a, la = mm(r.firstChild)) : la = a), Rc(e, t, t.pendingProps.children, n), Jc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && F && ((a = r = la) && (r = cm(r, t.type, t.pendingProps, da), r === null ? a = !1 : (t.stateNode = r, ca = t, la = mm(r.firstChild), da = !1, a = !0)), a || pa(t)), Pe(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, vp(a, o) ? r = null : s !== null && vp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = rs(e, t, os, null, null, n), fh._currentValue = a), Jc(e, t), Rc(e, t, r, n), t.child;
			case 6: return e === null && F && ((e = n = la) && (n = lm(n, t.pendingProps, da), n === null ? e = !1 : (t.stateNode = n, ca = t, la = null, e = !0)), e || pa(t)), null;
			case 13: return tl(e, t, n);
			case 4: return Me(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = go(t, null, r, n) : Rc(e, t, r, n), t.child;
			case 11: return zc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Jc(e, t), Rc(e, t, r, n), t.child;
			case 8: return Rc(e, t, t.pendingProps.children, n), t.child;
			case 12: return Rc(e, t, t.pendingProps.children, n), t.child;
			case 10: return dl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, ka(t), a = Aa(a), r = r(a), t.flags |= 1, Rc(e, t, r, n), t.child;
			case 14: return Bc(e, t, t.type, t.pendingProps, n);
			case 15: return Vc(e, t, t.type, t.pendingProps, n);
			case 19: return ul(e, t, n);
			case 31: return qc(e, t, n);
			case 22: return Hc(e, t, n, t.pendingProps);
			case 24: return ka(t), r = Aa(Ia), e === null ? (a = Xa(), a === null && (a = id, o = La(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, yo(t), Ca(t, Ia, a)) : ((e.lanes & n) !== 0 && (bo(e, t), Do(t, null, null, n), Eo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, Ca(t, Ia, r), r !== a.cache && Ea(t, [Ia], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), Ca(t, Ia, r))), Rc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : F && aa(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Jc(e, t), Rc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function gl(e) {
		e.flags |= 4;
	}
	function _l(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? $m(t, r) : $m(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Jd()) e.flags |= 8192;
				else throw oo = no, eo;
			}
		} else e.flags &= -16777217;
	}
	function vl(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !eh(t)) {
			if (Jd()) e.flags |= 8192;
			else throw oo = no, eo;
		}
	}
	function yl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : gt(), e.lanes |= t, gd |= t);
	}
	function bl(e, t) {
		if (!F) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function xl(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Sl(e, t, n) {
		var r = t.pendingProps;
		switch (oa(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return xl(t), null;
			case 1: return xl(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), wa(Ia), Ne(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ga(t) ? gl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, va())), xl(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (gl(t), o === null ? (xl(t), _l(t, a, null, r, n)) : (xl(t), vl(t, o))) : o ? o === e.memoizedState ? (xl(t), t.flags &= -16777217) : (gl(t), xl(t), vl(t, o)) : (e = e.memoizedProps, e !== r && gl(t), xl(t), _l(t, a, e, r, n)), null;
			case 27:
				if (Fe(t), n = Ae.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && gl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return xl(t), t.subtreeFlags &= -33554433, null;
					}
					e = Oe.current, ga(t) ? ma(t, e) : (e = bm(a, r, n), t.stateNode = e, gl(t));
				}
				return xl(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (Fe(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && gl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return xl(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = Oe.current, ga(t)) ma(t, o);
					else {
						var s = mp(Ae.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[Ot] = t, o[kt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (sp(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && gl(t);
					}
				}
				return xl(t), t.subtreeFlags &= -33554433, _l(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && gl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Ae.current, ga(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = ca, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[Ot] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || ip(e.nodeValue, n)), e || pa(t, !0);
					} else e = mp(e).createTextNode(r), e[Ot] = t, t.stateNode = e;
				}
				return xl(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = ga(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[Ot] = t;
						} else _a(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						xl(t), e = !1;
					} else n = va(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Vo(t), t) : (Vo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return xl(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = ga(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[Ot] = t;
						} else _a(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						xl(t), a = !1;
					} else a = va(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Vo(t), t) : (Vo(t), null);
				}
				return Vo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), yl(t, t.updateQueue), xl(t), null);
			case 4: return Ne(), e === null && Yf(t.stateNode.containerInfo), t.flags |= 67108864, xl(t), null;
			case 10: return wa(t.type), xl(t), null;
			case 19:
				if (Wo(t), r = t.memoizedState, r === null) return xl(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) bl(r, !1);
					else {
						if (dd !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Go(e), o !== null) {
								for (t.flags |= 128, bl(r, !1), e = o.updateQueue, t.updateQueue = e, yl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Bi(n, e), n = n.sibling;
								return Uo(t, Ho.current & 1 | 2), F && ra(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && qe() > Sd && (t.flags |= 128, a = !0, bl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Go(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, yl(t, e), bl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !F) return xl(t), null;
						} else 2 * qe() - r.renderingStartTime > Sd && n !== 536870912 && (t.flags |= 128, a = !0, bl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = qe(), e.sibling = null, o = Ho.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || F ? Uo(t, o) : (n = o, De(Fo, t), De(Ho, n), Io === null && (Io = t)), F && ra(t, r.treeForkCount), e;
				}
				return xl(t), null;
			case 22:
			case 23: return Vo(t), Po(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (xl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : xl(t), n = t.updateQueue, n !== null && yl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && Ee(Ya), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), wa(Ia), xl(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, xl(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function Cl(e, t) {
		switch (oa(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return wa(Ia), Ne(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Fe(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Vo(t), t.alternate === null) throw Error(i(340));
					_a();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Vo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					_a();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Wo(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return Ne(), null;
			case 10: return wa(t.type), null;
			case 22:
			case 23: return Vo(t), Po(), e !== null && Ee(Ya), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return wa(Ia), null;
			case 25: return null;
			default: return null;
		}
	}
	function wl(e, t) {
		switch (oa(t), t.tag) {
			case 3:
				wa(Ia), Ne();
				break;
			case 26:
			case 27:
			case 5:
				Fe(t);
				break;
			case 4:
				Ne();
				break;
			case 31:
				t.memoizedState !== null && Vo(t);
				break;
			case 13:
				Vo(t);
				break;
			case 19:
				Wo(t);
				break;
			case 10:
				wa(t.type);
				break;
			case 22:
			case 23:
				Vo(t), Po(), e !== null && Ee(Ya);
				break;
			case 24: wa(Ia);
		}
	}
	function Tl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			K(t, t.return, e);
		}
	}
	function El(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								K(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			K(t, t.return, e);
		}
	}
	function Dl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				ko(t, n);
			} catch (t) {
				K(e, e.return, t);
			}
		}
	}
	function Ol(e, t, n) {
		n.props = Ec(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			K(e, t, n);
		}
	}
	function kl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = Si(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = zp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Bp(e);
							h(e.child, !1, rm, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			K(e, t, n);
		}
	}
	function Al(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				K(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				K(e, t, n);
			}
			else n.current = null;
		}
	}
	function jl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) am(e.stateNode, t[n]);
	}
	function Ml(e) {
		for (var t = e.return; t !== null && (Fl(t) && am(e.stateNode, t.stateNode), !Pl(t));) t = t.return;
	}
	function Nl(e) {
		for (var t = e.return; t !== null && (Fl(t) && om(e.stateNode, t.stateNode), !Pl(t));) t = t.return;
	}
	function Pl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Fl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Il(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			K(e, e.return, t);
		}
	}
	function Ll(e, t, n) {
		try {
			var r = e.stateNode;
			lp(r, e.type, n, t), r[kt] = t;
		} catch (t) {
			K(e, e.return, t);
		}
	}
	function Rl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Dp(e.type) || e.tag === 4;
	}
	function zl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Rl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Dp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Bl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = wn)), jl(e, r), N = !0;
		else if (i !== 4 && (i === 27 && (jl(e, r), r = null, Dp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Bl(e, t, n, r), e = e.sibling; e !== null;) Bl(e, t, n, r), e = e.sibling;
	}
	function Vl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), jl(e, r), N = !0;
		else if (i !== 4 && (i === 27 && (jl(e, r), r = null, Dp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Vl(e, t, n, r), e = e.sibling; e !== null;) Vl(e, t, n, r), e = e.sibling;
	}
	function V(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			sp(t, r, n), t[Ot] = e, t[kt] = n;
		} catch (t) {
			K(e, e.return, t);
		}
	}
	var Hl = !1, Ul = null;
	function Wl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Hl = !0);
	}
	var Gl = null;
	function Kl() {
		var e = Gl;
		return Gl = null, e;
	}
	var ql = 0;
	function Jl(e, t, n, r, i) {
		return ql = 0, Yl(e.child, t, n, r, i);
	}
	function Yl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Np(o);
					r.push(s), s.view && (a = !0);
				} else a || Np(o).view && (a = !0);
				Hl = !0, Ap(o, ql === 0 ? t : t + "_" + ql, n), ql++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Yl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Xl(e, t) {
		for (; e !== null;) e.tag === 5 ? jp(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Xl(e.child, t), e = e.sibling;
	}
	function Zl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Zl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = wi(t.default, t.share), t !== "none" && (Jl(e, n, t, null, !1) || Xl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Ql(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = Si(r, n), a = wi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Zl(e) : Jl(e, i, a, null, !1) ? (Zl(e), n.paired || t || Rd(e, r.onEnter)) : Xl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Ql(e, t), e = e.sibling;
		else Zl(e);
	}
	function $l(e) {
		if (Ul !== null && Ul.size !== 0) {
			var t = Ul;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = wi(n.default, n.share);
								if (a !== "none" && (Jl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Rd(e, n.onShare)) : Xl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					$l(e);
				}
				e = e.sibling;
			}
		}
	}
	function eu(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = Si(t, e.stateNode), r = Ul === null ? void 0 : Ul.get(n), i = wi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Jl(e, n, i, null, !1) ? r === void 0 ? Rd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Ul.delete(n), Rd(e, t.onShare)) : Xl(e.child, !1)), Ul !== null && $l(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) eu(e), e = e.sibling;
		else Ul !== null && $l(e);
	}
	function tu(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = Si(t, e.stateNode);
				t = wi(t.default, t.update), e.flags &= -5, t !== "none" && Jl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && tu(e);
			e = e.sibling;
		}
	}
	function nu(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Xl(e.child, !1));
				}
				nu(e);
			}
			e = e.sibling;
		}
	}
	function ru(e) {
		if (e.tag === 30) e.stateNode.paired = null, Xl(e.child, !1), nu(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) ru(e), e = e.sibling;
		else nu(e);
	}
	function iu(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Xl(e.child, !1) : e.subtreeFlags & 33554432 && iu(e), e = e.sibling;
	}
	function au(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && ql < a.length) {
					var l = a[ql], u = Np(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Ap(c, ql === 0 ? n : n + "_" + ql, i), s && e.flags & 4 || (Gl === null && (Gl = []), Gl.push(c, ql === 0 ? r : r + "_" + ql, t.memoizedProps)), ql++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : au(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function ou(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = Si(n, r), a = wi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(Pp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				ql = 0, i = au(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Rd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && ou(e, t);
			e = e.sibling;
		}
	}
	var su = !1, cu = !1, lu = !1, uu = !1, du = typeof WeakSet == "function" ? WeakSet : Set, fu = null, pu = !1, mu = !1, hu = !1, gu = !1;
	function _u(e, t, n) {
		if (e = e.containerInfo, fp = xh, e = Qr(e), $r(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (pp = {
			focusedElem: e,
			selectionRange: r
		}, xh = !1, n = (n & 335544064) === n, fu = t, t = n ? 9270 : 1024; fu !== null;) {
			if (e = fu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && eu(r[a]);
			if (e.alternate === null && e.flags & 2) n && Wl(e), vu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && eu(r), vu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Wl(e), vu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, fu = r) : (n && tu(e), vu(n));
			}
		}
		Ul = null;
	}
	function vu(e) {
		for (; fu !== null;) {
			var t = fu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = Ec(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							K(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) sm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								sm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = Si(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = wi(a.default, a.update), a !== "none" && Jl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, fu = r;
				break;
			}
			fu = t.return;
		}
	}
	function yu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				zu(e, n), r & 4 && Tl(5, n);
				break;
			case 1:
				if (zu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						K(n, n.return, e);
					}
					else {
						var i = Ec(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							K(n, n.return, e);
						}
					}
				}
				r & 64 && Dl(n), r & 512 && kl(n, n.return);
				break;
			case 3:
				if (zu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						ko(e, t);
					} catch (e) {
						K(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && V(n);
			case 26:
			case 5:
				zu(e, n), t === null && r & 4 && Il(n), r & 512 && kl(n, n.return);
				break;
			case 12:
				zu(e, n);
				break;
			case 31:
				zu(e, n), r & 4 && Ou(e, n);
				break;
			case 13:
				zu(e, n), r & 4 && ku(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = Sf.bind(null, n), pm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || su, !r) {
					var a = t !== null && t.memoizedState !== null || cu;
					t = su, i = cu, su = r, (cu = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Vu(e, n, r)) : zu(e, n), su = t, cu = i;
				}
				break;
			case 30:
				zu(e, n), r & 512 && kl(n, n.return);
				break;
			case 7: r & 512 && kl(n, n.return);
			default: zu(e, n);
		}
	}
	function bu(e, t) {
		for (e = e.child; e !== null;) xu(e, t), e = e.sibling;
	}
	function xu(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					K(e, e.return, t);
				}
				Su(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, N = !0;
				} catch (t) {
					K(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? kp(s, !0) : kp(e.stateNode, !1);
				} catch (t) {
					K(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && bu(e, t);
				break;
			default: bu(e, t);
		}
	}
	function Su(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						xu(n, r);
						break a;
					case 22:
						n.memoizedState === null && Su(n, r);
						break a;
					default: Su(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function Cu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, Cu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Lt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var wu = null, Tu = !1;
	function Eu(e, t, n) {
		for (n = n.child; n !== null;) Du(e, t, n), n = n.sibling;
	}
	function Du(e, t, n) {
		if (nt && typeof nt.onCommitFiberUnmount == "function") try {
			nt.onCommitFiberUnmount(tt, n);
		} catch {}
		switch (n.tag) {
			case 26:
				cu || Al(n, t), Eu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !cu && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				cu || Al(n, t), Nl(n);
				var r = wu, i = Tu;
				Dp(n.type) && (wu = n.stateNode, Tu = !1), Eu(e, t, n), xm(n.stateNode, n.type, n.memoizedProps), wu = r, Tu = i;
				break;
			case 5: cu || Al(n, t), Nl(n);
			case 6:
				if (n.tag === 6 && Nl(n), r = wu, i = Tu, wu = null, Eu(e, t, n), wu = r, Tu = i, wu !== null) {
					if (Tu) try {
						(wu.nodeType === 9 ? wu.body : wu.nodeName === "HTML" ? wu.ownerDocument.body : wu).removeChild(n.stateNode), N = !0;
					} catch (e) {
						K(n, t, e);
					}
					else try {
						wu.removeChild(n.stateNode), N = !0;
					} catch (e) {
						K(n, t, e);
					}
				}
				break;
			case 18:
				wu !== null && (Tu ? (e = wu, Op(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Op(wu, n.stateNode));
				break;
			case 4:
				r = wu, i = Tu, wu = n.stateNode.containerInfo, Tu = !0, Eu(e, t, n), wu = r, Tu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				El(2, n, t), cu || El(4, n, t), Eu(e, t, n);
				break;
			case 1:
				cu || (Al(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Ol(n, t, r)), Eu(e, t, n);
				break;
			case 21:
				Eu(e, t, n);
				break;
			case 22:
				cu = (r = cu) || n.memoizedState !== null, Eu(e, t, n), cu = r;
				break;
			case 30:
				Al(n, t), Eu(e, t, n);
				break;
			case 7:
				cu || Al(n, t), Eu(e, t, n);
				break;
			default: Eu(e, t, n);
		}
	}
	function Ou(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				K(t, t.return, e);
			}
		}
	}
	function ku(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			K(t, t.return, e);
		}
	}
	function Au(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new du()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new du()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function ju(e, t) {
		var n = Au(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Cf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Mu(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Dp(l.type)) {
							wu = l.stateNode, Tu = !1;
							break a;
						}
						break;
					case 5:
						wu = l.stateNode, Tu = !1;
						break a;
					case 3:
					case 4:
						wu = l.stateNode.containerInfo, Tu = !0;
						break a;
				}
				l = l.return;
			}
			if (wu === null) throw Error(i(160));
			Du(s, c, o), wu = null, Tu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Pu(t, e, n), t = t.sibling;
	}
	var Nu = null;
	function Pu(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				Mu(t, e, n), Fu(e), a & 4 && (El(3, e, e.return), Tl(3, e), El(5, e, e.return));
				break;
			case 1:
				Mu(t, e, n), Fu(e), a & 512 && (cu || r === null || Al(r, r.return)), a & 64 && su && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Nu, Mu(t, e, n), Fu(e), a & 512 && (cu || r === null || Al(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (su) e.stateNode = _p(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[Ft] || r[Ot] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), sp(r, t, n), r[Ot] = e, Ht(r), t = r;
												break a;
											case "link":
												if (o = Xm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), sp(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Xm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), sp(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[Ot] = e, Ht(r), t = r;
									}
									e.stateNode = t;
								}
							} else su || Zm(o, e.type, e.stateNode);
						} else e.stateNode = Gm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Ll(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || cu || t.parentNode.removeChild(t)) : a.count--, n === null ? su || Zm(o, e.type, e.stateNode) : Gm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Mu(t, e, n), Fu(e), a & 512 && (cu || r === null || Al(r, r.return)), r !== null && a & 4 && Ll(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = lu, lu = !1, Mu(t, e, n), lu = o, Fu(e), a & 512 && (cu || r === null || Al(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						gn(t, ""), N = !0;
					} catch (t) {
						K(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Ll(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (uu = !0);
				break;
			case 6:
				if (Mu(t, e, n), Fu(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, N = !0;
					} catch (t) {
						K(e, e.return, t);
					}
				}
				break;
			case 3:
				if (N = !1, Ym = null, o = Nu, Nu = Tm(t.containerInfo), Mu(t, e, n), Nu = o, Fu(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					K(e, e.return, t);
				}
				uu && (uu = !1, Iu(e)), N = !1;
				break;
			case 4:
				a = lu, lu = su, r = Qt(), o = Nu, Nu = Tm(e.stateNode.containerInfo), Mu(t, e, n), Fu(e), Nu = o, N && mu && (hu = !0), N = r, lu = a;
				break;
			case 12:
				Mu(t, e, n), Fu(e);
				break;
			case 31:
				Mu(t, e, n), Fu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, ju(e, t)));
				break;
			case 13:
				Mu(t, e, n), Fu(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (bd = qe()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, ju(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = su, l = cu, u = lu;
				su = c || o, lu = u || o, cu = l || s, Mu(t, e, n), cu = l, lu = u, su = c, Fu(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || su || cu || (t = s || cu, n = su, r = cu, su = o || su, cu = t, Bu(e, 2), su = n, cu = r), !o && lu || bu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, ju(e, n))));
				break;
			case 19:
				Mu(t, e, n), Fu(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, ju(e, t)));
				break;
			case 30:
				a & 512 && (cu || r === null || Al(r, r.return)), a = Qt(), o = mu, s = (n & 335544064) === n, c = e.memoizedProps, mu = s && wi(c.default, c.update) !== "none", Mu(t, e, n), Fu(e), s && r !== null && N && (e.flags |= 4), mu = o, N = a;
				break;
			case 21: break;
			case 7: a & 512 && (cu || r === null || Al(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Mu(t, e, n), Fu(e);
		}
	}
	function Fu(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Rl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Fl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Pl(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Vl(e, zl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (gn(l, ""), n.flags &= -33), Vl(e, zl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Bl(e, zl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				K(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Iu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Iu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, xh = !0, t.reset(), xh = !1), e = e.sibling;
		}
	}
	function Lu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Ru(t, e), t = t.sibling;
		else ou(t, !1);
	}
	function Ru(e, t) {
		var n = e.alternate;
		if (n === null) Ql(e, !1);
		else switch (e.tag) {
			case 3:
				if (gu = pu = !1, Kl(), Lu(t, e), !pu && !hu) {
					if (e = Gl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						jp(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), gu = !0;
				}
				Gl = null;
				break;
			case 5:
				Lu(t, e);
				break;
			case 4:
				r = pu, pu = !1, Lu(t, e), pu && (hu = !0), pu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Lu(t, e) : Ql(e, !1));
				break;
			case 30:
				r = pu, i = Kl(), pu = !1, Lu(t, e), pu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = Si(a, o), o = Si(n.memoizedProps, o);
				var s = wi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, ql = 0, t = au(e, n, t, o, s, a, !0), ql !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Rd(e, e.memoizedProps.onUpdate), Gl = i) : i !== null && (i.push.apply(i, Gl), Gl = i), pu = e.flags & 32 ? !0 : r;
				break;
			default: Lu(t, e);
		}
	}
	function zu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) yu(e, t.alternate, t), t = t.sibling;
	}
	function Bu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					El(4, n, n.return), Bu(n, r);
					break;
				case 1:
					Al(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && Ol(n, n.return, i), Bu(n, r);
					break;
				case 27: r & 2 && xm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					Al(n, n.return), n.tag !== 5 && n.tag !== 27 || Nl(n), Bu(n, r);
					break;
				case 6:
					Nl(n);
					break;
				case 26:
					Al(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || cu || i.parentNode.removeChild(i), Bu(n, r);
					break;
				case 22:
					n.memoizedState === null && Bu(n, r);
					break;
				case 30:
					Al(n, n.return), Bu(n, r);
					break;
				case 7: Al(n, n.return);
				default: Bu(n, r);
			}
			e = e.sibling;
		}
	}
	function Vu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Vu(i, a, n), Tl(4, a);
					break;
				case 1:
					if (Vu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						K(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) Oo(l[i], c);
						} catch (e) {
							K(r, r.return, e);
						}
					}
					s && o & 64 && Dl(a), kl(a, a.return);
					break;
				case 27: n & 2 && V(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Ml(a), Vu(i, a, n), s && r === null && o & 4 && Il(a), kl(a, a.return);
					break;
				case 6:
					Ml(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || su || Zm(Tm(c.ownerDocument), a.type, c), Vu(i, a, n), s && r === null && o & 4 && Il(a), kl(a, a.return);
					break;
				case 12:
					Vu(i, a, n);
					break;
				case 31:
					Vu(i, a, n), s && o & 4 && Ou(i, a);
					break;
				case 13:
					Vu(i, a, n), s && o & 4 && ku(i, a);
					break;
				case 22:
					a.memoizedState === null && Vu(i, a, n), kl(a, a.return);
					break;
				case 30:
					Vu(i, a, n), kl(a, a.return);
					break;
				case 7: kl(a, a.return);
				default: Vu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Hu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Ra(n));
	}
	function Uu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ra(e));
	}
	function Wu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Gu(e, t, n, r), t = t.sibling;
		else i && iu(t);
	}
	function Gu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && ru(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Wu(e, t, n, r), a & 2048 && Tl(9, t);
				break;
			case 1:
				Wu(e, t, n, r);
				break;
			case 3:
				Wu(e, t, n, r), i && gu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Ra(a)));
				break;
			case 12:
				if (a & 2048) {
					Wu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						K(t, t.return, e);
					}
				} else Wu(e, t, n, r);
				break;
			case 31:
				Wu(e, t, n, r);
				break;
			case 13:
				Wu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && ru(t), o._visibility & 2 ? Wu(e, t, n, r) : (o._visibility |= 2, Ku(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && ru(s), o._visibility & 2 ? Wu(e, t, n, r) : qu(e, t)), a & 2048 && Hu(s, t);
				break;
			case 24:
				Wu(e, t, n, r), a & 2048 && Uu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Xl(a.child, !0), Xl(t.child, !0))), Wu(e, t, n, r);
				break;
			default: Wu(e, t, n, r);
		}
	}
	function Ku(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Ku(a, o, s, c, i), Tl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Ku(a, o, s, c, i)) : u._visibility & 2 ? Ku(a, o, s, c, i) : qu(a, o), i && l & 2048 && Hu(o.alternate, o);
					break;
				case 24:
					Ku(a, o, s, c, i), i && l & 2048 && Uu(o.alternate, o);
					break;
				default: Ku(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function qu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					qu(n, r), i & 2048 && Hu(r.alternate, r);
					break;
				case 24:
					qu(n, r), i & 2048 && Uu(r.alternate, r);
					break;
				default: qu(n, r);
			}
			t = t.sibling;
		}
	}
	var Ju = 8192;
	function Yu(e, t, n) {
		if (e.subtreeFlags & Ju) for (e = e.child; e !== null;) Xu(e, t, n), e = e.sibling;
	}
	function Xu(e, t, n) {
		switch (e.tag) {
			case 26:
				Yu(e, t, n), e.flags & Ju && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && nh(n, e)) : rh(n, Nu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Yu(e, t, n), e.flags & Ju && (e = e.stateNode, (t & 335544128) === t && nh(n, e));
				break;
			case 3:
			case 4:
				var r = Nu;
				Nu = Tm(e.stateNode.containerInfo), Yu(e, t, n), Nu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Ju, Ju = 16777216, Yu(e, t, n), Ju = r) : Yu(e, t, n));
				break;
			case 30:
				if ((e.flags & Ju) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Ul === null && (Ul = /* @__PURE__ */ new Map()), Ul.set(r, i);
				}
				Yu(e, t, n);
				break;
			default: Yu(e, t, n);
		}
	}
	function Zu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Qu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				fu = r, td(r, e);
			}
			Zu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) $u(e), e = e.sibling;
	}
	function $u(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Qu(e), e.flags & 2048 && El(9, e, e.return);
				break;
			case 3:
				Qu(e);
				break;
			case 12:
				Qu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, ed(e)) : Qu(e);
				break;
			default: Qu(e);
		}
	}
	function ed(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				fu = r, td(r, e);
			}
			Zu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					El(8, t, t.return), ed(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, ed(t));
					break;
				default: ed(t);
			}
			e = e.sibling;
		}
	}
	function td(e, t) {
		for (; fu !== null;) {
			var n = fu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					El(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Ra(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, fu = r;
			else a: for (n = e; fu !== null;) {
				r = fu;
				var i = r.sibling, a = r.return;
				if (Cu(r), r === n) {
					fu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, fu = i;
					break a;
				}
				fu = a;
			}
		}
	}
	var nd = {
		getCacheForType: function(e) {
			var t = Aa(Ia), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Aa(Ia).controller.signal;
		}
	}, rd = typeof WeakMap == "function" ? WeakMap : Map, H = 0, id = null, U = null, W = 0, ad = 0, od = null, sd = !1, cd = !1, ld = !1, ud = 0, dd = 0, fd = 0, pd = 0, md = 0, hd = 0, gd = 0, _d = null, vd = null, yd = !1, bd = 0, xd = 0, Sd = Infinity, Cd = null, wd = null, Td = 0, Ed = null, Dd = null, Od = 0, kd = 0, Ad = null, jd = null, Md = null, Nd = null, G = null, Pd = 0, Fd = null;
	function Id() {
		return H & 2 && W !== 0 ? W & -W : k.T === null ? Tt() : zf();
	}
	function Ld() {
		if (hd === 0) {
			if (!(W & 536870912) || F) {
				var e = lt;
				lt <<= 1, !(lt & 3932160) && (lt = 262144), hd = e;
			} else hd = 536870912;
		}
		return e = Fo.current, e !== null && (e.flags |= 32), hd;
	}
	function Rd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = zp(Si(e.memoizedProps, n))), Nd === null && (Nd = []), Nd.push(t.bind(null, r));
		}
	}
	function zd(e, t, n) {
		(e === id && (ad === 2 || ad === 9) || e.cancelPendingCommit !== null) && (Kd(e, 0), Ud(e, W, hd, !1)), vt(e, n), H & 2 && e === id || (e === id && (!(H & 2) && (pd |= n), dd === 4 && Ud(e, W, hd, !1)), jf(e));
	}
	function Bd(e, t, n) {
		if (H & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || pt(e, t), a = r ? ef(e, t) : Qd(e, t, !0), o = r;
		do {
			if (a === 0) {
				cd && !r && Ud(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Hd(n)) a = Qd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = _d;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Kd(c, s).flags |= 256), s = Qd(c, s, !1), s !== 2 && s !== 6) {
								if (ld && !l) {
									c.errorRecoveryDisabledLanes |= o, pd |= o, a = 4;
									break a;
								}
								o = vd, vd = a, o !== null && (vd === null ? vd = o : vd.push.apply(vd, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Kd(e, 0), Ud(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Ud(r, t, hd, !sd);
							break a;
						case 2:
							vd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = bd + 300 - qe(), 10 < a)) {
						if (Ud(r, t, hd, !sd), ft(r, 0, !0) !== 0) break a;
						Od = t, r.timeoutHandle = xp(Vd.bind(null, r, n, vd, Cd, yd, t, hd, pd, gd, sd, o, "Throttled", -0, 0), a);
						break a;
					}
					Vd(r, n, vd, Cd, yd, t, hd, pd, gd, sd, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		jf(e);
	}
	function Vd(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: wn
		}, Ul = null, Xu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = sh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? bd - qe() : (a & 4194048) === a ? xd - qe() : 0, m = ah(d, m), m !== null) ? (Od = a, e.cancelPendingCommit = m(cf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Ud(e, a, o, !l)) : cf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Hd(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Kr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Ud(e, t, n, r) {
		t = mt(e, t), t &= ~md, t &= ~pd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - it(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && bt(e, n, t);
	}
	function Wd() {
		return H & 6 ? !0 : (Mf(0, !1), !1);
	}
	function Gd() {
		if (U !== null) {
			if (ad === 0) var e = U.return;
			else e = U, Sa = xa = null, ls(e), lo = null, uo = 0, e = U;
			for (; e !== null;) wl(e.alternate, e), e = e.return;
			U = null;
		}
	}
	function Kd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, Sp(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Od = 0, Gd(), id = e, U = n = zi(e.current, null), W = t, ad = 0, od = null, sd = !1, cd = pt(e, t), ld = !1, gd = hd = md = pd = fd = dd = 0, vd = _d = null, yd = !1, ud = mt(e, t), ki(), n;
	}
	function qd(e, t) {
		L = null, k.H = vc, t === $a || t === to ? (t = so(), ad = 3) : t === eo ? (t = so(), ad = 4) : ad = t === Ic ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, od = t, U === null && (dd = 1, Ac(e, qi(t, e.current)));
	}
	function Jd() {
		var e = Fo.current;
		return e === null ? !0 : (W & 4194048) === W ? Io === null : (W & 62914560) === W || W & 536870912 ? e === Io : !1;
	}
	function Yd() {
		var e = k.H;
		return k.H = vc, e === null ? vc : e;
	}
	function Xd() {
		var e = k.A;
		return k.A = nd, e;
	}
	function Zd() {
		dd = 4, sd || (W & 4194048) !== W && Fo.current !== null || (cd = !0), !(fd & 134217727) && !(pd & 134217727) || id === null || Ud(id, W, hd, !1);
	}
	function Qd(e, t, n) {
		var r = H;
		H |= 2;
		var i = Yd(), a = Xd();
		(id !== e || W !== t) && (Cd = null, Kd(e, t)), t = !1;
		var o = dd;
		a: do
			try {
				if (ad !== 0 && U !== null) {
					var s = U, c = od;
					switch (ad) {
						case 8:
							Gd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Fo.current === null && (t = !0);
							var l = ad;
							if (ad = 0, od = null, af(e, s, c, l), n && cd) {
								o = 0;
								break a;
							}
							break;
						default: l = ad, ad = 0, od = null, af(e, s, c, l);
					}
				}
				$d(), o = dd;
				break;
			} catch (t) {
				qd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, Sa = xa = null, H = r, k.H = i, k.A = a, U === null && (id = null, W = 0, ki()), o;
	}
	function $d() {
		for (; U !== null;) nf(U);
	}
	function ef(e, t) {
		var n = H;
		H |= 2;
		var r = Yd(), a = Xd();
		id !== e || W !== t ? (Cd = null, Sd = qe() + 500, Kd(e, t)) : cd = pt(e, t);
		a: do
			try {
				if (ad !== 0 && U !== null) {
					t = U;
					var o = od;
					b: switch (ad) {
						case 1:
							ad = 0, od = null, af(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (ro(o)) {
								ad = 0, od = null, rf(t);
								break;
							}
							t = function() {
								ad !== 2 && ad !== 9 || id !== e || (ad = 7), jf(e);
							}, o.then(t, t);
							break a;
						case 3:
							ad = 7;
							break a;
						case 4:
							ad = 5;
							break a;
						case 7:
							ro(o) ? (ad = 0, od = null, rf(t)) : (ad = 0, od = null, af(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (U.tag) {
								case 26: s = U.memoizedState;
								case 5:
								case 27:
									var c = U;
									if (s ? eh(s) : c.stateNode.complete) {
										ad = 0, od = null;
										var l = c.sibling;
										if (l !== null) U = l;
										else {
											var u = c.return;
											u === null ? U = null : (U = u, of(u));
										}
										break b;
									}
							}
							ad = 0, od = null, af(e, t, o, 5);
							break;
						case 6:
							ad = 0, od = null, af(e, t, o, 6);
							break;
						case 8:
							Gd(), dd = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				tf();
				break;
			} catch (t) {
				qd(e, t);
			}
		while (1);
		return Sa = xa = null, k.H = r, k.A = a, H = n, U === null ? (id = null, W = 0, ki(), dd) : 0;
	}
	function tf() {
		for (; U !== null && !Ke();) nf(U);
	}
	function nf(e) {
		var t = hl(e.alternate, e, ud);
		e.memoizedProps = e.pendingProps, t === null ? of(e) : U = t;
	}
	function rf(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Xc(n, t, t.pendingProps, t.type, void 0, W);
				break;
			case 11:
				t = Xc(n, t, t.pendingProps, t.type.render, t.ref, W);
				break;
			case 5:
				ls(t);
				var r = t;
				r === ca && (F ? (ha(r), r.tag === 5 && r.stateNode != null && (la = r.stateNode)) : (ha(r), F = !0));
			default: wl(n, t), t = U = Bi(t, ud), t = hl(n, t, ud);
		}
		e.memoizedProps = e.pendingProps, t === null ? of(e) : U = t;
	}
	function af(e, t, n, r) {
		Sa = xa = null, ls(t), lo = null, uo = 0;
		var i = t.return;
		try {
			if (Fc(e, i, t, n, W)) {
				dd = 1, Ac(e, qi(n, e.current)), U = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw U = i, t;
			dd = 1, Ac(e, qi(n, e.current)), U = null;
			return;
		}
		t.flags & 32768 ? (F || r === 1 ? e = !0 : cd || W & 536870912 ? e = !1 : (sd = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Fo.current, r !== null && r.tag === 13 && (r.flags |= 16384))), sf(t, e)) : of(t);
	}
	function of(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				sf(t, sd);
				return;
			}
			e = t.return;
			var n = Sl(t.alternate, t, ud);
			if (n !== null) {
				U = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				U = t;
				return;
			}
			U = t = e;
		} while (t !== null);
		dd === 0 && (dd = 5);
	}
	function sf(e, t) {
		do {
			var n = Cl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, U = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				U = e;
				return;
			}
			U = e = n;
		} while (e !== null);
		dd = 6, U = null;
	}
	function cf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			gf();
		while (Td !== 0);
		if (H & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === id && (U = id = null, W = 0), Dd = t, Ed = e, Od = n, Ad = a, jd = r, lf(e, t, n, s, c, l, f);
		}
	}
	function lf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (kd = s, s |= Oi, yt(e, n, s, r, i, a), Nd = null, (n & 335544064) === n ? (G = Va(e), r = 10262) : (G = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, wf(Ze, function() {
			return _f(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Hl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = k.T, k.T = null, i = A.p, A.p = 2, a = H, H |= 4;
			try {
				_u(e, t, n);
			} finally {
				H = a, A.p = i, k.T = r;
			}
		}
		Td = 1, Hl ? Md = Lp(o, e.containerInfo, G, ff, pf, df, mf, _f, uf, null, null) : (ff(), pf(), mf());
	}
	function uf(e) {
		if (Td !== 0) {
			var t = Ed.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function df() {
		Td === 3 && (Td = 0, Ru(Dd, Ed), Td = 4);
	}
	function ff() {
		if (Td === 1) {
			Td = 0;
			var e = Ed, t = Dd, n = Od, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = k.T, k.T = null;
				var i = A.p;
				A.p = 2;
				var a = H;
				H |= 4;
				try {
					mu = hu = !1, Pu(t, e, n), n = pp;
					var o = Qr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Zr(s.ownerDocument.documentElement, s)) {
						if (c !== null && $r(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Xr(s, h), v = Xr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					xh = !!fp, pp = fp = null;
				} finally {
					H = a, A.p = i, k.T = r;
				}
			}
			e.current = t, Td = 2;
		}
	}
	function pf() {
		if (Td === 2) {
			Td = 0;
			var e = Ed, t = Dd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = k.T, k.T = null;
				var r = A.p;
				A.p = 2;
				var i = H;
				H |= 4;
				try {
					yu(e, t.alternate, t);
				} finally {
					H = i, A.p = r, k.T = n;
				}
			}
			Td = 3;
		}
	}
	function mf() {
		if (Td === 4 || Td === 3) {
			Td = 0;
			var e = Md;
			Md = null, j();
			var t = Ed, n = Dd, r = Od, i = jd, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? Td = 5 : (Td = 0, Dd = Ed = null, hf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (wd = null), wt(r), n = n.stateNode, nt && typeof nt.onCommitFiberRoot == "function") try {
				nt.onCommitFiberRoot(tt, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = k.T, a = A.p, A.p = 2, k.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					k.T = n, A.p = a;
				}
			}
			if (i = Nd, o = G, G = null, i !== null && (Nd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Od & 3 && gf(), jf(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Fd ? Pd++ : (Pd = 0, Fd = t) : (Pd = 0, Fd = null), Mf(0, !1);
		}
	}
	function hf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ra(t)));
	}
	function gf() {
		return Md !== null && (Md.skipTransition(), Md = null), ff(), pf(), mf(), _f();
	}
	function _f() {
		if (Td !== 5) return !1;
		var e = Ed, t = kd;
		kd = 0;
		var n = wt(Od), r = k.T, a = A.p;
		try {
			A.p = 32 > n ? 32 : n, k.T = null, n = Ad, Ad = null;
			var o = Ed, s = Od;
			if (Td = 0, Dd = Ed = null, Od = 0, H & 6) throw Error(i(331));
			var c = H;
			if (H |= 4, $u(o.current), Gu(o, o.current, s, n), H = c, Mf(0, !1), nt && typeof nt.onPostCommitFiberRoot == "function") try {
				nt.onPostCommitFiberRoot(tt, o);
			} catch {}
			return !0;
		} finally {
			A.p = a, k.T = r, hf(e, t);
		}
	}
	function vf(e, t, n) {
		t = qi(n, t), t = Mc(e.stateNode, t, 2), e = So(e, t, 2), e !== null && (vt(e, 2), jf(e));
	}
	function K(e, t, n) {
		if (e.tag === 3) vf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				vf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (wd === null || !wd.has(r))) {
					e = qi(n, e), n = Nc(2), r = So(t, n, 2), r !== null && (Pc(n, r, t, e), vt(r, 2), jf(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function yf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new rd();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (ld = !0, i.add(n), e = bf.bind(null, e, t, n), t.then(e, e));
	}
	function bf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, id === e && (W & n) === n && (dd === 4 || dd === 3 && (W & 62914560) === W && 300 > qe() - bd ? H & 2 ? md |= n : Kd(e, 0) : md |= n, gd === W && (gd = 0)), jf(e);
	}
	function xf(e, t) {
		t === 0 && (t = gt()), e = Mi(e, t), e !== null && (vt(e, t), jf(e));
	}
	function Sf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), xf(e, n);
	}
	function Cf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), xf(e, n);
	}
	function wf(e, t) {
		return We(e, t);
	}
	var Tf = null, Ef = null, Df = !1, Of = !1, kf = !1, Af = 0;
	function jf(e) {
		e !== Ef && e.next === null && (Ef === null ? Tf = Ef = e : Ef = Ef.next = e), Of = !0, Df || (Df = !0, Rf());
	}
	function Mf(e, t) {
		if (!kf && Of) {
			kf = !0;
			do
				for (var n = !1, r = Tf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - it(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Lf(r, a));
						} else a = W, a = ft(r, r === id ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || pt(r, a) || (n = !0, Lf(r, a));
					}
					r = r.next;
				}
			while (n);
			kf = !1;
		}
	}
	function Nf() {
		Pf();
	}
	function Pf() {
		Of = Df = !1;
		var e = 0;
		Af !== 0 && bp() && (e = Af);
		for (var t = qe(), n = null, r = Tf; r !== null;) {
			var i = r.next, a = Ff(r, t);
			a === 0 ? (r.next = null, n === null ? Tf = i : n.next = i, i === null && (Ef = n)) : (n = r, (e !== 0 || a & 3) && (Of = !0)), r = i;
		}
		Td !== 0 && Td !== 5 || Mf(e, !1), Af !== 0 && (Af = 0);
	}
	function Ff(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - it(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = ht(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = id, n = W, n = ft(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (ad === 2 || ad === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ge(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || pt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ge(r), wt(n)) {
				case 2:
				case 8:
					n = Xe;
					break;
				case 32:
					n = Ze;
					break;
				case 268435456:
					n = $e;
					break;
				default: n = Ze;
			}
			return r = If.bind(null, e), n = We(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ge(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function If(e, t) {
		if (Td !== 0 && Td !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (gf() && e.callbackNode !== n) return null;
		var r = W;
		return r = ft(e, e === id ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Bd(e, r, t), Ff(e, qe()), e.callbackNode != null && e.callbackNode === n ? If.bind(null, e) : null);
	}
	function Lf(e, t) {
		if (gf()) return null;
		Bd(e, t, !0);
	}
	function Rf() {
		Tp(function() {
			H & 6 ? We(Ye, Nf) : Pf();
		});
	}
	function zf() {
		if (Af === 0) {
			var e = I;
			e === 0 && (e = ct, ct <<= 1, !(ct & 261888) && (ct = 256)), Af = e;
		}
		return Af;
	}
	function Bf(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Cn(e);
	}
	function Vf(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Bf((i[kt] || null).action), o = r.submitter;
			o && (t = (t = o[kt] || null) ? Bf(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Wn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Af !== 0) {
								var e = new FormData(i, o);
								ac(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), ac(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Hf = 0; Hf < yi.length; Hf++) {
		var Uf = yi[Hf];
		bi(Uf.toLowerCase(), "on" + (Uf[0].toUpperCase() + Uf.slice(1)));
	}
	bi(di, "onAnimationEnd"), bi(fi, "onAnimationIteration"), bi(pi, "onAnimationStart"), bi("dblclick", "onDoubleClick"), bi("focusin", "onFocus"), bi("focusout", "onBlur"), bi(mi, "onTransitionRun"), bi(hi, "onTransitionStart"), bi(gi, "onTransitionCancel"), bi(_i, "onTransitionEnd"), qt("onMouseEnter", ["mouseout", "mouseover"]), qt("onMouseLeave", ["mouseout", "mouseover"]), qt("onPointerEnter", ["pointerout", "pointerover"]), qt("onPointerLeave", ["pointerout", "pointerover"]), Kt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Kt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Kt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Kt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Kt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Kt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Wf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Gf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Wf));
	function Kf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Ti(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Ti(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function q(e, t) {
		var n = t[jt];
		n === void 0 && (n = t[jt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Xf(t, e, 2, !1), n.add(r));
	}
	function qf(e, t, n) {
		var r = 0;
		t && (r |= 4), Xf(n, e, r, t);
	}
	var Jf = "_reactListening" + Math.random().toString(36).slice(2);
	function Yf(e) {
		if (!e[Jf]) {
			e[Jf] = !0, Wt.forEach(function(t) {
				t !== "selectionchange" && (Gf.has(t) || qf(t, !1, e), qf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Jf] || (t[Jf] = !0, qf("selectionchange", !1, t));
		}
	}
	function Xf(e, t, n, r) {
		switch (Z(t)) {
			case 2:
				var i = Sh;
				break;
			case 8:
				i = Y;
				break;
			default: i = Ch;
		}
		n = i.bind(null, t, n, e), i = void 0, !Pn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Zf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = Rt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		jn(function() {
			var r = a, i = En(n), s = [];
			a: {
				var c = vi.get(e);
				if (c !== void 0) {
					var l = Wn, u = e;
					switch (e) {
						case "keypress": if (zn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = cr;
							break;
						case "focusin":
							u = "focus", l = $n;
							break;
						case "focusout":
							u = "blur", l = $n;
							break;
						case "beforeblur":
						case "afterblur":
							l = $n;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Zn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Qn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = dr;
							break;
						case di:
						case fi:
						case pi:
							l = er;
							break;
						case _i:
							l = fr;
							break;
						case "scroll":
						case "scrollend":
							l = Kn;
							break;
						case "wheel":
							l = pr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = tr;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = lr;
							break;
						case "submit":
							l = ur;
							break;
						case "toggle":
						case "beforetoggle": l = mr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = Mn(m, p), g != null && d.push(Qf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== Tn && (u = n.relatedTarget || n.fromElement) && (Rt(u) || u[At])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Rt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Zn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = lr, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Bt(c), h = l == null ? u : Bt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Rt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? E(c, l, ep) : null, c !== null && J(s, u, c, d, !1), l !== null && f !== null && J(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Bt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Pr;
					else if (Or(c)) {
						if (Fr) _ = Wr;
						else {
							_ = Hr;
							var v = Vr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && bn(r.elementType) && (_ = Pr) : _ = Ur;
					if (_ &&= _(e, r)) {
						kr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Bt(r) : window, e) {
					case "focusin":
						(Or(v) || v.contentEditable === "true") && (ti = v, ni = r, ri = null);
						break;
					case "focusout":
						ri = ni = ti = null;
						break;
					case "mousedown":
						ii = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						ii = !1, ai(s, n, i);
						break;
					case "selectionchange": if (ei) break;
					case "keydown":
					case "keyup": ai(s, n, i);
				}
				var y;
				if (gr) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else wr ? Sr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (yr && n.locale !== "ko" && (wr || b !== "onCompositionStart" ? b === "onCompositionEnd" && wr && (y = Rn()) : (P = i, In = "value" in P ? P.value : P.textContent, wr = !0)), v = $f(r, b), 0 < v.length && (b = new nr(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = Cr(n), y !== null && (b.data = y)))), (y = vr ? Tr(e, n) : Er(e, n)) && (b = $f(r, "onBeforeInput"), 0 < b.length && (v = new nr("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), Vf(s, e, r, n, i);
			}
			Kf(s, t);
		});
	}
	function Qf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function $f(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = Mn(e, n), i != null && r.unshift(Qf(e, i, a)), i = Mn(e, t), i != null && r.push(Qf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function ep(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function J(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = Mn(n, a), l != null && o.unshift(Qf(n, l, c))) : i || (l = Mn(n, a), l != null && o.push(Qf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var tp = /\r\n?/g, np = /\u0000|\uFFFD/g;
	function rp(e) {
		return (typeof e == "string" ? e : "" + e).replace(tp, "\n").replace(np, "");
	}
	function ip(e, t) {
		return t = rp(t), rp(e) === t;
	}
	function ap(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || gn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && gn(e, "" + r);
				else return;
				break;
			case "className":
				en(e, "class", r);
				break;
			case "tabIndex":
				en(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				en(e, n, r);
				break;
			case "style":
				yn(e, r, o);
				return;
			case "data": if (t !== "object") {
				en(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = Cn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && ap(e, t, "name", a.name, a, null), ap(e, t, "formEncType", a.formEncType, a, null), ap(e, t, "formMethod", a.formMethod, a, null), ap(e, t, "formTarget", a.formTarget, a, null)) : (ap(e, t, "encType", a.encType, a, null), ap(e, t, "method", a.method, a, null), ap(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = Cn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = wn);
				return;
			case "onScroll":
				r != null && q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && q("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = Cn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				q("beforetoggle", e), q("toggle", e), $t(e, "popover", r);
				break;
			case "xlinkActuate":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				tn(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				tn(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				tn(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				tn(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				$t(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = xn.get(n) || n, $t(e, n, r);
			else return;
		}
		N = !0;
	}
	function op(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				yn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") gn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") gn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && q("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = wn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Gt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[kt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					N = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : $t(e, n, r);
				}
				return;
		}
		N = !0;
	}
	function sp(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				q("error", e), q("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: ap(e, t, o, s, n, null);
					}
				}
				a && ap(e, t, "srcSet", n.srcSet, n, null), r && ap(e, t, "src", n.src, n, null);
				return;
			case "input":
				q("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: ap(e, t, r, d, n, null);
					}
				}
				dn(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in q("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: ap(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && pn(e, !!r, n, !0) : pn(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in q("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: ap(e, t, s, c, n, null);
				}
				hn(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: ap(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				q("beforetoggle", e), q("toggle", e), q("cancel", e), q("close", e);
				break;
			case "iframe":
			case "object":
				q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Wf.length; r++) q(Wf[r], e);
				break;
			case "image":
				q("error", e), q("load", e);
				break;
			case "details":
				q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": q("error", e), q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: ap(e, t, u, r, n, null);
				}
				return;
			default: if (bn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && op(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && ap(e, t, c, r, n, null));
	}
	var cp = {};
	function lp(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || ap(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (N = !0), o = m;
							break;
						case "name":
							m !== f && (N = !0), a = m;
							break;
						case "checked":
							m !== f && (N = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (N = !0), d = m;
							break;
						case "value":
							m !== f && (N = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (N = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && ap(e, t, p, m, r, f);
					}
				}
				un(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || ap(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (N = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (N = !0), c = o;
						break;
					case "multiple": o !== l && (N = !0), s = o;
					default: o !== l && ap(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? pn(e, !!n, n ? [] : "", !1) : pn(e, !!n, t, !0)) : pn(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: ap(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (N = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (N = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && ap(e, t, s, a, r, o);
				}
				mn(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: ap(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (N = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: ap(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && ap(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: ap(e, t, u, p, r, m);
				}
				return;
			default: if (bn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && op(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || op(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && ap(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || ap(e, t, f, p, r, m);
	}
	function up(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function dp() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && up(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && up(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var fp = null, pp = null;
	function mp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function hp(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function gp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function _p(e, t, n, r) {
		return n = mp(n).createElement(e), n[Ot] = r, n[kt] = t, sp(n, e, t), Ht(n), n;
	}
	function vp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var yp = null;
	function bp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== yp && (yp = e, !0) : (yp = null, !1);
	}
	var xp = typeof setTimeout == "function" ? setTimeout : void 0, Sp = typeof clearTimeout == "function" ? clearTimeout : void 0, Cp = typeof Promise == "function" ? Promise : void 0, wp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : xp, Tp = typeof queueMicrotask == "function" ? queueMicrotask : Cp === void 0 ? xp : function(e) {
		return Cp.resolve(null).then(e).catch(Ep);
	};
	function Ep(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Dp(e) {
		return e === "head";
	}
	function Op(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Hh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") Sm(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, Sm(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[Ft] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && Sm(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Hh(t);
	}
	function kp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Ap(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function jp(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Mp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Np(e) {
		return Mp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function Pp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Mp(t, n, e);
	}
	function Fp(e) {
		return e.documentElement.clientHeight;
	}
	function Ip(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Lp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Fp(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += th(f), u > ih) {
									s.length = o;
									break;
								}
								f = new Promise(Ip.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Rp(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Rp.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : D({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Rp.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Rp.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function zp(e) {
		return {
			name: e,
			group: new Rp("group", e),
			imagePair: new Rp("image-pair", e),
			old: new Rp("old", e),
			new: new Rp("new", e)
		};
	}
	function Bp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Bp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Gp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Up(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Vp, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Vp(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Bp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Gp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Up(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, Hp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Hp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Up(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function Wp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Gp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = Wp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && Wp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Bp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Up(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Up(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Bp.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Kp, e, void 0, void 0);
	};
	function Kp(e, t) {
		return e.tag !== 6 && (e = b(e), vm(e, t));
	}
	Bp.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, qp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Kp(t[n], e); n--);
	};
	function qp(e, t) {
		return t.push(e), !1;
	}
	Bp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = mp(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Jp, e, void 0, void 0));
	};
	function Jp(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Bp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Yp, e, void 0, void 0);
	};
	function Yp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Bp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, Xp, e, void 0, void 0);
			for (var n = t = 0; n < Zp.length; n++) {
				var r = Zp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Zp[t++] = r;
			}
			Zp.length = t;
		}
	};
	function Xp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var Zp = [], Qp = !1;
	function $p(e, t, n) {
		Zp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), Qp || (Qp = !0, ym(function() {
			Qp = !1;
			var e = Zp;
			Zp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Bp.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, em, e, void 0, void 0), e;
	};
	function em(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Bp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Bp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, qp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || tm(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function tm(e, t, n, r, i) {
		var a = Rt(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = E(n, a, T), t === null ? t = !1 : (h(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = E(r, a, T), t === null ? t = !1 : (h(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
	}
	function nm(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Bp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		h(this._fragmentFiber.child, !1, qp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), nm(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), nm(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function rm(e, t) {
		return e = b(e), im(e, t), !1;
	}
	function im(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function am(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Up(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Zp.length; i++) {
				var a = Zp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Zp[r++] = a);
			}
			Zp.length = r, n.observe(e);
		}), im(e, t));
	}
	function om(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Up(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? $p(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function sm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					sm(n), Lt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function cm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[Ft]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = mm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function lm(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = mm(e.nextSibling), e === null)) return null;
		return e;
	}
	function um(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = mm(e.nextSibling), e === null)) return null;
		return e;
	}
	function dm(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function fm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function pm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function mm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var hm = null;
	function gm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return mm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function _m(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function vm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function ym(e) {
		wp(function() {
			wp(function(t) {
				return e(t);
			});
		});
	}
	function bm(e, t, n) {
		switch (t = mp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function xm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && ap(e, t, r, null, cp, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === wn && (e.onclick = null), Lt(e);
	}
	function Sm(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Lt(e);
	}
	var Cm = /* @__PURE__ */ new Map(), wm = /* @__PURE__ */ new Set();
	function Tm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var Em = A.d;
	A.d = {
		f: Dm,
		r: Om,
		D: jm,
		C: Mm,
		L: Nm,
		m: Pm,
		X: Im,
		S: Fm,
		M: Lm
	};
	function Dm() {
		var e = Em.f(), t = Wd();
		return e || t;
	}
	function Om(e) {
		var t = zt(e);
		t !== null && t.tag === 5 && t.type === "form" ? sc(t) : Em.r(e);
	}
	var km = typeof document > "u" ? null : document;
	function Am(e, t, n) {
		var r = km;
		if (r && typeof t == "string" && t) {
			var i = ln(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), wm.has(i) || (wm.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), sp(t, "link", e), Ht(t), r.head.appendChild(t)));
		}
	}
	function jm(e) {
		Em.D(e), Am("dns-prefetch", e, null);
	}
	function Mm(e, t) {
		Em.C(e, t), Am("preconnect", e, t);
	}
	function Nm(e, t, n) {
		Em.L(e, t, n);
		var r = km;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + ln(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + ln(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + ln(n.imageSizes) + "\"]")) : i += "[href=\"" + ln(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = zm(e);
					break;
				case "script": a = Um(e);
			}
			if (!(Cm.has(a) || (e = D({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), Cm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Bm(a)) || t === "script" && r.querySelector(Wm(a))))) {
				var o = r.createElement("link");
				sp(o, "link", e), t === "style" && (o[It] = !0, o.onload = o.onerror = function() {
					Ut(o);
				}), Ht(o), r.head.appendChild(o);
			}
		}
	}
	function Pm(e, t) {
		Em.m(e, t);
		var n = km;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + ln(r) + "\"][href=\"" + ln(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Um(e);
			}
			if (!Cm.has(a) && (e = D({
				rel: "modulepreload",
				href: e
			}, t), Cm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Wm(a))) return;
				}
				r = n.createElement("link"), sp(r, "link", e), Ht(r), n.head.appendChild(r);
			}
		}
	}
	function Fm(e, t, n) {
		Em.S(e, t, n);
		var r = km;
		if (r && e) {
			var i = Vt(r).hoistableStyles, a = zm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Bm(a))) s.loading = 5;
				else {
					e = D({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = Cm.get(a)) && qm(e, n);
					var c = o = r.createElement("link");
					Ht(c), sp(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Km(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Im(e, t) {
		Em.X(e, t);
		var n = km;
		if (n && e) {
			var r = Vt(n).hoistableScripts, i = Um(e), a = r.get(i);
			a || (a = n.querySelector(Wm(i)), a || (e = D({
				src: e,
				async: !0
			}, t), (t = Cm.get(i)) && Jm(e, t), a = n.createElement("script"), Ht(a), sp(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Lm(e, t) {
		Em.M(e, t);
		var n = km;
		if (n && e) {
			var r = Vt(n).hoistableScripts, i = Um(e), a = r.get(i);
			a || (a = n.querySelector(Wm(i)), a || (e = D({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = Cm.get(i)) && Jm(e, t), a = n.createElement("script"), Ht(a), sp(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Rm(e, t, n, r) {
		var a = (a = Ae.current) ? Tm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = zm(n.href), t = Vt(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = zm(n.href);
					var o = Vt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Bm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = Cm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, Cm.set(e, o)), Hm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Um(n), t = Vt(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function zm(e) {
		return "href=\"" + ln(e) + "\"";
	}
	function Bm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Vm(e) {
		return D({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Hm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[It]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[It] = !0, t.onload = t.onerror = Ut.bind(null, t), sp(t, "link", n), Ht(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Um(e) {
		return "[src=\"" + ln(e) + "\"]";
	}
	function Wm(e) {
		return "script[async]" + e;
	}
	function Gm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + ln(n.href) + "\"]");
				if (r) return t.instance = r, Ht(r), r;
				var a = D({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Ht(r), sp(r, "style", a), Km(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = zm(n.href);
				var o = e.querySelector(Bm(a));
				if (o) return t.state.loading |= 4, t.instance = o, Ht(o), o;
				r = Vm(n), (a = Cm.get(a)) && qm(r, a), o = (e.ownerDocument || e).createElement("link"), Ht(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), sp(o, "link", r), t.state.loading |= 4, Km(o, n.precedence, e), t.instance = o;
			case "script": return o = Um(n.src), (a = e.querySelector(Wm(o))) ? (t.instance = a, Ht(a), a) : (r = n, (a = Cm.get(o)) && (r = D({}, n), Jm(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Ht(a), sp(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Km(r, n.precedence, e));
		return t.instance;
	}
	function Km(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function qm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Jm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Ym = null;
	function Xm(e, t, n) {
		if (Ym === null) {
			var r = /* @__PURE__ */ new Map(), i = Ym = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Ym, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[Ft] || a[Ot] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Zm(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Qm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function $m(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function eh(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function th(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function nh(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += th(t), e.suspenseyImages.push(t)), e = ch.bind(e), t.decode().then(e, e));
	}
	function rh(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = zm(r.href), a = t.querySelector(Bm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = sh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Ht(a);
					return;
				}
				a = t.ownerDocument || t, r = Vm(r), (i = Cm.get(i)) && qm(r, i), a = a.createElement("link"), Ht(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), sp(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = sh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var ih = 0;
	function ah(e, t) {
		return e.stylesheets && e.count === 0 && uh(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && uh(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && ih === 0 && (ih = 62500 * dp());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && uh(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > ih ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function oh(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) uh(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function sh() {
		this.count--, oh(this);
	}
	function ch() {
		this.imgCount--, oh(this);
	}
	var lh = null;
	function uh(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, lh = /* @__PURE__ */ new Map(), t.forEach(dh, e), lh = null, sh.call(e));
	}
	function dh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = lh.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), lh.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = sh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var fh = {
		$$typeof: se,
		Provider: null,
		Consumer: null,
		_currentValue: Se,
		_currentValue2: Se,
		_threadCount: 0
	};
	function ph(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = _t(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = _t(0), this.hiddenUpdates = _t(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function mh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ph(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Li(3, null, null, t), e.current = a, a.stateNode = e, t = La(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, yo(a), e;
	}
	function hh(e) {
		return e ? (e = Fi, e) : Fi;
	}
	function gh(e, t, n, r, i, a) {
		i = hh(i), r.context === null ? r.context = i : r.pendingContext = i, r = xo(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = So(e, r, t), n !== null && (zd(n, e, t), Co(n, e, t));
	}
	function _h(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function vh(e, t) {
		_h(e, t), (e = e.alternate) && _h(e, t);
	}
	function yh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Mi(e, 67108864);
			t !== null && zd(t, e, 67108864), vh(e, 67108864);
		}
	}
	function bh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Id();
			t = Ct(t);
			var n = Mi(e, t);
			n !== null && zd(n, e, t), vh(e, t);
		}
	}
	var xh = !0;
	function Sh(e, t, n, r) {
		var i = k.T;
		k.T = null;
		var a = A.p;
		try {
			A.p = 2, Ch(e, t, n, r);
		} finally {
			A.p = a, k.T = i;
		}
	}
	function Y(e, t, n, r) {
		var i = k.T;
		k.T = null;
		var a = A.p;
		try {
			A.p = 8, Ch(e, t, n, r);
		} finally {
			A.p = a, k.T = i;
		}
	}
	function Ch(e, t, n, r) {
		if (xh) {
			var i = X(r);
			if (i === null) Zf(e, t, r, wh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = zt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = dt(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - it(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									jf(a), !(H & 6) && (Sd = qe() + 500, Mf(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Mi(a, 2), s !== null && zd(s, a, 2), Wd(), vh(a, 2);
					}
					if (a = X(r), a === null && Zf(e, t, r, wh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Zf(e, t, r, null, n);
		}
	}
	function X(e) {
		return e = En(e), Th(e);
	}
	var wh = null;
	function Th(e) {
		if (wh = null, e = Rt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return wh = e, null;
	}
	function Z(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Je()) {
				case Ye: return 2;
				case Xe: return 8;
				case Ze:
				case Qe: return 32;
				case $e: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var Eh = !1, Q = null, $ = null, Dh = null, Oh = /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ new Map(), Ah = [], jh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Mh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Q = null;
				break;
			case "dragenter":
			case "dragleave":
				$ = null;
				break;
			case "mouseover":
			case "mouseout":
				Dh = null;
				break;
			case "pointerover":
			case "pointerout":
				Oh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": kh.delete(t.pointerId);
		}
	}
	function Nh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = zt(t), t !== null && yh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ph(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Q = Nh(Q, e, t, n, r, i), !0;
			case "dragenter": return $ = Nh($, e, t, n, r, i), !0;
			case "mouseover": return Dh = Nh(Dh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Fh(e) {
		var t = Rt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, Et(e.priority, function() {
							bh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, Et(e.priority, function() {
							bh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ih(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = X(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				Tn = r, n.target.dispatchEvent(r), Tn = null;
			} else return t = zt(n), t !== null && yh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Lh(e, t, n) {
		Ih(e) && n.delete(t);
	}
	function Rh() {
		Eh = !1, Q !== null && Ih(Q) && (Q = null), $ !== null && Ih($) && ($ = null), Dh !== null && Ih(Dh) && (Dh = null), Oh.forEach(Lh), kh.forEach(Lh);
	}
	function zh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, Eh || (Eh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
	}
	var Bh = null;
	function Vh(e) {
		Bh !== e && (Bh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Bh === e && (Bh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Th(r || n) === null) continue;
					break;
				}
				var a = zt(n);
				a !== null && (e.splice(t, 3), t -= 3, ac(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Hh(e) {
		function t(t) {
			return zh(t, e);
		}
		Q !== null && zh(Q, e), $ !== null && zh($, e), Dh !== null && zh(Dh, e), Oh.forEach(t), kh.forEach(t);
		for (var n = 0; n < Ah.length; n++) {
			var r = Ah[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Ah.length && (n = Ah[0], n.blockedOn === null);) Fh(n), n.blockedOn === null && Ah.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[kt] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[kt] || null) s = o.formAction;
					else if (Th(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Vh(n);
			}
		}
	}
	function Uh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Wh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.render = Wh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		gh(n, Id(), e, t, null, null);
	}, Gh.prototype.unmount = Wh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			gh(e.current, 2, null, e, null, null), Wd(), t[At] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = Tt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
			Ah.splice(n, 0, e), n === 0 && Fh(e);
		}
	};
	var Kh = n.version;
	if (Kh !== "19.3.1") throw Error(i(527, Kh, "19.3.1"));
	A.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: k,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			tt = Jh.inject(qh), nt = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Dc, s = Oc, c = kc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = mh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[At] = t.current, Yf(e), new Wh(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
}));
// node_modules/zod/v4/core/util.js
function _(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function v(e, t = "|") {
	return e.map((e) => he(e)).join(t);
}
function y(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
var b = class {
	constructor(e) {
		this._getter = e, this._value = void 0;
	}
	get value() {
		let e = this._getter;
		return e !== void 0 && (this._value = e(), this._getter = void 0), this._value;
	}
};
function x(e) {
	return new b(e);
}
function S(e) {
	return e == null;
}
function C(e) {
	let t = +!!e.startsWith("^"), n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function w(e, t) {
	let n = e / t, r = Math.round(n), i = 4 * 2 ** -52 * Math.max(Math.abs(n), 1);
	return Math.abs(n - r) < i ? 0 : n - r;
}
function T(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function E(e) {
	let t = Object.getOwnPropertyDescriptor(e, "shape");
	return t?.get ? t.get.raw : t?.value;
}
function D(e) {
	return E(e._zod.def) ?? e._zod.def.shape;
}
function ee(e, t, n) {
	Object.defineProperty(e, t, {
		get() {
			let e = n();
			return T(this, t, e), e;
		},
		enumerable: !0,
		configurable: !0
	});
}
function te(e, t, n) {
	t in e ? T(e, t, n) : e[t] = n;
}
function ne(e, t, n, r) {
	let i = D(t);
	for (let a of n) {
		let n = Object.getOwnPropertyDescriptor(i, a);
		n.enumerable && (n.get ? ee(e, a, () => {
			let e = t._zod.def.shape[a];
			return r ? r(e, a) : e;
		}) : te(e, a, r ? r(n.value, a) : n.value));
	}
}
function re(e, t) {
	for (let n of Reflect.ownKeys(t)) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.enumerable && (r.get ? ee(e, n, () => t[n]) : te(e, n, r.value));
	}
}
function ie(...e) {
	let t = {};
	for (let n of e) {
		let e = Object.getOwnPropertyDescriptors(n);
		Object.assign(t, e);
	}
	return Object.defineProperties({}, t);
}
function ae(e) {
	return JSON.stringify(e);
}
function oe(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var se = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function ce(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var le = /* @__PURE__*/ x(() => {
	if (nt.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function ue(e) {
	if (ce(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return ce(n) !== !1 && Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") !== !1;
}
function de(e) {
	return ue(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
var fe = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function pe(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function me(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function O(e) {
	let t = e;
	if (!t) return {};
	if (typeof t == "string") return { error: () => t };
	if (t?.message !== void 0) {
		if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
		t.error = t.message;
	}
	return delete t.message, typeof t.error == "string" ? {
		...t,
		error: () => t.error
	} : t;
}
function he(e) {
	return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function ge(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin !== void 0 && e[t]._zod.optout === "optional");
}
var _e = {
	safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, ve = {
	int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
	uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")]
};
function ye(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	let i = {};
	return ne(i, e, be(e, t)), me(e, ie(n, {
		shape: i,
		checks: []
	}));
}
function be(e, t) {
	let n = D(e), r = [];
	for (let e of Reflect.ownKeys(t)) {
		if (!Object.getOwnPropertyDescriptor(n, e)?.enumerable) throw Error(`Unrecognized key: "${String(e)}"`);
		t[e] && r.push(e);
	}
	return r;
}
function xe(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	let i = new Set(be(e, t)), a = {};
	return ne(a, e, Reflect.ownKeys(D(e)).filter((e) => !i.has(e))), me(e, ie(n, {
		shape: a,
		checks: []
	}));
}
function k(e, t) {
	if (!ue(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = D(e);
		for (let e of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return me(e, ie(e._zod.def, { shape: A(e, t) }));
}
function A(e, t) {
	let n = {};
	return ne(n, e, Reflect.ownKeys(D(e))), re(n, t), n;
}
function Se(e, t) {
	if (!ue(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return me(e, ie(e._zod.def, { shape: A(e, t) }));
}
function Ce(e, t) {
	if (!t?._zod?.def) throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (e._zod.def.checks?.length) throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	let n = {};
	return ne(n, e, Reflect.ownKeys(D(e))), ne(n, t, Reflect.ownKeys(D(t))), me(e, ie(e._zod.def, {
		shape: n,
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: t._zod.def.checks ?? []
	}));
}
function we(e, t, n, r = "partial") {
	let i = t._zod.def.checks;
	if (i && i.length > 0) throw Error(`.${r}() cannot be used on object schemas containing refinements`);
	let a = n ? new Set(be(t, n)) : void 0, o = {};
	return ne(o, t, Reflect.ownKeys(D(t)), e && ((t, n) => a && !a.has(n) ? t : new e({
		type: "optional",
		innerType: t
	}))), me(t, ie(t._zod.def, {
		shape: o,
		checks: []
	}));
}
function Te(e, t, n) {
	let r = n ? new Set(be(t, n)) : void 0, i = {};
	return ne(i, t, Reflect.ownKeys(D(t)), (t, n) => r && !r.has(n) ? t : new e({
		type: "nonoptional",
		innerType: t
	})), me(t, ie(t._zod.def, { shape: i }));
}
function Ee(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function De(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
	return !1;
}
function Oe(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function ke(e) {
	return typeof e == "string" ? e : e?.message;
}
function Ae(e) {
	let t = [];
	for (let n of e ?? []) {
		let e = n._zod.def;
		if (!/_(length|size)$|_equals$/.test(e.check)) break;
		let r = e.maximum ?? e.length ?? e.size;
		r >= 0 && t.push([r, n]);
	}
	return t;
}
function je(e, t, n) {
	var r;
	for (let i = t; i < e.length; i++) (r = e[i]).schema ?? (r.schema = n);
}
function Me(e, t, n) {
	var r;
	let i = e.inst?._zod?.traits;
	i?.has("$ZodType") && (i.has("$ZodCheck") ? (r = e).schema ?? (r.schema = e.inst) : e.schema = e.inst);
	let a = e.schema === e.inst ? void 0 : e.schema?._zod.def?.error, o = e.message ? e.message : ke(e.inst?._zod.def?.error?.(e)) ?? ke(a?.(e)) ?? ke(t?.error?.(e)) ?? ke(n.customError?.(e)) ?? ke(n.localeError?.(e)) ?? "Invalid input", s = {};
	for (let t of Object.keys(e)) t !== "inst" && t !== "schema" && t !== "continue" && t !== "input" && t !== "__proto__" && (s[t] = e[t]);
	return s.path ??= [], s.message = o, t?.reportInput && (s.input = e.input), s;
}
var Ne = /[\uD800-\uDBFF]/;
function Pe(e) {
	let t = e.length;
	if (!Ne.test(e)) return t;
	let n = t;
	for (let r = 0; r < t - 1; r++) (e.charCodeAt(r) & 64512) == 55296 && (e.charCodeAt(r + 1) & 64512) == 56320 && (n--, r++);
	return n;
}
function Fe(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function Ie(e) {
	let t = typeof e;
	switch (t) {
		case "number": return Number.isNaN(e) ? "nan" : "number";
		case "object": {
			if (e === null) return "null";
			if (Array.isArray(e)) return "array";
			let t = e;
			if (t && Object.getPrototypeOf(t) !== Object.prototype && "constructor" in t && t.constructor) return t.constructor.name;
		}
	}
	return t;
}
function Le(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
function Re(e, t) {
	for (let n in t) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.get ? Object.defineProperty(e, n, {
			...r,
			enumerable: !1
		}) : He(e, n, r.value);
	}
}
function ze(e, t, n, r = !0) {
	return Object.defineProperty(e, t, {
		configurable: !0,
		writable: !0,
		enumerable: r,
		value: n
	}), n;
}
function Be(e, t, n) {
	return ze(e, t, n, !1);
}
/* @__NO_SIDE_EFFECTS__ */
function Ve(e, t) {
	for (let n in e) {
		let r = e[n];
		Object.defineProperty(t, n, {
			configurable: !0,
			enumerable: !0,
			get() {
				return ze(this, n, r(this));
			},
			set(e) {
				ze(this, n, e);
			}
		});
	}
	return t;
}
function He(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		get() {
			return this == null ? n : ze(this, t, n.bind(this));
		},
		set(e) {
			ze(this, t, e);
		}
	});
}
function Ue(e, t) {
	let n = Object.getPrototypeOf(e);
	return t in n ? void 0 : n;
}
var We, Ge = !1, Ke = {
	configurable: !0,
	get() {
		Ge = !0;
	}
};
function j(e, t, n) {
	let r = Object.getPrototypeOf(e._zod);
	t in r && We !== e._zod ? We = void 0 : (We = e._zod, Object.defineProperty(r, t, {
		configurable: !0,
		get() {
			Object.defineProperty(this, t, Ke);
			let e = Ge;
			Ge = !1;
			try {
				let r = n(this);
				return Ge ? delete this[t] : Object.defineProperty(this, t, {
					configurable: !0,
					writable: !0,
					value: r
				}), Ge ||= e, r;
			} catch (n) {
				throw delete this[t], Ge ||= e, n;
			}
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				value: e
			});
		}
	}));
}
function qe(e, t, n, r) {
	let i = Ue(e, t);
	i && Object.defineProperty(i, t, {
		configurable: !0,
		get() {
			let e = {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: void 0
			};
			return Object.defineProperty(this, t, e), e.value = n(this), Object.defineProperty(this, t, e), e.value;
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: e
			});
		}
	});
}
var Je = "~constantCatch";
function Ye(e) {
	let t = () => e;
	return t[Je] = !0, t;
}
// node_modules/zod/v4/core/core.js
var Xe, Ze = {
	value: void 0,
	enumerable: !1
}, Qe = "captureStackTrace" in Error ? Error : null;
function $e(e) {
	let t = Qe;
	if (t) {
		let n = t.stackTraceLimit;
		if (typeof n == "number") {
			try {
				t.stackTraceLimit = 0;
			} catch {
				return Qe = null, new e();
			}
			try {
				return new e();
			} finally {
				t.stackTraceLimit = n;
			}
		}
	}
	return new e();
}
/* @__NO_SIDE_EFFECTS__ */
function M(e, t, n, r) {
	let i = {};
	function a(e) {
		this.def = e, this.constr = d, this.traits = /* @__PURE__ */ new Set();
	}
	a.prototype = i;
	let o = n, s = o && /* @__PURE__ */ new WeakSet();
	function c(n, r) {
		if (!n._zod) {
			Ze.value = new a(r);
			try {
				Object.defineProperty(n, "_zod", Ze);
			} finally {
				Ze.value = void 0;
			}
		} else if (n._zod.traits.has(e)) return;
		if (n._zod.traits.add(e), t(n, r), s) {
			let e = Object.getPrototypeOf(n), t = n._zod.constr.prototype, r = e;
			for (; r && r !== t;) r = Object.getPrototypeOf(r);
			let i = r ?? e;
			s.has(i) || (s.add(i), Re(i, o));
		}
		let i = d.prototype;
		for (let e in i) Object.prototype.hasOwnProperty.call(i, e) && (e in n || (n[e] = i[e].bind(n)));
	}
	let l = r?.Parent ?? Object;
	class u extends l {}
	Object.defineProperty(u, "name", { value: e });
	function d(e) {
		let t = r?.Parent ? $e(u) : this;
		c(t, e);
		let n = t._zod.deferred;
		if (n) {
			for (let e of n) e();
			t._zod.deferred = void 0;
		}
		let i = globalThis.__zod_globalConfig?.postProcessor;
		return i && i(t), t;
	}
	return Object.defineProperty(d, "init", { value: c }), Object.defineProperty(d, Symbol.hasInstance, { value: (t) => r?.Parent && t instanceof r.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(d, "name", { value: e }), d;
}
var et = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, tt = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
};
(Xe = globalThis).__zod_globalConfig ?? (Xe.__zod_globalConfig = {});
var nt = globalThis.__zod_globalConfig;
function rt(e) {
	return e && Object.assign(nt, e), nt;
}
// node_modules/zod/v4/core/errors.js
function it() {
	let e = this._zod;
	return e.message ??= JSON.stringify(e.def, y, 2), e.message;
}
function at(e) {
	this._zod.message = e;
}
var ot = {
	get: it,
	set: at,
	enumerable: !0,
	configurable: !0
}, st = {
	value: void 0,
	enumerable: !1
}, ct = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), lt = /* @__PURE__ */ M("$ZodError", (e, t) => {
	e.name = "$ZodError", st.value = t, Object.defineProperty(e, "issues", st), st.value = void 0, Object.defineProperty(e, "message", ot);
	let n = Object.getPrototypeOf(e);
	ct.has(n) || (ct.add(n), Object.defineProperty(n, "toString", {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = () => this.message;
			return Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	}));
});
function ut(e, t, n) {
	return Object.prototype.hasOwnProperty.call(e, t) || (t === "__proto__" ? Object.defineProperty(e, t, {
		value: n(),
		writable: !0,
		enumerable: !0,
		configurable: !0
	}) : e[t] = n()), e[t];
}
function dt(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? ut(n, i.path[0], () => []).push(t(i)) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function ft(e, t = (e) => e.message) {
	let n = { _errors: [] }, r = (e, i = []) => {
		for (let a of e.issues) if (a.code === "invalid_union" && a.errors.length) a.errors.map((e) => r({ issues: e }, [...i, ...a.path]));
		else if (a.code === "invalid_key") r({ issues: a.issues }, [...i, ...a.path]);
		else if (a.code === "invalid_element") r({ issues: a.issues }, [...i, ...a.path]);
		else {
			let e = [...i, ...a.path];
			if (e.length === 0) n._errors.push(t(a));
			else {
				let r = n, i = 0;
				for (; i < e.length;) {
					let n = e[i], o = i === e.length - 1;
					if (n === "_errors") {
						o && r._errors.push(t(a)), i++;
						continue;
					}
					Object.prototype.hasOwnProperty.call(r, n) || Object.defineProperty(r, n, {
						value: { _errors: [] },
						enumerable: !0,
						writable: !0,
						configurable: !0
					});
					let s = r[n];
					o && s._errors.push(t(a)), r = s, i++;
				}
			}
		}
	};
	return r(e), n;
}
// node_modules/zod/v4/core/parse.js
function pt(e, t) {
	return {
		callee: t?.callee ?? e,
		Err: t?.Err
	};
}
var mt = (e) => {
	let t = (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !1
		} : { async: !1 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise) throw new et();
		if (s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => Me(e, o, rt())));
			throw se(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, ht = (e) => {
	let t = async (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !0
		} : { async: !0 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise && (s = await s), s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => Me(e, o, rt())));
			throw se(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, gt = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new et();
	return a.issues.length ? _t(e, a.issues, i) : {
		success: !0,
		data: a.value
	};
};
function _t(e, t, n) {
	let r;
	return {
		success: !1,
		get error() {
			return r || (r = new e(t.map((e) => Me(e, n, rt()))), t = void 0, n = void 0), r;
		},
		set error(e) {
			r = e, t = void 0, n = void 0;
		}
	};
}
var vt = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		async: !0
	} : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? _t(e, a.issues, i) : {
		success: !0,
		data: a.value
	};
}, yt = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), bt = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), xt = ((e, t, n) => {
	let r = e._zod.bag.validator;
	if (r !== void 0) {
		if (r(t) !== yt) return !0;
		if (r.definite === !0 && n === void 0) return !1;
	}
	return St(e, t, n);
});
function St(e, t, n) {
	let r = n ? {
		...n,
		async: !1,
		abortEarly: !0
	} : {
		async: !1,
		abortEarly: !0
	}, i = e._zod.bag.fallbackRun, a;
	if (i ? (r[bt] = !0, a = i({
		value: t,
		issues: []
	}, r)) : a = e._zod.run({
		value: t,
		issues: []
	}, r), a instanceof Promise) throw new et();
	return a.issues.length === 0;
}
var Ct = async (e, t, n) => {
	let r = n ? {
		...n,
		async: !0,
		abortEarly: !0
	} : {
		async: !0,
		abortEarly: !0
	}, i = e._zod.run({
		value: t,
		issues: []
	}, r);
	return i instanceof Promise && (i = await i), i.issues.length === 0;
}, wt = (e) => {
	let t = mt(e), n = (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return t(e, r, o, pt(n, a));
	};
	return n;
}, Tt = (e) => {
	let t = mt(e), n = (e, r, i, a) => t(e, r, i, pt(n, a));
	return n;
}, Et = (e) => {
	let t = ht(e), n = async (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return await t(e, r, o, pt(n, a));
	};
	return n;
}, Dt = (e) => {
	let t = ht(e), n = async (e, r, i, a) => await t(e, r, i, pt(n, a));
	return n;
}, Ot = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return gt(e)(t, n, i);
}, kt = (e) => (t, n, r) => gt(e)(t, n, r), At = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return vt(e)(t, n, i);
}, jt = (e) => async (t, n, r) => vt(e)(t, n, r), Mt = /^[cC][0-9a-z]{6,}$/, Nt = /^[0-9a-z]+$/, Pt = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, Ft = /^[0-9a-vA-V]{20}$/, It = /^[A-Za-z0-9]{27}$/, Lt = /^[a-zA-Z0-9_-]{21}$/;
function Rt(e) {
	return RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
var zt = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Bt = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Vt = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, Ht = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Ut = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function Wt() {
	return new RegExp(Ut, "u");
}
var Gt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Kt = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, qt = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Jt = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Yt = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Xt = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/, Zt = /^https?$/, N = /^\+[1-9]\d{6,14}$/, Qt = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function $t(e) {
	return RegExp(`^${e}$`);
}
var en = /*@__PURE__*/ $t(Qt);
function tn(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function nn(e) {
	return RegExp(`^${tn(e)}$`);
}
function rn(e) {
	let t = ["Z"];
	e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let n = `${tn({
		precision: e.precision,
		seconds: !0
	})}(?:${t.join("|")})`, r = e.local ? `${n}|${tn({ precision: e.precision })}` : n;
	return RegExp(`^${Qt}T(?:${r})$`);
}
var an = /^[\s\S]{0,}$/, on = /^-?\d+$/, sn = /^-?\d+(?:\.\d+)?$/, cn = /^(?:true|false)$/i, ln = /^[^A-Z]*$/, un = /^[^a-z]*$/, dn = /*@__PURE__*/ M("$ZodCheck", (e, t) => {
	var n;
	e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), fn = (e) => {
	let t = e.value;
	return !S(t) && t.length !== void 0;
}, pn = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, mn = /*@__PURE__*/ M("$ZodCheckLessThan", (e, t) => {
	dn.init(e, t);
	let n = pn[typeof t.value];
	e._zod.check = (r) => {
		(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
			origin: pn[typeof r.value] ?? n,
			code: "too_big",
			maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), hn = /*@__PURE__*/ M("$ZodCheckGreaterThan", (e, t) => {
	dn.init(e, t);
	let n = pn[typeof t.value];
	e._zod.check = (r) => {
		(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
			origin: pn[typeof r.value] ?? n,
			code: "too_small",
			minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), gn = /*@__PURE__*/ M("$ZodCheckMultipleOf", (e, t) => {
	dn.init(e, t), e._zod.check = (n) => {
		if (typeof n.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
		(typeof n.value == "bigint" ? t.value !== BigInt(0) && n.value % t.value === BigInt(0) : w(n.value, t.value) === 0) || n.issues.push({
			origin: typeof n.value,
			code: "not_multiple_of",
			divisor: t.value,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), _n = /*@__PURE__*/ M("$ZodCheckNumberFormat", (e, t) => {
	dn.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = _e[t.format];
	e._zod.check = (o) => {
		let s = o.value;
		if (n) {
			if (!Number.isInteger(s)) {
				o.issues.push({
					expected: r,
					format: t.format,
					code: "invalid_type",
					continue: !1,
					input: s,
					inst: e
				});
				return;
			}
			if (!Number.isSafeInteger(s)) {
				s > 0 ? o.issues.push({
					input: s,
					code: "too_big",
					maximum: 2 ** 53 - 1,
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				}) : o.issues.push({
					input: s,
					code: "too_small",
					minimum: -(2 ** 53 - 1),
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				});
				return;
			}
		}
		s < i && o.issues.push({
			origin: "number",
			input: s,
			code: "too_small",
			minimum: i,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		}), s > a && o.issues.push({
			origin: "number",
			input: s,
			code: "too_big",
			maximum: a,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		});
	};
}), vn = /*@__PURE__*/ M("$ZodCheckMaxLength", (e, t) => {
	var n;
	dn.init(e, t), (n = e._zod.def).when ?? (n.when = fn), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i > t.maximum ? Pe(r) : i) <= t.maximum) return;
		let a = Fe(r);
		n.issues.push({
			origin: a,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), yn = /*@__PURE__*/ M("$ZodCheckMinLength", (e, t) => {
	var n;
	dn.init(e, t), (n = e._zod.def).when ?? (n.when = fn), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i >= t.minimum && i < t.minimum * 2 ? Pe(r) : i) >= t.minimum) return;
		let a = Fe(r);
		n.issues.push({
			origin: a,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), bn = /*@__PURE__*/ M("$ZodCheckLengthEquals", (e, t) => {
	var n;
	dn.init(e, t), (n = e._zod.def).when ?? (n.when = fn), e._zod.check = (n) => {
		let r = n.value, i = r.length, a = typeof r == "string" && i >= t.length && i <= t.length * 2 ? Pe(r) : i;
		if (a === t.length) return;
		let o = Fe(r), s = a > t.length;
		n.issues.push({
			origin: o,
			...s ? {
				code: "too_big",
				maximum: t.length
			} : {
				code: "too_small",
				minimum: t.length
			},
			inclusive: !0,
			exact: !0,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), xn = /*@__PURE__*/ M("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	dn.init(e, t), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
		t.pattern.lastIndex = 0, t.pattern.test(n.value) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: t.format,
			input: n.value,
			...t.pattern ? { pattern: t.pattern.toString() } : {},
			inst: e,
			continue: !t.abort
		});
	}) : (r = e._zod).check ?? (r.check = () => {});
}), Sn = /*@__PURE__*/ M("$ZodCheckRegex", (e, t) => {
	xn.init(e, t), e._zod.check = (n) => {
		t.pattern.lastIndex = 0, t.pattern.test(n.value) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: n.value,
			pattern: t.pattern.toString(),
			inst: e,
			continue: !t.abort
		});
	};
}), Cn = /*@__PURE__*/ M("$ZodCheckLowerCase", (e, t) => {
	t.pattern ??= ln, xn.init(e, t);
}), wn = /*@__PURE__*/ M("$ZodCheckUpperCase", (e, t) => {
	t.pattern ??= un, xn.init(e, t);
}), Tn = /*@__PURE__*/ M("$ZodCheckIncludes", (e, t) => {
	dn.init(e, t);
	let n = pe(t.includes);
	t.pattern = new RegExp(typeof t.position == "number" ? `^.{${t.position},}${n}` : n), e._zod.check = (n) => {
		n.value.includes(t.includes, t.position) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: t.includes,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), En = /*@__PURE__*/ M("$ZodCheckStartsWith", (e, t) => {
	dn.init(e, t);
	let n = RegExp(`^${pe(t.prefix)}.*`);
	t.pattern ??= n, e._zod.check = (n) => {
		n.value.startsWith(t.prefix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: t.prefix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Dn = /*@__PURE__*/ M("$ZodCheckEndsWith", (e, t) => {
	dn.init(e, t);
	let n = RegExp(`.*${pe(t.suffix)}$`);
	t.pattern ??= n, e._zod.check = (n) => {
		n.value.endsWith(t.suffix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: t.suffix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), On = /*@__PURE__*/ M("$ZodCheckOverwrite", (e, t) => {
	dn.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), kn = class {
	constructor(e = [], t = {}) {
		this.content = [], this.indent = 0, this.args = e, this.closed = t;
	}
	indented(e) {
		this.indent += 1;
		try {
			e(this);
		} finally {
			--this.indent;
		}
	}
	write(e) {
		if (typeof e == "function") {
			e(this, { execution: "sync" }), e(this, { execution: "async" });
			return;
		}
		let t = e.split("\n").filter((e) => e), n = Math.min(...t.map((e) => e.length - e.trimStart().length)), r = t.map((e) => e.slice(n)).map((e) => " ".repeat(this.indent * 2) + e);
		for (let e of r) this.content.push(e);
	}
	compile() {
		let e = Function, t = this?.content ?? [""];
		return new e(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${t.join("\n")}\n};`)(...Object.values(this.closed));
	}
}, An = {
	major: 4,
	minor: 6,
	patch: 7
}, jn = /*@__PURE__*/ M("$ZodType", (e, t) => {
	var n;
	e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = An;
	let r = e._zod.def.checks, i = e._zod.traits.has("$ZodCheck") ? [e, ...r ?? []] : r?.length ? [...r] : [];
	for (let t of i) for (let n of t._zod.onattach) n(e);
	if (i.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (t, n, r) => {
			if (t.memo) return t;
			let i = Ee(t), a;
			for (let o of n) {
				if (o._zod.def.when) {
					if (De(t) || !o._zod.def.when(t)) continue;
				} else if (i) continue;
				let n = t.issues.length, s = o._zod.check(t);
				if (s instanceof Promise && r?.async === !1) throw new et();
				if (a || s instanceof Promise) a = (a ?? Promise.resolve()).then(async () => {
					await s, t.issues.length !== n && (je(t.issues, n, e), i ||= Ee(t, n));
				});
				else {
					if (t.issues.length === n) continue;
					je(t.issues, n, e), i ||= Ee(t, n);
				}
			}
			return a ? a.then(() => t) : t;
		}, n = (n, r, a) => {
			if (Ee(n)) return n.aborted = !0, n;
			let o = t(r, i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new et();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (r, a) => {
			if (a.skipChecks) return e._zod.parse(r, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: r.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, r, a)) : n(t, r, a);
			}
			let o = e._zod.parse(r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new et();
				return o.then((e) => t(e, i, a));
			}
			return t(o, i, a);
		};
	}
}, {
	get "~standard"() {
		return Be(this, "~standard", Pn(this));
	},
	set "~standard"(e) {
		ze(this, "~standard", e);
	}
}), Mn = (e, t) => e.issues.length ? { issues: e.issues.map((e) => Me(e, t, rt())) } : { value: e.value };
async function Nn(e, t) {
	let n = { async: !0 };
	return Mn(await e._zod.run({
		value: t,
		issues: []
	}, n), n);
}
function Pn(e) {
	return {
		validate: (t) => {
			let n = { async: !1 };
			try {
				let r = e._zod.run({
					value: t,
					issues: []
				}, n);
				if (!(r instanceof Promise)) return Mn(r, n);
			} catch {}
			return Nn(e, t);
		},
		vendor: "zod",
		version: 1
	};
}
var Fn = /*@__PURE__*/ M("$ZodString", (e, t) => {
	jn.init(e, t), e._zod.pattern = t.pattern ?? an, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = String(n.value);
		} catch {}
		return typeof n.value == "string" || n.issues.push({
			expected: "string",
			code: "invalid_type",
			input: n.value,
			inst: e
		}), n;
	};
}), P = /*@__PURE__*/ M("$ZodStringFormat", (e, t) => {
	xn.init(e, t), Fn.init(e, t);
}), In = /*@__PURE__*/ M("$ZodGUID", (e, t) => {
	t.pattern ??= Bt, P.init(e, t);
}), Ln = /*@__PURE__*/ M("$ZodUUID", (e, t) => {
	if (t.version) {
		let e = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[t.version];
		if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
		t.pattern ??= Vt(e);
	} else t.pattern ??= Vt();
	P.init(e, t);
}), Rn = /*@__PURE__*/ M("$ZodEmail", (e, t) => {
	t.pattern ??= Ht, P.init(e, t);
});
function zn(e) {
	try {
		return typeof URL < "u" && typeof URL.canParse == "function" ? URL.canParse(e) : (new URL(e), !0);
	} catch {
		return !1;
	}
}
function Bn(e, t) {
	return !("normalize" in t) && !("hostname" in t) && !("protocol" in t) ? zn(e) || 2 : Vn(e, t);
}
function Vn(e, t) {
	if (!t.normalize && t.protocol?.source === Zt.source && !/^https?:\/\//i.test(e)) return 1;
	try {
		if (typeof URL < "u") {
			let t = URL;
			if (typeof t.parse == "function") return t.parse(e) ?? 2;
		}
		return new URL(e);
	} catch {
		return 2;
	}
}
var Hn = /[\t\n\r]/g;
function Un(e) {
	return e.replace(Hn, "");
}
function Wn(e, t) {
	return t.lastIndex = 0, t.test(e.hostname);
}
function Gn(e, t) {
	return t.lastIndex = 0, t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol);
}
var Kn = /*@__PURE__*/ M("$ZodURL", (e, t) => {
	P.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim(), i = Bn(r, t);
			if (i === 1) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			if (i === 2) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			if (i === !0) {
				n.value = Un(r);
				return;
			}
			t.hostname && !Wn(i, t.hostname) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), t.protocol && !Gn(i, t.protocol) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), n.value = t.normalize ? i.href : Un(r);
			return;
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "url",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), qn = /*@__PURE__*/ M("$ZodEmoji", (e, t) => {
	t.pattern ??= Wt(), P.init(e, t);
}), Jn = /*@__PURE__*/ M("$ZodNanoID", (e, t) => {
	if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw Error(`Invalid nanoid length: ${t.length}`);
	t.pattern ??= t.length === void 0 ? Lt : Rt(t.length), P.init(e, t);
}), Yn = /*@__PURE__*/ M("$ZodCUID", (e, t) => {
	t.pattern ??= Mt, P.init(e, t);
}), Xn = /*@__PURE__*/ M("$ZodCUID2", (e, t) => {
	t.pattern ??= Nt, P.init(e, t);
}), Zn = /*@__PURE__*/ M("$ZodULID", (e, t) => {
	t.pattern ??= Pt, P.init(e, t);
}), Qn = /*@__PURE__*/ M("$ZodXID", (e, t) => {
	t.pattern ??= Ft, P.init(e, t);
}), $n = /*@__PURE__*/ M("$ZodKSUID", (e, t) => {
	t.pattern ??= It, P.init(e, t);
}), er = /*@__PURE__*/ M("$ZodISODateTime", (e, t) => {
	t.pattern ??= rn(t), P.init(e, t);
}), tr = /*@__PURE__*/ M("$ZodISODate", (e, t) => {
	t.pattern ??= en, P.init(e, t);
}), nr = /*@__PURE__*/ M("$ZodISOTime", (e, t) => {
	t.pattern ??= nn(t), P.init(e, t);
}), rr = /*@__PURE__*/ M("$ZodISODuration", (e, t) => {
	t.pattern ??= zt, P.init(e, t);
}), ir = /*@__PURE__*/ M("$ZodIPv4", (e, t) => {
	t.pattern ??= Gt, P.init(e, t);
}), ar = /^[0-9a-fA-F:.]+$/;
function or(e) {
	return ar.test(e) ? zn(`http://[${e}]`) : !1;
}
var sr = /*@__PURE__*/ M("$ZodIPv6", (e, t) => {
	t.pattern ??= Kt, P.init(e, t), e._zod.check = (n) => {
		or(n.value) || n.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), cr = /*@__PURE__*/ M("$ZodCIDRv4", (e, t) => {
	t.pattern ??= qt, P.init(e, t);
});
function lr(e) {
	let t = e.split("/");
	if (t.length !== 2) return !1;
	let [n, r] = t;
	if (!r) return !1;
	let i = Number(r);
	return `${i}` !== r || i < 0 || i > 128 ? !1 : or(n);
}
var ur = /*@__PURE__*/ M("$ZodCIDRv6", (e, t) => {
	t.pattern ??= Jt, P.init(e, t), e._zod.check = (n) => {
		lr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function dr(e) {
	if (e === "") return !0;
	if (/\s/.test(e) || e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var fr = /^[0-9a-zA-Z+/]*={0,2}$/, pr = /*@__PURE__*/ M("$ZodBase64", (e, t) => {
	t.pattern ??= fr, P.init(e, t), e._zod.check = (n) => {
		dr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), mr = /^[A-Za-z0-9_-]*$/;
function hr(e) {
	if (!mr.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return dr(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var gr = /*@__PURE__*/ M("$ZodBase64URL", (e, t) => {
	t.pattern ??= mr, P.init(e, t), e._zod.check = (n) => {
		hr(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), _r = /*@__PURE__*/ M("$ZodE164", (e, t) => {
	t.pattern ??= N, P.init(e, t);
});
function vr(e, t = null) {
	try {
		let n = e.split(".");
		if (n.length !== 3) return !1;
		let [r] = n;
		if (!r) return !1;
		let i = JSON.parse(atob(r));
		return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
	} catch {
		return !1;
	}
}
var yr = /*@__PURE__*/ M("$ZodJWT", (e, t) => {
	P.init(e, t), e._zod.check = (n) => {
		vr(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), br = /*@__PURE__*/ M("$ZodNumber", (e, t) => {
	jn.init(e, t), e._zod.pattern = sn, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = Number(n.value);
		} catch {}
		let i = n.value;
		if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
		let a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : String(i) : void 0;
		return n.issues.push({
			expected: "number",
			code: "invalid_type",
			input: i,
			inst: e,
			...a ? { received: a } : {}
		}), n;
	};
}), xr = /*@__PURE__*/ M("$ZodNumberFormat", (e, t) => {
	_n.init(e, t), br.init(e, t);
}), Sr = /*@__PURE__*/ M("$ZodBoolean", (e, t) => {
	jn.init(e, t), e._zod.pattern = cn, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = !!n.value;
		} catch {}
		let i = n.value;
		return typeof i == "boolean" || n.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
	};
}), Cr = /*@__PURE__*/ M("$ZodAny", (e, t) => {
	jn.init(e, t), e._zod.parse = (e) => e;
}), wr = /*@__PURE__*/ M("$ZodUnknown", (e, t) => {
	jn.init(e, t), e._zod.parse = (e) => e;
}), Tr = /*@__PURE__*/ M("$ZodNever", (e, t) => {
	jn.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function Er(e, t) {
	let n = Ae(e._zod.def.checks);
	if (!n.length) return;
	let r = Math.min(...n.map((e) => e[0])), i = e._zod.parse;
	e._zod.parse = (n, a) => {
		let o = t(n.value);
		if (o > r && !a?.skipChecks && a?.direction !== "backward") {
			for (let [t, r] of Ae(e._zod.def.checks)) if (o > t && r._zod.def.when(n)) {
				let t = n.issues.length;
				return r._zod.check(n), n.issues[t].continue = !1, je(n.issues, t, e), n;
			}
		}
		return i(n, a);
	};
}
var Dr = (e) => Array.isArray(e) ? e.length : -1;
function Or(e, t, n) {
	e.issues.length && t.issues.push(...Oe(n, e.issues)), t.value[n] = e.value;
}
var kr = /*@__PURE__*/ M("$ZodArray", (e, t) => {
	jn.init(e, t);
	let n = nt.memoizer;
	n?.attach(e), e._zod.parse = (r, i) => {
		let a = r.value;
		if (!Array.isArray(a)) return r.issues.push({
			expected: "array",
			code: "invalid_type",
			input: a,
			inst: e
		}), r;
		r.value = n ? n.alloc(e, r, Array(a.length), i) : Array(a.length);
		let o = [], s = i?.abortEarly;
		for (let e = 0; e < a.length; e++) {
			let n = a[e], c = t.element._zod.run({
				value: n,
				issues: []
			}, i);
			if (c instanceof Promise) o.push(c.then((t) => Or(t, r, e)));
			else if (Or(c, r, e), s && c.issues.length !== 0 && Ee(c)) break;
		}
		return o.length ? Promise.all(o).then(() => r) : r;
	}, Er(e, Dr);
});
function Ar(e, t, n, r, i, a) {
	let o = n in r, s = a === "optional";
	if (o || !s || i !== "optional") {
		if (e.issues.length) {
			if (i !== void 0 && s && !o) return;
			t.issues.push(...Oe(n, e.issues));
		}
		!o && i === void 0 ? e.issues.length || t.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [n]
		}) : e.value === void 0 ? (o || i === "defaulted" && !s) && (t.value[n] = void 0) : t.value[n] = e.value;
	}
}
var jr = [];
function Mr(e) {
	let t = Object.keys(e.shape), n = Object.getOwnPropertySymbols(e.shape), r = n.length ? n : jr, i = r.length ? [...t, ...r] : t;
	for (let t of i) if (!e.shape?.[t]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);
	let a = ge(e.shape);
	return {
		...e,
		allKeys: i,
		symbolKeys: r,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(a)
	};
}
function Nr(e, t, n, r, i, a, o) {
	let s = [], c = i.keySet, l = i.catchall._zod, u = l.def.type, d = l.optin, f = l.optout, p = 0;
	for (let i in t) {
		if (o && n.issues.length !== p) {
			if (Ee(n, p)) break;
			p = n.issues.length;
		}
		if (c.has(i)) continue;
		if (i === "__proto__") {
			u === "never" && s.push(i);
			continue;
		}
		if (u === "never") {
			s.push(i);
			continue;
		}
		let a = l.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => Ar(e, n, i, t, d, f))) : Ar(a, n, i, t, d, f);
	}
	return s.length && n.issues.push({
		code: "unrecognized_keys",
		keys: s,
		input: t,
		inst: a,
		continue: !0
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var Pr = /*@__PURE__*/ M("$ZodObject", (e, t) => {
	jn.init(e, t);
	let n = Object.getOwnPropertyDescriptor(t, "shape"), r = n?.get ? n.get.raw : t.shape ?? {};
	if (r) {
		let e = () => {
			let n = { ...r };
			return Object.defineProperty(t, "shape", { value: n }), e.raw = n, n;
		};
		e.raw = r, Object.defineProperty(t, "shape", { get: e });
	}
	let i = x(() => Mr(t));
	j(e, "propValues", (e) => {
		let t = e.def.shape, n = {};
		for (let e in t) {
			let r = t[e]._zod;
			if (r.values) {
				Object.prototype.hasOwnProperty.call(n, e) || T(n, e, /* @__PURE__ */ new Set());
				for (let t of r.values) n[e].add(t);
				r.optin !== void 0 && n[e].add(void 0);
			}
		}
		return n;
	});
	let a = ce, o = t.catchall, s, c = nt.memoizer;
	c?.attach(e), e._zod.parse = (t, n) => {
		s ??= i.value;
		let r = t.value;
		if (!a(r)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: r,
			inst: e
		}), t;
		t.value = c ? c.alloc(e, t, {}, n) : {};
		let l = [], u = s.shape, d = n?.abortEarly, f = t.issues.length;
		for (let e of s.allKeys) {
			if (d && t.issues.length !== f) {
				if (Ee(t, f)) break;
				f = t.issues.length;
			}
			if (e === "__proto__") continue;
			let i = u[e], a = i._zod.optin, o = i._zod.optout, s = i._zod.run({
				value: r[e],
				issues: []
			}, n);
			s instanceof Promise ? l.push(s.then((n) => Ar(n, t, e, r, a, o))) : Ar(s, t, e, r, a, o);
		}
		return o ? Nr(l, r, t, n, i.value, e, d === !0) : l.length ? Promise.all(l).then(() => t) : t;
	};
}), Fr = /*@__PURE__*/ M("$ZodObjectJIT", (e, t) => {
	Pr.init(e, t);
	let n = e._zod.parse, r = x(() => Mr(t)), i = nt.memoizer, a = (t) => {
		let n = r.value, a = n.symbolKeys, o = new kn(["payload", "ctx"], {
			shape: t,
			inst: e,
			memo: i,
			syms: a
		}), s = (e) => `shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`, c = (e, t) => `
          let ${e}_ab = false;
          for (let i = 0; i < ${e}.issues.length; i++) {
            const iss = ${e}.issues[i];
            iss.path = iss.path ? [${t}, ...iss.path] : [${t}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${e}_ab = true;
          }
          if (${e}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
		o.write("const input = payload.value;");
		let l = Object.create(null), u = 0;
		for (let e of n.allKeys) l[e] = `key_${u++}`;
		o.write(i ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
		for (let e of n.allKeys) {
			if (e === "__proto__") continue;
			let n = l[e], r = typeof e == "symbol" ? `syms[${a.indexOf(e)}]` : ae(e), i = `${r} in input`, u = t[e], d = u?._zod?.optin, f = d !== void 0, p = u?._zod?.optout === "optional";
			if (o.write(`const ${n} = ${s(r)};`), f && p) {
				let e = d === "optional" ? `${n}_present` : `${n}.value !== undefined || ${n}_present`;
				o.write(`
        const ${n}_present = ${i};
        if (!${n}.issues.length || ${n}_present) {
          if (${n}.issues.length) {${c(n, r)}
          }

          if (${e}) {
            newResult[${r}] = ${n}.value;
          }
        }

      `);
			} else f ? (o.write(`
        if (${n}.issues.length) {${c(n, r)}
        }
      `), d === "defaulted" ? o.write(`newResult[${r}] = ${n}.value;`) : o.write(`
        if (${n}.value !== undefined || ${i}) {
          newResult[${r}] = ${n}.value;
        }
      `)) : o.write(`
        const ${n}_present = ${i};
        if (${n}.issues.length) {${c(n, r)}
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${r}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${n}_present) {
          newResult[${r}] = ${n}.value;
        }

      `);
		}
		return o.write("payload.value = newResult;"), o.write("return payload;"), o.compile();
	}, o, s = ce, c = !nt.jitless, l = c && le.value, u = t.catchall, d;
	e._zod.parse = (i, f) => {
		d ??= r.value;
		let p = i.value;
		return s(p) ? c && l && f?.async === !1 && f.jitless !== !0 ? (o ||= a(t.shape), i = o(i, f), u ? Nr([], p, i, f, d, e, f?.abortEarly === !0) : i) : n(i, f) : (i.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), i);
	};
});
function Ir(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !Ee(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => Me(e, r, rt())))
	}), t);
}
var Lr = /*@__PURE__*/ M("$ZodUnion", (e, t) => {
	jn.init(e, t), j(e, "optin", (e) => e.def.options.some((e) => e._zod.optin === "defaulted") ? "defaulted" : e.def.options.some((e) => e._zod.optin !== void 0) ? "optional" : void 0), j(e, "optout", (e) => e.def.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), j(e, "values", (e) => {
		if (e.def.options.every((e) => e._zod.values)) return new Set(e.def.options.flatMap((e) => Array.from(e._zod.values)));
	}), j(e, "pattern", (e) => {
		if (e.def.options.every((e) => e._zod.pattern)) {
			let t = e.def.options.map((e) => e._zod.pattern);
			return RegExp(`^(${t.map((e) => C(e.source)).join("|")})$`);
		}
	});
	let n = t.options.length === 1 ? t.options[0]._zod.run : null;
	e._zod.parse = (r, i) => {
		if (n) return n(r, i);
		let a = !1, o = [];
		for (let e of t.options) {
			let t = e._zod.run({
				value: r.value,
				issues: []
			}, i);
			if (t instanceof Promise) o.push(t), a = !0;
			else {
				if (t.issues.length === 0) return t;
				o.push(t);
			}
		}
		return a ? Promise.all(o).then((t) => Ir(t, r, e, i)) : Ir(o, r, e, i);
	};
});
function Rr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.options) {
		let r = n._zod.propValues?.[e.discriminator];
		if (!r || r.size === 0) throw Error(`Invalid discriminated union option at index "${e.options.indexOf(n)}"`);
		for (let e of r) if (t.has(e)) {
			if (e !== void 0) throw Error(`Duplicate discriminator value "${String(e)}"`);
			t.set(e, null);
		} else t.set(e, n);
	}
	return t;
}
var zr = /*@__PURE__*/ M("$ZodDiscriminatedUnion", (e, t) => {
	t.inclusive = !1, Lr.init(e, t);
	let n = e._zod.parse;
	j(e, "propValues", (e) => {
		let t = {}, n = 0;
		for (let r of e.def.options) {
			let i = r._zod.propValues;
			if (!i || Object.keys(i).length === 0) throw Error(`Invalid discriminated union option at index "${e.def.options.indexOf(r)}"`);
			i[e.def.discriminator]?.has(void 0) && n++;
			for (let [e, n] of Object.entries(i)) {
				Object.prototype.hasOwnProperty.call(t, e) || T(t, e, /* @__PURE__ */ new Set());
				for (let r of n) t[e].add(r);
			}
		}
		return !e.def.unionFallback && n > 1 && t[e.def.discriminator]?.delete(void 0), t;
	}), t.options.forEach((e, n) => {
		let r = E(e._zod.def);
		if (r && !Object.prototype.hasOwnProperty.call(r, t.discriminator)) throw Error(`Invalid discriminated union option at index "${n}"`);
	});
	let r = x(() => Rr(t));
	e._zod.parse = (i, a) => {
		let o = i.value;
		if (!ce(o)) return i.issues.push({
			code: "invalid_type",
			expected: "object",
			input: o,
			inst: e
		}), i;
		let s = o?.[t.discriminator], c = r.value.get(s);
		return c && (s !== void 0 || a.direction !== "backward") ? c._zod.run(i, a) : t.unionFallback || a.direction === "backward" ? n(i, a) : (i.issues.push({
			code: "invalid_union",
			errors: [],
			note: "No matching discriminator",
			discriminator: t.discriminator,
			options: Array.from(r.value.keys()).filter((e) => r.value.get(e) !== null),
			input: o,
			path: [t.discriminator],
			inst: e
		}), i);
	};
}), Br = /*@__PURE__*/ M("$ZodIntersection", (e, t) => {
	jn.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => Hr(e, t, n)) : Hr(e, i, a);
	};
});
function Vr(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (ue(e) && ue(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		Object.prototype.hasOwnProperty.call(i, "__proto__") && delete i.__proto__;
		for (let n of r) {
			if (n === "__proto__") continue;
			let r = Vr(e[n], t[n]);
			if (!r.valid) return {
				valid: !1,
				mergeErrorPath: [n, ...r.mergeErrorPath]
			};
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return {
			valid: !1,
			mergeErrorPath: []
		};
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = Vr(i, a);
			if (!o.valid) return {
				valid: !1,
				mergeErrorPath: [r, ...o.mergeErrorPath]
			};
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return {
		valid: !1,
		mergeErrorPath: []
	};
}
function Hr(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i, a = /* @__PURE__ */ new Map(), o = (e, t) => {
		let n;
		if (e.code === "unrecognized_keys" && !e.path?.length) i ??= e, n = e.keys;
		else if (e.code === "invalid_key" && e.origin === "record" && e.path?.length === 1) {
			let t = String(e.path[0]);
			a.has(t) || a.set(t, e), n = [t];
		} else return !1;
		for (let e of n) r.has(e) || r.set(e, {}), r.get(e)[t] = !0;
		return !0;
	};
	for (let n of t.issues) o(n, "l") || e.issues.push(n);
	for (let t of n.issues) o(t, "r") || e.issues.push(t);
	let s = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (s.length) {
		let t = i ? s.filter((e) => i.keys.includes(e)) : [];
		t.length && e.issues.push({
			...i,
			keys: t
		});
		for (let n of s) !t.includes(n) && a.has(n) && e.issues.push(a.get(n));
	}
	let c = Vr(t.value, n.value);
	if (!c.valid) {
		if (Ee(e)) return e;
		throw Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`);
	}
	return e.value = c.data, e;
}
var Ur = /*@__PURE__*/ M("$ZodTuple", (e, t) => {
	jn.init(e, t);
	let n = t.items, r = nt.memoizer;
	r?.attach(e), e._zod.parse = (i, a) => {
		let o = i.value;
		if (!Array.isArray(o)) return i.issues.push({
			input: o,
			inst: e,
			expected: "tuple",
			code: "invalid_type"
		}), i;
		i.value = r ? r.alloc(e, i, [], a) : [];
		let s = [], c = Wr(n, "optin"), l = Wr(n, "optout");
		if (!t.rest) {
			if (o.length < c) return i.issues.push({
				code: "too_small",
				minimum: c,
				inclusive: !0,
				input: o,
				inst: e,
				origin: "array"
			}), i;
			o.length > n.length && i.issues.push({
				code: "too_big",
				maximum: n.length,
				inclusive: !0,
				input: o,
				inst: e,
				origin: "array"
			});
		}
		let u = Array(n.length), d = t.rest ? a?.abortEarly : void 0, f = !1;
		for (let e = 0; e < n.length; e++) {
			let t = n[e]._zod.run({
				value: o[e],
				issues: []
			}, a);
			t instanceof Promise ? s.push(t.then((t) => {
				u[e] = t;
			})) : (u[e] = t, d && !f && t.issues.length && (f = Ee(t)));
		}
		if (t.rest && !f) {
			let e = n.length - 1, r = o.slice(n.length), c = i.issues.length;
			for (let n of r) {
				if (d && i.issues.length !== c) {
					if (Ee(i, c)) break;
					c = i.issues.length;
				}
				e++;
				let r = t.rest._zod.run({
					value: n,
					issues: []
				}, a);
				r instanceof Promise ? s.push(r.then((t) => Gr(t, i, e))) : Gr(r, i, e);
			}
		}
		return s.length ? Promise.all(s).then(() => Kr(u, i, n, o, l)) : Kr(u, i, n, o, l);
	};
});
function Wr(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (!(t === "optin" ? e[n]._zod.optin !== void 0 : e[n]._zod.optout === "optional")) return n + 1;
	return 0;
}
function Gr(e, t, n) {
	e.issues.length && t.issues.push(...Oe(n, e.issues)), t.value[n] = e.value;
}
function Kr(e, t, n, r, i) {
	for (let a = 0; a < n.length; a++) {
		let o = e[a], s = a < r.length;
		if (!s && a >= i && n[a]._zod.optin === "optional") {
			t.value.length = a;
			break;
		}
		if (o.issues.length) {
			if (!s && a >= i) {
				t.value.length = a;
				break;
			}
			t.issues.push(...Oe(a, o.issues));
		}
		t.value[a] = o.value;
	}
	for (let e = t.value.length - 1; e >= r.length && n[e]._zod.optout === "optional" && t.value[e] === void 0; e--) t.value.length = e;
	return t;
}
var qr = /*@__PURE__*/ M("$ZodRecord", (e, t) => {
	jn.init(e, t);
	let n = nt.memoizer;
	n?.attach(e), e._zod.parse = (r, i) => {
		let a = r.value;
		if (!ue(a)) return r.issues.push({
			expected: "record",
			code: "invalid_type",
			input: a,
			inst: e
		}), r;
		let o = [], s = t.keyType._zod.values;
		if (s && !t.partial) {
			r.value = n ? n.alloc(e, r, {}, i) : {};
			let c = /* @__PURE__ */ new Set();
			for (let n of s) if (typeof n == "string" || typeof n == "number" || typeof n == "symbol") {
				if (c.add(typeof n == "number" ? n.toString() : n), n === "__proto__") continue;
				let s = t.keyType._zod.run({
					value: n,
					issues: []
				}, i);
				if (s instanceof Promise) throw Error("Async schemas not supported in object keys currently");
				if (s.issues.length) {
					r.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: s.issues.map((e) => Me(e, i, rt())),
						input: n,
						path: [n],
						inst: e
					});
					continue;
				}
				let l = s.value;
				if (l === "__proto__") continue;
				let u = t.valueType._zod.run({
					value: a[n],
					issues: []
				}, i);
				u instanceof Promise ? o.push(u.then((e) => {
					e.issues.length && r.issues.push(...Oe(n, e.issues)), r.value[l] = e.value;
				})) : (u.issues.length && r.issues.push(...Oe(n, u.issues)), r.value[l] = u.value);
			}
			let l;
			for (let e in a) if (!c.has(e)) {
				if (t.mode === "loose") {
					if (e === "__proto__") continue;
					r.value[e] = a[e];
				} else l ??= [], l.push(e);
			}
			l && l.length > 0 && r.issues.push({
				code: "unrecognized_keys",
				input: a,
				inst: e,
				keys: l,
				continue: !0
			});
		} else {
			r.value = n ? n.alloc(e, r, {}, i) : {};
			let c;
			for (let n of Reflect.ownKeys(a)) {
				if (n === "__proto__" || !Object.prototype.propertyIsEnumerable.call(a, n)) continue;
				let l = t.keyType._zod.run({
					value: n,
					issues: []
				}, i);
				if (l instanceof Promise) throw Error("Async schemas not supported in object keys currently");
				if (typeof n == "string" && sn.test(n) && l.issues.length) {
					let e = t.keyType._zod.run({
						value: Number(n),
						issues: []
					}, i);
					if (e instanceof Promise) throw Error("Async schemas not supported in object keys currently");
					e.issues.length === 0 && (l = e);
				}
				if (l.issues.length) {
					t.mode === "loose" ? r.value[n] = a[n] : s ? (c ??= [], c.push(n)) : r.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: l.issues.map((e) => Me(e, i, rt())),
						input: n,
						path: [n],
						inst: e
					});
					continue;
				}
				let u = l.value;
				if (u === "__proto__") continue;
				let d = t.valueType._zod.run({
					value: a[n],
					issues: []
				}, i);
				d instanceof Promise ? o.push(d.then((e) => {
					e.issues.length && r.issues.push(...Oe(n, e.issues)), r.value[u] = e.value;
				})) : (d.issues.length && r.issues.push(...Oe(n, d.issues)), r.value[u] = d.value);
			}
			c && c.length > 0 && r.issues.push({
				code: "unrecognized_keys",
				input: a,
				inst: e,
				keys: c,
				continue: !0
			});
		}
		return o.length ? Promise.all(o).then(() => r) : r;
	};
}), Jr = /*@__PURE__*/ M("$ZodEnum", (e, t) => {
	jn.init(e, t);
	let n = _(t.entries), r = new Set(n);
	e._zod.values = r, j(e, "pattern", (e) => {
		let t = _(e.def.entries).filter((e) => fe.has(typeof e));
		return RegExp(t.length ? `^(${t.map((e) => pe(e.toString())).join("|")})$` : "^[^\\s\\S]$");
	}), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), Yr = /*@__PURE__*/ M("$ZodLiteral", (e, t) => {
	jn.init(e, t);
	let n = new Set(t.values);
	e._zod.values = n, j(e, "pattern", (e) => {
		let t = e.def.values;
		return RegExp(t.length ? `^(${t.map((e) => typeof e == "string" ? pe(e) : e ? pe(e.toString()) : String(e)).join("|")})$` : "^[^\\s\\S]$");
	}), e._zod.parse = (r, i) => {
		let a = r.value;
		return n.has(a) || r.issues.push({
			code: "invalid_value",
			values: t.values,
			input: a,
			inst: e
		}), r;
	};
}), Xr = /*@__PURE__*/ M("$ZodTransform", (e, t) => {
	jn.init(e, t), e._zod.optin = "optional", nt.memoizer?.guard(e), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new tt(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n));
		if (i instanceof Promise) throw new et();
		return n.value = i, n;
	};
});
function Zr(e, t) {
	return e.value = t.issues.length ? void 0 : t.value, e;
}
var Qr = /*@__PURE__*/ M("$ZodOptional", (e, t) => {
	jn.init(e, t), j(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), e._zod.optout = "optional", j(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? /* @__PURE__ */ new Set([...t, void 0]) : void 0;
	}), j(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${C(t.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (e.value === void 0) {
			if (t.innerType._zod.optin !== "defaulted") return e;
			let r = t.innerType._zod.run({
				value: e.value,
				issues: []
			}, n);
			return r instanceof Promise ? r.then((t) => Zr(e, t)) : Zr(e, r);
		}
		return t.innerType._zod.run(e, n);
	};
}), $r = /*@__PURE__*/ M("$ZodExactOptional", (e, t) => {
	Qr.init(e, t), j(e, "values", (e) => e.def.innerType._zod.values), j(e, "pattern", (e) => e.def.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), ei = /*@__PURE__*/ M("$ZodNullable", (e, t) => {
	jn.init(e, t), j(e, "optin", (e) => e.def.innerType._zod.optin), j(e, "optout", (e) => e.def.innerType._zod.optout), j(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${C(t.source)}|null)$`) : void 0;
	}), j(e, "values", (e) => e.def.innerType._zod.values ? /* @__PURE__ */ new Set([...e.def.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), ti = /*@__PURE__*/ M("$ZodDefault", (e, t) => {
	jn.init(e, t), e._zod.optin = "defaulted", j(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => ni(e, t)) : ni(r, t);
	};
});
function ni(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var ri = /*@__PURE__*/ M("$ZodPrefault", (e, t) => {
	jn.init(e, t), e._zod.optin = "defaulted", j(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), ii = /*@__PURE__*/ M("$ZodNonOptional", (e, t) => {
	jn.init(e, t), j(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? new Set([...t].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => ai(t, e)) : ai(i, e);
	};
});
function ai(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
function oi(e, t, n, r) {
	return t.issues.length ? (e.value = n.catchValue({
		...t,
		value: e.value,
		error: { issues: t.issues.map((e) => Me(e, r, rt())) },
		input: e.value
	}), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
}
var si = /*@__PURE__*/ M("$ZodCatch", (e, t) => {
	jn.init(e, t), j(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), j(e, "optout", (e) => e.def.innerType._zod.optout), j(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run({
			value: e.value,
			issues: []
		}, n);
		return r instanceof Promise ? r.then((r) => oi(e, r, t, n)) : oi(e, r, t, n);
	};
}), ci = /*@__PURE__*/ M("$ZodPipe", (e, t) => {
	jn.init(e, t), j(e, "values", (e) => e.def.in._zod.values), j(e, "optin", (e) => e.def.in._zod.optin), j(e, "optout", (e) => e.def.out._zod.optout), j(e, "propValues", (e) => e.def.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => li(e, t.in, n)) : li(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => li(e, t.out, n)) : li(r, t.out, n);
	};
});
function li(e, t, n) {
	return e.issues.some((e) => e.code !== "unrecognized_keys") ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues
	}, n);
}
var ui = /*@__PURE__*/ M("$ZodPreprocess", (e, t) => {
	ci.init(e, t);
}), di = /*@__PURE__*/ M("$ZodReadonly", (e, t) => {
	jn.init(e, t), j(e, "propValues", (e) => e.def.innerType._zod.propValues), j(e, "values", (e) => e.def.innerType._zod.values), j(e, "optin", (e) => e.def.innerType?._zod?.optin), j(e, "optout", (e) => e.def.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(fi) : fi(r);
	};
});
function fi(e) {
	return e.memo || (e.value = Object.freeze(e.value)), e;
}
var pi = /*@__PURE__*/ M("$ZodCustom", (e, t) => {
	dn.init(e, t), jn.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => mi(t, n, r, e));
		mi(i, n, r, e);
	};
});
function mi(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(Le(e));
	}
}
// node_modules/zod/v4/core/memoizer.js
var hi = class extends Error {
	constructor() {
		super("Cannot parse a reference cycle that closes through a transform"), this.name = "ZodCyclicError";
	}
}, gi = "~memo", _i = [];
function vi(e) {
	return typeof e == "object" && !!e;
}
function yi(e) {
	return e.map((e) => e.path ? {
		...e,
		path: e.path.slice()
	} : { ...e });
}
var bi = /*@__PURE__*/ new WeakMap(), xi = 0, Si = 1, Ci = 2;
function wi(e, t, n) {
	let r = bi.get(e);
	if (r !== void 0) return r ? Ci : xi;
	if (t.has(e)) return Ci;
	t.add(e);
	let i = xi, a = (e) => {
		if (i !== Ci && e?._zod) {
			let r = wi(e, t, n);
			r > i && (i = r);
		}
	}, o = (e, r) => {
		let i = xi;
		for (let a of Reflect.ownKeys(e)) {
			let o = Object.getOwnPropertyDescriptor(e, a);
			if (r && !o.enumerable) continue;
			let s = o.get ? Si : o.value?._zod ? wi(o.value, t, n) : xi;
			s > i && (i = s);
		}
		return i;
	}, s = (e) => {
		e > i && (i = e);
	}, c = e._zod.def;
	switch (c.type) {
		case "object": {
			let e = E(c);
			s(e ? o(e, !0) : Si), a(c.catchall);
			break;
		}
		case "array":
			a(c.element);
			break;
		case "tuple":
			for (let e of c.items) a(e);
			a(c.rest);
			break;
		case "record":
		case "map":
			a(c.keyType), a(c.valueType);
			break;
		case "set":
			a(c.valueType);
			break;
		case "union":
			for (let e of c.options) a(e);
			break;
		case "intersection":
			a(c.left), a(c.right);
			break;
		case "optional":
		case "nullable":
		case "default":
		case "prefault":
		case "catch":
		case "readonly":
		case "nonoptional":
		case "promise":
		case "success":
			a(c.innerType);
			break;
		case "pipe":
			a(c.in), a(c.out);
			break;
		case "function":
			a(c.input), a(c.output);
			break;
		case "lazy": {
			let r = c._cachedInner ?? (n ? e._zod.innerType : void 0);
			s(r ? wi(r, t, !1) : Si);
			break;
		}
		case "template_literal":
		case "string":
		case "number":
		case "int":
		case "boolean":
		case "bigint":
		case "symbol":
		case "undefined":
		case "null":
		case "void":
		case "never":
		case "any":
		case "unknown":
		case "date":
		case "nan":
		case "enum":
		case "literal":
		case "file":
		case "transform":
		case "custom": break;
		default: for (let e in c) {
			let t = Object.getOwnPropertyDescriptor(c, e);
			if (!t || t.get) continue;
			let n = t.value;
			if (n && typeof n == "object") {
				if (n._zod) a(n);
				else if (Array.isArray(n)) for (let e of n) a(e);
			}
		}
	}
	return t.delete(e), Ti(e, i);
}
function Ti(e, t) {
	return t !== Si && bi.set(e, t === Ci), t;
}
function Ei(e, t) {
	let n = e.buckets.get(t);
	return n || (n = /* @__PURE__ */ new WeakMap(), e.buckets.set(t, n)), n;
}
var Di, Oi = [], ki = {
	alloc(e, t, n) {
		let r = Di;
		if (!r) return n;
		Di = void 0;
		let i = {
			value: n,
			issues: null
		};
		return r.set(t.value, i), Oi.push(i), n;
	},
	guard(e) {
		var t;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, n = (e, n) => {
				if (n.direction !== "backward" && ji(n, e.value)) throw new hi();
				return t(e, n);
			};
			e._zod.parse = n, e._zod.run === t && (e._zod.run = n);
		});
	},
	attach(e) {
		var t;
		let n, r = !1, i, a;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, o = (s, c) => {
				if (n === void 0) {
					let i = wi(e, /* @__PURE__ */ new Set(), !1);
					if (i === xi) return e._zod.parse = t, e._zod.run === o && (e._zod.run = t), t(s, c);
					i === Ci || r ? n = !0 : r = !0;
				}
				let l = s.value;
				if (!vi(l)) return t(s, c);
				let u = c[gi];
				u || (u = {
					buckets: /* @__PURE__ */ new WeakMap(),
					backEdges: void 0
				}, c[gi] = u);
				let d;
				i === c ? d = a : (d = Ei(u, e), i = c, a = d);
				let f = d.get(l);
				if (f) return s.value = f.value, f.issues ? f.issues.length && s.issues.push(...yi(f.issues)) : (s.memo = !0, u.backEdges ?? (u.backEdges = /* @__PURE__ */ new WeakSet()), u.backEdges.add(f.value)), s;
				Di = d;
				let p = Oi.length, m = t(s, c);
				Di = void 0;
				let h = Oi.length > p ? Oi.pop() : void 0;
				return m instanceof Promise ? m.then((e) => (h && (h.issues = e.issues.length ? yi(e.issues) : _i), e)) : (h && (h.issues = m.issues.length ? yi(m.issues) : _i), m);
			};
			e._zod.parse = o, e._zod.run === t && (e._zod.run = o);
		});
	}
};
function Ai() {
	return ki;
}
function ji(e, t) {
	let n = e[gi]?.backEdges;
	return n !== void 0 && vi(t) && n.has(t);
}
// node_modules/zod/v4/locales/en.js
var Mi = () => {
	let e = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function t(t) {
		return e[t] ?? null;
	}
	let n = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		currency_code: "currency code",
		credit_card: "credit card number",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	}, r = { nan: "NaN" };
	function i(e, t) {
		return e === "number" && typeof t == "number" && !Number.isFinite(t) ? String(t) : r[e] ?? e;
	}
	return (e) => {
		switch (e.code) {
			case "invalid_type": return `Invalid input: expected ${i(e.expected)}, received ${i(Ie(e.input), e.input)}`;
			case "invalid_value": return e.values.length === 1 ? `Invalid input: expected ${he(e.values[0])}` : `Invalid option: expected one of ${v(e.values, "|")}`;
			case "too_big": {
				let n = e.exact ? "exactly " : e.inclusive ? "<=" : "<", r = t(e.origin);
				return r ? `Too big: expected ${e.origin ?? "value"} to have ${n}${e.maximum.toString()} ${r.unit ?? "elements"}` : `Too big: expected ${e.origin ?? "value"} to be ${n}${e.maximum.toString()}`;
			}
			case "too_small": {
				let n = e.exact ? "exactly " : e.inclusive ? ">=" : ">", r = t(e.origin);
				return r ? `Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}` : `Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`;
			}
			case "invalid_format": {
				let t = e;
				return t.format === "starts_with" ? `Invalid string: must start with "${t.prefix}"` : t.format === "ends_with" ? `Invalid string: must end with "${t.suffix}"` : t.format === "includes" ? `Invalid string: must include "${t.includes}"` : t.format === "regex" ? `Invalid string: must match pattern ${t.pattern}` : `Invalid ${n[t.format] ?? e.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${e.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${e.keys.length > 1 ? "s" : ""}: ${v(e.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${e.origin}`;
			case "invalid_union": return e.options && Array.isArray(e.options) && e.options.length > 0 ? `Invalid discriminator value. Expected ${e.options.map((e) => `'${e}'`).join(" | ")}` : e.inclusive === !1 ? "Invalid input: more than one option matched" : "Invalid input";
			case "invalid_element": return `Invalid value in ${e.origin}`;
			default: return "Invalid input";
		}
	};
};
function Ni() {
	return { localeError: Mi() };
}
// node_modules/zod/v4/core/registries.js
var Pi, Fi = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
	}
	add(e, ...t) {
		let n = t[0];
		return this._map.set(e, n), n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e), this;
	}
	clear() {
		return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
	}
	remove(e) {
		let t = this._map.get(e);
		return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
	}
	get(e) {
		let t = e._zod.parent;
		if (t) {
			let n = { ...this.get(t) ?? {} };
			delete n.id;
			let r = {
				...n,
				...this._map.get(e)
			};
			return Object.keys(r).length ? r : void 0;
		}
		return this._map.get(e);
	}
	has(e) {
		return this._map.has(e);
	}
};
function Ii() {
	return new Fi();
}
(Pi = globalThis).__zod_globalRegistry ?? (Pi.__zod_globalRegistry = Ii());
var Li = globalThis.__zod_globalRegistry;
// node_modules/zod/v4/core/api.js
function Ri(e) {
	return e.checks &&= [...e.checks], e;
}
// @__NO_SIDE_EFFECTS__
function zi(e, t) {
	return new e(Ri({
		type: "string",
		...O(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function Bi(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Vi(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Hi(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ui(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Wi(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Gi(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ki(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function qi(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ji(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Yi(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Xi(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Zi(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Qi(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function $i(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ea(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ta(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function na(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ra(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ia(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function aa(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function oa(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function sa(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ca(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function la(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function F(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ua(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function da(e, t) {
	return new e(Ri({
		type: "number",
		checks: [],
		...O(t)
	}));
}
// @__NO_SIDE_EFFECTS__
function fa(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function pa(e, t) {
	return new e({
		type: "boolean",
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ma(e) {
	return new e({ type: "any" });
}
// @__NO_SIDE_EFFECTS__
function ha(e) {
	return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function ga(e, t) {
	return new e({
		type: "never",
		...O(t)
	});
}
// @__NO_SIDE_EFFECTS__
function _a(e, t) {
	return new mn({
		check: "less_than",
		...O(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function va(e, t) {
	return new mn({
		check: "less_than",
		...O(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function ya(e, t) {
	return new hn({
		check: "greater_than",
		...O(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function ba(e, t) {
	return new hn({
		check: "greater_than",
		...O(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function xa(e, t) {
	return new gn({
		check: "multiple_of",
		...O(t),
		value: e
	});
}
// @__NO_SIDE_EFFECTS__
function Sa(e, t) {
	return new vn({
		check: "max_length",
		...O(t),
		maximum: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ca(e, t) {
	return new yn({
		check: "min_length",
		...O(t),
		minimum: e
	});
}
// @__NO_SIDE_EFFECTS__
function wa(e, t) {
	return new bn({
		check: "length_equals",
		...O(t),
		length: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ta(e, t) {
	return new Sn({
		check: "string_format",
		format: "regex",
		...O(t),
		pattern: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ea(e) {
	return new Cn({
		check: "string_format",
		format: "lowercase",
		...O(e)
	});
}
// @__NO_SIDE_EFFECTS__
function Da(e) {
	return new wn({
		check: "string_format",
		format: "uppercase",
		...O(e)
	});
}
// @__NO_SIDE_EFFECTS__
function Oa(e, t) {
	return new Tn({
		check: "string_format",
		format: "includes",
		...O(t),
		includes: e
	});
}
// @__NO_SIDE_EFFECTS__
function ka(e, t) {
	return new En({
		check: "string_format",
		format: "starts_with",
		...O(t),
		prefix: e
	});
}
// @__NO_SIDE_EFFECTS__
function Aa(e, t) {
	return new Dn({
		check: "string_format",
		format: "ends_with",
		...O(t),
		suffix: e
	});
}
// @__NO_SIDE_EFFECTS__
function ja(e) {
	return new On({
		check: "overwrite",
		tx: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ma(e) {
	return /* @__PURE__ */ ja((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Na() {
	return /* @__PURE__ */ ja((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Pa() {
	return /* @__PURE__ */ ja((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function Fa() {
	return /* @__PURE__ */ ja((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Ia() {
	return /* @__PURE__ */ ja((e) => oe(e));
}
// @__NO_SIDE_EFFECTS__
function La(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...O(n)
	});
}
// @__NO_SIDE_EFFECTS__
function Ra(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...O(n)
	});
}
// @__NO_SIDE_EFFECTS__
function za(e, t) {
	let n = /* @__PURE__ */ Ba((t) => (t.addIssue = (e) => {
		if (typeof e == "string") t.issues.push(Le(e, t.value, n._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= "custom", "input" in r || (r.input = t.value), r.inst ??= n, r.continue ??= !n._zod.def.abort, t.issues.push(Le(r));
		}
	}, e(t.value, t)), t);
	return n;
}
// @__NO_SIDE_EFFECTS__
function Ba(e, t) {
	let n = new dn({
		check: "custom",
		...O(t)
	});
	return n._zod.check = e, n;
}
// node_modules/zod/v4/core/to-json-schema.js
function Va(e, ...t) {
	for (let n of t) for (let t of Reflect.ownKeys(n)) Object.prototype.propertyIsEnumerable.call(n, t) && T(e, t, n[t]);
	return e;
}
function Ha(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? Li,
		target: t,
		unrepresentable: e?.unrepresentable ?? "throw",
		override: e?.override ?? (() => {}),
		io: e?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		intersections: [],
		deferred: [],
		external: e?.external ?? void 0
	};
}
function Ua(e, t, n, r, i) {
	let a = typeof t.unrepresentable == "function" ? t.unrepresentable({
		zodSchema: e,
		path: r.path,
		message: i
	}) : t.unrepresentable;
	if (a === "any") return !1;
	if (a === void 0 || a === "throw") throw Error(i);
	return Object.assign(n, a), !0;
}
function I(e, t, n = {
	path: [],
	schemaPath: []
}) {
	var r;
	let i = e._zod.def, a = t.seen.get(e);
	if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
	let o = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: n.path
	};
	t.seen.set(e, o), t.sharedDefsExtractedFor = void 0, t.sharedEmitDoneFor = void 0;
	let s = e._zod.toJSONSchema?.();
	if (s) o.schema = s;
	else {
		let r = {
			...n,
			schemaPath: [...n.schemaPath, e],
			path: n.path
		};
		if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
		else {
			let n = o.schema, a = t.processors[i.type];
			if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
			a(e, t, n, r);
		}
		let a = e._zod.parent;
		a && (o.ref ||= a, I(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && Va(o.schema, c), t.io === "input" && $a(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && "_prefault" in o.schema && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function Wa(e) {
	return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Ga(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	if (e.external && e.sharedDefsExtractedFor === e.external) return;
	let r = /* @__PURE__ */ new Map();
	for (let t of e.seen.entries()) {
		let n = e.metadataRegistry.get(t[0])?.id;
		if (n) {
			let e = r.get(n);
			if (e && e !== t[0]) throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			r.set(n, t[0]);
		}
	}
	let i = (t) => {
		let r = e.target === "draft-2020-12" ? "$defs" : "definitions";
		if (e.external) {
			let n = e.external.registry.get(t[0])?.id, i = e.external.uri ?? ((e) => e);
			if (n) return { ref: i(n) };
			let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
			return t[1].defId = a, {
				defId: a,
				ref: `${i("__shared")}#/${r}/${Wa(a)}`
			};
		}
		let i = `#/${r}/`;
		if (t[1] === n && !t[1].schema.id) return { ref: "#" };
		let a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + Wa(a)
		};
	}, a = (e) => {
		if (e[1].schema.$ref) return;
		let t = e[1], { ref: n, defId: r } = i(e);
		t.def = { ...t.schema }, r && (t.defId = r);
		let a = t.schema;
		for (let e in a) delete a[e];
		a.$ref = n;
	};
	if (e.cycles === "throw") for (let t of e.seen.entries()) {
		let e = t[1];
		if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (let n of e.seen.entries()) {
		let r = n[1];
		if (t === n[0]) a(n);
		else {
			if (e.external) {
				let r = e.external.registry.get(n[0])?.id;
				if (t !== n[0] && r) {
					a(n);
					continue;
				}
			}
			(e.metadataRegistry.get(n[0])?.id || r.cycle || r.count > 1 && e.reused === "ref") && a(n);
		}
	}
	e.external && (e.sharedDefsExtractedFor = e.external);
}
function Ka(e) {
	let t = e.anyOf;
	if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
	let n = [];
	for (let e of t) {
		if (!e || typeof e != "object") return;
		Ka(e);
		let t = Object.keys(e);
		if (t.length !== 1 || t[0] !== "type") return;
		let r = e.type;
		for (let e of Array.isArray(r) ? r : [r]) {
			if (typeof e != "string") return;
			n.includes(e) || n.push(e);
		}
	}
	delete e.anyOf, e.type = n.length === 1 ? n[0] : n;
}
var qa = /* @__PURE__ */ new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]), Ja = ["oneOf", "anyOf"];
function Ya(e) {
	let t = e.additionalProperties;
	return t === void 0 || t === !1 || typeof t != "object" || !t ? null : Object.keys(t).length ? t : null;
}
function Xa(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "object" || n.type !== "object") return null;
		for (let e in n) if (!qa.has(e)) return null;
		t.push(n);
	}
	let n = {}, r = /* @__PURE__ */ new Set();
	for (let e of t) {
		for (let r in e.properties) {
			if (Object.prototype.hasOwnProperty.call(n, r)) continue;
			let e = [];
			for (let n of t) {
				let t = n.properties?.[r] ?? Ya(n);
				t != null && (e.some((e) => JSON.stringify(e) === JSON.stringify(t)) || e.push(t));
			}
			T(n, r, e.length === 1 ? e[0] : Xa(e) ?? { allOf: e });
		}
		for (let t of e.required ?? []) r.add(t);
	}
	let i = {
		type: "object",
		properties: n
	};
	if (r.size && (i.required = [...r]), t.every((e) => e.additionalProperties === !1)) i.additionalProperties = !1;
	else {
		let e = [];
		for (let n of t) {
			let t = Ya(n);
			t && !e.some((e) => JSON.stringify(e) === JSON.stringify(t)) && e.push(t);
		}
		e.length === 1 ? i.additionalProperties = e[0] : e.length > 1 && (i.additionalProperties = { allOf: e });
	}
	return i;
}
function Za(e) {
	let t = e.allOf;
	if (!Array.isArray(t) || t.length < 2) return;
	for (let t of qa) if (t in e) return;
	let n = t.filter((e) => Ja.some((t) => Array.isArray(e[t]))), r = null;
	if (!n.length) r = Xa(t);
	else {
		let e = n[0], i = Ja.find((t) => Array.isArray(e[t]));
		if (Object.keys(e).length !== 1) return;
		let a = t.filter((t) => t !== e), o = e[i].map((e) => Xa([...a, e]));
		if (o.some((e) => !e)) return;
		r = { [i]: o };
	}
	r && (delete e.allOf, Va(e, r));
}
function Qa(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : Va(i, s), Va(i, a), t._zod.parent === o) for (let e in i) e !== "$ref" && e !== "allOf" && (e in a || delete i[e]);
			if (s.$ref && n.def) for (let e in i) e !== "$ref" && e !== "allOf" && e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e !== "$ref" && e !== "allOf" && e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	if (!e.external || e.sharedEmitDoneFor !== e.external) {
		for (let t of [...e.seen.entries()].reverse()) r(t[0]);
		if (e.target !== "openapi-3.0") for (let t of e.seen.entries()) Ka(t[1].def ?? t[1].schema);
		for (let t of e.deferred) t();
		if (e.intersections.length) {
			let t = /* @__PURE__ */ new Map();
			for (let n of e.seen.values()) for (let e of [n.schema, n.def]) {
				let n = e?.allOf;
				if (!Array.isArray(n)) continue;
				let r = t.get(n);
				r ? r.push(e) : t.set(n, [e]);
			}
			for (let n of e.intersections) for (let e of t.get(n) ?? []) Za(e);
		}
	}
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	Va(i, n.defId ? n.schema : n.def ?? n.schema);
	let a = e.metadataRegistry.get(t)?.id;
	a !== void 0 && i.id === a && delete i.id;
	let o = e.external?.defs ?? {};
	if (!e.external || e.sharedEmitDoneFor !== e.external) for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (e.def.id === e.defId && delete e.def.id, T(o, e.defId, e.def));
	}
	e.external && (e.sharedEmitDoneFor = e.external), e.external || Object.keys(o).length > 0 && (e.target === "draft-2020-12" ? i.$defs = o : i.definitions = o);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: to(t, "input", e.processors),
					output: to(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function $a(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return $a(r.element, n);
	if (r.type === "set") return $a(r.valueType, n);
	if (r.type === "lazy") return $a(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault" || r.type === "catch") return $a(r.innerType, n);
	if (r.type === "intersection") return $a(r.left, n) || $a(r.right, n);
	if (r.type === "record" || r.type === "map") return $a(r.keyType, n) || $a(r.valueType, n);
	if (r.type === "pipe") return e._zod.traits.has("$ZodCodec") ? !0 : $a(r.in, n) || $a(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if ($a(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if ($a(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if ($a(e, n)) return !0;
		return !!(r.rest && $a(r.rest, n));
	}
	return !1;
}
var eo = (e, t = {}) => (n) => {
	let r = Ha({
		...n,
		processors: t
	});
	return I(e, r), Ga(r, e), Qa(r, e);
}, to = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = Ha({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return I(e, o), Ga(o, e), Qa(o, e);
}, no = (e, t, n) => {
	(e[t] === void 0 || n > e[t]) && (e[t] = n);
}, ro = (e, t, n) => {
	(e[t] === void 0 || n < e[t]) && (e[t] = n);
}, io = (e, t) => {
	no(e, "minimum", t), ro(e, "maximum", t);
}, ao = (e, t) => {
	e.multipleOf ??= [], e.multipleOf.includes(t) || e.multipleOf.push(t);
}, oo = (e, t) => {
	e.patterns ??= /* @__PURE__ */ new Set(), e.patterns.add(t);
}, so = (e, t) => {
	e.mime = e.mime ? e.mime.filter((e) => t.includes(e)) : [...t];
}, co = (e, t) => {
	e.format = t, t.includes("int") && (e.isInt = !0);
}, lo = (e, t) => no(e, "minimum", t.minimum), uo = (e, t) => ro(e, "maximum", t.maximum), fo = (e) => (t, n) => {
	co(t, n.format);
	let [r, i] = e[n.format];
	no(t, "minimum", r), ro(t, "maximum", i);
}, po = {
	greater_than: (e, t) => no(e, t.inclusive ? "minimum" : "exclusiveMinimum", t.value),
	less_than: (e, t) => ro(e, t.inclusive ? "maximum" : "exclusiveMaximum", t.value),
	multiple_of: (e, t) => ao(e, t.value),
	number_format: fo(_e),
	bigint_format: fo(ve),
	min_length: lo,
	max_length: uo,
	length_equals: (e, t) => io(e, t.length),
	min_size: lo,
	max_size: uo,
	size_equals: (e, t) => io(e, t.size),
	string_format: (e, t) => {
		co(e, t.format), t.pattern && oo(e, t.pattern), (t.format === "base64" || t.format === "base64url") && (e.contentEncoding = t.format), (t.local || t.precision === -1) && (e.laxFormat = !0);
	},
	mime_type: (e, t) => so(e, t.mime)
};
function mo(e) {
	let t = {}, n = e._zod.def, r = e._zod.traits.has("$ZodCheck") ? [e, ...n.checks ?? []] : n.checks ?? [];
	for (let e of r) po[e._zod.def.check]?.(t, e._zod.def);
	let i = e._zod.bag;
	i.minimum !== void 0 && no(t, "minimum", i.minimum), i.exclusiveMinimum !== void 0 && no(t, "exclusiveMinimum", i.exclusiveMinimum), i.maximum !== void 0 && ro(t, "maximum", i.maximum), i.exclusiveMaximum !== void 0 && ro(t, "exclusiveMaximum", i.exclusiveMaximum), i.multipleOf !== void 0 && ao(t, i.multipleOf), i.format !== void 0 && (t.format ??= i.format, i.format.includes("int") && (t.isInt = !0)), i.mime && so(t, i.mime);
	for (let e of i.patterns ?? []) oo(t, e);
	return t;
}
var ho = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, go = /* @__PURE__ */ new Map([[fr, Yt], [mr, Xt]]), _o = (e) => go.get(e) ?? e, vo = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l, laxFormat: u } = mo(e);
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = ho[s] ?? s, i.format === "" && delete i.format, (s === "time" || u) && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c].map(_o);
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, yo = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, multipleOf: s, exclusiveMaximum: c, exclusiveMinimum: l, isInt: u } = mo(e);
	i.type = u ? "integer" : "number";
	let d = typeof l == "number" && l >= (a ?? -Infinity), f = typeof c == "number" && c <= (o ?? Infinity), p = t.target === "draft-04" || t.target === "openapi-3.0";
	if (d ? p ? (i.minimum = l, i.exclusiveMinimum = !0) : i.exclusiveMinimum = l : typeof a == "number" && (i.minimum = a), f ? p ? (i.maximum = c, i.exclusiveMaximum = !0) : i.exclusiveMaximum = c : typeof o == "number" && (i.maximum = o), s) {
		let n = /* @__PURE__ */ new Set();
		for (let a of s) Number.isFinite(a) && a !== 0 ? n.add(Math.abs(a)) : Ua(e, t, i, r, `A multipleOf divisor of ${a} cannot be represented in JSON Schema`);
		let [a, ...o] = n;
		a !== void 0 && (i.multipleOf = a), o.length && (i.allOf = [...i.allOf ?? [], ...o.map((e) => ({ multipleOf: e }))]);
	}
}, bo = (e, t, n, r) => {
	n.type = "boolean";
}, xo = (e, t, n, r) => {
	Ua(e, t, n, r, "BigInt cannot be represented in JSON Schema");
}, So = (e, t, n, r) => {
	Ua(e, t, n, r, "Symbols cannot be represented in JSON Schema");
}, Co = (e, t, n, r) => {
	t.target === "openapi-3.0" ? (n.type = "string", n.nullable = !0, n.enum = [null]) : n.type = "null";
}, wo = (e, t, n, r) => {
	Ua(e, t, n, r, "Undefined cannot be represented in JSON Schema");
}, To = (e, t, n, r) => {
	Ua(e, t, n, r, "Void cannot be represented in JSON Schema");
}, Eo = (e, t, n, r) => {
	n.not = {};
}, Do = (e, t, n, r) => {}, Oo = (e, t, n, r) => {}, ko = (e, t, n, r) => {
	Ua(e, t, n, r, "Date cannot be represented in JSON Schema");
}, Ao = (e, t, n, r) => {
	let i = e._zod.def, a = _(i.entries);
	a.length === 0 ? n.not = {} : (a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a);
}, jo = (e, t, n, r) => {
	let i = e._zod.def;
	if (i.values.length === 0) {
		n.not = {};
		return;
	}
	let a = [];
	for (let o of i.values) if (o === void 0) {
		if (Ua(e, t, n, r, "Literal `undefined` cannot be represented in JSON Schema")) return;
	} else if (typeof o == "bigint") {
		if (Ua(e, t, n, r, "BigInt literals cannot be represented in JSON Schema")) return;
		a.push(Number(o));
	} else a.push(o);
	if (a.length !== 0) {
		if (a.length === 1) {
			let e = a[0];
			n.type = e === null ? "null" : typeof e, t.target === "draft-04" || t.target === "openapi-3.0" ? n.enum = [e] : n.const = e;
		} else a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), a.every((e) => typeof e == "boolean") && (n.type = "boolean"), a.every((e) => e === null) && (n.type = "null"), n.enum = a;
	}
}, Mo = (e, t, n, r) => {
	Ua(e, t, n, r, "NaN cannot be represented in JSON Schema");
}, No = (e, t, n, r) => {
	let i = n, a = e._zod.pattern;
	if (!a) throw Error("Pattern not found in template literal");
	i.type = "string", i.pattern = a.source;
}, Po = (e, t, n, r) => {
	let i = n;
	i.type = "string", i.format = "binary", i.contentEncoding = "binary";
	let { minimum: a, maximum: o, mime: s } = mo(e);
	a !== void 0 && (i.minLength = a), o !== void 0 && (i.maxLength = o), s && (s.length === 0 ? i.not = {} : s.length === 1 ? i.contentMediaType = s[0] : i.anyOf = s.map((e) => ({ contentMediaType: e })));
}, Fo = (e, t, n, r) => {
	n.type = "boolean";
}, Io = (e, t, n, r) => {
	Ua(e, t, n, r, "Custom types cannot be represented in JSON Schema");
}, Lo = (e, t, n, r) => {
	Ua(e, t, n, r, "Function types cannot be represented in JSON Schema");
}, Ro = (e, t, n, r) => {
	Ua(e, t, n, r, "Transforms cannot be represented in JSON Schema");
}, zo = (e, t, n, r) => {
	Ua(e, t, n, r, "Map cannot be represented in JSON Schema");
}, Bo = (e, t, n, r) => {
	Ua(e, t, n, r, "Set cannot be represented in JSON Schema");
}, Vo = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = mo(e);
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = I(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
};
function Ho(e) {
	let t = e._zod.def;
	return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform") ? Ho(t.out) : t.type === "catch" ? Ho(t.innerType) : e._zod.optin;
}
var Uo = (e, t, n, r) => {
	let i = n, a = e._zod.def, o = a.shape;
	if (Object.getOwnPropertySymbols(o).length && Ua(e, t, i, r, "Symbol keys cannot be represented in JSON Schema")) return;
	i.type = "object", i.properties = {};
	for (let e in o) T(i.properties, e, I(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	}));
	let s = [];
	for (let e of Object.keys(o)) {
		let n = a.shape[e];
		(t.io === "input" ? Ho(n) === void 0 : n._zod.optout === void 0) && s.push(e);
	}
	s.length > 0 && (i.required = s), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = I(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, Wo = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => I(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, Go = (e, t, n, r) => {
	let i = e._zod.def, a = I(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = I(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1, c = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
	n.allOf = c, t.intersections.push(c);
}, Ko = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "array";
	let o = t.target === "draft-2020-12" ? "prefixItems" : "items", s = t.target === "draft-2020-12" || t.target === "openapi-3.0" ? "items" : "additionalItems", c = a.items.map((e, n) => I(e, t, {
		...r,
		path: [
			...r.path,
			o,
			n
		]
	})), l = a.rest ? I(a.rest, t, {
		...r,
		path: [
			...r.path,
			s,
			...t.target === "openapi-3.0" ? [a.items.length] : []
		]
	}) : null, u = a.items.length;
	for (; u > 0;) {
		let e = a.items[u - 1];
		if (!(t.io === "input" ? Ho(e) !== void 0 : e._zod.optout === "optional")) break;
		u--;
	}
	let d = a.items.length, f = !a.rest;
	t.target === "draft-2020-12" ? (i.prefixItems = c, f ? i.items = !1 : l && (i.items = l), u > 0 && (i.minItems = u), f && (i.maxItems = d)) : t.target === "openapi-3.0" ? (i.items = { anyOf: c }, l && i.items.anyOf.push(l), u > 0 && (i.minItems = u), f && (i.maxItems = d)) : (i.items = c, f ? i.additionalItems = !1 : l && (i.additionalItems = l), u > 0 && (i.minItems = u), f && (i.maxItems = d));
	let { minimum: p, maximum: m } = mo(e);
	typeof p == "number" && (i.minItems = p), typeof m == "number" && (i.maxItems = m);
};
function L(e, t, n) {
	if (t.$ref) {
		if (n.has(t)) return t;
		n.add(t);
		let r = e.get(t)?.def;
		if (!r) return t;
		let i = L(e, r, n);
		return i === r ? t : i;
	}
	for (let r of ["anyOf", "oneOf"]) {
		let i = t[r];
		if (!Array.isArray(i)) continue;
		let a = i.map((t) => L(e, t, n));
		a.some((e, t) => e !== i[t]) && (t = {
			...t,
			[r]: a
		});
	}
	let r = Array.isArray(t.type) ? t.type : [t.type], i = !r.includes("string") && r.some((e) => e === "number" || e === "integer"), a = t.enum ?? (t.const === void 0 ? void 0 : [t.const]);
	if (!i && !a?.some((e) => typeof e == "number")) return t;
	let { minimum: o, maximum: s, exclusiveMinimum: c, exclusiveMaximum: l, multipleOf: u, format: d, id: f, ...p } = t;
	return p.enum ? p.enum = p.enum.map((e) => typeof e == "number" ? String(e) : e) : typeof p.const == "number" && (p.const = String(p.const)), i && (p.type = "string", a || (p.pattern = (r.includes("number") ? sn : on).source)), p;
}
var R = /* @__PURE__ */ new WeakMap();
function qo(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.seen.values()) n.def && !t.has(n.schema) && t.set(n.schema, n);
	let n = /* @__PURE__ */ new Map();
	for (let r of R.get(e) ?? []) {
		let i = e.seen.get(r), a = (i?.def ?? i?.schema)?.propertyNames;
		if (!a || a === !0 || n.has(a)) continue;
		let o = L(t, a, /* @__PURE__ */ new Set());
		o !== a && n.set(a, o);
	}
	if (n.size) for (let t of e.seen.values()) for (let e of [t.schema, t.def]) {
		let t = e && n.get(e.propertyNames);
		t && (e.propertyNames = t);
	}
}
var Jo = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "object";
	let o = a.keyType, s = mo(o).patterns;
	if (a.mode === "loose" && s && s.size > 0) {
		let e = I(a.valueType, t, {
			...r,
			path: [
				...r.path,
				"patternProperties",
				"*"
			]
		});
		i.patternProperties = {};
		for (let t of s) T(i.patternProperties, _o(t).source, e);
	} else {
		if (t.target === "draft-07" || t.target === "draft-2020-12") {
			i.propertyNames = I(a.keyType, t, {
				...r,
				path: [...r.path, "propertyNames"]
			});
			let n = R.get(t);
			n || (n = [], R.set(t, n), t.deferred.push(() => qo(t))), n.push(e);
		}
		i.additionalProperties = I(a.valueType, t, {
			...r,
			path: [...r.path, "additionalProperties"]
		});
	}
	let c = o._zod.values, l = t.io === "input" && Ho(a.valueType) !== void 0;
	if (c && !a.partial && !l) {
		let e = [...c].filter((e) => typeof e == "string" || typeof e == "number");
		e.length > 0 && (i.required = e.map(String));
	}
}, Yo = (e, t, n, r) => {
	let i = e._zod.def, a = I(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, Xo = (e, t, n, r) => {
	let i = e._zod.def;
	I(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Zo = Symbol();
function Qo(e, t, n, r, i) {
	let a = !1, o = JSON.stringify(e, (e, t) => typeof t == "bigint" ? (a = !0, null) : t);
	return a ? (Ua(t, n, r, i, "BigInt defaults cannot be represented in JSON Schema"), Zo) : JSON.parse(o);
}
var $o = (e, t, n, r) => {
	let i = e._zod.def;
	I(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o = Qo(i.defaultValue, e, t, n, r);
	o !== Zo && (n.default = o);
}, es = (e, t, n, r) => {
	let i = e._zod.def;
	I(i.innerType, t, r);
	let a = t.seen.get(e);
	if (a.ref = i.innerType, t.io !== "input") return;
	let o = Qo(i.defaultValue, e, t, n, r);
	o !== Zo && (n._prefault = o);
}, ts = (e, t, n, r) => {
	let i = e._zod.def;
	I(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		Ua(e, t, n, r, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	n.default = o;
}, ns = (e, t, n, r) => {
	let i = e._zod.def, a = i.in._zod.traits.has("$ZodTransform"), o = t.io === "input" ? a ? i.out : i.in : i.out;
	I(o, t, r);
	let s = t.seen.get(e);
	s.ref = o;
}, rs = (e, t, n, r) => {
	let i = e._zod.def;
	I(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, is = (e, t, n, r) => {
	let i = e._zod.def;
	I(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, as = (e, t, n, r) => {
	let i = e._zod.def;
	I(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, os = {
	string: vo,
	number: yo,
	boolean: bo,
	bigint: xo,
	symbol: So,
	null: Co,
	undefined: wo,
	void: To,
	never: Eo,
	any: Do,
	unknown: Oo,
	date: ko,
	enum: Ao,
	literal: jo,
	nan: Mo,
	template_literal: No,
	file: Po,
	success: Fo,
	custom: Io,
	function: Lo,
	transform: Ro,
	map: zo,
	set: Bo,
	array: Vo,
	object: Uo,
	union: Wo,
	intersection: Go,
	tuple: Ko,
	record: Jo,
	nullable: Yo,
	nonoptional: Xo,
	default: $o,
	prefault: es,
	catch: ts,
	pipe: ns,
	readonly: rs,
	promise: is,
	optional: as,
	lazy: (e, t, n, r) => {
		let i = e._zod.innerType;
		I(i, t, r);
		let a = t.seen.get(e);
		a.ref = i;
	}
};
function ss(e, t) {
	if ("_idmap" in e) {
		let n = e, r = Ha({
			...t,
			processors: os
		}), i = {};
		for (let e of n._idmap.entries()) {
			let [t, n] = e;
			I(n, r);
		}
		let a = {};
		r.external = {
			registry: n,
			uri: t?.uri,
			defs: i
		};
		for (let e of n._idmap.entries()) {
			let [t, n] = e;
			Ga(r, n), T(a, t, Qa(r, n));
		}
		return Object.keys(i).length > 0 && (a.__shared = { [r.target === "draft-2020-12" ? "$defs" : "definitions"]: i }), { schemas: a };
	}
	let n = Ha({
		...t,
		processors: os
	});
	return I(e, n), Ga(n, e), Qa(n, e);
}
// node_modules/zod/v4/classic/errors.js
var cs = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function ls(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = n(this);
			return Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	});
}
var us = /*@__PURE__*/ M("ZodError", (e, t) => {
	lt.init(e, t), e.name = "ZodError";
	let n = Object.getPrototypeOf(e);
	cs.has(n) || (cs.add(n), ls(n, "format", (e) => (t) => ft(e, t)), ls(n, "flatten", (e) => (t) => dt(e, t)), ls(n, "addIssue", (e) => (t) => {
		e.issues.push(t), e.message = JSON.stringify(e.issues, y, 2);
	}), ls(n, "addIssues", (e) => (t) => {
		e.issues.push(...t), e.message = JSON.stringify(e.issues, y, 2);
	}), Object.defineProperty(n, "isEmpty", {
		configurable: !0,
		enumerable: !1,
		get() {
			return this.issues.length === 0;
		}
	}));
}, void 0, { Parent: Error }), ds = /* @__PURE__ */ mt(us), fs = /* @__PURE__ */ ht(us), ps = /* @__PURE__ */ gt(us), ms = /* @__PURE__ */ vt(us), hs = /* @__PURE__ */ wt(us), gs = /* @__PURE__ */ Tt(us), _s = /* @__PURE__ */ Et(us), vs = /* @__PURE__ */ Dt(us), ys = /* @__PURE__ */ Ot(us), bs = /* @__PURE__ */ kt(us), xs = /* @__PURE__ */ At(us), Ss = /* @__PURE__ */ jt(us);
// node_modules/zod/v4/classic/schemas.js
function Cs() {
	nt.localeError || rt(Ni());
}
function ws() {
	nt.memoizer || rt({ memoizer: Ai() });
}
var Ts = /*@__PURE__*/ M("ZodType", (e, t) => (Cs(), jn.init(e, t), e.def = t, e.type = t.type, e), {
	check(...e) {
		let t = this.def;
		return this.clone(ie(t, { checks: [...t.checks ?? [], ...e.map((e) => typeof e == "function" ? { _zod: {
			check: e,
			def: { check: "custom" },
			onattach: []
		} } : e)] }), { parent: !0 });
	},
	with(...e) {
		return this.check(...e);
	},
	clone(e, t) {
		return me(this, e, t);
	},
	brand() {
		return this;
	},
	register(e, t) {
		return e.add(this, t), this;
	},
	refine(e, t) {
		return this.check(Xc(e, t));
	},
	superRefine(e, t) {
		return this.check(Zc(e, t));
	},
	overwrite(e) {
		return this.check(/* @__PURE__ */ ja(e));
	},
	optional() {
		return jc(this);
	},
	exactOptional() {
		return Nc(this);
	},
	nullable() {
		return Fc(this);
	},
	nullish() {
		return jc(Fc(this));
	},
	nonoptional(e) {
		return Vc(this, e);
	},
	array() {
		return fc(this);
	},
	or(e) {
		return hc([this, e]);
	},
	and(e) {
		return yc(this, e);
	},
	transform(e) {
		return Gc(this, kc(e));
	},
	default(e) {
		return Lc(this, e);
	},
	prefault(e) {
		return zc(this, e);
	},
	catch(e) {
		return Uc(this, e);
	},
	pipe(e) {
		return Gc(this, e);
	},
	readonly() {
		return Jc(this);
	},
	describe(e) {
		let t = this.clone();
		return Li.add(t, { description: e }), t;
	},
	meta(...e) {
		if (e.length === 0) return Li.get(this);
		let t = this.clone();
		return Li.add(t, e[0]), t;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(e, ...t) {
		return t.length === 0 ? e(this) : e(this, ...t);
	},
	get "~standard"() {
		return Be(this, "~standard", {
			...Pn(this),
			jsonSchema: {
				input: to(this, "input"),
				output: to(this, "output")
			}
		});
	},
	set "~standard"(e) {
		ze(this, "~standard", e);
	},
	parse: function e(t, n) {
		return ds(this, t, n, { callee: e });
	},
	parseAsync: async function e(t, n) {
		return await fs(this, t, n, { callee: e });
	},
	safeParse(e, t) {
		return ps(this, e, t);
	},
	async safeParseAsync(e, t) {
		return ms(this, e, t);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(e) {
		ze(this, "spa", e);
	},
	validate(e, t) {
		return xt(this, e, t);
	},
	validateAsync(e, t) {
		return Ct(this, e, t);
	},
	encode: function e(t, n) {
		return hs(this, t, n, { callee: e });
	},
	decode: function e(t, n) {
		return gs(this, t, n, { callee: e });
	},
	encodeAsync: async function e(t, n) {
		return await _s(this, t, n, { callee: e });
	},
	decodeAsync: async function e(t, n) {
		return await vs(this, t, n, { callee: e });
	},
	safeEncode(e, t) {
		return ys(this, e, t);
	},
	safeDecode(e, t) {
		return bs(this, e, t);
	},
	async safeEncodeAsync(e, t) {
		return xs(this, e, t);
	},
	async safeDecodeAsync(e, t) {
		return Ss(this, e, t);
	},
	toJSONSchema(e) {
		return eo(this, {})(e);
	},
	get description() {
		return Li.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
}), Es = /*@__PURE__*/ M("_ZodString", (e, t) => {
	Fn.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => vo(e, t, n, r);
}, /*@__PURE__*/ Ve({
	format: (e) => mo(e).format ?? null,
	minLength: (e) => mo(e).minimum ?? null,
	maxLength: (e) => mo(e).maximum ?? null
}, {
	regex(...e) {
		return this.check(/* @__PURE__ */ Ta(...e));
	},
	includes(...e) {
		return this.check(/* @__PURE__ */ Oa(...e));
	},
	startsWith(...e) {
		return this.check(/* @__PURE__ */ ka(...e));
	},
	endsWith(...e) {
		return this.check(/* @__PURE__ */ Aa(...e));
	},
	min(...e) {
		return this.check(/* @__PURE__ */ Ca(...e));
	},
	max(...e) {
		return this.check(/* @__PURE__ */ Sa(...e));
	},
	length(...e) {
		return this.check(/* @__PURE__ */ wa(...e));
	},
	nonempty(...e) {
		return this.check(/* @__PURE__ */ Ca(1, ...e));
	},
	lowercase(e) {
		return this.check(/* @__PURE__ */ Ea(e));
	},
	uppercase(e) {
		return this.check(/* @__PURE__ */ Da(e));
	},
	trim() {
		return this.check(/* @__PURE__ */ Na());
	},
	normalize(...e) {
		return this.check(/* @__PURE__ */ Ma(...e));
	},
	toLowerCase() {
		return this.check(/* @__PURE__ */ Pa());
	},
	toUpperCase() {
		return this.check(/* @__PURE__ */ Fa());
	},
	slugify() {
		return this.check(/* @__PURE__ */ Ia());
	}
})), Ds = /*@__PURE__*/ M("ZodString", (e, t) => {
	Fn.init(e, t), Es.init(e, t);
}, {
	email(e) {
		return this.check(/* @__PURE__ */ Bi(Ps, e));
	},
	url(e) {
		return this.check(/* @__PURE__ */ Ki(Ls, e));
	},
	jwt(e) {
		return this.check(/* @__PURE__ */ sa(Qs, e));
	},
	emoji(e) {
		return this.check(/* @__PURE__ */ qi(Rs, e));
	},
	guid(e) {
		return this.check(/* @__PURE__ */ Vi(Fs, e));
	},
	uuid(e) {
		return this.check(/* @__PURE__ */ Hi(Is, e));
	},
	uuidv4(e) {
		return this.check(/* @__PURE__ */ Ui(Is, e));
	},
	uuidv6(e) {
		return this.check(/* @__PURE__ */ Wi(Is, e));
	},
	uuidv7(e) {
		return this.check(/* @__PURE__ */ Gi(Is, e));
	},
	nanoid(e) {
		return this.check(/* @__PURE__ */ Ji(zs, e));
	},
	cuid(e) {
		return this.check(/* @__PURE__ */ Yi(Bs, e));
	},
	cuid2(e) {
		return this.check(/* @__PURE__ */ Xi(Vs, e));
	},
	ulid(e) {
		return this.check(/* @__PURE__ */ Zi(Hs, e));
	},
	base64(e) {
		return this.check(/* @__PURE__ */ ia(Ys, e));
	},
	base64url(e) {
		return this.check(/* @__PURE__ */ aa(Xs, e));
	},
	xid(e) {
		return this.check(/* @__PURE__ */ Qi(Us, e));
	},
	ksuid(e) {
		return this.check(/* @__PURE__ */ $i(Ws, e));
	},
	ipv4(e) {
		return this.check(/* @__PURE__ */ ea(Gs, e));
	},
	ipv6(e) {
		return this.check(/* @__PURE__ */ ta(Ks, e));
	},
	cidrv4(e) {
		return this.check(/* @__PURE__ */ na(qs, e));
	},
	cidrv6(e) {
		return this.check(/* @__PURE__ */ ra(Js, e));
	},
	e164(e) {
		return this.check(/* @__PURE__ */ oa(Zs, e));
	},
	datetime(e) {
		return this.check(/* @__PURE__ */ ca(As, e));
	},
	date(e) {
		return this.check(/* @__PURE__ */ la(js, e));
	},
	time(e) {
		return this.check(/* @__PURE__ */ F(Ms, e));
	},
	duration(e) {
		return this.check(/* @__PURE__ */ ua(Ns, e));
	}
});
function Os(e) {
	return /* @__PURE__ */ zi(Ds, e);
}
var ks = /*@__PURE__*/ M("ZodStringFormat", (e, t) => {
	P.init(e, t), Es.init(e, t);
}), As = /*@__PURE__*/ M("ZodISODateTime", (e, t) => {
	er.init(e, t), ks.init(e, t);
}), js = /*@__PURE__*/ M("ZodISODate", (e, t) => {
	tr.init(e, t), ks.init(e, t);
}), Ms = /*@__PURE__*/ M("ZodISOTime", (e, t) => {
	nr.init(e, t), ks.init(e, t);
}), Ns = /*@__PURE__*/ M("ZodISODuration", (e, t) => {
	rr.init(e, t), ks.init(e, t);
}), Ps = /*@__PURE__*/ M("ZodEmail", (e, t) => {
	Rn.init(e, t), ks.init(e, t);
}), Fs = /*@__PURE__*/ M("ZodGUID", (e, t) => {
	In.init(e, t), ks.init(e, t);
}), Is = /*@__PURE__*/ M("ZodUUID", (e, t) => {
	Ln.init(e, t), ks.init(e, t);
}), Ls = /*@__PURE__*/ M("ZodURL", (e, t) => {
	Kn.init(e, t), ks.init(e, t);
}), Rs = /*@__PURE__*/ M("ZodEmoji", (e, t) => {
	qn.init(e, t), ks.init(e, t);
}), zs = /*@__PURE__*/ M("ZodNanoID", (e, t) => {
	Jn.init(e, t), ks.init(e, t);
}), Bs = /*@__PURE__*/ M("ZodCUID", (e, t) => {
	Yn.init(e, t), ks.init(e, t);
}), Vs = /*@__PURE__*/ M("ZodCUID2", (e, t) => {
	Xn.init(e, t), ks.init(e, t);
}), Hs = /*@__PURE__*/ M("ZodULID", (e, t) => {
	Zn.init(e, t), ks.init(e, t);
}), Us = /*@__PURE__*/ M("ZodXID", (e, t) => {
	Qn.init(e, t), ks.init(e, t);
}), Ws = /*@__PURE__*/ M("ZodKSUID", (e, t) => {
	$n.init(e, t), ks.init(e, t);
}), Gs = /*@__PURE__*/ M("ZodIPv4", (e, t) => {
	ir.init(e, t), ks.init(e, t);
}), Ks = /*@__PURE__*/ M("ZodIPv6", (e, t) => {
	sr.init(e, t), ks.init(e, t);
}), qs = /*@__PURE__*/ M("ZodCIDRv4", (e, t) => {
	cr.init(e, t), ks.init(e, t);
}), Js = /*@__PURE__*/ M("ZodCIDRv6", (e, t) => {
	ur.init(e, t), ks.init(e, t);
}), Ys = /*@__PURE__*/ M("ZodBase64", (e, t) => {
	pr.init(e, t), ks.init(e, t);
}), Xs = /*@__PURE__*/ M("ZodBase64URL", (e, t) => {
	gr.init(e, t), ks.init(e, t);
}), Zs = /*@__PURE__*/ M("ZodE164", (e, t) => {
	_r.init(e, t), ks.init(e, t);
}), Qs = /*@__PURE__*/ M("ZodJWT", (e, t) => {
	yr.init(e, t), ks.init(e, t);
}), $s = /*@__PURE__*/ M("ZodNumber", (e, t) => {
	br.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => yo(e, t, n, r), e.isFinite = !0;
}, /*@__PURE__*/ Ve({
	minValue: (e) => {
		let { minimum: t, exclusiveMinimum: n } = mo(e);
		return Math.max(t ?? -Infinity, n ?? -Infinity);
	},
	maxValue: (e) => {
		let { maximum: t, exclusiveMaximum: n } = mo(e);
		return Math.min(t ?? Infinity, n ?? Infinity);
	},
	isInt: (e) => {
		let { isInt: t, multipleOf: n } = mo(e);
		return !!t || !!n?.some(Number.isSafeInteger);
	},
	format: (e) => mo(e).format ?? null
}, {
	gt(e, t) {
		return this.check(/* @__PURE__ */ ya(e, t));
	},
	gte(e, t) {
		return this.check(/* @__PURE__ */ ba(e, t));
	},
	min(e, t) {
		return this.check(/* @__PURE__ */ ba(e, t));
	},
	lt(e, t) {
		return this.check(/* @__PURE__ */ _a(e, t));
	},
	lte(e, t) {
		return this.check(/* @__PURE__ */ va(e, t));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ va(e, t));
	},
	int(e) {
		return this.check(nc(e));
	},
	safe(e) {
		return this.check(nc(e));
	},
	positive(e) {
		return this.check(/* @__PURE__ */ ya(0, e));
	},
	nonnegative(e) {
		return this.check(/* @__PURE__ */ ba(0, e));
	},
	negative(e) {
		return this.check(/* @__PURE__ */ _a(0, e));
	},
	nonpositive(e) {
		return this.check(/* @__PURE__ */ va(0, e));
	},
	multipleOf(e, t) {
		return this.check(/* @__PURE__ */ xa(e, t));
	},
	step(e, t) {
		return this.check(/* @__PURE__ */ xa(e, t));
	},
	finite() {
		return this;
	}
}));
function ec(e) {
	return /* @__PURE__ */ da($s, e);
}
var tc = /*@__PURE__*/ M("ZodNumberFormat", (e, t) => {
	xr.init(e, t), $s.init(e, t);
});
function nc(e) {
	return /* @__PURE__ */ fa(tc, e);
}
var rc = /*@__PURE__*/ M("ZodBoolean", (e, t) => {
	Sr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => bo(e, t, n, r);
});
function ic(e) {
	return /* @__PURE__ */ pa(rc, e);
}
var ac = /*@__PURE__*/ M("ZodAny", (e, t) => {
	Cr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function oc() {
	return /* @__PURE__ */ ma(ac);
}
var sc = /*@__PURE__*/ M("ZodUnknown", (e, t) => {
	wr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function cc() {
	return /* @__PURE__ */ ha(sc);
}
var lc = /*@__PURE__*/ M("ZodNever", (e, t) => {
	Tr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Eo(e, t, n, r);
});
function uc(e) {
	return /* @__PURE__ */ ga(lc, e);
}
var dc = /*@__PURE__*/ M("ZodArray", (e, t) => {
	ws(), kr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Vo(e, t, n, r), e.element = t.element;
}, {
	min(e, t) {
		return this.check(/* @__PURE__ */ Ca(e, t));
	},
	nonempty(e) {
		return this.check(/* @__PURE__ */ Ca(1, e));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ Sa(e, t));
	},
	length(e, t) {
		return this.check(/* @__PURE__ */ wa(e, t));
	},
	unwrap() {
		return this.element;
	}
});
function fc(e, t) {
	return /* @__PURE__ */ La(dc, e, t);
}
var pc = /*@__PURE__*/ M("ZodObject", (e, t) => {
	ws(), Fr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Uo(e, t, n, r), qe(e, "shape", (e) => e._zod.def.shape, !1);
}, {
	keyof() {
		return Tc(Object.keys(this._zod.def.shape));
	},
	catchall(e) {
		return this.clone(ie(this._zod.def, { catchall: e }));
	},
	passthrough() {
		return this.clone(ie(this._zod.def, { catchall: cc() }));
	},
	loose() {
		return this.clone(ie(this._zod.def, { catchall: cc() }));
	},
	strict() {
		return this.clone(ie(this._zod.def, { catchall: uc() }));
	},
	strip() {
		return this.clone(ie(this._zod.def, { catchall: void 0 }));
	},
	extend(e) {
		return k(this, e);
	},
	safeExtend(e) {
		return Se(this, e);
	},
	merge(e) {
		return Ce(this, e);
	},
	pick(e) {
		return ye(this, e);
	},
	omit(e) {
		return xe(this, e);
	},
	partial(...e) {
		return we(Ac, this, e[0]);
	},
	exactPartial(...e) {
		return we(Mc, this, e[0], "exactPartial");
	},
	required(...e) {
		return Te(Bc, this, e[0]);
	}
});
function z(e, t) {
	return new pc({
		type: "object",
		shape: e ?? {},
		...O(t)
	});
}
var mc = /*@__PURE__*/ M("ZodUnion", (e, t) => {
	Lr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Wo(e, t, n, r), e.options = t.options;
});
function hc(e, t) {
	return new mc({
		type: "union",
		options: e,
		...O(t)
	});
}
var gc = /*@__PURE__*/ M("ZodDiscriminatedUnion", (e, t) => {
	mc.init(e, t), zr.init(e, t);
});
function _c(e, t, n) {
	return new gc({
		type: "union",
		options: t,
		discriminator: e,
		...O(n)
	});
}
var vc = /*@__PURE__*/ M("ZodIntersection", (e, t) => {
	Br.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Go(e, t, n, r);
});
function yc(e, t) {
	return new vc({
		type: "intersection",
		left: e,
		right: t
	});
}
var bc = /*@__PURE__*/ M("ZodTuple", (e, t) => {
	ws(), Ur.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ko(e, t, n, r);
}, {
	rest(e) {
		return this.clone({
			...this._zod.def,
			rest: e
		});
	},
	partial() {
		let e = this._zod.def;
		if (e.checks?.length) throw Error(".partial() cannot be used on tuple schemas containing refinements");
		return this.clone({
			...e,
			items: e.items.map((e) => new Ac({
				type: "optional",
				innerType: e
			}))
		});
	}
});
function xc(e, t, n) {
	let r = t instanceof jn;
	return new bc({
		type: "tuple",
		items: e,
		rest: r ? t : null,
		...O(r ? n : t)
	});
}
var Sc = /*@__PURE__*/ M("ZodRecord", (e, t) => {
	ws(), qr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Jo(e, t, n, r), e.keyType = t.keyType, e.valueType = t.valueType;
});
function Cc(e, t, n) {
	return !t || !t._zod ? new Sc({
		type: "record",
		keyType: Os(),
		valueType: e,
		...O(t)
	}) : new Sc({
		type: "record",
		keyType: e,
		valueType: t,
		...O(n)
	});
}
var wc = /*@__PURE__*/ M("ZodEnum", (e, t) => {
	Jr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ao(e, t, n, r), e.enum = t.entries, e.options = [...e._zod.values];
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new wc({
			...t,
			checks: [],
			...O(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new wc({
			...t,
			checks: [],
			...O(r),
			entries: i
		});
	};
});
function Tc(e, t) {
	return new wc({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...O(t)
	});
}
var Ec = /*@__PURE__*/ M("ZodLiteral", (e, t) => {
	Yr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => jo(e, t, n, r), e.values = new Set(t.values), Object.defineProperty(e, "value", { get() {
		if (t.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return t.values[0];
	} });
});
function Dc(e, t) {
	return new Ec({
		type: "literal",
		values: Array.isArray(e) ? e : [e],
		...O(t)
	});
}
var Oc = /*@__PURE__*/ M("ZodTransform", (e, t) => {
	ws(), Xr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ro(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new tt(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(Le(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ??= "custom", "input" in t || (t.input = n.value), t.inst ??= e, n.issues.push(Le(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n)) : (n.value = i, n);
	};
});
function kc(e) {
	return new Oc({
		type: "transform",
		transform: e
	});
}
var Ac = /*@__PURE__*/ M("ZodOptional", (e, t) => {
	Qr.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => as(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function jc(e) {
	return new Ac({
		type: "optional",
		innerType: e
	});
}
var Mc = /*@__PURE__*/ M("ZodExactOptional", (e, t) => {
	$r.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => as(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Nc(e) {
	return new Mc({
		type: "optional",
		innerType: e
	});
}
var Pc = /*@__PURE__*/ M("ZodNullable", (e, t) => {
	ei.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Yo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Fc(e) {
	return new Pc({
		type: "nullable",
		innerType: e
	});
}
var Ic = /*@__PURE__*/ M("ZodDefault", (e, t) => {
	ti.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => $o(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function Lc(e, t) {
	return new Ic({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : de(t);
		}
	});
}
var Rc = /*@__PURE__*/ M("ZodPrefault", (e, t) => {
	ri.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => es(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function zc(e, t) {
	return new Rc({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : de(t);
		}
	});
}
var Bc = /*@__PURE__*/ M("ZodNonOptional", (e, t) => {
	ii.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Xo(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Vc(e, t) {
	return new Bc({
		type: "nonoptional",
		innerType: e,
		...O(t)
	});
}
var Hc = /*@__PURE__*/ M("ZodCatch", (e, t) => {
	si.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => ts(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Uc(e, t) {
	return new Hc({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : Ye(t)
	});
}
var Wc = /*@__PURE__*/ M("ZodPipe", (e, t) => {
	ci.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => ns(e, t, n, r), e.in = t.in, e.out = t.out;
});
function Gc(e, t) {
	return new Wc({
		type: "pipe",
		in: e,
		out: t
	});
}
var Kc = /*@__PURE__*/ M("ZodPreprocess", (e, t) => {
	Wc.init(e, t), ui.init(e, t);
}), qc = /*@__PURE__*/ M("ZodReadonly", (e, t) => {
	di.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => rs(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Jc(e) {
	return new qc({
		type: "readonly",
		innerType: e
	});
}
var Yc = /*@__PURE__*/ M("ZodCustom", (e, t) => {
	pi.init(e, t), Ts.init(e, t), e._zod.processJSONSchema = (t, n, r) => Io(e, t, n, r);
});
function Xc(e, t = {}) {
	return /* @__PURE__ */ Ra(Yc, e, t);
}
function Zc(e, t) {
	return /* @__PURE__ */ za(e, t);
}
function Qc(e, t) {
	return new Kc({
		type: "pipe",
		in: kc(e),
		out: t
	});
}
// node_modules/@openuidev/lang-core/dist/index.mjs
var B = /* @__PURE__ */ c(u(), 1), $c = g(), el = /* @__PURE__ */ new WeakSet();
function tl(e) {
	el.add(e);
}
function nl(e) {
	return typeof e == "object" && !!e && el.has(e);
}
var rl = /* @__PURE__ */ new WeakMap();
function il(e, t) {
	rl.set(e, t);
}
var al = /* @__PURE__ */ new WeakMap();
function ol(e, t) {
	return al.set(t, e), t;
}
function sl(e, t) {
	let n = rl.get(e);
	n && rl.set(t, n);
	let r = al.get(e);
	r && al.set(t, r);
}
function cl(e, t) {
	if (typeof e == "object" && e && "_def" in e && !("_zod" in e)) throw Error(`[OpenUI] Component "${t}" was defined with a Zod 3 schema. OpenUI requires Zod 4 schemas. If you're on zod@3.25+, import from "zod/v4" instead of "zod". See: https://zod.dev/v4/versioning`);
}
function ll(e) {
	return e?._zod?.def;
}
function ul(e) {
	return ll(e)?.type;
}
function dl(e) {
	let t = ul(e);
	return t === "optional" || t === "default" || t === "nullable";
}
function fl(e) {
	let t = e, n = ll(t);
	for (; n?.type === "optional" || n?.type === "default" || n?.type === "nullable";) t = n.innerType, n = ll(t);
	return t;
}
function pl(e) {
	return ul(fl(e)) === "array";
}
function ml(e) {
	let t = ll(fl(e));
	if (t?.type === "array") return t.element ?? t.innerType;
}
function hl(e) {
	let t = ll(fl(e));
	if (t?.type === "enum") {
		if (Array.isArray(t.values)) return t.values;
		if (t.entries && typeof t.entries == "object") return Object.keys(t.entries);
	}
}
function gl(e, t) {
	try {
		let n = t?.get(e);
		if (n?.id) return n.id;
	} catch {}
	if (typeof e == "object" && e) return rl.get(e);
}
function _l(e) {
	let t = ll(e);
	if (t?.type === "union" && Array.isArray(t.options)) return t.options;
}
function vl(e) {
	let t = ll(e);
	if (t?.type === "object" && t.shape && typeof t.shape == "object") return t.shape;
}
function yl(e, t) {
	let n = nl(e), r = bl(fl(e), t);
	if (r) return n ? `$binding<${r}>` : r;
}
function bl(e, t) {
	let n = typeof e == "object" && !!e && al.get(e);
	if (n) return `@${n}`;
	let r = gl(e, t);
	if (r) return r;
	let i = _l(e);
	if (i) {
		let e = i.map((e) => yl(e, t)).filter(Boolean);
		if (e.length > 0) return e.join(" | ");
	}
	if (pl(e)) {
		let n = ml(e);
		if (!n) return;
		let r = yl(n, t);
		return r ? _l(fl(n)) === void 0 ? `${r}[]` : `(${r})[]` : void 0;
	}
	let a = ul(e);
	if (a === "string") return "string";
	if (a === "number") return "number";
	if (a === "boolean") return "boolean";
	if (a === "any") return "any";
	if (a === "record") {
		let n = ll(e);
		return `Record<${yl(n?.keyType, t) ?? "string"}, ${yl(n?.valueType, t) ?? "any"}>`;
	}
	let o = hl(e);
	if (o) return o.map((e) => `"${e}"`).join(" | ");
	if (a === "literal") {
		let t = ll(e)?.values;
		if (Array.isArray(t) && t.length === 1) {
			let e = t[0];
			return typeof e == "string" ? `"${e}"` : String(e);
		}
	}
	let s = vl(e);
	return s ? `{${Object.entries(s).map(([e, n]) => {
		let r = dl(n) ? "?" : "", i = yl(n, t);
		return i ? `${e}${r}: ${i}` : `${e}${r}`;
	}).join(", ")}}` : "any";
}
function xl(e, t) {
	return Object.entries(e).map(([e, n]) => ({
		name: e,
		isOptional: dl(n),
		isArray: pl(n),
		typeAnnotation: yl(n, t)
	}));
}
function Sl(e, t) {
	return `${e}(${t.map((e) => e.typeAnnotation ? e.isOptional ? `${e.name}?: ${e.typeAnnotation}` : `${e.name}: ${e.typeAnnotation}` : e.isArray ? e.isOptional ? `[${e.name}]?` : `[${e.name}]` : e.isOptional ? `${e.name}?` : e.name).join(", ")})`;
}
function Cl(e, t, n, r) {
	let i = Sl(e, xl(t._zod.def.shape, r)), a = n && yl(n, r);
	return a ? `${i} → ${a}` : i;
}
var wl = (e) => {
	throw Error(`[extend] ${e}`);
};
function Tl(e, t) {
	let n = El(e, t.components), r = kl(n, Ol(n));
	return {
		...e,
		id: void 0,
		components: jl(n, r),
		componentGroups: Ll(e.componentGroups, n.removed),
		functions: [...e.functions ?? [], ...t.functions?.add ?? []],
		actions: [...e.actions ?? [], ...t.actions?.add ?? []]
	};
}
function El(e, t = {}) {
	let n = new Map(e.components.map((e) => [e.name, e])), r = new Map(e.components.map((e) => [e.props, e.name])), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = (e) => {
		n.set(e.name, e), r.set(e.props, e.name), a.add(e.name);
	};
	for (let e of t.add ?? []) {
		let { component: t, slots: r } = "slots" in e ? e : {
			component: e,
			slots: void 0
		}, a = t.name;
		n.has(a) && wl(`Component "${a}" already exists. Use override.`), r?.length === 0 && wl(`"slots" for "${a}" is empty. Omit it to only list it.`), o(t), r && i.set(a, r);
	}
	let s = /* @__PURE__ */ new Set();
	for (let e of t.override ?? []) n.has(e.name) || wl(`Cannot override "${e.name}": not in the library. Use add.`), s.has(e.name) && wl(`Component "${e.name}" is overridden twice.`), s.add(e.name), o(e);
	let c = new Set(t.remove);
	for (let t of c) a.has(t) && wl(`Cannot remove "${t}": it is added or overridden in the same call.`), n.delete(t) || wl(`Cannot remove "${t}": not in the library.`), t === e.root && wl(`Cannot remove "${t}": it is the library root.`);
	return {
		byName: n,
		nameOf: r,
		slotRequests: i,
		removed: c
	};
}
function Dl(e, t) {
	let n = fl(e), r = ll(n);
	return r?.type === "array" ? Dl(r.element, t) : _l(n)?.some((e) => t.has(e)) ? n : void 0;
}
function Ol({ byName: e, nameOf: t }) {
	let n = [];
	for (let r of e.values()) for (let [e, i] of Object.entries(r.props.shape)) Dl(i, t) && n.push(`${r.name}.${e}`);
	return n;
}
function kl(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let [r, i] of e.slotRequests) for (let a of i) {
		let i = Al(a, r, t, e.byName), o = n.get(i) ?? [];
		o.includes(r) || n.set(i, [...o, r]);
	}
	return n;
}
function Al(e, t, n, r) {
	if (n.includes(e)) return e;
	let i = e.split(".")[0], a = n.filter((e) => e.startsWith(`${i}.`));
	if (!e.includes(".") && a.length === 1) return a[0];
	let o = `Slot "${e}" for "${t}"`;
	return r.has(i) || wl(`${o}: "${i}" is not in the library.`), a.length || wl(`${o}: "${i}" has no content slot (a prop that is a union of components, or an optional or array of one).`), wl(`${o} must be one content slot. Candidates: ${a.join(", ")}.`);
}
function jl(e, t) {
	let { byName: n, nameOf: r, removed: i } = e, a = new Map(n), o = /* @__PURE__ */ new Map();
	for (let r of Ml(e, t)) {
		let e = n.get(r), t = {}, i = Il(e.props, { get shape() {
			return t;
		} });
		a.set(r, {
			...e,
			props: i,
			ref: i
		}), o.set(r, t);
	}
	let s = (e) => a.get(e).props, c = (e, t) => wl(`Cannot remove "${e}": it is the only type allowed in ${t.path}.`), l = (e, t, n) => {
		let a = r.get(e);
		if (a !== void 0) return i.has(a) && c(a, t), s(a);
		let o = ll(e);
		if (!o || o.type === "lazy") return e;
		if (n.has(e)) return n.get(e);
		n.set(e, e);
		let u = (e) => l(e, t, n), d = {}, f = _l(e), p = f?.some((e) => r.has(e));
		for (let [e, t] of Object.entries(o)) {
			if (e === "checks" || p && e === "options") continue;
			let n = Pl(e, t, u);
			Fl(n, t) || (d[e] = n);
		}
		if (p) {
			let n = f.filter((e) => !i.has(r.get(e) ?? "")).map(u), a = e === t.union ? t.added.filter((e) => !n.includes(e)) : [];
			!n.length && !a.length && c(r.get(f[0]), t);
			let o = [...n, ...a];
			Fl(o, f) || (d.options = o);
		}
		let m = Object.keys(d).length ? Il(e, d) : e;
		return n.set(e, m), m;
	};
	for (let [e, i] of o) for (let [a, o] of Object.entries(n.get(e).props.shape)) {
		let n = `${e}.${a}`, c = (t.get(n) ?? []).map(s);
		i[a] = l(o, {
			path: n,
			union: Dl(o, r),
			added: c
		}, /* @__PURE__ */ new Map());
	}
	return [...a.values()];
}
function Ml({ byName: e, nameOf: t, removed: n }, r) {
	let i = /* @__PURE__ */ new Map();
	for (let [n, r] of e) {
		let e = /* @__PURE__ */ new Set();
		for (let n of Object.values(r.props.shape)) Nl(n, t, e);
		i.set(n, e);
	}
	let a = (r) => {
		let i = t.get(r);
		return n.has(i) || e.get(i).props !== r;
	}, o = new Set([...r.keys()].map((e) => e.split(".")[0])), s = new Set([...e.keys()].filter((e) => o.has(e)));
	for (let [e, t] of i) [...t].some(a) && s.add(e);
	for (let e = !0; e;) {
		e = !1;
		for (let [n, r] of i) !s.has(n) && [...r].some((e) => s.has(t.get(e))) && (s.add(n), e = !0);
	}
	return s;
}
function Nl(e, t, n, r = /* @__PURE__ */ new Set()) {
	if (t.has(e)) return void n.add(e);
	let i = ll(e);
	if (i && i.type !== "lazy" && !r.has(e)) {
		r.add(e);
		for (let [e, a] of Object.entries(i)) e !== "checks" && Pl(e, a, (e) => Nl(e, t, n, r));
	}
}
function Pl(e, t, n) {
	if (ll(t)) return n(t);
	if (Array.isArray(t)) return t.map(n);
	if (e !== "shape") return t;
	let r = {};
	for (let [e, i] of Object.entries(t)) r[e] = n(i);
	return r;
}
function Fl(e, t) {
	if (e === t) return !0;
	if (ll(e)) return !1;
	let n = Object.entries(e);
	return n.length === Object.keys(t).length && n.every(([e, n]) => n === t[e]);
}
function Il(e, t) {
	let n = e, r = me(n, ie(n._zod.def, t));
	sl(n, r), nl(n) && tl(r);
	let i = Li.get(n);
	return i && Li.add(r, i), r;
}
function Ll(e, t) {
	return e?.map((e) => ({
		...e,
		components: e.components.filter((e) => !t.has(e))
	})).filter((e) => e.components.length);
}
function Rl(e, t) {
	if (cl(e, t), e?._zod?.def.type !== "object") throw Error(`[OpenUI] "${t}" params must be a z.object().`);
}
function zl(e) {
	return Rl(e.params, e.name), e.returns && cl(e.returns, e.name), e;
}
function Bl(e) {
	Rl(e.params, e.name);
	let t = z({
		type: Dc(e.name),
		params: e.params
	});
	return {
		...e,
		ref: ol(e.name, t)
	};
}
function Vl(e, t) {
	if (!t || e == null) return;
	if (!t.includes(".")) return e[t];
	let n = e;
	for (let e of t.split(".")) {
		if (n == null) return;
		n = n[e];
	}
	return n;
}
function V(e) {
	if (typeof e == "number") return e;
	if (typeof e == "string") {
		let t = Number(e);
		return isNaN(t) ? 0 : t;
	}
	return typeof e == "boolean" ? +!!e : 0;
}
var Hl = (e) => e.reduce((e, t) => e + V(t), 0), Ul = (e, t) => Array.isArray(e) ? e.map((e) => Ul(e, t)) : t(V(e)), Wl = () => hc([ec(), fc(ec())]), Gl = () => fc(oc()), Kl = () => z({ numbers: fc(ec()) }), ql = [
	zl({
		name: "Count",
		description: "Returns array length",
		params: z({ array: Gl() }),
		returns: ec(),
		fn: ({ array: e }) => Array.isArray(e) ? e.length : 0
	}),
	zl({
		name: "First",
		description: "Returns first element of array",
		params: z({ array: Gl() }),
		returns: oc(),
		fn: ({ array: e }) => Array.isArray(e) ? e[0] ?? null : null
	}),
	zl({
		name: "Last",
		description: "Returns last element of array",
		params: z({ array: Gl() }),
		returns: oc(),
		fn: ({ array: e }) => Array.isArray(e) ? e[e.length - 1] ?? null : null
	}),
	zl({
		name: "Sum",
		description: "Sum of numeric array",
		params: Kl(),
		returns: ec(),
		fn: ({ numbers: e }) => Array.isArray(e) ? Hl(e) : 0
	}),
	zl({
		name: "Avg",
		description: "Average of numeric array",
		params: Kl(),
		returns: ec(),
		fn: ({ numbers: e }) => Array.isArray(e) && e.length ? Hl(e) / e.length : 0
	}),
	zl({
		name: "Min",
		description: "Minimum value in array",
		params: Kl(),
		returns: ec(),
		fn: ({ numbers: e }) => Array.isArray(e) && e.length ? e.reduce((e, t) => Math.min(e, V(t)), V(e[0])) : 0
	}),
	zl({
		name: "Max",
		description: "Maximum value in array",
		params: Kl(),
		returns: ec(),
		fn: ({ numbers: e }) => Array.isArray(e) && e.length ? e.reduce((e, t) => Math.max(e, V(t)), V(e[0])) : 0
	}),
	zl({
		name: "Sort",
		description: "Sort array by field. Direction: \"asc\" (default) or \"desc\"",
		params: z({
			array: Gl(),
			field: Os(),
			direction: Tc(["asc", "desc"]).optional()
		}),
		returns: Gl(),
		fn: ({ array: e, field: t, direction: n }) => {
			if (!Array.isArray(e)) return e;
			let r = String(t ?? ""), i = String(n ?? "asc") === "desc";
			return [...e].sort((e, t) => {
				let n = r ? Vl(e, r) : e, a = r ? Vl(t, r) : t, o = typeof n == "number" || typeof n == "string" && !isNaN(Number(n)) && n !== "", s = typeof a == "number" || typeof a == "string" && !isNaN(Number(a)) && a !== "";
				if (o && s) {
					let e = V(n) - V(a);
					return i ? -e : e;
				}
				let c = String(n ?? "").localeCompare(String(a ?? ""));
				return i ? -c : c;
			});
		}
	}),
	zl({
		name: "Filter",
		description: "Filter array by field value",
		params: z({
			array: Gl(),
			field: Os(),
			operator: Tc([
				"==",
				"!=",
				">",
				"<",
				">=",
				"<=",
				"contains"
			]),
			value: oc()
		}),
		returns: Gl(),
		fn: ({ array: e, field: t, operator: n, value: r }) => {
			if (!Array.isArray(e)) return [];
			let i = String(t ?? ""), a = String(n ?? "==");
			return e.filter((e) => {
				let t = i ? Vl(e, i) : e;
				switch (a) {
					case "==": return t == r;
					case "!=": return t != r;
					case ">": return V(t) > V(r);
					case "<": return V(t) < V(r);
					case ">=": return V(t) >= V(r);
					case "<=": return V(t) <= V(r);
					case "contains": return String(t ?? "").includes(String(r ?? ""));
					default: return !1;
				}
			});
		}
	}),
	zl({
		name: "Round",
		description: "Round to N decimal places (default 0)",
		params: z({
			number: Wl(),
			decimals: ec().optional()
		}),
		returns: Wl(),
		fn: ({ number: e, decimals: t }) => {
			let n = 10 ** (t == null ? 0 : V(t));
			return Ul(e, (e) => Math.round(e * n) / n);
		}
	}),
	zl({
		name: "Abs",
		description: "Absolute value",
		params: z({ number: Wl() }),
		returns: Wl(),
		fn: ({ number: e }) => Ul(e, Math.abs)
	}),
	zl({
		name: "Floor",
		description: "Round down to nearest integer",
		params: z({ number: Wl() }),
		returns: Wl(),
		fn: ({ number: e }) => Ul(e, Math.floor)
	}),
	zl({
		name: "Ceil",
		description: "Round up to nearest integer",
		params: z({ number: Wl() }),
		returns: Wl(),
		fn: ({ number: e }) => Ul(e, Math.ceil)
	}),
	{
		name: "Each",
		description: "Evaluate template for each element. varName is the loop variable — use it ONLY inside the template expression (inline). Do NOT create a separate statement for the template.",
		params: z({
			array: Gl(),
			varName: Os(),
			template: oc()
		}),
		lazy: !0
	}
], Jl = Object.fromEntries(ql.map((e) => [e.name, e])), Yl = {
	Run: "run",
	ToAssistant: "continue_conversation",
	OpenUrl: "open_url",
	Set: "set",
	Reset: "reset"
};
function Xl(e) {
	let t = oc();
	return il(t, e), t;
}
var Zl = () => z({
	type: Dc("open_url"),
	url: Os()
}), Ql = () => z({
	type: Dc("continue_conversation"),
	context: Os().optional()
}), $l = hc([
	Zl(),
	Ql(),
	z({
		type: Os(),
		params: Cc(Os(), oc()).optional()
	})
]);
il($l, "ActionExpression");
var eu = {
	OpenUrl: { ref: ol("OpenUrl", Zl()) },
	ToAssistant: { ref: ol("ToAssistant", Ql()) }
}, tu = {
	ActionExpression: $l,
	OpenUrl: eu.OpenUrl.ref,
	ToAssistant: eu.ToAssistant.ref
}, nu = [
	{
		...Bl({
			name: "Run",
			description: "Execute a Mutation or re-fetch a Query (ref must be a declared Query/Mutation)",
			params: z({ ref: Xl("Query | Mutation") })
		}),
		lazy: !0
	},
	{
		...Bl({
			name: "ToAssistant",
			description: "Send a message to the assistant (for conversational buttons like \"Tell me more\", \"Explain this\"). The optional context is any value (object, array, string, number) passed to the assistant as hidden data, e.g. @ToAssistant(\"Show details\", {orderId: 42})",
			params: z({
				message: Os(),
				context: oc().optional()
			})
		}),
		ref: eu.ToAssistant.ref,
		step: ({ message: e, context: t }) => ({
			type: Yl.ToAssistant,
			message: String(e ?? ""),
			context: t ?? void 0
		})
	},
	{
		...Bl({
			name: "OpenUrl",
			description: "Navigate to a URL",
			params: z({ url: Os() })
		}),
		ref: eu.OpenUrl.ref,
		step: ({ url: e }) => ({
			type: Yl.OpenUrl,
			url: String(e ?? "")
		})
	},
	{
		...Bl({
			name: "Set",
			description: "Set a $variable to a specific value",
			params: z({
				variable: Xl("$variable"),
				value: oc()
			})
		}),
		lazy: !0
	},
	{
		...Bl({
			name: "Reset",
			description: "Reset $variables to their declared defaults; pass several to reset each (e.g. @Reset($title, $priority) restores $title=\"\" and $priority=\"medium\")",
			params: z({ variable: Xl("$variable") })
		}),
		lazy: !0
	}
], ru = Object.fromEntries(nu.map((e) => [e.name, e])), iu = (e, t) => ({
	kind: e,
	params: Object.keys(t.params.shape).map((e) => ({
		name: e,
		required: !1
	})),
	builtin: !0,
	...t.lazy ? { lazy: !0 } : {}
}), au = new Map([
	...ql.map((e) => [e.name, iu("function", e)]),
	...nu.map((e) => [e.name, iu("action", e)]),
	["Action", {
		kind: "action",
		params: [{
			name: "steps",
			required: !0
		}],
		builtin: !0,
		lazy: !0
	}]
]);
function ou(e) {
	return e?.callDefs ?? au;
}
function su(e) {
	return au.has(e);
}
function cu(e, t) {
	return au.get(e)?.kind === "action" || !!t && Object.prototype.hasOwnProperty.call(t, e);
}
var lu = {
	Query: "Query",
	Mutation: "Mutation"
};
function uu(e) {
	return e in lu;
}
function du(e) {
	let t = e.type;
	if (t === "string") {
		let t = e.enum;
		return t ? t.map((e) => `"${e}"`).join(" | ") : "string";
	}
	if (t === "number" || t === "integer") return "number";
	if (t === "boolean") return "boolean";
	if (t === "array") {
		let t = e.items;
		return t ? `${du(t)}[]` : "any[]";
	}
	if (t === "object") {
		let t = e.properties;
		if (t && Object.keys(t).length > 0) {
			let n = e.required ?? [];
			return `{${Object.entries(t).map(([e, t]) => `${e}${n.includes(e) ? "" : "?"}: ${du(t)}`).join(", ")}}`;
		}
		return "object";
	}
	return "any";
}
function fu(e) {
	let t = e.type;
	if (t === "string") return "";
	if (t === "number" || t === "integer") return 0;
	if (t === "boolean") return !1;
	if (t === "array") return [];
	if (t === "object") {
		let t = e.properties;
		if (t && Object.keys(t).length > 0) {
			let e = {};
			for (let [n, r] of Object.entries(t)) e[n] = fu(r);
			return e;
		}
		return {};
	}
	return null;
}
var pu = "You are an AI assistant that responds using openui-lang, a declarative UI language. Your ENTIRE response must be valid openui-lang code — no markdown, no explanations, just openui-lang.";
function mu(e, t) {
	let n = [
		"## Syntax Rules",
		"",
		"1. Each statement is on its own line: `identifier = Expression`",
		`2. \`root\` is the entry point — every program must define \`root = ${e}(...)\``,
		"3. Expressions are: strings (\"...\"), numbers, booleans (true/false), null, arrays ([...]), objects ({...}), or component calls TypeName(arg1, arg2, ...)",
		"4. Use references for readability: define `name = ...` on one line, then use `name` later",
		"5. EVERY variable (except root) MUST be referenced by at least one other variable. Unreferenced variables are silently dropped and will NOT render. Always include defined variables in their parent's children/items array.",
		"6. Arguments are POSITIONAL (order matters, not names). Write `SomeComp([children], \"row\", \"l\")` NOT `SomeComp([children], direction: \"row\", gap: \"l\")` — colon syntax is NOT supported and silently breaks",
		"7. Optional arguments can be omitted from the end"
	], r = 8;
	return t.bindings && n.push(`${r++}. Declare mutable state with \`$varName = defaultValue\`. Components marked with \`$binding\` can read/write these. Undeclared $variables are auto-created with null default.`), t.supportsExpressions && n.push(`${r++}. String concatenation: \`"text" + $var + "more"\``, `${r++}. Dot member access: \`query.field\` reads a field; on arrays it extracts that field from every element`, `${r++}. Index access: \`arr[0]\`, \`data[index]\``, `${r++}. Arithmetic operators: +, -, *, /, % (work on numbers; + is string concat when either side is a string)`, `${r++}. Comparison: ==, !=, >, <, >=, <=`, `${r++}. Logical: &&, ||, ! (prefix)`, `${r++}. Ternary: \`condition ? valueIfTrue : valueIfFalse\``, `${r++}. Parentheses for grouping: \`(a + b) * c\``), n.push("- Strings use double quotes with backslash escaping"), n.join("\n");
}
function hu(e) {
	return e.description ? `@${e.signature} — ${e.description}` : `@${e.signature}`;
}
function gu(e, t) {
	let n = [...Object.values(Jl).map((e) => hu({
		...e,
		signature: Cl(e.name, e.params, e.returns)
	})), ...e].join("\n");
	return `## Built-in Functions

Data functions prefixed with \`@\` to distinguish from components. These are the ONLY functions available — do NOT invent new ones.
Use @-prefixed built-in functions (@Count, @Sum, @Avg, @Min, @Max, @Round) on ${t ? "Query results" : "data"}. Do NOT hardcode computed values.

${n}

Builtins compose — output of one is input to the next:
\`@Count(@Filter(data.rows, "field", "==", "val"))\` for KPIs/chart values, \`@Round(@Avg(data.rows.score), 1)\`, \`@Each(data.rows, "item", Comp(item.field))\` for per-item rendering.
Array pluck: \`data.rows.field\` extracts a field from every row → use with @Sum, @Avg, charts, tables.

IMPORTANT @Each rule: The loop variable (e.g. "item") is ONLY available inside the @Each template expression. Always inline the template — do NOT extract it to a separate statement.
CORRECT: \`list = @Each(rows, "t", Comp(t.name))\`
WRONG: \`item = Comp(t.name)\` then \`list = @Each(rows, "t", item)\`, because t is undefined in item.`;
}
function _u() {
	return "## Query — Live Data Fetching\n\nFetch data from available tools. Returns defaults instantly, swaps in real data when it arrives.\n\n```\nmetrics = Query(\"tool_name\", {arg1: value, arg2: $binding}, {defaultField: 0, defaultData: []}, refreshInterval?)\n```\n\n- First arg: tool name (string)\n- Second arg: arguments object (may reference $bindings — re-fetches automatically on change)\n- Third arg: default data (rendered immediately before fetch resolves)\n- Fourth arg (optional): refresh interval in seconds (e.g. 30 for auto-refresh every 30s)\n- Use dot access on results: metrics.totalEvents, metrics.data.day (array pluck)\n- Query results must use regular identifiers: `metrics = Query(...)`, NOT `$metrics = Query(...)`\n- Manual refresh: `Button(\"Refresh\", Action([@Run(query1), @Run(query2)]), \"secondary\")` — re-fetches the listed queries\n- Refresh all queries: create Action with @Run for each query";
}
function vu() {
	return "## Mutation — Write Operations\n\nExecute state-changing tool calls (create, update, delete). Unlike Query (auto-fetches on render), Mutation fires only on button click via Action.\n\n```\nresult = Mutation(\"tool_name\", {arg1: $binding, arg2: \"value\"})\n```\n\n- First arg: tool name (string)\n- Second arg: arguments object (evaluated with current $binding values at click time)\n- result.status: \"idle\" | \"loading\" | \"success\" | \"error\"\n- result.data: tool response on success\n- result.error: error message on failure\n- Mutation results use regular identifiers: `result = Mutation(...)`, NOT `$result`\n- Show loading state: `result.status == \"loading\" ? TextContent(\"Saving...\") : null`";
}
var yu = "## Action — Button Behavior";
function bu(e) {
	return Object.values(ru).filter((t) => t.name === "Run" ? e.toolCalls : t.name === "Set" || t.name === "Reset" ? e.bindings : !0);
}
function xu(e, t) {
	let n = [...bu(e).map((e) => `- ${hu({
		...e,
		signature: Cl(e.name, e.params)
	})}`), ...t], r = [];
	e.toolCalls && r.push("Example — mutation + refresh + reset (PREFERRED pattern):\n```\n$binding = \"default\"\nresult = Mutation(\"tool_name\", {field: $binding})\ndata = Query(\"tool_name\", {}, {rows: []})\nonSubmit = Action([@Run(result), @Run(data), @Reset($binding)])\n```"), r.push("Example — simple nav:\n```\nviewBtn = Button(\"View\", @OpenUrl(\"https://example.com\"))\n```");
	let i = ["- An action can be assigned to a variable or inlined: Button(\"Go\", onSubmit) and Button(\"Go\", Action([...])) both work"];
	return e.toolCalls && i.push("- If a @Run(mutation) step fails, remaining steps are skipped (halt on failure)", "- @Run(queryRef) re-fetches the query (fire-and-forget, cannot fail)"), `${yu}

An action wires a button click to operations. Pass one @-prefixed step bare, e.g. Button("Ask", @ToAssistant("Tell me more")). Put several steps in Action([...]), e.g. Button("Read", Action([@OpenUrl("https://example.com"), @ToAssistant("Summarize this page")])). Steps execute in order.
Buttons without an action automatically send their label to the assistant (equivalent to @ToAssistant(label)).

Available steps:
${n.join("\n")}

${r.join("\n\n")}

${i.join("\n")}`;
}
function Su() {
	return "## Interactive Filters\n\nTo let the user filter data with a dropdown:\n1. Declare a $variable with a default: `$dateRange = \"14\"`\n2. Create a Select with name, items, and binding: `Select(\"dateRange\", [SelectItem(\"7\", \"Last 7 days\"), ...], null, null, $dateRange)`\n3. Wrap in FormControl for a label: `FormControl(\"Date Range\", Select(...))`\n4. Pass $dateRange in Query args: `Query(\"tool\", {dateRange: $dateRange}, {defaults})`\n5. When the user changes the Select, $dateRange updates and the Query automatically re-fetches\n\nFILTER WIRING RULE: If a $binding filter is visible in the UI, EVERY relevant Query MUST reference that $binding in its args. Never show a filter dropdown while hardcoding the query args.\n\nRules for $variables:\n- $variables hold simple values (strings or numbers), NOT arrays or objects\n- $variables must be bound to a Select/Input component via the value argument (last positional arg) to be interactive\n- Queries must use regular identifiers (NOT $variables): `metrics = Query(...)` not `$metrics = Query(...)`\n- **Auto-declare**: You do NOT need to explicitly declare $variables. If you use `$foo` without declaring it, the parser auto-creates `$foo = null`. You can still declare explicitly to set a default: `$days = \"14\"`\n\n## Forms\n\nSimple form — no $bindings needed. Field values are managed internally by the Form via the name prop:\n```\ncontactForm = Form(\"contact\", submitBtn, [nameField, emailField])\nnameField = FormControl(\"Name\", Input(\"name\", \"Your name\", \"text\", {required: true}))\nemailField = FormControl(\"Email\", Input(\"email\", \"your@email.com\", \"email\", {required: true, email: true}))\nsubmitBtn = Button(\"Submit\")\n```\n\nUse $bindings when you need to read field values elsewhere (in Action context, Query args, or conditionals). They are auto-declared:\n```\n$role = \"engineer\"\ncontactForm = Form(\"contact\", submitBtn, [nameField, emailField, roleField])\nnameField = FormControl(\"Name\", Input(\"name\", \"Enter your name\", \"text\", {required: true}, $name))\nemailField = FormControl(\"Email\", Input(\"email\", \"Enter your email\", \"email\", {required: true, email: true}, $email))\nroleField = FormControl(\"Role\", Select(\"role\", [SelectItem(\"engineer\", \"Engineer\"), SelectItem(\"designer\", \"Designer\"), SelectItem(\"pm\", \"PM\")], null, {required: true}, $role))\nsubmitBtn = Button(\"Submit\")\n```\n\nFor form + mutation patterns (create, refresh, reset), see the Action section example above.\n\nIMPORTANT: Always add validation rules to form fields used with Mutations. Use OBJECT syntax: {required: true, email: true, minLength: 8}. The renderer shows error messages automatically and blocks submit when validation fails.";
}
function Cu() {
	return "## Edit Mode\n\nThe runtime merges by statement name: same name = replace, new name = append.\nOutput ONLY statements that changed or are new. Everything else is kept automatically.\n\n### Delete\nTo remove a component, re-declare its parent without that component in the parent's children array. The removed component and any statements only it referenced are automatically garbage-collected.\n\n### Patch size guide\n- Changing a title or label: 1 statement\n- Adding a component: 2-3 statements (the new component + parent update)\n- Removing a component: 1 statement (re-declare parent without the removed child)\n- Adding a filter + wiring to query: 3-5 statements\n- Restructuring into tabs: 5-10 statements\n\n### Rules\n- Reuse existing statement names exactly — do not rename\n- Do NOT re-emit unchanged statements — the runtime keeps them\n- A typical edit patch is 1-10 statements, not 20+\n- If the existing code already satisfies the request, output only the root statement\n- NEVER output the entire program as a patch. Only output what actually changes\n- If you are about to output more than 10 statements, reconsider — most edits need fewer";
}
function wu(e, t) {
	let n = [`1. \`root = ${e}(...)\` — UI shell appears immediately`];
	if (t.supportsExpressions) {
		n.push("2. $variable declarations — state ready for bindings"), t.toolCalls && n.push("3. Query statements — defaults resolve immediately so components render with data");
		let e = n.length;
		n.push(`${e + 1}. Component definitions — fill in with data already available`), n.push(`${e + 2}. Data values — leaf content last`);
	} else n.push("2. Component definitions — fill in as they stream"), n.push("3. Data values — leaf content last");
	return `## Hoisting & Streaming (CRITICAL)

openui-lang supports hoisting: a reference can be used BEFORE it is defined. The parser resolves all references after the full input is parsed.

During streaming, the output is re-parsed on every chunk. Undefined references are temporarily unresolved and appear once their definitions stream in. This creates a progressive top-down reveal — structure first, then data fills in.

**Recommended statement order for optimal streaming:**
${n.join("\n")}

Always write the root = ${e}(...) statement first so the UI shell appears immediately, even before child data has streamed in.`;
}
function Tu() {
	return "## Inline Mode\n\nYou are in inline mode. You can respond in two ways:\n\n### 1. Code response (when the user wants to CREATE or CHANGE the UI)\nWrap openui-lang code in triple-backtick fences. You can include explanatory text before/after:\n\nHere's your dashboard:\n\n```openui-lang\nroot = RootComp([header, content])\nheader = SomeHeader(\"Title\")\ncontent = SomeContent(\"Hello world\")\n```\n\nI created a simple layout with a header.\n\n### 2. Text-only response (when the user asks a QUESTION)\nIf the user asks \"what is this?\", \"explain the chart\", \"how does this work\", etc. — respond with plain text. Do NOT output any openui-lang code. The existing dashboard stays unchanged.\n\n### Rules\n- When the user asks for changes, output ONLY the changed/new statements in a fenced block\n- When the user asks a question, respond with text only — NO code. The dashboard stays unchanged.\n- The parser extracts code from fences automatically. Text outside fences is shown as chat.";
}
function Eu() {
	return "## Data Workflow\n\nWhen tools are available, follow this workflow:\n1. FIRST: Call the most relevant tool to inspect the real data shape before generating code\n2. Use Query() for READ operations (data that should stay live) — NEVER hardcode tool results as literal arrays or objects\n3. Use Mutation() for WRITE operations (create, update, delete) — triggered by button clicks via @Run(mutationRef)\n4. Use the real data from step 1 as condensed Query defaults (3-5 rows) so the UI renders immediately\n5. Use @-prefixed builtins (@Count, @Filter, @Sort, @Sum) on Query results for KPIs and aggregations — the runtime evaluates these live on every refresh\n6. Hardcoded arrays are ONLY for static display data (labels, options) where no tool exists\n\nWRONG — you called a tool and got data back, but you inlined the results:\n```\nopenCount = 2\nitem1 = SomeComp(\"first item title\")\nitem2 = SomeComp(\"second item title\")\nlist = SomeList([item1, item2])\nchart = SomeChart([\"A\", \"B\"], [12, 8])\n```\nThis is static — it shows stale data and won't update. Creating item1, item2, item3... manually is ALWAYS wrong when a tool exists.\n\nRIGHT — use Query() for live data, Mutation() for writes, @builtins to derive values:\n```\ndata = Query(\"tool_name\", {}, {rows: []})\nopenCount = @Count(@Filter(data.rows, \"field\", \"==\", \"value\"))\nlist = @Each(data.rows, \"item\", SomeComp(item.title, item.field))\ncreateResult = Mutation(\"create_tool\", {title: $title})\nsubmitBtn = Button(\"Create\", Action([@Run(createResult), @Run(data), @Reset($title)]))\n```\nEverything derives from the Query — when data refreshes, the entire dashboard updates automatically.";
}
function Du(e, t) {
	let n = [`1. root = ${e}(...) is the FIRST line (for optimal streaming).`, "2. Every referenced name is defined. Every defined name (other than root) is reachable from root."];
	return t.toolCalls && n.push("3. Every Query result is referenced by at least one component."), t.bindings && n.push(`${t.toolCalls ? "4" : "3"}. Every $binding appears in at least one component or expression.`), t.toolCalls && t.bindings && n.push("5. Every visible filter $binding appears in at least one Query args object."), `## Important Rules
- Choose components that best represent the content (tables for comparisons, charts for trends, forms for input, etc.)

## Final Verification
Before finishing, walk your output and verify:
${n.join("\n")}`;
}
function Ou(e) {
	let t = "";
	if (e.inputSchema) {
		let n = e.inputSchema.properties, r = e.inputSchema.required ?? [];
		n && Object.keys(n).length > 0 && (t = Object.entries(n).map(([e, t]) => `${e}${r.includes(e) ? "" : "?"}: ${du(t)}`).join(", "));
	}
	let n = "";
	e.outputSchema && (n = ` → ${du(e.outputSchema)}`);
	let r = `- ${e.name}(${t})${n}`;
	return e.description && (r += `\n  ${e.description}`), r;
}
function ku(e) {
	let t = [], n = [], r = [];
	for (let t of e) typeof t == "string" ? n.push(t) : r.push(t);
	t.push("## Available Tools"), t.push(""), t.push("Use these with Query() for read operations or Mutation() for write operations. The LLM decides which is appropriate based on the tool's purpose."), t.push("");
	for (let e of n) t.push(`- ${e}`);
	for (let e of r) t.push(Ou(e));
	let i = r.filter((e) => e.outputSchema);
	if (i.length > 0) {
		t.push(""), t.push("### Default values for Query results"), t.push(""), t.push("Use these shapes as minimal Query defaults:");
		for (let e of i) {
			let n = fu(e.outputSchema);
			t.push(`- ${e.name}: \`${JSON.stringify(n)}\``);
		}
	}
	return t.push(""), t.push("CRITICAL: Use ONLY the tools listed above in Query() and Mutation() calls. Do NOT invent or guess tool names. If the user asks for functionality that doesn't match any available tool, use realistic mock data instead of fabricating a tool call."), t.join("\n");
}
var Au = /[:|] @[A-Z]/;
function ju(e, t) {
	let n = [
		"## Component Signatures",
		"",
		"Arguments marked with ? are optional. Sub-components can be inline or referenced; prefer references for better streaming."
	];
	if (t.usesActionExpression) {
		let r = [...bu(t).map((e) => e.name), ...Object.keys(e.actions ?? {})].map((e) => `@${e}`);
		n.push(`Props typed \`ActionExpression\` accept one @step, or Action([@steps...]) for several. See the Action section for available steps (${r.join(", ")}).`), Object.values(e.components).some((e) => Au.test(e.signature ?? "")) && n.push("Props typed like `@OpenUrl | @ToAssistant` accept only the steps listed.");
	}
	(t.bindings || Object.values(e.components).some((e) => e.signature?.includes("$binding"))) && n.push("Props marked `$binding<type>` accept a `$variable` reference for two-way binding.");
	let r = (e) => e.description ? `${e.signature} — ${e.description}` : e.signature;
	if (e.componentGroups?.length) {
		let t = /* @__PURE__ */ new Set();
		for (let i of e.componentGroups) {
			n.push("", `### ${i.name}`);
			for (let a of i.components) {
				if (t.has(a)) continue;
				let i = e.components[a];
				i && (t.add(a), n.push(r(i)));
			}
			if (i.notes?.length) for (let e of i.notes) n.push(e);
		}
		let i = Object.keys(e.components).filter((e) => !t.has(e));
		if (i.length) {
			n.push("", "### Other");
			for (let t of i) {
				let i = e.components[t];
				n.push(r(i));
			}
		}
	} else {
		n.push("");
		for (let [, t] of Object.entries(e.components)) n.push(r(t));
	}
	return n.join("\n");
}
function Mu(e) {
	let t = e.root ?? "Root", n = !!e.tools?.length, r = e.toolCalls ?? n, i = e.bindings ?? r, a = r || i, o = Object.values(e.components).some((e) => e.signature?.includes("ActionExpression") || Au.test(e.signature ?? "")), s = [];
	s.push(e.preamble ?? pu), s.push(""), s.push(mu(t, {
		supportsExpressions: a,
		bindings: i
	})), s.push(""), s.push(ju(e, {
		toolCalls: r,
		bindings: i,
		usesActionExpression: o
	}));
	let c = Object.values(e.functions ?? {}).map(hu);
	e.builtinFunctions ?? a ? (s.push(""), s.push(gu(c, r))) : c.length && (s.push(""), s.push(`## Built-in Functions\n\n${c.join("\n")}`)), r && (s.push(""), s.push(_u()), s.push(""), s.push(vu()));
	let l = Object.values(e.actions ?? {}).map((e) => `- ${hu(e)}`);
	o ? (s.push(""), s.push(xu({
		toolCalls: r,
		bindings: i
	}, l))) : l.length && (s.push(""), s.push(`${yu}\n\nPass one step, or Action([...]) with several steps, as a button's action.\n\nAvailable steps:\n${l.join("\n")}`)), r && i && (s.push(""), s.push(Su())), r && (s.push(""), s.push(Eu())), e.tools?.length && (s.push(""), s.push(ku(e.tools))), s.push(""), s.push(wu(t, {
		supportsExpressions: a,
		toolCalls: r
	}));
	let u = [...e.examples ?? [], ...e.toolExamples ?? []];
	if (u.length) {
		s.push(""), s.push("## Examples"), s.push("");
		for (let e of u) s.push(e), s.push("");
	}
	if (e.editMode && (s.push(""), s.push(Cu())), e.inlineMode && (s.push(""), s.push(Tu())), s.push(Du(t, {
		toolCalls: r,
		bindings: i
	})), e.additionalRules?.length) {
		s.push("");
		for (let t of e.additionalRules) s.push(`- ${t}`);
	}
	return s.join("\n");
}
function Nu(e) {
	return cl(e.props, e.name), il(e.props, e.name), {
		...e,
		ref: e.props
	};
}
function Pu(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(e)) n[r] = {
		signature: Cl(r, i.props, void 0, t),
		description: i.description
	};
	return n;
}
function Fu(e, t) {
	let n = Object.entries(e);
	if (!n.length) return;
	let r = {};
	for (let [e, i] of n) r[e] = {
		signature: Cl(e, i.params, "returns" in i ? i.returns : void 0, t),
		description: i.description
	};
	return r;
}
var Iu = 0;
function Lu() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : (Iu += 1, `openui-lib-${Date.now().toString(36)}-${Iu.toString(36)}`);
}
function Ru(e) {
	let t = {}, n = Ii(), r = Lu();
	for (let r of e.components) n.add(r.props, { id: r.name }), t[r.name] = r;
	for (let [e, r] of Object.entries(tu)) t[e] || n.add(r, { id: e });
	if (e.root && !t[e.root]) {
		let n = Object.keys(t).join(", ");
		throw Error(`[createLibrary] Root component "${e.root}" was not found in components. Available components: ${n}`);
	}
	let i = new Set(Object.keys(t)), a = (e, t) => {
		if (su(t) || uu(t) || i.has(t)) throw Error(`[createLibrary] ${e} "${t}" collides with a built-in, component, function, or action of the same name. Rename it.`);
		i.add(t);
	}, o = {};
	for (let t of e.functions ?? []) a("Function", t.name), o[t.name] = t;
	let s = {};
	for (let t of e.actions ?? []) a("Action", t.name), s[t.name] = t, n.add(t.ref, { id: t.name });
	let c = () => {
		let e = Fu(o, n), t = Fu(s, n);
		return {
			...e ? { functions: e } : {},
			...t ? { actions: t } : {}
		};
	}, l = {
		components: t,
		componentGroups: e.componentGroups,
		functions: o,
		actions: s,
		root: e.root,
		id: e.id,
		__libraryId: r,
		prompt(r) {
			return Mu({
				root: e.root,
				components: Pu(t, n),
				componentGroups: e.componentGroups,
				...c(),
				...r
			});
		},
		toSpec() {
			return {
				root: e.root,
				components: Pu(t, n),
				componentGroups: e.componentGroups,
				...c(),
				schema: f(),
				...e.id === void 0 ? {} : { id: e.id }
			};
		},
		toJSONSchema() {
			return f();
		},
		extend(t) {
			return Ru(Tl(e, t));
		}
	};
	function u(e) {
		let { $schema: t, $defs: r, ...i } = ss(e, { metadata: n });
		return i;
	}
	function d(e) {
		let t = Object.entries(e);
		if (t.length) return Object.fromEntries(t.map(([e, t]) => [e, {
			description: t.description,
			params: u(t.params),
			..."returns" in t && t.returns ? { returns: u(t.returns) } : {}
		}]));
	}
	function f() {
		let e = ss(z(Object.fromEntries(Object.entries(t).map(([e, t]) => [e, t.props]))), { metadata: n });
		for (let [n, r] of Object.entries(t)) {
			let t = e.$defs?.[n];
			t && r.description && (t.description = r.description);
		}
		let r = d(o);
		r && (e.functions = r);
		let i = d(s);
		return i && (e.actions = i), e;
	}
	return l;
}
var zu = "]]>openui:", Bu = /^\]\]>openui:([a-z]+)(?:\?(.*))?$/, Vu = /([^\n])(?=\]\]>openui:content(?:\?|\r?\n|$))/g, Hu = /[^\n](\]\]>[a-z:]*)$/, Uu = (e) => {
	try {
		return decodeURIComponent(e.replace(/\+/g, " "));
	} catch {
		return e;
	}
};
function Wu(e = "") {
	let t = {};
	for (let n of e.split("&")) {
		let e = n.indexOf("="), r = Uu(e === -1 ? n : n.slice(0, e));
		r && (t[r] = e === -1 ? "" : Uu(n.slice(e + 1)));
	}
	return t;
}
function Gu(e, { streaming: t } = {}) {
	if (!e.includes("]]>")) {
		let n = e.lastIndexOf("\n"), r = e.slice(n + 1);
		return {
			content: t && r !== "" && zu.startsWith(r) ? e.slice(0, Math.max(n, 0)).replace(/\r$/, "") : e,
			context: null,
			attributes: {},
			end: !1
		};
	}
	let n = e.replace(Vu, "$1\n"), r = t ? Hu.exec(n) : null;
	r && `${zu}content`.startsWith(r[1]) && (n = n.slice(0, r.index + 1));
	let i = n.split("\n"), a = i[i.length - 1], o = t && a !== "" && (a.startsWith(zu) || zu.startsWith(a));
	o && i.pop();
	let s = [{
		kind: null,
		attributes: {},
		lines: []
	}], c = () => {
		let e = s[s.length - 1].lines;
		e.length && (e[e.length - 1] = e[e.length - 1].replace(/\r$/, ""));
	}, l = -1;
	for (let [e, t] of i.entries()) {
		let n = Bu.exec(t.replace(/\r$/, ""));
		if (!n) s[s.length - 1].lines.push(t);
		else if (c(), n[1] === "end") {
			if (l = s.length - 1, e === i.length - 2 && i[e + 1] === "") break;
		} else s.push({
			kind: n[1],
			attributes: Wu(n[2]),
			lines: []
		});
	}
	o && c();
	let u = s.map((e) => e.kind), d = Math.max(0, u.lastIndexOf("content")), f = u.lastIndexOf("context"), p = f > d ? s[f].lines.join("\n") : null;
	try {
		typeof p == "string" && (p = JSON.parse(p));
	} catch {}
	let m = s[d], h = l >= d;
	return {
		content: m.lines.join("\n"),
		context: p,
		attributes: m.attributes,
		end: h
	};
}
function Ku(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !1;
	let t = e;
	return t.type === "element" && typeof t.typeName == "string" && typeof t.props == "object" && t.props !== null && typeof t.partial == "boolean";
}
var qu = /* @__PURE__ */ function(e) {
	return e.ContinueConversation = "continue_conversation", e.OpenUrl = "open_url", e;
}({});
function Ju(e) {
	switch (e.k) {
		case "StateRef":
		case "RuntimeRef":
		case "BinOp":
		case "UnaryOp":
		case "Ternary":
		case "Member":
		case "Index":
		case "Assign": return !0;
		default: return !1;
	}
}
var Yu = /* @__PURE__ */ new Set([
	"Comp",
	"Ref",
	"StateRef",
	"RuntimeRef",
	"BinOp",
	"UnaryOp",
	"Ternary",
	"Member",
	"Index",
	"Assign",
	"Str",
	"Num",
	"Bool",
	"Null",
	"Arr",
	"Obj",
	"Ph"
]);
function Xu(e) {
	return !e || typeof e != "object" || Array.isArray(e) ? !1 : Yu.has(e.k);
}
function Zu(e, t) {
	let n = (e) => {
		switch (t(e), e.k) {
			case "Comp":
				e.args.forEach(n), Object.values(e.mappedProps ?? {}).forEach(n);
				break;
			case "Arr":
				e.els.forEach(n);
				break;
			case "Obj":
				e.entries.forEach(([, e]) => n(e));
				break;
			case "BinOp":
				n(e.left), n(e.right);
				break;
			case "UnaryOp":
				n(e.operand);
				break;
			case "Ternary":
				n(e.cond), n(e.then), n(e.else);
				break;
			case "Member":
				n(e.obj);
				break;
			case "Index":
				n(e.obj), n(e.index);
				break;
			case "Assign": n(e.value);
		}
	};
	n(e);
}
function Qu(e) {
	return e == null ? { k: "Null" } : typeof e == "string" ? {
		k: "Str",
		v: e
	} : typeof e == "number" ? {
		k: "Num",
		v: e
	} : typeof e == "boolean" ? {
		k: "Bool",
		v: e
	} : Array.isArray(e) ? {
		k: "Arr",
		els: e.map(Qu)
	} : typeof e == "object" ? {
		k: "Obj",
		entries: Object.entries(e).map(([e, t]) => [e, Qu(t)])
	} : { k: "Null" };
}
function $u(e) {
	switch (e.k) {
		case "Str":
		case "Num":
		case "Bool": return { v: e.v };
		case "Null": return { v: null };
		case "Arr": {
			let t = [];
			for (let n of e.els) {
				let e = $u(n);
				if (!e) return;
				t.push(e.v);
			}
			return { v: t };
		}
		case "Obj": {
			let t = {};
			for (let [n, r] of e.entries) {
				let e = $u(r);
				if (!e) return;
				t[n] = e.v;
			}
			return { v: t };
		}
		default: return;
	}
}
var ed = [
	"string",
	"number",
	"boolean"
], td = {}, nd = [];
function rd(e) {
	return Array.isArray(e) ? "array" : typeof e;
}
function H(e) {
	return typeof e.$ref == "string" ? e.$ref.split("/").pop() : void 0;
}
function id(e) {
	return "$ref" in e || "anyOf" in e || "oneOf" in e || "allOf" in e;
}
function U(e) {
	if (Array.isArray(e.enum)) return { enumValues: e.enum };
	if ("const" in e) return { enumValues: [e.const] };
	switch (e.type) {
		case "string": return { expectedType: "string" };
		case "number":
		case "integer": return { expectedType: "number" };
		case "boolean": return { expectedType: "boolean" };
		default: return {};
	}
}
function W(e) {
	if (e && typeof e == "object" && !Array.isArray(e)) return e.default;
}
function ad(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return;
	let t = e, n = H(t);
	if (n) return n;
	let r = U(t);
	return r.enumValues ? r.enumValues.map((e) => JSON.stringify(e)).join("|") : r.expectedType ? r.expectedType : typeof t.type == "string" ? t.type : void 0;
}
function od(e, t) {
	return `${e}(${t.map((e) => {
		let t = ad(e.schema), n = e.required ? `${e.name}*` : e.name;
		return t ? `${n}: ${t}` : n;
	}).join(", ")})`;
}
function sd(e, t) {
	let n = typeof e;
	return t.enumValues ? !ed.includes(n) || t.enumValues.includes(e) ? null : {
		expected: `one of [${t.enumValues.map((e) => JSON.stringify(e)).join(", ")}]`,
		actual: JSON.stringify(e)
	} : t.expectedType && t.expectedType !== n ? {
		expected: t.expectedType,
		actual: rd(e)
	} : null;
}
function cd(e, t, n) {
	switch (n.code) {
		case "type-mismatch": return `field "${t}" expects ${n.expected} but got ${n.actual}`;
		case "missing-required": return `missing required field "${t}"${n.signature ? ` — signature: ${n.signature}` : ""}`;
		case "null-required": return `required field "${t}" cannot be null${n.signature ? ` — signature: ${n.signature}` : ""}`;
		case "unknown-component": return `Unknown component "${e}" — not found in catalog or builtins${n.available?.length ? `. Available components: ${n.available.join(", ")}` : ""}`;
		case "inline-reserved": return `${e}() must be declared as a top-level statement, not used inline as a value`;
		case "excess-args": return `${e} takes ${n.declared} arg(s), got ${n.got} (${n.got - n.declared} excess dropped)`;
		case "unknown-function": return `Unknown function "@${e}": not a built-in or action step. The call evaluates to null`;
		case "query-cycle": return `Queries ${n.cycle.join(", ")} read each other's results, so none of them can run first. They do not run`;
		case "no-root": return n.reason === "not-component" ? "root does not evaluate to a component" : n.reason === "fallback" ? `No root statement. Rendering the first statement that calls the root component ${e}` : e ? `No root statement, and no statement calls the root component ${e}` : "No root statement";
	}
}
function ld(e, t, n, r) {
	e.errors.push({
		code: r.code,
		component: t,
		path: n,
		message: cd(t, n, r),
		statementId: e.currentStatementId,
		...r.code === "no-root" && r.reason === "fallback" && { severity: "warning" }
	});
}
var ud = Symbol("invalid");
function dd(e, t) {
	return t === void 0 ? e ? ud : void 0 : t;
}
function fd(e, t, n, r, i) {
	return id(t) ? !1 : typeof t.type == "string" || Array.isArray(t.enum) || "const" in t ? (ld(i, n, r, {
		code: "type-mismatch",
		expected: typeof t.type == "string" ? t.type : "a literal value",
		actual: `component "${e.typeName}"`
	}), !0) : !1;
}
function pd(e) {
	return (e.anyOf ?? e.oneOf ?? [e]).map(H);
}
function md(e, t) {
	let n = pd(e);
	return n.length > 0 && n.every((e) => e !== void 0 && t.cat?.has(e));
}
function hd(e, t, n, r, i) {
	if (typeof e != "object" || Array.isArray(e)) return ld(i, n, r, {
		code: "type-mismatch",
		expected: "object",
		actual: rd(e)
	}), ud;
	let a = e, o, s = t.properties && typeof t.properties == "object" ? t.properties : td, c = Array.isArray(t.required) ? t.required : nd, l = !1;
	if (!i.partial) for (let e of c) {
		let t = e in a;
		if (!t || a[e] == null) {
			let c = W(s[e]);
			if (c !== void 0) {
				(o ??= { ...a })[e] = c;
				continue;
			}
			ld(i, n, `${r}/${e}`, { code: t ? "null-required" : "missing-required" }), l = !0;
		}
	}
	for (let e of Object.keys(s)) {
		if (!(e in a)) continue;
		let t = s[e], u = vd(a[e], t, n, `${r}/${e}`, i);
		u === ud && (u = dd(c.includes(e), W(t)), u === ud) ? l = !0 : u !== a[e] && (o ??= { ...a }, u === void 0 ? delete o[e] : o[e] = u);
	}
	return l ? ud : o ?? a;
}
function gd(e, t, n, r, i) {
	if (!Array.isArray(e)) return ld(i, n, r, {
		code: "type-mismatch",
		expected: "array",
		actual: rd(e)
	}), ud;
	let a = t.items;
	if (!a || typeof a != "object" || Array.isArray(a)) return e;
	let o;
	for (let t = 0; t < e.length; t++) {
		let s = vd(e[t], a, n, `${r}/${t}`, i);
		s !== e[t] && !o && (o = e.slice(0, t)), o && s !== ud && o.push(s);
	}
	return o ?? e;
}
function _d(e, t, n, r, i) {
	let a = U(t);
	if (a.expectedType == null && a.enumValues == null || a.enumValues && i.partial) return !1;
	let o = sd(e, a);
	return o ? (ld(i, n, r, {
		code: "type-mismatch",
		...o
	}), !0) : !1;
}
function vd(e, t, n, r, i) {
	if (!t || typeof t != "object" || Array.isArray(t)) return e;
	let a = t;
	if (e == null || Xu(e)) return e;
	if (Ku(e)) return fd(e, a, n, r, i) ? ud : e;
	if (id(a)) return md(a, i) ? (ld(i, n, r, {
		code: "type-mismatch",
		expected: pd(a).join(" | "),
		actual: Array.isArray(e) ? "array" : typeof e == "object" ? "plain object" : typeof e
	}), ud) : e;
	let o = a.type;
	return o === "object" ? hd(e, a, n, r, i) : o === "array" ? gd(e, a, n, r, i) : _d(e, a, n, r, i) ? ud : e;
}
function yd(e) {
	if (typeof e != "object" || !e) return !1;
	if (Xu(e)) return !0;
	if (Array.isArray(e)) return e.some(yd);
	if (Ku(e)) return e.hasDynamicProps ?? Object.values(e.props).some(yd);
	let t = e;
	return Array.isArray(t.steps) ? !0 : Object.values(t).some(yd);
}
function bd(e, t) {
	return e.statementId === void 0 || e.statementId === t ? (e.statementId = t, e) : {
		...e,
		statementId: t
	};
}
function xd(e, t, n) {
	if (t.visited.has(e) || !t.syms.has(e)) return t.unres.push(e), n === "expr" ? {
		k: "Ph",
		n: e
	} : null;
	let r = t.syms.get(e);
	if (t.unreached?.delete(e), r.k === "Comp" && uu(r.name)) return {
		k: "RuntimeRef",
		n: e,
		refType: r.name === lu.Mutation ? "mutation" : "query"
	};
	let i = `${n}:${e}`, a = t.memo ??= /* @__PURE__ */ new Map();
	if (a.has(i)) return a.get(i);
	t.visited.add(e);
	try {
		return Sd(t, e, () => {
			let o = t.unres.length, s = n === "value" ? Ad(r, t) : kd(r, t);
			return n === "value" && Ku(s) && (s = bd(s, e)), t.unres.length === o && a.set(i, s), s;
		});
	} finally {
		t.visited.delete(e);
	}
}
function Sd(e, t, n) {
	let r = e.currentStatementId;
	e.currentStatementId = t;
	try {
		return n();
	} finally {
		e.currentStatementId = r;
	}
}
function Cd(e, t) {
	return ou(t.cat).has(e) || uu(e);
}
function wd(e, t) {
	let n = {};
	for (let r = 0; r < t.length && r < e.length; r++) n[t[r].name] = e[r];
	return n;
}
function Td(e, t, n, r) {
	let { params: i } = n;
	t.length > i.length && ld(r, e, "", {
		code: "excess-args",
		declared: i.length,
		got: t.length
	});
	let a = wd(t, i), o = !1, s = r.errors.length;
	for (let t of i) {
		let n = a[t.name], s = n ? $u(n) : { v: void 0 };
		if (!s) continue;
		if (s.v == null) {
			if (!t.required || t.defaultValue !== void 0) continue;
			ld(r, e, `/${t.name}`, {
				code: n ? "null-required" : "missing-required",
				signature: od(e, i)
			}), o = !0;
			continue;
		}
		let c = vd(s.v, t.schema, e, `/${t.name}`, r);
		c === ud && (c = dd(t.required, t.defaultValue)), c === ud ? o = !0 : c === void 0 ? delete a[t.name] : c !== s.v && (a[t.name] = Qu(c));
	}
	return n.kind === "action" && r.errors.length > s && (o = !0), o ? null : a;
}
function Ed(e, t, n) {
	let r = e.args.map(n), i = ou(t.cat).get(e.name);
	if (!i || i.lazy) return {
		...e,
		args: r
	};
	let a = i.builtin ? wd(r, i.params) : Td(e.name, r, i, t);
	return a ? {
		...e,
		args: r,
		mappedProps: a
	} : i.kind === "action" ? {
		k: "Comp",
		name: "Action",
		args: [{
			k: "Arr",
			els: []
		}]
	} : { k: "Null" };
}
function Dd(e, t, n) {
	let r = ou(t.cat).get(e.name);
	if (r?.kind !== "function" || !r.lazy || e.args.length < 3) return null;
	let i = e.args[1], a = i.k === "Ref" ? i.n : i.k === "Str" ? i.v : null;
	if (!a) return null;
	let o = new Set(n);
	o.add(a);
	let s = e.args.map((e, n) => n === 1 ? e : Od(e, t, o));
	return {
		...e,
		args: s
	};
}
function Od(e, t, n) {
	switch (e.k) {
		case "Ref": return n.has(e.n) ? e : xd(e.n, t, "expr");
		case "Ph": return e;
		case "Comp": {
			if (e.fn && !Cd(e.name, t)) return ld(t, e.name, "", { code: "unknown-function" }), { k: "Null" };
			let r = Dd(e, t, n);
			if (r) return r;
			if (Cd(e.name, t)) return Ed(e, t, (e) => Od(e, t, n));
			let i = e.args.map((e) => Od(e, t, n)), a = t.cat?.get(e.name);
			if (a) {
				let t = {};
				for (let e = 0; e < a.params.length && e < i.length; e++) t[a.params[e].name] = i[e];
				return {
					...e,
					args: i,
					mappedProps: t
				};
			}
			return ld(t, e.name, "", {
				code: "unknown-component",
				available: t.cat && [...t.cat.keys()]
			}), {
				...e,
				args: i
			};
		}
		case "Arr": return {
			...e,
			els: e.els.map((e) => Od(e, t, n))
		};
		case "Obj": return {
			...e,
			entries: e.entries.map(([e, r]) => [e, Od(r, t, n)])
		};
		case "BinOp": return {
			...e,
			left: Od(e.left, t, n),
			right: Od(e.right, t, n)
		};
		case "UnaryOp": return {
			...e,
			operand: Od(e.operand, t, n)
		};
		case "Ternary": return {
			...e,
			cond: Od(e.cond, t, n),
			then: Od(e.then, t, n),
			else: Od(e.else, t, n)
		};
		case "Member": return {
			...e,
			obj: Od(e.obj, t, n)
		};
		case "Index": return {
			...e,
			obj: Od(e.obj, t, n),
			index: Od(e.index, t, n)
		};
		case "Assign": return {
			...e,
			value: Od(e.value, t, n)
		};
		default: return e;
	}
}
function kd(e, t) {
	return Od(e, t, /* @__PURE__ */ new Set());
}
function Ad(e, t) {
	switch (e.k) {
		case "Ref": return xd(e.n, t, "value");
		case "Str": return e.v;
		case "Num": return e.v;
		case "Bool": return e.v;
		case "Null": return null;
		case "Ph": return null;
		case "Arr": {
			let n = [];
			for (let r of e.els) {
				if (r.k === "Ph") continue;
				let e = Ad(r, t);
				(e !== null || r.k !== "Comp" && r.k !== "Ref") && n.push(e);
			}
			return n;
		}
		case "Obj": {
			let n = {};
			for (let [r, i] of e.entries) n[r] = Ad(i, t);
			return n;
		}
		case "Comp": {
			let { name: n, args: r } = e;
			if (e.fn && !Cd(n, t)) return ld(t, n, "", { code: "unknown-function" }), null;
			if (uu(n)) return ld(t, n, "", { code: "inline-reserved" }), null;
			if (Cd(n, t)) return Dd(e, t, /* @__PURE__ */ new Set()) || Ed(e, t, (e) => kd(e, t));
			let i = t.cat?.get(n), a = {};
			if (i) {
				let e = !1;
				for (let o = 0; o < i.params.length && o < r.length; o++) {
					let s = i.params[o], c = Ad(r[o], t);
					if (a[s.name] = c, s.schema === void 0) continue;
					let l = vd(c, s.schema, n, `/${s.name}`, t);
					l === ud && (l = dd(s.required, s.defaultValue), l === ud ? e = !0 : l === void 0 && delete a[s.name]), l !== ud && l !== void 0 && (a[s.name] = l);
				}
				r.length > i.params.length && ld(t, n, "", {
					code: "excess-args",
					declared: i.params.length,
					got: r.length
				});
				let o = i.params.filter((e) => e.required && (!(e.name in a) || a[e.name] === null));
				if (o.length) {
					let e = o.filter((e) => e.defaultValue === void 0 || (a[e.name] = e.defaultValue, !1));
					if (e.length) {
						for (let r of e) ld(t, n, `/${r.name}`, {
							code: r.name in a ? "null-required" : "missing-required",
							signature: od(n, i.params)
						});
						return null;
					}
				}
				if (e) return null;
			} else return ld(t, n, "", {
				code: "unknown-component",
				available: t.cat && [...t.cat.keys()]
			}), null;
			let o = Object.values(a).some((e) => yd(e));
			return {
				type: "element",
				typeName: n,
				props: a,
				partial: t.partial,
				hasDynamicProps: o
			};
		}
		default: return Ju(e) ? kd(e, t) : e;
	}
}
function jd(e, t, n, r, i) {
	let a = Md(e, t, n, r, i);
	return Vd(a) ? Wd(a) : a;
}
function Md(e, t, n, r, i) {
	if (typeof e != "object" || !e) return e;
	if (Nd(e)) return r && nl(r) ? e : t.getState(e.target) ?? null;
	if (Xu(e)) {
		if (e.k === "StateRef" && r && nl(r)) return {
			__reactive: "assign",
			target: e.n,
			expr: {
				k: "StateRef",
				n: "$value"
			}
		};
		let a = G(e, t, n);
		return Ku(a) ? i.recurseElement(a) : Array.isArray(a) ? a.map((e) => Ku(e) ? i.recurseElement(e) : e) : Nd(a) && !(r && nl(r)) ? t.getState(a.target) ?? null : a;
	}
	if (typeof e == "string" && r && nl(r)) return e;
	if (Array.isArray(e)) return e.map((e) => i.recurse(e, r));
	if (Ku(e)) return i.recurseElement(e);
	if (Vd(e)) return e;
	let a = e, o = !1;
	for (let e of Object.values(a)) if (typeof e == "object" && e) {
		o = !0;
		break;
	}
	if (o) {
		let e = {};
		for (let [t, n] of Object.entries(a)) e[t] = i.recurse(n, r);
		return e;
	}
	return e;
}
function Nd(e) {
	return typeof e == "object" && !!e && e.__reactive === "assign";
}
function G(e, t, n) {
	switch (e.k) {
		case "Str": return e.v;
		case "Num": return e.v;
		case "Bool": return e.v;
		case "Null": return null;
		case "Ph": return null;
		case "StateRef": return t.extraScope?.[e.n] ?? t.getState(e.n);
		case "Ref":
		case "RuntimeRef": return t.resolveRef(e.n);
		case "Arr": return e.els.map((e) => G(e, t));
		case "Obj": return Object.fromEntries(e.entries.map(([e, n]) => [e, G(n, t)]));
		case "Comp": {
			let r = Jl[e.name];
			if (r) return r.lazy ? Yd(e.name, e.args, t, n) : r.fn(Id(e, t));
			if (cu(e.name)) return Gd(e, t);
			let i = t.functions;
			if (i && Object.prototype.hasOwnProperty.call(i, e.name)) return Bd(e.name, i[e.name], e, t);
			let a = t.actions;
			if (a && Object.prototype.hasOwnProperty.call(a, e.name)) {
				let n = a[e.name], r = Ld(e, t, n.params);
				if (zd(r, n.params)) return { steps: [] };
				let i = Rd(r, n.params, e.name, "", t, !0);
				if (i === ud) return { steps: [] };
				let o = {
					type: "custom_action",
					name: e.name,
					params: i
				};
				return Ud.add(o), { steps: [o] };
			}
			if (e.mappedProps) {
				let r = n?.library.components[e.name], i = {};
				for (let [a, o] of Object.entries(e.mappedProps)) {
					let e = r?.props?.shape?.[a];
					i[a] = o.k === "StateRef" && e && nl(e) ? {
						__reactive: "assign",
						target: o.n,
						expr: {
							k: "StateRef",
							n: "$value"
						}
					} : o.k === "StateRef" ? n ? t.getState(o.n) : o : G(o, t, n);
				}
				let a = {
					type: "element",
					typeName: e.name,
					props: i,
					partial: !1,
					hasDynamicProps: !0
				};
				if (n) for (let [e, r] of Object.entries(i)) Ku(r) ? i[e] = Pd(r, t, n) : Array.isArray(r) && (i[e] = r.map((e) => Ku(e) ? Pd(e, t, n) : e));
				return a;
			}
			return console.warn(`[openui] Unexpected unmapped Comp node: ${e.name}`), null;
		}
		case "BinOp": {
			if (e.op === "&&") return G(e.left, t) && G(e.right, t);
			if (e.op === "||") return G(e.left, t) || G(e.right, t);
			let n = G(e.left, t), r = G(e.right, t);
			switch (e.op) {
				case "+": return typeof n == "string" || typeof r == "string" ? String(n ?? "") + String(r ?? "") : V(n) + V(r);
				case "-": return V(n) - V(r);
				case "*": return V(n) * V(r);
				case "/": return V(r) === 0 ? 0 : V(n) / V(r);
				case "%": return V(r) === 0 ? 0 : V(n) % V(r);
				case "==": return n == r;
				case "!=": return n != r;
				case ">": return V(n) > V(r);
				case "<": return V(n) < V(r);
				case ">=": return V(n) >= V(r);
				case "<=": return V(n) <= V(r);
				default: return null;
			}
		}
		case "UnaryOp": return e.op === "!" ? !G(e.operand, t) : e.op === "-" ? -V(G(e.operand, t)) : null;
		case "Ternary": return G(e.cond, t) ? G(e.then, t) : G(e.else, t);
		case "Member": {
			let n = G(e.obj, t);
			return n == null ? null : Array.isArray(n) ? e.field === "length" ? n.length : n.map((t) => t?.[e.field] ?? null) : n[e.field];
		}
		case "Index": {
			let n = G(e.obj, t), r = G(e.index, t);
			return n == null || r == null ? null : Array.isArray(n) ? n[V(r)] : n[String(r)];
		}
		case "Assign": return {
			__reactive: "assign",
			target: e.target,
			expr: e.value
		};
	}
}
function Pd(e, t, n) {
	if (e.hasDynamicProps === !1) return e;
	let r = n.library.components[e.typeName], i = {};
	for (let [a, o] of Object.entries(e.props)) {
		let e = r?.props?.shape?.[a];
		i[a] = Fd(o, t, n, e);
	}
	return {
		...e,
		props: i
	};
}
function Fd(e, t, n, r) {
	return jd(e, t, n, r, {
		recurseElement: (e) => Pd(e, t, n),
		recurse: (e, r) => Fd(e, t, n, r)
	});
}
function Id(e, t, n = au.get(e.name)?.params ?? []) {
	let r = e.mappedProps ?? wd(e.args, n), i = {};
	for (let e in r) i[e] = G(r[e], t);
	return i;
}
function Ld(e, t, n) {
	let r = Id(e, t, Object.keys(n.properties ?? {}).map((e) => ({
		name: e,
		required: !1
	})));
	for (let e in r) r[e] === null && !n.required?.includes(e) && delete r[e];
	return r;
}
function Rd(e, t, n, r, i, a = !1) {
	let o = {
		errors: [],
		partial: !1
	}, s = vd(e, t, n, r, o);
	for (let e of o.errors) i.reportError?.(`@${n}: ${e.message}`);
	return a && o.errors.length > 0 ? ud : s;
}
function zd(e, t) {
	return !!t.required?.some((n) => e[n] == null && W(t.properties?.[n]) === void 0);
}
function Bd(e, t, n, r) {
	let i = Ld(n, r, t.params);
	if (zd(i, t.params)) return null;
	let a = Rd(i, t.params, e, "", r);
	if (a === ud) return null;
	let o;
	try {
		o = t.fn(a);
	} catch (t) {
		return r.reportError?.(`@${e} threw: ${t instanceof Error ? t.message : String(t)}`), null;
	}
	if (!t.returns) return o;
	let s = Rd(o, t.returns, e, "/returns", r);
	return s === ud ? null : s ?? null;
}
function Vd(e) {
	return typeof e == "object" && !!e && Array.isArray(e.steps);
}
function Hd(e) {
	return Wd({ steps: e.flatMap((e) => Vd(e) ? e.steps : typeof e == "object" && e && "type" in e ? [e] : []) });
}
var Ud = /* @__PURE__ */ new WeakSet();
function Wd(e) {
	let t = (e) => e?.type !== "custom_action" || Ud.has(e);
	return e.steps.every(t) ? e : {
		...e,
		steps: e.steps.filter(t)
	};
}
function Gd(e, t) {
	let { name: n, args: r } = e;
	if (n === "Action") {
		let e = r.length > 0 ? G(r[0], t) : [];
		return Hd(Array.isArray(e) ? e : []);
	}
	let i = ru[n], a = i.step ? i.step(Id(e, t)) : Kd(n, r);
	return { steps: a ? [a] : [] };
}
function Kd(e, t) {
	switch (e) {
		case "Run": {
			let e = t[0];
			return e?.k === "RuntimeRef" ? {
				type: Yl.Run,
				statementId: e.n,
				refType: e.refType
			} : null;
		}
		case "Set": return t.length < 2 || t[0].k !== "StateRef" ? null : {
			type: Yl.Set,
			target: t[0].n,
			valueAST: t[1]
		};
		case "Reset": {
			let e = t.filter((e) => e.k === "StateRef").map((e) => e.n);
			return e.length === 0 ? null : {
				type: Yl.Reset,
				targets: e
			};
		}
		default: return null;
	}
}
function qd(e, t, n) {
	switch (e.k) {
		case "Ref": return e.n === t ? Qu(n) : e;
		case "Member":
			if (Xu(e.obj)) {
				let r = qd(e.obj, t, n);
				if (r.k === "Obj") {
					let t = r.entries.find(([t]) => t === e.field);
					if (t) return t[1];
				}
				return {
					...e,
					obj: r
				};
			}
			return e;
		case "Index": return {
			...e,
			obj: Xu(e.obj) ? qd(e.obj, t, n) : e.obj,
			index: Xu(e.index) ? qd(e.index, t, n) : e.index
		};
		case "BinOp": return {
			...e,
			left: qd(e.left, t, n),
			right: qd(e.right, t, n)
		};
		case "UnaryOp": return {
			...e,
			operand: qd(e.operand, t, n)
		};
		case "Ternary": return {
			...e,
			cond: qd(e.cond, t, n),
			then: qd(e.then, t, n),
			else: qd(e.else, t, n)
		};
		case "Arr": return {
			...e,
			els: e.els.map((e) => qd(e, t, n))
		};
		case "Obj": return {
			...e,
			entries: e.entries.map(([e, r]) => [e, qd(r, t, n)])
		};
		case "Comp": {
			let r = (e) => qd(e, t, n), i = {
				...e,
				args: e.args.map(r)
			};
			return e.mappedProps && (i.mappedProps = Jd(e.mappedProps, r)), i;
		}
		case "Assign": return {
			...e,
			value: qd(e.value, t, n)
		};
		default: return e;
	}
}
function Jd(e, t) {
	let n = {};
	for (let r in e) n[r] = t(e[r]);
	return n;
}
function Yd(e, t, n, r) {
	if (e === "Each") {
		if (t.length < 3) return [];
		let e = G(t[0], n);
		if (!Array.isArray(e)) return [];
		let i = t[1].k === "Ref" ? t[1].n : t[1].k === "Str" ? t[1].v : null;
		if (!i) return [];
		let a = t[2];
		return e.map((e, t) => {
			let o = qd(a, i, e), s = {
				...n,
				resolveRef: (t) => t === i ? e : n.resolveRef(t)
			}, c = G(o, s, r);
			return r && Ku(c) ? Pd(c, s, r) : c;
		});
	}
	return null;
}
var Xd = 1, Zd = 2, Qd = 3, $d = 4, ef = 5, tf = 6, nf = 7, rf = 8, af = 9;
function of(e) {
	let t = 0, n = () => e[t] ?? { t: 13 }, r = () => {
		let e = n();
		return t++, e;
	}, i = (e) => {
		n().t === e && t++;
	};
	function a(e) {
		switch (e.t) {
			case 34: return Xd;
			case 32: return Zd;
			case 31: return Qd;
			case 25:
			case 26: return $d;
			case 27:
			case 28:
			case 29:
			case 30: return ef;
			case 20:
			case 21: return tf;
			case 22:
			case 23:
			case 24: return nf;
			case 19:
			case 3: return af;
			default: return 0;
		}
	}
	function o(e = 0) {
		let t = s();
		for (; a(n()) > e;) t = c(t);
		return t;
	}
	function s() {
		let a = n();
		if (a.t === 14) return r(), {
			k: "Str",
			v: a.v
		};
		if (a.t === 15) return r(), {
			k: "Num",
			v: a.v
		};
		if (a.t === 10) return r(), {
			k: "Bool",
			v: !0
		};
		if (a.t === 11) return r(), {
			k: "Bool",
			v: !1
		};
		if (a.t === 12) return r(), { k: "Null" };
		if (a.t === 3) return u();
		if (a.t === 5) return d();
		if (a.t === 18) {
			let e = a.v;
			return r(), n().t === 9 ? (r(), {
				k: "Assign",
				target: e,
				value: o(0)
			}) : {
				k: "StateRef",
				n: e
			};
		}
		if (a.t === 17) {
			let n = a.v;
			return e[t + 1]?.t === 1 && (!su(n) || n === "Action") ? l() : (r(), {
				k: "Ref",
				n
			});
		}
		if (a.t === 35) {
			if (e[t + 1]?.t === 1) {
				let e = l();
				return e.k === "Comp" && !su(e.name) && (e.fn = !0), e;
			}
			return r(), {
				k: "Ref",
				n: a.v
			};
		}
		if (a.t === 16) return r(), {
			k: "Ref",
			n: a.v
		};
		if (a.t === 33) return r(), {
			k: "UnaryOp",
			op: "!",
			operand: o(rf)
		};
		if (a.t === 21) return r(), {
			k: "UnaryOp",
			op: "-",
			operand: o(rf)
		};
		if (a.t === 1) {
			r();
			let e = o(0);
			return i(2), e;
		}
		return r(), { k: "Null" };
	}
	function c(e) {
		let t = n();
		if (t.t === 20) return r(), {
			k: "BinOp",
			op: "+",
			left: e,
			right: o(tf)
		};
		if (t.t === 21) return r(), {
			k: "BinOp",
			op: "-",
			left: e,
			right: o(tf)
		};
		if (t.t === 22) return r(), {
			k: "BinOp",
			op: "*",
			left: e,
			right: o(nf)
		};
		if (t.t === 23) return r(), {
			k: "BinOp",
			op: "/",
			left: e,
			right: o(nf)
		};
		if (t.t === 24) return r(), {
			k: "BinOp",
			op: "%",
			left: e,
			right: o(nf)
		};
		if (t.t === 25) return r(), {
			k: "BinOp",
			op: "==",
			left: e,
			right: o($d)
		};
		if (t.t === 26) return r(), {
			k: "BinOp",
			op: "!=",
			left: e,
			right: o($d)
		};
		if (t.t === 27) return r(), {
			k: "BinOp",
			op: ">",
			left: e,
			right: o(ef)
		};
		if (t.t === 28) return r(), {
			k: "BinOp",
			op: "<",
			left: e,
			right: o(ef)
		};
		if (t.t === 29) return r(), {
			k: "BinOp",
			op: ">=",
			left: e,
			right: o(ef)
		};
		if (t.t === 30) return r(), {
			k: "BinOp",
			op: "<=",
			left: e,
			right: o(ef)
		};
		if (t.t === 31) return r(), {
			k: "BinOp",
			op: "&&",
			left: e,
			right: o(Qd)
		};
		if (t.t === 32) return r(), {
			k: "BinOp",
			op: "||",
			left: e,
			right: o(Zd)
		};
		if (t.t === 34) {
			r();
			let t = o(0);
			return i(8), {
				k: "Ternary",
				cond: e,
				then: t,
				else: o(0)
			};
		}
		if (t.t === 19) {
			r();
			let t = n();
			return {
				k: "Member",
				obj: e,
				field: t.t === 16 || t.t === 17 || t.t === 14 || t.t === 15 ? (r(), String(t.v)) : t.t === 18 ? (r(), t.v.replace(/^\$/, "")) : (r(), "?")
			};
		}
		if (t.t === 3) {
			r();
			let t = o(0);
			return i(4), {
				k: "Index",
				obj: e,
				index: t
			};
		}
		return e;
	}
	function l() {
		let e = n().v;
		r(), i(1);
		let t = [];
		for (; n().t !== 2 && n().t !== 13;) t.push(o(0)), n().t === 7 && r();
		return i(2), {
			k: "Comp",
			name: e,
			args: t
		};
	}
	function u() {
		r();
		let e = [];
		for (; n().t !== 4 && n().t !== 13;) e.push(o(0)), n().t === 7 && r();
		return i(4), {
			k: "Arr",
			els: e
		};
	}
	function d() {
		r();
		let e = [];
		for (; n().t !== 6 && n().t !== 13;) {
			let t = n(), a = t.t === 16 || t.t === 14 || t.t === 17 || t.t === 15 ? (r(), String(t.v)) : t.t === 18 ? (r(), t.v.replace(/^\$/, "")) : (r(), "?");
			i(8), e.push([a, o(0)]), n().t === 7 && r();
		}
		return i(6), {
			k: "Obj",
			entries: e
		};
	}
	return o(0);
}
function sf(e) {
	let t = [], n = 0, r = e.length;
	for (; n < r;) {
		for (; n < r && (e[n] === " " || e[n] === "	" || e[n] === "\r");) n++;
		if (n >= r) break;
		let i = e[n];
		if (i === "\n") {
			t.push({
				t: 0,
				start: n
			}), n++;
			continue;
		}
		if (i === "(") {
			t.push({ t: 1 }), n++;
			continue;
		}
		if (i === ")") {
			t.push({ t: 2 }), n++;
			continue;
		}
		if (i === "[") {
			t.push({ t: 3 }), n++;
			continue;
		}
		if (i === "]") {
			t.push({ t: 4 }), n++;
			continue;
		}
		if (i === "{") {
			t.push({ t: 5 }), n++;
			continue;
		}
		if (i === "}") {
			t.push({ t: 6 }), n++;
			continue;
		}
		if (i === ",") {
			t.push({ t: 7 }), n++;
			continue;
		}
		if (i === ":") {
			t.push({ t: 8 }), n++;
			continue;
		}
		if (i === "=") {
			n + 1 < r && e[n + 1] === "=" ? (t.push({ t: 25 }), n += 2) : (t.push({ t: 9 }), n++);
			continue;
		}
		if (i === "!") {
			n + 1 < r && e[n + 1] === "=" ? (t.push({ t: 26 }), n += 2) : (t.push({ t: 33 }), n++);
			continue;
		}
		if (i === ">") {
			n + 1 < r && e[n + 1] === "=" ? (t.push({ t: 29 }), n += 2) : (t.push({ t: 27 }), n++);
			continue;
		}
		if (i === "<") {
			n + 1 < r && e[n + 1] === "=" ? (t.push({ t: 30 }), n += 2) : (t.push({ t: 28 }), n++);
			continue;
		}
		if (i === "&") {
			n + 1 < r && e[n + 1] === "&" ? (t.push({ t: 31 }), n += 2) : (t.push({ t: 31 }), n++);
			continue;
		}
		if (i === "|") {
			n + 1 < r && e[n + 1] === "|" ? (t.push({ t: 32 }), n += 2) : (t.push({ t: 32 }), n++);
			continue;
		}
		if (i === ".") {
			t.push({ t: 19 }), n++;
			continue;
		}
		if (i === "?") {
			t.push({ t: 34 }), n++;
			continue;
		}
		if (i === "+") {
			t.push({ t: 20 }), n++;
			continue;
		}
		if (i === "*") {
			t.push({ t: 22 }), n++;
			continue;
		}
		if (i === "#" || i === "/" && e[n + 1] === "/") {
			for (; n < r && e[n] !== "\n";) n++;
			continue;
		}
		if (i === "/") {
			t.push({ t: 23 }), n++;
			continue;
		}
		if (i === "%") {
			t.push({ t: 24 }), n++;
			continue;
		}
		if (i === "\"") {
			let i = n;
			n++;
			let a = !1;
			for (; n < r;) if (e[n] === "\\") n += 2;
			else if (e[n] === "\"") {
				n++, a = !0;
				break;
			} else n++;
			let o = e.slice(i, n);
			try {
				let e = a ? o : o + "\"";
				t.push({
					t: 14,
					v: JSON.parse(e)
				});
			} catch {
				let e = o.replace(/^"|"$/g, "");
				t.push({
					t: 14,
					v: e
				});
			}
			continue;
		}
		if (i === "'") {
			n++;
			let i = "";
			for (; n < r;) if (e[n] === "\\") {
				if (n++, n < r) {
					let t = e[n];
					i += t === "'" ? "'" : t === "\\" ? "\\" : t === "n" ? "\n" : t === "t" ? "	" : t, n++;
				}
			} else if (e[n] === "'") {
				n++;
				break;
			} else i += e[n], n++;
			t.push({
				t: 14,
				v: i
			});
			continue;
		}
		if (i === "-") {
			let i = t.length > 0 ? t[t.length - 1] : null;
			if (!((i == null || i.t !== 15 && i.t !== 14 && i.t !== 16 && i.t !== 17 && i.t !== 2 && i.t !== 4 && i.t !== 10 && i.t !== 11 && i.t !== 12 && i.t !== 18 && i.t !== 35) && n + 1 < r && e[n + 1] >= "0" && e[n + 1] <= "9")) {
				t.push({ t: 21 }), n++;
				continue;
			}
		}
		let a = i >= "0" && i <= "9", o = i === "-" && n + 1 < r && e[n + 1] >= "0" && e[n + 1] <= "9";
		if (a || o) {
			let i = n;
			for (e[n] === "-" && n++; n < r && e[n] >= "0" && e[n] <= "9";) n++;
			if (n < r && e[n] === "." && n + 1 < r && e[n + 1] >= "0" && e[n + 1] <= "9") for (n++; n < r && e[n] >= "0" && e[n] <= "9";) n++;
			if (n < r && (e[n] === "e" || e[n] === "E")) for (n++, n < r && (e[n] === "+" || e[n] === "-") && n++; n < r && e[n] >= "0" && e[n] <= "9";) n++;
			t.push({
				t: 15,
				v: +e.slice(i, n)
			});
		} else if (i === "$" && n + 1 < r && (e[n + 1] >= "a" && e[n + 1] <= "z" || e[n + 1] >= "A" && e[n + 1] <= "Z" || e[n + 1] === "_")) {
			let i = n;
			for (n++; n < r && (e[n] >= "a" && e[n] <= "z" || e[n] >= "A" && e[n] <= "Z" || e[n] >= "0" && e[n] <= "9" || e[n] === "_");) n++;
			t.push({
				t: 18,
				v: e.slice(i, n),
				start: i
			});
		} else if (i >= "a" && i <= "z" || i >= "A" && i <= "Z" || i === "_") {
			let a = n;
			for (; n < r && (e[n] >= "a" && e[n] <= "z" || e[n] >= "A" && e[n] <= "Z" || e[n] >= "0" && e[n] <= "9" || e[n] === "_");) n++;
			let o = e.slice(a, n);
			if (o === "true") {
				t.push({ t: 10 });
				continue;
			}
			if (o === "false") {
				t.push({ t: 11 });
				continue;
			}
			if (o === "null") {
				t.push({ t: 12 });
				continue;
			}
			let s = i >= "A" && i <= "Z" ? 17 : 16;
			t.push({
				t: s,
				v: o,
				start: a
			});
		} else if (i === "@" && n + 1 < r && (e[n + 1] >= "a" && e[n + 1] <= "z" || e[n + 1] >= "A" && e[n + 1] <= "Z" || e[n + 1] === "_")) {
			n++;
			let i = n;
			for (; n < r && (e[n] >= "a" && e[n] <= "z" || e[n] >= "A" && e[n] <= "Z" || e[n] >= "0" && e[n] <= "9" || e[n] === "_");) n++;
			t.push({
				t: 35,
				v: e.slice(i, n)
			});
		} else n++;
	}
	return t.push({
		t: 13,
		start: r
	}), t;
}
function cf(e) {
	let t = [], n = !1, r = !1;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		r ? r = !1 : a === "\\" && n ? r = !0 : n ? a === n && (n = !1) : a === "\"" || a === "'" ? n = a : a === "(" || a === "[" || a === "{" ? t.push(a) : (a === ")" && t[t.length - 1] === "(" || a === "]" && t[t.length - 1] === "[" || a === "}" && t[t.length - 1] === "{") && t.pop();
	}
	if (!(n || t.length > 0)) return {
		text: e,
		wasIncomplete: !1
	};
	let i = e;
	n && (r && (i += "\\"), i += n);
	for (let e = t.length - 1; e >= 0; e--) i += t[e] === "(" ? ")" : t[e] === "[" ? "]" : "}";
	return {
		text: i,
		wasIncomplete: !0
	};
}
function lf(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		for (; n < e.length && e[n].t === 0;) n++;
		if (n >= e.length || e[n].t === 13) break;
		let r = e[n];
		if (r.t !== 16 && r.t !== 17 && r.t !== 18) {
			for (; n < e.length && e[n].t !== 0 && e[n].t !== 13;) n++;
			continue;
		}
		let i = r.v, a = r.t;
		if (n++, n >= e.length || e[n].t !== 9) {
			for (; n < e.length && e[n].t !== 0 && e[n].t !== 13;) n++;
			continue;
		}
		n++;
		let o = [], s = 0, c = 0;
		for (; n < e.length && e[n].t !== 13;) {
			let t = e[n].t;
			if (t === 0 && s <= 0 && c <= 0) {
				let t = n + 1;
				for (; t < e.length && e[t].t === 0;) t++;
				let r = t < e.length ? e[t].t : 13;
				if (r === 34 || r === 8 && c > 0) {
					n++;
					continue;
				}
				break;
			}
			t === 0 ? n++ : (t === 1 || t === 3 || t === 5 ? s++ : (t === 2 || t === 4 || t === 6) && s > 0 ? s-- : t === 34 && s === 0 ? c++ : t === 8 && s === 0 && c > 0 && c--, o.push(e[n++]));
		}
		o.length && t.push({
			id: i,
			idTokenType: a,
			tokens: o,
			start: r.start,
			end: e[n]?.start
		});
	}
	return t;
}
function uf(e = !0) {
	return {
		root: null,
		meta: {
			incomplete: e,
			unresolved: [],
			orphaned: [],
			statementCount: 0,
			errors: []
		},
		stateDeclarations: {},
		queryStatements: [],
		mutationStatements: []
	};
}
function df(e) {
	if (!Xu(e)) return [];
	let t = /* @__PURE__ */ new Set();
	return Zu(e, (e) => {
		e.k === "StateRef" && t.add(e.n);
	}), [...t];
}
function ff(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n && Zu(n, (e) => {
		e.k === "RuntimeRef" && e.refType === "query" && t.add(e.n);
	});
	return [...t];
}
function pf(e) {
	let t = new Map(e.map((e, t) => [e.statementId, t])), n = new Map(e.map((e) => [e.statementId, e.waitFor ?? []])), r = /* @__PURE__ */ new Set(), i = [], a = [], o = (e) => {
		i.push(e);
		for (let s of n.get(e)) {
			let e = i.indexOf(s);
			e >= 0 ? a.push(i.slice(e).sort((e, n) => t.get(e) - t.get(n))) : n.has(s) && !r.has(s) && o(s);
		}
		i.pop(), r.add(e);
	};
	for (let t of e) r.has(t.statementId) || o(t.statementId);
	return a;
}
function mf(e, t) {
	return Xu(e) ? hf(e) ? G(e, {
		getState: (e) => t[e] ?? null,
		resolveRef: () => null
	}) : null : Array.isArray(e) ? e.map((e) => mf(e, t)) : e && typeof e == "object" && !Ku(e) ? Object.fromEntries(Object.entries(e).map(([e, n]) => [e, mf(n, t)])) : e;
}
function hf(e) {
	let t = !0;
	return Zu(e, (e) => {
		e.k === "Comp" && au.get(e.name)?.kind !== "function" && (t = !1);
	}), t;
}
function gf(e, t) {
	return t.k === "Comp" && t.name === lu.Query ? {
		kind: "query",
		id: e.id,
		call: {
			callee: lu.Query,
			args: t.args
		},
		expr: t
	} : t.k === "Comp" && t.name === lu.Mutation ? {
		kind: "mutation",
		id: e.id,
		call: {
			callee: lu.Mutation,
			args: t.args
		},
		expr: t
	} : e.idTokenType === 18 ? {
		kind: "state",
		id: e.id,
		init: t
	} : {
		kind: "value",
		id: e.id,
		expr: t
	};
}
function _f(e, t, n) {
	let r = {}, i = [], a = [];
	for (let n of e) switch (n.kind) {
		case "state":
			r[n.id] = mf(Ad(n.init, t), r);
			break;
		case "query": {
			let e = Sd(t, n.id, () => n.call.args.map((e) => kd(e, t))), r = df(e[1]), a = ff([e[0], e[1]]);
			i.push({
				statementId: n.id,
				toolAST: e[0] ?? null,
				argsAST: e[1] ?? null,
				defaultsAST: e[2] ?? null,
				refreshAST: e[3] ?? null,
				deps: r.length > 0 ? r : void 0,
				waitFor: a.length > 0 ? a : void 0,
				complete: !0
			});
			break;
		}
		case "mutation": {
			let e = Sd(t, n.id, () => n.call.args.map((e) => kd(e, t)));
			a.push({
				statementId: n.id,
				toolAST: e[0] ?? null,
				argsAST: e[1] ?? null
			});
			break;
		}
	}
	for (let e of pf(i)) Sd(t, e[0], () => ld(t, "Query", "", {
		code: "query-cycle",
		cycle: e
	}));
	for (let t of e) {
		let e = t.kind === "state" ? [t.init] : t.kind === "value" ? [t.expr] : t.kind === "query" || t.kind === "mutation" ? t.call.args : [];
		for (let i of e) for (let e of df(i)) e === n?.name && n.stmts.has(t) || e in r || (r[e] = null);
	}
	return {
		stateDeclarations: r,
		queryStatements: i,
		mutationStatements: a
	};
}
var vf = "root";
function K(e) {
	return e?.k === "Comp" && !e.fn && !su(e.name) && !uu(e.name);
}
function yf(e, t) {
	if (e.has(vf)) return {
		id: vf,
		fallback: !1
	};
	for (let n of e.values()) if (n.kind === "value" && K(n.expr) && n.expr.name === t) return {
		id: n.id,
		fallback: !0
	};
	return null;
}
function bf(e, t) {
	let n = /* @__PURE__ */ new Set();
	for (; e?.k === "Ref" && !n.has(e.n);) n.add(e.n), e = t.get(e.n);
	return K(e);
}
function xf(e) {
	let t = !1;
	return Zu(e, (e) => {
		K(e) && (t = !0);
	}), t;
}
function Sf(e, t, n, r, i, a, o) {
	let s = yf(e, a), c = /* @__PURE__ */ new Map();
	for (let [t, n] of e) c.set(t, n.kind === "state" ? n.init : n.expr);
	let l = [], u = [], d = /* @__PURE__ */ new Set();
	for (let [t, n] of e) t !== s?.id && n.kind !== "state" && n.kind !== "query" && n.kind !== "mutation" && d.add(t);
	let f = {
		syms: c,
		cat: i,
		errors: u,
		unres: l,
		visited: /* @__PURE__ */ new Set(),
		partial: n,
		currentStatementId: s?.id,
		unreached: d
	}, p = null, m;
	if (s) {
		let e = Ad(c.get(s.id), f);
		Ku(e) ? p = bd(e, s.id) : Xu(e) && xf(e) && (m = e);
	}
	let { stateDeclarations: h, queryStatements: g, mutationStatements: _ } = _f(t, f, o);
	f.currentStatementId = s?.id;
	let v = a ?? "";
	s ? !p && !m && !bf(c.get(s.id), c) ? ld(f, v, "", {
		code: "no-root",
		reason: "not-component"
	}) : s.fallback && ld(f, v, "", {
		code: "no-root",
		reason: p ? "fallback" : "missing"
	}) : ld(f, v, "", {
		code: "no-root",
		reason: "missing"
	});
	let y = s ? [...d] : [];
	return {
		root: p,
		...m ? { rootExpression: m } : {},
		meta: {
			incomplete: n,
			unresolved: l,
			orphaned: y,
			statementCount: r,
			errors: u
		},
		stateDeclarations: h,
		queryStatements: g,
		mutationStatements: _
	};
}
var Cf = /^\s*\$?[A-Za-z_]\w*\s*=(?!=)/, wf = /^[ \t]*```[ \t]*([\w.+-]*)[ \t]*(.*?)[ \t]*\r?$/;
function Tf(e, t) {
	return Cf.test(t) ? t : e && /^=(?!=)/.test(t) ? e + " " + t : null;
}
function Ef(e, t) {
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		t.open ? r === "\\" ? n++ : r === "\"" && (t.open = !1) : r === "\"" ? t.open = !0 : r === "(" || r === "[" || r === "{" ? t.depth++ : (r === ")" || r === "]" || r === "}") && t.depth > 0 && t.depth--;
	}
}
function Df(e) {
	return Cf.test(e.replace(/^(\s*(\/\/|#)[^\n]*\n)+/, ""));
}
function Of(e) {
	if (!e.includes("```")) return e;
	let t = [], n = [], r = null, i = !1, a = {
		open: !1,
		depth: 0
	};
	for (let o of e.split("\n")) {
		let e = a.open ? null : wf.exec(o);
		if (!e) {
			if (i) continue;
			(r ?? n).push(o), (a.open || a.depth > 0 || r !== null || Cf.test(o)) && Ef(o, a);
			continue;
		}
		a.depth = 0;
		let [, s = "", c = ""] = e;
		if (r !== null) {
			i || t.push(r.join("\n")), r = null, i = !1;
			continue;
		}
		if (c.includes("```")) continue;
		let l = Tf(s, c);
		i = s.toLowerCase() === "openui-js", r = l === null ? [] : [l];
	}
	return r !== null && !i && t.push(r.join("\n")), t.some(Df) ? t.join("\n") : n.some((e) => Cf.test(e)) || t.every((e) => e.trim() === "") ? n.join("\n") : t.join("\n");
}
function kf(e) {
	let t = !1;
	return e.split("\n").map((e) => {
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (t) {
				if (r === "\\" && n + 1 < e.length) {
					n++;
					continue;
				}
				r === t && (t = !1);
			} else if (r === "\"" || r === "'") t = r;
			else if (r === "/" && e[n + 1] === "/" || r === "#") return e.substring(0, n).trimEnd();
		}
		return e;
	}).join("\n");
}
function Af(e) {
	return kf(Of(e.trim())).trim();
}
function jf(e, t) {
	let n = "", r = "", i = 0, a = /* @__PURE__ */ new Map(), o = 0;
	function s(e) {
		let t = e.trim();
		if (t) for (let e of lf(sf(t))) {
			let t = gf(e, of(e.tokens));
			a.set(e.id, t), o++;
		}
	}
	function c() {
		let e = Af(n);
		e.startsWith(r.slice(0, i)) || (i = 0, a.clear(), o = 0), r = e;
	}
	function l() {
		let e = 0, t = 0, n = !1, a = !1, o = i;
		for (let c = i; c < r.length; c++) {
			let l = r[c];
			if (a) a = !1;
			else if (l === "\\" && n) a = !0;
			else if (n) l === n && (n = !1);
			else if (l === "\"" || l === "'") n = l;
			else if (l === "(" || l === "[" || l === "{") e++;
			else if (l === ")" || l === "]" || l === "}") e = Math.max(0, e - 1);
			else if (l === "?" && e === 0) t++;
			else if (l === ":" && e === 0 && t > 0) t--;
			else if (l === "\n" && e <= 0 && t <= 0) {
				let e = c + 1;
				for (; e < r.length && (r[e] === " " || r[e] === "	" || r[e] === "\r" || r[e] === "\n");) e++;
				if (e < r.length && (r[e] === "?" || r[e] === ":" && t > 0)) continue;
				let n = r.slice(o, c).trim();
				n && s(n), o = c + 1, i = c + 1;
			}
		}
		return o;
	}
	function u(i = !1) {
		c();
		let s = l(), u = r.slice(s).trim();
		if (!u) return o === 0 ? uf() : Sf(a, [...a.values()], !1, o, e, t);
		let { text: d, wasIncomplete: f } = cf(u), p = lf(sf(d));
		if (!p.length) return o === 0 ? uf(f) : Sf(a, [...a.values()], f, o, e, t);
		let m = new Map(a), h = /* @__PURE__ */ new Set();
		for (let e of p) {
			if (a.has(e.id) && f) continue;
			let t = gf(e, of(e.tokens));
			m.set(e.id, t), h.add(t);
		}
		let g = i ? void 0 : /\$\w+$/.exec(n)?.[0], _ = g && u.endsWith(g) && !RegExp(`\\${g}(?!\\w)`).test(u.slice(0, -g.length)) ? g : void 0;
		return Sf(m, [...m.values()], f, o + p.length, e, t, _ ? {
			name: _,
			stmts: h
		} : void 0);
	}
	function d() {
		n = "", r = "", i = 0, a.clear(), o = 0;
	}
	return {
		push(e, t) {
			return n += e, u(t);
		},
		set(e, t) {
			(e.length < n.length || !e.startsWith(n)) && d();
			let r = e.slice(n.length);
			return r && (n += r), u(t);
		},
		getResult: u
	};
}
function Mf(e, t) {
	if (!e || typeof e != "object") return e;
	let n = e.$ref;
	if (typeof n == "string") return t.has(n) ? Mf(t.get(n), t) : e;
	let r = Array.isArray(e) ? [...e] : { ...e }, i = !1;
	for (let [e, n] of Object.entries(r)) r[e] = Mf(n, t), i ||= r[e] !== n;
	return i ? r : e;
}
function Nf(e, t) {
	let n = e.properties ?? {}, r = e.required ?? [];
	return Object.keys(n).map((e) => ({
		name: e,
		required: r.includes(e),
		defaultValue: W(n[e]),
		schema: t.size ? Mf(n[e], t) : n[e]
	}));
}
function Pf(e) {
	let t = /* @__PURE__ */ new Map(), n = e.properties && new Set(Object.keys(e.properties)), r = /* @__PURE__ */ new Map();
	for (let t of [...Object.keys(tu), ...Object.keys(e.actions ?? {})]) {
		let i = e.$defs?.[t];
		i && !n?.has(t) && r.set(`#/$defs/${t}`, i);
	}
	for (let [i, a] of Object.entries(e.$defs ?? {})) (n ? !n.has(i) : r.has(`#/$defs/${i}`)) || t.set(i, { params: Nf(a, r) });
	t.callDefs = new Map(au);
	for (let [n, i] of Object.entries(e.functions ?? {})) t.callDefs.set(n, {
		kind: "function",
		params: Nf(i.params, r)
	});
	for (let [n, i] of Object.entries(e.actions ?? {})) t.callDefs.set(n, {
		kind: "action",
		params: Nf(i.params, r)
	});
	return t;
}
function Ff(e, t) {
	return jf(Pf(e), t);
}
function If(e, t) {
	if (!t?.properties) return;
	let n = new Set(t.required ?? []);
	return `Signature: ${e}(${Object.keys(t.properties).map((e) => n.has(e) ? `${e}*` : e).join(", ")}) — * marks required`;
}
function Lf(e, t, n) {
	return e.map((e) => {
		let r = {
			source: "parser",
			code: e.code,
			message: e.message,
			component: e.component,
			path: e.path || void 0,
			statementId: e.statementId,
			...e.severity && { severity: e.severity }
		};
		return e.code === "unknown-component" && n.length ? r.hint = `Available components: ${n.join(", ")}` : e.code === "missing-required" || e.code === "null-required" ? r.hint = If(e.component, t.$defs?.[e.component]) : e.code === "inline-reserved" && (r.hint = `Declare as a top-level statement: myVar = ${e.component}(...)`), r;
	});
}
function Rf(e, t) {
	if (e.hasDynamicProps === !1) return e;
	let n = { library: t.library }, r = t.library.components[e.typeName], i = {}, a = "", o = (n) => {
		t.errors?.push({
			source: "runtime",
			code: "runtime-error",
			component: e.typeName,
			statementId: e.statementId,
			message: `Evaluating prop "${a}" on ${e.typeName} failed: ${n}`,
			hint: `Check the expression used for prop "${a}"`
		});
	}, s = t.ctx.functions || t.ctx.actions ? {
		...t,
		ctx: {
			...t.ctx,
			reportError: o
		}
	} : t;
	for (let [t, c] of Object.entries(e.props)) {
		a = t;
		let e = r?.props?.shape?.[a];
		try {
			i[a] = Bf(c, s, n, e);
		} catch (e) {
			i[a] = c, o(e instanceof Error ? e.message : String(e));
		}
	}
	return {
		...e,
		props: i
	};
}
function zf(e, t) {
	if (e.root) return Rf(e.root, t);
	if (!e.rootExpression) return null;
	let n = G(e.rootExpression, t.ctx, { library: t.library });
	return Ku(n) ? Rf(n, t) : (t.errors?.push({
		source: "runtime",
		code: "no-root",
		statementId: "root",
		message: "root does not evaluate to a component"
	}), null);
}
function Bf(e, t, n, r) {
	return jd(e, t.ctx, n, r, {
		recurseElement: (e) => Rf(e, t),
		recurse: (e, r) => Bf(e, t, n, r)
	});
}
var Vf = class extends Error {
	toolErrorText;
	constructor(e) {
		super(`MCP tool error: ${e || "Unknown error"}`), this.name = "McpToolError", this.toolErrorText = e;
	}
};
function Hf(e) {
	if (e.isError) {
		let t = e.content?.filter((e) => e.type === "text").map((e) => e.text).join("\n");
		throw new Vf(t || "Unknown error");
	}
	if (e.structuredContent != null) return e.structuredContent;
	let t = e.content?.filter((e) => e.type === "text").map((e) => e.text ?? "");
	if (t?.length) {
		let e = t.join("");
		try {
			return JSON.parse(e);
		} catch {
			return e;
		}
	}
	return null;
}
var Uf = class extends Error {
	toolName;
	availableTools;
	constructor(e, t = []) {
		super(`[openui] No handler for tool "${e}". Available: ${t.join(", ") || "(none)"}`), this.name = "ToolNotFoundError", this.toolName = e, this.availableTools = t;
	}
};
function Wf(e) {
	return JSON.stringify(e, (e, t) => {
		if (t && typeof t == "object" && !Array.isArray(t)) {
			let e = {};
			for (let n of Object.keys(t).sort()) e[n] = t[n];
			return e;
		}
		if (t === void 0) return "__undefined__";
		if (typeof t == "number") {
			if (Number.isNaN(t)) return "__NaN__";
			if (t === Infinity) return "__Inf__";
			if (t === -Infinity) return "__-Inf__";
		}
		return t;
	});
}
function Gf(e, t, n) {
	let r = n == null ? "" : "::" + Wf(n);
	return e + "::" + Wf(t) + r;
}
function Kf(e, t, n) {
	let r = e.toolAST ? G(e.toolAST, t) : "", i = {};
	for (let n of e.deps ?? []) i[n] = t.getState(n);
	return Object.assign(i, n?.(r)), {
		statementId: e.statementId,
		toolName: r,
		args: e.argsAST ? G(e.argsAST, t) : null,
		defaults: e.defaultsAST ? G(e.defaultsAST, t) : null,
		refreshInterval: e.refreshAST ? G(e.refreshAST, t) : void 0,
		deps: Object.keys(i).length > 0 ? i : void 0,
		complete: e.complete,
		waitFor: e.waitFor
	};
}
function q(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set(), a = {
		__openui_loading: [],
		__openui_refetching: [],
		__openui_errors: []
	}, o = JSON.stringify(a), s = !1, c = 0, l = [], u = null, d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
	function p() {
		let e = {
			__openui_loading: [],
			__openui_refetching: [],
			__openui_errors: []
		};
		for (let [n, r] of t) e[n] = w(n), C(n) && (e.__openui_loading.push(n), r.everFetched && e.__openui_refetching.push(n)), r.error && e.__openui_errors.push(r.error);
		for (let [t, r] of n) e[t] = r.result, r.error && e.__openui_errors.push(r.error);
		try {
			let t = JSON.stringify(e);
			if (t === o) return !1;
			a = e, o = t;
		} catch {
			a = e, o = "";
		}
		return !0;
	}
	function m() {
		for (let e of [...i]) e();
	}
	async function h(n, i) {
		if (!e) return;
		let a = t.get(i);
		if (!a) return;
		let o = n, c = a.toolName, l = a.args, u = r.get(o);
		u ? u.inFlight = !0 : (u = {
			data: void 0,
			inFlight: !0
		}, r.set(o, u)), a.loading = !0, p(), m();
		try {
			let n = await e.callTool(c, l ?? {});
			if (s) return;
			let r = t.get(i);
			if (!r || r.cacheKey !== o) {
				u.inFlight = !1;
				return;
			}
			u.data = n ?? null, u.failed = !1, r.everFetched = !0;
			for (let e of t.values()) e.cacheKey === o && (e.error = void 0);
			if (r.prevCacheKey && r.prevCacheKey !== o) {
				let e = r.prevCacheKey;
				r.prevCacheKey = void 0, g(e);
			}
		} catch (e) {
			let n = e instanceof Uf ? {
				code: "tool-not-found",
				message: `Query tool "${c}" not found`,
				hint: e.availableTools.length ? `Available tools: ${e.availableTools.join(", ")}` : void 0
			} : e instanceof Vf ? {
				code: "mcp-error",
				message: `Query "${c}" returned an error: ${e.toolErrorText}`
			} : {
				code: "tool-error",
				message: `Query "${c}" failed: ${e instanceof Error ? e.message : String(e)}`
			};
			for (let [e, r] of t) r.cacheKey === o && (r.error = {
				source: "query",
				statementId: e,
				component: "Query",
				toolName: c,
				...n
			}, u.failed = !0);
			console.error(`Query "${c}" failed:`, e);
		} finally {
			u.inFlight = !1;
			let e = t.get(i);
			e && e.cacheKey === o ? (e.loading = !1, p() && m(), e.needsRefetch && (e.needsRefetch = !1, h(e.cacheKey, i))) : p() && m(), y();
		}
	}
	function g(e) {
		for (let n of t.values()) if (n.cacheKey === e || n.prevCacheKey === e) return;
		r.delete(e);
	}
	function _(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e.waitFor ?? []) t.set(n, S(n));
		let n = u(e);
		return f.set(e.statementId, t), d.set(e.statementId, n), n;
	}
	function v(e, t, n) {
		s || (l = e, u = (e) => Kf(e, t, n?.extraDeps), d.clear(), f.clear(), x(e.map(_)), y());
	}
	function y() {
		for (let e = 0; e <= l.length; e++) {
			if (s || !u) return;
			let e = new Set(l.filter((e) => e.waitFor?.some((t) => S(t) !== f.get(e.statementId)?.get(t))));
			if (e.size === 0) return;
			x(l.map((t) => e.has(t) ? _(t) : d.get(t.statementId)));
		}
	}
	function b(e) {
		l = [], u = null, d.clear(), f.clear(), x(e);
	}
	function x(n) {
		if (s) return;
		let i = new Set(n.map((e) => e.statementId));
		for (let [e, n] of t) i.has(e) || (n.timer && clearInterval(n.timer), t.delete(e), g(n.cacheKey), n.prevCacheKey && g(n.prevCacheKey));
		for (let i of n) {
			if (!i.complete) continue;
			let n = Gf(i.toolName, i.args, i.deps), a = t.get(i.statementId);
			a ? (a.cacheKey !== n && (a.prevCacheKey = a.cacheKey), a.toolName = i.toolName, a.args = i.args, a.defaults = i.defaults, a.cacheKey = n) : t.set(i.statementId, {
				toolName: i.toolName,
				args: i.args,
				defaults: i.defaults,
				cacheKey: n,
				loading: !1,
				everFetched: !1,
				refreshInterval: 0,
				needsRefetch: !1
			});
			let o = t.get(i.statementId);
			if (o.waitFor = i.waitFor, o.waiting = i.waitFor?.some((e) => S(e) === void 0) ?? !1, o.waiting) continue;
			let c = r.get(n), l = c && (c.data !== void 0 || c.failed);
			e && !l && !c?.inFlight && h(n, i.statementId);
			let u = i.refreshInterval ?? 0;
			u !== o.refreshInterval && (o.timer &&= (clearInterval(o.timer), void 0), u > 0 && (o.timer = setInterval(() => {
				s || !e || o.waiting || r.get(o.cacheKey)?.inFlight || h(o.cacheKey, i.statementId);
			}, u * 1e3)), o.refreshInterval = u);
		}
		p() && m();
	}
	function S(e) {
		let n = t.get(e);
		if (!n) return;
		let i = r.get(n.cacheKey)?.data;
		return i !== void 0 || !n.prevCacheKey ? i : r.get(n.prevCacheKey)?.data;
	}
	function C(e, n = /* @__PURE__ */ new Set()) {
		let r = t.get(e);
		return !r || n.has(e) ? !1 : (n.add(e), r.loading || !!r.waiting && (r.waitFor ?? []).some((e) => C(e, n)));
	}
	function w(e) {
		let n = t.get(e);
		if (!n) return null;
		let r = S(e);
		return r === void 0 ? n.defaults : r;
	}
	function T(e) {
		return C(e);
	}
	function E() {
		for (let e of t.values()) if (e.loading) return !0;
		return !1;
	}
	function D(n) {
		if (s || !e) return;
		let i = n?.length ? n.filter((e) => t.has(e)) : [...t.keys()];
		for (let e of i) {
			let n = t.get(e);
			n && !n.waiting && (r.get(n.cacheKey)?.inFlight ? n.needsRefetch = !0 : h(n.cacheKey, e));
		}
	}
	function ee(e) {
		let t = new Set(e.map((e) => e.statementId));
		for (let e of n.keys()) t.has(e) || n.delete(e);
		for (let t of e) {
			let e = n.get(t.statementId);
			e ? e.toolName !== t.toolName && (e.toolName = t.toolName, e.result = {
				status: "idle",
				data: null,
				error: null
			}, e.error = void 0) : n.set(t.statementId, {
				toolName: t.toolName,
				result: { status: "idle" }
			});
		}
		p() && m();
	}
	async function te(t, r, i) {
		if (s || !e) return !1;
		let a = n.get(t);
		if (!a || a.result.status === "loading") return !1;
		let o = c;
		a.result = { status: "loading" }, p(), m();
		let l = !1;
		try {
			let t = await e.callTool(a.toolName, r);
			if (s || o !== c) return !1;
			a.result = {
				status: "success",
				data: t
			}, a.error = void 0, l = !0;
		} catch (e) {
			if (s || o !== c) return !1;
			let n = e instanceof Error ? e.message : String(e);
			a.result = {
				status: "error",
				error: n
			}, a.error = e instanceof Uf ? {
				source: "mutation",
				code: "tool-not-found",
				message: `Mutation tool "${a.toolName}" not found`,
				statementId: t,
				component: "Mutation",
				toolName: a.toolName,
				hint: e.availableTools.length ? `Available tools: ${e.availableTools.join(", ")}` : void 0
			} : e instanceof Vf ? {
				source: "mutation",
				code: "mcp-error",
				message: `Mutation "${a.toolName}" returned an error: ${e.toolErrorText}`,
				statementId: t,
				component: "Mutation",
				toolName: a.toolName
			} : {
				source: "mutation",
				code: "tool-error",
				message: `Mutation "${a.toolName}" failed: ${n}`,
				statementId: t,
				component: "Mutation",
				toolName: a.toolName
			};
		}
		return p(), m(), l && i?.length && D(i), l;
	}
	function ne(e) {
		return n.get(e)?.result ?? null;
	}
	function re(e) {
		return i.add(e), () => i.delete(e);
	}
	function ie() {
		return a;
	}
	function ae() {
		s = !1;
	}
	function oe() {
		s = !0, c++, i.clear();
		for (let e of t.values()) e.timer &&= (clearInterval(e.timer), void 0), e.refreshInterval = 0, e.loading = !1, e.needsRefetch = !1;
		n.clear();
	}
	return {
		evaluateStatements: v,
		evaluateQueries: b,
		getResult: w,
		isLoading: T,
		isAnyLoading: E,
		invalidate: D,
		registerMutations: ee,
		fireMutation: te,
		getMutationResult: ne,
		subscribe: re,
		getSnapshot: ie,
		activate: ae,
		dispose: oe
	};
}
function qf(e, t, n, r, i, a) {
	if (Nd(t) && n && r) {
		let { target: i, expr: a } = t;
		return {
			name: e,
			value: n.get(i),
			setValue: (e) => {
				let t = { $value: e }, o = G(a, {
					...r,
					extraScope: t
				});
				n.set(i, o);
			},
			isReactive: !0
		};
	}
	return {
		name: e,
		value: i(e) ?? t,
		setValue: (t) => a(e, t),
		isReactive: !1
	};
}
function Jf() {
	let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = {};
	function i() {
		let e = [...n];
		for (let t of e) t();
	}
	function a() {
		r = Object.fromEntries(e);
	}
	function o(t) {
		return e.get(t);
	}
	function s(n, r, o) {
		o?.pristine ? t.add(n) : t.delete(n);
		let s = e.get(n);
		if (!Object.is(s, r)) {
			if (r && s && typeof r == "object" && typeof s == "object" && !Array.isArray(r) && !Array.isArray(s)) {
				let e = Object.keys(r), t = Object.keys(s);
				if (e.length === t.length && e.every((e) => Object.is(r[e], s[e]))) return;
			}
			e.set(n, r), a(), i();
		}
	}
	function c(e) {
		return n.add(e), () => {
			n.delete(e);
		};
	}
	function l() {
		return r;
	}
	function u(n, r) {
		let o = !1;
		for (let n of Object.keys(r)) t.delete(n), e.has(n) && Object.is(e.get(n), r[n]) || (e.set(n, r[n]), o = !0);
		for (let r of Object.keys(n)) e.has(r) ? t.has(r) && !Object.is(e.get(r), n[r]) && (e.set(r, n[r]), o = !0) : (e.set(r, n[r]), t.add(r), o = !0);
		o && (a(), i());
	}
	function d() {
		e.clear(), t.clear(), n.clear(), r = {};
	}
	return {
		get: o,
		set: s,
		subscribe: c,
		getSnapshot: l,
		initialize: u,
		dispose: d
	};
}
// node_modules/@openuidev/observability/dist/index.mjs
var Yf = "all";
function Xf() {
	let e = /* @__PURE__ */ new Map(), t = (e, t) => {
		try {
			e(t);
		} catch (e) {
			console.error("[@openuidev/observability] listener threw", e);
		}
	}, n = (t, n) => {
		let r = e.get(t);
		return r || (r = /* @__PURE__ */ new Set(), e.set(t, r)), r.add(n), () => {
			r.delete(n);
		};
	}, r = (n, r) => {
		let i = {
			level: n,
			timestamp: Date.now(),
			detail: r
		}, a = /* @__PURE__ */ new Set();
		e.get(n)?.forEach((e) => a.add(e)), e.get(Yf)?.forEach((e) => a.add(e)), a.forEach((e) => t(e, i));
	}, i = r;
	return i.listen = (e, t) => {
		let r = (Array.isArray(e) ? e : [e]).map((e) => n(e, t));
		return () => r.forEach((e) => e());
	}, i.listenAll = (e) => n(Yf, e), i.info = (e) => r("info", e), i.warn = (e) => r("warning", e), i.error = (e) => r("error", e), i;
}
var Zf = Symbol.for("openui.observability"), Qf = globalThis, $f = Qf[Zf] ??= Xf(), ep = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), J = (/* @__PURE__ */ o(((e, t) => {
	t.exports = ep();
})))();
function tp(e) {
	return e.id ?? e.root ?? Object.keys(e.components).sort().join(",");
}
function np(e) {
	return Nu(e);
}
function rp(e) {
	return ap(Ru(e));
}
var ip = 0;
function ap(e, t = tp(e)) {
	let n = e.extend;
	return Object.assign(e, { extend: ((e) => ap(n(e), `${t}:extend-${++ip}`)) });
}
var op = !1;
function sp() {
	if (op || typeof document > "u") return;
	op = !0;
	let e = document.createElement("style");
	e.textContent = "@keyframes openui-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }", document.head.appendChild(e);
}
function cp() {
	return (0, B.useInsertionEffect)(() => {
		sp();
	}, []), /* @__PURE__ */ (0, J.jsx)("div", {
		role: "status",
		"aria-label": "Loading data",
		style: {
			position: "absolute",
			top: 8,
			right: 8,
			width: 16,
			height: 16,
			border: "2px solid #e5e7eb",
			borderTopColor: "#3b82f6",
			borderRadius: "50%",
			animation: "openui-spin 0.6s linear infinite",
			zIndex: 10
		}
	});
}
function lp({ dimmed: e, style: t, ...n }) {
	return /* @__PURE__ */ (0, J.jsx)("div", {
		...n,
		style: e === void 0 ? t : {
			opacity: e ? .7 : 1,
			transition: "opacity 0.2s ease",
			...t
		}
	});
}
function up({ onActivate: e, controls: t, onClick: n, disabled: r, "aria-controls": i, ...a }) {
	return /* @__PURE__ */ (0, J.jsx)("button", {
		type: "button",
		...a,
		"aria-controls": t ?? i,
		disabled: r,
		onClick: (t) => {
			r || t.defaultPrevented || (n?.(t), t.defaultPrevented || e());
		}
	});
}
function dp({ style: e, ...t }) {
	return /* @__PURE__ */ (0, J.jsx)("section", {
		...t,
		style: {
			position: "relative",
			...e
		}
	});
}
var fp = (0, B.createContext)(null);
function pp() {
	let e = (0, B.useContext)(fp);
	if (!e) throw Error("useOpenUI must be used within a <Renderer /> component.");
	return e;
}
function mp() {
	return pp().renderNode;
}
var hp = (0, B.createContext)(void 0);
function gp() {
	return (0, B.useContext)(hp);
}
var _p = "]]>openui:scripts", vp = /^\]\]>openui:content(?:\?.*)?\r?$(\n?)/m, yp = /^\]\]>openui:scripts(?=\?|\r?$)/gm;
function bp(e) {
	if (!e.includes("]]>")) return -1;
	let t = "", n = !1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (t) n ? n = !1 : i === "\\" ? n = !0 : i === t && (t = "");
		else if (i === "#" || i === "/" && e[r + 1] === "/") {
			let t = e.indexOf("\n", r);
			if (t < 0) return -1;
			r = t;
		} else if (i === "\"" || i === "'") t = i;
		else if (e.startsWith("]]>", r)) return r;
	}
	return -1;
}
function xp(e, t) {
	try {
		let { count: n } = JSON.parse(e), r = JSON.parse(t);
		if (!Array.isArray(r) || !Number.isSafeInteger(n) || n !== r.length) return null;
		let i = /* @__PURE__ */ new Set();
		for (let e of r) {
			if (!e || typeof e.name != "string" || !e.name || typeof e.code != "string" || i.has(e.name)) return null;
			i.add(e.name);
		}
		return {
			names: i,
			revision: JSON.stringify(r.map((e) => ({
				name: e.name,
				code: e.code
			})).sort((e, t) => e.name.localeCompare(t.name)))
		};
	} catch {
		return null;
	}
}
function Sp(e, t) {
	let n = e ?? "", r = vp.exec(n), i = !!r && (!t || r[1] === "\n"), { content: a, attributes: o, end: s } = Gu(n.replace(yp, "$& "), { streaming: t }), c = a, l = !1, u = null, d = bp(c);
	if (d >= 0 && c.startsWith(_p, d)) {
		l = !0;
		let e = c.indexOf("\n", d), t = c.length;
		if (e >= 0) {
			let n = bp(c.slice(e + 1));
			n >= 0 && (t = e + 1 + n), u = xp(c.slice(d + 17, e), c.slice(e + 1, t));
		}
		let n = d > 0 ? c.slice(0, d).replace(/\r?\n$/, "") : "", r = c.slice(t);
		c = r ? `${n}\n${r}` : n;
	}
	let f = {};
	if (!i && !l && !s) return {
		program: c,
		metadata: f,
		scripts: /* @__PURE__ */ new Set(),
		complete: !0,
		isBundle: !1,
		error: void 0
	};
	i && o.name !== void 0 && (f.name = o.name);
	let p = l && !u ? "Invalid scripts bundle" : void 0;
	return {
		program: c,
		metadata: f,
		scripts: u?.names ?? /* @__PURE__ */ new Set(),
		complete: !p && (s || !t || !i),
		isBundle: !0,
		error: t ? void 0 : p,
		...u?.names.size ? { scriptRevision: u.revision } : {}
	};
}
var Cp = "https://www.openui.com/docs/openui-lang/reliability";
function wp(e) {
	let t = e.map((e) => `  - ${e.source}/${e.code}: ${e.message}`);
	return [
		`[openui] Rendered with ${e.length} error${e.length === 1 ? "" : "s"}:`,
		...t,
		`See ${Cp} for how to fix and prevent these errors.`
	].join("\n");
}
function Tp({ response: e, isStreaming: t, result: n, evaluatedResult: r, library: i, querySnapshot: a, parseExceptionRef: o, runtimeErrorsRef: s, renderErrorsRef: c, onError: l }) {
	let u = (0, B.useRef)([]), [d, f] = (0, B.useState)(0), p = (0, B.useRef)(""), m = (0, B.useRef)(l);
	return m.current = l, (0, B.useEffect)(() => {
		if (t) {
			u.current = [], p.current !== "" && (p.current = "", m.current?.([]));
			return;
		}
		let r = [];
		o.current && r.push(o.current), e && !n?.meta.statementCount && !o.current && r.push({
			source: "parser",
			code: "parse-failed",
			message: "Response could not be parsed as valid openui-lang",
			hint: `The entire response must be valid openui-lang code starting with root = ${i.root ?? "Root"}(...)`
		}), n?.meta.errors.length && r.push(...Lf(n.meta.errors, i.toJSONSchema(), Object.keys(i.components))), r.push(...s.current), r.push(...c.current), c.current = [], r.push(...a.__openui_errors ?? []), u.current = r;
		let l = JSON.stringify(r);
		l !== p.current && (p.current = l, f((e) => e + 1), m.current ? m.current(r) : r.length > 0 && console.error(wp(r)));
	}, [
		t,
		e,
		n,
		r,
		a,
		i,
		o,
		s,
		c
	]), {
		errorsRef: u,
		errorRevision: d
	};
}
var Ep = "react-lang:stream", Dp = "streaming", Op = "settled", kp = "unmounted", Ap = 0;
function jp() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : (Ap += 1, `openui-lang-${Date.now().toString(36)}-${Ap.toString(36)}`);
}
function Mp() {
	return {
		id: null,
		updateIndex: 0,
		lastResponse: null,
		hasPublishedStreamingSnapshot: !1,
		settled: !1,
		lastSettledErrorKey: null,
		startedAt: null,
		durationMs: null
	};
}
function Np(e, t = Date.now()) {
	e.startedAt ??= t, e.settled && (e.durationMs ??= Math.max(0, t - e.startedAt));
	let n = e.durationMs ?? Math.max(0, t - e.startedAt);
	return {
		startedAt: e.startedAt,
		elapsedMs: n,
		...e.durationMs == null ? {} : { durationMs: e.durationMs }
	};
}
function Pp(e, t, n, r = null, i = jp) {
	return t ? (e.settled && Object.assign(e, Mp()), e.id ??= i(), e.hasPublishedStreamingSnapshot && e.lastResponse === n ? null : (e.hasPublishedStreamingSnapshot = !0, e.lastResponse = n, e.updateIndex += 1, {
		id: e.id,
		phase: Dp,
		updateIndex: e.updateIndex
	})) : !e.id || e.settled && (r === null || e.lastSettledErrorKey === r) ? null : (e.updateIndex += 1, e.settled = !0, e.lastSettledErrorKey = r, {
		id: e.id,
		phase: Op,
		updateIndex: e.updateIndex
	});
}
function Fp(e) {
	return !e.id || e.settled ? null : (e.updateIndex += 1, e.hasPublishedStreamingSnapshot = !1, {
		id: e.id,
		phase: kp,
		updateIndex: e.updateIndex
	});
}
function Ip(e) {
	if (e) return {
		incomplete: e.meta.incomplete,
		unresolved: e.meta.unresolved,
		orphaned: e.meta.orphaned,
		statementCount: e.meta.statementCount
	};
}
function Lp({ response: e, isStreaming: t, result: n, errorsRef: r, errorRevision: i, publish: a = !0, __libraryId: o }) {
	let s = (0, B.useRef)(Mp()), c = (0, B.useRef)({ result: null });
	(0, B.useEffect)(() => {
		let e = s.current;
		return () => {
			let t = Fp(e);
			if (!t) return;
			let { result: n, __libraryId: r } = c.current, i = e.startedAt ?? Date.now(), a = Math.max(0, Date.now() - i);
			$f.warn({
				id: t.id,
				kind: Ep,
				phase: t.phase,
				updateIndex: t.updateIndex,
				response: e.lastResponse,
				responseLength: e.lastResponse?.length ?? 0,
				parser: Ip(n),
				startedAt: i,
				elapsedMs: a,
				durationMs: a,
				...r === void 0 ? {} : { __libraryId: r },
				message: "Stream interrupted"
			});
		};
	}, []), (0, B.useEffect)(() => {
		if (!a) return;
		let i = r.current, l = t ? null : JSON.stringify(i), u = Pp(s.current, t, e, l), d = o === void 0 ? {} : { __libraryId: o };
		t ? u && (c.current = {
			result: n,
			__libraryId: o
		}, $f.info({
			id: u.id,
			kind: Ep,
			phase: u.phase,
			updateIndex: u.updateIndex,
			response: e,
			responseLength: e?.length ?? 0,
			parser: Ip(n),
			...Np(s.current),
			...d,
			message: "OpenUI Lang is streaming"
		})) : u?.phase === "settled" && $f(i.length > 0 ? "error" : "info", {
			id: u.id,
			kind: Ep,
			phase: Op,
			updateIndex: u.updateIndex,
			response: e,
			responseLength: e?.length ?? 0,
			parser: Ip(n),
			errors: i,
			errorCount: i.length,
			...Np(s.current),
			...d,
			message: i.length > 0 ? `OpenUI Lang settled with ${i.length} error${i.length === 1 ? "" : "s"}` : "OpenUI Lang settled"
		});
	}, [
		a,
		t,
		e,
		n,
		r,
		i,
		o
	]);
}
function Rp(e) {
	return e && typeof e == "object" && !Array.isArray(e) && "value" in e ? e.value : e;
}
function zp({ response: e, library: t, isStreaming: n, onAction: r, onStateUpdate: i, initialState: a, toolProvider: o, onError: s, publishObservability: c }, l) {
	let u = (0, B.useMemo)(() => Sp(e, n), [e, n]), d = n || !u.complete || !!u.error, f = u.isBundle && d, p = (0, B.useRef)({
		revision: null,
		names: /* @__PURE__ */ new Set()
	});
	d || (p.current = {
		revision: "scriptRevision" in u ? u.scriptRevision ?? null : null,
		names: u.scripts
	});
	let m = p.current.revision, h = p.current.names, g = (0, B.useMemo)(() => t.toJSONSchema(), [t]), _ = (0, B.useMemo)(() => Ff(g, t.root), [g, t.root]), v = (0, B.useMemo)(() => Object.fromEntries(Object.entries(g.functions ?? {}).flatMap(([e, n]) => {
		let r = t.functions?.[e]?.fn;
		return r ? [[e, {
			...n,
			fn: r
		}]] : [];
	})), [g, t.functions]), y = (0, B.useRef)(null), b = (0, B.useMemo)(() => {
		if (y.current = u.error ? {
			source: "parser",
			code: "parse-failed",
			message: u.error
		} : null, !u.program) return null;
		try {
			return _.set(u.program, !n);
		} catch (e) {
			return y.current = {
				source: "parser",
				code: "parse-exception",
				message: `Parser crashed: ${e instanceof Error ? e.message : String(e)}`,
				hint: "The response may contain syntax the parser cannot handle"
			}, null;
		}
	}, [
		_,
		u.program,
		u.error,
		n
	]), x = (0, B.useMemo)(() => Jf(), []), S = (0, B.useMemo)(() => q(o ?? null), [o]);
	(0, B.useEffect)(() => (S.activate(), () => S.dispose()), [S]);
	let C = (0, B.useRef)(!1), w = (0, B.useRef)(Symbol());
	(0, B.useEffect)(() => {
		if (!b?.stateDeclarations && !a) return;
		let e = `${JSON.stringify(b?.stateDeclarations)}::${JSON.stringify(a)}`;
		if (w.current === e) return;
		w.current = e;
		let t = {};
		if (a) for (let [e, n] of Object.entries(a)) e.startsWith("$") ? t[e] = n : x.set(e, n);
		C.current = !0, x.initialize(b?.stateDeclarations ?? {}, t), C.current = !1;
	}, [
		b?.stateDeclarations,
		x,
		a
	]);
	let T = (0, B.useSyncExternalStore)(x.subscribe, x.getSnapshot, x.getSnapshot), E = (0, B.useSyncExternalStore)(S.subscribe, S.getSnapshot, S.getSnapshot), D = (0, B.useMemo)(() => ({
		getState: (e) => Rp(x.get(e)),
		resolveRef: (e) => S.getMutationResult(e) || S.getResult(e),
		functions: v,
		actions: g.actions
	}), [
		x,
		S,
		v,
		g.actions
	]), ee = (0, B.useCallback)((e) => h.has(e) ? { __openuiScriptRevision: m } : void 0, [m, h]);
	(0, B.useEffect)(() => {
		d || S.evaluateStatements(b?.queryStatements ?? [], D, { extraDeps: ee });
	}, [
		d,
		b?.queryStatements,
		S,
		D,
		ee,
		T
	]), (0, B.useEffect)(() => {
		if (d) return;
		let e = (b?.mutationStatements ?? []).map((e) => ({
			statementId: e.statementId,
			toolName: e.toolAST ? G(e.toolAST, D) : ""
		}));
		S.registerMutations(e);
	}, [
		d,
		b?.mutationStatements,
		D,
		S
	]);
	let te = (0, B.useRef)({
		onAction: r,
		onStateUpdate: i
	});
	te.current = {
		onAction: r,
		onStateUpdate: i
	};
	let ne = (0, B.useRef)(b);
	ne.current = b;
	let re = (0, B.useRef)(null);
	(0, B.useEffect)(() => (re.current = x.getSnapshot(), x.subscribe(() => {
		let e = x.getSnapshot();
		C.current || e === re.current || (re.current = null, te.current.onStateUpdate?.(e));
	})), [x]);
	let ie = (0, B.useCallback)((e, t) => {
		if (!e) return Rp(x.get(t));
		let n = x.get(e);
		if (n && typeof n == "object" && !Array.isArray(n)) return Rp(n[t]);
	}, [x]), ae = (0, B.useCallback)((e, t, n, r, i = !0) => {
		let a = {
			value: r,
			componentType: t
		};
		if (!e) x.set(n, a);
		else {
			let t = x.get(e), r = t && typeof t == "object" && !Array.isArray(t) ? t : {};
			x.set(e, {
				...r,
				[n]: a
			});
		}
		i && te.current.onStateUpdate?.(x.getSnapshot());
	}, [x]), oe = (0, B.useCallback)((e) => {
		if (e) {
			let t = x.get(e);
			if (t && typeof t == "object" && !Array.isArray(t)) return { [e]: t };
		}
		return x.getSnapshot();
	}, [x]), se = (0, B.useCallback)(async (e, t, n) => {
		if (f) return;
		let { onAction: r } = te.current;
		if (n && !("steps" in n)) {
			let i = oe(t), a = n.type || qu.ContinueConversation;
			if (g.actions && Object.prototype.hasOwnProperty.call(g.actions, a)) return;
			let o = { ...n.params || {} };
			n.url && (o.url = n.url), n.context && (o.context = n.context), r?.({
				type: a,
				params: o,
				humanFriendlyMessage: e,
				formState: i,
				formName: t
			});
			return;
		}
		let i = n;
		if (i?.steps) for (let e of i.steps) switch (e.type) {
			case Yl.Run:
				if (e.refType === "mutation") {
					let t = ne.current?.mutationStatements?.find((t) => t.statementId === e.statementId), n = t?.argsAST ? G(t.argsAST, D) : {};
					if (!await S.fireMutation(e.statementId, n)) return;
				} else S.invalidate([e.statementId]);
				break;
			case Yl.ToAssistant:
				r?.({
					type: qu.ContinueConversation,
					params: e.context === void 0 ? {} : { context: e.context },
					humanFriendlyMessage: e.message,
					formState: oe(t),
					formName: t
				});
				break;
			case Yl.OpenUrl:
				r?.({
					type: qu.OpenUrl,
					params: { url: e.url },
					humanFriendlyMessage: "",
					formState: oe(t),
					formName: t
				});
				break;
			case "custom_action":
				r?.({
					type: e.name,
					params: e.params,
					humanFriendlyMessage: "",
					formState: oe(t),
					formName: t
				});
				break;
			case Yl.Set: {
				if (!e.valueAST) {
					console.warn(`[openui] Set action for ${e.target} has no valueAST — skipping`);
					break;
				}
				let t = G(e.valueAST, D);
				x.set(e.target, t);
				break;
			}
			case Yl.Reset: {
				let t = ne.current?.stateDeclarations ?? {};
				for (let n of e.targets) x.set(n, t[n] ?? null, { pristine: !0 });
				break;
			}
		}
		else r?.({
			type: qu.ContinueConversation,
			params: {},
			humanFriendlyMessage: e,
			formState: oe(t),
			formName: t
		});
	}, [
		f,
		S,
		D,
		oe,
		x,
		g.actions
	]), ce = (0, B.useRef)([]), le = (0, B.useRef)(n);
	le.current = n;
	let ue = (0, B.useCallback)((e) => {
		le.current || ce.current.push(e);
	}, []), de = E.__openui_loading.length > 0 || n && f && (b?.queryStatements.length ?? 0) > 0, fe = (0, B.useMemo)(() => E.__openui_errors.filter((e) => e.source === "query"), [E]), pe = (0, B.useCallback)(() => {
		f || S.invalidate(fe.map((e) => e.statementId));
	}, [
		f,
		S,
		fe
	]), me = (0, B.useRef)([]), O = (0, B.useMemo)(() => {
		if (!b?.root && !b?.rootExpression) return b;
		let e = [], n = {
			ctx: D,
			library: t,
			store: x,
			errors: e
		};
		try {
			let t = zf(b, n);
			return me.current = e, {
				...b,
				root: t
			};
		} catch (t) {
			let n = t instanceof Error ? t.message : String(t);
			return e.push({
				source: "runtime",
				code: "runtime-error",
				message: `Prop evaluation failed: ${n}`
			}), me.current = e, b;
		}
	}, [
		b,
		D,
		t,
		x,
		T,
		E
	]), he = (0, B.useMemo)(() => ({
		library: t,
		renderNode: l,
		triggerAction: se,
		isStreaming: d,
		getFieldValue: ie,
		setFieldValue: ae,
		store: x,
		evaluationContext: D,
		reportError: ue,
		isQueryLoading: de
	}), [
		t,
		l,
		d,
		de,
		se,
		ie,
		ae,
		x,
		D,
		ue,
		T,
		E
	]), { errorsRef: ge, errorRevision: _e } = Tp({
		response: u.program,
		isStreaming: n,
		result: b,
		evaluatedResult: O,
		library: t,
		querySnapshot: E,
		parseExceptionRef: y,
		runtimeErrorsRef: me,
		renderErrorsRef: ce,
		onError: s
	});
	return Lp({
		response: u.program,
		isStreaming: n,
		result: b,
		errorsRef: ge,
		errorRevision: _e,
		publish: c,
		__libraryId: t.__libraryId
	}), {
		result: O,
		parseResult: b,
		contextValue: he,
		isQueryLoading: de,
		queryErrors: fe,
		retryQueries: pe
	};
}
var Bp = class extends B.Component {
	lastValidChildren = null;
	constructor(e) {
		super(e), this.state = { hasError: !1 };
	}
	static getDerivedStateFromError() {
		return { hasError: !0 };
	}
	componentDidMount() {
		this.state.hasError || (this.lastValidChildren = this.props.children);
	}
	componentDidUpdate(e) {
		this.state.hasError || (this.lastValidChildren = this.props.children), this.state.hasError && e.children !== this.props.children && this.setState({ hasError: !1 });
	}
	componentDidCatch(e) {
		let t = this.props.componentName ?? "Unknown";
		this.props.onError?.({
			source: "runtime",
			code: "render-error",
			component: t,
			message: `Component ${t} render failed: ${e.message}`
		});
	}
	render() {
		return this.state.hasError ? this.lastValidChildren : this.props.children;
	}
};
function Vp(e) {
	if (e == null) return null;
	if (typeof e == "string") return e;
	if (typeof e == "number" || typeof e == "boolean") return String(e);
	if (Array.isArray(e)) return e.map((e, t) => /* @__PURE__ */ (0, J.jsx)(B.Fragment, { children: Vp(e) }, t));
	if (typeof e == "object" && e) {
		let t = e;
		if (t.type === "element") return /* @__PURE__ */ (0, J.jsx)(Up, { node: t });
	}
	return null;
}
function Hp(e, t, n = 0) {
	if (Object.is(e, t)) return !0;
	if (!e || !t || typeof e != "object" || typeof t != "object" || n > 64) return !1;
	if (Array.isArray(e)) {
		if (!Array.isArray(t) || e.length !== t.length) return !1;
		for (let r = 0; r < e.length; r++) if (!Hp(e[r], t[r], n + 1)) return !1;
		return !0;
	}
	if (Array.isArray(t)) return !1;
	if (Ku(e) || Ku(t)) return Ku(e) && Ku(t) && e.typeName === t.typeName && e.statementId === t.statementId && Hp(e.props, t.props, n + 1);
	let r = Object.getPrototypeOf(e);
	if (r !== Object.getPrototypeOf(t) || r !== Object.prototype && r !== null) return !1;
	let i = Object.keys(e), a = Object.keys(t);
	if (i.length !== a.length) return !1;
	for (let r = 0; r < i.length; r++) {
		let o = i[r];
		if (o !== a[r] || !Hp(e[o], t[o], n + 1)) return !1;
	}
	return !0;
}
var Up = B.memo(function({ node: e }) {
	let { library: t, reportError: n } = pp(), r = t.components[e.typeName]?.component;
	return r ? /* @__PURE__ */ (0, J.jsx)(Bp, {
		componentName: e.typeName,
		onError: n,
		children: /* @__PURE__ */ (0, J.jsx)(Wp, {
			el: e,
			Comp: r
		})
	}) : null;
}, (e, t) => Hp(e.node, t.node));
function Wp({ el: e, Comp: t }) {
	let n = mp();
	return /* @__PURE__ */ (0, J.jsx)(t, {
		props: e.props,
		renderNode: n,
		statementId: e.statementId
	});
}
function Gp({ response: e, library: t, isStreaming: n = !1, onAction: r, onStateUpdate: i, initialState: a, onParseResult: o, toolProvider: s, queryLoader: c, children: l, onError: u, publishObservability: d }) {
	let f = (0, B.useRef)(o);
	f.current = o;
	let p = (0, B.useRef)(s);
	p.current = s;
	let m = (0, B.useRef)({ async callTool(e, t) {
		let n = p.current ?? null;
		if (n == null) throw Error("[openui] toolProvider is null");
		if (typeof n.callTool == "function") return Hf(await n.callTool({
			name: e,
			arguments: t
		}));
		let r = n, i = r[e];
		if (!i) throw new Uf(e, Object.keys(r));
		return i(t);
	} }), { result: h, parseResult: g, contextValue: _, isQueryLoading: v, queryErrors: y, retryQueries: b } = zp({
		response: e,
		library: t,
		isStreaming: n,
		onAction: r,
		onStateUpdate: i,
		initialState: a,
		toolProvider: s == null ? null : m.current,
		onError: u,
		publishObservability: d
	}, Vp);
	(0, B.useEffect)(() => {
		f.current?.(g);
	}, [g]);
	let x = (0, B.useMemo)(() => ({
		isLoading: v,
		errors: y,
		retry: b,
		isRetrying: y.length > 0 && v
	}), [
		v,
		y,
		b
	]), S = {
		root: h?.root ?? null,
		query: x,
		queryLoader: c
	};
	return /* @__PURE__ */ (0, J.jsx)(fp.Provider, {
		value: _,
		children: /* @__PURE__ */ (0, J.jsx)(Kp.Provider, {
			value: S,
			children: l
		})
	});
}
var Kp = (0, B.createContext)(null);
function qp() {
	let e = (0, B.useContext)(Kp);
	if (!e) throw Error("Renderer slots must be used within Renderer.Root or Renderer.");
	return e;
}
function Jp() {
	return qp().query;
}
function Yp({ hidden: e, ...t }) {
	let { root: n, query: r } = qp();
	return n ? /* @__PURE__ */ (0, J.jsx)(lp, {
		...t,
		"aria-busy": r.isLoading,
		hidden: e || r.errors.length > 0,
		dimmed: r.isLoading,
		children: /* @__PURE__ */ (0, J.jsx)(Up, { node: n })
	}) : null;
}
function Xp({ children: e }) {
	let { query: { isLoading: t, errors: n }, queryLoader: r } = qp();
	return !t || n.length > 0 ? null : /* @__PURE__ */ (0, J.jsx)(J.Fragment, { children: e === void 0 ? r ?? /* @__PURE__ */ (0, J.jsx)(cp, {}) : e });
}
function Zp({ children: e }) {
	let { errors: t } = Jp();
	return t.length === 0 ? null : /* @__PURE__ */ (0, J.jsx)(J.Fragment, { children: e });
}
function Qp({ disabled: e, ...t }) {
	let { retry: n, isLoading: r, errors: i } = Jp();
	return /* @__PURE__ */ (0, J.jsx)(up, {
		...t,
		disabled: e || r || i.length === 0,
		onActivate: n
	});
}
function $p() {
	let { root: e, query: t, queryLoader: n } = qp();
	return e ? /* @__PURE__ */ (0, J.jsxs)(lp, {
		"aria-busy": t.isLoading,
		style: { position: "relative" },
		children: [t.isLoading && (n ?? /* @__PURE__ */ (0, J.jsx)(cp, {})), /* @__PURE__ */ (0, J.jsx)(lp, {
			dimmed: t.isLoading,
			children: /* @__PURE__ */ (0, J.jsx)(Up, { node: e })
		})]
	}) : null;
}
function em({ children: e, ...t }) {
	return /* @__PURE__ */ (0, J.jsx)(Gp, {
		...t,
		children: e === void 0 ? /* @__PURE__ */ (0, J.jsx)($p, {}) : e
	});
}
var tm = Object.assign(em, {
	Root: Gp,
	Content: Yp,
	QueryLoading: Xp,
	QueryError: Zp,
	Retry: Qp
});
function nm(e) {
	return tl(e), e;
}
function rm(e, t) {
	let n = pp(), r = gp();
	return qf(e, t, n.store ?? null, n.evaluationContext ?? null, (e) => n.getFieldValue(r, e), (e, t) => n.setFieldValue(r, void 0, e, t));
}
(0, B.createContext)(null);
var im = (0, B.createContext)(null);
function am() {
	let e = (0, B.useContext)(im);
	if (!e) throw Error("Preview slots must be used within WithPreviewRenderer.Root or WithPreviewRenderer.");
	return e;
}
function om() {
	return am().state;
}
function sm({ open: e, defaultOpen: t = !1, onOpenChange: n, onMetadata: r, children: i, ...a }) {
	let [o, s] = (0, B.useState)(t), c = e ?? o, l = a.isStreaming === !0, u = (0, B.useId)(), d = (0, B.useMemo)(() => Sp(a.response, l), [a.response, l]).metadata.name, f = (0, B.useMemo)(() => d === void 0 ? {} : { name: d }, [d]), p = (0, B.useRef)(r);
	p.current = r, (0, B.useEffect)(() => {
		p.current?.(f);
	}, [f]);
	let m = (0, B.useCallback)((t) => {
		t !== c && (e === void 0 && s(t), n?.(t));
	}, [
		e,
		c,
		n
	]), h = (0, B.useCallback)(() => m(!0), [m]), g = (0, B.useCallback)(() => m(!1), [m]), _ = (0, B.useMemo)(() => ({
		metadata: f,
		isOpen: c,
		isStreaming: l,
		contentId: u,
		open: h,
		close: g
	}), [
		f,
		c,
		l,
		u,
		h,
		g
	]);
	return /* @__PURE__ */ (0, J.jsx)(im.Provider, {
		value: {
			state: _,
			rendererProps: a
		},
		children: i
	});
}
function cm({ children: e, ...t }) {
	let { metadata: n, isOpen: r, isStreaming: i, contentId: a, open: o, close: s } = om();
	return /* @__PURE__ */ (0, J.jsx)(up, {
		...t,
		"aria-expanded": r,
		controls: r ? a : void 0,
		onActivate: r ? s : o,
		children: e === void 0 ? `${n.name || "Untitled artifact"}${i ? " (generating…)" : ""}` : e
	});
}
function lm({ children: e, ...t }) {
	let { metadata: n, close: r } = om();
	return /* @__PURE__ */ (0, J.jsx)(up, {
		...t,
		onActivate: r,
		children: e === void 0 ? `Close ${n.name || "Untitled artifact"}` : e
	});
}
function um({ children: e, ...t }) {
	let { state: n, rendererProps: r } = am();
	return n.isOpen ? /* @__PURE__ */ (0, J.jsx)(dp, {
		"aria-label": n.metadata.name || "Untitled artifact",
		...t,
		id: n.contentId,
		children: e === void 0 ? /* @__PURE__ */ (0, J.jsxs)(J.Fragment, { children: [/* @__PURE__ */ (0, J.jsx)(lm, {}), /* @__PURE__ */ (0, J.jsx)(tm, { ...r })] }) : /* @__PURE__ */ (0, J.jsx)(tm, {
			...r,
			children: e
		})
	}) : null;
}
function dm({ children: e, ...t }) {
	return /* @__PURE__ */ (0, J.jsx)(sm, {
		...t,
		children: e === void 0 ? /* @__PURE__ */ (0, J.jsxs)(J.Fragment, { children: [/* @__PURE__ */ (0, J.jsx)(cm, {}), /* @__PURE__ */ (0, J.jsx)(um, {})] }) : e
	});
}
Object.assign(dm, {
	Root: sm,
	Trigger: cm,
	Content: um,
	Close: lm
});
var fm = rp({
	root: "DataTable",
	components: [np({
		name: "DataTable",
		description: "Displays a titled table with text columns and rows.",
		props: z({
			title: Os(),
			columns: fc(Os()),
			rows: fc(fc(Os()))
		}),
		component: ({ props: e }) => /* @__PURE__ */ (0, J.jsx)("div", {
			className: "table-scroll",
			children: /* @__PURE__ */ (0, J.jsxs)("table", { children: [
				/* @__PURE__ */ (0, J.jsx)("caption", { children: e.title }),
				/* @__PURE__ */ (0, J.jsx)("thead", { children: /* @__PURE__ */ (0, J.jsx)("tr", { children: e.columns.map((e, t) => /* @__PURE__ */ (0, J.jsx)("th", {
					scope: "col",
					children: e
				}, t)) }) }),
				/* @__PURE__ */ (0, J.jsx)("tbody", { children: e.rows.map((e, t) => /* @__PURE__ */ (0, J.jsx)("tr", { children: e.map((e, t) => /* @__PURE__ */ (0, J.jsx)("td", { children: e }, t)) }, t)) })
			] })
		})
	})]
}), pm = np({
	name: "ChecklistItem",
	description: "A checkbox with a stable name and visible label.",
	props: z({
		name: Os(),
		label: Os(),
		value: nm(ic())
	}),
	component: function({ props: e }) {
		let { value: t, setValue: n } = rm(e.name, e.value);
		return /* @__PURE__ */ (0, J.jsxs)("label", {
			className: "checklist-item",
			children: [/* @__PURE__ */ (0, J.jsx)("input", {
				type: "checkbox",
				checked: t === !0,
				onChange: (e) => n(e.currentTarget.checked)
			}), /* @__PURE__ */ (0, J.jsx)("span", { children: e.label })]
		});
	}
}), mm = rp({
	root: "Checklist",
	components: [np({
		name: "Checklist",
		description: "A titled group of checklist items.",
		props: z({
			title: Os(),
			items: fc(pm.ref)
		}),
		component: ({ props: e, renderNode: t }) => /* @__PURE__ */ (0, J.jsxs)("fieldset", {
			className: "checklist",
			children: [/* @__PURE__ */ (0, J.jsx)("legend", { children: e.title }), t(e.items)]
		})
	}), pm]
});
// src/checklist-runtime.ts
function hm(e, t) {
	let n = [];
	for (let { id: r, key: i } of e) {
		let e = Object.hasOwn(t, `$${i}`) ? `$${i}` : i;
		if (!Object.hasOwn(t, e) || typeof t[e] != "boolean") return null;
		n.push([r, t[e]]);
	}
	return { checked: Object.fromEntries(n) };
}
// src/checklist-state.ts
var gm = z({ checked: cc().optional() }).strict(), _m = fc(xc([Os().min(1), ic()]));
function vm(e, t) {
	let n = gm.parse(e === void 0 ? {} : e), r = Object.hasOwn(n, "checked") ? n.checked : {};
	if (typeof r != "object" || !r || Array.isArray(r)) throw Error("Invalid saved checklist selections");
	let i = _m.parse(Object.entries(r)), a = new Set(t);
	if (i.some(([e]) => !a.has(e))) throw Error("Saved checklist state contains unknown item IDs");
	return Object.fromEntries(i);
}
// src/saved-spec.ts
var ym = Os().trim().min(1), bm = z({
	type: Dc("checklist"),
	title: ym,
	checklist_items: fc(z({
		id: ym,
		label: ym
	}).strict()).min(1).max(50)
}).strict().superRefine((e, t) => {
	let n = e.checklist_items.map((e) => e.id);
	new Set(n).size !== n.length && t.addIssue({
		code: "custom",
		path: ["checklist_items"],
		message: "Checklist item IDs must be unique"
	});
}), xm = z({
	type: Dc("table"),
	title: ym,
	columns: fc(ym).min(1).max(12),
	rows: fc(fc(Os().trim())).min(1).max(100)
}).strict().superRefine((e, t) => {
	e.rows.forEach((n, r) => {
		n.length !== e.columns.length && t.addIssue({
			code: "custom",
			path: ["rows", r],
			message: `Row ${r + 1} must contain ${e.columns.length} cells`
		});
	});
}), Sm = z({
	type: Dc("chart"),
	chart_type: Tc(["bar", "line"]),
	title: ym,
	labels: fc(ym).min(1).max(100),
	series: fc(z({
		name: ym,
		values: fc(ec().finite()).min(1).max(100)
	}).strict()).min(1).max(6)
}).strict().superRefine((e, t) => {
	e.series.forEach((n, r) => {
		n.values.length !== e.labels.length && t.addIssue({
			code: "custom",
			path: [
				"series",
				r,
				"values"
			],
			message: "Each series must have one value per label"
		});
	});
}), Cm = z({
	type: Dc("comparison"),
	title: ym,
	criteria: fc(ym).min(1).max(12),
	options: fc(z({
		name: ym,
		values: fc(Os().trim()).min(1).max(12)
	}).strict()).min(2).max(4)
}).strict().superRefine((e, t) => {
	e.options.forEach((n, r) => {
		n.values.length !== e.criteria.length && t.addIssue({
			code: "custom",
			path: [
				"options",
				r,
				"values"
			],
			message: "Each option must have one value per criterion."
		});
	});
}), wm = z({
	type: Dc("flowchart"),
	title: ym,
	direction: Tc(["TD", "LR"]).default("TD"),
	nodes: fc(z({
		id: ym,
		label: ym
	}).strict()).min(1).max(30),
	edges: fc(z({
		source: ym,
		target: ym,
		label: Os().trim().default("")
	}).strict()).max(60)
}).strict().superRefine((e, t) => {
	let n = new Set(e.nodes.map((e) => e.id));
	n.size !== e.nodes.length && t.addIssue({
		code: "custom",
		path: ["nodes"],
		message: "Flowchart node IDs must be unique."
	}), e.edges.forEach((e, r) => {
		for (let i of ["source", "target"]) n.has(e[i]) || t.addIssue({
			code: "custom",
			path: [
				"edges",
				r,
				i
			],
			message: `Unknown ${i} node ID: ${e[i]}`
		});
	});
}), Tm = z({
	type: Dc("status"),
	title: ym,
	status_items: fc(z({
		label: ym,
		state: Tc([
			"pending",
			"in_progress",
			"success",
			"warning",
			"error"
		]),
		detail: Os().trim().default("")
	}).strict()).min(1).max(20)
}).strict();
function Em(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return e;
	let t = e;
	if (t.type !== "checklist" || !Object.hasOwn(t, "items") || Object.hasOwn(t, "checklist_items")) return e;
	let { items: n, ...r } = t;
	return {
		...r,
		checklist_items: n
	};
}
var Dm = z({
	id: ec().int().positive(),
	schema_version: Dc(1),
	state: cc().optional(),
	spec: Qc(Em, _c("type", [
		bm,
		xm,
		Sm,
		Cm,
		wm,
		Tm
	]))
});
function Om(e) {
	return "checked_" + e.split("").map((e) => e.charCodeAt(0).toString(16)).join("_");
}
function km(e) {
	let t = Dm.parse(e), { spec: n } = t;
	if (n.type === "status") return {
		kind: "status",
		response: `root = DataStatus(${JSON.stringify(n.title)}, ${JSON.stringify(n.status_items)})`
	};
	if (n.type === "flowchart") return {
		kind: "flowchart",
		response: `root = DataFlowchart(${JSON.stringify(n.title)}, ${JSON.stringify(n.direction)}, ${JSON.stringify(n.nodes)}, ${JSON.stringify(n.edges)})`
	};
	if (n.type === "comparison") return {
		kind: "comparison",
		response: `root = DataComparison(${JSON.stringify(n.title)}, ${JSON.stringify(n.criteria)}, ${JSON.stringify(n.options)})`
	};
	if (n.type === "chart") return {
		kind: "chart",
		response: `root = DataChart(${JSON.stringify(n.title)}, ${JSON.stringify(n.chart_type)}, ${JSON.stringify(n.labels)}, ${JSON.stringify(n.series)})`
	};
	if (n.type === "table") return {
		kind: "table",
		response: `root = DataTable(${JSON.stringify(n.title)}, ${JSON.stringify(n.columns)}, ${JSON.stringify(n.rows)})`
	};
	let r = vm(t.state, n.checklist_items.map((e) => e.id)), i = n.checklist_items.map((e) => ({
		id: e.id,
		key: Om(e.id)
	})), a = Object.fromEntries(i.map(({ id: e, key: t }) => [`$${t}`, Object.hasOwn(r, e) ? r[e] : !1])), o = n.checklist_items.map((e, t) => `item${t}`), s = [`root = Checklist(${JSON.stringify(n.title)}, [${o.join(", ")}])`];
	return n.checklist_items.forEach((e, t) => {
		let n = Om(e.id);
		s.push(`$${n} = ${a[`$${n}`] === !0}`), s.push(`item${t} = ChecklistItem(${JSON.stringify(n)}, ${JSON.stringify(e.label)}, $${n})`);
	}), {
		kind: "checklist",
		response: s.join("\n"),
		initialState: a,
		checklistKeys: i
	};
}
// node_modules/@kurkle/color/dist/color.esm.js
function Am(e) {
	return e + .5 | 0;
}
var jm = (e, t, n) => Math.max(Math.min(e, n), t);
function Mm(e) {
	return jm(Am(e * 2.55), 0, 255);
}
function Nm(e) {
	return jm(Am(e * 255), 0, 255);
}
function Pm(e) {
	return jm(Am(e / 2.55) / 100, 0, 1);
}
function Fm(e) {
	return jm(Am(e * 100), 0, 100);
}
var Im = {
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	A: 10,
	B: 11,
	C: 12,
	D: 13,
	E: 14,
	F: 15,
	a: 10,
	b: 11,
	c: 12,
	d: 13,
	e: 14,
	f: 15
}, Lm = [..."0123456789ABCDEF"], Rm = (e) => Lm[e & 15], zm = (e) => Lm[(e & 240) >> 4] + Lm[e & 15], Bm = (e) => (e & 240) >> 4 == (e & 15), Vm = (e) => Bm(e.r) && Bm(e.g) && Bm(e.b) && Bm(e.a);
function Hm(e) {
	var t = e.length, n;
	return e[0] === "#" && (t === 4 || t === 5 ? n = {
		r: 255 & Im[e[1]] * 17,
		g: 255 & Im[e[2]] * 17,
		b: 255 & Im[e[3]] * 17,
		a: t === 5 ? Im[e[4]] * 17 : 255
	} : (t === 7 || t === 9) && (n = {
		r: Im[e[1]] << 4 | Im[e[2]],
		g: Im[e[3]] << 4 | Im[e[4]],
		b: Im[e[5]] << 4 | Im[e[6]],
		a: t === 9 ? Im[e[7]] << 4 | Im[e[8]] : 255
	})), n;
}
var Um = (e, t) => e < 255 ? t(e) : "";
function Wm(e) {
	var t = Vm(e) ? Rm : zm;
	return e ? "#" + t(e.r) + t(e.g) + t(e.b) + Um(e.a, t) : void 0;
}
var Gm = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function Km(e, t, n) {
	let r = t * Math.min(n, 1 - n), i = (t, i = (t + e / 30) % 12) => n - r * Math.max(Math.min(i - 3, 9 - i, 1), -1);
	return [
		i(0),
		i(8),
		i(4)
	];
}
function qm(e, t, n) {
	let r = (r, i = (r + e / 60) % 6) => n - n * t * Math.max(Math.min(i, 4 - i, 1), 0);
	return [
		r(5),
		r(3),
		r(1)
	];
}
function Jm(e, t, n) {
	let r = Km(e, 1, .5), i;
	for (t + n > 1 && (i = 1 / (t + n), t *= i, n *= i), i = 0; i < 3; i++) r[i] *= 1 - t - n, r[i] += t;
	return r;
}
function Ym(e, t, n, r, i) {
	return e === i ? (t - n) / r + (t < n ? 6 : 0) : t === i ? (n - e) / r + 2 : (e - t) / r + 4;
}
function Xm(e) {
	let t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.max(t, n, r), a = Math.min(t, n, r), o = (i + a) / 2, s, c, l;
	return i !== a && (l = i - a, c = o > .5 ? l / (2 - i - a) : l / (i + a), s = Ym(t, n, r, l, i), s = s * 60 + .5), [
		s | 0,
		c || 0,
		o
	];
}
function Zm(e, t, n, r) {
	return (Array.isArray(t) ? e(t[0], t[1], t[2]) : e(t, n, r)).map(Nm);
}
function Qm(e, t, n) {
	return Zm(Km, e, t, n);
}
function $m(e, t, n) {
	return Zm(Jm, e, t, n);
}
function eh(e, t, n) {
	return Zm(qm, e, t, n);
}
function th(e) {
	return (e % 360 + 360) % 360;
}
function nh(e) {
	let t = Gm.exec(e), n = 255, r;
	if (!t) return;
	t[5] !== r && (n = t[6] ? Mm(+t[5]) : Nm(+t[5]));
	let i = th(+t[2]), a = t[3] / 100, o = t[4] / 100;
	return r = t[1] === "hwb" ? $m(i, a, o) : t[1] === "hsv" ? eh(i, a, o) : Qm(i, a, o), {
		r: r[0],
		g: r[1],
		b: r[2],
		a: n
	};
}
function rh(e, t) {
	var n = Xm(e);
	n[0] = th(n[0] + t), n = Qm(n), e.r = n[0], e.g = n[1], e.b = n[2];
}
function ih(e) {
	if (!e) return;
	let t = Xm(e), n = t[0], r = Fm(t[1]), i = Fm(t[2]);
	return e.a < 255 ? `hsla(${n}, ${r}%, ${i}%, ${Pm(e.a)})` : `hsl(${n}, ${r}%, ${i}%)`;
}
var ah = {
	x: "dark",
	Z: "light",
	Y: "re",
	X: "blu",
	W: "gr",
	V: "medium",
	U: "slate",
	A: "ee",
	T: "ol",
	S: "or",
	B: "ra",
	C: "lateg",
	D: "ights",
	R: "in",
	Q: "turquois",
	E: "hi",
	P: "ro",
	O: "al",
	N: "le",
	M: "de",
	L: "yello",
	F: "en",
	K: "ch",
	G: "arks",
	H: "ea",
	I: "ightg",
	J: "wh"
}, oh = {
	OiceXe: "f0f8ff",
	antiquewEte: "faebd7",
	aqua: "ffff",
	aquamarRe: "7fffd4",
	azuY: "f0ffff",
	beige: "f5f5dc",
	bisque: "ffe4c4",
	black: "0",
	blanKedOmond: "ffebcd",
	Xe: "ff",
	XeviTet: "8a2be2",
	bPwn: "a52a2a",
	burlywood: "deb887",
	caMtXe: "5f9ea0",
	KartYuse: "7fff00",
	KocTate: "d2691e",
	cSO: "ff7f50",
	cSnflowerXe: "6495ed",
	cSnsilk: "fff8dc",
	crimson: "dc143c",
	cyan: "ffff",
	xXe: "8b",
	xcyan: "8b8b",
	xgTMnPd: "b8860b",
	xWay: "a9a9a9",
	xgYF: "6400",
	xgYy: "a9a9a9",
	xkhaki: "bdb76b",
	xmagFta: "8b008b",
	xTivegYF: "556b2f",
	xSange: "ff8c00",
	xScEd: "9932cc",
	xYd: "8b0000",
	xsOmon: "e9967a",
	xsHgYF: "8fbc8f",
	xUXe: "483d8b",
	xUWay: "2f4f4f",
	xUgYy: "2f4f4f",
	xQe: "ced1",
	xviTet: "9400d3",
	dAppRk: "ff1493",
	dApskyXe: "bfff",
	dimWay: "696969",
	dimgYy: "696969",
	dodgerXe: "1e90ff",
	fiYbrick: "b22222",
	flSOwEte: "fffaf0",
	foYstWAn: "228b22",
	fuKsia: "ff00ff",
	gaRsbSo: "dcdcdc",
	ghostwEte: "f8f8ff",
	gTd: "ffd700",
	gTMnPd: "daa520",
	Way: "808080",
	gYF: "8000",
	gYFLw: "adff2f",
	gYy: "808080",
	honeyMw: "f0fff0",
	hotpRk: "ff69b4",
	RdianYd: "cd5c5c",
	Rdigo: "4b0082",
	ivSy: "fffff0",
	khaki: "f0e68c",
	lavFMr: "e6e6fa",
	lavFMrXsh: "fff0f5",
	lawngYF: "7cfc00",
	NmoncEffon: "fffacd",
	ZXe: "add8e6",
	ZcSO: "f08080",
	Zcyan: "e0ffff",
	ZgTMnPdLw: "fafad2",
	ZWay: "d3d3d3",
	ZgYF: "90ee90",
	ZgYy: "d3d3d3",
	ZpRk: "ffb6c1",
	ZsOmon: "ffa07a",
	ZsHgYF: "20b2aa",
	ZskyXe: "87cefa",
	ZUWay: "778899",
	ZUgYy: "778899",
	ZstAlXe: "b0c4de",
	ZLw: "ffffe0",
	lime: "ff00",
	limegYF: "32cd32",
	lRF: "faf0e6",
	magFta: "ff00ff",
	maPon: "800000",
	VaquamarRe: "66cdaa",
	VXe: "cd",
	VScEd: "ba55d3",
	VpurpN: "9370db",
	VsHgYF: "3cb371",
	VUXe: "7b68ee",
	VsprRggYF: "fa9a",
	VQe: "48d1cc",
	VviTetYd: "c71585",
	midnightXe: "191970",
	mRtcYam: "f5fffa",
	mistyPse: "ffe4e1",
	moccasR: "ffe4b5",
	navajowEte: "ffdead",
	navy: "80",
	Tdlace: "fdf5e6",
	Tive: "808000",
	TivedBb: "6b8e23",
	Sange: "ffa500",
	SangeYd: "ff4500",
	ScEd: "da70d6",
	pOegTMnPd: "eee8aa",
	pOegYF: "98fb98",
	pOeQe: "afeeee",
	pOeviTetYd: "db7093",
	papayawEp: "ffefd5",
	pHKpuff: "ffdab9",
	peru: "cd853f",
	pRk: "ffc0cb",
	plum: "dda0dd",
	powMrXe: "b0e0e6",
	purpN: "800080",
	YbeccapurpN: "663399",
	Yd: "ff0000",
	Psybrown: "bc8f8f",
	PyOXe: "4169e1",
	saddNbPwn: "8b4513",
	sOmon: "fa8072",
	sandybPwn: "f4a460",
	sHgYF: "2e8b57",
	sHshell: "fff5ee",
	siFna: "a0522d",
	silver: "c0c0c0",
	skyXe: "87ceeb",
	UXe: "6a5acd",
	UWay: "708090",
	UgYy: "708090",
	snow: "fffafa",
	sprRggYF: "ff7f",
	stAlXe: "4682b4",
	tan: "d2b48c",
	teO: "8080",
	tEstN: "d8bfd8",
	tomato: "ff6347",
	Qe: "40e0d0",
	viTet: "ee82ee",
	JHt: "f5deb3",
	wEte: "ffffff",
	wEtesmoke: "f5f5f5",
	Lw: "ffff00",
	LwgYF: "9acd32"
};
function sh() {
	let e = {}, t = Object.keys(oh), n = Object.keys(ah), r, i, a, o, s;
	for (r = 0; r < t.length; r++) {
		for (o = s = t[r], i = 0; i < n.length; i++) a = n[i], s = s.replace(a, ah[a]);
		a = parseInt(oh[o], 16), e[s] = [
			a >> 16 & 255,
			a >> 8 & 255,
			a & 255
		];
	}
	return e;
}
var ch;
function lh(e) {
	ch || (ch = sh(), ch.transparent = [
		0,
		0,
		0,
		0
	]);
	let t = ch[e.toLowerCase()];
	return t && {
		r: t[0],
		g: t[1],
		b: t[2],
		a: t.length === 4 ? t[3] : 255
	};
}
var uh = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function dh(e) {
	let t = uh.exec(e), n = 255, r, i, a;
	if (t) {
		if (t[7] !== r) {
			let e = +t[7];
			n = t[8] ? Mm(e) : jm(e * 255, 0, 255);
		}
		return r = +t[1], i = +t[3], a = +t[5], r = 255 & (t[2] ? Mm(r) : jm(r, 0, 255)), i = 255 & (t[4] ? Mm(i) : jm(i, 0, 255)), a = 255 & (t[6] ? Mm(a) : jm(a, 0, 255)), {
			r,
			g: i,
			b: a,
			a: n
		};
	}
}
function fh(e) {
	return e && (e.a < 255 ? `rgba(${e.r}, ${e.g}, ${e.b}, ${Pm(e.a)})` : `rgb(${e.r}, ${e.g}, ${e.b})`);
}
var ph = (e) => e <= .0031308 ? e * 12.92 : e ** (1 / 2.4) * 1.055 - .055, mh = (e) => e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
function hh(e, t, n) {
	let r = mh(Pm(e.r)), i = mh(Pm(e.g)), a = mh(Pm(e.b));
	return {
		r: Nm(ph(r + n * (mh(Pm(t.r)) - r))),
		g: Nm(ph(i + n * (mh(Pm(t.g)) - i))),
		b: Nm(ph(a + n * (mh(Pm(t.b)) - a))),
		a: e.a + n * (t.a - e.a)
	};
}
function gh(e, t, n) {
	if (e) {
		let r = Xm(e);
		r[t] = Math.max(0, Math.min(r[t] + r[t] * n, t === 0 ? 360 : 1)), r = Qm(r), e.r = r[0], e.g = r[1], e.b = r[2];
	}
}
function _h(e, t) {
	return e && Object.assign(t || {}, e);
}
function vh(e) {
	var t = {
		r: 0,
		g: 0,
		b: 0,
		a: 255
	};
	return Array.isArray(e) ? e.length >= 3 && (t = {
		r: e[0],
		g: e[1],
		b: e[2],
		a: 255
	}, e.length > 3 && (t.a = Nm(e[3]))) : (t = _h(e, {
		r: 0,
		g: 0,
		b: 0,
		a: 1
	}), t.a = Nm(t.a)), t;
}
function yh(e) {
	return e.charAt(0) === "r" ? dh(e) : nh(e);
}
var bh = class e {
	constructor(t) {
		if (t instanceof e) return t;
		let n = typeof t, r;
		n === "object" ? r = vh(t) : n === "string" && (r = Hm(t) || lh(t) || yh(t)), this._rgb = r, this._valid = !!r;
	}
	get valid() {
		return this._valid;
	}
	get rgb() {
		var e = _h(this._rgb);
		return e && (e.a = Pm(e.a)), e;
	}
	set rgb(e) {
		this._rgb = vh(e);
	}
	rgbString() {
		return this._valid ? fh(this._rgb) : void 0;
	}
	hexString() {
		return this._valid ? Wm(this._rgb) : void 0;
	}
	hslString() {
		return this._valid ? ih(this._rgb) : void 0;
	}
	mix(e, t) {
		if (e) {
			let n = this.rgb, r = e.rgb, i, a = t === i ? .5 : t, o = 2 * a - 1, s = n.a - r.a, c = ((o * s === -1 ? o : (o + s) / (1 + o * s)) + 1) / 2;
			i = 1 - c, n.r = 255 & c * n.r + i * r.r + .5, n.g = 255 & c * n.g + i * r.g + .5, n.b = 255 & c * n.b + i * r.b + .5, n.a = a * n.a + (1 - a) * r.a, this.rgb = n;
		}
		return this;
	}
	interpolate(e, t) {
		return e && (this._rgb = hh(this._rgb, e._rgb, t)), this;
	}
	clone() {
		return new e(this.rgb);
	}
	alpha(e) {
		return this._rgb.a = Nm(e), this;
	}
	clearer(e) {
		let t = this._rgb;
		return t.a *= 1 - e, this;
	}
	greyscale() {
		let e = this._rgb;
		return e.r = e.g = e.b = Am(e.r * .3 + e.g * .59 + e.b * .11), this;
	}
	opaquer(e) {
		let t = this._rgb;
		return t.a *= 1 + e, this;
	}
	negate() {
		let e = this._rgb;
		return e.r = 255 - e.r, e.g = 255 - e.g, e.b = 255 - e.b, this;
	}
	lighten(e) {
		return gh(this._rgb, 2, e), this;
	}
	darken(e) {
		return gh(this._rgb, 2, -e), this;
	}
	saturate(e) {
		return gh(this._rgb, 1, e), this;
	}
	desaturate(e) {
		return gh(this._rgb, 1, -e), this;
	}
	rotate(e) {
		return rh(this._rgb, e), this;
	}
};
// node_modules/chart.js/dist/chunks/index.js
function xh() {}
var Sh = (() => {
	let e = 0;
	return () => e++;
})();
function Y(e) {
	return e == null;
}
function Ch(e) {
	if (Array.isArray && Array.isArray(e)) return !0;
	let t = Object.prototype.toString.call(e);
	return t.slice(0, 7) === "[object" && t.slice(-6) === "Array]";
}
function X(e) {
	return e !== null && Object.prototype.toString.call(e) === "[object Object]";
}
function wh(e) {
	return (typeof e == "number" || e instanceof Number) && isFinite(+e);
}
function Th(e, t) {
	return wh(e) ? e : t;
}
function Z(e, t) {
	return e === void 0 ? t : e;
}
var Eh = (e, t) => typeof e == "string" && e.endsWith("%") ? parseFloat(e) / 100 * t : +e;
function Q(e, t, n) {
	if (e && typeof e.call == "function") return e.apply(n, t);
}
function $(e, t, n, r) {
	let i, a, o;
	if (Ch(e)) {
		if (a = e.length, r) for (i = a - 1; i >= 0; i--) t.call(n, e[i], i);
		else for (i = 0; i < a; i++) t.call(n, e[i], i);
	} else if (X(e)) for (o = Object.keys(e), a = o.length, i = 0; i < a; i++) t.call(n, e[o[i]], o[i]);
}
function Dh(e, t) {
	let n, r, i, a;
	if (!e || !t || e.length !== t.length) return !1;
	for (n = 0, r = e.length; n < r; ++n) if (i = e[n], a = t[n], i.datasetIndex !== a.datasetIndex || i.index !== a.index) return !1;
	return !0;
}
function Oh(e) {
	if (Ch(e)) return e.map(Oh);
	if (X(e)) {
		let t = Object.create(null), n = Object.keys(e), r = n.length, i = 0;
		for (; i < r; ++i) t[n[i]] = Oh(e[n[i]]);
		return t;
	}
	return e;
}
function kh(e) {
	return [
		"__proto__",
		"prototype",
		"constructor"
	].indexOf(e) === -1;
}
function Ah(e, t, n, r) {
	if (!kh(e)) return;
	let i = t[e], a = n[e];
	X(i) && X(a) ? jh(i, a, r) : t[e] = Oh(a);
}
function jh(e, t, n) {
	let r = Ch(t) ? t : [t], i = r.length;
	if (!X(e)) return e;
	n ||= {};
	let a = n.merger || Ah, o;
	for (let t = 0; t < i; ++t) {
		if (o = r[t], !X(o)) continue;
		let i = Object.keys(o);
		for (let t = 0, r = i.length; t < r; ++t) a(i[t], e, o, n);
	}
	return e;
}
function Mh(e, t) {
	return jh(e, t, { merger: Nh });
}
function Nh(e, t, n) {
	if (!kh(e)) return;
	let r = t[e], i = n[e];
	X(r) && X(i) ? Mh(r, i) : Object.prototype.hasOwnProperty.call(t, e) || (t[e] = Oh(i));
}
var Ph = {
	"": (e) => e,
	x: (e) => e.x,
	y: (e) => e.y
};
function Fh(e) {
	let t = e.split("."), n = [], r = "";
	for (let e of t) r += e, r.endsWith("\\") ? r = r.slice(0, -1) + "." : (n.push(r), r = "");
	return n;
}
function Ih(e) {
	let t = Fh(e);
	return (e) => {
		for (let n of t) {
			if (n === "") break;
			e &&= e[n];
		}
		return e;
	};
}
function Lh(e, t) {
	return (Ph[t] || (Ph[t] = Ih(t)))(e);
}
function Rh(e) {
	return e.charAt(0).toUpperCase() + e.slice(1);
}
var zh = (e) => e !== void 0, Bh = (e) => typeof e == "function", Vh = (e, t) => {
	if (e.size !== t.size) return !1;
	for (let n of e) if (!t.has(n)) return !1;
	return !0;
};
function Hh(e) {
	return e.type === "mouseup" || e.type === "click" || e.type === "contextmenu";
}
var Uh = Math.PI, Wh = 2 * Uh, Gh = Wh + Uh, Kh = Infinity, qh = Uh / 180, Jh = Uh / 2, Yh = Uh / 4, Xh = Uh * 2 / 3, Zh = Math.log10, Qh = Math.sign;
function $h(e, t, n) {
	return Math.abs(e - t) < n;
}
function eg(e) {
	let t = Math.round(e);
	e = $h(e, t, e / 1e3) ? t : e;
	let n = 10 ** Math.floor(Zh(e)), r = e / n;
	return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * n;
}
function tg(e) {
	let t = [], n = Math.sqrt(e), r = 1;
	for (; r < n; r++) e % r === 0 && (t.push(r), t.push(e / r));
	return n === (n | 0) && t.push(n), t.sort((e, t) => e - t).pop(), t;
}
function ng(e) {
	return typeof e == "symbol" || typeof e == "object" && !!e && !(Symbol.toPrimitive in e || "toString" in e || "valueOf" in e);
}
function rg(e) {
	return !ng(e) && !isNaN(parseFloat(e)) && isFinite(e);
}
function ig(e, t) {
	let n = Math.round(e);
	return n - t <= e && n + t >= e;
}
function ag(e, t, n) {
	let r, i, a;
	for (r = 0, i = e.length; r < i; r++) a = e[r][n], isNaN(a) || (t.min = Math.min(t.min, a), t.max = Math.max(t.max, a));
}
function og(e) {
	return Uh / 180 * e;
}
function sg(e) {
	return 180 / Uh * e;
}
function cg(e) {
	if (!wh(e)) return;
	let t = 1, n = 0;
	for (; Math.round(e * t) / t !== e;) t *= 10, n++;
	return n;
}
function lg(e, t) {
	let n = t.x - e.x, r = t.y - e.y, i = Math.sqrt(n * n + r * r), a = Math.atan2(r, n);
	return a < -.5 * Uh && (a += Wh), {
		angle: a,
		distance: i
	};
}
function ug(e, t) {
	return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function dg(e, t) {
	return (e - t + Gh) % Wh - Uh;
}
function fg(e) {
	return (e % Wh + Wh) % Wh;
}
function pg(e, t, n, r) {
	let i = fg(e), a = fg(t), o = fg(n), s = fg(a - i), c = fg(o - i), l = fg(i - a), u = fg(i - o);
	return i === a || i === o || r && a === o || s > c && l < u;
}
function mg(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function hg(e) {
	return mg(e, -32768, 32767);
}
function gg(e, t, n, r = 1e-6) {
	return e >= Math.min(t, n) - r && e <= Math.max(t, n) + r;
}
function _g(e, t, n) {
	n ||= ((n) => e[n] < t);
	let r = e.length - 1, i = 0, a;
	for (; r - i > 1;) a = i + r >> 1, n(a) ? i = a : r = a;
	return {
		lo: i,
		hi: r
	};
}
var vg = (e, t, n, r) => _g(e, n, r ? (r) => {
	let i = e[r][t];
	return i < n || i === n && e[r + 1][t] === n;
} : (r) => e[r][t] < n), yg = (e, t, n) => _g(e, n, (r) => e[r][t] >= n);
function bg(e, t, n) {
	let r = 0, i = e.length;
	for (; r < i && e[r] < t;) r++;
	for (; i > r && e[i - 1] > n;) i--;
	return r > 0 || i < e.length ? e.slice(r, i) : e;
}
var xg = [
	"push",
	"pop",
	"shift",
	"splice",
	"unshift"
];
function Sg(e, t) {
	e._chartjs ? e._chartjs.listeners.push(t) : (Object.defineProperty(e, "_chartjs", {
		configurable: !0,
		enumerable: !1,
		value: { listeners: [t] }
	}), xg.forEach((t) => {
		let n = "_onData" + Rh(t), r = e[t];
		Object.defineProperty(e, t, {
			configurable: !0,
			enumerable: !1,
			value(...t) {
				let i = r.apply(this, t);
				return e._chartjs.listeners.forEach((e) => {
					typeof e[n] == "function" && e[n](...t);
				}), i;
			}
		});
	}));
}
function Cg(e, t) {
	let n = e._chartjs;
	if (!n) return;
	let r = n.listeners, i = r.indexOf(t);
	i !== -1 && r.splice(i, 1), r.length > 0 || (xg.forEach((t) => {
		delete e[t];
	}), delete e._chartjs);
}
function wg(e) {
	let t = new Set(e);
	return t.size === e.length ? e : Array.from(t);
}
var Tg = function() {
	return typeof window > "u" ? function(e) {
		return e();
	} : window.requestAnimationFrame;
}();
function Eg(e, t) {
	let n = [], r = !1;
	return function(...i) {
		n = i, r || (r = !0, Tg.call(window, () => {
			r = !1, e.apply(t, n);
		}));
	};
}
function Dg(e, t) {
	let n;
	return function(...r) {
		return t ? (clearTimeout(n), n = setTimeout(e, t, r)) : e.apply(this, r), t;
	};
}
var Og = (e) => e === "start" ? "left" : e === "end" ? "right" : "center", kg = (e, t, n) => e === "start" ? t : e === "end" ? n : (t + n) / 2, Ag = (e, t, n, r) => e === (r ? "left" : "right") ? n : e === "center" ? (t + n) / 2 : t;
function jg(e, t, n) {
	let r = t.length, i = 0, a = r;
	if (e._sorted) {
		let { iScale: o, vScale: s, _parsed: c } = e, l = e.dataset && e.dataset.options ? e.dataset.options.spanGaps : null, u = o.axis, { min: d, max: f, minDefined: p, maxDefined: m } = o.getUserBounds();
		if (p) {
			if (i = Math.min(vg(c, u, d).lo, n ? r : vg(t, u, o.getPixelForValue(d)).lo), l) {
				let e = c.slice(0, i + 1).reverse().findIndex((e) => !Y(e[s.axis]));
				i -= Math.max(0, e);
			}
			i = mg(i, 0, r - 1);
		}
		if (m) {
			let e = Math.max(vg(c, o.axis, f, !0).hi + 1, n ? 0 : vg(t, u, o.getPixelForValue(f), !0).hi + 1);
			if (l) {
				let t = c.slice(e - 1).findIndex((e) => !Y(e[s.axis]));
				e += Math.max(0, t);
			}
			a = mg(e, i, r) - i;
		} else a = r - i;
	}
	return {
		start: i,
		count: a
	};
}
function Mg(e) {
	let { xScale: t, yScale: n, _scaleRanges: r } = e, i = {
		xmin: t.min,
		xmax: t.max,
		ymin: n.min,
		ymax: n.max
	};
	if (!r) return e._scaleRanges = i, !0;
	let a = r.xmin !== t.min || r.xmax !== t.max || r.ymin !== n.min || r.ymax !== n.max;
	return Object.assign(r, i), a;
}
var Ng = (e) => e === 0 || e === 1, Pg = (e, t, n) => -(2 ** (10 * --e) * Math.sin((e - t) * Wh / n)), Fg = (e, t, n) => 2 ** (-10 * e) * Math.sin((e - t) * Wh / n) + 1, Ig = {
	linear: (e) => e,
	easeInQuad: (e) => e * e,
	easeOutQuad: (e) => -e * (e - 2),
	easeInOutQuad: (e) => (e /= .5) < 1 ? .5 * e * e : -.5 * (--e * (e - 2) - 1),
	easeInCubic: (e) => e * e * e,
	easeOutCubic: (e) => --e * e * e + 1,
	easeInOutCubic: (e) => (e /= .5) < 1 ? .5 * e * e * e : .5 * ((e -= 2) * e * e + 2),
	easeInQuart: (e) => e * e * e * e,
	easeOutQuart: (e) => -(--e * e * e * e - 1),
	easeInOutQuart: (e) => (e /= .5) < 1 ? .5 * e * e * e * e : -.5 * ((e -= 2) * e * e * e - 2),
	easeInQuint: (e) => e * e * e * e * e,
	easeOutQuint: (e) => --e * e * e * e * e + 1,
	easeInOutQuint: (e) => (e /= .5) < 1 ? .5 * e * e * e * e * e : .5 * ((e -= 2) * e * e * e * e + 2),
	easeInSine: (e) => -Math.cos(e * Jh) + 1,
	easeOutSine: (e) => Math.sin(e * Jh),
	easeInOutSine: (e) => -.5 * (Math.cos(Uh * e) - 1),
	easeInExpo: (e) => e === 0 ? 0 : 2 ** (10 * (e - 1)),
	easeOutExpo: (e) => e === 1 ? 1 : -(2 ** (-10 * e)) + 1,
	easeInOutExpo: (e) => Ng(e) ? e : e < .5 ? .5 * 2 ** (10 * (e * 2 - 1)) : .5 * (-(2 ** (-10 * (e * 2 - 1))) + 2),
	easeInCirc: (e) => e >= 1 ? e : -(Math.sqrt(1 - e * e) - 1),
	easeOutCirc: (e) => Math.sqrt(1 - --e * e),
	easeInOutCirc: (e) => (e /= .5) < 1 ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1),
	easeInElastic: (e) => Ng(e) ? e : Pg(e, .075, .3),
	easeOutElastic: (e) => Ng(e) ? e : Fg(e, .075, .3),
	easeInOutElastic(e) {
		let t = .1125, n = .45;
		return Ng(e) ? e : e < .5 ? .5 * Pg(e * 2, t, n) : .5 + .5 * Fg(e * 2 - 1, t, n);
	},
	easeInBack(e) {
		return e * e * (2.70158 * e - 1.70158);
	},
	easeOutBack(e) {
		return --e * e * (2.70158 * e + 1.70158) + 1;
	},
	easeInOutBack(e) {
		let t = 1.70158;
		return (e /= .5) < 1 ? .5 * (e * e * (((t *= 1.525) + 1) * e - t)) : .5 * ((e -= 2) * e * (((t *= 1.525) + 1) * e + t) + 2);
	},
	easeInBounce: (e) => 1 - Ig.easeOutBounce(1 - e),
	easeOutBounce(e) {
		let t = 7.5625, n = 2.75;
		return e < 1 / n ? t * e * e : e < 2 / n ? t * (e -= 1.5 / n) * e + .75 : e < 2.5 / n ? t * (e -= 2.25 / n) * e + .9375 : t * (e -= 2.625 / n) * e + .984375;
	},
	easeInOutBounce: (e) => e < .5 ? Ig.easeInBounce(e * 2) * .5 : Ig.easeOutBounce(e * 2 - 1) * .5 + .5
};
function Lg(e) {
	if (e && typeof e == "object") {
		let t = e.toString();
		return t === "[object CanvasPattern]" || t === "[object CanvasGradient]";
	}
	return !1;
}
function Rg(e) {
	return Lg(e) ? e : new bh(e);
}
function zg(e) {
	return Lg(e) ? e : new bh(e).saturate(.5).darken(.1).hexString();
}
var Bg = [
	"x",
	"y",
	"borderWidth",
	"radius",
	"tension"
], Vg = [
	"color",
	"borderColor",
	"backgroundColor"
];
function Hg(e) {
	e.set("animation", {
		delay: void 0,
		duration: 1e3,
		easing: "easeOutQuart",
		fn: void 0,
		from: void 0,
		loop: void 0,
		to: void 0,
		type: void 0
	}), e.describe("animation", {
		_fallback: !1,
		_indexable: !1,
		_scriptable: (e) => e !== "onProgress" && e !== "onComplete" && e !== "fn"
	}), e.set("animations", {
		colors: {
			type: "color",
			properties: Vg
		},
		numbers: {
			type: "number",
			properties: Bg
		}
	}), e.describe("animations", { _fallback: "animation" }), e.set("transitions", {
		active: { animation: { duration: 400 } },
		resize: { animation: { duration: 0 } },
		show: { animations: {
			colors: { from: "transparent" },
			visible: {
				type: "boolean",
				duration: 0
			}
		} },
		hide: { animations: {
			colors: { to: "transparent" },
			visible: {
				type: "boolean",
				easing: "linear",
				fn: (e) => e | 0
			}
		} }
	});
}
function Ug(e) {
	e.set("layout", {
		autoPadding: !0,
		padding: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}
	});
}
var Wg = /* @__PURE__ */ new Map();
function Gg(e, t) {
	t ||= {};
	let n = e + JSON.stringify(t), r = Wg.get(n);
	return r || (r = new Intl.NumberFormat(e, t), Wg.set(n, r)), r;
}
function Kg(e, t, n) {
	return Gg(t, n).format(e);
}
var qg = {
	values(e) {
		return Ch(e) ? e : "" + e;
	},
	numeric(e, t, n) {
		if (e === 0) return "0";
		let r = this.chart.options.locale, i, a = e;
		if (n.length > 1) {
			let t = Math.max(Math.abs(n[0].value), Math.abs(n[n.length - 1].value));
			(t < 1e-4 || t > 0x38d7ea4c68000) && (i = "scientific"), a = Jg(e, n);
		}
		let o = Zh(Math.abs(a)), s = isNaN(o) ? 1 : Math.max(Math.min(-1 * Math.floor(o), 20), 0), c = {
			notation: i,
			minimumFractionDigits: s,
			maximumFractionDigits: s
		};
		return Object.assign(c, this.options.ticks.format), Kg(e, r, c);
	},
	logarithmic(e, t, n) {
		if (e === 0) return "0";
		let r = n[t].significand || e / 10 ** Math.floor(Zh(e));
		return [
			1,
			2,
			3,
			5,
			10,
			15
		].includes(r) || t > .8 * n.length ? qg.numeric.call(this, e, t, n) : "";
	}
};
function Jg(e, t) {
	let n = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
	return Math.abs(n) >= 1 && e !== Math.floor(e) && (n = e - Math.floor(e)), n;
}
var Yg = { formatters: qg };
function Xg(e) {
	e.set("scale", {
		display: !0,
		offset: !1,
		reverse: !1,
		beginAtZero: !1,
		bounds: "ticks",
		clip: !0,
		grace: 0,
		grid: {
			display: !0,
			lineWidth: 1,
			drawOnChartArea: !0,
			drawTicks: !0,
			tickLength: 8,
			tickWidth: (e, t) => t.lineWidth,
			tickColor: (e, t) => t.color,
			offset: !1
		},
		border: {
			display: !0,
			dash: [],
			dashOffset: 0,
			width: 1
		},
		title: {
			display: !1,
			text: "",
			padding: {
				top: 4,
				bottom: 4
			}
		},
		ticks: {
			minRotation: 0,
			maxRotation: 50,
			mirror: !1,
			textStrokeWidth: 0,
			textStrokeColor: "",
			padding: 3,
			display: !0,
			autoSkip: !0,
			autoSkipPadding: 3,
			labelOffset: 0,
			callback: Yg.formatters.values,
			minor: {},
			major: {},
			align: "center",
			crossAlign: "near",
			showLabelBackdrop: !1,
			backdropColor: "rgba(255, 255, 255, 0.75)",
			backdropPadding: 2
		}
	}), e.route("scale.ticks", "color", "", "color"), e.route("scale.grid", "color", "", "borderColor"), e.route("scale.border", "color", "", "borderColor"), e.route("scale.title", "color", "", "color"), e.describe("scale", {
		_fallback: !1,
		_scriptable: (e) => !e.startsWith("before") && !e.startsWith("after") && e !== "callback" && e !== "parser",
		_indexable: (e) => e !== "borderDash" && e !== "tickBorderDash" && e !== "dash"
	}), e.describe("scales", { _fallback: "scale" }), e.describe("scale.ticks", {
		_scriptable: (e) => e !== "backdropPadding" && e !== "callback",
		_indexable: (e) => e !== "backdropPadding"
	});
}
var Zg = Object.create(null), Qg = Object.create(null);
function $g(e, t) {
	if (!t) return e;
	let n = t.split(".");
	for (let t = 0, r = n.length; t < r; ++t) {
		let r = n[t];
		e = e[r] || (e[r] = Object.create(null));
	}
	return e;
}
function e_(e, t, n) {
	return typeof t == "string" ? jh($g(e, t), n) : jh($g(e, ""), t);
}
var t_ = /* #__PURE__ */ new class {
	constructor(e, t) {
		this.animation = void 0, this.backgroundColor = "rgba(0,0,0,0.1)", this.borderColor = "rgba(0,0,0,0.1)", this.color = "#666", this.datasets = {}, this.devicePixelRatio = (e) => e.chart.platform.getDevicePixelRatio(), this.elements = {}, this.events = [
			"mousemove",
			"mouseout",
			"click",
			"touchstart",
			"touchmove"
		], this.font = {
			family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
			size: 12,
			style: "normal",
			lineHeight: 1.2,
			weight: null
		}, this.hover = {}, this.hoverBackgroundColor = (e, t) => zg(t.backgroundColor), this.hoverBorderColor = (e, t) => zg(t.borderColor), this.hoverColor = (e, t) => zg(t.color), this.indexAxis = "x", this.interaction = {
			mode: "nearest",
			intersect: !0,
			includeInvisible: !1
		}, this.maintainAspectRatio = !0, this.onHover = null, this.onClick = null, this.parsing = !0, this.plugins = {}, this.responsive = !0, this.scale = void 0, this.scales = {}, this.showLine = !0, this.drawActiveElementsOnTop = !0, this.describe(e), this.apply(t);
	}
	set(e, t) {
		return e_(this, e, t);
	}
	get(e) {
		return $g(this, e);
	}
	describe(e, t) {
		return e_(Qg, e, t);
	}
	override(e, t) {
		return e_(Zg, e, t);
	}
	route(e, t, n, r) {
		let i = $g(this, e), a = $g(this, n), o = "_" + t;
		Object.defineProperties(i, {
			[o]: {
				value: i[t],
				writable: !0
			},
			[t]: {
				enumerable: !0,
				get() {
					let e = this[o], t = a[r];
					return X(e) ? Object.assign({}, t, e) : Z(e, t);
				},
				set(e) {
					this[o] = e;
				}
			}
		});
	}
	apply(e) {
		e.forEach((e) => e(this));
	}
}({
	_scriptable: (e) => !e.startsWith("on"),
	_indexable: (e) => e !== "events",
	hover: { _fallback: "interaction" },
	interaction: {
		_scriptable: !1,
		_indexable: !1
	}
}, [
	Hg,
	Ug,
	Xg
]);
function n_(e) {
	return !e || Y(e.size) || Y(e.family) ? null : (e.style ? e.style + " " : "") + (e.weight ? e.weight + " " : "") + e.size + "px " + e.family;
}
function r_(e, t, n, r, i) {
	let a = t[i];
	return a || (a = t[i] = e.measureText(i).width, n.push(i)), a > r && (r = a), r;
}
function i_(e, t, n, r) {
	r ||= {};
	let i = r.data = r.data || {}, a = r.garbageCollect = r.garbageCollect || [];
	r.font !== t && (i = r.data = {}, a = r.garbageCollect = [], r.font = t), e.save(), e.font = t;
	let o = 0, s = n.length, c, l, u, d, f;
	for (c = 0; c < s; c++) if (d = n[c], d != null && !Ch(d)) o = r_(e, i, a, o, d);
	else if (Ch(d)) for (l = 0, u = d.length; l < u; l++) f = d[l], f != null && !Ch(f) && (o = r_(e, i, a, o, f));
	e.restore();
	let p = a.length / 2;
	if (p > n.length) {
		for (c = 0; c < p; c++) delete i[a[c]];
		a.splice(0, p);
	}
	return o;
}
function a_(e, t, n) {
	let r = e.currentDevicePixelRatio, i = n === 0 ? 0 : Math.max(n / 2, .5);
	return Math.round((t - i) * r) / r + i;
}
function o_(e, t) {
	(t || e) && (t ||= e.getContext("2d"), t.save(), t.resetTransform(), t.clearRect(0, 0, e.width, e.height), t.restore());
}
function s_(e, t, n, r) {
	c_(e, t, n, r, null);
}
function c_(e, t, n, r, i) {
	let a, o, s, c, l, u, d, f, p = t.pointStyle, m = t.rotation, h = t.radius, g = (m || 0) * qh;
	if (p && typeof p == "object" && (a = p.toString(), a === "[object HTMLImageElement]" || a === "[object HTMLCanvasElement]")) e.save(), e.translate(n, r), e.rotate(g), e.drawImage(p, -p.width / 2, -p.height / 2, p.width, p.height), e.restore();
	else if (!(isNaN(h) || h <= 0)) {
		switch (e.beginPath(), p) {
			default:
				i ? e.ellipse(n, r, i / 2, h, 0, 0, Wh) : e.arc(n, r, h, 0, Wh), e.closePath();
				break;
			case "triangle":
				u = i ? i / 2 : h, e.moveTo(n + Math.sin(g) * u, r - Math.cos(g) * h), g += Xh, e.lineTo(n + Math.sin(g) * u, r - Math.cos(g) * h), g += Xh, e.lineTo(n + Math.sin(g) * u, r - Math.cos(g) * h), e.closePath();
				break;
			case "rectRounded":
				l = h * .516, c = h - l, o = Math.cos(g + Yh) * c, d = Math.cos(g + Yh) * (i ? i / 2 - l : c), s = Math.sin(g + Yh) * c, f = Math.sin(g + Yh) * (i ? i / 2 - l : c), e.arc(n - d, r - s, l, g - Uh, g - Jh), e.arc(n + f, r - o, l, g - Jh, g), e.arc(n + d, r + s, l, g, g + Jh), e.arc(n - f, r + o, l, g + Jh, g + Uh), e.closePath();
				break;
			case "rect":
				if (!m) {
					c = Math.SQRT1_2 * h, u = i ? i / 2 : c, e.rect(n - u, r - c, 2 * u, 2 * c);
					break;
				}
				g += Yh;
			case "rectRot":
				d = Math.cos(g) * (i ? i / 2 : h), o = Math.cos(g) * h, s = Math.sin(g) * h, f = Math.sin(g) * (i ? i / 2 : h), e.moveTo(n - d, r - s), e.lineTo(n + f, r - o), e.lineTo(n + d, r + s), e.lineTo(n - f, r + o), e.closePath();
				break;
			case "crossRot": g += Yh;
			case "cross":
				d = Math.cos(g) * (i ? i / 2 : h), o = Math.cos(g) * h, s = Math.sin(g) * h, f = Math.sin(g) * (i ? i / 2 : h), e.moveTo(n - d, r - s), e.lineTo(n + d, r + s), e.moveTo(n + f, r - o), e.lineTo(n - f, r + o);
				break;
			case "star":
				d = Math.cos(g) * (i ? i / 2 : h), o = Math.cos(g) * h, s = Math.sin(g) * h, f = Math.sin(g) * (i ? i / 2 : h), e.moveTo(n - d, r - s), e.lineTo(n + d, r + s), e.moveTo(n + f, r - o), e.lineTo(n - f, r + o), g += Yh, d = Math.cos(g) * (i ? i / 2 : h), o = Math.cos(g) * h, s = Math.sin(g) * h, f = Math.sin(g) * (i ? i / 2 : h), e.moveTo(n - d, r - s), e.lineTo(n + d, r + s), e.moveTo(n + f, r - o), e.lineTo(n - f, r + o);
				break;
			case "line":
				o = i ? i / 2 : Math.cos(g) * h, s = Math.sin(g) * h, e.moveTo(n - o, r - s), e.lineTo(n + o, r + s);
				break;
			case "dash":
				e.moveTo(n, r), e.lineTo(n + Math.cos(g) * (i ? i / 2 : h), r + Math.sin(g) * h);
				break;
			case !1: e.closePath();
		}
		e.fill(), t.borderWidth > 0 && e.stroke();
	}
}
function l_(e, t, n) {
	return n ||= .5, !t || e && e.x > t.left - n && e.x < t.right + n && e.y > t.top - n && e.y < t.bottom + n;
}
function u_(e, t) {
	e.save(), e.beginPath(), e.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), e.clip();
}
function d_(e) {
	e.restore();
}
function f_(e, t, n, r, i) {
	if (!t) return e.lineTo(n.x, n.y);
	if (i === "middle") {
		let r = (t.x + n.x) / 2;
		e.lineTo(r, t.y), e.lineTo(r, n.y);
	} else i === "after" == !!r ? e.lineTo(n.x, t.y) : e.lineTo(t.x, n.y);
	e.lineTo(n.x, n.y);
}
function p_(e, t, n, r) {
	if (!t) return e.lineTo(n.x, n.y);
	e.bezierCurveTo(r ? t.cp1x : t.cp2x, r ? t.cp1y : t.cp2y, r ? n.cp2x : n.cp1x, r ? n.cp2y : n.cp1y, n.x, n.y);
}
function m_(e, t) {
	t.translation && e.translate(t.translation[0], t.translation[1]), Y(t.rotation) || e.rotate(t.rotation), t.color && (e.fillStyle = t.color), t.textAlign && (e.textAlign = t.textAlign), t.textBaseline && (e.textBaseline = t.textBaseline);
}
function h_(e, t, n, r, i) {
	if (i.strikethrough || i.underline) {
		let a = e.measureText(r), o = t - a.actualBoundingBoxLeft, s = t + a.actualBoundingBoxRight, c = n - a.actualBoundingBoxAscent, l = n + a.actualBoundingBoxDescent, u = i.strikethrough ? (c + l) / 2 : l;
		e.strokeStyle = e.fillStyle, e.beginPath(), e.lineWidth = i.decorationWidth || 2, e.moveTo(o, u), e.lineTo(s, u), e.stroke();
	}
}
function g_(e, t) {
	let n = e.fillStyle;
	e.fillStyle = t.color, e.fillRect(t.left, t.top, t.width, t.height), e.fillStyle = n;
}
function __(e, t, n, r, i, a = {}) {
	let o = Ch(t) ? t : [t], s = a.strokeWidth > 0 && a.strokeColor !== "", c, l;
	for (e.save(), e.font = i.string, m_(e, a), c = 0; c < o.length; ++c) l = o[c], a.backdrop && g_(e, a.backdrop), s && (a.strokeColor && (e.strokeStyle = a.strokeColor), Y(a.strokeWidth) || (e.lineWidth = a.strokeWidth), e.strokeText(l, n, r, a.maxWidth)), e.fillText(l, n, r, a.maxWidth), h_(e, n, r, l, a), r += Number(i.lineHeight);
	e.restore();
}
function v_(e, t) {
	let { x: n, y: r, w: i, h: a, radius: o } = t;
	e.arc(n + o.topLeft, r + o.topLeft, o.topLeft, 1.5 * Uh, Uh, !0), e.lineTo(n, r + a - o.bottomLeft), e.arc(n + o.bottomLeft, r + a - o.bottomLeft, o.bottomLeft, Uh, Jh, !0), e.lineTo(n + i - o.bottomRight, r + a), e.arc(n + i - o.bottomRight, r + a - o.bottomRight, o.bottomRight, Jh, 0, !0), e.lineTo(n + i, r + o.topRight), e.arc(n + i - o.topRight, r + o.topRight, o.topRight, 0, -Jh, !0), e.lineTo(n + o.topLeft, r);
}
var y_ = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/, b_ = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function x_(e, t) {
	let n = ("" + e).match(y_);
	if (!n || n[1] === "normal") return t * 1.2;
	switch (e = +n[2], n[3]) {
		case "px": return e;
		case "%": e /= 100;
	}
	return t * e;
}
var S_ = (e) => +e || 0;
function C_(e, t) {
	let n = {}, r = X(t), i = r ? Object.keys(t) : t, a = X(e) ? r ? (n) => Z(e[n], e[t[n]]) : (t) => e[t] : () => e;
	for (let e of i) n[e] = S_(a(e));
	return n;
}
function w_(e) {
	return C_(e, {
		top: "y",
		right: "x",
		bottom: "y",
		left: "x"
	});
}
function T_(e) {
	return C_(e, [
		"topLeft",
		"topRight",
		"bottomLeft",
		"bottomRight"
	]);
}
function E_(e) {
	let t = w_(e);
	return t.width = t.left + t.right, t.height = t.top + t.bottom, t;
}
function D_(e, t) {
	e ||= {}, t ||= t_.font;
	let n = Z(e.size, t.size);
	typeof n == "string" && (n = parseInt(n, 10));
	let r = Z(e.style, t.style);
	r && !("" + r).match(b_) && (console.warn("Invalid font style specified: \"" + r + "\""), r = void 0);
	let i = {
		family: Z(e.family, t.family),
		lineHeight: x_(Z(e.lineHeight, t.lineHeight), n),
		size: n,
		style: r,
		weight: Z(e.weight, t.weight),
		string: ""
	};
	return i.string = n_(i), i;
}
function O_(e, t, n, r) {
	let i = !0, a, o, s;
	for (a = 0, o = e.length; a < o; ++a) if (s = e[a], s !== void 0 && (t !== void 0 && typeof s == "function" && (s = s(t), i = !1), n !== void 0 && Ch(s) && (s = s[n % s.length], i = !1), s !== void 0)) return r && !i && (r.cacheable = !1), s;
}
function k_(e, t, n) {
	let { min: r, max: i } = e, a = Eh(t, (i - r) / 2), o = (e, t) => n && e === 0 ? 0 : e + t;
	return {
		min: o(r, -Math.abs(a)),
		max: o(i, a)
	};
}
function A_(e, t) {
	return Object.assign(Object.create(e), t);
}
function j_(e, t = [""], n, r, i = () => e[0]) {
	let a = n || e;
	return r === void 0 && (r = q_("_fallback", e)), new Proxy({
		[Symbol.toStringTag]: "Object",
		_cacheable: !0,
		_scopes: e,
		_rootScopes: a,
		_fallback: r,
		_getTarget: i,
		override: (n) => j_([n, ...e], t, a, r)
	}, {
		deleteProperty(t, n) {
			return delete t[n], delete t._keys, delete e[0][n], !0;
		},
		get(n, r) {
			return I_(n, r, () => K_(r, t, e, n));
		},
		getOwnPropertyDescriptor(e, t) {
			return Reflect.getOwnPropertyDescriptor(e._scopes[0], t);
		},
		getPrototypeOf() {
			return Reflect.getPrototypeOf(e[0]);
		},
		has(e, t) {
			return J_(e).includes(t);
		},
		ownKeys(e) {
			return J_(e);
		},
		set(e, t, n) {
			let r = e._storage ||= i();
			return e[t] = r[t] = n, delete e._keys, !0;
		}
	});
}
function M_(e, t, n, r) {
	let i = {
		_cacheable: !1,
		_proxy: e,
		_context: t,
		_subProxy: n,
		_stack: /* @__PURE__ */ new Set(),
		_descriptors: N_(e, r),
		setContext: (t) => M_(e, t, n, r),
		override: (i) => M_(e.override(i), t, n, r)
	};
	return new Proxy(i, {
		deleteProperty(t, n) {
			return delete t[n], delete e[n], !0;
		},
		get(e, t, n) {
			return I_(e, t, () => L_(e, t, n));
		},
		getOwnPropertyDescriptor(t, n) {
			return t._descriptors.allKeys ? Reflect.has(e, n) ? {
				enumerable: !0,
				configurable: !0
			} : void 0 : Reflect.getOwnPropertyDescriptor(e, n);
		},
		getPrototypeOf() {
			return Reflect.getPrototypeOf(e);
		},
		has(t, n) {
			return Reflect.has(e, n);
		},
		ownKeys() {
			return Reflect.ownKeys(e);
		},
		set(t, n, r) {
			return e[n] = r, delete t[n], !0;
		}
	});
}
function N_(e, t = {
	scriptable: !0,
	indexable: !0
}) {
	let { _scriptable: n = t.scriptable, _indexable: r = t.indexable, _allKeys: i = t.allKeys } = e;
	return {
		allKeys: i,
		scriptable: n,
		indexable: r,
		isScriptable: Bh(n) ? n : () => n,
		isIndexable: Bh(r) ? r : () => r
	};
}
var P_ = (e, t) => e ? e + Rh(t) : t, F_ = (e, t) => X(t) && e !== "adapters" && (Object.getPrototypeOf(t) === null || t.constructor === Object);
function I_(e, t, n) {
	if (Object.prototype.hasOwnProperty.call(e, t) || t === "constructor") return e[t];
	let r = n();
	return e[t] = r, r;
}
function L_(e, t, n) {
	let { _proxy: r, _context: i, _subProxy: a, _descriptors: o } = e, s = r[t];
	return Bh(s) && o.isScriptable(t) && (s = R_(t, s, e, n)), Ch(s) && s.length && (s = z_(t, s, e, o.isIndexable)), F_(t, s) && (s = M_(s, i, a && a[t], o)), s;
}
function R_(e, t, n, r) {
	let { _proxy: i, _context: a, _subProxy: o, _stack: s } = n;
	if (s.has(e)) throw Error("Recursion detected: " + Array.from(s).join("->") + "->" + e);
	s.add(e);
	let c = t(a, o || r);
	return s.delete(e), F_(e, c) && (c = U_(i._scopes, i, e, c)), c;
}
function z_(e, t, n, r) {
	let { _proxy: i, _context: a, _subProxy: o, _descriptors: s } = n;
	if (a.index !== void 0 && r(e)) return t[a.index % t.length];
	if (X(t[0])) {
		let n = t, r = i._scopes.filter((e) => e !== n);
		t = [];
		for (let c of n) {
			let n = U_(r, i, e, c);
			t.push(M_(n, a, o && o[e], s));
		}
	}
	return t;
}
function B_(e, t, n) {
	return Bh(e) ? e(t, n) : e;
}
var V_ = (e, t) => e === !0 ? t : typeof e == "string" ? Lh(t, e) : void 0;
function H_(e, t, n, r, i) {
	for (let a of t) {
		let t = V_(n, a);
		if (t) {
			e.add(t);
			let a = B_(t._fallback, n, i);
			if (a !== void 0 && a !== n && a !== r) return a;
		} else if (t === !1 && r !== void 0 && n !== r) return null;
	}
	return !1;
}
function U_(e, t, n, r) {
	let i = t._rootScopes, a = B_(t._fallback, n, r), o = [...e, ...i], s = /* @__PURE__ */ new Set();
	s.add(r);
	let c = W_(s, o, n, a || n, r);
	return c === null || a !== void 0 && a !== n && (c = W_(s, o, a, c, r), c === null) ? !1 : j_(Array.from(s), [""], i, a, () => G_(t, n, r));
}
function W_(e, t, n, r, i) {
	for (; n;) n = H_(e, t, n, r, i);
	return n;
}
function G_(e, t, n) {
	let r = e._getTarget();
	t in r || (r[t] = {});
	let i = r[t];
	return Ch(i) && X(n) ? n : i || {};
}
function K_(e, t, n, r) {
	let i;
	for (let a of t) if (i = q_(P_(a, e), n), i !== void 0) return F_(e, i) ? U_(n, r, e, i) : i;
}
function q_(e, t) {
	for (let n of t) {
		if (!n) continue;
		let t = n[e];
		if (t !== void 0) return t;
	}
}
function J_(e) {
	let t = e._keys;
	return t ||= e._keys = Y_(e._scopes), t;
}
function Y_(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of Object.keys(n).filter((e) => !e.startsWith("_"))) t.add(e);
	return Array.from(t);
}
var X_ = 2 ** -52 || 1e-14, Z_ = (e, t) => t < e.length && !e[t].skip && e[t], Q_ = (e) => e === "x" ? "y" : "x";
function $_(e, t, n, r) {
	let i = e.skip ? t : e, a = t, o = n.skip ? t : n, s = ug(a, i), c = ug(o, a), l = s / (s + c), u = c / (s + c);
	l = isNaN(l) ? 0 : l, u = isNaN(u) ? 0 : u;
	let d = r * l, f = r * u;
	return {
		previous: {
			x: a.x - d * (o.x - i.x),
			y: a.y - d * (o.y - i.y)
		},
		next: {
			x: a.x + f * (o.x - i.x),
			y: a.y + f * (o.y - i.y)
		}
	};
}
function ev(e, t, n) {
	let r = e.length, i, a, o, s, c, l = Z_(e, 0);
	for (let u = 0; u < r - 1; ++u) c = l, l = Z_(e, u + 1), c && l && ($h(t[u], 0, X_) ? n[u] = n[u + 1] = 0 : (i = n[u] / t[u], a = n[u + 1] / t[u], s = i ** 2 + a ** 2, s <= 9 || (o = 3 / Math.sqrt(s), n[u] = i * o * t[u], n[u + 1] = a * o * t[u])));
}
function tv(e, t, n = "x") {
	let r = Q_(n), i = e.length, a, o, s, c = Z_(e, 0);
	for (let l = 0; l < i; ++l) {
		if (o = s, s = c, c = Z_(e, l + 1), !s) continue;
		let i = s[n], u = s[r];
		o && (a = (i - o[n]) / 3, s[`cp1${n}`] = i - a, s[`cp1${r}`] = u - a * t[l]), c && (a = (c[n] - i) / 3, s[`cp2${n}`] = i + a, s[`cp2${r}`] = u + a * t[l]);
	}
}
function nv(e, t = "x") {
	let n = Q_(t), r = e.length, i = Array(r).fill(0), a = Array(r), o, s, c, l = Z_(e, 0);
	for (o = 0; o < r; ++o) if (s = c, c = l, l = Z_(e, o + 1), c) {
		if (l) {
			let e = l[t] - c[t];
			i[o] = e === 0 ? 0 : (l[n] - c[n]) / e;
		}
		a[o] = s ? l ? Qh(i[o - 1]) === Qh(i[o]) ? (i[o - 1] + i[o]) / 2 : 0 : i[o - 1] : i[o];
	}
	ev(e, i, a), tv(e, a, t);
}
function rv(e, t, n) {
	return Math.max(Math.min(e, n), t);
}
function iv(e, t) {
	let n, r, i, a, o, s = l_(e[0], t);
	for (n = 0, r = e.length; n < r; ++n) o = a, a = s, s = n < r - 1 && l_(e[n + 1], t), a && (i = e[n], o && (i.cp1x = rv(i.cp1x, t.left, t.right), i.cp1y = rv(i.cp1y, t.top, t.bottom)), s && (i.cp2x = rv(i.cp2x, t.left, t.right), i.cp2y = rv(i.cp2y, t.top, t.bottom)));
}
function av(e, t, n, r, i) {
	let a, o, s, c;
	if (t.spanGaps && (e = e.filter((e) => !e.skip)), t.cubicInterpolationMode === "monotone") nv(e, i);
	else {
		let n = r ? e[e.length - 1] : e[0];
		for (a = 0, o = e.length; a < o; ++a) s = e[a], c = $_(n, s, e[Math.min(a + 1, o - +!r) % o], t.tension), s.cp1x = c.previous.x, s.cp1y = c.previous.y, s.cp2x = c.next.x, s.cp2y = c.next.y, n = s;
	}
	t.capBezierPoints && iv(e, n);
}
function ov() {
	return typeof window < "u" && typeof document < "u";
}
function sv(e) {
	let t = e.parentNode;
	return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
}
function cv(e, t, n) {
	let r;
	return typeof e == "string" ? (r = parseInt(e, 10), e.indexOf("%") !== -1 && (r = r / 100 * t.parentNode[n])) : r = e, r;
}
var lv = (e) => e.ownerDocument.defaultView.getComputedStyle(e, null);
function uv(e, t) {
	return lv(e).getPropertyValue(t);
}
var dv = [
	"top",
	"right",
	"bottom",
	"left"
];
function fv(e, t, n) {
	let r = {};
	n = n ? "-" + n : "";
	for (let i = 0; i < 4; i++) {
		let a = dv[i];
		r[a] = parseFloat(e[t + "-" + a + n]) || 0;
	}
	return r.width = r.left + r.right, r.height = r.top + r.bottom, r;
}
var pv = (e, t, n) => (e > 0 || t > 0) && (!n || !n.shadowRoot);
function mv(e, t) {
	let n = e.touches, r = n && n.length ? n[0] : e, { offsetX: i, offsetY: a } = r, o = !1, s, c;
	if (pv(i, a, e.target)) s = i, c = a;
	else {
		let e = t.getBoundingClientRect();
		s = r.clientX - e.left, c = r.clientY - e.top, o = !0;
	}
	return {
		x: s,
		y: c,
		box: o
	};
}
function hv(e, t) {
	if ("native" in e) return e;
	let { canvas: n, currentDevicePixelRatio: r } = t, i = lv(n), a = i.boxSizing === "border-box", o = fv(i, "padding"), s = fv(i, "border", "width"), { x: c, y: l, box: u } = mv(e, n), d = o.left + (u && s.left), f = o.top + (u && s.top), { width: p, height: m } = t;
	return a && (p -= o.width + s.width, m -= o.height + s.height), {
		x: Math.round((c - d) / p * n.width / r),
		y: Math.round((l - f) / m * n.height / r)
	};
}
function gv(e, t, n) {
	let r, i;
	if (t === void 0 || n === void 0) {
		let a = e && sv(e);
		if (!a) t = e.clientWidth, n = e.clientHeight;
		else {
			let e = a.getBoundingClientRect(), o = lv(a), s = fv(o, "border", "width"), c = fv(o, "padding");
			t = e.width - c.width - s.width, n = e.height - c.height - s.height, r = cv(o.maxWidth, a, "clientWidth"), i = cv(o.maxHeight, a, "clientHeight");
		}
	}
	return {
		width: t,
		height: n,
		maxWidth: r || Kh,
		maxHeight: i || Kh
	};
}
var _v = (e) => Math.round(e * 10) / 10;
function vv(e, t, n, r) {
	let i = lv(e), a = fv(i, "margin"), o = cv(i.maxWidth, e, "clientWidth") || Kh, s = cv(i.maxHeight, e, "clientHeight") || Kh, c = gv(e, t, n), { width: l, height: u } = c;
	if (i.boxSizing === "content-box") {
		let e = fv(i, "border", "width"), t = fv(i, "padding");
		l -= t.width + e.width, u -= t.height + e.height;
	}
	return l = Math.max(0, l - a.width), u = Math.max(0, r ? l / r : u - a.height), l = _v(Math.min(l, o, c.maxWidth)), u = _v(Math.min(u, s, c.maxHeight)), l && !u && (u = _v(l / 2)), (t !== void 0 || n !== void 0) && r && c.height && u > c.height && (u = c.height, l = _v(Math.floor(u * r))), {
		width: l,
		height: u
	};
}
function yv(e, t, n) {
	let r = t || 1, i = _v(e.height * r), a = _v(e.width * r);
	e.height = _v(e.height), e.width = _v(e.width);
	let o = e.canvas;
	o.style && (n || !o.style.height && !o.style.width) && (o.style.height = `${e.height}px`, o.style.width = `${e.width}px`);
	let s = Math.floor(i), c = Math.floor(a);
	return e.currentDevicePixelRatio !== r || o.height !== s || o.width !== c ? (e.currentDevicePixelRatio = r, o.height = s, o.width = c, e.ctx.setTransform(r, 0, 0, r, 0, 0), !0) : !1;
}
var bv = function() {
	let e = !1;
	try {
		let t = { get passive() {
			return e = !0, !1;
		} };
		ov() && (window.addEventListener("test", null, t), window.removeEventListener("test", null, t));
	} catch {}
	return e;
}();
function xv(e, t) {
	let n = uv(e, t), r = n && n.match(/^(\d+)(\.\d+)?px$/);
	return r ? +r[1] : void 0;
}
function Sv(e, t, n, r) {
	return {
		x: e.x + n * (t.x - e.x),
		y: e.y + n * (t.y - e.y)
	};
}
function Cv(e, t, n, r) {
	return {
		x: e.x + n * (t.x - e.x),
		y: r === "middle" ? n < .5 ? e.y : t.y : r === "after" ? n < 1 ? e.y : t.y : n > 0 ? t.y : e.y
	};
}
function wv(e, t, n, r) {
	let i = {
		x: e.cp2x,
		y: e.cp2y
	}, a = {
		x: t.cp1x,
		y: t.cp1y
	}, o = Sv(e, i, n), s = Sv(i, a, n), c = Sv(a, t, n);
	return Sv(Sv(o, s, n), Sv(s, c, n), n);
}
var Tv = function(e, t) {
	return {
		x(n) {
			return e + e + t - n;
		},
		setWidth(e) {
			t = e;
		},
		textAlign(e) {
			return e === "center" ? e : e === "right" ? "left" : "right";
		},
		xPlus(e, t) {
			return e - t;
		},
		leftForLtr(e, t) {
			return e - t;
		}
	};
}, Ev = function() {
	return {
		x(e) {
			return e;
		},
		setWidth(e) {},
		textAlign(e) {
			return e;
		},
		xPlus(e, t) {
			return e + t;
		},
		leftForLtr(e, t) {
			return e;
		}
	};
};
function Dv(e, t, n) {
	return e ? Tv(t, n) : Ev();
}
function Ov(e, t) {
	let n, r;
	(t === "ltr" || t === "rtl") && (n = e.canvas.style, r = [n.getPropertyValue("direction"), n.getPropertyPriority("direction")], n.setProperty("direction", t, "important"), e.prevTextDirection = r);
}
function kv(e, t) {
	t !== void 0 && (delete e.prevTextDirection, e.canvas.style.setProperty("direction", t[0], t[1]));
}
function Av(e) {
	return e === "angle" ? {
		between: pg,
		compare: dg,
		normalize: fg
	} : {
		between: gg,
		compare: (e, t) => e - t,
		normalize: (e) => e
	};
}
function jv({ start: e, end: t, count: n, loop: r, style: i }) {
	return {
		start: e % n,
		end: t % n,
		loop: r && (t - e + 1) % n === 0,
		style: i
	};
}
function Mv(e, t, n) {
	let { property: r, start: i, end: a } = n, { between: o, normalize: s } = Av(r), c = t.length, { start: l, end: u, loop: d } = e, f, p;
	if (d) {
		for (l += c, u += c, f = 0, p = c; f < p && o(s(t[l % c][r]), i, a); ++f) l--, u--;
		l %= c, u %= c;
	}
	return u < l && (u += c), {
		start: l,
		end: u,
		loop: d,
		style: e.style
	};
}
function Nv(e, t, n) {
	if (!n) return [e];
	let { property: r, start: i, end: a } = n, o = t.length, { compare: s, between: c, normalize: l } = Av(r), { start: u, end: d, loop: f, style: p } = Mv(e, t, n), m = [], h = !1, g = null, _, v, y, b = () => c(i, y, _) && s(i, y) !== 0, x = () => s(a, _) === 0 || c(a, y, _), S = () => h || b(), C = () => !h || x();
	for (let e = u, n = u; e <= d; ++e) v = t[e % o], v.skip || (_ = l(v[r]), _ !== y && (h = c(_, i, a), g === null && S() && (g = s(_, i) === 0 ? e : n), g !== null && C() && (m.push(jv({
		start: g,
		end: e,
		loop: f,
		count: o,
		style: p
	})), g = null), n = e, y = _));
	return g !== null && m.push(jv({
		start: g,
		end: d,
		loop: f,
		count: o,
		style: p
	})), m;
}
function Pv(e, t) {
	let n = [], r = e.segments;
	for (let i = 0; i < r.length; i++) {
		let a = Nv(r[i], e.points, t);
		a.length && n.push(...a);
	}
	return n;
}
function Fv(e, t, n, r) {
	let i = 0, a = t - 1;
	if (n && !r) for (; i < t && !e[i].skip;) i++;
	for (; i < t && e[i].skip;) i++;
	for (i %= t, n && (a += i); a > i && e[a % t].skip;) a--;
	return a %= t, {
		start: i,
		end: a
	};
}
function Iv(e, t, n, r) {
	let i = e.length, a = [], o = t, s = e[t], c;
	for (c = t + 1; c <= n; ++c) {
		let n = e[c % i];
		n.skip || n.stop ? s.skip || (r = !1, a.push({
			start: t % i,
			end: (c - 1) % i,
			loop: r
		}), t = o = n.stop ? c : null) : (o = c, s.skip && (t = c)), s = n;
	}
	return o !== null && a.push({
		start: t % i,
		end: o % i,
		loop: r
	}), a;
}
function Lv(e, t) {
	let n = e.points, r = e.options.spanGaps, i = n.length;
	if (!i) return [];
	let a = !!e._loop, { start: o, end: s } = Fv(n, i, a, r);
	return r === !0 ? Rv(e, [{
		start: o,
		end: s,
		loop: a
	}], n, t) : Rv(e, Iv(n, o, s < o ? s + i : s, !!e._fullLoop && o === 0 && s === i - 1), n, t);
}
function Rv(e, t, n, r) {
	return !r || !r.setContext || !n ? t : zv(e, t, n, r);
}
function zv(e, t, n, r) {
	let i = e._chart.getContext(), a = Bv(e.options), { _datasetIndex: o, options: { spanGaps: s } } = e, c = n.length, l = [], u = a, d = t[0].start, f = d;
	function p(e, t, r, i) {
		let a = s ? -1 : 1;
		if (e !== t) {
			for (e += c; n[e % c].skip;) e -= a;
			for (; n[t % c].skip;) t += a;
			e % c !== t % c && (l.push({
				start: e % c,
				end: t % c,
				loop: r,
				style: i
			}), u = i, d = t % c);
		}
	}
	for (let e of t) {
		d = s ? d : e.start;
		let t = n[d % c], a;
		for (f = d + 1; f <= e.end; f++) {
			let s = n[f % c];
			a = Bv(r.setContext(A_(i, {
				type: "segment",
				p0: t,
				p1: s,
				p0DataIndex: (f - 1) % c,
				p1DataIndex: f % c,
				datasetIndex: o
			}))), Vv(a, u) && p(d, f - 1, e.loop, u), t = s, u = a;
		}
		d < f - 1 && p(d, f - 1, e.loop, u);
	}
	return l;
}
function Bv(e) {
	return {
		backgroundColor: e.backgroundColor,
		borderCapStyle: e.borderCapStyle,
		borderDash: e.borderDash,
		borderDashOffset: e.borderDashOffset,
		borderJoinStyle: e.borderJoinStyle,
		borderWidth: e.borderWidth,
		borderColor: e.borderColor
	};
}
function Vv(e, t) {
	if (!t) return !1;
	let n = [], r = function(e, t) {
		return Lg(t) ? (n.includes(t) || n.push(t), n.indexOf(t)) : t;
	};
	return JSON.stringify(e, r) !== JSON.stringify(t, r);
}
function Hv(e, t, n) {
	return e.options.clip ? e[n] : t[n];
}
function Uv(e, t) {
	let { xScale: n, yScale: r } = e;
	return n && r ? {
		left: Hv(n, t, "left"),
		right: Hv(n, t, "right"),
		top: Hv(r, t, "top"),
		bottom: Hv(r, t, "bottom")
	} : t;
}
function Wv(e, t) {
	let n = t._clip;
	if (n.disabled) return !1;
	let r = Uv(t, e.chartArea);
	return {
		left: n.left === !1 ? 0 : r.left - (n.left === !0 ? 0 : n.left),
		right: n.right === !1 ? e.width : r.right + (n.right === !0 ? 0 : n.right),
		top: n.top === !1 ? 0 : r.top - (n.top === !0 ? 0 : n.top),
		bottom: n.bottom === !1 ? e.height : r.bottom + (n.bottom === !0 ? 0 : n.bottom)
	};
}
var Gv = /* #__PURE__ */ new class {
	constructor() {
		this._request = null, this._charts = /* @__PURE__ */ new Map(), this._running = !1, this._lastDate = void 0;
	}
	_notify(e, t, n, r) {
		let i = t.listeners[r], a = t.duration;
		i.forEach((r) => r({
			chart: e,
			initial: t.initial,
			numSteps: a,
			currentStep: Math.min(n - t.start, a)
		}));
	}
	_refresh() {
		this._request ||= (this._running = !0, Tg.call(window, () => {
			this._update(), this._request = null, this._running && this._refresh();
		}));
	}
	_update(e = Date.now()) {
		let t = 0;
		this._charts.forEach((n, r) => {
			if (!n.running || !n.items.length) return;
			let i = n.items, a = i.length - 1, o = !1, s;
			for (; a >= 0; --a) s = i[a], s._active ? (s._total > n.duration && (n.duration = s._total), s.tick(e), o = !0) : (i[a] = i[i.length - 1], i.pop());
			o && (r.draw(), this._notify(r, n, e, "progress")), i.length || (n.running = !1, this._notify(r, n, e, "complete"), n.initial = !1), t += i.length;
		}), this._lastDate = e, t === 0 && (this._running = !1);
	}
	_getAnims(e) {
		let t = this._charts, n = t.get(e);
		return n || (n = {
			running: !1,
			initial: !0,
			items: [],
			listeners: {
				complete: [],
				progress: []
			}
		}, t.set(e, n)), n;
	}
	listen(e, t, n) {
		this._getAnims(e).listeners[t].push(n);
	}
	add(e, t) {
		t && t.length && this._getAnims(e).items.push(...t);
	}
	has(e) {
		return this._getAnims(e).items.length > 0;
	}
	start(e) {
		let t = this._charts.get(e);
		t && (t.running = !0, t.start = Date.now(), t.duration = t.items.reduce((e, t) => Math.max(e, t._duration), 0), this._refresh());
	}
	running(e) {
		if (!this._running) return !1;
		let t = this._charts.get(e);
		return !(!t || !t.running || !t.items.length);
	}
	stop(e) {
		let t = this._charts.get(e);
		if (!t || !t.items.length) return;
		let n = t.items, r = n.length - 1;
		for (; r >= 0; --r) n[r].cancel();
		t.items = [], this._notify(e, t, Date.now(), "complete");
	}
	remove(e) {
		return this._charts.delete(e);
	}
}(), Kv = "transparent", qv = {
	boolean(e, t, n) {
		return n > .5 ? t : e;
	},
	color(e, t, n) {
		let r = Rg(e || Kv), i = r.valid && Rg(t || Kv);
		return i && i.valid ? i.mix(r, n).hexString() : t;
	},
	number(e, t, n) {
		return e + (t - e) * n;
	}
}, Jv = class {
	constructor(e, t, n, r) {
		let i = t[n];
		r = O_([
			e.to,
			r,
			i,
			e.from
		]);
		let a = O_([
			e.from,
			i,
			r
		]);
		this._active = !0, this._fn = e.fn || qv[e.type || typeof a], this._easing = Ig[e.easing] || Ig.linear, this._start = Math.floor(Date.now() + (e.delay || 0)), this._duration = this._total = Math.floor(e.duration), this._loop = !!e.loop, this._target = t, this._prop = n, this._from = a, this._to = r, this._promises = void 0;
	}
	active() {
		return this._active;
	}
	update(e, t, n) {
		if (this._active) {
			this._notify(!1);
			let r = this._target[this._prop], i = n - this._start, a = this._duration - i;
			this._start = n, this._duration = Math.floor(Math.max(a, e.duration)), this._total += i, this._loop = !!e.loop, this._to = O_([
				e.to,
				t,
				r,
				e.from
			]), this._from = O_([
				e.from,
				r,
				t
			]);
		}
	}
	cancel() {
		this._active && (this.tick(Date.now()), this._active = !1, this._notify(!1));
	}
	tick(e) {
		let t = e - this._start, n = this._duration, r = this._prop, i = this._from, a = this._loop, o = this._to, s;
		this._active = i !== o && (a || t < n), this._active ? t < 0 ? this._target[r] = i : (s = t / n % 2, s = a && s > 1 ? 2 - s : s, s = this._easing(Math.min(1, Math.max(0, s))), this._target[r] = this._fn(i, o, s)) : (this._target[r] = o, this._notify(!0));
	}
	wait() {
		let e = this._promises ||= [];
		return new Promise((t, n) => {
			e.push({
				res: t,
				rej: n
			});
		});
	}
	_notify(e) {
		let t = e ? "res" : "rej", n = this._promises || [];
		for (let e = 0; e < n.length; e++) n[e][t]();
	}
}, Yv = class {
	constructor(e, t) {
		this._chart = e, this._properties = /* @__PURE__ */ new Map(), this.configure(t);
	}
	configure(e) {
		if (!X(e)) return;
		let t = Object.keys(t_.animation), n = this._properties;
		Object.getOwnPropertyNames(e).forEach((r) => {
			let i = e[r];
			if (!X(i)) return;
			let a = {};
			for (let e of t) a[e] = i[e];
			(Ch(i.properties) && i.properties || [r]).forEach((e) => {
				e !== r && n.has(e) || n.set(e, a);
			});
		});
	}
	_animateOptions(e, t) {
		let n = t.options, r = Zv(e, n);
		if (!r) return [];
		let i = this._createAnimations(r, n);
		return n.$shared && Xv(e.options.$animations, n).then(() => {
			e.options = n;
		}, () => {}), i;
	}
	_createAnimations(e, t) {
		let n = this._properties, r = [], i = e.$animations ||= {}, a = Object.keys(t), o = Date.now(), s;
		for (s = a.length - 1; s >= 0; --s) {
			let c = a[s];
			if (c.charAt(0) === "$") continue;
			if (c === "options") {
				r.push(...this._animateOptions(e, t));
				continue;
			}
			let l = t[c], u = i[c], d = n.get(c);
			if (u) {
				if (d && u.active()) {
					u.update(d, l, o);
					continue;
				}
				u.cancel();
			}
			!d || !d.duration ? e[c] = l : (i[c] = u = new Jv(d, e, c, l), r.push(u));
		}
		return r;
	}
	update(e, t) {
		if (this._properties.size === 0) {
			Object.assign(e, t);
			return;
		}
		let n = this._createAnimations(e, t);
		if (n.length) return Gv.add(this._chart, n), !0;
	}
};
function Xv(e, t) {
	let n = [], r = Object.keys(t);
	for (let t = 0; t < r.length; t++) {
		let i = e[r[t]];
		i && i.active() && n.push(i.wait());
	}
	return Promise.all(n);
}
function Zv(e, t) {
	if (!t) return;
	let n = e.options;
	if (!n) e.options = t;
	else return n.$shared && (e.options = n = Object.assign({}, n, {
		$shared: !1,
		$animations: {}
	})), n;
}
function Qv(e, t) {
	let n = e && e.options || {}, r = n.reverse, i = n.min === void 0 ? t : 0, a = n.max === void 0 ? t : 0;
	return {
		start: r ? a : i,
		end: r ? i : a
	};
}
function $v(e, t, n) {
	if (n === !1) return !1;
	let r = Qv(e, n), i = Qv(t, n);
	return {
		top: i.end,
		right: r.end,
		bottom: i.start,
		left: r.start
	};
}
function ey(e) {
	let t, n, r, i;
	return X(e) ? (t = e.top, n = e.right, r = e.bottom, i = e.left) : t = n = r = i = e, {
		top: t,
		right: n,
		bottom: r,
		left: i,
		disabled: e === !1
	};
}
function ty(e, t) {
	let n = [], r = e._getSortedDatasetMetas(t), i, a;
	for (i = 0, a = r.length; i < a; ++i) n.push(r[i].index);
	return n;
}
function ny(e, t, n, r = {}) {
	let i = e.keys, a = r.mode === "single", o, s, c, l;
	if (t === null) return;
	let u = !1;
	for (o = 0, s = i.length; o < s; ++o) {
		if (c = +i[o], c === n) {
			if (u = !0, r.all) continue;
			break;
		}
		l = e.values[c], wh(l) && (a || t === 0 || Qh(t) === Qh(l)) && (t += l);
	}
	return !u && !r.all ? 0 : t;
}
function ry(e, t) {
	let { iScale: n, vScale: r } = t, i = n.axis === "x" ? "x" : "y", a = r.axis === "x" ? "x" : "y", o = Object.keys(e), s = Array(o.length), c, l, u;
	for (c = 0, l = o.length; c < l; ++c) u = o[c], s[c] = {
		[i]: u,
		[a]: e[u]
	};
	return s;
}
function iy(e, t) {
	let n = e && e.options.stacked;
	return n || n === void 0 && t.stack !== void 0;
}
function ay(e, t, n) {
	return `${e.id}.${t.id}.${n.stack || n.type}`;
}
function oy(e) {
	let { min: t, max: n, minDefined: r, maxDefined: i } = e.getUserBounds();
	return {
		min: r ? t : -Infinity,
		max: i ? n : Infinity
	};
}
function sy(e, t, n) {
	let r = e[t] || (e[t] = {});
	return r[n] || (r[n] = {});
}
function cy(e, t, n, r) {
	for (let i of t.getMatchingVisibleMetas(r).reverse()) {
		let t = e[i.index];
		if (n && t > 0 || !n && t < 0) return i.index;
	}
	return null;
}
function ly(e, t) {
	let { chart: n, _cachedMeta: r } = e, i = n._stacks ||= {}, { iScale: a, vScale: o, index: s } = r, c = a.axis, l = o.axis, u = ay(a, o, r), d = t.length, f;
	for (let e = 0; e < d; ++e) {
		let n = t[e], { [c]: a, [l]: d } = n, p = n._stacks ||= {};
		f = p[l] = sy(i, u, a), f[s] = d, f._top = cy(f, o, !0, r.type), f._bottom = cy(f, o, !1, r.type);
		let m = f._visualValues || (f._visualValues = {});
		m[s] = d;
	}
}
function uy(e, t) {
	let n = e.scales;
	return Object.keys(n).filter((e) => n[e].axis === t).shift();
}
function dy(e, t) {
	return A_(e, {
		active: !1,
		dataset: void 0,
		datasetIndex: t,
		index: t,
		mode: "default",
		type: "dataset"
	});
}
function fy(e, t, n) {
	return A_(e, {
		active: !1,
		dataIndex: t,
		parsed: void 0,
		raw: void 0,
		element: n,
		index: t,
		mode: "default",
		type: "data"
	});
}
function py(e, t) {
	let n = e.controller.index, r = e.vScale && e.vScale.axis;
	if (r) {
		t ||= e._parsed;
		for (let e of t) {
			let t = e._stacks;
			t && t[r] !== void 0 && t[r][n] !== void 0 && (delete t[r][n], t[r]._visualValues !== void 0 && t[r]._visualValues[n] !== void 0 && delete t[r]._visualValues[n]);
		}
	}
}
var my = (e) => e === "reset" || e === "none", hy = (e, t) => t ? e : Object.assign({}, e), gy = (e, t, n) => e && !t.hidden && t._stacked && {
	keys: ty(n, !0),
	values: null
}, _y = class {
	static defaults = {};
	static datasetElementType = null;
	static dataElementType = null;
	constructor(e, t) {
		this.chart = e, this._ctx = e.ctx, this.index = t, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.datasetElementType = new.target.datasetElementType, this.dataElementType = new.target.dataElementType, this.initialize();
	}
	initialize() {
		let e = this._cachedMeta;
		this.configure(), this.linkScales(), e._stacked = iy(e.vScale, e), this.addElements(), this.options.fill && !this.chart.isPluginEnabled("filler") && console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
	}
	updateIndex(e) {
		this.index !== e && py(this._cachedMeta), this.index = e;
	}
	linkScales() {
		let e = this.chart, t = this._cachedMeta, n = this.getDataset(), r = (e, t, n, r) => e === "x" ? t : e === "r" ? r : n, i = t.xAxisID = Z(n.xAxisID, uy(e, "x")), a = t.yAxisID = Z(n.yAxisID, uy(e, "y")), o = t.rAxisID = Z(n.rAxisID, uy(e, "r")), s = t.indexAxis, c = t.iAxisID = r(s, i, a, o), l = t.vAxisID = r(s, a, i, o);
		t.xScale = this.getScaleForId(i), t.yScale = this.getScaleForId(a), t.rScale = this.getScaleForId(o), t.iScale = this.getScaleForId(c), t.vScale = this.getScaleForId(l);
	}
	getDataset() {
		return this.chart.data.datasets[this.index];
	}
	getMeta() {
		return this.chart.getDatasetMeta(this.index);
	}
	getScaleForId(e) {
		return this.chart.scales[e];
	}
	_getOtherScale(e) {
		let t = this._cachedMeta;
		return e === t.iScale ? t.vScale : t.iScale;
	}
	reset() {
		this._update("reset");
	}
	_destroy() {
		let e = this._cachedMeta;
		this._data && Cg(this._data, this), e._stacked && py(e);
	}
	_dataCheck() {
		let e = this.getDataset(), t = e.data ||= [], n = this._data;
		if (X(t)) {
			let e = this._cachedMeta;
			this._data = ry(t, e);
		} else if (n !== t) {
			if (n) {
				Cg(n, this);
				let e = this._cachedMeta;
				py(e), e._parsed = [];
			}
			t && Object.isExtensible(t) && Sg(t, this), this._syncList = [], this._data = t;
		}
	}
	addElements() {
		let e = this._cachedMeta;
		this._dataCheck(), this.datasetElementType && (e.dataset = new this.datasetElementType());
	}
	buildOrUpdateElements(e) {
		let t = this._cachedMeta, n = this.getDataset(), r = !1;
		this._dataCheck();
		let i = t._stacked;
		t._stacked = iy(t.vScale, t), t.stack !== n.stack && (r = !0, py(t), t.stack = n.stack), this._resyncElements(e), (r || i !== t._stacked) && (ly(this, t._parsed), t._stacked = iy(t.vScale, t));
	}
	configure() {
		let e = this.chart.config, t = e.datasetScopeKeys(this._type), n = e.getOptionScopes(this.getDataset(), t, !0);
		this.options = e.createResolver(n, this.getContext()), this._parsing = this.options.parsing, this._cachedDataOpts = {};
	}
	parse(e, t) {
		let { _cachedMeta: n, _data: r } = this, { iScale: i, _stacked: a } = n, o = i.axis, s = e === 0 && t === r.length || n._sorted, c = e > 0 && n._parsed[e - 1], l, u, d;
		if (this._parsing === !1) n._parsed = r, n._sorted = !0, d = r;
		else {
			d = Ch(r[e]) ? this.parseArrayData(n, r, e, t) : X(r[e]) ? this.parseObjectData(n, r, e, t) : this.parsePrimitiveData(n, r, e, t);
			let i = () => u[o] === null || c && u[o] < c[o];
			for (l = 0; l < t; ++l) n._parsed[l + e] = u = d[l], s && (i() && (s = !1), c = u);
			n._sorted = s;
		}
		a && ly(this, d);
	}
	parsePrimitiveData(e, t, n, r) {
		let { iScale: i, vScale: a } = e, o = i.axis, s = a.axis, c = i.getLabels(), l = i === a, u = Array(r), d, f, p;
		for (d = 0, f = r; d < f; ++d) p = d + n, u[d] = {
			[o]: l || i.parse(c[p], p),
			[s]: a.parse(t[p], p)
		};
		return u;
	}
	parseArrayData(e, t, n, r) {
		let { xScale: i, yScale: a } = e, o = Array(r), s, c, l, u;
		for (s = 0, c = r; s < c; ++s) l = s + n, u = t[l], o[s] = {
			x: i.parse(u[0], l),
			y: a.parse(u[1], l)
		};
		return o;
	}
	parseObjectData(e, t, n, r) {
		let { xScale: i, yScale: a } = e, { xAxisKey: o = "x", yAxisKey: s = "y" } = this._parsing, c = Array(r), l, u, d, f;
		for (l = 0, u = r; l < u; ++l) d = l + n, f = t[d], c[l] = {
			x: i.parse(Lh(f, o), d),
			y: a.parse(Lh(f, s), d)
		};
		return c;
	}
	getParsed(e) {
		return this._cachedMeta._parsed[e];
	}
	getDataElement(e) {
		return this._cachedMeta.data[e];
	}
	applyStack(e, t, n) {
		let r = this.chart, i = this._cachedMeta, a = t[e.axis];
		return ny({
			keys: ty(r, !0),
			values: t._stacks[e.axis]._visualValues
		}, a, i.index, { mode: n });
	}
	updateRangeFromParsed(e, t, n, r) {
		let i = n[t.axis], a = i === null ? NaN : i, o = r && n._stacks[t.axis];
		r && o && (r.values = o, a = ny(r, i, this._cachedMeta.index)), e.min = Math.min(e.min, a), e.max = Math.max(e.max, a);
	}
	getMinMax(e, t) {
		let n = this._cachedMeta, r = n._parsed, i = n._sorted && e === n.iScale, a = r.length, o = this._getOtherScale(e), s = gy(t, n, this.chart), c = {
			min: Infinity,
			max: -Infinity
		}, { min: l, max: u } = oy(o), d, f;
		function p() {
			f = r[d];
			let t = f[o.axis];
			return !wh(f[e.axis]) || l > t || u < t;
		}
		for (d = 0; d < a && !(!p() && (this.updateRangeFromParsed(c, e, f, s), i)); ++d);
		if (i) {
			for (d = a - 1; d >= 0; --d) if (!p()) {
				this.updateRangeFromParsed(c, e, f, s);
				break;
			}
		}
		return c;
	}
	getAllParsedValues(e) {
		let t = this._cachedMeta._parsed, n = [], r, i, a;
		for (r = 0, i = t.length; r < i; ++r) a = t[r][e.axis], wh(a) && n.push(a);
		return n;
	}
	getMaxOverflow() {
		return !1;
	}
	getLabelAndValue(e) {
		let t = this._cachedMeta, n = t.iScale, r = t.vScale, i = this.getParsed(e);
		return {
			label: n ? "" + n.getLabelForValue(i[n.axis]) : "",
			value: r ? "" + r.getLabelForValue(i[r.axis]) : ""
		};
	}
	_update(e) {
		let t = this._cachedMeta;
		this.update(e || "default"), t._clip = ey(Z(this.options.clip, $v(t.xScale, t.yScale, this.getMaxOverflow())));
	}
	update(e) {}
	draw() {
		let e = this._ctx, t = this.chart, n = this._cachedMeta, r = n.data || [], i = t.chartArea, a = [], o = this._drawStart || 0, s = this._drawCount || r.length - o, c = this.options.drawActiveElementsOnTop, l;
		for (n.dataset && n.dataset.draw(e, i, o, s), l = o; l < o + s; ++l) {
			let t = r[l];
			t.hidden || (t.active && c ? a.push(t) : t.draw(e, i));
		}
		for (l = 0; l < a.length; ++l) a[l].draw(e, i);
	}
	getStyle(e, t) {
		let n = t ? "active" : "default";
		return e === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(n) : this.resolveDataElementOptions(e || 0, n);
	}
	getContext(e, t, n) {
		let r = this.getDataset(), i;
		if (e >= 0 && e < this._cachedMeta.data.length) {
			let t = this._cachedMeta.data[e];
			i = t.$context ||= fy(this.getContext(), e, t), i.parsed = this.getParsed(e), i.raw = r.data[e], i.index = i.dataIndex = e;
		} else i = this.$context ||= dy(this.chart.getContext(), this.index), i.dataset = r, i.index = i.datasetIndex = this.index;
		return i.active = !!t, i.mode = n, i;
	}
	resolveDatasetElementOptions(e) {
		return this._resolveElementOptions(this.datasetElementType.id, e);
	}
	resolveDataElementOptions(e, t) {
		return this._resolveElementOptions(this.dataElementType.id, t, e);
	}
	_resolveElementOptions(e, t = "default", n) {
		let r = t === "active", i = this._cachedDataOpts, a = e + "-" + t, o = i[a], s = this.enableOptionSharing && zh(n);
		if (o) return hy(o, s);
		let c = this.chart.config, l = c.datasetElementScopeKeys(this._type, e), u = r ? [
			`${e}Hover`,
			"hover",
			e,
			""
		] : [e, ""], d = c.getOptionScopes(this.getDataset(), l), f = Object.keys(t_.elements[e]), p = c.resolveNamedOptions(d, f, () => this.getContext(n, r, t), u);
		return p.$shared && (p.$shared = s, i[a] = Object.freeze(hy(p, s))), p;
	}
	_resolveAnimations(e, t, n) {
		let r = this.chart, i = this._cachedDataOpts, a = `animation-${t}`, o = i[a];
		if (o) return o;
		let s;
		if (r.options.animation !== !1) {
			let r = this.chart.config, i = r.datasetAnimationScopeKeys(this._type, t), a = r.getOptionScopes(this.getDataset(), i);
			s = r.createResolver(a, this.getContext(e, n, t));
		}
		let c = new Yv(r, s && s.animations);
		return s && s._cacheable && (i[a] = Object.freeze(c)), c;
	}
	getSharedOptions(e) {
		if (e.$shared) return this._sharedOptions ||= Object.assign({}, e);
	}
	includeOptions(e, t) {
		return !t || my(e) || this.chart._animationsDisabled;
	}
	_getSharedOptions(e, t) {
		let n = this.resolveDataElementOptions(e, t), r = this._sharedOptions, i = this.getSharedOptions(n), a = this.includeOptions(t, i) || i !== r;
		return this.updateSharedOptions(i, t, n), {
			sharedOptions: i,
			includeOptions: a
		};
	}
	updateElement(e, t, n, r) {
		my(r) ? Object.assign(e, n) : this._resolveAnimations(t, r).update(e, n);
	}
	updateSharedOptions(e, t, n) {
		e && !my(t) && this._resolveAnimations(void 0, t).update(e, n);
	}
	_setStyle(e, t, n, r) {
		e.active = r;
		let i = this.getStyle(t, r);
		this._resolveAnimations(t, n, r).update(e, { options: !r && this.getSharedOptions(i) || i });
	}
	removeHoverStyle(e, t, n) {
		this._setStyle(e, n, "active", !1);
	}
	setHoverStyle(e, t, n) {
		this._setStyle(e, n, "active", !0);
	}
	_removeDatasetHoverStyle() {
		let e = this._cachedMeta.dataset;
		e && this._setStyle(e, void 0, "active", !1);
	}
	_setDatasetHoverStyle() {
		let e = this._cachedMeta.dataset;
		e && this._setStyle(e, void 0, "active", !0);
	}
	_resyncElements(e) {
		let t = this._data, n = this._cachedMeta.data;
		for (let [e, t, n] of this._syncList) this[e](t, n);
		this._syncList = [];
		let r = n.length, i = t.length, a = Math.min(i, r);
		a && this.parse(0, a), i > r ? this._insertElements(r, i - r, e) : i < r && this._removeElements(i, r - i);
	}
	_insertElements(e, t, n = !0) {
		let r = this._cachedMeta, i = r.data, a = e + t, o, s = (e) => {
			for (e.length += t, o = e.length - 1; o >= a; o--) e[o] = e[o - t];
		};
		for (s(i), o = e; o < a; ++o) i[o] = new this.dataElementType();
		this._parsing && s(r._parsed), this.parse(e, t), n && this.updateElements(i, e, t, "reset");
	}
	updateElements(e, t, n, r) {}
	_removeElements(e, t) {
		let n = this._cachedMeta;
		if (this._parsing) {
			let r = n._parsed.splice(e, t);
			n._stacked && py(n, r);
		}
		n.data.splice(e, t);
	}
	_sync(e) {
		if (this._parsing) this._syncList.push(e);
		else {
			let [t, n, r] = e;
			this[t](n, r);
		}
		this.chart._dataChanges.push([this.index, ...e]);
	}
	_onDataPush() {
		let e = arguments.length;
		this._sync([
			"_insertElements",
			this.getDataset().data.length - e,
			e
		]);
	}
	_onDataPop() {
		this._sync([
			"_removeElements",
			this._cachedMeta.data.length - 1,
			1
		]);
	}
	_onDataShift() {
		this._sync([
			"_removeElements",
			0,
			1
		]);
	}
	_onDataSplice(e, t) {
		t && this._sync([
			"_removeElements",
			e,
			t
		]);
		let n = arguments.length - 2;
		n && this._sync([
			"_insertElements",
			e,
			n
		]);
	}
	_onDataUnshift() {
		this._sync([
			"_insertElements",
			0,
			arguments.length
		]);
	}
};
function vy(e, t) {
	if (!e._cache.$bar) {
		let n = e.getMatchingVisibleMetas(t), r = [];
		for (let t = 0, i = n.length; t < i; t++) r = r.concat(n[t].controller.getAllParsedValues(e));
		e._cache.$bar = wg(r.sort((e, t) => e - t));
	}
	return e._cache.$bar;
}
function yy(e) {
	let t = e.iScale, n = vy(t, e.type), r = t._length, i, a, o, s, c = () => {
		o !== 32767 && o !== -32768 && (zh(s) && (r = Math.min(r, Math.abs(o - s) || r)), s = o);
	};
	for (i = 0, a = n.length; i < a; ++i) o = t.getPixelForValue(n[i]), c();
	for (s = void 0, i = 0, a = t.ticks.length; i < a; ++i) o = t.getPixelForTick(i), c();
	return r;
}
function by(e, t, n, r) {
	let i = n.barThickness, a, o;
	return Y(i) ? (a = t.min * n.categoryPercentage, o = n.barPercentage) : (a = i * r, o = 1), {
		chunk: a / r,
		ratio: o,
		start: t.pixels[e] - a / 2
	};
}
function xy(e, t, n, r) {
	let i = t.pixels, a = i[e], o = e > 0 ? i[e - 1] : null, s = e < i.length - 1 ? i[e + 1] : null, c = n.categoryPercentage;
	o === null && (o = a - (s === null ? t.end - t.start : s - a)), s === null && (s = a + a - o);
	let l = a - (a - Math.min(o, s)) / 2 * c;
	return {
		chunk: Math.abs(s - o) / 2 * c / r,
		ratio: n.barPercentage,
		start: l
	};
}
function Sy(e, t, n, r) {
	let i = n.parse(e[0], r), a = n.parse(e[1], r), o = Math.min(i, a), s = Math.max(i, a), c = o, l = s;
	Math.abs(o) > Math.abs(s) && (c = s, l = o), t[n.axis] = l, t._custom = {
		barStart: c,
		barEnd: l,
		start: i,
		end: a,
		min: o,
		max: s
	};
}
function Cy(e, t, n, r) {
	return Ch(e) ? Sy(e, t, n, r) : t[n.axis] = n.parse(e, r), t;
}
function wy(e, t, n, r) {
	let i = e.iScale, a = e.vScale, o = i.getLabels(), s = i === a, c = [], l, u, d, f;
	for (l = n, u = n + r; l < u; ++l) f = t[l], d = {}, d[i.axis] = s || i.parse(o[l], l), c.push(Cy(f, d, a, l));
	return c;
}
function Ty(e) {
	return e && e.barStart !== void 0 && e.barEnd !== void 0;
}
function Ey(e, t, n) {
	return e === 0 ? (t.isHorizontal() ? 1 : -1) * (t.min >= n ? 1 : -1) : Qh(e);
}
function Dy(e) {
	let t, n, r, i, a;
	return e.horizontal ? (t = e.base > e.x, n = "left", r = "right") : (t = e.base < e.y, n = "bottom", r = "top"), t ? (i = "end", a = "start") : (i = "start", a = "end"), {
		start: n,
		end: r,
		reverse: t,
		top: i,
		bottom: a
	};
}
function Oy(e, t, n, r) {
	let i = t.borderSkipped, a = {};
	if (!i) {
		e.borderSkipped = a;
		return;
	}
	if (i === !0) {
		e.borderSkipped = {
			top: !0,
			right: !0,
			bottom: !0,
			left: !0
		};
		return;
	}
	let { start: o, end: s, reverse: c, top: l, bottom: u } = Dy(e);
	i === "middle" && n && (e.enableBorderRadius = !0, (n._top || 0) === r ? i = l : (n._bottom || 0) === r ? i = u : (a[ky(u, o, s, c)] = !0, i = l)), a[ky(i, o, s, c)] = !0, e.borderSkipped = a;
}
function ky(e, t, n, r) {
	return r ? (e = Ay(e, t, n), e = jy(e, n, t)) : e = jy(e, t, n), e;
}
function Ay(e, t, n) {
	return e === t ? n : e === n ? t : e;
}
function jy(e, t, n) {
	return e === "start" ? t : e === "end" ? n : e;
}
function My(e, { inflateAmount: t }, n) {
	e.inflateAmount = t === "auto" ? n === 1 ? .33 : 0 : t;
}
var Ny = class extends _y {
	static id = "bar";
	static defaults = {
		datasetElementType: !1,
		dataElementType: "bar",
		categoryPercentage: .8,
		barPercentage: .9,
		grouped: !0,
		animations: { numbers: {
			type: "number",
			properties: [
				"x",
				"y",
				"base",
				"width",
				"height"
			]
		} }
	};
	static overrides = { scales: {
		_index_: {
			type: "category",
			offset: !0,
			grid: { offset: !0 }
		},
		_value_: {
			type: "linear",
			beginAtZero: !0
		}
	} };
	parsePrimitiveData(e, t, n, r) {
		return wy(e, t, n, r);
	}
	parseArrayData(e, t, n, r) {
		return wy(e, t, n, r);
	}
	parseObjectData(e, t, n, r) {
		let { iScale: i, vScale: a } = e, { xAxisKey: o = "x", yAxisKey: s = "y" } = this._parsing, c = i.axis === "x" ? o : s, l = a.axis === "x" ? o : s, u = [], d, f, p, m;
		for (d = n, f = n + r; d < f; ++d) m = t[d], p = {}, p[i.axis] = i.parse(Lh(m, c), d), u.push(Cy(Lh(m, l), p, a, d));
		return u;
	}
	updateRangeFromParsed(e, t, n, r) {
		super.updateRangeFromParsed(e, t, n, r);
		let i = n._custom;
		i && t === this._cachedMeta.vScale && (e.min = Math.min(e.min, i.min), e.max = Math.max(e.max, i.max));
	}
	getMaxOverflow() {
		return 0;
	}
	getLabelAndValue(e) {
		let { iScale: t, vScale: n } = this._cachedMeta, r = this.getParsed(e), i = r._custom, a = Ty(i) ? "[" + i.start + ", " + i.end + "]" : "" + n.getLabelForValue(r[n.axis]);
		return {
			label: "" + t.getLabelForValue(r[t.axis]),
			value: a
		};
	}
	initialize() {
		this.enableOptionSharing = !0, super.initialize();
		let e = this._cachedMeta;
		e.stack = this.getDataset().stack;
	}
	update(e) {
		let t = this._cachedMeta;
		this.updateElements(t.data, 0, t.data.length, e);
	}
	updateElements(e, t, n, r) {
		let i = r === "reset", { index: a, _cachedMeta: { vScale: o } } = this, s = o.getBasePixel(), c = o.isHorizontal(), l = this._getRuler(), { sharedOptions: u, includeOptions: d } = this._getSharedOptions(t, r);
		for (let f = t; f < t + n; f++) {
			let t = this.getParsed(f), n = i || Y(t[o.axis]) ? {
				base: s,
				head: s
			} : this._calculateBarValuePixels(f), p = this._calculateBarIndexPixels(f, l), m = (t._stacks || {})[o.axis], h = {
				horizontal: c,
				base: n.base,
				enableBorderRadius: !m || Ty(t._custom) || a === m._top || a === m._bottom,
				x: c ? n.head : p.center,
				y: c ? p.center : n.head,
				height: c ? p.size : Math.abs(n.size),
				width: c ? Math.abs(n.size) : p.size
			};
			d && (h.options = u || this.resolveDataElementOptions(f, e[f].active ? "active" : r));
			let g = h.options || e[f].options;
			Oy(h, g, m, a), My(h, g, l.ratio), this.updateElement(e[f], f, h, r);
		}
	}
	_getStacks(e, t) {
		let { iScale: n } = this._cachedMeta, r = n.getMatchingVisibleMetas(this._type).filter((e) => e.controller.options.grouped), i = n.options.stacked, a = [], o = this._cachedMeta.controller.getParsed(t), s = o && o[n.axis], c = (e) => {
			let t = e._parsed.find((e) => e[n.axis] === s), r = t && t[e.vScale.axis];
			if (Y(r) || isNaN(r)) return !0;
		};
		for (let n of r) if (!(t !== void 0 && c(n)) && ((i === !1 || a.indexOf(n.stack) === -1 || i === void 0 && n.stack === void 0) && a.push(n.stack), n.index === e)) break;
		return a.length || a.push(void 0), a;
	}
	_getStackCount(e) {
		return this._getStacks(void 0, e).length;
	}
	_getAxisCount() {
		return this._getAxis().length;
	}
	getFirstScaleIdForIndexAxis() {
		let e = this.chart.scales, t = this.chart.options.indexAxis;
		return Object.keys(e).filter((n) => e[n].axis === t).shift();
	}
	_getAxis() {
		let e = {}, t = this.getFirstScaleIdForIndexAxis();
		for (let n of this.chart.data.datasets) e[Z(this.chart.options.indexAxis === "x" ? n.xAxisID : n.yAxisID, t)] = !0;
		return Object.keys(e);
	}
	_getStackIndex(e, t, n) {
		let r = this._getStacks(e, n), i = t === void 0 ? -1 : r.indexOf(t);
		return i === -1 ? r.length - 1 : i;
	}
	_getRuler() {
		let e = this.options, t = this._cachedMeta, n = t.iScale, r = [], i, a;
		for (i = 0, a = t.data.length; i < a; ++i) r.push(n.getPixelForValue(this.getParsed(i)[n.axis], i));
		let o = e.barThickness;
		return {
			min: o || yy(t),
			pixels: r,
			start: n._startPixel,
			end: n._endPixel,
			stackCount: this._getStackCount(),
			scale: n,
			grouped: e.grouped,
			ratio: o ? 1 : e.categoryPercentage * e.barPercentage
		};
	}
	_calculateBarValuePixels(e) {
		let { _cachedMeta: { vScale: t, _stacked: n, index: r }, options: { base: i, minBarLength: a } } = this, o = i || 0, s = this.getParsed(e), c = s._custom, l = Ty(c), u = s[t.axis], d = 0, f = n ? this.applyStack(t, s, n) : u, p, m;
		f !== u && (d = f - u, f = u), l && (u = c.barStart, f = c.barEnd - c.barStart, u !== 0 && Qh(u) !== Qh(c.barEnd) && (d = 0), d += u);
		let h = !Y(i) && !l ? i : d, g = t.getPixelForValue(h);
		if (p = this.chart.getDataVisibility(e) ? t.getPixelForValue(d + f) : g, m = p - g, Math.abs(m) < a) {
			m = Ey(m, t, o) * a, u === o && (g -= m / 2);
			let e = t.getPixelForDecimal(0), i = t.getPixelForDecimal(1);
			g = Math.max(Math.min(g, Math.max(e, i)), Math.min(e, i)), p = g + m, n && !l && (s._stacks[t.axis]._visualValues[r] = t.getValueForPixel(p) - t.getValueForPixel(g));
		}
		if (g === t.getPixelForValue(o)) {
			let e = Qh(m) * t.getLineWidthForValue(o) / 2;
			g += e, m -= e;
		}
		return {
			size: m,
			base: g,
			head: p,
			center: p + m / 2
		};
	}
	_calculateBarIndexPixels(e, t) {
		let n = t.scale, r = this.options, i = r.skipNull, a = Z(r.maxBarThickness, Infinity), o, s, c = this._getAxisCount();
		if (t.grouped) {
			let n = i ? this._getStackCount(e) : t.stackCount, l = r.barThickness === "flex" ? xy(e, t, r, n * c) : by(e, t, r, n * c), u = this.chart.options.indexAxis === "x" ? this.getDataset().xAxisID : this.getDataset().yAxisID, d = this._getAxis().indexOf(Z(u, this.getFirstScaleIdForIndexAxis())), f = this._getStackIndex(this.index, this._cachedMeta.stack, i ? e : void 0) + d;
			o = l.start + l.chunk * f + l.chunk / 2, s = Math.min(a, l.chunk * l.ratio);
		} else o = n.getPixelForValue(this.getParsed(e)[n.axis], e), s = Math.min(a, t.min * t.ratio);
		return {
			base: o - s / 2,
			head: o + s / 2,
			center: o,
			size: s
		};
	}
	draw() {
		let e = this._cachedMeta, t = e.vScale, n = e.data, r = n.length, i = 0;
		for (; i < r; ++i) this.getParsed(i)[t.axis] !== null && !n[i].hidden && n[i].draw(this._ctx);
	}
}, Py = class extends _y {
	static id = "line";
	static defaults = {
		datasetElementType: "line",
		dataElementType: "point",
		showLine: !0,
		spanGaps: !1
	};
	static overrides = { scales: {
		_index_: { type: "category" },
		_value_: { type: "linear" }
	} };
	initialize() {
		this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
	}
	update(e) {
		let t = this._cachedMeta, { dataset: n, data: r = [], _dataset: i } = t, a = this.chart._animationsDisabled, { start: o, count: s } = jg(t, r, a);
		this._drawStart = o, this._drawCount = s, Mg(t) && (o = 0, s = r.length), n._chart = this.chart, n._datasetIndex = this.index, n._decimated = !!i._decimated, n.points = r;
		let c = this.resolveDatasetElementOptions(e);
		this.options.showLine || (c.borderWidth = 0), c.segment = this.options.segment, this.updateElement(n, void 0, {
			animated: !a,
			options: c
		}, e), this.updateElements(r, o, s, e);
	}
	updateElements(e, t, n, r) {
		let i = r === "reset", { iScale: a, vScale: o, _stacked: s, _dataset: c } = this._cachedMeta, { sharedOptions: l, includeOptions: u } = this._getSharedOptions(t, r), d = a.axis, f = o.axis, { spanGaps: p, segment: m } = this.options, h = rg(p) ? p : Infinity, g = this.chart._animationsDisabled || i || r === "none", _ = t + n, v = e.length, y = t > 0 && this.getParsed(t - 1);
		for (let n = 0; n < v; ++n) {
			let p = e[n], v = g ? p : {};
			if (n < t || n >= _) {
				v.skip = !0;
				continue;
			}
			let b = this.getParsed(n), x = Y(b[f]), S = v[d] = a.getPixelForValue(b[d], n), C = v[f] = i || x ? o.getBasePixel() : o.getPixelForValue(s ? this.applyStack(o, b, s) : b[f], n);
			v.skip = isNaN(S) || isNaN(C) || x, v.stop = n > 0 && Math.abs(b[d] - y[d]) > h, m && (v.parsed = b, v.raw = c.data[n]), u && (v.options = l || this.resolveDataElementOptions(n, p.active ? "active" : r)), g || this.updateElement(p, n, v, r), y = b;
		}
	}
	getMaxOverflow() {
		let e = this._cachedMeta, t = e.dataset, n = t.options && t.options.borderWidth || 0, r = e.data || [];
		if (!r.length) return n;
		let i = r[0].size(this.resolveDataElementOptions(0)), a = r[r.length - 1].size(this.resolveDataElementOptions(r.length - 1));
		return Math.max(n, i, a) / 2;
	}
	draw() {
		let e = this._cachedMeta;
		e.dataset.updateControlPoints(this.chart.chartArea, e.iScale.axis), super.draw();
	}
};
function Fy() {
	throw Error("This method is not implemented: Check that a complete date adapter is provided.");
}
var Iy = { _date: class e {
	static override(t) {
		Object.assign(e.prototype, t);
	}
	options;
	constructor(e) {
		this.options = e || {};
	}
	init() {}
	formats() {
		return Fy();
	}
	parse() {
		return Fy();
	}
	format() {
		return Fy();
	}
	add() {
		return Fy();
	}
	diff() {
		return Fy();
	}
	startOf() {
		return Fy();
	}
	endOf() {
		return Fy();
	}
} };
function Ly(e, t, n, r) {
	let { controller: i, data: a, _sorted: o } = e, s = i._cachedMeta.iScale, c = e.dataset && e.dataset.options ? e.dataset.options.spanGaps : null;
	if (s && t === s.axis && t !== "r" && o && a.length) {
		let o = s._reversePixels ? yg : vg;
		if (!r) {
			let r = o(a, t, n);
			if (c) {
				let { vScale: t } = i._cachedMeta, { _parsed: n } = e, a = n.slice(0, r.lo + 1).reverse().findIndex((e) => !Y(e[t.axis]));
				r.lo -= Math.max(0, a);
				let o = n.slice(r.hi).findIndex((e) => !Y(e[t.axis]));
				r.hi += Math.max(0, o);
			}
			return r;
		}
		if (i._sharedOptions) {
			let e = a[0], r = typeof e.getRange == "function" && e.getRange(t);
			if (r) {
				let e = o(a, t, n - r), i = o(a, t, n + r);
				return {
					lo: e.lo,
					hi: i.hi
				};
			}
		}
	}
	return {
		lo: 0,
		hi: a.length - 1
	};
}
function Ry(e, t, n, r, i) {
	let a = e.getSortedVisibleDatasetMetas(), o = n[t];
	for (let e = 0, n = a.length; e < n; ++e) {
		let { index: n, data: s } = a[e], { lo: c, hi: l } = Ly(a[e], t, o, i);
		for (let e = c; e <= l; ++e) {
			let t = s[e];
			t.skip || r(t, n, e);
		}
	}
}
function zy(e) {
	let t = e.indexOf("x") !== -1, n = e.indexOf("y") !== -1;
	return function(e, r) {
		let i = t ? Math.abs(e.x - r.x) : 0, a = n ? Math.abs(e.y - r.y) : 0;
		return Math.sqrt(i ** 2 + a ** 2);
	};
}
function By(e, t, n, r, i) {
	let a = [];
	return !i && !e.isPointInArea(t) || Ry(e, n, t, function(n, o, s) {
		(i || l_(n, e.chartArea, 0)) && n.inRange(t.x, t.y, r) && a.push({
			element: n,
			datasetIndex: o,
			index: s
		});
	}, !0), a;
}
function Vy(e, t, n, r) {
	let i = [];
	function a(e, n, a) {
		let { startAngle: o, endAngle: s } = e.getProps(["startAngle", "endAngle"], r), { angle: c } = lg(e, {
			x: t.x,
			y: t.y
		});
		pg(c, o, s) && i.push({
			element: e,
			datasetIndex: n,
			index: a
		});
	}
	return Ry(e, n, t, a), i;
}
function Hy(e, t, n, r, i, a) {
	let o = [], s = zy(n), c = Infinity;
	function l(n, l, u) {
		let d = n.inRange(t.x, t.y, i);
		if (r && !d) return;
		let f = n.getCenterPoint(i);
		if (!(a || e.isPointInArea(f)) && !d) return;
		let p = s(t, f);
		p < c ? (o = [{
			element: n,
			datasetIndex: l,
			index: u
		}], c = p) : p === c && o.push({
			element: n,
			datasetIndex: l,
			index: u
		});
	}
	return Ry(e, n, t, l), o;
}
function Uy(e, t, n, r, i, a) {
	return !a && !e.isPointInArea(t) ? [] : n === "r" && !r ? Vy(e, t, n, i) : Hy(e, t, n, r, i, a);
}
function Wy(e, t, n, r, i) {
	let a = [], o = n === "x" ? "inXRange" : "inYRange", s = !1;
	return Ry(e, n, t, (e, r, c) => {
		e[o] && e[o](t[n], i) && (a.push({
			element: e,
			datasetIndex: r,
			index: c
		}), s ||= e.inRange(t.x, t.y, i));
	}), r && !s ? [] : a;
}
var Gy = {
	evaluateInteractionItems: Ry,
	modes: {
		index(e, t, n, r) {
			let i = hv(t, e), a = n.axis || "x", o = n.includeInvisible || !1, s = n.intersect ? By(e, i, a, r, o) : Uy(e, i, a, !1, r, o), c = [];
			return s.length ? (e.getSortedVisibleDatasetMetas().forEach((e) => {
				let t = s[0].index, n = e.data[t];
				n && !n.skip && c.push({
					element: n,
					datasetIndex: e.index,
					index: t
				});
			}), c) : [];
		},
		dataset(e, t, n, r) {
			let i = hv(t, e), a = n.axis || "xy", o = n.includeInvisible || !1, s = n.intersect ? By(e, i, a, r, o) : Uy(e, i, a, !1, r, o);
			if (s.length > 0) {
				let t = s[0].datasetIndex, n = e.getDatasetMeta(t).data;
				s = [];
				for (let e = 0; e < n.length; ++e) s.push({
					element: n[e],
					datasetIndex: t,
					index: e
				});
			}
			return s;
		},
		point(e, t, n, r) {
			return By(e, hv(t, e), n.axis || "xy", r, n.includeInvisible || !1);
		},
		nearest(e, t, n, r) {
			let i = hv(t, e), a = n.axis || "xy", o = n.includeInvisible || !1;
			return Uy(e, i, a, n.intersect, r, o);
		},
		x(e, t, n, r) {
			return Wy(e, hv(t, e), "x", n.intersect, r);
		},
		y(e, t, n, r) {
			return Wy(e, hv(t, e), "y", n.intersect, r);
		}
	}
}, Ky = [
	"left",
	"top",
	"right",
	"bottom"
];
function qy(e, t) {
	return e.filter((e) => e.pos === t);
}
function Jy(e, t) {
	return e.filter((e) => Ky.indexOf(e.pos) === -1 && e.box.axis === t);
}
function Yy(e, t) {
	return e.sort((e, n) => {
		let r = t ? n : e, i = t ? e : n;
		return r.weight === i.weight ? r.index - i.index : r.weight - i.weight;
	});
}
function Xy(e) {
	let t = [], n, r, i, a, o, s;
	for (n = 0, r = (e || []).length; n < r; ++n) i = e[n], {position: a, options: {stack: o, stackWeight: s = 1}} = i, t.push({
		index: n,
		box: i,
		pos: a,
		horizontal: i.isHorizontal(),
		weight: i.weight,
		stack: o && a + o,
		stackWeight: s
	});
	return t;
}
function Zy(e) {
	let t = {};
	for (let n of e) {
		let { stack: e, pos: r, stackWeight: i } = n;
		if (!e || !Ky.includes(r)) continue;
		let a = t[e] || (t[e] = {
			count: 0,
			placed: 0,
			weight: 0,
			size: 0
		});
		a.count++, a.weight += i;
	}
	return t;
}
function Qy(e, t) {
	let n = Zy(e), { vBoxMaxWidth: r, hBoxMaxHeight: i } = t, a, o, s;
	for (a = 0, o = e.length; a < o; ++a) {
		s = e[a];
		let { fullSize: o } = s.box, c = n[s.stack], l = c && s.stackWeight / c.weight;
		s.horizontal ? (s.width = l ? l * r : o && t.availableWidth, s.height = i) : (s.width = r, s.height = l ? l * i : o && t.availableHeight);
	}
	return n;
}
function $y(e) {
	let t = Xy(e), n = Yy(t.filter((e) => e.box.fullSize), !0), r = Yy(qy(t, "left"), !0), i = Yy(qy(t, "right")), a = Yy(qy(t, "top"), !0), o = Yy(qy(t, "bottom")), s = Jy(t, "x"), c = Jy(t, "y");
	return {
		fullSize: n,
		leftAndTop: r.concat(a),
		rightAndBottom: i.concat(c).concat(o).concat(s),
		chartArea: qy(t, "chartArea"),
		vertical: r.concat(i).concat(c),
		horizontal: a.concat(o).concat(s)
	};
}
function eb(e, t, n, r) {
	return Math.max(e[n], t[n]) + Math.max(e[r], t[r]);
}
function tb(e, t) {
	e.top = Math.max(e.top, t.top), e.left = Math.max(e.left, t.left), e.bottom = Math.max(e.bottom, t.bottom), e.right = Math.max(e.right, t.right);
}
function nb(e, t, n, r) {
	let { pos: i, box: a } = n, o = e.maxPadding;
	if (!X(i)) {
		n.size && (e[i] -= n.size);
		let t = r[n.stack] || {
			size: 0,
			count: 1
		};
		t.size = Math.max(t.size, n.horizontal ? a.height : a.width), n.size = t.size / t.count, e[i] += n.size;
	}
	a.getPadding && tb(o, a.getPadding());
	let s = Math.max(0, t.outerWidth - eb(o, e, "left", "right")), c = Math.max(0, t.outerHeight - eb(o, e, "top", "bottom")), l = s !== e.w, u = c !== e.h;
	return e.w = s, e.h = c, n.horizontal ? {
		same: l,
		other: u
	} : {
		same: u,
		other: l
	};
}
function rb(e) {
	let t = e.maxPadding;
	function n(n) {
		let r = Math.max(t[n] - e[n], 0);
		return e[n] += r, r;
	}
	e.y += n("top"), e.x += n("left"), n("right"), n("bottom");
}
function ib(e, t) {
	let n = t.maxPadding;
	function r(e) {
		let r = {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		};
		return e.forEach((e) => {
			r[e] = Math.max(t[e], n[e]);
		}), r;
	}
	return r(e ? ["left", "right"] : ["top", "bottom"]);
}
function ab(e, t, n, r) {
	let i = [], a, o, s, c, l, u;
	for (a = 0, o = e.length, l = 0; a < o; ++a) {
		s = e[a], c = s.box, c.update(s.width || t.w, s.height || t.h, ib(s.horizontal, t));
		let { same: o, other: d } = nb(t, n, s, r);
		l |= o && i.length, u ||= d, c.fullSize || i.push(s);
	}
	return l && ab(i, t, n, r) || u;
}
function ob(e, t, n, r, i) {
	e.top = n, e.left = t, e.right = t + r, e.bottom = n + i, e.width = r, e.height = i;
}
function sb(e, t, n, r) {
	let i = n.padding, { x: a, y: o } = t;
	for (let s of e) {
		let e = s.box, c = r[s.stack] || {
			count: 1,
			placed: 0,
			weight: 1
		}, l = s.stackWeight / c.weight || 1;
		if (s.horizontal) {
			let r = t.w * l, a = c.size || e.height;
			zh(c.start) && (o = c.start), e.fullSize ? ob(e, i.left, o, n.outerWidth - i.right - i.left, a) : ob(e, t.left + c.placed, o, r, a), c.start = o, c.placed += r, o = e.bottom;
		} else {
			let r = t.h * l, o = c.size || e.width;
			zh(c.start) && (a = c.start), e.fullSize ? ob(e, a, i.top, o, n.outerHeight - i.bottom - i.top) : ob(e, a, t.top + c.placed, o, r), c.start = a, c.placed += r, a = e.right;
		}
	}
	t.x = a, t.y = o;
}
var cb = {
	addBox(e, t) {
		e.boxes ||= [], t.fullSize = t.fullSize || !1, t.position = t.position || "top", t.weight = t.weight || 0, t._layers = t._layers || function() {
			return [{
				z: 0,
				draw(e) {
					t.draw(e);
				}
			}];
		}, e.boxes.push(t);
	},
	removeBox(e, t) {
		let n = e.boxes ? e.boxes.indexOf(t) : -1;
		n !== -1 && e.boxes.splice(n, 1);
	},
	configure(e, t, n) {
		t.fullSize = n.fullSize, t.position = n.position, t.weight = n.weight;
	},
	update(e, t, n, r) {
		if (!e) return;
		let i = E_(e.options.layout.padding), a = Math.max(t - i.width, 0), o = Math.max(n - i.height, 0), s = $y(e.boxes), c = s.vertical, l = s.horizontal;
		$(e.boxes, (e) => {
			typeof e.beforeLayout == "function" && e.beforeLayout();
		});
		let u = c.reduce((e, t) => t.box.options && t.box.options.display === !1 ? e : e + 1, 0) || 1, d = Object.freeze({
			outerWidth: t,
			outerHeight: n,
			padding: i,
			availableWidth: a,
			availableHeight: o,
			vBoxMaxWidth: a / 2 / u,
			hBoxMaxHeight: o / 2
		}), f = Object.assign({}, i);
		tb(f, E_(r));
		let p = Object.assign({
			maxPadding: f,
			w: a,
			h: o,
			x: i.left,
			y: i.top
		}, i), m = Qy(c.concat(l), d);
		ab(s.fullSize, p, d, m), ab(c, p, d, m), ab(l, p, d, m) && ab(c, p, d, m), rb(p), sb(s.leftAndTop, p, d, m), p.x += p.w, p.y += p.h, sb(s.rightAndBottom, p, d, m), e.chartArea = {
			left: p.left,
			top: p.top,
			right: p.left + p.w,
			bottom: p.top + p.h,
			height: p.h,
			width: p.w
		}, $(s.chartArea, (t) => {
			let n = t.box;
			Object.assign(n, e.chartArea), n.update(p.w, p.h, {
				left: 0,
				top: 0,
				right: 0,
				bottom: 0
			});
		});
	}
}, lb = class {
	acquireContext(e, t) {}
	releaseContext(e) {
		return !1;
	}
	addEventListener(e, t, n) {}
	removeEventListener(e, t, n) {}
	getDevicePixelRatio() {
		return 1;
	}
	getMaximumSize(e, t, n, r) {
		return t = Math.max(0, t || e.width), n ||= e.height, {
			width: t,
			height: Math.max(0, r ? Math.floor(t / r) : n)
		};
	}
	isAttached(e) {
		return !0;
	}
	updateConfig(e) {}
}, ub = class extends lb {
	acquireContext(e) {
		return e && e.getContext && e.getContext("2d") || null;
	}
	updateConfig(e) {
		e.options.animation = !1;
	}
}, db = "$chartjs", fb = {
	touchstart: "mousedown",
	touchmove: "mousemove",
	touchend: "mouseup",
	pointerenter: "mouseenter",
	pointerdown: "mousedown",
	pointermove: "mousemove",
	pointerup: "mouseup",
	pointerleave: "mouseout",
	pointerout: "mouseout"
}, pb = (e) => e === null || e === "";
function mb(e, t) {
	let n = e.style, r = e.getAttribute("height"), i = e.getAttribute("width");
	if (e[db] = { initial: {
		height: r,
		width: i,
		style: {
			display: n.display,
			height: n.height,
			width: n.width
		}
	} }, n.display = n.display || "block", n.boxSizing = n.boxSizing || "border-box", pb(i)) {
		let t = xv(e, "width");
		t !== void 0 && (e.width = t);
	}
	if (pb(r)) {
		if (e.style.height === "") e.height = e.width / (t || 2);
		else {
			let t = xv(e, "height");
			t !== void 0 && (e.height = t);
		}
	}
	return e;
}
var hb = bv ? { passive: !0 } : !1;
function gb(e, t, n) {
	e && e.addEventListener(t, n, hb);
}
function _b(e, t, n) {
	e && e.canvas && e.canvas.removeEventListener(t, n, hb);
}
function vb(e, t) {
	let n = fb[e.type] || e.type, { x: r, y: i } = hv(e, t);
	return {
		type: n,
		chart: t,
		native: e,
		x: r === void 0 ? null : r,
		y: i === void 0 ? null : i
	};
}
function yb(e, t) {
	for (let n of e) if (n === t || n.contains(t)) return !0;
}
function bb(e, t, n) {
	let r = e.canvas, i = new MutationObserver((e) => {
		let t = !1;
		for (let n of e) t ||= yb(n.addedNodes, r), t &&= !yb(n.removedNodes, r);
		t && n();
	});
	return i.observe(document, {
		childList: !0,
		subtree: !0
	}), i;
}
function xb(e, t, n) {
	let r = e.canvas, i = new MutationObserver((e) => {
		let t = !1;
		for (let n of e) t ||= yb(n.removedNodes, r), t &&= !yb(n.addedNodes, r);
		t && n();
	});
	return i.observe(document, {
		childList: !0,
		subtree: !0
	}), i;
}
var Sb = /* @__PURE__ */ new Map(), Cb = 0;
function wb() {
	let e = window.devicePixelRatio;
	e !== Cb && (Cb = e, Sb.forEach((t, n) => {
		n.currentDevicePixelRatio !== e && t();
	}));
}
function Tb(e, t) {
	Sb.size || window.addEventListener("resize", wb), Sb.set(e, t);
}
function Eb(e) {
	Sb.delete(e), Sb.size || window.removeEventListener("resize", wb);
}
function Db(e, t, n) {
	let r = e.canvas, i = r && sv(r);
	if (!i) return;
	let a = Eg((e, t) => {
		let r = i.clientWidth;
		n(e, t), r < i.clientWidth && n();
	}, window), o = new ResizeObserver((e) => {
		let t = e[0], n = t.contentRect.width, r = t.contentRect.height;
		(n !== 0 || r !== 0) && a(n, r);
	});
	return o.observe(i), Tb(e, a), o;
}
function Ob(e, t, n) {
	n && n.disconnect(), t === "resize" && Eb(e);
}
function kb(e, t, n) {
	let r = e.canvas, i = Eg((t) => {
		e.ctx !== null && n(vb(t, e));
	}, e);
	return gb(r, t, i), i;
}
var Ab = class extends lb {
	acquireContext(e, t) {
		let n = e && e.getContext && e.getContext("2d");
		return n && n.canvas === e ? (mb(e, t), n) : null;
	}
	releaseContext(e) {
		let t = e.canvas;
		if (!t[db]) return !1;
		let n = t[db].initial;
		["height", "width"].forEach((e) => {
			let r = n[e];
			Y(r) ? t.removeAttribute(e) : t.setAttribute(e, r);
		});
		let r = n.style || {};
		return Object.keys(r).forEach((e) => {
			t.style[e] = r[e];
		}), t.width = t.width, delete t[db], !0;
	}
	addEventListener(e, t, n) {
		this.removeEventListener(e, t);
		let r = e.$proxies ||= {};
		r[t] = ({
			attach: bb,
			detach: xb,
			resize: Db
		}[t] || kb)(e, t, n);
	}
	removeEventListener(e, t) {
		let n = e.$proxies ||= {}, r = n[t];
		r && (({
			attach: Ob,
			detach: Ob,
			resize: Ob
		}[t] || _b)(e, t, r), n[t] = void 0);
	}
	getDevicePixelRatio() {
		return window.devicePixelRatio;
	}
	getMaximumSize(e, t, n, r) {
		return vv(e, t, n, r);
	}
	isAttached(e) {
		let t = e && sv(e);
		return !!(t && t.isConnected);
	}
};
function jb(e) {
	return !ov() || typeof OffscreenCanvas < "u" && e instanceof OffscreenCanvas ? ub : Ab;
}
var Mb = class {
	static defaults = {};
	static defaultRoutes = void 0;
	x;
	y;
	active = !1;
	options;
	$animations;
	tooltipPosition(e) {
		let { x: t, y: n } = this.getProps(["x", "y"], e);
		return {
			x: t,
			y: n
		};
	}
	hasValue() {
		return rg(this.x) && rg(this.y);
	}
	getProps(e, t) {
		let n = this.$animations;
		if (!t || !n) return this;
		let r = {};
		return e.forEach((e) => {
			r[e] = n[e] && n[e].active() ? n[e]._to : this[e];
		}), r;
	}
};
function Nb(e, t) {
	let n = e.options.ticks, r = Pb(e), i = Math.min(n.maxTicksLimit || r, r), a = n.major.enabled ? Ib(t) : [], o = a.length, s = a[0], c = a[o - 1], l = [];
	if (o > i) return Lb(t, l, a, o / i), l;
	let u = Fb(a, t, i);
	if (o > 0) {
		let e, n, r = o > 1 ? Math.round((c - s) / (o - 1)) : null;
		for (Rb(t, l, u, Y(r) ? 0 : s - r, s), e = 0, n = o - 1; e < n; e++) Rb(t, l, u, a[e], a[e + 1]);
		return Rb(t, l, u, c, Y(r) ? t.length : c + r), l;
	}
	return Rb(t, l, u), l;
}
function Pb(e) {
	let t = e.options.offset, n = e._tickSize(), r = e._length / n + +!t, i = e._maxLength / n;
	return Math.floor(Math.min(r, i));
}
function Fb(e, t, n) {
	let r = zb(e), i = t.length / n;
	if (!r) return Math.max(i, 1);
	let a = tg(r);
	for (let e = 0, t = a.length - 1; e < t; e++) {
		let t = a[e];
		if (t > i) return t;
	}
	return Math.max(i, 1);
}
function Ib(e) {
	let t = [], n, r;
	for (n = 0, r = e.length; n < r; n++) e[n].major && t.push(n);
	return t;
}
function Lb(e, t, n, r) {
	let i = 0, a = n[0], o;
	for (r = Math.ceil(r), o = 0; o < e.length; o++) o === a && (t.push(e[o]), i++, a = n[i * r]);
}
function Rb(e, t, n, r, i) {
	let a = Z(r, 0), o = Math.min(Z(i, e.length), e.length), s = 0, c, l, u;
	for (n = Math.ceil(n), i && (c = i - r, n = c / Math.floor(c / n)), u = a; u < 0;) s++, u = Math.round(a + s * n);
	for (l = Math.max(a, 0); l < o; l++) l === u && (t.push(e[l]), s++, u = Math.round(a + s * n));
}
function zb(e) {
	let t = e.length, n, r;
	if (t < 2) return !1;
	for (r = e[0], n = 1; n < t; ++n) if (e[n] - e[n - 1] !== r) return !1;
	return r;
}
var Bb = (e) => e === "left" ? "right" : e === "right" ? "left" : e, Vb = (e, t, n) => t === "top" || t === "left" ? e[t] + n : e[t] - n, Hb = (e, t) => Math.min(t || e, e);
function Ub(e, t) {
	let n = [], r = e.length / t, i = e.length, a = 0;
	for (; a < i; a += r) n.push(e[Math.floor(a)]);
	return n;
}
function Wb(e, t, n) {
	let r = e.ticks.length, i = Math.min(t, r - 1), a = e._startPixel, o = e._endPixel, s = 1e-6, c = e.getPixelForTick(i), l;
	if (!(n && (l = r === 1 ? Math.max(c - a, o - c) : t === 0 ? (e.getPixelForTick(1) - c) / 2 : (c - e.getPixelForTick(i - 1)) / 2, c += i < t ? l : -l, c < a - s || c > o + s))) return c;
}
function Gb(e, t) {
	$(e, (e) => {
		let n = e.gc, r = n.length / 2, i;
		if (r > t) {
			for (i = 0; i < r; ++i) delete e.data[n[i]];
			n.splice(0, r);
		}
	});
}
function Kb(e) {
	return e.drawTicks ? e.tickLength : 0;
}
function qb(e, t) {
	if (!e.display) return 0;
	let n = D_(e.font, t), r = E_(e.padding);
	return (Ch(e.text) ? e.text.length : 1) * n.lineHeight + r.height;
}
function Jb(e, t) {
	return A_(e, {
		scale: t,
		type: "scale"
	});
}
function Yb(e, t, n) {
	return A_(e, {
		tick: n,
		index: t,
		type: "tick"
	});
}
function Xb(e, t, n) {
	let r = Og(e);
	return (n && t !== "right" || !n && t === "right") && (r = Bb(r)), r;
}
function Zb(e, t, n, r) {
	let { top: i, left: a, bottom: o, right: s, chart: c } = e, { chartArea: l, scales: u } = c, d = 0, f, p, m, h = o - i, g = s - a;
	if (e.isHorizontal()) {
		if (p = kg(r, a, s), X(n)) {
			let e = Object.keys(n)[0], r = n[e];
			m = u[e].getPixelForValue(r) + h - t;
		} else m = n === "center" ? (l.bottom + l.top) / 2 + h - t : Vb(e, n, t);
		f = s - a;
	} else {
		if (X(n)) {
			let e = Object.keys(n)[0], r = n[e];
			p = u[e].getPixelForValue(r) - g + t;
		} else p = n === "center" ? (l.left + l.right) / 2 - g + t : Vb(e, n, t);
		m = kg(r, o, i), d = n === "left" ? -Jh : Jh;
	}
	return {
		titleX: p,
		titleY: m,
		maxWidth: f,
		rotation: d
	};
}
var Qb = class e extends Mb {
	constructor(e) {
		super(), this.id = e.id, this.type = e.type, this.options = void 0, this.ctx = e.ctx, this.chart = e.chart, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this._margins = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		}, this.maxWidth = void 0, this.maxHeight = void 0, this.paddingTop = void 0, this.paddingBottom = void 0, this.paddingLeft = void 0, this.paddingRight = void 0, this.axis = void 0, this.labelRotation = void 0, this.min = void 0, this.max = void 0, this._range = void 0, this.ticks = [], this._gridLineItems = null, this._labelItems = null, this._labelSizes = null, this._length = 0, this._maxLength = 0, this._longestTextCache = {}, this._startPixel = void 0, this._endPixel = void 0, this._reversePixels = !1, this._userMax = void 0, this._userMin = void 0, this._suggestedMax = void 0, this._suggestedMin = void 0, this._ticksLength = 0, this._borderValue = 0, this._cache = {}, this._dataLimitsCached = !1, this.$context = void 0;
	}
	init(e) {
		this.options = e.setContext(this.getContext()), this.axis = e.axis, this._userMin = this.parse(e.min), this._userMax = this.parse(e.max), this._suggestedMin = this.parse(e.suggestedMin), this._suggestedMax = this.parse(e.suggestedMax);
	}
	parse(e, t) {
		return e;
	}
	getUserBounds() {
		let { _userMin: e, _userMax: t, _suggestedMin: n, _suggestedMax: r } = this;
		return e = Th(e, Infinity), t = Th(t, -Infinity), n = Th(n, Infinity), r = Th(r, -Infinity), {
			min: Th(e, n),
			max: Th(t, r),
			minDefined: wh(e),
			maxDefined: wh(t)
		};
	}
	getMinMax(e) {
		let { min: t, max: n, minDefined: r, maxDefined: i } = this.getUserBounds(), a;
		if (r && i) return {
			min: t,
			max: n
		};
		let o = this.getMatchingVisibleMetas();
		for (let s = 0, c = o.length; s < c; ++s) a = o[s].controller.getMinMax(this, e), r || (t = Math.min(t, a.min)), i || (n = Math.max(n, a.max));
		return t = i && t > n ? n : t, n = r && t > n ? t : n, {
			min: Th(t, Th(n, t)),
			max: Th(n, Th(t, n))
		};
	}
	getPadding() {
		return {
			left: this.paddingLeft || 0,
			top: this.paddingTop || 0,
			right: this.paddingRight || 0,
			bottom: this.paddingBottom || 0
		};
	}
	getTicks() {
		return this.ticks;
	}
	getLabels() {
		let e = this.chart.data;
		return this.options.labels || (this.isHorizontal() ? e.xLabels : e.yLabels) || e.labels || [];
	}
	getLabelItems(e = this.chart.chartArea) {
		return this._labelItems ||= this._computeLabelItems(e);
	}
	beforeLayout() {
		this._cache = {}, this._dataLimitsCached = !1;
	}
	beforeUpdate() {
		Q(this.options.beforeUpdate, [this]);
	}
	update(e, t, n) {
		let { beginAtZero: r, grace: i, ticks: a } = this.options, o = a.sampleSize;
		this.beforeUpdate(), this.maxWidth = e, this.maxHeight = t, this._margins = n = Object.assign({
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		}, n), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + n.left + n.right : this.height + n.top + n.bottom, this._dataLimitsCached ||= (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = k_(this, i, r), !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
		let s = o < this.ticks.length;
		this._convertTicksToLabels(s ? Ub(this.ticks, o) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), a.display && (a.autoSkip || a.source === "auto") && (this.ticks = Nb(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), s && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
	}
	configure() {
		let e = this.options.reverse, t, n;
		this.isHorizontal() ? (t = this.left, n = this.right) : (t = this.top, n = this.bottom, e = !e), this._startPixel = t, this._endPixel = n, this._reversePixels = e, this._length = n - t, this._alignToPixels = this.options.alignToPixels;
	}
	afterUpdate() {
		Q(this.options.afterUpdate, [this]);
	}
	beforeSetDimensions() {
		Q(this.options.beforeSetDimensions, [this]);
	}
	setDimensions() {
		this.isHorizontal() ? (this.width = this.maxWidth, this.left = 0, this.right = this.width) : (this.height = this.maxHeight, this.top = 0, this.bottom = this.height), this.paddingLeft = 0, this.paddingTop = 0, this.paddingRight = 0, this.paddingBottom = 0;
	}
	afterSetDimensions() {
		Q(this.options.afterSetDimensions, [this]);
	}
	_callHooks(e) {
		this.chart.notifyPlugins(e, this.getContext()), Q(this.options[e], [this]);
	}
	beforeDataLimits() {
		this._callHooks("beforeDataLimits");
	}
	determineDataLimits() {}
	afterDataLimits() {
		this._callHooks("afterDataLimits");
	}
	beforeBuildTicks() {
		this._callHooks("beforeBuildTicks");
	}
	buildTicks() {
		return [];
	}
	afterBuildTicks() {
		this._callHooks("afterBuildTicks");
	}
	beforeTickToLabelConversion() {
		Q(this.options.beforeTickToLabelConversion, [this]);
	}
	generateTickLabels(e) {
		let t = this.options.ticks, n, r, i;
		for (n = 0, r = e.length; n < r; n++) i = e[n], i.label = Q(t.callback, [
			i.value,
			n,
			e
		], this);
	}
	afterTickToLabelConversion() {
		Q(this.options.afterTickToLabelConversion, [this]);
	}
	beforeCalculateLabelRotation() {
		Q(this.options.beforeCalculateLabelRotation, [this]);
	}
	calculateLabelRotation() {
		let e = this.options, t = e.ticks, n = Hb(this.ticks.length, e.ticks.maxTicksLimit), r = t.minRotation || 0, i = t.maxRotation, a = r, o, s, c;
		if (!this._isVisible() || !t.display || r >= i || n <= 1 || !this.isHorizontal()) {
			this.labelRotation = r;
			return;
		}
		let l = this._getLabelSizes(), u = l.widest.width, d = l.highest.height, f = mg(this.chart.width - u, 0, this.maxWidth);
		o = e.offset ? this.maxWidth / n : f / (n - 1), u + 6 > o && (o = f / (n - (e.offset ? .5 : 1)), s = this.maxHeight - Kb(e.grid) - t.padding - qb(e.title, this.chart.options.font), c = Math.sqrt(u * u + d * d), a = sg(Math.min(Math.asin(mg((l.highest.height + 6) / o, -1, 1)), Math.asin(mg(s / c, -1, 1)) - Math.asin(mg(d / c, -1, 1)))), a = Math.max(r, Math.min(i, a))), this.labelRotation = a;
	}
	afterCalculateLabelRotation() {
		Q(this.options.afterCalculateLabelRotation, [this]);
	}
	afterAutoSkip() {}
	beforeFit() {
		Q(this.options.beforeFit, [this]);
	}
	fit() {
		let e = {
			width: 0,
			height: 0
		}, { chart: t, options: { ticks: n, title: r, grid: i } } = this, a = this._isVisible(), o = this.isHorizontal();
		if (a) {
			let a = qb(r, t.options.font);
			if (o ? (e.width = this.maxWidth, e.height = Kb(i) + a) : (e.height = this.maxHeight, e.width = Kb(i) + a), n.display && this.ticks.length) {
				let { first: t, last: r, widest: i, highest: a } = this._getLabelSizes(), s = n.padding * 2, c = og(this.labelRotation), l = Math.cos(c), u = Math.sin(c);
				if (o) {
					let t = n.mirror ? 0 : u * i.width + l * a.height;
					e.height = Math.min(this.maxHeight, e.height + t + s);
				} else {
					let t = n.mirror ? 0 : l * i.width + u * a.height;
					e.width = Math.min(this.maxWidth, e.width + t + s);
				}
				this._calculatePadding(t, r, u, l);
			}
		}
		this._handleMargins(), o ? (this.width = this._length = t.width - this._margins.left - this._margins.right, this.height = e.height) : (this.width = e.width, this.height = this._length = t.height - this._margins.top - this._margins.bottom);
	}
	_calculatePadding(e, t, n, r) {
		let { ticks: { align: i, padding: a }, position: o } = this.options, s = this.labelRotation !== 0, c = o !== "top" && this.axis === "x";
		if (this.isHorizontal()) {
			let o = this.getPixelForTick(0) - this.left, l = this.right - this.getPixelForTick(this.ticks.length - 1), u = 0, d = 0;
			s ? c ? (u = r * e.width, d = n * t.height) : (u = n * e.height, d = r * t.width) : i === "start" ? d = t.width : i === "end" ? u = e.width : i !== "inner" && (u = e.width / 2, d = t.width / 2), this.paddingLeft = Math.max((u - o + a) * this.width / (this.width - o), 0), this.paddingRight = Math.max((d - l + a) * this.width / (this.width - l), 0);
		} else {
			let n = t.height / 2, r = e.height / 2;
			i === "start" ? (n = 0, r = e.height) : i === "end" && (n = t.height, r = 0), this.paddingTop = n + a, this.paddingBottom = r + a;
		}
	}
	_handleMargins() {
		this._margins && (this._margins.left = Math.max(this.paddingLeft, this._margins.left), this._margins.top = Math.max(this.paddingTop, this._margins.top), this._margins.right = Math.max(this.paddingRight, this._margins.right), this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom));
	}
	afterFit() {
		Q(this.options.afterFit, [this]);
	}
	isHorizontal() {
		let { axis: e, position: t } = this.options;
		return t === "top" || t === "bottom" || e === "x";
	}
	isFullSize() {
		return this.options.fullSize;
	}
	_convertTicksToLabels(e) {
		this.beforeTickToLabelConversion(), this.generateTickLabels(e);
		let t, n;
		for (t = 0, n = e.length; t < n; t++) Y(e[t].label) && (e.splice(t, 1), n--, t--);
		this.afterTickToLabelConversion();
	}
	_getLabelSizes() {
		let e = this._labelSizes;
		if (!e) {
			let t = this.options.ticks.sampleSize, n = this.ticks;
			t < n.length && (n = Ub(n, t)), this._labelSizes = e = this._computeLabelSizes(n, n.length, this.options.ticks.maxTicksLimit);
		}
		return e;
	}
	_computeLabelSizes(e, t, n) {
		let { ctx: r, _longestTextCache: i } = this, a = [], o = [], s = Math.floor(t / Hb(t, n)), c = 0, l = 0, u, d, f, p, m, h, g, _, v, y, b;
		for (u = 0; u < t; u += s) {
			if (p = e[u].label, m = this._resolveTickFontOptions(u), r.font = h = m.string, g = i[h] = i[h] || {
				data: {},
				gc: []
			}, _ = m.lineHeight, v = y = 0, !Y(p) && !Ch(p)) v = r_(r, g.data, g.gc, v, p), y = _;
			else if (Ch(p)) for (d = 0, f = p.length; d < f; ++d) b = p[d], !Y(b) && !Ch(b) && (v = r_(r, g.data, g.gc, v, b), y += _);
			a.push(v), o.push(y), c = Math.max(v, c), l = Math.max(y, l);
		}
		Gb(i, t);
		let x = a.indexOf(c), S = o.indexOf(l), C = (e) => ({
			width: a[e] || 0,
			height: o[e] || 0
		});
		return {
			first: C(0),
			last: C(t - 1),
			widest: C(x),
			highest: C(S),
			widths: a,
			heights: o
		};
	}
	getLabelForValue(e) {
		return e;
	}
	getPixelForValue(e, t) {
		return NaN;
	}
	getValueForPixel(e) {}
	getPixelForTick(e) {
		let t = this.ticks;
		return e < 0 || e > t.length - 1 ? null : this.getPixelForValue(t[e].value);
	}
	getPixelForDecimal(e) {
		this._reversePixels && (e = 1 - e);
		let t = this._startPixel + e * this._length;
		return hg(this._alignToPixels ? a_(this.chart, t, 0) : t);
	}
	getDecimalForPixel(e) {
		let t = (e - this._startPixel) / this._length;
		return this._reversePixels ? 1 - t : t;
	}
	getBasePixel() {
		return this.getPixelForValue(this.getBaseValue());
	}
	getBaseValue() {
		let { min: e, max: t } = this;
		return e < 0 && t < 0 ? t : e > 0 && t > 0 ? e : 0;
	}
	getContext(e) {
		let t = this.ticks || [];
		if (e >= 0 && e < t.length) {
			let n = t[e];
			return n.$context ||= Yb(this.getContext(), e, n);
		}
		return this.$context ||= Jb(this.chart.getContext(), this);
	}
	_tickSize() {
		let e = this.options.ticks, t = og(this.labelRotation), n = Math.abs(Math.cos(t)), r = Math.abs(Math.sin(t)), i = this._getLabelSizes(), a = e.autoSkipPadding || 0, o = i ? i.widest.width + a : 0, s = i ? i.highest.height + a : 0;
		return this.isHorizontal() ? s * n > o * r ? o / n : s / r : s * r < o * n ? s / n : o / r;
	}
	_isVisible() {
		let e = this.options.display;
		return e === "auto" ? this.getMatchingVisibleMetas().length > 0 : !!e;
	}
	_computeGridLineItems(e) {
		let t = this.axis, n = this.chart, r = this.options, { grid: i, position: a, border: o } = r, s = i.offset, c = this.isHorizontal(), l = this.ticks.length + +!!s, u = Kb(i), d = [], f = o.setContext(this.getContext()), p = f.display ? f.width : 0, m = p / 2, h = function(e) {
			return a_(n, e, p);
		}, g, _, v, y, b, x, S, C, w, T, E, D;
		if (a === "top") g = h(this.bottom), x = this.bottom - u, C = g - m, T = h(e.top) + m, D = e.bottom;
		else if (a === "bottom") g = h(this.top), T = e.top, D = h(e.bottom) - m, x = g + m, C = this.top + u;
		else if (a === "left") g = h(this.right), b = this.right - u, S = g - m, w = h(e.left) + m, E = e.right;
		else if (a === "right") g = h(this.left), w = e.left, E = h(e.right) - m, b = g + m, S = this.left + u;
		else if (t === "x") {
			if (a === "center") g = h((e.top + e.bottom) / 2 + .5);
			else if (X(a)) {
				let e = Object.keys(a)[0], t = a[e];
				g = h(this.chart.scales[e].getPixelForValue(t));
			}
			T = e.top, D = e.bottom, x = g + m, C = x + u;
		} else if (t === "y") {
			if (a === "center") g = h((e.left + e.right) / 2);
			else if (X(a)) {
				let e = Object.keys(a)[0], t = a[e];
				g = h(this.chart.scales[e].getPixelForValue(t));
			}
			b = g - m, S = b - u, w = e.left, E = e.right;
		}
		let ee = Z(r.ticks.maxTicksLimit, l), te = Math.max(1, Math.ceil(l / ee));
		for (_ = 0; _ < l; _ += te) {
			let e = this.getContext(_), t = i.setContext(e), r = o.setContext(e), a = t.lineWidth, l = t.color, u = r.dash || [], f = r.dashOffset, p = t.tickWidth, m = t.tickColor, h = t.tickBorderDash || [], g = t.tickBorderDashOffset;
			v = Wb(this, _, s), v !== void 0 && (y = a_(n, v, a), c ? b = S = w = E = y : x = C = T = D = y, d.push({
				tx1: b,
				ty1: x,
				tx2: S,
				ty2: C,
				x1: w,
				y1: T,
				x2: E,
				y2: D,
				width: a,
				color: l,
				borderDash: u,
				borderDashOffset: f,
				tickWidth: p,
				tickColor: m,
				tickBorderDash: h,
				tickBorderDashOffset: g
			}));
		}
		return this._ticksLength = l, this._borderValue = g, d;
	}
	_computeLabelItems(e) {
		let t = this.axis, n = this.options, { position: r, ticks: i } = n, a = this.isHorizontal(), o = this.ticks, { align: s, crossAlign: c, padding: l, mirror: u } = i, d = Kb(n.grid), f = d + l, p = u ? -l : f, m = -og(this.labelRotation), h = [], g, _, v, y, b, x, S, C, w, T, E, D, ee = "middle";
		if (r === "top") x = this.bottom - p, S = this._getXAxisLabelAlignment();
		else if (r === "bottom") x = this.top + p, S = this._getXAxisLabelAlignment();
		else if (r === "left") {
			let e = this._getYAxisLabelAlignment(d);
			S = e.textAlign, b = e.x;
		} else if (r === "right") {
			let e = this._getYAxisLabelAlignment(d);
			S = e.textAlign, b = e.x;
		} else if (t === "x") {
			if (r === "center") x = (e.top + e.bottom) / 2 + f;
			else if (X(r)) {
				let e = Object.keys(r)[0], t = r[e];
				x = this.chart.scales[e].getPixelForValue(t) + f;
			}
			S = this._getXAxisLabelAlignment();
		} else if (t === "y") {
			if (r === "center") b = (e.left + e.right) / 2 - f;
			else if (X(r)) {
				let e = Object.keys(r)[0], t = r[e];
				b = this.chart.scales[e].getPixelForValue(t);
			}
			S = this._getYAxisLabelAlignment(d).textAlign;
		}
		t === "y" && (s === "start" ? ee = "top" : s === "end" && (ee = "bottom"));
		let te = this._getLabelSizes();
		for (g = 0, _ = o.length; g < _; ++g) {
			v = o[g], y = v.label;
			let e = i.setContext(this.getContext(g));
			C = this.getPixelForTick(g) + i.labelOffset, w = this._resolveTickFontOptions(g), T = w.lineHeight, E = Ch(y) ? y.length : 1;
			let t = E / 2, n = e.color, s = e.textStrokeColor, l = e.textStrokeWidth, d = S;
			a ? (b = C, S === "inner" && (d = g === _ - 1 ? this.options.reverse ? "left" : "right" : g === 0 ? this.options.reverse ? "right" : "left" : "center"), D = r === "top" ? c === "near" || m !== 0 ? -E * T + T / 2 : c === "center" ? -te.highest.height / 2 - t * T + T : -te.highest.height + T / 2 : c === "near" || m !== 0 ? T / 2 : c === "center" ? te.highest.height / 2 - t * T : te.highest.height - E * T, u && (D *= -1), m !== 0 && !e.showLabelBackdrop && (b += T / 2 * Math.sin(m))) : (x = C, D = (1 - E) * T / 2);
			let f;
			if (e.showLabelBackdrop) {
				let t = E_(e.backdropPadding), n = te.heights[g], r = te.widths[g], i = D - t.top, a = 0 - t.left;
				switch (ee) {
					case "middle":
						i -= n / 2;
						break;
					case "bottom": i -= n;
				}
				switch (S) {
					case "center":
						a -= r / 2;
						break;
					case "right":
						a -= r;
						break;
					case "inner": g === _ - 1 ? a -= r : g > 0 && (a -= r / 2);
				}
				f = {
					left: a,
					top: i,
					width: r + t.width,
					height: n + t.height,
					color: e.backdropColor
				};
			}
			h.push({
				label: y,
				font: w,
				textOffset: D,
				options: {
					rotation: m,
					color: n,
					strokeColor: s,
					strokeWidth: l,
					textAlign: d,
					textBaseline: ee,
					translation: [b, x],
					backdrop: f
				}
			});
		}
		return h;
	}
	_getXAxisLabelAlignment() {
		let { position: e, ticks: t } = this.options;
		if (-og(this.labelRotation)) return e === "top" ? "left" : "right";
		let n = "center";
		return t.align === "start" ? n = "left" : t.align === "end" ? n = "right" : t.align === "inner" && (n = "inner"), n;
	}
	_getYAxisLabelAlignment(e) {
		let { position: t, ticks: { crossAlign: n, mirror: r, padding: i } } = this.options, a = this._getLabelSizes(), o = e + i, s = a.widest.width, c, l;
		return t === "left" ? r ? (l = this.right + i, n === "near" ? c = "left" : n === "center" ? (c = "center", l += s / 2) : (c = "right", l += s)) : (l = this.right - o, n === "near" ? c = "right" : n === "center" ? (c = "center", l -= s / 2) : (c = "left", l = this.left)) : t === "right" ? r ? (l = this.left + i, n === "near" ? c = "right" : n === "center" ? (c = "center", l -= s / 2) : (c = "left", l -= s)) : (l = this.left + o, n === "near" ? c = "left" : n === "center" ? (c = "center", l += s / 2) : (c = "right", l = this.right)) : c = "right", {
			textAlign: c,
			x: l
		};
	}
	_computeLabelArea() {
		if (this.options.ticks.mirror) return;
		let e = this.chart, t = this.options.position;
		if (t === "left" || t === "right") return {
			top: 0,
			left: this.left,
			bottom: e.height,
			right: this.right
		};
		if (t === "top" || t === "bottom") return {
			top: this.top,
			left: 0,
			bottom: this.bottom,
			right: e.width
		};
	}
	drawBackground() {
		let { ctx: e, options: { backgroundColor: t }, left: n, top: r, width: i, height: a } = this;
		t && (e.save(), e.fillStyle = t, e.fillRect(n, r, i, a), e.restore());
	}
	getLineWidthForValue(e) {
		let t = this.options.grid;
		if (!this._isVisible() || !t.display) return 0;
		let n = this.ticks.findIndex((t) => t.value === e);
		return n >= 0 ? t.setContext(this.getContext(n)).lineWidth : 0;
	}
	drawGrid(e) {
		let t = this.options.grid, n = this.ctx, r = this._gridLineItems ||= this._computeGridLineItems(e), i, a, o = (e, t, r) => {
			r.width && r.color && (n.save(), n.lineWidth = r.width, n.strokeStyle = r.color, n.setLineDash(r.borderDash || []), n.lineDashOffset = r.borderDashOffset, n.beginPath(), n.moveTo(e.x, e.y), n.lineTo(t.x, t.y), n.stroke(), n.restore());
		};
		if (t.display) for (i = 0, a = r.length; i < a; ++i) {
			let e = r[i];
			t.drawOnChartArea && o({
				x: e.x1,
				y: e.y1
			}, {
				x: e.x2,
				y: e.y2
			}, e), t.drawTicks && o({
				x: e.tx1,
				y: e.ty1
			}, {
				x: e.tx2,
				y: e.ty2
			}, {
				color: e.tickColor,
				width: e.tickWidth,
				borderDash: e.tickBorderDash,
				borderDashOffset: e.tickBorderDashOffset
			});
		}
	}
	drawBorder() {
		let { chart: e, ctx: t, options: { border: n, grid: r } } = this, i = n.setContext(this.getContext()), a = n.display ? i.width : 0;
		if (!a) return;
		let o = r.setContext(this.getContext(0)).lineWidth, s = this._borderValue, c, l, u, d;
		this.isHorizontal() ? (c = a_(e, this.left, a) - a / 2, l = a_(e, this.right, o) + o / 2, u = d = s) : (u = a_(e, this.top, a) - a / 2, d = a_(e, this.bottom, o) + o / 2, c = l = s), t.save(), t.lineWidth = i.width, t.strokeStyle = i.color, t.beginPath(), t.moveTo(c, u), t.lineTo(l, d), t.stroke(), t.restore();
	}
	drawLabels(e) {
		if (!this.options.ticks.display) return;
		let t = this.ctx, n = this._computeLabelArea();
		n && u_(t, n);
		let r = this.getLabelItems(e);
		for (let e of r) {
			let n = e.options, r = e.font, i = e.label, a = e.textOffset;
			__(t, i, 0, a, r, n);
		}
		n && d_(t);
	}
	drawTitle() {
		let { ctx: e, options: { position: t, title: n, reverse: r } } = this;
		if (!n.display) return;
		let i = D_(n.font), a = E_(n.padding), o = n.align, s = i.lineHeight / 2;
		t === "bottom" || t === "center" || X(t) ? (s += a.bottom, Ch(n.text) && (s += i.lineHeight * (n.text.length - 1))) : s += a.top;
		let { titleX: c, titleY: l, maxWidth: u, rotation: d } = Zb(this, s, t, o);
		__(e, n.text, 0, 0, i, {
			color: n.color,
			maxWidth: u,
			rotation: d,
			textAlign: Xb(o, t, r),
			textBaseline: "middle",
			translation: [c, l],
			strokeColor: n.strokeColor,
			strokeWidth: n.strokeWidth
		});
	}
	draw(e) {
		this._isVisible() && (this.drawBackground(), this.drawGrid(e), this.drawBorder(), this.drawTitle(), this.drawLabels(e));
	}
	_layers() {
		let t = this.options, n = t.ticks && t.ticks.z || 0, r = Z(t.grid && t.grid.z, -1), i = Z(t.border && t.border.z, 0);
		return !this._isVisible() || this.draw !== e.prototype.draw ? [{
			z: n,
			draw: (e) => {
				this.draw(e);
			}
		}] : [
			{
				z: r,
				draw: (e) => {
					this.drawBackground(), this.drawGrid(e), this.drawTitle();
				}
			},
			{
				z: i,
				draw: () => {
					this.drawBorder();
				}
			},
			{
				z: n,
				draw: (e) => {
					this.drawLabels(e);
				}
			}
		];
	}
	getMatchingVisibleMetas(e) {
		let t = this.chart.getSortedVisibleDatasetMetas(), n = this.axis + "AxisID", r = [], i, a;
		for (i = 0, a = t.length; i < a; ++i) {
			let a = t[i];
			a[n] !== this.id || e && a.type !== e || r.push(a);
		}
		return r;
	}
	_resolveTickFontOptions(e) {
		return D_(this.options.ticks.setContext(this.getContext(e)).font);
	}
	_maxDigits() {
		let e = this._resolveTickFontOptions(0).lineHeight;
		return (this.isHorizontal() ? this.width : this.height) / e;
	}
}, $b = class {
	constructor(e, t, n) {
		this.type = e, this.scope = t, this.override = n, this.items = Object.create(null);
	}
	isForType(e) {
		return Object.prototype.isPrototypeOf.call(this.type.prototype, e.prototype);
	}
	register(e) {
		let t = Object.getPrototypeOf(e), n;
		nx(t) && (n = this.register(t));
		let r = this.items, i = e.id, a = this.scope + "." + i;
		if (!i) throw Error("class does not have id: " + e);
		return i in r || (r[i] = e, ex(e, a, n), this.override && t_.override(e.id, e.overrides)), a;
	}
	get(e) {
		return this.items[e];
	}
	unregister(e) {
		let t = this.items, n = e.id, r = this.scope;
		n in t && delete t[n], r && n in t_[r] && (delete t_[r][n], this.override && delete Zg[n]);
	}
};
function ex(e, t, n) {
	let r = jh(Object.create(null), [
		n ? t_.get(n) : {},
		t_.get(t),
		e.defaults
	]);
	t_.set(t, r), e.defaultRoutes && tx(t, e.defaultRoutes), e.descriptors && t_.describe(t, e.descriptors);
}
function tx(e, t) {
	Object.keys(t).forEach((n) => {
		let r = n.split("."), i = r.pop(), a = [e].concat(r).join("."), o = t[n].split("."), s = o.pop(), c = o.join(".");
		t_.route(a, i, c, s);
	});
}
function nx(e) {
	return "id" in e && "defaults" in e;
}
var rx = /* #__PURE__ */ new class {
	constructor() {
		this.controllers = new $b(_y, "datasets", !0), this.elements = new $b(Mb, "elements"), this.plugins = new $b(Object, "plugins"), this.scales = new $b(Qb, "scales"), this._typedRegistries = [
			this.controllers,
			this.scales,
			this.elements
		];
	}
	add(...e) {
		this._each("register", e);
	}
	remove(...e) {
		this._each("unregister", e);
	}
	addControllers(...e) {
		this._each("register", e, this.controllers);
	}
	addElements(...e) {
		this._each("register", e, this.elements);
	}
	addPlugins(...e) {
		this._each("register", e, this.plugins);
	}
	addScales(...e) {
		this._each("register", e, this.scales);
	}
	getController(e) {
		return this._get(e, this.controllers, "controller");
	}
	getElement(e) {
		return this._get(e, this.elements, "element");
	}
	getPlugin(e) {
		return this._get(e, this.plugins, "plugin");
	}
	getScale(e) {
		return this._get(e, this.scales, "scale");
	}
	removeControllers(...e) {
		this._each("unregister", e, this.controllers);
	}
	removeElements(...e) {
		this._each("unregister", e, this.elements);
	}
	removePlugins(...e) {
		this._each("unregister", e, this.plugins);
	}
	removeScales(...e) {
		this._each("unregister", e, this.scales);
	}
	_each(e, t, n) {
		[...t].forEach((t) => {
			let r = n || this._getRegistryForType(t);
			n || r.isForType(t) || r === this.plugins && t.id ? this._exec(e, r, t) : $(t, (t) => {
				let r = n || this._getRegistryForType(t);
				this._exec(e, r, t);
			});
		});
	}
	_exec(e, t, n) {
		let r = Rh(e);
		Q(n["before" + r], [], n), t[e](n), Q(n["after" + r], [], n);
	}
	_getRegistryForType(e) {
		for (let t = 0; t < this._typedRegistries.length; t++) {
			let n = this._typedRegistries[t];
			if (n.isForType(e)) return n;
		}
		return this.plugins;
	}
	_get(e, t, n) {
		let r = t.get(e);
		if (r === void 0) throw Error("\"" + e + "\" is not a registered " + n + ".");
		return r;
	}
}(), ix = class {
	constructor() {
		this._init = void 0;
	}
	notify(e, t, n, r) {
		if (t === "beforeInit" && (this._init = this._createDescriptors(e, !0), this._notify(this._init, e, "install")), this._init === void 0) return;
		let i = r ? this._descriptors(e).filter(r) : this._descriptors(e), a = this._notify(i, e, t, n);
		return t === "afterDestroy" && (this._notify(i, e, "stop"), this._notify(this._init, e, "uninstall"), this._init = void 0), a;
	}
	_notify(e, t, n, r) {
		r ||= {};
		for (let i of e) {
			let e = i.plugin, a = e[n];
			if (Q(a, [
				t,
				r,
				i.options
			], e) === !1 && r.cancelable) return !1;
		}
		return !0;
	}
	invalidate() {
		Y(this._cache) || (this._oldCache = this._cache, this._cache = void 0);
	}
	_descriptors(e) {
		if (this._cache) return this._cache;
		let t = this._cache = this._createDescriptors(e);
		return this._notifyStateChanges(e), t;
	}
	_createDescriptors(e, t) {
		let n = e && e.config, r = Z(n.options && n.options.plugins, {}), i = ax(n);
		return r === !1 && !t ? [] : sx(e, i, r, t);
	}
	_notifyStateChanges(e) {
		let t = this._oldCache || [], n = this._cache, r = (e, t) => e.filter((e) => !t.some((t) => e.plugin.id === t.plugin.id));
		this._notify(r(t, n), e, "stop"), this._notify(r(n, t), e, "start");
	}
};
function ax(e) {
	let t = {}, n = [], r = Object.keys(rx.plugins.items);
	for (let e = 0; e < r.length; e++) n.push(rx.getPlugin(r[e]));
	let i = e.plugins || [];
	for (let e = 0; e < i.length; e++) {
		let r = i[e];
		n.indexOf(r) === -1 && (n.push(r), t[r.id] = !0);
	}
	return {
		plugins: n,
		localIds: t
	};
}
function ox(e, t) {
	return !t && e === !1 ? null : e === !0 ? {} : e;
}
function sx(e, { plugins: t, localIds: n }, r, i) {
	let a = [], o = e.getContext();
	for (let s of t) {
		let t = s.id, c = ox(r[t], i);
		c !== null && a.push({
			plugin: s,
			options: cx(e.config, {
				plugin: s,
				local: n[t]
			}, c, o)
		});
	}
	return a;
}
function cx(e, { plugin: t, local: n }, r, i) {
	let a = e.pluginScopeKeys(t), o = e.getOptionScopes(r, a);
	return n && t.defaults && o.push(t.defaults), e.createResolver(o, i, [""], {
		scriptable: !1,
		indexable: !1,
		allKeys: !0
	});
}
function lx(e, t) {
	let n = t_.datasets[e] || {};
	return ((t.datasets || {})[e] || {}).indexAxis || t.indexAxis || n.indexAxis || "x";
}
function ux(e, t) {
	let n = e;
	return e === "_index_" ? n = t : e === "_value_" && (n = t === "x" ? "y" : "x"), n;
}
function dx(e, t) {
	return e === t ? "_index_" : "_value_";
}
function fx(e) {
	if (e === "x" || e === "y" || e === "r") return e;
}
function px(e) {
	if (e === "top" || e === "bottom") return "x";
	if (e === "left" || e === "right") return "y";
}
function mx(e, ...t) {
	if (fx(e)) return e;
	for (let n of t) {
		let t = n.axis || px(n.position) || e.length > 1 && fx(e[0].toLowerCase());
		if (t) return t;
	}
	throw Error(`Cannot determine type of '${e}' axis. Please provide 'axis' or 'position' option.`);
}
function hx(e, t, n) {
	if (n[t + "AxisID"] === e) return { axis: t };
}
function gx(e, t) {
	if (t.data && t.data.datasets) {
		let n = t.data.datasets.filter((t) => t.xAxisID === e || t.yAxisID === e);
		if (n.length) return hx(e, "x", n[0]) || hx(e, "y", n[0]);
	}
	return {};
}
function _x(e, t) {
	let n = Zg[e.type] || { scales: {} }, r = t.scales || {}, i = lx(e.type, t), a = Object.create(null);
	return Object.keys(r).forEach((t) => {
		let o = r[t];
		if (!X(o)) return console.error(`Invalid scale configuration for scale: ${t}`);
		if (o._proxy) return console.warn(`Ignoring resolver passed as options for scale: ${t}`);
		let s = mx(t, o, gx(t, e), t_.scales[o.type]), c = dx(s, i), l = n.scales || {};
		a[t] = Mh(Object.create(null), [
			{ axis: s },
			o,
			l[s],
			l[c]
		]);
	}), e.data.datasets.forEach((n) => {
		let i = n.type || e.type, o = n.indexAxis || lx(i, t), s = (Zg[i] || {}).scales || {};
		Object.keys(s).forEach((e) => {
			let t = ux(e, o), i = n[t + "AxisID"] || t;
			a[i] = a[i] || Object.create(null), Mh(a[i], [
				{ axis: t },
				r[i],
				s[e]
			]);
		});
	}), Object.keys(a).forEach((e) => {
		let t = a[e];
		Mh(t, [t_.scales[t.type], t_.scale]);
	}), a;
}
function vx(e) {
	let t = e.options ||= {};
	t.plugins = Z(t.plugins, {}), t.scales = _x(e, t);
}
function yx(e) {
	return e ||= {}, e.datasets = e.datasets || [], e.labels = e.labels || [], e;
}
function bx(e) {
	return e ||= {}, e.data = yx(e.data), vx(e), e;
}
var xx = /* @__PURE__ */ new Map(), Sx = /* @__PURE__ */ new Set();
function Cx(e, t) {
	let n = xx.get(e);
	return n || (n = t(), xx.set(e, n), Sx.add(n)), n;
}
var wx = (e, t, n) => {
	let r = Lh(t, n);
	r !== void 0 && e.add(r);
}, Tx = class {
	constructor(e) {
		this._config = bx(e), this._scopeCache = /* @__PURE__ */ new Map(), this._resolverCache = /* @__PURE__ */ new Map();
	}
	get platform() {
		return this._config.platform;
	}
	get type() {
		return this._config.type;
	}
	set type(e) {
		this._config.type = e;
	}
	get data() {
		return this._config.data;
	}
	set data(e) {
		this._config.data = yx(e);
	}
	get options() {
		return this._config.options;
	}
	set options(e) {
		this._config.options = e;
	}
	get plugins() {
		return this._config.plugins;
	}
	update() {
		let e = this._config;
		this.clearCache(), vx(e);
	}
	clearCache() {
		this._scopeCache.clear(), this._resolverCache.clear();
	}
	datasetScopeKeys(e) {
		return Cx(e, () => [[`datasets.${e}`, ""]]);
	}
	datasetAnimationScopeKeys(e, t) {
		return Cx(`${e}.transition.${t}`, () => [[`datasets.${e}.transitions.${t}`, `transitions.${t}`], [`datasets.${e}`, ""]]);
	}
	datasetElementScopeKeys(e, t) {
		return Cx(`${e}-${t}`, () => [[
			`datasets.${e}.elements.${t}`,
			`datasets.${e}`,
			`elements.${t}`,
			""
		]]);
	}
	pluginScopeKeys(e) {
		let t = e.id, n = this.type;
		return Cx(`${n}-plugin-${t}`, () => [[`plugins.${t}`, ...e.additionalOptionScopes || []]]);
	}
	_cachedScopes(e, t) {
		let n = this._scopeCache, r = n.get(e);
		return (!r || t) && (r = /* @__PURE__ */ new Map(), n.set(e, r)), r;
	}
	getOptionScopes(e, t, n) {
		let { options: r, type: i } = this, a = this._cachedScopes(e, n), o = a.get(t);
		if (o) return o;
		let s = /* @__PURE__ */ new Set();
		t.forEach((t) => {
			e && (s.add(e), t.forEach((t) => wx(s, e, t))), t.forEach((e) => wx(s, r, e)), t.forEach((e) => wx(s, Zg[i] || {}, e)), t.forEach((e) => wx(s, t_, e)), t.forEach((e) => wx(s, Qg, e));
		});
		let c = Array.from(s);
		return c.length === 0 && c.push(Object.create(null)), Sx.has(t) && a.set(t, c), c;
	}
	chartOptionScopes() {
		let { options: e, type: t } = this;
		return [
			e,
			Zg[t] || {},
			t_.datasets[t] || {},
			{ type: t },
			t_,
			Qg
		];
	}
	resolveNamedOptions(e, t, n, r = [""]) {
		let i = { $shared: !0 }, { resolver: a, subPrefixes: o } = Ex(this._resolverCache, e, r), s = a;
		if (Ox(a, t)) {
			i.$shared = !1, n = Bh(n) ? n() : n;
			let t = this.createResolver(e, n, o);
			s = M_(a, n, t);
		}
		for (let e of t) i[e] = s[e];
		return i;
	}
	createResolver(e, t, n = [""], r) {
		let { resolver: i } = Ex(this._resolverCache, e, n);
		return X(t) ? M_(i, t, void 0, r) : i;
	}
};
function Ex(e, t, n) {
	let r = e.get(t);
	r || (r = /* @__PURE__ */ new Map(), e.set(t, r));
	let i = n.join(), a = r.get(i);
	return a || (a = {
		resolver: j_(t, n),
		subPrefixes: n.filter((e) => !e.toLowerCase().includes("hover"))
	}, r.set(i, a)), a;
}
var Dx = (e) => X(e) && Object.getOwnPropertyNames(e).some((t) => Bh(e[t]));
function Ox(e, t) {
	let { isScriptable: n, isIndexable: r } = N_(e);
	for (let i of t) {
		let t = n(i), a = r(i), o = (a || t) && e[i];
		if (t && (Bh(o) || Dx(o)) || a && Ch(o)) return !0;
	}
	return !1;
}
var kx = "4.6.1", Ax = [
	"top",
	"bottom",
	"left",
	"right",
	"chartArea"
];
function jx(e, t) {
	return e === "top" || e === "bottom" || Ax.indexOf(e) === -1 && t === "x";
}
function Mx(e, t) {
	return function(n, r) {
		return n[e] === r[e] ? n[t] - r[t] : n[e] - r[e];
	};
}
function Nx(e) {
	let t = e.chart, n = t.options.animation;
	t.notifyPlugins("afterRender"), Q(n && n.onComplete, [e], t);
}
function Px(e) {
	let t = e.chart, n = t.options.animation;
	Q(n && n.onProgress, [e], t);
}
function Fx(e) {
	return ov() && typeof e == "string" ? e = document.getElementById(e) : e && e.length && (e = e[0]), e && e.canvas && (e = e.canvas), e;
}
var Ix = {}, Lx = (e) => {
	let t = Fx(e);
	return Object.values(Ix).filter((e) => e.canvas === t).pop();
};
function Rx(e, t, n) {
	let r = Object.keys(e);
	for (let i of r) {
		let r = +i;
		if (r >= t) {
			let a = e[i];
			delete e[i], (n > 0 || r > t) && (e[r + n] = a);
		}
	}
}
function zx(e, t, n, r) {
	return !n || e.type === "mouseout" ? null : r ? t : e;
}
var Bx = class {
	static defaults = t_;
	static instances = Ix;
	static overrides = Zg;
	static registry = rx;
	static version = kx;
	static getChart = Lx;
	static register(...e) {
		rx.add(...e), Vx();
	}
	static unregister(...e) {
		rx.remove(...e), Vx();
	}
	constructor(e, t) {
		let n = this.config = new Tx(t), r = Fx(e), i = Lx(r);
		if (i) throw Error("Canvas is already in use. Chart with ID '" + i.id + "' must be destroyed before the canvas with ID '" + i.canvas.id + "' can be reused.");
		let a = n.createResolver(n.chartOptionScopes(), this.getContext());
		this.platform = new (n.platform || (jb(r)))(), this.platform.updateConfig(n);
		let o = this.platform.acquireContext(r, a.aspectRatio), s = o && o.canvas, c = s && s.height, l = s && s.width;
		this.id = Sh(), this.ctx = o, this.canvas = s, this.width = l, this.height = c, this._options = a, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new ix(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = Dg((e) => this.update(e), a.resizeDelay || 0), this._dataChanges = [], Ix[this.id] = this, !o || !s ? console.error("Failed to create chart: can't acquire context from the given item") : (Gv.listen(this, "complete", Nx), Gv.listen(this, "progress", Px), this._initialize(), this.attached && this.update());
	}
	get aspectRatio() {
		let { options: { aspectRatio: e, maintainAspectRatio: t }, width: n, height: r, _aspectRatio: i } = this;
		return Y(e) ? t && i ? i : r ? n / r : null : e;
	}
	get data() {
		return this.config.data;
	}
	set data(e) {
		this.config.data = e;
	}
	get options() {
		return this._options;
	}
	set options(e) {
		this.config.options = e;
	}
	get registry() {
		return rx;
	}
	_initialize() {
		return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : yv(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this;
	}
	clear() {
		return o_(this.canvas, this.ctx), this;
	}
	stop() {
		return Gv.stop(this), this;
	}
	resize(e, t) {
		Gv.running(this) ? this._resizeBeforeDraw = {
			width: e,
			height: t
		} : this._resize(e, t);
	}
	_resize(e, t) {
		let n = this.options, r = this.canvas, i = n.maintainAspectRatio && this.aspectRatio, a = this.platform.getMaximumSize(r, e, t, i), o = n.devicePixelRatio || this.platform.getDevicePixelRatio(), s = this.width ? "resize" : "attach";
		this.width = a.width, this.height = a.height, this._aspectRatio = this.aspectRatio, yv(this, o, !0) && (this.notifyPlugins("resize", { size: a }), Q(n.onResize, [this, a], this), this.attached && this._doResize(s) && this.render());
	}
	ensureScalesHaveIDs() {
		$(this.options.scales || {}, (e, t) => {
			e.id = t;
		});
	}
	buildOrUpdateScales() {
		let e = this.options, t = e.scales, n = this.scales, r = Object.keys(n).reduce((e, t) => (e[t] = !1, e), {}), i = [];
		t && (i = i.concat(Object.keys(t).map((e) => {
			let n = t[e], r = mx(e, n), i = r === "r", a = r === "x";
			return {
				options: n,
				dposition: i ? "chartArea" : a ? "bottom" : "left",
				dtype: i ? "radialLinear" : a ? "category" : "linear"
			};
		}))), $(i, (t) => {
			let i = t.options, a = i.id, o = mx(a, i), s = Z(i.type, t.dtype);
			(i.position === void 0 || jx(i.position, o) !== jx(t.dposition)) && (i.position = t.dposition), r[a] = !0;
			let c = null;
			a in n && n[a].type === s ? c = n[a] : (c = new (rx.getScale(s))({
				id: a,
				type: s,
				ctx: this.ctx,
				chart: this
			}), n[c.id] = c), c.init(i, e);
		}), $(r, (e, t) => {
			e || delete n[t];
		}), $(n, (e) => {
			cb.configure(this, e, e.options), cb.addBox(this, e);
		});
	}
	_updateMetasets() {
		let e = this._metasets, t = this.data.datasets.length, n = e.length;
		if (e.sort((e, t) => e.index - t.index), n > t) {
			for (let e = t; e < n; ++e) this._destroyDatasetMeta(e);
			e.splice(t, n - t);
		}
		this._sortedMetasets = e.slice(0).sort(Mx("order", "index"));
	}
	_removeUnreferencedMetasets() {
		let { _metasets: e, data: { datasets: t } } = this;
		e.length > t.length && delete this._stacks, e.forEach((e, n) => {
			t.filter((t) => t === e._dataset).length === 0 && this._destroyDatasetMeta(n);
		});
	}
	buildOrUpdateControllers() {
		let e = [], t = this.data.datasets, n, r;
		for (this._removeUnreferencedMetasets(), n = 0, r = t.length; n < r; n++) {
			let r = t[n], i = this.getDatasetMeta(n), a = r.type || this.config.type;
			if (i.type && i.type !== a && (this._destroyDatasetMeta(n), i = this.getDatasetMeta(n)), i.type = a, i.indexAxis = r.indexAxis || lx(a, this.options), i.order = r.order || 0, i.index = n, i.label = "" + r.label, i.visible = this.isDatasetVisible(n), i.controller) i.controller.updateIndex(n), i.controller.linkScales();
			else {
				let t = rx.getController(a), { datasetElementType: r, dataElementType: o } = t_.datasets[a];
				Object.assign(t, {
					dataElementType: rx.getElement(o),
					datasetElementType: r && rx.getElement(r)
				}), i.controller = new t(this, n), e.push(i.controller);
			}
		}
		return this._updateMetasets(), e;
	}
	_resetElements() {
		$(this.data.datasets, (e, t) => {
			this.getDatasetMeta(t).controller.reset();
		}, this);
	}
	reset() {
		this._resetElements(), this.notifyPlugins("reset");
	}
	update(e) {
		let t = this.config;
		t.update();
		let n = this._options = t.createResolver(t.chartOptionScopes(), this.getContext()), r = this._animationsDisabled = !n.animation;
		if (this._updateScales(), this._checkEventBindings(), this._updateHiddenIndices(), this._plugins.invalidate(), this.notifyPlugins("beforeUpdate", {
			mode: e,
			cancelable: !0
		}) === !1) return;
		let i = this.buildOrUpdateControllers();
		this.notifyPlugins("beforeElementsUpdate");
		let a = 0;
		for (let e = 0, t = this.data.datasets.length; e < t; e++) {
			let { controller: t } = this.getDatasetMeta(e), n = !r && i.indexOf(t) === -1;
			t.buildOrUpdateElements(n), a = Math.max(+t.getMaxOverflow(), a);
		}
		a = this._minPadding = n.layout.autoPadding ? a : 0, this._updateLayout(a), r || $(i, (e) => {
			e.reset();
		}), this._updateDatasets(e), this.notifyPlugins("afterUpdate", { mode: e }), this._layers.sort(Mx("z", "_idx"));
		let { _active: o, _lastEvent: s } = this;
		s ? this._eventHandler(s, !0) : o.length && this._updateHoverStyles(o, o, !0), this.render();
	}
	_updateScales() {
		$(this.scales, (e) => {
			cb.removeBox(this, e);
		}), this.ensureScalesHaveIDs(), this.buildOrUpdateScales();
	}
	_checkEventBindings() {
		let e = this.options;
		Vh(new Set(Object.keys(this._listeners)), new Set(e.events)) && !!this._responsiveListeners === e.responsive || (this.unbindEvents(), this.bindEvents());
	}
	_updateHiddenIndices() {
		let { _hiddenIndices: e } = this, t = this._getUniformDataChanges() || [];
		for (let { method: n, start: r, count: i } of t) Rx(e, r, n === "_removeElements" ? -i : i);
	}
	_getUniformDataChanges() {
		let e = this._dataChanges;
		if (!e || !e.length) return;
		this._dataChanges = [];
		let t = this.data.datasets.length, n = (t) => new Set(e.filter((e) => e[0] === t).map((e, t) => t + "," + e.splice(1).join(","))), r = n(0);
		for (let e = 1; e < t; e++) if (!Vh(r, n(e))) return;
		return Array.from(r).map((e) => e.split(",")).map((e) => ({
			method: e[1],
			start: +e[2],
			count: +e[3]
		}));
	}
	_updateLayout(e) {
		if (this.notifyPlugins("beforeLayout", { cancelable: !0 }) === !1) return;
		cb.update(this, this.width, this.height, e);
		let t = this.chartArea, n = t.width <= 0 || t.height <= 0;
		this._layers = [], $(this.boxes, (e) => {
			n && e.position === "chartArea" || (e.configure && e.configure(), this._layers.push(...e._layers()));
		}, this), this._layers.forEach((e, t) => {
			e._idx = t;
		}), this.notifyPlugins("afterLayout");
	}
	_updateDatasets(e) {
		if (this.notifyPlugins("beforeDatasetsUpdate", {
			mode: e,
			cancelable: !0
		}) !== !1) {
			for (let e = 0, t = this.data.datasets.length; e < t; ++e) this.getDatasetMeta(e).controller.configure();
			for (let t = 0, n = this.data.datasets.length; t < n; ++t) this._updateDataset(t, Bh(e) ? e({ datasetIndex: t }) : e);
			this.notifyPlugins("afterDatasetsUpdate", { mode: e });
		}
	}
	_updateDataset(e, t) {
		let n = this.getDatasetMeta(e), r = {
			meta: n,
			index: e,
			mode: t,
			cancelable: !0
		};
		this.notifyPlugins("beforeDatasetUpdate", r) !== !1 && (n.controller._update(t), r.cancelable = !1, this.notifyPlugins("afterDatasetUpdate", r));
	}
	render() {
		this.notifyPlugins("beforeRender", { cancelable: !0 }) !== !1 && (Gv.has(this) ? this.attached && !Gv.running(this) && Gv.start(this) : (this.draw(), Nx({ chart: this })));
	}
	draw() {
		let e;
		if (this._resizeBeforeDraw) {
			let { width: e, height: t } = this._resizeBeforeDraw;
			this._resizeBeforeDraw = null, this._resize(e, t);
		}
		if (this.clear(), this.width <= 0 || this.height <= 0 || this.notifyPlugins("beforeDraw", { cancelable: !0 }) === !1) return;
		let t = this._layers;
		for (e = 0; e < t.length && t[e].z <= 0; ++e) t[e].draw(this.chartArea);
		for (this._drawDatasets(); e < t.length; ++e) t[e].draw(this.chartArea);
		this.notifyPlugins("afterDraw");
	}
	_getSortedDatasetMetas(e) {
		let t = this._sortedMetasets, n = [], r, i;
		for (r = 0, i = t.length; r < i; ++r) {
			let i = t[r];
			(!e || i.visible) && n.push(i);
		}
		return n;
	}
	getSortedVisibleDatasetMetas() {
		return this._getSortedDatasetMetas(!0);
	}
	_drawDatasets() {
		if (this.notifyPlugins("beforeDatasetsDraw", { cancelable: !0 }) === !1) return;
		let e = this.getSortedVisibleDatasetMetas();
		for (let t = e.length - 1; t >= 0; --t) this._drawDataset(e[t]);
		this.notifyPlugins("afterDatasetsDraw");
	}
	_drawDataset(e) {
		let t = this.ctx, n = {
			meta: e,
			index: e.index,
			cancelable: !0
		}, r = Wv(this, e);
		this.notifyPlugins("beforeDatasetDraw", n) !== !1 && (r && u_(t, r), e.controller.draw(), r && d_(t), n.cancelable = !1, this.notifyPlugins("afterDatasetDraw", n));
	}
	isPointInArea(e) {
		return l_(e, this.chartArea, this._minPadding);
	}
	getElementsAtEventForMode(e, t, n, r) {
		let i = Gy.modes[t];
		return typeof i == "function" ? i(this, e, n, r) : [];
	}
	getDatasetMeta(e) {
		let t = this.data.datasets[e], n = this._metasets, r = n.filter((e) => e && e._dataset === t).pop();
		return r || (r = {
			type: null,
			data: [],
			dataset: null,
			controller: null,
			hidden: null,
			xAxisID: null,
			yAxisID: null,
			order: t && t.order || 0,
			index: e,
			_dataset: t,
			_parsed: [],
			_sorted: !1
		}, n.push(r)), r;
	}
	getContext() {
		return this.$context ||= A_(null, {
			chart: this,
			type: "chart"
		});
	}
	getVisibleDatasetCount() {
		return this.getSortedVisibleDatasetMetas().length;
	}
	isDatasetVisible(e) {
		let t = this.data.datasets[e];
		if (!t) return !1;
		let n = this.getDatasetMeta(e);
		return typeof n.hidden == "boolean" ? !n.hidden : !t.hidden;
	}
	setDatasetVisibility(e, t) {
		let n = this.getDatasetMeta(e);
		n.hidden = !t;
	}
	toggleDataVisibility(e) {
		this._hiddenIndices[e] = !this._hiddenIndices[e];
	}
	getDataVisibility(e) {
		return !this._hiddenIndices[e];
	}
	_updateVisibility(e, t, n) {
		let r = n ? "show" : "hide", i = this.getDatasetMeta(e), a = i.controller._resolveAnimations(void 0, r);
		zh(t) ? (i.data[t].hidden = !n, this.update()) : (this.setDatasetVisibility(e, n), a.update(i, { visible: n }), this.update((t) => t.datasetIndex === e ? r : void 0));
	}
	hide(e, t) {
		this._updateVisibility(e, t, !1);
	}
	show(e, t) {
		this._updateVisibility(e, t, !0);
	}
	_destroyDatasetMeta(e) {
		let t = this._metasets[e];
		t && t.controller && t.controller._destroy(), delete this._metasets[e];
	}
	_stop() {
		let e, t;
		for (this.stop(), Gv.remove(this), e = 0, t = this.data.datasets.length; e < t; ++e) this._destroyDatasetMeta(e);
	}
	destroy() {
		this.notifyPlugins("beforeDestroy");
		let { canvas: e, ctx: t } = this;
		this._stop(), this.config.clearCache(), e && (this.unbindEvents(), o_(e, t), this.platform.releaseContext(t), this.canvas = null, this.ctx = null), delete Ix[this.id], this.notifyPlugins("afterDestroy");
	}
	toBase64Image(...e) {
		return this.canvas.toDataURL(...e);
	}
	bindEvents() {
		this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : this.attached = !0;
	}
	bindUserEvents() {
		let e = this._listeners, t = this.platform, n = (n, r) => {
			t.addEventListener(this, n, r), e[n] = r;
		}, r = (e, t, n) => {
			e.offsetX = t, e.offsetY = n, this._eventHandler(e);
		};
		$(this.options.events, (e) => n(e, r));
	}
	bindResponsiveEvents() {
		this._responsiveListeners ||= {};
		let e = this._responsiveListeners, t = this.platform, n = (n, r) => {
			t.addEventListener(this, n, r), e[n] = r;
		}, r = (n, r) => {
			e[n] && (t.removeEventListener(this, n, r), delete e[n]);
		}, i = (e, t) => {
			this.canvas && this.resize(e, t);
		}, a, o = () => {
			r("attach", o), this.attached = !0, this.resize(), n("resize", i), n("detach", a);
		};
		a = () => {
			this.attached = !1, r("resize", i), this._stop(), this._resize(0, 0), n("attach", o);
		}, t.isAttached(this.canvas) ? o() : a();
	}
	unbindEvents() {
		$(this._listeners, (e, t) => {
			this.platform.removeEventListener(this, t, e);
		}), this._listeners = {}, $(this._responsiveListeners, (e, t) => {
			this.platform.removeEventListener(this, t, e);
		}), this._responsiveListeners = void 0;
	}
	updateHoverStyle(e, t, n) {
		let r = n ? "set" : "remove", i, a, o, s;
		for (t === "dataset" && (i = this.getDatasetMeta(e[0].datasetIndex), i.controller["_" + r + "DatasetHoverStyle"]()), o = 0, s = e.length; o < s; ++o) {
			a = e[o];
			let t = a && this.getDatasetMeta(a.datasetIndex).controller;
			t && t[r + "HoverStyle"](a.element, a.datasetIndex, a.index);
		}
	}
	getActiveElements() {
		return this._active || [];
	}
	setActiveElements(e) {
		let t = this._active || [], n = e.map(({ datasetIndex: e, index: t }) => {
			let n = this.getDatasetMeta(e);
			if (!n) throw Error("No dataset found at index " + e);
			return {
				datasetIndex: e,
				element: n.data[t],
				index: t
			};
		});
		Dh(n, t) || (this._active = n, this._lastEvent = null, this._updateHoverStyles(n, t));
	}
	notifyPlugins(e, t, n) {
		return this._plugins.notify(this, e, t, n);
	}
	isPluginEnabled(e) {
		return this._plugins._cache.filter((t) => t.plugin.id === e).length === 1;
	}
	_updateHoverStyles(e, t, n) {
		let r = this.options.hover, i = (e, t) => e.filter((e) => !t.some((t) => e.datasetIndex === t.datasetIndex && e.index === t.index)), a = i(t, e), o = n ? e : i(e, t);
		a.length && this.updateHoverStyle(a, r.mode, !1), o.length && r.mode && this.updateHoverStyle(o, r.mode, !0);
	}
	_eventHandler(e, t) {
		let n = {
			event: e,
			replay: t,
			cancelable: !0,
			inChartArea: this.isPointInArea(e)
		}, r = (t) => (t.options.events || this.options.events).includes(e.native.type);
		if (this.notifyPlugins("beforeEvent", n, r) === !1) return;
		let i = this._handleEvent(e, t, n.inChartArea);
		return n.cancelable = !1, this.notifyPlugins("afterEvent", n, r), (i || n.changed) && this.render(), this;
	}
	_handleEvent(e, t, n) {
		let { _active: r = [], options: i } = this, a = t, o = this._getActiveElements(e, r, n, a), s = Hh(e), c = zx(e, this._lastEvent, n, s);
		n && (this._lastEvent = null, Q(i.onHover, [
			e,
			o,
			this
		], this), s && Q(i.onClick, [
			e,
			o,
			this
		], this));
		let l = !Dh(o, r);
		return (l || t) && (this._active = o, this._updateHoverStyles(o, r, t)), this._lastEvent = c, l;
	}
	_getActiveElements(e, t, n, r) {
		if (e.type === "mouseout") return [];
		if (!n) return t;
		let i = this.options.hover;
		return this.getElementsAtEventForMode(e, i.mode, i, r);
	}
};
function Vx() {
	return $(Bx.instances, (e) => e._plugins.invalidate());
}
function Hx(e, t, n = t) {
	e.lineCap = Z(n.borderCapStyle, t.borderCapStyle), e.setLineDash(Z(n.borderDash, t.borderDash)), e.lineDashOffset = Z(n.borderDashOffset, t.borderDashOffset), e.lineJoin = Z(n.borderJoinStyle, t.borderJoinStyle), e.lineWidth = Z(n.borderWidth, t.borderWidth), e.strokeStyle = Z(n.borderColor, t.borderColor);
}
function Ux(e, t, n) {
	e.lineTo(n.x, n.y);
}
function Wx(e) {
	return e.stepped ? f_ : e.tension || e.cubicInterpolationMode === "monotone" ? p_ : Ux;
}
function Gx(e, t, n = {}) {
	let r = e.length, { start: i = 0, end: a = r - 1 } = n, { start: o, end: s } = t, c = Math.max(i, o), l = Math.min(a, s), u = i < o && a < o || i > s && a > s;
	return {
		count: r,
		start: c,
		loop: t.loop,
		ilen: l < c && !u ? r + l - c : l - c
	};
}
function Kx(e, t, n, r) {
	let { points: i, options: a } = t, { count: o, start: s, loop: c, ilen: l } = Gx(i, n, r), u = Wx(a), { move: d = !0, reverse: f } = r || {}, p, m, h;
	for (p = 0; p <= l; ++p) m = i[(s + (f ? l - p : p)) % o], m.skip || (d ? (e.moveTo(m.x, m.y), d = !1) : u(e, h, m, f, a.stepped), h = m);
	return c && (m = i[(s + (f ? l : 0)) % o], u(e, h, m, f, a.stepped)), !!c;
}
function qx(e, t, n, r) {
	let i = t.points, { count: a, start: o, ilen: s } = Gx(i, n, r), { move: c = !0, reverse: l } = r || {}, u = 0, d = 0, f, p, m, h, g, _, v = (e) => (o + (l ? s - e : e)) % a, y = () => {
		h !== g && (e.lineTo(u, g), e.lineTo(u, h), e.lineTo(u, _));
	};
	for (c && (p = i[v(0)], e.moveTo(p.x, p.y)), f = 0; f <= s; ++f) {
		if (p = i[v(f)], p.skip) continue;
		let t = p.x, n = p.y, r = t | 0;
		r === m ? (n < h ? h = n : n > g && (g = n), u = (d * u + t) / ++d) : (y(), e.lineTo(t, n), m = r, d = 0, h = g = n), _ = n;
	}
	y();
}
function Jx(e) {
	let t = e.options, n = t.borderDash && t.borderDash.length;
	return !e._decimated && !e._loop && !t.tension && t.cubicInterpolationMode !== "monotone" && !t.stepped && !n ? qx : Kx;
}
function Yx(e) {
	return e.stepped ? Cv : e.tension || e.cubicInterpolationMode === "monotone" ? wv : Sv;
}
function Xx(e, t, n, r) {
	let i = t._path;
	i || (i = t._path = new Path2D(), t.path(i, n, r) && i.closePath()), Hx(e, t.options), e.stroke(i);
}
function Zx(e, t, n, r) {
	let { segments: i, options: a } = t, o = Jx(t);
	for (let s of i) Hx(e, a, s.style), e.beginPath(), o(e, t, s, {
		start: n,
		end: n + r - 1
	}) && e.closePath(), e.stroke();
}
var Qx = typeof Path2D == "function";
function $x(e, t, n, r) {
	Qx && !t.options.segment ? Xx(e, t, n, r) : Zx(e, t, n, r);
}
var eS = class extends Mb {
	static id = "line";
	static defaults = {
		borderCapStyle: "butt",
		borderDash: [],
		borderDashOffset: 0,
		borderJoinStyle: "miter",
		borderWidth: 3,
		capBezierPoints: !0,
		cubicInterpolationMode: "default",
		fill: !1,
		spanGaps: !1,
		stepped: !1,
		tension: 0
	};
	static defaultRoutes = {
		backgroundColor: "backgroundColor",
		borderColor: "borderColor"
	};
	static descriptors = {
		_scriptable: !0,
		_indexable: (e) => e !== "borderDash" && e !== "fill"
	};
	constructor(e) {
		super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, e && Object.assign(this, e);
	}
	updateControlPoints(e, t) {
		let n = this.options;
		if ((n.tension || n.cubicInterpolationMode === "monotone") && !n.stepped && !this._pointsUpdated) {
			let r = n.spanGaps ? this._loop : this._fullLoop;
			av(this._points, n, e, r, t), this._pointsUpdated = !0;
		}
	}
	set points(e) {
		this._points = e, delete this._segments, delete this._path, this._pointsUpdated = !1;
	}
	get points() {
		return this._points;
	}
	get segments() {
		return this._segments ||= Lv(this, this.options.segment);
	}
	first() {
		let e = this.segments, t = this.points;
		return e.length && t[e[0].start];
	}
	last() {
		let e = this.segments, t = this.points, n = e.length;
		return n && t[e[n - 1].end];
	}
	interpolate(e, t) {
		let n = this.options, r = e[t], i = this.points, a = Pv(this, {
			property: t,
			start: r,
			end: r
		});
		if (!a.length) return;
		let o = [], s = Yx(n), c, l;
		for (c = 0, l = a.length; c < l; ++c) {
			let { start: l, end: u } = a[c], d = i[l], f = i[u];
			if (d === f) {
				o.push(d);
				continue;
			}
			let p = s(d, f, Math.abs((r - d[t]) / (f[t] - d[t])), n.stepped);
			p[t] = e[t], o.push(p);
		}
		return o.length === 1 ? o[0] : o;
	}
	pathSegment(e, t, n) {
		return Jx(this)(e, this, t, n);
	}
	path(e, t, n) {
		let r = this.segments, i = Jx(this), a = this._loop;
		t ||= 0, n ||= this.points.length - t;
		for (let o of r) a &= i(e, this, o, {
			start: t,
			end: t + n - 1
		});
		return !!a;
	}
	draw(e, t, n, r) {
		let i = this.options || {};
		(this.points || []).length && i.borderWidth && (e.save(), $x(e, this, n, r), e.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
	}
};
function tS(e, t, n, r) {
	let i = e.options, { [n]: a } = e.getProps([n], r);
	return Math.abs(t - a) < i.radius + i.hitRadius;
}
var nS = class extends Mb {
	static id = "point";
	parsed;
	skip;
	stop;
	static defaults = {
		borderWidth: 1,
		hitRadius: 1,
		hoverBorderWidth: 1,
		hoverRadius: 4,
		pointStyle: "circle",
		radius: 3,
		rotation: 0
	};
	static defaultRoutes = {
		backgroundColor: "backgroundColor",
		borderColor: "borderColor"
	};
	constructor(e) {
		super(), this.options = void 0, this.parsed = void 0, this.skip = void 0, this.stop = void 0, e && Object.assign(this, e);
	}
	inRange(e, t, n) {
		let r = this.options, { x: i, y: a } = this.getProps(["x", "y"], n);
		return (e - i) ** 2 + (t - a) ** 2 < (r.hitRadius + r.radius) ** 2;
	}
	inXRange(e, t) {
		return tS(this, e, "x", t);
	}
	inYRange(e, t) {
		return tS(this, e, "y", t);
	}
	getCenterPoint(e) {
		let { x: t, y: n } = this.getProps(["x", "y"], e);
		return {
			x: t,
			y: n
		};
	}
	size(e) {
		e = e || this.options || {};
		let t = e.radius || 0;
		t = Math.max(t, t && e.hoverRadius || 0);
		let n = t && e.borderWidth || 0;
		return (t + n) * 2;
	}
	draw(e, t) {
		let n = this.options;
		this.skip || n.radius < .1 || !l_(this, t, this.size(n) / 2) || (e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.fillStyle = n.backgroundColor, s_(e, n, this.x, this.y));
	}
	getRange() {
		let e = this.options || {};
		return e.radius + e.hitRadius;
	}
};
function rS(e, t) {
	let { x: n, y: r, base: i, width: a, height: o } = e.getProps([
		"x",
		"y",
		"base",
		"width",
		"height"
	], t), s, c, l, u, d;
	return e.horizontal ? (d = o / 2, s = Math.min(n, i), c = Math.max(n, i), l = r - d, u = r + d) : (d = a / 2, s = n - d, c = n + d, l = Math.min(r, i), u = Math.max(r, i)), {
		left: s,
		top: l,
		right: c,
		bottom: u
	};
}
function iS(e, t, n, r) {
	return e ? 0 : mg(t, n, r);
}
function aS(e, t, n) {
	let r = e.options.borderWidth, i = e.borderSkipped, a = w_(r);
	return {
		t: iS(i.top, a.top, 0, n),
		r: iS(i.right, a.right, 0, t),
		b: iS(i.bottom, a.bottom, 0, n),
		l: iS(i.left, a.left, 0, t)
	};
}
function oS(e, t, n) {
	let { enableBorderRadius: r } = e.getProps(["enableBorderRadius"]), i = e.options.borderRadius, a = T_(i), o = Math.min(t, n), s = e.borderSkipped, c = r || X(i);
	return {
		topLeft: iS(!c || s.top || s.left, a.topLeft, 0, o),
		topRight: iS(!c || s.top || s.right, a.topRight, 0, o),
		bottomLeft: iS(!c || s.bottom || s.left, a.bottomLeft, 0, o),
		bottomRight: iS(!c || s.bottom || s.right, a.bottomRight, 0, o)
	};
}
function sS(e) {
	let t = rS(e), n = t.right - t.left, r = t.bottom - t.top, i = aS(e, n / 2, r / 2), a = oS(e, n / 2, r / 2);
	return {
		outer: {
			x: t.left,
			y: t.top,
			w: n,
			h: r,
			radius: a
		},
		inner: {
			x: t.left + i.l,
			y: t.top + i.t,
			w: n - i.l - i.r,
			h: r - i.t - i.b,
			radius: {
				topLeft: Math.max(0, a.topLeft - Math.max(i.t, i.l)),
				topRight: Math.max(0, a.topRight - Math.max(i.t, i.r)),
				bottomLeft: Math.max(0, a.bottomLeft - Math.max(i.b, i.l)),
				bottomRight: Math.max(0, a.bottomRight - Math.max(i.b, i.r))
			}
		}
	};
}
function cS(e, t, n, r) {
	let i = t === null, a = n === null, o = e && !(i && a) && rS(e, r);
	return o && (i || gg(t, o.left, o.right)) && (a || gg(n, o.top, o.bottom));
}
function lS(e) {
	return e.topLeft || e.topRight || e.bottomLeft || e.bottomRight;
}
function uS(e, t) {
	e.rect(t.x, t.y, t.w, t.h);
}
function dS(e, t, n = {}) {
	let r = e.x === n.x ? 0 : -t, i = e.y === n.y ? 0 : -t, a = (e.x + e.w === n.x + n.w ? 0 : t) - r, o = (e.y + e.h === n.y + n.h ? 0 : t) - i;
	return {
		x: e.x + r,
		y: e.y + i,
		w: e.w + a,
		h: e.h + o,
		radius: e.radius
	};
}
var fS = class extends Mb {
	static id = "bar";
	static defaults = {
		borderSkipped: "start",
		borderWidth: 0,
		borderRadius: 0,
		inflateAmount: "auto",
		pointStyle: void 0
	};
	static defaultRoutes = {
		backgroundColor: "backgroundColor",
		borderColor: "borderColor"
	};
	constructor(e) {
		super(), this.options = void 0, this.horizontal = void 0, this.base = void 0, this.width = void 0, this.height = void 0, this.inflateAmount = void 0, e && Object.assign(this, e);
	}
	draw(e) {
		let { inflateAmount: t, options: { borderColor: n, backgroundColor: r } } = this, { inner: i, outer: a } = sS(this), o = lS(a.radius) ? v_ : uS;
		e.save(), (a.w !== i.w || a.h !== i.h) && (e.beginPath(), o(e, dS(a, t, i)), e.clip(), o(e, dS(i, -t, a)), e.fillStyle = n, e.fill("evenodd")), e.beginPath(), o(e, dS(i, t)), e.fillStyle = r, e.fill(), e.restore();
	}
	inRange(e, t, n) {
		return cS(this, e, t, n);
	}
	inXRange(e, t) {
		return cS(this, e, null, t);
	}
	inYRange(e, t) {
		return cS(this, null, e, t);
	}
	getCenterPoint(e) {
		let { x: t, y: n, base: r, horizontal: i } = this.getProps([
			"x",
			"y",
			"base",
			"horizontal"
		], e);
		return {
			x: i ? (t + r) / 2 : t,
			y: i ? n : (n + r) / 2
		};
	}
	getRange(e) {
		return e === "x" ? this.width / 2 : this.height / 2;
	}
}, pS = (e, t) => {
	let { boxHeight: n = t, boxWidth: r = t } = e;
	return e.usePointStyle && (n = Math.min(n, t), r = e.pointStyleWidth || Math.min(r, t)), {
		boxWidth: r,
		boxHeight: n,
		itemHeight: Math.max(t, n)
	};
}, mS = (e, t) => e !== null && t !== null && e.datasetIndex === t.datasetIndex && e.index === t.index, hS = class extends Mb {
	constructor(e) {
		super(), this._added = !1, this.legendHitBoxes = [], this._hoveredItem = null, this.doughnutMode = !1, this.chart = e.chart, this.options = e.options, this.ctx = e.ctx, this.legendItems = void 0, this.columnSizes = void 0, this.lineWidths = void 0, this.maxHeight = void 0, this.maxWidth = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.height = void 0, this.width = void 0, this._margins = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0;
	}
	update(e, t, n) {
		this.maxWidth = e, this.maxHeight = t, this._margins = n, this.setDimensions(), this.buildLabels(), this.fit();
	}
	setDimensions() {
		this.isHorizontal() ? (this.width = this.maxWidth, this.left = this._margins.left, this.right = this.width) : (this.height = this.maxHeight, this.top = this._margins.top, this.bottom = this.height);
	}
	buildLabels() {
		let e = this.options.labels || {}, t = Q(e.generateLabels, [this.chart], this) || [];
		e.filter && (t = t.filter((t) => e.filter(t, this.chart.data))), e.sort && (t = t.sort((t, n) => e.sort(t, n, this.chart.data))), this.options.reverse && t.reverse(), this.legendItems = t;
	}
	fit() {
		let { options: e, ctx: t } = this;
		if (!e.display) {
			this.width = this.height = 0;
			return;
		}
		let n = e.labels, r = D_(n.font), i = r.size, a = this._computeTitleHeight(), { boxWidth: o, itemHeight: s } = pS(n, i), c, l;
		t.font = r.string, this.isHorizontal() ? (c = this.maxWidth, l = this._fitRows(a, i, o, s) + 10) : (l = this.maxHeight, c = this._fitCols(a, r, o, s) + 10), this.width = Math.min(c, e.maxWidth || this.maxWidth), this.height = Math.min(l, e.maxHeight || this.maxHeight);
	}
	_fitRows(e, t, n, r) {
		let { ctx: i, maxWidth: a, options: { labels: { padding: o } } } = this, s = this.legendHitBoxes = [], c = this.lineWidths = [0], l = r + o, u = e;
		i.textAlign = "left", i.textBaseline = "middle";
		let d = -1, f = -l;
		return this.legendItems.forEach((e, p) => {
			let m = n + t / 2 + i.measureText(e.text).width;
			(p === 0 || c[c.length - 1] + m + 2 * o > a) && (u += l, c[c.length - (p > 0 ? 0 : 1)] = 0, f += l, d++), s[p] = {
				left: 0,
				top: f,
				row: d,
				width: m,
				height: r
			}, c[c.length - 1] += m + o;
		}), u;
	}
	_fitCols(e, t, n, r) {
		let { ctx: i, maxHeight: a, options: { labels: { padding: o } } } = this, s = this.legendHitBoxes = [], c = this.columnSizes = [], l = a - e, u = o, d = 0, f = 0, p = 0, m = 0;
		return this.legendItems.forEach((e, a) => {
			let { itemWidth: h, itemHeight: g } = gS(n, t, i, e, r);
			a > 0 && f + g + 2 * o > l && (u += d + o, c.push({
				width: d,
				height: f
			}), p += d + o, m++, d = f = 0), s[a] = {
				left: p,
				top: f,
				col: m,
				width: h,
				height: g
			}, d = Math.max(d, h), f += g + o;
		}), u += d, c.push({
			width: d,
			height: f
		}), u;
	}
	adjustHitBoxes() {
		if (!this.options.display) return;
		let e = this._computeTitleHeight(), { legendHitBoxes: t, options: { align: n, labels: { padding: r }, rtl: i } } = this, a = Dv(i, this.left, this.width);
		if (this.isHorizontal()) {
			let i = 0, o = kg(n, this.left + r, this.right - this.lineWidths[i]);
			for (let s of t) i !== s.row && (i = s.row, o = kg(n, this.left + r, this.right - this.lineWidths[i])), s.top += this.top + e + r, s.left = a.leftForLtr(a.x(o), s.width), o += s.width + r;
		} else {
			let i = 0, o = kg(n, this.top + e + r, this.bottom - this.columnSizes[i].height);
			for (let s of t) s.col !== i && (i = s.col, o = kg(n, this.top + e + r, this.bottom - this.columnSizes[i].height)), s.top = o, s.left += this.left + r, s.left = a.leftForLtr(a.x(s.left), s.width), o += s.height + r;
		}
	}
	isHorizontal() {
		return this.options.position === "top" || this.options.position === "bottom";
	}
	draw() {
		if (this.options.display) {
			let e = this.ctx;
			u_(e, this), this._draw(), d_(e);
		}
	}
	_draw() {
		let { options: e, columnSizes: t, lineWidths: n, ctx: r } = this, { align: i, labels: a } = e, o = t_.color, s = Dv(e.rtl, this.left, this.width), c = D_(a.font), { padding: l } = a, u = c.size, d = u / 2, f;
		this.drawTitle(), r.textAlign = s.textAlign("left"), r.textBaseline = "middle", r.lineWidth = .5, r.font = c.string;
		let { boxWidth: p, boxHeight: m, itemHeight: h } = pS(a, u), g = function(e, t, n) {
			if (isNaN(p) || p <= 0 || isNaN(m) || m < 0) return;
			r.save();
			let i = Z(n.lineWidth, 1);
			if (r.fillStyle = Z(n.fillStyle, o), r.lineCap = Z(n.lineCap, "butt"), r.lineDashOffset = Z(n.lineDashOffset, 0), r.lineJoin = Z(n.lineJoin, "miter"), r.lineWidth = i, r.strokeStyle = Z(n.strokeStyle, o), r.setLineDash(Z(n.lineDash, [])), a.usePointStyle) {
				let o = {
					radius: m * Math.SQRT2 / 2,
					pointStyle: n.pointStyle,
					rotation: n.rotation,
					borderWidth: i
				}, c = s.xPlus(e, p / 2), l = t + d;
				c_(r, o, c, l, a.pointStyleWidth && p);
			} else {
				let a = t + Math.max((u - m) / 2, 0), o = s.leftForLtr(e, p), c = T_(n.borderRadius);
				r.beginPath(), Object.values(c).some((e) => e !== 0) ? v_(r, {
					x: o,
					y: a,
					w: p,
					h: m,
					radius: c
				}) : r.rect(o, a, p, m), r.fill(), i !== 0 && r.stroke();
			}
			r.restore();
		}, _ = function(e, t, n) {
			__(r, n.text, e, t + h / 2, c, {
				strikethrough: n.hidden,
				textAlign: s.textAlign(n.textAlign)
			});
		}, v = this.isHorizontal(), y = this._computeTitleHeight();
		f = v ? {
			x: kg(i, this.left + l, this.right - n[0]),
			y: this.top + l + y,
			line: 0
		} : {
			x: this.left + l,
			y: kg(i, this.top + y + l, this.bottom - t[0].height),
			line: 0
		}, Ov(this.ctx, e.textDirection);
		let b = h + l;
		this.legendItems.forEach((o, u) => {
			r.strokeStyle = o.fontColor, r.fillStyle = o.fontColor;
			let m = r.measureText(o.text).width, h = s.textAlign(o.textAlign ||= a.textAlign), x = p + d + m, S = f.x, C = f.y;
			s.setWidth(this.width), v ? u > 0 && S + x + l > this.right && (C = f.y += b, f.line++, S = f.x = kg(i, this.left + l, this.right - n[f.line])) : u > 0 && C + b > this.bottom && (S = f.x = S + t[f.line].width + l, f.line++, C = f.y = kg(i, this.top + y + l, this.bottom - t[f.line].height));
			let w = s.x(S);
			if (g(w, C, o), S = Ag(h, S + p + d, v ? S + x : this.right, e.rtl), _(s.x(S), C, o), v) f.x += x + l;
			else if (typeof o.text != "string") {
				let e = c.lineHeight;
				f.y += yS(o, e) + l;
			} else f.y += b;
		}), kv(this.ctx, e.textDirection);
	}
	drawTitle() {
		let e = this.options, t = e.title, n = D_(t.font), r = E_(t.padding);
		if (!t.display) return;
		let i = Dv(e.rtl, this.left, this.width), a = this.ctx, o = t.position, s = n.size / 2, c = r.top + s, l, u = this.left, d = this.width;
		if (this.isHorizontal()) d = Math.max(...this.lineWidths), l = this.top + c, u = kg(e.align, u, this.right - d);
		else {
			let t = this.columnSizes.reduce((e, t) => Math.max(e, t.height), 0);
			l = c + kg(e.align, this.top, this.bottom - t - e.labels.padding - this._computeTitleHeight());
		}
		let f = kg(o, u, u + d);
		a.textAlign = i.textAlign(Og(o)), a.textBaseline = "middle", a.strokeStyle = t.color, a.fillStyle = t.color, a.font = n.string, __(a, t.text, f, l, n);
	}
	_computeTitleHeight() {
		let e = this.options.title, t = D_(e.font), n = E_(e.padding);
		return e.display ? t.lineHeight + n.height : 0;
	}
	_getLegendItemAt(e, t) {
		let n, r, i;
		if (gg(e, this.left, this.right) && gg(t, this.top, this.bottom)) {
			for (i = this.legendHitBoxes, n = 0; n < i.length; ++n) if (r = i[n], gg(e, r.left, r.left + r.width) && gg(t, r.top, r.top + r.height)) return this.legendItems[n];
		}
		return null;
	}
	handleEvent(e) {
		let t = this.options;
		if (!bS(e.type, t)) return;
		let n = this._getLegendItemAt(e.x, e.y);
		if (e.type === "mousemove" || e.type === "mouseout") {
			let r = this._hoveredItem, i = mS(r, n);
			r && !i && Q(t.onLeave, [
				e,
				r,
				this
			], this), this._hoveredItem = n, n && !i && Q(t.onHover, [
				e,
				n,
				this
			], this);
		} else n && Q(t.onClick, [
			e,
			n,
			this
		], this);
	}
};
function gS(e, t, n, r, i) {
	return {
		itemWidth: _S(r, e, t, n),
		itemHeight: vS(i, r, t.lineHeight)
	};
}
function _S(e, t, n, r) {
	let i = e.text;
	return i && typeof i != "string" && (i = i.reduce((e, t) => e.length > t.length ? e : t)), t + n.size / 2 + r.measureText(i).width;
}
function vS(e, t, n) {
	let r = e;
	return typeof t.text != "string" && (r = yS(t, n)), r;
}
function yS(e, t) {
	return t * (e.text ? e.text.length : 0);
}
function bS(e, t) {
	return !!((e === "mousemove" || e === "mouseout") && (t.onHover || t.onLeave) || t.onClick && (e === "click" || e === "mouseup"));
}
var xS = {
	id: "legend",
	_element: hS,
	start(e, t, n) {
		let r = e.legend = new hS({
			ctx: e.ctx,
			options: n,
			chart: e
		});
		cb.configure(e, r, n), cb.addBox(e, r);
	},
	stop(e) {
		cb.removeBox(e, e.legend), delete e.legend;
	},
	beforeUpdate(e, t, n) {
		let r = e.legend;
		cb.configure(e, r, n), r.options = n;
	},
	afterUpdate(e) {
		let t = e.legend;
		t.buildLabels(), t.adjustHitBoxes();
	},
	afterEvent(e, t) {
		t.replay || e.legend.handleEvent(t.event);
	},
	defaults: {
		display: !0,
		position: "top",
		align: "center",
		fullSize: !0,
		reverse: !1,
		weight: 1e3,
		onClick(e, t, n) {
			let r = t.datasetIndex, i = n.chart;
			i.isDatasetVisible(r) ? (i.hide(r), t.hidden = !0) : (i.show(r), t.hidden = !1);
		},
		onHover: null,
		onLeave: null,
		labels: {
			color: (e) => e.chart.options.color,
			boxWidth: 40,
			padding: 10,
			generateLabels(e) {
				let t = e.data.datasets, { labels: { usePointStyle: n, pointStyle: r, textAlign: i, color: a, useBorderRadius: o, borderRadius: s } } = e.legend.options;
				return e._getSortedDatasetMetas().map((e) => {
					let c = e.controller.getStyle(n ? 0 : void 0), l = E_(c.borderWidth);
					return {
						text: t[e.index].label,
						fillStyle: c.backgroundColor,
						fontColor: a,
						hidden: !e.visible,
						lineCap: c.borderCapStyle,
						lineDash: c.borderDash,
						lineDashOffset: c.borderDashOffset,
						lineJoin: c.borderJoinStyle,
						lineWidth: (l.width + l.height) / 4,
						strokeStyle: c.borderColor,
						pointStyle: r || c.pointStyle,
						rotation: c.rotation,
						textAlign: i || c.textAlign,
						borderRadius: o && (s || c.borderRadius),
						datasetIndex: e.index
					};
				}, this);
			}
		},
		title: {
			color: (e) => e.chart.options.color,
			display: !1,
			position: "center",
			text: ""
		}
	},
	descriptors: {
		_scriptable: (e) => !e.startsWith("on"),
		labels: { _scriptable: (e) => ![
			"generateLabels",
			"filter",
			"sort"
		].includes(e) }
	}
}, SS = {
	average(e) {
		if (!e.length) return !1;
		let t, n, r = /* @__PURE__ */ new Set(), i = 0, a = 0;
		for (t = 0, n = e.length; t < n; ++t) {
			let n = e[t].element;
			if (n && n.hasValue()) {
				let e = n.tooltipPosition();
				r.add(e.x), i += e.y, ++a;
			}
		}
		return a === 0 || r.size === 0 ? !1 : {
			x: [...r].reduce((e, t) => e + t) / r.size,
			y: i / a
		};
	},
	nearest(e, t) {
		if (!e.length) return !1;
		let n = t.x, r = t.y, i = Infinity, a, o, s;
		for (a = 0, o = e.length; a < o; ++a) {
			let n = e[a].element;
			if (n && n.hasValue()) {
				let e = ug(t, n.getCenterPoint());
				e < i && (i = e, s = n);
			}
		}
		if (s) {
			let e = s.tooltipPosition();
			n = e.x, r = e.y;
		}
		return {
			x: n,
			y: r
		};
	}
};
function CS(e, t) {
	return t && (Ch(t) ? Array.prototype.push.apply(e, t) : e.push(t)), e;
}
function wS(e) {
	return (typeof e == "string" || e instanceof String) && e.indexOf("\n") > -1 ? e.split("\n") : e;
}
function TS(e, t) {
	let { element: n, datasetIndex: r, index: i } = t, a = e.getDatasetMeta(r).controller, { label: o, value: s } = a.getLabelAndValue(i);
	return {
		chart: e,
		label: o,
		parsed: a.getParsed(i),
		raw: e.data.datasets[r].data[i],
		formattedValue: s,
		dataset: a.getDataset(),
		dataIndex: i,
		datasetIndex: r,
		element: n
	};
}
function ES(e, t) {
	let n = e.chart.ctx, { body: r, footer: i, title: a } = e, { boxWidth: o, boxHeight: s } = t, c = D_(t.bodyFont), l = D_(t.titleFont), u = D_(t.footerFont), d = a.length, f = i.length, p = r.length, m = E_(t.padding), h = m.height, g = 0, _ = r.reduce((e, t) => e + t.before.length + t.lines.length + t.after.length, 0);
	if (_ += e.beforeBody.length + e.afterBody.length, d && (h += d * l.lineHeight + (d - 1) * t.titleSpacing + t.titleMarginBottom), _) {
		let e = t.displayColors ? Math.max(s, c.lineHeight) : c.lineHeight;
		h += p * e + (_ - p) * c.lineHeight + (_ - 1) * t.bodySpacing;
	}
	f && (h += t.footerMarginTop + f * u.lineHeight + (f - 1) * t.footerSpacing);
	let v = 0, y = function(e) {
		g = Math.max(g, n.measureText(e).width + v);
	};
	return n.save(), n.font = l.string, $(e.title, y), n.font = c.string, $(e.beforeBody.concat(e.afterBody), y), v = t.displayColors ? o + 2 + t.boxPadding : 0, $(r, (e) => {
		$(e.before, y), $(e.lines, y), $(e.after, y);
	}), v = 0, n.font = u.string, $(e.footer, y), n.restore(), g += m.width, {
		width: g,
		height: h
	};
}
function DS(e, t) {
	let { y: n, height: r } = t;
	return n < r / 2 ? "top" : n > e.height - r / 2 ? "bottom" : "center";
}
function OS(e, t, n, r) {
	let { x: i, width: a } = r, o = n.caretSize + n.caretPadding;
	if (e === "left" && i + a + o > t.width || e === "right" && i - a - o < 0) return !0;
}
function kS(e, t, n, r) {
	let { x: i, width: a } = n, { width: o, chartArea: { left: s, right: c } } = e, l = "center";
	return r === "center" ? l = i <= (s + c) / 2 ? "left" : "right" : i <= a / 2 ? l = "left" : i >= o - a / 2 && (l = "right"), OS(l, e, t, n) && (l = "center"), l;
}
function AS(e, t, n) {
	let r = n.yAlign || t.yAlign || DS(e, n);
	return {
		xAlign: n.xAlign || t.xAlign || kS(e, t, n, r),
		yAlign: r
	};
}
function jS(e, t) {
	let { x: n, width: r } = e;
	return t === "right" ? n -= r : t === "center" && (n -= r / 2), n;
}
function MS(e, t, n) {
	let { y: r, height: i } = e;
	return t === "top" ? r += n : r -= t === "bottom" ? i + n : i / 2, r;
}
function NS(e, t, n, r) {
	let { caretSize: i, caretPadding: a, cornerRadius: o } = e, { xAlign: s, yAlign: c } = n, l = i + a, { topLeft: u, topRight: d, bottomLeft: f, bottomRight: p } = T_(o), m = jS(t, s), h = MS(t, c, l);
	return c === "center" ? s === "left" ? m += l : s === "right" && (m -= l) : s === "left" ? m -= Math.max(u, f) + i : s === "right" && (m += Math.max(d, p) + i), {
		x: mg(m, 0, r.width - t.width),
		y: mg(h, 0, r.height - t.height)
	};
}
function PS(e, t, n) {
	let r = E_(n.padding);
	return t === "center" ? e.x + e.width / 2 : t === "right" ? e.x + e.width - r.right : e.x + r.left;
}
function FS(e) {
	return CS([], wS(e));
}
function IS(e, t, n) {
	return A_(e, {
		tooltip: t,
		tooltipItems: n,
		type: "tooltip"
	});
}
function LS(e, t) {
	let n = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
	return n ? e.override(n) : e;
}
var RS = {
	beforeTitle: xh,
	title(e) {
		if (e.length > 0) {
			let t = e[0], n = t.chart.data.labels, r = n ? n.length : 0;
			if (this && this.options && this.options.mode === "dataset") return t.dataset.label || "";
			if (t.label) return t.label;
			if (r > 0 && t.dataIndex < r) return n[t.dataIndex];
		}
		return "";
	},
	afterTitle: xh,
	beforeBody: xh,
	beforeLabel: xh,
	label(e) {
		if (this && this.options && this.options.mode === "dataset") return e.label + ": " + e.formattedValue || e.formattedValue;
		let t = e.dataset.label || "";
		t && (t += ": ");
		let n = e.formattedValue;
		return Y(n) || (t += n), t;
	},
	labelColor(e) {
		let t = e.chart.getDatasetMeta(e.datasetIndex).controller.getStyle(e.dataIndex);
		return {
			borderColor: t.borderColor,
			backgroundColor: t.backgroundColor,
			borderWidth: t.borderWidth,
			borderDash: t.borderDash,
			borderDashOffset: t.borderDashOffset,
			borderRadius: 0
		};
	},
	labelTextColor() {
		return this.options.bodyColor;
	},
	labelPointStyle(e) {
		let t = e.chart.getDatasetMeta(e.datasetIndex).controller.getStyle(e.dataIndex);
		return {
			pointStyle: t.pointStyle,
			rotation: t.rotation
		};
	},
	afterLabel: xh,
	afterBody: xh,
	beforeFooter: xh,
	footer: xh,
	afterFooter: xh
};
function zS(e, t, n, r) {
	let i = e[t].call(n, r);
	return i === void 0 ? RS[t].call(n, r) : i;
}
var BS = class extends Mb {
	static positioners = SS;
	constructor(e) {
		super(), this.opacity = 0, this._active = [], this._eventPosition = void 0, this._size = void 0, this._cachedAnimations = void 0, this._tooltipItems = [], this.$animations = void 0, this.$context = void 0, this.chart = e.chart, this.options = e.options, this.dataPoints = void 0, this.title = void 0, this.beforeBody = void 0, this.body = void 0, this.afterBody = void 0, this.footer = void 0, this.xAlign = void 0, this.yAlign = void 0, this.x = void 0, this.y = void 0, this.height = void 0, this.width = void 0, this.caretX = void 0, this.caretY = void 0, this.labelColors = void 0, this.labelPointStyles = void 0, this.labelTextColors = void 0;
	}
	initialize(e) {
		this.options = e, this._cachedAnimations = void 0, this.$context = void 0;
	}
	_resolveAnimations() {
		let e = this._cachedAnimations;
		if (e) return e;
		let t = this.chart, n = this.options.setContext(this.getContext()), r = n.enabled && t.options.animation && n.animations, i = new Yv(this.chart, r);
		return r._cacheable && (this._cachedAnimations = Object.freeze(i)), i;
	}
	getContext() {
		return this.$context ||= IS(this.chart.getContext(), this, this._tooltipItems);
	}
	getTitle(e, t) {
		let { callbacks: n } = t, r = zS(n, "beforeTitle", this, e), i = zS(n, "title", this, e), a = zS(n, "afterTitle", this, e), o = [];
		return o = CS(o, wS(r)), o = CS(o, wS(i)), o = CS(o, wS(a)), o;
	}
	getBeforeBody(e, t) {
		return FS(zS(t.callbacks, "beforeBody", this, e));
	}
	getBody(e, t) {
		let { callbacks: n } = t, r = [];
		return $(e, (e) => {
			let t = {
				before: [],
				lines: [],
				after: []
			}, i = LS(n, e);
			CS(t.before, wS(zS(i, "beforeLabel", this, e))), CS(t.lines, zS(i, "label", this, e)), CS(t.after, wS(zS(i, "afterLabel", this, e))), r.push(t);
		}), r;
	}
	getAfterBody(e, t) {
		return FS(zS(t.callbacks, "afterBody", this, e));
	}
	getFooter(e, t) {
		let { callbacks: n } = t, r = zS(n, "beforeFooter", this, e), i = zS(n, "footer", this, e), a = zS(n, "afterFooter", this, e), o = [];
		return o = CS(o, wS(r)), o = CS(o, wS(i)), o = CS(o, wS(a)), o;
	}
	_createItems(e) {
		let t = this._active, n = this.chart.data, r = [], i = [], a = [], o = [], s, c;
		for (s = 0, c = t.length; s < c; ++s) o.push(TS(this.chart, t[s]));
		return e.filter && (o = o.filter((t, r, i) => e.filter(t, r, i, n))), e.itemSort && (o = o.sort((t, r) => e.itemSort(t, r, n))), $(o, (t) => {
			let n = LS(e.callbacks, t);
			r.push(zS(n, "labelColor", this, t)), i.push(zS(n, "labelPointStyle", this, t)), a.push(zS(n, "labelTextColor", this, t));
		}), this.labelColors = r, this.labelPointStyles = i, this.labelTextColors = a, this.dataPoints = o, o;
	}
	update(e, t) {
		let n = this.options.setContext(this.getContext()), r = this._active, i, a = [];
		if (!r.length) this.opacity !== 0 && (i = { opacity: 0 });
		else {
			let e = SS[n.position].call(this, r, this._eventPosition);
			a = this._createItems(n), this.title = this.getTitle(a, n), this.beforeBody = this.getBeforeBody(a, n), this.body = this.getBody(a, n), this.afterBody = this.getAfterBody(a, n), this.footer = this.getFooter(a, n);
			let t = this._size = ES(this, n), o = Object.assign({}, e, t), s = AS(this.chart, n, o), c = NS(n, o, s, this.chart);
			this.xAlign = s.xAlign, this.yAlign = s.yAlign, i = {
				opacity: 1,
				x: c.x,
				y: c.y,
				width: t.width,
				height: t.height,
				caretX: e.x,
				caretY: e.y
			};
		}
		this._tooltipItems = a, this.$context = void 0, i && this._resolveAnimations().update(this, i), e && n.external && n.external.call(this, {
			chart: this.chart,
			tooltip: this,
			replay: t
		});
	}
	drawCaret(e, t, n, r) {
		let i = this.getCaretPosition(e, n, r);
		t.lineTo(i.x1, i.y1), t.lineTo(i.x2, i.y2), t.lineTo(i.x3, i.y3);
	}
	getCaretPosition(e, t, n) {
		let { xAlign: r, yAlign: i } = this, { caretSize: a, cornerRadius: o } = n, { topLeft: s, topRight: c, bottomLeft: l, bottomRight: u } = T_(o), { x: d, y: f } = e, { width: p, height: m } = t, h, g, _, v, y, b;
		return i === "center" ? (y = f + m / 2, r === "left" ? (h = d, g = h - a, v = y + a, b = y - a) : (h = d + p, g = h + a, v = y - a, b = y + a), _ = h) : (g = r === "left" ? d + Math.max(s, l) + a : r === "right" ? d + p - Math.max(c, u) - a : this.caretX, i === "top" ? (v = f, y = v - a, h = g - a, _ = g + a) : (v = f + m, y = v + a, h = g + a, _ = g - a), b = v), {
			x1: h,
			x2: g,
			x3: _,
			y1: v,
			y2: y,
			y3: b
		};
	}
	drawTitle(e, t, n) {
		let r = this.title, i = r.length, a, o, s;
		if (i) {
			let c = Dv(n.rtl, this.x, this.width);
			for (e.x = PS(this, n.titleAlign, n), t.textAlign = c.textAlign(n.titleAlign), t.textBaseline = "middle", a = D_(n.titleFont), o = n.titleSpacing, t.fillStyle = n.titleColor, t.font = a.string, s = 0; s < i; ++s) t.fillText(r[s], c.x(e.x), e.y + a.lineHeight / 2), e.y += a.lineHeight + o, s + 1 === i && (e.y += n.titleMarginBottom - o);
		}
	}
	_drawColorBox(e, t, n, r, i) {
		let a = this.labelColors[n], o = this.labelPointStyles[n], { boxHeight: s, boxWidth: c } = i, l = D_(i.bodyFont), u = PS(this, "left", i), d = r.x(u), f = s < l.lineHeight ? (l.lineHeight - s) / 2 : 0, p = t.y + f;
		if (i.usePointStyle) {
			let t = {
				radius: Math.min(c, s) / 2,
				pointStyle: o.pointStyle,
				rotation: o.rotation,
				borderWidth: 1
			}, n = r.leftForLtr(d, c) + c / 2, l = p + s / 2;
			e.strokeStyle = i.multiKeyBackground, e.fillStyle = i.multiKeyBackground, s_(e, t, n, l), e.strokeStyle = a.borderColor, e.fillStyle = a.backgroundColor, s_(e, t, n, l);
		} else {
			e.lineWidth = X(a.borderWidth) ? Math.max(...Object.values(a.borderWidth)) : a.borderWidth || 1, e.strokeStyle = a.borderColor, e.setLineDash(a.borderDash || []), e.lineDashOffset = a.borderDashOffset || 0;
			let t = r.leftForLtr(d, c), n = r.leftForLtr(r.xPlus(d, 1), c - 2), o = T_(a.borderRadius);
			Object.values(o).some((e) => e !== 0) ? (e.beginPath(), e.fillStyle = i.multiKeyBackground, v_(e, {
				x: t,
				y: p,
				w: c,
				h: s,
				radius: o
			}), e.fill(), e.stroke(), e.fillStyle = a.backgroundColor, e.beginPath(), v_(e, {
				x: n,
				y: p + 1,
				w: c - 2,
				h: s - 2,
				radius: o
			}), e.fill()) : (e.fillStyle = i.multiKeyBackground, e.fillRect(t, p, c, s), e.strokeRect(t, p, c, s), e.fillStyle = a.backgroundColor, e.fillRect(n, p + 1, c - 2, s - 2));
		}
		e.fillStyle = this.labelTextColors[n];
	}
	drawBody(e, t, n) {
		let { body: r } = this, { bodySpacing: i, bodyAlign: a, displayColors: o, boxHeight: s, boxWidth: c, boxPadding: l } = n, u = D_(n.bodyFont), d = u.lineHeight, f = 0, p = Dv(n.rtl, this.x, this.width), m = function(n) {
			t.fillText(n, p.x(e.x + f), e.y + d / 2), e.y += d + i;
		}, h = p.textAlign(a), g, _, v, y, b, x, S;
		for (t.textAlign = a, t.textBaseline = "middle", t.font = u.string, e.x = PS(this, h, n), t.fillStyle = n.bodyColor, $(this.beforeBody, m), f = o && h !== "right" ? a === "center" ? c / 2 + l : c + 2 + l : 0, y = 0, x = r.length; y < x; ++y) {
			for (g = r[y], _ = this.labelTextColors[y], t.fillStyle = _, $(g.before, m), v = g.lines, o && v.length && (this._drawColorBox(t, e, y, p, n), d = Math.max(u.lineHeight, s)), b = 0, S = v.length; b < S; ++b) m(v[b]), d = u.lineHeight;
			$(g.after, m);
		}
		f = 0, d = u.lineHeight, $(this.afterBody, m), e.y -= i;
	}
	drawFooter(e, t, n) {
		let r = this.footer, i = r.length, a, o;
		if (i) {
			let s = Dv(n.rtl, this.x, this.width);
			for (e.x = PS(this, n.footerAlign, n), e.y += n.footerMarginTop, t.textAlign = s.textAlign(n.footerAlign), t.textBaseline = "middle", a = D_(n.footerFont), t.fillStyle = n.footerColor, t.font = a.string, o = 0; o < i; ++o) t.fillText(r[o], s.x(e.x), e.y + a.lineHeight / 2), e.y += a.lineHeight + n.footerSpacing;
		}
	}
	drawBackground(e, t, n, r) {
		let { xAlign: i, yAlign: a } = this, { x: o, y: s } = e, { width: c, height: l } = n, { topLeft: u, topRight: d, bottomLeft: f, bottomRight: p } = T_(r.cornerRadius);
		t.fillStyle = r.backgroundColor, t.strokeStyle = r.borderColor, t.lineWidth = r.borderWidth, t.beginPath(), t.moveTo(o + u, s), a === "top" && this.drawCaret(e, t, n, r), t.lineTo(o + c - d, s), t.quadraticCurveTo(o + c, s, o + c, s + d), a === "center" && i === "right" && this.drawCaret(e, t, n, r), t.lineTo(o + c, s + l - p), t.quadraticCurveTo(o + c, s + l, o + c - p, s + l), a === "bottom" && this.drawCaret(e, t, n, r), t.lineTo(o + f, s + l), t.quadraticCurveTo(o, s + l, o, s + l - f), a === "center" && i === "left" && this.drawCaret(e, t, n, r), t.lineTo(o, s + u), t.quadraticCurveTo(o, s, o + u, s), t.closePath(), t.fill(), r.borderWidth > 0 && t.stroke();
	}
	_updateAnimationTarget(e) {
		let t = this.chart, n = this.$animations, r = n && n.x, i = n && n.y;
		if (r || i) {
			let n = SS[e.position].call(this, this._active, this._eventPosition);
			if (!n) return;
			let a = this._size = ES(this, e), o = Object.assign({}, n, this._size), s = AS(t, e, o), c = NS(e, o, s, t);
			(r._to !== c.x || i._to !== c.y) && (this.xAlign = s.xAlign, this.yAlign = s.yAlign, this.width = a.width, this.height = a.height, this.caretX = n.x, this.caretY = n.y, this._resolveAnimations().update(this, c));
		}
	}
	_willRender() {
		return !!this.opacity;
	}
	draw(e) {
		let t = this.options.setContext(this.getContext()), n = this.opacity;
		if (!n) return;
		this._updateAnimationTarget(t);
		let r = {
			width: this.width,
			height: this.height
		}, i = {
			x: this.x,
			y: this.y
		};
		n = Math.abs(n) < .001 ? 0 : n;
		let a = E_(t.padding), o = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
		t.enabled && o && (e.save(), e.globalAlpha = n, this.drawBackground(i, e, r, t), Ov(e, t.textDirection), i.y += a.top, this.drawTitle(i, e, t), this.drawBody(i, e, t), this.drawFooter(i, e, t), kv(e, t.textDirection), e.restore());
	}
	getActiveElements() {
		return this._active || [];
	}
	setActiveElements(e, t) {
		let n = this._active, r = e.map(({ datasetIndex: e, index: t }) => {
			let n = this.chart.getDatasetMeta(e);
			if (!n) throw Error("Cannot find a dataset at index " + e);
			return {
				datasetIndex: e,
				element: n.data[t],
				index: t
			};
		}), i = !Dh(n, r), a = this._positionChanged(r, t);
		(i || a) && (this._active = r, this._eventPosition = t, this._ignoreReplayEvents = !0, this.update(!0));
	}
	handleEvent(e, t, n = !0) {
		if (t && this._ignoreReplayEvents) return !1;
		this._ignoreReplayEvents = !1;
		let r = this.options, i = this._active || [], a = this._getActiveElements(e, i, t, n), o = this._positionChanged(a, e), s = t || !Dh(a, i) || o;
		return s && (this._active = a, (r.enabled || r.external) && (this._eventPosition = {
			x: e.x,
			y: e.y
		}, this.update(!0, t))), s;
	}
	_getActiveElements(e, t, n, r) {
		let i = this.options;
		if (e.type === "mouseout") return [];
		if (!r) return t.filter((e) => this.chart.data.datasets[e.datasetIndex] && this.chart.getDatasetMeta(e.datasetIndex).controller.getParsed(e.index) !== void 0);
		let a = this.chart.getElementsAtEventForMode(e, i.mode, i, n);
		return i.reverse && a.reverse(), a;
	}
	_positionChanged(e, t) {
		let { caretX: n, caretY: r, options: i } = this, a = SS[i.position].call(this, e, t);
		return a !== !1 && (n !== a.x || r !== a.y);
	}
}, VS = {
	id: "tooltip",
	_element: BS,
	positioners: SS,
	afterInit(e, t, n) {
		n && (e.tooltip = new BS({
			chart: e,
			options: n
		}));
	},
	beforeUpdate(e, t, n) {
		e.tooltip && e.tooltip.initialize(n);
	},
	reset(e, t, n) {
		e.tooltip && e.tooltip.initialize(n);
	},
	afterDraw(e) {
		let t = e.tooltip;
		if (t && t._willRender()) {
			let n = { tooltip: t };
			if (e.notifyPlugins("beforeTooltipDraw", {
				...n,
				cancelable: !0
			}) === !1) return;
			t.draw(e.ctx), e.notifyPlugins("afterTooltipDraw", n);
		}
	},
	afterEvent(e, t) {
		if (e.tooltip) {
			let n = t.replay;
			e.tooltip.handleEvent(t.event, n, t.inChartArea) && (t.changed = !0);
		}
	},
	defaults: {
		enabled: !0,
		external: null,
		position: "average",
		backgroundColor: "rgba(0,0,0,0.8)",
		titleColor: "#fff",
		titleFont: { weight: "bold" },
		titleSpacing: 2,
		titleMarginBottom: 6,
		titleAlign: "left",
		bodyColor: "#fff",
		bodySpacing: 2,
		bodyFont: {},
		bodyAlign: "left",
		footerColor: "#fff",
		footerSpacing: 2,
		footerMarginTop: 6,
		footerFont: { weight: "bold" },
		footerAlign: "left",
		padding: 6,
		caretPadding: 2,
		caretSize: 5,
		cornerRadius: 6,
		boxHeight: (e, t) => t.bodyFont.size,
		boxWidth: (e, t) => t.bodyFont.size,
		multiKeyBackground: "#fff",
		displayColors: !0,
		boxPadding: 0,
		borderColor: "rgba(0,0,0,0)",
		borderWidth: 0,
		animation: {
			duration: 400,
			easing: "easeOutQuart"
		},
		animations: {
			numbers: {
				type: "number",
				properties: [
					"x",
					"y",
					"width",
					"height",
					"caretX",
					"caretY"
				]
			},
			opacity: {
				easing: "linear",
				duration: 200
			}
		},
		callbacks: RS
	},
	defaultRoutes: {
		bodyFont: "font",
		footerFont: "font",
		titleFont: "font"
	},
	descriptors: {
		_scriptable: (e) => e !== "filter" && e !== "itemSort" && e !== "external",
		_indexable: !1,
		callbacks: {
			_scriptable: !1,
			_indexable: !1
		},
		animation: { _fallback: !1 },
		animations: { _fallback: "animation" }
	},
	additionalOptionScopes: ["interaction"]
}, HS = (e, t, n, r) => (typeof t == "string" ? (n = e.push(t) - 1, r.unshift({
	index: n,
	label: t
})) : isNaN(t) && (n = null), n);
function US(e, t, n, r) {
	let i = e.indexOf(t);
	return i === -1 ? HS(e, t, n, r) : i === e.lastIndexOf(t) ? i : n;
}
var WS = (e, t) => e === null ? null : mg(Math.round(e), 0, t);
function GS(e) {
	let t = this.getLabels();
	return e >= 0 && e < t.length ? t[e] : e;
}
var KS = class extends Qb {
	static id = "category";
	static defaults = { ticks: { callback: GS } };
	constructor(e) {
		super(e), this._startValue = void 0, this._valueRange = 0, this._addedLabels = [];
	}
	init(e) {
		let t = this._addedLabels;
		if (t.length) {
			let e = this.getLabels();
			for (let { index: n, label: r } of t) e[n] === r && e.splice(n, 1);
			this._addedLabels = [];
		}
		super.init(e);
	}
	parse(e, t) {
		if (Y(e)) return null;
		let n = this.getLabels();
		return t = isFinite(t) && n[t] === e ? t : US(n, e, Z(t, e), this._addedLabels), WS(t, n.length - 1);
	}
	determineDataLimits() {
		let { minDefined: e, maxDefined: t } = this.getUserBounds(), { min: n, max: r } = this.getMinMax(!0);
		this.options.bounds === "ticks" && (e || (n = 0), t || (r = this.getLabels().length - 1)), this.min = n, this.max = r;
	}
	buildTicks() {
		let e = this.min, t = this.max, n = this.options.offset, r = [], i = this.getLabels();
		i = e === 0 && t === i.length - 1 ? i : i.slice(e, t + 1), this._valueRange = Math.max(i.length - +!n, 1), this._startValue = this.min - (n ? .5 : 0);
		for (let n = e; n <= t; n++) r.push({ value: n });
		return r;
	}
	getLabelForValue(e) {
		return GS.call(this, e);
	}
	configure() {
		super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels);
	}
	getPixelForValue(e) {
		return typeof e != "number" && (e = this.parse(e)), e === null ? NaN : this.getPixelForDecimal((e - this._startValue) / this._valueRange);
	}
	getPixelForTick(e) {
		let t = this.ticks;
		return e < 0 || e > t.length - 1 ? null : this.getPixelForValue(t[e].value);
	}
	getValueForPixel(e) {
		return Math.round(this._startValue + this.getDecimalForPixel(e) * this._valueRange);
	}
	getBasePixel() {
		return this.bottom;
	}
};
function qS(e, t) {
	let n = [], { bounds: r, step: i, min: a, max: o, precision: s, count: c, maxTicks: l, maxDigits: u, includeBounds: d } = e, f = i || 1, p = l - 1, { min: m, max: h } = t, g = !Y(a), _ = !Y(o), v = !Y(c), y = (h - m) / (u + 1), b = eg((h - m) / p / f) * f, x, S, C, w;
	if (b < 1e-14 && !g && !_) return [{ value: m }, { value: h }];
	w = Math.ceil(h / b) - Math.floor(m / b), w > p && (b = eg(w * b / p / f) * f), Y(s) || (x = 10 ** s, b = Math.ceil(b * x) / x), r === "ticks" ? (S = Math.floor(m / b) * b, C = Math.ceil(h / b) * b) : (S = m, C = h), g && _ && i && ig((o - a) / i, b / 1e3) ? (w = Math.round(Math.min((o - a) / b, l)), b = (o - a) / w, S = a, C = o) : v ? (S = g ? a : S, C = _ ? o : C, w = c - 1, b = (C - S) / w) : (w = (C - S) / b, w = $h(w, Math.round(w), b / 1e3) ? Math.round(w) : Math.ceil(w));
	let T = Math.max(cg(b), cg(S));
	x = 10 ** (Y(s) ? T : s), S = Math.round(S * x) / x, C = Math.round(C * x) / x;
	let E = 0;
	for (g && (d && S !== a ? (n.push({ value: a }), S < a && E++, $h(Math.round((S + E * b) * x) / x, a, JS(a, y, e)) && E++) : S < a && E++); E < w; ++E) {
		let e = Math.round((S + E * b) * x) / x;
		if (_ && e > o) break;
		n.push({ value: e });
	}
	return _ && d && C !== o ? n.length && $h(n[n.length - 1].value, o, JS(o, y, e)) ? n[n.length - 1].value = o : n.push({ value: o }) : _ && C !== o || n.push({ value: C }), n;
}
function JS(e, t, { horizontal: n, minRotation: r }) {
	let i = og(r), a = (n ? Math.sin(i) : Math.cos(i)) || .001, o = .75 * t * ("" + e).length;
	return Math.min(t / a, o);
}
var YS = class extends Qb {
	constructor(e) {
		super(e), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0;
	}
	parse(e, t) {
		return Y(e) || (typeof e == "number" || e instanceof Number) && !isFinite(+e) ? null : +e;
	}
	handleTickRangeOptions() {
		let { beginAtZero: e } = this.options, { minDefined: t, maxDefined: n } = this.getUserBounds(), { min: r, max: i } = this, a = (e) => r = t ? r : e, o = (e) => i = n ? i : e;
		if (e) {
			let e = Qh(r), t = Qh(i);
			e < 0 && t < 0 ? o(0) : e > 0 && t > 0 && a(0);
		}
		if (r === i) {
			let t = i === 0 ? 1 : Math.abs(i * .05);
			o(i + t), e || a(r - t);
		}
		this.min = r, this.max = i;
	}
	getTickLimit() {
		let { maxTicksLimit: e, stepSize: t } = this.options.ticks, n;
		return t ? (n = Math.ceil(this.max / t) - Math.floor(this.min / t) + 1, n > 1e3 && (console.warn(`scales.${this.id}.ticks.stepSize: ${t} would result generating up to ${n} ticks. Limiting to 1000.`), n = 1e3)) : (n = this.computeTickLimit(), e ||= 11), e && (n = Math.min(e, n)), n;
	}
	computeTickLimit() {
		return Infinity;
	}
	buildTicks() {
		let e = this.options, t = e.ticks, n = this.getTickLimit();
		n = Math.max(2, n);
		let r = qS({
			maxTicks: n,
			bounds: e.bounds,
			min: e.min,
			max: e.max,
			precision: t.precision,
			step: t.stepSize,
			count: t.count,
			maxDigits: this._maxDigits(),
			horizontal: this.isHorizontal(),
			minRotation: t.minRotation || 0,
			includeBounds: t.includeBounds !== !1
		}, this._range || this);
		return e.bounds === "ticks" && ag(r, this, "value"), e.reverse ? (r.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), r;
	}
	configure() {
		let e = this.ticks, t = this.min, n = this.max;
		if (super.configure(), this.options.offset && e.length) {
			let r = (n - t) / Math.max(e.length - 1, 1) / 2;
			t -= r, n += r;
		}
		this._startValue = t, this._endValue = n, this._valueRange = n - t;
	}
	getLabelForValue(e) {
		return Kg(e, this.chart.options.locale, this.options.ticks.format);
	}
}, XS = class extends YS {
	static id = "linear";
	static defaults = { ticks: { callback: Yg.formatters.numeric } };
	determineDataLimits() {
		let { min: e, max: t } = this.getMinMax(!0);
		this.min = wh(e) ? e : 0, this.max = wh(t) ? t : 1, this.handleTickRangeOptions();
	}
	computeTickLimit() {
		let e = this.isHorizontal(), t = e ? this.width : this.height, n = og(this.options.ticks.minRotation), r = (e ? Math.sin(n) : Math.cos(n)) || .001, i = this._resolveTickFontOptions(0);
		return Math.ceil(t / Math.min(40, i.lineHeight / r));
	}
	getPixelForValue(e) {
		return e === null ? NaN : this.getPixelForDecimal((e - this._startValue) / this._valueRange);
	}
	getValueForPixel(e) {
		return this._startValue + this.getDecimalForPixel(e) * this._valueRange;
	}
}, ZS = (e) => Math.floor(Zh(e)), QS = (e, t) => 10 ** (ZS(e) + t);
function $S(e) {
	return e / 10 ** ZS(e) == 1;
}
function eC(e, t, n) {
	let r = 10 ** n, i = Math.floor(e / r);
	return Math.ceil(t / r) - i;
}
function tC(e, t) {
	let n = ZS(t - e);
	for (; eC(e, t, n) > 10;) n++;
	for (; eC(e, t, n) < 10;) n--;
	return Math.min(n, ZS(e));
}
function nC(e, { min: t, max: n }) {
	t = Th(e.min, t);
	let r = [], i = ZS(t), a = tC(t, n), o = a < 0 ? 10 ** Math.abs(a) : 1, s = 10 ** a, c = i > a ? 10 ** i : 0, l = Math.round((t - c) * o) / o, u = Math.floor((t - c) / s / 10) * s * 10, d = Math.floor((l - u) / 10 ** a), f = Th(e.min, Math.round((c + u + d * 10 ** a) * o) / o);
	for (; f < n;) r.push({
		value: f,
		major: $S(f),
		significand: d
	}), d >= 10 ? d = d < 15 ? 15 : 20 : d++, d >= 20 && (a++, d = 2, o = a >= 0 ? 1 : o), f = Math.round((c + u + d * 10 ** a) * o) / o;
	let p = Th(e.max, f);
	return r.push({
		value: p,
		major: $S(p),
		significand: d
	}), r;
}
(class extends Qb {
	static id = "logarithmic";
	static defaults = { ticks: {
		callback: Yg.formatters.logarithmic,
		major: { enabled: !0 }
	} };
	constructor(e) {
		super(e), this.start = void 0, this.end = void 0, this._startValue = void 0, this._valueRange = 0;
	}
	parse(e, t) {
		let n = YS.prototype.parse.apply(this, [e, t]);
		if (n === 0) this._zero = !0;
		else return wh(n) && n > 0 ? n : null;
	}
	determineDataLimits() {
		let { min: e, max: t } = this.getMinMax(!0);
		this.min = wh(e) ? Math.max(0, e) : null, this.max = wh(t) ? Math.max(0, t) : null, this.options.beginAtZero && (this._zero = !0), this._zero && this.min !== this._suggestedMin && !wh(this._userMin) && (this.min = e === QS(this.min, 0) ? QS(this.min, -1) : QS(this.min, 0)), this.handleTickRangeOptions();
	}
	handleTickRangeOptions() {
		let { minDefined: e, maxDefined: t } = this.getUserBounds(), n = this.min, r = this.max, i = (t) => n = e ? n : t, a = (e) => r = t ? r : e;
		n === r && (n <= 0 ? (i(1), a(10)) : (i(QS(n, -1)), a(QS(r, 1)))), n <= 0 && i(QS(r, -1)), r <= 0 && a(QS(n, 1)), this.min = n, this.max = r;
	}
	buildTicks() {
		let e = this.options, t = nC({
			min: this._userMin,
			max: this._userMax
		}, this);
		return e.bounds === "ticks" && ag(t, this, "value"), e.reverse ? (t.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), t;
	}
	getLabelForValue(e) {
		return e === void 0 ? "0" : Kg(e, this.chart.options.locale, this.options.ticks.format);
	}
	configure() {
		let e = this.min;
		super.configure(), this._startValue = Zh(e), this._valueRange = Zh(this.max) - Zh(e);
	}
	getPixelForValue(e) {
		return (e === void 0 || e === 0) && (e = this.min), e === null || isNaN(e) ? NaN : this.getPixelForDecimal(e === this.min ? 0 : (Zh(e) - this._startValue) / this._valueRange);
	}
	getValueForPixel(e) {
		let t = this.getDecimalForPixel(e);
		return 10 ** (this._startValue + t * this._valueRange);
	}
});
function rC(e) {
	let t = e.ticks;
	if (t.display && e.display) {
		let e = E_(t.backdropPadding);
		return Z(t.font && t.font.size, t_.font.size) + e.height;
	}
	return 0;
}
function iC(e, t, n) {
	return n = Ch(n) ? n : [n], {
		w: i_(e, t.string, n),
		h: n.length * t.lineHeight
	};
}
function aC(e, t, n, r, i) {
	return e === r || e === i ? {
		start: t - n / 2,
		end: t + n / 2
	} : e < r || e > i ? {
		start: t - n,
		end: t
	} : {
		start: t,
		end: t + n
	};
}
function oC(e) {
	let t = {
		l: e.left + e._padding.left,
		r: e.right - e._padding.right,
		t: e.top + e._padding.top,
		b: e.bottom - e._padding.bottom
	}, n = Object.assign({}, t), r = [], i = [], a = e._pointLabels.length, o = e.options.pointLabels, s = o.centerPointLabels ? Uh / a : 0;
	for (let c = 0; c < a; c++) {
		let a = o.setContext(e.getPointLabelContext(c));
		i[c] = a.padding;
		let l = e.getPointPosition(c, e.drawingArea + i[c], s), u = D_(a.font), d = iC(e.ctx, u, e._pointLabels[c]);
		r[c] = d;
		let f = fg(e.getIndexAngle(c) + s), p = Math.round(sg(f));
		sC(n, t, f, aC(p, l.x, d.w, 0, 180), aC(p, l.y, d.h, 90, 270));
	}
	e.setCenterPoint(t.l - n.l, n.r - t.r, t.t - n.t, n.b - t.b), e._pointLabelItems = uC(e, r, i);
}
function sC(e, t, n, r, i) {
	let a = Math.abs(Math.sin(n)), o = Math.abs(Math.cos(n)), s = 0, c = 0;
	r.start < t.l ? (s = (t.l - r.start) / a, e.l = Math.min(e.l, t.l - s)) : r.end > t.r && (s = (r.end - t.r) / a, e.r = Math.max(e.r, t.r + s)), i.start < t.t ? (c = (t.t - i.start) / o, e.t = Math.min(e.t, t.t - c)) : i.end > t.b && (c = (i.end - t.b) / o, e.b = Math.max(e.b, t.b + c));
}
function cC(e, t, n) {
	let r = e.drawingArea, { extra: i, additionalAngle: a, padding: o, size: s } = n, c = e.getPointPosition(t, r + i + o, a), l = Math.round(sg(fg(c.angle + Jh))), u = pC(c.y, s.h, l), d = dC(l), f = fC(c.x, s.w, d);
	return {
		visible: !0,
		x: c.x,
		y: u,
		textAlign: d,
		left: f,
		top: u,
		right: f + s.w,
		bottom: u + s.h
	};
}
function lC(e, t) {
	if (!t) return !0;
	let { left: n, top: r, right: i, bottom: a } = e;
	return !(l_({
		x: n,
		y: r
	}, t) || l_({
		x: n,
		y: a
	}, t) || l_({
		x: i,
		y: r
	}, t) || l_({
		x: i,
		y: a
	}, t));
}
function uC(e, t, n) {
	let r = [], i = e._pointLabels.length, a = e.options, { centerPointLabels: o, display: s } = a.pointLabels, c = {
		extra: rC(a) / 2,
		additionalAngle: o ? Uh / i : 0
	}, l;
	for (let a = 0; a < i; a++) {
		c.padding = n[a], c.size = t[a];
		let i = cC(e, a, c);
		r.push(i), s === "auto" && (i.visible = lC(i, l), i.visible && (l = i));
	}
	return r;
}
function dC(e) {
	return e === 0 || e === 180 ? "center" : e < 180 ? "left" : "right";
}
function fC(e, t, n) {
	return n === "right" ? e -= t : n === "center" && (e -= t / 2), e;
}
function pC(e, t, n) {
	return n === 90 || n === 270 ? e -= t / 2 : (n > 270 || n < 90) && (e -= t), e;
}
function mC(e, t, n) {
	let { left: r, top: i, right: a, bottom: o } = n, { backdropColor: s } = t;
	if (!Y(s)) {
		let n = T_(t.borderRadius), c = E_(t.backdropPadding);
		e.fillStyle = s;
		let l = r - c.left, u = i - c.top, d = a - r + c.width, f = o - i + c.height;
		Object.values(n).some((e) => e !== 0) ? (e.beginPath(), v_(e, {
			x: l,
			y: u,
			w: d,
			h: f,
			radius: n
		}), e.fill()) : e.fillRect(l, u, d, f);
	}
}
function hC(e, t) {
	let { ctx: n, options: { pointLabels: r } } = e;
	for (let i = t - 1; i >= 0; i--) {
		let t = e._pointLabelItems[i];
		if (!t.visible) continue;
		let a = r.setContext(e.getPointLabelContext(i));
		mC(n, a, t);
		let o = D_(a.font), { x: s, y: c, textAlign: l } = t;
		__(n, e._pointLabels[i], s, c + o.lineHeight / 2, o, {
			color: a.color,
			textAlign: l,
			textBaseline: "middle"
		});
	}
}
function gC(e, t, n, r) {
	let { ctx: i } = e;
	if (n) i.arc(e.xCenter, e.yCenter, t, 0, Wh);
	else {
		let n = e.getPointPosition(0, t);
		i.moveTo(n.x, n.y);
		for (let a = 1; a < r; a++) n = e.getPointPosition(a, t), i.lineTo(n.x, n.y);
	}
}
function _C(e, t, n, r, i) {
	let a = e.ctx, o = t.circular, { color: s, lineWidth: c } = t;
	!o && !r || !s || !c || n < 0 || (a.save(), a.strokeStyle = s, a.lineWidth = c, a.setLineDash(i.dash || []), a.lineDashOffset = i.dashOffset, a.beginPath(), gC(e, n, o, r), a.closePath(), a.stroke(), a.restore());
}
function vC(e, t, n) {
	return A_(e, {
		label: n,
		index: t,
		type: "pointLabel"
	});
}
(class extends YS {
	static id = "radialLinear";
	static defaults = {
		display: !0,
		animate: !0,
		position: "chartArea",
		angleLines: {
			display: !0,
			lineWidth: 1,
			borderDash: [],
			borderDashOffset: 0
		},
		grid: { circular: !1 },
		startAngle: 0,
		ticks: {
			showLabelBackdrop: !0,
			callback: Yg.formatters.numeric
		},
		pointLabels: {
			backdropColor: void 0,
			backdropPadding: 2,
			display: !0,
			font: { size: 10 },
			callback(e) {
				return e;
			},
			padding: 5,
			centerPointLabels: !1
		}
	};
	static defaultRoutes = {
		"angleLines.color": "borderColor",
		"pointLabels.color": "color",
		"ticks.color": "color"
	};
	static descriptors = { angleLines: { _fallback: "grid" } };
	constructor(e) {
		super(e), this.xCenter = void 0, this.yCenter = void 0, this.drawingArea = void 0, this._pointLabels = [], this._pointLabelItems = [];
	}
	setDimensions() {
		let e = this._padding = E_(rC(this.options) / 2), t = this.width = this.maxWidth - e.width, n = this.height = this.maxHeight - e.height;
		this.xCenter = Math.floor(this.left + t / 2 + e.left), this.yCenter = Math.floor(this.top + n / 2 + e.top), this.drawingArea = Math.floor(Math.min(t, n) / 2);
	}
	determineDataLimits() {
		let { min: e, max: t } = this.getMinMax(!1);
		this.min = wh(e) && !isNaN(e) ? e : 0, this.max = wh(t) && !isNaN(t) ? t : 0, this.handleTickRangeOptions();
	}
	computeTickLimit() {
		return Math.ceil(this.drawingArea / rC(this.options));
	}
	generateTickLabels(e) {
		YS.prototype.generateTickLabels.call(this, e), this._pointLabels = this.getLabels().map((e, t) => {
			let n = Q(this.options.pointLabels.callback, [e, t], this);
			return n || n === 0 ? n : "";
		}).filter((e, t) => this.chart.getDataVisibility(t));
	}
	fit() {
		let e = this.options;
		e.display && e.pointLabels.display ? oC(this) : this.setCenterPoint(0, 0, 0, 0);
	}
	setCenterPoint(e, t, n, r) {
		this.xCenter += Math.floor((e - t) / 2), this.yCenter += Math.floor((n - r) / 2), this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(e, t, n, r));
	}
	getIndexAngle(e) {
		let t = Wh / (this._pointLabels.length || 1), n = this.options.startAngle || 0;
		return fg(e * t + og(n));
	}
	getDistanceFromCenterForValue(e) {
		if (Y(e)) return NaN;
		let t = this.drawingArea / (this.max - this.min);
		return this.options.reverse ? (this.max - e) * t : (e - this.min) * t;
	}
	getValueForDistanceFromCenter(e) {
		if (Y(e)) return NaN;
		let t = e / (this.drawingArea / (this.max - this.min));
		return this.options.reverse ? this.max - t : this.min + t;
	}
	getPointLabelContext(e) {
		let t = this._pointLabels || [];
		if (e >= 0 && e < t.length) {
			let n = t[e];
			return vC(this.getContext(), e, n);
		}
	}
	getPointPosition(e, t, n = 0) {
		let r = this.getIndexAngle(e) - Jh + n;
		return {
			x: Math.cos(r) * t + this.xCenter,
			y: Math.sin(r) * t + this.yCenter,
			angle: r
		};
	}
	getPointPositionForValue(e, t) {
		return this.getPointPosition(e, this.getDistanceFromCenterForValue(t));
	}
	getBasePosition(e) {
		return this.getPointPositionForValue(e || 0, this.getBaseValue());
	}
	getPointLabelPosition(e) {
		let { left: t, top: n, right: r, bottom: i } = this._pointLabelItems[e];
		return {
			left: t,
			top: n,
			right: r,
			bottom: i
		};
	}
	drawBackground() {
		let { backgroundColor: e, grid: { circular: t } } = this.options;
		if (e) {
			let n = this.ctx;
			n.save(), n.beginPath(), gC(this, this.getDistanceFromCenterForValue(this._endValue), t, this._pointLabels.length), n.closePath(), n.fillStyle = e, n.fill(), n.restore();
		}
	}
	drawGrid() {
		let e = this.ctx, t = this.options, { angleLines: n, grid: r, border: i } = t, a = this._pointLabels.length, o, s, c;
		if (t.pointLabels.display && hC(this, a), r.display && this.ticks.forEach((e, t) => {
			if (t !== 0 || t === 0 && this.min < 0) {
				s = this.getDistanceFromCenterForValue(e.value);
				let n = this.getContext(t), o = r.setContext(n), c = i.setContext(n);
				_C(this, o, s, a, c);
			}
		}), n.display) {
			for (e.save(), o = a - 1; o >= 0; o--) {
				let r = n.setContext(this.getPointLabelContext(o)), { color: i, lineWidth: a } = r;
				a && i && (e.lineWidth = a, e.strokeStyle = i, e.setLineDash(r.borderDash), e.lineDashOffset = r.borderDashOffset, s = this.getDistanceFromCenterForValue(t.reverse ? this.min : this.max), c = this.getPointPosition(o, s), e.beginPath(), e.moveTo(this.xCenter, this.yCenter), e.lineTo(c.x, c.y), e.stroke());
			}
			e.restore();
		}
	}
	drawBorder() {}
	drawLabels() {
		let e = this.ctx, t = this.options, n = t.ticks;
		if (!n.display) return;
		let r = this.getIndexAngle(0), i, a;
		e.save(), e.translate(this.xCenter, this.yCenter), e.rotate(r), e.textAlign = "center", e.textBaseline = "middle", this.ticks.forEach((r, o) => {
			if (o === 0 && this.min >= 0 && !t.reverse) return;
			let s = n.setContext(this.getContext(o)), c = D_(s.font);
			if (i = this.getDistanceFromCenterForValue(this.ticks[o].value), s.showLabelBackdrop) {
				e.font = c.string, a = e.measureText(r.label).width, e.fillStyle = s.backdropColor;
				let t = E_(s.backdropPadding);
				e.fillRect(-a / 2 - t.left, -i - c.size / 2 - t.top, a + t.width, c.size + t.height);
			}
			__(e, r.label, 0, -i, c, {
				color: s.color,
				strokeColor: s.textStrokeColor,
				strokeWidth: s.textStrokeWidth
			});
		}), e.restore();
	}
	drawTitle() {}
});
var yC = {
	millisecond: {
		common: !0,
		size: 1,
		steps: 1e3
	},
	second: {
		common: !0,
		size: 1e3,
		steps: 60
	},
	minute: {
		common: !0,
		size: 6e4,
		steps: 60
	},
	hour: {
		common: !0,
		size: 36e5,
		steps: 24
	},
	day: {
		common: !0,
		size: 864e5,
		steps: 30
	},
	week: {
		common: !1,
		size: 6048e5,
		steps: 4
	},
	month: {
		common: !0,
		size: 2628e6,
		steps: 12
	},
	quarter: {
		common: !1,
		size: 7884e6,
		steps: 4
	},
	year: {
		common: !0,
		size: 3154e7
	}
}, bC = /* #__PURE__ */ Object.keys(yC);
function xC(e, t) {
	return e - t;
}
function SC(e, t) {
	if (Y(t)) return null;
	let n = e._adapter, { parser: r, round: i, isoWeekday: a } = e._parseOpts, o = t;
	return typeof r == "function" && (o = r(o)), wh(o) || (o = typeof r == "string" ? n.parse(o, r) : n.parse(o)), o === null ? null : (i && (o = i === "week" && (rg(a) || a === !0) ? n.startOf(o, "isoWeek", a) : n.startOf(o, i)), +o);
}
function CC(e, t, n, r) {
	let i = bC.length;
	for (let a = bC.indexOf(e); a < i - 1; ++a) {
		let e = yC[bC[a]], i = e.steps ? e.steps : 2 ** 53 - 1;
		if (e.common && Math.ceil((n - t) / (i * e.size)) <= r) return bC[a];
	}
	return bC[i - 1];
}
function wC(e, t, n, r, i) {
	for (let a = bC.length - 1; a >= bC.indexOf(n); a--) {
		let n = bC[a];
		if (yC[n].common && e._adapter.diff(i, r, n) >= t - 1) return n;
	}
	return bC[n ? bC.indexOf(n) : 0];
}
function TC(e) {
	for (let t = bC.indexOf(e) + 1, n = bC.length; t < n; ++t) if (yC[bC[t]].common) return bC[t];
}
function EC(e, t, n) {
	if (!n) e[t] = !0;
	else if (n.length) {
		let { lo: r, hi: i } = _g(n, t), a = n[r] >= t ? n[r] : n[i];
		e[a] = !0;
	}
}
function DC(e, t, n, r) {
	let i = e._adapter, a = +i.startOf(t[0].value, r), o = t[t.length - 1].value, s, c;
	for (s = a; s <= o; s = +i.add(s, 1, r)) c = n[s], c >= 0 && (t[c].major = !0);
	return t;
}
function OC(e, t, n) {
	let r = [], i = {}, a = t.length, o, s;
	for (o = 0; o < a; ++o) s = t[o], i[s] = o, r.push({
		value: s,
		major: !1
	});
	return a === 0 || !n ? r : DC(e, r, i, n);
}
var kC = class extends Qb {
	static id = "time";
	static defaults = {
		bounds: "data",
		adapters: {},
		time: {
			parser: !1,
			unit: !1,
			round: !1,
			isoWeekday: !1,
			minUnit: "millisecond",
			displayFormats: {}
		},
		ticks: {
			source: "auto",
			callback: !1,
			major: { enabled: !1 }
		}
	};
	constructor(e) {
		super(e), this._cache = {
			data: [],
			labels: [],
			all: []
		}, this._unit = "day", this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0;
	}
	init(e, t = {}) {
		let n = e.time ||= {}, r = this._adapter = new Iy._date(e.adapters.date);
		r.init(t), Mh(n.displayFormats, r.formats()), this._parseOpts = {
			parser: n.parser,
			round: n.round,
			isoWeekday: n.isoWeekday
		}, super.init(e), this._normalized = t.normalized;
	}
	parse(e, t) {
		return e === void 0 ? null : SC(this, e);
	}
	beforeLayout() {
		super.beforeLayout(), this._cache = {
			data: [],
			labels: [],
			all: []
		};
	}
	determineDataLimits() {
		let e = this.options, t = this._adapter, n = e.time.unit || "day", { min: r, max: i, minDefined: a, maxDefined: o } = this.getUserBounds();
		function s(e) {
			!a && !isNaN(e.min) && (r = Math.min(r, e.min)), !o && !isNaN(e.max) && (i = Math.max(i, e.max));
		}
		a && o || (s(this._getLabelBounds()), (e.bounds !== "ticks" || e.ticks.source !== "labels") && s(this.getMinMax(!1))), r = wh(r) && !isNaN(r) ? r : +t.startOf(Date.now(), n), i = wh(i) && !isNaN(i) ? i : +t.endOf(Date.now(), n) + 1, this.min = Math.min(r, i - 1), this.max = Math.max(r + 1, i);
	}
	_getLabelBounds() {
		let e = this.getLabelTimestamps(), t = Infinity, n = -Infinity;
		return e.length && (t = e[0], n = e[e.length - 1]), {
			min: t,
			max: n
		};
	}
	buildTicks() {
		let e = this.options, t = e.time, n = e.ticks, r = n.source === "labels" ? this.getLabelTimestamps() : this._generate();
		e.bounds === "ticks" && r.length && (this.min = this._userMin || r[0], this.max = this._userMax || r[r.length - 1]);
		let i = this.min, a = this.max, o = bg(r, i, a);
		return this._unit = t.unit || (n.autoSkip ? CC(t.minUnit, this.min, this.max, this._getLabelCapacity(i)) : wC(this, o.length, t.minUnit, this.min, this.max)), this._majorUnit = !n.major.enabled || this._unit === "year" ? void 0 : TC(this._unit), this.initOffsets(r), e.reverse && o.reverse(), OC(this, o, this._majorUnit);
	}
	afterAutoSkip() {
		this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((e) => +e.value));
	}
	initOffsets(e = []) {
		let t = 0, n = 0, r, i;
		this.options.offset && e.length && (r = this.getDecimalForValue(e[0]), t = e.length === 1 ? 1 - r : (this.getDecimalForValue(e[1]) - r) / 2, i = this.getDecimalForValue(e[e.length - 1]), n = e.length === 1 ? i : (i - this.getDecimalForValue(e[e.length - 2])) / 2);
		let a = e.length < 3 ? .5 : .25;
		t = mg(t, 0, a), n = mg(n, 0, a), this._offsets = {
			start: t,
			end: n,
			factor: 1 / (t + 1 + n)
		};
	}
	_generate() {
		let e = this._adapter, t = this.min, n = this.max, r = this.options, i = r.time, a = i.unit || CC(i.minUnit, t, n, this._getLabelCapacity(t)), o = Z(r.ticks.stepSize, 1), s = a === "week" && i.isoWeekday, c = rg(s) || s === !0, l = {}, u = t, d, f;
		if (c && (u = +e.startOf(u, "isoWeek", s)), u = +e.startOf(u, c ? "day" : a), e.diff(n, t, a) > 1e5 * o) throw Error(t + " and " + n + " are too far apart with stepSize of " + o + " " + a);
		let p = r.ticks.source === "data" && this.getDataTimestamps();
		for (d = u, f = 0; d < n; d = +e.add(d, o, a), f++) EC(l, d, p);
		return (d === n || r.bounds === "ticks" || f === 1) && EC(l, d, p), Object.keys(l).sort(xC).map((e) => +e);
	}
	getLabelForValue(e) {
		let t = this._adapter, n = this.options.time;
		return n.tooltipFormat ? t.format(e, n.tooltipFormat) : t.format(e, n.displayFormats.datetime);
	}
	format(e, t) {
		let n = this.options.time.displayFormats, r = this._unit, i = t || n[r];
		return this._adapter.format(e, i);
	}
	_tickFormatFunction(e, t, n, r) {
		let i = this.options, a = i.ticks.callback;
		if (a) return Q(a, [
			e,
			t,
			n
		], this);
		let o = i.time.displayFormats, s = this._unit, c = this._majorUnit, l = s && o[s], u = c && o[c], d = n[t], f = c && u && d && d.major;
		return this._adapter.format(e, r || (f ? u : l));
	}
	generateTickLabels(e) {
		let t, n, r;
		for (t = 0, n = e.length; t < n; ++t) r = e[t], r.label = this._tickFormatFunction(r.value, t, e);
	}
	getDecimalForValue(e) {
		return e === null ? NaN : (e - this.min) / (this.max - this.min);
	}
	getPixelForValue(e) {
		let t = this._offsets, n = this.getDecimalForValue(e);
		return this.getPixelForDecimal((t.start + n) * t.factor);
	}
	getValueForPixel(e) {
		let t = this._offsets, n = this.getDecimalForPixel(e) / t.factor - t.end;
		return this.min + n * (this.max - this.min);
	}
	_getLabelSize(e) {
		let t = this.options.ticks, n = this.ctx.measureText(e).width, r = og(this.isHorizontal() ? t.maxRotation : t.minRotation), i = Math.cos(r), a = Math.sin(r), o = this._resolveTickFontOptions(0).size;
		return {
			w: n * i + o * a,
			h: n * a + o * i
		};
	}
	_getLabelCapacity(e) {
		let t = this.options.time, n = t.displayFormats, r = n[t.unit] || n.millisecond, i = this._tickFormatFunction(e, 0, OC(this, [e], this._majorUnit), r), a = this._getLabelSize(i), o = Math.floor(this.isHorizontal() ? this.width / a.w : this.height / a.h) - 1;
		return o > 0 ? o : 1;
	}
	getDataTimestamps() {
		let e = this._cache.data || [], t, n;
		if (e.length) return e;
		let r = this.getMatchingVisibleMetas();
		if (this._normalized && r.length) return this._cache.data = r[0].controller.getAllParsedValues(this);
		for (t = 0, n = r.length; t < n; ++t) e = e.concat(r[t].controller.getAllParsedValues(this));
		return this._cache.data = this.normalize(e);
	}
	getLabelTimestamps() {
		let e = this._cache.labels || [], t, n;
		if (e.length) return e;
		let r = this.getLabels();
		for (t = 0, n = r.length; t < n; ++t) e.push(SC(this, r[t]));
		return this._cache.labels = this._normalized ? e : this.normalize(e);
	}
	normalize(e) {
		return wg(e.sort(xC));
	}
};
function AC(e, t, n) {
	let r = 0, i = e.length - 1, a, o, s, c;
	n ? (t >= e[r].pos && t <= e[i].pos && ({lo: r, hi: i} = vg(e, "pos", t)), {pos: a, time: s} = e[r], {pos: o, time: c} = e[i]) : (t >= e[r].time && t <= e[i].time && ({lo: r, hi: i} = vg(e, "time", t)), {time: a, pos: s} = e[r], {time: o, pos: c} = e[i]);
	let l = o - a;
	return l ? s + (c - s) * (t - a) / l : s;
}
// src/chart-library.tsx
(class extends kC {
	static id = "timeseries";
	static defaults = kC.defaults;
	constructor(e) {
		super(e), this._table = [], this._minPos = void 0, this._tableRange = void 0;
	}
	initOffsets() {
		let e = this._getTimestampsForTable(), t = this._table = this.buildLookupTable(e);
		this._minPos = AC(t, this.min), this._tableRange = AC(t, this.max) - this._minPos, super.initOffsets(e);
	}
	buildLookupTable(e) {
		let { min: t, max: n } = this, r = [], i = [], a, o, s, c, l;
		for (a = 0, o = e.length; a < o; ++a) c = e[a], c >= t && c <= n && r.push(c);
		if (r.length < 2) return [{
			time: t,
			pos: 0
		}, {
			time: n,
			pos: 1
		}];
		for (a = 0, o = r.length; a < o; ++a) l = r[a + 1], s = r[a - 1], c = r[a], Math.round((l + s) / 2) !== c && i.push({
			time: c,
			pos: a / (o - 1)
		});
		return i;
	}
	_generate() {
		let e = this.min, t = this.max, n = super.getDataTimestamps();
		return n.includes(e) && n.length || n.splice(0, 0, e), n.includes(t) && n.length !== 1 || n.push(t), n.sort((e, t) => e - t);
	}
	_getTimestampsForTable() {
		let e = this._cache.all || [];
		if (e.length) return e;
		let t = this.getDataTimestamps(), n = this.getLabelTimestamps();
		return e = t.length && n.length ? this.normalize(t.concat(n)) : t.length ? t : n, e = this._cache.all = e, e;
	}
	getDecimalForValue(e) {
		return (AC(this._table, e) - this._minPos) / this._tableRange;
	}
	getValueForPixel(e) {
		let t = this._offsets, n = this.getDecimalForPixel(e) / t.factor - t.end;
		return AC(this._table, n * this._tableRange + this._minPos, !0);
	}
}), Bx.register(Ny, fS, KS, XS, Py, eS, nS, xS, VS);
var jC = [
	"#8b9dff",
	"#56d6ac",
	"#ffc66d",
	"#ef93d1",
	"#70c8f2",
	"#d7b0ff"
], MC = rp({
	root: "DataChart",
	components: [np({
		name: "DataChart",
		description: "Displays a bar or line chart with named numeric series.",
		props: z({
			title: Sm.shape.title,
			chart_type: Sm.shape.chart_type,
			labels: Sm.shape.labels,
			series: Sm.shape.series
		}),
		component: function({ props: e }) {
			let t = (0, B.useRef)(null), { title: n, chart_type: r, labels: i, series: a } = e;
			return (0, B.useEffect)(() => {
				let e = t.current;
				if (!e) return;
				let n = e.parentElement, o = n ? getComputedStyle(n).color : "#dedede", s = new Bx(e, {
					type: r,
					data: {
						labels: [...i],
						datasets: a.map((e, t) => ({
							label: e.name,
							data: [...e.values],
							backgroundColor: jC[t % jC.length],
							borderColor: jC[t % jC.length],
							borderWidth: r === "bar" ? 0 : 2,
							pointRadius: i.length > 40 ? 0 : 3,
							pointHitRadius: 8,
							tension: 0
						}))
					},
					options: {
						responsive: !0,
						maintainAspectRatio: !1,
						animation: !1,
						interaction: {
							mode: "index",
							intersect: !1
						},
						plugins: {
							legend: {
								display: !0,
								position: "bottom",
								labels: {
									color: o,
									usePointStyle: !0,
									padding: 18
								}
							},
							tooltip: { enabled: !0 }
						},
						scales: {
							x: {
								ticks: {
									color: o,
									autoSkip: !0,
									maxRotation: 45
								},
								grid: { display: !1 },
								border: { color: "rgba(128, 128, 128, 0.4)" }
							},
							y: {
								beginAtZero: !0,
								ticks: { color: o },
								grid: { color: "rgba(128, 128, 128, 0.2)" },
								border: { display: !1 }
							}
						}
					}
				});
				return () => s.destroy();
			}, [
				r,
				i,
				a
			]), /* @__PURE__ */ (0, J.jsxs)("figure", {
				className: "gc-chart",
				children: [
					/* @__PURE__ */ (0, J.jsx)("figcaption", { children: n }),
					/* @__PURE__ */ (0, J.jsx)("div", {
						className: "gc-chart-frame",
						children: /* @__PURE__ */ (0, J.jsx)("canvas", {
							ref: t,
							role: "img",
							"aria-label": n,
							children: "Chart values are available in the data table below."
						})
					}),
					/* @__PURE__ */ (0, J.jsxs)("details", {
						className: "gc-chart-data",
						children: [/* @__PURE__ */ (0, J.jsx)("summary", { children: "View chart data" }), /* @__PURE__ */ (0, J.jsx)("div", {
							className: "table-scroll",
							children: /* @__PURE__ */ (0, J.jsxs)("table", { children: [
								/* @__PURE__ */ (0, J.jsxs)("caption", { children: [n, " — data"] }),
								/* @__PURE__ */ (0, J.jsx)("thead", { children: /* @__PURE__ */ (0, J.jsxs)("tr", { children: [/* @__PURE__ */ (0, J.jsx)("th", {
									scope: "col",
									children: "Label"
								}), a.map((e, t) => /* @__PURE__ */ (0, J.jsx)("th", {
									scope: "col",
									children: e.name
								}, t))] }) }),
								/* @__PURE__ */ (0, J.jsx)("tbody", { children: i.map((e, t) => /* @__PURE__ */ (0, J.jsxs)("tr", { children: [/* @__PURE__ */ (0, J.jsx)("th", {
									scope: "row",
									children: e
								}), a.map((e, n) => /* @__PURE__ */ (0, J.jsx)("td", { children: e.values[t] }, n))] }, t)) })
							] })
						})]
					})
				]
			});
		}
	})]
}), NC = rp({
	root: "DataComparison",
	components: [np({
		name: "DataComparison",
		description: "Compares named options against shared criteria.",
		props: z({
			title: Cm.shape.title,
			criteria: Cm.shape.criteria,
			options: Cm.shape.options
		}),
		component: ({ props: e }) => /* @__PURE__ */ (0, J.jsxs)("section", {
			className: "gc-comparison",
			"aria-label": e.title,
			children: [/* @__PURE__ */ (0, J.jsx)("h3", { children: e.title }), /* @__PURE__ */ (0, J.jsx)("div", {
				className: "gc-comparison-scroll",
				role: "region",
				"aria-label": `${e.title} comparison`,
				tabIndex: 0,
				children: /* @__PURE__ */ (0, J.jsxs)("table", { children: [
					/* @__PURE__ */ (0, J.jsx)("caption", {
						className: "gc-comparison-caption",
						children: e.title
					}),
					/* @__PURE__ */ (0, J.jsx)("thead", { children: /* @__PURE__ */ (0, J.jsxs)("tr", { children: [/* @__PURE__ */ (0, J.jsx)("th", {
						scope: "col",
						children: "Criterion"
					}), e.options.map((e, t) => /* @__PURE__ */ (0, J.jsx)("th", {
						scope: "col",
						children: e.name
					}, t))] }) }),
					/* @__PURE__ */ (0, J.jsx)("tbody", { children: e.criteria.map((t, n) => /* @__PURE__ */ (0, J.jsxs)("tr", { children: [/* @__PURE__ */ (0, J.jsx)("th", {
						scope: "row",
						children: t
					}), e.options.map((e, t) => /* @__PURE__ */ (0, J.jsx)("td", { children: e.values[n] || /* @__PURE__ */ (0, J.jsx)("span", {
						className: "gc-comparison-empty",
						"aria-label": "Unspecified",
						children: "—"
					}) }, t))] }, n)) })
				] })
			})]
		})
	})]
}), PC = Object.defineProperty, FC = (e, t, n) => t in e ? PC(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, IC = (e, t) => {
	for (var n in t) PC(e, n, {
		get: t[n],
		enumerable: !0
	});
}, LC = (e, t, n) => FC(e, typeof t == "symbol" ? t : t + "", n), RC = {};
IC(RC, {
	Graph: () => Cw,
	alg: () => ZC
});
var zC = Object.defineProperty, BC = (e, t) => {
	for (var n in t) zC(e, n, {
		get: t[n],
		enumerable: !0
	});
}, VC = class {
	constructor(e) {
		this._isDirected = !0, this._isMultigraph = !1, this._isCompound = !1, this._nodes = {}, this._in = {}, this._preds = {}, this._out = {}, this._sucs = {}, this._edgeObjs = {}, this._edgeLabels = {}, this._nodeCount = 0, this._edgeCount = 0, this._defaultNodeLabelFn = () => {}, this._defaultEdgeLabelFn = () => {}, e && (this._isDirected = "directed" in e ? e.directed : !0, this._isMultigraph = "multigraph" in e && e.multigraph, this._isCompound = "compound" in e && e.compound), this._isCompound && (this._parent = {}, this._children = {}, this._children["\0"] = {});
	}
	isDirected() {
		return this._isDirected;
	}
	isMultigraph() {
		return this._isMultigraph;
	}
	isCompound() {
		return this._isCompound;
	}
	setGraph(e) {
		return this._label = e, this;
	}
	graph() {
		return this._label;
	}
	setDefaultNodeLabel(e) {
		return this._defaultNodeLabelFn = typeof e == "function" ? e : () => e, this;
	}
	nodeCount() {
		return this._nodeCount;
	}
	nodes() {
		return Object.keys(this._nodes);
	}
	sources() {
		return this.nodes().filter((e) => Object.keys(this._in[e]).length === 0);
	}
	sinks() {
		return this.nodes().filter((e) => Object.keys(this._out[e]).length === 0);
	}
	setNodes(e, t) {
		return e.forEach((e) => {
			t === void 0 ? this.setNode(e) : this.setNode(e, t);
		}), this;
	}
	setNode(e, t) {
		return e in this._nodes ? (arguments.length > 1 && (this._nodes[e] = t), this) : (this._nodes[e] = arguments.length > 1 ? t : this._defaultNodeLabelFn(e), this._isCompound && (this._parent[e] = "\0", this._children[e] = {}, this._children["\0"][e] = !0), this._in[e] = {}, this._preds[e] = {}, this._out[e] = {}, this._sucs[e] = {}, ++this._nodeCount, this);
	}
	node(e) {
		return this._nodes[e];
	}
	hasNode(e) {
		return e in this._nodes;
	}
	removeNode(e) {
		if (e in this._nodes) {
			let t = (e) => this.removeEdge(this._edgeObjs[e]);
			delete this._nodes[e], this._isCompound && (this._removeFromParentsChildList(e), delete this._parent[e], this.children(e).forEach((e) => {
				this.setParent(e);
			}), delete this._children[e]), Object.keys(this._in[e]).forEach(t), delete this._in[e], delete this._preds[e], Object.keys(this._out[e]).forEach(t), delete this._out[e], delete this._sucs[e], --this._nodeCount;
		}
		return this;
	}
	setParent(e, t) {
		if (!this._isCompound) throw Error("Cannot set parent in a non-compound graph");
		if (t === void 0) t = "\0";
		else {
			t += "";
			for (let n = t; n !== void 0; n = this.parent(n)) if (n === e) throw Error("Setting " + t + " as parent of " + e + " would create a cycle");
			this.setNode(t);
		}
		return this.setNode(e), this._removeFromParentsChildList(e), this._parent[e] = t, this._children[t][e] = !0, this;
	}
	parent(e) {
		if (this._isCompound) {
			let t = this._parent[e];
			if (t !== "\0") return t;
		}
	}
	children(e = "\0") {
		if (this._isCompound) {
			let t = this._children[e];
			if (t) return Object.keys(t);
		} else {
			if (e === "\0") return this.nodes();
			if (this.hasNode(e)) return [];
		}
		return [];
	}
	predecessors(e) {
		let t = this._preds[e];
		if (t) return Object.keys(t);
	}
	successors(e) {
		let t = this._sucs[e];
		if (t) return Object.keys(t);
	}
	neighbors(e) {
		let t = this.predecessors(e);
		if (t) {
			let n = new Set(t), r = this.successors(e);
			if (r) for (let e of r) n.add(e);
			return Array.from(n.values());
		}
	}
	isLeaf(e) {
		let t;
		return t = this.isDirected() ? this.successors(e) : this.neighbors(e), (t?.length ?? 0) === 0;
	}
	filterNodes(e) {
		let t = new this.constructor({
			directed: this._isDirected,
			multigraph: this._isMultigraph,
			compound: this._isCompound
		});
		t.setGraph(this.graph()), Object.entries(this._nodes).forEach(([n, r]) => {
			e(n) && t.setNode(n, r);
		}), Object.values(this._edgeObjs).forEach((e) => {
			t.hasNode(e.v) && t.hasNode(e.w) && t.setEdge(e, this.edge(e));
		});
		let n = {}, r = (e) => {
			let i = this.parent(e);
			return !i || t.hasNode(i) ? (n[e] = i, i) : i in n ? n[i] : r(i);
		};
		return this._isCompound && t.nodes().forEach((e) => t.setParent(e, r(e))), t;
	}
	setDefaultEdgeLabel(e) {
		return this._defaultEdgeLabelFn = typeof e == "function" ? e : () => e, this;
	}
	edgeCount() {
		return this._edgeCount;
	}
	edges() {
		return Object.values(this._edgeObjs);
	}
	setPath(e, t) {
		return e.reduce((e, n) => (t === void 0 ? this.setEdge(e, n) : this.setEdge(e, n, t), n)), this;
	}
	setEdge(e, t, n, r) {
		let i, a, o, s, c = !1;
		typeof e == "object" && e && "v" in e ? (i = e.v, a = e.w, o = e.name, arguments.length === 2 && (s = t, c = !0)) : (i = e, a = t, o = r, arguments.length > 2 && (s = n, c = !0)), i = "" + i, a = "" + a, o !== void 0 && (o = "" + o);
		let l = WC(this._isDirected, i, a, o);
		if (l in this._edgeLabels) return c && (this._edgeLabels[l] = s), this;
		if (o !== void 0 && !this._isMultigraph) throw Error("Cannot set a named edge when isMultigraph = false");
		this.setNode(i), this.setNode(a), this._edgeLabels[l] = c ? s : this._defaultEdgeLabelFn(i, a, o);
		let u = GC(this._isDirected, i, a, o);
		return i = u.v, a = u.w, Object.freeze(u), this._edgeObjs[l] = u, HC(this._preds[a], i), HC(this._sucs[i], a), this._in[a][l] = u, this._out[i][l] = u, this._edgeCount++, this;
	}
	edge(e, t, n) {
		let r = arguments.length === 1 ? KC(this._isDirected, e) : WC(this._isDirected, e, t, n);
		return this._edgeLabels[r];
	}
	edgeAsObj(e, t, n) {
		let r = arguments.length === 1 ? this.edge(e) : this.edge(e, t, n);
		return typeof r != "object" || !r ? { label: r } : r;
	}
	hasEdge(e, t, n) {
		return (arguments.length === 1 ? KC(this._isDirected, e) : WC(this._isDirected, e, t, n)) in this._edgeLabels;
	}
	removeEdge(e, t, n) {
		let r = arguments.length === 1 ? KC(this._isDirected, e) : WC(this._isDirected, e, t, n), i = this._edgeObjs[r];
		if (i) {
			let e = i.v, t = i.w;
			delete this._edgeLabels[r], delete this._edgeObjs[r], UC(this._preds[t], e), UC(this._sucs[e], t), delete this._in[t][r], delete this._out[e][r], this._edgeCount--;
		}
		return this;
	}
	inEdges(e, t) {
		return this.isDirected() ? this.filterEdges(this._in[e], e, t) : this.nodeEdges(e, t);
	}
	outEdges(e, t) {
		return this.isDirected() ? this.filterEdges(this._out[e], e, t) : this.nodeEdges(e, t);
	}
	nodeEdges(e, t) {
		if (e in this._nodes) return this.filterEdges({
			...this._in[e],
			...this._out[e]
		}, e, t);
	}
	_removeFromParentsChildList(e) {
		delete this._children[this._parent[e]][e];
	}
	filterEdges(e, t, n) {
		if (!e) return;
		let r = Object.values(e);
		return n ? r.filter((e) => e.v === t && e.w === n || e.v === n && e.w === t) : r;
	}
};
function HC(e, t) {
	e[t] ? e[t]++ : e[t] = 1;
}
function UC(e, t) {
	e[t] !== void 0 && !--e[t] && delete e[t];
}
function WC(e, t, n, r) {
	let i = "" + t, a = "" + n;
	if (!e && i > a) {
		let e = i;
		i = a, a = e;
	}
	return i + "" + a + "" + (r === void 0 ? "\0" : r);
}
function GC(e, t, n, r) {
	let i = "" + t, a = "" + n;
	if (!e && i > a) {
		let e = i;
		i = a, a = e;
	}
	let o = {
		v: i,
		w: a
	};
	return r && (o.name = r), o;
}
function KC(e, t) {
	return WC(e, t.v, t.w, t.name);
}
BC({}, {
	read: () => XC,
	write: () => qC
});
function qC(e) {
	let t = {
		options: {
			directed: e.isDirected(),
			multigraph: e.isMultigraph(),
			compound: e.isCompound()
		},
		nodes: JC(e),
		edges: YC(e)
	}, n = e.graph();
	return n !== void 0 && (t.value = structuredClone(n)), t;
}
function JC(e) {
	return e.nodes().map((t) => {
		let n = e.node(t), r = e.parent(t), i = { v: t };
		return n !== void 0 && (i.value = n), r !== void 0 && (i.parent = r), i;
	});
}
function YC(e) {
	return e.edges().map((t) => {
		let n = e.edge(t), r = {
			v: t.v,
			w: t.w
		};
		return t.name !== void 0 && (r.name = t.name), n !== void 0 && (r.value = n), r;
	});
}
function XC(e) {
	let t = new VC(e.options);
	return e.value !== void 0 && t.setGraph(e.value), e.nodes.forEach((e) => {
		t.setNode(e.v, e.value), e.parent && t.setParent(e.v, e.parent);
	}), e.edges.forEach((e) => {
		t.setEdge({
			v: e.v,
			w: e.w,
			name: e.name
		}, e.value);
	}), t;
}
var ZC = {};
BC(ZC, {
	CycleException: () => fw,
	bellmanFord: () => $C,
	components: () => tw,
	dijkstra: () => iw,
	dijkstraAll: () => ow,
	findCycles: () => cw,
	floydWarshall: () => uw,
	isAcyclic: () => mw,
	postorder: () => vw,
	preorder: () => yw,
	prim: () => bw,
	shortestPaths: () => xw,
	tarjan: () => sw,
	topsort: () => pw
});
var QC = () => 1;
function $C(e, t, n, r) {
	return ew(e, String(t), n || QC, r || function(t) {
		return e.outEdges(t) ?? [];
	});
}
function ew(e, t, n, r) {
	let i = {}, a, o = 0, s = e.nodes(), c = function(e) {
		let t = i[e.v], r = i[e.w];
		if (!t || !r) return;
		let o = n(e);
		t.distance + o < r.distance && (i[e.w] = {
			distance: t.distance + o,
			predecessor: e.v
		}, a = !0);
	}, l = function() {
		s.forEach(function(e) {
			r(e).forEach(function(t) {
				let n = t.v === e ? t.v : t.w, r = n === t.v ? t.w : t.v;
				c({
					v: n,
					w: r
				});
			});
		});
	};
	s.forEach(function(e) {
		i[e] = {
			distance: e === t ? 0 : Infinity,
			predecessor: ""
		};
	});
	let u = s.length;
	for (let e = 1; e < u && (a = !1, o++, l(), a); e++);
	if (o === u - 1 && (a = !1, l(), a)) throw Error("The graph contains a negative weight cycle");
	return i;
}
function tw(e) {
	let t = {}, n = [], r;
	function i(n) {
		var a, o;
		n in t || (t[n] = !0, r.push(n), (a = e.successors(n)) == null || a.forEach(i), (o = e.predecessors(n)) == null || o.forEach(i));
	}
	return e.nodes().forEach(function(e) {
		r = [], i(e), r.length && n.push(r);
	}), n;
}
var nw = class {
	constructor() {
		this._arr = [], this._keyIndices = {};
	}
	size() {
		return this._arr.length;
	}
	keys() {
		return this._arr.map((e) => e.key);
	}
	has(e) {
		return e in this._keyIndices;
	}
	priority(e) {
		let t = this._keyIndices[e];
		if (t !== void 0) return this._arr[t].priority;
	}
	min() {
		if (this.size() === 0) throw Error("Queue underflow");
		return this._arr[0].key;
	}
	add(e, t) {
		let n = this._keyIndices, r = String(e);
		if (!(r in n)) {
			let e = this._arr, i = e.length;
			return n[r] = i, e.push({
				key: r,
				priority: t
			}), this._decrease(i), !0;
		}
		return !1;
	}
	removeMin() {
		if (this.size() === 0) throw Error("Queue underflow");
		this._swap(0, this._arr.length - 1);
		let e = this._arr.pop();
		return delete this._keyIndices[e.key], this._heapify(0), e.key;
	}
	decrease(e, t) {
		let n = this._keyIndices[e];
		if (n === void 0) throw Error(`Key not found: ${e}`);
		let r = this._arr[n].priority;
		if (t > r) throw Error(`New priority is greater than current priority. Key: ${e} Old: ${r} New: ${t}`);
		this._arr[n].priority = t, this._decrease(n);
	}
	_heapify(e) {
		let t = this._arr, n = 2 * e, r = n + 1, i = e;
		n < t.length && (i = t[n].priority < t[i].priority ? n : i, r < t.length && (i = t[r].priority < t[i].priority ? r : i), i !== e && (this._swap(e, i), this._heapify(i)));
	}
	_decrease(e) {
		let t = this._arr, n = t[e].priority, r;
		for (; e !== 0 && (r = e >> 1, !(t[r].priority < n));) this._swap(e, r), e = r;
	}
	_swap(e, t) {
		let n = this._arr, r = this._keyIndices, i = n[e], a = n[t];
		n[e] = a, n[t] = i, r[a.key] = e, r[i.key] = t;
	}
}, rw = () => 1;
function iw(e, t, n, r) {
	return aw(e, String(t), n || rw, r || function(t) {
		return e.outEdges(t) ?? [];
	});
}
function aw(e, t, n, r) {
	let i = {}, a = new nw(), o, s, c = function(e) {
		let t = e.v === o ? e.w : e.v, r = i[t];
		if (!r) return;
		let c = n(e), l = s.distance + c;
		if (c < 0) throw Error("dijkstra does not allow negative edge weights. Bad edge: " + e + " Weight: " + c);
		l < r.distance && (r.distance = l, r.predecessor = o, a.decrease(t, l));
	};
	for (e.nodes().forEach(function(e) {
		let n = e === t ? 0 : Infinity;
		i[e] = {
			distance: n,
			predecessor: ""
		}, a.add(e, n);
	}); a.size() > 0;) {
		o = a.removeMin();
		let e = i[o];
		if (!e || e.distance === Infinity) break;
		s = e, r(o).forEach(c);
	}
	return i;
}
function ow(e, t, n) {
	return e.nodes().reduce(function(r, i) {
		return r[i] = iw(e, i, t, n), r;
	}, {});
}
function sw(e) {
	let t = 0, n = [], r = {}, i = [];
	function a(o) {
		var s;
		let c = r[o] = {
			onStack: !0,
			lowlink: t,
			index: t++
		};
		if (n.push(o), (s = e.successors(o)) == null || s.forEach(function(e) {
			if (e in r) {
				let t = r[e];
				t != null && t.onStack && (c.lowlink = Math.min(c.lowlink, t.index));
			} else {
				a(e);
				let t = r[e];
				t && (c.lowlink = Math.min(c.lowlink, t.lowlink));
			}
		}), c.lowlink === c.index) {
			let e = [], t;
			do {
				t = n.pop();
				let i = r[t];
				i && (i.onStack = !1), e.push(t);
			} while (o !== t);
			i.push(e);
		}
	}
	return e.nodes().forEach(function(e) {
		e in r || a(e);
	}), i;
}
function cw(e) {
	return sw(e).filter(function(t) {
		let n = t[0];
		return n ? t.length > 1 || t.length === 1 && (e.outEdges(n, n) ?? []).length > 0 : !1;
	});
}
var lw = () => 1;
function uw(e, t, n) {
	return dw(e, t || lw, n || function(t) {
		return e.outEdges(t) ?? [];
	});
}
function dw(e, t, n) {
	let r = {}, i = e.nodes();
	return i.forEach(function(e) {
		let a = {};
		r[e] = a, a[e] = {
			distance: 0,
			predecessor: ""
		}, i.forEach(function(t) {
			e !== t && (a[t] = {
				distance: Infinity,
				predecessor: ""
			});
		}), n(e).forEach(function(n) {
			let r = n.v === e ? n.w : n.v, i = t(n);
			a[r] = {
				distance: i,
				predecessor: e
			};
		});
	}), i.forEach(function(e) {
		let t = r[e];
		t && i.forEach(function(n) {
			let a = r[n];
			a && i.forEach(function(n) {
				let r = a[e], i = t[n], o = a[n];
				if (r && i && o) {
					let e = r.distance + i.distance;
					e < o.distance && (o.distance = e, o.predecessor = i.predecessor);
				}
			});
		});
	}), r;
}
var fw = class extends Error {
	constructor(e) {
		super(e), this.name = "CycleException";
	}
};
function pw(e) {
	let t = {}, n = {}, r = [];
	function i(a) {
		var o;
		if (a in n) throw new fw();
		a in t || (n[a] = !0, t[a] = !0, (o = e.predecessors(a)) == null || o.forEach(i), delete n[a], r.push(a));
	}
	if (e.sinks().forEach(i), Object.keys(t).length !== e.nodeCount()) throw new fw();
	return r;
}
function mw(e) {
	try {
		pw(e);
	} catch (e) {
		if (e instanceof fw) return !1;
		throw e;
	}
	return !0;
}
function hw(e, t, n, r, i) {
	Array.isArray(t) || (t = [t]);
	let a = ((t) => (e.isDirected() ? e.successors(t) : e.neighbors(t)) ?? []), o = {};
	return t.forEach(function(t) {
		if (!e.hasNode(t)) throw Error("Graph does not have node: " + t);
		i = gw(e, t, n === "post", o, a, r, i);
	}), i;
}
function gw(e, t, n, r, i, a, o) {
	return t in r || (r[t] = !0, n || (o = a(o, t)), i(t).forEach(function(t) {
		o = gw(e, t, n, r, i, a, o);
	}), n && (o = a(o, t))), o;
}
function _w(e, t, n) {
	return hw(e, t, n, function(e, t) {
		return e.push(t), e;
	}, []);
}
function vw(e, t) {
	return _w(e, t, "post");
}
function yw(e, t) {
	return _w(e, t, "pre");
}
function bw(e, t) {
	var n;
	let r = new VC(), i = {}, a = new nw(), o;
	function s(e) {
		let n = e.v === o ? e.w : e.v, r = a.priority(n);
		if (r !== void 0) {
			let s = t(e);
			s < r && (i[n] = o, a.decrease(n, s));
		}
	}
	if (e.nodeCount() === 0) return r;
	e.nodes().forEach(function(e) {
		a.add(e, Infinity), r.setNode(e);
	});
	let c = e.nodes()[0];
	c !== void 0 && a.decrease(c, 0);
	let l = !1;
	for (; a.size() > 0;) {
		if (o = a.removeMin(), o in i) r.setEdge(o, i[o]);
		else {
			if (l) throw Error("Input graph is not connected: " + e);
			l = !0;
		}
		(n = e.nodeEdges(o)) == null || n.forEach(s);
	}
	return r;
}
function xw(e, t, n, r) {
	return Sw(e, t, n, r ?? ((t) => e.outEdges(t) ?? []));
}
function Sw(e, t, n, r) {
	if (n === void 0) return iw(e, t, n, r);
	let i = !1, a = e.nodes();
	for (let o = 0; o < a.length; o++) {
		let s = a[o];
		if (s === void 0) continue;
		let c = r(s);
		for (let e = 0; e < c.length; e++) {
			let t = c[e];
			if (!t) continue;
			let r = t.v === s ? t.v : t.w;
			n({
				v: r,
				w: r === t.v ? t.w : t.v
			}) < 0 && (i = !0);
		}
		if (i) return $C(e, t, n, r);
	}
	return iw(e, t, n, r);
}
var Cw = VC;
function ww(e, t, n, r) {
	let i = r;
	for (; e.hasNode(i);) i = zw(r);
	return n.dummy = t, e.setNode(i, n), i;
}
function Tw(e) {
	let t = new Cw().setGraph(e.graph());
	return e.nodes().forEach((n) => t.setNode(n, e.node(n))), e.edges().forEach((n) => {
		let r = t.edge(n.v, n.w) || {
			weight: 0,
			minlen: 1
		}, i = e.edge(n);
		t.setEdge(n.v, n.w, {
			weight: r.weight + i.weight,
			minlen: Math.max(r.minlen, i.minlen)
		});
	}), t;
}
function Ew(e) {
	let t = new Cw({ multigraph: e.isMultigraph() }).setGraph(e.graph());
	return e.nodes().forEach((n) => {
		e.children(n).length || t.setNode(n, e.node(n));
	}), e.edges().forEach((n) => {
		t.setEdge(n, e.edge(n));
	}), t;
}
function Dw(e, t) {
	let n = e.x, r = e.y, i = t.x - n, a = t.y - r, o = e.width / 2, s = e.height / 2;
	if (!i && !a) throw Error("Not possible to find intersection inside of the rectangle");
	let c, l;
	return i === 0 || Math.abs(a) * o > Math.abs(i) * s ? (a < 0 && (s = -s), c = s * i / a, l = s) : (i < 0 && (o = -o), c = o, l = o * a / i), {
		x: n + c,
		y: r + l
	};
}
function Ow(e) {
	let t = Bw(Fw(e) + 1).map(() => []);
	return e.nodes().forEach((n) => {
		let r = e.node(n), i = r.rank;
		i !== void 0 && (t[i] || (t[i] = []), t[i][r.order] = n);
	}), t;
}
function kw(e) {
	let t = e.nodes().map((t) => {
		let n = e.node(t).rank;
		return n === void 0 ? Number.MAX_VALUE : n;
	}), n = Pw(Math.min, t);
	e.nodes().forEach((t) => {
		let r = e.node(t);
		Object.hasOwn(r, "rank") && (r.rank -= n);
	});
}
function Aw(e) {
	let t = e.nodes().map((t) => e.node(t).rank).filter((e) => e !== void 0), n = Pw(Math.min, t), r = [];
	e.nodes().forEach((t) => {
		let i = e.node(t).rank - n;
		r[i] || (r[i] = []), r[i].push(t);
	});
	let i = 0, a = e.graph().nodeRankFactor;
	Array.from(r).forEach((t, n) => {
		t === void 0 && n % a !== 0 ? --i : t !== void 0 && i && t.forEach((t) => e.node(t).rank += i);
	});
}
function jw(e, t, n, r) {
	let i = {
		width: 0,
		height: 0
	};
	return arguments.length >= 4 && (i.rank = n, i.order = r), ww(e, "border", i, t);
}
function Mw(e, t = Nw) {
	let n = [];
	for (let r = 0; r < e.length; r += t) {
		let i = e.slice(r, r + t);
		n.push(i);
	}
	return n;
}
var Nw = 65535;
function Pw(e, t) {
	return t.length > Nw ? e(...Mw(t).map((t) => e(...t))) : e(...t);
}
function Fw(e) {
	let t = e.nodes().map((t) => {
		let n = e.node(t).rank;
		return n === void 0 ? Number.MIN_VALUE : n;
	});
	return Pw(Math.max, t);
}
function Iw(e, t) {
	let n = {
		lhs: [],
		rhs: []
	};
	return e.forEach((e) => {
		t(e) ? n.lhs.push(e) : n.rhs.push(e);
	}), n;
}
function Lw(e, t) {
	return t();
}
var Rw = 0;
function zw(e) {
	return e + ("" + ++Rw);
}
function Bw(e, t, n = 1) {
	t ?? (t = e, e = 0);
	let r = (e) => e < t;
	n < 0 && (r = (e) => t < e);
	let i = [];
	for (let t = e; r(t); t += n) i.push(t);
	return i;
}
function Vw(e, t) {
	let n = {};
	for (let r of t) e[r] !== void 0 && (n[r] = e[r]);
	return n;
}
function Hw(e, t) {
	let n;
	return n = typeof t == "string" ? (e) => e[t] : t, Object.entries(e).reduce((e, [t, r]) => (e[t] = n(r, t), e), {});
}
function Uw(e, t) {
	return e.reduce((e, n, r) => (e[n] = t[r], e), {});
}
var Ww = "\0";
function Gw(e, t, n) {
	if (!(e && t && n && t.dummy === "edge" && n.dummy === "edge" && t.edgeObj && n.edgeObj && e[t.edgeObj.v] && e[n.edgeObj.v] && e[t.edgeObj.w] && e[n.edgeObj.w])) return 0;
	let r = !0;
	t.edgeObj.w === n.edgeObj.w && (r = !1);
	let i = r ? e[t.edgeObj.v]?.rank ?? NaN : e[t.edgeObj.w]?.rank ?? NaN, a = Object.entries(e).find((e) => e[1].edgeObj?.v === t.edgeObj.v && e[1].edgeObj?.w === t.edgeObj.w && e[1].rank === i), o = Object.entries(e).find((e) => e[1].edgeObj?.v === n.edgeObj.v && e[1].edgeObj?.w === n.edgeObj.w && e[1].rank === i);
	if (!a || !o) return 0;
	let s = a[1].order ?? NaN, c = o[1].order ?? NaN;
	return isNaN(s - c) ? 0 : s - c;
}
var Kw = class {
	constructor() {
		LC(this, "_sentinel");
		let e = {};
		e._next = e._prev = e, this._sentinel = e;
	}
	dequeue() {
		let e = this._sentinel, t = e._prev;
		if (t !== e) return qw(t), t;
	}
	enqueue(e) {
		let t = this._sentinel;
		e._prev && e._next && qw(e), e._next = t._next, t._next._prev = e, t._next = e, e._prev = t;
	}
	toString() {
		let e = [], t = this._sentinel, n = t._prev;
		for (; n !== t;) e.push(JSON.stringify(n, Jw)), n = n._prev;
		return "[" + e.join(", ") + "]";
	}
};
function qw(e) {
	e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function Jw(e, t) {
	if (e !== "_next" && e !== "_prev") return t;
}
var Yw = Kw, Xw = () => 1;
function Zw(e, t) {
	if (e.nodeCount() <= 1) return [];
	let n = eT(e, t || Xw);
	return Qw(n.graph, n.buckets, n.zeroIdx).flatMap((t) => e.outEdges(t.v, t.w) || []);
}
function Qw(e, t, n) {
	let r = [], i = t[t.length - 1], a = t[0], o;
	for (; e.nodeCount();) {
		for (; o = a.dequeue();) $w(e, t, n, o);
		for (; o = i.dequeue();) $w(e, t, n, o);
		if (e.nodeCount()) {
			for (let i = t.length - 2; i > 0; --i) if (o = t[i]?.dequeue(), o) {
				r = r.concat($w(e, t, n, o, !0) || []);
				break;
			}
		}
	}
	return r;
}
function $w(e, t, n, r, i) {
	let a = [], o = i ? a : void 0;
	return (e.inEdges(r.v) || []).forEach((r) => {
		let o = e.edge(r), s = e.node(r.v);
		i && a.push({
			v: r.v,
			w: r.w
		}), s.out -= o, tT(t, n, s);
	}), (e.outEdges(r.v) || []).forEach((r) => {
		let i = e.edge(r), a = r.w, o = e.node(a);
		o.in -= i, tT(t, n, o);
	}), e.removeNode(r.v), o;
}
function eT(e, t) {
	let n = new Cw(), r = 0, i = 0;
	e.nodes().forEach((e) => {
		n.setNode(e, {
			v: e,
			in: 0,
			out: 0
		});
	}), e.edges().forEach((e) => {
		let a = n.edge(e.v, e.w) || 0, o = t(e), s = a + o;
		n.setEdge(e.v, e.w, s);
		let c = n.node(e.v), l = n.node(e.w);
		i = Math.max(i, c.out += o), r = Math.max(r, l.in += o);
	});
	let a = nT(i + r + 3).map(() => new Yw()), o = r + 1;
	return n.nodes().forEach((e) => {
		tT(a, o, n.node(e));
	}), {
		graph: n,
		buckets: a,
		zeroIdx: o
	};
}
function tT(e, t, n) {
	var r, i, a;
	n.out ? n.in ? (a = e[n.out - n.in + t]) == null || a.enqueue(n) : (i = e[e.length - 1]) == null || i.enqueue(n) : (r = e[0]) == null || r.enqueue(n);
}
function nT(e) {
	let t = [];
	for (let n = 0; n < e; n++) t.push(n);
	return t;
}
function rT(e, t) {
	(e.graph().acyclicer === "greedy" ? Zw(e, n(e)) : iT(e, t ?? null)).forEach((t) => {
		let n = e.edge(t);
		e.removeEdge(t), n.forwardName = t.name, n.reversed = !0, e.setEdge(t.w, t.v, n, zw("rev"));
	});
	function n(e) {
		return (t) => e.edge(t).weight;
	}
}
function iT(e, t) {
	let n = [], r = {}, i = {};
	function a(t) {
		Object.hasOwn(i, t) || (i[t] = !0, r[t] = !0, e.outEdges(t).forEach((e) => {
			Object.hasOwn(r, e.w) ? n.push(e) : a(e.w);
		}), delete r[t]);
	}
	function o(a) {
		var s;
		Object.hasOwn(i, a) || (i[a] = !0, r[a] = !0, (s = e.outEdges(a)) == null || s.forEach((i) => {
			Object.hasOwn(r, i.w) || t.node(a)?.rank > t.node(i.w)?.rank && oT(e, i.w, i) ? n.push(i) : o(i.w);
		}), delete r[a]);
	}
	let s = a;
	return t && typeof t.node == "function" && (s = o), e.sources().forEach(s), e.nodes().forEach(s), n;
}
function aT(e) {
	e.edges().forEach((t) => {
		let n = e.edge(t);
		if (n.reversed) {
			e.removeEdge(t);
			let r = n.forwardName;
			delete n.reversed, delete n.forwardName, e.setEdge(t.w, t.v, n, r);
		}
	});
}
function oT(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	function i(t) {
		if (e.sources().includes(t)) return !0;
		r.add(t);
		for (let a of e.inEdges(t) ?? []) if ((a.v !== n.v || a.w !== n.w) && !r.has(a.v) && i(a.v)) return !0;
		return !1;
	}
	return i(t);
}
function sT(e) {
	e.graph().dummyChains = [], e.edges().forEach((t) => cT(e, t));
}
function cT(e, t) {
	let n = t.v, r = e.node(n).rank, i = t.w, a = e.node(i).rank, o = t.name, s = e.edge(t), c = s.labelRank;
	if (a === r + 1) return;
	e.removeEdge(t);
	let l, u, d = 0;
	for (++r; r < a; ++d, ++r) s.points = [], u = {
		width: 0,
		height: 0,
		edgeLabel: s,
		edgeObj: t,
		rank: r
	}, l = ww(e, "edge", u, "_d"), r === c && (u.width = s.width, u.height = s.height, u.dummy = "edge-label", u.labelpos = s.labelpos), e.setEdge(n, l, { weight: s.weight }, o), d === 0 && e.graph().dummyChains.push(l), n = l;
	e.setEdge(n, i, { weight: s.weight }, o);
}
function lT(e) {
	e.graph().dummyChains.forEach((t) => {
		let n = e.node(t), r = n.edgeLabel, i;
		for (e.setEdge(n.edgeObj, r); n.dummy;) i = e.successors(t)[0], e.removeNode(t), r.points.push({
			x: n.x,
			y: n.y
		}), n.dummy === "edge-label" && (r.x = n.x, r.y = n.y, r.width = n.width, r.height = n.height), t = i, n = e.node(t);
	});
}
function uT(e) {
	let t = {};
	function n(r) {
		let i = e.node(r);
		if (Object.hasOwn(t, r)) return i.rank;
		t[r] = !0;
		let a = e.outEdges(r), o = a ? a.map((t) => t == null ? Infinity : n(t.w) - e.edge(t).minlen) : [], s = Pw(Math.min, o);
		return s === Infinity && (s = 0), i.rank = s;
	}
	e.sources().forEach(n);
}
function dT(e, t) {
	return e.node(t.w).rank - e.node(t.v).rank - e.edge(t).minlen;
}
var fT = pT;
function pT(e) {
	let t = new Cw({ directed: !1 }), n = e.nodes();
	if (n.length === 0) throw Error("Graph must have at least one node");
	let r = n[0], i = e.nodeCount();
	t.setNode(r, {});
	let a, o;
	for (; mT(t, e) < i && (a = hT(t, e), a);) o = t.hasNode(a.v) ? dT(e, a) : -dT(e, a), gT(t, e, o);
	return t;
}
function mT(e, t) {
	function n(r) {
		let i = t.nodeEdges(r);
		i && i.forEach((i) => {
			let a = i.v, o = r === a ? i.w : a;
			!e.hasNode(o) && !dT(t, i) && (e.setNode(o, {}), e.setEdge(r, o, {}), n(o));
		});
	}
	return e.nodes().forEach(n), e.nodeCount();
}
function hT(e, t) {
	return t.edges().reduce((n, r) => {
		let i = Infinity;
		return e.hasNode(r.v) !== e.hasNode(r.w) && (i = dT(t, r)), i < n[0] ? [i, r] : n;
	}, [Infinity, null])[1];
}
function gT(e, t, n) {
	e.nodes().forEach((e) => t.node(e).rank += n);
}
var { preorder: _T, postorder: vT } = ZC, yT = bT;
bT.initLowLimValues = wT, bT.initCutValues = xT, bT.calcCutValue = CT, bT.leaveEdge = ET, bT.enterEdge = DT, bT.exchangeEdges = OT;
function bT(e) {
	e = Tw(e), uT(e);
	let t = fT(e);
	wT(t), xT(t, e);
	let n, r;
	for (; n = ET(t);) r = DT(t, e, n), OT(t, e, n, r);
}
function xT(e, t) {
	let n = vT(e, e.nodes());
	n = n.slice(0, n.length - 1), n.forEach((n) => ST(e, t, n));
}
function ST(e, t, n) {
	let r = e.node(n).parent, i = e.edge(n, r);
	i.cutvalue = CT(e, t, n);
}
function CT(e, t, n) {
	let r = e.node(n).parent, i = !0, a = t.edge(n, r), o = 0;
	a ||= (i = !1, t.edge(r, n)), o = a.weight;
	let s = t.nodeEdges(n);
	return s && s.forEach((a) => {
		let s = a.v === n, c = s ? a.w : a.v;
		if (c !== r) {
			let r = s === i, l = t.edge(a).weight;
			if (o += r ? l : -l, AT(e, n, c)) {
				let t = e.edge(n, c).cutvalue;
				o += r ? -t : t;
			}
		}
	}), o;
}
function wT(e, t) {
	arguments.length < 2 && (t = e.nodes()[0]), TT(e, {}, 1, t);
}
function TT(e, t, n, r, i) {
	let a = n, o = e.node(r);
	t[r] = !0;
	let s = e.neighbors(r);
	return s && s.forEach((i) => {
		Object.hasOwn(t, i) || (n = TT(e, t, n, i, r));
	}), o.low = a, o.lim = n++, i ? o.parent = i : delete o.parent, n;
}
function ET(e) {
	return e.edges().find((t) => e.edge(t).cutvalue < 0);
}
function DT(e, t, n) {
	let r = n.v, i = n.w;
	t.hasEdge(r, i) || (r = n.w, i = n.v);
	let a = e.node(r), o = e.node(i), s = a, c = !1;
	return a.lim > o.lim && (s = o, c = !0), t.edges().filter((t) => c === jT(e, e.node(t.v), s) && c !== jT(e, e.node(t.w), s)).reduce((e, n) => dT(t, n) < dT(t, e) ? n : e);
}
function OT(e, t, n, r) {
	let i = n.v, a = n.w;
	e.removeEdge(i, a), e.setEdge(r.v, r.w, {}), wT(e), xT(e, t), kT(e, t);
}
function kT(e, t) {
	let n = e.nodes().find((t) => !e.node(t).parent);
	if (!n) return;
	let r = _T(e, [n]);
	r = r.slice(1), r.forEach((n) => {
		let r = e.node(n).parent, i = t.edge(n, r), a = !1;
		i || (i = t.edge(r, n), a = !0), t.node(n).rank = t.node(r).rank + (a ? i.minlen : -i.minlen);
	});
}
function AT(e, t, n) {
	return e.hasEdge(t, n);
}
function jT(e, t, n) {
	return n.low <= t.lim && t.lim <= n.lim;
}
var MT = NT;
function NT(e) {
	let t = e.graph().ranker;
	if (typeof t == "function") return t(e);
	switch (t) {
		case "network-simplex":
			IT(e);
			break;
		case "tight-tree":
			FT(e);
			break;
		case "longest-path":
			PT(e);
			break;
		case "none": break;
		default: IT(e);
	}
}
var PT = uT;
function FT(e) {
	uT(e), fT(e);
}
function IT(e) {
	yT(e);
}
var LT = RT;
function RT(e) {
	let t = BT(e), n = e.graph();
	Array.isArray(n.dummyChains) && n.dummyChains.forEach((n) => {
		let r = e.node(n), i = r.edgeObj, a = zT(e, t, i.v, i.w), o = a.path, s = a.lca, c = 0, l = o[c], u = !0;
		for (; n !== i.w;) {
			if (r = e.node(n), u) {
				for (; (l = o[c]) !== s && e.node(l).maxRank < r.rank;) c++;
				l === s && (u = !1);
			}
			if (!u) {
				for (; c < o.length - 1 && e.node(o[c + 1]).minRank <= r.rank;) c++;
				l = o[c];
			}
			l !== void 0 && e.setParent(n, l), n = e.successors(n)[0];
		}
	});
}
function zT(e, t, n, r) {
	let i = [], a = [], o = Math.min(t[n].low, t[r].low), s = Math.max(t[n].lim, t[r].lim), c;
	c = n;
	do
		c = e.parent(c), i.push(c);
	while (c && (t[c].low > o || s > t[c].lim));
	let l = c, u = r;
	for (; (u = e.parent(u)) !== l;) a.push(u);
	return {
		path: i.concat(a.reverse()),
		lca: l
	};
}
function BT(e) {
	let t = {}, n = 0;
	function r(i) {
		let a = n;
		e.children(i).forEach(r), t[i] = {
			low: a,
			lim: n++
		};
	}
	return e.children(Ww).forEach(r), t;
}
function VT(e) {
	let t = ww(e, "root", {}, "_root"), n = UT(e), r = Object.values(n), i = Pw(Math.max, r) - 1, a = 2 * i + 1;
	e.graph().nestingRoot = t, e.edges().forEach((t) => e.edge(t).minlen *= a);
	let o = WT(e) + 1;
	e.children(Ww).forEach((r) => {
		HT(e, t, a, o, i, n, r);
	}), e.graph().nodeRankFactor = a;
}
function HT(e, t, n, r, i, a, o) {
	let s = e.children(o);
	if (!s.length) {
		o !== t && e.setEdge(t, o, {
			weight: 0,
			minlen: n
		});
		return;
	}
	let c = jw(e, "_bt"), l = jw(e, "_bb"), u = e.node(o);
	e.setParent(c, o), u.borderTop = c, e.setParent(l, o), u.borderBottom = l, s.forEach((s) => {
		HT(e, t, n, r, i, a, s);
		let u = e.node(s), d = u.borderTop ? u.borderTop : s, f = u.borderBottom ? u.borderBottom : s, p = u.borderTop ? r : 2 * r, m = d === f ? i - (a[o] ?? 0) + 1 : 1;
		e.setEdge(c, d, {
			weight: p,
			minlen: m,
			nestingEdge: !0
		}), e.setEdge(f, l, {
			weight: p,
			minlen: m,
			nestingEdge: !0
		});
	}), e.parent(o) || e.setEdge(t, c, {
		weight: 0,
		minlen: i + (a[o] ?? 0)
	});
}
function UT(e) {
	let t = {};
	function n(r, i) {
		let a = e.children(r);
		a && a.length && a.forEach((e) => n(e, i + 1)), t[r] = i;
	}
	return e.children(Ww).forEach((e) => n(e, 1)), t;
}
function WT(e) {
	return e.edges().reduce((t, n) => t + e.edge(n).weight, 0);
}
function GT(e) {
	let t = e.graph();
	e.removeNode(t.nestingRoot), delete t.nestingRoot, e.edges().forEach((t) => {
		e.edge(t).nestingEdge && e.removeEdge(t);
	});
}
var KT = qT;
function qT(e) {
	function t(n) {
		let r = e.children(n), i = e.node(n);
		if (r.length && r.forEach(t), i && Object.hasOwn(i, "minRank")) {
			i.borderLeft = [], i.borderRight = [];
			for (let t = i.minRank, r = i.maxRank + 1; t < r; ++t) JT(e, "borderLeft", "_bl", n, i, t), JT(e, "borderRight", "_br", n, i, t);
		}
	}
	e.children(Ww).forEach(t);
}
function JT(e, t, n, r, i, a) {
	let o = {
		width: 0,
		height: 0,
		rank: a,
		borderType: t
	}, s = i[t][a - 1], c = ww(e, "border", o, n);
	i[t][a] = c, e.setParent(c, r), s && e.setEdge(s, c, { weight: 1 });
}
function YT(e) {
	let t = e.graph().rankdir?.toLowerCase();
	(t === "lr" || t === "rl") && ZT(e);
}
function XT(e) {
	let t = e.graph().rankdir?.toLowerCase();
	(t === "bt" || t === "rl") && $T(e), (t === "lr" || t === "rl") && (tE(e), ZT(e));
}
function ZT(e) {
	e.nodes().forEach((t) => QT(e.node(t))), e.edges().forEach((t) => QT(e.edge(t)));
}
function QT(e) {
	let t = e.width;
	e.width = e.height, e.height = t;
}
function $T(e) {
	e.nodes().forEach((t) => eE(e.node(t))), e.edges().forEach((t) => {
		var n;
		let r = e.edge(t);
		(n = r.points) == null || n.forEach(eE), Object.hasOwn(r, "y") && eE(r);
	});
}
function eE(e) {
	e.y = -e.y;
}
function tE(e) {
	e.nodes().forEach((t) => nE(e.node(t))), e.edges().forEach((t) => {
		var n;
		let r = e.edge(t);
		(n = r.points) == null || n.forEach(nE), Object.hasOwn(r, "x") && nE(r);
	});
}
function nE(e) {
	let t = e.x;
	e.x = e.y, e.y = t;
}
function rE(e, t = null) {
	let n = {}, r = e.nodes().filter((t) => !e.children(t).length), i = r.map((t) => e.node(t).rank), a = Bw(Pw(Math.max, i) + 1).map(() => []);
	function o(t) {
		if (n[t]) return;
		n[t] = !0;
		let r = e.node(t);
		a[r.rank].push(t);
		let i = e.successors(t);
		i && [...i].sort((e, t) => s(e, t)).forEach(o);
	}
	r.sort((t, n) => e.node(t).rank - e.node(n).rank).forEach(o);
	function s(n, r) {
		return Gw(t, e.node(n), e.node(r));
	}
	return a;
}
function iE(e, t) {
	let n = 0;
	for (let r = 1; r < t.length; ++r) n += aE(e, t[r - 1], t[r]);
	return n;
}
function aE(e, t, n) {
	let r = Uw(n, n.map((e, t) => t)), i = t.flatMap((t) => {
		let n = e.outEdges(t);
		return n ? n.map((t) => ({
			pos: r[t.w],
			weight: e.edge(t).weight
		})).sort((e, t) => e.pos - t.pos) : [];
	}), a = 1;
	for (; a < n.length;) a <<= 1;
	let o = 2 * a - 1;
	--a;
	let s = Array(o).fill(0), c = 0;
	return i.forEach((e) => {
		let t = e.pos + a;
		s[t] += e.weight;
		let n = 0;
		for (; t > 0;) t % 2 && (n += s[t + 1]), t = t - 1 >> 1, s[t] += e.weight;
		c += e.weight * n;
	}), c;
}
function oE(e, t = []) {
	return t.map((t) => {
		let n = e.inEdges(t);
		if (!n || !n.length) return { v: t };
		{
			let r = n.reduce((t, n) => {
				let r = e.edge(n), i = e.node(n.v);
				return {
					sum: t.sum + r.weight * i.order,
					weight: t.weight + r.weight
				};
			}, {
				sum: 0,
				weight: 0
			});
			return {
				v: t,
				barycenter: r.sum / r.weight,
				weight: r.weight
			};
		}
	});
}
function sE(e, t) {
	let n = {};
	return e.forEach((e, t) => {
		let r = {
			indegree: 0,
			in: [],
			out: [],
			vs: [e.v],
			i: t
		};
		e.barycenter !== void 0 && (r.barycenter = e.barycenter, r.weight = e.weight), n[e.v] = r;
	}), t.edges().forEach((e) => {
		let t = n[e.v], r = n[e.w];
		t !== void 0 && r !== void 0 && (r.indegree++, t.out.push(r));
	}), cE(Object.values(n).filter((e) => !e.indegree));
}
function cE(e) {
	let t = [];
	function n(e) {
		return (t) => {
			t.merged || (t.barycenter === void 0 || e.barycenter === void 0 || t.barycenter >= e.barycenter) && lE(e, t);
		};
	}
	function r(t) {
		return (n) => {
			n.in.push(t), --n.indegree === 0 && e.push(n);
		};
	}
	for (; e.length;) {
		let i = e.pop();
		t.push(i), i.in.reverse().forEach(n(i)), i.out.forEach(r(i));
	}
	return t.filter((e) => !e.merged).map((e) => Vw(e, [
		"vs",
		"i",
		"barycenter",
		"weight"
	]));
}
function lE(e, t) {
	let n = 0, r = 0;
	e.weight && (n += e.barycenter * e.weight, r += e.weight), t.weight && (n += t.barycenter * t.weight, r += t.weight), e.vs = t.vs.concat(e.vs), e.barycenter = n / r, e.weight = r, e.i = Math.min(t.i, e.i), t.merged = !0;
}
function uE(e, t, n, r, i) {
	let a = {}, o = null, s = null, c = i;
	typeof t == "boolean" ? (c = t, a = {}) : t && (a = t, o = n ?? null, s = r ?? null);
	let l = Iw(e, (e) => Object.hasOwn(e, "barycenter")), u = l.lhs, d = l.rhs.sort((e, t) => t.i - e.i), f = [], p = 0, m = 0, h = 0;
	u.sort(fE(s, o, !!c));
	for (let [e, t] of Object.entries(a)) {
		let n = u.findIndex((t) => t.vs[0] === e);
		u.splice(n + 1, 0, t);
	}
	h = dE(f, d, h), u.forEach((e) => {
		h += e.vs.length, f.push(e.vs), p += e.barycenter * e.weight, m += e.weight, h = dE(f, d, h);
	});
	let g = { vs: f.flat(1) };
	return m && (g.barycenter = p / m, g.weight = m), g;
}
function dE(e, t, n) {
	let r;
	for (; t.length && (r = t[t.length - 1]).i <= n;) t.pop(), e.push(r.vs), n++;
	return n;
}
function fE(e, t, n) {
	return (r, i) => {
		if (r.barycenter < i.barycenter) return -1;
		if (r.barycenter > i.barycenter) return 1;
		if (e && (typeof r.vs[0] == "string" || typeof i.vs[0] == "string")) {
			let n = Gw(t, e.node(r.vs[0]), e.node(i.vs[0]));
			if (n !== 0) return n;
		}
		return n ? i.i - r.i : r.i - i.i;
	};
}
function pE(e, t, n, r, i) {
	var a, o;
	let s = null, c = i;
	typeof r == "boolean" ? (c = r, s = null) : r !== void 0 && (s = r);
	let l = e.children(t), u = e.node(t), d = u ? u.borderLeft : void 0, f = u ? u.borderRight : void 0, p = {};
	d && (l = l.filter((e) => e !== d && e !== f));
	let m = oE(e, l);
	m.forEach((t) => {
		if (e.children(t.v).length) {
			let { result: r } = pE(e, t.v, n, s, c);
			p[t.v] = r, Object.hasOwn(r, "barycenter") && hE(t, r);
		}
	});
	let h = sE(m, n);
	mE(h, p);
	let g = {}, _ = !1;
	for (let t = 0; t < h.length; t++) for (let n = t + 1; n < h.length; n++) if (h[t] && h[n] && (a = h[t]) != null && a.barycenter && (o = h[n]) != null && o.barycenter && h[t]?.barycenter === h[n].barycenter) {
		let r = h[t]?.vs[0] ?? "", i = h[n]?.vs[0] ?? "", a = e.node(r), o = e.node(i);
		if (a.dummy === "edge" && o.dummy === "edge" && a.edgeObj?.v === o.edgeObj?.v && a.edgeObj?.w === o.edgeObj?.w) {
			if (a.edgeLabel.reversed) {
				g[i] = h[t], h.splice(t, 1), t--;
				break;
			}
			g[r] || (g[r] = h[n], h.splice(n, 1), n--);
		} else _ = !0;
	}
	let v = uE(h, g, s, e, c);
	if (d && f) {
		v.vs = [
			d,
			v.vs,
			f
		].flat(1);
		let t = e.predecessors(d);
		if (t && t.length) {
			let n = e.node(t[0]), r = e.predecessors(f), i = e.node(r[0]);
			Object.hasOwn(v, "barycenter") || (v.barycenter = 0, v.weight = 0), v.barycenter = (v.barycenter * v.weight + n.order + i.order) / (v.weight + 2), v.weight += 2;
		}
	}
	return Object.defineProperty(v, "result", {
		value: v,
		enumerable: !1,
		configurable: !0,
		writable: !0
	}), Object.defineProperty(v, "usedBias", {
		value: _,
		enumerable: !1,
		configurable: !0,
		writable: !0
	}), v;
}
function mE(e, t) {
	e.forEach((e) => {
		e.vs = e.vs.flatMap((e) => t[e] ? t[e].vs : e);
	});
}
function hE(e, t) {
	e.barycenter === void 0 ? (e.barycenter = t.barycenter, e.weight = t.weight) : (e.barycenter = (e.barycenter * e.weight + t.barycenter * t.weight) / (e.weight + t.weight), e.weight += t.weight);
}
function gE(e, t, n, r) {
	r ||= e.nodes();
	let i = _E(e), a = new Cw({ compound: !0 }).setGraph({ root: i }).setDefaultNodeLabel((t) => e.node(t));
	return r.forEach((r) => {
		let o = e.node(r), s = e.parent(r);
		if (o.rank === t || o.minRank <= t && t <= o.maxRank) {
			a.setNode(r), a.setParent(r, s || i);
			let c = e[n](r);
			c && c.forEach((t) => {
				let n = t.v === r ? t.w : t.v, i = a.edge(n, r), o = i === void 0 ? 0 : i.weight;
				a.setEdge(n, r, { weight: e.edge(t).weight + o });
			}), Object.hasOwn(o, "minRank") && a.setNode(r, {
				borderLeft: o.borderLeft[t],
				borderRight: o.borderRight[t]
			});
		}
	}), a;
}
function _E(e) {
	let t;
	for (; e.hasNode(t = zw("_root")););
	return t;
}
function vE(e, t, n) {
	let r = {}, i;
	n.forEach((n) => {
		let a = e.parent(n), o, s;
		for (; a;) {
			if (o = e.parent(a), o ? (s = r[o], r[o] = a) : (s = i, i = a), s && s !== a) {
				t.setEdge(s, a);
				return;
			}
			a = o;
		}
	});
}
function yE(e, t = {}, n = null) {
	if (typeof t.customOrder == "function") {
		t.customOrder(e, yE);
		return;
	}
	let r = Fw(e), i = bE(e, Bw(1, r + 1), "inEdges"), a = bE(e, Bw(r - 1, -1, -1), "outEdges"), o = rE(e, n);
	if (SE(e, o), t.disableOptimalOrderHeuristic) return;
	let s = Infinity, c, l = t.constraints || [];
	for (let t = 0, r = 0; r < 4; ++t, ++r) {
		xE(t % 2 ? i : a, t % 4 >= 2, l, n), o = Ow(e);
		let u = iE(e, o);
		u < s ? (r = 0, c = Object.assign({}, o), s = u) : u === s && (c = structuredClone(o));
	}
	SE(e, c);
}
function bE(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = (e, t) => {
		r.has(e) || r.set(e, []), r.get(e).push(t);
	};
	for (let t of e.nodes()) {
		let n = e.node(t);
		if (typeof n.rank == "number" && i(n.rank, t), typeof n.minRank == "number" && typeof n.maxRank == "number") for (let e = n.minRank; e <= n.maxRank; e++) e !== n.rank && i(e, t);
	}
	return t.map(function(t) {
		return gE(e, t, n, r.get(t) || []);
	});
}
function xE(e, t, n, r) {
	let i = !0, a = new Cw();
	e.forEach(function(e) {
		n.forEach((e) => a.setEdge(e.left, e.right));
		let o = e.graph().root, { result: s, usedBias: c } = pE(e, o, a, r, i);
		t && c && (i = !i), s.vs.forEach((t, n) => e.node(t).order = n), vE(e, a, s.vs);
	});
}
function SE(e, t) {
	Object.values(t).forEach((t) => t.forEach((t, n) => e.node(t).order = n));
}
function CE(e, t) {
	let n = {};
	function r(t, r) {
		let i = 0, a = 0, o = t.length, s = r[r.length - 1];
		return r.forEach((t, c) => {
			let l = TE(e, t), u = l ? e.node(l).order : o;
			(l || t === s) && (r.slice(a, c + 1).forEach((t) => {
				let r = e.predecessors(t);
				r && r.forEach((r) => {
					let a = e.node(r), o = a.order;
					(o < i || u < o) && !(a.dummy && e.node(t).dummy) && EE(n, r, t);
				});
			}), a = c + 1, i = u);
		}), r;
	}
	return t.length && t.reduce(r), n;
}
function wE(e, t) {
	let n = {};
	function r(t) {
		return e.node(t)?.dummy === "border";
	}
	if (!e.nodes().some(r)) return n;
	function i(t, r, i, a, o) {
		Bw(r, i).forEach((r) => {
			let i = t[r];
			if (i !== void 0 && e.node(i).dummy) {
				let t = e.predecessors(i);
				t && t.forEach((t) => {
					if (t === void 0) return;
					let r = e.node(t);
					r.dummy && (r.order < a || r.order > o) && EE(n, t, i);
				});
			}
		});
	}
	function a(t, n) {
		let a = -1, o = -1, s = 0;
		return n.forEach((c, l) => {
			if (r(c)) {
				let t = e.predecessors(c);
				if (t && t.length) {
					let r = t[0];
					if (r === void 0) return;
					o = e.node(r).order, i(n, s, l, a, o), s = l, a = o;
				}
			}
			i(n, s, n.length, o, t.length);
		}), n;
	}
	return t.length && t.reduce(a), n;
}
function TE(e, t) {
	if (e.node(t).dummy) {
		let n = e.predecessors(t);
		if (n) return n.find((t) => e.node(t).dummy);
	}
}
function EE(e, t, n) {
	if (t > n) {
		let e = t;
		t = n, n = e;
	}
	let r = e[t];
	r || (e[t] = r = {}), r[n] = !0;
}
function DE(e, t, n) {
	if (t > n) {
		let e = t;
		t = n, n = e;
	}
	let r = e[t];
	return r !== void 0 && Object.hasOwn(r, n);
}
function OE(e, t, n, r, i) {
	let a = {}, o = {}, s = {};
	return t.forEach((e) => {
		e.forEach((e, t) => {
			a[e] = e, o[e] = e, s[e] = t;
		});
	}), t.forEach((t) => {
		let c = -1, l = -1, u = !1, d = t, f = t.findIndex((t) => i?.includes(t) || LE(t, e, i));
		f > 0 && (d = [
			t[f],
			...t.slice(0, f),
			...t.slice(f + 1)
		], u = !0), d.forEach((t) => {
			let d = r(t);
			if (d && d.length) {
				i != null && i.includes(t) && (d = d.filter((t) => LE(t, e, i)));
				let r = d.sort((e, t) => {
					let n = s[e], r = s[t];
					return (n === void 0 ? 0 : n) - (r === void 0 ? 0 : r);
				}), f = (r.length - 1) / 2;
				for (let e = Math.floor(f), i = Math.ceil(f); e <= i; ++e) {
					let i = r[e];
					if (i === void 0) continue;
					let d = s[i];
					if (d !== void 0 && o[t] === t && c < d && s[i] !== l && !DE(n, t, i)) {
						let e = a[i];
						e !== void 0 && (o[i] = t, o[t] = a[t] = e, c = d, u &&= (c = -1, l = s[i] ?? -1, !1));
					}
				}
			}
		});
	}), {
		root: a,
		align: o
	};
}
function kE(e, t, n, r, i = !1) {
	let a = {}, o = AE(e, t, n, i), s = i ? "borderLeft" : "borderRight";
	function c(e, t) {
		let n = o.nodes().slice(), r = {}, i = n.pop();
		for (; i;) {
			if (r[i]) e(i);
			else {
				r[i] = !0, n.push(i);
				for (let e of t(i)) n.push(e);
			}
			i = n.pop();
		}
	}
	function l(e) {
		let t = o.inEdges(e);
		t ? a[e] = t.reduce((e, t) => {
			let n = a[t.v] ?? 0, r = o.edge(t);
			return Math.max(e, n + (r === void 0 ? 0 : r));
		}, 0) : a[e] = 0;
	}
	function u(t) {
		let n = o.outEdges(t), r = Infinity;
		n && (r = n.reduce((e, t) => {
			let n = a[t.w], r = o.edge(t);
			return Math.min(e, (n === void 0 ? 0 : n) - (r === void 0 ? 0 : r));
		}, Infinity));
		let i = e.node(t);
		r !== Infinity && i.borderType !== s && (a[t] = Math.max(a[t] === void 0 ? 0 : a[t], r));
	}
	function d(e) {
		return o.predecessors(e) || [];
	}
	function f(e) {
		return o.successors(e) || [];
	}
	return c(l, d), c(u, f), Object.keys(r).forEach((e) => {
		let t = n[e];
		t !== void 0 && (a[e] = a[t] ?? 0);
	}), a;
}
function AE(e, t, n, r) {
	let i = new Cw(), a = e.graph(), o = FE(a.nodesep, a.edgesep, r);
	return t.forEach((t) => {
		let r;
		t.forEach((t) => {
			let a = n[t];
			if (a !== void 0) {
				if (i.setNode(a), r !== void 0) {
					let s = n[r];
					if (s !== void 0) {
						let n = i.edge(s, a);
						i.setEdge(s, a, Math.max(o(e, t, r), n || 0));
					}
				}
				r = t;
			}
		});
	}), i;
}
function jE(e, t) {
	return Object.values(t).reduce((t, n) => {
		let r = -Infinity, i = Infinity;
		Object.entries(n).forEach(([t, n]) => {
			let a = IE(e, t) / 2;
			r = Math.max(n + a, r), i = Math.min(n - a, i);
		});
		let a = r - i;
		return a < t[0] && (t = [a, n]), t;
	}, [Infinity, null])[1];
}
function ME(e, t) {
	let n = Object.values(t), r = Pw(Math.min, n), i = Pw(Math.max, n);
	["u", "d"].forEach((n) => {
		["l", "r"].forEach((a) => {
			let o = n + a, s = e[o];
			if (!s || s === t) return;
			let c = Object.values(s), l = r - Pw(Math.min, c);
			a !== "l" && (l = i - Pw(Math.max, c)), l && (e[o] = Hw(s, (e) => e + l));
		});
	});
}
function NE(e, t = void 0) {
	let n = e.ul;
	return n ? Hw(n, (n, r) => {
		if (t) {
			let n = e[t.toLowerCase()];
			if (n && n[r] !== void 0) return n[r];
		}
		let i = Object.values(e).map((e) => {
			let t = e[r];
			return t === void 0 ? 0 : t;
		}).sort((e, t) => e - t);
		return ((i[1] ?? 0) + (i[2] ?? 0)) / 2;
	}) : {};
}
function PE(e, t) {
	let n = Ow(e), r = Object.assign(CE(e, n), wE(e, n)), i = {}, a;
	return ["u", "d"].forEach((o) => {
		a = o === "u" ? n : Object.values(n).reverse(), ["l", "r"].forEach((n) => {
			n === "r" && (a = a.map((e) => Object.values(e).reverse()));
			let s = OE(e, a, r, (t) => (o === "u" ? e.predecessors(t) : e.successors(t)) || [], t), c = kE(e, a, s.root, s.align, n === "r");
			n === "r" && (c = Hw(c, (e) => -e)), i[o + n] = c;
		});
	}), ME(i, jE(e, i)), NE(i, e.graph().align);
}
function FE(e, t, n) {
	return (r, i, a) => {
		let o = r.node(i), s = r.node(a), c = 0, l;
		if (c += o.width / 2, Object.hasOwn(o, "labelpos")) switch (o.labelpos.toLowerCase()) {
			case "l":
				l = -o.width / 2;
				break;
			case "r": l = o.width / 2;
		}
		if (l && (c += n ? l : -l), l = void 0, c += (o.dummy ? t : e) / 2, c += (s.dummy ? t : e) / 2, c += s.width / 2, Object.hasOwn(s, "labelpos")) switch (s.labelpos.toLowerCase()) {
			case "l":
				l = s.width / 2;
				break;
			case "r": l = -s.width / 2;
		}
		return l && (c += n ? l : -l), c;
	};
}
function IE(e, t) {
	return e.node(t).width;
}
function LE(e, t, n) {
	if (!n) return !1;
	let r = t.node(e)?.edgeObj;
	if (!r || t.node(e).edgeLabel.reversed) return !1;
	let i = n.indexOf(r?.v), a = n.indexOf(r?.w);
	return i !== -1 && a !== -1 && i === (a + 1) % n.length || i === (a - 1) % n.length;
}
function RE(e, t) {
	e = Ew(e), zE(e), Object.entries(PE(e, t)).forEach(([t, n]) => e.node(t).x = n);
}
function zE(e) {
	let t = Ow(e), n = e.graph(), r = n.ranksep, i = n.rankalign, a = 0;
	t.forEach((t) => {
		let n = t.reduce((t, n) => {
			let r = e.node(n).height ?? 0;
			return t > r ? t : r;
		}, 0);
		t.forEach((t) => {
			let r = e.node(t);
			r.y = i === "top" ? a + r.height / 2 : i === "bottom" ? a + n - r.height / 2 : a + n / 2;
		}), a += n + r;
	});
}
var BE = /* @__PURE__ */ new WeakMap();
function VE(e, t = {}) {
	return UE(e, Lw, t), e;
}
function HE(e, t, n) {
	let r = t;
	for (; r !== void 0;) {
		let t = e.parent(r);
		if (t === n) return r;
		r = t;
	}
}
function UE(e, t, n) {
	let r = e.nodes().filter((t) => e.children(t).length), i = {};
	r.forEach((r) => {
		let a = e.node(r);
		if (a && a.rankdir) {
			let o = new Cw({
				multigraph: !0,
				compound: !0
			});
			o.setGraph({ rankdir: a.rankdir });
			let s = e.children(r);
			s.forEach((t) => {
				let n = { ...e.node(t) };
				o.setNode(t, n);
				let i = e.parent(t);
				i && i !== r && s.includes(i) && o.setParent(t, i);
			});
			let c = /* @__PURE__ */ new Set();
			e.edges().forEach((t) => {
				let n = HE(e, t.v, r), i = HE(e, t.w, r);
				if (n === t.v && i === t.w) o.setEdge(t, { ...e.edge(t) });
				else if (n && i && n !== i) {
					let r = `${n}\0${i}`;
					c.has(r) || (c.add(r), o.setEdge(n, i, { ...e.edge(t) }));
				}
			}), UE(o, t, n);
			let l = tD(o);
			GE(l, t, n, null), KE(o, l);
			let u = 1 / 0, d = 1 / 0, f = -1 / 0, p = -1 / 0;
			o.nodes().forEach((e) => {
				if (e === r) return;
				let t = o.node(e);
				t && typeof t.x == "number" && typeof t.y == "number" && typeof t.width == "number" && typeof t.height == "number" && (u = Math.min(u, t.x - t.width / 2), f = Math.max(f, t.x + t.width / 2), d = Math.min(d, t.y - t.height / 2), p = Math.max(p, t.y + t.height / 2));
			}), isFinite(u) && isFinite(d) && isFinite(f) && isFinite(p) || (u = d = 0, f = p = 0);
			let m = f - u, h = p - d;
			i[r] = {
				minX: u,
				minY: d,
				maxX: f,
				maxY: p,
				width: m,
				height: h,
				offsetX: u,
				offsetY: d
			}, a._dagreClusterSubgraph = o;
		}
	});
	let a = [], o = (t) => {
		let n = [], r = (e.children(t) || []).filter((e) => e !== t);
		for (; r.length > 0;) {
			let t = r.shift();
			n.push(t), (e.children(t) || []).filter((e) => e !== t).forEach((e) => r.push(e));
		}
		return n;
	}, s = /* @__PURE__ */ new Map();
	r.forEach((t) => {
		let n = e.node(t);
		n && n.rankdir && i[t] && s.set(t, (e.children(t) || []).filter((e) => e !== t));
	});
	let c = new Set([...s.values()].flat()), l = /* @__PURE__ */ new Map();
	s.forEach((e, t) => {
		c.has(t) || l.set(t, o(t));
	});
	let u = new Set([...l.values()].flat()), d = (e) => {
		for (let [t, n] of l) if (n.includes(e)) return t;
		return e;
	}, f = [];
	e.edges().forEach((t) => {
		(u.has(t.v) || u.has(t.w)) && f.push({
			edge: t,
			label: e.edge(t)
		});
	});
	let p = /* @__PURE__ */ new Map();
	u.forEach((t) => {
		let n = e.parent(t);
		p.set(t, typeof n == "string" ? n : void 0);
	}), l.forEach((t, n) => {
		let r = e.node(n), o = [];
		t.forEach((t) => {
			let n = e.node(t);
			n && (o.push({
				id: t,
				node: n,
				parent: p.get(t)
			}), e.removeNode(t));
		});
		let s = f.filter(({ edge: e }) => t.includes(e.v) || t.includes(e.w)), c = i[n];
		r && (a.push({
			clusterId: n,
			subgraph: r._dagreClusterSubgraph,
			bounds: c,
			children: t,
			removedNodes: o,
			removedEdges: s
		}), r.width = c.width, r.height = c.height);
	});
	let m = /* @__PURE__ */ new Set();
	f.forEach(({ edge: t, label: n }) => {
		let r = d(t.v), i = d(t.w);
		if (r !== i && e.hasNode(r) && e.hasNode(i)) {
			let t = `${r}\0${i}`;
			m.has(t) || (m.add(t), e.setEdge(r, i, {
				...n,
				width: 0,
				height: 0
			}));
		}
	});
	let h = tD(e), g = GE(h, t, n, BE.get(e) ?? null);
	BE.set(e, g), KE(e, h), m.forEach((t) => {
		let n = t.indexOf("\0"), r = t.slice(0, n), i = t.slice(n + 1);
		e.hasEdge(r, i) && e.removeEdge(r, i);
	}), a.forEach(({ clusterId: t, subgraph: n, bounds: r, removedNodes: i, removedEdges: a }) => {
		let o = e.node(t), s = o?.x ?? 0, c = o?.y ?? 0, l = (r.minX + r.maxX) / 2, u = (r.minY + r.maxY) / 2;
		i.forEach(({ id: t, node: n, parent: r }) => {
			e.setNode(t, n), r !== void 0 && e.setParent(t, r);
		}), a.forEach(({ edge: t, label: n }) => {
			e.setEdge(t, n);
		}), n.nodes().forEach((r) => {
			if (r === t) return;
			let i = n.node(r), a = e.node(r);
			a && i && typeof i.x == "number" && typeof i.y == "number" && (a.x = s + (i.x - l), a.y = c + (i.y - u));
		}), WE(e, n, s - l, c - u), delete o._dagreClusterSubgraph;
	}), r.forEach((t) => {
		let n = e.node(t), r = i[t];
		if (n && n.rankdir && n._dagreClusterSubgraph && r) {
			let i = n._dagreClusterSubgraph, a = n.x ?? 0, o = n.y ?? 0, s = (r.minX + r.maxX) / 2, c = (r.minY + r.maxY) / 2;
			i.nodes().forEach((n) => {
				if (n === t) return;
				let r = i.node(n), l = e.node(n);
				if (l && r && typeof r.x == "number" && typeof r.y == "number") {
					let e = r.x - s, t = r.y - c;
					l.x = a + e, l.y = o + t;
				}
			}), WE(e, i, a - s, o - c), delete n._dagreClusterSubgraph;
		}
	});
}
function WE(e, t, n, r) {
	t.edges().forEach((i) => {
		if (!e.hasEdge(i)) return;
		let a = t.edge(i), o = e.edge(i);
		o.points = a.points.map((e) => ({
			x: e.x + n,
			y: e.y + r
		})), Object.hasOwn(a, "x") && (o.x = a.x + n, o.y = a.y + r);
	});
}
function GE(e, t, n, r = null) {
	var i, a;
	let o = n?.useDynamic !== !1, s = o && (i = r?.graph) != null ? i : null, c = o && (a = r?.rawNodes) != null ? a : null;
	t("    makeSpaceForEdgeLabels", () => nD(e)), t("    removeSelfEdges", () => dD(e)), t("    acyclic", () => rT(e, s)), t("    nestingGraph.run", () => VT(e)), t("    rank", () => MT(Ew(e))), t("    injectEdgeLabelProxies", () => rD(e)), t("    removeEmptyRanks", () => Aw(e)), t("    nestingGraph.cleanup", () => GT(e)), t("    normalizeRanks", () => kw(e)), t("    assignRankMinMax", () => iD(e)), t("    removeEdgeLabelProxies", () => aD(e)), t("    normalize.run", () => sT(e)), t("    parentDummyChains", () => LT(e)), t("    addBorderSegments", () => KT(e)), t("    order", () => yE(e, n, c)), t("    insertSelfEdges", () => fD(e)), t("    adjustCoordinateSystem", () => YT(e)), t("    position", () => RE(e, n.corePath)), t("    positionSelfEdges", () => pD(e));
	let l = JSON.parse(JSON.stringify(e._nodes));
	return t("    removeBorderNodes", () => uD(e)), t("    normalize.undo", () => lT(e)), t("    fixupEdgeLabelCoords", () => cD(e)), t("    undoCoordinateSystem", () => XT(e)), t("    translateGraph", () => oD(e)), t("    assignNodeIntersects", () => sD(e)), t("    reversePoints", () => lD(e)), t("    acyclic.undo", () => aT(e)), {
		graph: e,
		rawNodes: l
	};
}
function KE(e, t) {
	e.nodes().forEach((n) => {
		let r = e.node(n), i = t.node(n);
		r && (r.x = i.x, r.y = i.y, r.order = i.order, r.rank = i.rank, t.children(n).length && (r.width = i.width, r.height = i.height));
	}), e.edges().forEach((n) => {
		let r = e.edge(n), i = t.edge(n);
		r.points = i.points, Object.hasOwn(i, "x") && (r.x = i.x, r.y = i.y);
	}), e.graph().width = t.graph().width, e.graph().height = t.graph().height;
}
var qE = [
	"nodesep",
	"edgesep",
	"ranksep",
	"marginx",
	"marginy"
], JE = {
	ranksep: 50,
	edgesep: 20,
	nodesep: 50,
	rankdir: "TB",
	rankalign: "center"
}, YE = [
	"acyclicer",
	"ranker",
	"rankdir",
	"align",
	"rankalign"
], XE = [
	"width",
	"height",
	"rank"
], ZE = {
	width: 0,
	height: 0
}, QE = [
	"minlen",
	"weight",
	"width",
	"height",
	"labeloffset"
], $E = {
	minlen: 1,
	weight: 1,
	width: 0,
	height: 0,
	labeloffset: 10,
	labelpos: "r"
}, eD = ["labelpos"];
function tD(e) {
	let t = new Cw({
		multigraph: !0,
		compound: !0
	}), n = hD(e.graph());
	return t.setGraph(Object.assign({}, JE, mD(n, qE), Vw(n, YE))), e.nodes().forEach((n) => {
		let r = mD(hD(e.node(n)), XE);
		Object.keys(ZE).forEach((e) => {
			r[e] === void 0 && (r[e] = ZE[e]);
		}), t.setNode(n, r);
		let i = e.parent(n);
		i !== void 0 && t.setParent(n, i);
	}), e.edges().forEach((n) => {
		let r = hD(e.edge(n));
		t.setEdge(n, Object.assign({}, $E, mD(r, QE), Vw(r, eD)));
	}), t;
}
function nD(e) {
	let t = e.graph();
	t.ranksep /= 2, e.edges().forEach((n) => {
		let r = e.edge(n);
		r.minlen *= 2, (r.labelpos ?? "r").toLowerCase() !== "c" && (t.rankdir === "TB" || t.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
	});
}
function rD(e) {
	e.edges().forEach((t) => {
		let n = e.edge(t);
		if (n.width && n.height) {
			let n = e.node(t.v);
			ww(e, "edge-proxy", {
				rank: (e.node(t.w).rank - n.rank) / 2 + n.rank,
				e: t
			}, "_ep");
		}
	});
}
function iD(e) {
	let t = 0;
	e.nodes().forEach((n) => {
		let r = e.node(n);
		r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, t = Math.max(t, r.maxRank));
	}), e.graph().maxRank = t;
}
function aD(e) {
	e.nodes().forEach((t) => {
		let n = e.node(t);
		if (n.dummy === "edge-proxy") {
			let r = n;
			e.edge(r.e).labelRank = n.rank, e.removeNode(t);
		}
	});
}
function oD(e) {
	let t = Infinity, n = 0, r = Infinity, i = 0, a = e.graph(), o = a.marginx || 0, s = a.marginy || 0;
	function c(e) {
		let a = e.x, o = e.y, s = e.width, c = e.height;
		t = Math.min(t, a - s / 2), n = Math.max(n, a + s / 2), r = Math.min(r, o - c / 2), i = Math.max(i, o + c / 2);
	}
	e.nodes().forEach((t) => c(e.node(t))), e.edges().forEach((t) => {
		let n = e.edge(t);
		Object.hasOwn(n, "x") && c(n);
	}), t -= o, r -= s, e.nodes().forEach((n) => {
		let i = e.node(n);
		i.x -= t, i.y -= r;
	}), e.edges().forEach((n) => {
		let i = e.edge(n);
		i.points.forEach((e) => {
			e.x -= t, e.y -= r;
		}), Object.hasOwn(i, "x") && (i.x -= t), Object.hasOwn(i, "y") && (i.y -= r);
	}), a.width = n - t + o, a.height = i - r + s;
}
function sD(e) {
	e.edges().forEach((t) => {
		if (t.v === t.w) return;
		let n = e.edge(t), r = e.node(t.v), i = e.node(t.w), a, o;
		n.points ? (a = n.points[0], o = n.points[n.points.length - 1]) : (n.points = [], a = i, o = r), n.points.unshift(Dw(r, a)), n.points.push(Dw(i, o));
	});
}
function cD(e) {
	e.edges().forEach((t) => {
		let n = e.edge(t);
		if (Object.hasOwn(n, "x")) switch ((n.labelpos === "l" || n.labelpos === "r") && (n.width -= n.labeloffset), n.labelpos) {
			case "l":
				n.x -= n.width / 2 + n.labeloffset;
				break;
			case "r": n.x += n.width / 2 + n.labeloffset;
		}
	});
}
function lD(e) {
	e.edges().forEach((t) => {
		let n = e.edge(t);
		n.reversed && n.points.reverse();
	});
}
function uD(e) {
	e.nodes().forEach((t) => {
		if (e.children(t).length) {
			let n = e.node(t), r = e.node(n.borderTop), i = e.node(n.borderBottom), a = e.node(n.borderLeft[n.borderLeft.length - 1]), o = e.node(n.borderRight[n.borderRight.length - 1]);
			n.width = Math.abs(o.x - a.x), n.height = Math.abs(i.y - r.y), n.x = a.x + n.width / 2, n.y = r.y + n.height / 2;
		}
	}), e.nodes().forEach((t) => {
		e.node(t).dummy === "border" && e.removeNode(t);
	});
}
function dD(e) {
	e.edges().forEach((t) => {
		if (t.v === t.w) {
			let n = e.node(t.v);
			n.selfEdges ||= [], n.selfEdges.push({
				e: t,
				label: e.edge(t)
			}), e.removeEdge(t);
		}
	});
}
function fD(e) {
	Ow(e).forEach((t) => {
		let n = 0;
		t.forEach((t, r) => {
			let i = e.node(t);
			typeof i.rank != "number" && (i.rank = 0), i.order = r + n, (i.selfEdges || []).forEach((t) => {
				ww(e, "selfedge", {
					width: t.label.width,
					height: t.label.height,
					rank: i.rank,
					order: r + ++n,
					e: t.e,
					edgeLabel: t.label
				}, "_se"), Array.isArray(t.label.points) && t.label.points.length === 7 || (t.label.points = [
					{
						x: 0,
						y: -10
					},
					{
						x: 0,
						y: -10
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 0,
						y: 10
					},
					{
						x: 0,
						y: 10
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 0,
						y: 0
					}
				]);
			}), delete i.selfEdges;
		});
	});
}
function pD(e) {
	e.nodes().forEach((t) => {
		let n = e.node(t), r = (e) => typeof e == "number" && isFinite(e);
		if (n.dummy === "selfedge") {
			let i = n, a = e.node(i.e.v), o = r(a?.x) ? a.x : 0, s = r(a?.y) ? a.y : 0, c = r(a?.width) ? a.width : 0, l = r(a?.height) ? a.height : 0, u = r(n.x) ? n.x : o, d = r(n.y) ? n.y : s, f = c / 2, p = l / 2;
			i.edgeLabel.points = [
				{
					x: u + f,
					y: d - p
				},
				{
					x: u + f,
					y: d - p
				},
				{
					x: u,
					y: d
				},
				{
					x: u - f,
					y: d + p
				},
				{
					x: u - f,
					y: d + p
				},
				{
					x: u,
					y: d
				},
				{
					x: u,
					y: d
				}
			], i.edgeLabel.x = u, i.edgeLabel.y = d, e.setEdge(i.e, i.edgeLabel), e.removeNode(t);
		} else n && Array.isArray(n.selfEdges) && n.selfEdges.forEach((e) => {
			if (!Array.isArray(e.label.points) || e.label.points.length !== 7) {
				let t = r(n.x) ? n.x : 0, i = r(n.y) ? n.y : 0, a = r(n.width) ? n.width : 0, o = r(n.height) ? n.height : 0, s = a / 2, c = o / 2;
				e.label.points = [
					{
						x: t + s,
						y: i - c
					},
					{
						x: t + s,
						y: i - c
					},
					{
						x: t,
						y: i
					},
					{
						x: t - s,
						y: i + c
					},
					{
						x: t - s,
						y: i + c
					},
					{
						x: t,
						y: i
					},
					{
						x: t,
						y: i
					}
				];
			}
		});
	});
}
function mD(e, t) {
	return Hw(Vw(e, t), Number);
}
function hD(e) {
	let t = {};
	return e && Object.entries(e).forEach(([e, n]) => {
		typeof e == "string" && (e = e.toLowerCase()), t[e] = n;
	}), t;
}
// src/flowchart-layout.ts
function gD(e, t = 26) {
	return e.split(/\r?\n/).flatMap((e) => {
		let n = Array.from(e);
		if (!n.length) return [""];
		let r = [];
		for (let e = 0; e < n.length; e += t) r.push(n.slice(e, e + t).join(""));
		return r;
	});
}
function _D(e, t, n) {
	let r = new RC.Graph({ multigraph: !0 });
	r.setGraph({
		rankdir: e === "TD" ? "TB" : "LR",
		nodesep: 50,
		ranksep: 70,
		edgesep: 22,
		marginx: 30,
		marginy: 30
	});
	let i = new Map(t.map((e, t) => [e.id, `node${t}`]));
	t.forEach((e, t) => {
		r.setNode(`node${t}`, {
			width: 250,
			height: gD(e.label).length * 20 + 28
		});
	}), n.forEach((e, t) => {
		let n = i.get(e.source), a = i.get(e.target);
		if (n === void 0 || a === void 0) throw Error("Unknown flowchart node");
		let o = e.label ? gD(e.label, 22) : [];
		r.setEdge(n, a, {
			width: o.length ? Math.max(...o.map((e) => Array.from(e).length)) * 8 + 16 : 0,
			height: o.length ? o.length * 18 + 12 : 0,
			labelpos: "c"
		}, `edge${t}`);
	}), VE(r);
	let a = r.graph(), o = t.map((e, t) => ({
		...e,
		...r.node(`node${t}`),
		lines: gD(e.label)
	})), s = n.map((e, t) => ({
		...e,
		...r.edge(i.get(e.source), i.get(e.target), `edge${t}`),
		lines: e.label ? gD(e.label, 22) : []
	}));
	if (!Number.isFinite(a.width) || !Number.isFinite(a.height)) throw Error("Invalid flowchart layout");
	return {
		width: a.width,
		height: a.height,
		nodes: o,
		edges: s
	};
}
var vD = rp({
	root: "DataFlowchart",
	components: [np({
		name: "DataFlowchart",
		description: "Displays labeled nodes and directed connections.",
		props: z({
			title: wm.shape.title,
			direction: wm.shape.direction,
			nodes: wm.shape.nodes,
			edges: wm.shape.edges
		}),
		component: function({ props: e }) {
			let t = "flowArrow" + (0, B.useId)().replace(/[^a-zA-Z0-9_-]/g, ""), n = (0, B.useMemo)(() => _D(e.direction, e.nodes, e.edges), [
				e.direction,
				e.nodes,
				e.edges
			]), r = new Map(e.nodes.map((e) => [e.id, e.label]));
			return /* @__PURE__ */ (0, J.jsxs)("figure", {
				className: "gc-flowchart",
				children: [
					/* @__PURE__ */ (0, J.jsx)("figcaption", { children: e.title }),
					/* @__PURE__ */ (0, J.jsx)("div", {
						className: "gc-flowchart-scroll",
						role: "region",
						"aria-label": `${e.title} diagram`,
						tabIndex: 0,
						children: /* @__PURE__ */ (0, J.jsxs)("svg", {
							width: n.width,
							height: n.height,
							viewBox: `0 0 ${n.width} ${n.height}`,
							role: "img",
							"aria-label": e.title,
							children: [
								/* @__PURE__ */ (0, J.jsx)("title", { children: e.title }),
								/* @__PURE__ */ (0, J.jsx)("desc", { children: "A directed flowchart. Full node and connection text is available under View flowchart details." }),
								/* @__PURE__ */ (0, J.jsx)("defs", { children: /* @__PURE__ */ (0, J.jsx)("marker", {
									id: t,
									viewBox: "0 0 10 10",
									refX: "9",
									refY: "5",
									markerWidth: "7",
									markerHeight: "7",
									orient: "auto-start-reverse",
									children: /* @__PURE__ */ (0, J.jsx)("path", {
										d: "M 0 0 L 10 5 L 0 10 z",
										fill: "#8b9dff"
									})
								}) }),
								n.edges.map((e, n) => /* @__PURE__ */ (0, J.jsx)("polyline", {
									className: "gc-flowchart-edge",
									points: e.points.map((e) => `${e.x},${e.y}`).join(" "),
									markerEnd: `url(#${t})`
								}, n)),
								n.edges.map((e, t) => e.lines.length > 0 && /* @__PURE__ */ (0, J.jsxs)("g", {
									transform: `translate(${e.x},${e.y})`,
									className: "gc-flowchart-label",
									children: [/* @__PURE__ */ (0, J.jsx)("rect", {
										x: -(Math.max(...e.lines.map((e) => Array.from(e).length)) * 8 + 16) / 2,
										y: -(e.lines.length * 18 + 12) / 2,
										width: Math.max(...e.lines.map((e) => Array.from(e).length)) * 8 + 16,
										height: e.lines.length * 18 + 12,
										rx: "5"
									}), /* @__PURE__ */ (0, J.jsx)("text", {
										textAnchor: "middle",
										dominantBaseline: "central",
										children: e.lines.map((t, n) => /* @__PURE__ */ (0, J.jsx)("tspan", {
											x: "0",
											y: (n - (e.lines.length - 1) / 2) * 18,
											children: t
										}, n))
									})]
								}, t)),
								n.nodes.map((e) => /* @__PURE__ */ (0, J.jsxs)("g", {
									transform: `translate(${e.x},${e.y})`,
									className: "gc-flowchart-node",
									children: [/* @__PURE__ */ (0, J.jsx)("rect", {
										x: -e.width / 2,
										y: -e.height / 2,
										width: e.width,
										height: e.height,
										rx: "10"
									}), /* @__PURE__ */ (0, J.jsx)("text", {
										textAnchor: "middle",
										dominantBaseline: "central",
										children: e.lines.map((t, n) => /* @__PURE__ */ (0, J.jsx)("tspan", {
											x: "0",
											y: (n - (e.lines.length - 1) / 2) * 20,
											children: t
										}, n))
									})]
								}, e.id))
							]
						})
					}),
					/* @__PURE__ */ (0, J.jsxs)("details", {
						className: "gc-flowchart-details",
						children: [
							/* @__PURE__ */ (0, J.jsx)("summary", { children: "View flowchart details" }),
							/* @__PURE__ */ (0, J.jsx)("h4", { children: "Nodes" }),
							/* @__PURE__ */ (0, J.jsx)("ul", { children: e.nodes.map((e) => /* @__PURE__ */ (0, J.jsx)("li", { children: e.label }, e.id)) }),
							/* @__PURE__ */ (0, J.jsx)("h4", { children: "Connections" }),
							e.edges.length === 0 ? /* @__PURE__ */ (0, J.jsx)("p", { children: "No connections." }) : /* @__PURE__ */ (0, J.jsx)("ul", { children: e.edges.map((e, t) => /* @__PURE__ */ (0, J.jsxs)("li", { children: [
								r.get(e.source),
								" → ",
								r.get(e.target),
								e.label ? ` (${e.label})` : ""
							] }, t)) })
						]
					})
				]
			});
		}
	})]
}), yD = {
	pending: "Pending",
	in_progress: "In progress",
	success: "Success",
	warning: "Warning",
	error: "Error"
}, bD = {
	pending: "○",
	in_progress: "◐",
	success: "✓",
	warning: "!",
	error: "×"
}, xD = rp({
	root: "DataStatus",
	components: [np({
		name: "DataStatus",
		description: "Displays a compact, saved snapshot of named statuses.",
		props: z({
			title: Tm.shape.title,
			status_items: Tm.shape.status_items
		}),
		component: ({ props: e }) => /* @__PURE__ */ (0, J.jsxs)("section", {
			className: "gc-status",
			"aria-label": e.title,
			children: [/* @__PURE__ */ (0, J.jsx)("h3", { children: e.title }), /* @__PURE__ */ (0, J.jsx)("ul", {
				className: "gc-status-list",
				children: e.status_items.map((e, t) => /* @__PURE__ */ (0, J.jsxs)("li", { children: [/* @__PURE__ */ (0, J.jsxs)("div", {
					className: "gc-status-main",
					children: [/* @__PURE__ */ (0, J.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, J.jsxs)("span", {
						className: "gc-status-badge",
						"data-state": e.state,
						children: [/* @__PURE__ */ (0, J.jsx)("span", {
							"aria-hidden": "true",
							children: bD[e.state]
						}), yD[e.state]]
					})]
				}), e.detail && /* @__PURE__ */ (0, J.jsx)("p", { children: e.detail })] }, t))
			})]
		})
	})]
}), SD = /* @__PURE__ */ new WeakMap(), CD = {
	table: fm,
	checklist: mm,
	chart: MC,
	comparison: NC,
	flowchart: vD,
	status: xD
}, wD = class extends B.Component {
	state = { failed: !1 };
	static getDerivedStateFromError() {
		return { failed: !0 };
	}
	componentDidCatch(e, t) {
		console.error("Visual component failed:", e, t);
	}
	render() {
		return this.state.failed ? /* @__PURE__ */ (0, J.jsx)("p", {
			role: "alert",
			children: "This visual could not be displayed."
		}) : this.props.children;
	}
};
function TD({ options: e }) {
	let [t, n] = (0, B.useState)(""), r = (0, B.useCallback)((e) => {
		let t = e.filter((e) => e.severity !== "warning");
		n(t.length ? "This visual could not be displayed." : ""), t.length && console.error("OpenUI errors:", t);
	}, []);
	return /* @__PURE__ */ (0, J.jsxs)(J.Fragment, { children: [t && /* @__PURE__ */ (0, J.jsx)("p", {
		role: "alert",
		children: t
	}), /* @__PURE__ */ (0, J.jsx)("div", {
		hidden: !!t,
		children: /* @__PURE__ */ (0, J.jsx)(tm, {
			library: CD[e.kind],
			response: e.response,
			initialState: e.initialState,
			onStateUpdate: e.onStateUpdate,
			isStreaming: !1,
			onError: r
		})
	})] });
}
function ED(e, t) {
	if (![
		"table",
		"checklist",
		"chart",
		"comparison",
		"flowchart",
		"status"
	].includes(t.kind) || typeof t.response != "string") throw Error("Unsupported renderer input");
	let n = SD.get(e);
	n || (e.replaceChildren(), e.classList.add("gc-visual"), n = (0, $c.createRoot)(e), SD.set(e, n)), n.render(/* @__PURE__ */ (0, J.jsx)(wD, { children: /* @__PURE__ */ (0, J.jsx)(TD, { options: t }) }, t.kind + ":" + t.response));
}
function DD(e) {
	let t = SD.get(e);
	t && (t.unmount(), SD.delete(e), e.classList.remove("gc-visual"));
}
function OD(e, t, n) {
	let r = km(t);
	if (r.kind !== "checklist") {
		ED(e, r);
		return;
	}
	let i = JSON.stringify(hm(r.checklistKeys, r.initialState));
	ED(e, {
		...r,
		onStateUpdate: (e) => {
			let t = hm(r.checklistKeys, e);
			if (!t) return;
			let a = JSON.stringify(t);
			a !== i && (i = a, n?.(t));
		}
	});
}
export { OD as mountSavedVisual, ED as mountVisual, DD as unmountVisual };
