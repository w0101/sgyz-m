(function (cityselect) {
	define('libs/cityselect',['jquery'], function(){
		return cityselect
	});
}(function (e) {
	e.fn.cityselect = function(n) {
			function t(e, n) {
				var t = e,
				i = n.data,
				a = [];
				for (var o in i) if (i.hasOwnProperty(o)) {
					a.push("<option " + n.metaTag + '="' + i[o][n.id] + '"' + (n.selected && n.selected == i[o][n.id] ? d: "") + ">" + i[o][n.name] + "</option>");
					for (var r in i[o][n.children]) i[o][n.children].hasOwnProperty(r) && a.push(n.idVal ? "<option " + n.metaTag + '="' + i[o][n.children][r][n.id] + '" value="' + i[o][n.children][r][n.name] + '"' + (n.selected && n.selected == i[o][n.children][r][n.id] ? d: "") + ">" + i[o][n.children][r][n.name] + "</option>": "<option " + n.metaTag + '="' + i[o][n.children][r][n.id] + '" value="' + i[o][n.children][r][n.id] + '"' + (n.selected && n.selected == i[o][n.children][r][n.id] ? d: "") + ">" + i[o][n.children][r][n.name] + "</option>")
				}
				a = a.join(""),
				t.find("option").remove(),
				t.append(a)
			}
			function i(n, t) {
				var i, a = n.eq(0),
				o = n.eq(1),
				r = [];
				for (var c in t.data) t.data.hasOwnProperty(c) && (i = t.data[c], r.push(t.idVal ? "<option " + t.metaTag + '="' + i[t.id] + '" value="' + i[t.id] + '"' + (t.selected && t.selected[0] == i[t.id] ? d: "") + ">" + i[t.name] + "</option>": "<option " + t.metaTag + '="' + i[t.id] + '" value="' + i[t.id] + '"' + (t.selected && t.selected[0] == i[t.id] ? d: "") + ">" + i[t.name] + "</option>"));
				r = r.join(""),
				a.find("option").remove(),
				a.append(r);
				var l = a.find("option");
				a.on("change",
				function() {
					var n = e(this).val();
					l.each(function(i, a) {
						return e(a).val() == n ?
						function(n) {
							var i, a = e(n).attr(t.metaTag),
							r = [];
							for (var c in t.data) if (t.data.hasOwnProperty(c) && (i = t.data[c], i[t.id] == a && i[t.children])) {
								i = i[t.children];
								for (var l in i) i.hasOwnProperty(l) && r.push(t.idVal ? "<option " + t.metaTag + '="' + i[l][t.id] + '" value="' + i[l][t.id] + '"' + (t.selected && t.selected[1] == i[l][t.id] ? d: "") + ">" + i[l][t.name] + "</option>": "<option " + t.metaTag + '="' + i[l][t.id] + '" value="' + i[l][t.id] + '"' + (t.selected && t.selected[1] == i[l][t.id] ? d: "") + ">" + i[l][t.name] + "</option>");
								break
							}
							r = r.join(""),
							o.find("option").remove(),
							o.append(r),
							o.trigger('chosen:updated');
						} (a) : void 0
					})
				}).trigger("change")
			}
			n = e.extend({
				id: "id",
				name: "name",
				children: "children",
				metaTag: "data-extra",
				idVal: !1,
				data: !1,
				selected: !1
			},
			n);
			var a = e(this),
			d = ' selected="selected"';
			switch (a.length) {
			case 1:
				t(a, n);
				break;
			case 2:
				i(a, n);
				break;
			default:
				return this
			}
			return this
	}
}));