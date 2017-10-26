
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { TemplateVisTypeProvider } from 'ui/template_vis_type/template_vis_type';

define(function (require) {
  require('plugins/kibana-html-plugin/deps/ace-builds/ace.js');
  require('plugins/kibana-html-plugin/deps/ace-builds/mode-html.js');
  require('plugins/kibana-html-plugin/deps/ace-builds/theme-monokai.js');
  require('plugins/kibana-html-plugin/deps/angular-ui-ace/ui-ace.min.js');
  require('plugins/kibana-html-plugin/html.less');
  require('plugins/kibana-html-plugin/htmlController');
  
  VisTypesRegistryProvider.register(HtmlVisProvider);

  function HtmlVisProvider(Private) {
    require('ui/template_vis_type/template_vis_type');
    var TemplateVisType = Private(TemplateVisTypeProvider);

    return new TemplateVisType({
      name: 'html',
      title: 'Html widget',
      icon: 'fa-code',
      description: 'Useful for displaying html in dashboards.',
      template: require('plugins/kibana-html-plugin/html.html'),
      params: {
        editor: require('plugins/kibana-html-plugin/htmlOptions.html')
      },
      requiresSearch: false
    });
  }

  return HtmlVisProvider;
});
