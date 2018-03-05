import 'plugins/kibana-html-plugin/html.less';

import mainTemplate from 'plugins/kibana-html-plugin/html.html';
import optionsTemplate from 'plugins/kibana-html-plugin/htmlOptions.html';


import 'plugins/kibana-html-plugin/htmlController.js';

import {CATEGORY} from 'ui/vis/vis_category';
import {VisFactoryProvider} from 'ui/vis/vis_factory';
import {VisTypesRegistryProvider} from 'ui/registry/vis_types';
import {VisSchemasProvider} from 'ui/vis/editors/default/schemas';

function HtmlVisProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);
  const Schemas = Private(VisSchemasProvider);

  return VisFactory.createAngularVisualization({
      name: 'html',
      title: 'Html widget',
      icon: 'fa-code',
      description: 'Useful for displaying html in dashboards.',
      category: CATEGORY.OTHER,
    //visualization: VisController,

    visConfig: {
      defaults: {},
      template: mainTemplate
    },
    editorConfig: {
      optionsTemplate: optionsTemplate,
      schemas: new Schemas([{
        group: 'metrics',
        name: 'metric',
        title: 'Metric',
        min: 1,
        aggFilter: ['!derivative', '!geo_centroid']
      }]),
    }
  });
}
VisTypesRegistryProvider.register(HtmlVisProvider);
