(window.webpackJsonp = window.webpackJsonp || []).push([
  [0],
  {
    1(n, e, r) {
      let i = r(15);

      typeof i === 'string' && (i = [[n.i, i, '']]);
      const t = { hmr: !0, transform: void 0, insertInto: void 0 };

      r(17)(i, t);
      i.locals && (n.exports = i.locals);
    },
    15(n, e, r) {
      (e = n.exports = r(16)(!1)).push([
        n.i,
        '.Badge_badge__3G5KG {\n  -webkit-border-radius: 50%;\n          border-radius: 50%;\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  line-height: 20px;\n  border: 1px solid #0096ac;\n  color: #0096ac;\n  font-size: 11px;\n  font-weight: 500;\n  text-align: center;\n}\n.Badge_large__2otL0 {\n  width: auto;\n  padding: 0 5px;\n  -webkit-border-radius: 10px;\n          border-radius: 10px;\n}\n',
        '',
      ]),
        (e.locals = { badge: 'Badge_badge__3G5KG', large: 'Badge_large__2otL0' });
    },
    9(n, e, r) {
      r.r(e);
      let i = r(2),
        t = r.n(i),
        a = r(3),
        o = r.n(a),
        s = r(4),
        d = r.n(s),
        p = r(5),
        l = r.n(p),
        c = r(6),
        u = r.n(c),
        g = r(7),
        h = r.n(g),
        b = r(8),
        _ = r.n(b),
        f = r(0),
        w = r.n(f),
        x = r(1),
        v = r.n(x),
        k = (function(n) {
          function e() {
            return o()(this, e), l()(this, u()(e).apply(this, arguments));
          }

          return (
            h()(e, n),
            d()(e, [
              {
                key: 'render',
                value() {
                  return w.a.createElement(
                    'div',
                    {
                      className: _()([
                        v.a.badge,
                        t()({}, v.a.large, this.props.children > 99),
                        this.props.className,
                      ]),
                    },
                    this.props.children
                  );
                },
              },
            ]),
            e
          );
        })(f.Component);

      e.default = k;
    },
  },
  [[9, 2, 1]],
]);
// # sourceMappingURL=0.Badge.js.map
