//@ts-nocheck
// Adapted from https://github.com/zesik/react-splitter-layout

export function clearSelection() {
	if (document.body.createTextRange) {
		// https://github.com/zesik/react-splitter-layout/issues/16
		// https://stackoverflow.com/questions/22914075/#37580789
		const range = document.body.createTextRange();
		range.collapse();
		range.select();
	} else if (window.getSelection) {
		if (window.getSelection().empty) {
			window.getSelection().empty();
		} else if (window.getSelection().removeAllRanges) {
			window.getSelection().removeAllRanges();
		}
	} else if (document.selection) {
		document.selection.empty();
	}
}

export default clearSelection;