FROM ruby:2.7.2

ARG DISCOURSE_VERSION

ENV RAILS_ENV=production \
    DEBIAN_VERSION=buster \
    DISCOURSE_DB_HOST=postgres \
    DISCOURSE_REDIS_HOST=redis \
    DISCOURSE_SERVE_STATIC_ASSETS=true \
    DISCOURSE_VERSION=${DISCOURSE_VERSION} \
    JEMALLOC_NEW=3.6.0 \
    JEMALLOC_STABLE=5.2.1 \
    PG_MAJOR=13 \
    NODE_MAJOR=14 \
    RUBY_GLOBAL_METHOD_CACHE_SIZE=131072 \
    RUBY_GC_HEAP_GROWTH_MAX_SLOTS=40000 \
    RUBY_GC_HEAP_INIT_SLOTS=400000 \
    RUBY_GC_HEAP_OLDOBJECT_LIMIT_FACTOR=1.5 \
    RUBY_GC_MALLOC_LIMIT=90000000 \
    BUILD_DEPS="\
      autoconf \
      advancecomp \
      libbz2-dev \
      libfreetype6-dev \
      libjpeg-dev \
      libjpeg-turbo-progs \
      libtiff-dev \
      pkg-config"

COPY docker/deploy/base/install /tmp/install

RUN ls /tmp/ && ls /tmp/install

RUN curl http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add - \
 && echo "deb http://apt.postgresql.org/pub/repos/apt/ ${DEBIAN_VERSION}-pgdg main" | \
        tee /etc/apt/sources.list.d/postgres.list \
 && curl --silent --location https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - \
 && apt-get update && apt-get install -y --no-install-recommends \
      ${BUILD_DEPS} \
      ca-certificates \
      brotli \
      ghostscript \
      gsfonts \
      jpegoptim \
      liblqr-1-0 \
      libxml2 \
      nodejs \
      optipng \
      jhead \
      pngcrush \
      pngquant \
      postgresql-client-${PG_MAJOR} \
      postgresql-contrib-${PG_MAJOR} libpq-dev libreadline-dev
RUN npm install svgo uglify-js -g \
 && mkdir /jemalloc-stable && cd /jemalloc-stable &&\
      wget https://github.com/jemalloc/jemalloc/releases/download/${JEMALLOC_STABLE}/jemalloc-${JEMALLOC_STABLE}.tar.bz2 &&\
      tar -xjf jemalloc-${JEMALLOC_STABLE}.tar.bz2 && cd jemalloc-${JEMALLOC_STABLE} && ./configure --prefix=/usr && make && make install &&\
      cd / && rm -rf /jemalloc-stable \
 && mkdir /jemalloc-new && cd /jemalloc-new &&\
      wget https://github.com/jemalloc/jemalloc/releases/download/${JEMALLOC_NEW}/jemalloc-${JEMALLOC_NEW}.tar.bz2 &&\
      tar -xjf jemalloc-${JEMALLOC_NEW}.tar.bz2 && cd jemalloc-${JEMALLOC_NEW} && ./configure --prefix=/usr --with-install-suffix=${JEMALLOC_NEW} && make build_lib && make install_lib &&\
      cd / && rm -rf /jemalloc-new \
 && gem update --system \
 && gem install bundler --force \
 && rm -rf /usr/local/share/ri/${RUBY_VERSION}/system \

RUN /tmp/install/imagemagick \
 # Validate install
 && ruby -Eutf-8 -e "v = \`convert -version\`; %w{png tiff jpeg freetype}.each { |f| unless v.include?(f); STDERR.puts('no ' + f +  ' support in imagemagick'); exit(-1); end }" \
 && addgroup --gid 1000 discourse \
 && adduser --system --uid 1000 --ingroup discourse --shell /bin/bash discourse
