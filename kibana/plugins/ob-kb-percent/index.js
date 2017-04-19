module.exports = function(kibana) {
	return new kibana.Plugin({
		uiExports: {
			visTypes: ['plugins/ob-kb-percent/ob-kb-percent']
		}
	});
};