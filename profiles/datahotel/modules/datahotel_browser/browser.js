var _description, _data, _params, _filter_loaded = false, fullscreen = false;

jQuery(function($) {
	var path = top.location.pathname != '/' ? top.location.pathname.replace(/\/+$/,'') : '/';
	if (path == '/') path = '';

	fixUrls(null);
	$(".js-only").show();

	$('#data-links').hide();
	$('#data-filter').hide();
	$('#data-filter form').submit(function (ev) { $('#data-filter').hide(); _data = null; $('#data-page').text(1); update(); return false; });
	$('#filter-edit').click(function (ev) { $('#data-filter').show(); _data = null; update(); return false; });
	$('#filter-clear').click(function (ev) { $('#data-filter input[type=text]').val(null); $('#data-page').text(1); $('#data-filter').hide(); _data = null; update(); return false; });
	$('#data-page').text(1);
	$('#query').val(getParameterByName('query'));
	$('#query-form').submit(function (ev) { $('#data-page').text(1); _data = null; update(); return false; });
	$('#page-next').click(function (ev) { $('#data-page').text(_data.page + 1); _data = null; update(); return false; } );
	$('#page-prev').click(function (ev) { $('#data-page').text(_data.page - 1); _data = null; update(); return false; } );
	$('a.fullscreen').click(function (ev) { fullscreen = !fullscreen; resize(); return false; });
	
	var resize = function() {
		var block = $("#block-datahotel-browser-browser");
		if (fullscreen) {
			block.css({'height': $(window).height(), 'width': '100%', 'overflow': 'auto', 'position': 'absolute', 'background-color': '#fff', 'top': 0, 'left': 0, 'z-index': 1000});
			$('#data-panel').css({'margin' : '0 auto'});

			/* $('#data-links, #datasets, #data-panel, #block-datahotel-browser-browser thead').css({'position': 'fixed', 'background-color': '#fff', 'width': '100%'});
			$('#data-links').css({'top': 0});
			$('#datasets').css({'top' : $('#data-links').height() + $('#data-links').position().top});
			$('#data-panel').css({'top' : $('#datasets').height() + $('#datasets').position().top + 13});
			$('#block-datahotel-browser-browser thead').css({'top' : $('#data-panel').height() + $('#data-panel').position().top + 13});
			$('#block-datahotel-browser-browser table').css({'margin-top' : $('#block-datahotel-browser-browser thead').height() + $('#block-datahotel-browser-browser thead').position().top}); */
		} else {
			var height = $(window).height() - block.position().top - $("div.container.footer").height() - ($("div.container.main").height() - block.height() - 10);
			block.css({'height': height < 300 ? 300 : height, 'width': 'auto', 'overflow': 'auto', 'position': 'relative', 'top': 'auto', 'left': 'auto'});
			/* $('#data-links, #datasets, #data-panel, #block-datahotel-browser-browser thead').css({'position': 'static', 'background-color': '#fff', 'width': 'auto'});
			$('#block-datahotel-browser-browser table').css({'margin-top' : 0}); */
			if (height > $(window).height())
				resize();
		}
	};
	
	resize();
	$(window).resize(resize);
	
	//http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
	function getParameterByName(name) {
	    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	}

	function fixUrls(params) {
		var url = top.location.pathname + (params == null ? '' : '?' + $.param(params));
		$('a.fixurl').each(function (i, e) { $(e).attr('href', $(e).attr('data-href').replace('[url]', decodeURIComponent(url))); });
	}

	function update() {
		
		// Forberede nytt datasett
		$('#data-links').hide();
		$('#data tr').remove();
		$('#data, #page-next, #page-prev').hide();

		if ($('#dataset').val() == 'None')
			return;

		// Laste feltene
		if (_description == null)
			return $.getJSON(uri_datahotel_api + '/jsonp/' + $('#dataset').val() + '/fields?callback=?', function(data) { _description = data; update(); });

		// Opprette filter-feltene
		if (!_filter_loaded) {
			$.each(_description, function (i, field) {
				if (field.groupable)
					$('#data-filter-form').append($('<label>').text(field.name)).append($('<input>', {'type': 'text', 'id': 'filter-' + field.shortName, 'value': getParameterByName(field.shortName), 'data-field': field.shortName, 'data-name': field.name}));
			});
			_filter_loaded = true;
		}

		// Finne ut av spørringen
		_param = {};
		if ($('#data-page').text() != '1')
			_param['page'] = $('#data-page').text();
		if ($('#query').val() != '')
			_param['query'] = $('#query').val();

		// Detektere filter for spørring og presentasjon
		var filters = [];
		$('#data-filter input[type=text]').each(function (i, field) {
			if ($(field).val() != '') {
				_param[$(field).attr('data-field')] = $(field).val();
				filters.push($(field).attr('data-name') + ': ' + $(field).val());
			}
		});
		$('#filter-pp').text(filters.length == 0 ? 'Av' : filters.join(' | '));
		$('#filter-clear-span').toggle(filters.length != 0);

		// Laste data
		if (_data == null)
			return $.getJSON(uri_datahotel_api + '/jsonp/' + $('#dataset').val() + '?callback=?&' + $.param(_param), function(data) { _data = data; update(); });

		// Last inn overskrifter
		var tr = $('<tr>');
		$.each(_description, function (i, field) { tr.append($('<th>', {'title': field.description}).text(field.name)); })
		$('#data thead').append(tr);

		// Neste og forrige side
		$('#data-page').text(_data.page);
		$('#data-pages').text(_data.pages);
		if (_data.page > 1) $('#page-prev').show();
		if (_data.page < _data.pages) $('#page-next').show();

		// Oppdatere nedlastingslenker
		$('#data-links a.fix, #data-uris a').each(function(i, e) { $(e).attr('href', $(e).attr('data-href').replace('[dataset]', $('#dataset').val()).replace('[params]', $(_param).size() > 0 ? '?' + $.param(_param) : '')); });
		
		// Permanent lenke
		fixUrls(jQuery.extend({'dataset': $('#dataset').val()}, _param));

		// Vise dataene
		$.each(_data.entries, function (i, row) {
			var tr = $('<tr>');
			$.each(_description, function (i, field) { tr.append($('<td>').text(row[field.shortName])); })
			$('#data tbody').append(tr);
		});
		$('#data').show();
		$('#data-links').show();
	}

	$.getJSON(uri_datahotel_api + '/jsonp/_all?callback=?', function(data) {
		param = getParameterByName('dataset');
		var datasets = $('#dataset');
		$.each(data, function (i, dataset) {
			datasets.append($('<option>', { 'value': dataset.location }).text(dataset.name + ' (' + dataset.location + ')'));
		});
		datasets.children().sort(function (a,b) { return (a.innerHTML > b.innerHTML) ? 1 : -1; }).appendTo(datasets);
		datasets.prepend($('<option>', {value: 'None'}).text('Velg...'));

		if (param != null && $("#dataset option[value='" + param + "']").length == 0)
			datasets.prepend($('<option>', {value: param}).text('Skjult datasett: ' + param));
		if ($('#dataset option[selected=selected]').size() == 0)
			datasets.val(param == null ? 'None' : param);
		
		datasets.change(function () {
			_description = null;
			_data = null;
			_params = '';
			// _filter_loaded = false;
			$('#data-page').text('1');
			update();
		});

		update();
	});
});
