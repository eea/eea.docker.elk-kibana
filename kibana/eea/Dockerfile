FROM docker.elastic.co/kibana/kibana:7.8.1
MAINTAINER michimau <mauro.michielon@eea.europa.eu>

USER root
ADD docker-entrypoint.sh /
#RUN chmod a+x /docker-entrypoint.sh

#RUN sed "s#Loading Elastic#European Environment Agency#g" -i /usr/share/kibana/src/core/server/rendering/views/template.js
#RUN sed 's#"Elastic"#"EEA"#g' -i /usr/share/kibana/src/core/server/rendering/views/template.js

ADD src/*.png /usr/share/kibana/src/core/server/core_app/assets/favicons/
ADD src/*.ico /usr/share/kibana/src/core/server/core_app/assets/favicons/
ADD src/*.svg /usr/share/kibana/src/core/server/core_app/assets/favicons/

USER kibana

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["/usr/local/bin/kibana-docker"]

