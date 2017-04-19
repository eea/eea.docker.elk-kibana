# Kibana Percent Metric Visualization

Kibana Visualization plugin for displaying a single ratio (percent) metric. Customize the numerator and denominator of the calculation.
Developed for kibana 4.
Based on [Tim Roes]'s awesome blog + examples.

### Example
![example image](https://raw.githubusercontent.com/outbrain/ob-kb-percent/master/docs/image1.png)

### Installation
#### Via Kibana CLI
`kibana plugin -i ob-kb-percent -u https://github.com/outbrain/ob-kb-percent/archive/master.zip`
#### Via Chef
```
git '/opt/kibana/installedPlugins/ob-kb-percent' do
  repository 'https://github.com/outbrain/ob-kb-percent.git'
  revision 'master'
end
```
### Usage
Once installed, you'll see an additional type of visualization, named "Percent View"
By default, no aggregations are added. Total hits are used for numerator and denominator, so the result is "Percent : 100.000%". 

To calculate a ratio (for example, error rate, Click Through Rate on a website, or any other ratio), first add an aggregation and then select the Numerator and Denominator in the Options tab.


   [Tim Roes]: <https://www.timroes.de/2015/12/02/writing-kibana-4-plugins-basics/>
 
