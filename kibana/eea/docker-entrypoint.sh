#!/bin/bash
set -e


export ELASTICSEARCH_HOSTS=${ELASTICSEARCH_HOSTS:-$ELASTICSEARCH_URL}
export ELASTICSEARCH_HOSTS=${ELASTICSEARCH_HOSTS:-'http://elastic:9200'}
export ELASTICSEARCH_USERNAME=${ELASTICSEARCH_USERNAME:-$KIBANA_RW_USERNAME}
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
exec "$@"
