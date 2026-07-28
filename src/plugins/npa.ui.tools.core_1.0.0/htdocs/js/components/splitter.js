/*
 * splitter.js - NPA UI Tools Core component framework's Splitter component
 * Copyright 2024 Nicolas Renaudet - All rights reserved
 *
 * Configuration:
 *   vertical    {boolean} false (default) = side-by-side columns,
 *                                  true  = top/bottom rows
 *   percentages {number[2]} initial size of each pane as a percentage of the
 *                           container, e.g. [30, 70]. Must sum to 100.
 *                           Defaults to [50, 50].
 *
 * Child DIV slots (same pattern as TabPane):
 *   Place two child <div> elements inside the host div, each carrying a
 *   data-splitter-target attribute set to "first" or "second":
 *
 *     <div class="npaUi" id="mySplitter">
 *       <div data-splitter-target="first">
 *         <div class="npaUi" data-config="/path/to/leftComponent.json"></div>
 *       </div>
 *       <div data-splitter-target="second">
 *         <div class="npaUi" data-config="/path/to/rightComponent.json"></div>
 *       </div>
 *     </div>
 *
 *   npaUi.render() is called on the host namespace after both panes are
 *   attached so that any npaUi sub-components inside them are initialized.
 */

npaUiCore.Splitter = class Splitter extends NpaUiComponent {

	initialize(then) {
		$.loadCss('/uiTools/css/splitter.css', then);
	}

	render(then) {
		if (this.parentDiv().data('loaded') == 'true') {
			then();
			return;
		}

		let config = this.getConfiguration();
		let isVertical = config.vertical === true;

		// Resolve initial percentages — default 50/50
		let pct = [50, 50];
		if (Array.isArray(config.percentages) &&
		    config.percentages.length === 2 &&
		    typeof config.percentages[0] === 'number' &&
		    typeof config.percentages[1] === 'number') {
			pct = config.percentages;
		}

		// Detect the namespace from the host div's first CSS class (same trick as TabPane)
		let classList = this.parentDiv().attr('class').split(/\s+/);
		let namespace = (classList && classList.length > 0) ? classList[0] : 'npaUi';

		// Detach child content divs before replacing innerHTML
		let slots = {};
		$('#' + this.parentDivId + ' > div').each(function () {
			let target = $(this).data('splitter-target');
			if (typeof target !== 'undefined' && target !== null && target.length > 0) {
				console.log('Splitter: detaching child DIV with splitter-target: ' + target);
				slots[target] = $(this).detach();
			}
		});

		let splitterId  = this.getId();
		let firstId     = splitterId + '_first';
		let secondId    = splitterId + '_second';
		let resizerId   = splitterId + '_resizer';

		// Build structure — use flex-grow proportional to percentages so the
		// resizer's fixed size (5px) is automatically subtracted from the
		// available space, avoiding any overflow from pct[0]+pct[1]==100%.
		let html = '';
		html += '<div id="' + splitterId + '_container" class="npa-splitter' + (isVertical ? ' vertical' : '') + '">';
		html += '  <div id="' + firstId  + '" class="npa-splitter-pane" style="flex:' + pct[0] + '"></div>';
		html += '  <div id="' + resizerId + '" class="npa-splitter-resizer"></div>';
		html += '  <div id="' + secondId + '" class="npa-splitter-pane" style="flex:' + pct[1] + '"></div>';
		html += '</div>';
		this.parentDiv().html(html);

		// Re-attach child content into the right pane
		if (slots['first'])  { $('#' + firstId).append(slots['first']); }
		if (slots['second']) { $('#' + secondId).append(slots['second']); }

		// Trigger npaUi render for any sub-components in the panes
		setTimeout(function () { npaUi.render(namespace); }, 100);

		// Wire up drag-to-resize
		this._initResizer(splitterId, firstId, secondId, resizerId, isVertical);

		then();
	}

	_initResizer(splitterId, firstId, secondId, resizerId, isVertical) {
		let container = document.getElementById(splitterId + '_container');
		let firstPane  = document.getElementById(firstId);
		let secondPane = document.getElementById(secondId);
		let resizer    = document.getElementById(resizerId);

		if (!container || !firstPane || !secondPane || !resizer) return;

		let dragging   = false;
		let startPos   = 0;
		let startFirst = 0;
		let startSecond = 0;

		resizer.addEventListener('mousedown', function (e) {
			dragging    = true;
			startPos    = isVertical ? e.clientY : e.clientX;
			startFirst  = isVertical ? firstPane.offsetHeight  : firstPane.offsetWidth;
			startSecond = isVertical ? secondPane.offsetHeight : secondPane.offsetWidth;
			resizer.classList.add('active');
			// Prevent text selection while dragging
			document.body.style.userSelect = 'none';
			e.preventDefault();
		});

		document.addEventListener('mousemove', function (e) {
			if (!dragging) return;
			let delta    = (isVertical ? e.clientY : e.clientX) - startPos;
			let total    = isVertical ? container.offsetHeight : container.offsetWidth;
			// subtract resizer thickness from total available space
			let resizerSize = isVertical ? resizer.offsetHeight : resizer.offsetWidth;
			let available   = total - resizerSize;
			if (available <= 0) return;

			let newFirst  = startFirst  + delta;
			let newSecond = startSecond - delta;

			// Clamp to a minimum of 1% of total so a pane never fully disappears
			let minPx = Math.max(1, Math.round(available * 0.01));
			if (newFirst  < minPx) { newFirst  = minPx; newSecond = available - minPx; }
			if (newSecond < minPx) { newSecond = minPx; newFirst  = available - minPx; }

			// Use flex values (unitless ratio) so the resizer's fixed size is
			// automatically excluded from the distribution — no overflow.
			firstPane.style.flex  = newFirst.toFixed(2);
			secondPane.style.flex = newSecond.toFixed(2);
		});

		document.addEventListener('mouseup', function () {
			if (!dragging) return;
			dragging = false;
			resizer.classList.remove('active');
			document.body.style.userSelect = '';
		});
	}
}
