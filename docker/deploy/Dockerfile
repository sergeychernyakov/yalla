FROM 330375354568.dkr.ecr.me-south-1.amazonaws.com/yalla-base:discourse_base

COPY docker/deploy/install /tmp/install

RUN cd /home/discourse \
 && mkdir -p tmp/pids \
 && mkdir -p ./tmp/sockets \
 && mkdir -p /home/discourse/discourse

COPY --chown=discourse . /home/discourse/discourse

RUN cd /home/discourse \
 && chown -R discourse:discourse . \
 && cd /home/discourse/discourse \
 && sed -i 's/daemonize true/daemonize false/g' ./config/puma.rb \
 && sed -i "s/msgpack (1.4.1)/msgpack (1.4.2)/" Gemfile.lock \
 && bundle config build.nokogiri --use-system-libraries \
 && bundle install --deployment --verbose --without test --without development --retry 3 --jobs 4 \
 && find /home/discourse/discourse/vendor/bundle -name tmp -type d -exec rm -rf {} + \

 && rm -rf /var/lib/apt/lists/*

RUN cd /home/discourse/discourse/plugins \
 && for plugin in $(cat /tmp/install/plugin-list); do \
      git clone $plugin; \
    done \
 && chown -R discourse:discourse .

WORKDIR /home/discourse/discourse

USER discourse

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
