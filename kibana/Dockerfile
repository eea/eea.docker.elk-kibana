FROM ubuntu:16.10

MAINTAINER michimau <mauro.michielon@eea.europa.eu>

RUN apt-get -y update
RUN apt-get -y install vim npm git curl 

ENV KIBANA_VERSION 5.6.3

RUN git clone https://github.com/elastic/kibana.git \
    && cd kibana \
    && git checkout v$KIBANA_VERSION

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get -y install nodejs

RUN npm install bower
RUN echo '{ "allow_root": true }' > /root/.bowerrc

#in order to have search bar in embed mode, PR: https://github.com/elastic/kibana/pull/8947 - updated for 5.3.0
ADD src/kbn_chrome.js /kibana/src/ui/public/chrome/directives/kbn_chrome.js
ADD src/dashboard.html /kibana/src/core_plugins/kibana/public/dashboard/dashboard.html
ADD src/editor.html /kibana/src/core_plugins/kibana/public/visualize/editor/editor.html
ADD src/controls.js /kibana/src/ui/public/chrome/api/controls.js
ADD src/kbn_chrome.js /kibana/src/ui/public/chrome/directives/kbn_chrome.js
ADD src/kbn_top_nav.html /kibana/src/ui/public/kbn_top_nav/kbn_top_nav.html
ADD src/kbn_top_nav_controller.js /kibana/src/ui/public/kbn_top_nav/kbn_top_nav_controller.js
ADD src/share.js /kibana/src/ui/public/share/directives/share.js
ADD src/share.html /kibana/src/ui/public/share/views/share.html
ADD src/index.less /kibana/src/core_plugins/kibana/public/dashboard/styles/index.less

ADD src/logo_hack.txt /tmp/logo_hack.txt
RUN cat /tmp/logo_hack.txt >> /kibana/src/ui/views/chrome.jade

RUN cd kibana \
    && npm install

ENV PATH /kibana/bin:$PATH

ADD docker-entrypoint.sh /
RUN chmod a+x /docker-entrypoint.sh

EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/kibana/bin/kibana"]
