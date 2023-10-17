// istanbul ignore file
// tslint:disable
// @ts-nocheck
export default !(function (e) {
  function n(i) {
    if (t[i]) return t[i].exports;
    var o = (t[i] = { exports: {}, id: i, loaded: !1 });
    return e[i].call(o.exports, o, o.exports, n), (o.loaded = !0), o.exports;
  }
  var i = window.songbirdLoader;
  window.songbirdLoader = function (t, r) {
    for (var s, a, u = 0, l = []; u < t.length; u++)
      (a = t[u]), o[a] && l.push.apply(l, o[a]), (o[a] = 0);
    for (s in r) Object.prototype.hasOwnProperty.call(r, s) && (e[s] = r[s]);
    for (i && i(t, r); l.length; ) l.shift().call(null, n);
  };
  var t = {},
    o = { 19: 0 };
  return (
    (n.e = function (e, i) {
      if (0 === o[e]) return i.call(null, n);
      if (void 0 !== o[e]) o[e].push(i);
      else {
        o[e] = [i];
        var t = document.getElementsByTagName("head")[0],
          r = document.createElement("script");
        (r.type = "text/javascript"),
          (r.charset = "utf-8"),
          (r.async = !0),
          (r.crossOrigin = "anonymous"),
          (r.src = n.p + "" + e + ".a960453caa80548c4a43.songbird.js"),
          t.appendChild(r);
      }
    }),
    (n.m = e),
    (n.c = t),
    (n.p =
      "https://songbirdstag.cardinalcommerce.com/edge/v1/a960453caa80548c4a43/"),
    n(0)
  );
})([
  function (e, n, i) {
    e.exports = i(1);
  },
  function (e, n, i) {
    !(function (e, n) {
      var t,
        o = [],
        r = [],
        s = [],
        a = [],
        u = [],
        l = [],
        p = [],
        c = [];
      (t = {
        configure: function (e) {
          o.push({ name: e, arguments: arguments });
        },
        setup: function (e) {
          l.push({ name: e, arguments: arguments });
        },
        start: function (e) {
          p.push({ name: e, arguments: arguments });
        },
        continue: function (e) {
          r.push({ name: e, arguments: arguments });
        },
        on: function (e) {
          u.push({ name: e, arguments: arguments });
        },
        trigger: function (e) {
          c.push({ name: e, arguments: arguments });
        },
        off: function (e) {
          a.push({ name: e, arguments: arguments });
        },
        complete: function (e) {
          s.push({ name: e, arguments: arguments });
        }
      }),
        (e.Cardinal = t),
        (e.onerror !== n && null !== e.onerror) ||
          (e.onerror = function () {
            return !1;
          }),
        i(2).polyfill(function (s) {
          i.e(5, function (a) {
            var d = i(12),
              f = i(14).active,
              g = i(23),
              h = i(3),
              m = i(24),
              b = i(31),
              y = i(32),
              v = i(58),
              w = i(67),
              E = i(15),
              N = i(63),
              F = i(113),
              O = E.getLoggerInstance("Base.Main"),
              S = i(14).passive,
              L = i(18),
              x = i(114),
              C = {
                configurationQueue: o,
                onQueue: u,
                startQueue: p,
                continueQueue: r
              };
            E.addToLoggerCollection(s);
            try {
              L.on("error", function (e) {
                f.publish("error.fatal").then(function () {
                  y.handleError(e, b.GENERAL.NUMBER, b.GENERAL.DESCRIPTION);
                });
              }),
                O.info("Using Songbird.js v" + m.getSystemConfig().version),
                F.init(),
                (t.setup = d.partial(f.publish, "setup")),
                (t.on = S.subscribe),
                (t.start = function (e) {
                  (arguments[0] = "start." + e.toUpperCase()),
                    f.publish.apply(this, arguments);
                }),
                (t.continue = function (e) {
                  (arguments[0] = "continue." + e.toUpperCase()),
                    f.publish.apply(this, arguments);
                }),
                (t.complete = d.partial(f.publish, "payments.completed")),
                (t.trigger = f.publish),
                (t.off = S.removeEvent),
                v.setupSubscriptions(),
                (h.browser = g.getBrowserDetails()),
                d.each(c, function (e) {
                  f.publish.apply(this, e.arguments);
                }),
                f.subscribe("setup", d.partial(x.processSetup, C)),
                l.length > 0 &&
                  f.publish("setup", l[0].arguments[0], l[0].arguments[1]),
                (h.namespace = t),
                (h.window = e),
                N.initialize(e),
                N.captureTiming(w.getCurrentScript());
            } catch (e) {
              O.error(
                "Fatal Exception while processing: " +
                  (e.message !== n ? e.message : e)
              ),
                y.handleError(e, b.GENERAL.NUMBER, b.GENERAL.DESCRIPTION);
            }
          });
        });
    })(window);
  },
  function (e, n, i) {
    var t,
      o = i(3),
      r = i(4),
      s = new r("Base.Polyfiller"),
      a = { JSON: !1, performance: !1, bind: !1, filter: !1 },
      u = {
        polyfill: function (e) {
          (t = e),
            "JSON" in o.window
              ? ((a.JSON = !0), u.isFinished())
              : (s.debug("Detected JSON missing, loading polyfill"),
                i.e(1, function (e) {
                  i(5),
                    s.debug("JSON polyfill loaded"),
                    (a.JSON = !0),
                    u.isFinished();
                })),
            "performance" in o.window && "mark" in o.window.performance
              ? ((a.performance = !0), u.isFinished())
              : (s.debug(
                  "Detected performance library missing in browser - loading polyfill"
                ),
                i.e(2, function (e) {
                  i(8),
                    s.debug("performance polyfill loaded"),
                    (a.performance = !0),
                    u.isFinished();
                })),
            Function.prototype.bind
              ? ((a.bind = !0), u.isFinished())
              : (s.debug("Detected bind is missing - loading polyfill"),
                i.e(3, function (e) {
                  i(10)(),
                    s.debug("bind polyfill loaded"),
                    (a.bind = !0),
                    u.isFinished();
                })),
            Array.prototype.filter
              ? ((a.filter = !0), u.isFinished())
              : (s.debug("Detected filter is missing - loading polyfill"),
                i.e(4, function (e) {
                  i(11)(),
                    s.debug("filter polyfill loaded"),
                    (a.filter = !0),
                    u.isFinished();
                }));
        },
        isFinished: function () {
          for (var e in a) if (a.hasOwnProperty(e) && !a[e]) return !1;
          t(s);
        }
      };
    e.exports = u;
  },
  function (e, n) {
    var i;
    try {
      i = window;
    } catch (e) {
      i = this;
    }
    e.exports = {
      apiId: void 0,
      bin: void 0,
      deviceFingerprinting: {
        shouldRunFingerprinting: !1,
        urls: { base: void 0, browser: void 0, profileBin: void 0 }
      },
      farnsworthLabs: {},
      formFields: {},
      jwtOrderObject: void 0,
      merchantJwt: void 0,
      songbirdPostmessageValidation: !1,
      message: void 0,
      orgUnitId: void 0,
      setup: { eventCompleted: !1, modulesLoaded: void 0 },
      storage: {},
      tid: void 0,
      transactionFlow: void 0,
      timers: { browserRender: null },
      urls: { hostedFields: void 0, postMessageWhiteList: [] },
      window: i
    };
  },
  function (e, n) {
    function i(e) {
      (this.Namespace = e),
        (this.logQueue = []),
        (this.log = function (e, n) {
          e || (e = "debug"), this.logQueue.push({ type: e, message: n });
        });
    }
    (i.prototype.getLogQueue = function () {
      return this.logQueue;
    }),
      (i.prototype.getNamespace = function () {
        return this.Namespace;
      }),
      (i.prototype.trace = function (e) {
        this.log("trace", e);
      }),
      (i.prototype.debug = function (e) {
        this.log("debug", e);
      }),
      (i.prototype.info = function (e) {
        this.log("info", e);
      }),
      (i.prototype.warn = function (e) {
        this.log("warn", e);
      }),
      (i.prototype.error = function (e) {
        this.log("error", e);
      }),
      (e.exports = i);
  }
]);
