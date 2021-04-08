#!/bin/bash
set -e


export ELASTICSEARCH_HOSTS=${ELASTICSEARCH_HOSTS:-$ELASTICSEARCH_URL}
export ELASTICSEARCH_HOSTS=${ELASTICSEARCH_HOSTS:-'http://elastic:9200'}
export ELASTICSEARCH_USERNAME=${ELASTICSEARCH_USERNAME:-$KIBANA_RW_USERNAME}
export ELASTICSEARCH_USERNAME=${ELASTICSEARCH_USERNAME:-'kibana_system'}
export ELASTICSEARCH_PASSWORD=${ELASTICSEARCH_PASSWORD:-$KIBANA_RW_PASSWORD}

export ELASTICSEARCH_SSL_VERIFICATIONMONDE=${ELASTICSEARCH_SSL_VERIFICATIONMONDE:-none}

if [[ "$ENABLE_SSL" == "YES" ]] || [[ "$SERVER_SSL_ENABLED" == "true" ]]
then
  export SERVER_SSL_ENABLED='true'
  export SERVER_SSL_KEY=${SERVER_SSL_KEY:-'/var/ssl/server.key'}
  export SERVER_SSL_CERTIFICATE=${SERVER_SSL_CERTIFICATE:-'/var/ssl/server.crt'}
  
  mkdir -p /var/ssl
  rm -f /var/ssl/*
  echo "creating ssl certificates"

  cat /ssl/server.crt > /var/ssl/server.crt  
  cat /ssl/server.key > /var/ssl/server.key

  if [ -f /ssl/server-chain.crt ]; then
    cat /ssl/server-chain.crt > /var/ssl/server-chain.crt
    export SERVER_SSL_CERTIFICATE_AUTHORITIES=${SERVER_SSL_CERTIFICATE_AUTHORITIES:-'/var/ssl/server-chain.crt'}
  fi

  chmod 400 /var/ssl/*

fi

file=/usr/share/kibana/src/core/server/rendering/views/template.js

sed "s#Loading Elastic#European Environment Agency#g" -i $file

sed 's#"Elastic"#"EEA"#g' -i $file

const_logo=$(sed -n '/const logo/=' $file)
tail -n +$const_logo $file > template_tail_tmp

const_logo=$(($const_logo-1))
head -n +$const_logo $file > template_head

comma=$(sed -n '/;/=' template_tail_tmp | head -n 1)
comma=$(($comma+1))
tail -n +$comma template_tail_tmp > template_tail

cat template_head > $file
echo "const logo = _react.default.createElement(\"img\", {src:'https://raw.githubusercontent.com/eea/eea.docker.elk-kibana/7.8.1/kibana/eea/src/app.ico',width:'80px'});" >> $file
cat template_tail >> $file


exec "$@"
